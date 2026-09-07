#!/usr/bin/env node
/**
 * Model naming-convention gate (BLOCKING) — enforces ADR-0004.
 *
 * Rules:
 *   1. Every `.bpmn` model lives under `models/` (no stray models at the repo root).
 *   2. Model files match `lung-cancer-<phase>-pathway.{bpmn,svg}` (kebab-case; `<phase>`
 *      is one or more lowercase-alphanumeric segments). No status/version/date in the
 *      filename — versioning is git's job (version.txt, tags, CHANGELOG). A `<phase>` that
 *      smuggles one in as a segment (`v2`, `final`, `draft`, `wip`, `old`, `new`, `copy`,
 *      `backup`, `workshop2`, a date such as `2026-09-07` or `20260907`) is rejected too.
 *   3. Each `.bpmn` has a paired same-stem `.svg` and vice versa.
 *
 * A non-conforming name (e.g. `lcs-pathway-post-workshop2-final.bpmn`) FAILS the build.
 *
 * The repository root is the parent of tools/ (this script's location), NOT the current
 * working directory, so the check is cwd-independent. The environment variable
 * `BPMN_REPO_ROOT` overrides it (tools/test/ runs the check against a fixture tree); the
 * models are always expected in `<root>/models`.
 *
 * Usage: node tools/check-naming.mjs
 * Exit:  0 = all model files conform, 1 = at least one violation.
 */
import { readdirSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = process.env.BPMN_REPO_ROOT
  ? resolve(process.env.BPMN_REPO_ROOT)
  : join(dirname(fileURLToPath(import.meta.url)), '..');
const MODELS_DIR = 'models';
const MODELS_PATH = join(REPO_ROOT, MODELS_DIR);
const NAME_RE = /^lung-cancer-[a-z0-9]+(-[a-z0-9]+)*-pathway\.(bpmn|svg)$/;
/** Extracts `<phase>` from a name that already passed NAME_RE. */
const PHASE_RE = /^lung-cancer-(.+)-pathway\.(bpmn|svg)$/;
/** A version / status / date segment inside `<phase>` (segments are `-`-separated). */
const VERSION_STATUS_RE =
  /(^|-)(v\d+|final|draft|wip|old|new|copy|backup|workshop\d*|\d{4}-\d{2}-\d{2}|\d{6,8})(-|$)/;
const EXCLUDE = new Set(['node_modules', '.git', 'dist', 'coverage']);

/** Every file below `dir`, as paths relative to the repo root. */
function walk(dir, acc = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    if (e.isDirectory()) { if (!EXCLUDE.has(e.name)) walk(join(dir, e.name), acc); }
    else acc.push(relative(REPO_ROOT, join(dir, e.name)));
  }
  return acc;
}

const all = walk(REPO_ROOT);
const errors = [];

// 1) every .bpmn must live directly under models/
for (const f of all.filter((p) => p.endsWith('.bpmn'))) {
  if (dirname(f) !== MODELS_DIR) errors.push(`${f}: a .bpmn model must live in ${MODELS_DIR}/ (ADR-0004)`);
}

// 2 + 3) naming + pairing inside models/
const modelFiles = existsSync(MODELS_PATH)
  ? readdirSync(MODELS_PATH).filter((n) => n.endsWith('.bpmn') || n.endsWith('.svg'))
  : [];
for (const n of modelFiles) {
  if (!NAME_RE.test(n)) {
    errors.push(`${MODELS_DIR}/${n}: name must match lung-cancer-<phase>-pathway.{bpmn,svg} (kebab-case, no status/version in the name)`);
  } else {
    const phase = n.match(PHASE_RE)[1];
    const hit = phase.match(VERSION_STATUS_RE);
    if (hit) {
      errors.push(
        `${MODELS_DIR}/${n}: the phase part "${phase}" carries a version/status/date segment "${hit[2]}" — ` +
          'versioning is git\'s job (version.txt, tags, CHANGELOG), never the filename (ADR-0004)'
      );
    }
  }
  const ext = n.endsWith('.bpmn') ? 'svg' : 'bpmn';
  const paired = n.replace(/\.(bpmn|svg)$/, `.${ext}`);
  if (!existsSync(join(MODELS_PATH, paired))) {
    errors.push(`${MODELS_DIR}/${n}: missing paired ${paired} (each .bpmn needs a matching .svg and vice versa)`);
  }
}

console.log(`naming: checking ${modelFiles.length} model file(s) in ${MODELS_DIR}/…`);
const unique = [...new Set(errors)];
if (unique.length) {
  for (const e of unique) console.error(`  ✖ ${e}`);
  console.error(`\nnaming: FAIL — ${unique.length} violation(s). Convention: ADR-0004 (lung-cancer-<phase>-pathway).`);
  process.exit(1);
}
console.log('naming: OK (all models match lung-cancer-<phase>-pathway with paired bpmn/svg).');
