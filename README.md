# Patient Journey Lungenkrebs (MiHUB)

> **BPMN-Modell der übergreifenden Lungenkrebs-Patient Journey** (_sog. Patientenpfad_) im Rahmen des Medical Informatics Hub (MiHUB), Arbeitspaket 3 (WP3): _Übergreifende Patientenpfade_

[![Lizenz: CC BY 4.0](https://img.shields.io/badge/Lizenz-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Projekt: MiHUB](https://img.shields.io/badge/Projekt-MiHUB-blue)](https://mihubx.de/mihub/)
[![Projekt: MII](https://img.shields.io/badge/Projekt-MII-blue)](https://www.medizininformatik-initiative.de/)
[![Standard: BPMN 2.0](https://img.shields.io/badge/Standard-BPMN%202.0-orange)](https://www.omg.org/spec/BPMN/2.0/)

---


## Projektkontext

Dieses Repository ist Teil des [**Medical Informatics Hub (MiHUB)**](https://mihubx.de/mihub/), einem Digitalen FortschrittsHub (DigiHub) der [Medizininformatik-Initiative (MII)](https://www.medizininformatik-initiative.de/) des Bundesministeriums für Forschung, Technologie und Raumfahrt (BMFTR). MiHUB hat das Ziel, eine intersektorale, serviceorientierte Infrastruktur zur Verbesserung der sektorenübergreifenden Versorgung und Forschung in der Onkologie aufzubauen. Das übergreifende Anwendungsszenario ist die **Versorgung von Lungenkrebspatient:innen** entlang einer vollständigen Patient Journey, von der Früherkennung über Diagnostik und Behandlung bis hin zu Nachsorge und Langzeitbegleitung.

Konsortialführer ist die Technische Universität Dresden (Zentrum für Medizinische Informatik, ZMI). Weitere Konsortialpartner sind die Medizinische Universität Lausitz – Carl Thiem (Cottbus), das Klinikum Chemnitz und die Hochschule Mittweida. MiHUB kooperiert eng mit anderen DigiHubs im Rahmen des Cross-Hub Use Case _„Digitale Unterstützung in komplexen Patientenpfaden"_.

---

## Arbeitspaket 3 – Übergreifende Patientenpfade (WP3)

Die **Forschungsgruppe Digital Health (FGDH)** der TU Dresden ist federführend für WP3 verantwortlich.

### Ziel

WP3 entwickelt einen integrierten Lungenkrebspatientenpfad, der die Phasen Krebsfrüherkennung, Diagnostik, Behandlung, kooperative Krebsversorgung, Palliativversorgung, Nachsorge und Primärversorgung abdeckt. Der Patientenpfad wird auf Basis klinischer Leitlinien und SOPs mithilfe von erweitertem **BPMN 2.0** modelliert und bildet die fachliche Grundlage für alle weiteren Arbeitspakete des Projekts. Darüber hinaus wird der Pfad in **HL7 FHIR**-Spezifikationen überführt, um eine maschinell interpretierbare und semantisch interoperable Repräsentation bereitzustellen.

### Aufgaben

**Aufgabe 3.1 – Entwicklung des übergreifenden Patientenpfads (M1–M6)**
Entwicklung des Kern-Lungenkrebspatientenpfads in BPMN mit Fokus auf intersektorale Übergänge und aktiver Beteiligung der Stakeholder (Hausärzt:innen, Spezialist:innen, Tumorzentren, Patient:innen). Die Modellierung basiert auf etablierten klinischen Leitlinien und SOPs. Die Möglichkeiten zur Modularisierung für eine individuelle Anpassung werden anhand versorgungsspezifischer Parameter untersucht. Der BPMN-Pfad wird allen Stakeholdern zugänglich gemacht.

**Aufgabe 3.2 – Computerinterpretierbare Spezifikation des Patientenpfads (M10–M16)**
Überführung des BPMN-Modells in ein technisches Artefakt mittels HL7 FHIR-Standards und nationaler sowie internationaler Terminologiestandards (SNOMED CT, LOINC, ICD). Ziel ist ein computerinterpretierbarer Patientenpfad, der mit nationalen und europäischen Gesundheitsdateninitiativen (u. a. EHDS) kompatibel ist. Bestehende Modellierungswerkzeuge können um semantische Annotationsfähigkeiten erweitert werden.

**Aufgabe 3.3 – Analyse der aktuellen Informationssystemlandschaft (M3–M9)**
Systematische Analyse der bestehenden IT-Systemlandschaft entlang des entwickelten Patientenpfads. Untersuchung von Informationsflüssen, beteiligten Organisationen und Nutzenden zur Identifikation von Lücken, Schwachstellen und erfolgreichen Komponenten. Die Ergebnisse dienen der strategischen Ausrichtung und Priorisierung der technischen Umsetzung.

### Liefergegenstände (Deliverables)

| ID   | Beschreibung                                       | Fälligkeit |
| ---- | -------------------------------------------------- | ---------- |
| D3.1 | Lungenkrebspatientenpfad BPMN-Modell               | M6         |
| D3.2 | Lungenkrebspatientenpfad FHIR Implementation Guide | M16        |
| D3.3 | Bericht zur aktuellen Informationssystemlandschaft | M9         |

---

## Artefakte in diesem Repository

Die BPMN-Modelle werden in zwei Formaten bereitgestellt:

- **XML** (`.xml`): Maschinenlesbare BPMN-2.0-Quelldatei, direkt bearbeitbar mit gängigen BPMN-Editoren (s. u.)
- **SVG** (`.svg`): Skalierbare Vektorgrafik zur menschenlesbaren Visualisierung, darstellbar im Browser oder in Vektorgrafik-Software

### Übergreifender Patientenpfad

| Datei                                 | Beschreibung                                                                                          |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [`lung-cancer_overarching-pathway.xml`](./lung-cancer_overarching-pathway.xml) | BPMN-Quelldatei des übergreifenden Lungenkrebspatientenpfads |
| [`lung-cancer_overarching-pathway.svg`](./lung-cancer_overarching-pathway.svg) | Visualisierung des übergreifenden Lungenkrebspatientenpfads  |

Der übergreifende Pfad bildet den vollständigen Patient:innen-Journey von der Prävention/Früherkennung bis zur Nachsorge ab und verknüpft alle Teilpfade miteinander.

### Teilpfade (Sub-Pathways)

| Datei                                                                                                                                                                   | Beschreibung                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`lung-cancer_diagnostic-subpathway.xml`](./lung-cancer_diagnostic-subpathway.xml) / [`.svg`](./lung-cancer_diagnostic-subpathway.svg)                                  | Teilpfad Diagnostik                     |
| [`lung-cancer_patient-consultation-subpathway.xml`](./lung-cancer_patient-consultation-subpathway.xml) / [`.svg`](./lung-cancer_patient-consultation-subpathway.svg)    | Teilpfad Patientengespräch / Aufklärung |
| [`lung-cancer_tumor-board-subpathway.xml`](./lung-cancer_tumor-board-subpathway.xml) / [`.svg`](./lung-cancer_tumor-board-subpathway.svg)                               | Teilpfad Tumorboard                     |
| [`lung-cancer_molecular-tumor-board-subpathway.xml`](./lung-cancer_molecular-tumor-board-subpathway.xml) / [`.svg`](./lung-cancer_molecular-tumor-board-subpathway.svg) | Teilpfad Molekulares Tumorboard         |
| [`lung-cancer_treatment-subpathway.xml`](./lung-cancer_treatment-subpathway.xml) / [`.svg`](./lung-cancer_treatment-subpathway.svg)                                     | Teilpfad Behandlung                     |
| [`lung-cancer_aftercare-subpathway.xml`](./lung-cancer_aftercare-subpathway.xml) / [`.svg`](./lung-cancer_aftercare-subpathway.svg)                                     | Teilpfad Nachsorge                      |

---

## Verwendung

Die BPMN-Modelle (`.xml`) können mit folgenden Tools geöffnet, visualisiert und weiterbearbeitet werden:

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

### Begründung der Lizenzwahl

Für Ergebnisse öffentlich geförderter Forschung empfiehlt sich **CC BY 4.0**, weil diese Lizenz:

- **maximale Nachnutzbarkeit** gewährleistet – freie Weiterverwendung, Anpassung und Verbreitung (auch kommerziell) unter der Bedingung der Namensnennung,
- den **FAIR-Prinzipien** (Findable, Accessible, Interoperable, Reusable) entspricht, wie sie von der MII und der BMFTR-Förderstrategie vorausgesetzt werden,
- den **Open-Science-Empfehlungen** der Europäischen Kommission und des BMFTR für öffentlich finanzierte Forschungsprojekte folgt,
- **breit kompatibel** mit anderen offenen Lizenzen und im Gesundheits- und Forschungsbereich weit verbreitet ist,
- die **Anerkennung der Forschungsleistung** durch die Attributionspflicht sicherstellt,
- **kompatibel mit den Vorarbeiten** ist: Die Ergebnisse des INA-Arbeitskreises stehen ebenfalls unter Creative Commons (Weitergabe mit Namensnennung), und CraNE-Ergebnisse als EU-geförderte Outputs unterliegen CC BY 4.0-Anforderungen – eine Weiterlizenzierung unter CC BY 4.0 ist daher lizenzrechtlich konsistent.

### Attribution

Bei Weiterverwendung bitte folgende Angabe verwenden:

> _Forschungsgruppe Digital Health (FGDH), Technische Universität Dresden (2025). Lungenkrebspatientenpfad – MiHUB WP3. GitHub: https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway. Lizenz: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)._

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
