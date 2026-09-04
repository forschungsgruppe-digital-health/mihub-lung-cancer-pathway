# 0001 — Repository tooling, conformance gate, and declared conformance class

- Status: accepted
- Date: 2026-06-25
- Deciders: Forschungsgruppe Digital Health (FGDH), TU Dresden
- Context: introducing the first automated quality checks to a previously
  model-only, openly-published (CC BY 4.0) BPMN patient-pathway repository.

## Context

The repository ships seven BPMN 2.0 models (one overarching pathway + six
sub-pathways) *(count as of 2026-06-25 — the screening pathway was added the same day
([ADR-0004](0004-repo-structure-and-model-naming.md)) and palliative-care on 2026-06-29 with
`v0.3.0-rc.1`; status 2026-09-04: **nine** models, one overarching + eight sub-pathways, see
[`models/README.md`](../../models/README.md))* as `.bpmn` sources plus `.svg` renders, with a strong written
modelling guideline (`CONVENTIONS.md`) and a proposed acceptance-test instrument (the
"Abnahmetest", now in `docs/governance/`). It had **no automated checks**. We want a
reproducible conformance gate that mechanises the *automatable* acceptance-test criteria
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

## Decision 2 — Declared conformance class: **Analytic** (minus OR-gateways)  *(acceptance-test SYN-1)*

The acceptance-test SYN-1 requires a declared BPMN 2.0 conformance sub-class. The models use
timer / message / boundary events and sub-processes (beyond **Descriptive**) but no
engine-execution attributes (below **Common Executable**), so the target class is
**Analytic**. As a house restriction (CONVENTIONS R5 / acceptance-test SYN-5) the subset
**excludes OR (`inclusiveGateway`) and `complexGateway`**.

This declaration is the anchor SYN-1 checks against. **Known deviation:** four
`inclusiveGateway`s currently exist (treatment ×2, aftercare ×2) — see Decision 3. *(As of
2026-06-25; status 2026-09-04: 9 models, 13 OR-gateways — treatment 2, aftercare 4,
palliative-care 7 — tracked in [`docs/model-issues/`](../model-issues/README.md).)*

## Decision 3 — Conformance gate composition, and an intentionally-noisy baseline (advisory in CI)

`npm run check:conformance` aggregates four layers (five since the naming layer of
[ADR-0004](0004-repo-structure-and-model-naming.md) was added — table row added 2026-09-04) and reports all of them. Locally
(STRICT default) it fails on the blocking layers; in CI during the RC/pre-remodel phase
it runs ADVISORY (warn-only via `CONFORMANCE_WARN_ONLY`) — it reports every finding as
`::warning::` and exits 0, so it does not fail the check or block PRs. The 'Blocking'
column below is the local STRICT behaviour:

| Layer | Tool | Blocking (local STRICT) |
|---|---|---|
| naming *(row added 2026-09-04)* | `tools/check-naming.mjs` — `lung-cancer-<phase>-pathway.{bpmn,svg}`, paired `.svg` per `.bpmn` ([ADR-0004](0004-repo-structure-and-model-naming.md)); also run as a separate, blocking `npm run check:naming` CI step independent of the warn-only aggregator | **yes** |
| structure | bpmnlint (recommended + correctness, `no-inclusive-gateway`=error), run programmatically so `cp:`/`i18n:` extension content does not drown the signal | **yes** |
| conventions | `tools/check-model-metrics.mjs` — SYN-5 no-OR (blocking); SYN-2/SYN-4/lanes/prefix (advisory) | **yes** on OR-gateways |
| extension data | `tools/moddle-roundtrip.mjs` — serialization stability + `cp:`/`i18n:` presence. *Since commit 79cde22 (2026-06-25):* the BPMN4CP `cp:` descriptor `tools/moddle/bpmn4cp.json` (registered in `tools/moddle/descriptors.mjs`) makes the roundtrip lossless; `i18n:` content is passed through | informational when written → **yes** since 79cde22 |
| standard core | `tools/validate-xsd.sh` — OMG BPMN20.xsd | informational *(status 2026-09-04: fails on 5 of 9 models because `cp:qualityIndicator` sits outside `bpmn:extensionElements` — see [`../model-issues/2026-09-04-xsd-core-extension-placement.md`](../model-issues/2026-09-04-xsd-core-extension-placement.md); exit 0 by design)* |

**The gate surfaces the real baseline on the current models by design** (and in CI reports it warn-only, without failing the check) — namely:
99 bpmnlint structural errors (disconnected nodes, implicit start/end, missing
labels, multiple blank start events), the four OR-gateways, and unformalised
`cp:`/`i18n:` extension content. We add the gate first (this PR) so the baseline is
visible and tracked; **greening it is deliberate follow-up work** that needs
modelling and clinical judgment and must not be done by an agent unilaterally.

## Consequences

- The conformance check runs **advisory (warn-only)** in CI today, so it passes
  (reports findings as warnings) and does not block merges. **Hard enforcement is
  re-enabled after the remodel** by removing `CONFORMANCE_WARN_ONLY` and then making
  the conformance check a required check for `main`/`dev` branch protection.
  **Status 2026-09-04:** still warn-only (`CONFORMANCE_WARN_ONLY` set in `.github/workflows/ci.yml`);
  `main` is governed by a ruleset with 0 required approvals and no required status check, by
  design during the RC phase (see [ADR-0002](0002-versioning-and-release.md), amended open
  items). The naming layer is enforced separately as a blocking `npm run check:naming` CI step.
- **Follow-ups (separate PRs):** (a) remodel the four OR-gateways to XOR/AND and fix
  the structural defects (re-export the `.svg`s) — *status 2026-09-04: open; the count is now
  13 (treatment 2, aftercare 4, palliative-care 7), see [`docs/model-issues/`](../model-issues/README.md)*;
  (b) register `cp:` (BPMN4CP) +
  `i18n:` moddle descriptors so the roundtrip validates the extension data losslessly —
  **done 2026-06-25, commit 79cde22** (`tools/moddle/bpmn4cp.json` registered in
  `tools/moddle/descriptors.mjs`; the roundtrip is lossless and now blocking; `i18n:` is passed
  through without a descriptor of its own);
  (c) later phases add behavioural soundness (STR-1..4) and the advisory clinical
  review (see `skills/README.md` "Planned") — **done:** soundness per
  [ADR-0003](0003-soundness-tooling.md) (`tools/check-soundness.mjs`, `npm run check:soundness`,
  advisory CI job `.github/workflows/soundness.yml`, skill `skills/bpmn-soundness`); the advisory
  clinical review exists as the skill `skills/clinical-pathway-review`.
- Advisory metrics thresholds (SYN-2 cardinality, SYN-4 ≤50) stay non-blocking until
  the conformance class and decomposition strategy are confirmed against the models.
