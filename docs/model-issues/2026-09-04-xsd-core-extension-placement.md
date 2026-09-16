# XSD-core findings — `cp:` extension placement (2026-09-04)

> **Status 2026-09-16 — corrected; Issue X1 REOPENED as a documented deviation.** The 2026-09-04
> closure rested on the premise that `cp:qualityIndicator` is "a valid BPMN4CP clinical-pathway
> extension placed directly under the process". **That premise is not supported by the sources.**
> The four BPMN4CP publications were read in full on 2026-09-16 (see "Primary sources" below):
> BPMN4CP never published an XML serialisation at all, its Quality Indicator carries no attributes
> and attaches through a BPMN `Property` to a process, activity or event, and neither the
> ratio/numerator/denominator structure nor the `dataObjectRef` anchor used here appears in any of
> them. The placement is the **helict Pathway Modeler's serialisation**, not a published design.
>
> What stays: the XSD-core layer keeps excluding the extension before validating
> (`tools/xsd-core-view.mjs`) and stays informational, so nothing about the gate changes and no
> model has to be touched today. What changes: X1 is no longer "not a defect by design" but a
> **known, documented deviation from BPMN 2.0 / ISO 19510** with a measured data-loss consequence
> (see the corrected note below), to be resolved with the remodelling under
> [#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49)
> rather than as a standalone change. Issue X2 (un-namespaced DI colour attributes) is unchanged
> and still open as a low-priority housekeeping item. The 2026-09-04 analysis below is kept as the
> historical record, with its two factually wrong sentences marked.

The **standard-core** layer of the conformance gate — `tools/validate-xsd.sh`, which validates each
model against the OMG `BPMN20.xsd` shipped with bpmn-moddle — failed at the time of this analysis
on **5 of the 9 models** then present (the analysis covered the nine models present at the time;
the initial-entry model merged later that day in #77 validates clean on the core view — 9 of 10
pass today). The layer is **informational by design** (exit 0; see
[`../decisions/0001-repo-tooling-and-conformance-gate.md`](../decisions/0001-repo-tooling-and-conformance-gate.md),
Decision 3), so the gate stays green. **Reports, not fixes** — a human modeller addresses each via a
GitHub issue (template `bpmn-model-issue`); no skill or agent may touch a `.bpmn`/`.svg`.
Reproduce: `npm run check:conformance` (XSD block) or `bash tools/validate-xsd.sh` (needs `xmllint`;
`--strict` makes it exit 1). Elements are cited as `"Label" (id)`; unnamed elements show
`‹unnamed Type› (id)`.

> **Why this is not blocking** *(corrected 2026-09-16 — the original sentence overstated the
> safety; see the strike-through)*. The failing content is BPMN4CP extension data (`cp:`,
> `http://www.helict.de/bpmn4cp`). The moddle-roundtrip layer (`tools/moddle-roundtrip.mjs`,
> **blocking** since commit 79cde22, with the `cp:` descriptor `tools/moddle/bpmn4cp.json`)
> parses and re-serialises it losslessly — ~~nothing is lost for bpmn-js-based tooling, and the
> models open and save cleanly~~ **only because this repository registers its own descriptor.**
> Measured on 2026-09-16 with stock `bpmn-moddle` 10 (no descriptor — the configuration
> demo.bpmn.io and Camunda Modeler run): every `cp:` element is **silently discarded** on save,
> taking the `i18n:translation` children nested inside it with it (on one model: `cp:` 6 → 0,
> `i18n:` 51 → 33, nine "unparsable content" warnings, and the indicators' `BPMNShape` entries
> dropped). Across the corpus that is 64 `cp:` elements and 184 translations. `cp:` *attributes*
> (`cp:selectionBehavior`, `cp:definitionCanonical`) survive, because foreign attributes land in
> moddle's generic `$attrs` bag. The OMG schema is simply stricter than the tooling: it admits
> foreign-namespace *elements* only inside `bpmn:extensionElements` (`xsd:any`, lax) and foreign
> *attributes* only when they carry a namespace. Validating against a BPMN4CP-extended schema
> instead would be a tooling decision, out of scope of this finding.
>
> Validating at the time of the analysis: `aftercare`, `palliative-care`, `patient-consultation`,
> `screening` (the analysis covered the nine models present at the time; the initial-entry model
> merged later that day in #77 validates clean on the core view; since the core-view fix in commit
> 0434ada (#87) only the overarching model still fails — Issue X2 — so 9 of 10 pass today).

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
- **Cause:** the `cp:qualityIndicator` elements (quality indicators bound to a data object via
  `dataObjectRef`) are serialised as **direct children of `bpmn:process`** — siblings of the
  flow elements (before them in `treatment`, after them in the other four) — instead of inside a
  `bpmn:extensionElements` container. `tProcess` has a closed content model; foreign elements are
  admitted only through `bpmn:extensionElements`. The `cp:` moddle descriptor mirrors this
  placement — its `ProcessExtension` type *extends* `bpmn:Process` with the quality-indicator
  property — which is exactly why the roundtrip is lossless **inside this repository** while the
  OMG schema objects and stock editors discard the content.
  *(Added 2026-09-16.)* The serialisation is the **vendor's**, not BPMN4CP's: the publications
  define Quality Indicator without attributes, attached through a BPMN `Property`, and know
  neither `qIDefinition` nor `numerator`/`denumerator` nor a `dataObjectRef` anchor — in
  BPMN4CP a data object hosts the *document* perspective, a different perspective entirely. A
  second, independent defect sits underneath: each `cp:qualityIndicator` nests a
  `bpmn:extensionElements` block (carrying `i18n:translation` children) **inside a non-BPMN
  element**, which moving the parent alone would not repair.
- **Acceptance-test criteria:** SYN-1 hygiene (schema-valid serialisation of the declared
  conformance class, *Analytic*). No Muss criterion is affected; the clinical content (SEM-7
  quality indicators) is unchanged.
- **Suggested modeller action** *(recommendation strengthened 2026-09-16: the argument for (A) is
  now a conformance argument — the BPMN4CP authors themselves criticise extensions that bypass
  BPMN's extension interface because it "impedes the straightforward integration of extensions in
  BPMN modeling tools", and the measured data loss above shows exactly that consequence. Before
  executing (A), settle whether these models must stay editable in the helict Pathway Modeler,
  which presumably expects its own placement on re-import.)* **(A, recommended)** move the
  `cp:qualityIndicator` elements of each process into one `bpmn:extensionElements` block directly
  under `bpmn:process` — the standard location for extension content — **together with** a
  matching adjustment of the `cp:` descriptor (`tools/moddle/bpmn4cp.json`; a tooling follow-up,
  so the roundtrip keeps recognising them). Keep ids and `dataObjectRef`s unchanged so the `.svg`
  renders and the `i18n:` content are unaffected; re-run `npm run check:conformance` — the XSD
  block should turn green and the roundtrip must stay lossless. **(B)** keep the BPMN4CP placement
  as it is and accept that the XSD-core layer stays informational for the `cp:`-carrying models.
- **Labels:** `model`, `conformance`, `housekeeping`.

---

### Primary sources (added 2026-09-16)

Read in full from the maintainer's copies; they are what corrects this note.

- Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W.: *BPMN4CP: Design and Implementation of a BPMN
  Extension for Clinical Pathways.* IEEE BIBM 2014, pp. 9–16. DOI 10.1109/BIBM.2014.6999261 — v1.0.
- Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W.: *Extending a Business Process Modeling
  Language for Domain-Specific Adaptation in Healthcare.* Wirtschaftsinformatik 2015, Paper 32.
- Braun, R.; Burwitz, M.; Schlieter, H.; Benedict, M.: *Clinical Processes from Various Angles —
  Amplifying BPMN for Integrated Hospital Management.* IEEE BIBM 2015, pp. 837–845 — v2.1.
- Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W.: *BPMN4CP Revised — Extending BPMN for
  Multi-perspective Modeling of Clinical Pathways.* HICSS 2016, pp. 3249–3258.
  DOI 10.1109/HICSS.2016.407 — v2.0, the version that introduces quality indicators.

What they establish for this finding:

1. **No serialisation was ever published.** BPMN4CP applies steps 1–2 of the BPMN extension method
   of Stroppi, Chiotti & Villarreal and explicitly skips steps 3 and 4, the two that produce the
   XML schema: "step 3 and step 4 … are not applied" (BIBM 2014, § II.B), "neither applied nor
   considered" (WI 2015, § 2.3), "Due to page space limitations, the last two steps are not
   examined in detail" (HICSS 2016). There is therefore **no BPMN4CP rule that the current
   placement violates — and none that sanctions it either.**
2. **Quality Indicator is specified minimally.** It exists from v2.0 on, has **no attributes** in
   any source, is attached through a specified BPMN `Property` ("can be assigned to Processes,
   Activities and Events", HICSS 2016, Table 1; "Processes, Activities or Gateways", BIBM 2015,
   § IV-A) and is drawn as a labelled circle annotated to the element it measures. A full-text
   search of all six documents for *numerator*, *denominator*, *Zähler*, *Nenner* or *ratio*
   returns nothing.
3. **The authors' own quality criterion is meta-model conformance.** They criticise that "only very
   few BPMN extensions make use of" BPMN's extension interface, which "hampers both
   comprehensibility and comparability … and impedes the straightforward integration of extensions
   in BPMN modeling tools due the missing compliances with the BPMN meta model" (BIBM 2014, § II.A;
   WI 2015, § 2.2).
4. **No terminology binding.** BPMN4CP defines none — no SNOMED, LOINC, ICD, code system or value
   set anywhere. The only code-like slot is `Segment.code` in the document perspective, whose
   demonstration values are LOINC-shaped but never named as such. A terminology extension is
   therefore complementary to BPMN4CP, not a duplicate of it.
5. `cp:selectionBehavior` and `cp:definitionCanonical` are **not BPMN4CP either** — they are FHIR
   R4 `PlanDefinition.action` field names, and `any` is a FHIR `ActionSelectionBehavior` code.

Consequence for the repository: the `cp:` content is best described as **the helict Pathway
Modeler's dialect of BPMN4CP**, whose concept names are BPMN4CP's and whose structure and placement
are the vendor's. Documenting it that way is honest and costs nothing; changing the models is a
question for #49.

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
