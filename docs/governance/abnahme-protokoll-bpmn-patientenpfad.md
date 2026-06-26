<!--
Repo-Pfad-Vorschlag: docs/governance/abnahme-protokoll-bpmn-patientenpfad.md
Grundlage (Kriterien & Begründung): abnahme-checkliste-bpmn-patientenpfad.md (Instrument v0.3.1),
abnahme-handout-bpmn-patientenpfad.md
Protokoll-Vorlage Version: 1.0
-->

# Abnahmetestprotokoll — BPMN-modellierter Patientenpfad

*Auszufüllen im Abnahmetesttermin. Kriteriengrundlage: Instrument v0.3.1 (IDs identisch). Bei Unklarheit zu einem Kriterium siehe Handout.*

## 0. Rahmendaten

| Feld | Eintrag |
|---|---|
| Pfad / Modellname | |
| Modellversion / Commit-Hash | |
| Artefakt-/Repository-Link | |
| Ziel-Conformance-Klasse | ☐ Descriptive ☐ Analytic ☐ Common Executable |
| Datum / Ort des Abnahmetests | |
| Kriteriengrundlage | Abnahmetest-Instrument v0.3.1 |
| Protokoll-ID | |

### Teilnehmende

| Name | Rolle | Anwesend |
|---|---|---|
| | Klinischer Lead | ☐ |
| | Technischer Lead | ☐ |
| | Fachexpert:in (klinisch) | ☐ |
| | Moderation / Protokoll | ☐ |
| | | ☐ |

---

## 1. Prüfergebnisse

**Ergebnis-Codes:** ✓ erfüllt · ✗ nicht erfüllt · – nicht zutreffend (begründen). **M** = Muss, **S** = Soll. **Methode:** A = Tool, R = Review, K = Konsens.

### A · Technisch (Verständlichkeit & Korrektheit)

| ID | Kriterium | M/S | Methode | Ergebnis | Beleg / Bemerkung |
|---|---|---|---|---|---|
| SYN-1 | Conformance-Klasse deklariert & eingehalten | M | A | ☐✓ ☐✗ ☐– | |
| SYN-2 | Genau ein Start-/ein End-Event | M | A/R | ☐✓ ☐✗ ☐– | |
| SYN-3 | Verb-Objekt-Labels | S | R | ☐✓ ☐✗ ☐– | |
| SYN-4 | ≤ 50 Symbole / dekomponiert | S | A | ☐✓ ☐✗ ☐– | |
| SYN-5 | Gepaarte Verzweigungen, kein OR | S | A/R | ☐✓ ☐✗ ☐– | |
| STR-1 | Jeder Durchlauf erreicht das Ende | M | A | ☐✓ ☐✗ ☐– | |
| STR-2 | Keine offenen Parallelzweige am Ende | M | A | ☐✓ ☐✗ ☐– | |
| STR-3 | Keine toten/unerreichbaren Aktivitäten | M | A | ☐✓ ☐✗ ☐– | |
| STR-4 | Kein Deadlock/Livelock | M | A | ☐✓ ☐✗ ☐– | |

Soundness-Tool / Version: ________________  Lauf-Ergebnis: ☐ grün ☐ Befunde (s. Bemerkung)

### B · Klinisch (Inhaltsvalidität)

| ID | Kriterium | M/S | Methode | Ergebnis | Beleg / Bemerkung |
|---|---|---|---|---|---|
| SEM-1 | Multidisziplinär (alle Disziplinen als Lane) | M | R | ☐✓ ☐✗ ☐– | |
| SEM-2 | Leitlinien-/Evidenzbezug vermerkt | S* | R | ☐✓ ☐✗ ☐– | |
| SEM-3 | Wesentliche Schritte vollständig | S* | R | ☐✓ ☐✗ ☐– | |
| SEM-4 | Übergänge an Fristen/Kriterien geknüpft | S* | R | ☐✓ ☐✗ ☐– | |
| SEM-5 | Zielpopulation/Standardisierung abgegrenzt | S* | R | ☐✓ ☐✗ ☐– | |
| SEM-6 | Face Validity: Konsens der Fachexpert:innen | M | K | ☐✓ ☐✗ ☐– | |
| SEM-7 | Domänen-Artefakte erfasst | S | R | ☐✓ ☐✗ ☐– | |

### C · Pragmatisch (gemeinsam)

| ID | Kriterium | M/S | Methode | Ergebnis | Beleg / Bemerkung |
|---|---|---|---|---|---|
| PRA-1 | Beide Seiten verstehen das Modell gleich | M | R | ☐✓ ☐✗ ☐– | |
| PRA-2 | Übersichts- und Detailsicht vorhanden | S | R | ☐✓ ☐✗ ☐– | |
| PRA-3 | Keine überflüssigen Elemente | S | R | ☐✓ ☐✗ ☐– | |

---

## 2. Gate-Auswertung

| Gate | Bedingung | Ergebnis | Begründung bei „nicht erfüllt" |
|---|---|---|---|
| Technisch | SYN-1, SYN-2, STR-1…STR-4 alle ✓ | ☐ erfüllt ☐ nicht erfüllt | |
| Klinisch | SEM-1 ✓ **und** ≥ 3 von 4 aus {SEM-2…SEM-5} ✓ **und** SEM-6 ✓ | ☐ erfüllt ☐ nicht erfüllt | |
| Pragmatisch | PRA-1 ✓ | ☐ erfüllt ☐ nicht erfüllt | |

*Kinsman-Gate-Zählung: erfüllte Kriterien aus {SEM-2, SEM-3, SEM-4, SEM-5} = ____ / 4.*

---

## 3. Auflagen & offene Punkte (Soll-Abweichungen / Bedingungen)

| Nr | Bezug (ID) | Punkt / Mangel | Maßnahme | Verantwortlich | Frist | Status |
|---|---|---|---|---|---|---|
| 1 | | | | | | ☐ offen ☐ erledigt |
| 2 | | | | | | ☐ offen ☐ erledigt |
| 3 | | | | | | ☐ offen ☐ erledigt |

---

## 4. Abnahmetestentscheidung

☐ **Angenommen** — alle drei Gates erfüllt, keine offenen Punkte.
☐ **Angenommen mit Auflagen** — alle drei Gates erfüllt; offene Soll-Punkte gemäß §3 mit Frist.
☐ **Abgelehnt** — mindestens ein Gate nicht erfüllt (offenes Muss-Kriterium).

**Begründung der Entscheidung:**

_____________________________________________________________

**Termin Nachprüfung / Re-Abnahmetest (falls Auflagen oder Ablehnung):** ____________

> Entscheidungsregel: Ein offenes **Muss**-Kriterium schließt „Angenommen mit Auflagen" aus. „Mit Auflagen" ist nur bei offenen **Soll**-Punkten zulässig.

---

## 5. Unterschriften

| Rolle | Name | Datum | Unterschrift |
|---|---|---|---|
| Klinischer Lead | | | |
| Technischer Lead | | | |
| Moderation / Protokoll | | | |

---

## 6. Anlagen / Verweise

- ☐ Modellexport / Diagramm (Datei, Version)
- ☐ Soundness-/Analyse-Report (Tool, Datum)
- ☐ Protokoll der klinischen Validierungssitzung(en) (Beleg zu SEM-6)
- ☐ Abnahmetest-Instrument v0.3.1 · ☐ Begleit-Handout

*Dieses Protokoll dokumentiert einen einzelnen Abnahmetest. Frühere Abnahmetests desselben Pfads bleiben als eigene Protokolle erhalten (Versionsnachvollziehbarkeit).*
