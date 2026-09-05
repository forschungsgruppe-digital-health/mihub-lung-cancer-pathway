# 0002 — Versioning and release

- Status: accepted
- Date: 2026-06-25
- Deciders: Forschungsgruppe Digital Health (FGDH), TU Dresden
- Context: the repository is published openly (CC BY 4.0) and a Zenodo DOI is planned
  *(status 2026-09-04: the Zenodo integration is active since 2026-06-27 — concept DOI
  10.5281/zenodo.20943916; see Decision 3 and the amended open items below)*.
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

**Release candidates** *(procedure corrected 2026-09-04 — the method originally recorded here,
pinning `"release-as"` in `release-please-config.json`, caused the `already_exists` loop
described in step 3 and was retired in commit 609441b on 2026-06-26; the text below replaces it).*
A candidate is cut with a **one-time `Release-As:` commit footer**, never with a config pin:

1. Keep **`"prerelease": true`** in `release-please-config.json` (it is set). It marks the
   GitHub release as a **pre-release** (not `latest`), so no consumer treats it as stable — a
   missed `prerelease: true` is why `v0.2.0-rc.1` first published as a full release.
2. Put the footer **`Release-As: X.Y.Z-rc.N`** (e.g. `Release-As: 0.3.0-rc.1`) on a real,
   releasable commit that is merged to `main`. release-please honours the footer for exactly
   that release PR and then forgets it — there is no cleanup step. This is the method used for
   `v0.2.1-rc.2` (commit ef3177f, 2026-06-27) and `v0.3.0-rc.1` (commit ecb38e9, 2026-06-29).
3. **Never pin `release-as` in the config.** A config pin is sticky: after the candidate is
   tagged, release-please re-proposes the same version and the release step **fails with a
   duplicate-tag (`already_exists`) error**. This happened after `v0.2.0-rc.1`; the key was
   unpinned in commit 609441b and the config has stayed unpinned since.

What release-please does without a pin *(verified 2026-09-04 against the release-please source;
default versioning strategy, `versioning` unset)*: `prerelease: true` only marks the GitHub
release as a pre-release — it does not drive the version number. The default strategy carries an
existing pre-release suffix over **unchanged**: on `0.3.0-rc.1` a `feat` proposes `0.4.0-rc.1`
and a `fix` proposes `0.3.1-rc.1`; a **second candidate for the same version (`-rc.2`) is never
produced automatically**. The one-time `Release-As: X.Y.Z-rc.N` footer is therefore *required*
for `rc.2` and later (and harmless otherwise). To cut the final `X.Y.Z` once the acceptance test is
"Accepted", **remove `prerelease`** (otherwise the stable release is wrongly marked a
pre-release); if a specific final version is wanted, use a one-time `Release-As: X.Y.Z` footer.

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

- **One repository-level version** (a single `.` component). The model files (seven when
  this was written; eight from `v0.2.0-rc.1` (screening), nine since `v0.3.0-rc.1`
  (palliative-care), ten since 2026-09-04 (initial-entry, #77)) are interdependent decomposed
  views (Call Activities); per-file versions would create cross-reference skew. The multi-component / `linked-versions` mode (used by the
  sibling repo) is kept in reserve for if a sub-pathway ever becomes an independently
  consumed artifact.
- **Config:** [`release-please-config.json`](../../release-please-config.json) +
  [`.release-please-manifest.json`](../../.release-please-manifest.json) seeded at
  `0.1.0`; workflow [`.github/workflows/release-please.yml`](../../.github/workflows/release-please.yml)
  runs on push to `main`. Action pinned by SHA.
- **In-file version:** do not hand-version the `.bpmn` files. If an in-XML stamp is
  ever wanted, use `bpmn:documentation` or a custom-namespace attribute (e.g. under the
  already-declared `cp:` prefix) — never overload `exporter` / `exporterVersion`.
- **Known caveat (verify on first run):** release-please issue #2098 — the `simple`
  strategy can tag/changelog but ignore `version.txt` in some manifest setups. Let
  release-please create/own `version.txt` and confirm the first release PR updates it.
  **Verified 2026-06-26:** release-please does bump `version.txt` and
  `.release-please-manifest.json` on every release (confirmed again on `v0.2.1-rc.2` and
  `v0.3.0-rc.1`); the caveat did not materialise.
- **GITHUB_TOKEN limitation:** PRs opened by the token do not trigger other workflows,
  so the release PR will not re-run CI. Expected.
- **Bookkeeping lives on `main` — back-merge after every release** *(amended 2026-09-04)*:
  release-please commits `version.txt`, `.release-please-manifest.json` and `CHANGELOG.md`
  only on `main` (the release PR targets `main`), so `dev` never sees them by itself.
  **Rule: after each release, merge `main` back into `dev`** (a plain merge commit, e.g.
  `chore: back-merge main release bookkeeping into dev`), so that `dev` carries the current
  version and changelog and the next `dev`→`main` promotion does not conflict on them. The
  first back-merge was done on 2026-09-04 (`dev` now has `version.txt` = `0.3.0-rc.1` and
  `CHANGELOG.md`); before that, `dev` had never received the release bookkeeping.

A **lighter alternative** (manual `git tag` + a hand-maintained CHANGELOG keyed to
acceptance-test sign-offs + GitHub "generate release notes") is a legitimate fallback for a
repo of a handful of model files; we choose release-please for reproducibility and changelog automation.

## Decision 3 — Citation and DOI (CITATION.cff + Zenodo)

- [`CITATION.cff`](../../CITATION.cff) (CFF 1.2.0, `type: dataset`, `license:
  CC-BY-4.0`) is added and validated in CI
  ([`citation-validate.yml`](../../.github/workflows/citation-validate.yml)) — an
  **invalid CFF aborts the Zenodo publish**, so validation is protective. Before the
  first DOI release, replace the institutional author with the individual authors +
  ORCIDs. **Done 2026-06-27** (commits 87f42bc + 400fcd9): `CITATION.cff` now lists the
  individual authors with ORCIDs (Susky, Scheel, Schlieter).
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
- **Amended 2026-09-04 — resource type.** Zenodo classified the GitHub-integration deposits as
  *Software* while `CITATION.cff` says `dataset`. Decision: the artifact is a set of process
  models → **dataset** on both surfaces. [`.zenodo.json`](../../.zenodo.json) (`upload_type`
  `dataset`; same title/authors/ORCIDs/abstract/keywords/licence as `CITATION.cff`;
  export-ignored — Zenodo reads it from the repository via the GitHub API at release time, and
  it takes precedence over `CITATION.cff`) governs every future deposit; CI
  ([`citation-validate.yml`](../../.github/workflows/citation-validate.yml)) checks that the
  two files stay in sync. The three existing records — 10.5281/zenodo.20943917 (`v0.2.1-rc.1`),
  10.5281/zenodo.20945321 (`v0.2.1-rc.2`), 10.5281/zenodo.21029417 (`v0.3.0-rc.1`) — are
  still resource type *Software* with the original "seven sub-pathways" abstract (status
  2026-09-04). Editing them on zenodo.org to *Dataset* and to the current abstract (ten models:
  overarching + nine sub-pathways) is a **manual human action and still OPEN**; `.zenodo.json`
  governs new deposits only, it does not rewrite minted records.

- **Decision 2026-09-05 — pre-1.0 Zenodo records are left as minted.** The maintainer decided not to
  edit the two oldest release-candidate records (10.5281/zenodo.20943917 `v0.2.1-rc.1`,
  10.5281/zenodo.20945321 `v0.2.1-rc.2` — resource type *Software*, "seven sub-pathways"
  abstract): they are release candidates, superseded under the same concept DOI, and not the
  citable artifact. From `v0.3.0-rc.1` on every record is *Dataset*; `v0.4.0-rc.1`
  (10.5281/zenodo.22327274) was minted from `.zenodo.json`. The open item is closed.
- **Amended 2026-09-04 — version sync.** `CITATION.cff` `version:` carries the
  `# x-release-please-version` marker and `CITATION.cff` is listed in `extra-files`, so
  release-please bumps it with every release (no more hand-edited version); `date-released`
  stays manual and is set in the release-candidate commit together with the `Release-As:` footer.

## Decision 4 — Release-archive contents *(added 2026-09-04; records commits 87f42bc + 400fcd9 of 2026-06-27)*

GitHub builds the release source archive with `git archive`, which honours `export-ignore` in
[`.gitattributes`](../../.gitattributes), and Zenodo archives exactly that tarball. The archive
is therefore trimmed to the **citable artifact plus its essential metadata**:

- **Kept:** `models/` (`.bpmn` + `.svg` + `models/README.md`), `docs/governance/` (the
  acceptance-test instrument incl. its README + CHANGELOG), `README.md`, `LICENSE`,
  `CITATION.cff`, `DISCLAIMER.md`, `CHANGELOG.md`, `AI_USAGE.md` (AI-usage disclosure, added 2026-09-05).
- **Excluded:** `tools/`, `skills/`, `.github/`, `package.json` + `package-lock.json`,
  `release-please-config.json`, `.release-please-manifest.json`, `version.txt`, `.bpmnlintrc`,
  `.vscode/`, `.claude/`, `.agents/`, `.gitignore`, `.gitattributes`, `AGENTS.md`, `CLAUDE.md`,
  `CONTRIBUTING.md`, `CONVENTIONS.md`, `CODE_OF_CONDUCT.md`, `docs/decisions/`,
  `docs/model-issues/`; *added 2026-09-04:* `.zenodo.json` (Zenodo reads it through the GitHub
  API at release time, not from the archive — Decision 3) and the research notes at the docs
  root, `docs/*.md` (the Synthea/BPMN primer, the dataset-generation plan, the
  data-sources-for-probabilities note); `docs/governance/` stays in.

Consequences:

- Files that ship in the archive (`README.md`, `docs/governance/*`) must link to excluded
  content with **absolute GitHub URLs**
  (`https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/<path>`,
  `/tree/main/<dir>` for directories) — a relative link would dangle inside the archive.
- The trimming applies to releases tagged **after** the `.gitattributes` commit: `v0.2.0-rc.1`
  and `v0.2.1-rc.1` are untrimmed; `v0.2.1-rc.2` onwards are trimmed. The 2026-09-04 additions
  (`.zenodo.json`, `docs/*.md`) take effect from the next tag onwards (`v0.4.0-rc.1`).
- The archived version is still recoverable from the tag name and `CHANGELOG.md`, even though
  `version.txt` is excluded.

## Consequences / open items

- **Branch protection on `main` is intentionally NOT set yet.** The conformance gate runs
  advisory (warn-only) in CI today (ADR-0001) — it reports findings as warnings but does
  not fail the check or block merges. Make it a **required** check **after** the remodel
  follow-up, once hard enforcement is re-enabled (remove `CONFORMANCE_WARN_ONLY`). This is
  a manual GitHub setting (outward-facing; not done by an agent).
  **Amended 2026-09-04:** superseded. `main` is governed by the GitHub ruleset
  **"Default Protection"** (id 17896638): no deletion, no force-push, changes only via pull
  request, and **0 required approvals by design** — `dev`→`main` promotion is meant to be
  frictionless. The conformance check is **deliberately not a required status check** while
  it runs warn-only during the RC phase (ADR-0001); making it required stays a post-remodel
  step (then as an edit of the ruleset, not a classic branch-protection rule).
- The first release / DOI should follow, not precede, a first formal acceptance test.
  **Amended 2026-09-04:** superseded in practice. Release **candidates** are published as
  GitHub pre-releases and archived on Zenodo *before* the first acceptance test — deliberately,
  to obtain the concept DOI (10.5281/zenodo.20943916) for citation and for the instrument's
  `persistent_id` (version DOIs so far: `v0.2.1-rc.1` → 10.5281/zenodo.20943917, `v0.2.1-rc.2`
  → 10.5281/zenodo.20945321, `v0.3.0-rc.1` → 10.5281/zenodo.21029417; all minted with resource
  type "Software" — left as minted by decision of 2026-09-05 (see Decision 3) — no manual edit, see the Decision 3
  amendment). What still follows, not precedes, the
  first "Accepted" is the **stable `1.0.0`** (Decision 1).
