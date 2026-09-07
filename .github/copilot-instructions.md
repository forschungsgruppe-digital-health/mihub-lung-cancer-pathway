# GitHub Copilot — repository instructions

This repository's canonical operational context is **[`AGENTS.md`](../AGENTS.md)**.
Read it first; this file is only a thin bridge so Copilot picks up the same single
source. Do not duplicate content here.

Essentials:

- **What this is:** BPMN 2.0 models of the lung-cancer patient pathway (model-only,
  published CC BY 4.0). `.bpmn` = source, `.svg` = derived (re-export on change).
- **Not for clinical use** — see [`DISCLAIMER.md`](../DISCLAIMER.md). Never weaken it.
- **Quality gate:** `npm run check:conformance` (naming + bpmnlint + model metrics +
  roundtrip blocking; XSD core informational). In CI the aggregator runs advisory during
  the release-candidate phase, while the naming convention runs as its own blocking step.
  The decision lives in the tool, never the model.
- **No OR-gateways**, verb+object labels, decompose > ~50 elements — see
  [`CONVENTIONS.md`](../CONVENTIONS.md) and [`docs/governance/`](../docs/governance/).
- **Branching:** PR into `dev`; `main` is for releases; never push directly or self-merge.
- **Skills:** discoverable via `.agents/skills` / `.claude/skills` → `../skills`:
  `bpmn-conformance`, `bpmn-acceptance`, `bpmn-soundness`, `clinical-pathway-review`,
  `model-inventory` — catalog in [`skills/README.md`](../skills/README.md).
- **No real patient data**; synthetic/abstract content only.
- **AI usage is disclosed** in [`AI_USAGE.md`](../AI_USAGE.md) (EU AI Act Art. 50 / COPE).
  Every AI-assisted commit carries a `Co-Authored-By: <tool/model> <address>` trailer and every
  AI-drafted PR or issue ends with a "🤖 Generated with …" footer; keep `AI_USAGE.md` current
  whenever a new tool, model version or AI-assisted artifact class appears. The models stay
  human-only — never edit `.bpmn`/`.svg`; report findings to `docs/model-issues/` instead.
