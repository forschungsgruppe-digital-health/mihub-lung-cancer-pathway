---
name: BPMN model issue
about: A defect or change request for a .bpmn pathway model (filed by a human after a tool/agent reported it)
title: "[model] "
labels: ["model", "needs-clinical-review"]
---

<!--
The .bpmn models are the clinically-validated artifact. Changes are made ONLY by a human
modeler and re-validated for face validity (Abnahme SEM-6). Skills/agents REPORT issues to
docs/model-issues/ and never edit a model. Fill this in from a docs/model-issues/ finding.
-->

### Affected model(s)

<!-- e.g. lung-cancer_treatment-subpathway.bpmn -->

### What was found

<!-- the problem; paste the tool/agent evidence: bpmnlint / metrics / soundness output, element ids -->

### Abnahme criteria affected

<!-- e.g. SYN-5 (no OR-gateway), STR-1 (option to complete), STR-3 (no dead activities), SYN-2 (one start/end) -->

### Suggested remodeling (for a human modeler)

<!-- proposed fix — NOT to be applied by an agent -->

### Done when

- [ ] Remodeled by a human modeler
- [ ] `.svg` re-exported and committed alongside the `.bpmn`
- [ ] `npm run check:conformance` (and, if relevant, `npm run check:soundness`) re-run
- [ ] Face validity re-confirmed (Abnahme **SEM-6**) if the clinical meaning changed
