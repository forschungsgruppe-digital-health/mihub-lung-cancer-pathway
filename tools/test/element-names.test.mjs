import test from 'node:test';
import assert from 'node:assert/strict';
import { indexById, indexFromXml, labelForElement, labelForId } from '../element-names.mjs';
import { bpmnDocument, linearFlow } from './helpers.mjs';

test('labelForId: named → "Name" (id); unnamed → ‹unnamed Type› (id); unknown → bare id', () => {
  const index = new Map([
    ['G1', { name: 'Decide', type: 'bpmn:ExclusiveGateway' }],
    ['G2', { name: undefined, type: 'bpmn:InclusiveGateway' }],
  ]);
  assert.equal(labelForId('G1', index), '"Decide" (G1)');
  assert.equal(labelForId('G2', index), '‹unnamed InclusiveGateway› (G2)');
  assert.equal(labelForId('nope', index), 'nope');
  assert.equal(labelForId('G1', undefined), 'G1');
});

test('labels collapse whitespace and cap long names at 80 characters with an ellipsis', () => {
  assert.equal(labelForId('T', new Map([['T', { name: '  Befund\n  besprechen   ', type: 'bpmn:Task' }]])), '"Befund besprechen" (T)');
  const label = labelForId('T', new Map([['T', { name: 'x'.repeat(100), type: 'bpmn:Task' }]]));
  assert.equal(label, `"${'x'.repeat(79)}…" (T)`);
  const exact = labelForId('T', new Map([['T', { name: 'y'.repeat(80), type: 'bpmn:Task' }]]));
  assert.equal(exact, `"${'y'.repeat(80)}" (T)`);
});

test('labelForElement formats moddle elements and tolerates missing input', () => {
  assert.equal(labelForElement({ id: 'S', name: 'Start', $type: 'bpmn:StartEvent' }), '"Start" (S)');
  assert.equal(labelForElement({ id: 'S', $type: 'bpmn:StartEvent' }), '‹unnamed StartEvent› (S)');
  assert.equal(labelForElement({ id: 'X' }), '‹unnamed element› (X)');
  assert.equal(labelForElement(null), '(unknown element)');
  assert.equal(labelForElement({ $type: 'bpmn:Task' }), '(unknown element)');
});

test('indexById walks nested arrays and typed children, is cycle-safe, keeps the first id', () => {
  const child = { id: 'C', name: 'Child', $type: 'bpmn:Task' };
  const root = { id: 'R', $type: 'bpmn:Process', flowElements: [child, { id: 'C', name: 'Dup', $type: 'bpmn:Task' }] };
  child.$parent = root; // cycle
  const index = indexById(root);
  assert.deepEqual([...index.keys()], ['R', 'C']);
  assert.equal(index.get('C').name, 'Child');
});

test('indexFromXml indexes the process, flow nodes and nested sub-process content', async () => {
  const index = await indexFromXml(
    bpmnDocument({
      body: (p) => `${linearFlow(p)}
    <${p}subProcess id="Sub_1" name="Staging"><${p}startEvent id="Sub_start"/></${p}subProcess>`,
    })
  );
  assert.equal(index.get('Process_test').type, 'bpmn:Process');
  assert.equal(index.get('Task_1').name, 'Do something');
  assert.equal(index.get('Sub_start').type, 'bpmn:StartEvent');
  assert.equal(labelForId('Sub_1', index), '"Staging" (Sub_1)');
  await assert.rejects(indexFromXml('<bpmn:definitions xmlns:bpmn="x"><bpmn:process'));
});
