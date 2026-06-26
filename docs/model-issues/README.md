# Model issues — report, don't fix

The `.bpmn` pathway models are the **clinically-validated artifact**. **No skill or agent
may modify a model** (`.bpmn` or its `.svg`) — every change is made by a **human modeler**
and re-validated for face validity (acceptance test **SEM-6**). See `AGENTS.md` (Hard rules) and the
`guard-model-files` PreToolUse hook (`.claude/hooks/guard-model-files.sh`).

When a tool or agent finds a problem with the BPMN XML, it records it **here** as a finding
plus a **ready-to-file GitHub issue suggestion** — it does **not** touch the model. A human
then triages, files the issue (template:
[`.github/ISSUE_TEMPLATE/bpmn-model-issue.md`](../../.github/ISSUE_TEMPLATE/bpmn-model-issue.md)),
and a modeler fixes + re-validates.

## Workflow

1. **Tool/agent** finds a BPMN-XML problem → appends or adds a finding under this folder
   (with evidence + a suggested issue). Never edits the model.
2. **Human** reviews the finding and files a GitHub issue (using the suggestion + template).
3. **Human modeler** remodels, re-exports the `.svg`, re-runs the gate
   (`npm run check:conformance`, and `npm run check:soundness` where relevant), and
   re-confirms face validity (SEM-6) if the clinical meaning changed.

## Findings

- [2026-06-25 — baseline findings](2026-06-25-baseline.md) — defects discovered while
  building the tooling: OR-gateways, structural correctness, dead activities, namespace
  prefixes, stub processes, and soundness-unsupported events.
