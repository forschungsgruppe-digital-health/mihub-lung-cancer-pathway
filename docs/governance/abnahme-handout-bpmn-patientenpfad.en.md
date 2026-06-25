<!--
English translation of `abnahme-handout-bpmn-patientenpfad.md` (German is the original/authoritative source).
Provided for reference; keep both language versions in sync and at the same version.
Status: draft — not final, likely to change. Change history: docs/governance/CHANGELOG.md.
-->

# Handout for the Acceptance Checklist: BPMN-modelled Patient Pathway

**Purpose.** This document provides a traceable rationale for each acceptance criterion based on the sources and illustrates it with one example each from the lung-cancer context. The IDs are identical to those in the checklist. Technical terms are explained in the **mini-glossary of the checklist**.

**Structure per criterion:** *Criterion* → *Rationale (source)* → *Example*.

> Note on source verification: 7PMG, Kinsman, SEQUAL and soundness were checked **against the full text**; OMG BPMN 2.0 and BPMN4CP were checked against the specification/abstract and excerpt level (see verification status at the end).

---

## A. Understandability & technical correctness (technical acceptance)

### SYN-1 · Conformance class declared and adhered to

**Criterion.** The intended BPMN 2.0 language scope (Descriptive, Analytic, Common Executable) is defined, and the model uses only the elements permitted there.

**Rationale (source).** The OMG specification BPMN 2.0 defines three process-modeling conformance subclasses that build on one another, each with a limited scope of elements and attributes. Without a declared target class it is not verifiable whether different tools interpret or serialise the model identically — inconsistencies in XML serialisation between tools are documented. Defining the class is what makes the technical acceptance objectifiable in the first place.

**Example.** A pathway with a timer event ("molecular diagnostics within 14 days") and a message event ("findings to tumor board") exceeds **Descriptive**. The correct class is **Analytic**; if the pathway is later to be executed by an engine, **Common Executable** is required.

### SYN-2 · One start/one end event per level

**Criterion.** Every process level has exactly one start and one end event; multiple ends converge or are deliberately justified.

**Rationale (source).** 7PMG guideline **G3** (Mendling, Reijers, van der Aalst 2010): The number of start/end events correlates positively with the probability of error. The authors explicitly name two further reasons: most workflow engines require a single start/end node, and exactly one start/end facilitates understanding **and** is what makes analyses such as the soundness check possible in the first place.

**Example.** A pathway that ends in parallel in "Curative therapy initiated" and "Best supportive care initiated" converges on a common end event "Therapy decision documented" — instead of two loose ends.

### SYN-3 · Verb-object labels

**Criterion.** Activities are named as verb + object.

**Rationale (source).** 7PMG guideline **G6**: In an experiment with 29 postgraduates (Eindhoven), verb-object labels were rated as significantly less ambiguous and more useful than nominal ("action-noun") labels. According to the authors, it is the only one of the common labelling rules that is operationalised and empirically supported.

**Example.** Anti-pattern: "Histology", "Tumor board". Pattern: "**Report histology findings**", "**Present case at tumor board**". "Diagnostics" becomes "**Perform imaging**".

### SYN-4 · ≤ 50 elements / decomposition

**Criterion.** No diagram exceeds ~50 elements; larger pathways are decomposed via Call Activities.

**Rationale (source).** 7PMG guideline **G7**: Size is a major driver of the probability of error; in a collection of ~2000 industrial models it exceeded 50 % beyond > 50 elements. For context: real modelling projects exhibit error rates of 10–20 % anyway. Decomposition keeps sub-models understandable and verifiable.

**Example.** The block "molecular diagnostics" (sample acquisition, NGS request, reporting, release, follow-up presentation) is extracted as its own sub-process diagram and referenced in the main pathway as a Call Activity "Perform molecular diagnostics".

### SYN-5 · Structure, minimal routing, no OR-gateways

**Criterion.** The model is as block-structured as possible, the node degree is low, OR-gateways are avoided or justified.

**Rationale (source).** 7PMG **G4** (ranked by 21 surveyed professional modellers as the most effective guideline): A model is *structured* if **every split connector has a join connector of the same type** — the authors compare this to **balanced brackets** (every opening one has a matching closing one). Additionally **G2** (a high node degree correlates strongly with errors) and **G5** (the OR-join semantics is ambiguous and leads to paradoxes/implementation problems). Note by the authors: apply G2 only in extreme cases, as it runs counter to G1 (fewer elements).

**Example.** Instead of an OR-gateway "possibly radiation and/or chemotherapy", two explicit, cleanly paired splits with unambiguous conditions are modelled ("Stadium III → radiochemotherapy", "Stadium IV → systemic therapy").

### STR-1…STR-4 · Soundness (logical freedom from errors)

**Criterion.** The model is *sound*: every run can reach the end (STR-1), no active tokens remain at the end (STR-2), no dead/unreachable activities (STR-3), no deadlock/livelock (STR-4).

**Rationale (source).** Soundness is the established correctness criterion for process models (van der Aalst), derived via the Petri-net properties liveness and boundedness. Fahland et al. (2011, *Data & Knowledge Engineering* 70, 448–466) show that these properties are practically instantaneously checkable in an automated way for realistic industrial models ("Analysis on demand"). Soundness is the objectifiable core of the technical acceptance — best checked by tool.

**Example (deadlock, STR-4).** After "Complete staging", an **AND-split** opens two branches (pathology, radiology); they are then erroneously merged with an **XOR-join**. The XOR-join fires on the first arriving token, the second one remains stranded → STR-2 violated. Conversely, an **AND-join after an XOR-split** creates a deadlock (waits forever for a branch that was never activated). Rule: pair gateways of the same type.

---

## B. Clinical content validity (clinical acceptance)

> Basis B.1: Kinsman, Rotter, James, Snow, Willis (2010): *What is a clinical pathway? Development of a definition to inform the debate.* **BMC Medicine** 8:31 — five criteria, developed in coordination with the European Pathways Association. Operationalisation (confirmed against the full text): criterion 1 (must) plus ≥ 3 of the remaining four.

### SEM-1 · Multidisciplinary plan, roles as lanes

**Criterion.** Structured, multidisciplinary treatment plan; all participating disciplines are represented.

**Rationale (source).** Kinsman criterion 1 — the only mandatory one: Without represented multidisciplinarity it is, by definition, not a clinical pathway. BPMN4CP (Braun et al. 2014) emphasises that the activities shared across roles form the core of pathway modelling.

**Example.** Lanes for **pulmonology, radiology, pathology, thoracic surgery, (haemato-)oncology, palliative medicine** and **patient**; the tumor board appears as a cross-role activity.

### SEM-2 · Guideline/evidence reference

**Criterion.** For each relevant step, the underlying guideline/evidence is named.

**Rationale (source).** Kinsman criterion 2: A pathway "channels" the translation of guidelines/evidence into local structures. The reference makes clinical correctness verifiable.

**Example.** "Request molecular diagnostics" carries an annotation referencing the **S3-Leitlinie Lungenkarzinom** or the **nNGM** recommendation; the source reference is documented in the review protocol.

### SEM-3 · Completeness of the steps

**Criterion.** The essential steps of the treatment course are represented.

**Rationale (source).** Kinsman criterion 3 requires the steps to be detailed as an "inventory of actions". Gaps lead to undefined behaviour in care delivery.

**Example.** Reviewers check that **restaging** and **structured aftercare** are also modelled after therapy initiation and are not implicitly assumed.

### SEM-4 · Time frame / criteria-based progression

**Criterion.** Transitions are tied to deadlines or explicit criteria.

**Rationale (source).** Kinsman criterion 4: Steps are triggered when defined criteria are met — this distinguishes a pathway from a mere collection of activities.

**Example.** Conditional gateway "**molecular findings complete?**"; in case of "no after 14 days", escalation via a timer event instead of undefined waiting.

### SEM-5 · Target population / standardisation

**Criterion.** Target population and standardisation goal are delimited.

**Rationale (source).** Kinsman criterion 5: A pathway standardises the care of a **specific** population/problem. Without delimitation, completeness cannot be assessed.

**Example.** Scope annotation: "**NSCLC, Stadium III–IV, first diagnosis**"; SCLC and recurrences are explicitly excluded.

### SEM-6 · Clinical correctness / face validity (consensus)

**Criterion.** The model has been validated iteratively with domain experts until consensus.

**Rationale (source).** Validation ("the *right* model") relies on domain expertise — unlike the automatable verification. Documented approach: Benevento et al. (2023) validated their normative BPMN model qualitatively in several sessions with physicians from intensive/intermediate care and refined it until all agreed.

**Example.** The pathway model is presented in two to three moderated sessions in the tumor board; change requests are incorporated in a versioned manner until the board unanimously approves it (protocol as proof of acceptance).

### SEM-7 · Domain-specific artefacts (BPMN4CP)

**Criterion.** Where applicable, resources, documents, goals and quality indicators are captured.

**Rationale (source).** BPMN4CP (Braun et al. 2014; revised 2015/2016) deliberately extends BPMN with these CP-specific concepts, because generic BPMN does not represent them. They are deliberately distributed across perspective-specific sub-diagrams in order to master complexity (see appendix).

**Example.** Attached to "Initiate systemic therapy" are: the required **document** (molecular pathology findings report), the required **resource** (bundle "imaging"), the **quality indicator** ("time from diagnosis to start of therapy").

---

## C. Understandability for both sides (joint acceptance)

### PRA-1 · Understandability for clinical and technical audiences

**Criterion.** The model is equally understandable for both audience groups.

**Rationale (source).** SEQUAL (Lindland, Sindre, Sølvberg 1994; extended by Krogstie et al.) defines **pragmatic quality** as the correspondence between the model and the audience's interpretation — explicitly separated into *social* (here clinical) and *technical* audience. This very dual understandability is the joint acceptance criterion. (7PMG describes SEQUAL as valuable, but too abstract for beginners — which is why the checklist adds concrete 7PMG items.)

**Example.** In the joint walkthrough, one clinical and one technical person each paraphrase the same pathway segment; if the interpretations diverge (e.g. the meaning of a gateway), the model or the label is sharpened.

### PRA-2 · Stakeholder-specific partial views

**Criterion.** Audience-appropriate partial views exist.

**Rationale (source).** BPMN4CP assigns concepts to different perspectives/diagrams in order to provide diagrams suitable for the respective stakeholders (in essence). The same element can be represented differently (shape, level of detail) per diagram.

**Example.** A **clinical overview view** (lanes, main steps, without technical attributes) and a **technical view** (data objects, message flows, execution attributes) of the same pathway.

### PRA-3 · Relevance

**Criterion.** No elements superfluous for the acceptance purpose.

**Rationale (source).** GoM principle of **relevance** (Becker, Rosemann, Schütte 1995) and 7PMG **G1** ("as few elements as possible"): Superfluous elements increase cognitive load and the risk of error without yielding any insight. In the 7PMG example, applying G1 reduced the element count from 37 to 31 without changing the logic.

**Example.** Purely decorative intermediate events or duplicated auxiliary activities that are irrelevant to the acceptance decision are removed or moved into a detail view.

---

## Appendix: Summary of the BPMN4CP paper

**Sources (all: Chair of Wirtschaftsinformatik, esp. Systems Development, TU Dresden — confirmed via the TU Dresden research portal).**
- Original: Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2014): *BPMN4CP: Design and implementation of a BPMN extension for clinical pathways.* Proc. IEEE Int. Conf. on Bioinformatics and Biomedicine (BIBM), pp. 9–16.
- Revised: Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2016): *BPMN4CP Revised – Extending BPMN for Multi-perspective Modeling of Clinical Pathways.* 49th Hawaii International Conference on System Sciences (HICSS), pp. 3249–3258. DOI 10.1109/HICSS.2016.407.
- Accompanying (extension method/requirement types): Braun, R.; Esswein, W. (2015): *Extending a Business Process Modeling Language for Domain-Specific Adaptation in Healthcare.* Wirtschaftsinformatik, pp. 468–481.

**Problem & motivation.** Clinical pathways (CPs) can be understood as the business processes of a hospital; their modelling promises benefits for system integration, quality management and documentation. BPMN is attractive for this (expressive, clearly defined meta-model, workflow integration), but **generic**: it lacks domain-specific CP concepts (e.g. evidence indicators, resources, clinical restrictions). The authors explicitly address **two stakeholder groups** with opposing knowledge: medical staff as domain experts (little modelling experience) and process analysts as IT experts (little medical knowledge). The framework is designed to be "human-centric" for mixed teams.

**Method.** Design-science research (Hevner); the BPMN extension method by Stroppi et al. (2011) is used and systematically extended. The basis of the domain understanding is, among other things, the five constitutive CP characteristics according to Kinsman et al. (2010). From a domain ontology / a conceptual domain model, the extension need is derived and a valid BPMN extension meta-model is constructed. The revised version went through an iteration based on the practical application in a telemedicine project.

**Content of the extension (revised).** **Resources, documents, goals and quality indicators** are integrated. Resources can be modelled as **resource bundles** (example: "CT" as a bundle of subordinate resources) including relations (e.g. complementary/substitutive). These concepts are deliberately assigned to **perspectives and sub-diagrams** (e.g. process, resource, document perspective) — to **master complexity** and to provide **stakeholder-appropriate diagrams**. The same element can be represented differently per diagram (shape and level of detail vary). Everything is implemented as a reusable **BPMN meta-model extension** (BPMN4CP 2.0).

**Demonstration.** The two versions use different examples: the **original version 2014** demonstrates BPMN4CP on a **wisdom-tooth treatment**, the **revised version 2016** on a (simplified) **stroke pathway** — there, the activity "Stroke Diagnosis" references the resource bundle "CT", and the resource as well as the document perspective are shown in their own diagrams.

**Relevance for this checklist.** BPMN4CP provides the rationale for **SEM-7** (domain-specific artefacts) and **PRA-2** (multi-perspective, stakeholder-specific partial views) and supports the **two-audience logic** (clinical/technical) underlying the entire checklist.

---

## Sources & verification status

**Checked against the full text:**

1. **7PMG** — Mendling, J.; Reijers, H. A.; van der Aalst, W. M. P. (2010): *Seven process modeling guidelines (7PMG)*. Information and Software Technology 52(2), 127–136. *(Full text checked: G1–G7; G4 = "balanced brackets"; G3 rationale incl. engine requirement; > 50 elements ⇒ probability of error > 50 %; real error rate 10–20 %; expert ranking G4>G7>G1>G6>G2>G3>G5 from 21 modellers; G6 experiment with 29 postgraduates; example 37→31 elements.)*
2. **Kinsman et al. (2010)** — *What is a clinical pathway?* BMC Medicine 8:31. *(Full text/PMC checked: five criteria + operationalisation "1 + ≥ 3".)*
3. **SEQUAL** — Lindland, O. I.; Sindre, G.; Sølvberg, A. (1994): *Understanding quality in conceptual modeling*. IEEE Software 11(2), 42–49; extended: Krogstie et al. (1995/2006). *(Definitions syntactic/semantic/pragmatic checked; pragmatic separated into social/technical audience.)*
4. **Soundness** — van der Aalst (soundness criterion); Fahland, D. et al. (2011): *Analysis on demand: Instantaneous soundness checking of industrial business process models*. Data & Knowledge Engineering 70, 448–466. *(Properties and automated checkability checked.)*

**Checked against specification/abstract/excerpts (not the complete running text):**

5. **OMG BPMN 2.0** — Process-modeling conformance subclasses Descriptive/Analytic/Common Executable. *(Verified via ontological analysis and secondary sources.)*
6. **BPMN4CP** — Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2014), IEEE BIBM, pp. 9–16; **Revised** (2016), HICSS 49, pp. 3249–3258, DOI 10.1109/HICSS.2016.407. *(Bibliographic key data — authors, venues, pages, DOI, TU Dresden affiliation — verified via IEEE Xplore and the TU Dresden research portal. Methodology, extension content and stakeholder logic checked from abstracts, figure captions and reference lists of several sources. **Correction vs. v0.2:** Revised = HICSS 2016 (not "2015/2016"); demo example 2014 = wisdom tooth, 2016 = stroke. The complete article body is behind the IEEE paywall and could not be read in full text despite several attempts; figure-related details are paraphrased.)*
7. **STAKOB validation pattern** — Benevento et al. (2023): *Process Modeling and Conformance Checking in Healthcare: A COVID-19 Case Study* (Springer). *(Iterative qualitative validation until consensus checked.)*
8. **GoM** — Becker, J.; Rosemann, M.; Schütte, R. (1995): *Grundsätze ordnungsmäßiger Modellierung*. Wirtschaftsinformatik 37(5), 435–445. *(Six principles — correctness, clarity, relevance, comparability, economic efficiency, systematic structure — confirmed via the 7PMG full text and secondary sources; the German original text was not consulted directly.)*

**Notes.** "Good BPMN" (correctness, clarity, completeness, consistency) according to B. Silver is a practitioner heuristic (secondary source) and is covered here only secondarily (via GoM/7PMG). One secondary source erroneously cited "30 elements" for G7 — the original source says **50**.

*Status of the contents: source verification, no tool trial. Examples are illustrative and not clinically accepted.*
