---
name: bpmn-acceptance
description: Prepare a pre-filled Abnahmetest (acceptance test) Protokoll for the lung-cancer pathway models by running the automatable A-checks and stamping every review/consensus criterion as HUMAN-INPUT-NEEDED. Use before a formal acceptance-test meeting to assemble the technical evidence. It NEVER stamps the overall acceptance test — that is a human decision.
---

# BPMN acceptance test (Protokoll pre-filler)

> **🔒 Model guard — read-only.** Never edit or modify a `.bpmn` model or its `.svg` export.
> The models are clinically validated (acceptance test **SEM-6** face validity) and change only via a
> human modeler + re-validation. Found a BPMN-XML problem while assembling evidence? **Report
> it** in [`docs/model-issues/`](../../docs/model-issues/) and propose a GitHub issue
> ([template](../../.github/ISSUE_TEMPLATE/bpmn-model-issue.md)) — do not change the model.
> Enforced in Claude Code by the `guard-model-files` PreToolUse hook.

You assemble **evidence**, you do **not** approve. The acceptance-test instrument
(`docs/governance/`) decides the acceptance test via three gates — Technical (tools),
Clinical (expert consensus), Pragmatic (joint walkthrough) — and only humans sign off.

## Run

```bash
npm run abnahme:protokoll              # print a pre-filled Protokoll to stdout
npm run abnahme:protokoll > protokoll.md
```

It runs the automatable (method **A**) checks — `lint:bpmn`, `check:metrics`,
`check:roundtrip` — and emits the `docs/governance/abnahme-protokoll-…md` shape with:

- the **A-rows it can decide** ticked with the tool evidence (e.g. SYN-5 from the
  metrics gate; supporting bpmnlint + cp:/i18n roundtrip rows),
- **`HUMAN-INPUT-NEEDED`** on every review (R) / consensus (K) row **and** on any
  A-criterion whose tool is not yet integrated — currently **STR-1…STR-4** (soundness),
- the **automatable part of the Technical gate**, with the human/tool-pending part
  called out,
- **no** Clinical/Pragmatic gate verdict and **no** overall decision.

## Rules (do not break)

- Never convert a `HUMAN-INPUT-NEEDED` row into a ✓. SEM-1 completeness, SEM-6
  (consensus), PRA-1 (walkthrough) and the overall decision are human — full stop.
- The generated file is a **draft for the acceptance-test meeting**, not a record of
  the acceptance test. The signed record is the human-completed
  `docs/governance/abnahme-protokoll-bpmn-patientenpfad.md`.
- STR-1…STR-4 stay `HUMAN-INPUT-NEEDED` until the soundness tool is integrated and
  validated (see `docs/decisions/0003`); do not claim soundness from bpmnlint.
