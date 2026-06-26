#!/usr/bin/env node
/**
 * Aggregating conformance gate — runs every check, prints all output, and fails
 * only if a BLOCKING check failed. Unlike a plain `a && b && c` chain this does
 * not short-circuit, so a single run reports the full picture (structural lint
 * AND the SYN-5 OR-gateway findings AND the informational layers).
 *
 * Blocking layers (decision lives in the tool, never in the model):
 *   - bpmnlint            structural BPMN 2.0 correctness
 *   - model metrics       Abnahmetest SYN-5 (no OR-gateway); SYN-2/SYN-4 advisory
 * Informational layers (reported, never blocking yet):
 *   - moddle roundtrip    serialization stability + extension-content presence
 *                         (cp:/i18n: are not yet modelled — see follow-up)
 *   - XSD core            BPMN core vs OMG BPMN20.xsd (extensions pass via lax)
 *
 * Usage: node tools/check-conformance.mjs
 * Exit:  0 = all blocking checks passed, 1 = a blocking check failed.
 */
import { spawnSync } from 'node:child_process';

const checks = [
  { name: 'model naming convention (ADR-0004: lung-cancer-<phase>-pathway)', cmd: process.execPath, args: ['tools/check-naming.mjs'], blocking: true },
  { name: 'bpmnlint (BPMN structure/correctness)', cmd: process.execPath, args: ['tools/lint-bpmn.mjs'], blocking: true },
  { name: 'model metrics (Abnahmetest SYN-5 blocking; SYN-2/4 advisory)', cmd: process.execPath, args: ['tools/check-model-metrics.mjs'], blocking: true },
  { name: 'moddle roundtrip (cp:/i18n lossless + stable)', cmd: process.execPath, args: ['tools/moddle-roundtrip.mjs'], blocking: true },
  { name: 'XSD core (OMG BPMN20.xsd)', cmd: 'bash', args: ['tools/validate-xsd.sh'], blocking: false },
];

let blockingFailures = 0;
const summary = [];

for (const c of checks) {
  console.log(`\n=== ${c.name}${c.blocking ? '' : '  [informational]'} ===`);
  const r = spawnSync(c.cmd, c.args, { stdio: 'inherit' });
  const failed = (r.status ?? 1) !== 0;
  if (failed && c.blocking) blockingFailures++;
  summary.push(`${failed ? (c.blocking ? 'FAIL' : 'warn') : ' ok '}  ${c.name}`);
}

console.log('\n================ conformance summary ================');
for (const s of summary) console.log('  ' + s);
console.log('=====================================================');

if (blockingFailures) {
  console.error(`\nconformance: FAIL — ${blockingFailures} blocking check(s) failed.`);
  process.exit(1);
}
console.log('\nconformance: OK — all blocking checks passed (informational layers may still warn).');
