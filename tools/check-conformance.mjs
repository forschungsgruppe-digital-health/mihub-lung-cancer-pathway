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
 * Usage: node tools/check-conformance.mjs [--warn]
 *   --warn  (or env CONFORMANCE_WARN_ONLY=1): ADVISORY mode — report blocking findings as
 *           warnings and exit 0. CI uses this during the release-candidate / pre-remodel phase,
 *           since the models are known-red by design (docs/model-issues, docs/decisions/0001).
 *           Default is STRICT (a blocking finding exits 1).
 * Exit:  0 = all blocking checks passed (or warn-only), 1 = a blocking check failed (strict).
 */
import { spawnSync } from 'node:child_process';

// Advisory mode for the release-candidate / pre-remodel phase: report blocking findings but exit 0.
const WARN_ONLY =
  process.argv.includes('--warn') ||
  ['1', 'true', 'yes'].includes(String(process.env.CONFORMANCE_WARN_ONLY).toLowerCase());

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
  if (WARN_ONLY) {
    // Release-candidate / pre-remodel phase: report, never block. The models are known-red by
    // design; re-enable enforcement (drop warn-only) once the remodel greens them.
    console.log(
      `::warning::BPMN conformance gate: ${blockingFailures} blocking check(s) have findings — ` +
        `warn-only (advisory) during the release-candidate phase; not blocking this run.`
    );
    console.log(
      `\nconformance: WARN — ${blockingFailures} blocking check(s) failed, reported but not blocking ` +
        `(warn-only mode). See docs/model-issues/2026-06-25-baseline.md.`
    );
    process.exit(0);
  }
  console.error(`\nconformance: FAIL — ${blockingFailures} blocking check(s) failed.`);
  process.exit(1);
}
console.log('\nconformance: OK — all blocking checks passed (informational layers may still warn).');
