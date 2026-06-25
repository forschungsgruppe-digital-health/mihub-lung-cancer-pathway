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

## How each tool consumes these skills

- **Claude Code** — auto-discovers via the `.claude/skills` symlink (→ `../skills`);
  loads a skill when the task matches its `description`. No extra config.
- **OpenAI Codex / GitHub Copilot** — auto-discover via the `.agents/skills` symlink
  (→ `../skills`) and follow the symlink target. Copilot additionally reads
  [`.github/copilot-instructions.md`](../.github/copilot-instructions.md).
- **Cursor / other AGENTS.md readers** — read the root [`AGENTS.md`](../AGENTS.md),
  whose "Agent skills" section lists the same trigger and gate command.

## Planned (later phases — not in this repo yet)

These are designed but not shipped; they arrive with their backing tools:

- **bpmn-soundness** — STR-1…4 behavioural soundness via an external model checker
  (`rust_bpmn_analyzer`). Approach + pilot protocol in
  [`docs/decisions/0003-soundness-tooling.md`](../docs/decisions/0003-soundness-tooling.md);
  until piloted, STR-1…4 stay `HUMAN-INPUT-NEEDED` in the `bpmn-acceptance` Protokoll.

## Editing rule

Change a skill in `skills/<name>/SKILL.md` only. The pointer files in `.github/`,
`AGENTS.md`, and the `.claude/skills` / `.agents/skills` symlinks reference it; they
must never copy its body.
