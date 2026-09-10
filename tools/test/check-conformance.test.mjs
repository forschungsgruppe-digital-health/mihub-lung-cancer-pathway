import test from 'node:test';
import assert from 'node:assert/strict';
import { runTool, tempDir } from './helpers.mjs';

const LAYERS = [
  'model naming convention (ADR-0004: lung-cancer-<phase>-pathway)',
  'bpmnlint (BPMN structure/correctness)',
  'model metrics (Abnahmetest SYN-5 blocking; SYN-2/4 advisory)',
  'moddle roundtrip (cp:/i18n lossless + stable)',
  'XSD core (OMG BPMN20.xsd)',
];
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('warn-only mode (CONFORMANCE_WARN_ONLY=1): every layer runs, the summary is printed, exit 0', (t) => {
  // Run from a foreign cwd on purpose — the gate must resolve its tools from the repository.
  const r = runTool('check-conformance.mjs', [], { env: { CONFORMANCE_WARN_ONLY: '1' }, cwd: tempDir(t) });
  assert.equal(r.status, 0, r.out.slice(-2000));
  assert.match(r.stdout, /================ conformance summary ================/);
  for (const layer of LAYERS) {
    assert.match(r.stdout, new RegExp(`=== ${escapeRe(layer)}`), `layer ran: ${layer}`);
    assert.match(r.stdout, new RegExp(`( ok |FAIL|warn) +${escapeRe(layer)}`), `layer in summary: ${layer}`);
  }
  assert.match(r.stdout, /XSD core \(OMG BPMN20\.xsd\)  \[informational\]/);
  // The naming layer is green on the real models (ADR-0004 enforced); the others may be red
  // during the RC phase — either way warn-only never blocks.
  assert.match(r.stdout, / ok +model naming convention/);
  assert.match(
    r.stdout,
    /conformance: (WARN — \d+ blocking check\(s\) failed, reported but not blocking \(warn-only mode\)|OK — all blocking checks passed)/
  );
  if (/conformance: WARN/.test(r.stdout)) assert.match(r.stdout, /::warning::BPMN conformance gate: \d+ blocking check\(s\) have findings/);
});
