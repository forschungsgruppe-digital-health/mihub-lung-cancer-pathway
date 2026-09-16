#!/usr/bin/env node
/**
 * Documented-version consistency gate (BLOCKING).
 *
 * Purpose: the version a reader sees on the landing page (README.md) and in the citation
 * metadata (CITATION.cff) must be the version the repository actually carries in
 * `version.txt`. After the last release the README statement went stale because nothing kept
 * it in sync — a reader then cites / reports the wrong version. This check turns that into a
 * red build instead of a silent lie.
 *
 * Checked:
 *   1. README.md — the version statement in the Status table ("Aktuelle Version" row), which
 *      carries the version as a bold `**v<VERSION>**` token. The line is located by the marker
 *      string `x-release-please-version` (the same marker that makes release-please rewrite the
 *      line on a release — see release-please-config.json `extra-files`). If no line carries the
 *      marker, the check FALLS BACK to the first line that mentions "aktuelle Version" and
 *      carries a `**v<VERSION>**` token, and says so: without the marker nothing updates the
 *      line automatically, so it will go stale again.
 *   2. CITATION.cff — the `version:` key (cheap, and it protects the citation metadata).
 *
 * The repository root is the parent of tools/ (this script's location), NOT the current
 * working directory, so the check is cwd-independent. The environment variable
 * `BPMN_REPO_ROOT` overrides it (tools/test/ runs the check against fixture trees).
 *
 * No dependencies beyond node: built-ins.
 *
 * Usage: node tools/check-docs-version.mjs
 * Exit:  0 = every documented version matches version.txt,
 *        1 = a mismatch, a missing file, or no recognizable version statement.
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = process.env.BPMN_REPO_ROOT
  ? resolve(process.env.BPMN_REPO_ROOT)
  : join(dirname(fileURLToPath(import.meta.url)), '..');

const VERSION_FILE = 'version.txt';
const README_FILE = 'README.md';
const CITATION_FILE = 'CITATION.cff';
/** The marker comment release-please looks for on a line it should rewrite. */
const RELEASE_PLEASE_MARKER = 'x-release-please-version';
/** The version token in the README statement: `**v0.5.0-rc.1**`. */
const README_VERSION_RE = /\*\*v([0-9][^*\s]*)\*\*/;
/** The README row/prose that introduces it ("Aktuelle Version", "aktuelle Version **v…**"). */
const README_HINT_RE = /aktuelle\s+version/i;
/** The CITATION.cff `version:` key — quoted or bare, trailing `# comment` ignored. */
const CITATION_VERSION_RE = /^version\s*:\s*(?:"([^"]*)"|'([^']*)'|([^\s#]+))/;

const errors = [];
const notes = [];

/** Read a repo file as text; records an error and returns null when it is unreadable. */
function readRepoFile(name) {
  try {
    return readFileSync(join(REPO_ROOT, name), 'utf8');
  } catch {
    errors.push(`${name}: not readable (expected at ${join(REPO_ROOT, name)})`);
    return null;
  }
}

/** The declared version of the repository — the single source of truth. */
const versionText = readRepoFile(VERSION_FILE);
const expected = versionText === null ? null : versionText.trim();
if (expected !== null && !expected) {
  errors.push(`${VERSION_FILE}: empty — it must contain the version (e.g. 0.5.0-rc.1)`);
}

/** Locate the README version statement, preferring the release-please-marked line. */
function readmeVersion(text) {
  const lines = text.split(/\r?\n/);
  const markedIndex = lines.findIndex((line) => line.includes(RELEASE_PLEASE_MARKER));
  if (markedIndex !== -1) {
    const hit = lines[markedIndex].match(README_VERSION_RE);
    if (hit) return { version: hit[1], line: markedIndex + 1, marked: true };
    errors.push(
      `${README_FILE}:${markedIndex + 1}: the line carrying the "${RELEASE_PLEASE_MARKER}" marker has no ` +
        '`**v<VERSION>**` token — release-please rewrites exactly that line, so the marker and the version ' +
        'must sit on the SAME line.'
    );
    return null;
  }
  const fallbackIndex = lines.findIndex((line) => README_HINT_RE.test(line) && README_VERSION_RE.test(line));
  if (fallbackIndex !== -1) {
    notes.push(
      `${README_FILE}:${fallbackIndex + 1}: no "${RELEASE_PLEASE_MARKER}" marker on the version line — ` +
        'matched the "aktuelle Version" statement by pattern instead. Append the marker comment ' +
        `(\`<!-- ${RELEASE_PLEASE_MARKER} -->\`) to that line so release-please updates it on every ` +
        `release (release-please-config.json lists ${README_FILE} under extra-files).`
    );
    return { version: lines[fallbackIndex].match(README_VERSION_RE)[1], line: fallbackIndex + 1, marked: false };
  }
  errors.push(
    `${README_FILE}: no version statement found — the Status table must carry the current version as ` +
      '`**v<VERSION>**` on a line that mentions "Aktuelle Version" (ideally with the ' +
      `\`<!-- ${RELEASE_PLEASE_MARKER} -->\` marker). Nothing to compare against ${VERSION_FILE}.`
  );
  return null;
}

/** Locate the CITATION.cff `version:` key. */
function citationVersion(text) {
  const lines = text.split(/\r?\n/);
  const index = lines.findIndex((line) => CITATION_VERSION_RE.test(line));
  if (index === -1) {
    errors.push(`${CITATION_FILE}: no top-level \`version:\` key found — nothing to compare against ${VERSION_FILE}.`);
    return null;
  }
  const hit = lines[index].match(CITATION_VERSION_RE);
  return { version: hit[1] ?? hit[2] ?? hit[3], line: index + 1 };
}

/** Compare one documented version against version.txt. */
function compare(file, found) {
  if (!found || expected === null || !expected) return;
  if (found.version === expected) {
    console.log(`  ok   ${file}:${found.line} — v${found.version}`);
    return;
  }
  errors.push(
    `${file}:${found.line}: documents version "${found.version}" but ${VERSION_FILE} says "${expected}" — ` +
      `fix ${file} (or cut the release that updates it); ${VERSION_FILE} is the source of truth.`
  );
}

console.log(`docs-version: checking the documented version against ${VERSION_FILE}${expected ? ` (v${expected})` : ''}…`);

const readmeText = readRepoFile(README_FILE);
if (readmeText !== null) compare(README_FILE, readmeVersion(readmeText));

const citationText = readRepoFile(CITATION_FILE);
if (citationText !== null) compare(CITATION_FILE, citationVersion(citationText));

for (const n of notes) console.log(`  !    ${n}`);

if (errors.length) {
  for (const e of errors) console.error(`  ✖ ${e}`);
  console.error(`\ndocs-version: FAIL — ${errors.length} inconsistency/inconsistencies between the docs and ${VERSION_FILE}.`);
  process.exit(1);
}
console.log(`docs-version: OK (${README_FILE} and ${CITATION_FILE} both document v${expected}).`);
