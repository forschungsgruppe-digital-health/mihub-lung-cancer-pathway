---
name: model-inventory
description: Produce a Markdown inventory matrix of the BPMN pathway models (the overarching pathway + sub-pathways) — their scope, lanes/roles, gateways, Call Activities/decomposition, quality indicators (cp:), and start/end events. Use to get a first-pass map of what the model set contains for review or documentation. Read-only — reports for human review, never edits.
---

# Model inventory

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
does not decide. Cross-link to `docs/governance/` for the acceptance view and to
`CONVENTIONS.md` for the rules.

## Rules

- Read-only; never edit a model or delete anything.
- Do not assign an acceptance status — that is the Abnahme instrument's and the human
  reviewers' job.
