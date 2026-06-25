# Governance — Abnahme (acceptance) of BPMN patient-pathway models

This folder holds the **Abnahme instrument** used to formally accept (sign off) a
BPMN-modelled patient pathway, together with its rationale and a fill-in protocol.

| File | Purpose |
|---|---|
| [`abnahme-checkliste-bpmn-patientenpfad.md`](abnahme-checkliste-bpmn-patientenpfad.md) | **The instrument (v0.3.1)** — the criteria, severities, methods, and gates. |
| [`abnahme-handout-bpmn-patientenpfad.md`](abnahme-handout-bpmn-patientenpfad.md) | **Rationale + examples** — why each criterion exists (with sources) and one lung-cancer example per item. |
| [`abnahme-protokoll-bpmn-patientenpfad.md`](abnahme-protokoll-bpmn-patientenpfad.md) | **Sign-off protocol** — fill in per acceptance; one protocol per acceptance event. |

## How to read it

- **Severity:** **Muss** = K.O. criterion · **Soll** = important, document any deviation.
- **Method:** **A** = automatable tool · **R** = review (visual inspection) · **K** = consensus.
- **Three gates** — all must pass for overall acceptance:
  - **Technical** — the Muss/A criteria (SYN-1, SYN-2, STR-1…STR-4).
  - **Clinical** — the Kinsman-Gate (SEM-1 **and** ≥ 3 of {SEM-2…SEM-5}) **and** SEM-6.
  - **Pragmatic** — PRA-1.
- Decision: **Accepted** / **Accepted with conditions** (only open *Soll* points) /
  **Rejected** (any open *Muss*).

## What is automated vs. human

The **A (automatable)** criteria are mechanised by this repo's conformance gate —
`npm run check:conformance` (see [`../../skills/bpmn-conformance/SKILL.md`](../../skills/bpmn-conformance/SKILL.md)
and [`../decisions/0001-repo-tooling-and-conformance-gate.md`](../decisions/0001-repo-tooling-and-conformance-gate.md)):

| Abnahme | Covered by | Status |
|---|---|---|
| SYN-5 (no OR-gateway) | `check:metrics` (blocking) + bpmnlint `no-inclusive-gateway`=error | automated |
| SYN-2 (one start/end), SYN-4 (≤ 50/level), lanes (SEM-1 presence), prefix | `check:metrics` (advisory) | automated, advisory |
| structural correctness (supports SYN-2/STR-3) | `bpmnlint` (blocking) | automated |
| SYN-1 (conformance class) | declared in [`../decisions/0001`](../decisions/0001-repo-tooling-and-conformance-gate.md); adherence partly via bpmnlint/metrics | partly |
| STR-1…STR-4 (soundness) | external soundness checker — **planned** (later phase) | not yet |
| SEM-2…7, PRA-2/3 | advisory `clinical-pathway-review` agent — **planned**; otherwise R | human |
| SEM-1 completeness, SEM-6 (consensus), PRA-1 (walkthrough), overall decision | **human only** | human |

> A tool or agent may *prepare evidence* (tick the A-rows, attach the gate report) but
> **never stamps the overall acceptance** — that is a human decision recorded in the
> Protokoll with signatures.

## Status of the instrument

The Abnahme instrument is a **Design-Science-Research artifact**, derived
conceptually from established kernel theories (7PMG, SEQUAL/GoM, Kinsman et al.,
BPMN4CP, BPMN-2.0 conformance, soundness). It is **not yet empirically validated**;
the planned evaluation trajectory is described in §6 of the Checkliste. It is licensed
CC BY 4.0; cite per the Checkliste's citation note when reused.

See also the modelling reference [`../../CONVENTIONS.md`](../../CONVENTIONS.md) (§8 in
particular maps closely onto this instrument).
