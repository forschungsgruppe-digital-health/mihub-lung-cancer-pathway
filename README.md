# Patient Journey Lungenkrebs (MiHUB)

> **BPMN-Modell der übergreifenden Lungenkrebs-Patient Journey** (_sog. Patientenpfad_) im Rahmen des Medical Informatics Hub (MiHUB). Der Patientenpfad wird federführend in Arbeitspaket 3 (AP3) entwickelt und bildet die fachliche Grundlage für die Use-Case-Arbeitspakete AP6 (Krebsfrüherkennung), AP7 (Kooperative Krebsversorgung) und AP8 (Nachsorge und Langzeitbegleitung).

[![DOI](https://zenodo.org/badge/1167600846.svg)](https://zenodo.org/badge/latestdoi/1167600846)
[![Lizenz: CC BY 4.0](https://img.shields.io/badge/Lizenz-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Projekt: MiHUB](https://img.shields.io/badge/Projekt-MiHUB-blue)](https://mihubx.de/mihub/)
[![Projekt: MII](https://img.shields.io/badge/Projekt-MII-blue)](https://www.medizininformatik-initiative.de/)
[![Standard: BPMN 2.0](https://img.shields.io/badge/Standard-BPMN%202.0-orange)](https://www.omg.org/spec/BPMN/2.0/)

[![CI – Conformance Gate](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/ci.yml/badge.svg?branch=dev)](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/ci.yml?query=branch%3Adev)
[![Soundness (advisory)](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/soundness.yml/badge.svg?branch=dev)](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/soundness.yml?query=branch%3Adev)
[![Link check](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/link-check.yml/badge.svg?branch=dev)](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions/workflows/link-check.yml?query=branch%3Adev)

ℹ️ Die **CI-Konformitätsprüfung** läuft in der Release-Candidate-Phase **beratend (warn-only)**: das Gate **meldet** die bekannten Modellbefunde (Struktur, OR-Gateways) als Warnungen, **blockiert die PRs aber nicht** — die Modellbefunde werden vor der geplanten Ummodellierung bewusst nur **gemeldet** (nicht erzwungen); die harte Durchsetzung wird danach reaktiviert (siehe [`docs/model-issues/`](./docs/model-issues/) und [ADR-0001](./docs/decisions/0001-repo-tooling-and-conformance-gate.md)). Namenskonvention, Roundtrip und XSD-Prüfung sind grün. Live-Status: [GitHub Actions](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/actions).

> ⚠️ **Hinweis zur Zweckbestimmung / Haftungsausschluss.** Dieses BPMN-Modell ist ein **Forschungs-, Lehr- und Interoperabilitäts-Referenzartefakt**. Es ist **nicht** für den Einsatz in der unmittelbaren Patient:innenversorgung oder zur klinischen Entscheidungsfindung bestimmt, **nicht klinisch validiert** und stellt **keine medizinische Beratung** dar. Die Autor:innen weisen ihm **keine medizinische Zweckbestimmung** im Sinne der EU-Medizinprodukteverordnung (MDR 2017/745) zu. Jede Nutzung in einem Versorgungskontext erfordert eine eigenständige klinische Validierung und regulatorische Bewertung durch die nutzende Stelle. Es gelten [`DISCLAIMER.md`](./DISCLAIMER.md) und Abschnitt 5 der [`LICENSE`](./LICENSE).
>
> _This BPMN model is a research, education and interoperability-reference artifact. It is **not** intended for direct patient care or clinical decision-making, has **not** been clinically validated, and is not medical advice. The authors assign it **no medical intended purpose** under EU MDR 2017/745. See [`DISCLAIMER.md`](./DISCLAIMER.md)._

---

## Schnellnavigation

| Ich möchte … | Hier entlang |
| --- | --- |
| die Modelle **ansehen / verwenden** | [Artefakte](#artefakte-in-diesem-repository) · [Verwendung](#verwendung) |
| die **Modellierungsregeln** verstehen | [`CONVENTIONS.md`](./CONVENTIONS.md) |
| ein Modell **erweitern / beitragen** | [`CONTRIBUTING.md`](./CONTRIBUTING.md) |
| die **Abnahmetest-/Qualitätskriterien** | [`docs/governance/`](./docs/governance/) |
| die **Konformitätsprüfung** lokal ausführen | [`skills/bpmn-conformance/SKILL.md`](./skills/bpmn-conformance/SKILL.md) (`npm run check:conformance`) |
| **Entscheidungen (ADR)** nachlesen | [`docs/decisions/`](./docs/decisions/) |
| **Zweckbestimmung / Haftung** | [`DISCLAIMER.md`](./DISCLAIMER.md) |

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

Alle Modelle liegen im Verzeichnis [`models/`](./models/) (Namenskonvention `lung-cancer-<phase>-pathway`, siehe [ADR-0004](./docs/decisions/0004-repo-structure-and-model-naming.md) und die Modellübersicht [`models/README.md`](./models/README.md)). Die BPMN-Modelle werden in zwei Formaten bereitgestellt:

- **BPMN** (`.bpmn`): Maschinenlesbare BPMN-2.0-Quelldatei, direkt bearbeitbar mit gängigen BPMN-Editoren (s. u.)
- **SVG** (`.svg`): Skalierbare Vektorgrafik zur menschenlesbaren Visualisierung, darstellbar im Browser oder in Vektorgrafik-Software

### Übergreifender Patientenpfad

| Datei                                                                          | Beschreibung                                                 |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| [`models/lung-cancer-overarching-pathway.bpmn`](./models/lung-cancer-overarching-pathway.bpmn) | BPMN-Quelldatei des übergreifenden Lungenkrebspatientenpfads |
| [`models/lung-cancer-overarching-pathway.svg`](./models/lung-cancer-overarching-pathway.svg) | Visualisierung des übergreifenden Lungenkrebspatientenpfads  |

Der übergreifende Pfad bildet den vollständigen Patient:innen-Journey von der Prävention/Früherkennung bis zur Nachsorge ab und verknüpft alle Teilpfade miteinander.

### Teilpfade (Sub-Pathways)

| Datei                                                                                                                                                                   | Beschreibung                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`models/lung-cancer-diagnostic-pathway.bpmn`](./models/lung-cancer-diagnostic-pathway.bpmn) / [`.svg`](./models/lung-cancer-diagnostic-pathway.svg)                                  | Teilpfad Diagnostik                     |
| [`models/lung-cancer-patient-consultation-pathway.bpmn`](./models/lung-cancer-patient-consultation-pathway.bpmn) / [`.svg`](./models/lung-cancer-patient-consultation-pathway.svg)    | Teilpfad Patientengespräch / Aufklärung |
| [`models/lung-cancer-tumor-board-pathway.bpmn`](./models/lung-cancer-tumor-board-pathway.bpmn) / [`.svg`](./models/lung-cancer-tumor-board-pathway.svg)                               | Teilpfad Tumorboard                     |
| [`models/lung-cancer-molecular-tumor-board-pathway.bpmn`](./models/lung-cancer-molecular-tumor-board-pathway.bpmn) / [`.svg`](./models/lung-cancer-molecular-tumor-board-pathway.svg) | Teilpfad Molekulares Tumorboard         |
| [`models/lung-cancer-treatment-pathway.bpmn`](./models/lung-cancer-treatment-pathway.bpmn) / [`.svg`](./models/lung-cancer-treatment-pathway.svg)                                     | Teilpfad Behandlung                     |
| [`models/lung-cancer-aftercare-pathway.bpmn`](./models/lung-cancer-aftercare-pathway.bpmn) / [`.svg`](./models/lung-cancer-aftercare-pathway.svg)                                     | Teilpfad Nachsorge                      |
| [`models/lung-cancer-screening-pathway.bpmn`](./models/lung-cancer-screening-pathway.bpmn) / [`.svg`](./models/lung-cancer-screening-pathway.svg) | Teilpfad Krebsfrüherkennung (Lung Cancer Screening) |

---

## Verwendung

Die BPMN-Modelle (`.bpmn`) können mit folgenden Tools geöffnet, visualisiert und weiterbearbeitet werden:

- **[bpmn.io](https://demo.bpmn.io/)** – Frei verfügbarer, webbasierter BPMN-Editor (keine Installation erforderlich)
- **[Camunda Modeler](https://camunda.com/download/modeler/)** – Desktop-Anwendung für BPMN 2.0 (kostenlos)
- **[Eclipse BPMN2 Modeler](https://www.eclipse.org/bpmn2-modeler/)** – Eclipse-Plugin für BPMN

Die SVG-Dateien lassen sich direkt im Browser oder in Vektorgrafik-Software (z. B. Inkscape, Adobe Illustrator) öffnen.

---

## Vorarbeiten und Grundlagen

Die Modellierung des Patientenpfads baut auf Vorarbeiten aus zwei Initiativen auf:

### INA Arbeitskreis Fachanwender Journey Onkologie (gematik)

Der [Arbeitskreis Fachanwender Journey Onkologie](https://www.ina.gematik.de/community-hub/vernetzen-mitwirken/arbeitskreise/fachanwender-journey-onkologie) des Interoperabilitäts-Navigators (INA) der gematik erstellte 2023 einen BPMN-modellierten Überblick über bestehende (Daten-)Schnittstellen entlang der Fachanwender-Journey in der onkologischen Versorgung am Beispiel des Lungenkarzinoms. Die Ergebnisse sind unter **Creative Commons** veröffentlicht und mit Nennung des **Interop Council** weiterzuverwenden.

> **Attribution:** Interop Council / INA – Interoperabilitäts-Navigator der gematik (2023). Fachanwender Journey Onkologie. [https://www.ina.gematik.de/community-hub/vernetzen-mitwirken/arbeitskreise/fachanwender-journey-onkologie](https://www.ina.gematik.de/community-hub/vernetzen-mitwirken/arbeitskreise/fachanwender-journey-onkologie)

### CraNE Joint Action – WP6 (Europäische Kommission / EU4Health)

Die EU Joint Action [CraNE](https://crane4health.eu/) (_Creation of National Comprehensive Cancer Centres and EU-Networking_, EU4Health-Programm) entwickelte in [WP6](https://crane4health.eu/wp6-organization-of-comprehensive-high-quality-cancer-care-in-comprehensive-cancer-care-networks-cccns/) Standards und einen Patientenpfad für die Lungenkrebsversorgung in Comprehensive Cancer Care Networks (CCCNs), die als Grundlage für den MiHUB-Patientenpfad dienen. CraNE-Ergebnisse werden im Rahmen des EU4Health-Programms zur offenen Nachnutzung bereitgestellt; EU-geförderte Veröffentlichungen unterliegen den Open-Access-Anforderungen der Europäischen Kommission (typischerweise **CC BY 4.0**).

> **Attribution:** CraNE Joint Action WP6 (2024). Standard for Lung Cancer Care / Patient Pathway for Lung Cancer Patients. Funded by the European Union (EU4Health Programme). [https://crane4health.eu/wp6-organization-of-comprehensive-high-quality-cancer-care-in-comprehensive-cancer-care-networks-cccns/](https://crane4health.eu/wp6-organization-of-comprehensive-high-quality-cancer-care-in-comprehensive-cancer-care-networks-cccns/)
>
> _Funded by the European Union. Views and opinions expressed are those of the author(s) only and do not necessarily reflect those of the European Union or HaDEA. Neither the European Union nor the granting authority can be held responsible for them._

---

## Lizenz

Dieses Repository steht unter der **[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)** Lizenz.

[![CC BY 4.0](https://licensebuttons.net/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

### Attribution

Bei Weiterverwendung bitte folgende Angabe verwenden:

> _Forschungsgruppe Digital Health (FGDH), Technische Universität Dresden (2026). Lungenkrebspatientenpfad – MiHUB. GitHub: https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway. Lizenz: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)._

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
