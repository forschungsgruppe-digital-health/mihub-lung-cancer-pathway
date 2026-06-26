#!/usr/bin/env node
/**
 * Resolve BPMN element ids to the human-readable label shown in a model editor.
 *
 * The gate's findings come back keyed by element id (bpmnlint `report.id`, the
 * soundness analyzer's `problematic_elements`, the metrics OR-gateway scan). An id
 * like `Gateway_18pkxio` is not locatable by a human in the Camunda/bpmn.io editor —
 * the editor shows the element's `name`. These helpers turn an id (or a parsed moddle
 * element) into `"Name" (id)`, or `‹unnamed Type› (id)` when the element carries no
 * name, so a reviewer can find the addressed element.
 */
import { BpmnModdle } from 'bpmn-moddle';
import { extensions } from './moddle/descriptors.mjs';

/** Strip the namespace prefix from a moddle `$type` (e.g. `bpmn:InclusiveGateway` → `InclusiveGateway`). */
const shortType = (type) => String(type || 'element').replace(/^[A-Za-z0-9_]+:/, '');

/** Collapse multi-line / padded editor labels to a single tidy line (capped, so output stays readable). */
const cleanName = (name) => {
  const n = String(name).replace(/\s+/g, ' ').trim();
  return n.length > 80 ? `${n.slice(0, 79)}…` : n;
};

/** Format a parsed moddle element directly (it carries `.name`, `.id`, `.$type`). */
export function labelForElement(el) {
  if (!el || el.id == null) return '(unknown element)';
  return el.name ? `"${cleanName(el.name)}" (${el.id})` : `‹unnamed ${shortType(el.$type)}› (${el.id})`;
}

/**
 * Walk a parsed definitions tree and index every element that has an id →
 * Map(id → { name, type }). Generic (covers Process/SubProcess flow elements,
 * lanes, participants, events, gateways, …) and cycle-safe.
 */
export function indexById(root) {
  const index = new Map();
  const seen = new Set();
  const walk = (node) => {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (typeof node.id === 'string' && !index.has(node.id)) {
      index.set(node.id, { name: node.name, type: node.$type });
    }
    for (const key of Object.keys(node)) {
      if (key === '$parent' || key === '$type' || key === '$attrs') continue;
      const v = node[key];
      if (Array.isArray(v)) {
        for (const item of v) walk(item);
      } else if (v && typeof v === 'object' && typeof v.$type === 'string') {
        walk(v);
      }
    }
  };
  walk(root);
  return index;
}

/** Format an id via an index built with {@link indexById}; falls back to the bare id if unknown. */
export function labelForId(id, index) {
  const e = index && index.get(id);
  if (!e) return id; // unknown id (e.g. a non-element token) — show as-is
  return e.name ? `"${cleanName(e.name)}" (${id})` : `‹unnamed ${shortType(e.type)}› (${id})`;
}

/** Convenience: parse XML and return an id→{name,type} index. Throws on a parse error. */
export async function indexFromXml(xml) {
  const { rootElement } = await new BpmnModdle(extensions).fromXML(xml);
  return indexById(rootElement);
}
