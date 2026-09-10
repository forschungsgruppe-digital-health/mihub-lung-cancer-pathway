import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';
import { REPO_ROOT, bpmnDocument, linearFlow, runTool, tempDir, writeFixture } from './helpers.mjs';

const MODEL = bpmnDocument({ body: linearFlow });
const bpmnFiles = (args, options) => runTool('bpmn-files.mjs', args, options);

test('fails closed on a missing explicit path (exit 2, nothing on stdout)', () => {
  const r = bpmnFiles(['models/does-not-exist.bpmn']);
  assert.equal(r.status, 2);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /bpmn-files: models\/does-not-exist\.bpmn: file not found — refusing to fall back to discovery/);
});

test('fails closed on an existing path that is not a .bpmn file', (t) => {
  const xml = writeFixture(tempDir(t), 'model.xml', MODEL);
  const r = bpmnFiles([xml]);
  assert.equal(r.status, 2);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /not a \.bpmn file — refusing to fall back to discovery/);
});

test('one bad path aborts the whole run even when the other paths are valid', (t) => {
  const good = writeFixture(tempDir(t), 'good.bpmn', MODEL);
  const r = bpmnFiles([good, 'missing.bpmn']);
  assert.equal(r.status, 2);
  assert.equal(r.stdout, '');
  assert.match(r.stderr, /missing\.bpmn: file not found/);
});

test('echoes valid explicit paths sorted and de-duplicated; flags are ignored', (t) => {
  const dir = tempDir(t);
  const b = writeFixture(dir, 'b.bpmn', MODEL);
  const a = writeFixture(dir, 'a.bpmn', MODEL);
  const r = bpmnFiles(['--strict', b, a, b, '-v']);
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.stdout.trim().split('\n'), [a, b]);
});

test('discovery walks BPMN_MODELS_DIR recursively, skipping node_modules and non-.bpmn files', (t) => {
  const dir = tempDir(t);
  const top = writeFixture(dir, 'lung-cancer-a-pathway.bpmn', MODEL);
  const nested = writeFixture(dir, 'nested/deep.bpmn', MODEL);
  writeFixture(dir, 'node_modules/pkg/ignored.bpmn', MODEL);
  writeFixture(dir, 'notes.xml', MODEL);
  const r = bpmnFiles([], { env: { BPMN_MODELS_DIR: dir } });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.stdout.trim().split('\n'), [top, nested].sort());
});

test('discovery of a missing models dir yields nothing (exit 0, empty stdout)', (t) => {
  const r = bpmnFiles([], { env: { BPMN_MODELS_DIR: join(tempDir(t), 'absent') } });
  assert.equal(r.status, 0);
  assert.equal(r.stdout, '');
});

test('discovery is anchored at the repository, not the cwd', (t) => {
  const elsewhere = tempDir(t);
  const fromElsewhere = bpmnFiles([], { cwd: elsewhere });
  assert.equal(fromElsewhere.status, 0, fromElsewhere.stderr);
  const files = fromElsewhere.stdout.trim().split('\n');
  assert.ok(files.length >= 1, 'the repository has models');
  for (const f of files) {
    assert.ok(isAbsolute(f), `absolute when not beneath the cwd: ${f}`);
    assert.ok(f.startsWith(join(REPO_ROOT, 'models')), f);
    assert.ok(existsSync(f), f);
  }
  // From the repo root the same files come back in the familiar relative form.
  const fromRoot = bpmnFiles([]);
  assert.deepEqual(
    fromRoot.stdout.trim().split('\n'),
    files.map((f) => relative(REPO_ROOT, f))
  );
});
