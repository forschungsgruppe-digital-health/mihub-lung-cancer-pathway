#!/usr/bin/env node
/**
 * Model naming-convention gate (BLOCKING) — enforces ADR-0004.
 *
 * Rules:
 *   1. Every `.bpmn` model lives under `models/` (no stray models at the repo root).
 *   2. Model files match `lung-cancer-<phase>-pathway.{bpmn,svg}` (kebab-case; `<phase>`
 *      is one or more lowercase-alphanumeric segments). No status/version/date in the
 *      filename — versioning is git's job (version.txt, tags, CHANGELOG).
 *   3. Each `.bpmn` has a paired same-stem `.svg` and vice versa.
 *
 * A non-conforming name (e.g. `lcs-pathway-post-workshop2-final.bpmn`) FAILS the build.
 *
 * Usage: node tools/check-naming.mjs
 * Exit:  0 = all model files conform, 1 = at least one violation.
 */
import { readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';

const MODELS_DIR = 'models';
const NAME_RE = /^lung-cancer-[a-z0-9]+(-[a-z0-9]+)*-pathway\.(bpmn|svg)$/;
const EXCLUDE = new Set(['node_modules', '.git', 'dist', 'coverage']);

function walk(dir, acc = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    if (e.isDirectory()) { if (!EXCLUDE.has(e.name)) walk(join(dir, e.name), acc); }
    else acc.push(join(dir, e.name).replace(/^\.\//, ''));
  }
  return acc;
}

const all = walk('.');
const errors = [];

// 1) every .bpmn must live directly under models/
for (const f of all.filter((p) => p.endsWith('.bpmn'))) {
  if (dirname(f) !== MODELS_DIR) errors.push(`${f}: a .bpmn model must live in ${MODELS_DIR}/ (ADR-0004)`);
}

// 2 + 3) naming + pairing inside models/
const modelFiles = existsSync(MODELS_DIR)
  ? readdirSync(MODELS_DIR).filter((n) => n.endsWith('.bpmn') || n.endsWith('.svg'))
  : [];
for (const n of modelFiles) {
  if (!NAME_RE.test(n)) {
    errors.push(`${MODELS_DIR}/${n}: name must match lung-cancer-<phase>-pathway.{bpmn,svg} (kebab-case, no status/version in the name)`);
  }
  const ext = n.endsWith('.bpmn') ? 'svg' : 'bpmn';
  const paired = n.replace(/\.(bpmn|svg)$/, `.${ext}`);
  if (!existsSync(join(MODELS_DIR, paired))) {
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
