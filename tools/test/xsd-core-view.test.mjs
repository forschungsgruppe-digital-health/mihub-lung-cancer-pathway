import test from 'node:test';
import assert from 'node:assert/strict';
import { NS, runTool, tempDir, writeFixture } from './helpers.mjs';

const coreView = (args) => runTool('xsd-core-view.mjs', args);

/** Two prefixes bound to BPMN4CP, nested + self-closing cp: elements, `>` inside quoted
 *  attribute values, a multi-line cp: start-tag, and a cp: ATTRIBUTE on a core element. */
const FIXTURE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="${NS.bpmn}" xmlns:cp="${NS.cp}" xmlns:clin="${NS.cp}" id="Definitions_1">
  <bpmn:process id="Process_1">
    <cp:qualityIndicator id="QI_1" name="a > b">
      <cp:qIDefinition type="ratio" text="x > y" numerator='n > 0'/>
    </cp:qualityIndicator>
    <clin:qualityIndicator id="QI_2"/>
    <bpmn:task id="Task_1" name="Keep me" cp:selectionBehavior="all"/>
    <cp:qualityIndicator id="QI_3"
      name="multi
line">
      <cp:qIDefinition type="t"/>
    </cp:qualityIndicator>
    <bpmn:endEvent id="End_1"/>
  </bpmn:process>
</bpmn:definitions>
`;

test('removes every BPMN4CP element (both bound prefixes), keeps core elements and cp: attributes', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(dir, 'model.xml', FIXTURE);
  const r = coreView([file]);
  assert.equal(r.status, 0, r.stderr);
  assert.doesNotMatch(r.stdout, /<\/?cp:/);
  assert.doesNotMatch(r.stdout, /<\/?clin:/);
  assert.match(r.stdout, /<bpmn:task id="Task_1" name="Keep me" cp:selectionBehavior="all"\/>/);
  assert.match(r.stdout, /<bpmn:endEvent id="End_1"\/>/);
  // The quoted `>` did not terminate the tag early: the whole element (attribute values included) is gone.
  assert.doesNotMatch(r.stdout, /a > b|x > y|n > 0|multi\nline/);
});

test('preserves the line count so xmllint line numbers still point into the original', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(dir, 'model.xml', FIXTURE);
  const r = coreView([file]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.split('\n').length, FIXTURE.split('\n').length);
  // The core element on line 8 of the fixture is still on line 8 of the view.
  assert.match(r.stdout.split('\n')[7], /Task_1/);
});

test('echoes a file that binds no BPMN4CP prefix unchanged', (t) => {
  const dir = tempDir(t);
  const plain = FIXTURE.replace(` xmlns:cp="${NS.cp}" xmlns:clin="${NS.cp}"`, '');
  const file = writeFixture(dir, 'plain.xml', plain);
  const r = coreView([file]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout, plain);
});

test('reports an unbalanced BPMN4CP element instead of guessing (exit 2, with the line)', (t) => {
  const dir = tempDir(t);
  const file = writeFixture(
    dir,
    'unbalanced.xml',
    `<bpmn:definitions xmlns:bpmn="${NS.bpmn}" xmlns:cp="${NS.cp}">
  <bpmn:process id="P">
    <cp:qualityIndicator id="QI_open">
  </bpmn:process>
</bpmn:definitions>
`
  );
  const r = coreView([file]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /unbalanced\.xml:3: BPMN4CP element `<cp:qualityIndicator` could not be removed/);
});

test('usage error without a file argument (exit 1); unreadable file (exit 1)', (t) => {
  assert.equal(coreView([]).status, 1);
  assert.match(coreView([]).stderr, /usage: node tools\/xsd-core-view\.mjs <file\.bpmn>/);
  const missing = coreView([`${tempDir(t)}/nope.xml`]);
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /cannot read/);
});
