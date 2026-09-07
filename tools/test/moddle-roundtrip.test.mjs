import test from 'node:test';
import assert from 'node:assert/strict';
import { NS, bpmnDocument, linearFlow, runTool, tempDir, writeFixture } from './helpers.mjs';

const roundtrip = (files) => runTool('moddle-roundtrip.mjs', files);

/** BPMN4CP content as the models use it: a quality indicator directly under the process
 *  (with a nested qIDefinition) and the two cp: attributes on a sub-process. */
const cpBody = (p) => `    <cp:qualityIndicator id="QI_1" name="Time to diagnosis">
      <cp:qIDefinition type="ratio" text="Days from referral to diagnosis" numerator="days" denumerator="patients"/>
    </cp:qualityIndicator>
${linearFlow(p)}
    <${p}subProcess id="Sub_1" name="Staging" cp:selectionBehavior="all" cp:definitionCanonical="urn:example:staging">
      <${p}startEvent id="Sub_start"/>
      <${p}endEvent id="Sub_end"/>
    </${p}subProcess>`;

test('lossless + stable on BPMN4CP quality indicators, cp: activity attributes and i18n translations (exit 0)', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(
    dir,
    'cp-model.bpmn',
    bpmnDocument({
      prefix: 'bpmn2',
      namespaces: { cp: NS.cp, i18n: NS.i18n },
      body: (p) => `${cpBody(p)}
    <${p}task id="Task_i18n" name="Befund besprechen">
      <${p}extensionElements>
        <i18n:translation xml:lang="en">Discuss findings</i18n:translation>
      </${p}extensionElements>
    </${p}task>`,
    })
  );
  const r = roundtrip([file]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /✓ .*cp-model\.bpmn/);
  assert.match(r.out, /stable=true  extension elements \(BPMN4CP\/i18n\) 3 -> 3  \(0 benign attr warning\(s\)\)/);
  // cp:selectionBehavior / cp:definitionCanonical are modelled (ActivityExtension) — no notice.
  assert.doesNotMatch(r.out, /benign "unknown attribute"/);
  assert.match(r.out, /roundtrip: OK \(lossless \+ stable\)/);
});

test('extension prefixes are derived from the root xmlns bindings, not hard-coded to cp:', (t) => {
  // Same BPMN4CP content bound to `clin:`; the input count follows the document's own binding.
  const dir = tempDir(t);
  const file = writeFixture(
    dir,
    'other-prefix.bpmn',
    bpmnDocument({ namespaces: { clin: NS.cp }, body: (p) => cpBody(p).replaceAll('cp:', 'clin:') })
  );
  const r = roundtrip([file]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /extension elements \(BPMN4CP\/i18n\) 2 -> 2  \(0 benign attr warning\(s\)\)/);
  assert.match(r.out, /roundtrip: OK/);
});

test('a document without any extension binding counts 0 -> 0 and passes', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(dir, 'plain.bpmn', bpmnDocument({ body: linearFlow }));
  const r = roundtrip([file]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /extension elements \(BPMN4CP\/i18n\) 0 -> 0/);
});

test('an unmodelled foreign ELEMENT outside extensionElements is data loss → exit 1', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(
    dir,
    'lossy.bpmn',
    bpmnDocument({
      namespaces: { foo: 'http://example.org/foo' },
      body: (p) => `${linearFlow(p)}
    <foo:annotation id="Ann_1">not representable by the descriptor</foo:annotation>`,
    })
  );
  const r = roundtrip([file]);
  assert.equal(r.status, 1);
  assert.match(r.out, /✖ .*lossy\.bpmn/);
  assert.match(r.out, /loss warning: unparsable content <foo:annotation> detected/);
  assert.match(r.out, /roundtrip: 1 file\(s\) failed \(data loss or unstable serialization\)/);
});

test('an unknown ATTRIBUTE is a benign notice, preserved via lax $attrs (exit 0)', (t) => {
  // bpmn-moddle notices an unknown attribute only when it is un-namespaced (like the DI colour
  // attributes in the overarching model) or in a REGISTERED namespace with no matching property;
  // attributes in an unregistered namespace are kept silently. Both noticed shapes are benign.
  const dir = tempDir(t);
  const file = writeFixture(
    dir,
    'benign.bpmn',
    bpmnDocument({
      namespaces: { cp: NS.cp },
      body: (p) => linearFlow(p).replace(`<${p}task id="Task_1"`, `<${p}task id="Task_1" stroke="#000000" cp:unknownThing="x"`),
    })
  );
  const r = roundtrip([file]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /⚠ .*benign\.bpmn/);
  assert.match(r.out, /extension elements \(BPMN4CP\/i18n\) 0 -> 0  \(2 benign attr warning\(s\)\)/);
  assert.match(r.out, /roundtrip: 2 benign "unknown attribute" notice\(s\) — preserved verbatim via lax \$attrs, not data loss: stroke, cp:unknownThing\./);
  assert.match(r.out, /roundtrip: OK/);
});

test('a parse error is a failure (exit 1)', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(dir, 'broken.bpmn', '<bpmn:definitions xmlns:bpmn="x"><bpmn:process');
  const r = roundtrip([file]);
  assert.equal(r.status, 1);
  assert.match(r.out, /✖ .*broken\.bpmn\n\s+parse error:/);
});
