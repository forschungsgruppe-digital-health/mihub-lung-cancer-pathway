#!/usr/bin/env node
/**
 * Serialization-stability + extension-content roundtrip check (INFORMATIONAL).
 *
 * For each file:
 *   1. parse (fromXML) with bpmn-moddle
 *   2. serialize (toXML, formatted)   -> A
 *   3. re-parse A and re-serialize     -> B
 *   4. assert A === B                   (stable / idempotent serialization)
 *   5. count custom extension elements (cp:/i18n:) in the source and surface
 *      bpmn-moddle parse warnings
 *
 * IMPORTANT — current coverage: this repo's clinical extension data lives under the
 * `cp:` (BPMN4CP, http://www.helict.de/bpmn4cp) and `i18n:` namespaces. No moddle
 * descriptor is registered for them yet, so bpmn-moddle treats that content as
 * generic/unparsed and may drop it on save. This check therefore reports extension
 * presence and parse warnings as NON-FATAL signals (motivating a follow-up that
 * registers a `cp:`/`i18n:` moddle descriptor to make the roundtrip lossless).
 * The one thing it does treat as a real bug is *instability* (A !== B).
 *
 * Severity:
 *   FAIL (exit 1) : serialization is not stable (A !== B) — a real bug.
 *   WARN (exit 0) : extension content present but not modelled, or parse warnings.
 *
 * Usage: node tools/moddle-roundtrip.mjs [file.bpmn ...]
 */
import { readFileSync } from 'node:fs';
import { BpmnModdle } from 'bpmn-moddle';
import { resolveBpmnFiles } from './bpmn-files.mjs';

const files = resolveBpmnFiles(process.argv.slice(2));
if (!files.length) {
  console.log('roundtrip: no .bpmn files found — nothing to check.');
  process.exit(0);
}

/** Count `<cp:*>` / `<i18n:*>` element openings in a serialized document. */
const extCount = (xml) => (xml.match(/<(?:cp|i18n):[A-Za-z]/g) || []).length;

let failures = 0;
let warnTotal = 0;

console.log(`roundtrip: checking ${files.length} file(s)…\n`);

for (const file of files) {
  const xml = readFileSync(file, 'utf8');
  const moddle = new BpmnModdle();

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
  const droppedExt = inCount > outCount;
  warnTotal += warnings.length;

  const lossy = warnings.length > 0 || droppedExt;
  const status = !stable ? '✖' : lossy ? '⚠' : '✓';
  console.log(`${status} ${file}`);
  console.log(`    stable=${stable}  cp:/i18n: extension-elements ${inCount} -> ${outCount}`);
  if (!stable) console.log('    serialization is NOT idempotent (re-serializing changed the output)');
  if (droppedExt) console.log('    note: extension content dropped on parse (no cp:/i18n: moddle descriptor registered yet)');
  for (const w of warnings.slice(0, 3)) {
    console.log(`    warning: ${String(w.message || w).split('\n')[0]}`);
  }
  if (warnings.length > 3) console.log(`    … and ${warnings.length - 3} more warning(s)`);
  console.log('');

  if (!stable) failures++;
}

if (warnTotal || failures === 0) {
  console.log(
    'roundtrip: extension/parse warnings are informational — register a cp:/i18n: moddle descriptor to make the roundtrip lossless (follow-up).'
  );
}
if (failures) {
  console.error(`\nroundtrip: ${failures} file(s) had unstable serialization.`);
  process.exit(1);
}
console.log('roundtrip: OK (serialization stable).');
