# Patient Journey Lungenkrebs (MiHUB)

> **BPMN-Modell der übergreifenden Lungenkrebs-Patient Journey** (_sog. Patientenpfad_) im Rahmen des Medical Informatics Hub (MiHUB). Der Patientenpfad wird federführend in Arbeitspaket 3 (AP3) entwickelt und bildet die fachliche Grundlage für die Use-Case-Arbeitspakete AP6 (Krebsfrüherkennung), AP7 (Kooperative Krebsversorgung) und AP8 (Nachsorge und Langzeitbegleitung).

[![DOI](https://zenodo.org/badge/1167600846.svg)](https://zenodo.org/badge/latestdoi/1167600846)
[![Lizenz: CC BY 4.0](https://img.shields.io/badge/Lizenz-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Projekt: MiHUB](https://img.shields.io/badge/Projekt-MiHUB-blue)](https://mihubx.de/mihub/)
[![Projekt: MII](https://img.shields.io/badge/Projekt-MII-blue)](https://www.medizininformatik-initiative.de/)
[![Standard: BPMN 2.0](https://img.shields.io/badge/Standard-BPMN%202.0-orange)](https://www.omg.org/spec/BPMN/2.0/)

[![CI – Conformance Gate](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/ci.yml?query=branch%3Adev)
[![Soundness (advisory)](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/soundness.yml/badge.svg?branch=dev)](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/soundness.yml?query=branch%3Adev)
[![KI-Nutzung offengelegt](https://img.shields.io/badge/KI--Nutzung-offengelegt-informational)](./AI_USAGE.md)
[![Link check](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/link-check.yml/badge.svg?branch=dev)](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/link-check.yml?query=branch%3Adev)

ℹ️ Die **CI-Konformitätsprüfung** läuft in der Release-Candidate-Phase **beratend (warn-only)**: das Gate **meldet** die bekannten Modellbefunde (Struktur, OR-Gateways) als Warnungen, **blockiert die PRs aber nicht** — die Modellbefunde werden vor der geplanten Ummodellierung bewusst nur **gemeldet** (nicht erzwungen); die harte Durchsetzung wird danach reaktiviert (siehe [`docs/model-issues/`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/tree/main/docs/model-issues) und [ADR-0001](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0001-repo-tooling-and-conformance-gate.md)). Namenskonvention und Roundtrip sind auf allen Modellen grün; die (informative) XSD-Kernprüfung ist auf allen Modellen bis auf das übergreifende grün — es trägt vier nicht-standardisierte DI-Farbattribute (siehe [docs/model-issues](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/model-issues/2026-09-04-xsd-core-extension-placement.md)); die BPMN4CP-Erweiterung `cp:` steht per Design direkt unter dem Prozess und wird vor der Kernprüfung ausgeblendet. Die Namenskonvention wird als **eigener, blockierender CI-Schritt** erzwungen (`npm run check:naming`). Live-Status: [GitHub Actions](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions).

> ⚠️ **Hinweis zur Zweckbestimmung / Haftungsausschluss.** Dieses BPMN-Modell ist ein **Forschungs-, Lehr- und Interoperabilitäts-Referenzartefakt**. Es ist **nicht** für den Einsatz in der unmittelbaren Patient:innenversorgung oder zur klinischen Entscheidungsfindung bestimmt, **nicht klinisch validiert** und stellt **keine medizinische Beratung** dar. Die Autor:innen weisen ihm **keine medizinische Zweckbestimmung** im Sinne der EU-Medizinprodukteverordnung (MDR 2017/745) zu. Jede Nutzung in einem Versorgungskontext erfordert eine eigenständige klinische Validierung und regulatorische Bewertung durch die nutzende Stelle. Es gelten [`DISCLAIMER.md`](./DISCLAIMER.md) und Abschnitt 5 der [`LICENSE`](./LICENSE). Der Haftungsausschluss ist derzeit ein **Entwurf** und befindet sich in rechtlicher Prüfung (Justiziariat / Datenschutzbeauftragter (DSB) der TU Dresden).
>
> _This BPMN model is a research, education and interoperability-reference artifact. It is **not** intended for direct patient care or clinical decision-making, has **not** been clinically validated, and is not medical advice. The authors assign it **no medical intended purpose** under EU MDR 2017/745. See [`DISCLAIMER.md`](./DISCLAIMER.md)._
>
> 🧩 **Ergänzendes Repository — Datenelemente.** Die _inhaltliche_ Datenseite dieses Pfads — _welche_ klinischen Datenelemente an den Aktivitäten und Übergängen erhoben, ausgetauscht und sekundär genutzt werden — wird im Schwester-Repository [`mihub-lung-cancer-pathway-data-elements`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway-data-elements) gepflegt (AP6/AP7/AP8). Dieses Repository beschreibt den **Prozess** (_wann, durch wen_), das Datenelement-Repository die **Inhalte** (_was wird dokumentiert/ausgetauscht_). Beide sind komplementär.

---

## Schnellnavigation

| Ich möchte … | Hier entlang |
| --- | --- |
| die Modelle **ansehen / verwenden** | [Artefakte](#artefakte-in-diesem-repository) · [Verwendung](#verwendung) |
| die **Modellierungsregeln** verstehen | [`CONVENTIONS.md`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/CONVENTIONS.md) |
| ein Modell **erweitern / beitragen** | [`CONTRIBUTING.md`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/CONTRIBUTING.md) |
| die **Abnahmetest-/Qualitätskriterien** | [`docs/governance/`](./docs/governance/) |
| die **Konformitätsprüfung** lokal ausführen | [`skills/bpmn-conformance/SKILL.md`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/skills/bpmn-conformance/SKILL.md) (`npm run check:conformance`) |
| **Entscheidungen (ADR)** nachlesen | [`docs/decisions/`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/tree/main/docs/decisions) |
| **Änderungen / Release-Notes** | [`CHANGELOG.md`](./CHANGELOG.md) |
| die **KI-Nutzung** in diesem Repository nachvollziehen (EU AI Act Art. 50) | [`AI_USAGE.md`](./AI_USAGE.md) |
| mit **KI-Coding-Agenten** arbeiten (Claude Code, Codex, Copilot, …) | [`AGENTS.md`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/AGENTS.md) · [`skills/README.md`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/skills/README.md) |
| **Zweckbestimmung / Haftung** | [`DISCLAIMER.md`](./DISCLAIMER.md) |
| den **Projektstatus** (Release, Abnahme, Modelle) | [Status & Roadmap](#status--roadmap) |
| die **klinischen Quellen** je Modell (Leitlinien, Rechtsgrundlagen, Workshops) | [`docs/governance/clinical-sources.md`](./docs/governance/clinical-sources.md) |
| die **Datenelemente** (Inhaltsseite) erkunden | Schwester-Repo [`…-data-elements`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway-data-elements) |

---

## Status & Roadmap

_Stand: 2026-09-07 — aktualisiert mit jedem Release; Live-Quellen sind die Status-Spalte in [`models/README.md`](./models/README.md) und das Sammel-Issue [#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49)._

| Bereich | Status |
| --- | --- |
| **Release-Phase** | Pre-Releases `0.x-rc.N` unter dem Concept-DOI [`10.5281/zenodo.20943916`](https://doi.org/10.5281/zenodo.20943916); aktuelle Version **v0.4.0-rc.1** (2026-09-05, siehe [`CHANGELOG.md`](./CHANGELOG.md)). |
| **Abnahmetest** | Noch **kein Modell abgenommen** („Accepted“). Die **1.0.0** folgt der ersten formalen Abnahme ([ADR-0002](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0002-versioning-and-release.md)); Instrument und Protokoll in [`docs/governance/`](./docs/governance/). |
| **Modelle** | 10 Modelle. Jedes trägt ein **offenes Konformitäts-Issue** (Kinder von [#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49)); **13 OR-Gateways** sind umzumodellieren (SYN-5); das Palliativ-Modell ist ein **WIP-Entwurf**. Status je Modell: Spalte „Status“ in [`models/README.md`](./models/README.md). |
| **Tooling** | Konformitäts-Gate (`npm run check:conformance`) **lokal blockierend**, in der CI während der RC-Phase **beratend** (warn-only, siehe Hinweis oben); Soundness-Prüfung beratend ([ADR-0001](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0001-repo-tooling-and-conformance-gate.md), [ADR-0003](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0003-soundness-tooling.md)). |
| **Offene Entscheidungen** | Rechtliche Prüfung des [`DISCLAIMER.md`](./DISCLAIMER.md) (Justiziariat / DSB der TU Dresden) läuft; die **Lizenz der abgeleiteten Modelle** (CraNE-/INA-Vorlagen, siehe [Vorarbeiten](#vorarbeiten-und-grundlagen)) ist in Prüfung; die **klinische Validierung** (Kinsman-Gate, SEM-6) steht aus. |
| **Nächste Schritte** | Ummodellierung nach [#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49) → Gate in der CI wieder hart schalten → erster formaler Abnahmetest → `1.0.0`. |
| **Wo nachsehen** | [`models/README.md`](./models/README.md) (Status, Rollen, Quellen je Modell) · [#49](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/49) · [`docs/governance/clinical-sources.md`](./docs/governance/clinical-sources.md) · [GitHub Actions](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions). |

---

## Projektkontext

Dieses Repository ist Teil des [**Medical Informatics Hub (MiHUB)**](https://mihubx.de/mihub/), einem Digitalen FortschrittsHub (DigiHub) der [Medizininformatik-Initiative (MII)](https://www.medizininformatik-initiative.de/) des Bundesministeriums für Forschung, Technologie und Raumfahrt (BMFTR). MiHUB hat das Ziel, eine intersektorale, serviceorientierte Infrastruktur zur Verbesserung der sektorenübergreifenden Versorgung und Forschung in der Onkologie aufzubauen. Das übergreifende Anwendungsszenario ist die **Versorgung von Lungenkrebspatient:innen** entlang einer vollständigen Patient Journey – von der Früherkennung über Diagnostik und Behandlung bis hin zu Nachsorge und Langzeitbegleitung.

Konsortialführer ist die Technische Universität Dresden (Zentrum für Medizinische Informatik, ZMI). Weitere Konsortialpartner sind die Medizinische Universität Lausitz – Carl Thiem (Cottbus), das Klinikum Chemnitz und die Hochschule Mittweida. MiHUB kooperiert eng mit anderen DigiHubs im Rahmen des Cross-Hub Use Case _„Digitale Unterstützung in komplexen Patientenpfaden"_.

---

## Arbeitspakete mit Bezug zur Patientenpfadentwicklung

Der Patientenpfad wird in AP3 entwickelt und in den Use-Case-Arbeitspaketen AP6, AP7 und AP8 domänenspezifisch verfeinert und implementiert. Die folgende Übersicht beschreibt die pfadrelevanten Aufgaben der einzelnen Arbeitspakete.

### AP3 – Übergreifende Patientenpfade

Die **Forschungsgruppe Digital Health (FGDH)** der TU Dresden ist federführend für AP3 verantwortlich. Unterstützt wird sie durch die **Abteilung Allgemeinmedizin / Forschungspraxennetz SaxoN (AMED)** der TU Dresden, die **Abteilung Hämatologie, Onkologie, Nephrologie, Diabetologie und Pneumologie (CB-Onc)** der Medizinischen Universität Lausitz – Carl Thiem in Cottbus sowie das dortige **Datenintegrationszentrum (CB-DIC)**.

AP3 entwickelt einen integrierten Lungenkrebspatientenpfad, der die Phasen Krebsfrüherkennung, Diagnostik, Behandlung, kooperative Krebsversorgung, Palliativversorgung, Nachsorge und Primärversorgung abdeckt. Der Patientenpfad wird auf Basis klinischer Leitlinien und SOPs mithilfe von erweitertem **BPMN 2.0** modelliert und bildet die fachliche Grundlage für alle weiteren Arbeitspakete des Projekts. Darüber hinaus wird der Pfad in **HL7 FHIR**-Spezifikationen überführt, um eine maschinell interpretierbare und semantisch interoperable Repräsentation bereitzustellen.

**Aufgabe 3.1 – Entwicklung des übergreifenden Patientenpfads (M1–M6)**
Entwicklung des Kern-Lungenkrebspatientenpfads in BPMN mit Fokus auf intersektorale Übergänge und aktiver Beteiligung der Stakeholder (Hausärzt:innen, Spezialist:innen, Tumorzentren, Patient:innen). Die Modellierung basiert auf klinischen Leitlinien und SOPs. Der BPMN-Pfad wird allen Stakeholdern zugänglich gemacht.

**Aufgabe 3.2 – Computerinterpretierbare Spezifikation des Patientenpfads (M10–M16)**
Überführung des BPMN-Modells in ein technisches Artefakt mittels HL7 FHIR-Standards und nationaler sowie internationaler Terminologiestandards (SNOMED CT, LOINC, ICD). Ziel ist ein computerinterpretierbarer Patientenpfad, der mit nationalen und europäischen Gesundheitsdateninitiativen (u. a. EHDS) kompatibel ist.

**Aufgabe 3.3 – Analyse der aktuellen Informationssystemlandschaft (M3–M9)**
Systematische Analyse der bestehenden IT-Systemlandschaft entlang des entwickelten Patientenpfads zur Identifikation von Lücken, Schwachstellen und erfolgreichen Komponenten als Grundlage für die technische Umsetzung.

| ID   | Beschreibung                                       | Fälligkeit |
| ---- | -------------------------------------------------- | ---------- |
| D3.1 | Lungenkrebspatientenpfad BPMN-Modell               | M6         |
| D3.2 | Lungenkrebspatientenpfad FHIR Implementation Guide | M16        |
| D3.3 | Bericht zur aktuellen Informationssystemlandschaft | M9         |

### AP6 – Use Case: Krebsfrüherkennung

AP6 wird maßgeblich durch das **Klinikum Chemnitz** getragen: die **Klinik für Innere Medizin IV (SKC-CIM)** und das **Institut für Radiologie und Neuroradiologie (SKC-RAD)** verantworten die klinische Evaluation, das **Netzwerk Südwestsachsen (SKC-SWS)** die regionale Vernetzung und die **IT-Abteilung (SKC-IT)** die technische Umsetzung. Weitere Beiträge leisten **AMED** (Rekrutierung hausärztlicher Praxen über das Forschungspraxennetz SaxoN), **CB-Onc** (Cottbus) sowie **ZMI** und **FGDH** der TU Dresden.

AP6 nutzt den in AP3 entwickelten Patientenpfad als Grundlage für die Identifikation von Hochrisikopatient:innen für die Lungenkrebsfrüherkennung und leitet daraus domänenspezifische Datenanforderungen ab.

**Aufgabe 6.2 – Datenanalyse und Spezifikation (M7–M12)**
Definition von Datenelementen zur Patient:innenidentifikation auf Basis der in AP3 entwickelten Pfadanalyse. Spezifikation strukturierter und unstrukturierter Datenanforderungen gemäß der Lungenkrebsfrüherkennungsverordnung. Partizipative Analyse mit rekrutierten Hausärzt:innen zur iterativen Verfeinerung.

| ID   | Beschreibung       | Fälligkeit |
| ---- | ------------------ | ---------- |
| D6.2 | Datenspezifikation | M12        |

### AP7 – Use Case: Kooperative Krebsversorgung

Federführend in AP7 ist das **Center for Personalized Oncology and Translational Medical Oncology am NCT/UCC Dresden (NCT)**. Wesentliche Beiträge leisten die **FGDH** (Patient:innenportal, Vernetzungsplattform), **AMED** (hausärztliche Perspektive) und **CB-Onc** (Cottbus, onkologische Expertise).

AP7 verfeinert den in AP3 entwickelten übergreifenden Patientenpfad für die Versorgung von Patient:innen mit fortgeschrittenem und palliativem Lungenkarzinom. Durch die Detaillierung der Behandlungsepisode entsteht ein differenziertes Verständnis des Patient:innen- und Datenpfads in der kooperativen Krebsversorgung.

**Aufgabe 7.1 – Erhebung der Patient Journey und Definition von Teilpfaden (M1–M9)**
In Zusammenarbeit mit AP3 wird die Patient Journey für die Behandlungsepisode detailliert, die Patient:innenportal-Nutzung spezifiziert und detaillierte Prozessmodelle erstellt. Ziel ist ein umfassendes Verständnis des Patient:innenpfads und des zugehörigen Datenpfads durch das Gesundheitssystem.

| ID   | Beschreibung                                  | Fälligkeit |
| ---- | --------------------------------------------- | ---------- |
| D7.1 | Verfeinerte Patient Journey und Patientenpfad | M9         |

### AP8 – Use Case: Nachsorge und Langzeitbegleitung

AP8 wird gemeinsam getragen von **AMED** (Forschungspraxennetz SaxoN, hausärztliche Perspektive), **FGDH** (digitale Werkzeuge, Systemarchitektur), dem **CB-DIC** und **CB-Onc** (Cottbus) sowie der **Hochschule Mittweida (HSMW)** (CRPM-Studien, Daten-Gateway).

AP8 leitet aus dem übergreifenden Patientenpfad die spezifischen Anforderungen für die Nachsorge und Langzeitbegleitung ab. Durch Stakeholder-Workshops werden notwendige Datenelemente und gewünschte Prozesse für die hausärztliche und ambulante onkologische Nachsorge erhoben und in den Pfad rückgekoppelt.

**Aufgabe 8.1 – Anforderungsanalyse (M1–M6)**
Erhebung notwendiger Datenelemente, digitaler Unterstützungsoptionen und gewünschter Prozesse für die Nachsorge in Stakeholder-Workshops (gemeinsam mit AP9). Definition von Kohorten und Forschungsfragen für vertiefende Studien.

| ID   | Beschreibung              | Fälligkeit |
| ---- | ------------------------- | ---------- |
| D8.1 | Anforderungsspezifikation | M6         |

---

## Artefakte in diesem Repository

Alle Modelle liegen im Verzeichnis [`models/`](./models/) (Namenskonvention `lung-cancer-<phase>-pathway`, siehe [ADR-0004](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/docs/decisions/0004-repo-structure-and-model-naming.md) und die Modellübersicht [`models/README.md`](./models/README.md)). Die BPMN-Modelle werden in zwei Formaten bereitgestellt:

- **BPMN** (`.bpmn`): Maschinenlesbare BPMN-2.0-Quelldatei, direkt bearbeitbar mit gängigen BPMN-Editoren (s. u.)
- **SVG** (`.svg`): Skalierbare Vektorgrafik zur menschenlesbaren Visualisierung, darstellbar im Browser oder in Vektorgrafik-Software

### Übergreifender Patientenpfad

| Datei                                                                          | Beschreibung                                                 |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [`models/lung-cancer-overarching-pathway.bpmn`](./models/lung-cancer-overarching-pathway.bpmn) | BPMN-Quelldatei des übergreifenden Lungenkrebspatientenpfads |
| [`models/lung-cancer-overarching-pathway.svg`](./models/lung-cancer-overarching-pathway.svg) | Visualisierung des übergreifenden Lungenkrebspatientenpfads  |

Der übergreifende Pfad bildet die vollständige Patient Journey von der Prävention/Früherkennung bis zur Nachsorge ab. Fünf Phasen — Staging/Diagnostik, Patientengespräch, Tumorboard, Molekulares Tumorboard und Behandlung — sind darin als **Platzhalter-Subprozesse** mit externen Verweisen (`cp:definitionCanonical` auf den login-pflichtigen Modeler-Workspace `modeler.helict.eu`) eingebunden; die vier übrigen Teilpfade (Initialer Einstieg, Krebsfrüherkennung, Palliativversorgung, Nachsorge) stehen derzeit **eigenständig** neben dem übergreifenden Modell — siehe [`models/README.md`, Abschnitt „Verknüpfung“](./models/README.md#verknüpfung--linking).

### Teilpfade (Sub-Pathways)

| Datei                                                                                                                                                                   | Beschreibung                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`models/lung-cancer-initial-entry-pathway.bpmn`](./models/lung-cancer-initial-entry-pathway.bpmn) / [`.svg`](./models/lung-cancer-initial-entry-pathway.svg) | Teilpfad Initialer Einstieg (symptomatische Patient:innen / Zufallsbefund) |
| [`models/lung-cancer-screening-pathway.bpmn`](./models/lung-cancer-screening-pathway.bpmn) / [`.svg`](./models/lung-cancer-screening-pathway.svg) | Teilpfad Krebsfrüherkennung (Lung Cancer Screening) |
| [`models/lung-cancer-diagnostic-pathway.bpmn`](./models/lung-cancer-diagnostic-pathway.bpmn) / [`.svg`](./models/lung-cancer-diagnostic-pathway.svg)                                  | Teilpfad Diagnostik                     |
| [`models/lung-cancer-patient-consultation-pathway.bpmn`](./models/lung-cancer-patient-consultation-pathway.bpmn) / [`.svg`](./models/lung-cancer-patient-consultation-pathway.svg)    | Teilpfad Patientengespräch / Aufklärung |
| [`models/lung-cancer-tumor-board-pathway.bpmn`](./models/lung-cancer-tumor-board-pathway.bpmn) / [`.svg`](./models/lung-cancer-tumor-board-pathway.svg)                               | Teilpfad Tumorboard                     |
| [`models/lung-cancer-molecular-tumor-board-pathway.bpmn`](./models/lung-cancer-molecular-tumor-board-pathway.bpmn) / [`.svg`](./models/lung-cancer-molecular-tumor-board-pathway.svg) | Teilpfad Molekulares Tumorboard         |
| [`models/lung-cancer-treatment-pathway.bpmn`](./models/lung-cancer-treatment-pathway.bpmn) / [`.svg`](./models/lung-cancer-treatment-pathway.svg)                                     | Teilpfad Behandlung                     |
| [`models/lung-cancer-palliative-care-pathway.bpmn`](./models/lung-cancer-palliative-care-pathway.bpmn) / [`.svg`](./models/lung-cancer-palliative-care-pathway.svg)                   | Teilpfad Palliativversorgung _(Entwurf / WIP)_ |
| [`models/lung-cancer-aftercare-pathway.bpmn`](./models/lung-cancer-aftercare-pathway.bpmn) / [`.svg`](./models/lung-cancer-aftercare-pathway.svg)                                     | Teilpfad Nachsorge                      |

Die **klinischen Quellen je Modell** (Leitlinien, Rechtsgrundlagen, Workshops, abgeleitete Vorlagen; Datum der letzten Prüfung gegen die Quelle) sind in [`docs/governance/clinical-sources.md`](./docs/governance/clinical-sources.md) dokumentiert.

---

## Verwendung

Die BPMN-Modelle (`.bpmn`) können mit folgenden Tools geöffnet, visualisiert und weiterbearbeitet werden:

- **[bpmn.io](https://demo.bpmn.io/)** – Frei verfügbarer, webbasierter BPMN-Editor (keine Installation erforderlich)
- **[Camunda Modeler](https://camunda.com/download/modeler/)** – Desktop-Anwendung für BPMN 2.0 (kostenlos)
- **[Eclipse BPMN2 Modeler](https://www.eclipse.org/bpmn2-modeler/)** – Eclipse-Plugin für BPMN

Die kanonische Werkzeugempfehlung (Einsatzzweck und Hinweise je Werkzeug) steht in [`CONVENTIONS.md`, § 9 „Empfohlene Werkzeuge“](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/CONVENTIONS.md#9-empfohlene-werkzeuge).

Die SVG-Dateien lassen sich direkt im Browser oder in Vektorgrafik-Software (z. B. Inkscape, Adobe Illustrator) öffnen.

---

## Vorarbeiten und Grundlagen

Die Modellierung des Patientenpfads baut auf Vorarbeiten aus zwei Initiativen auf:

### INA Arbeitskreis Fachanwender Journey Onkologie (gematik)

Der [Arbeitskreis Fachanwender Journey Onkologie](https://www.ina.gematik.de/community-hub/vernetzen-mitwirken/arbeitskreise/fachanwender-journey-onkologie) des Interoperabilitäts-Navigators (INA) der gematik erstellte 2023 einen BPMN-modellierten Überblick über bestehende (Daten-)Schnittstellen entlang der Fachanwender-Journey in der onkologischen Versorgung am Beispiel des Lungenkarzinoms. Die Ergebnisse sind unter **Creative Commons** veröffentlicht und mit Nennung des **Interop Council** weiterzuverwenden.

> **Attribution:** Interop Council / INA – Interoperabilitäts-Navigator der gematik (2023). Fachanwender Journey Onkologie. [https://www.ina.gematik.de/community-hub/vernetzen-mitwirken/arbeitskreise/fachanwender-journey-onkologie](https://www.ina.gematik.de/community-hub/vernetzen-mitwirken/arbeitskreise/fachanwender-journey-onkologie) — Nutzungsbedingung laut Quellseite: Namensnennung „Interop Council“, Weitergabe unter gleichen Bedingungen (verlinkt: CC BY-SA 4.0). Verwendete Dateien: BPMN-Teiljourneys (u. a. Palliativmedizin, Molekulares Tumorboard, Tumorkonferenz); Änderungen: Übersetzung, Umstrukturierung, Erweiterung (orange markiert).

### CraNE Joint Action – WP6 (Europäische Kommission / EU4Health)

Die EU Joint Action [CraNE](https://crane4health.eu/) (_Creation of National Comprehensive Cancer Centres and EU-Networking_, EU4Health-Programm) entwickelte in [WP6](https://crane4health.eu/wp6-organization-of-comprehensive-high-quality-cancer-care-in-comprehensive-cancer-care-networks-cccns/) Standards und einen Patientenpfad für die Lungenkrebsversorgung in Comprehensive Cancer Care Networks (CCCNs), die als Grundlage für den MiHUB-Patientenpfad dienen. CraNE-Ergebnisse werden im Rahmen des EU4Health-Programms zur offenen Nachnutzung bereitgestellt; EU-geförderte Veröffentlichungen unterliegen den Open-Access-Anforderungen der Europäischen Kommission (typischerweise **CC BY 4.0**).

> **Attribution:** CraNE Joint Action WP6 — Patient Pathway Working Group (2024). Lung Cancer Patient Pathway Template for CCCNs (Sub-Task 6.4.2) / D6.4 Patient Pathway for Lung Cancer Patients; lead authors Peggy Richter, Emily Hickmann, Hannes Schlieter (TU Dresden). Referenced standard: Standard for Lung Cancer Care (Sub-Task 6.3.1, DKG). Funded by the European Union (EU4Health Programme, GA 101075284). [https://crane4health.eu/wp6-organization-of-comprehensive-high-quality-cancer-care-in-comprehensive-cancer-care-networks-cccns/](https://crane4health.eu/wp6-organization-of-comprehensive-high-quality-cancer-care-in-comprehensive-cancer-care-networks-cccns/)
>
> _Funded by the European Union. Views and opinions expressed are those of the author(s) only and do not necessarily reflect those of the European Union or HaDEA. Neither the European Union nor the granting authority can be held responsible for them._

---

## Zitieren / Citation

Bitte über den **Concept-DOI** (alle Versionen) zitieren:
**[`10.5281/zenodo.20943916`](https://doi.org/10.5281/zenodo.20943916)** — er verweist stets auf die neueste archivierte Version. Maschinenlesbare Metadaten in [`CITATION.cff`](./CITATION.cff) (GitHub-Schaltfläche „Cite this repository“); die Metadaten des Zenodo-Deposits (Ressourcentyp *Dataset*, Titel, Autor:innen, Abstract) stammen aus [`.zenodo.json`](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/blob/main/.zenodo.json), das mit `CITATION.cff` synchron gehalten wird (CI-geprüft). Für die exakte Reproduzierbarkeit einer bestimmten Release den jeweiligen **Versions-DOI** verwenden (z. B. `10.5281/zenodo.21029417` für `v0.3.0-rc.1`; der Versions-DOI steht im zugehörigen Zenodo-Record (über das DOI-Badge bzw. den Concept-DOI erreichbar)). _Cite via the concept DOI (all versions); it always resolves to the latest archived version._

## Lizenz

Dieses Repository steht unter der **[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)** Lizenz.

[![CC BY 4.0](https://licensebuttons.net/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

### Attribution

Bei Weiterverwendung bitte folgende Angabe verwenden:

> _Forschungsgruppe Digital Health (FGDH), Technische Universität Dresden (2026). Lungenkrebspatientenpfad – MiHUB (BPMN-Modell). DOI: https://doi.org/10.5281/zenodo.20943916. GitHub: https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway. Lizenz: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)._

---

## Förderhinweis

Dieses Artefakt ist im Rahmen des Verbundprojekts **Medical Informatics Hub/MiHUB** als Teil der **Medizininformatik-Initiative (MII)** entstanden und wird gefördert durch das **Bundesministerium für Forschung, Technologie und Raumfahrt (BMFTR)**, Förderkennzeichen: 01ZZ2506A.

<p align="middle">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/BMFTR_Logo.svg/1280px-BMFTR_Logo.svg.png" width="500" />
  <img src="https://mihubx.de/wp-content/uploads/2026/01/FortschrittsHubs_rgb_mihub.png" width="300" />
</p>

---

## Kontakt

E-Mail: digital-health@tu-dresden.de\
Webseite: https://tu-dresden.de/bu/wirtschaft/winf/digital-health

Technische Universität Dresden\
Fakultät Wirtschaftswissenschaften\
Forschungsgruppe Digital Health\
01062 Dresden

Für Fragen und Beiträge bitte ein [GitHub Issue](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues) erstellen.
