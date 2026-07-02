#!/usr/bin/env node
/**
 * Lossless / stability roundtrip check for the clinical extension content
 * (BLOCKING on data loss or instability).
 *
 * The models carry BPMN4CP `cp:` quality indicators (modelled in
 * tools/moddle/bpmn4cp.json) and `i18n:translation` content. With the `cp:`
 * descriptor registered, bpmn-moddle parses and re-serializes all of it losslessly
 * (the nested i18n:translation rides along via lax extensionElements handling — see
 * tools/moddle/descriptors.mjs for why no i18n descriptor is registered).
 *
 * For each file:
 *   1. parse (fromXML) with the cp: descriptor registered
 *   2. serialize (toXML, formatted)   -> A
 *   3. re-parse A and re-serialize     -> B
 *   4. assert A === B                   (stable / idempotent serialization)
 *   5. assert cp:/i18n element count is preserved (no extension elements dropped)
 *
 * Severity:
 *   FAIL (exit 1) : parse error, OR cp:/i18n elements dropped on parse, OR
 *                   serialization not stable (A !== B). These are real data loss / bugs.
 *   WARN (exit 0) : benign "unknown attribute" notices (e.g. the cp:-prefixed
 *                   cp:selectionBehavior / cp:definitionCanonical, and DI colour
 *                   attributes) — preserved verbatim via lax $attrs, never dropped.
 *
 * Usage: node tools/moddle-roundtrip.mjs [file.bpmn ...]
 */
import { readFileSync } from 'node:fs';
import { BpmnModdle } from 'bpmn-moddle';
import { resolveBpmnFiles } from './bpmn-files.mjs';
import { extensions } from './moddle/descriptors.mjs';

const files = resolveBpmnFiles(process.argv.slice(2));
if (!files.length) {
  console.log('roundtrip: no .bpmn files found — nothing to check.');
  process.exit(0);
}

/** Count `<cp:*>` / `<i18n:*>` element openings in a serialized document. */
const extCount = (xml) => (xml.match(/<(?:cp|i18n):[A-Za-z]/g) || []).length;

let failures = 0;
let benignWarnTotal = 0;

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

  const hardFail = !stable || dropped || lossWarnings.length > 0;
  const status = hardFail ? '✖' : benignWarnings ? '⚠' : '✓';
  console.log(`${status} ${file}`);
  console.log(`    stable=${stable}  cp:/i18n elements ${inCount} -> ${outCount}  (${benignWarnings} benign attr warning(s))`);
  if (!stable) console.log('    serialization is NOT idempotent (re-serializing changed the output)');
  if (dropped) console.log(`    DATA LOSS: ${inCount - outCount} extension element(s) dropped on parse`);
  for (const w of lossWarnings.slice(0, 5)) {
    console.log(`    loss warning: ${String(w.message).split('\n')[0]}`);
  }
  console.log('');

  if (hardFail) failures++;
}

if (benignWarnTotal) {
  console.log(
    `roundtrip: ${benignWarnTotal} benign "unknown attribute" notice(s) — preserved verbatim via lax $attrs (cp:selectionBehavior / cp:definitionCanonical / DI colours). Not data loss.`
  );
}
if (failures) {
  console.error(`\nroundtrip: ${failures} file(s) failed (data loss or unstable serialization).`);
  process.exit(1);
}
console.log('roundtrip: OK (lossless + stable).');
