import test from 'node:test';
import assert from 'node:assert/strict';
import { runTool, tempDir, writeFixture } from './helpers.mjs';

/** Run check-docs-version against a fixture repo root (BPMN_REPO_ROOT). */
const docsVersion = (root) => runTool('check-docs-version.mjs', [], { env: { BPMN_REPO_ROOT: root } });

/** The README "Aktuelle Version" row, with the release-please marker on the same line. */
const readmeRow = (version, { marker = true } = {}) =>
  `# Titel\n\n| Feld | Wert |\n|---|---|\n| **Release-Phase** | Vorabversionen (\`-rc.N\`). |\n` +
  `| **Aktuelle Version** | **v${version}**${marker ? ' <!-- x-release-please-version -->' : ''} — siehe CHANGELOG. |\n`;

const citation = (version) =>
  `cff-version: 1.2.0\ntitle: "Test"\ntype: dataset\nversion: "${version}" # x-release-please-version\n`;

/** A fixture repo whose three version statements are set independently. */
function repo(t, { version = '1.2.3', readme = null, cff = null, readmeOptions = {} } = {}) {
  const root = tempDir(t);
  writeFixture(root, 'version.txt', `${version}\n`);
  writeFixture(root, 'README.md', readme ?? readmeRow(version, readmeOptions));
  writeFixture(root, 'CITATION.cff', citation(cff ?? version));
  return root;
}

test('matching versions in version.txt, README.md and CITATION.cff → exit 0', (t) => {
  const r = docsVersion(repo(t, { version: '0.5.0-rc.1' }));
  assert.equal(r.status, 0, r.out);
  assert.match(r.stdout, /docs-version: checking the documented version against version\.txt \(v0\.5\.0-rc\.1\)/);
  assert.match(r.stdout, /ok +README\.md:6 — v0\.5\.0-rc\.1/);
  assert.match(r.stdout, /ok +CITATION\.cff:4 — v0\.5\.0-rc\.1/);
  assert.match(r.stdout, /docs-version: OK/);
});

test('a stale README version → exit 1, naming BOTH values and the file to fix', (t) => {
  const root = repo(t, { version: '0.6.0-rc.1', readme: readmeRow('0.5.0-rc.1') });
  const r = docsVersion(root);
  assert.equal(r.status, 1, r.out);
  assert.match(
    r.stderr,
    /✖ README\.md:6: documents version "0\.5\.0-rc\.1" but version\.txt says "0\.6\.0-rc\.1" — fix README\.md/
  );
  assert.match(r.stderr, /version\.txt is the source of truth/);
  assert.match(r.stderr, /docs-version: FAIL — 1 inconsistency/);
  // The citation stayed in sync and must not be blamed.
  assert.match(r.stdout, /ok +CITATION\.cff/);
});

test('a stale CITATION.cff version → exit 1, naming both values', (t) => {
  const r = docsVersion(repo(t, { version: '0.6.0-rc.1', cff: '0.4.0-rc.1' }));
  assert.equal(r.status, 1, r.out);
  assert.match(
    r.stderr,
    /✖ CITATION\.cff:4: documents version "0\.4\.0-rc\.1" but version\.txt says "0\.6\.0-rc\.1" — fix CITATION\.cff/
  );
  assert.match(r.stdout, /ok +README\.md/);
});

test('both stale → exit 1 and BOTH are reported (the run does not stop at the first)', (t) => {
  const r = docsVersion(repo(t, { version: '2.0.0', readme: readmeRow('1.0.0'), cff: '1.5.0' }));
  assert.equal(r.status, 1, r.out);
  assert.match(r.stderr, /✖ README\.md:6: documents version "1\.0\.0" but version\.txt says "2\.0\.0"/);
  assert.match(r.stderr, /✖ CITATION\.cff:4: documents version "1\.5\.0" but version\.txt says "2\.0\.0"/);
  assert.match(r.stderr, /docs-version: FAIL — 2 inconsistenc/);
});

test('a README without any version statement → a clear error, exit 1', (t) => {
  const r = docsVersion(repo(t, { readme: '# Titel\n\nKeine Versionsangabe hier.\n' }));
  assert.equal(r.status, 1, r.out);
  assert.match(r.stderr, /✖ README\.md: no version statement found/);
  assert.match(r.stderr, /`\*\*v<VERSION>\*\*` on a line that mentions "Aktuelle Version"/);
  assert.match(r.stderr, /x-release-please-version/);
});

test('the marker line without a **v…** token → a clear error, exit 1', (t) => {
  const readme = '# Titel\n\n| **Aktuelle Version** | v0.5.0-rc.1 <!-- x-release-please-version --> |\n';
  const r = docsVersion(repo(t, { readme }));
  assert.equal(r.status, 1, r.out);
  assert.match(r.stderr, /✖ README\.md:3: the line carrying the "x-release-please-version" marker has no/);
  assert.match(r.stderr, /must sit on the SAME line/);
});

test('without the marker the check falls back by pattern, says so, and still compares', (t) => {
  const root = repo(t, { version: '0.5.0-rc.1', readmeOptions: { marker: false } });
  const r = docsVersion(root);
  assert.equal(r.status, 0, r.out);
  assert.match(r.stdout, /! +README\.md:6: no "x-release-please-version" marker on the version line/);
  assert.match(r.stdout, /matched the "aktuelle Version" statement by pattern instead/);
  assert.match(r.stdout, /ok +README\.md:6 — v0\.5\.0-rc\.1/);
});

test('the fallback still catches a stale version (no marker, README behind version.txt)', (t) => {
  const r = docsVersion(repo(t, { version: '0.6.0-rc.1', readme: readmeRow('0.5.0-rc.1', { marker: false }) }));
  assert.equal(r.status, 1, r.out);
  assert.match(r.stderr, /✖ README\.md:6: documents version "0\.5\.0-rc\.1" but version\.txt says "0\.6\.0-rc\.1"/);
});

test('a missing version.txt is reported, not crashed on', (t) => {
  const root = tempDir(t);
  writeFixture(root, 'README.md', readmeRow('1.2.3'));
  writeFixture(root, 'CITATION.cff', citation('1.2.3'));
  const r = docsVersion(root);
  assert.equal(r.status, 1, r.out);
  assert.match(r.stderr, /✖ version\.txt: not readable/);
});

test('an unquoted CITATION.cff version is read (and compared) correctly', (t) => {
  const root = tempDir(t);
  writeFixture(root, 'version.txt', '1.2.3\n');
  writeFixture(root, 'README.md', readmeRow('1.2.3'));
  writeFixture(root, 'CITATION.cff', 'cff-version: 1.2.0\nversion: 1.2.4 # x-release-please-version\n');
  const r = docsVersion(root);
  assert.equal(r.status, 1, r.out);
  assert.match(r.stderr, /✖ CITATION\.cff:2: documents version "1\.2\.4" but version\.txt says "1\.2\.3"/);
});

test('the real repository is consistent (cwd-independent default root)', (t) => {
  const elsewhere = tempDir(t);
  const r = runTool('check-docs-version.mjs', [], { cwd: elsewhere });
  assert.equal(r.status, 0, r.out);
  assert.match(r.stdout, /docs-version: OK/);
});
