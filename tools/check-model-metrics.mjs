#!/usr/bin/env node
/**
 * Clinical-pathway model-metrics gate — the automatable subset of the Abnahme
 * acceptance instrument (docs/governance/) that bpmnlint does NOT cover.
 *
 * Parses each `.bpmn` with bpmn-moddle and inspects every FlowElementsContainer
 * (Process / SubProcess / AdHocSubProcess — i.e. every "level"):
 *
 *   SYN-5 (no OR-gateways)   — BLOCKING. Any bpmn:InclusiveGateway / bpmn:ComplexGateway
 *                              is a K.O. finding (Abnahme SYN-5 "kein OR-Gateway";
 *                              CONVENTIONS §3 R5). bpmn-moddle normalises the source
 *                              prefix, so this catches both `bpmn:` and `bpmn2:` files.
 *   SYN-2 (one start/end)    — WARN. Exactly one start- and one end-event per level;
 *                              intentional multi-start is an R (review) adjudication,
 *                              so it is reported, not blocked.
 *   SYN-4 (<= 50 symbols)    — WARN. Element count per level; decomposition is a Soll,
 *                              and the threshold's application to an orchestration root
 *                              needs human judgment — reported, not blocked.
 *   SEM-1 (lanes present)    — REPORT. Lane presence is a pre-check only; completeness
 *                              of the multidisciplinary plan stays human review.
 *   prefix hygiene           — REPORT. Mixed `bpmn:` / `bpmn2:` root prefixes across files.
 *
 * The single BLOCKING rule here is SYN-5 (no OR). Everything else is advisory so the
 * gate never fails arbitrarily before the conformance class is declared and the models
 * are remodelled (see docs/decisions/0001 and docs/governance/).
 *
 * Usage: node tools/check-model-metrics.mjs [file.bpmn ...]   (no args -> discover all)
 * Exit:  0 = no blocking finding, 1 = at least one OR-gateway found (or parse error).
 */
import { readFileSync } from 'node:fs';
import { BpmnModdle } from 'bpmn-moddle';
import { resolveBpmnFiles } from './bpmn-files.mjs';

const MAX_ELEMENTS_PER_LEVEL = 50; // Abnahme SYN-4 / 7PMG G7

const files = resolveBpmnFiles(process.argv.slice(2));
if (!files.length) {
  console.log('metrics: no .bpmn files found — nothing to check.');
  process.exit(0);
}

/** Collect every FlowElementsContainer (Process + nested Sub/AdHocSubProcesses). */
function collectLevels(container, name, acc) {
  const flowElements = container.flowElements || [];
  acc.push({ name, type: container.$type, flowElements });
  for (const fe of flowElements) {
    if (fe.$type === 'bpmn:SubProcess' || fe.$type === 'bpmn:AdHocSubProcess' || fe.$type === 'bpmn:Transaction') {
      collectLevels(fe, `${name} › ${fe.name || fe.id}`, acc);
    }
  }
  return acc;
}

const byType = (els, type) => els.filter((e) => e.$type === type);
const rootPrefix = (xml) => (xml.match(/<([A-Za-z0-9]+):definitions[\s>]/) || [, '?'])[1];

let orFindings = 0;
let warnings = 0;
const prefixes = new Map();

console.log(`metrics: checking ${files.length} file(s)…\n`);

for (const file of files) {
  const xml = readFileSync(file, 'utf8');
  prefixes.set(file, rootPrefix(xml));

  const moddle = new BpmnModdle();
  let definitions;
  try {
    ({ rootElement: definitions } = await moddle.fromXML(xml));
  } catch (err) {
    console.log(`✖ ${file}\n    parse error: ${err.message}`);
    orFindings++; // a file we cannot parse cannot be cleared
    continue;
  }

  const processes = (definitions.rootElements || []).filter((e) => e.$type === 'bpmn:Process');
  const levels = [];
  for (const p of processes) collectLevels(p, p.name || p.id || '(unnamed process)', levels);

  const fileLines = [];
  let fileOr = 0;
  let fileWarn = 0;

  for (const lvl of levels) {
    const els = lvl.flowElements;
    const inclusive = byType(els, 'bpmn:InclusiveGateway').length;
    const complex = byType(els, 'bpmn:ComplexGateway').length;
    const starts = byType(els, 'bpmn:StartEvent').length;
    const ends = byType(els, 'bpmn:EndEvent').length;
    const count = els.length;

    if (inclusive || complex) {
      fileOr += inclusive + complex;
      fileLines.push(
        `    ✖ SYN-5 [${lvl.name}] OR-gateway(s): ${inclusive} inclusive, ${complex} complex — not allowed`
      );
    }
    if (starts !== 1 || ends !== 1) {
      fileWarn++;
      fileLines.push(`    ⚠ SYN-2 [${lvl.name}] start-events=${starts}, end-events=${ends} (expected 1/1 — review)`);
    }
    if (count > MAX_ELEMENTS_PER_LEVEL) {
      fileWarn++;
      fileLines.push(`    ⚠ SYN-4 [${lvl.name}] ${count} flow elements (> ${MAX_ELEMENTS_PER_LEVEL} — consider decomposing)`);
    }
  }

  // SEM-1 lane presence (report)
  const anyLanes = processes.some((p) => (p.laneSets || []).some((ls) => (ls.lanes || []).length));
  if (!anyLanes) fileLines.push('    · SEM-1 no lanes found (multidisciplinary roles not modelled as lanes — review)');

  const status = fileOr ? '✖' : fileWarn ? '⚠' : '✓';
  console.log(`${status} ${file}  (${levels.length} level(s), prefix <${prefixes.get(file)}:>)`);
  for (const l of fileLines) console.log(l);
  console.log('');

  orFindings += fileOr;
  warnings += fileWarn;
}

// prefix hygiene across the repo (report)
const distinct = new Set(prefixes.values());
if (distinct.size > 1) {
  console.log(`⚠ prefix hygiene: models use mixed root prefixes ${[...distinct].map((p) => `<${p}:>`).join(', ')}:`);
  for (const [f, p] of prefixes) console.log(`    <${p}:>  ${f}`);
  console.log('');
}

console.log('---------------------------------------------------------------');
console.log(`metrics: ${orFindings} blocking OR-gateway finding(s), ${warnings} advisory warning(s).`);
if (orFindings) {
  console.error('metrics: FAIL — remove/rework OR-gateways (Abnahme SYN-5 / CONVENTIONS R5), or document the deviation.');
  process.exit(1);
}
console.log('metrics: OK (no blocking findings; advisory warnings are for review).');
