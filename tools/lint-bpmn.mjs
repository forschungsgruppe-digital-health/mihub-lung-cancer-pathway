#!/usr/bin/env node
/**
 * Structural BPMN 2.0 conformance gate (BLOCKING).
 *
 * Runs `bpmnlint` over the project's `.bpmn` files using the repo-level
 * `.bpmnlintrc` (extends `bpmnlint:recommended` + `bpmnlint:correctness`, with
 * `no-inclusive-gateway` promoted to error for Abnahmetest SYN-5). bpmnlint's job is
 * BPMN *structure / correctness* — disconnected nodes, missing start/end events,
 * implicit splits, missing labels, etc.
 *
 * Why programmatic (not the bpmnlint CLI): these models carry rich clinical
 * extension content (`cp:` BPMN4CP quality indicators, 500+ `i18n:translation`
 * elements). The bpmnlint CLI would elevate every "unparsable extension content"
 * import warning to an error and drown the genuine structural findings. We therefore
 * parse with bpmn-moddle ourselves — with the `cp:` descriptor from
 * tools/moddle/descriptors.mjs registered (so cp:qualityIndicator parses cleanly and
 * its QualityIndicator ids resolve) — and lint the parsed tree, so bpmnlint reports
 * ONLY real structural rule violations.
 *
 * The clinical/size/gateway conventions of the Abnahmetest instrument that bpmnlint
 * does not cover (SYN-2/4, and SYN-5 cross-checked) live in
 * `tools/check-model-metrics.mjs`. See `skills/bpmn-conformance/SKILL.md`.
 *
 * Usage: node tools/lint-bpmn.mjs [file.bpmn ...]   (no args -> discover all)
 * Exit:  0 = no errors, 1 = at least one bpmnlint *error* (warnings do not fail).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { BpmnModdle } from 'bpmn-moddle';
import { resolveBpmnFiles } from './bpmn-files.mjs';
import { extensions } from './moddle/descriptors.mjs';
import { indexById, labelForId } from './element-names.mjs';

const require = createRequire(import.meta.url);
const { Linter } = require('bpmnlint');
const NodeResolver = require('bpmnlint/lib/resolver/node-resolver');

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(here, '..', '.bpmnlintrc'), 'utf8'));

const files = resolveBpmnFiles(process.argv.slice(2));
if (!files.length) {
  console.log('bpmnlint: no .bpmn files found — nothing to lint.');
  process.exit(0);
}

const linter = new Linter({ config, resolver: new NodeResolver() });

let errors = 0;
let warnings = 0;

console.log(`bpmnlint: linting ${files.length} file(s)…\n`);

for (const file of files) {
  const xml = readFileSync(file, 'utf8');
  const moddle = new BpmnModdle(extensions);

  let rootElement;
  try {
    // Benign extension warnings are ignored on purpose (see header).
    ({ rootElement } = await moddle.fromXML(xml));
  } catch (err) {
    console.log(`✖ ${file}\n    parse error: ${err.message}`);
    errors++;
    continue;
  }

  const reports = await linter.lint(rootElement);
  const rules = Object.keys(reports);
  const index = indexById(rootElement); // id → human-readable editor label

  let fileErrors = 0;
  let fileWarnings = 0;
  const lines = [];
  for (const rule of rules) {
    for (const r of reports[rule]) {
      const isError = r.category === 'error';
      if (isError) fileErrors++;
      else fileWarnings++;
      // Report the editor label (`"Name" (id)`) so the element is locatable, not the bare id.
      const where = r.id ? `  →  ${labelForId(r.id, index)}` : '';
      lines.push(`    ${isError ? 'error  ' : 'warning'}  ${r.message}${where}  (${rule})`);
    }
  }

  const status = fileErrors ? '✖' : fileWarnings ? '⚠' : '✓';
  console.log(`${status} ${file}`);
  for (const l of lines) console.log(l);
  if (lines.length) console.log('');

  errors += fileErrors;
  warnings += fileWarnings;
}

console.log('---------------------------------------------------------------');
console.log(`bpmnlint: ${errors} error(s), ${warnings} warning(s).`);
if (errors) {
  console.error('bpmnlint: FAIL — fix the structural errors above.');
  process.exit(1);
}
console.log('bpmnlint: OK (no errors; warnings are advisory).');
