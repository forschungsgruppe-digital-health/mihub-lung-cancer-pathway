# Modelle / Models

BPMN-2.0-Modelle des Lungenkrebs-Patientenpfads. Namenskonvention:
`lung-cancer-<phase>-pathway.{bpmn,svg}` (kebab-case; [ADR-0004](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0004-repo-structure-and-model-naming.md);
in der CI als eigener blockierender Schritt geprüft mit `npm run check:naming`). Jede `.bpmn`-Quelle hat eine zugehörige
`.svg`-Visualisierung gleichen Namens.

Die Spalten **Umfang** und **Rollen** sind aus den Start-/Endereignissen bzw. den Pool-/Lane-Namen der `.bpmn`-Dateien
abgelesen (Stand 2026-09-07); **Status** nennt das offene Konformitäts-Issue je Modell (Konformitäts-Gate vom 2026-09-04,
Sammel-Issue [#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49)) und das
Soundness-Urteil (STR-1…4, beratend); **Quellen** verweist auf die Zeile des Modells in
[`docs/governance/clinical-sources.md`](../docs/governance/clinical-sources.md).

| Modell (`models/…`) | Phase | Umfang (Start → Ende) | Rollen (Pools/Lanes) | Status | Quellen |
|---|---|---|---|---|---|
| `lung-cancer-overarching-pathway` | Übergreifend | Personen mit hohem Risiko für Lungenkrebs / Patient mit Symptomen / Patient mit histologisch gesichertem Lungenkrebs → Ende der Versorgung | Pool „Vorlage Patientenpfad für Lungenkrebs“; Rollen noch nicht modelliert (Lane „TODO: Rollen abbilden“) | Modell vorhanden; Konformitäts-Gate offen ([#78](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/78): 27 blockierende Befunde; Soundness INCONCLUSIVE) | CraNE WP6 / INA (LC-SoS-Referenzen) — [Quellen](../docs/governance/clinical-sources.md) |
| `lung-cancer-initial-entry-pathway` | Initialer Einstieg | Symptome bemerkt / Zufallsbefund erhalten → Ins klinische Setting verwiesen / Abklärung abgeschlossen | Pools „Versicherte / Betroffene Person“, „Allgemein-/ Innere Medizin / Zuweiser“, „Radiologie“ (ohne Lanes) | Modell vorhanden; Konformitäts-Gate offen ([#89](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/89): 0 blockierende Befunde, 4 beratende; Soundness VIOLATION) | S3-Leitlinie Lungenkarzinom, Kap. 6 — [Quellen](../docs/governance/clinical-sources.md) |
| `lung-cancer-screening-pathway` | Krebsfrüherkennung | Aufforderung zum LKS erhalten / Aus Eigeninitiative an LKS interessiert → Screening beendet / Überweisung zur weiteren Behandlung wird nachgegangen | Pools „Versicherte / Zu untersuchende Person“, „Arbeitsmedizin / Allgemeinmedizin / Innere Medizin“, „Radiologische Praxis / Klinik“ (Lanes „Erstbefunder (Radiologe)“, „Zweitbefunder (Radiologe)“) | Modell vorhanden; Konformitäts-Gate offen ([#79](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/79): 0 blockierende Befunde, 3 beratende; Soundness VIOLATION) | LuKrFrühErkV, G-BA, Workshops 1/2 — [Quellen](../docs/governance/clinical-sources.md) |
| `lung-cancer-diagnostic-pathway` | Diagnostik | Beginn der Staging-Diagnostik → Ende der Staging-Diagnostik | Pool „Staging“; die Pools „Hausärztliche Praxis“ und „Fachärztliche Praxis“ sind leere Platzhalter (siehe [#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49)) | Modell vorhanden; Konformitäts-Gate offen ([#80](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/80): 24 blockierende Befunde; Soundness VIOLATION) | CraNE WP6 / INA (LC SoS 2.2); S3-Umarbeitung auf Branch — [Quellen](../docs/governance/clinical-sources.md) |
| `lung-cancer-patient-consultation-pathway` | Patientengespräch | Termin für das Patientengespräch → Ende des Patientengesprächs | Pool „Patientengespräch“; die Pools „Hausärztliche Praxis“ und „Fachärztliche Praxis“ sind leere Platzhalter (siehe [#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49)) | Modell vorhanden; Konformitäts-Gate offen ([#81](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/81): 10 blockierende Befunde; Soundness INCONCLUSIVE) | CraNE WP6 / INA (LC-SoS-Referenzen) — [Quellen](../docs/governance/clinical-sources.md) |
| `lung-cancer-tumor-board-pathway` | Tumorboard | Therapeutische oder diagnostische Fragestellung für den Patienten → Ende des Tumorboards | Pool „Tumorboard (TB)“ (ohne Lanes) | Modell vorhanden; Konformitäts-Gate offen ([#82](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/82): 15 blockierende Befunde; Soundness VIOLATION) | CraNE WP6 / INA (LC SoS 1.2.3) — [Quellen](../docs/governance/clinical-sources.md) |
| `lung-cancer-molecular-tumor-board-pathway` | Molekulares Tumorboard | Bestimmte Patienten mit fortgeschrittenen Krebserkrankungen und Patienten mit besonderen genetischen Konstellationen → Ende des MTB | Pool „Molekulares Tumorboard (MTB)“ (ohne Lanes) | Modell vorhanden; Konformitäts-Gate offen ([#83](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/83): 12 blockierende Befunde; Soundness VIOLATION) | CraNE WP6 / INA (LC SoS 1.2.4); nNGM-Bezug zu ergänzen — [Quellen](../docs/governance/clinical-sources.md) |
| `lung-cancer-treatment-pathway` | Behandlung | Beginn der Behandlungsphase → Ende der Behandlungsphase | Pool „Behandlung“ (ohne Lanes) | Modell vorhanden; Konformitäts-Gate offen ([#84](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/84): 5 blockierende Befunde; Soundness INCONCLUSIVE) | CraNE WP6 / INA (LC-SoS-Referenzen) — [Quellen](../docs/governance/clinical-sources.md) |
| `lung-cancer-palliative-care-pathway` | Palliativversorgung | Patient mit gesicherter Lungenkrebsdiagnose, palliativ/nicht-heilbar → Hospiz, Pflegeeinrichtung, nach Hause oder Tod / Versorgungszyklus abgeschlossen | Pool „Primärbehandelnde Einrichtungen“; Lanes „Primärbehandelnde (Hausarzt / Onkologe) …“, „Onkologe / Pneumologe“ und eine unbenannte Lane | Entwurf/WIP; Konformitäts-Gate offen ([#85](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/85): 26 blockierende Befunde; Soundness INCONCLUSIVE) | Leitlinie im Modell nicht benannt — [Quellen](../docs/governance/clinical-sources.md) |
| `lung-cancer-aftercare-pathway` | Nachsorge | Patient nach kurativer Therapie → Abschluss spezialfachärztliche Nachsorge und Übergang in ausschließlich primärärztliche Versorgung / Screening und Versorgung Langzeitüberlebender | Pool „Nachsorge (Ambulante Versorgung)“; Lanes „Nachsorger (Hausarzt / Niedergelassene Pulmologen / Onkologen)“, „Patient“ | Modell vorhanden; Konformitäts-Gate offen ([#86](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/86): 10 blockierende Befunde; Soundness INCONCLUSIVE) | AMED-Workshop-Review; Leitlinie im Modell nicht benannt — [Quellen](../docs/governance/clinical-sources.md) |

Die Start-/Endereignisse sind bei Modellen mit mehreren Pools auf die Ereignisse der Patient:innen-Perspektive gekürzt;
alle Ereignisse stehen in der jeweiligen `.bpmn`-Datei. **Qualitätsindikatoren** (`cp:qualityIndicator`, BPMN4CP) tragen
fünf Modelle: übergreifend 22, Behandlung 32, Diagnostik 6, Tumorboard 4, Molekulares Tumorboard 4 — die übrigen fünf keine.

### Farblegende / Colour legend

Die Modelle nutzen drei Farbkonventionen, die in den `.bpmn`/`.svg`-Dateien selbst nicht erläutert sind
(_the models carry three colour conventions that are not explained inside the files_):

- **Orange (`#ff9200`) umrandete Elemente** = Ergänzungen bzw. Abweichungen gegenüber dem
  CraNE-WP6-Lungenkrebspfad und der INA Fachanwender Journey Onkologie (Interop Council), aus denen die Modelle
  `diagnostic`, `patient-consultation`, `tumor-board`, `molecular-tumor-board`, `treatment` und `overarching`
  abgeleitet sind (eingeführt mit Commit `d1a0b43`, 2026-03-17: „Highlights (orange) the delta between CraNE and
  Interop Council pathway“). _Orange border = delta to the CraNE / Interop Council source pathway._
- **Rot (`#ff2600`) und grün (`#00f900`) umrandete Elemente im Nachsorge-Modell** (`aftercare`) = Review-Markierungen aus
  dem AMED-Workshop-Review-Zyklus (Einarbeitung bis zum Merge am 2026-07-08); die Unterscheidung der beiden Farben ist im
  Modell nicht dokumentiert — zu ergänzen (Modellierer:in). _Red/green strokes in `aftercare` = AMED-workshop review marks._
- **Rot (`#ff0000` / `#e40707`) umrandete Textannotationen und Elemente im übergreifenden Modell** = offene
  Reviewer-Fragen (z. B. „Gibt es davor ein ‚Entlassungsgespräch‘?“, „löschen?“), die im Konformitäts-Issue
  [#78](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/78) nachgehalten werden.
  _Red-stroked annotations in `overarching` = open reviewer questions, tracked in #78._

Vereinzelte weitere Farben (blau `#0000ff` in `treatment` und `overarching`, ein rotes Element in `palliative-care`) sind
nicht dokumentiert.

### Verknüpfung / Linking

Das übergreifende Modell bindet **fünf** Phasen als **Platzhalter-Subprozesse** ein (ohne eigenen Ablauf); jeder trägt ein
`cp:definitionCanonical` (BPMN4CP) auf den **externen Modeler-Workspace `modeler.helict.eu`** — ein login-pflichtiger Arbeitsbereich,
der nicht Teil dieses Repositories ist:

| Subprozess im übergreifenden Modell (`id`) | entspricht inhaltlich dem Teilpfad |
|---|---|
| „Staging [LC SoS 2.2]“ (`Activity_16oze6f`) | `lung-cancer-diagnostic-pathway` |
| „Patientengespräch“ (`Activity_1rdfhgh`) | `lung-cancer-patient-consultation-pathway` |
| „Tumorboard [LC SoS 1.2.3]“ (`Activity_1oagskd`) | `lung-cancer-tumor-board-pathway` |
| „Molekulares Tumorboard [LC SoS 1.2.4]“ (`Activity_1f73x26`) | `lung-cancer-molecular-tumor-board-pathway` |
| „Behandlung“ (`Activity_00jcqor`) | `lung-cancer-treatment-pathway` |

**Nicht verknüpft** sind `lung-cancer-initial-entry-pathway`, `lung-cancer-screening-pathway`,
`lung-cancer-palliative-care-pathway` und `lung-cancer-aftercare-pathway` — sie stehen als eigenständige Modelle neben dem
übergreifenden Pfad. Ob und wie die Teilpfade **repo-intern** verknüpft werden (z. B. Call Activities mit `calledElement`
auf die Prozesse in `models/`), ist eine Modellierungsentscheidung im Rahmen der Ummodellierung
([#78](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/78),
[#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49)).
_The overarching model references five sub-pathways via external `cp:definitionCanonical` links only; the other four stand alone._

> **Abnahmetest / Status:** siehe [`../docs/governance/`](../docs/governance/); klinische Quellen je Modell in
> [`../docs/governance/clinical-sources.md`](../docs/governance/clinical-sources.md).
> **Bekannte Modellprobleme:** [`docs/model-issues/`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/tree/main/docs/model-issues)
> (nicht Teil des Release-Archivs).
> **Änderungen** an Modellen erfolgen ausschließlich durch Modellierer:innen (Agenten sind
> read-only, Abnahmetest SEM-6 Face Validity) — siehe [`AGENTS.md`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/AGENTS.md) und
> [`CONTRIBUTING.md`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/CONTRIBUTING.md).
