<!--
One logical change per PR, into `dev`. Keep the diff reviewable.
See CONTRIBUTING.md and docs/governance/ for the acceptance criteria.
-->

## What & why

<!-- What does this PR change, and why? Link any issue. -->

## Type of change

- [ ] Model change (`.bpmn`) — **`.svg` re-exported and committed**
- [ ] Documentation / governance
- [ ] Tooling / CI
- [ ] Other:

## Conformance gate

- [ ] `npm run check:conformance` run locally; output reviewed
- [ ] No **new** bpmnlint errors introduced
- [ ] No **new** OR-gateway / `complexGateway` introduced (Abnahme **SYN-5**)

## Abnahme — Muss criteria touched by this change

<!-- Tick only what this PR affects; full sign-off uses docs/governance/abnahme-protokoll-…md -->

- [ ] **SYN-1** declared conformance class (Analytic) still holds
- [ ] **SYN-2** one start / named end event(s) per level
- [ ] **STR-1…4** soundness not regressed (option-to-complete, proper completion, no dead nodes, no deadlock) — *human check until the soundness gate lands*
- [ ] **SEM-1** multidisciplinary roles as lanes (if applicable)
- [ ] **SEM-6** clinical face validity unaffected, or flagged for expert review
- [ ] Conventional Commit message, scope = pathway file

## Rules

- [ ] No real patient data (synthetic / abstract only)
- [ ] Intended-use / `DISCLAIMER.md` not weakened
- [ ] Attribution / licence preserved (CC BY 4.0)
- [ ] Targeting `dev` (not `main`); not self-merging
