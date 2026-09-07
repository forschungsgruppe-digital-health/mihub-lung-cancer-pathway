# Architecture decision records (ADRs)

This folder records the decisions that shape the repository as a **published set of BPMN
models** — tooling, conformance gate, versioning/release, soundness tooling, structure and naming,
licensing. Each ADR is a short, numbered Markdown file with a fixed header block (see
[`TEMPLATE.md`](TEMPLATE.md)). The folder is **export-ignored** from the release archive
([ADR-0002](0002-versioning-and-release.md), Decision 4), so archived documents
(`README.md`, `docs/governance/*`) link here with absolute GitHub URLs.

## How ADRs evolve — amended in place, with dated markers

ADRs are **not rewritten**. When a decision is refined, superseded in practice, or a recorded fact
turns out to be wrong, the original text stays and a **dated marker** is added right where it
applies — `*(status YYYY-MM-DD: …)*`, `**Amended YYYY-MM-DD:** …`, `*[Corrected YYYY-MM-DD: …]*`,
or a new `**Decision YYYY-MM-DD — …**` bullet. The reader can therefore see what was decided
when, what changed, and why. An ADR whose substance is replaced gets `Status: superseded by
NNNN` in its header and a new ADR is written; a status change is itself a dated amendment.

## How to add an ADR

1. Take the **next free number** (four digits; `0005` is the next).
2. Copy [`TEMPLATE.md`](TEMPLATE.md) to `NNNN-<kebab-case-title>.md` and keep the **same header
   block** (Status / Date / Deciders / Context / Relates), then the sections Decision,
   Consequences, Open items.
3. Write it in **English** (repo language policy: technical documentation is English; the
   acceptance-test instrument is the bilingual exception).
4. **Link it from the index below** in the same PR, and cross-link related ADRs in their
   `Relates` lines.
5. Any decision touching the FHIR/BPMN artifact contract, the release archive, the licence, or
   `CITATION.cff` / `.zenodo.json` needs an ADR; agents draft, humans decide (see `AGENTS.md`).

## Index

| ADR | Title | Status | Date | Last amendment | Relates |
|---|---|---|---|---|---|
| [0001](0001-repo-tooling-and-conformance-gate.md) | Repository tooling, conformance gate, and declared conformance class | accepted | 2026-06-25 | 2026-09-07 (bpmnlint status counts) | 0003, 0004 (cited) |
| [0002](0002-versioning-and-release.md) | Versioning and release | accepted | 2026-06-25 | 2026-09-07 (commit-lint correction, Zenodo/authorship, archive lists) | 0001 |
| [0003](0003-soundness-tooling.md) | Behavioural soundness tooling (STR-1…STR-4) | accepted; pilot executed 2026-06-25, blocking gate deferred | 2026-06-25 | 2026-09-04 | 0001, `../governance/` |
| [0004](0004-repo-structure-and-model-naming.md) | Repository structure and model naming | accepted (executed in the same PR) | 2026-06-25 | 2026-09-05 (screening name closed) | 0001, 0002 |
| 0005 | Licensing of derived models | proposed (in preparation — pending Justiziariat) | — | — | 0002 |

Status vocabulary: **proposed** (drafted, not yet decided) · **accepted** · **superseded by NNNN**
· **deprecated**. "Last amendment" is the date of the newest dated marker inside the file.
