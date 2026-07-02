<!--
English translation of `abnahme-protokoll-bpmn-patientenpfad.md` (German is the original/authoritative source).
Provided for reference; keep both language versions in sync and at the same version.
Status: draft — not final, likely to change. Change history: docs/governance/CHANGELOG.md.
-->

# Acceptance-Test Protocol — BPMN-modelled patient pathway

*To be filled in during the acceptance-test meeting. Criteria basis: Instrument v0.3.1 (IDs identical). If a criterion is unclear, see the handout.*

## 0. General data

| Field | Entry |
|---|---|
| Pathway / model name | |
| Model version / commit hash | |
| Artifact / repository link | |
| Target conformance class | ☐ Descriptive ☐ Analytic ☐ Common Executable |
| Date / location of acceptance test | |
| Criteria basis | Acceptance-test instrument v0.3.1 |
| Protocol ID | |

### Participants

| Name | Role | Present |
|---|---|---|
| | Clinical lead | ☐ |
| | Technical lead | ☐ |
| | Domain expert (clinical) | ☐ |
| | Facilitation / minutes | ☐ |
| | | ☐ |

---

## 1. Check results

**Result codes:** ✓ fulfilled · ✗ not fulfilled · – not applicable (justify). **M** = Must, **S** = Should. **Method:** A = tool, R = review, K = consensus.

### A · Technical (understandability & correctness)

| ID | Criterion | M/S | Method | Result | Evidence / remark |
|---|---|---|---|---|---|
| SYN-1 | Conformance class declared & adhered to | M | A | ☐✓ ☐✗ ☐– | |
| SYN-2 | Exactly one start / one end event | M | A/R | ☐✓ ☐✗ ☐– | |
| SYN-3 | Verb-object labels | S | R | ☐✓ ☐✗ ☐– | |
| SYN-4 | ≤ 50 symbols / decomposed | S | A | ☐✓ ☐✗ ☐– | |
| SYN-5 | Paired splits/joins, no OR | S | A/R | ☐✓ ☐✗ ☐– | |
| STR-1 | Every run reaches the end | M | A | ☐✓ ☐✗ ☐– | |
| STR-2 | No open parallel branches at the end | M | A | ☐✓ ☐✗ ☐– | |
| STR-3 | No dead/unreachable activities | M | A | ☐✓ ☐✗ ☐– | |
| STR-4 | No deadlock/livelock | M | A | ☐✓ ☐✗ ☐– | |

Soundness tool / version: ________________  Run result: ☐ green ☐ findings (see remark)

### B · Clinical (content validity)

| ID | Criterion | M/S | Method | Result | Evidence / remark |
|---|---|---|---|---|---|
| SEM-1 | Multidisciplinary (all disciplines as a lane) | M | R | ☐✓ ☐✗ ☐– | |
| SEM-2 | Guideline / evidence reference noted | S* | R | ☐✓ ☐✗ ☐– | |
| SEM-3 | Essential steps complete | S* | R | ☐✓ ☐✗ ☐– | |
| SEM-4 | Transitions tied to deadlines/criteria | S* | R | ☐✓ ☐✗ ☐– | |
| SEM-5 | Target population/standardization delimited | S* | R | ☐✓ ☐✗ ☐– | |
| SEM-6 | Face validity: consensus of the domain experts | M | K | ☐✓ ☐✗ ☐– | |
| SEM-7 | Domain artifacts captured | S | R | ☐✓ ☐✗ ☐– | |

### C · Pragmatic (joint)

| ID | Criterion | M/S | Method | Result | Evidence / remark |
|---|---|---|---|---|---|
| PRA-1 | Both sides understand the model the same way | M | R | ☐✓ ☐✗ ☐– | |
| PRA-2 | Overview and detail view available | S | R | ☐✓ ☐✗ ☐– | |
| PRA-3 | No superfluous elements | S | R | ☐✓ ☐✗ ☐– | |

---

## 2. Gate evaluation

| Gate | Condition | Result | Justification if "not met" |
|---|---|---|---|
| Technical | SYN-1, SYN-2, STR-1…STR-4 all ✓ | ☐ met ☐ not met | |
| Clinical | SEM-1 ✓ **and** ≥ 3 of 4 from {SEM-2…SEM-5} ✓ **and** SEM-6 ✓ | ☐ met ☐ not met | |
| Pragmatic | PRA-1 ✓ | ☐ met ☐ not met | |

*Kinsman gate count: fulfilled criteria from {SEM-2, SEM-3, SEM-4, SEM-5} = ____ / 4.*

---

## 3. Conditions & open items (should-deviations / conditions)

| No | Reference (ID) | Item / deficiency | Action | Owner | Due date | Status |
|---|---|---|---|---|---|---|
| 1 | | | | | | ☐ open ☐ done |
| 2 | | | | | | ☐ open ☐ done |
| 3 | | | | | | ☐ open ☐ done |

---

## 4. Acceptance-test decision

☐ **Accepted** — all three gates met, no open items.
☐ **Accepted with conditions** — all three gates met; open should-items per §3 with a due date.
☐ **Rejected** — at least one gate not met (open must-criterion).

**Decision rationale:**

_____________________________________________________________

**Re-check / re-acceptance-test date (if conditions or rejection):** ____________

> Decision rule: An open **Must** criterion rules out "Accepted with conditions". "With conditions" is only permissible for open **Should** items.

---

## 5. Signatures

| Role | Name | Date | Signature |
|---|---|---|---|
| Clinical lead | | | |
| Technical lead | | | |
| Facilitation / minutes | | | |

---

## 6. Attachments / references

- ☐ Model export / diagram (file, version)
- ☐ Soundness / analysis report (tool, date)
- ☐ Minutes of the clinical validation session(s) (evidence for SEM-6)
- ☐ Acceptance-test instrument v0.3.1 · ☐ accompanying handout

*This protocol documents a single acceptance test. Earlier acceptance tests of the same pathway are retained as separate protocols (version traceability).*
