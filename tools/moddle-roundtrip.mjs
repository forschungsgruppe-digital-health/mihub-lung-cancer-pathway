#!/usr/bin/env node
/**
 * Lossless / stability roundtrip check for the clinical extension content
 * (BLOCKING on data loss or instability).
 *
 * The models carry BPMN4CP quality indicators (namespace http://www.helict.de/bpmn4cp,
 * modelled in tools/moddle/bpmn4cp.json and conventionally bound to the `cp:` prefix) and
 * i18n translation content (http://www.omg.org/spec/BPMN/non-normative/extensions/i18n/1.0).
 * With the BPMN4CP descriptor registered, bpmn-moddle parses and re-serializes all of it
 * losslessly (the nested i18n:translation rides along via lax extensionElements handling —
 * see tools/moddle/descriptors.mjs for why no i18n descriptor is registered).
 *
 * For each file:
 *   1. parse (fromXML) with the BPMN4CP descriptor registered
 *   2. serialize (toXML, formatted)   -> A
 *   3. re-parse A and re-serialize     -> B
 *   4. assert A === B                   (stable / idempotent serialization)
 *   5. assert the extension-element count is preserved (no extension elements dropped)
 *
 * The extension elements are counted by NAMESPACE, not by a hard-coded prefix: the prefixes
 * bound to the two namespaces are read from each document's root element (its `xmlns:*`
 * declarations — the same approach as tools/xsd-core-view.mjs), separately for the input and
 * for the re-serialized output, because bpmn-moddle writes the descriptor's own prefix on
 * output regardless of the prefix the source file used.
 *
 * Severity:
 *   FAIL (exit 1) : parse error, OR extension elements dropped on parse, OR
 *                   serialization not stable (A !== B). These are real data loss / bugs.
 *   WARN (exit 0) : benign "unknown attribute" notices (e.g. the un-namespaced DI colour
 *                   attributes in the overarching model) — preserved verbatim via lax $attrs,
 *                   never dropped. The `cp:selectionBehavior` / `cp:definitionCanonical`
 *                   attributes on sub-processes are modelled (ActivityExtension in
 *                   tools/moddle/bpmn4cp.json) and therefore raise no notice.
 *
 * Usage: node tools/moddle-roundtrip.mjs [file.bpmn ...]
 */
import { readFileSync } from 'node:fs';
import { BpmnModdle } from 'bpmn-moddle';
import { resolveBpmnFiles } from './bpmn-files.mjs';
import { extensions } from './moddle/descriptors.mjs';

const BPMN4CP_NS = 'http://www.helict.de/bpmn4cp';
const I18N_NS = 'http://www.omg.org/spec/BPMN/non-normative/extensions/i18n/1.0';
const EXTENSION_NS = new Set([BPMN4CP_NS, I18N_NS]);

/** Attribute region of a start-tag up to (not including) the first unquoted `>`. */
const ATTRS = `(?:[^>"']|"[^"]*"|'[^']*')*`;
/** Root element = the first tag that is not the XML declaration, a PI, a comment or a DOCTYPE. */
const ROOT_TAG = new RegExp(`<(?![?!])([A-Za-z_][\\w.-]*(?::[\\w.-]+)?)(${ATTRS})>`);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Every prefix the ROOT element binds to the BPMN4CP or the i18n namespace. */
function extensionPrefixes(xml) {
  const root = xml.match(ROOT_TAG);
  if (!root) return [];
  const prefixes = [];
  for (const m of root[2].matchAll(/xmlns:([\w.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    if (EXTENSION_NS.has(m[2] ?? m[3])) prefixes.push(m[1]);
  }
  return prefixes;
}

/** Count extension-element openings (`<prefix:name`) for the prefixes bound in THIS document. */
function extCount(xml) {
  const prefixes = extensionPrefixes(xml);
  if (!prefixes.length) return 0;
  const opening = new RegExp(`<(?:${prefixes.map(escapeRe).join('|')}):[A-Za-z]`, 'g');
  return (xml.match(opening) || []).length;
}

const files = resolveBpmnFiles(process.argv.slice(2));
if (!files.length) {
  console.log('roundtrip: no .bpmn files found — nothing to check.');
  process.exit(0);
}

let failures = 0;
let benignWarnTotal = 0;
/** Distinct benign attribute names (`prefix:name`) with their counts, for the summary. */
const benignByAttribute = new Map();

console.log(`roundtrip: checking ${files.length} file(s)…\n`);

for (const file of files) {
  const xml = readFileSync(file, 'utf8');
  const moddle = new BpmnModdle(extensions);

  let rootElement;
  let warnings = [];
  try {
    ({ rootElement, warnings = [] } = await moddle.fromXML(xml));
  } catch (err) {
    console.log(`✖ ${file}\n    parse error: ${err.message}`);
    failures++;
    continue;
  }

  const { xml: a } = await moddle.toXML(rootElement, { format: true });
  const reparsed = await moddle.fromXML(a);
  const { xml: b } = await moddle.toXML(reparsed.rootElement, { format: true });

  const stable = a === b;
  const inCount = extCount(xml);
  const outCount = extCount(a);
  const dropped = inCount > outCount;

  // Only "unknown attribute" warnings are benign (lax-preserved). Any other warning
  // (e.g. "unparsable content <element>") indicates content the model cannot represent.
  const lossWarnings = warnings.filter((w) => !/unknown attribute/i.test(String(w.message)));
  const benignWarnings = warnings.length - lossWarnings.length;
  benignWarnTotal += benignWarnings;
  for (const w of warnings) {
    if (lossWarnings.includes(w)) continue;
    const name = (String(w.message).match(/<([^>]+)>/) || [])[1] || '?';
    benignByAttribute.set(name, (benignByAttribute.get(name) || 0) + 1);
  }

  const hardFail = !stable || dropped || lossWarnings.length > 0;
  const status = hardFail ? '✖' : benignWarnings ? '⚠' : '✓';
  console.log(`${status} ${file}`);
  console.log(`    stable=${stable}  extension elements (BPMN4CP/i18n) ${inCount} -> ${outCount}  (${benignWarnings} benign attr warning(s))`);
  if (!stable) console.log('    serialization is NOT idempotent (re-serializing changed the output)');
  if (dropped) console.log(`    DATA LOSS: ${inCount - outCount} extension element(s) dropped on parse`);
  for (const w of lossWarnings.slice(0, 5)) {
    console.log(`    loss warning: ${String(w.message).split('\n')[0]}`);
  }
  console.log('');

  if (hardFail) failures++;
}

if (benignWarnTotal) {
  const names = [...benignByAttribute].map(([n, c]) => (c > 1 ? `${n} ×${c}` : n)).join(', ');
  console.log(
    `roundtrip: ${benignWarnTotal} benign "unknown attribute" notice(s) — preserved verbatim via lax $attrs, not data loss: ${names}.`
  );
}
if (failures) {
  console.error(`\nroundtrip: ${failures} file(s) failed (data loss or unstable serialization).`);
  process.exit(1);
}
console.log('roundtrip: OK (lossless + stable).');
