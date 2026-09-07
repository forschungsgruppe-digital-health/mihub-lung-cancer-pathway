import test from 'node:test';
import assert from 'node:assert/strict';
import { bpmnDocument, linearFlow, runTool, tempDir, writeFixture } from './helpers.mjs';

const metrics = (files, options) => runTool('check-model-metrics.mjs', files, options);

test('SYN-5: OR-gateways (inclusive/complex) are a blocking finding, named by editor label → exit 1', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(
    dir,
    'or-gateway.bpmn',
    bpmnDocument({
      body: (p) => `${linearFlow(p)}
    <${p}inclusiveGateway id="Gateway_or" name="Which therapies?"/>
    <${p}complexGateway id="Gateway_complex"/>`,
    })
  );
  const r = metrics([file]);
  assert.equal(r.status, 1);
  assert.match(r.out, /✖ SYN-5 \[Test process\] 2 OR-gateway\(s\) — not allowed:/);
  assert.match(r.out, /"Which therapies\?" \(Gateway_or\)/);
  assert.match(r.out, /‹unnamed ComplexGateway› \(Gateway_complex\)/);
  assert.match(r.out, /metrics: 2 blocking OR-gateway finding\(s\), 0 advisory warning\(s\)/);
  assert.match(r.out, /metrics: FAIL — remove\/rework OR-gateways \(Abnahmetest SYN-5/);
});

test('SYN-2: two start events are an advisory note (exit 0), listing the starts by label', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(
    dir,
    'two-starts.bpmn',
    bpmnDocument({
      body: (p) => `${linearFlow(p)}
    <${p}startEvent id="Start_2" name="Second entry"/>`,
    })
  );
  const r = metrics([file]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /⚠ SYN-2 \[Test process\] start-events=2, end-events=1 \(expected 1\/1 — review\)/);
  assert.match(r.out, /starts: "Start" \(Start_1\), "Second entry" \(Start_2\)/);
  assert.match(r.out, /metrics: 0 blocking OR-gateway finding\(s\), 1 advisory warning\(s\)/);
  assert.match(r.out, /metrics: OK \(no blocking findings; advisory warnings are for review\)/);
});

test('levels: a nested sub-process is checked as its own level', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(
    dir,
    'nested.bpmn',
    bpmnDocument({
      body: (p) => `${linearFlow(p)}
    <${p}subProcess id="Sub_1" name="Staging">
      <${p}task id="Sub_task" name="Stage"/>
    </${p}subProcess>`,
    })
  );
  const r = metrics([file]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /\(2 level\(s\), prefix <bpmn:>\)/);
  assert.match(r.out, /⚠ SYN-2 \[Test process › Staging\] start-events=0, end-events=0/);
});

test('a clean single-level model passes; missing lanes are only a SEM-1 note', (t) => {
  const dir = tempDir(t);
  writeFixture(dir, 'clean.bpmn', bpmnDocument({ body: linearFlow }));
  // Discovery via BPMN_MODELS_DIR instead of explicit paths.
  const r = metrics([], { env: { BPMN_MODELS_DIR: dir } });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /metrics: checking 1 file\(s\)/);
  assert.match(r.out, /✓ .*clean\.bpmn  \(1 level\(s\), prefix <bpmn:>\)/);
  assert.match(r.out, /· SEM-1 no lanes found/);
  assert.match(r.out, /metrics: 0 blocking OR-gateway finding\(s\), 0 advisory warning\(s\)/);
});

test('root prefix: a default-namespace root prints "(default ns)"; mixed prefixes trigger the hygiene note', (t) => {
  const dir = tempDir(t);
  const defaultNs = writeFixture(dir, 'default-ns.bpmn', bpmnDocument({ prefix: '', body: linearFlow }));
  const bpmn2 = writeFixture(dir, 'bpmn2.bpmn', bpmnDocument({ prefix: 'bpmn2', body: linearFlow }));
  const r = metrics([defaultNs, bpmn2]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /default-ns\.bpmn  \(1 level\(s\), prefix \(default ns\)\)/);
  assert.match(r.out, /bpmn2\.bpmn  \(1 level\(s\), prefix <bpmn2:>\)/);
  assert.match(r.out, /⚠ prefix hygiene: models use mixed root prefixes/);
  assert.match(r.out, /\(default ns\)\s+.*default-ns\.bpmn/);
  assert.match(r.out, /<bpmn2:>\s+.*bpmn2\.bpmn/);
});

test('a file that cannot be parsed is a blocking finding (exit 1)', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(dir, 'broken.bpmn', '<bpmn:definitions xmlns:bpmn="x"><bpmn:process');
  const r = metrics([file]);
  assert.equal(r.status, 1);
  assert.match(r.out, /✖ .*broken\.bpmn\n\s+parse error:/);
});
