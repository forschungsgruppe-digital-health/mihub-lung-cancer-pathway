<!--
Repo-Pfad-Vorschlag: docs/governance/abnahme-checkliste-bpmn-patientenpfad.md
Begleitdokument (Begründung + Beispiele): abnahme-handout-bpmn-patientenpfad.md
-->

---
titel: "Abnahmetest-Checkliste für BPMN-modellierte Patientenpfade"
kurztitel: "BPMN-CP-Abnahmetestinstrument"
version: "0.3.1"
status: "Vorgeschlagenes Artefakt (DSR) – konzeptionell aus Kerntheorien abgeleitet, noch nicht empirisch validiert"
sprache: "DE"
autor: "[Nachname, Initiale]"
affiliation: "[Einrichtung]"
orcid: "[ORCID]"
lizenz: "CC BY 4.0"
persistent_id: "[DOI/Zenodo nach Hinterlegung]"
zielgruppe: "klinische und technische Stakeholder; auch Modellierungsanfänger:innen"
---

# Abnahmetest-Checkliste für BPMN-modellierte Patientenpfade (v0.3.1)

## Zitationsvorschlag

> [Nachname, Initiale] ([Jahr]). *Abnahmetest-Checkliste für BPMN-modellierte Patientenpfade* (Version 0.3) [Evaluationsinstrument]. [Einrichtung]. [DOI].

Bei Verwendung in einer Publikation bitte zusätzlich die im Konstrukt-Quellen-Mapping (§4) genannten Kernquellen zitieren.

---

## 1. Zweck und Geltungsbereich

Das Instrument unterstützt den **strukturierten, nachvollziehbaren Abnahmetest (Freigabe)** eines in BPMN modellierten Patientenpfads durch **klinische** und **technische** Stakeholder. Es ist als kompaktes Bewertungsraster (Items mit dichotomer/teils kriterienbasierter Prüfung) konzipiert und für intersektorale, onkologische Versorgungspfade erprobt formuliert; die Items sind domänenunabhängig übertragbar.

## 2. Methodische Herleitung (Transparenz)

Die Items wurden **konzeptionell** aus etablierten Kerntheorien („kernel theories" i. S. v. Hevner et al. 2004) dreier Stränge synthetisiert und einander zugeordnet:

1. **Generische konzeptuelle Modellqualität** — Guidelines of Modeling (Becker et al. 1995), SEQUAL (Lindland et al. 1994; Krogstie et al.), 7PMG (Mendling et al. 2010).
2. **Klinische Pfadvalidität** — operationale Pfaddefinition nach Kinsman et al. (2010); domänenspezifische Modellierungskonzepte nach BPMN4CP (Braun et al. 2014).
3. **Technische Korrektheit/Ausführbarkeit** — Konformitätsklassen der OMG BPMN-2.0-Spezifikation; Soundness-Begriff (van der Aalst; operationalisiert bei Fahland et al. 2011).

Die Abnahmetest-Logik folgt der Unterscheidung **Verifikation vs. Validierung** und der SEQUAL-Trennung pragmatischer Qualität nach *sozialer* (klinischer) und *technischer* Adressatengruppe. Das Instrument versteht sich als DSR-Artefakt; Positionierung und vorgesehene Evaluation siehe §6.

**Einschränkung.** Diese Version ist eine theoriegeleitete Konstruktion. Eine empirische Validierung (Inhaltsvalidität, Reliabilität, Anwendbarkeit) steht aus (§6).

---

## 3. Das Instrument

**Lesehilfe.** **Muss** = K.-o.-Kriterium · **Soll** = wichtig, Abweichung dokumentieren. **Prüfmethode:** **A** = automatisch (Tool) · **R** = Sichtprüfung im Review · **K** = Konsens. Hake ab: `[x]` erfüllt · `[ ]` offen. Fachbegriffe siehe Mini-Glossar (§8).

### A. Verständlichkeit & technische Korrektheit — *technischer Abnahmetest*

- [ ] **SYN-1** Der BPMN-**Sprachumfang (Conformance-Klasse)** ist deklariert und eingehalten. 👉 *konkret:* Descriptive/Analytic/Common Executable benannt; nur deren Elemente genutzt. *(Muss · A)*
- [ ] **SYN-2** **Genau ein Start- und ein End-Event** je Ebene. 👉 *konkret:* mehrere Enden nur begründet. *(Muss · A/R)*
- [ ] **SYN-3** Aktivitäten als **Verb + Objekt**. 👉 *konkret:* „Histologie befunden" statt „Histologie". *(Soll · R)*
- [ ] **SYN-4** Kein Diagramm überladen (**≤ 50 Symbole**); große Pfade dekomponiert. 👉 *konkret:* via Call Activity auslagern. *(Soll · A)*
- [ ] **SYN-5** **Sauber gepaarte** Verzweigungen, geringer Knotengrad, **kein OR-Gateway**. 👉 *konkret:* Split/Join gleichen Typs (wie Klammern). *(Soll · A/R)*
- [ ] **STR-1** **Jeder Durchlauf kann das Ende erreichen** (keine Sackgasse). *(Muss · A)*
- [ ] **STR-2** **Am Ende keine offenen Parallelzweige.** *(Muss · A)*
- [ ] **STR-3** **Keine toten/unerreichbaren Aktivitäten.** *(Muss · A)*
- [ ] **STR-4** **Kein Deadlock/Livelock** (Gateway-Typen korrekt gepaart). *(Muss · A)*

### B. Klinische Inhaltsvalidität — *klinischer Abnahmetest*

- [ ] **SEM-1** **Multidisziplinär**: alle beteiligten Disziplinen als Lane sichtbar. *(Muss · R)*
- [ ] **SEM-2** **Leitlinien-/Evidenzbezug** bei wichtigen Schritten vermerkt (z. B. S3-LL / nNGM). *(Soll\* · R)*
- [ ] **SEM-3** **Wesentliche Behandlungsschritte** vollständig (inkl. Restaging, Nachsorge). *(Soll\* · R)*
- [ ] **SEM-4** Übergänge an **Fristen/Kriterien** geknüpft. *(Soll\* · R)*
- [ ] **SEM-5** **Zielpopulation/Standardisierung** abgegrenzt. *(Soll\* · R)*
- [ ] **SEM-6** **Face Validity**: mit Fachexpert:innen iterativ bis Konsens validiert. *(Muss · K)*
- [ ] **SEM-7** Relevante **Domänen-Artefakte** (Ressourcen, Dokumente, Qualitätsindikatoren) erfasst. *(Soll · R)*

> **Kinsman-Gate (Muss):** SEM-1 **und** ≥ 3 von 4 aus {SEM-2…SEM-5}.

### C. Verständlichkeit für beide Seiten — *gemeinsamer Abnahmetest*

- [ ] **PRA-1** Klinik- und IT-Seite **verstehen das Modell gleich** (gemeinsamer Walkthrough). *(Muss · R)*
- [ ] **PRA-2** **Übersichts- und technische Detailsicht** vorhanden. *(Soll · R)*
- [ ] **PRA-3** **Relevanz**: keine überflüssigen Elemente. *(Soll · R)*

### Abnahmetest-Gates

| Gate | Bedingung | Methode |
|---|---|---|
| Technisch | alle Muss in A (SYN-1, SYN-2, STR-1…4) | A + R |
| Klinisch | Kinsman-Gate **und** SEM-6 | R + K |
| Pragmatisch | PRA-1 | R |

**Gesamtabnahmetest** nur bei allen drei Gates. Offene Soll-Punkte im Sign-off mit Maßnahme/Frist dokumentieren.

---

## 4. Konstrukt-Quellen-Mapping (Traceability)

| ID | Konstrukt / Qualitätsdimension | Kern-Quelle(n) |
|---|---|---|
| SYN-1 | Sprachkonformität (syntaktisch) | OMG BPMN 2.0 / ISO/IEC 19510 |
| SYN-2 | Syntaktische Qualität, Modellgüte | Mendling et al. 2010 (G3); Lindland et al. 1994 |
| SYN-3 | Label-Eindeutigkeit (pragmatisch) | Mendling et al. 2010 (G6) |
| SYN-4 | Größe/Komplexität → Fehlerrisiko | Mendling et al. 2010 (G7) |
| SYN-5 | Strukturiertheit, Routing | Mendling et al. 2010 (G2/G4/G5) |
| STR-1…4 | Soundness (semantisch/technisch) | van der Aalst; Fahland et al. 2011 |
| SEM-1 | Multidisziplinarität (Pfaddefinition) | Kinsman et al. 2010 (Krit. 1); Braun et al. 2014 |
| SEM-2 | Evidenz-/Leitlinienrückbindung | Kinsman et al. 2010 (Krit. 2) |
| SEM-3 | Vollständigkeit der Schritte | Kinsman et al. 2010 (Krit. 3) |
| SEM-4 | Kriterienbasierte Progression | Kinsman et al. 2010 (Krit. 4) |
| SEM-5 | Standardisierung/Population | Kinsman et al. 2010 (Krit. 5) |
| SEM-6 | Semantische Validität (Face Validity) | Lindland et al. 1994; Benevento et al. 2023 |
| SEM-7 | Domänenspezifische Konzepte | Braun et al. 2014 |
| PRA-1 | Pragmatische Qualität (dual audience) | Lindland et al. 1994; Krogstie et al. |
| PRA-2 | Stakeholderspezifische Perspektiven | Braun et al. 2014 |
| PRA-3 | Relevanz | Becker et al. 1995; Mendling et al. 2010 (G1) |

---

## 5. Anwendungs-/Reuse-Hinweis

Das Instrument ist unter CC BY 4.0 frei verwend- und adaptierbar. Bei Anpassung (z. B. andere Indikation) sollten geänderte/ergänzte Items als Abweichung von dieser Version (0.3) gekennzeichnet werden, um Vergleichbarkeit zu wahren.

## 6. Vorgesehene Evaluation (DSR-Positionierung)

Geplant ist eine **formativ → summative** Evaluationstrajektorie i. S. v. FEDS (Venable et al. 2016), Methodenwahl nach Prat et al. (2015):

1. **Inhaltsvalidierung (formativ, artifiziell):** Expert:innen-Panel (klinisch + technisch), Lawshe-CVR/CVI je Item; Items unterhalb des kritischen CVR werden überarbeitet/entfernt.
2. **Verständlichkeit/Usability (formativ):** Cognitive Walkthrough / Think-aloud mit Modellierungsanfänger:innen.
3. **Reliabilität & Kriteriumsvalidität (summativ, naturalistisch):** Anwendung auf reale Pfade; Interrater-Reliabilität (Cohen-/Fleiss-Kappa) zwischen unabhängigen Reviewer:innen; Abgleich mit Experten-Goldstandard.
4. **Akzeptanz/Nutzen (summativ):** kontrollierter Vergleich (mit vs. ohne Instrument) hinsichtlich Defekterkennung und wahrgenommenem Nutzen (Method Evaluation Model, Moody 2003 / UTAUT-Items).

---

## 7. Referenzen

**Konstrukt-/Kernquellen (in dieser Arbeit auf Quellenebene abgeglichen):**

- Becker, J.; Rosemann, M.; Schütte, R. (1995): Grundsätze ordnungsmäßiger Modellierung. *Wirtschaftsinformatik* 37(5), 435–445.
- Lindland, O. I.; Sindre, G.; Sølvberg, A. (1994): Understanding quality in conceptual modeling. *IEEE Software* 11(2), 42–49. (Erweiterung: Krogstie, J.; Lindland, O. I.; Sindre, G. 1995; Krogstie 2006.)
- Mendling, J.; Reijers, H. A.; van der Aalst, W. M. P. (2010): Seven process modeling guidelines (7PMG). *Information and Software Technology* 52(2), 127–136.
- Kinsman, L.; Rotter, T.; James, E.; Snow, P.; Willis, J. (2010): What is a clinical pathway? Development of a definition to inform the debate. *BMC Medicine* 8:31.
- Object Management Group (2011): *Business Process Model and Notation (BPMN) Version 2.0* (entspr. ISO/IEC 19510:2013).
- Fahland, D.; Favre, C.; Koehler, J.; Lohmann, N.; Völzer, H.; Wolf, K. (2011): Analysis on demand: Instantaneous soundness checking of industrial business process models. *Data & Knowledge Engineering* 70, 448–466.
- Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2014): BPMN4CP: Design and implementation of a BPMN extension for clinical pathways. *Proc. IEEE Int. Conf. on Bioinformatics and Biomedicine (BIBM)*, 9–16. — Revised: Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2016): BPMN4CP Revised – Extending BPMN for Multi-perspective Modeling of Clinical Pathways. *49th Hawaii Int. Conf. on System Sciences (HICSS)*, 3249–3258, DOI 10.1109/HICSS.2016.407.
- Benevento, E. et al. (2023): Process Modeling and Conformance Checking in Healthcare: A COVID-19 Case Study. In: *Process Mining Workshops*, Springer (LNBIP).

**Methodische Referenzen (Standardliteratur; Zitationsdetails vor Einreichung final prüfen — im Thread quellenverifiziert: Venable et al. 2016, Prat et al. 2015, Lawshe 1975):**

- Hevner, A. R.; March, S. T.; Park, J.; Ram, S. (2004): Design Science in Information Systems Research. *MIS Quarterly* 28(1), 75–105.
- Peffers, K.; Tuunanen, T.; Rothenberger, M. A.; Chatterjee, S. (2007): A Design Science Research Methodology for Information Systems Research. *JMIS* 24(3), 45–77.
- Venable, J.; Pries-Heje, J.; Baskerville, R. (2016): FEDS: A Framework for Evaluation in Design Science Research. *European Journal of Information Systems* 25(1), 77–89.
- Prat, N.; Comyn-Wattiau, I.; Akoka, J. (2015): A Taxonomy of Evaluation Methods for Information Systems Artifacts. *JMIS* 32(3), 229–267.
- Sonnenberg, C.; vom Brocke, J. (2012): Evaluations in the Science of the Artificial. In: *DESRIST*, LNCS 7286, 381–397.
- Lawshe, C. H. (1975): A Quantitative Approach to Content Validity. *Personnel Psychology* 28(4), 563–575.

## 8. Mini-Glossar (für Einsteiger:innen)

| Begriff | In einem Satz |
|---|---|
| **Aktivität** | Arbeitsschritt; abgerundetes Rechteck. |
| **Event** | Ereignis; Kreis (Start = dünn, Ende = dick). |
| **Gateway** | Verzweigung; Raute. XOR = entweder/oder, AND = parallel, OR = eines *oder mehrere* (meiden). |
| **Lane / Pool** | „Schwimmbahn": zeigt, wer den Schritt macht. |
| **Token** | Gedachte Spielfigur, die den Pfeilen folgt (zum „Durchspielen"). |
| **Soundness** | Keine logischen Sackgassen, blockierten oder unerreichbaren Stellen. |
| **Call Activity** | Schritt, der auf ein ausgelagertes Teilmodell verweist. |
| **Conformance-Klasse** | Vereinbarter BPMN-Sprachumfang: Descriptive < Analytic < Common Executable. |

## 9. Changelog

- **v0.3.1** — BPMN4CP-Referenz präzisiert: Revised = HICSS 2016 (S. 3249–3258, DOI 10.1109/HICSS.2016.407); BIBM-2014- und HICSS-2016-Fassung getrennt zitiert.
- **v0.3** — Publikationsfähige Instrumentfassung: Front matter, Herleitungsnotiz, Konstrukt-Quellen-Mapping, Evaluationsplan, Referenzen, Lizenz/Zitation.
- **v0.2** — Anfängertauglichkeit (Glossar, Prüffragen), Volltext-Abgleich der Kernquellen.
- **v0.1** — Erststruktur (Dimensionen, Gates, Sign-off).

---

*Begründung und je ein Beispiel pro Item: `abnahme-handout-bpmn-patientenpfad.md`. Status der Quellenprüfung dort dokumentiert.*
