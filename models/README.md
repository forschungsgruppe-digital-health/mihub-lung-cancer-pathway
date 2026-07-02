# Modelle / Models

BPMN-2.0-Modelle des Lungenkrebs-Patientenpfads. Namenskonvention:
`lung-cancer-<phase>-pathway.{bpmn,svg}` (kebab-case; [ADR-0004](../docs/decisions/0004-repo-structure-and-model-naming.md);
per CI geprüft mit `npm run check:naming`). Jede `.bpmn`-Quelle hat eine zugehörige
`.svg`-Visualisierung gleichen Namens.

| Modell (`models/…`) | Phase | Beschreibung |
|---|---|---|
| `lung-cancer-overarching-pathway` | Übergreifend | übergreifender Pfad; verknüpft alle Teilpfade |
| `lung-cancer-screening-pathway` | Krebsfrüherkennung | Lung Cancer Screening (LCS) |
| `lung-cancer-diagnostic-pathway` | Diagnostik | Diagnostik-Teilpfad |
| `lung-cancer-patient-consultation-pathway` | Patientengespräch | Aufklärung |
| `lung-cancer-tumor-board-pathway` | Tumorboard | Tumorboard-Teilpfad |
| `lung-cancer-molecular-tumor-board-pathway` | Molekulares Tumorboard | molekulares Tumorboard |
| `lung-cancer-treatment-pathway` | Behandlung | Behandlungs-Teilpfad |
| `lung-cancer-palliative-care-pathway` | Palliativversorgung | Palliativ-Teilpfad _(Entwurf / WIP)_ |
| `lung-cancer-aftercare-pathway` | Nachsorge | Nachsorge-Teilpfad |

> **Abnahmetest / Status:** siehe [`../docs/governance/`](../docs/governance/).
> **Bekannte Modellprobleme:** [`../docs/model-issues/`](../docs/model-issues/).
> **Änderungen** an Modellen erfolgen ausschließlich durch Modellierer:innen (Agenten sind
> read-only, Abnahmetest SEM-6 Face Validity) — siehe [`../AGENTS.md`](../AGENTS.md) und
> [`../CONTRIBUTING.md`](../CONTRIBUTING.md).
