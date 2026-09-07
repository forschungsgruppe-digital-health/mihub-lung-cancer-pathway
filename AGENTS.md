# AGENTS.md — MiHUB Lung-Cancer Patient Pathway

Operational context for AI coding agents (Claude Code, Codex, Cursor, Gemini CLI,
Copilot — anything that reads the open AGENTS.md standard). Single source of truth:
tool-specific files (e.g. `CLAUDE.md`) only point here. Keep this lean — the project
narrative lives in `README.md`, the modelling rules in `CONVENTIONS.md`, the
acceptance-test gate in `docs/governance/`; do not duplicate them.

## What this repo is

A set of **BPMN 2.0 models of the lung-cancer patient pathway** (one overarching
pathway + nine sub-pathways: initial-entry, screening, diagnostic, patient-consultation, tumor-board,
molecular-tumor-board, treatment, palliative-care (WIP draft), aftercare — the current
inventory is `models/README.md`), developed in the MiHUB project (TU Dresden /
Forschungsgruppe Digital Health). The models live under `models/` (naming convention
`lung-cancer-<phase>-pathway`, ADR-0004); each `.bpmn` source has a paired `.svg` render. The repository is **model-only**, is **published openly (models CC BY-SA 4.0, documentation CC BY 4.0 — ADR-0005, `REUSE.toml`)**
and is archived on Zenodo (concept DOI `10.5281/zenodo.20943916` — see `CITATION.cff`).
There is no application here.

> ⚠️ **Intended use.** These models are a research / education / interoperability
> reference artifact. They are **not** clinically validated and **must not** be used
> for direct patient care or clinical decision-making. See [`DISCLAIMER.md`](DISCLAIMER.md).

## Artifacts vs. tooling

- **Published artifacts** (= the release archive and therefore the Zenodo deposit, trimmed via
  `.gitattributes` `export-ignore`): the models (`models/*.bpmn` + paired `*.svg`) plus
  `models/README.md`, the acceptance-test instrument in `docs/governance/`, `README.md`,
  `LICENSE`, `CITATION.cff`, `DISCLAIMER.md`, `CHANGELOG.md`, `AI_USAGE.md`, `LICENSES/` and `REUSE.toml` — models CC BY-SA 4.0, everything else CC BY 4.0.
  `docs/decisions/`, `docs/model-issues/`, this file, `CONTRIBUTING.md`, `CONVENTIONS.md`,
  `skills/`, `tools/`, `.github/` and the loose `docs/*.md` research notes at the docs root are
  export-ignored (verify with `git archive HEAD | tar -t`).
- **Dev/CI tooling:** a `package.json` (devDependencies only, `private`, `type: module`)
  plus `tools/`. `node_modules/` is **git-ignored and never committed** — so the
  toolchain never pollutes the published artifact. Rationale: [`docs/decisions/0001`](docs/decisions/0001-repo-tooling-and-conformance-gate.md).
- **`.bpmn` is the source; `.svg` is derived.** When a model changes, re-export the
  matching `.svg` in the same commit.

## Quality gate — one source, every runner

Every check is a deterministic CLI under `tools/`, wired to an npm script. **The
decision lives in the tool, never in the model.** A green local run ⇒ a green CI run. (During the RC/pre-remodel phase the CI aggregator is **advisory/warn-only** and stays green regardless of findings, while the naming convention is enforced as its **own blocking CI step**; the local default is strict.)

| Layer | Command | Severity |
|---|---|---|
| model naming (ADR-0004: `models/lung-cancer-<phase>-pathway.{bpmn,svg}`, paired) | `npm run check:naming` | **Blocking** |
| bpmnlint (BPMN structure/correctness, `no-inclusive-gateway`=error) | `npm run lint:bpmn` | **Blocking** |
| model metrics (Abnahmetest SYN-5 no-OR blocking; SYN-2/4, lanes, prefix advisory) | `npm run check:metrics` | **Blocking** on OR-gateways |
| moddle roundtrip (lossless `cp:` BPMN4CP + stable serialization; `i18n:` passthrough) | `npm run check:roundtrip` | **Blocking** |
| XSD core (OMG BPMN20.xsd) | `npm run check:xsd` | Informational |
| **all of the above, in this order (full report, blocks on the blocking layers)** | `npm run check:conformance` | **the gate** (CI: aggregator advisory/warn-only during the RC/pre-remodel phase, naming as its own blocking step; local default strict) |

Run `npm ci` once (Node ≥ 18), then `npm run check:conformance`. To register a new
`.bpmn` location, edit `ROOTS` in `tools/bpmn-files.mjs` (the single file-discovery source).

> The CI aggregator currently runs **advisory (warn-only)**: the existing models carry structural
> defects and 13 `bpmn:InclusiveGateway`s (OR — treatment 2, aftercare 4, palliative-care 7; `npm run check:metrics` is the authoritative count), so the gate **reports** these as warnings but does **not** fail the check or block PRs (env `CONFORMANCE_WARN_ONLY` in `.github/workflows/ci.yml`; local default stays strict). The naming convention (`npm run check:naming`) is enforced as its own **blocking** CI step. Naming and roundtrip are green on every model, the XSD core on all but the overarching model: the `cp:` (BPMN4CP) extension content is modelled by the moddle descriptor `tools/moddle/bpmn4cp.json` (registered via `tools/moddle/descriptors.mjs`) and round-trips losslessly; only `i18n:` attributes pass through as unknown attributes. The `cp:qualityIndicator` elements are direct children of the process **by design** (BPMN4CP clinical-pathway extension; maintainer decision 2026-09-04 — not a defect), so the informational XSD-core layer validates a *core view* with the BPMN4CP elements excluded (`tools/xsd-core-view.mjs`) and a failure there is a genuine BPMN-core deviation — today only the overarching model's un-namespaced DI colour attributes (informational; `docs/model-issues/2026-09-04-xsd-core-extension-placement.md`, Issue X2). Hard enforcement is re-enabled after the remodel. Greening it is tracked work (see `docs/decisions/0001`), and it
> requires modelling + clinical judgment — agents must not "fix" pathway logic
> unilaterally.

## Acceptance Test (the human + tool gate)

Formal sign-off of a model uses the **Acceptance Test instrument** in
[`docs/governance/`](docs/governance/) — the Checkliste (the instrument, v0.3.1) plus the Handout (v0.2, same criteria IDs) and the Protokoll template (v1.0, criteria basis: instrument v0.3.1).
Method column: **A** = automatable tool (the gate above), **R** = review, **K** =
consensus. The automatable criteria (SYN-1/2/4/5, STR-1..4) are tooled; the clinical
(SEM) and pragmatic (PRA) criteria, the three gates, and the overall decision are
**human** — no tool or agent may stamp the acceptance test.

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
| `skills/bpmn-conformance/SKILL.md` | see that a `.bpmn` under `models/` has changed (human edit) — before any commit or PR touching `models/`; agents verify, they never edit the models | `npm run check:conformance` |
| `skills/bpmn-acceptance/SKILL.md` | prepare a formal acceptance test | `npm run abnahme:protokoll` (evidence only; never stamps the acceptance test) |
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
  (`.claude/hooks/guard-model-files.sh`, wired in `.claude/settings.json`): it denies
  Write/Edit of `.bpmn`/`.svg` files, shell writes to them (redirects, `sed -i`, `tee`)
  and destructive shell operations on model files (`rm`, `cp`, `mv`, `truncate`,
  `git rm`, `git checkout`/`restore`/`apply`/`stash` targeting models); a plain `git mv`
  rename (the ADR-0004 naming convention) is the one operation the hook leaves open —
  the read-only rule above still applies to it. Other tools must honor the same rule.
  (Humans editing models follow `CONTRIBUTING.md`.)
- **No real patient data.** Use only synthetic / abstract pathway content. Never
  commit patient data, even realistic-looking.
- **Keep the AI-usage disclosure current.** [`AI_USAGE.md`](AI_USAGE.md) (EU AI Act Art. 50 / COPE)
  records which artifact classes are AI-assisted and how they are marked. Update it whenever a
  new tool or model version, a new skill/sub-agent, or a new AI-assisted artifact class appears,
  and keep the `Co-Authored-By` commit trailer + the PR/issue footer on every AI-assisted change.
- **Not for clinical use.** Do not remove or weaken `DISCLAIMER.md` or the README
  intended-use banner. Any change to legal/intended-use text needs human sign-off
  (TU Dresden Justiziariat / DPO).
- **Preserve attribution.** The models are CC BY-SA 4.0 and the documentation CC BY 4.0 (ADR-0005); keep the licence, attribution,
  and third-party credits (gematik INA, CraNE) intact.
- Do not change BPMN core structure to carry clinical meaning — clinical context
  belongs in extension namespaces, not the `bpmn:` namespace: BPMN4CP `cp:` elements
  (quality indicators) are direct children of the process by design and are excluded from
  the XSD-core layer (`tools/xsd-core-view.mjs`); `i18n:` translations live in
  `<extensionElements>`.

## Where to look first

- Modelling rules: `CONVENTIONS.md`
- Acceptance-test gate: `docs/governance/`
- Conformance tooling: `tools/` + `skills/bpmn-conformance/SKILL.md`
- Decisions: `docs/decisions/`
- Intended use / liability: `DISCLAIMER.md`
