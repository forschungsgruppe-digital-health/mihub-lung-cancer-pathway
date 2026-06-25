<!--
English translation of `abnahme-checkliste-bpmn-patientenpfad.md` (German is the original/authoritative source).
Provided for reference; keep both language versions in sync and at the same version.
Status: draft — not final, likely to change. Change history: docs/governance/CHANGELOG.md.
-->

---
title: "Acceptance Checklist for BPMN-Modelled Patient Pathways"
short_title: "BPMN-CP Acceptance Instrument"
version: "0.3.1"
status: "Proposed artifact (DSR) – conceptually derived from kernel theories, not yet empirically validated"
language: "EN"
autor: "[Nachname, Initiale]"
affiliation: "[Einrichtung]"
orcid: "[ORCID]"
lizenz: "CC BY 4.0"
persistent_id: "[DOI/Zenodo nach Hinterlegung]"
audience: "clinical and technical stakeholders; including modeling beginners"
---

# Acceptance Checklist for BPMN-Modelled Patient Pathways (v0.3.1)

## Suggested citation

> [Nachname, Initiale] ([Jahr]). *Abnahme-Checkliste für BPMN-modellierte Patientenpfade* (Version 0.3) [Evaluationsinstrument]. [Einrichtung]. [DOI].

When used in a publication, please additionally cite the core sources named in the Construct-to-source mapping (§4).

---

## 1. Purpose and scope

The instrument supports the **structured, traceable acceptance (release)** of a patient pathway modelled in BPMN by **clinical** and **technical** stakeholders. It is designed as a compact assessment grid (items with dichotomous / partly criteria-based checking) and is formulated as tested for intersectoral, oncological care pathways; the items are transferable independently of the domain.

## 2. Methodological derivation (transparency)

The items were **conceptually** synthesised from established kernel theories (in the sense of Hevner et al. 2004) of three strands and mapped to one another:

1. **Generic conceptual model quality** — Guidelines of Modeling (Becker et al. 1995), SEQUAL (Lindland et al. 1994; Krogstie et al.), 7PMG (Mendling et al. 2010).
2. **Clinical pathway validity** — operational pathway definition according to Kinsman et al. (2010); domain-specific modelling concepts according to BPMN4CP (Braun et al. 2014).
3. **Technical correctness/executability** — conformance classes of the OMG BPMN 2.0 specification; soundness concept (van der Aalst; operationalised in Fahland et al. 2011).

The acceptance logic follows the distinction between **verification vs. validation** and the SEQUAL separation of pragmatic quality by *social* (clinical) and *technical* audience group. The instrument is understood as a DSR artifact; for positioning and planned evaluation see §6.

**Limitation.** This version is a theory-driven construction. An empirical validation (content validity, reliability, applicability) is pending (§6).

---

## 3. The instrument

**Reading aid.** **Must** = knock-out criterion · **Should** = important, document deviation. **Check method:** **A** = automatic (tool) · **R** = visual check in review · **K** = consensus (Konsens). Tick off: `[x]` met · `[ ]` open. For technical terms see Mini glossary (§8).

### A. Understandability & technical correctness — *technical acceptance*

- [ ] **SYN-1** The BPMN **language scope (conformance class)** is declared and adhered to. 👉 *concretely:* Descriptive/Analytic/Common Executable named; only their elements used. *(Must · A)*
- [ ] **SYN-2** **Exactly one start and one end event** per level. 👉 *concretely:* multiple ends only with justification. *(Must · A/R)*
- [ ] **SYN-3** Activities as **verb + object**. 👉 *concretely:* "Report histology" instead of "Histology". *(Should · R)*
- [ ] **SYN-4** No diagram overloaded (**≤ 50 symbols**); large pathways decomposed. 👉 *concretely:* outsource via Call Activity. *(Should · A)*
- [ ] **SYN-5** **Cleanly paired** splits/joins, low node degree, **no OR gateway**. 👉 *concretely:* split/join of the same type (like brackets). *(Should · A/R)*
- [ ] **STR-1** **Every run can reach the end** (no dead end). *(Must · A)*
- [ ] **STR-2** **No open parallel branches at the end.** *(Must · A)*
- [ ] **STR-3** **No dead/unreachable activities.** *(Must · A)*
- [ ] **STR-4** **No deadlock/livelock** (gateway types correctly paired). *(Must · A)*

### B. Clinical content validity — *clinical acceptance*

- [ ] **SEM-1** **Multidisciplinary**: all participating disciplines visible as a lane. *(Must · R)*
- [ ] **SEM-2** **Guideline/evidence reference** noted at important steps (e.g. S3 guideline / nNGM). *(Should\* · R)*
- [ ] **SEM-3** **Essential treatment steps** complete (incl. restaging, follow-up care). *(Should\* · R)*
- [ ] **SEM-4** Transitions tied to **deadlines/criteria**. *(Should\* · R)*
- [ ] **SEM-5** **Target population/standardisation** delimited. *(Should\* · R)*
- [ ] **SEM-6** **Face validity**: iteratively validated with clinical/domain experts until consensus. *(Must · K)*
- [ ] **SEM-7** Relevant **domain artifacts** (resources, documents, quality indicators) captured. *(Should · R)*

> **Kinsman gate (Must):** SEM-1 **and** ≥ 3 of 4 from {SEM-2…SEM-5}.

### C. Understandability for both sides — *joint acceptance*

- [ ] **PRA-1** Clinical and IT side **understand the model identically** (joint walkthrough). *(Must · R)*
- [ ] **PRA-2** **Overview and technical detail view** available. *(Should · R)*
- [ ] **PRA-3** **Relevance**: no superfluous elements. *(Should · R)*

### Acceptance gates

| Gate | Condition | Method |
|---|---|---|
| Technical | all Must in A (SYN-1, SYN-2, STR-1…4) | A + R |
| Clinical | Kinsman gate **and** SEM-6 | R + K |
| Pragmatic | PRA-1 | R |

**Overall acceptance** only with all three gates. Document open Should items in the sign-off with measure/deadline.

---

## 4. Construct-to-source mapping (traceability)

| ID | Construct / quality dimension | Core source(s) |
|---|---|---|
| SYN-1 | Language conformance (syntactic) | OMG BPMN 2.0 / ISO/IEC 19510 |
| SYN-2 | Syntactic quality, model quality | Mendling et al. 2010 (G3); Lindland et al. 1994 |
| SYN-3 | Label uniqueness (pragmatic) | Mendling et al. 2010 (G6) |
| SYN-4 | Size/complexity → error risk | Mendling et al. 2010 (G7) |
| SYN-5 | Structuredness, routing | Mendling et al. 2010 (G2/G4/G5) |
| STR-1…4 | Soundness (semantic/technical) | van der Aalst; Fahland et al. 2011 |
| SEM-1 | Multidisciplinarity (pathway definition) | Kinsman et al. 2010 (crit. 1); Braun et al. 2014 |
| SEM-2 | Evidence/guideline grounding | Kinsman et al. 2010 (crit. 2) |
| SEM-3 | Completeness of steps | Kinsman et al. 2010 (crit. 3) |
| SEM-4 | Criteria-based progression | Kinsman et al. 2010 (crit. 4) |
| SEM-5 | Standardisation/population | Kinsman et al. 2010 (crit. 5) |
| SEM-6 | Semantic validity (face validity) | Lindland et al. 1994; Benevento et al. 2023 |
| SEM-7 | Domain-specific concepts | Braun et al. 2014 |
| PRA-1 | Pragmatic quality (dual audience) | Lindland et al. 1994; Krogstie et al. |
| PRA-2 | Stakeholder-specific perspectives | Braun et al. 2014 |
| PRA-3 | Relevance | Becker et al. 1995; Mendling et al. 2010 (G1) |

---

## 5. Application/reuse note

The instrument is freely usable and adaptable under CC BY 4.0. When adapting (e.g. another indication), changed/added items should be marked as a deviation from this version (0.3) in order to preserve comparability.

## 6. Planned evaluation (DSR positioning)

A **formative → summative** evaluation trajectory is planned in the sense of FEDS (Venable et al. 2016), with method selection according to Prat et al. (2015):

1. **Content validation (formative, artificial):** expert panel (clinical + technical), Lawshe CVR/CVI per item; items below the critical CVR are revised/removed.
2. **Understandability/usability (formative):** cognitive walkthrough / think-aloud with modeling beginners.
3. **Reliability & criterion validity (summative, naturalistic):** application to real pathways; interrater reliability (Cohen's/Fleiss' kappa) between independent reviewers; comparison with an expert gold standard.
4. **Acceptance/utility (summative):** controlled comparison (with vs. without the instrument) regarding defect detection and perceived utility (Method Evaluation Model, Moody 2003 / UTAUT items).

---

## 7. References

**Construct/core sources (reconciled at source level in this work):**

- Becker, J.; Rosemann, M.; Schütte, R. (1995): Grundsätze ordnungsmäßiger Modellierung. *Wirtschaftsinformatik* 37(5), 435–445.
- Lindland, O. I.; Sindre, G.; Sølvberg, A. (1994): Understanding quality in conceptual modeling. *IEEE Software* 11(2), 42–49. (Extension: Krogstie, J.; Lindland, O. I.; Sindre, G. 1995; Krogstie 2006.)
- Mendling, J.; Reijers, H. A.; van der Aalst, W. M. P. (2010): Seven process modeling guidelines (7PMG). *Information and Software Technology* 52(2), 127–136.
- Kinsman, L.; Rotter, T.; James, E.; Snow, P.; Willis, J. (2010): What is a clinical pathway? Development of a definition to inform the debate. *BMC Medicine* 8:31.
- Object Management Group (2011): *Business Process Model and Notation (BPMN) Version 2.0* (corresp. ISO/IEC 19510:2013).
- Fahland, D.; Favre, C.; Koehler, J.; Lohmann, N.; Völzer, H.; Wolf, K. (2011): Analysis on demand: Instantaneous soundness checking of industrial business process models. *Data & Knowledge Engineering* 70, 448–466.
- Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2014): BPMN4CP: Design and implementation of a BPMN extension for clinical pathways. *Proc. IEEE Int. Conf. on Bioinformatics and Biomedicine (BIBM)*, 9–16. — Revised: Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2016): BPMN4CP Revised – Extending BPMN for Multi-perspective Modeling of Clinical Pathways. *49th Hawaii Int. Conf. on System Sciences (HICSS)*, 3249–3258, DOI 10.1109/HICSS.2016.407.
- Benevento, E. et al. (2023): Process Modeling and Conformance Checking in Healthcare: A COVID-19 Case Study. In: *Process Mining Workshops*, Springer (LNBIP).

**Methodological references (standard literature; verify citation details before submission — verified at source in the thread: Venable et al. 2016, Prat et al. 2015, Lawshe 1975):**

- Hevner, A. R.; March, S. T.; Park, J.; Ram, S. (2004): Design Science in Information Systems Research. *MIS Quarterly* 28(1), 75–105.
- Peffers, K.; Tuunanen, T.; Rothenberger, M. A.; Chatterjee, S. (2007): A Design Science Research Methodology for Information Systems Research. *JMIS* 24(3), 45–77.
- Venable, J.; Pries-Heje, J.; Baskerville, R. (2016): FEDS: A Framework for Evaluation in Design Science Research. *European Journal of Information Systems* 25(1), 77–89.
- Prat, N.; Comyn-Wattiau, I.; Akoka, J. (2015): A Taxonomy of Evaluation Methods for Information Systems Artifacts. *JMIS* 32(3), 229–267.
- Sonnenberg, C.; vom Brocke, J. (2012): Evaluations in the Science of the Artificial. In: *DESRIST*, LNCS 7286, 381–397.
- Lawshe, C. H. (1975): A Quantitative Approach to Content Validity. *Personnel Psychology* 28(4), 563–575.

## 8. Mini glossary (for beginners)

| Term | In one sentence |
|---|---|
| **Activity** | Work step; rounded rectangle. |
| **Event** | Occurrence; circle (start = thin, end = thick). |
| **Gateway** | Split/join; diamond. XOR = either/or, AND = parallel, OR = one *or several* (avoid). |
| **Lane / Pool** | "Swimlane": shows who performs the step. |
| **Token** | Imagined game piece that follows the arrows (for "playing through"). |
| **Soundness** | No logical dead ends, blocked or unreachable points. |
| **Call Activity** | Step that references an outsourced sub-model. |
| **Conformance class** | Agreed BPMN language scope: Descriptive < Analytic < Common Executable. |

## 9. Changelog

- **v0.3.1** — BPMN4CP reference made precise: Revised = HICSS 2016 (pp. 3249–3258, DOI 10.1109/HICSS.2016.407); BIBM 2014 and HICSS 2016 versions cited separately.
- **v0.3** — Publication-ready instrument version: front matter, derivation note, Construct-to-source mapping, evaluation plan, references, license/citation.
- **v0.2** — Beginner suitability (glossary, check questions), full-text reconciliation of the core sources.
- **v0.1** — First structure (dimensions, gates, sign-off).

---

*Rationale and one example per item: `abnahme-handout-bpmn-patientenpfad.md`. Status of the source check documented there.*
