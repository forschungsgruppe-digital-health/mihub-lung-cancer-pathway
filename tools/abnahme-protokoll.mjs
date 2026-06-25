#!/usr/bin/env node
/**
 * Abnahme protocol pre-filler (evidence preparer — NEVER an approver).
 *
 * Runs the automatable (method "A") conformance checks and emits a pre-filled
 * Abnahme Protokoll (docs/governance/abnahme-protokoll-bpmn-patientenpfad.md shape):
 *   - the A-rows it can decide are ticked with the tool evidence,
 *   - every review (R) / consensus (K) row, and any A-criterion whose tool is not yet
 *     available (STR-1..4 soundness), is stamped HUMAN-INPUT-NEEDED,
 *   - it reports the automatable part of the Technical gate,
 *   - it NEVER stamps the Clinical/Pragmatic gates or the overall decision — those are
 *     human (see docs/governance/).
 *
 * Usage:  node tools/abnahme-protokoll.mjs            # print to stdout
 *         node tools/abnahme-protokoll.mjs > protokoll.md
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

function run(args) {
  const r = spawnSync(process.execPath, args, { encoding: 'utf8' });
  const out = `${r.stdout || ''}${r.stderr || ''}`;
  const summary = out.trim().split('\n').filter(Boolean).pop() || '';
  return { pass: (r.status ?? 1) === 0, summary: summary.replace(/\s+/g, ' ').trim() };
}
const git = (args) => {
  const r = spawnSync('git', args, { encoding: 'utf8' });
  return (r.status === 0 ? r.stdout : '').trim();
};

const lint = run(['tools/lint-bpmn.mjs']);
const metrics = run(['tools/check-model-metrics.mjs']);
const roundtrip = run(['tools/moddle-roundtrip.mjs']);

const commit = git(['rev-parse', '--short', 'HEAD']) || '(unknown)';
const version = existsSync('version.txt') ? readFileSync('version.txt', 'utf8').trim() : '(unset)';
const date = new Date().toISOString().slice(0, 10);

const yn = (ok) => (ok ? '☑ ✓' : '☐ ✗');
const H = 'HUMAN-INPUT-NEEDED';

const md = `# Abnahmeprotokoll (vorausgefüllt — Tool-Evidenz) — BPMN-Lungenkrebspatientenpfad

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
| Kriteriengrundlage | Abnahme-Instrument v0.3.1 |

## 1. Prüfergebnisse

**Codes:** ✓ erfüllt · ✗ nicht erfüllt · ${H} = menschliche Prüfung nötig. **Methode:** A=Tool, R=Review, K=Konsens.

### A · Technisch (automatisierbar)

| ID | Kriterium | M/S | Methode | Ergebnis | Beleg (Tool) |
|---|---|---|---|---|---|
| SYN-1 | Conformance-Klasse deklariert & eingehalten | M | A | ☑ ✓ (deklariert) | Analytic, ADR-0001; Einhaltung via SYN-5/bpmnlint |
| SYN-2 | Genau ein Start-/ein End-Event je Ebene | M | A/R | ${H} | metrics meldet Abweichungen als Hinweis — Review nötig |
| SYN-3 | Verb-Objekt-Labels | S | R | ${H} | nicht automatisierbar |
| SYN-4 | ≤ 50 Symbole / dekomponiert | S | A | ${H} | metrics meldet Überschreitungen als Hinweis — Review |
| SYN-5 | Gepaarte Verzweigungen, **kein OR** | S | A/R | ${yn(metrics.pass)} | ${metrics.summary || 'metrics'} |
| STR-1 | Jeder Durchlauf erreicht das Ende | M | A | ${H} | Soundness-Tool noch nicht integriert (Phase-4-Folgearbeit) |
| STR-2 | Keine offenen Parallelzweige am Ende | M | A | ${H} | dito |
| STR-3 | Keine toten/unerreichbaren Aktivitäten | M | A | ${H} | dito (bpmnlint deckt nur Teilhygiene ab) |
| STR-4 | Kein Deadlock/Livelock | M | A | ${H} | dito |
| — | (Stütze) bpmnlint Strukturkorrektheit | — | A | ${yn(lint.pass)} | ${lint.summary || 'bpmnlint'} |
| — | (Stütze) cp:/i18n Roundtrip verlustfrei | — | A | ${yn(roundtrip.pass)} | ${roundtrip.summary || 'roundtrip'} |

### B · Klinisch (Inhaltsvalidität)

| ID | Kriterium | M/S | Methode | Ergebnis |
|---|---|---|---|---|
| SEM-1 | Multidisziplinär (Disziplinen als Lane) | M | R | ${H} |
| SEM-2 | Leitlinien-/Evidenzbezug | S* | R | ${H} |
| SEM-3 | Wesentliche Schritte vollständig | S* | R | ${H} |
| SEM-4 | Übergänge an Fristen/Kriterien | S* | R | ${H} |
| SEM-5 | Zielpopulation/Standardisierung | S* | R | ${H} |
| SEM-6 | Face Validity (Konsens) | M | K | ${H} |
| SEM-7 | Domänen-Artefakte erfasst | S | R | ${H} |

### C · Pragmatisch (gemeinsam)

| ID | Kriterium | M/S | Methode | Ergebnis |
|---|---|---|---|---|
| PRA-1 | Beide Seiten verstehen das Modell gleich | M | R | ${H} |
| PRA-2 | Übersichts- und Detailsicht vorhanden | S | R | ${H} |
| PRA-3 | Keine überflüssigen Elemente | S | R | ${H} |

## 2. Gate-Auswertung

| Gate | Bedingung | Tool-Teil | Verbleibend |
|---|---|---|---|
| Technisch | SYN-1, SYN-2, STR-1…4 (alle Muss) | SYN-5 ${metrics.pass ? '✓' : '✗'}, bpmnlint ${lint.pass ? '✓' : '✗'}, roundtrip ${roundtrip.pass ? '✓' : '✗'} | **STR-1…4 + SYN-2 menschlich/Tool ausstehend** |
| Klinisch | Kinsman-Gate **und** SEM-6 | — | **vollständig menschlich** |
| Pragmatisch | PRA-1 | — | **menschlich** |

## 3. Gesamtentscheidung

**${H}** — wird ausschließlich von den menschlichen Leads im Abnahmetermin getroffen
und unterschrieben (siehe Template §4/§5). Dieses Dokument liefert nur Tool-Evidenz.
`;

process.stdout.write(md);
// Non-zero exit mirrors the automatable technical signal, so CI can surface it.
process.exit(lint.pass && metrics.pass && roundtrip.pass ? 0 : 1);
