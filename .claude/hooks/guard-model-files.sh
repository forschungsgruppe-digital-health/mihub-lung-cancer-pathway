#!/usr/bin/env bash
#
# Model guard — PreToolUse hook (Claude Code).
#
# Blocks any attempt by a skill/agent to MODIFY a BPMN pathway model (`.bpmn`) or its
# `.svg` export. The models are the clinically-validated artifact: every change must be
# made by a human modeler and re-validated for face validity (Abnahme SEM-6). Agents are
# READ-ONLY w.r.t. the models — if a tool/agent finds a problem with the BPMN XML it must
# REPORT it (docs/model-issues/) and propose a GitHub issue, never edit the model.
#
# Covers the file-write tools (Write/Edit/MultiEdit/NotebookEdit) and the obvious Bash
# write vectors (redirects, `sed -i`, `tee`) targeting a model file. Reading models is
# always allowed. Exit 2 = deny (stderr is shown to the agent).

input="$(cat)"

deny() {
  echo "BLOCKED by the model guard: $1" >&2
  echo "Agents must NOT modify .bpmn pathway models or their .svg exports — the models are" >&2
  echo "clinically validated (Abnahme SEM-6 face validity) and change only via a human" >&2
  echo "modeler + re-validation. Report the issue in docs/model-issues/ and propose a GitHub" >&2
  echo "issue (.github/ISSUE_TEMPLATE/bpmn-model-issue.md) instead. See AGENTS.md." >&2
  exit 2
}

# 1) Direct file-write tools — block when the target path is a model artifact.
if printf '%s' "$input" | grep -qE '"(file_path|notebook_path)"[[:space:]]*:[[:space:]]*"[^"]*\.(bpmn|svg)"'; then
  deny "a write to a model file (.bpmn/.svg) was attempted."
fi

# 2) Bash write vectors — redirect / sed -i / tee targeting a model file (reads are fine).
if printf '%s' "$input" | grep -qE '(>>?[[:space:]]*[^[:space:]"|&;<>]*\.(bpmn|svg))|(\bsed\b[^;&|]*(-i|--in-place)[^;&|]*\.(bpmn|svg))|(\btee\b[^;&|]*\.(bpmn|svg))'; then
  deny "a shell command appears to write to a model file (.bpmn/.svg)."
fi

exit 0
