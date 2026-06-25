# Agent skills — single source, consumed by every tool

This directory is the **single source** for the repository's vendor-neutral
[Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills):
each `skills/<name>/SKILL.md` carries YAML frontmatter (`name`, `description`) plus
Markdown instructions. Tools match on the `description` to decide when a skill
applies. All tool-specific files only point here — never copy a skill's body.

| Skill | When it fires | Gate / output |
|---|---|---|
| [`bpmn-conformance`](bpmn-conformance/SKILL.md) | editing any `**/*.bpmn` | `npm run check:conformance` (deterministic) |
| [`bpmn-acceptance`](bpmn-acceptance/SKILL.md) | preparing a formal Abnahme | `npm run abnahme:protokoll` → pre-filled Protokoll (never stamps acceptance) |
| [`clinical-pathway-review`](clinical-pathway-review/SKILL.md) | reviewing a pathway for the SEM/PRA criteria | advisory findings only (LLM-judgment, read-only) |
| [`model-inventory`](model-inventory/SKILL.md) | mapping what the model set contains | a Model Inventory Matrix (read-only) |
| [`bpmn-soundness`](bpmn-soundness/SKILL.md) | checking STR-1…4 behavioural soundness | `npm run check:soundness` (advisory; needs the analyzer container) |

## How each tool consumes these skills

- **Claude Code** — auto-discovers via the `.claude/skills` symlink (→ `../skills`);
  loads a skill when the task matches its `description`. No extra config.
- **OpenAI Codex / GitHub Copilot** — auto-discover via the `.agents/skills` symlink
  (→ `../skills`) and follow the symlink target. Copilot additionally reads
  [`.github/copilot-instructions.md`](../.github/copilot-instructions.md).
- **Cursor / other AGENTS.md readers** — read the root [`AGENTS.md`](../AGENTS.md),
  whose "Agent skills" section lists the same trigger and gate command.

## Status notes

- **bpmn-soundness** is shipped but **advisory**: its pilot (2026-06-25) found 4/7 models
  inconclusive (unsupported OR-gateways + intermediate catch events) and the analyzable
  ones violate on pre-existing defects, so STR-1…4 stay `HUMAN-INPUT-NEEDED` in the
  `bpmn-acceptance` Protokoll and the CI job is non-blocking until the model remodel. See
  [`docs/decisions/0003-soundness-tooling.md`](../docs/decisions/0003-soundness-tooling.md).

## Editing rule

Change a skill in `skills/<name>/SKILL.md` only. The pointer files in `.github/`,
`AGENTS.md`, and the `.claude/skills` / `.agents/skills` symlinks reference it; they
must never copy its body.
