---
name: model-inventory
description: Produce a Markdown inventory matrix of the BPMN pathway models (the overarching pathway + sub-pathways) — their scope, lanes/roles, gateways, Call Activities/decomposition, quality indicators (cp:), and start/end events. Use to get a first-pass map of what the model set contains for review or documentation. Read-only — reports for human review, never edits.
---

# Model inventory

> **🔒 Model guard — read-only.** Never edit or modify a `.bpmn` model or its `.svg` export.
> The models are clinically validated (acceptance-test **SEM-6** face validity) and change only via a
> human modeler + re-validation. If you notice a BPMN-XML problem while inventorying, **report
> it** in [`docs/model-issues/`](../../docs/model-issues/) with a GitHub-issue suggestion
> ([template](../../.github/ISSUE_TEMPLATE/bpmn-model-issue.md)) — never change the model.
> Enforced in Claude Code by the `guard-model-files` PreToolUse hook.

Build a first-pass **Feature/Model Inventory Matrix** across the seven `.bpmn` files
so a reviewer can see the whole pathway set at a glance. Read-only.

## How

Prefer the existing tooling for the mechanical counts, then summarise:

```bash
npm run check:metrics      # per-file: levels, start/end events, gateways, lanes, prefix
```

For deeper structure, parse with bpmn-moddle + the cp: descriptor
(`tools/moddle/descriptors.mjs`) — e.g. to list `cp:qualityIndicator`s, Call Activities,
and lanes per model.

## Output — a Markdown table, one row per model

| Model | Scope (from labels/docs) | Levels | Start/End | Gateways (XOR/AND/**OR**) | Lanes / roles | Call Activities | Quality indicators (cp:) | Notes |
|---|---|---|---|---|---|---|---|---|

Then a short narrative: the decomposition map (overarching → which sub-pathways via Call
Activity), and any **preliminary** observations (e.g. files carrying OR-gateways, files
with no lanes). Mark maturity/observations as **PRELIMINARY** — this skill suggests, it
does not decide. Cross-link to `docs/governance/` for the acceptance-test view and to
`CONVENTIONS.md` for the rules.

## Rules

- Read-only; never edit a model or delete anything.
- Do not assign an acceptance-test status — that is the acceptance-test instrument's and the human
  reviewers' job.
