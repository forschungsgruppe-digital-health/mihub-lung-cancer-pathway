# 0001 — Repository tooling, conformance gate, and declared conformance class

- Status: accepted
- Date: 2026-06-25
- Deciders: Forschungsgruppe Digital Health (FGDH), TU Dresden
- Context: introducing the first automated quality checks to a previously
  model-only, openly-published (CC BY 4.0) BPMN patient-pathway repository.

## Context

The repository ships seven BPMN 2.0 models (one overarching pathway + six
sub-pathways) as `.bpmn` sources plus `.svg` renders, with a strong written
modelling guideline (`CONVENTIONS.md`) and a proposed acceptance instrument (the
"Abnahme", now in `docs/governance/`). It had **no automated checks**. We want a
reproducible conformance gate that mechanises the *automatable* Abnahme criteria
without changing the nature of the published artifact.

Three decisions were coupled and are recorded together.

## Decision 1 — Toolchain footprint: a committed `package.json`, `node_modules` git-ignored

We add a **`private`, devDependencies-only `package.json`** (`type: module`) and a
`tools/` directory, run in CI via `npm ci`. We considered a fully container/CI-only
approach (no `package.json`, `npx`/`docker run` in CI) to keep the repo "artifact
pure", but the checks need **custom logic** (bpmnlint run programmatically with the
extension-laden models, a bespoke model-metrics script) and reproducible, pinned
tool versions — which a lockfile provides cleanly.

Artifact purity is preserved a different way: **`node_modules/` is git-ignored and
never committed**, and the published artifacts remain the `*.bpmn` / `*.svg` / `docs`
(CC BY 4.0). The tooling `package.json` is licensed `CC-BY-4.0` and marked `private`
(never published to a registry).

## Decision 2 — Declared conformance class: **Analytic** (minus OR-gateways)  *(Abnahme SYN-1)*

The Abnahme SYN-1 requires a declared BPMN 2.0 conformance sub-class. The models use
timer / message / boundary events and sub-processes (beyond **Descriptive**) but no
engine-execution attributes (below **Common Executable**), so the target class is
**Analytic**. As a house restriction (CONVENTIONS R5 / Abnahme SYN-5) the subset
**excludes OR (`inclusiveGateway`) and `complexGateway`**.

This declaration is the anchor SYN-1 checks against. **Known deviation:** four
`inclusiveGateway`s currently exist (treatment ×2, aftercare ×2) — see Decision 3.

## Decision 3 — Conformance gate composition, and an intentionally-red baseline

`npm run check:conformance` aggregates four layers and reports all of them, failing
only on the blocking ones:

| Layer | Tool | Blocking |
|---|---|---|
| structure | bpmnlint (recommended + correctness, `no-inclusive-gateway`=error), run programmatically so `cp:`/`i18n:` extension content does not drown the signal | **yes** |
| conventions | `tools/check-model-metrics.mjs` — SYN-5 no-OR (blocking); SYN-2/SYN-4/lanes/prefix (advisory) | **yes** on OR-gateways |
| extension data | `tools/moddle-roundtrip.mjs` — serialization stability + `cp:`/`i18n:` presence | informational |
| standard core | `tools/validate-xsd.sh` — OMG BPMN20.xsd | informational |

**The gate fails on the current models by design** — it surfaces the real baseline:
99 bpmnlint structural errors (disconnected nodes, implicit start/end, missing
labels, multiple blank start events), the four OR-gateways, and unformalised
`cp:`/`i18n:` extension content. We add the gate first (this PR) so the baseline is
visible and tracked; **greening it is deliberate follow-up work** that needs
modelling and clinical judgment and must not be done by an agent unilaterally.

## Consequences

- CI is red until the follow-ups land. **Do not enable `main`/`dev` branch
  protection on the conformance check until the remodel PR greens it.**
- **Follow-ups (separate PRs):** (a) remodel the four OR-gateways to XOR/AND and fix
  the structural defects (re-export the `.svg`s); (b) register `cp:` (BPMN4CP) +
  `i18n:` moddle descriptors so the roundtrip validates the extension data losslessly;
  (c) later phases add behavioural soundness (STR-1..4) and the advisory clinical
  review (see `skills/README.md` "Planned").
- Advisory metrics thresholds (SYN-2 cardinality, SYN-4 ≤50) stay non-blocking until
  the conformance class and decomposition strategy are confirmed against the models.
