# AGENTS.md — MiHUB Lung-Cancer Patient Pathway

Operational context for AI coding agents (Claude Code, Codex, Cursor, Gemini CLI,
Copilot — anything that reads the open AGENTS.md standard). Single source of truth:
tool-specific files (e.g. `CLAUDE.md`) only point here. Keep this lean — the project
narrative lives in `README.md`, the modelling rules in `CONVENTIONS.md`, the
acceptance-test gate in `docs/governance/`; do not duplicate them.

## What this repo is

A set of **BPMN 2.0 models of the lung-cancer patient pathway** (one overarching
pathway + seven sub-pathways: screening, diagnostic, patient-consultation, tumor-board,
molecular-tumor-board, treatment, aftercare), developed in the MiHUB project (TU Dresden /
Forschungsgruppe Digital Health). The models live under `models/` (naming convention
`lung-cancer-<phase>-pathway`, ADR-0004); each `.bpmn` source has a paired `.svg` render. The repository is **model-only** and is **published openly under CC BY 4.0**
(a Zenodo DOI is planned). There is no application here.

> ⚠️ **Intended use.** These models are a research / education / interoperability
> reference artifact. They are **not** clinically validated and **must not** be used
> for direct patient care or clinical decision-making. See [`DISCLAIMER.md`](DISCLAIMER.md).

## Artifacts vs. tooling

- **Published artifacts:** the `*.bpmn` + `*.svg` models and the `docs/` (CC BY 4.0).
- **Dev/CI tooling:** a `package.json` (devDependencies only, `private`, `type: module`)
  plus `tools/`. `node_modules/` is **git-ignored and never committed** — so the
  toolchain never pollutes the published artifact. Rationale: [`docs/decisions/0001`](docs/decisions/0001-repo-tooling-and-conformance-gate.md).
- **`.bpmn` is the source; `.svg` is derived.** When a model changes, re-export the
  matching `.svg` in the same commit.

## Quality gate — one source, every runner

Every check is a deterministic CLI under `tools/`, wired to an npm script. **The
decision lives in the tool, never in the model.** A green local run ⇒ a green CI run.

| Layer | Command | Severity |
|---|---|---|
| bpmnlint (BPMN structure/correctness, `no-inclusive-gateway`=error) | `npm run lint:bpmn` | **Blocking** |
| model metrics (Abnahmetest SYN-5 no-OR blocking; SYN-2/4, lanes, prefix advisory) | `npm run check:metrics` | **Blocking** on OR-gateways |
| moddle roundtrip (serialization stability; `cp:`/`i18n:` extension presence) | `npm run check:roundtrip` | Informational |
| XSD core (OMG BPMN20.xsd) | `npm run check:xsd` | Informational |
| **all of the above (full report, blocks on the blocking layers)** | `npm run check:conformance` | **the gate** |

Run `npm ci` once (Node ≥ 18), then `npm run check:conformance`. To register a new
`.bpmn` location, edit `ROOTS` in `tools/bpmn-files.mjs` (the single file-discovery source).

> The gate currently **fails on purpose**: the existing models carry structural
> defects, four `bpmn:InclusiveGateway`s (OR), and unformalised `cp:`/`i18n:`
> extension content. Greening it is tracked work (see `docs/decisions/0001`), and it
> requires modelling + clinical judgment — agents must not "fix" pathway logic
> unilaterally.

## Acceptance Test (the human + tool gate)

Formal sign-off of a model uses the **Acceptance Test instrument** in
[`docs/governance/`](docs/governance/) (Checkliste / Handout / Protokoll, v0.3.1).
Method column: **A** = automatable tool (the gate above), **R** = review, **K** =
consensus. The automatable criteria (SYN-1/2/4/5, STR-1..4) are tooled; the clinical
(SEM) and pragmatic (PRA) criteria, the three gates, and the overall decision are
**human** — no tool or agent may stamp acceptance test.

## Conventions (see `CONVENTIONS.md` for the full reference — link, don't restate)

- **Labels:** verb + object for activities; gateways as questions (SYN-3).
- **No OR-gateways** (use XOR/AND) — SYN-5 / CONVENTIONS R5; enforced by the gate.
- **Declared conformance class: Analytic** (minus OR-gateways) — see `docs/decisions/0001`.
- **Decompose** levels > ~50 elements via Call Activities (SYN-4).
- **Conventional Commits**; scope = the pathway file (`feat(aftercare)!: …`, `docs(overarching): …`).
- **Language:** the repo default is **German** (README, CONVENTIONS, governance instrument).
  **Technical documentation is written in English** (ADRs in `docs/decisions/`, this file,
  `CONTRIBUTING.md`, `docs/model-issues/`, tool docstrings/comments). The Abnahmetest governance
  instrument (`docs/governance/`) is **bilingual** (DE original + EN translation, same version).
  **Issue templates are always bilingual (DE + EN).**

## Branching and pull requests

- `dev` is the active-development branch; `main` is for **releases** (the default
  branch stays `main`).
- Land **every change as a pull request into `dev`** (`gh pr create --base dev`),
  bundling its commits. Do **not** push directly to `dev`/`main`, and never
  `git push origin dev:main`. Promotion is a separate **`dev` → `main`** PR.
- One logical change per PR; keep diffs reviewable; a human reviews and merges —
  **agents do not self-merge**.

## Agent skills (cross-vendor)

Reusable workflows live once under `skills/<name>/SKILL.md` (the single source).
Claude Code discovers them via `.claude/skills` → `../skills`; Codex/Copilot via
`.agents/skills` → `../skills`. Never copy a skill body into a pointer file.

| Skill (open this) | Fires when you… | Gate / output |
|---|---|---|
| `skills/bpmn-conformance/SKILL.md` | edit any `**/*.bpmn` | `npm run check:conformance` |
| `skills/bpmn-acceptance/SKILL.md` | prepare a formal acceptance test | `npm run abnahme:protokoll` (evidence only; never stamps acceptance test) |
| `skills/clinical-pathway-review/SKILL.md` | review SEM/PRA criteria | advisory findings (read-only) |
| `skills/model-inventory/SKILL.md` | map the model set | Model Inventory Matrix (read-only) |
| `skills/bpmn-soundness/SKILL.md` | check STR-1…4 soundness | `npm run check:soundness` (advisory; needs the analyzer container) |

## Hard rules (do not violate)

- **🔒 NEVER modify a `.bpmn` model or its `.svg` export.** The models are the
  clinically-validated artifact (Abnahmetest **SEM-6** face validity); changes are made only
  by a **human modeler** and re-validated. Agents are **read-only** w.r.t. the models —
  this also forbids renaming, reformatting, `sed -i`, and redirect/`tee` writes. Found a
  BPMN-XML issue? **Report it** in [`docs/model-issues/`](docs/model-issues/) with a
  ready-to-file GitHub-issue suggestion ([template](.github/ISSUE_TEMPLATE/bpmn-model-issue.md)) —
  never fix it. Enforced for Claude Code by the `guard-model-files` PreToolUse hook
  (`.claude/hooks/guard-model-files.sh`, wired in `.claude/settings.json`); other tools
  must honor it. (Humans editing models follow `CONTRIBUTING.md`.)
- **No real patient data.** Use only synthetic / abstract pathway content. Never
  commit patient data, even realistic-looking.
- **Not for clinical use.** Do not remove or weaken `DISCLAIMER.md` or the README
  intended-use banner. Any change to legal/intended-use text needs human sign-off
  (TU Dresden Justiziariat / DPO).
- **Preserve attribution.** This artifact is CC BY 4.0; keep the licence, attribution,
  and third-party credits (gematik INA, CraNE) intact.
- Do not change BPMN core structure to carry clinical meaning — clinical context
  belongs in `<extensionElements>` (e.g. `cp:` BPMN4CP), not the `bpmn:` namespace.

## Where to look first

- Modelling rules: `CONVENTIONS.md`
- Acceptance-test gate: `docs/governance/`
- Conformance tooling: `tools/` + `skills/bpmn-conformance/SKILL.md`
- Decisions: `docs/decisions/`
- Intended use / liability: `DISCLAIMER.md`
