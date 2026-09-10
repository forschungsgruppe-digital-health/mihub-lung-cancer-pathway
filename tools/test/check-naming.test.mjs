import test from 'node:test';
import assert from 'node:assert/strict';
import { bpmnDocument, linearFlow, runTool, tempDir, writeFixture } from './helpers.mjs';

const MODEL = bpmnDocument({ body: linearFlow });
const SVG = '<svg xmlns="http://www.w3.org/2000/svg"/>\n';

/** Run check-naming against a fixture repo root (BPMN_REPO_ROOT). */
const naming = (root) => runTool('check-naming.mjs', [], { env: { BPMN_REPO_ROOT: root } });

/** A paired .bpmn/.svg model in <root>/models/. */
function pair(root, stem) {
  writeFixture(root, `models/${stem}.bpmn`, MODEL);
  writeFixture(root, `models/${stem}.svg`, SVG);
}

test('accepts the ADR-0004 convention with paired .bpmn/.svg', (t) => {
  const root = tempDir(t);
  pair(root, 'lung-cancer-screening-pathway');
  pair(root, 'lung-cancer-molecular-tumor-board-pathway');
  const r = naming(root);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /naming: checking 4 model file\(s\) in models\//);
  assert.match(r.out, /naming: OK/);
});

test('rejects a .bpmn outside models/ (root-level model)', (t) => {
  const root = tempDir(t);
  pair(root, 'lung-cancer-screening-pathway');
  writeFixture(root, 'lung-cancer-stray-pathway.bpmn', MODEL);
  writeFixture(root, 'docs/lung-cancer-nested-pathway.bpmn', MODEL);
  const r = naming(root);
  assert.equal(r.status, 1);
  assert.match(r.out, /✖ lung-cancer-stray-pathway\.bpmn: a \.bpmn model must live in models\/ \(ADR-0004\)/);
  assert.match(r.out, /✖ docs\/lung-cancer-nested-pathway\.bpmn: a \.bpmn model must live in models\//);
  assert.match(r.out, /naming: FAIL — 2 violation\(s\)/);
});

test('rejects the pre-ADR-0004 names (lung-cancer_<phase>-subpathway, lcs-…-final)', (t) => {
  const root = tempDir(t);
  pair(root, 'lung-cancer_diagnostic-subpathway');
  pair(root, 'lcs-pathway-post-workshop2-final');
  const r = naming(root);
  assert.equal(r.status, 1);
  assert.match(r.out, /models\/lung-cancer_diagnostic-subpathway\.bpmn: name must match lung-cancer-<phase>-pathway\.\{bpmn,svg\}/);
  assert.match(r.out, /models\/lung-cancer_diagnostic-subpathway\.svg: name must match/);
  assert.match(r.out, /models\/lcs-pathway-post-workshop2-final\.bpmn: name must match/);
  assert.match(r.out, /naming: FAIL — 4 violation\(s\)\. Convention: ADR-0004/);
});

test('rejects a version/status/date segment inside <phase> (-final, v2, dates, workshopN, draft)', (t) => {
  const root = tempDir(t);
  const cases = [
    ['lung-cancer-screening-final-pathway', 'final'],
    ['lung-cancer-v2-treatment-pathway', 'v2'],
    ['lung-cancer-aftercare-2026-09-07-pathway', '2026-09-07'],
    ['lung-cancer-aftercare-20260907-pathway', '20260907'],
    ['lung-cancer-workshop2-pathway', 'workshop2'],
    ['lung-cancer-diagnostic-draft-pathway', 'draft'],
    ['lung-cancer-treatment-old-pathway', 'old'],
  ];
  for (const [stem] of cases) pair(root, stem);
  const r = naming(root);
  assert.equal(r.status, 1);
  for (const [stem, segment] of cases) {
    assert.match(
      r.out,
      new RegExp(`models/${stem}\\.bpmn: the phase part ".+" carries a version/status/date segment "${segment}" — versioning is git's job .*\\(ADR-0004\\)`),
      `expected a rejection of ${stem} on segment "${segment}"`
    );
  }
});

test('does not mistake a legitimate phase word for a status segment', (t) => {
  // "renewal" contains "new" but is not the segment `new`; digits inside a word are not a date.
  const root = tempDir(t);
  pair(root, 'lung-cancer-renewal-pathway');
  pair(root, 'lung-cancer-stage3b-pathway');
  const r = naming(root);
  assert.equal(r.status, 0, r.out);
});

test('rejects an unpaired .svg and an unpaired .bpmn', (t) => {
  const root = tempDir(t);
  writeFixture(root, 'models/lung-cancer-screening-pathway.svg', SVG);
  writeFixture(root, 'models/lung-cancer-treatment-pathway.bpmn', MODEL);
  const r = naming(root);
  assert.equal(r.status, 1);
  assert.match(r.out, /models\/lung-cancer-screening-pathway\.svg: missing paired lung-cancer-screening-pathway\.bpmn/);
  assert.match(r.out, /models\/lung-cancer-treatment-pathway\.bpmn: missing paired lung-cancer-treatment-pathway\.svg/);
  assert.match(r.out, /naming: FAIL — 2 violation\(s\)/);
});

test('the real repository conforms (cwd-independent default root)', (t) => {
  const elsewhere = tempDir(t);
  const r = runTool('check-naming.mjs', [], { cwd: elsewhere });
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /naming: OK/);
});
