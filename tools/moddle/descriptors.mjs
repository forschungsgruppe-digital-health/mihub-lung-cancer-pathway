#!/usr/bin/env node
/**
 * Loads the custom moddle descriptor(s) for the clinical extension content used by
 * the pathway models, so bpmn-moddle parses and re-serializes it LOSSLESSLY instead
 * of dropping it on save.
 *
 *   cp:  BPMN4CP (http://www.helict.de/bpmn4cp) — quality indicators, modelled as a
 *        `bpmn:Process` extension (cp:qualityIndicator / cp:qIDefinition).
 *
 * Why NOT an i18n: descriptor (deliberate): the i18n:translation elements live inside
 * standard <bpmn:extensionElements> (including those of the cp:qualityIndicator we
 * model). Once the *containing* element is modelled, bpmn-moddle preserves that nested
 * content verbatim via its lax extensionElements handling — verified lossless with 0
 * warnings. Registering an i18n descriptor is actively HARMFUL: moddle then tries to
 * parse i18n:translation as a typed element, trips over the `xml:lang` attribute, and
 * DROPS the content (regressing files that were previously lossless). So we model only
 * the container and let lax do the rest.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const load = (f) => JSON.parse(readFileSync(join(here, f), 'utf8'));

export const bpmn4cp = load('bpmn4cp.json');

/** The extensions object to pass to `new BpmnModdle(extensions)`. */
export const extensions = { cp: bpmn4cp };
