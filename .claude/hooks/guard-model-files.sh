#!/usr/bin/env bash
#
# Model guard — PreToolUse hook (Claude Code).
#
# Blocks any attempt by a skill/agent to MODIFY a BPMN pathway model (`.bpmn`) or its
# `.svg` export. The models are the clinically-validated artifact: every change must be
# made by a human modeler and re-validated for face validity (Abnahmetest SEM-6). Agents are
# READ-ONLY w.r.t. the models — if a tool/agent finds a problem with the BPMN XML it must
# REPORT it (docs/model-issues/) and propose a GitHub issue, never edit the model.
#
# Coverage — PATTERN-BASED (a guardrail against accidental edits, not a sandbox):
#   1. File-write tools (Write/Edit/MultiEdit/NotebookEdit): denied when the target path
#      (`file_path` / `notebook_path`) is a `.bpmn` / `.svg`.
#   2. Bash (checked for the Bash tool only): denied when the same shell segment (between
#      `;`, `&`, `|`) names a `.bpmn` / `.svg` path AND uses one of
#        - a redirect (`>`, `>>`), `sed -i` / `--in-place`, `tee`;
#        - a destructive or copying command at command position (start of the command, or
#          after `;` `&&` `||` `|` `(` `{`, a quote or a newline; optionally via `sudo`):
#          rm, cp, mv, truncate, rename, unlink, shred, ln, dd, rsync, install, patch;
#        - `git rm` / `git checkout` / `git restore` / `git apply` / `git stash`.
#      `git mv` is not caught by this hook (content-preserving); AGENTS.md still forbids
#      agents to rename models on their own — the ADR-0004 renames were done on explicit
#      maintainer instruction. Plain reads (cat, grep, head, xmllint, node tools/*.mjs) and
#      the non-destructive git verbs (diff, log, show, status, add) are always allowed.
#      The extension match is word-bounded, so `.bpmnlintrc` is not mistaken for a model.
#   Known gaps, inherent to a regex guard: indirect vectors (`xargs rm`, `find -exec`),
#   globs without the extension (`rm models/*`), path-less `git checkout -- .` / `git stash`,
#   and scripts that write internally. The authority over the models stays with the human
#   modeler + PR review; this hook only catches the obvious slips.
#
# Exit 2 = deny (stderr is shown to the agent). Reading models is always allowed.

input="$(cat)"

deny() {
  echo "BLOCKED by the model guard: $1" >&2
  echo "Agents must NOT modify .bpmn pathway models or their .svg exports — the models are" >&2
  echo "clinically validated (acceptance-test SEM-6 face validity) and change only via a human" >&2
  echo "modeler + re-validation. Report the issue in docs/model-issues/ and propose a GitHub" >&2
  echo "issue (.github/ISSUE_TEMPLATE/bpmn-model-issue.md) instead. See AGENTS.md." >&2
  exit 2
}

# 1) Direct file-write tools — block when the target path is a model artifact.
if printf '%s' "$input" | grep -qE '"(file_path|notebook_path)"[[:space:]]*:[[:space:]]*"[^"]*\.(bpmn|svg)"'; then
  deny "a write to a model file (.bpmn/.svg) was attempted."
fi

# 2) Bash write vectors — only for the Bash tool (a Write/Edit payload that merely QUOTES such a
#    command in a docs file is not a model write). The first "tool_name" in the payload is the
#    real one (Claude Code emits it before tool_input); an absent tool_name is treated as Bash.
tool_name="$(printf '%s' "$input" | grep -oE '"tool_name"[[:space:]]*:[[:space:]]*"[^"]*"' | head -n 1 | sed -E 's/.*"([^"]*)"$/\1/')"
if [ -z "$tool_name" ] || [ "$tool_name" = "Bash" ]; then
  # Word-bounded: `.bpmnlintrc` (the linter config) is not a model file.
  model='\.(bpmn|svg)\b'
  seg='[^;&|]*'
  # Command position: start of the (JSON-encoded) command string or a shell separator / brace /
  # quote / JSON-encoded newline (`\n`), then optional whitespace and an optional `sudo`.
  cmd_pos=$'(^|[;&|(){}"\'`]|\\\\n)[[:space:]]*(sudo[[:space:]]+)?'
  re_redirect='(>>?[[:space:]]*[^[:space:]"|&;<>]*'"$model"')'
  re_sed='(\bsed\b'"$seg"'(-i|--in-place)'"$seg$model"')'
  re_tee='(\btee\b'"$seg$model"')'
  re_cmd='('"$cmd_pos"'(rm|cp|mv|truncate|rename|unlink|shred|ln|dd|rsync|install|patch)[[:space:]]'"$seg$model"')'
  re_git='(\bgit[[:space:]]+(rm|checkout|restore|apply|stash)\b'"$seg$model"')'
  if printf '%s' "$input" | grep -qE "$re_redirect|$re_sed|$re_tee|$re_cmd|$re_git"; then
    deny "a shell command appears to write to, replace, move or delete a model file (.bpmn/.svg)."
  fi
fi

exit 0
