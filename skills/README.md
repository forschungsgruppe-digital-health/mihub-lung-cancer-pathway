# Agent skills — single source, consumed by every tool

This directory is the **single source** for the repository's vendor-neutral
[Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills):
each `skills/<name>/SKILL.md` carries YAML frontmatter (`name`, `description`) plus
Markdown instructions. Tools match on the `description` to decide when a skill
applies. All tool-specific files only point here — never copy a skill's body.

| Skill | When it fires | Gate |
|---|---|---|
| [`bpmn-conformance`](bpmn-conformance/SKILL.md) | editing any `**/*.bpmn` | `npm run check:conformance` |

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

- **bpmn-acceptance** — runs the automatable Abnahme A-checks and emits a pre-filled
  `docs/governance/abnahme-protokoll-…md` (it never stamps the overall decision).
- **clinical-pathway-review** — advisory LLM review for the SEM/PRA criteria (never
  pass/fail; evidence for human reviewers).
- **bpmn-soundness** — STR-1..4 behavioural soundness via an external checker.

## Editing rule

Change a skill in `skills/<name>/SKILL.md` only. The pointer files in `.github/`,
`AGENTS.md`, and the `.claude/skills` / `.agents/skills` symlinks reference it; they
must never copy its body.
