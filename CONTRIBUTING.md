# Contributing

Thank you for helping improve the MiHUB lung-cancer patient-pathway models. This guide
covers how to edit the models, run the checks, and propose a change. The modelling
rules themselves live in [`CONVENTIONS.md`](CONVENTIONS.md); the acceptance criteria in
[`docs/governance/`](docs/governance/). Please also read the
[`DISCLAIMER.md`](DISCLAIMER.md) and the [Code of Conduct](CODE_OF_CONDUCT.md).

## Before anything else

- **No real patient data.** Use only synthetic / abstract content. Never commit
  real patient data — not even realistic-looking data.
- **Not for clinical use.** These are research/reference models; do not weaken the
  intended-use disclaimer.

## Repository layout

| Path | What |
|---|---|
| `lung-cancer_*.bpmn` | the BPMN 2.0 model **sources** (edit these) |
| `lung-cancer_*.svg` | the **derived** renders — re-export when the `.bpmn` changes |
| `CONVENTIONS.md` | modelling guideline (the reference) |
| `docs/governance/` | the Abnahme acceptance instrument |
| `docs/decisions/` | architecture/modelling decision records (ADRs) |
| `tools/`, `package.json` | dev/CI conformance tooling (not part of the published artifact) |

## Editing a model

1. Open the `.bpmn` in a BPMN 2.0 editor — e.g. [demo.bpmn.io](https://demo.bpmn.io/)
   (no install) or the [Camunda Modeler](https://camunda.com/download/modeler/).
2. Follow [`CONVENTIONS.md`](CONVENTIONS.md): verb-object labels, **no OR-gateways**
   (use XOR/AND), one start / named ends per level, decompose levels > ~50 elements
   via Call Activities, declared conformance class **Analytic** (see
   [`docs/decisions/0001`](docs/decisions/0001-repo-tooling-and-conformance-gate.md)).
3. **Re-export the matching `.svg`** and commit both files together (the `.bpmn` is the
   source of truth; the `.svg` must not drift).

## Running the checks

Prerequisites: Node ≥ 18 (e.g. via nvm). Install once, then run the gate:

```bash
npm ci
npm run check:conformance     # bpmnlint + model metrics + roundtrip + XSD core
```

The decision lives in the tools, not in the model. Blocking layers: bpmnlint
(structure) and the no-OR model-metrics check. Informational layers: serialization
roundtrip and XSD core. See [`skills/bpmn-conformance/SKILL.md`](skills/bpmn-conformance/SKILL.md)
for how to read the output.

> The gate is currently **red on the existing models by design** (pre-existing
> structural defects + OR-gateways) — see [`docs/decisions/0001`](docs/decisions/0001-repo-tooling-and-conformance-gate.md).
> When you touch a model, aim to leave it no worse; the planned remodel will green it.

## Commits, branches, and pull requests

- **Conventional Commits**, scope = the pathway file:
  `feat(treatment)!: replace OR-gateway with XOR`, `docs(governance): …`,
  `fix(aftercare): add missing end event`. A `!` (or `BREAKING CHANGE:`) marks a change
  that alters the pathway's structure/semantics (see the versioning policy in
  [`docs/decisions/0002`](docs/decisions/0002-versioning-and-release.md)).
- **Branch off `dev`** and open a **pull request into `dev`** (`gh pr create --base dev`).
  `dev` is the active-development branch; `main` is for **releases**. Do **not** push
  directly to `dev`/`main`, and never `git push origin dev:main`. Promotion is a
  separate `dev` → `main` PR.
- **One logical change per PR**; keep diffs reviewable. A human reviews and merges —
  please don't self-merge. The PR template lists the checks to confirm.

## Review & acceptance

Routine PRs get a peer review against [`CONVENTIONS.md`](CONVENTIONS.md) §8.1 and the
conformance gate. A **formal acceptance** ("Abnahme") of a pathway additionally runs
the [governance instrument](docs/governance/): a technical gate (tools), a clinical
gate (expert consensus), and a pragmatic gate (joint walkthrough), recorded in a
signed Protokoll. Tools prepare evidence; humans decide.

## Reporting issues

Report bugs, model defects, and change requests via the repository's **GitHub issue tracker**
(the *Issues* tab): <https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues>.
Use the provided templates — e.g. **BPMN model issue** for a problem with a `.bpmn` model.
Issue templates are bilingual (DE + EN). For BPMN-XML problems surfaced by a tool or agent,
see [`docs/model-issues/`](docs/model-issues/): tools/agents record findings there (they never
edit a model), and a human files the issue from that finding.

## Language

The repository default language is **German** (README, `CONVENTIONS.md`, the governance
instrument). **Technical documentation is in English** (ADRs, `AGENTS.md`, this file,
`docs/model-issues/`). The Abnahme governance instrument (`docs/governance/`) is **bilingual**
(German original + English translation, kept at the same version). New **issue templates are
always provided in both languages**.

## Questions

Open a [GitHub issue](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues)
or contact digital-health@tu-dresden.de.
