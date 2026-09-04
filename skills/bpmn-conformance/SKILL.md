---
name: bpmn-conformance
description: Validate the lung-cancer pathway .bpmn models for BPMN 2.0 structural correctness and the automatable acceptance-test conventions (no OR-gateway, single start/end, size) before a commit or PR. Use whenever a .bpmn file has changed (human edit) and before any commit or PR that touches models/ — agents verify, they never edit the models. Runs the naming check (ADR-0004) + bpmnlint + the model-metrics gate + serialization roundtrip (all blocking) + XSD core (informational), then explains the results.
---

# BPMN conformance

> **🔒 Model guard — read-only.** Never edit, reformat, or otherwise modify a `.bpmn`
> model or its `.svg` export, *not even to fix an issue this skill finds*. The models are
> clinically validated (acceptance-test **SEM-6** face validity) and change only via a human
> modeler + re-validation. Found a BPMN-XML problem? **Report it** in
> [`docs/model-issues/`](../../docs/model-issues/) and propose a GitHub issue
> ([template](../../.github/ISSUE_TEMPLATE/bpmn-model-issue.md)) — do not change the model.
> Enforced in Claude Code by the `guard-model-files` PreToolUse hook.

The decision is made by deterministic CLI tools, **not** by you. Your job is to
**run them, read their reports, and explain failures** — never to hand-wave a pass.

## Run

From the repo root (Node ≥ 18; `npm ci` once):

```bash
npm run check:conformance     # naming (ADR-0004) + bpmnlint + model metrics + roundtrip + XSD core (the gate)
```

Or individually:

```bash
npm run check:naming          # ADR-0004: models/ only, lung-cancer-<phase>-pathway.{bpmn,svg}, paired bpmn/svg (blocking)
npm run lint:bpmn             # structural BPMN 2.0 (bpmnlint recommended + correctness; no-OR = error)
npm run check:metrics         # acceptance-test SYN-5 (no OR-gateway, blocking) + SYN-2/4, SEM-1 lanes, prefix (advisory)
npm run check:roundtrip       # serialization stability + cp:/i18n lossless (blocking)
npm run check:xsd             # OMG BPMN20.xsd core validation (informational)
```

Scope to specific files by appending paths, e.g. `npm run check:metrics -- models/lung-cancer-treatment-pathway.bpmn`.

## Division of labour (do not conflate)

| Layer | Tool | Checks | Blocking? |
|---|---|---|---|
| Naming | `check-naming.mjs` | ADR-0004: models live in `models/` only, named `lung-cancer-<phase>-pathway.{bpmn,svg}`, every `.bpmn` paired with its `.svg` | **yes** |
| Structure | bpmnlint (programmatic) | disconnected nodes, missing start/end, implicit splits, missing labels, **no OR-gateway** | **yes** (any error) |
| Conventions | `check-model-metrics.mjs` | **SYN-5** no OR (blocking); SYN-2 one start/end, SYN-4 ≤50/level, SEM-1 lane presence, prefix hygiene (advisory) | **yes** on OR-gateways |
| Extension data | `moddle-roundtrip.mjs` | serialization is idempotent; `cp:` (BPMN4CP) elements preserved losslessly (descriptor registered, `tools/moddle/descriptors.mjs`); `i18n:` passes through | **yes** (data loss or unstable serialization exits 1) |
| Standard core | xmllint vs BPMN20.xsd | BPMN core matches OMG schema | no (informational) |

> Note: the "Blocking?" column is the LOCAL default (strict). During the release-candidate (0.x.y-rc.N) / pre-remodel phase the CI gate runs ADVISORY (warn-only, `CONFORMANCE_WARN_ONLY: 'true'`): it reports every finding as `::warning::` and exits 0, so it does NOT block PRs. Exception: in CI the naming layer also runs as its own blocking `npm run check:naming` step, so a misnamed or unpaired model fails the PR even while the rest of the gate is warn-only. Hard enforcement of the whole gate is re-enabled (drop `CONFORMANCE_WARN_ONLY`) after the model remodel — see `.github/workflows/ci.yml` and `tools/check-conformance.mjs`.

## Interpreting results

- **bpmnlint error** → a real structural defect (or an OR-gateway). It needs a human
  modeler — **report it** (see the Model guard above); do not edit the model yourself.
- **metrics ✖ SYN-5** → an `InclusiveGateway`/`ComplexGateway` is present. A human modeler
  must remodel it to XOR/AND (CONVENTIONS R5); **report it** via `docs/model-issues/` and the
  acceptance-test Protokoll — do not edit the model.
- **metrics ⚠** (SYN-2/SYN-4/lanes/prefix) → advisory; a reviewer adjudicates
  intentional multi-start, orchestration size, etc. Not a build failure.
- **roundtrip `DATA LOSS: … dropped on parse`, `serialization is NOT idempotent`, or
  `loss warning:`** → blocking (exit 1). The `cp:` (BPMN4CP) descriptor
  `tools/moddle/bpmn4cp.json` is registered via `tools/moddle/descriptors.mjs`, so `cp:`
  elements survive losslessly and `i18n:` rides along via lax `extensionElements`; today
  every model reports `roundtrip: OK (lossless + stable)`. A failure means an extension
  element the descriptor does not know (new/renamed `cp:` type) or a model that
  re-serializes differently — **report it**; never "fix" it by deleting extension content.
- **XSD `fails to validate`** → informational; the standard XSD cannot see extension
  content (it passes via `processContents="lax"`). As of 2026-09-04 a subset of the models
  is red here because `cp:qualityIndicator` sits outside `extensionElements` and the DI
  carries colour attributes — tracked in `docs/model-issues/` (2026-09-04, XSD core
  extension placement). A green XSD does **not** mean the extensions are valid — that is
  the roundtrip's concern.
- **Element references** — the tools print elements as `"Name" (id)` or
  `‹unnamed Type› (id)` (`tools/element-names.mjs`): bpmnlint lines end with
  `→ "Name" (id)`, the metrics gate lists every OR-gateway and every extra start/end event
  by label, and the soundness wrapper maps `problematic_elements` the same way.
  `‹unnamed …›` usually coincides with a bpmnlint `label-required` finding. Quote these
  references verbatim in `docs/model-issues/` so the human modeler can locate the element.

Never claim "XSD green ⇒ everything valid". State which layers passed and which are
informational.

> This skill covers only the **automatable (A)** acceptance-test criteria. The clinical (SEM)
> and pragmatic (PRA) criteria, the three acceptance-test gates, and the overall decision
> are human — see `docs/governance/`.
