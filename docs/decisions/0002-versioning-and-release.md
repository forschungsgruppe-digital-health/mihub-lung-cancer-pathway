# 0002 — Versioning and release

- Status: accepted
- Date: 2026-06-25
- Deciders: Forschungsgruppe Digital Health (FGDH), TU Dresden
- Context: the repository is published openly (CC BY 4.0) and a Zenodo DOI is planned.
  It needs a documented, reproducible versioning and release process for a set of
  BPMN **models** (not code).
- Supersedes/relates: [`0001-repo-tooling-and-conformance-gate.md`](0001-repo-tooling-and-conformance-gate.md).

## Decision 1 — Semantic Versioning, with the contract redefined for a model

We version the repository with **SemVer** (`MAJOR.MINOR.PATCH`). Because the artifact
is a model, not an API, the compatibility contract is defined as: *a downstream
consumer — a clinician reading the pathway, a FHIR / Synthea / terminology integrator,
a conformance checker, or a citing paper — can rely on the previous version's
structure and semantics.* (This mirrors how HL7 FHIR **adapts** SemVer for
specifications rather than adopting SemVer 2.0.0 verbatim.)

### Change → bump classification

| Bump | A change that … |
|---|---|
| **MAJOR** | removes/renames an activity, sub-process, or Call Activity; changes control flow so reachable paths, option-to-complete (STR-1), or proper completion (STR-2) differ; reassigns a Lane responsibility (SEM-1); adds/removes a gateway that changes behaviour; **changes the declared conformance class (SYN-1)**; splits or merges a sub-pathway file; changes start/end semantics (SYN-2). |
| **MINOR** | adds an optional branch/activity/annotation; adds a guideline/evidence reference (SEM-2); adds a domain artifact or quality indicator (SEM-7); adds an audience view (PRA-2) — backwards-compatible additions. |
| **PATCH** | fixes a label/typo while preserving the verb-object intent (SYN-3); layout/DI changes; **`.svg` re-export**; colour; metadata; documentation. |

**Pre-1.0.0:** treat `0.MINOR` as the breaking axis. **Reach `1.0.0` at the first
formal acceptance test "Accepted"** (see [`../governance/`](../governance/)).

`release-please-config.json` enforces this with **`bump-minor-pre-major: true`** — a
breaking change (`feat!`/`refactor!`) bumps the **MINOR** (`0.1.0 → 0.2.0`), not to `1.0.0`,
while no model has yet passed the acceptance test.

**Release candidates.** To cut a candidate rather than a final release, set
**`"release-as": "X.Y.Z-rc.N"`** (e.g. `0.2.0-rc.1`) **and `"prerelease": true`** in
`release-please-config.json`: `release-as` forces the version and `prerelease: true` marks the
GitHub release as a **pre-release** (not `latest`), so no consumer treats it as stable.
(`release-as` **alone does not** flag the pre-release — both keys are required; a missed
`prerelease: true` is why `v0.2.0-rc.1` first published as a full release.) **After a candidate is
tagged, remove (or advance) `release-as`** — if it stays pinned to an already-released version,
release-please re-proposes it and the release step **fails with a duplicate-tag (`already_exists`)
error** (this happened after `v0.2.0-rc.1` was cut). With `prerelease: true` kept, release-please
proposes the next candidate (`-rc.2`, …) itself once there is a releasable commit. To cut the final
`X.Y.Z` once the acceptance test is "Accepted", **remove both `release-as` and `prerelease`**
(otherwise the stable release is wrongly marked a pre-release).

Bumps are derived from **Conventional Commit** messages scoped by pathway file
(`feat(treatment)!: …` = breaking; `feat(aftercare): …` = minor; `fix`/`docs` = patch).
Note: commit-lint enforces the *type*, not the *semantic correctness* of the bump — a
mislabeled breaking change is possible, so severity remains a review (R) judgment.

## Decision 2 — release-please (`simple`), single repository version

Releases are automated with **release-please** using **`release-type: simple`** — the
strategy for repositories with no language/package ecosystem. It maintains
`version.txt` + `CHANGELOG.md`, derives the next version from Conventional Commits,
opens a single "release PR", and on its merge tags `v<version>` and creates the GitHub
Release. We deliberately do **not** use the `node` release type (that is for the
sibling code repo); the `package.json` here is unmanaged private tooling metadata, and
**`version.txt` is the canonical model version**.

- **One repository-level version** (a single `.` component). The seven files are
  interdependent decomposed views (Call Activities); per-file versions would create
  cross-reference skew. The multi-component / `linked-versions` mode (used by the
  sibling repo) is kept in reserve for if a sub-pathway ever becomes an independently
  consumed artifact.
- **Config:** [`release-please-config.json`](../../release-please-config.json) +
  [`.release-please-manifest.json`](../../.release-please-manifest.json) seeded at
  `0.1.0`; workflow [`.github/workflows/release-please.yml`](../../.github/workflows/release-please.yml)
  runs on push to `main`. Action pinned by SHA.
- **In-file version:** do not hand-version the seven `.bpmn`. If an in-XML stamp is
  ever wanted, use `bpmn:documentation` or a custom-namespace attribute (e.g. under the
  already-declared `cp:` prefix) — never overload `exporter` / `exporterVersion`.
- **Known caveat (verify on first run):** release-please issue #2098 — the `simple`
  strategy can tag/changelog but ignore `version.txt` in some manifest setups. Let
  release-please create/own `version.txt` and confirm the first release PR updates it.
- **GITHUB_TOKEN limitation:** PRs opened by the token do not trigger other workflows,
  so the release PR will not re-run CI. Expected.

A **lighter alternative** (manual `git tag` + a hand-maintained CHANGELOG keyed to
acceptance-test sign-offs + GitHub "generate release notes") is a legitimate fallback for a
7-file repo; we choose release-please for reproducibility and changelog automation.

## Decision 3 — Citation and DOI (CITATION.cff + Zenodo)

- [`CITATION.cff`](../../CITATION.cff) (CFF 1.2.0, `type: dataset`, `license:
  CC-BY-4.0`) is added and validated in CI
  ([`citation-validate.yml`](../../.github/workflows/citation-validate.yml)) — an
  **invalid CFF aborts the Zenodo publish**, so validation is protective. Before the
  first DOI release, replace the institutional author with the individual authors +
  ORCIDs.
- **Zenodo–GitHub integration** mints a DOI **per GitHub Release** (plus a concept-DOI
  for "latest"). Operational gotchas (verified):
  1. Zenodo only archives releases created **while the integration toggle is ON** — the
     first DOI requires creating a release **after** enabling it (pre-existing releases
     are not archived retroactively).
  2. Zenodo ingests only a **subset** of CFF fields and does **not** read CFF `version`
     — the record version comes from the git tag. Keep CFF `version` current for
     citation-file accuracy only.
  3. The Zenodo record Description is editable post-mint; put the intended-use
     disclaimer there too.
- **Hybrid, not CalVer:** SemVer is the primary (severity-driven) axis; carry the
  release date in `CHANGELOG.md` and note the reflected guideline edition (S3-LL /
  nNGM, SEM-2) in release notes for temporal/guideline traceability.

## Consequences / open items

- **Branch protection on `main` is intentionally NOT set yet.** The conformance gate runs
  advisory (warn-only) in CI today (ADR-0001) — it reports findings as warnings but does
  not fail the check or block merges. Make it a **required** check **after** the remodel
  follow-up, once hard enforcement is re-enabled (remove `CONFORMANCE_WARN_ONLY`). This is
  a manual GitHub setting (outward-facing; not done by an agent).
- The first release / DOI should follow, not precede, a first formal acceptance test.
