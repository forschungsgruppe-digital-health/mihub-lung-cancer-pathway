---
name: BPMN model issue / BPMN-Modellproblem
about: "EN: Report a defect/change request for a .bpmn pathway model. · DE: Defekt/Änderungswunsch zu einem .bpmn-Patientenpfadmodell melden."
title: "[model] "
labels: ["model", "needs-clinical-review"]
---

<!--
EN: The .bpmn models are the clinically-validated artifact. Changes are made ONLY by a human
modeler and re-validated for face validity (Abnahme SEM-6). Skills/agents report to
docs/model-issues/ and never edit a model. Fill this in from a docs/model-issues/ finding.
DE: Die .bpmn-Modelle sind das klinisch validierte Artefakt. Änderungen erfolgen NUR durch
eine:n menschliche:n Modellierer:in und werden auf Face Validity (Abnahme SEM-6) erneut
validiert. Skills/Agenten melden nach docs/model-issues/ und bearbeiten nie ein Modell.
-->

### Affected model(s) · Betroffene(s) Modell(e)

<!-- e.g. models/lung-cancer-treatment-pathway.bpmn -->

### What was found · Befund

<!--
EN: the problem; paste tool/agent evidence (bpmnlint / metrics / soundness output, element ids).
DE: das Problem; Tool-/Agenten-Belege einfügen (bpmnlint / metrics / soundness, Element-IDs).
-->

### Abnahme criteria affected · Betroffene Abnahme-Kriterien

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
- [ ] Face validity re-confirmed (Abnahme **SEM-6**) if the clinical meaning changed · Face Validity (SEM-6) erneut bestätigt, falls sich die klinische Bedeutung geändert hat
