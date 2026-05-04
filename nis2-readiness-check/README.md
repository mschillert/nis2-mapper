# NIS2 Readiness Check

**Wie gut deckt deine ISO 27001:2022-Umsetzung die NIS2-Anforderungen ab?**

Ein kostenloses Open-Source-Tool von [DextraData GRC Technologies GmbH](https://www.dextradata.com), das den Deckungsgrad zwischen ISO 27001:2022 Annex A und den NIS2-Maßnahmenanforderungen (Artikel 21) transparent darstellt.

🔗 **[Live-Demo →](https://mschillert.github.io/nis2-mapper/)**

---

## Was macht dieses Tool?

Unternehmen, die bereits ein ISMS nach ISO 27001:2022 betreiben, stehen vor der Frage: *Wie viel der NIS2-Anforderungen decken wir damit schon ab — und wo sind die Lücken?*

Dieses Tool beantwortet genau das:

1. **ISO-Controls bewerten** — Erfüllungsgrad der 93 Annex-A-Maßnahmen eintragen (manuell oder per CSV-Import)
2. **NIS2-Deckungsgrad sehen** — Dashboard zeigt sofort den Gesamtscore und den Score pro NIS2-Bereich (a–j)
3. **Gaps erkennen** — 18 NIS2-spezifische Zusatzanforderungen, die ISO 27001 allein nicht abdeckt, werden klar hervorgehoben
4. **PDF-Report exportieren** — Ergebnisse als professionellen Bericht herunterladen

## Mapping-Grundlage

Das Mapping basiert auf der fachlichen Zuordnung von [OpenKRITIS](https://openkritis.de) (ISO 27001:2022 ↔ EU-Durchführungsverordnung 2024/2690) und wurde für dieses Tool strukturiert aufbereitet. Es ist **keine offizielle Zertifizierungsgrundlage**, sondern eine transparente Orientierungshilfe.

Details zur Methodik findest du direkt im Tool unter „Mapping-Methodik & Quellen".

## Scoring-Modell

- **Sub-Score** = Durchschnittlicher Erfüllungsgrad aller zugeordneten Controls (nicht anwendbar = 0%)
- **Area-Score** = Summe der Sub-Scores ÷ (Anzahl Subs + Gaps)
- **NIS2-Deckung** = Durchschnitt der 10 Area-Scores
- ISO 27001 allein erreicht **maximal ~74%** NIS2-Deckung — die restlichen 26% erfordern NIS2-spezifische Maßnahmen

## Lokal starten

```bash
git clone https://github.com/mschillert/nis2-mapper.git
cd nis2-mapper
npm install
npm run dev
```

Öffne dann `http://localhost:5173/nis2-mapper/` im Browser.

## CSV-Import

Das Tool akzeptiert zwei Formate:

| Format | Trennzeichen | Anwendbar-Werte | Quelle |
|---|---|---|---|
| **Vorlage** | `;` | `Ja` / `Nein` | CSV-Vorlage aus dem Tool |
| **GRASP** | `;` | `true` / `false` | Export aus GRASP |

Lade die Vorlage direkt im Tool herunter (Button „Vorlage CSV").

## Tech-Stack

- React (Single-File JSX) mit Vite
- Kein Backend — läuft komplett im Browser
- PapaParse für CSV-Verarbeitung
- Nativer PDF-Builder (kein jsPDF, keine externen Abhängigkeiten)
- GitHub Pages für Hosting

## Lizenz

MIT — siehe [LICENSE](LICENSE).

## Hinweise

- Die Control-Beschreibungen im Tool sind **eigenständig formuliert** und keine Wiedergabe der offiziellen ISO-Normtexte.
- Das Mapping ist eine fachliche Interpretation und ersetzt keine rechtliche oder regulatorische Beratung.
- Für den verbindlichen Wortlaut der ISO 27001:2022 ist die Originalnorm bei [ISO](https://www.iso.org) oder dem [Beuth-Verlag](https://www.beuth.de) zu beziehen.

---

Ein Projekt von **DextraData GRC Technologies GmbH** — Entwickler von [GRASP](https://www.dextradata.com), der Plattform für Governance, Risk & Compliance.
