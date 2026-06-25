# GitHub Copilot — repository instructions

This repository's canonical operational context is **[`AGENTS.md`](../AGENTS.md)**.
Read it first; this file is only a thin bridge so Copilot picks up the same single
source. Do not duplicate content here.

Essentials:

- **What this is:** BPMN 2.0 models of the lung-cancer patient pathway (model-only,
  published CC BY 4.0). `.bpmn` = source, `.svg` = derived (re-export on change).
- **Not for clinical use** — see [`DISCLAIMER.md`](../DISCLAIMER.md). Never weaken it.
- **Quality gate:** `npm run check:conformance` (bpmnlint + model metrics blocking;
  roundtrip + XSD informational). The decision lives in the tool, never the model.
- **No OR-gateways**, verb+object labels, decompose > ~50 elements — see
  [`CONVENTIONS.md`](../CONVENTIONS.md) and [`docs/governance/`](../docs/governance/).
- **Branching:** PR into `dev`; `main` is for releases; never push directly or self-merge.
- **Skills:** discoverable via `.agents/skills` / `.claude/skills` → `../skills`
  (`skills/bpmn-conformance/SKILL.md`).
- **No real patient data**; synthetic/abstract content only.
