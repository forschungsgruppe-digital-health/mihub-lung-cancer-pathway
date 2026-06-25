# 0003 — Behavioural soundness tooling (STR-1…STR-4)

- Status: accepted (approach); **implementation deferred to a piloted follow-up**
- Date: 2026-06-25
- Deciders: Forschungsgruppe Digital Health (FGDH), TU Dresden
- Relates: [`0001-repo-tooling-and-conformance-gate.md`](0001-repo-tooling-and-conformance-gate.md),
  the Abnahme instrument (`../governance/`).

## Context

Abnahme criteria **STR-1…STR-4** are the Muss soundness properties: option-to-complete
(STR-1), proper completion / no leftover tokens (STR-2), no dead/unreachable activities
(STR-3), no deadlock/livelock (STR-4). bpmnlint does **not** decide these (its
`no-disconnected` is only partial STR-3 hygiene); they require a model checker. Until
one is integrated and validated, the `bpmn-acceptance` Protokoll pre-filler keeps
STR-1…STR-4 as `HUMAN-INPUT-NEEDED`.

## Decision — tool choice

Use **[`timKraeuter/rust_bpmn_analyzer`](https://github.com/timKraeuter/rust_bpmn_analyzer)**
— a BPMN-specific model checker (MIT, actively maintained; last push 2026-06-02) that
checks safeness, option-to-complete, proper-completion, no-dead-activities and
deadlock/livelock via state-space exploration, with partial-order reduction (`--por`)
for parallel models. It maps 1:1 onto STR-1…STR-4. (Its `bpmn-analyzer-js` sibling is the
browser UI; we want the Rust **CLI** core.)

## Why implementation is DEFERRED (not shipped in the gate yet)

Three load-bearing facts make a *piloted* integration mandatory before we trust it:

1. **No release / no published image** (0 GitHub releases, no crate, no ghcr image).
   It must be **built from source** and pinned. → ship it as a **Docker image pinned by
   `sha256` digest** (not a tag, not `master`), so a CC-BY-DOI'd artifact's checks stay
   reproducible.
2. **Exit-code trap.** The CLI is reported to `process::exit(1)` only on a *parse/read*
   error; on an actual soundness **violation** it prints results and **exits 0**. A
   naïve CI step would therefore **always pass**. → the wrapper (`tools/check-soundness.mjs`)
   MUST parse the result payload (`property_results[].fulfilled`, or equivalent) and set
   the exit code itself.
3. **Element-support risk.** These models use BPMN4CP `cp:` extensions, message flows,
   boundary events, multiple pools, and (in the overarching pathway) multiple start
   events. The analyzer parses a pragmatic BPMN subset. → a **one-time pilot** must run
   it over all seven files to confirm nothing trips `unsupported_elements`, and
   **benchmark the 130 KB overarching pathway** (state space can blow up; `--por`
   mitigates).

## Pilot protocol (run once, on a Docker-capable host)

1. Build a multi-stage image from the pinned source commit; record the `sha256` digest.
2. Run the CLI over each of the 7 `.bpmn`; capture the per-property results and timing.
3. Confirm: (a) no `unsupported_elements` for the cp:/message-flow/boundary-event/multi-pool
   constructs; (b) the overarching pathway completes in acceptable time with `--por`.
4. If any file is unmodelable, define the **TOOL-INCONCLUSIVE → human-review** degraded
   mode (the wrapper exits with a distinct "inconclusive" status that neither falsely
   passes nor hard-blocks).

## Consequences / scope boundaries

- After a green pilot: add `tools/check-soundness.mjs` (Docker-digest-pinned + result
  parsing + inconclusive fallback) and a `bpmn-soundness` CI job; flip STR-1…STR-4 in the
  Protokoll pre-filler from `HUMAN-INPUT-NEEDED` to tool-decided.
- **Inter-process soundness is NOT covered** by checking the 7 files independently: the
  overarching pathway calls sub-pathways via Call Activities; composition correctness
  stays a human-review item (CONVENTIONS §8.2 clinical validation).
- **pm4py** (`check_soundness`/WOFLAN) is a *cross-check only* and is **AGPL-3.0** — usable
  as a separate, non-bundled CI process, never vendored/redistributed with the CC-BY model.
- Docker is available on the maintainers' host, so the pilot is ready to run as the next
  focused step; this ADR is the spec for it.
