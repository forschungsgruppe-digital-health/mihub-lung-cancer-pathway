# Governance — Abnahmetest (acceptance test) of BPMN patient-pathway models

This folder holds the **acceptance-test instrument** (Abnahmetest) used to formally accept (sign off) a
BPMN-modelled patient pathway, together with its rationale and a fill-in protocol.

Each document is maintained **bilingually**: German is the authoritative original; the
English `*.en.md` is a translation kept in sync at the same version (repo language policy in
`AGENTS.md`). The documents are **draft / not final** — changes are tracked in
[`CHANGELOG.md`](CHANGELOG.md) and via Conventional Commits (`docs(governance): …`).

| Document | Version | DE (original) | EN (translation) |
|---|---|---|---|
| **Acceptance-Test Checklist** — the instrument (criteria, severities, methods, gates) | 0.3.1 | [DE](abnahme-checkliste-bpmn-patientenpfad.md) | [EN](abnahme-checkliste-bpmn-patientenpfad.en.md) |
| **Handout** — rationale + one lung-cancer example per criterion (with sources) | 0.2 | [DE](abnahme-handout-bpmn-patientenpfad.md) | [EN](abnahme-handout-bpmn-patientenpfad.en.md) |
| **Acceptance-Test Protocol** — fill-in sign-off form (one per acceptance test) | 1.0 | [DE](abnahme-protokoll-bpmn-patientenpfad.md) | [EN](abnahme-protokoll-bpmn-patientenpfad.en.md) |

## How to read it

- **Severity:** **Muss** = K.O. criterion · **Soll** = important, document any deviation.
- **Method:** **A** = automatable tool · **R** = review (visual inspection) · **K** = consensus.
- **Three gates** — all must pass for overall acceptance test:
  - **Technical** — the Muss/A criteria (SYN-1, SYN-2, STR-1…STR-4).
  - **Clinical** — the Kinsman-Gate (SEM-1 **and** ≥ 3 of {SEM-2…SEM-5}) **and** SEM-6.
  - **Pragmatic** — PRA-1.
- Decision: **Accepted** / **Accepted with conditions** (only open *Soll* points) /
  **Rejected** (any open *Muss*).

## What is automated vs. human

The **A (automatable)** criteria are mechanised by this repo's conformance gate —
`npm run check:conformance`, five layers: **naming** (blocking, ADR-0004), **bpmnlint**
(blocking), **model metrics** (SYN-5 blocking; SYN-2/SYN-4 advisory), **moddle roundtrip**
(blocking), **XSD core** (informational, report-only). See the skill
[`skills/bpmn-conformance/SKILL.md`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/skills/bpmn-conformance/SKILL.md)
and [ADR-0001](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0001-repo-tooling-and-conformance-gate.md)
(absolute links — the skills and ADRs are not part of the release archive):

| Acceptance-test criterion | Covered by | Status |
|---|---|---|
| SYN-5 (no OR-gateway) | `check:metrics` (blocking) + bpmnlint `no-inclusive-gateway`=error | automated |
| SYN-2 (one start/end), SYN-4 (≤ 50/level), lanes (SEM-1 presence), prefix | `check:metrics` (advisory) | automated, advisory |
| structural correctness (supports SYN-2/STR-3) | `bpmnlint` (blocking) | automated |
| SYN-1 (conformance class) | declared in [ADR-0001](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0001-repo-tooling-and-conformance-gate.md); adherence partly via bpmnlint/metrics, the moddle roundtrip (`cp:`/`i18n:` extension data, blocking) and the XSD-core check (informational) | partly |
| filename convention `lung-cancer-<phase>-pathway.{bpmn,svg}` + paired `.svg` (repo hygiene, no acceptance-test criterion) | `check:naming` (blocking; [ADR-0004](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0004-repo-structure-and-model-naming.md)) | automated |
| STR-1…STR-4 (soundness) | `npm run check:soundness` — rust_bpmn_analyzer (Docker image pinned by digest); advisory CI job `soundness.yml`; reports **INCONCLUSIVE** on models with OR-gateways / intermediate catch events | automated, advisory — the Protokoll keeps HUMAN-INPUT-NEEDED ([ADR-0003](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0003-soundness-tooling.md)) |
| SEM-2…7, PRA-2/3 | advisory `clinical-pathway-review` skill (findings only — never a pass/fail); otherwise R | human (evidence prepared by the skill) |
| SEM-1 completeness, SEM-6 (consensus), PRA-1 (walkthrough), overall decision | **human only** | human |

> A tool or agent may *prepare evidence* (tick the A-rows, attach the gate report) but
> **never stamps the overall acceptance test** — that is a human decision recorded in the
> Protokoll with signatures.

## Status of the instrument

The Acceptance Test instrument is a **Design-Science-Research artifact**, derived
conceptually from established kernel theories (7PMG, SEQUAL/GoM, Kinsman et al.,
BPMN4CP, BPMN-2.0 conformance, soundness). It is **not yet empirically validated**;
the planned evaluation trajectory is described in §6 of the Checkliste. It is licensed
CC BY 4.0; cite per the Checkliste's citation note when reused.

See also the modelling reference [`CONVENTIONS.md`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/CONVENTIONS.md) (not part of
the release archive): its §8.1
review checklist is the **technical-acceptance-test subset** of this instrument (each row is
annotated with the matching SYN/STR id), and its §8.2 review process maps step 3 → the
technical gate (SYN/STR) and step 4 → the clinical gate (Kinsman-Gate + SEM-6).
