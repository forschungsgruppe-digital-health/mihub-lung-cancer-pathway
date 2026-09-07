# 0005 — Licensing of derived models

- Status: proposed — pending review by the TU Dresden Justiziariat (legal office). Nothing in this record is legal advice; every legal characterisation below is a question put to the Justiziariat, not a conclusion.
- Date: 2026-09-07
- Deciders: Forschungsgruppe Digital Health (FGDH), TU Dresden — final decision only after the Justiziariat's written opinion; agents draft, humans decide (`AGENTS.md`)
- Context: an audit of the source terms found that the repository (published CC BY 4.0, archived on Zenodo) contains models derived from gematik INA / Interop Council BPMNs whose published reuse note is attribution PLUS share-alike (linked licence: CC BY-SA 4.0), and that the README's statement that CraNE WP6 deliverables are "typischerweise CC BY 4.0" is unsupported.
- Relates: [`0002-versioning-and-release.md`](0002-versioning-and-release.md) (licence declared in `CITATION.cff` / `.zenodo.json`; release archive = Zenodo deposit; the 2026-09-05 decision to leave pre-1.0 Zenodo records as minted), [`0004-repo-structure-and-model-naming.md`](0004-repo-structure-and-model-naming.md) (the ten models as one published set).

## Context

### What the repository declares today

The whole repository is published under **CC BY 4.0**: `LICENSE` (CC BY 4.0 legal text), `README.md` § Lizenz ("Dieses Repository steht unter der Creative Commons Attribution 4.0 International (CC BY 4.0) Lizenz."), `CITATION.cff` (`license: CC-BY-4.0`), `.zenodo.json` (`"license": "cc-by-4.0"`), `package.json`, `AGENTS.md`, `DISCLAIMER.md` § 7. Four Zenodo version records carry `cc-by-4.0` (v0.2.1-rc.1 → 10.5281/zenodo.20943917, v0.2.1-rc.2 → 10.5281/zenodo.20945321, v0.3.0-rc.1 → 10.5281/zenodo.21029417, v0.4.0-rc.1 → 10.5281/zenodo.22327274; concept DOI 10.5281/zenodo.20943916). Every archive ships `models/`, `README.md`, `LICENSE`, `CITATION.cff`, `DISCLAIMER.md` and `docs/governance/` (ADR-0002, Decision 4). `CONTRIBUTING.md` has no inbound-licence clause; the model files were committed by FGDH staff (Susky, Scheel), with workshop input from AMED and the screening stakeholder workshops.

### Source 1 — gematik INA, Arbeitskreis "Fachanwender Journey Onkologie" (Interop Council)

Page: <https://www.ina.gematik.de/community-hub/vernetzen-mitwirken/arbeitskreise/fachanwender-journey-onkologie> (accessed 2026-09-07; HTTP 200; HTML title "Fachanwender Journey Onkologie | INA - Interoperabilitäts-Navigator"). Under the heading "BPMNs der verschiedenen Teiljourneys" the page states, verbatim (typos as published):

> Creative Commons: Diese BPMNs können mit Namensnennung ("Interop Council") unter den gleichen Bedinungen weitergeben werden.

The words "Creative Commons" are a hyperlink to <https://creativecommons.org/licenses/by-sa/4.0/> (raw HTML: `<a href="https://creativecommons.org/licenses/by-sa/4.0/" … title="Creative Commons">Creative Commons</a>`). This is the only Creative Commons name/version anywhere on ina.gematik.de (crawl of the legal pages, the Interop Council pages and 15 Arbeitskreis pages, 2026-09-07); the 13 downloadable `.bpmn` files (Camunda Web Modeler exports) contain no licence, author or attribution metadata; the Positionspapier, the Datenelemente xlsx and the GOLD whitepaper carry no licence statement at all. "Unter den gleichen Bedingungen" is the German name of the Creative Commons ShareAlike element (CC BY-SA 4.0 deed, de: "Weitergabe unter gleichen Bedingungen — Wenn Sie das Material remixen, verändern oder anderweitig direkt darauf aufbauen, dürfen Sie Ihre Beiträge nur unter derselben Lizenz wie das Original verbreiten.", <https://creativecommons.org/licenses/by-sa/4.0/deed.de>, accessed 2026-09-07). Under CC BY-SA 4.0 § 3(b) an Adapter's License must be BY-SA 4.0 (or later) or a CC-designated "BY-SA Compatible License" — currently only Free Art License 1.3 and GPLv3; CC BY 4.0 is not on that list (<https://creativecommons.org/compatible-licenses/>, accessed 2026-09-07).

Rights-holder picture (all from the INA site, accessed 2026-09-07): publisher is gematik GmbH (Impressum; site-wide "© gematik GmbH 2026"; Haftungsausschluss: copying is not permitted "ohne Genehmigung des Rechteinhabers (soweit nicht anders gekennzeichnet, ist dies die gematik GmbH)" — the CC note is such a marked exception); the BPMNs were authored by the external Arbeitskreis members in a shared Camunda account (meeting minutes; chair Prof. Dr. Sylvia Thun, deputy Uwe Lührig, ten members); "Interop Council" is the statutory expert body under § 385 SGB V / § 18 GIGV, not a legal person; the Interop Council resolutions of 06.12.2022 (set-up) and 11.08.2023 (closure) say nothing about licensing. The CC note is provably online from 2026-01-21 (earliest Wayback snapshot of the current URL); the repository's INA imports date from 2026-03-16/17 and 2026-04-28. No snapshot exists between 2023-05-30 and 2026-01-21 (archive gap).

The README (§ "INA Arbeitskreis Fachanwender Journey Onkologie (gematik)", added in commit 7aa94b2 on 2026-03-30 together with the CC BY 4.0 `LICENSE`) paraphrases this as attribution only — "Die Ergebnisse sind unter **Creative Commons** veröffentlicht und mit Nennung des **Interop Council** weiterzuverwenden." — and the attribution block names no licence, version or licence URL. The share-alike condition is reproduced nowhere in the repository.

### Source 2 — CraNE Joint Action WP6 (EU4Health, GA 101075284)

The README (§ "CraNE Joint Action – WP6") states: "CraNE-Ergebnisse werden im Rahmen des EU4Health-Programms zur offenen Nachnutzung bereitgestellt; EU-geförderte Veröffentlichungen unterliegen den Open-Access-Anforderungen der Europäischen Kommission (typischerweise **CC BY 4.0**)." This is unsupported (all accessed 2026-09-07): the WP6 page <https://crane4health.eu/wp6-organization-of-comprehensive-high-quality-cancer-care-in-comprehensive-cancer-care-networks-cccns/>, the pathway template <https://crane4health.eu/wp-content/uploads/2024/06/CraNE_WP6_Sub-Task-6.4.2._LungCancer_PatientPathway.pdf>, the 6.4.2 report and D6.4 <https://crane4health.eu/wp-content/uploads/2025/03/CraNE_WP6_D.6.4.-Patient-Pathway-Lung-Cancer.pdf> carry no licence or Creative Commons statement (site footer: "Copyright © 2022 CraNE, Funded by the European Union. Views and opinions expressed are however those of the author(s) only …"); the EU4Health Model Grant Agreement (v1.0 2021, v1.1 2022, v1.1 2024; <https://ec.europa.eu/info/funding-tenders/opportunities/docs/2021-2027/eu4h/agr-contr/mga_eu4h_en.pdf>) states in Art. 16.2 "The granting authority does not obtain ownership of the results produced under the action.", grants the EU a "royalty-free, non-exclusive and irrevocable licence" (Art. 16.3), imposes visibility and the disclaimer (Art. 17), and requires open licences only "Where the call conditions impose continuity or interoperability obligations" (Annex 5) — the public 2021 work programme shows no such condition for EU4H-2021-JA-03 *(the signed grant agreement and its Annex 5 selections were not seen — unverified)*. The only CC BY 4.0 CraNE output found is the 2025 JMIR Cancer article (a paper, not the deliverables).

Decisive for this ADR: the template and D6.4 are **FGDH's own work product** — cover page "Author(s): Lead authors: Dr. Peggy Richter, Emily Hickmann, Hannes Schlieter / Technische Universität Dresden / Contributor(s): Patient Pathway Working Group of WP6 / Date: 31.05.2024"; template footer "Developed by the WP6 Patient Pathway Working Group of CraNE | Date: 31.05.2024 / Contact: Peggy Richter (peggy.richter@tu-dresden.de), Research Group Digital Health, TUD Dresden University of Technology". The editable BPMN XML imported in commit 9aa1231 (2026-03-16, "Adds initial lung cancer pathways from CraNE project (english)") was never published by CraNE, consistent with FGDH holding the source files *(inference)*. The CraNE question is therefore an internal TU Dresden rights/consortium question (co-contributors of the WP6 working group, the non-public consortium agreement, TUD's status in GA 101075284 — all unverified), not a third-party CC licence. The "Standard for Lung Cancer Care" (Sub-Task 6.3.1) named in the README attribution is DKG-authored (PDF metadata), embeds DKG/ECC, OECI, ERS and iPAAC catalogues and carries no licence; the models reference it by number in element labels ("[LC SoS 1.2.3]") but derive structurally from the 6.4.2 template *(inference from the 1:1 file/page mapping)*.

### Which files are affected (element-ID evidence, git history; re-verified 2026-09-07)

| Model (`models/…`) | Derivation | Evidence |
|---|---|---|
| `lung-cancer-palliative-care-pathway` | **INA file-level copy** | first commit 159a9dc (2026-04-28) = full import of INA `palliativmedizin.bpmn` (60/60 flow-element IDs identical); today ~47 of 180 flow IDs still INA after extension from 9 to 26 tasks; `clinical-sources.md` lists no source (gap) |
| `lung-cancer-molecular-tumor-board-pathway` | **INA file-level copy** (via the "CraNE" first commit) | 23/41 flow IDs shared with INA `molekulares-tumorboard.bpmn`; current file still carries INA process id `Process_e2faa7c4-7c7e-4408-82ce-89d081ca8a1b` and Camunda `diagramRelationId 8f6a5808-…` |
| `lung-cancer-tumor-board-pathway` | INA partial + CraNE template | 6/31 flow IDs shared; INA process id present in commit 9aa1231, since renamed |
| `lung-cancer-diagnostic-pathway`, `-patient-consultation-`, `-overarching-`, `-treatment-` | CraNE template + INA concept/label level | orange delta markers (`bioc:stroke="#ff9200"`, commit d1a0b43 2026-03-17 "Highlights (orange) the delta between CraNE and Interop Council pathway": 10 / 8 / 8 / 5 elements; MTB 4, TB 7 — 42 in total); verbatim INA labels ("Anamnese", "Vorbereitung", "Überweisung", "Bronchoskopie", "Hausärztliche/Fachärztliche Praxis"); 0 shared IDs |
| `lung-cancer-initial-entry-pathway`, `-screening-`, `-aftercare-` | **FGDH-original** | 0 shared IDs with any INA file, no orange marker, no CraNE import; sources S3 guideline chap. 6 / LuKrFrühErkV + workshops / AMED workshop cycle |

FGDH-original non-model content: `docs/governance/` (acceptance-test instrument, authors Susky/Scheel/Schlieter, front matter `lizenz: "CC BY 4.0"`), `tools/`, `skills/`, `.github/` (no licence headers; covered only by the root `LICENSE`).

### Options considered

- **A** — relicense `models/` to CC BY-SA 4.0, keep `docs/governance/` CC BY 4.0, tooling MIT (single licence per artifact class).
- **B** — obtain written clarification/permission from gematik / the Arbeitskreis (and internal CraNE confirmation); keep CC BY 4.0 only if granted.
- **C** — per-file segmentation (INA-lineage models BY-SA, FGDH-original models BY, REUSE-style map).
- **D** — keep CC BY 4.0 everywhere and document the risk.
- **E** — clean-room remodelling of the INA-derived content during the planned remodelling (#49).

Trade-offs are recorded in the decision brief handed to the Justiziariat (2026-09-07); in short: A is correct under every answer to the open legal questions and needs no third party; B resolves the root uncertainty but has unknown calendar time; C is precise but makes the maintainer draw Adapted-Material lines per file and does not fit Zenodo's single licence field; D is hard to defend given file-level copies; E cannot repair already-archived versions.

## Decision

All decisions below are **proposed** and take effect only after the Justiziariat's written opinion (Open items, Q1–Q13). Until then the repository's licence declarations are frozen (Decision 4).

### Decision 1 — Correct the source statements now (factual, no legal determination)

`README.md` § "Vorarbeiten und Grundlagen" quotes the INA reuse note verbatim (with the typos), names the licence the note links to (CC BY-SA 4.0, <https://creativecommons.org/licenses/by-sa/4.0/>), gives the access date, and states that the applicability of the share-alike condition to the derived models is under legal review. The sentence "typischerweise CC BY 4.0" about CraNE is removed; the CraNE attribution names the actual work (Lung Cancer Patient Pathway Template for CCCNs, Sub-Task 6.4.2 / D6.4, 31.05.2024, WP6 Patient Pathway Working Group, lead authors Richter, Hickmann, Schlieter — TU Dresden), keeps the EU4H disclaimer mandated by MGA Art. 17.3, and states that the terms are being confirmed within FGDH/TU Dresden and the CraNE consortium. `models/README.md` gains a per-model provenance table (INA file-level / INA label-level / CraNE template / FGDH-original); `docs/governance/clinical-sources.md` records INA `palliativmedizin.bpmn` as the source of the palliative model. The INA-derived files, their element IDs and the orange delta markers are kept unchanged as provenance evidence.

### Decision 2 (proposed) — Licence layout by artifact class

Subject to the Justiziariat's confirmation of Q1–Q5:

- **`models/` (all ten models, the citable dataset): CC BY-SA 4.0.** Rationale: the INA note requires "unter den gleichen Bedingungen" and links CC BY-SA 4.0; three models contain file-level copies and four more contain declared INA-derived elements; a single licence for the model set keeps the dataset citable, matches Zenodo's single licence field and the fact that the overarching model links five sub-models. BY-SA is also correct if the reuse is later found not to be Adapted Material. *Fallback (Option C) if the Justiziariat requires the FGDH-original models to stay CC BY: `initial-entry`, `screening`, `aftercare` CC BY 4.0, the seven INA/CraNE-lineage models CC BY-SA 4.0, recorded per file in a REUSE layout.*
- **`docs/governance/` (acceptance-test instrument) and the other documentation: CC BY 4.0** (FGDH-original; unchanged).
- **`tools/`, `skills/`, `.github/` (code): MIT** — optional tidy-up (Creative Commons advises against CC licences for software); may be deferred without affecting Decision 2's core.

Attribution for the INA-derived models follows CC BY-SA 4.0 § 3(a): creator/attribution party "Interop Council" (as required by the note) with the INA URL, the licence name and URI, and an indication of the modifications (translation, restructuring, extension; orange markers). The exact string is to be confirmed by the Justiziariat (Q9) and, if answered, by gematik (Decision 3).

### Decision 3 (proposed) — Clarification requests run in parallel, do not gate Decision 2

- **gematik / Arbeitskreis:** a Justiziariat-drafted or -approved enquiry to gematik GmbH (publisher per Impressum) with copy to the Arbeitskreis chair asks to confirm the licence (CC BY-SA 4.0 per link), the licensor, the required attribution, and whether a CC BY 4.0 permission or share-alike waiver can be granted for this repository. A granted permission is recorded here as a dated amendment and may lead to a later re-licensing back to CC BY 4.0.
- **CraNE (internal):** written confirmation from the D6.4 lead authors (FGDH) that the template and its BPMN source may be published as adapted models under CC BY(-SA) 4.0; the TU Dresden EU/research office checks the CraNE consortium agreement and TUD's role in GA 101075284 for consent requirements of co-contributors (DKG as WP6 lead, NIJZ as coordinator, the WP6 working group).

### Decision 4 — Freeze until the opinion arrives

Until the Justiziariat's written opinion: no change to `LICENSE`, `CITATION.cff` `license`, `.zenodo.json` `license`, badges, `package.json` `license`; no release, tag or Zenodo action; no edit of existing Zenodo records; no removal, renaming or rewriting of INA element IDs, process ids or orange markers; no licence headers inside `.bpmn` files (agents never edit models; the moddle roundtrip gate); no self-drafted legal correspondence to gematik or CraNE partners. Only Decision 1 (factual corrections) and this ADR are applied now.

### Decision 5 (proposed) — Execution of the relicensing

When confirmed: one PR into `dev` that adds the CC BY-SA 4.0 legal text (`LICENSE`) and keeps the CC BY 4.0 text (`LICENSE-CC-BY-4.0`, or a REUSE `LICENSES/` directory with `REUSE.toml` path globs), rewrites `README.md` § Lizenz as a licence table with the reasons and this ADR, updates the badge and the attribution string, sets `CITATION.cff` `license: CC-BY-SA-4.0` and `.zenodo.json` `"license": "cc-by-sa-4.0"` plus a `notes` sentence naming the instrument's CC BY 4.0, updates `AGENTS.md`, `.github/copilot-instructions.md`, `DISCLAIMER.md` (intro, § 4, § 7 — "Section 5 of the applicable CC licence"), `models/README.md`, and this ADR (status → accepted, dated marker with the opinion's reference). The existing `citation-validate.yml` sync check needs no change (ids compared lower-cased). Commit `docs(license)!: relicense models/ to CC BY-SA 4.0 (ADR-0005)` with a BREAKING CHANGE footer; the next release carries the new licence to a new Zenodo version DOI. Documented consent of the FGDH rights holders (Susky, Scheel, Fleischer; Schlieter as group lead) precedes the merge; `CONTRIBUTING.md` gains an inbound-licence sentence if the Justiziariat asks for one.

## Consequences

- Reusers of the models must apply share-alike to adaptations (Synthea GMF modules derived from the BPMN, a FHIR PlanDefinition/IG rendering, an adapted institutional pathway); mere use, citation and collections are not affected. FGDH can still grant separate permissions for its original models, not for INA-derived content. The data-elements sister repository (content, not adaptation) is not affected *(assessment, Q12)*.
- The four archived Zenodo versions remain labelled `cc-by-4.0`; whether their metadata must be corrected or a note in the next record suffices is Q8 (the 2026-09-05 decision of ADR-0002 leaves pre-1.0 records as minted). Zenodo's ability to edit a published record's licence is unverified.
- README, CITATION and Zenodo attribution strings change ("Lizenz: CC BY-SA 4.0"); the licence badge changes; downstream FGDH artefacts that already reference "CC BY 4.0" for the models must be updated.
- The provenance evidence (INA IDs, orange markers, git history) is preserved deliberately; the planned remodelling (#49) adds in-file provenance annotations (modeller task) and may pursue the clean-room path for the WIP palliative model.
- Documentation errors of the README (INA paraphrase, CraNE CC BY claim, missing palliative source) are corrected regardless of the legal outcome.
- The repository gains an explicit statement of which parts are FGDH-original (instrument, tooling, initial-entry/screening/aftercare) — useful for any later permission request.

## Open items

Questions for the Justiziariat (answers to be recorded here as dated amendments):

1. Q1 — Is the hyperlink to CC BY-SA 4.0 an operative licence grant, or does only the visible sentence govern (which speaks of "weitergeben", not of adaptation)?
2. Q2 — Which reused elements are protected subject matter (§ 2 / § 87a UrhG) and which of the ten models are "Adapted Material" under CC BY-SA 4.0 § 1(a) — file-level copies (palliative, MTB) vs sub-structures vs short labels?
3. Q3 — Who holds the rights in the INA BPMNs (gematik GmbH, the Arbeitskreis authors, the statutory Interop Council), and can FGDH rely on the CC note if it was placed without authority? Does the archive gap (note provable from 2026-01-21) matter?
4. Q4 — Consequences of the current CC BY 4.0 declaration on possibly Adapted Material (§ 3(b), automatic termination § 6(a), cure § 6(b) within 30 days, § 97 UrhG exposure)?
5. Q5 — Who inside TU Dresden may relicense the FGDH works (§ 43 UrhG vs academic freedom; OA policy); must contributor consent be documented; do workshop participants hold co-authorship?
6. Q6 — CraNE: TU Dresden's status in GA 101075284, the consortium agreement's rules on results/dissemination, consent requirements of DKG/NIJZ/the WP6 working group, and whether the call conditions triggered the Annex 5 open-licence duty *(all unverified)*.
7. Q7 — "Standard for Lung Cancer Care" (DKG, no licence): are the "[LC SoS x.y.z]" label references citation or reproduction; should the README attribution keep naming it?
8. Q8 — Must the licence metadata of the four published Zenodo records be corrected, or may they stay as minted with a note in the next record?
9. Q9 — Confirm or dictate the attribution string that satisfies CC BY-SA 4.0 § 3(a) for "Interop Council".
10. Q10 — Does "Diese BPMNs" cover the PNG renders and hence the repository's SVG renders of the derived models?
11. Q11 — Is an enquiry to gematik advisable before relicensing, with which wording and sender?
12. Q12 — Which downstream FGDH artefacts count as adaptations (BY-SA) versus use/collections?
13. Q13 — Is MIT for `tools/`, `skills/`, `.github/` acceptable and does it need the same consent round?

Human actions no agent performs: sending the decision brief (maintainer); the gematik enquiry (Justiziariat drafts/approves, maintainer sends); the internal CraNE confirmation (maintainer + group lead); contributor consent (Susky, Scheel, Fleischer, Schlieter); the release and any Zenodo edit (maintainer); provenance annotations inside the models (modellers).

Unverified assumptions marked in this record: that the editable CraNE BPMN source is FGDH-held; that TU Dresden is a CraNE beneficiary/affiliated entity; that the call conditions imposed no open-licence obligation; that Zenodo allows post-publication licence edits; that the repository's models derive from the 6.4.2 template rather than the 6.3.1 standard; that no INA licence wording differing from today's existed between August 2023 and January 2026.

> Amendments: never rewrite an accepted ADR — add a dated marker in place
> (`*(status YYYY-MM-DD: …)*`, `**Amended YYYY-MM-DD:** …`, `*[Corrected YYYY-MM-DD: …]*`,
> `**Decision YYYY-MM-DD — …**`) and update "Last amendment" in [`README.md`](README.md).