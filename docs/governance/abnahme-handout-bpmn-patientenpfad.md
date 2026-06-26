<!--
Repo-Pfad-Vorschlag: docs/governance/abnahme-handout-bpmn-patientenpfad.md
Begleitdokument: abnahme-checkliste-bpmn-patientenpfad.md (gleiche Kriterien-IDs)
Version: 0.2 | Sprache: DE
-->

# Handout zur Abnahmetest-Checkliste: BPMN-modellierter Patientenpfad

**Zweck.** Dieses Dokument begründet jedes Abnahmetestkriterium nachvollziehbar anhand der Quellen und illustriert es mit je einem Beispiel aus dem Lungenkarzinom-Kontext. IDs sind identisch zur Checkliste. Fachbegriffe sind im **Mini-Glossar der Checkliste** erklärt.

**Aufbau je Kriterium:** *Kriterium* → *Begründung (Quelle)* → *Beispiel*.

> Hinweis zur Quellenprüfung: 7PMG, Kinsman, SEQUAL und Soundness wurden **im Volltext** abgeglichen; OMG BPMN 2.0 und BPMN4CP gegen Spezifikations-/Abstract- und Auszugsebene (siehe Verifikationsstatus am Ende).

---

## A. Verständlichkeit & technische Korrektheit (technischer Abnahmetest)

### SYN-1 · Conformance-Klasse deklariert und eingehalten

**Kriterium.** Der angestrebte BPMN-2.0-Sprachumfang (Descriptive, Analytic, Common Executable) ist festgelegt, und das Modell nutzt nur dort zulässige Elemente.

**Begründung (Quelle).** Die OMG-Spezifikation BPMN 2.0 definiert drei aufeinander aufbauende Process-Modeling-Conformance-Unterklassen mit jeweils begrenztem Element- und Attributumfang. Ohne deklarierte Zielklasse ist nicht prüfbar, ob verschiedene Werkzeuge das Modell gleich interpretieren oder serialisieren — Inkonsistenzen bei der XML-Serialisierung zwischen Tools sind dokumentiert. Die Festlegung macht den technischen Abnahmetest erst objektivierbar.

**Beispiel.** Ein Pfad mit Timer-Event („molekulare Diagnostik binnen 14 Tagen") und Message-Event („Befund an Tumorboard") überschreitet **Descriptive**. Korrekt ist **Analytic**; soll der Pfad später von einer Engine ausgeführt werden, ist **Common Executable** nötig.

### SYN-2 · Ein Start-/ein End-Event je Ebene

**Kriterium.** Jede Prozessebene hat genau ein Start- und ein End-Event; mehrere Enden konvergieren oder sind bewusst begründet.

**Begründung (Quelle).** 7PMG-Leitlinie **G3** (Mendling, Reijers, van der Aalst 2010): Die Zahl der Start-/End-Events korreliert positiv mit der Fehlerwahrscheinlichkeit. Zwei weitere Gründe nennen die Autoren ausdrücklich: Die meisten Workflow-Engines verlangen einen einzigen Start-/Endknoten, und genau ein Start/Ende erleichtert Verständnis **und** ermöglicht erst Analysen wie den Soundness-Check.

**Beispiel.** Ein Pfad, der parallel in „Kurative Therapie eingeleitet" und „Best Supportive Care eingeleitet" endet, läuft auf ein gemeinsames End-Event „Therapieentscheidung dokumentiert" zu — statt zweier loser Enden.

### SYN-3 · Verb-Objekt-Labels

**Kriterium.** Aktivitäten sind als Verb + Objekt benannt.

**Begründung (Quelle).** 7PMG-Leitlinie **G6**: In einem Experiment mit 29 Postgraduierten (Eindhoven) wurden Verb-Objekt-Labels als signifikant weniger mehrdeutig und nützlicher bewertet als substantivische („action-noun") Labels. Es ist laut den Autoren die einzige der gängigen Labelregeln, die operationalisiert und empirisch belegt ist.

**Beispiel.** Anti-Muster: „Histologie", „Tumorboard". Muster: „**Histologie befunden**", „**Fall im Tumorboard vorstellen**". Aus „Diagnostik" wird „**Bildgebung durchführen**".

### SYN-4 · ≤ 50 Elemente / Dekomposition

**Kriterium.** Kein Diagramm überschreitet ~50 Elemente; größere Pfade sind über Call Activities zerlegt.

**Begründung (Quelle).** 7PMG-Leitlinie **G7**: Größe ist ein wesentlicher Treiber der Fehlerwahrscheinlichkeit; in einer Sammlung von ~2000 Industriemodellen lag sie ab > 50 Elementen über 50 %. Zum Einordnen: Reale Modellierungsprojekte weisen ohnehin Fehlerquoten von 10–20 % auf. Dekomposition hält Teilmodelle verständlich und prüfbar.

**Beispiel.** Der Block „molekulare Diagnostik" (Probengewinnung, NGS-Anforderung, Befundung, Freigabe, Wiedervorlage) wird als eigenes Subprozess-Diagramm ausgelagert und im Hauptpfad als Call Activity „Molekulare Diagnostik durchführen" referenziert.

### SYN-5 · Struktur, minimales Routing, keine OR-Gateways

**Kriterium.** Modell ist möglichst block-strukturiert, der Knotengrad gering, OR-Gateways werden vermieden oder begründet.

**Begründung (Quelle).** 7PMG **G4** (von 21 befragten Profi-Modellierern als wirksamste Leitlinie gerankt): Ein Modell ist *strukturiert*, wenn **jeder Split-Konnektor einen Join-Konnektor gleichen Typs** hat — die Autoren vergleichen das mit **balancierten Klammern** (jede öffnende hat eine passende schließende). Ergänzend **G2** (hoher Knotengrad korreliert stark mit Fehlern) und **G5** (die OR-Join-Semantik ist mehrdeutig und führt zu Paradoxien/Implementierungsproblemen). Hinweis der Autoren: G2 nur in Extremfällen anwenden, da es G1 (weniger Elemente) entgegenläuft.

**Beispiel.** Statt eines OR-Gateways „ggf. Bestrahlung und/oder Chemotherapie" werden zwei explizite, sauber gepaarte Verzweigungen mit eindeutigen Bedingungen modelliert („Stadium III → Radiochemotherapie", „Stadium IV → systemische Therapie").

### STR-1…STR-4 · Soundness (logische Fehlerfreiheit)

**Kriterium.** Das Modell ist *sound*: jeder Durchlauf kann das Ende erreichen (STR-1), am Ende verbleiben keine aktiven Token (STR-2), keine toten/unerreichbaren Aktivitäten (STR-3), kein Deadlock/Livelock (STR-4).

**Begründung (Quelle).** Soundness ist das etablierte Korrektheitskriterium für Prozessmodelle (van der Aalst), abgeleitet über die Petri-Netz-Eigenschaften Liveness und Boundedness. Fahland et al. (2011, *Data & Knowledge Engineering* 70, 448–466) zeigen, dass diese Eigenschaften für realistische Industriemodelle praktisch sofort automatisiert prüfbar sind („Analysis on demand"). Soundness ist der objektivierbare Kern des technischen Abnahmetests — am besten per Werkzeug geprüft.

**Beispiel (Deadlock, STR-4).** Nach „Staging abschließen" öffnet ein **AND-Split** zwei Zweige (Pathologie, Radiologie); zusammengeführt werden sie fälschlich mit einem **XOR-Join**. Der XOR-Join feuert beim ersten eintreffenden Token, das zweite bleibt liegen → STR-2 verletzt. Umgekehrt erzeugt ein **AND-Join nach XOR-Split** einen Deadlock (wartet ewig auf einen Zweig, der nie aktiviert wurde). Regel: gleichen Gateway-Typ paaren.

---

## B. Klinische Inhaltsvalidität (klinischer Abnahmetest)

> Grundlage B.1: Kinsman, Rotter, James, Snow, Willis (2010): *What is a clinical pathway? Development of a definition to inform the debate.* **BMC Medicine** 8:31 — fünf Kriterien, entwickelt in Abstimmung mit der European Pathways Association. Operationalisierung (im Volltext bestätigt): Kriterium 1 (Muss) plus ≥ 3 der übrigen vier.

### SEM-1 · Multidisziplinärer Plan, Rollen als Lanes

**Kriterium.** Strukturierter, multidisziplinärer Behandlungsplan; alle beteiligten Disziplinen sind abgebildet.

**Begründung (Quelle).** Kinsman-Kriterium 1 — das einzige verpflichtende: Ohne abgebildete Multidisziplinarität ist es definitionsgemäß kein klinischer Pfad. BPMN4CP (Braun et al. 2014) betont, dass die geteilten Aktivitäten über Rollen hinweg den Kern der Pfadmodellierung bilden.

**Beispiel.** Lanes für **Pneumologie, Radiologie, Pathologie, Thoraxchirurgie, (Hämato-)Onkologie, Palliativmedizin** und **Patient:in**; das Tumorboard erscheint als rollenübergreifende Aktivität.

### SEM-2 · Leitlinien-/Evidenzrückbindung

**Kriterium.** Je relevantem Schritt ist die zugrunde liegende Leitlinie/Evidenz benannt.

**Begründung (Quelle).** Kinsman-Kriterium 2: Ein Pfad „kanalisiert" die Übersetzung von Leitlinien/Evidenz in lokale Strukturen. Die Rückbindung macht klinische Korrektheit überprüfbar.

**Beispiel.** „Molekulare Diagnostik anfordern" trägt eine Annotation mit Verweis auf die **S3-Leitlinie Lungenkarzinom** bzw. **nNGM**-Empfehlung; die Fundstelle wird im Reviewprotokoll dokumentiert.

### SEM-3 · Vollständigkeit der Schritte

**Kriterium.** Die wesentlichen Schritte des Behandlungsverlaufs sind abgebildet.

**Begründung (Quelle).** Kinsman-Kriterium 3 verlangt die Detaillierung der Schritte als „inventory of actions". Lücken führen in der Versorgung zu undefiniertem Verhalten.

**Beispiel.** Reviewer prüfen, dass nach Therapieeinleitung auch **Restaging** und **strukturierte Nachsorge** modelliert sind und nicht implizit unterstellt werden.

### SEM-4 · Zeitrahmen / kriterienbasierte Progression

**Kriterium.** Übergänge sind an Fristen oder explizite Kriterien geknüpft.

**Begründung (Quelle).** Kinsman-Kriterium 4: Schritte werden ausgelöst, wenn definierte Kriterien erfüllt sind — das unterscheidet einen Pfad von einer bloßen Aktivitätssammlung.

**Beispiel.** Bedingtes Gateway „**molekularer Befund vollständig?**"; bei „nein nach 14 Tagen" Eskalation über ein Timer-Event statt undefinierten Wartens.

### SEM-5 · Zielpopulation / Standardisierung

**Kriterium.** Zielpopulation und Standardisierungsziel sind abgegrenzt.

**Begründung (Quelle).** Kinsman-Kriterium 5: Ein Pfad standardisiert die Versorgung einer **spezifischen** Population/Problemstellung. Ohne Abgrenzung ist Vollständigkeit nicht beurteilbar.

**Beispiel.** Geltungsbereich-Annotation: „**NSCLC, Stadium III–IV, Erstdiagnose**"; SCLC und Rezidive sind explizit ausgenommen.

### SEM-6 · Klinische Korrektheit / Face Validity (Konsens)

**Kriterium.** Das Modell wurde mit Fachexpert:innen iterativ bis zum Konsens validiert.

**Begründung (Quelle).** Validierung („das *richtige* Modell") ist — anders als die automatisierbare Verifikation — auf Domänenexpertise angewiesen. Belegtes Vorgehen: Benevento et al. (2023) validierten ihr normatives BPMN-Modell qualitativ in mehreren Sitzungen mit Ärzt:innen der Intensiv-/Intermediate-Care und verfeinerten es, bis alle zustimmten.

**Beispiel.** Das Pfadmodell wird in zwei bis drei moderierten Sitzungen im Tumorboard vorgestellt; Änderungswünsche werden versioniert eingearbeitet, bis das Board einstimmig freigibt (Protokoll als Abnahmetestnachweis).

### SEM-7 · Domänenspezifische Artefakte (BPMN4CP)

**Kriterium.** Soweit zutreffend sind Ressourcen, Dokumente, Ziele und Qualitätsindikatoren erfasst.

**Begründung (Quelle).** BPMN4CP (Braun et al. 2014; revidiert 2015/2016) erweitert BPMN gezielt um diese CP-spezifischen Konzepte, weil das generische BPMN sie nicht abbildet. Sie werden bewusst auf perspektivische Teildiagramme verteilt, um Komplexität zu beherrschen (siehe Anhang).

**Beispiel.** An „Systemtherapie einleiten" hängen: benötigtes **Dokument** (Befundbericht Molekularpathologie), erforderliche **Ressource** (Bündel „Bildgebung"), **Qualitätsindikator** („Zeit von Diagnose bis Therapiebeginn").

---

## C. Verständlichkeit für beide Seiten (gemeinsamer Abnahmetest)

### PRA-1 · Verständlichkeit für klinische und technische Adressaten

**Kriterium.** Das Modell ist für beide Adressatengruppen gleichermaßen verständlich.

**Begründung (Quelle).** SEQUAL (Lindland, Sindre, Sølvberg 1994; erweitert durch Krogstie et al.) definiert **pragmatische Qualität** als Übereinstimmung zwischen Modell und Interpretation der Adressaten — ausdrücklich getrennt nach *sozialer* (hier klinischer) und *technischer* Audience. Genau diese Doppel-Verständlichkeit ist das gemeinsame Abnahmetestkriterium. (7PMG bezeichnet SEQUAL als wertvoll, aber für Einsteiger zu abstrakt — deshalb ergänzt die Checkliste konkrete 7PMG-Items.)

**Beispiel.** Im gemeinsamen Walkthrough paraphrasiert je eine klinische und eine technische Person denselben Pfadabschnitt; weichen die Interpretationen ab (z. B. Bedeutung eines Gateways), wird Modell oder Beschriftung nachgeschärft.

### PRA-2 · Stakeholderspezifische Teilsichten

**Kriterium.** Es existieren adressatengerechte Teilsichten.

**Begründung (Quelle).** BPMN4CP ordnet Konzepte verschiedenen Perspektiven/Diagrammen zu, um für die jeweiligen Stakeholder passende Diagramme bereitzustellen (sinngemäß). Dasselbe Element kann je Diagramm unterschiedlich (Form, Detailgrad) dargestellt werden.

**Beispiel.** Eine **klinische Übersichtssicht** (Lanes, Hauptschritte, ohne technische Attribute) und eine **technische Sicht** (Datenobjekte, Message Flows, Ausführungsattribute) desselben Pfads.

### PRA-3 · Relevanz

**Kriterium.** Keine für den Abnahmetestzweck überflüssigen Elemente.

**Begründung (Quelle).** GoM-Grundsatz **Relevanz** (Becker, Rosemann, Schütte 1995) und 7PMG **G1** („so wenige Elemente wie möglich"): Überflüssige Elemente erhöhen kognitive Last und Fehlerrisiko ohne Erkenntnisgewinn. Im 7PMG-Beispiel sank die Elementzahl durch Anwendung von G1 von 37 auf 31, ohne die Logik zu verändern.

**Beispiel.** Rein dekorative Zwischenereignisse oder doppelt geführte Hilfsaktivitäten, die für die Abnahmetestentscheidung irrelevant sind, werden entfernt oder in eine Detailsicht verschoben.

---

## Anhang: Zusammenfassung des BPMN4CP-Papers

**Quellen (alle: Lehrstuhl für Wirtschaftsinformatik, insb. Systementwicklung, TU Dresden — über das TU-Dresden-Forschungsportal bestätigt).**
- Original: Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2014): *BPMN4CP: Design and implementation of a BPMN extension for clinical pathways.* Proc. IEEE Int. Conf. on Bioinformatics and Biomedicine (BIBM), S. 9–16.
- Revidiert: Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2016): *BPMN4CP Revised – Extending BPMN for Multi-perspective Modeling of Clinical Pathways.* 49th Hawaii International Conference on System Sciences (HICSS), S. 3249–3258. DOI 10.1109/HICSS.2016.407.
- Begleitend (Erweiterungsmethode/Anforderungstypen): Braun, R.; Esswein, W. (2015): *Extending a Business Process Modeling Language for Domain-Specific Adaptation in Healthcare.* Wirtschaftsinformatik, S. 468–481.

**Problem & Motivation.** Klinische Pfade (CPs) lassen sich als Geschäftsprozesse eines Krankenhauses auffassen; ihre Modellierung verspricht Nutzen für Systemintegration, Qualitätsmanagement und Dokumentation. BPMN ist dafür attraktiv (ausdrucksstark, klar definiertes Meta-Modell, Workflow-Integration), aber **generisch**: Es fehlen domänenspezifische CP-Konzepte (z. B. Evidenzindikatoren, Ressourcen, klinische Restriktionen). Die Autoren adressieren ausdrücklich **zwei Stakeholder-Gruppen** mit gegensätzlichem Wissen: medizinisches Personal als Domänenexpert:innen (wenig Modellierungserfahrung) und Prozessanalyst:innen als IT-Expert:innen (wenig medizinisches Wissen). Das Framework ist „human-centric" für gemischte Teams ausgelegt.

**Methode.** Design-Science-Research (Hevner); die BPMN-Erweiterungsmethode von Stroppi et al. (2011) wird genutzt und systematisch erweitert. Grundlage des Domänenverständnisses sind u. a. die fünf konstitutiven CP-Merkmale nach Kinsman et al. (2010). Aus einer Domänen-Ontologie/einem konzeptuellen Domänenmodell wird der Erweiterungsbedarf abgeleitet und ein valides BPMN-Erweiterungs-Meta-Modell konstruiert. Die revidierte Fassung durchlief eine Iteration anhand der praktischen Anwendung in einem telemedizinischen Projekt.

**Inhalt der Erweiterung (revidiert).** Integriert werden **Ressourcen, Dokumente, Ziele und Qualitätsindikatoren**. Ressourcen können als **Resource Bundles** modelliert werden (Beispiel: „CT" als Bündel untergeordneter Ressourcen) samt Relationen (z. B. komplementär/substitutiv). Diese Konzepte werden gezielt **Perspektiven und Teildiagrammen** zugeordnet (u. a. Prozess-, Ressourcen-, Dokumenten-Perspektive) — zur **Komplexitätsbeherrschung** und um **stakeholdergerechte Diagramme** bereitzustellen. Dasselbe Element kann je Diagramm unterschiedlich dargestellt werden (Form und Detailgrad variieren). Umgesetzt ist alles als wiederverwendbare **BPMN-Meta-Modell-Erweiterung** (BPMN4CP 2.0).

**Demonstration.** Die beiden Fassungen nutzen unterschiedliche Beispiele: die **Originalfassung 2014** demonstriert BPMN4CP an einer **Weisheitszahn-Behandlung**, die **Revised-Fassung 2016** an einem (vereinfachten) **Schlaganfall-Pfad** — dort referenziert die Aktivität „Stroke Diagnosis" das Ressourcenbündel „CT", und Ressourcen- sowie Dokumenten-Perspektive werden in eigenen Diagrammen gezeigt.

**Relevanz für diese Checkliste.** BPMN4CP begründet **SEM-7** (domänenspezifische Artefakte) und **PRA-2** (mehrperspektivische, stakeholderspezifische Teilsichten) und stützt die der gesamten Checkliste zugrunde liegende **Zwei-Adressaten-Logik** (klinisch/technisch).

---

## Quellen & Verifikationsstatus

**Im Volltext abgeglichen:**

1. **7PMG** — Mendling, J.; Reijers, H. A.; van der Aalst, W. M. P. (2010): *Seven process modeling guidelines (7PMG)*. Information and Software Technology 52(2), 127–136. *(Volltext geprüft: G1–G7; G4 = „balanced brackets"; G3-Begründung inkl. Engine-Anforderung; > 50 Elemente ⇒ Fehlerwahrscheinlichkeit > 50 %; reale Fehlerquote 10–20 %; Experten-Ranking G4>G7>G1>G6>G2>G3>G5 aus 21 Modellierern; G6-Experiment mit 29 Postgraduierten; Beispiel 37→31 Elemente.)*
2. **Kinsman et al. (2010)** — *What is a clinical pathway?* BMC Medicine 8:31. *(Volltext/PMC geprüft: fünf Kriterien + Operationalisierung „1 + ≥ 3".)*
3. **SEQUAL** — Lindland, O. I.; Sindre, G.; Sølvberg, A. (1994): *Understanding quality in conceptual modeling*. IEEE Software 11(2), 42–49; erweitert: Krogstie et al. (1995/2006). *(Definitionen syntaktisch/semantisch/pragmatisch geprüft; pragmatisch getrennt nach social/technical audience.)*
4. **Soundness** — van der Aalst (Soundness-Kriterium); Fahland, D. et al. (2011): *Analysis on demand: Instantaneous soundness checking of industrial business process models*. Data & Knowledge Engineering 70, 448–466. *(Eigenschaften und automatisierte Prüfbarkeit geprüft.)*

**Gegen Spezifikation/Abstract/Auszüge abgeglichen (nicht vollständiger Fließtext):**

5. **OMG BPMN 2.0** — Process-Modeling-Conformance-Unterklassen Descriptive/Analytic/Common Executable. *(Über ontologische Analyse u. Sekundärquellen verifiziert.)*
6. **BPMN4CP** — Braun, R.; Schlieter, H.; Burwitz, M.; Esswein, W. (2014), IEEE BIBM, S. 9–16; **Revised** (2016), HICSS 49, S. 3249–3258, DOI 10.1109/HICSS.2016.407. *(Bibliografische Eckdaten — Autoren, Venues, Seiten, DOI, TU-Dresden-Affiliation — über IEEE Xplore und das TU-Dresden-Forschungsportal verifiziert. Methodik, Erweiterungsinhalte und Stakeholder-Logik aus Abstracts, Abbildungsunterschriften und Referenzlisten mehrerer Quellen abgeglichen. **Korrektur ggü. v0.2:** Revised = HICSS 2016 (nicht „2015/2016"); Demo-Beispiel 2014 = Weisheitszahn, 2016 = Schlaganfall. Der vollständige Artikelkörper ist hinter der IEEE-Paywall und konnte trotz mehrerer Anläufe nicht im Volltext gelesen werden; abbildungsbezogene Details sind paraphrasiert.)*
7. **STAKOB-Validierungsmuster** — Benevento et al. (2023): *Process Modeling and Conformance Checking in Healthcare: A COVID-19 Case Study* (Springer). *(Iterative qualitative Validierung bis Konsens geprüft.)*
8. **GoM** — Becker, J.; Rosemann, M.; Schütte, R. (1995): *Grundsätze ordnungsmäßiger Modellierung*. Wirtschaftsinformatik 37(5), 435–445. *(Sechs Grundsätze — Korrektheit, Klarheit, Relevanz, Vergleichbarkeit, Wirtschaftlichkeit, systematischer Aufbau — über 7PMG-Volltext und Sekundärquellen bestätigt; deutscher Originaltext nicht direkt eingesehen.)*

**Hinweise.** „Good BPMN" (correctness, clarity, completeness, consistency) nach B. Silver ist eine Praktiker-Heuristik (Sekundärquelle) und hier nur nachrangig (über GoM/7PMG) abgedeckt. Eine Sekundärquelle nannte für G7 fälschlich „30 Elemente" — die Originalquelle sagt **50**.

*Stand der Inhalte: Quellenverifikation, keine Tool-Erprobung. Beispiele sind illustrativ und nicht klinisch abgenommen.*
