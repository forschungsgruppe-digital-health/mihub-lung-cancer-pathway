# AI Usage Disclosure · KI-Nutzungs-Disklosure

> **English summary.** This repository uses AI coding agents (Anthropic Claude via Claude Code)
> for **tooling, documentation, translations, audits and issue drafting** — never for the
> clinical content. The **BPMN pathway models (`models/*.bpmn`, `*.svg`) are authored and
> changed exclusively by human modellers**; agents are technically prevented from editing them
> (`.claude/hooks/guard-model-files.sh`) and report findings instead (`docs/model-issues/`,
> GitHub issues). Every AI-assisted commit carries a machine-readable
> `Co-Authored-By: Claude … <noreply@anthropic.com>` trailer; every AI-drafted pull request or
> issue ends with a "🤖 Generated with Claude Code" footer. A human (the maintainer) reviews and
> merges every change; acceptance-test verdicts, clinical face validity, legal texts and
> releases are human decisions. Structure and terminology follow the disclosure convention of
> the sibling FGDH repositories (EU AI Act Art. 50, COPE, ICMJE, Linux-kernel commit-trailer
> practice). The German text below is the binding version.

> **Vorlage gemäß:** EU AI Act, Art. 50 (Verordnung (EU) 2024/1689) · EU Code of Practice on
> Transparency of AI-Generated Content (Draft, 2026) · COPE: Authorship and AI Tools (2024) ·
> ICMJE Recommendations · Linux Kernel AI Policy (2025) · Red Hat OSS AI Policy (2025).
> Pflichtfelder gemäß Art. 50 EU AI Act sind mit `[EU AI Act §]` markiert, COPE-relevante Felder
> mit `[COPE]`, empfohlene Felder (Community Standard) mit `[CS]`.

> ℹ️ **Pflege-Hinweis:** Diese Datei ist die zentrale, repository-weite KI-Nutzungs-Disklosure.
> Sie ist bei jedem Trigger-Ereignis zu aktualisieren — neues KI-Werkzeug oder neue
> Modellversion, neue Sub-Agenten/Skills, Wechsel der verantwortlichen Person, neue
> Artefakt-Klasse mit KI-Beteiligung — spätestens jedoch mit dem nächsten Release (siehe
> Changelog § 9). Agenten, die dieses Repository bearbeiten, sind durch `AGENTS.md`
> verpflichtet, die Datei mitzuführen. Sie ist Teil des Release-Archivs und damit des
> Zenodo-Deposits.

## 1. Überblick

**Zweck dieser Datei:** Sie dokumentiert Art, Umfang und Verantwortlichkeit der KI-Nutzung in
diesem Repository für Beitragende, Reviewer:innen, Nutzer:innen der Modelle und Dritte, die die
Entstehung der Artefakte nachvollziehen möchten.

- **Verantwortliche Person (Human Oversight):** Marcel Susky, Forschungsgruppe Digital Health
  (FGDH), Technische Universität Dresden — `marcel.susky@tu-dresden.de`
- **Institution:** Forschungsgruppe Digital Health, TU Dresden — `digital-health@tu-dresden.de`
- **Letzte Aktualisierung:** 2026-09-05
- **Geltungsbereich:** Repository `mihub-lung-cancer-pathway` — BPMN-2.0-Modelle des
  Lungenkrebs-Patientenpfads (übergreifender Pfad + Teilpfade), das Abnahmetest-Instrument
  (`docs/governance/`), die Konformitäts-/Soundness-Werkzeuge (`tools/`, `.github/`), die
  Agenten-Skills (`skills/`) und die Repository-Dokumentation. Projekt MiHUB (BMFTR), in
  Zusammenarbeit mit CAEHR.

## 2. Nutzungsübersicht [EU AI Act §50 Abs. 2 | CS]

| Artefakttyp | KI-Einsatz | Werkzeug / Modell | Scope | Menschliche Überprüfung |
|---|---|---|---|---|
| **BPMN-Modelle** (`models/*.bpmn`) und **SVG-Exporte** (`models/*.svg`) | **None** | — | Modellierung ausschließlich durch menschliche Modellierer:innen der FGDH in einem BPMN-Editor (bpmn.io / Camunda Modeler), auf Basis von Leitlinien (S3-Leitlinie Lungenkarzinom), Workshops und klinischer Expertise. Agenten dürfen Modelle **nicht** bearbeiten (harte Regel in `AGENTS.md`, technisch erzwungen durch den `guard-model-files`-Hook). Die sechs KI-attribuierten Commits, die `models/` berühren, sind Verschiebungen/Umbenennungen (ADR-0004), Merges, die den Modellinhalt byte-gleich erhalten, das Einbringen menschlich erstellter Modelldateien oder Änderungen an `models/README.md` — nachprüfbar mit `git log -p -- models/`. | Modellinhalt: Modellierer:innen + klinische Expert:innen (Abnahmetest SEM-6 Face Validity, PRA-1 Walkthrough — nie KI) |
| **Abnahmetest-Instrument, DE-Originale** (`docs/governance/*.md`) | **Assisted** (Formatierung, Terminologie-Umstellung „Abnahme → Abnahmetest“, Versions-/Zitier-Metadaten) | Claude Code | Inhaltliche Kriterien (SYN/STR/SEM/PRA) von den Autor:innen (Susky, Scheel, Schlieter) entwickelt; KI nur für redaktionelle Pflege | Autor:innen / Maintainer |
| **Abnahmetest-Instrument, EN-Übersetzungen** (`docs/governance/*.en.md`) | **Generated** (Übersetzung) | Claude Code (Opus 4.8) | Vollständige Übersetzung der deutschen Originale (2026-06-25); Struktur, Kriterien-IDs und Zitationen übernommen; DE bleibt maßgeblich | Maintainer (Struktur-/Terminologie-Abgleich DE↔EN) |
| **Konformitäts- und Soundness-Werkzeuge** (`tools/*.mjs`, `tools/validate-xsd.sh`, `tools/moddle/`, `.bpmnlintrc`) | **Generated** | Claude Code (Opus 4.8, Fable 5.1) | Entwurf und Implementierung der Gate-Schichten (Namenskonvention, bpmnlint, Metriken, Roundtrip, XSD-Kernsicht, Soundness-Wrapper, Protokoll-Vorbefüllung) | Maintainer-Review im PR; deterministische Tests (Exit-Codes, Referenzläufe); CI |
| **CI-Workflows, Templates, Hook** (`.github/`, `.claude/`, `.gitattributes`, release-please-Konfiguration) | **Generated** | Claude Code | Workflows, PR-/Issue-Templates, Model-Guard-Hook, Release-/Archiv-Konfiguration | Maintainer-Review; CI-Läufe |
| **Agenten-Skills und Agenten-Kontext** (`skills/*/SKILL.md`, `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`) | **Generated** | Claude Code | Vendor-neutrale Skill-Beschreibungen und Arbeitsregeln für KI-Agenten | Maintainer |
| **Repository-Dokumentation** (README, CONTRIBUTING, CONVENTIONS-Querverweise, ADRs in `docs/decisions/`, `docs/model-issues/`, Synthea-Notizen) | **Assisted** bis **Generated** | Claude Code | Strukturierung, Formulierung, Konsistenz-Audits (mehrstufig, mit adversarialer Verifikation durch zweite Agenten); Entscheidungen selbst trifft der Maintainer | Maintainer-Review im PR |
| **Modellbefunde** (`docs/model-issues/*.md`) und **GitHub-Issues zu Modellen** (z. B. #78–#89) | **Generated** (werkzeugbasiert) | Claude Code (Fable 5.1) | Befunde stammen aus den Gate-Werkzeugen; Agenten fassen sie zusammen, ein zweiter Agent verifiziert jede Element-Referenz und Zählung gegen das Werkzeug; Einreichung über das Maintainer-Konto | Maintainer; fachliche Bewertung durch Modellierer:innen |
| **Zitier-/Archiv-Metadaten** (`CITATION.cff`, `.zenodo.json`) | **Assisted** | Claude Code | Struktur und Synchronisation; Autor:innen, ORCIDs und Reihenfolge vom Maintainer vorgegeben und geprüft | Maintainer; CI-Sync-Check |
| **Haftungsausschluss** (`DISCLAIMER.md`) | **Assisted** (Entwurf) | Claude Code | Entwurf nach Vorbild der FGDH-Schwesterrepositories; **rechtlich noch nicht freigegeben** (Justiziariat + DSB TU Dresden ausstehend) | Justiziariat / Datenschutzbeauftragte:r |
| **Diese Datei** (`AI_USAGE.md`) | **Generated** | Claude Code (Fable 5.1) | Nach der Disklosure-Vorlage der FGDH-Schwesterrepositories; Fakten aus der Git-Historie abgeleitet | Maintainer |

**Legende Scope:** `Generated` — Inhalt vollständig oder überwiegend durch KI erzeugt ·
`Assisted` — KI unterstützt, Mensch entwirft und prüft substanziell · `Reviewed` — KI zur
Überprüfung menschlicher Inhalte · `None` — kein KI-Einsatz.

## 3. Eingesetzte Werkzeuge [COPE]

| Werkzeug | Anbieter | Modell / Version | Einsatzzeitraum (laut Commit-Trailern) | Zweck |
|---|---|---|---|---|
| **Claude Code** (CLI / IDE-Erweiterung) | Anthropic | `claude-opus-4-8` (1M-Kontext) | 2026-06-16 – 2026-07-03 (40 Commits) | Repository-Chassis: Konformitäts-Gate, Skills, ADRs, Governance-Übersetzungen, Restrukturierung (ADR-0004), Release-Setup, Soundness-Pilot |
| **Claude Code** | Anthropic | `claude-fable-5` | 2026-07-08 (2 Commits) | Merge-Technik für Modellierer-Branches (Modellbytes erhalten) |
| **Claude Code** | Anthropic | `claude-fable-5-1` | 2026-09-04 – 2026-09-05 (16 Commits) | Repository-Audit, Doku-/CI-Abgleich, XSD-Kernsicht, Zenodo-Metadaten, Modell-Issues, Release-Candidate 0.4.0-rc.1, diese Disklosure |
| **Repository-eigene Skills** (`skills/`) | auf Claude basierend; vendor-neutral (agentskills.io) | `bpmn-conformance`, `bpmn-acceptance`, `bpmn-soundness`, `clinical-pathway-review`, `model-inventory` | 2026-06 – laufend | Nur lesende Analyse/Berichte; keine Modelländerungen |
| **Externe Analyse-Werkzeuge ohne KI** | bpmn.io (bpmnlint, bpmn-moddle), libxml2 (xmllint), rust_bpmn_analyzer (Model Checker, per Digest gepinnt) | siehe `package.json`, `tools/` | 2026-06 – laufend | Deterministische Gate-Schichten — die Befunde stammen aus diesen Werkzeugen, nicht aus KI-Urteilen |

> **Nachweis:** 58 von 148 Commits auf `main` (Stand 2026-09-05) tragen einen KI-Trailer
> (`git log --grep='Co-Authored-By: Claude'`). Die Modellversionen entsprechen den zum
> Zeitpunkt der Sitzung in Claude Code aktiven Modellen; je Commit ist die tatsächlich
> verwendete Version im Trailer dokumentiert.

> **Nicht eingesetzt (bewusst dokumentiert):** GitHub Copilot, OpenAI Codex/ChatGPT, Google
> Gemini oder andere KI-Codierhilfen sind in der Commit-Historie nicht nachgewiesen. Die
> Skills sind vendor-neutral beschrieben, damit ein späterer Einsatz anderer Agenten unter
> denselben Regeln möglich ist — er wäre hier zu ergänzen.

## 4. Menschliche Aufsicht und redaktionelle Verantwortung [EU AI Act §50 Abs. 2 | COPE]

Alle KI-assistierten Artefakte durchlaufen vor Aufnahme in `dev`/`main` eine menschliche
Prüfung. Die redaktionelle Verantwortung liegt bei Marcel Susky (Maintainer, FGDH, TU Dresden);
institutionell bei der Forschungsgruppe Digital Health. Der Prüfprozess ist im Repository
operationalisiert:

1. **Nur Pull Requests.** Änderungen erreichen `dev` und `main` ausschließlich per PR; `main`
   ist durch ein GitHub-Ruleset geschützt (kein Force-Push, keine Löschung). Der Maintainer
   merged; Agenten mergen nur auf ausdrückliche Anweisung und nie in Release-Branches ohne
   Freigabe.
2. **Model Guard.** Agenten dürfen `.bpmn`/`.svg` nicht schreiben, ersetzen, verschieben oder
   löschen (`.claude/hooks/guard-model-files.sh`, `AGENTS.md`). Befunde werden nach
   `docs/model-issues/` bzw. als GitHub-Issue gemeldet; die Ummodellierung erfolgt durch
   Menschen und wird erneut abgenommen.
3. **Deterministische Gates.** `npm run check:conformance` (Namenskonvention, bpmnlint,
   Metriken, Roundtrip, XSD-Kern) und `npm run check:soundness` liefern die Evidenz; KI
   interpretiert sie nur. CI führt die Gates bei jedem PR aus.
4. **Adversariale Verifikation.** Bei Audits und Issue-Erstellung prüft ein zweiter,
   unabhängiger Agent jede Aussage gegen Werkzeugausgabe und Dateien, bevor der Maintainer
   sie sieht; unbelegte Aussagen werden verworfen.
5. **Abnahmetest bleibt menschlich.** Das Protokoll wird nur vorbefüllt
   (`npm run abnahme:protokoll`); Review-/Konsens-Kriterien (u. a. SEM-6 Face Validity,
   PRA-1 Walkthrough) und das Gesamturteil vergeben ausschließlich Menschen (siehe
   `docs/governance/`, ADR-0002: Version 1.0.0 erst nach dem ersten „Accepted“).
6. **Releases.** Release Candidates und Releases werden vom Maintainer ausgelöst und geprüft
   (Versionen, Archivinhalt, Zenodo-Deposit).

## 5. Maschinenlesbare Kennzeichnung [EU AI Act §50 Abs. 2]

### 5.1 Commit-Trailer

KI-assistierte Commits tragen den von Claude Code gesetzten Trailer (Git-Standardformat,
von GitHub als Co-Autor:in gerendert):

```
Co-Authored-By: Claude <Modell> <noreply@anthropic.com>
```

Beispiele: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`,
`Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Filterung:

```
git log --grep='Co-Authored-By: Claude'            # KI-assistierte Commits
git log --grep='Co-Authored-By: Claude' -- models  # … die models/ berühren (nur Moves/Merges/README)
```

Die Schwesterrepositories der FGDH verwenden alternativ den `Assisted-by:`-Trailer der
Linux-Kernel-Konvention; beide Formen gelten als gleichwertige Kennzeichnung. Beitragende,
die andere KI-Werkzeuge einsetzen, nutzen denselben Trailer mit Werkzeug- und Modellangabe
(siehe `CONTRIBUTING.md`).

### 5.2 Pull Requests und Issues

Von Agenten verfasste PR-Beschreibungen und Issues enden mit
`🤖 Generated with [Claude Code](https://claude.com/claude-code)`. Die von Agenten
eingereichten Modell-Issues nennen zusätzlich die Werkzeugläufe, aus denen die Befunde
stammen, und markieren die adversariale Verifikation.

### 5.3 Dateiebene

Diese Datei, `AGENTS.md`, `skills/README.md` und die Skills selbst benennen die
KI-Beteiligung je Artefaktklasse. Eine Datei-Metadaten-Markierung einzelner Markdown-Dateien
ist nicht vorgesehen; die Zuordnung erfolgt über die Commit-Historie.

## 6. Nicht-Nutzung / Ausschlüsse [CS]

- **Modellinhalt und klinische Entscheidungen** — Prozesslogik, Rollen, Kriterien und
  Fristen der Pfade stammen von Menschen; KI schlägt keine Ummodellierung vor, die nicht als
  Befund gekennzeichnet und von Modellierer:innen bewertet wird.
- **Abnahmetest-Verdikte** — kein Kriterium der Review-/Konsens-Methoden und kein
  Gesamturteil wird durch KI vergeben.
- **Rechtstexte** — `DISCLAIMER.md` und Lizenzfragen werden vom Justiziariat und der/dem
  Datenschutzbeauftragten der TU Dresden freigegeben, nicht von KI.
- **Personenbezogene oder vertrauliche Daten** — keinerlei Eingabe in KI-Werkzeuge; die
  Modelle enthalten keine Patientendaten (nur abstrakte Prozessinhalte).
- **Antrags-/Förderdetails (BMFTR)** — nicht Teil des Repositorys und nicht Teil von
  Agenten-Kontexten.

## 7. Einschränkungen und Hinweise [COPE | CS]

- KI-erzeugte Texte können Fehler enthalten; Zahlen (Modell-, Gateway-, Fehlerzählungen)
  werden aus Werkzeugläufen abgeleitet und mit Datum versehen, damit sie nachprüfbar sind.
- Die Modelle sind ein Forschungs-, Lehr- und Interoperabilitäts-Referenzartefakt und
  **nicht klinisch validiert** (siehe `DISCLAIMER.md`); die KI-Beteiligung an Werkzeugen und
  Dokumentation ändert daran nichts.
- Versionsangaben der Modelle folgen den Anbieterbezeichnungen zum Nutzungszeitpunkt.

## 8. Rechtliche Grundlagen und Standards [EU AI Act]

| Grundlage | Bezug in dieser Datei |
|---|---|
| [EU AI Act, Art. 50 (VO (EU) 2024/1689)](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) | Transparenz- und Kennzeichnungspflichten (§ 2, § 4, § 5) |
| EU Code of Practice on Transparency of AI-Generated Content (Draft, 2026) | Dokumentierter Redaktionsworkflow mit identifizierbarer Verantwortung (§ 4) |
| [COPE: Authorship and AI Tools (2024)](https://publicationethics.org/) | KI ist kein:e Autor:in; Werkzeug- und Versionsangabe (§ 3) |
| [ICMJE Recommendations](https://www.icmje.org/) | Offenlegung der KI-Nutzung in zugehörigen Publikationen |
| [Linux Kernel AI Policy (2025)](https://docs.kernel.org/process/coding-assistants.html) | Commit-Trailer-Konvention (§ 5.1) |
| Red Hat OSS AI Policy (2025) | Menschliche Verantwortung für KI-assistierte Beiträge |

## 9. Changelog [CS]

| Datum | Änderung |
|---|---|
| 2026-09-05 | Erstfassung nach der FGDH-Disklosure-Vorlage; Fakten aus der Commit-Historie (Trailer, Zeiträume, `models/`-Commits); Verweise in README, CONTRIBUTING, PR-Template und AGENTS.md; Datei in das Release-Archiv aufgenommen. |

## 10. Offene Punkte

| # | Punkt | Status |
|---|---|---|
| 1 | Rechtliche Freigabe von `DISCLAIMER.md` (Justiziariat + DSB TU Dresden) | offen |
| 2 | Ergänzung dieser Datei, sobald andere Agenten (Codex, Copilot, …) oder neue Modellversionen eingesetzt werden | laufend |
| 3 | Nennung klinischer Reviewer:innen je Teilpfad nach dem ersten Abnahmetest | offen (mit 1.0.0) |
