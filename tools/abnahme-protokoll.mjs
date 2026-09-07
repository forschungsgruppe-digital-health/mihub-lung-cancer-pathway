#!/usr/bin/env node
/**
 * Abnahmetest protocol pre-filler (evidence preparer — NEVER an approver).
 *
 * Runs the automatable (method "A") conformance checks and emits a pre-filled
 * Abnahmetest Protokoll (docs/governance/abnahme-protokoll-bpmn-patientenpfad.md shape —
 * the §1 tables carry that template's columns: ID | Kriterium | M/S | Methode | Ergebnis |
 * Beleg / Bemerkung):
 *   - the A-rows it can decide are ticked with the tool evidence,
 *   - every review (R) / consensus (K) row, and the STR-1..4 soundness rows, is stamped
 *     HUMAN-INPUT-NEEDED — the soundness tool exists (`npm run check:soundness`, advisory,
 *     ADR-0003) but its verdict is NOT imported here (INCONCLUSIVE is not a pass),
 *   - it reports the automatable part of the Technical gate,
 *   - it NEVER stamps the Clinical/Pragmatic gates or the overall decision — those are
 *     human (see docs/governance/).
 *
 * The instrument version is read from the `version:` front-matter field of
 * docs/governance/abnahme-checkliste-bpmn-patientenpfad.md ("(unknown)" if unreadable), so
 * the protocol never cites a stale instrument version. All paths are resolved from the
 * repository (the parent of tools/), so the tool works from any cwd.
 *
 * Usage:  node tools/abnahme-protokoll.mjs            # print to stdout
 *         node tools/abnahme-protokoll.mjs > protokoll.md
 * Exit: 0 = all automatable A-checks green, 1 = at least one A-check red (the protocol is still printed to stdout).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repository root — the parent of tools/ — independent of the current working directory. */
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INSTRUMENT = join(REPO_ROOT, 'docs', 'governance', 'abnahme-checkliste-bpmn-patientenpfad.md');

/** Run a sibling tool from the repo root; the last non-empty output line is its summary. */
function run(script) {
  const r = spawnSync(process.execPath, [join(REPO_ROOT, 'tools', script)], { cwd: REPO_ROOT, encoding: 'utf8' });
  const out = `${r.stdout || ''}${r.stderr || ''}`;
  const summary = out.trim().split('\n').filter(Boolean).pop() || '';
  return { pass: (r.status ?? 1) === 0, summary: summary.replace(/\s+/g, ' ').trim() };
}
const git = (args) => {
  const r = spawnSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' });
  return (r.status === 0 ? r.stdout : '').trim();
};

/** `version:` from the instrument's YAML front matter (the block between the first `---` pair). */
function instrumentVersion() {
  try {
    const text = readFileSync(INSTRUMENT, 'utf8');
    const frontMatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/m);
    const m = (frontMatter ? frontMatter[1] : '').match(/^version:\s*["']?([^"'\r\n]+?)["']?\s*$/m);
    return m ? m[1].trim() : '(unknown)';
  } catch {
    return '(unknown)';
  }
}

const lint = run('lint-bpmn.mjs');
const metrics = run('check-model-metrics.mjs');
const roundtrip = run('moddle-roundtrip.mjs');

const commit = git(['rev-parse', '--short', 'HEAD']) || '(unknown)';
// Model version = version.txt (release-please's file — may lag on dev between releases) PLUS the
// git describe (nearest tag + distance + short SHA, `-dirty` on an unclean tree), so the protocol
// shows where the checked-out tree really stands. Either part may be missing; degrade gracefully.
const versionPath = join(REPO_ROOT, 'version.txt');
const versionFile = existsSync(versionPath) ? readFileSync(versionPath, 'utf8').trim() : '';
const describe = git(['describe', '--tags', '--always', '--dirty']);
const version = `${versionFile || '(unset)'}${describe ? ` (git: ${describe})` : ''}`;
const instrument = instrumentVersion();
const date = new Date().toISOString().slice(0, 10);

const yn = (ok) => (ok ? '☑ ✓' : '☐ ✗');
const mark = (ok) => (ok ? '✓' : '✗');
const H = 'HUMAN-INPUT-NEEDED';

const md = `# Abnahmetestprotokoll (vorausgefüllt — Tool-Evidenz) — BPMN-Lungenkrebspatientenpfad

> Auto-generiert von \`tools/abnahme-protokoll.mjs\` am ${date}. **Dies ist KEINE Freigabe.**
> Nur die automatisierbaren (A)-Kriterien sind tool-vorbefüllt; R/K-Kriterien, die drei
> Gates und die Gesamtentscheidung bleiben menschlich (siehe \`docs/governance/\`).
> Maßgebliches Protokoll-Template: \`docs/governance/abnahme-protokoll-bpmn-patientenpfad.md\`.

## 0. Rahmendaten

| Feld | Eintrag |
|---|---|
| Pfad / Modellname | mihub-lung-cancer-pathway (alle Modelle) |
| Modellversion | ${version} |
| Commit | ${commit} |
| Ziel-Conformance-Klasse | Analytic (ohne OR-Gateways) — ADR-0001 |
| Datum (Vorbefüllung) | ${date} |
| Kriteriengrundlage | Abnahmetest-Instrument v${instrument} |

## 1. Prüfergebnisse

**Codes:** ✓ erfüllt · ✗ nicht erfüllt · ${H} = menschliche Prüfung nötig. **Methode:** A=Tool, R=Review, K=Konsens.

### A · Technisch (automatisierbar)

| ID | Kriterium | M/S | Methode | Ergebnis | Beleg / Bemerkung |
|---|---|---|---|---|---|
| SYN-1 | Conformance-Klasse deklariert & eingehalten | M | A | ${yn(metrics.pass)} | deklariert ✓ (Analytic, ADR-0001) · eingehalten ${mark(metrics.pass)} (siehe SYN-5: ${metrics.summary || 'metrics'}) |
| SYN-2 | Genau ein Start-/ein End-Event je Ebene | M | A/R | ${H} | metrics meldet Abweichungen als Hinweis — Review nötig |
| SYN-3 | Verb-Objekt-Labels | S | R | ${H} | nicht automatisierbar |
| SYN-4 | ≤ 50 Symbole / dekomponiert | S | A | ${H} | metrics meldet Überschreitungen als Hinweis — Review |
| SYN-5 | Gepaarte Verzweigungen, **kein OR** | S | A/R | ${yn(metrics.pass)} | ${metrics.summary || 'metrics'} |
| STR-1 | Jeder Durchlauf erreicht das Ende | M | A | ${H} | Soundness-Tool vorhanden (\`npm run check:soundness\`, advisory, ADR-0003) — Ergebnis wird nicht automatisch übernommen; INCONCLUSIVE ≠ bestanden |
| STR-2 | Keine offenen Parallelzweige am Ende | M | A | ${H} | dito |
| STR-3 | Keine toten/unerreichbaren Aktivitäten | M | A | ${H} | dito (bpmnlint deckt nur Teilhygiene ab) |
| STR-4 | Kein Deadlock/Livelock | M | A | ${H} | dito |
| — | (Stütze) bpmnlint Strukturkorrektheit | — | A | ${yn(lint.pass)} | ${lint.summary || 'bpmnlint'} |
| — | (Stütze) BPMN4CP/i18n Roundtrip verlustfrei | — | A | ${yn(roundtrip.pass)} | ${roundtrip.summary || 'roundtrip'} |

### B · Klinisch (Inhaltsvalidität)

| ID | Kriterium | M/S | Methode | Ergebnis | Beleg / Bemerkung |
|---|---|---|---|---|---|
| SEM-1 | Multidisziplinär (Disziplinen als Lane) | M | R | ${H} | Review — Beleg im Abnahmetesttermin eintragen (metrics meldet fehlende Lanes nur als Hinweis) |
| SEM-2 | Leitlinien-/Evidenzbezug | S* | R | ${H} | Review — Beleg im Abnahmetesttermin eintragen |
| SEM-3 | Wesentliche Schritte vollständig | S* | R | ${H} | Review — Beleg im Abnahmetesttermin eintragen |
| SEM-4 | Übergänge an Fristen/Kriterien | S* | R | ${H} | Review — Beleg im Abnahmetesttermin eintragen |
| SEM-5 | Zielpopulation/Standardisierung | S* | R | ${H} | Review — Beleg im Abnahmetesttermin eintragen |
| SEM-6 | Face Validity (Konsens) | M | K | ${H} | Konsens — Protokoll der klinischen Validierungssitzung(en) beilegen |
| SEM-7 | Domänen-Artefakte erfasst | S | R | ${H} | Review — Beleg im Abnahmetesttermin eintragen |

### C · Pragmatisch (gemeinsam)

| ID | Kriterium | M/S | Methode | Ergebnis | Beleg / Bemerkung |
|---|---|---|---|---|---|
| PRA-1 | Beide Seiten verstehen das Modell gleich | M | R | ${H} | Review — gemeinsamer Walkthrough im Abnahmetesttermin |
| PRA-2 | Übersichts- und Detailsicht vorhanden | S | R | ${H} | Review — gemeinsamer Walkthrough im Abnahmetesttermin |
| PRA-3 | Keine überflüssigen Elemente | S | R | ${H} | Review — gemeinsamer Walkthrough im Abnahmetesttermin |

## 2. Gate-Auswertung

| Gate | Bedingung | Tool-Teil | Verbleibend |
|---|---|---|---|
| Technisch | SYN-1, SYN-2, STR-1…4 (alle Muss) | SYN-1 (eingehalten) ${mark(metrics.pass)}, SYN-5 ${mark(metrics.pass)}, bpmnlint ${mark(lint.pass)}, roundtrip ${mark(roundtrip.pass)} | **STR-1…4 (Soundness-Tool advisory — Verdikt manuell übernehmen, INCONCLUSIVE ≠ bestanden) + SYN-2 menschlich ausstehend** |
| Klinisch | Kinsman-Gate **und** SEM-6 | — | **vollständig menschlich** |
| Pragmatisch | PRA-1 | — | **menschlich** |

## 3. Gesamtentscheidung

**${H}** — wird ausschließlich von den menschlichen Leads im Abnahmetesttermin getroffen
und unterschrieben (siehe Template §4/§5). Dieses Dokument liefert nur Tool-Evidenz.
`;

process.stdout.write(md);
// Non-zero exit mirrors the automatable technical signal, so CI can surface it.
process.exit(lint.pass && metrics.pass && roundtrip.pass ? 0 : 1);
