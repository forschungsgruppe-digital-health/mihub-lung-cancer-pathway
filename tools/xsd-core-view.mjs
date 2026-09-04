#!/usr/bin/env node
/**
 * XSD "core view" of a BPMN model — the file with every BPMN4CP extension ELEMENT removed.
 * Helper for the informational XSD-core layer (tools/validate-xsd.sh). No dependencies.
 *
 * WHY: the models carry BPMN4CP quality indicators (`cp:qualityIndicator` with a nested
 * `cp:qIDefinition`; namespace http://www.helict.de/bpmn4cp). By design of the BPMN4CP
 * clinical-pathway extension they are placed DIRECTLY under `bpmn:process` / the flow
 * elements — NOT inside `bpmn:extensionElements`. Maintainer decision 2026-09-04: this is
 * valid extension usage and NOT a model defect. The OMG BPMN20.xsd, however, admits foreign
 * elements only inside `extensionElements` (xsd:any, lax), so xmllint on the raw file reported
 * every cp:-carrying model as schema-invalid — a false finding. This helper strips the BPMN4CP
 * elements so that validate-xsd.sh checks ONLY the BPMN core and a failure there is a genuine
 * BPMN-core deviation. The extension content itself is validated by the moddle descriptor
 * layer instead (tools/moddle-roundtrip.mjs with tools/moddle/bpmn4cp.json).
 *
 * What it does:
 *   - reads the xmlns declarations on the ROOT element and collects every prefix bound to the
 *     BPMN4CP namespace (the prefix is not hard-coded to `cp`; several bindings are fine);
 *   - removes every element in that namespace, nesting-aware: repeatedly drops self-closing
 *     `<p:name …/>` and INNERMOST `<p:name …>…</p:name>` pairs until nothing changes;
 *   - handles `>` inside quoted attribute values conservatively (a tag's attribute region is
 *     scanned with quoted strings consumed as a whole);
 *   - leaves ATTRIBUTES in that namespace on core elements alone (e.g. `cp:selectionBehavior`
 *     on a task) — BPMN20.xsd accepts namespaced foreign attributes via anyAttribute lax;
 *   - replaces each removed element by its newlines only, so the LINE COUNT is preserved and
 *     xmllint's line numbers on the core view still point into the original file.
 *   Not handled (not present in the models, kept simple on purpose): a BPMN4CP binding as the
 *   DEFAULT namespace, prefixes (re)declared on nested elements, and `<cp:` inside comments or
 *   CDATA. Well-formed input is assumed; an unbalanced BPMN4CP element left after the loop is
 *   reported (exit 2) rather than guessed at.
 *
 * Usage: node tools/xsd-core-view.mjs <file.bpmn>        (core view -> stdout)
 * Exit:  0 = ok (also when the file binds no BPMN4CP prefix — it is echoed unchanged),
 *        1 = usage error / unreadable file,
 *        2 = a BPMN4CP element could not be removed (unbalanced/malformed markup).
 */
import { readFileSync } from 'node:fs';

const BPMN4CP_NS = 'http://www.helict.de/bpmn4cp';

const file = process.argv[2];
if (!file) {
  console.error('usage: node tools/xsd-core-view.mjs <file.bpmn>');
  process.exit(1);
}

let xml;
try {
  xml = readFileSync(file, 'utf8');
} catch (err) {
  console.error(`xsd-core-view: cannot read ${file}: ${err.message}`);
  process.exit(1);
}

/** Attribute region of a start-tag up to (not including) the first unquoted `>`. */
const ATTRS = `(?:[^>"']|"[^"]*"|'[^']*')*`;

/** Root element = the first tag that is not the XML declaration, a PI, a comment or a DOCTYPE. */
const root = xml.match(new RegExp(`<(?![?!])([A-Za-z_][\\w.-]*(?::[\\w.-]+)?)(${ATTRS})>`));
if (!root) {
  console.error(`xsd-core-view: ${file}: no root element found`);
  process.exit(2);
}

/** Every prefix the root element binds to the BPMN4CP namespace. */
const prefixes = [];
for (const m of root[2].matchAll(/xmlns:([\w.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
  if ((m[2] ?? m[3]) === BPMN4CP_NS) prefixes.push(m[1]);
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Keep only the newlines of a removed span (line numbers stay valid for the original). */
const newlinesOnly = (s) => s.replace(/[^\n]/g, '');

let out = xml;
if (prefixes.length) {
  const prefixAlt = `(?:${prefixes.map(escapeRe).join('|')})`;
  const qname = `${prefixAlt}:[A-Za-z_][\\w.-]*`;
  // `<p:name …/>` — the attribute region must end right before `/>`.
  const selfClosing = new RegExp(`<${qname}(?=[\\s/>])${ATTRS}/>`, 'g');
  // `<p:name …>…</p:name>` whose content opens NO further BPMN4CP element (= innermost). The
  // lookbehind keeps a self-closing tag from being paired with an enclosing element's end-tag.
  const innermostPair = new RegExp(
    `<(${qname})(?=[\\s>])${ATTRS}(?<!/)>(?:(?!<${prefixAlt}:)[\\s\\S])*?</\\1\\s*>`,
    'g'
  );

  let previous;
  do {
    previous = out;
    out = out.replace(selfClosing, newlinesOnly).replace(innermostPair, newlinesOnly);
  } while (out !== previous);

  const leftover = out.match(new RegExp(`</?${qname}(?=[\\s/>])`));
  if (leftover) {
    const line = out.slice(0, leftover.index).split('\n').length;
    console.error(
      `xsd-core-view: ${file}:${line}: BPMN4CP element \`${leftover[0]}\` could not be removed (unbalanced or malformed markup)`
    );
    process.exit(2);
  }
}

process.stdout.write(out);
