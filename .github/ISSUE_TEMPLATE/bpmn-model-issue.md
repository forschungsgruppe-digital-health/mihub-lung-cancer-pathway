---
name: BPMN model issue / BPMN-Modellproblem
about: "EN: Report a defect/change request for a .bpmn pathway model. · DE: Defekt/Änderungswunsch zu einem .bpmn-Patientenpfadmodell melden."
title: "[model] "
labels: ["model", "needs-clinical-review"]
---

> ⚠️ **Bitte keine personenbezogenen Daten und keine Gesundheitsdaten einzelner Personen** (auch nicht in Screenshots oder Anhängen) in Issues oder Kommentare schreiben — dieses Repository ist öffentlich. Bitte Fälle nur allgemein und anonymisiert beschreiben. · **Do not post personal or health data of individuals** (including in screenshots or attachments) — this repository is public. Describe cases in general, anonymised terms only.

> Für rein **inhaltliche/medizinische** Hinweise ohne Werkzeug-Ausgaben bitte die Vorlage „Klinische Rückmeldung" verwenden. · For purely clinical feedback use the „Klinische Rückmeldung" template.

<!--
EN: The .bpmn models are the human-authored source artefact and are NOT clinically validated
(see DISCLAIMER.md). Their clinical content changes only through a human modeller, and every
change is re-confirmed for face validity in the acceptance test (SEM-6). Skills/agents report
to docs/model-issues/ and never edit a model. Fill this in from a docs/model-issues/ finding.
DE: Die .bpmn-Modelle sind das von Menschen erstellte Quellartefakt und sind NICHT klinisch
validiert (siehe DISCLAIMER.md). Ihr klinischer Inhalt ändert sich ausschließlich durch
eine:n menschliche:n Modellierer:in, und jede Änderung wird im Abnahmetest erneut auf Face
Validity (SEM-6) bestätigt. Skills/Agenten melden nach docs/model-issues/ und bearbeiten nie
ein Modell. Bitte aus einem Befund in docs/model-issues/ ausfüllen.
-->

### Affected model(s) · Betroffene(s) Modell(e)

<!-- e.g. models/lung-cancer-treatment-pathway.bpmn -->

### What was found · Befund

<!--
EN: the problem; paste tool/agent evidence (bpmnlint / metrics / soundness output, element ids).
DE: das Problem; Tool-/Agenten-Belege einfügen (bpmnlint / metrics / soundness, Element-IDs).
-->

### Acceptance-test criteria affected · Betroffene Abnahmetest-Kriterien

<!-- e.g. SYN-5 (no OR-gateway), STR-1 (option to complete), STR-3 (no dead activities), SYN-2 -->

### Suggested remodeling (human modeler) · Vorgeschlagene Ummodellierung (durch Modellierer:in)

<!--
EN: proposed fix — NOT to be applied by an agent.
DE: Lösungsvorschlag — NICHT durch eine:n Agenten umzusetzen.
-->

### Done when · Erledigt, wenn

- [ ] Remodeled by a human modeler · Durch Modellierer:in umgesetzt
- [ ] `.svg` re-exported & committed · `.svg` neu exportiert & committet
- [ ] `npm run check:conformance` (and · und `npm run check:soundness`) re-run
- [ ] Face validity re-confirmed (acceptance test **SEM-6**) if the clinical meaning changed · Face Validity (SEM-6) erneut bestätigt, falls sich die klinische Bedeutung geändert hat
