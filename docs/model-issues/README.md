# Model issues — report, don't fix

The `.bpmn` pathway models are the **clinically-validated artifact**. **No skill or agent
may modify a model** (`.bpmn` or its `.svg`) — every change is made by a **human modeler**
and re-validated for face validity (acceptance test **SEM-6**). See `AGENTS.md` (Hard rules) and the
`guard-model-files` PreToolUse hook (`.claude/hooks/guard-model-files.sh`).

When a tool or agent finds a problem with the BPMN XML, it records it **here** as a finding
plus a **ready-to-file GitHub issue suggestion** — it does **not** touch the model. A human
then triages, files the issue (template:
[`.github/ISSUE_TEMPLATE/bpmn-model-issue.md`](../../.github/ISSUE_TEMPLATE/bpmn-model-issue.md)),
and a modeler fixes + re-validates.

## Workflow

1. **Tool/agent** finds a BPMN-XML problem → appends or adds a finding under this folder
   (with evidence + a suggested issue). Never edits the model.
2. **Human** reviews the finding and files a GitHub issue (using the suggestion + template).
3. **Human modeler** remodels, re-exports the `.svg`, re-runs the gate
   (`npm run check:conformance`, and `npm run check:soundness` where relevant), and
   re-confirms face validity (SEM-6) if the clinical meaning changed.

## Findings

- [2026-06-25 — baseline findings](2026-06-25-baseline.md) — defects discovered while
  building the tooling: OR-gateways, structural correctness, dead activities, namespace
  prefixes, stub processes, and soundness-unsupported events. Carries a **2026-09-04 addendum**
  (aftercare ids superseded by the post-workshop rewrite; repo total now 13 OR-gateways).
- [2026-06-29 — palliative-care sub-pathway](2026-06-29-palliative-care.md) — the WIP draft
  integrated in `v0.3.0-rc.1`: 7 OR-gateways, 2 start / 2 end events, 19 bpmnlint errors, an
  81-element level, `bpmn2:` root prefix; clinical/pragmatic review pending.
- [2026-09-04 — XSD-core: `cp:` extension placement](2026-09-04-xsd-core-extension-placement.md) —
  **resolved 2026-09-04 as not a defect (by design)**: `cp:qualityIndicator` is a valid BPMN4CP
  extension placed directly under the process, and the **informational** XSD-core layer now
  excludes the BPMN4CP elements before validating (`tools/xsd-core-view.mjs`) — Issue X1 closed
  without model changes. Issue X2 (un-namespaced styling attributes on the `overarching` DI
  plane) stays open as a low-priority housekeeping item; not blocking.

## Filed issues (2026-09-04)

The findings above were triaged into **one GitHub issue per model** on 2026-09-04, all children of
the parent issue
[#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49).
Every one of them carries `model`, `conformance` and `needs-clinical-review`; **`soundness` is
added only where `npm run check:soundness` returned a VIOLATION verdict** on that date — an
INCONCLUSIVE result is recorded in the issue text only, not as a label.

| Model | Issue | Soundness verdict (2026-09-04) |
|---|---|---|
| overarching | [#78](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/78) | INCONCLUSIVE |
| screening | [#79](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/79) | VIOLATION (`soundness`) |
| diagnostic | [#80](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/80) | VIOLATION (`soundness`) |
| patient-consultation | [#81](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/81) | INCONCLUSIVE |
| tumor-board | [#82](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/82) | VIOLATION (`soundness`) |
| molecular-tumor-board | [#83](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/83) | VIOLATION (`soundness`) |
| treatment | [#84](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/84) | INCONCLUSIVE |
| palliative-care | [#85](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/85) | INCONCLUSIVE |
| aftercare | [#86](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/86) | INCONCLUSIVE |
| initial-entry | [#89](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/89) | VIOLATION (`soundness`) |

## Labels

The GitHub labels referenced by the findings. They were created on 2026-09-04 — before that
they did not exist in the repository, so the labels named in the issue template were silently
dropped on filing. Every model finding carries `model`; add the others as applicable.

| Label | Use when … |
|---|---|
| `model` | the fix requires a change to a `.bpmn` / `.svg` — i.e. every finding in this folder (only a human modeller may change a model). |
| `conformance` | the finding is reported by the conformance gate (`npm run check:conformance`: naming, bpmnlint, model metrics / SYN criteria, moddle roundtrip, XSD core) — an acceptance-test SYN criterion or BPMN 2.0 schema hygiene. |
| `soundness` | the finding is a **VIOLATION** verdict of `npm run check:soundness` (STR-1…STR-4, rust_bpmn_analyzer). An **INCONCLUSIVE** result (unsupported elements — OR-gateways, intermediate catch events) is recorded in the per-model issue text only, not as a label. |
| `needs-clinical-review` | the remodel changes clinical meaning or needs a modelling decision by domain experts (SEM/PRA criteria; SEM-6 face validity must be re-confirmed). |
| `housekeeping` | repo hygiene — structure, tooling, docs consistency (the GitHub label description) — and model hygiene without semantic impact: namespace prefix, extension placement, non-schema DI attributes. |
