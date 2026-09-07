#!/usr/bin/env node
/**
 * Single source of truth for *which* `.bpmn` files the conformance checks cover.
 *
 * Used by:
 *   - tools/lint-bpmn.mjs           (import)
 *   - tools/check-model-metrics.mjs (import)
 *   - tools/moddle-roundtrip.mjs    (import)
 *   - tools/check-soundness.mjs     (import)
 *   - tools/validate-xsd.sh         (CLI: `node tools/bpmn-files.mjs`)
 *
 * Behaviour:
 *   - Positional arguments (anything not starting with `-`) are file paths and are taken
 *     AS GIVEN: every one of them must exist and end in `.bpmn`. A missing or non-`.bpmn`
 *     path is an error (message on stderr, exit 2) — the resolver FAILS CLOSED and never
 *     silently falls back to full discovery, so a typo in a git-hook / CI invocation cannot
 *     turn "check this one file" into "check everything" (or into "check nothing").
 *     Flags (`--strict`, `--warn`, …) are ignored here; the calling tool interprets them.
 *   - With no positional arguments      -> discover every `.bpmn` under the models
 *     directory, excluding dependencies and VCS metadata.
 *
 * Discovery is anchored at the REPOSITORY (the parent of this script's directory), never
 * at the current working directory, so every tool behaves identically from any cwd.
 * Discovered files are reported relative to the cwd when they lie beneath it (that is the
 * familiar `models/x.bpmn` when run from the repo root) and as absolute paths otherwise.
 *
 * In this repo the models live under `models/` (ADR-0004); add more roots to ROOTS if a
 * second model location is ever introduced. The environment variable `BPMN_MODELS_DIR`
 * replaces the discovery root (tools/test/ uses it to point the tools at a fixture
 * directory); it does not alter the default behaviour.
 *
 * CLI usage:
 *   node tools/bpmn-files.mjs                    # print discovered files, one per line
 *   node tools/bpmn-files.mjs models/a.bpmn      # echo the given file(s), validated
 * Exit:  0 = ok, 2 = a given path does not exist or is not a `.bpmn` file.
 */
import { readdirSync, existsSync, statSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repository root — the parent of tools/ — independent of the current working directory. */
export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Directories (relative to the repo root) scanned for `.bpmn` files when no paths are given. */
const ROOTS = ['models'];

/** Directory names never descended into (deps, build output, VCS). */
const EXCLUDE_DIRS = new Set(['node_modules', 'dist', '.git', 'coverage', '.github']);

/** The absolute discovery roots: `BPMN_MODELS_DIR` if set, else ROOTS under the repo root. */
function discoveryRoots() {
  const override = process.env.BPMN_MODELS_DIR;
  return override ? [resolve(override)] : ROOTS.map((r) => join(REPO_ROOT, r));
}

function walk(dir, acc) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc; // missing root -> nothing to add
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      walk(join(dir, entry.name), acc);
    } else if (entry.isFile() && entry.name.endsWith('.bpmn')) {
      acc.push(join(dir, entry.name));
    }
  }
  return acc;
}

/** Report form of a discovered file: relative to the cwd when beneath it, absolute otherwise. */
function fromCwd(absolutePath) {
  const rel = relative(process.cwd(), absolutePath);
  return rel && !rel.startsWith('..') && !isAbsolute(rel) ? rel : absolutePath;
}

/** Fail closed: an invalid explicit path aborts the run instead of widening it to discovery. */
function reject(message) {
  process.stderr.write(
    `bpmn-files: ${message} — refusing to fall back to discovery (every explicit path must exist and end in .bpmn).\n`
  );
  process.exit(2);
}

/**
 * @param {string[]} argv command-line arguments (may contain flags and paths)
 * @returns {string[]} sorted list of `.bpmn` file paths (explicit ones as given)
 */
export function resolveBpmnFiles(argv = []) {
  const explicit = argv.filter((a) => !String(a).startsWith('-'));
  if (explicit.length) {
    for (const p of explicit) {
      if (!p.endsWith('.bpmn')) reject(`${p}: not a .bpmn file`);
      if (!existsSync(p) || !statSync(p).isFile()) reject(`${p}: file not found`);
    }
    return [...new Set(explicit)].sort();
  }
  const found = [];
  for (const root of discoveryRoots()) walk(root, found);
  return [...new Set(found.map(fromCwd))].sort();
}

function isMain() {
  try {
    return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMain()) {
  // Tolerate a consumer closing the pipe early (e.g. `| head`).
  process.stdout.on('error', (e) => {
    if (e && e.code === 'EPIPE') process.exit(0);
  });
  const files = resolveBpmnFiles(process.argv.slice(2));
  if (files.length) process.stdout.write(files.join('\n') + '\n');
}
