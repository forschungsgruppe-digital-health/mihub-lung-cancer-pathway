# 0004 — Repository structure and model naming

- Status: accepted (executed in the same PR)
- Date: 2026-06-25
- Deciders: Forschungsgruppe Digital Health (FGDH), TU Dresden
- Relates: [`0001-repo-tooling-and-conformance-gate.md`](0001-repo-tooling-and-conformance-gate.md),
  [`0002-versioning-and-release.md`](0002-versioning-and-release.md).

## Context

The repository root grew to ~30 entries: the BPMN models (the published artifact) sat
intermixed with ~16 tooling/meta files, and a newly added model
(`lcs-pathway-post-workshop2-final.bpmn`) used a different naming convention than the
existing `lung-cancer_*-subpathway.bpmn` files — with a status/version baked into the
filename (`post-workshop2-final`), which git/`version.txt`/`CHANGELOG.md` should track
instead.

## Decision 1 — Models live under `models/`

All BPMN sources and their paired SVG renders move from the repository root into a single
**`models/`** directory (flat; `.bpmn` + `.svg` co-located). This declutters the root and
makes the published artifact a clean, self-contained, archivable unit (relevant for the
planned Zenodo deposit). `docs/`, `tools/`, `skills/`, `.github/` are unchanged.

## Decision 2 — Kebab-case naming convention `lung-cancer-<phase>-pathway`

Model files follow **`lung-cancer-<phase>-pathway.{bpmn,svg}`** (kebab-case; `<phase>` is one
or more lowercase segments). **No status/version/date in filenames** — versioning is git's
job (`version.txt`, tags, `CHANGELOG.md`). Each `.bpmn` has a paired `.svg` of the same stem.
This is **enforced in CI** by `tools/check-naming.mjs` (`npm run check:naming`, part of the
conformance gate) — a non-conforming name fails the build.

### Rename mapping (history preserved via `git mv`)

| Old (root) | New (`models/`) |
|---|---|
| `lung-cancer_overarching-pathway.{bpmn,svg}` | `lung-cancer-overarching-pathway.{bpmn,svg}` |
| `lung-cancer_diagnostic-subpathway.{bpmn,svg}` | `lung-cancer-diagnostic-pathway.{bpmn,svg}` |
| `lung-cancer_patient-consultation-subpathway.{bpmn,svg}` | `lung-cancer-patient-consultation-pathway.{bpmn,svg}` |
| `lung-cancer_tumor-board-subpathway.{bpmn,svg}` | `lung-cancer-tumor-board-pathway.{bpmn,svg}` |
| `lung-cancer_molecular-tumor-board-subpathway.{bpmn,svg}` | `lung-cancer-molecular-tumor-board-pathway.{bpmn,svg}` |
| `lung-cancer_treatment-subpathway.{bpmn,svg}` | `lung-cancer-treatment-pathway.{bpmn,svg}` |
| `lung-cancer_aftercare-subpathway.{bpmn,svg}` | `lung-cancer-aftercare-pathway.{bpmn,svg}` |
| `lcs-pathway-post-workshop2-final.{bpmn,svg}` | `lung-cancer-screening-pathway.{bpmn,svg}` |

The `-subpathway` suffix becomes `-pathway`; the overarching model keeps `overarching`.
The overarching-vs-sub distinction lives in the model index (`models/README.md`) and the
model content, not the filename. **The LCS rename → `lung-cancer-screening-pathway` should be
confirmed by the model author** (the intended phase term is "screening"); renaming the
file does not change the BPMN content.

## Migration — what this PR updates

- `tools/bpmn-files.mjs`: `ROOTS = ['.']` → `['models']` (the single file-discovery source;
  all checks follow automatically).
- `README.md` (model table/links) and `docs/governance/README.md` paths.
- `models/README.md` added (the model index).
- **Unaffected:** the model-guard hook (it globs `*.bpmn`/`*.svg` anywhere), the soundness /
  link-check / CI workflows (glob-based or path-agnostic via `bpmn-files.mjs`), and the
  internal BPMN references (Call Activities reference process ids, not filenames — verified).

## Decision 3 (process) — this PR also recovers stranded work

GitHub marks PRs #29–#34 as *merged*, but because they were **stacked** (each based on the
previous feature branch), only **#29 (Phase 0-2)** actually landed on `dev`; the content of
**#30–#34** (versioning/release, the cp:/i18n descriptor + acceptance orchestrator + review
skills, the soundness pilot, the model guard, the bilingual governance docs) merged into the
intermediate feature branches and **never reached `dev`**. This PR is built from the full
stack merged with current `dev` (recovering the LCS pathway), so merging it brings `dev`
fully up to date **and** applies the restructure. After it lands, the `feat/repo-*` branches
are safe to delete.

## Consequences

- Do this **before the first Zenodo DOI** (a DOI pins the archived tree); none is minted yet.
- External links to raw root model URLs would break — acceptable now (pre-release, pre-DOI).
- Future indications (beyond lung cancer) could warrant `models/<indication>/…`; out of scope now.
