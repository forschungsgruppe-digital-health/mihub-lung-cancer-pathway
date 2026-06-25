#!/usr/bin/env node
/**
 * Behavioural soundness check (STR-1…STR-4) — ADVISORY by default.
 *
 * Talks to the `rust_bpmn_analyzer` webserver (a BPMN-specific model checker;
 * github.com/timKraeuter/rust_bpmn_analyzer), pinned by image digest, over its
 * `POST /check_bpmn` JSON API. For each `.bpmn` it classifies:
 *
 *   SOUND        — all four properties fulfilled
 *   VIOLATION    — a supported model violates a property (the real finding):
 *                    OptionToComplete=STR-1, ProperCompletion=STR-2,
 *                    NoDeadActivities=STR-3, Safeness (1-safe, supports STR-2/4);
 *                    a deadlock/livelock (STR-4) surfaces as OptionToComplete=✗
 *   INCONCLUSIVE — the model uses elements outside the analyzer's supported subset
 *                  (`unsupported_elements`); e.g. OR-gateways, intermediateCatchEvents.
 *                  → human review, never a pass and never a hard block.
 *   ERROR        — the analyzer could not parse the model (malformed; also caught by
 *                  bpmnlint) → reported, non-blocking here.
 *
 * IMPORTANT (verified from the analyzer source): the API returns HTTP 200 even for a
 * violating model — there is NO exit-code signal from the tool. This wrapper derives
 * the verdict from `property_results[].fulfilled` / `unsupported_elements`. A naïve
 * "did the tool run" check would always pass. See docs/decisions/0003.
 *
 * Start the analyzer (pinned digest) first, e.g.:
 *   docker run -d --platform linux/amd64 -p 8090:8080 \
 *     tkra/rust_bpmn_analyzer@sha256:9d939b84e82ca0ef55e9b34847d55bacd32b293fc7ef670e53d37d2ebcd3778c
 *   SOUNDNESS_URL=http://localhost:8090/check_bpmn node tools/check-soundness.mjs
 *
 * Exit: 0 (advisory). With `--strict`, exit 1 if any SUPPORTED model has a VIOLATION
 * (INCONCLUSIVE/ERROR never block — they mean "remodel / human review", not "unsound").
 */
import { readFileSync } from 'node:fs';
import { resolveBpmnFiles } from './bpmn-files.mjs';

// Default host port 8090 (matches the documented `docker run -p 8090:8080` and avoids
// colliding with services commonly on 8080). Override with SOUNDNESS_URL.
const URL = process.env.SOUNDNESS_URL || 'http://localhost:8090/check_bpmn';
const PROPS = ['Safeness', 'OptionToComplete', 'ProperCompletion', 'NoDeadActivities'];
const STRICT = process.argv.includes('--strict');
const files = resolveBpmnFiles(process.argv.slice(2).filter((a) => !a.startsWith('--')));

if (!files.length) {
  console.log('soundness: no .bpmn files found — nothing to check.');
  process.exit(0);
}

async function check(file) {
  const body = JSON.stringify({ bpmn_file_content: readFileSync(file, 'utf8'), properties_to_be_checked: PROPS });
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), Number(process.env.SOUNDNESS_TIMEOUT_MS || 120000));
  try {
    const res = await fetch(URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body, signal: ctrl.signal });
    const text = await res.text();
    let j = null;
    try { j = JSON.parse(text); } catch { /* non-JSON */ }
    if (!j) return { kind: 'ERROR', detail: `HTTP ${res.status} non-JSON` };
    if ((j.unsupported_elements || []).length) {
      return { kind: 'INCONCLUSIVE', detail: [...new Set(j.unsupported_elements)].join(', ') };
    }
    const viol = (j.property_results || []).filter((r) => !r.fulfilled);
    if (viol.length) return { kind: 'VIOLATION', detail: viol.map((v) => `${v.property}${v.problematic_elements?.length ? ` [${v.problematic_elements.slice(0, 4).join(', ')}]` : ''}`).join('; ') };
    return { kind: 'SOUND', detail: 'all properties fulfilled' };
  } catch (e) {
    if (e.name === 'AbortError') return { kind: 'ERROR', detail: 'timeout (state-space blowup — the webserver runs without POR)' };
    return { kind: 'ERROR', detail: `analyzer unreachable: ${e.message}` };
  } finally {
    clearTimeout(timer);
  }
}

// Fail fast with guidance if the analyzer is not reachable at all.
try {
  await fetch(URL.replace(/\/check_bpmn$/, '/'), { method: 'GET', signal: AbortSignal.timeout(3000) });
} catch {
  console.log(`soundness: analyzer not reachable at ${URL}.`);
  console.log('  Start it (pinned digest), then re-run — see the header of this file / docs/decisions/0003.');
  console.log('  Skipping (advisory).');
  process.exit(0);
}

const icon = { SOUND: '✓', VIOLATION: '✖', INCONCLUSIVE: '?', ERROR: '!' };
let violations = 0;
let inconclusive = 0;
console.log(`soundness: checking ${files.length} file(s) via ${URL}\n`);
for (const file of files) {
  const r = await check(file);
  if (r.kind === 'VIOLATION') violations++;
  if (r.kind === 'INCONCLUSIVE' || r.kind === 'ERROR') inconclusive++;
  console.log(`${icon[r.kind]} ${file}`);
  console.log(`    ${r.kind}: ${r.detail}\n`);
}

console.log('---------------------------------------------------------------');
console.log(`soundness: ${violations} violation(s), ${inconclusive} inconclusive/error, ${files.length - violations - inconclusive} sound.`);
console.log('Note: INCONCLUSIVE = unsupported elements (OR-gateways, intermediate catch events) → human review / remodel, never a pass.');
if (STRICT && violations) {
  console.error('soundness: FAIL (--strict) — a supported model violates a soundness property.');
  process.exit(1);
}
console.log(STRICT ? 'soundness: OK (--strict; no supported-model violations).' : 'soundness: advisory run complete (use --strict to fail on supported-model violations).');
