#!/usr/bin/env bash
#
# Validate the BPMN *core* of each file against the official OMG BPMN 2.0 XSD
# (Semantic / DI / DC), shipped with bpmn-moddle.
#
# SCOPE: structural standard-conformance of the BPMN CORE only. The models carry the
# BPMN4CP clinical-pathway extension (`cp:`, http://www.helict.de/bpmn4cp): its
# `cp:qualityIndicator` elements are DIRECT children of `bpmn:process` / the flow
# elements BY DESIGN (maintainer decision 2026-09-04) — valid extension usage, not a
# model defect. The OMG schema admits foreign elements only inside <extensionElements>,
# so validating the raw file reports a false finding on every cp:-carrying model.
# Therefore each file is validated through its CORE VIEW (tools/xsd-core-view.mjs):
# the BPMN4CP elements are excluded first (line count preserved, so the reported line
# numbers still point into the original file) and the extension content is validated
# by the moddle layer instead (tools/moddle-roundtrip.mjs + tools/moddle/bpmn4cp.json).
# i18n: content sits inside <extensionElements> and is accepted by the schema via
# processContents="lax". Consequence: a FAILURE here is a genuine BPMN-core deviation —
# and a green result does NOT mean the extensions are valid (the roundtrip's concern).
#
# Default mode is INFORMATIONAL: prints per-file PASS/FAIL and a summary, then
# exits 0 even on failures (the layer reports, it never blocks). Pass --strict to
# fail the run (exit 1) on a schema-invalid core.
#
# Requires: node (to locate the XSD, the file list and to build the core view) and
# xmllint (libxml2).
# Usage: tools/validate-xsd.sh [--strict] [file.bpmn ...]
# Exit:  0 = all cores schema-valid, or findings in informational mode;
#        1 = findings with --strict.

set -uo pipefail

STRICT=0
FILE_ARGS=()
for arg in "$@"; do
  if [ "$arg" = "--strict" ]; then
    STRICT=1
  else
    FILE_ARGS+=("$arg")
  fi
done

if ! command -v node >/dev/null 2>&1; then
  echo "validate-xsd: node not found on PATH — skipping XSD validation (informational)."
  exit 0
fi

if ! command -v xmllint >/dev/null 2>&1; then
  echo "validate-xsd: xmllint (libxml2) not found — skipping XSD validation (informational)."
  echo "             install it via: apt-get install libxml2-utils  /  brew install libxml2"
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT" || exit 1

# Locate the BPMN20.xsd shipped with bpmn-moddle.
MODDLE_PKG="$(node -e "process.stdout.write(require.resolve('bpmn-moddle/package.json'))" 2>/dev/null)"
if [ -z "$MODDLE_PKG" ]; then
  echo "validate-xsd: bpmn-moddle not installed — skipping (run npm ci)."
  exit 0
fi
XSD="$(dirname "$MODDLE_PKG")/resources/bpmn/xsd/BPMN20.xsd"
if [ ! -f "$XSD" ]; then
  echo "validate-xsd: BPMN20.xsd not found at $XSD — skipping."
  exit 0
fi

# Resolve the file list (explicit args, else discovery) via the shared helper.
# (Plain `while read` loop — portable to bash 3.2 on macOS, which lacks `mapfile`.)
FILES=()
while IFS= read -r line; do
  [ -n "$line" ] && FILES+=("$line")
done < <(node "$SCRIPT_DIR/bpmn-files.mjs" "${FILE_ARGS[@]+"${FILE_ARGS[@]}"}")

if [ "${#FILES[@]}" -eq 0 ]; then
  echo "validate-xsd: no .bpmn files found — nothing to validate."
  exit 0
fi

# Scratch directory for the core views (a `.xml` file, never a `.bpmn`); removed on exit.
# (`mktemp -d` with trailing X's is portable across BSD/macOS and GNU mktemp — a suffixed
# file template is not.)
WORK="$(mktemp -d "${TMPDIR:-/tmp}/validate-xsd.XXXXXX")" || exit 1
trap 'rm -rf "$WORK"' EXIT
CORE="$WORK/core-view.xml"

echo "validate-xsd: validating ${#FILES[@]} file(s) against BPMN20.xsd (core view — BPMN4CP cp: elements excluded)…"
echo

FAIL=0
for f in "${FILES[@]}"; do
  # Build the core view; its stderr (usage / unbalanced-markup errors) is the finding.
  if ! err="$(node "$SCRIPT_DIR/xsd-core-view.mjs" "$f" 2>&1 >"$CORE")"; then
    echo "✖ $f"
    echo "$err" | sed 's/^/    /' | head -8
    FAIL=$((FAIL + 1))
    continue
  fi
  # xmllint reports the temp path; map it back to the original file (line numbers match).
  if out="$(xmllint --noout --schema "$XSD" "$CORE" 2>&1)"; then
    echo "✓ $f"
  else
    echo "✖ $f"
    echo "$out" | sed "s|$CORE|$f|g" | sed 's/^/    /' | head -8
    FAIL=$((FAIL + 1))
  fi
done

echo
if [ "$FAIL" -gt 0 ]; then
  echo "validate-xsd: $FAIL file(s) failed the BPMN-core schema (genuine BPMN-core deviations)."
  echo "validate-xsd: NOTE — BPMN4CP cp: elements are excluded before validating (direct children of the process by design; validated by moddle-roundtrip)."
  if [ "$STRICT" -eq 1 ]; then
    exit 1
  fi
  echo "validate-xsd: informational mode — not failing the run (use --strict to enforce)."
  exit 0
fi
echo "validate-xsd: OK (BPMN core is schema-valid; BPMN4CP cp: elements excluded by design, see moddle-roundtrip)."
