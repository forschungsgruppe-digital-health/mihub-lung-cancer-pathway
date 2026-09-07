# Data Sources for Probabilities & Timing (Synthea Parameterization)

> **Purpose.** The BPMN pathway gives the Synthea module its *structure*, but not the *numbers*. This document is a verified catalog of **where to get realistic data** to set the branch **probabilities** (`distributed_transition`, must sum to 1.0) and **timing** (`Delay`) that the `synthea:` annotation layer carries — see [`synthea-and-bpmn-primer.md`](./synthea-and-bpmn-primer.md) §4 and [`synthea-dataset-generation-plan.md`](./synthea-dataset-generation-plan.md) Phase 5.
>
> **Status:** Draft v0.1 — originated on branch `research/synthea-dataset-generation`; maintained on `dev` since 2026-06-16; export-ignored from the release archive per [ADR-0002](decisions/0002-versioning-and-release.md) Decision 4.
> **Golden rule:** for *synthetic* data the goal is **plausibility + traceable provenance, not precision**. Every figure below was *read from a source* and is an **illustrative anchor**, not a target — pull the exact value from the cited table when locking a parameter.

---

## 1. TL;DR — recommended approach (tiered)

**v1 — ship now, zero data-access friction.** Parameterize from **clinical guidelines + open published registry aggregates**, the way Synthea's own modules are authored (Walonoski et al., 2018 [^walonoski]; the shipped `lung_cancer.json` cites cancer.org / American Lung Association / Cancer Care Ontario in its `remarks`). Swap those US/Ontario citations for the **German evidence stack the sibling `…-data-elements` repo already uses**: S3-Leitlinie Lungenkarzinom v5.1 (final, July 2026), Onkopedia NSCLC/SCLC, ZfKD "Krebs in Deutschland", CRISP/nNGM for biomarkers, Cancer Council Victoria OCP for timing. Then add a **CI calibration check** (Chen et al., 2019 [^chen] pattern): generate a cohort, tabulate stage mix / histology / modality rates / survival, and assert they match ZfKD + nNGM + OnkoZert benchmarks within tolerance. **No DUA, no ethics, no DIZ extract; fully traceable.**

**v2 — higher realism, deferred (backlog).** Registry-microdata-derived rule extraction and/or process mining on DIZ event logs — for stage-stratified, time-to-treatment, and recurrence-timing realism. Carries data-access + ethics lead time (~3–4 months); **must not block v1**.

---

## 2. Parameter → source matrix

Construct legend: `dist` = `distributed_transition`, `Delay` = timed delay state, `Guard` = conditional gate.

| Parameter | GMF construct | Best **verified** source(s) | Access | DE vs intl · conf. |
|---|---|---|---|---|
| Entry / incidence (age, sex) | Guard (age) + dist (sex-conditioned) | ZfKD "Krebs in Deutschland 2021-2023" lung chapter + krebsdaten.de DB; Onkopedia epi | open aggregate | **German** · high |
| Smoking-attributable branching | complex / Guard on smoking attr | S3-LL v5.1 risk section + Onkopedia (qualitative); CRUK smoking-attributable fraction | open aggregate | DE qualitative; **European proxy** for the % · med |
| Histology split (NSCLC/SCLC; adeno/squamous) | nested dist | Onkopedia NSCLC/SCLC; ZfKD lung page; S3-LL v5.1 | open aggregate | **German** · high |
| Stage at diagnosis (UICC I-IV; SCLC LD/ED) | dist (cond. on histology) | Onkopedia; S3-LL v5.1 headline split. Precision → clinical registry (oBDS/§65c) | open (headline); **data-request** (stratified) | DE open; CRUK/SEER proxy for pattern · med |
| Biomarker prevalence (EGFR/ALK/ROS1/KRAS/BRAF/…; PD-L1 TPS bands) | dist (cond. on adeno) | **German cohorts first:** CRISP registry, nNGM publications; per-gene % from S3-LL/ESMO | open (papers) | **German/European** · med — ⚠ ethnicity-dependent |
| Treatment-intent (curative/palliative) + modality rates | dist (cond. on stage×histology×biomarker) | S3-LL v5.1 + Onkopedia + ESMO CPGs; **rates** from OnkoZert Qualitätsindikatoren 2025 / DKG Jahresberichte; nNGM 1L split | open aggregate | **German** · med — ⚠ certified-centre selection bias |
| Time-to-diagnosis / time-to-treatment | Delay (range) | Cancer Council Victoria OCP (best time-to-* source); OnkoZert time-to-treatment indicators | open aggregate | OCP **Australian proxy**; OnkoZert = DE targets · med |
| Chemo cycle intervals / RT fractionation | Delay (loop / fixed) | S3-LL v5.1 + Onkopedia regimen tables; ESMO + pivotal-trial protocols | open aggregate | DE primary; trial protocols regimen-defining · med |
| Follow-up / surveillance cadence | Delay loop (decreasing freq.) | S3-LL v5.1 Nachsorge + Onkopedia §8 (NSCLC Tab.12 / SCLC Tab.9); ESMO for advanced | open aggregate | **German** · high — reuse sibling repo `frequency_pattern` |
| Survival OS / PFS (by stage/histology/line/biomarker) | Death (range); Delay-to-progression→Delay-to-death | Population OS: ZfKD + GEKID/DKR atlas. Line/biomarker: FLAURA, KEYNOTE-024; SCLC: SEER + Onkopedia | open aggregate | Population **German**; PFS **trial proxy** · med |
| Recurrence / progression rates & timing | dist (recur/cure) + Delay | **GAP in registries** → ESMO CPG + S3-LL PFS/DFS tables; FLAURA/KEYNOTE-024 | open (trial/guideline) | trial proxy · **low** |
| Adverse-event / toxicity rates | dist (AE/grade) gated on modality | **GAP in registries** → pivotal-trial safety tables in ESMO + S3-LL; align coding to sibling repo CTCAE/irAE elements | open (trial/guideline) | trial proxy · **low** |
| LDCT screening eligibility + uptake (AP6) | Guard (age + pack-years + duration + quit-window) + dist (uptake) + dist (stage-shift) | Eligibility **verified** from LuKrFrühErkV §1–§2 (live reimbursed GKV program since 2026-04-01); uptake not yet observed; stage-shift from NELSON/HANSE — **see §2a** | open (law/G-BA) | **German** (eligibility) · uptake low |

### Illustrative anchors (⚠ plausibility, *not* targets — read from cited sources)
- **Incidence (2023, ZfKD):** ~33,490 new cases ♂ / ~24,850 ♀; age-std 49.4/33.1 per 100k; median age 69 (NSCLC), >70 (SCLC); ~2% <50y.
- **Histology:** NSCLC ~85% / SCLC ~15% (biology-based); within lung ca adeno ~44–55%, squamous ~21–27% (Onkopedia vs ZfKD differ — pick & document one).
- **Stage (Onkopedia):** NSCLC ~52% stage IV, ~26% I–II; SCLC ED ~75% / LD ~20% / VLD ~5%.
- **Biomarkers (European/German):** EGFR ~11–15% (adeno/non-squamous; Schildhaus German 9.8%, never-smokers 24.4% vs smokers 4.2%), ALK ~3–5%, ROS1 ~1–2%, KRAS ~17–25% (adeno), BRAF ~2–4%; PD-L1 TPS ≥50% ~21% / 1–49% ~46% / <1% ~31% (small-n, structure only).
- **Survival (ZfKD):** 5-yr relative ~19% ♂ / 25% ♀; 10-yr ~13% / 18%. EGFR-TKI mPFS ~19 mo, mOS ~39 mo (FLAURA); SCLC 5-yr ~8.9%.
- **Timing (OCP, Australian proxy):** CT ≤2 wk of symptoms; specialist ≤2 wk of referral; diagnostics ≤2 wk; treatment start ≤6 wk of referral.

---

## 2a. AP6 — LDCT lung-cancer screening (verified against German law)

**Status (mid-2026):** LDCT lung-cancer screening is a **live, reimbursed GKV program**. Legal basis: the *Lungenkrebs-Früherkennungs-Verordnung* (LuKrFrühErkV, 15 May 2024, under §84(2) StrlSchG), in force since 2024-07-01 [^lukrfrueherkv]; integrated into statutory care via the G-BA Krebsfrüherkennungs-Richtlinie (Beschluss 2025-06-18) with EBM reimbursement from **2026-04-01** [^gba_kfe]. Preceded by the BfS §84 scientific evaluation (2021) [^bfs84] and the IQWiG benefit assessment (S19-02 / update S23-02) [^iqwig_s1902]. The AP6 entry `Guard` maps from the [screening pathway model](../models/lung-cancer-screening-pathway.bpmn). ⇒ **Use the German statutory criteria, not USPSTF.**

**Entry `Guard` (verified verbatim from LuKrFrühErkV §1–§2 [^lukrfrueherkv]):**
- age **50–75** (completed 50th but not yet 76th year of life)
- **≥15 pack-years AND ≥25 years smoking duration** — *pack-years* (Packungsjahre = avg cigarettes/day ÷ 20, summed per year), **not "cigarette-years"**
- former smokers eligible only if cessation was **<10 years** ago
- interval **≥12 months** (annual; shorter only after a control-requiring finding)
- LDCT defined as CTDIvol ≤1.3 mGy; the ordinance has **no** life-expectancy / prior-cancer / prior-surgery exclusions
- GMF encoding: `Guard` on `age ∈ [50,76) ∧ pack_years ≥ 15 ∧ smoking_years ≥ 25 ∧ (current_smoker ∨ years_since_quit < 10)`

**Uptake (`distributed_transition`, low confidence):** no observed national rate yet (program launched 2026-04-01; **no organised invitation/call-recall register**). Eligible population ~5.5 million (DGP/media, *secondary* — verify before use); expert expectation ~10% in the early phase. ⇒ model uptake as a **tunable parameter (default ~10%)**, flagged.

**Stage-shift (`distributed_transition` for screen-detected cases):** screen-detected cancers skew early-stage — NELSON ~58.6% stage IA/IB and ~9.4% stage IV (vs ~45.7% stage IV in the control arm); German **HANSE** baseline ~64% stage I–II [^hanse]. Mortality reduction ~20% (NLST [^nlst]) / ~24% in men (NELSON [^nelson]). ⇒ screen-detected ~60–64% early-stage vs the advanced-stage majority of symptomatic presentation.

> ⚠ German implementation studies (HANSE — PLCOm2012 risk score; 4-IN-THE-LUNG-RUN; SOLACE) inform uptake/risk-targeting, **not** statutory eligibility. The ~5.5 M eligible figure and the HANSE/NELSON stage breakdowns are from secondary/abstract sources — confirm against the primary tables before hard-coding.

---

## 3. Source catalog & access

**German registries / agencies (authoritative for DE).**
- **ZfKD (RKI):** "Krebs in Deutschland" report (open PDF/HTML) + interactive DB (open, aggregate) [^zfkd_db][^zfkd_lung]. **Research access** to record-level Scientific Use File + the nationwide clinical dataset (oBDS-RKI, 120+ vars incl. TNM/histology/treatment/course, from 2020) by **formal application** (`antrag-krebsdaten@rki.de`, ~3-month decision) [^zfkd_access][^obds_rki].
- **GEKID/DKR atlas:** open interactive incidence/mortality/5-yr survival by Bundesland; no stage/histology/treatment [^dkr].
- **Clinical Krebsregister + oBDS:** record-level longitudinal treatment/course via the **§65c bundeseinheitliches Antragsformular** (v2.0.1, live since 2025-04-01; TU-Dresden's natural counterpart is the Saxony Landeskrebsregister) [^p65c].
- **DKG / OnkoZert (certified Lungenkrebszentren):** open Jahresberichte + standalone **Qualitätsindikatoren Lungenkrebs 2025** (treatment rates, R0, tumor-board %, time-to-treatment) — ⚠ certified-centre selection bias [^dkg][^onkozert].
- **nNGM / CRISP:** German molecularly-tested aNSCLC cohorts — biomarker prevalence + testing rates; key papers open access [^nngm][^crisp].

**Clinical guidelines (probabilities + timing).**
- **S3-Leitlinie Lungenkarzinom, Version 5.1 (Juli 2026)** (AWMF 020-007OL; the final version — supersedes the Konsultationsfassung 5.01 of April 2026 that earlier drafts of this note cited) — authoritative German stage-specific therapy, prognosis, Nachsorge intervals [^s3].
- **Onkopedia** NSCLC (03/2026) & SCLC (09/2025) — epi, stage, therapy algorithms, follow-up tables [^onko_nsclc][^onko_sclc].
- **ESMO CPGs** — metastatic (oncogene-addicted & non-addicted), early/locally-advanced, SCLC — biomarker prevalence, follow-up cadence [^esmo_nona][^esmo_ona][^esmo_early][^esmo_sclc].
- **Cancer Council Victoria Optimal Care Pathway** — best single source for time-to-* targets (Australian proxy) [^ocp].

**International / proxy (flag explicitly).** SEER*Explorer (stage×histology×survival structure) [^seer]; CRUK (by-stage survival, smoking-attributable %) [^cruk]; GLOBOCAN/IARC (global sanity check) [^globocan]; pivotal trials FLAURA [^flaura], KEYNOTE-024 [^keynote]; screening NLST [^nlst] / NELSON [^nelson] / USPSTF [^uspstf].

---

## 4. Methodological approaches (how to turn data into parameters)

1. **Literature/guideline-based (v1, recommended).** Synthea's native authoring method — set each `distributed_transition`/`Delay` from the guideline/registry tables above and cite in `remarks` (Walonoski 2018 [^walonoski]).
2. **Registry-derived rule extraction (v2).** Verified German precedent: the **oBDS "Module Parser"** auto-converts oBDS-format registry tabulations into Synthea probabilities + Delay distributions by event frequency (Appenzeller et al., 2025 [^appenzeller]) — lung cancer is an in-scope oBDS entity; swap the entity. Needs the ZfKD/§65c data application.
3. **Process mining on DIZ event logs (v2).** Mine transition probabilities + timing from MII-FHIR extracts (van der Aalst [^vda]; Rojas et al. healthcare review [^rojas]); bonus: **conformance-check** the mined process against the MiHUB BPMN. Heaviest governance (DIZ Nutzungsordnung + ethics + Broad Consent); raw data **never** leaves the DIZ — only aggregate distributions.
4. **Calibration / validation (cross-cutting).** Generate → tabulate → assert against ZfKD/nNGM/OnkoZert benchmarks within tolerance (Chen 2019 [^chen]). ⚠ Validates *marginals*, not joint pathway structure; don't calibrate against the same numbers you used to set parameters without noting it.

---

## 5. Provenance how-to (keep two layers 1:1)

**Layer 1 — BPMN `synthea:` annotation** (the carrier). Per parameterized gateway/`Delay`, record, mirroring the sibling repo's `evidence.guideline_references` schema: the **value** (probabilities summing to 1.0, or a Delay min/max range); a **source array** `{source, version, section/table, recommendation_grade, evidence_level, url, accessedDate}`; a **`germanRelevance`** flag (`german-specific | european-proxy | international-proxy`); a **`confidence`** flag; and an **`illustrative`** boolean for read-from-source anchors. Reuse the sibling repo's exact version strings to avoid drift — for the final guideline that is `S3-LL Lungenkarzinom v5.1 (07/2026, AWMF 020-007OL)`; note that the sibling repo still carried the Konsultationsfassung string `S3-LL Lungenkarzinom v5.01 (04/2026, AWMF 020-007OL)` on 2026-09-07, so align the two when it moves to 5.1; encode timing with its `frequency_pattern` grammar (e.g. `Q3M-Y1-Y2;Q6M-Y3-Y5;Q12M-PostY5`).

**Layer 2 — GMF `remarks`** (the runtime artifact; ignored by the engine, used for provenance exactly as the shipped module does). On transpilation, emit each Layer-1 annotation as a compact citation line per branch, e.g.:
> `"Histology split NSCLC 0.85 / SCLC 0.15 — Onkopedia NSCLC 03/2026; ZfKD lung page 2023 (illustrative); german-specific; confidence high"`
> `"time-to-treatment 0–6 wk — Cancer Council Victoria OCP (≤6 wk of referral); AUSTRALIAN PROXY; confidence medium"`

**Glue:** give each annotated BPMN node a stable id, echo it in the remark, record the BPMN source commit + verification date in a module-level header remark, and reuse one benchmark table as *both* parameter source *and* CI calibration target. When a guideline updates, bump the Layer-1 version and **regenerate** Layer-2 — never hand-edit remarks out of sync.

---

## 6. Caveats
- **Plausibility, not precision** — anchors here are illustrative; pull exact values from the cited table at lock time.
- **Population mismatch** — ZfKD/GEKID = whole population (completeness lag, coding heterogeneity); nNGM/CRISP/MASTER = molecularly-tested advanced NSCLC (stage-IV/tested selection); OnkoZert/DKG = certified centres (best-practice, selection bias — temper with ZfKD); trials (FLAURA/KEYNOTE/NLST/NELSON) = fitter-than-real (optimistic survival).
- **German vs proxy** — prefer German for incidence/histology/stage/survival/biomarkers; OCP (timing), CRUK/SEER (stage-survival structure), trials (PFS/OS), NLST/NELSON (screening) are **flagged proxies** — never silently substitute.
- **Biomarker ethnicity dependence (high impact)** — EGFR ~38% East-Asian vs ~10–15% European; use European/German figures only, and model EGFR as conditional on histology × smoking, not a flat rate.
- **Registry time-lag & versioning** — ZfKD runs ~2 y behind; guidelines update; pin versions and plan a refresh.
- **Coverage gaps not fillable from registries** — chemo cycle intervals, RT fractionation, PFS-by-line, recurrence timing, and AE/toxicity (use S3/Onkopedia/ESMO + trials, flag trial-derived). **AP6/LDCT eligibility is now verified** against German law (LuKrFrühErkV §1–§2; live GKV program since 2026-04-01, §2a) and uses **pack-years + 25-year duration**, *not* "cigarette-years"; however **screening uptake has no observed national rate yet** — model it as a tunable parameter.
- **Version-string note** — live Onkopedia NSCLC showed "Stand April 2025" at verification while the sibling repo cites "03/2026"; keep the repo's string for consistency but re-confirm before final lock.
- **v2 hard boundary** — DIZ/registry microdata and event logs are privacy-sensitive: never in agent context or the repo; only aggregate distributions/fitted parameters leave the secure environment.

---

## References

[^walonoski]: Walonoski J, et al. Synthea: An approach, method, and software mechanism for generating synthetic patients… *JAMIA* 2018;25(3):230–238. doi:[10.1093/jamia/ocx079](https://doi.org/10.1093/jamia/ocx079).
[^chen]: Chen J, et al. The validity of synthetic clinical data: a validation study of Synthea using clinical quality measures. *BMC Med Inform Decis Mak* 2019;19(1):44. doi:[10.1186/s12911-019-0793-0](https://doi.org/10.1186/s12911-019-0793-0).
[^appenzeller]: Appenzeller A, et al. Automatic Extraction of Rules for Generating Synthetic Patient Data From Real-World Population Data (oBDS Module Parser; glioblastoma). arXiv:[2512.14721](https://arxiv.org/abs/2512.14721) (2025).
[^vda]: van der Aalst WMP. *Process Mining: Discovery, Conformance and Enhancement of Business Processes.* Springer.
[^rojas]: Rojas E, et al. Process mining in healthcare: a literature review. *J Biomed Inform* 2016;61:224–236. doi:[10.1016/j.jbi.2016.04.007](https://doi.org/10.1016/j.jbi.2016.04.007).
[^s3]: Leitlinienprogramm Onkologie (DKG, DKH, AWMF): S3-Leitlinie Prävention, Diagnostik, Therapie und Nachsorge des Lungenkarzinoms, **Version 5.1, Juli 2026** (AWMF-Registernummer 020-007OL) — final version; supersedes the Konsultationsfassung 5.01 (April 2026). [AWMF register 020-007OL](https://register.awmf.org/de/leitlinien/detail/020-007OL) (Langversion, Kurzversion and Leitlinienreport are linked from the register page).
[^onko_nsclc]: Onkopedia. Lungenkarzinom, nicht-kleinzellig (NSCLC). <https://www.onkopedia.com/de/onkopedia/guidelines/lungenkarzinom-nicht-kleinzellig-nsclc/@@guideline/html/index.html>.
[^onko_sclc]: Onkopedia. Lungenkarzinom, kleinzellig (SCLC). <https://www.onkopedia.com/de/onkopedia/guidelines/lungenkarzinom-kleinzellig-sclc/@@guideline/html/index.html>.
[^esmo_nona]: Hendriks LE, et al. ESMO CPG: non-oncogene-addicted metastatic NSCLC. *Ann Oncol* 2023;34(4):358–376. doi:[10.1016/j.annonc.2022.12.013](https://doi.org/10.1016/j.annonc.2022.12.013).
[^esmo_ona]: Hendriks LE, et al. ESMO CPG: oncogene-addicted metastatic NSCLC. *Ann Oncol* 2023;34(4):339–357. doi:[10.1016/j.annonc.2022.12.009](https://doi.org/10.1016/j.annonc.2022.12.009).
[^esmo_early]: Zer A, et al. ESMO CPG: early & locally advanced NSCLC. *Ann Oncol* 2025;36(11):1245–1262. doi:[10.1016/j.annonc.2025.08.003](https://doi.org/10.1016/j.annonc.2025.08.003).
[^esmo_sclc]: Dingemans A-MC, et al. ESMO CPG: SCLC. *Ann Oncol* 2021;32(7):839–853. doi:[10.1016/j.annonc.2021.03.207](https://doi.org/10.1016/j.annonc.2021.03.207).
[^ocp]: Cancer Council Victoria. Optimal Care Pathway for People with Lung Cancer. <https://optimalcarepathways.com.au/ocp-lc-about/>.
[^zfkd_db]: ZfKD (RKI). Interactive cancer database (Datenbankabfrage). <https://www.krebsdaten.de/Krebs/DE/Datenbankabfrage/datenbankabfrage_stufe1_node.html>.
[^zfkd_lung]: ZfKD (RKI). Lungenkrebs summary + Krebs in Deutschland 2021-2023 lung chapter (C33-C34). <https://www.krebsdaten.de/Krebs/DE/Content/Krebsarten/Lungenkrebs/lungenkrebs_node.html>.
[^zfkd_access]: ZfKD (RKI). Research data access (SUF + clinical oBDS-RKI dataset). <https://www.krebsdaten.de/Krebs/DE/Content/Forschungsdaten/Informationen_Antragstellung/info_antrag_node.html>.
[^obds_rki]: RKI. Bundesweiter klinischer Krebsregisterdatensatz (oBDS-RKI schema). <https://github.com/robert-koch-institut/Bundesweiter_klinischer_Krebsregisterdatensatz-Datenschema_und_Klassifikationen>.
[^p65c]: Plattform §65c — bundeseinheitliches Antragsformular (v2.0.1). <https://plattform65c.de/downloads-links/>.
[^dkr]: GEKID/DKR-Atlas. <https://www.dkr.de/dkr-atlas/index.html#/de>.
[^dkg]: DKG. Jahresberichte der zertifizierten Zentren. <https://www.krebsgesellschaft.de/unsere-themen/zertifizierung/jahresberichte-zertifizierter-zentren>.
[^onkozert]: OnkoZert. Qualitätsindikatoren Lungenkrebs 2025. <https://www.onkozert.de/system/lunge/>.
[^nngm]: nNGM. Publikationen + Treibermutationen; effectiveness study *Lancet Reg Health Eur* 2023, doi:[10.1016/j.lanepe.2023.100788](https://doi.org/10.1016/j.lanepe.2023.100788). <https://nngm.de/publikationen/>.
[^crisp]: Griesinger F, et al. CRISP Registry (AIO-TRK-0315). *Lung Cancer* 2021. doi:[10.1016/j.lungcan.2020.10.012](https://doi.org/10.1016/j.lungcan.2020.10.012) (PMID 33358484).
[^seer]: NCI SEER*Explorer. <https://seer.cancer.gov/statistics-network/explorer/overview.html>.
[^cruk]: Cancer Research UK — lung cancer survival by stage. <https://www.cancerresearchuk.org/health-professional/cancer-statistics/statistics-by-cancer-type/lung-cancer/survival>.
[^globocan]: Bray F, et al. GLOBOCAN 2022. *CA Cancer J Clin* 2024. doi:[10.3322/caac.21834](https://doi.org/10.3322/caac.21834); IARC Cancer Today <https://gco.iarc.who.int/today/>.
[^flaura]: FLAURA — osimertinib 1L EGFR NSCLC (PFS *NEJM* 2018 doi:10.1056/NEJMoa1713137; OS *NEJM* 2020 doi:[10.1056/NEJMoa1913662](https://doi.org/10.1056/NEJMoa1913662)).
[^keynote]: KEYNOTE-024 — pembrolizumab PD-L1≥50% (5-yr OS). *JCO* 2021. doi:[10.1200/JCO.21.00174](https://doi.org/10.1200/JCO.21.00174).
[^uspstf]: USPSTF. Lung Cancer Screening, 2021 (PMID 33687470). <https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening>.
[^nlst]: NLST extended follow-up. *J Thorac Oncol* 2019. <https://www.jto.org/article/S1556-0864(19)30473-3/fulltext>.
[^nelson]: de Koning HJ, et al. NELSON volume-CT screening. *NEJM* 2020. doi:[10.1056/NEJMoa1911793](https://doi.org/10.1056/NEJMoa1911793).
[^lukrfrueherkv]: Lungenkrebs-Früherkennungs-Verordnung (LuKrFrühErkV), 15 May 2024 — BGBl. I 2024 Nr. 162, under §84(2) StrlSchG, in force 2024-07-01. Eligibility §1–§2 (age 50–75; ≥15 pack-years + ≥25 years; quit <10 y; ≥12-month interval; CTDIvol ≤1.3 mGy). <https://www.gesetze-im-internet.de/lukrfr_herkv/> ([§1](https://www.gesetze-im-internet.de/lukrfr_herkv/__1.html) · [§2](https://www.gesetze-im-internet.de/lukrfr_herkv/__2.html)).
[^gba_kfe]: G-BA. Krebsfrüherkennungs-Richtlinie — Lungenkrebs-Screening (Beschluss 2025-06-18; routine GKV care from 2026-04-01; EBM GOPs per KBV 2026-03-19). <https://www.g-ba.de/themen/methodenbewertung/erwachsene/krebsfrueherkennung/lungenkrebs-screening/> · [PM #1316](https://www.g-ba.de/presse/pressemitteilungen-meldungen/1316/).
[^bfs84]: Bundesamt für Strahlenschutz. Wissenschaftliche Bewertung gemäß §84(3) StrlSchG — Niedrigdosis-CT-Lungenkrebsfrüherkennung (BfS-35-21, 2021). <https://www.bfs.de/SharedDocs/Pressemitteilungen/BfS/DE/2021/013.html>.
[^iqwig_s1902]: IQWiG. Lungenkrebsscreening mittels Low-Dose-CT — Abschlussbericht S19-02 (2020) + Rapid Report S23-02 (update). <https://www.iqwig.de/projekte/s19-02.html>.
[^hanse]: HANSE study (DZL; Großhansdorf / MHH Hannover / UKSH Lübeck). NELSON vs PLCOm2012 criteria in Germany; baseline stage distribution. *Lancet Oncol* 2025;26(12):1541–1551. [PMID 41232542](https://pubmed.ncbi.nlm.nih.gov/41232542/).

> **Biomarker prevalence detail:** Schildhaus et al. EGFR in S-German NSCLC (9.8%; never-smokers 24.4% vs 4.2%), *Br J Cancer* 2013; Zhang et al. EGFR meta-analysis (Europe 14.1% vs Asia 38.4%), *Oncotarget* 2016.
> **Sibling repo convention:** `evidence.guideline_references` + `frequency_pattern` grammar — `elements/follow-up/followUpInterval.yaml` in `mihub-lung-cancer-pathway-data-elements`.
