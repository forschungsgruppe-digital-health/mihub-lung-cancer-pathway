# Palliative-care sub-pathway — baseline findings (2026-06-29)

The palliative-care sub-pathway [`models/lung-cancer-palliative-care-pathway.bpmn`](../../models/lung-cancer-palliative-care-pathway.bpmn)
was merged as a **WIP / unstable draft** (modeller's note) and integrated in `v0.3.0-rc.1`. The
conformance gate surfaces the findings below — **reports, not fixes**: a human modeller addresses
each via a GitHub issue (template `bpmn-model-issue`) and re-validates (acceptance test SEM-6).
Reproduce: `npm run check:metrics` / `npm run lint:bpmn` on the file (gate is **advisory/warn-only**
in CI). Elements are cited as `"Label" (id)`; unnamed elements show `‹unnamed Type› (id)`.

> The model is **draft/unfinished** — these findings will evolve as the modeller completes it.
> Soundness (STR-1…4) was **not run** here (needs the rust_bpmn_analyzer container; see
> [`../decisions/0003-soundness-tooling.md`](../decisions/0003-soundness-tooling.md)).

> Suggested labels for all: `model`. Per-issue extras noted below.

---

### Issue P1 — Replace the 7 OR-gateways with XOR/AND (SYN-5)

- **Affected:** `models/lung-cancer-palliative-care-pathway.bpmn`:
  - `Process_1`: "Komplexität der Gesamt-situation?" (`Gateway_17axhj6`)
  - level *Palliativmedizinische Basisversorgung*: `Gateway_1uiml6f`, `Gateway_1hzspe5` (unnamed)
  - level *Palliativmedizinische Beratung*: `Gateway_0m1xpsg`, `Gateway_1v17ell` (unnamed)
  - level *Sterbephase*: `Gateway_0ldiuog`, `Gateway_1e1ism8` (unnamed)
- **Found:** `bpmn:InclusiveGateway` present — `metrics` SYN-5 (7 blocking), bpmnlint `no-inclusive-gateway`=error (7).
- **Acceptance-test criteria:** SYN-5 (no OR-gateway); CONVENTIONS R5.
- **Suggested remodeling:** convert each inclusive gateway to explicit **XOR** (mutually exclusive conditions) or **AND** (true parallelism).
- **Labels:** `model`, `conformance`, `needs-clinical-review`.

### Issue P2 — Resolve multiple start/end events (SYN-2)

- **Affected:** `Process_1` —
  - **starts (2):** ‹unnamed StartEvent› (`StartEvent_1`), "Patient mit gesicherter Lungenkrebs-diagnose, palliativ/nicht-heilbar" (`Event_1p7m63o`)
  - **ends (2):** "Hospiz, Pflegeeinrichtung, nach Hause oder Tod" (`Event_14oxtwj`), "Tod des Patienten" (`Event_1ccabc5`)
- **Found:** `metrics` SYN-2 (start=2, end=2); bpmnlint `single-blank-start-event` (the blank `StartEvent_1`).
- **Acceptance-test criteria:** SYN-2 (one start/end per level; multiple only if justified).
- **Suggested remodeling:** consolidate to a single start (or remove/justify the blank `StartEvent_1`). The two named ends (death vs. discharge) may be clinically justified — document the deviation per SYN-2.
- **Labels:** `model`, `conformance`, `needs-clinical-review`.

### Issue P3 — Structural defects: labels, gateway joins, link events (bpmnlint)

- **Found:** bpmnlint **19 errors / 2 warnings** — `label-required` (7, unlabeled gateways/events), `fake-join` (2, a split gateway re-used as an implicit join), `link-event` (4, paired link catch/throw connectors), `single-blank-start-event` (1, see P2), `no-inclusive-gateway` (7, see P1).
- **Acceptance-test criteria:** SYN-3 (labels), STR-4 (gateway pairing), SYN-2.
- **Suggested remodeling:** label the unnamed gateways; pair each split with a matching same-type join (resolve `fake-join`); confirm the link catch/throw events pair 1:1.
- **Labels:** `model`, `conformance`.

### Issue P4 — Decompose oversize level (SYN-4) + unify prefix

- **Found:** `Process_1` has **81 flow elements** (> 50, SYN-4); root prefix is `bpmn2:` (the repo mixes `bpmn:` / `bpmn2:`).
- **Acceptance-test criteria:** SYN-4 (≤ 50 per level — *Soll*); SYN-1 hygiene.
- **Suggested remodeling:** decompose via Call Activities (≤ 50 elements/level); re-export with the consistent `bpmn:` root prefix.
- **Labels:** `model`, `conformance`, `housekeeping`.

### Issue P5 — Complete the WIP draft + clinical/pragmatic review (SEM/PRA)

- **Affected:** the whole model — flagged **unfinished/unstable** by the modeller.
- **Found:** out of scope for the automatable checks; the clinical (SEM-1…7) and pragmatic (PRA-1…3) criteria and the **SEM-6 face-validity consensus** are pending.
- **Suggested remodeling:** finish the draft, then run the advisory `clinical-pathway-review` and hold the expert walkthrough before acceptance.
- **Labels:** `model`, `needs-clinical-review`.
