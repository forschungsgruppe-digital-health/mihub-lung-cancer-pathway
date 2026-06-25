---
name: bpmn-soundness
description: Run the behavioural soundness check (Abnahme STR-1..4) on the pathway models via the rust_bpmn_analyzer model checker (pinned Docker image), classifying each model SOUND / VIOLATION / INCONCLUSIVE. Use to gather STR evidence. Advisory — an INCONCLUSIVE (unsupported elements) is never a pass, and the overall acceptance stays human.
---

# BPMN soundness (advisory)

The verdict comes from the analyzer's JSON, **not** from "did the tool run" — the API
returns HTTP 200 even for a violating or unsupported model (the exit-0 trap). The
wrapper handles this; your job is to run it and read the result honestly.

## Run

Start the analyzer (pinned by digest), then run the wrapper:

```bash
docker run -d --platform linux/amd64 -p 8090:8080 \
  tkra/rust_bpmn_analyzer@sha256:9d939b84e82ca0ef55e9b34847d55bacd32b293fc7ef670e53d37d2ebcd3778c
SOUNDNESS_URL=http://localhost:8090/check_bpmn npm run check:soundness
# add -- --strict to fail on a SUPPORTED model's violation
```

If the analyzer is not reachable, the wrapper skips (advisory, exit 0). In CI this runs
non-blocking via `.github/workflows/soundness.yml` (the analyzer as a service container).

## Interpreting results (per model)

| Result | Meaning | Abnahme |
|---|---|---|
| **SOUND** | all four properties fulfilled | STR-1…4 evidence = OK |
| **VIOLATION** | a supported model violates a property: OptionToComplete=STR-1, ProperCompletion=STR-2, NoDeadActivities=STR-3; a deadlock/livelock (STR-4) shows as OptionToComplete=✗ | a real STR finding — fix the model |
| **INCONCLUSIVE** | model uses unsupported elements (`unsupported_elements`: OR-gateways, `intermediateCatchEvent`s) | **human review / remodel — NOT a pass** |

## Hard rules

- **Never** treat INCONCLUSIVE as sound, and never flip the `bpmn-acceptance` Protokoll
  STR rows from `HUMAN-INPUT-NEEDED` to ✓ on an INCONCLUSIVE result.
- As of the 2026-06-25 pilot, **4 of 7 models are inconclusive** (OR-gateways + catch
  events) and the 3 analyzable ones violate on existing structural defects — so this is
  **advisory** until the model remodel. See `docs/decisions/0003-soundness-tooling.md`.
- Inter-process (Call Activity composition) soundness is **not** covered by checking the
  files independently — that stays human review.
