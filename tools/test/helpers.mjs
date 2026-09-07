/**
 * Shared helpers for the tools' unit tests (node:test + node:assert — no extra dependency).
 *
 * Fixtures are INLINE strings written from test code into a per-test temp dir under
 * os.tmpdir() — never files in the repo: check-naming fails on any .bpmn outside models/,
 * and the model-guard hook denies agent writes to .bpmn/.svg paths. Tools that insist on the
 * `.bpmn` extension (bpmn-files and everything built on it) get fixtures named `*.bpmn`
 * inside the temp dir; everything else uses `.xml`.
 *
 * Run: `npm test` (= node --test "tools/test/**\/*.test.mjs").
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Repository root — the parent of tools/test/. */
export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Absolute path of a script in tools/. */
export const toolPath = (name) => join(REPO_ROOT, 'tools', name);

export const NS = {
  bpmn: 'http://www.omg.org/spec/BPMN/20100524/MODEL',
  cp: 'http://www.helict.de/bpmn4cp',
  i18n: 'http://www.omg.org/spec/BPMN/non-normative/extensions/i18n/1.0',
};

/**
 * Run a tool script with the current node binary.
 * @returns {{ status: number|null, stdout: string, stderr: string, out: string }}
 */
export function runTool(name, args = [], { env = {}, cwd = REPO_ROOT } = {}) {
  const r = spawnSync(process.execPath, [toolPath(name), ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  const stdout = r.stdout || '';
  const stderr = r.stderr || '';
  return { status: r.status, stdout, stderr, out: stdout + stderr };
}

/** A fresh temp dir, removed when the test finishes. */
export function tempDir(t) {
  const dir = mkdtempSync(join(tmpdir(), 'bpmn-tools-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

/** Write an inline fixture below `dir` (parent dirs created); returns the absolute path. */
export function writeFixture(dir, relativePath, content) {
  const file = join(dir, relativePath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return file;
}

/**
 * Minimal BPMN 2.0 document.
 *   prefix     — the BPMN namespace prefix on the root ('' = default namespace, like the
 *                screening model; 'bpmn2' like the Camunda-exported models)
 *   namespaces — extra xmlns bindings { prefix: uri }
 *   body       — the <process> content: a string, or a function of the element prefix
 *                (`'bpmn:'` / `''`) so the same body works for every root prefix
 */
export function bpmnDocument({ prefix = 'bpmn', namespaces = {}, body = '' } = {}) {
  const p = prefix ? `${prefix}:` : '';
  const bpmnBinding = prefix ? `xmlns:${prefix}="${NS.bpmn}"` : `xmlns="${NS.bpmn}"`;
  const extra = Object.entries(namespaces)
    .map(([k, v]) => ` xmlns:${k}="${v}"`)
    .join('');
  const content = typeof body === 'function' ? body(p) : body;
  return `<?xml version="1.0" encoding="UTF-8"?>
<${p}definitions ${bpmnBinding}${extra} id="Definitions_test" targetNamespace="http://example.org/test">
  <${p}process id="Process_test" name="Test process" isExecutable="false">
${content}
  </${p}process>
</${p}definitions>
`;
}

/** A well-formed linear flow: start → task → end (one level, one start, one end, no lanes). */
export const linearFlow = (p) => `    <${p}startEvent id="Start_1" name="Start"/>
    <${p}task id="Task_1" name="Do something"/>
    <${p}endEvent id="End_1" name="End"/>
    <${p}sequenceFlow id="Flow_1" sourceRef="Start_1" targetRef="Task_1"/>
    <${p}sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="End_1"/>`;
