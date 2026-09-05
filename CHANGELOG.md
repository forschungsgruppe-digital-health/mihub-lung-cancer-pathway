# Changelog

## [0.4.0-rc.1](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/compare/v0.3.0-rc.1...v0.4.0-rc.1) (2026-09-05)


### Pathway changes

* **citation:** add .zenodo.json (dataset) and a CITATION.cff sync check ([4048b64](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/4048b6487fa38585a6ab59edd931739dc15cc124))
* **initial-entry:** add traditional initial entry pathway (symptomatic + incidental) ([58d55b9](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/58d55b97058dc890abde5e84e041d80007ee87e8))
* **models:** initial-entry pathway (symptomatic + incidental) — tenth model ([1b191de](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/1b191def63220699cbed6e7e3c90ca295aba0631))
* **tools:** stamp the Protokoll with version.txt + git describe; harden the model guard ([62c7867](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/62c78671633b493740fc72288679b9ba44b3899a))


### Corrections

* **initial-entry:** Zufallsbefund-Deadlock behoben, CT-Entwarnung + Datenobjekte ergänzt ([87f9172](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/87f917229b8b51269bf05fe25ff8d9f76ee7994a))
* **tools:** per-file bpmnlint Linter, labelled INCONCLUSIVE elements, default-namespace prefix ([ffd5537](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/ffd55371c5e8b3eaa385b8088933b7c4263a0770))
* whole-repo verification 2026-09-04 — 24 confirmed + 38 low findings applied ([45240ea](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/45240eab3e11cc60c4d15b767ecb42096954258c))
* **xsd:** exclude BPMN4CP cp: extension elements from the XSD-core view — placement is by design ([0434ada](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/0434adac2c2864f1d9f2a1336df55c52f61be4d4))
* **xsd:** treat BPMN4CP cp: elements as by-design; add .zenodo.json (dataset) + CITATION sync check ([34430f5](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/34430f56965baa3127d0751ff39fb519ae4c43cb))


### Documentation & governance

* align agent, skill and ADR docs with the tooling as built ([0baac57](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/0baac5728b996ee96da10d81382ce2eb93d5aa21))
* apply the 2026-09-04 whole-repo verification (24 confirmed + 38 low findings) ([57ae513](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/57ae5132cacb24fb28989530cc2ce48e37d62ce7))
* **readme:** link companion data-elements repo [HOLD: merge when data-elements is public] ([01337cf](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/01337cf62f0a178a5d34c3385e397278eb84c62a))
* **readme:** link the companion data-elements repository ([d85f3b4](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/d85f3b41398d34bdf7c9cfa6a7487cce522374f2))
* refresh counts, DOI references and archive links; file XSD-core findings ([b711dc1](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/b711dc1f1152d2e184bca367d0d5cf2241d8e694))
* **synthea:** dataset-generation plan, BPMN-to-GMF primer, and data-source catalog ([7e8d928](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/7e8d9283543cfb19b617d4f3dfb1a026ce97c1fc))
* **synthea:** realign generation docs to models/ layout, read-only-model rules & conformance gate ([e982703](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/e982703b22f3c2cecafc81b9cbe3b99e3d0dbfe2))
* **synthea:** split BPMN tooling into three extension repos; drop out-of-scope assets ([9fc12ac](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/9fc12ac5522e64a4f829b13881ca6fb6f0be82c1))
* ten models — add the initial-entry pathway to inventories and counts; sync CITATION.cff version via release-please ([802fc79](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/802fc79f31044a3f50dc2302abbe9f8965afdad1))
* ten models (initial-entry) in all inventories; CITATION.cff version via release-please extra-files ([6045fd2](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/6045fd223b2fcb1fbd67a604f5e192ce9134bd44))


### Tooling & maintenance

* **release:** prepare release candidate 0.4.0-rc.1 (date-released 2026-09-05) ([c2aa563](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/c2aa56372cecadb7b030f8fe2fe7333b5ffee77d))

## [0.3.0-rc.1](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/compare/v0.2.1-rc.2...v0.3.0-rc.1) (2026-06-29)


### Pathway changes

* **models:** integrate palliative-care sub-pathway + README (cut 0.3.0-rc.1) ([f6b94a1](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/f6b94a14c202fdef005143f53e6727d289b9ca49))
* **models:** integrate palliative-care sub-pathway + README; release as 0.3.0-rc.1 ([ecb38e9](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/ecb38e91cdec7bad77b45238a4590d8102962e53))


### Documentation & governance

* **model-issues:** file palliative-care WIP conformance findings (2026-06-29) ([66310cc](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/66310cc3d4670ec4f3fdbfc68a052dfd394f28f9))
* **model-issues:** palliative-care WIP conformance findings ([b08f656](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/b08f656de0ab612cf86611d4b5175a439dc223e3))

## [0.2.1-rc.2](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/compare/v0.2.1-rc.1...v0.2.1-rc.2) (2026-06-26)


### Documentation & governance

* **citation:** wire the Zenodo concept DOI (CITATION.cff, README, instrument) ([e0daec2](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/e0daec25eb590c7c2a5e1e123f2ac6d7a8f1882c))
* **citation:** wire the Zenodo concept DOI into CITATION.cff, README + the instrument ([5efbba3](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/5efbba3124d585a9e95f15127ee20e3fd6c58cde))
* **readme:** add Zenodo DOI badge ([c7660c0](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/c7660c04465767d64dfeac95f28655e4eb169873))
* **readme:** add Zenodo DOI badge (concept/all-versions, repo-id keyed) ([1f6070a](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/1f6070a9d0d6fbd4abf8163bd0bde05192dca240))
* **release:** control the release archive (.gitattributes) + add authors/ORCIDs + sync version ([87f42bc](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/87f42bc846a15a31dba7be8f6354216798fe80b3))
* **release:** keep instrument in archive + author order (Susky first, Schlieter senior) ([74650c7](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/74650c7f7776a3257ed9b598df1f6ea74facf612))
* **release:** keep the acceptance-test instrument in the archive + set author order ([400fcd9](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/400fcd95996111f8277d582118c0ca6ef284bce3))
* **release:** release-archive control (.gitattributes) + CITATION authors/ORCIDs + version sync ([7250be2](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/7250be2d6e95caaf006dc20dfb87f83379ce9887))


### Tooling & maintenance

* release as 0.2.1-rc.2 (next candidate) ([ef3177f](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/ef3177f166fcbce036c3810887663b73e03b447a))

## [0.2.1-rc.1](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/compare/v0.2.0-rc.1...v0.2.1-rc.1) (2026-06-26)


### Corrections

* **release:** unpin release-as — stop the duplicate-tag release-please failure ([8a917c0](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/8a917c09fafdcbf4b72347c49f9e5186497b1e6c))
* **release:** unpin release-as after v0.2.0-rc.1 (stop the duplicate-tag loop) ([c8c08f4](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/c8c08f48666423e1229ca7553a97d59aaf240fad))
* **release:** unpin release-as after v0.2.0-rc.1 (stop the duplicate-tag loop) ([609441b](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/609441b23d03b2d639e7e220934b63232a5b40a8))


### Documentation & governance

* restore consistency after the terminology / RC / warn-mode changes ([d6405bc](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/d6405bc9f7b1ebdb846aa52758bcae06515ceb64))
* restore consistency after the terminology / RC / warn-mode changes ([c7a5e1d](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/c7a5e1d4f4f4809e310955c8dae7dd730b0429a5))

## [0.2.0-rc.1](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/compare/v0.2.0-rc.1...v0.2.0-rc.1) (2026-06-26)


### Documentation & governance

* restore consistency after the terminology / RC / warn-mode changes ([d6405bc](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/d6405bc9f7b1ebdb846aa52758bcae06515ceb64))
* restore consistency after the terminology / RC / warn-mode changes ([c7a5e1d](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/c7a5e1d4f4f4809e310955c8dae7dd730b0429a5))

## [0.2.0-rc.1](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/compare/v0.1.0...v0.2.0-rc.1) (2026-06-26)


### ⚠ BREAKING CHANGES

* **models:** model file paths/names changed (e.g. lung-cancer_treatment-subpathway.bpmn -> models/lung-cancer-treatment-pathway.bpmn). The team's lcs-pathway-post-workshop2-final is renamed to models/lung-cancer-screening-pathway (confirm the 'screening' term with the model author).

### Pathway changes

* **ci:** add blocking model naming-convention check (check:naming) ([af45fce](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/af45fced0c72b7682cd42d77459d94a31ef3578f))
* **governance:** add bpmn-acceptance Protokoll pre-filler (evidence only, never approves) ([590329e](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/590329ec197d1e2597735f4df5fc86f3187c4f7b))
* **governance:** guard models read-only for agents + model-issues reporting workflow ([95c95da](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/95c95da7ccbd85ddffff0043a83d0b982d1e996c))
* **release:** add release-please (simple) + CITATION.cff and validation ([c9793cb](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/c9793cbcce0135e24f6117bd70919cbdfffd4761))
* **skills:** add advisory review skills + soundness ADR (STR-1..4 deferred, piloted) ([a315c6f](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/a315c6f082c7067e4e8ccf0a485a0f1c2ae56dc2))
* **soundness:** execute STR-1..4 pilot; ship advisory soundness wrapper + CI ([d3e14f0](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/d3e14f0b31bf6e7dbbb0f4b4a9f85a7c099f436b))
* **tooling:** add BPMN conformance gate and CI ([3a3f2a0](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/3a3f2a09a44261092e8be5c4833d97c9b7de1c44))
* **tooling:** register cp: (BPMN4CP) moddle descriptor — lossless roundtrip, now blocking ([79cde22](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/79cde227b76f2896559354d351ae1e5161bed225))


### Corrections

* **governance:** land intended .en.md + Abnahmetest/acceptance-test state (PR [#37](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/37) merged a superseded head) ([c8eedd3](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/c8eedd320392f555502797bbe41eeead685e65c6))
* **governance:** land intended .en.md + Abnahmetest/acceptance-test state (stale [#37](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/issues/37) merge) ([7694b2b](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/7694b2b537f3f85ad41f4fc2dc1ea976ff799961))


### Documentation & governance

* **governance:** add clinical-use disclaimer, Abnahme governance docs and contributor on-ramp ([c30095f](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/c30095fd9768c1c148fa9d65fea569ae381ce0db))
* **governance:** add English translations of the Abnahme instrument + changelog ([cca45e3](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/cca45e347ea4d24e7caf82c46ed50ac8f94b5ab5))
* **governance:** align CONVENTIONS.md with the Abnahme instrument + translate EN filenames ([99c9867](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/99c98676babe07663dc02281eafff9fd7e87c236))
* **governance:** align CONVENTIONS.md with the Abnahme instrument + translate English filenames ([df574ff](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/df574ffa1ff308629253357fd6ec936a1a7bb8a9))
* **model-issues:** cite flagged elements by editor label, not bare id ([5237dcc](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/5237dcc212c36b8726227cd7337afd5ce1a19571))
* **model-issues:** cite flagged elements by editor label, not bare id ([a039534](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/a0395343c32c77c98d327b5f55b6da145bb75d39))
* **readme:** add CI build-status badges (conformance gate, soundness, link-check) ([fedc48a](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/fedc48a556ebf48eec9d099e60c33c817e706336))
* **readme:** CI build-status badges (ok/failed) ([ad635b3](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/ad635b3754d3cfea421cf5eb672e04a32699162b))
* **release:** document SemVer policy and edit-to-bump classification (ADR-0002) ([0a0495e](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/0a0495e0fd38b3f5ec4159b72039240fbc73c436))
* repo language policy (DE default, technical=EN, Abnahme bilingual) + bilingual issue template + reporting via tracker ([8bc768c](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/8bc768ccb82c3f23ac7713d9f28b87b1292c1f3a))
* update references for the models/ restructure + reconcile model count to 8 ([76b4ef0](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/76b4ef0d2a3f9dc7d6eb256671e1cac5fa3e6860))


### Model refactoring

* **models:** move models into models/ and adopt kebab naming (ADR-0004) ([8277cd2](https://github.com/forschungsgruppe-digital-health/mihub-lung-cancer-pathway/commit/8277cd2c8757c21e804f110034df1f6af792987a))
