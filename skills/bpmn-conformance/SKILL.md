---
name: bpmn-conformance
description: Validate the lung-cancer pathway .bpmn models for BPMN 2.0 structural correctness and the automatable acceptance-test conventions (no OR-gateway, single start/end, size) before a commit or PR. Use whenever you edit any .bpmn file. Runs bpmnlint + the model-metrics gate + serialization roundtrip + XSD core, then explains the results.
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
npm run check:conformance     # bpmnlint + model metrics + roundtrip + XSD (the gate)
```

Or individually:

```bash
npm run lint:bpmn             # structural BPMN 2.0 (bpmnlint recommended + correctness; no-OR = error)
npm run check:metrics         # acceptance-test SYN-5 (no OR-gateway, blocking) + SYN-2/4, lanes, prefix (advisory)
npm run check:roundtrip       # serialization stability + cp:/i18n: extension presence (informational)
npm run check:xsd             # OMG BPMN20.xsd core validation (informational)
```

Scope to specific files by appending paths, e.g. `npm run check:metrics -- models/lung-cancer-treatment-pathway.bpmn`.

## Division of labour (do not conflate)

| Layer | Tool | Checks | Blocking? |
|---|---|---|---|
| Structure | bpmnlint (programmatic) | disconnected nodes, missing start/end, implicit splits, missing labels, **no OR-gateway** | **yes** (any error) |
| Conventions | `check-model-metrics.mjs` | **SYN-5** no OR (blocking); SYN-2 one start/end, SYN-4 ≤50/level, lane presence, prefix hygiene (advisory) | **yes** on OR-gateways |
| Extension data | `moddle-roundtrip.mjs` | serialization is idempotent; `cp:`/`i18n:` content present | no (informational) |
| Standard core | xmllint vs BPMN20.xsd | BPMN core matches OMG schema | no (informational) |

## Interpreting results

- **bpmnlint error** → a real structural defect (or an OR-gateway). It needs a human
  modeler — **report it** (see the Model guard above); do not edit the model yourself.
- **metrics ✖ SYN-5** → an `InclusiveGateway`/`ComplexGateway` is present. A human modeler
  must remodel it to XOR/AND (CONVENTIONS R5); **report it** via `docs/model-issues/` and the
  acceptance-test Protokoll — do not edit the model.
- **metrics ⚠** (SYN-2/SYN-4/lanes/prefix) → advisory; a reviewer adjudicates
  intentional multi-start, orchestration size, etc. Not a build failure.
- **roundtrip `note: extension content dropped`** → expected today: no `cp:`/`i18n:`
  moddle descriptor is registered yet, so that clinical content is not validated and
  would be lost on a moddle re-save. Registering the descriptors is a tracked
  follow-up; do not "fix" it by deleting the extension content.
- **XSD `fails to validate`** → informational; the standard XSD cannot see extension
  content (it passes via `processContents="lax"`), and the `cp:`/colour attributes
  are expected to fail core validation. A green XSD does **not** mean the extensions
  are valid — that is the roundtrip's concern.

Never claim "XSD green ⇒ everything valid". State which layers passed and which are
informational.

> This skill covers only the **automatable (A)** acceptance-test criteria. The clinical (SEM)
> and pragmatic (PRA) criteria, the three acceptance-test gates, and the overall decision
> are human — see `docs/governance/`.
