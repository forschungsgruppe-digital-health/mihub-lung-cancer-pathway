---
name: clinical-pathway-review
description: Advisory, read-only review of a lung-cancer BPMN pathway against the Abnahme clinical (SEM) and pragmatic (PRA) criteria. Use to prepare evidence for the clinical/pragmatic acceptance gates. Produces findings only — it NEVER returns a pass/fail and never substitutes for the human consensus (SEM-6) or joint walkthrough (PRA-1).
---

# Clinical pathway review (advisory)

> **🔒 Model guard — read-only.** Never edit or modify a `.bpmn` model or its `.svg` export.
> The models are clinically validated (Abnahme **SEM-6** face validity) and change only via a
> human modeler + re-validation. Surface findings as candidates and **report** any BPMN-XML
> problem in [`docs/model-issues/`](../../docs/model-issues/) with a GitHub-issue suggestion
> ([template](../../.github/ISSUE_TEMPLATE/bpmn-model-issue.md)) — never change the model.
> Enforced in Claude Code by the `guard-model-files` PreToolUse hook.

You produce **evidence and questions for the human reviewers**, not verdicts. The
clinical and pragmatic acceptance gates are decided by people (see `docs/governance/`).
This is the only skill in the repo that is LLM-judgment rather than a deterministic
tool, so be explicit about uncertainty and cite the element ids / labels you reason from.

## Scope (advisory only)

Read the `.bpmn` / `.svg` and the modelling reference (`CONVENTIONS.md`) and surface
findings for these Abnahme criteria:

| Abnahme | What to look for | Output |
|---|---|---|
| **SEM-2** guideline/evidence reference | activities that should cite S3-LL / nNGM but carry no annotation | a list of candidates |
| **SEM-3** essential steps complete | missing restaging / aftercare / follow-up vs. the expected course | gaps to confirm |
| **SEM-4** transitions tied to deadlines/criteria | gateways/edges with vague conditions; missing timer events at time-critical points | candidates |
| **SEM-5** target population/scope delimited | whether the scope (e.g. NSCLC stage III–IV) is stated | present / absent |
| **SEM-7** domain artifacts (BPMN4CP) | quality indicators (`cp:qualityIndicator`), resources, documents present where expected | inventory + gaps |
| **PRA-2** stakeholder views | whether an overview and a technical view exist/could be derived | observation |
| **PRA-3** relevance | elements that look superfluous for the acceptance purpose | candidates (gentle) |
| **SYN-3** (final, labels) | verb-object label deviations bpmnlint cannot judge (German clinical grammar) | candidates |

## Hard rules

- **Never** output an acceptance decision, gate verdict, or a ✓/✗ on any criterion.
  Phrase everything as "candidate", "to confirm with a clinician", or "gap to verify".
- **SEM-1** (multidisciplinary completeness), **SEM-6** (expert consensus, K), and
  **PRA-1** (joint walkthrough, R) are **human-only** — you may note observations but
  must not claim them satisfied.
- Do not edit models or documents. Read-only.
- Flag any content that looks like **real patient data** (these models must contain
  only synthetic/abstract content) as a priority finding.

The deterministic A-criteria (SYN/STR) are handled by `bpmn-conformance` and the
`bpmn-acceptance` Protokoll pre-filler — do not duplicate them here.
