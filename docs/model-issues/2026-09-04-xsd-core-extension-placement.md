# XSD-core findings — `cp:` extension placement (2026-09-04)

The **standard-core** layer of the conformance gate — `tools/validate-xsd.sh`, which validates each
model against the OMG `BPMN20.xsd` shipped with bpmn-moddle — currently fails on **5 of the 9
models**. The layer is **informational by design** (exit 0; see
[`../decisions/0001-repo-tooling-and-conformance-gate.md`](../decisions/0001-repo-tooling-and-conformance-gate.md),
Decision 3), so the gate stays green. **Reports, not fixes** — a human modeller addresses each via a
GitHub issue (template `bpmn-model-issue`); no skill or agent may touch a `.bpmn`/`.svg`.
Reproduce: `npm run check:conformance` (XSD block) or `bash tools/validate-xsd.sh` (needs `xmllint`;
`--strict` makes it exit 1). Elements are cited as `"Label" (id)`; unnamed elements show
`‹unnamed Type› (id)`.

> **Why this is not blocking.** The failing content is BPMN4CP extension data (`cp:`,
> `http://www.helict.de/bpmn4cp`). The moddle-roundtrip layer (`tools/moddle-roundtrip.mjs`,
> **blocking** since commit 79cde22, with the `cp:` descriptor `tools/moddle/bpmn4cp.json`)
> parses and re-serialises it losslessly — nothing is lost for bpmn-js-based tooling, and the
> models open and save cleanly. The OMG schema is simply stricter than the tooling: it admits
> foreign-namespace *elements* only inside `bpmn:extensionElements` (`xsd:any`, lax) and foreign
> *attributes* only when they carry a namespace. Validating against a BPMN4CP-extended schema
> instead would be a tooling decision, out of scope of this finding.
>
> Validating today: `aftercare`, `palliative-care`, `patient-consultation`, `screening`.

> Suggested labels for all: `model`, `conformance`, `housekeeping`. Not blocking. No
> `needs-clinical-review` — the fix changes the serialisation only, not the clinical meaning.

---

### Issue X1 — `cp:qualityIndicator` placed outside `bpmn:extensionElements` (5 models)

- **Affected** (file: line of the first schema error — xmllint stops at the first offending
  element per file, so a model may contain more):
  - `models/lung-cancer-diagnostic-pathway.bpmn`: 119
  - `models/lung-cancer-molecular-tumor-board-pathway.bpmn`: 170
  - `models/lung-cancer-overarching-pathway.bpmn`: 405
  - `models/lung-cancer-treatment-pathway.bpmn`: 51
  - `models/lung-cancer-tumor-board-pathway.bpmn`: 166
- **Found:** `xmllint --noout --schema BPMN20.xsd` —
  `Element '{http://www.helict.de/bpmn4cp}qualityIndicator': This element is not expected. Expected is one of ( …artifact, …association, …group, …textAnnotation, …resourceRole, …supports )`;
  in `treatment`, where the element opens the process, the expected set is
  `( …documentation, …extensionElements, …, …laneSet, …flowElement )`.
- **Cause:** the `cp:qualityIndicator` elements (BPMN4CP quality indicators, bound to a data object
  via `dataObjectRef`) are serialised as **direct children of `bpmn:process`** — siblings of the
  flow elements (before them in `treatment`, after them in the other four) — instead of inside a
  `bpmn:extensionElements` container. `tProcess` has a closed content model; foreign elements are
  admitted only through `bpmn:extensionElements`. The `cp:` moddle descriptor mirrors this
  placement — its `ProcessExtension` type *extends* `bpmn:Process` with the quality-indicator
  property — which is exactly why the roundtrip is lossless while the OMG schema objects.
- **Acceptance-test criteria:** SYN-1 hygiene (schema-valid serialisation of the declared
  conformance class, *Analytic*). No Muss criterion is affected; the clinical content (SEM-7
  quality indicators) is unchanged.
- **Suggested modeller action** (a maintainer decision comes first): **(A, recommended)** move the
  `cp:qualityIndicator` elements of each process into one `bpmn:extensionElements` block directly
  under `bpmn:process` — the standard location for extension content — **together with** a
  matching adjustment of the `cp:` descriptor (`tools/moddle/bpmn4cp.json`; a tooling follow-up,
  so the roundtrip keeps recognising them). Keep ids and `dataObjectRef`s unchanged so the `.svg`
  renders and the `i18n:` content are unaffected; re-run `npm run check:conformance` — the XSD
  block should turn green and the roundtrip must stay lossless. **(B)** keep the BPMN4CP placement
  as it is and accept that the XSD-core layer stays informational for the `cp:`-carrying models.
- **Labels:** `model`, `conformance`, `housekeeping`.

### Issue X2 — un-namespaced styling attributes on the `overarching` DI plane

- **Affected:** `models/lung-cancer-overarching-pathway.bpmn`: 1225 —
  `<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Collaboration_0mif9f6" border-color="#e40707" stroke="#e40707" background-color="#f21c1c" fill="#f21c1c">`.
- **Found:** xmllint — `Element '{…/DI}BPMNPlane', attribute 'border-color': The attribute 'border-color' is not allowed`
  (likewise for `stroke`, `background-color`, `fill`).
- **Cause:** colour styling written as **un-namespaced** attributes on the plane. The names match
  the bpmn.io colour extensions — `bioc:stroke` / `bioc:fill`
  (`http://bpmn.io/schema/bpmn/biocolor/1.0`) and `color:border-color` / `color:background-color`
  (OMG non-normative colour extension) — both of which the file already declares, but here the
  prefixes are missing; BPMN DI admits foreign attributes only with a namespace
  (`xsd:anyAttribute namespace="##other"`). They also sit on the *plane*, whereas the colour
  extensions target shapes and edges, so the values are unlikely to render anywhere.
- **Acceptance-test criteria:** SYN-1 hygiene only; no visual or clinical effect.
- **Suggested modeller action:** remove the four attributes from `bpmndi:BPMNPlane` (or, if the
  colouring was meant for elements, re-apply it on the shapes/edges through the editor so it is
  exported as `bioc:` / `color:` attributes). Re-export the `.svg` only if anything visible
  changed; re-run the gate.
- **Labels:** `model`, `conformance`, `housekeeping`.
