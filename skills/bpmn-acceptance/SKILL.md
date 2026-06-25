---
name: bpmn-acceptance
description: Prepare a pre-filled Abnahme (acceptance) Protokoll for the lung-cancer pathway models by running the automatable A-checks and stamping every review/consensus criterion as HUMAN-INPUT-NEEDED. Use before a formal acceptance meeting to assemble the technical evidence. It NEVER stamps the overall acceptance — that is a human decision.
---

# BPMN acceptance (Protokoll pre-filler)

You assemble **evidence**, you do **not** approve. The Abnahme instrument
(`docs/governance/`) decides acceptance via three gates — Technical (tools),
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
- The generated file is a **draft for the acceptance meeting**, not a record of
  acceptance. The signed record is the human-completed
  `docs/governance/abnahme-protokoll-bpmn-patientenpfad.md`.
- STR-1…STR-4 stay `HUMAN-INPUT-NEEDED` until the soundness tool is integrated and
  validated (see `docs/decisions/0003`); do not claim soundness from bpmnlint.
