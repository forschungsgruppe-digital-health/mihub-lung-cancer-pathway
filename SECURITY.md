# Security policy

## Scope

This repository publishes **BPMN 2.0 models and documentation**. There is **no runtime
component**: nothing here is deployed, executed against patient data, or exposed as a service.
The security-relevant surface is therefore small:

- **Supply chain of the dev/CI tooling** — the npm devDependencies in `package.json`
  (bpmnlint, bpmn-moddle) and the scripts in `tools/`, the SHA-pinned GitHub Actions in
  `.github/workflows/` (kept current by Dependabot), and the digest-pinned model-checker
  container used by `npm run check:soundness`.
- **Content integrity of the models** — a `.bpmn`/`.svg` that has been tampered with or that
  silently diverges from the reviewed version. Mitigations: models are changed by humans only,
  through reviewed pull requests; the conformance gate and the roundtrip check run in CI; releases
  are tagged and archived on Zenodo with a DOI.

## Reporting a vulnerability

Please report security concerns **privately** — do not open a public issue.

- E-mail **digital-health@tu-dresden.de** (Forschungsgruppe Digital Health, TU Dresden), or
- use GitHub **private vulnerability reporting** on this repository once it is enabled
  (*Security → Report a vulnerability*); until then, please use e-mail.

Include what you found, where (file, commit, workflow), and how to reproduce it.

## Out of scope

- **Clinical validity** of the pathway models. They are research, education and
  interoperability-reference artifacts and are not validated for patient care — see
  [`DISCLAIMER.md`](DISCLAIMER.md). Modelling defects go through the issue tracker (BPMN model
  issue template), not through this policy.
- Vulnerabilities in third-party editors (bpmn.io, Camunda Modeler) — please report those
  upstream.

## What to expect

This is a research project without a dedicated security team. We respond on a **best-effort**
basis, aim to acknowledge a report within a few working days, and credit reporters in the
release notes if they wish. Fixes ship with the next release.
