import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import * as Papa from "papaparse";

/* ═══════════════════════════════════════════════════════════════════
   DATA: 93 ISO 27001:2022 Annex A Controls
   ═══════════════════════════════════════════════════════════════════ */
const CD = [
  {id:"A.5.1",cat:"A.5",name:"Informationssicherheitsrichtlinien"},{id:"A.5.2",cat:"A.5",name:"Rollen und Verantwortlichkeiten der Informationssicherheit"},{id:"A.5.3",cat:"A.5",name:"Aufgabentrennung"},{id:"A.5.4",cat:"A.5",name:"Verantwortlichkeiten der Leitung"},{id:"A.5.5",cat:"A.5",name:"Kontakt mit Behörden"},{id:"A.5.6",cat:"A.5",name:"Kontakt mit Interessengruppen"},{id:"A.5.7",cat:"A.5",name:"Bedrohungsintelligenz"},{id:"A.5.8",cat:"A.5",name:"Informationssicherheit im Projektmanagement"},{id:"A.5.9",cat:"A.5",name:"Inventar der Informationen und zugehöriger Vermögenswerte"},{id:"A.5.10",cat:"A.5",name:"Zulässiger Gebrauch von Informationen und zugehörigen Vermögenswerten"},{id:"A.5.11",cat:"A.5",name:"Rückgabe von Vermögenswerten"},{id:"A.5.12",cat:"A.5",name:"Klassifizierung von Informationen"},{id:"A.5.13",cat:"A.5",name:"Kennzeichnung von Informationen"},{id:"A.5.14",cat:"A.5",name:"Informationsübertragung"},{id:"A.5.15",cat:"A.5",name:"Zugriffskontrolle"},{id:"A.5.16",cat:"A.5",name:"Identitätsmanagement"},{id:"A.5.17",cat:"A.5",name:"Authentifizierungsinformationen"},{id:"A.5.18",cat:"A.5",name:"Zugriffsrechte"},{id:"A.5.19",cat:"A.5",name:"Informationssicherheit in Lieferantenbeziehungen"},{id:"A.5.20",cat:"A.5",name:"Berücksichtigung der IS in Lieferantenvereinbarungen"},{id:"A.5.21",cat:"A.5",name:"Management der IS in der IKT-Lieferkette"},{id:"A.5.22",cat:"A.5",name:"Überwachung und Überprüfung von Lieferantendienstleistungen"},{id:"A.5.23",cat:"A.5",name:"Informationssicherheit bei Nutzung von Cloud-Diensten"},{id:"A.5.24",cat:"A.5",name:"Planung und Vorbereitung der Bewältigung von IS-Vorfällen"},{id:"A.5.25",cat:"A.5",name:"Bewertung und Entscheidung über IS-Ereignisse"},{id:"A.5.26",cat:"A.5",name:"Reaktion auf Informationssicherheitsvorfälle"},{id:"A.5.27",cat:"A.5",name:"Erkenntnisse aus Informationssicherheitsvorfällen"},{id:"A.5.28",cat:"A.5",name:"Sammlung von Beweismaterial"},{id:"A.5.29",cat:"A.5",name:"Informationssicherheit bei Störungen"},{id:"A.5.30",cat:"A.5",name:"IKT-Bereitschaft für Business Continuity"},{id:"A.5.31",cat:"A.5",name:"Rechtliche, gesetzliche, regulatorische und vertragliche Anforderungen"},{id:"A.5.32",cat:"A.5",name:"Geistige Eigentumsrechte"},{id:"A.5.33",cat:"A.5",name:"Schutz von Aufzeichnungen"},{id:"A.5.34",cat:"A.5",name:"Datenschutz und Schutz personenbezogener Daten"},{id:"A.5.35",cat:"A.5",name:"Unabhängige Überprüfung der Informationssicherheit"},{id:"A.5.36",cat:"A.5",name:"Einhaltung von Richtlinien, Regeln und Standards für die IS"},{id:"A.5.37",cat:"A.5",name:"Dokumentierte Betriebsverfahren"},
  {id:"A.6.1",cat:"A.6",name:"Sicherheitsüberprüfung"},{id:"A.6.2",cat:"A.6",name:"Beschäftigungsbedingungen"},{id:"A.6.3",cat:"A.6",name:"Sensibilisierung, Schulung und Training für IS"},{id:"A.6.4",cat:"A.6",name:"Disziplinarverfahren"},{id:"A.6.5",cat:"A.6",name:"Verantwortlichkeiten bei Beendigung oder Änderung der Beschäftigung"},{id:"A.6.6",cat:"A.6",name:"Vertraulichkeits- oder Geheimhaltungsvereinbarungen"},{id:"A.6.7",cat:"A.6",name:"Telearbeit"},{id:"A.6.8",cat:"A.6",name:"Meldung von Informationssicherheitsereignissen"},
  {id:"A.7.1",cat:"A.7",name:"Physische Sicherheitsbereiche"},{id:"A.7.2",cat:"A.7",name:"Physischer Zutritt"},{id:"A.7.3",cat:"A.7",name:"Sicherung von Büros, Räumen und Einrichtungen"},{id:"A.7.4",cat:"A.7",name:"Physische Sicherheitsüberwachung"},{id:"A.7.5",cat:"A.7",name:"Schutz vor physischen und umweltbedingten Bedrohungen"},{id:"A.7.6",cat:"A.7",name:"Arbeiten in Sicherheitsbereichen"},{id:"A.7.7",cat:"A.7",name:"Aufgeräumter Schreibtisch und aufgeräumter Bildschirm"},{id:"A.7.8",cat:"A.7",name:"Platzierung und Schutz von Betriebsmitteln"},{id:"A.7.9",cat:"A.7",name:"Sicherheit von Vermögenswerten außerhalb der Geschäftsräume"},{id:"A.7.10",cat:"A.7",name:"Speichermedien"},{id:"A.7.11",cat:"A.7",name:"Versorgungseinrichtungen"},{id:"A.7.12",cat:"A.7",name:"Sicherheit der Verkabelung"},{id:"A.7.13",cat:"A.7",name:"Instandhaltung von Betriebsmitteln"},{id:"A.7.14",cat:"A.7",name:"Sichere Entsorgung oder Wiederverwendung von Betriebsmitteln"},
  {id:"A.8.1",cat:"A.8",name:"Endgeräte der Benutzer"},{id:"A.8.2",cat:"A.8",name:"Privilegierte Zugriffsrechte"},{id:"A.8.3",cat:"A.8",name:"Einschränkung des Informationszugriffs"},{id:"A.8.4",cat:"A.8",name:"Zugriff auf Quellcode"},{id:"A.8.5",cat:"A.8",name:"Sichere Authentifizierung"},{id:"A.8.6",cat:"A.8",name:"Kapazitätsmanagement"},{id:"A.8.7",cat:"A.8",name:"Schutz gegen Schadsoftware"},{id:"A.8.8",cat:"A.8",name:"Management technischer Schwachstellen"},{id:"A.8.9",cat:"A.8",name:"Konfigurationsmanagement"},{id:"A.8.10",cat:"A.8",name:"Löschung von Informationen"},{id:"A.8.11",cat:"A.8",name:"Datenmaskierung"},{id:"A.8.12",cat:"A.8",name:"Verhinderung von Datenlecks"},{id:"A.8.13",cat:"A.8",name:"Sicherung von Informationen"},{id:"A.8.14",cat:"A.8",name:"Redundanz von informationsverarbeitenden Einrichtungen"},{id:"A.8.15",cat:"A.8",name:"Protokollierung"},{id:"A.8.16",cat:"A.8",name:"Überwachung von Aktivitäten"},{id:"A.8.17",cat:"A.8",name:"Uhrensynchronisation"},{id:"A.8.18",cat:"A.8",name:"Nutzung privilegierter Hilfsprogramme"},{id:"A.8.19",cat:"A.8",name:"Installation von Software auf Betriebssystemen"},{id:"A.8.20",cat:"A.8",name:"Netzwerksicherheit"},{id:"A.8.21",cat:"A.8",name:"Sicherheit von Netzwerkdiensten"},{id:"A.8.22",cat:"A.8",name:"Trennung von Netzwerken"},{id:"A.8.23",cat:"A.8",name:"Webfilterung"},{id:"A.8.24",cat:"A.8",name:"Verwendung von Kryptografie"},{id:"A.8.25",cat:"A.8",name:"Sicherer Entwicklungslebenszyklus"},{id:"A.8.26",cat:"A.8",name:"Anforderungen an die Anwendungssicherheit"},{id:"A.8.27",cat:"A.8",name:"Sichere Systemarchitektur und Entwicklungsprinzipien"},{id:"A.8.28",cat:"A.8",name:"Sicheres Codieren"},{id:"A.8.29",cat:"A.8",name:"Sicherheitstests in Entwicklung und Abnahme"},{id:"A.8.30",cat:"A.8",name:"Ausgelagerte Entwicklung"},{id:"A.8.31",cat:"A.8",name:"Trennung von Entwicklungs-, Test- und Produktionsumgebungen"},{id:"A.8.32",cat:"A.8",name:"Änderungsmanagement"},{id:"A.8.33",cat:"A.8",name:"Testinformationen"},{id:"A.8.34",cat:"A.8",name:"Schutz von Informationssystemen während Audittests"},
];
const VID = new Set(CD.map(c => c.id));
const CATS = [{key:"A.5",label:"A.5 — Organisatorische Maßnahmen",count:37},{key:"A.6",label:"A.6 — Personenbezogene Maßnahmen",count:8},{key:"A.7",label:"A.7 — Physische Maßnahmen",count:14},{key:"A.8",label:"A.8 — Technologische Maßnahmen",count:34}];

/* ═══════════════════════════════════════════════════════════════════
   CONTROL-BESCHREIBUNGEN (eigenständig formuliert)
   ─────────────────────────────────────────────────────────────────
   HINWEIS: Diese Texte sind KEINE Wiedergabe der offiziellen
   ISO/IEC 27001:2022-Normtexte. Sie sind eigenständig formulierte,
   praxisorientierte Erklärungen und unterliegen der Lizenz dieses
   Projekts. Für den verbindlichen Wortlaut ist die Originalnorm
   bei ISO (iso.org) oder dem jeweiligen nationalen Normungsinstitut
   (z.B. DIN beim Beuth-Verlag) zu beziehen.

   STRUKTUR: { "A.x.y": "Beschreibung" }
   → Separates Datenobjekt, um Austausch / Übersetzung /
     Anpassung ohne Code-Änderung zu ermöglichen.
   ═══════════════════════════════════════════════════════════════════ */
const CDESC = {
  // ── A.5 Organisatorische Maßnahmen ──────────────────────────────
  "A.5.1": "Die Organisation erstellt und pflegt übergeordnete und themenspezifische Richtlinien zur Informationssicherheit. Diese werden von der Leitung freigegeben, allen relevanten Personen bekannt gemacht und regelmäßig auf Aktualität geprüft.",
  "A.5.2": "Rollen und Zuständigkeiten für die Informationssicherheit werden klar definiert und zugewiesen — von der Gesamtverantwortung bis zu operativen Aufgaben. Jede beteiligte Person kennt ihren Verantwortungsbereich und die zugehörigen Eskalationswege.",
  "A.5.3": "Aufgaben und Befugnisse, die in Kombination ein Missbrauchsrisiko erzeugen, werden auf verschiedene Personen oder Funktionen aufgeteilt. Ist eine vollständige Trennung nicht möglich, werden kompensierende Kontrollen wie Vier-Augen-Prinzip oder Audit-Trails eingesetzt.",
  "A.5.4": "Die Unternehmensleitung fordert aktiv die Einhaltung der Sicherheitsrichtlinien ein, stellt dafür ausreichend Ressourcen bereit und geht mit gutem Beispiel voran. Sicherheit wird als Führungsaufgabe verstanden, nicht nur als IT-Thema.",
  "A.5.5": "Die Organisation unterhält Kontakte zu relevanten Behörden — etwa Aufsichts-, Datenschutz- und Strafverfolgungsbehörden. Verfahren regeln, wann und wie diese Kontakte im Ernstfall aktiviert werden.",
  "A.5.6": "Beziehungen zu Fachforen, Branchenverbänden und Sicherheits-Communities werden gepflegt, um über aktuelle Bedrohungen, Best Practices und technologische Entwicklungen informiert zu bleiben.",
  "A.5.7": "Informationen über aktuelle und aufkommende Bedrohungen werden systematisch gesammelt, analysiert und bewertet. Die gewonnenen Erkenntnisse fließen in die Risikoeinschätzung und in konkrete Schutzmaßnahmen ein.",
  "A.5.8": "Informationssicherheit wird von Anfang an in alle Projekte integriert — unabhängig von deren Art oder Größe. Sicherheitsanforderungen werden in der Planungsphase ermittelt und während der gesamten Projektlaufzeit berücksichtigt.",
  "A.5.9": "Alle Informationswerte und zugehörigen Vermögenswerte (Hardware, Software, Daten, Dienste) werden in einem aktuellen Inventar erfasst. Für jeden Wert ist ein Verantwortlicher benannt und der Schutzbedarf ermittelt.",
  "A.5.10": "Regeln für den zulässigen Umgang mit Informationen und den zugehörigen Vermögenswerten sind definiert, dokumentiert und allen Nutzern bekannt. Sie decken die Nutzung, Speicherung, Weitergabe und Entsorgung ab.",
  "A.5.11": "Mitarbeitende und externe Parteien geben bei Beendigung ihrer Tätigkeit alle in ihrem Besitz befindlichen Vermögenswerte der Organisation zurück. Der Rückgabeprozess wird dokumentiert und überprüft.",
  "A.5.12": "Informationen werden nach ihrem Schutzbedarf klassifiziert — unter Berücksichtigung von Vertraulichkeit, Integrität und Verfügbarkeit. Das Klassifizierungsschema ist organisationsweit einheitlich und wird regelmäßig überprüft.",
  "A.5.13": "Informationen werden entsprechend ihrem Klassifizierungsgrad gekennzeichnet. Die Kennzeichnungsregeln gelten für alle Formate — digital wie physisch — und sind allen Beteiligten bekannt.",
  "A.5.14": "Für die Übertragung von Informationen innerhalb der Organisation und mit externen Parteien gelten formale Regeln, Verfahren und Vereinbarungen. Diese berücksichtigen den Schutzbedarf und den genutzten Übertragungsweg.",
  "A.5.15": "Der Zugriff auf Informationen und informationsverarbeitende Einrichtungen wird auf Basis geschäftlicher Erfordernisse und des Schutzbedarfs geregelt. Ein dokumentiertes Zugriffskontrollkonzept legt die Grundsätze fest.",
  "A.5.16": "Der vollständige Lebenszyklus von Identitäten wird verwaltet — von der Erstellung über Änderungen bis zur Deaktivierung. Jede Identität ist eindeutig einer natürlichen Person oder einem definierten Zweck zugeordnet.",
  "A.5.17": "Die Vergabe und Verwaltung von Authentifizierungsinformationen (z.\u00A0B. Passwörter, Token, Zertifikate) folgt einem definierten Prozess. Dieser umfasst sichere Erstausgabe, Nutzungsregeln und den Umgang bei Kompromittierung.",
  "A.5.18": "Zugriffsrechte werden nach dem Prinzip der minimalen Berechtigung vergeben, regelmäßig überprüft und bei Änderungen im Beschäftigungsverhältnis zeitnah angepasst oder entzogen.",
  "A.5.19": "Informationssicherheitsanforderungen an Lieferanten werden ermittelt und verbindlich vereinbart. Bei der Auswahl und Bewertung von Lieferanten fließen deren Sicherheitspraktiken als Kriterium ein.",
  "A.5.20": "Verträge mit Lieferanten enthalten konkrete Anforderungen an die Informationssicherheit — einschließlich Zugriffsrechte, Vorfallmeldung, Audit-Rechte und Geheimhaltung.",
  "A.5.21": "Risiken aus der IKT-Lieferkette werden gezielt adressiert. Die Organisation stellt sicher, dass auch Unterauftragnehmer angemessene Sicherheitsstandards einhalten und Transparenz über Weitervergaben besteht.",
  "A.5.22": "Die Leistungen von Lieferanten werden regelmäßig überwacht, überprüft und auditiert. Änderungen in deren Sicherheitspraktiken oder Dienstleistungsumfang werden bewertet und bei Bedarf vertraglich nachgesteuert.",
  "A.5.23": "Für Cloud-Dienste werden spezifische Sicherheitsanforderungen definiert — von der Auswahl über den Betrieb bis zur Beendigung. Verantwortlichkeiten zwischen Organisation und Cloud-Anbieter sind klar abgegrenzt.",
  "A.5.24": "Die Reaktion auf Informationssicherheitsvorfälle wird im Voraus geplant. Verantwortlichkeiten, Kommunikationswege, Eskalationsstufen und Handlungsanweisungen sind dokumentiert und den Beteiligten bekannt.",
  "A.5.25": "Sicherheitsereignisse werden anhand definierter Kriterien bewertet und als Vorfall eingestuft oder verworfen. Die Entscheidungsprozesse sind nachvollziehbar dokumentiert.",
  "A.5.26": "Auf erkannte Sicherheitsvorfälle wird gemäß den definierten Verfahren reagiert. Die Reaktion umfasst Eindämmung, Beseitigung der Ursache und Wiederherstellung des Normalbetriebs.",
  "A.5.27": "Nach jedem Sicherheitsvorfall wird eine strukturierte Nachbetrachtung durchgeführt. Die gewonnenen Erkenntnisse fließen in die Verbesserung der Sicherheitsmaßnahmen und der Vorfallreaktionspläne ein.",
  "A.5.28": "Beweismaterial zu Sicherheitsvorfällen wird nach definierten Verfahren identifiziert, gesammelt, gesichert und aufbewahrt — insbesondere im Hinblick auf mögliche rechtliche oder disziplinarische Verfahren.",
  "A.5.29": "Die Informationssicherheit wird auch bei Störungen und Ausfällen aufrechterhalten. Notfallpläne stellen sicher, dass kritische Sicherheitskontrollen auch im Krisenmodus wirksam bleiben.",
  "A.5.30": "Die IKT-Infrastruktur ist so vorbereitet, dass bei Ausfällen die Geschäftskontinuität sichergestellt werden kann. Dies umfasst Wiederherstellungspläne, Tests und definierte Wiederanlaufzeiten.",
  "A.5.31": "Alle relevanten gesetzlichen, regulatorischen und vertraglichen Anforderungen an die Informationssicherheit sind identifiziert, dokumentiert und werden fortlaufend eingehalten. Änderungen im rechtlichen Umfeld werden systematisch verfolgt.",
  "A.5.32": "Geistige Eigentumsrechte — eigene und fremde — werden respektiert und geschützt. Verfahren stellen sicher, dass Software-Lizenzen eingehalten und urheberrechtliche Vorgaben beachtet werden.",
  "A.5.33": "Aufzeichnungen werden vor Verlust, Zerstörung, Fälschung und unberechtigtem Zugriff geschützt. Aufbewahrungsfristen und Löschvorgaben folgen den gesetzlichen und geschäftlichen Anforderungen.",
  "A.5.34": "Der Schutz personenbezogener Daten wird gemäß den geltenden Datenschutzgesetzen (z.\u00A0B. DSGVO) sichergestellt. Verarbeitungsverzeichnisse, Rechtsgrundlagen und Betroffenenrechte sind berücksichtigt.",
  "A.5.35": "Die Informationssicherheit wird in geplanten Abständen oder bei wesentlichen Änderungen unabhängig überprüft. Die Ergebnisse werden der Leitung berichtet und Verbesserungsmaßnahmen eingeleitet.",
  "A.5.36": "Die Einhaltung der internen Richtlinien, Standards und Sicherheitsanforderungen wird regelmäßig geprüft. Abweichungen werden dokumentiert und mit konkreten Korrekturmaßnahmen nachverfolgt.",
  "A.5.37": "Betriebsverfahren für informationsverarbeitende Einrichtungen sind dokumentiert, aktuell gehalten und den Personen zugänglich, die sie benötigen. Änderungen an den Verfahren unterliegen einem kontrollierten Prozess.",

  // ── A.6 Personenbezogene Maßnahmen ──────────────────────────────
  "A.6.1": "Vor der Einstellung werden Hintergrundüberprüfungen durchgeführt — im Rahmen der gesetzlichen Möglichkeiten und angemessen zum Schutzbedarf der vorgesehenen Tätigkeit.",
  "A.6.2": "Arbeitsverträge enthalten die Verpflichtungen von Mitarbeitenden und der Organisation in Bezug auf die Informationssicherheit. Dies umfasst Verantwortlichkeiten, die auch nach Beendigung des Beschäftigungsverhältnisses fortgelten.",
  "A.6.3": "Alle Mitarbeitenden und relevanten externen Parteien erhalten regelmäßige Schulungen und Sensibilisierungsmaßnahmen zur Informationssicherheit. Die Inhalte sind auf ihre jeweiligen Aufgaben und Risiken zugeschnitten.",
  "A.6.4": "Ein formales Disziplinarverfahren regelt die Konsequenzen bei Verstößen gegen die Informationssicherheitsrichtlinien. Das Verfahren ist bekannt, verhältnismäßig und wird konsistent angewendet.",
  "A.6.5": "Bei Beendigung oder Änderung des Beschäftigungsverhältnisses werden die sicherheitsrelevanten Pflichten geregelt — einschließlich Rückgabe von Werten, Entzug von Zugriffsrechten und fortdauernder Geheimhaltung.",
  "A.6.6": "Vertraulichkeits- oder Geheimhaltungsvereinbarungen werden eingesetzt, wo der Schutz sensibler Informationen es erfordert. Sie spiegeln den Schutzbedarf wider und werden regelmäßig überprüft.",
  "A.6.7": "Für Telearbeit und mobiles Arbeiten gelten spezifische Sicherheitsmaßnahmen. Diese adressieren den Schutz von Informationen außerhalb der Geschäftsräume, sichere Kommunikation und die Absicherung der genutzten Endgeräte.",
  "A.6.8": "Alle Mitarbeitenden und externen Parteien sind verpflichtet, beobachtete oder vermutete Sicherheitsereignisse unverzüglich über die definierten Meldewege zu melden. Der Meldeprozess ist niedrigschwellig und geschützt.",

  // ── A.7 Physische Maßnahmen ─────────────────────────────────────
  "A.7.1": "Sicherheitsbereiche werden definiert und durch angemessene Zutrittsmechanismen geschützt. Die Abgrenzung richtet sich nach dem Schutzbedarf der darin befindlichen Informationen und Systeme.",
  "A.7.2": "Der physische Zugang zu Sicherheitsbereichen wird durch geeignete Kontrollmechanismen geregelt — z.\u00A0B. Ausweissysteme, Schleusen oder biometrische Verfahren. Zutrittsberechtigungen werden regelmäßig überprüft.",
  "A.7.3": "Büros, Räume und Einrichtungen werden physisch so gesichert, dass unbefugter Zugang, Einsichtnahme und Manipulation verhindert werden. Die Maßnahmen sind dem Schutzbedarf angemessen.",
  "A.7.4": "Räumlichkeiten werden durch geeignete Überwachungsmaßnahmen geschützt — z.\u00A0B. Videoüberwachung, Alarmanlagen oder Wachdienste. Art und Umfang richten sich nach der Risikoeinschätzung und den rechtlichen Rahmenbedingungen.",
  "A.7.5": "Schutzmaßnahmen gegen physische Bedrohungen und Umgebungsgefahren — wie Feuer, Wasser, Erdbeben oder Stromausfall — werden geplant und umgesetzt. Notfallpläne berücksichtigen diese Szenarien.",
  "A.7.6": "Für das Arbeiten in Sicherheitsbereichen gelten besondere Verhaltensregeln — z.\u00A0B. Begleitpflicht für Besucher, Verbot von Aufnahmegeräten oder Einschränkungen bei der Materialein- und -ausfuhr.",
  "A.7.7": "Eine aufgeräumte Arbeitsumgebung (Clean Desk) und gesperrte Bildschirme bei Abwesenheit (Clean Screen) schützen vor unbefugtem Zugriff auf Informationen am Arbeitsplatz.",
  "A.7.8": "Betriebsmittel werden so platziert und geschützt, dass Risiken durch Umgebungseinflüsse minimiert und unbefugter physischer Zugang erschwert werden.",
  "A.7.9": "Für Vermögenswerte, die außerhalb der Geschäftsräume genutzt werden, gelten besondere Schutzmaßnahmen. Diese berücksichtigen die erhöhten Risiken in externen Umgebungen wie Transport, Heimarbeit oder Dienstreisen.",
  "A.7.10": "Speichermedien werden während ihres gesamten Lebenszyklus geschützt — von der Beschaffung über die Nutzung bis zur Entsorgung oder Wiederverwendung. Dabei wird der Schutzbedarf der gespeicherten Daten berücksichtigt.",
  "A.7.11": "Versorgungseinrichtungen wie Stromversorgung, Klimatisierung und Telekommunikation werden gegen Ausfall und Störung geschützt. Redundanzen und Notfallmechanismen (z.\u00A0B. USV, Notstromaggregate) sind vorgesehen.",
  "A.7.12": "Die Verkabelung für Strom- und Datenübertragung wird gegen Abhören, Störung, Beschädigung und unbefugten Zugriff geschützt. Kabelwege sind dokumentiert und kritische Verbindungen redundant ausgelegt.",
  "A.7.13": "Betriebsmittel werden regelmäßig gewartet, um ihre Verfügbarkeit und Integrität sicherzustellen. Wartungsarbeiten werden protokolliert, und nur autorisiertes Personal führt sie durch.",
  "A.7.14": "Betriebsmittel, die nicht mehr benötigt werden, werden sicher entsorgt oder für die Wiederverwendung aufbereitet. Speichermedien werden dabei so behandelt, dass gespeicherte Daten zuverlässig unwiederherstellbar sind.",

  // ── A.8 Technologische Maßnahmen ────────────────────────────────
  "A.8.1": "Endgeräte der Benutzer (Laptops, Smartphones, Tablets) werden durch eine Kombination aus technischen und organisatorischen Maßnahmen geschützt — darunter Geräteverschlüsselung, Bildschirmsperre, Softwareaktualisierungen und Nutzungsrichtlinien.",
  "A.8.2": "Die Vergabe und Nutzung privilegierter Zugriffsrechte (z.\u00A0B. Administratorkonten) wird streng kontrolliert und eingeschränkt. Privilegierte Zugriffe werden protokolliert und regelmäßig überprüft.",
  "A.8.3": "Der Zugriff auf Informationen wird auf das für die jeweilige Aufgabe notwendige Minimum beschränkt. Technische Mechanismen setzen die in der Zugriffskontrollrichtlinie definierten Regeln durch.",
  "A.8.4": "Der Zugriff auf Quellcode wird eingeschränkt und kontrolliert, um unbefugte Änderungen, Diebstahl geistigen Eigentums und die Offenlegung sicherheitsrelevanter Informationen zu verhindern.",
  "A.8.5": "Sichere Authentifizierungsverfahren werden eingesetzt — angepasst an den Schutzbedarf des jeweiligen Systems. Dazu gehören starke Passwörter, Mehrfaktor-Authentifizierung und der Schutz gegen Brute-Force-Angriffe.",
  "A.8.6": "Die Nutzung von IT-Ressourcen (Rechenleistung, Speicher, Netzwerkbandbreite) wird überwacht und geplant. Engpässe werden frühzeitig erkannt, und die Kapazität wird an den aktuellen und absehbaren Bedarf angepasst.",
  "A.8.7": "Systeme werden durch technische und organisatorische Maßnahmen vor Schadsoftware geschützt. Dazu gehören aktuelle Anti-Malware-Lösungen, Verhaltensregeln für Nutzer und kontrollierte Software-Quellen.",
  "A.8.8": "Technische Schwachstellen werden systematisch identifiziert, bewertet und zeitnah behandelt. Dafür werden Schwachstellen-Scanner, Herstellerhinweise und öffentliche Datenbanken (z.\u00A0B. CVE) genutzt.",
  "A.8.9": "Hardware, Software und Netzwerke werden nach definierten Sicherheitskonfigurationen eingerichtet und betrieben. Abweichungen werden erkannt und korrigiert. Konfigurationsänderungen folgen einem kontrollierten Prozess.",
  "A.8.10": "Informationen, die nicht mehr benötigt werden, werden gemäß den geltenden Aufbewahrungsfristen und Datenschutzanforderungen sicher gelöscht — auf allen Speichermedien und in allen Systemen.",
  "A.8.11": "Datenmaskierung wird eingesetzt, um den Zugriff auf sensible Daten einzuschränken — insbesondere in Test-, Entwicklungs- und Analyseumgebungen. Die gewählte Methode stellt sicher, dass die Daten ihren Nutzwert behalten, ohne Rückschlüsse auf Originaldaten zu ermöglichen.",
  "A.8.12": "Maßnahmen zur Verhinderung von Datenlecks (DLP) werden auf Systeme, Netzwerke und Endgeräte angewendet. Ziel ist es, die unbefugte Offenlegung sensibler Informationen zu erkennen und zu unterbinden.",
  "A.8.13": "Datensicherungen werden regelmäßig erstellt, getestet und sicher aufbewahrt. Die Backup-Strategie berücksichtigt Wiederherstellungsanforderungen (RPO/RTO) und schützt die Sicherungen vor unbefugtem Zugriff und Manipulation.",
  "A.8.14": "Kritische informationsverarbeitende Einrichtungen werden mit ausreichender Redundanz betrieben, um Verfügbarkeitsanforderungen zu erfüllen. Failover-Mechanismen werden regelmäßig getestet.",
  "A.8.15": "Aktivitäten auf Systemen und in Netzwerken werden protokolliert — einschließlich Benutzeranmeldungen, Zugriffen auf kritische Daten, Konfigurationsänderungen und Sicherheitsereignissen. Protokolle werden geschützt und regelmäßig ausgewertet.",
  "A.8.16": "Netzwerke, Systeme und Anwendungen werden auf anomale Aktivitäten überwacht. Erkannte Auffälligkeiten werden nach definierten Verfahren bewertet und bei Bedarf als Sicherheitsereignis eskaliert.",
  "A.8.17": "Die Uhren aller relevanten Systeme werden mit einer einheitlichen, vertrauenswürdigen Zeitquelle synchronisiert. Dies stellt die Korrelierbarkeit von Protokolldaten über verschiedene Systeme hinweg sicher.",
  "A.8.18": "Der Einsatz privilegierter Hilfsprogramme (z.\u00A0B. System-Utilities, Debug-Tools) wird streng kontrolliert und eingeschränkt. Nur autorisierte Personen verwenden diese Werkzeuge, und ihre Nutzung wird protokolliert.",
  "A.8.19": "Die Installation von Software auf produktiven Systemen folgt einem definierten Freigabeprozess. Nicht autorisierte Software wird erkannt und verhindert. Nutzer dürfen nicht eigenständig Software installieren.",
  "A.8.20": "Netzwerke werden durch geeignete Sicherheitsmaßnahmen geschützt — darunter Firewalls, Intrusion-Detection-Systeme und Zugangskontrolle. Management- und Datenverkehr werden wo sinnvoll getrennt.",
  "A.8.21": "Netzwerkdienste werden hinsichtlich ihrer Sicherheitseigenschaften bewertet und überwacht. Service-Level-Vereinbarungen mit Netzdienstanbietern beinhalten Sicherheitsanforderungen.",
  "A.8.22": "Netzwerke werden in Segmente aufgeteilt, um die Ausbreitung von Angriffen zu begrenzen und den Datenverkehr zwischen Bereichen unterschiedlichen Schutzbedarfs kontrollieren zu können.",
  "A.8.23": "Der Zugriff auf externe Websites wird so gesteuert, dass die Exposition gegenüber schädlichen Inhalten reduziert wird. URL-Filter oder vergleichbare Mechanismen blockieren bekannte Gefahrenquellen.",
  "A.8.24": "Kryptografische Maßnahmen werden risikoorientiert eingesetzt — für die Verschlüsselung von Daten in Ruhe und bei Übertragung sowie für digitale Signaturen. Schlüsselmanagement folgt definierten Verfahren.",
  "A.8.25": "Software wird nach einem sicheren Entwicklungslebenszyklus erstellt. Sicherheitsanforderungen werden von Beginn an berücksichtigt, Entwickler geschult und Sicherheitsprüfungen in den Entwicklungsprozess integriert.",
  "A.8.26": "Anforderungen an die Sicherheit von Anwendungen werden bei Entwurf und Beschaffung systematisch ermittelt und spezifiziert — einschließlich Authentifizierung, Zugriffskontrolle, Eingabevalidierung und Fehlerbehandlung.",
  "A.8.27": "Systemarchitekturen folgen sicheren Entwurfsprinzipien wie Defense-in-Depth, Least Privilege und Secure-by-Default. Diese Prinzipien werden dokumentiert und in allen Entwicklungsprojekten angewendet.",
  "A.8.28": "Beim Codieren werden Sicherheitsprinzipien eingehalten — etwa Eingabevalidierung, sichere Fehlerbehandlung und der Verzicht auf veraltete oder unsichere Funktionen. Code-Reviews und statische Analyse unterstützen die Qualitätssicherung.",
  "A.8.29": "Sicherheitstests werden während der Entwicklung und bei der Abnahme durchgeführt — darunter funktionale Tests, Schwachstellenscans und ggf. Penetrationstests. Die Ergebnisse werden dokumentiert und behandelt.",
  "A.8.30": "Wenn Entwicklung an externe Dienstleister ausgelagert wird, gelten die Sicherheitsanforderungen der Organisation auch für den Dienstleister. Vertragliche Vereinbarungen und Überprüfungen stellen die Einhaltung sicher.",
  "A.8.31": "Entwicklungs-, Test- und Produktionsumgebungen werden voneinander getrennt. Dadurch wird verhindert, dass Änderungen in der Entwicklung ungeplant den Produktivbetrieb beeinflussen.",
  "A.8.32": "Änderungen an Systemen, Software und Konfigurationen durchlaufen einen formalen Änderungsmanagementprozess. Dieser umfasst Risikoanalyse, Genehmigung, Test und dokumentierte Umsetzung.",
  "A.8.33": "Testdaten werden sorgfältig ausgewählt, geschützt und kontrolliert. Produktivdaten werden in Testumgebungen nur eingesetzt, wenn dies unbedingt nötig ist — und dann maskiert oder anonymisiert.",
  "A.8.34": "Audittests an produktiven Systemen werden sorgfältig geplant und kontrolliert durchgeführt, um Betriebsstörungen zu minimieren. Zugriffe auf Systeme im Rahmen von Audits werden eingeschränkt, überwacht und protokolliert.",
};

/* ═══════════════════════════════════════════════════════════════════
   NIS2 Mapping + Gaps
   ═══════════════════════════════════════════════════════════════════ */
const NIS2 = { areas: [
  {id:"a",name:"Risikoanalyse und Sicherheit für Informationssysteme",gaps:["Allgefahren-Ansatz: NIS2 fordert Berücksichtigung aller Gefahren (auch nicht-cyber), nicht nur IS-Risiken"],sections:[{id:"1",subs:[{id:"1.1",name:"Konzept für die Sicherheit von Netz- und Informationssystemen",controls:["A.5.1","A.5.2","A.5.4","A.5.31","A.5.36"]},{id:"1.2",name:"Rollen, Verantwortlichkeiten und Weisungsbefugnisse",controls:["A.5.2","A.5.3","A.5.4"]}]},{id:"2",subs:[{id:"2.1",name:"Risikomanagementrahmen",controls:["A.5.29","A.5.30"]},{id:"2.2",name:"Überwachung der Einhaltung",controls:["A.5.36","A.8.34"]},{id:"2.3",name:"Unabhängige Überprüfung der Netz- und Informationssicherheit",controls:["A.5.35","A.5.36","A.8.34"]}]}]},
  {id:"b",name:"Bewältigung von Sicherheitsvorfällen",gaps:["Frühwarnung an CSIRT innerhalb von 24h (Art. 23 Abs. 4a)","Ausführliche Meldung innerhalb von 72h (Art. 23 Abs. 4b)","Abschlussbericht innerhalb eines Monats (Art. 23 Abs. 4d)","Unterrichtung betroffener Empfänger (Art. 23 Abs. 1)"],sections:[{id:"3",subs:[{id:"3.1",name:"Konzept für die Bewältigung von Sicherheitsvorfällen",controls:["A.5.2","A.5.24","A.5.25","A.5.26","A.5.30","A.6.8"]},{id:"3.2",name:"Überwachung und Protokollierung",controls:["A.8.9","A.8.15","A.8.16"]},{id:"3.3",name:"Meldung von Ereignissen",controls:["A.5.24","A.6.8"]},{id:"3.4",name:"Bewertung und Klassifizierung von Ereignissen",controls:["A.5.25","A.5.26"]},{id:"3.5",name:"Reaktion auf Sicherheitsvorfälle",controls:["A.5.26","A.5.27","A.5.28"]},{id:"3.6",name:"Überprüfungen nach Sicherheitsvorfällen",controls:["A.5.27"]}]}]},
  {id:"c",name:"Betriebskontinuität und Krisenmanagement",gaps:["Krisenmanagement: NIS2 fordert explizites Krisenmanagement auf Leitungsebene \u2014 ISO 27001 deckt dies nicht direkt ab","Nutzung koordinierter nationaler/EU-Krisenmechanismen"],sections:[{id:"4",subs:[{id:"4.1",name:"Notfallplan für Aufrechterhaltung und Wiederherstellung",controls:["A.5.29","A.5.30","A.5.31"]},{id:"4.2",name:"Backup-Sicherungs- und Redundanzmanagement",controls:["A.8.6","A.8.13","A.8.14","A.8.16"]}]}]},
  {id:"d",name:"Sicherheit der Lieferkette",gaps:["Bewertung der Cybersicherheitspraktiken aller Zulieferer (Art. 21 Abs. 3)","Koordinierte Risikobewertung kritischer Lieferketten auf EU-Ebene (Art. 22)"],sections:[{id:"5",subs:[{id:"5.1",name:"Konzept für die Sicherheit der Lieferkette",controls:["A.5.19","A.5.20","A.5.21","A.5.22","A.5.23"]},{id:"5.2",name:"Verzeichnis der Anbieter und Diensteanbieter",controls:["A.5.19","A.5.20"]}]}]},
  {id:"e",name:"Sicherheit bei Erwerb, Entwicklung und Wartung",gaps:["Koordinierte Offenlegung von Schwachstellen (CVD) gemäß Art. 12"],sections:[{id:"6",subs:[{id:"6.1",name:"Sicherheitsmaßnahmen beim Erwerb von IKT-Diensten/-Produkten",controls:["A.5.19","A.5.20","A.5.22","A.5.23","A.8.30"]},{id:"6.2",name:"Sicherer Entwicklungszyklus",controls:["A.5.8","A.8.25","A.8.26","A.8.27","A.8.28","A.8.29","A.8.30"]},{id:"6.3",name:"Konfigurationsmanagement",controls:["A.8.9"]},{id:"6.4",name:"Änderungsmanagement, Reparatur und Wartung",controls:["A.7.13","A.8.19","A.8.31","A.8.32"]},{id:"6.5",name:"Sicherheitsprüfung",controls:["A.8.33","A.8.34"]},{id:"6.6",name:"Sicherheitspatch-Management",controls:["A.8.8","A.8.19"]},{id:"6.7",name:"Netzsicherheit",controls:["A.8.20","A.8.21","A.8.22","A.8.23"]},{id:"6.8",name:"Netzsegmentierung",controls:["A.8.22"]},{id:"6.9",name:"Schutz gegen Schadsoftware",controls:["A.8.7"]},{id:"6.10",name:"Behandlung und Offenlegung von Schwachstellen",controls:["A.5.7","A.8.8","A.8.32"]}]}]},
  {id:"f",name:"Bewertung der Wirksamkeit von Risikomanagementmaßnahmen",gaps:["Spezifischere/häufigere Wirksamkeitsprüfungen (ggf. delegierte Rechtsakte)"],sections:[{id:"7",subs:[{id:"7.1",name:"Bewertung der Wirksamkeit von Risikomanagementmaßnahmen",controls:["A.5.31","A.5.36","A.8.34"]}]}]},
  {id:"g",name:"Grundlegende Cyberhygiene und Schulungen",gaps:["Pflichtschulung für Leitungsorgane (Art. 20 Abs. 2)","Billigung der Risikomanagementmaßnahmen durch Leitung (Art. 20 Abs. 1)","Persönliche Haftung der Leitungsorgane (Art. 20 Abs. 1)"],sections:[{id:"8",subs:[{id:"8.1",name:"Sensibilisierungsmaßnahmen und grundlegende Cyberhygiene",controls:["A.6.3","A.7.7"]},{id:"8.2",name:"Sicherheitsschulungen",controls:["A.6.3","A.6.5"]}]}]},
  {id:"h",name:"Kryptografie und Verschlüsselung",gaps:["Ende-zu-Ende-Verschlüsselung wo angemessen (Art. 21 Abs. 2h)"],sections:[{id:"9",subs:[{id:"9.1",name:"Kryptografie",controls:["A.5.1","A.5.14","A.5.31","A.8.20","A.8.21","A.8.24","A.8.33"]}]}]},
  {id:"i",name:"Personalsicherheit, Zugriffskontrolle, Asset Management",gaps:["Zero-Trust-Konzepte (NIS2-Erwägungsgrund 89)"],sections:[{id:"10",subs:[{id:"10.1",name:"Sicherheit des Personals",controls:["A.5.8","A.5.14","A.5.20","A.6.1","A.6.2","A.6.3","A.6.4","A.6.5","A.6.6"]},{id:"10.2",name:"Zuverlässigkeitsüberprüfung",controls:["A.6.1"]},{id:"10.3",name:"Verfahren bei Beendigung/Änderung der Beschäftigung",controls:["A.6.5"]},{id:"10.4",name:"Disziplinarverfahren",controls:["A.6.4"]}]},{id:"11",subs:[{id:"11.1",name:"Konzept für die Zugriffskontrolle",controls:["A.5.15","A.5.18","A.8.2","A.8.3"]},{id:"11.2",name:"Management von Zugangs- und Zugriffsrechten",controls:["A.5.15","A.5.16","A.5.17","A.5.18"]},{id:"11.3",name:"Privilegierte Konten und Systemverwaltungskonten",controls:["A.8.2","A.8.18"]},{id:"11.4",name:"Systemverwaltungssysteme",controls:["A.8.9","A.8.18"]},{id:"11.5",name:"Identifizierung",controls:["A.5.16"]},{id:"11.6",name:"Authentifizierung",controls:["A.8.5"]},{id:"11.7",name:"Multifaktor-Authentifizierung",controls:["A.5.17","A.8.5","A.8.24"]}]},{id:"12",subs:[{id:"12.1",name:"Anlagen- und Werteklassifizierung",controls:["A.5.9","A.5.12","A.5.13"]},{id:"12.2",name:"Behandlung von Anlagen und Werten",controls:["A.5.10","A.5.13","A.7.9","A.7.10"]},{id:"12.3",name:"Konzept für Wechseldatenträger",controls:["A.7.10","A.8.3"]},{id:"12.4",name:"Anlagen- und Werteinventar",controls:["A.5.9"]},{id:"12.5",name:"Abgabe, Rückgabe oder Löschung bei Beendigung",controls:["A.5.11","A.6.5","A.7.14","A.8.10"]}]}]},
  {id:"j",name:"MFA, gesicherte Kommunikation, Notfallkommunikation",gaps:["Kontinuierliche Authentifizierung (Art. 21 Abs. 2j)","Gesicherte Notfallkommunikationssysteme (Art. 21 Abs. 2j)"],sections:[{id:"11-j",subs:[{id:"j.1",name:"Multifaktor-Authentifizierung",controls:["A.5.17","A.8.5","A.8.24"]}]},{id:"13",subs:[{id:"13.1",name:"Unterstützende Versorgungsleistungen",controls:["A.7.11","A.7.12"]},{id:"13.2",name:"Schutz vor physischen Bedrohungen",controls:["A.7.1","A.7.2","A.7.3","A.7.4","A.7.5"]},{id:"13.3",name:"Perimeter und physische Zutrittskontrolle",controls:["A.7.1","A.7.2","A.7.6"]},{id:"j.4",name:"Gesicherte Sprach-, Video- und Textkommunikation",controls:["A.8.12","A.8.20","A.8.21"]},{id:"j.5",name:"Gesicherte Notfallkommunikationssysteme",controls:["A.8.14"]}]}]},
]};

const ALL_SUBS = [];
NIS2.areas.forEach(a => a.sections.forEach(s => s.subs.forEach(sub => ALL_SUBS.push(sub))));
const T_SUBS = ALL_SUBS.length;
const T_GAPS = NIS2.areas.reduce((s, a) => s + (a.gaps?.length || 0), 0);
const T_NIS2 = T_SUBS + T_GAPS;
const NIS2_IDS = new Set();
ALL_SUBS.forEach(sub => sub.controls.forEach(id => NIS2_IDS.add(id)));
/* Reverse lookup: control-ID → [{areaId, areaName, subId, subName}] */
const NIS2_REV = {};
NIS2.areas.forEach(a => a.sections.forEach(s => s.subs.forEach(sub => {
  sub.controls.forEach(id => { if (!NIS2_REV[id]) NIS2_REV[id] = []; NIS2_REV[id].push({ areaId: a.id, areaName: a.name, subId: sub.id, subName: sub.name }); });
})));

/* ═══════════════════════════════════════════════════════════════════
   CALCULATION
   ═══════════════════════════════════════════════════════════════════ */
function subScore(sub, cm) {
  if (!sub.controls.length) return 0;
  return sub.controls.reduce((s, id) => { const c = cm[id]; return s + (c && c.applicable ? c.erfuellung : 0); }, 0) / sub.controls.length;
}
function areaStats(area, cm) {
  const subs = []; area.sections.forEach(s => s.subs.forEach(sub => subs.push(sub)));
  const ng = area.gaps?.length || 0, ns = subs.length, total = ns + ng;
  const scores = subs.map(sub => subScore(sub, cm));
  const fulfilled = scores.filter(s => s >= 100).length;
  const avg = total > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / total) : 0;
  const maxPct = total > 0 ? Math.round((ns / total) * 100) : 0;
  return { avg, ns, ng, total, maxPct, fulfilled, open: ns - fulfilled };
}
function nis2Cov(cm) { return Math.round(NIS2.areas.map(a => areaStats(a, cm).avg).reduce((s, v) => s + v, 0) / NIS2.areas.length); }
function globalDonut(cm) { let f = 0; ALL_SUBS.forEach(sub => { if (subScore(sub, cm) >= 100) f++; }); return { fulfilled: f, open: T_SUBS - f, gaps: T_GAPS, total: T_NIS2 }; }

/* Helpers */
const initControls = () => CD.map(c => ({ id: c.id, cat: c.cat, name: c.name, applicable: false, realispieler: 0, erfuellung: 0, ziel: 0 }));
const amp = p => (p >= 80 ? "var(--cg)" : p >= 50 ? "var(--ca)" : "var(--cr)");
const clamp = v => Math.max(0, Math.min(100, Math.round(v) || 0));

/* CSV */
function normId(r) { if (!r) return null; const s = String(r).trim(); return /^A\.\d+\.\d+$/i.test(s) ? s : null; }
function parseCsv(text) {
  const res = Papa.parse(text, { header: true, delimiter: ";", skipEmptyLines: true, comments: "#", transformHeader: h => h.replace(/^\uFEFF/, "").trim() });
  if (res.errors.length > 0 && res.data.length === 0) return { error: "CSV nicht lesbar." };
  const hd = res.meta.fields || [], isG = hd.includes("chapter_code"), isT = hd.includes("Control-ID");
  if (!isG && !isT) return { error: "Unbekanntes Format." };
  const fm = isG ? { id: "chapter_code", appl: "is_applicable", erf: "fulfilment_level", real: "implementation_level", ziel: "target_fulfilment_level" } : { id: "Control-ID", appl: "Anwendbar", erf: "Erfuellungsgrad", real: "Realisierungsgrad", ziel: "Zielerfuellungsgrad" };
  const YES = isG ? new Set(["true"]) : new Set(["ja"]);
  const NO = isG ? new Set(["false"]) : new Set(["nein"]);
  const expect = isG ? "true/false" : "Ja/Nein";
  const parsed = {}; let sk = 0, mt = 0;
  const pv = v => { if (!v || !String(v).trim()) return 0; return clamp(parseFloat(String(v).replace("%", "").replace(",", ".")) || 0); };
  for (const row of res.data) {
    const id = normId(row[fm.id]); if (!id || !VID.has(id)) { sk++; continue; }
    const ra = String(row[fm.appl] || "").trim().toLowerCase();
    if (!YES.has(ra) && !NO.has(ra)) return { error: `${id}: '${row[fm.appl]?.trim() || ""}' ist kein gültiger Wert für Anwendbar (erwartet: ${expect}). Import abgebrochen.` };
    parsed[id] = { applicable: YES.has(ra), realispieler: pv(row[fm.real]), erfuellung: pv(row[fm.erf]), ziel: pv(row[fm.ziel]) }; mt++;
  }
  return { parsed, matched: mt, skipped: sk, format: isG ? "GRASP" : "Vorlage" };
}
function dlTemplate() { const hdr = [
"# NIS2 Readiness Check — CSV-Vorlage",
"#",
"# So fuellst du diese Datei aus:",
"#   Anwendbar    → Ja oder Nein (ist diese Massnahme in deinem ISMS relevant?)",
"#   Erfuellungsgrad → 0 bis 100 (Prozent der Umsetzung, leer = 0)",
"#",
"# Zeilen mit # am Anfang werden beim Import ignoriert.",
"# GRASP-CSV-Exporte koennen ebenfalls direkt importiert werden.",
"#",
].join("\n");
const csv = "\uFEFF" + hdr + "\nControl-ID;Bezeichnung;Anwendbar;Erfuellungsgrad\n" + CD.map(c => `${c.id};${c.name};Nein;`).join("\n"); const b = new Blob([csv], { type: "text/csv;charset=utf-8;" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "NIS2_Readiness_Check_Vorlage.csv"; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u); }

/* ═══════════════════════════════════════════════════════════════════
   PDF EXPORT (native — no external dependency)
   ═══════════════════════════════════════════════════════════════════ */
function exportPdf(cm, includeDetails) {
  /* ── Encoding helper: JS string → PDF text string (WinAnsi) ── */
  const pS = (s) => {
    let r = "(";
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      if (c === 0x2013) c = 150; else if (c === 0x2014) c = 151;
      else if (c === 0x2026) c = 133; else if (c === 0x2019) c = 146;
      else if (c === 0x201E) c = 132; else if (c === 0x201C) c = 147;
      else if (c === 0x201D) c = 148; else if (c === 0x2022) c = 149;
      else if (c === 0x25B3) { r += ">"; continue; }
      else if (c === 0x2265) { r += ">="; continue; }
      else if (c === 0x2260) { r += "!="; continue; }
      else if (c > 255) { r += "?"; continue; }
      if (c === 40 || c === 41 || c === 92) r += "\\";
      if (c > 127) r += "\\" + c.toString(8).padStart(3, "0");
      else r += String.fromCharCode(c);
    }
    return r + ")";
  };

  /* ── Coords & page management ── */
  const PT = 2.83465, W = 210, H = 297, ML = 25, MR = 20, MT = 28, PW = W - ML - MR;
  const pgs = []; let pg;
  const np = () => { pg = { s: "" }; pgs.push(pg); };
  const o = (v) => { pg.s += v + "\n"; };
  const yP = (y) => ((H - y) * PT).toFixed(2);

  /* ── Colors ── */
  const BX=[124,35,72],TX=[42,42,42],TX2=[107,107,107],TX3=[154,154,154];
  const CG=[15,110,86],CA=[184,117,14],CR=[163,45,45],BGS=[245,245,243],CZ=[140,140,140];
  /* Swoops */
  const SWOOP_DARK=[74,78,80], SWOOP_BX=[124,35,72], SWOOP_LT=[218,216,212];
  const ampC = p => p >= 80 ? CG : p >= 50 ? CA : CR;
  const rgb = (c) => `${(c[0]/255).toFixed(3)} ${(c[1]/255).toFixed(3)} ${(c[2]/255).toFixed(3)}`;

  /* ── Drawing helpers (all coords in mm, y from top) ── */
  const fill = c => o(`${rgb(c)} rg`);
  const strk = c => o(`${rgb(c)} RG`);
  const lw = w => o(`${(w*PT).toFixed(2)} w`);
  const rect = (x,y,w,h) => o(`${(x*PT).toFixed(2)} ${yP(y+h)} ${(w*PT).toFixed(2)} ${(h*PT).toFixed(2)} re f`);
  const rectS = (x,y,w,h) => o(`${(x*PT).toFixed(2)} ${yP(y+h)} ${(w*PT).toFixed(2)} ${(h*PT).toFixed(2)} re S`);
  const ln = (x1,y1,x2,y2) => o(`${(x1*PT).toFixed(2)} ${yP(y1)} m ${(x2*PT).toFixed(2)} ${yP(y2)} l S`);
  const dash = (a,b) => o(`[${(a*PT).toFixed(1)} ${(b*PT).toFixed(1)}] 0 d`);
  const dashOff = () => o("[] 0 d");
  const circ = (cx,cy,r) => {
    const x=cx*PT, y=(H-cy)*PT, R=r*PT, k=R*.5522848;
    o(`${x.toFixed(2)} ${(y+R).toFixed(2)} m ${(x+k).toFixed(2)} ${(y+R).toFixed(2)} ${(x+R).toFixed(2)} ${(y+k).toFixed(2)} ${(x+R).toFixed(2)} ${y.toFixed(2)} c ${(x+R).toFixed(2)} ${(y-k).toFixed(2)} ${(x+k).toFixed(2)} ${(y-R).toFixed(2)} ${x.toFixed(2)} ${(y-R).toFixed(2)} c ${(x-k).toFixed(2)} ${(y-R).toFixed(2)} ${(x-R).toFixed(2)} ${(y-k).toFixed(2)} ${(x-R).toFixed(2)} ${y.toFixed(2)} c ${(x-R).toFixed(2)} ${(y+k).toFixed(2)} ${(x-k).toFixed(2)} ${(y+R).toFixed(2)} ${x.toFixed(2)} ${(y+R).toFixed(2)} c f`);
  };
  const rRect = (x,y,w,h,r) => {
    const px=x*PT, py=(H-y-h)*PT, pw=w*PT, ph=h*PT, pr=Math.min(r*PT,pw/2,ph/2), k=pr*.5522848;
    o(`${(px+pr).toFixed(2)} ${py.toFixed(2)} m ${(px+pw-pr).toFixed(2)} ${py.toFixed(2)} l ${(px+pw-pr+k).toFixed(2)} ${py.toFixed(2)} ${(px+pw).toFixed(2)} ${(py+pr-k).toFixed(2)} ${(px+pw).toFixed(2)} ${(py+pr).toFixed(2)} c ${(px+pw).toFixed(2)} ${(py+ph-pr).toFixed(2)} l ${(px+pw).toFixed(2)} ${(py+ph-pr+k).toFixed(2)} ${(px+pw-pr+k).toFixed(2)} ${(py+ph).toFixed(2)} ${(px+pw-pr).toFixed(2)} ${(py+ph).toFixed(2)} c ${(px+pr).toFixed(2)} ${(py+ph).toFixed(2)} l ${(px+pr-k).toFixed(2)} ${(py+ph).toFixed(2)} ${px.toFixed(2)} ${(py+ph-pr+k).toFixed(2)} ${px.toFixed(2)} ${(py+ph-pr).toFixed(2)} c ${px.toFixed(2)} ${(py+pr).toFixed(2)} l ${px.toFixed(2)} ${(py+pr-k).toFixed(2)} ${(px+pr-k).toFixed(2)} ${py.toFixed(2)} ${(px+pr).toFixed(2)} ${py.toFixed(2)} c f`);
  };

  /* ── Logo icon (bordeaux circle with white horizontal bars — doc-stack motif) ── */
  const drawLogoIcon = (cx, cy, r) => {
    fill(BX); circ(cx, cy, r);
    strk([255,255,255]); lw(r*.14);
    const lx1 = cx - r*0.48, lx2 = cx + r*0.58;
    const sp = r * 0.30;
    ln(lx1, cy - sp, lx2, cy - sp);
    ln(lx1, cy, lx2, cy);
    ln(lx1, cy + sp, lx2, cy + sp);
    lw(.2);
  };

  /* ── Cover swoops (matching GRASP cover — thick diagonal bands) ── */
  const drawSwoops = () => {
    const sy = 220;
    /* Light gray/silver band — extends from center to right, behind both */
    fill(SWOOP_LT); rRect(65, sy + 6, 155, 18, 9);
    /* Dark charcoal band — left to ~65%, on top */
    fill(SWOOP_DARK); rRect(-15, sy - 2, 175, 16, 8);
    /* Bordeaux band — left to ~70%, overlapping below charcoal */
    fill(SWOOP_BX); rRect(-15, sy + 10, 165, 14, 7);
  };

  /* ── Text helpers ── */
  const tw = (s, sz, bold) => s.length * sz * (bold ? .56 : .50) / PT;
  const txt = (s, x, y, fnt, sz, al) => {
    const fk = fnt === "B" ? "/F1B" : fnt === "I" ? "/F1I" : "/F1";
    let tx = x * PT;
    if (al === "r") tx -= tw(s,sz,fnt==="B") * PT;
    else if (al === "c") tx -= tw(s,sz,fnt==="B") * PT / 2;
    o(`BT ${fk} ${sz} Tf ${tx.toFixed(2)} ${yP(y)} Td ${pS(s)} Tj ET`);
  };
  const wrap = (s, maxW, sz, bold) => {
    const words = s.split(" "), lines = []; let cur = "";
    words.forEach(w => {
      const t = cur ? cur + " " + w : w;
      if (tw(t,sz,bold) > maxW && cur) { lines.push(cur); cur = w; }
      else cur = t;
    });
    if (cur) lines.push(cur); return lines;
  };
  const trunc = (s, max) => s.length > max ? s.substring(0, max - 1) + "\u2026" : s;

  /* ── Computed data ── */
  const cov = nis2Cov(cm), dn = globalDonut(cm);
  const ad = NIS2.areas.map(a => ({ ...a, st: areaStats(a, cm) }));
  const now = new Date();
  const ds = `${String(now.getDate()).padStart(2,"0")}.${String(now.getMonth()+1).padStart(2,"0")}.${now.getFullYear()}`;

  /* ═══════ PAGE 1: COVER (GRASP style) ═══════ */
  np();
  /* Logo icon top-right */
  drawLogoIcon(W - MR - 9, 22, 9);
  /* Company name next to icon */
  fill(TX2); txt("DextraData", W-MR-22, 17, "B", 15, "r");
  fill(TX3); txt("Trusted Advice", W-MR-22, 23, "N", 9, "r");

  /* Title — large, bold, left-aligned in upper third (like GRASP Produktbeschreibung) */
  fill(TX); txt("NIS2 Readiness Check", ML, 72, "B", 26, "l");
  fill(TX2); txt(`Bericht vom ${ds}`, ML, 83, "N", 11, "l");

  /* Big score centered */
  fill(ampC(cov)); txt(`${cov} %`, W/2, 118, "B", 54, "c");
  fill(TX2); txt("NIS2-Deckungsgrad", W/2, 131, "N", 12, "c");

  /* Summary boxes */
  const bxY=146, bW=50, bH=24, bG=8, bX0=(W-(3*bW+2*bG))/2;
  [{l:"Erf\u00fcllt",v:`${dn.fulfilled} / ${dn.total}`,c:CG},{l:"Offen (ISO-abdeckbar)",v:`${dn.open} / ${dn.total}`,c:TX3},{l:"NIS2-Zus\u00e4tze",v:`${dn.gaps} / ${dn.total}`,c:CZ}].forEach((b,i)=>{
    const bx = bX0 + i*(bW+bG);
    fill([250,250,248]); rRect(bx,bxY,bW,bH,3);
    strk([230,230,228]); lw(.3);
    o(`${(bx*PT).toFixed(2)} ${yP(bxY+bH)} ${(bW*PT).toFixed(2)} ${(bH*PT).toFixed(2)} re S`);
    fill(b.c); circ(bx+4.5, bxY+6.5, 1.8);
    fill(TX2); txt(b.l, bx+9, bxY+7, "N", 7, "l");
    fill(TX); txt(b.v, bx+bW/2, bxY+17, "B", 12, "c");
  });

  /* Info text */
  fill(TX3);
  const iLines = wrap("Grundlage: Mapping nach OpenKRITIS (openkritis.de) der ISO/IEC 27001:2022 Annex A Controls auf die Durchf\u00fchrungsverordnung (EU) 2024/2690 zu NIS2 Artikel 21 Absatz 2. ISO 27001 kann nicht alle NIS2-Anforderungen abdecken.", PW, 7.5, false);
  iLines.forEach((l,i) => txt(l, ML, 186 + i*3.8, "I", 7.5, "l"));

  /* Company info block — centered, between content and swoops */
  fill(TX2);
  txt("DextraData GmbH \u00b7 Girardetstra\u00dfe 4 \u00b7 45131 Essen", W/2, 206, "N", 7.5, "c");
  txt("Phone +49 201 9 59 75 0 \u00b7 info@dextradata.com \u00b7 www.dextradata.com", W/2, 211, "N", 7, "c");

  /* Decorative swoops (GRASP cover style) */
  drawSwoops();

  /* Full legal footer (matching GRASP Produktbeschreibung cover) */
  strk([220,218,215]); lw(.3); ln(ML, H-24, W-MR, H-24); lw(.2);
  fill(BX);
  txt("DextraData GmbH", ML, H-20.5, "B", 6, "l");
  fill(TX2);
  txt("\u00b7 Girardetstra\u00dfe 4 \u00b7 45131 Essen \u00b7 Phone +49 201 9 59 75 0 \u00b7 Fax +49 201 9 59 75 10 \u00b7 info@dextradata.com \u00b7 www.dextradata.com", ML + 20.5, H-20.5, "N", 6, "l");
  fill(BX); txt("Standort Hamburg", ML, H-17, "B", 5.5, "l");
  fill(TX2); txt("\u00b7 Heidenkampsweg 99 \u00b7 20097 Hamburg", ML+19, H-17, "N", 5.5, "l");
  fill(BX); txt("Standort M\u00fcnchen", ML+60, H-17, "B", 5.5, "l");
  fill(TX2); txt("\u00b7 Oskar-Schlemmer-Stra\u00dfe 3 \u00b7 80807 M\u00fcnchen", ML+79, H-17, "N", 5.5, "l");
  fill(BX); txt("Standort Berlin", ML+125, H-17, "B", 5.5, "l");
  fill(TX2); txt("\u00b7 Am Treptower Park 75 \u00b7 12435 Berlin", ML+142, H-17, "N", 5.5, "l");
  fill(BX); txt("Gesch\u00e4ftsf\u00fchrer", ML, H-13.5, "B", 5.5, "l");
  fill(TX2); txt("\u00b7 Shayan Faghfouri \u00b7 Amtsgericht Essen HRB 16612 \u00b7 USt.-ID DE 222 220 437", ML+16.5, H-13.5, "N", 5.5, "l");
  fill(BX); txt("Bankverbindungen", ML, H-10, "B", 5.5, "l");
  fill(TX2); txt("\u00b7 Commerzbank AG Essen IBAN DE21 3604 0039 0120 4122 00 \u00b7 BIC (SWIFT) COBADEFF360", ML+19, H-10, "N", 5.5, "l");
  txt("Deutsche Bank AG Essen IBAN DE40 3607 0050 0407 7756 00 \u00b7 BIC (SWIFT) DEUTDEDEXXX", ML+19, H-7, "N", 5.5, "l");

  /* ═══════ PAGE 2: OVERVIEW ═══════ */
  np(); let y = MT;
  /* Page header: icon only (top-right, like GRASP content pages) */
  drawLogoIcon(W - MR - 6, 12, 6);
  /* Section heading */
  fill(BX); txt("Abdeckung pro NIS2-Bereich", ML, y, "B", 16, "l"); y += 7;
  fill(TX2); txt("Artikel 21 Absatz 2 der NIS2-Richtlinie", ML, y, "N", 9, "l"); y += 14;
  const barW = 85, barH2 = 5.5, barX = ML + 72;
  ad.forEach(a => {
    if (y > 260) { np(); y = MT; drawLogoIcon(W - MR - 6, 12, 6); }
    const st = a.st, col = ampC(st.avg);
    fill(BX); txt(a.id + ")", ML, y+4, "B", 10, "l");
    fill(TX); txt(trunc(a.name, 42), ML+10, y+4, "N", 8.5, "l");
    fill(BGS); rRect(barX, y, barW, barH2, barH2/2);
    if (st.avg > 0) { fill(col); rRect(barX, y, Math.max(st.avg/100*barW, barH2), barH2, barH2/2); }
    if (st.maxPct < 100) {
      const mx = barX + st.maxPct/100*barW;
      strk([100,100,100]); lw(.4); dash(1,1); ln(mx, y-1.5, mx, y+barH2+1.5); dashOff(); lw(.2);
      fill([100,100,100]); txt(`max ${st.maxPct}%`, mx+1, y-1.5, "N", 6, "l");
    }
    fill(col); txt(`${st.avg}%`, barX+barW+4, y+4, "B", 10, "l");
    if (st.ng > 0) { fill(CZ); txt(`+${st.ng} Zus\u00e4tze`, barX+barW+18, y+4, "N", 6.5, "l"); }
    y += 18;
  });
  /* Legend */
  y += 4; if (y > 270) { np(); y = MT; drawLogoIcon(W - MR - 6, 12, 6); }
  fill(BGS); rRect(ML, y, PW, 16, 3);
  fill(TX2);
  txt("Ampel: >=80% = gr\u00fcn (erf\u00fcllt) \u00b7 50-79% = gelb (teilweise) \u00b7 <50% = rot (kritisch)", ML+4, y+6, "N", 7.5, "l");
  txt("Schraffur / gestrichelte Linie = durch ISO 27001 allein nicht erreichbar (NIS2-Zusatzanforderungen).", ML+4, y+12, "N", 7.5, "l");

  /* ═══════ PAGES 3+: DETAILS ═══════ */
  if (includeDetails) {
    ad.forEach(a => {
      np(); y = MT;
      drawLogoIcon(W - MR - 6, 12, 6);
      const st = a.st, col = ampC(st.avg);
      /* Area heading in bordeaux */
      fill(BX);
      const hL = wrap(`${a.id}) ${a.name}`, PW, 14, true);
      hL.forEach((l,i) => txt(l, ML, y + i*6, "B", 14, "l"));
      y += hL.length * 6 + 1;
      /* Underline (GRASP style for sub-headings) */
      strk(BX); lw(.4); ln(ML, y, ML+PW, y); lw(.2); y += 4;
      fill(col); txt(`Deckungsgrad: ${st.avg}%`, ML, y, "B", 10, "l");
      if (st.maxPct < 100) { fill(TX3); txt(`(max. erreichbar: ${st.maxPct}%)`, ML + 42, y, "N", 10, "l"); }
      y += 10;

      a.sections.forEach(sec => sec.subs.forEach(sub => {
        if (y > 262) { np(); y = MT; drawLogoIcon(W - MR - 6, 12, 6); }
        const avg = Math.round(subScore(sub, cm)), sc = ampC(avg);
        fill([248,248,246]); rect(ML, y-4, PW, 8);
        fill(BX); txt(sub.id, ML+2, y, "B", 8.5, "l");
        fill(TX); txt(trunc(sub.name, 58), ML+16, y, "B", 8.5, "l");
        fill(sc); txt(`${avg}%`, ML+PW-2, y, "B", 8.5, "r");
        y += 8;
        sub.controls.forEach(cid => {
          if (y > 278) { np(); y = MT; drawLogoIcon(W - MR - 6, 12, 6); }
          const c = cm[cid]; if (!c) return;
          const val = c.applicable ? c.erfuellung : 0, vc = c.applicable ? ampC(val) : [200,200,200];
          fill(vc); circ(ML+3, y-1, 1.3);
          fill(TX2); txt(c.id, ML+7, y, "N", 7.5, "l");
          txt(trunc(c.name, 56), ML+22, y, "N", 7.5, "l");
          if (c.applicable) { fill(vc); txt(`${val}%`, ML+PW-2, y, "B", 7.5, "r"); }
          else { fill([200,200,200]); txt("n/a", ML+PW-2, y, "N", 7.5, "r"); }
          y += 5;
        });
        y += 3;
      }));
      /* Gaps */
      if (a.gaps && a.gaps.length > 0) {
        if (y > 252) { np(); y = MT; drawLogoIcon(W - MR - 6, 12, 6); }
        y += 2; strk(CZ); lw(.3); dash(2,1); ln(ML, y, ML+PW, y); dashOff(); lw(.2); y += 5;
        fill(CZ); txt(`${a.gaps.length} NIS2-ZUSÄTZE OHNE ISO-ENTSPRECHUNG`, ML, y, "B", 7.5, "l"); y += 5;
        a.gaps.forEach(g => {
          if (y > 280) { np(); y = MT; drawLogoIcon(W - MR - 6, 12, 6); }
          fill(TX2);
          const gl = wrap(`>  ${g}`, PW-4, 7.5, false);
          gl.forEach((l,i) => txt(l, ML+2, y+i*4, "N", 7.5, "l"));
          y += gl.length * 4;
        });
      }
    });
  }

  /* ── Page footers (pages 2+): GRASP style — just "Seite X" bottom-right ── */
  const totalP = pgs.length;
  for (let i = 1; i < totalP; i++) {
    const p = pgs[i];
    const sT = `Seite ${i+1}`;
    const sW = sT.length * 7 * .48;
    const fOps =
      `${rgb(TX3)} rg\n` +
      `BT /F1 7 Tf ${((W-MR)*PT - sW).toFixed(2)} ${yP(H-11)} Td ${pS(sT)} Tj ET\n`;
    p.s += fOps;
  }

  /* ═══════ ASSEMBLE PDF FILE ═══════ */
  const objs = [];
  const add = c => { objs.push(c); return objs.length; };
  const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const f1b = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const f1i = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>");
  const pIdx = add("@"); const pIds = [];
  pgs.forEach(p => {
    const sLen = p.s.length;
    const sObj = add(`<< /Length ${sLen} >>\nstream\n${p.s}\nendstream`);
    pIds.push(add(`<< /Type /Page /Parent ${pIdx} 0 R /MediaBox [0 0 ${(W*PT).toFixed(2)} ${(H*PT).toFixed(2)}] /Contents ${sObj} 0 R /Resources << /Font << /F1 ${f1} 0 R /F1B ${f1b} 0 R /F1I ${f1i} 0 R >> >> >>`));
  });
  objs[pIdx-1] = `<< /Type /Pages /Kids [${pIds.map(i=>`${i} 0 R`).join(" ")}] /Count ${pIds.length} >>`;
  const cat = add(`<< /Type /Catalog /Pages ${pIdx} 0 R >>`);

  let out = "%PDF-1.4\n";
  const offs = [];
  objs.forEach((obj,i) => { offs.push(out.length); out += `${i+1} 0 obj\n${obj}\nendobj\n`; });
  const xr = out.length;
  out += `xref\n0 ${objs.length+1}\n0000000000 65535 f \r\n`;
  offs.forEach(off => { out += `${String(off).padStart(10,"0")} 00000 n \r\n`; });
  out += `trailer\n<< /Size ${objs.length+1} /Root ${cat} 0 R >>\nstartxref\n${xr}\n%%EOF`;

  const bytes = new Uint8Array(out.length);
  for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = u; a.download = "NIS2_Readiness_Check.pdf";
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u);
}

/* ═══════════════════════════════════════════════════════════════════
   CSS
   ═══════════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');
:root{--bx:#7C2348;--bx-dark:#3E1124;--bx-50:#FAE8ED;--cg:#0F6E56;--ca:#B8750E;--cr:#A32D2D;--cb:#185FA5;--cgs:#5F5E5A;--cz:#8C8C8C;--bg-p:#fff;--bg-s:#f5f5f3;--bg-t:#ededeb;--tx:#1a1a1a;--tx2:#6b6b6b;--tx3:#9a9a9a;--bd3:rgba(0,0,0,.08);--bd2:rgba(0,0,0,.15);--rm:8px;--rl:12px;--fs:"Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;--fm:"SF Mono","Fira Code","Fira Mono",monospace}
:root.dark{--bx:#9A9A9A;--bx-dark:#3E1124;--cg:#5DCAA5;--ca:#EF9F27;--cr:#F09595;--cb:#85B7EB;--cgs:#B4B2A9;--cz:#707070;--bg-p:#1a1a1a;--bg-s:#2a2a2a;--bg-t:#222;--tx:#e8e8e8;--tx2:#a0a0a0;--tx3:#707070;--bd3:rgba(255,255,255,.08);--bd2:rgba(255,255,255,.15);--bx-50:rgba(154,154,154,.12)}
*{box-sizing:border-box;margin:0;padding:0}body,#root{font-family:var(--fs);color:var(--tx);background:var(--bg-t);height:100vh}
.sh{display:flex;height:100vh;overflow:hidden}
.sb{width:240px;background:var(--bx);flex-shrink:0;display:flex;flex-direction:column;transition:width .25s;overflow:hidden}.sb.col{width:52px}.sb.col .sl span,.sb.col .ni-label,.sb.col .sf-body,.sb.col .sf-chev,.sb.col .meth-link-label{display:none}.sb.col .meth-link{justify-content:center;padding:10px 0}.sb.col .sl{padding:16px 12px 12px;justify-content:center}.sb.col .ni{padding:10px 0;justify-content:center}.sb.col .sf{padding:0 8px;margin-top:12px}.sb.col .sf-card{padding:8px;justify-content:center}
.sl{padding:20px 16px 12px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,.12)}.sl svg{width:28px;height:28px;flex-shrink:0;cursor:pointer}.sl span{color:#fff;font-size:13px;font-weight:500;letter-spacing:.02em;line-height:1.2;white-space:nowrap;flex:1}.sl small{display:block;font-size:10px;font-weight:400;opacity:.7;margin-top:2px}
.nv{padding:12px 0 2px}.ni{display:flex;align-items:center;gap:10px;padding:10px 16px;color:rgba(255,255,255,.7);font-size:13px;cursor:pointer;border-left:3px solid transparent;white-space:nowrap;transition:all .15s}.ni:hover{color:#fff;background:rgba(255,255,255,.06)}.ni.ac{color:#fff;background:rgba(255,255,255,.1);border-left-color:#fff}.ni svg{width:18px;height:18px;opacity:.8;flex-shrink:0}.ni.ac svg{opacity:1}
.sf{padding:0 16px;margin-top:16px}
.sf-card{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;background:rgba(255,255,255,.06);text-decoration:none;transition:all .15s;cursor:pointer}.sf-card:hover{background:rgba(255,255,255,.1)}
.sf-logo{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#9B3A54,#B8475F);display:flex;align-items:center;justify-content:center;flex-shrink:0}.sf-logo svg{width:22px;height:22px}
.sf-body{flex:1;min-width:0}.sf-title{display:block;font-size:12px;font-weight:500;color:#fff}.sf-sub{display:block;font-size:10px;color:rgba(255,255,255,.45);margin-top:1px;line-height:1.4;white-space:normal}.sf-chev{flex-shrink:0;color:rgba(255,255,255,.3)}
.meth-link{display:flex;align-items:center;gap:8px;padding:10px 16px;color:rgba(255,255,255,.4);font-size:11px;cursor:pointer;transition:color .15s}.meth-link:hover{color:rgba(255,255,255,.7)}.meth-link-label{white-space:nowrap}
.meth-sources{display:flex;flex-direction:column;gap:6px;margin-top:4px}.meth-src{display:flex;align-items:baseline;gap:8px;font-size:12.5px;color:var(--tx2);line-height:1.4}.meth-src-tag{font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;background:var(--bg-s);color:var(--tx3);flex-shrink:0;letter-spacing:.03em}
.meth-disc{margin:16px 16px 20px;padding:12px 14px;font-size:11px;line-height:1.5;color:var(--tx3);background:var(--bg-s);border-radius:8px;border-left:3px solid var(--ca)}
.mn{flex:1;overflow-y:auto;background:var(--bg-t)}.tb{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:var(--bg-p);border-bottom:.5px solid var(--bd3)}.tb h1{font-size:16px;font-weight:500}
.tb-right{display:flex;align-items:center;gap:8px}.tb-right .ta-reset{font-size:12px;padding:5px 12px;border-radius:var(--rm);border:.5px solid var(--cr);color:var(--cr);background:var(--bg-p);cursor:pointer;font-family:var(--fs);font-weight:600;transition:all .1s}.tb-right .ta-reset:hover{background:var(--cr);color:#fff}
.dm-toggle2{width:34px;height:34px;border-radius:50%;border:1px solid var(--bd2);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .15s;padding:0;background:var(--bg-p);color:var(--tx2)}.dm-toggle2:hover{background:var(--bg-s)}.dm-toggle2.moon{background:#1e3a5f;border-color:#1e3a5f;color:#fff}.dm-toggle2.moon:hover{background:#264a78;border-color:#264a78}.dm-toggle2 svg{width:20px;height:20px}
.ct-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-bottom:16px}.ct-actions button{font-size:12px;padding:6px 14px;border-radius:var(--rm);border:.5px solid var(--bd2);background:var(--bg-p);color:var(--tx2);cursor:pointer;font-family:var(--fs);font-weight:600;transition:background .1s,opacity .1s;box-shadow:0 1px 3px rgba(0,0,0,.06)}.ct-actions button:hover{background:var(--bg-s)}.ct-actions .pm{background:var(--bx);color:#fff;border-color:var(--bx)}.ct-actions .pm:hover{background:var(--bx);opacity:.85}.ct-actions .ta-iso{background:var(--cg);color:#fff;border-color:var(--cg)}.ct-actions .ta-iso:hover{background:var(--cg);opacity:.85}.ta-tip-wrap{position:relative}.ta-tip{display:none;position:absolute;top:calc(100% + 8px);left:0;background:var(--tx);color:var(--bg-p);font-size:11px;padding:8px 10px;border-radius:6px;width:220px;line-height:1.4;z-index:200;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,.2);white-space:normal;font-weight:400}.ta-tip::before{content:'';position:absolute;bottom:100%;left:24px;border:6px solid transparent;border-bottom-color:var(--tx)}.ta-tip-wrap:hover .ta-tip{display:block}
.ct{padding:24px}.cd{background:var(--bg-p);border-radius:var(--rl);padding:18px 20px;border:.5px solid var(--bd3)}.ct2{font-size:13px;font-weight:500;margin-bottom:14px}
.dash-guide{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;padding:4px 0}.dash-guide-text{font-size:12px;line-height:1.6;color:var(--tx2)}.dash-guide-btn{align-self:flex-start;font-size:12px;padding:6px 14px;border-radius:var(--rm);border:.5px solid var(--bd2);background:var(--bg-s);color:var(--tx2);cursor:pointer;font-family:var(--fs);font-weight:600;transition:all .1s}.dash-guide-btn:hover{background:var(--bg-t);color:var(--tx)}
.dash-status{display:flex;align-items:center;gap:20px}.dash-nis2{display:flex;flex-direction:column;align-items:center;flex-shrink:0;min-width:100px}.dash-nis2-val{font-size:48px;font-weight:600;line-height:1}.dash-nis2-label{font-size:12px;color:var(--tx2);margin-top:4px}.dv{width:.5px;height:68px;background:var(--bd3);flex-shrink:0}
.dash-leg-card{margin-top:12px}.dash-donut{flex-shrink:0}.dash-legend{display:flex;gap:24px;flex-wrap:wrap}.dash-legend-row{display:flex;align-items:center;gap:8px;font-size:13px}.dash-legend-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}.dash-legend-dot-stripe{width:10px;height:10px;border-radius:50%;flex-shrink:0;background:repeating-linear-gradient(45deg,var(--cg),var(--cg) 1.5px,transparent 1.5px,transparent 3px);opacity:.5}.dash-legend-label{color:var(--tx2);white-space:nowrap}.dash-legend-val{font-weight:600;font-family:var(--fm);font-size:12px;min-width:50px;text-align:right}
.nc{margin-top:16px}.gap-banner{display:flex;align-items:flex-start;gap:8px;padding:10px 14px;border-radius:var(--rm);background:var(--bx-50);margin-bottom:14px;font-size:11px;line-height:1.5;color:var(--tx2)}.gap-banner svg{flex-shrink:0;margin-top:1px;color:var(--bx)}.gap-banner strong{color:var(--tx)}
.n2a{border-radius:var(--rm);margin-bottom:6px;position:relative}.n2a-head{display:grid;grid-template-columns:24px 1fr;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-radius:var(--rm);transition:background .1s;position:relative}.n2a-head:hover{background:var(--bg-s)}
.n2a-head-inner{display:flex;align-items:center;gap:6px}.bl{font-weight:500;font-size:12px;color:var(--bx)}.bi{display:flex;flex-direction:column;gap:6px;position:relative}.bd{font-size:11px;color:var(--tx2);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bt{width:100%;height:22px;background:var(--bg-s);border-radius:11px;overflow:visible;position:relative}.bf{height:100%;border-radius:11px;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;transition:width .3s;min-width:32px;position:relative;z-index:1}.bp{font-size:10px;font-weight:500;color:#fff;text-shadow:0 0 3px rgba(0,0,0,.6),0 0 1px rgba(0,0,0,.9)}
.bt-hatch{position:absolute;top:0;bottom:0;border-radius:0 11px 11px 0;background:repeating-linear-gradient(45deg,transparent,transparent 2.5px,var(--cz) 2.5px,var(--cz) 4.5px);opacity:.3;z-index:2;cursor:help}.bt-hatch-tip{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);font-size:10px;font-weight:500;color:var(--bg-p);background:var(--tx);padding:4px 8px;border-radius:5px;white-space:nowrap;pointer-events:none;font-family:var(--fm);box-shadow:0 2px 6px rgba(0,0,0,.2);z-index:200}.bt-hatch-tip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:var(--tx)}.bt-hatch:hover .bt-hatch-tip{display:block}
:root.dark .bt-hatch{opacity:.45;background:repeating-linear-gradient(45deg,transparent,transparent 2.5px,rgba(255,255,255,.35) 2.5px,rgba(255,255,255,.35) 4.5px)}
.n2a-chev{width:10px;height:10px;flex-shrink:0;color:var(--tx3);transition:transform .2s;margin-right:4px}.n2a.open .n2a-chev{transform:rotate(90deg)}
.n2a-body{display:none;padding:0 12px 8px 36px}.n2a.open .n2a-body{display:block}
.bi .area-tip{display:none;position:absolute;bottom:calc(100% + 10px);right:0;background:var(--tx);color:var(--bg-p);font-size:11px;padding:10px 12px;border-radius:8px;width:240px;line-height:1.5;z-index:200;box-shadow:0 4px 16px rgba(0,0,0,.25);pointer-events:none;white-space:normal;font-weight:400}.bi .area-tip::after{content:'';position:absolute;top:100%;right:30px;border:6px solid transparent;border-top-color:var(--tx)}.bi:hover .area-tip{display:block}
.at-head{font-weight:500;margin-bottom:6px;font-size:10px;text-transform:uppercase;letter-spacing:.03em;opacity:.7}.at-row{display:flex;align-items:center;gap:6px;padding:1px 0}.at-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}.at-val{margin-left:auto;font-family:var(--fm);font-weight:500}
.n2s{padding:7px 0;border-bottom:.5px solid var(--bd3)}.n2s:last-child{border-bottom:none}.n2s-head{display:flex;align-items:center;gap:8px;cursor:pointer;padding:2px 0;border-radius:4px}.n2s-head:hover{background:var(--bg-s);margin:-2px -4px;padding:4px}.n2s-chev{width:8px;height:8px;flex-shrink:0;color:var(--tx3);transition:transform .15s}.n2s.open .n2s-chev{transform:rotate(90deg)}.n2s-num{font-weight:500;font-size:11px;color:var(--bx);min-width:28px;font-family:var(--fm)}.n2s-name{flex:1;font-size:12px;color:var(--tx);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.n2s-bar{width:60px;height:4px;background:var(--bg-s);border-radius:2px;overflow:hidden;flex-shrink:0}.n2s-fill{height:100%;border-radius:2px;transition:width .3s}.n2s-pct{font-size:11px;font-weight:500;min-width:32px;text-align:right;font-family:var(--fm)}
.n2c{display:none;padding:6px 0 2px 36px}.n2s.open .n2c{display:block}.n2cr{display:flex;align-items:center;gap:8px;padding:3px 0;font-size:11px}.n2cr-id{color:var(--tx2);font-family:var(--fm);min-width:40px}.n2cr-name{flex:1;color:var(--tx2);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.n2cr-val{font-family:var(--fm);font-weight:500;min-width:32px;text-align:right}.n2cr-ico{width:14px;text-align:center;flex-shrink:0;font-size:10px}
.n2g{margin-top:10px;padding-top:8px;border-top:.5px dashed var(--bd2)}.n2g-label{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.04em;color:var(--cz);margin-bottom:6px;display:flex;align-items:center;gap:5px}.n2g-sub{padding:4px 0;border-bottom:.5px solid var(--bd3)}.n2g-sub:last-child{border-bottom:none}.n2g-tri{font-size:10px;color:var(--cz);flex-shrink:0;margin-right:2px}
.at-dot-stripe{width:6px;height:6px;border-radius:50%;flex-shrink:0;background:repeating-linear-gradient(45deg,var(--cg),var(--cg) 1px,transparent 1px,transparent 2px);opacity:.6}
.dev-ban-wrap{margin-bottom:12px}.dev-ban{padding:0 16px;height:40px;font-size:12px;background:#FEF3CD;color:#856404;border-radius:var(--rm);display:flex;align-items:center;gap:8px}.dev-ban svg{flex-shrink:0}.dev-ban span{flex:1}.dev-ban button{font-size:11px;padding:3px 10px;border-radius:4px;border:1px solid #856404;background:transparent;color:#856404;cursor:pointer;font-family:var(--fs);white-space:nowrap}.dev-ban button:hover{background:rgba(133,100,4,.1)}
.toast{position:fixed;top:64px;right:20px;z-index:1000;padding:12px 18px;border-radius:var(--rm);font-size:12px;line-height:1.5;box-shadow:0 4px 16px rgba(0,0,0,.15);animation:ti .25s;max-width:380px;cursor:pointer}.toast.ok{background:#EAF3DE;color:#3B6D11;border:1px solid #C5E1A5}.toast.err{background:#FDECEC;color:#8B2222;border:1px solid #F5C6C6}.toast strong{display:block;margin-bottom:2px}@keyframes ti{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
.cg{background:var(--bg-p);border-radius:var(--rl);border:.5px solid var(--bd3);margin-bottom:12px;overflow:hidden}.cg-head{display:flex;align-items:center;padding:11px 16px;cursor:pointer;user-select:none;gap:10px}.cg-head:hover{background:var(--bg-s)}.cg-chev{width:14px;height:14px;flex-shrink:0;transition:transform .2s;color:var(--tx3)}.cg.open .cg-chev{transform:rotate(90deg)}.cg-label{font-size:12px;font-weight:500;color:var(--bx);flex:1}.cg-badge{font-size:10px;color:var(--tx3);background:var(--bg-s);padding:2px 7px;border-radius:10px;font-family:var(--fm)}
.cg-body{display:none;border-top:.5px solid var(--bd3)}.cg.open .cg-body{display:block}
.cr-ch{display:grid;grid-template-columns:54px 52px 1fr 74px;align-items:center;padding:6px 16px;font-size:9.5px;font-weight:500;color:var(--tx3);text-transform:uppercase;letter-spacing:.04em;background:var(--bg-s);border-bottom:.5px solid var(--bd3)}.cr-ch .col-v{text-align:center}
.col-tip{position:relative;cursor:help}.tip-box{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:var(--tx);color:var(--bg-p);font-size:10px;font-weight:400;text-transform:none;letter-spacing:0;padding:6px 10px;border-radius:6px;width:190px;line-height:1.4;z-index:100;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.2);white-space:normal}.tip-box::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:var(--tx)}.col-tip:hover .tip-box{display:block}
.cr{display:grid;grid-template-columns:54px 52px 1fr 74px;align-items:center;padding:0 16px;font-size:12px;border-bottom:.5px solid var(--bd3);min-height:38px;cursor:pointer;transition:background .1s}.cr:last-child{border-bottom:none}.cr:hover{background:var(--bg-s)}.cr:hover .cr-name-text{font-weight:600}.cr.na .cr-name-wrap{opacity:.4}.cr.chg{background:rgba(184,117,14,.06)}
.cr-appl{display:flex;align-items:center;justify-content:center}.cr-tog{width:28px;height:15px;border-radius:8px;background:var(--cgs);opacity:.35;position:relative;cursor:pointer;transition:all .2s;flex-shrink:0}.cr-tog.on{background:var(--cg);opacity:1}.cr-tog::after{content:'';position:absolute;top:2px;left:2px;width:11px;height:11px;border-radius:50%;background:#fff;transition:left .2s}.cr-tog.on::after{left:15px}
.cr-id{color:var(--tx2);font-family:var(--fm);font-size:11px}
.cr-name-wrap{display:flex;align-items:center;gap:6px;padding:9px 4px 9px 0;min-width:0;overflow:hidden}.cr-name-text{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.no-n2{font-size:10px;padding:2px 6px;border-radius:4px;background:var(--bg-t);color:var(--tx2);white-space:nowrap;font-family:var(--fs);font-weight:600;letter-spacing:.02em;flex-shrink:0;border:.5px solid var(--bd2)}
.cr-val input{width:100%;font-size:11px;padding:4px 2px;border-radius:4px;border:.5px solid var(--bd3);background:var(--bg-p);color:var(--tx);font-family:var(--fm);text-align:center}.cr-val input:focus{outline:1.5px solid var(--bx);border-color:var(--bx)}
:root.dark .sb{background:#3a3a3a!important}:root.dark .bl,:root.dark .cg-label,:root.dark .n2s-num{color:var(--bx)!important}:root.dark .cr.chg{background:rgba(239,159,39,.06)!important}:root.dark .dev-ban{background:rgba(239,159,39,.12)!important;color:#EF9F27!important}:root.dark .dev-ban button{border-color:#EF9F27!important;color:#EF9F27!important}:root.dark .toast.ok{background:#1a2e14;color:#97C459;border-color:#2d4a1e}:root.dark .toast.err{background:#2e1414;color:#F09595;border-color:#4a1e1e}:root.dark .gap-banner{background:rgba(154,154,154,.08)}
.iso-help{background:var(--bg-p);border-radius:var(--rl);border:.5px solid var(--bd3);overflow:hidden}.iso-help-head{display:flex;align-items:center;gap:8px;padding:10px 16px;cursor:pointer;font-size:12px;color:var(--tx2);transition:background .1s;user-select:none}.iso-help-head:hover{background:var(--bg-s)}.iso-help-head svg{flex-shrink:0;color:var(--tx3)}.iso-help-chev{transition:transform .2s}.iso-help-chev.open{transform:rotate(180deg)}.iso-help-body{padding:0 16px 14px;font-size:12px;line-height:1.65;color:var(--tx2)}.iso-help-body p{margin-bottom:8px}.iso-help-body ul{margin:0 0 8px 18px}.iso-help-body li{margin-bottom:4px}
.mob-menu{display:none;align-items:center;justify-content:center;width:36px;height:36px;border:none;background:transparent;color:var(--tx2);cursor:pointer;border-radius:var(--rm);flex-shrink:0;padding:0}.mob-menu:hover{background:var(--bg-s)}.mob-menu svg{width:20px;height:20px}
.mob-backdrop{display:none}
@media(max-width:640px){
.mob-menu{display:flex}
.mob-backdrop{display:block;position:fixed;inset:0;z-index:850;background:rgba(0,0,0,.4);animation:pdf-fade-in .15s}
.sh{display:flex;flex-direction:column}
.sb{position:fixed;left:0;top:0;height:100vh;z-index:900;width:240px;transform:translateX(-100%);transition:transform .25s ease}
.sb:not(.col){transform:translateX(0)}
.sb.col{width:240px}
.sb.col .sl span,.sb.col .ni-label,.sb.col .sf-body,.sb.col .sf-chev,.sb.col .meth-link-label{display:revert}
.sb.col .meth-link{justify-content:flex-start;padding:10px 16px}
.sb.col .sl{padding:20px 16px 12px;justify-content:flex-start}
.sb.col .ni{padding:10px 16px;justify-content:flex-start}
.sb.col .sf{padding:0 16px;margin-top:16px}
.sb.col .sf-card{padding:10px 12px;justify-content:flex-start}
.mn{flex:1;width:100%;overflow-y:auto}
.tb{padding:10px 16px;gap:8px}.tb h1{font-size:14px}
.ct{padding:12px}
.cd{padding:14px 14px;border-radius:var(--rm)}
.ct-actions{flex-wrap:wrap;gap:6px;margin-bottom:12px}
.ct-actions button{padding:10px 14px;font-size:12px}
.dash-status{flex-direction:column;align-items:stretch;gap:12px}
.dash-status .dv{display:none}
.dash-status .dash-donut{display:flex;justify-content:center}
.dash-nis2{flex-direction:row;justify-content:center;align-items:baseline;gap:10px;min-width:0}
.dash-nis2-val{font-size:36px}
.dash-guide{padding:8px 0}
.dash-guide-btn{padding:10px 16px;width:100%;text-align:center}
.dash-legend{flex-direction:column;gap:8px}
.dash-legend-row{font-size:12px}
.gap-banner{font-size:11px;padding:10px 12px}
.n2a{margin-bottom:10px}
.n2a-head{grid-template-columns:32px 1fr;gap:8px;padding:10px 8px}
.n2a-body{padding:0 4px 8px 32px}
.bi{gap:8px}
.bd{white-space:normal;font-size:11px}
.bt{height:20px;border-radius:10px}
.n2s-head{gap:5px;padding:4px 0}
.n2s-name{font-size:11px;white-space:normal}
.n2s-bar{width:44px}
.n2c{padding:6px 0 2px 20px}
.n2cr{flex-wrap:wrap;gap:4px;padding:4px 0}
.n2cr-name{font-size:10px;white-space:normal}
.cr-ch{display:none}
.cr{grid-template-columns:44px 1fr 56px;padding:0 10px;min-height:44px}
.cr-id{display:none}
.cr-name-wrap{padding:8px 2px 8px 0}
.cr-name-text{font-size:12px;white-space:normal}
.no-n2{font-size:9px;padding:1px 4px}
.cr-val input{font-size:12px;padding:6px 4px}
.cr-tog{width:32px;height:18px;border-radius:9px}.cr-tog::after{width:14px;height:14px;top:2px;left:2px}.cr-tog.on::after{left:16px}
.cg-head{padding:10px 12px}
.dp{width:100vw;max-width:100vw}
.dp-head{padding:16px 16px 12px}
.dp-section{padding:14px 16px}
.dp-close{width:36px;height:36px}
.pdf-modal{width:100%;margin:0 8px;padding:20px 18px}
.toast{left:12px;right:12px;top:auto;bottom:20px;max-width:none}
.ta-tip,.bt-hatch-tip,.bi .area-tip,.tip-box{display:none!important}
.iso-help-body{font-size:12px}
.dev-ban{font-size:11px;padding:0 12px;min-height:40px}
.ct2{font-size:14px;margin-bottom:16px}
}

.pdf-overlay{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;animation:pdf-fade-in .15s}.pdf-modal{background:var(--bg-p);border-radius:var(--rl);padding:24px 28px;width:380px;max-width:90vw;box-shadow:0 12px 40px rgba(0,0,0,.2)}.pdf-title{font-size:15px;font-weight:500;margin-bottom:4px}.pdf-sub{font-size:11px;color:var(--tx2);margin-bottom:18px;line-height:1.5}
.pdf-opt{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg-s);border-radius:var(--rm);margin-bottom:18px;cursor:pointer;user-select:none;transition:background .1s}.pdf-opt:hover{background:var(--bg-t)}.pdf-cb{width:18px;height:18px;border-radius:4px;border:1.5px solid var(--bd2);background:var(--bg-p);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}.pdf-cb.on{background:var(--bx);border-color:var(--bx)}.pdf-cb svg{opacity:0;transition:opacity .1s}.pdf-cb.on svg{opacity:1}.pdf-opt-text{font-size:12px;line-height:1.4}.pdf-opt-hint{font-size:10px;color:var(--tx3);margin-top:2px}
.pdf-btns{display:flex;gap:8px;justify-content:flex-end}.pdf-btns button{font-size:12px;padding:7px 18px;border-radius:var(--rm);border:.5px solid var(--bd2);background:var(--bg-p);color:var(--tx2);cursor:pointer;font-family:var(--fs);transition:all .15s}.pdf-btns button:hover{background:var(--bg-s)}.pdf-btns .pdf-go{background:var(--bx);color:#fff;border-color:var(--bx)}.pdf-btns .pdf-go:hover{opacity:.9}.pdf-btns .pdf-go:disabled{opacity:.5;cursor:wait}
@keyframes pdf-fade-in{from{opacity:0}to{opacity:1}}
.dp-overlay{position:fixed;inset:0;z-index:600;background:rgba(0,0,0,.18);display:flex;justify-content:flex-end;animation:dp-fade .15s ease-out}
@keyframes dp-fade{from{opacity:0}to{opacity:1}}
.dp{width:380px;max-width:90vw;height:100%;background:var(--bg-p);border-left:.5px solid var(--bd3);box-shadow:-8px 0 32px rgba(0,0,0,.08);overflow-y:auto;animation:dp-slide .2s ease-out;display:flex;flex-direction:column}
@keyframes dp-slide{from{transform:translateX(100%)}to{transform:translateX(0)}}
.dp-head{padding:20px 22px 16px;border-bottom:.5px solid var(--bd3);background:var(--bg-s)}
.dp-head-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.dp-id{font-family:var(--fm);font-size:13px;font-weight:600;color:var(--bx);letter-spacing:.01em}
.dp-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:none;background:transparent;color:var(--tx3);cursor:pointer;border-radius:6px;transition:all .12s}.dp-close:hover{background:var(--bd3);color:var(--tx)}
.dp-title{font-size:15px;font-weight:500;line-height:1.4;margin-bottom:10px}
.dp-tags{display:flex;gap:6px;flex-wrap:wrap}
.dp-tag{font-size:10px;font-weight:500;padding:3px 8px;border-radius:4px;letter-spacing:.01em}
.dp-tag-on{background:rgba(15,110,86,.08);color:var(--cg)}.dp-tag-off{background:var(--bg-t);color:var(--tx3)}.dp-tag-nis2{background:var(--bx-50);color:var(--bx)}.dp-tag-no{background:var(--bg-t);color:var(--tx3)}
.dp-section{padding:16px 22px;border-bottom:.5px solid var(--bd3)}.dp-section:last-child{border-bottom:none}
.dp-section-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--tx3);margin-bottom:10px}
.dp-bar-wrap{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.dp-bar{flex:1;height:20px;background:var(--bg-s);border-radius:10px;overflow:visible;position:relative}
.dp-bar-fill{height:100%;border-radius:10px;transition:width .3s;min-width:20px}
.dp-bar-target{position:absolute;top:-1px;bottom:-1px;border-right:2px dashed var(--tx2);opacity:.5}
.dp-bar-target-label{position:absolute;bottom:calc(100% + 5px);right:0;transform:translateX(50%);font-size:9px;font-weight:600;font-family:var(--fm);color:var(--tx3);white-space:nowrap}
.dp-bar-val{font-size:18px;font-weight:600;font-family:var(--fm);min-width:48px;text-align:right}
.dp-vals{display:flex;gap:0}.dp-val-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 0;border-right:.5px solid var(--bd3)}.dp-val-item:last-child{border-right:none}
.dp-val-label{font-size:10px;color:var(--tx3)}.dp-val-num{font-size:14px;font-weight:600;font-family:var(--fm)}
.dp-desc{font-size:13px;line-height:1.65;color:var(--tx2)}
.dp-disc{font-size:10px;color:var(--tx3);margin-top:10px;padding-top:8px;border-top:.5px dashed var(--bd2);line-height:1.5;font-style:italic}
.dp-nis2-list{display:flex;flex-direction:column;gap:8px}
.dp-nis2-item{display:flex;align-items:flex-start;gap:10px;padding:8px 10px;background:var(--bg-s);border-radius:var(--rm)}
.dp-nis2-badge{font-size:11px;font-weight:600;color:var(--bx);background:var(--bx-50);padding:2px 7px;border-radius:4px;font-family:var(--fm);flex-shrink:0;margin-top:1px}
.dp-nis2-text{display:flex;flex-direction:column;gap:2px;min-width:0}.dp-nis2-sub{font-size:11px;font-weight:500;font-family:var(--fm);color:var(--tx2)}.dp-nis2-name{font-size:12px;color:var(--tx);line-height:1.4}
.dp-empty{font-size:12px;color:var(--tx3);font-style:italic}
.cr.sel{background:var(--bx-50)}
:root.dark .dp-id{color:var(--bx)!important}:root.dark .dp-tag-nis2{background:rgba(154,154,154,.1)!important;color:var(--bx)!important}:root.dark .dp-nis2-badge{color:var(--bx)!important;background:rgba(154,154,154,.1)!important}
`;

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */
function Donut({ f, o, g, t }) {
  const R = 38, C = 2 * Math.PI * R;
  const aF = (f / t) * C, aO = (o / t) * C, aG = (g / t) * C;
  return (<div className="dash-donut"><svg width="100" height="100" viewBox="0 0 100 100">
    <defs>
      <pattern id="stripe-open" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
        <rect width="4" height="4" fill="var(--cg)" opacity="0.18" />
        <line x1="0" y1="0" x2="0" y2="4" stroke="var(--cg)" strokeWidth="2" opacity="0.4" />
      </pattern>
    </defs>
    <circle cx="50" cy="50" r={R} fill="none" stroke="var(--bg-s)" strokeWidth="9" />
    <circle cx="50" cy="50" r={R} fill="none" stroke="var(--cg)" strokeWidth="9" strokeDasharray={`${aF.toFixed(1)} ${(C - aF).toFixed(1)}`} strokeDashoffset="0" transform="rotate(-90 50 50)" />
    <circle cx="50" cy="50" r={R} fill="none" stroke="url(#stripe-open)" strokeWidth="9" strokeDasharray={`${aO.toFixed(1)} ${(C - aO).toFixed(1)}`} strokeDashoffset={`${(-aF).toFixed(1)}`} transform="rotate(-90 50 50)" />
    <circle cx="50" cy="50" r={R} fill="none" stroke="var(--cz)" strokeWidth="9" strokeDasharray={`${aG.toFixed(1)} ${(C - aG).toFixed(1)}`} strokeDashoffset={`${(-(aF + aO)).toFixed(1)}`} transform="rotate(-90 50 50)" />
    <text x="50" y="46" textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--tx)" dominantBaseline="central">{f}<tspan fontSize="10" fontWeight="400" fill="var(--tx3)">/{t}</tspan></text>
    <text x="50" y="60" textAnchor="middle" fontSize="7" fill="var(--tx2)">erfüllt</text>
  </svg></div>);
}

function N2CtrlRow({ cid, cm }) {
  const c = cm[cid]; if (!c) return null;
  const val = c.applicable ? c.erfuellung : 0;
  const col = val >= 80 ? "var(--cg)" : val >= 50 ? "var(--ca)" : "var(--cr)";
  return (<div className="n2cr" style={!c.applicable ? { opacity: .5 } : undefined}>
    <span className="n2cr-ico" style={{ color: col }}>●</span><span className="n2cr-id">{c.id}</span>
    <span className="n2cr-name">{c.name}</span>
    <span className="n2cr-val" style={{ color: col }}>{val}%</span>
  </div>);
}

function N2SubRow({ sub, cm }) {
  const [open, setOpen] = useState(false);
  const avg = Math.round(subScore(sub, cm));
  return (<div className={`n2s${open ? " open" : ""}`}>
    <div className="n2s-head" onClick={() => setOpen(!open)}>
      <svg className="n2s-chev" viewBox="0 0 8 8" fill="none"><path d="M2 1L6 4L2 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="n2s-num">{sub.id}</span><span className="n2s-name">{sub.name}</span>
      <div className="n2s-bar"><div className="n2s-fill" style={{ width: `${avg}%`, background: amp(avg) }} /></div>
      <span className="n2s-pct" style={{ color: amp(avg) }}>{avg}%</span>
    </div>
    <div className="n2c">{sub.controls.map(id => (<N2CtrlRow key={`${sub.id}-${id}`} cid={id} cm={cm} />))}</div>
  </div>);
}

function N2Area({ area, cm }) {
  const [open, setOpen] = useState(false);
  const st = areaStats(area, cm);
  return (<div className={`n2a${open ? " open" : ""}`}>
    <div className="n2a-head" onClick={() => setOpen(!open)}>
      <div className="n2a-head-inner">
        <svg className="n2a-chev" viewBox="0 0 10 10" fill="none"><path d="M3 1.5L7 5L3 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="bl">{area.id}</span>
      </div>
      <div className="bi">
        <div className="bd">{area.name}</div>
        <div className="bt">
          <div className="bf" style={{ width: `${Math.max(st.avg, 2)}%`, background: amp(st.avg) }}><span className="bp">{st.avg}%</span></div>
          {st.maxPct < 100 && <div className="bt-hatch" style={{ left: `${st.maxPct}%`, width: `${100 - st.maxPct}%` }}><span className="bt-hatch-tip">Max. {st.maxPct}% durch ISO erreichbar</span></div>}
        </div>
        <div className="area-tip">
          <div className="at-head">{st.total} Unterpunkte</div>
          <div className="at-row"><div className="at-dot" style={{ background: "var(--cg)" }} /><span>Erfüllt</span><span className="at-val">{st.fulfilled}</span></div>
          <div className="at-row"><div className="at-dot at-dot-stripe" /><span>Offen, abdeckbar durch ISO</span><span className="at-val">{st.open}</span></div>
          <div className="at-row"><div className="at-dot" style={{ background: "var(--cz)" }} /><span>NIS2-Zusätze</span><span className="at-val">{st.ng}</span></div>
        </div>
      </div>
    </div>
    <div className="n2a-body">
      {area.sections.map(sec => sec.subs.map(sub => (<N2SubRow key={sub.id} sub={sub} cm={cm} />)))}
      {st.ng > 0 && (<div className="n2g">
        <div className="n2g-label"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L11 10.5H1L6 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /><path d="M6 4.5v2.5M6 8.2v.3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>{st.ng} {st.ng === 1 ? "NIS2-Zusatz" : "NIS2-Zusätze"} ohne ISO-Entsprechung</div>
        {area.gaps.map((g, i) => (<div key={i} className="n2g-sub">
          <div className="n2s-head" style={{ cursor: "default" }}>
            <span className="n2g-tri">△</span>
            <span className="n2s-name" style={{ color: "var(--tx2)" }}>{g}</span>
            <div className="n2s-bar"><div className="n2s-fill" style={{ width: "0%", background: "var(--cz)" }} /></div>
            <span className="n2s-pct" style={{ color: "var(--cz)" }}>0%</span>
          </div>
        </div>))}
      </div>)}
    </div>
  </div>);
}

function CRow({ control, onChange, isChg, onSelect, isSel }) {
  const eR = useRef(null);
  const sk = `${control.id}-${control.erfuellung}-${control.applicable}`;
  const pk = useRef("");
  if (pk.current !== sk) { pk.current = sk; if (eR.current && document.activeElement !== eR.current) eR.current.value = control.erfuellung + "%"; }
  const hT = e => { e.stopPropagation(); onChange(control.id, control.applicable ? { applicable: false } : { applicable: true, erfuellung: 100 }); };
  const hF = e => { e.stopPropagation(); e.target.value = e.target.value.replace("%", "").trim(); e.target.select(); };
  const hB = f => e => { const v = clamp(parseInt(e.target.value) || 0); e.target.value = v + "%"; onChange(control.id, { [f]: v }); };
  const hK = e => { if (e.key === "Enter") { e.target.blur(); e.preventDefault(); } };
  const isN = NIS2_IDS.has(control.id);
  const naS = !control.applicable ? { opacity: .25, pointerEvents: "none" } : undefined;
  return (
    <div className={`cr${!control.applicable ? " na" : ""}${isChg ? " chg" : ""}${isSel ? " sel" : ""}`} onClick={() => onSelect && onSelect(control)}>
      <div className="cr-appl"><div className={`cr-tog${control.applicable ? " on" : ""}`} onClick={hT} /></div>
      <span className="cr-id">{control.id}</span>
      <div className="cr-name-wrap">
        <span className="cr-name-text">{control.name}</span>
        {!isN && <span className="no-n2">kein NIS2</span>}
      </div>
      <div className="cr-val" style={naS} onClick={e => e.stopPropagation()}><input ref={eR} type="text" defaultValue={`${control.erfuellung}%`} onFocus={hF} onBlur={hB("erfuellung")} onKeyDown={hK} /></div>
    </div>
  );
}

function CatGroup({ cat, controls, onChange, snapshot, defOpen, onSelect, selectedId }) {
  const [open, setOpen] = useState(defOpen || false);
  const cc = controls.filter(c => c.cat === cat.key);
  const ac = cc.filter(c => c.applicable).length;
  const allOn = ac === cc.length;
  /* Nach Import: Kategorien mit anwendbaren Controls aufklappen */
  useEffect(() => { if (snapshot) setOpen(ac > 0); }, [snapshot]); // eslint-disable-line react-hooks/exhaustive-deps
  const sm = useMemo(() => { if (!snapshot) return null; const m = {}; snapshot.forEach(s => { m[s.id] = s; }); return m; }, [snapshot]);
  const toggleAll = (e) => { e.stopPropagation(); if (allOn) { cc.forEach(c => onChange(c.id, { applicable: false })); } else { cc.forEach(c => { if (!c.applicable) onChange(c.id, { applicable: true, erfuellung: 100 }); }); } };
  return (
    <div className={`cg${open ? " open" : ""}`}>
      <div className="cg-head" onClick={() => setOpen(!open)}>
        <svg className="cg-chev" viewBox="0 0 14 14" fill="none"><path d="M5 2.5L10 7L5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div className={`cr-tog${allOn ? " on" : ""}`} onClick={toggleAll} />
        <span className="cg-label">{cat.label}</span>
        <span className="cg-badge">{ac}/{cat.count} anw.</span>
      </div>
      <div className="cg-body">
        <div className="cr-ch"><span style={{ textAlign: "center" }}>Anwendbar</span><span></span><span>Maßnahme</span>
          <span className="col-v col-tip">Erfüllung<span className="tip-box">Erfüllungsgrad: Abdeckung der Normanforderungen</span></span>
        </div>
        {cc.map(c => { const s = sm ? sm[c.id] : null; const ch = s && (c.applicable !== s.applicable || c.realispieler !== s.realispieler || c.erfuellung !== s.erfuellung || c.ziel !== s.ziel); return (<CRow key={c.id} control={c} onChange={onChange} isChg={ch} onSelect={onSelect} isSel={selectedId === c.id} />); })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DETAIL PANEL (Slide-in Variante C)
   ═══════════════════════════════════════════════════════════════════ */
function MethodikPanel({ onClose }) {
  return (
    <div className="dp-overlay" onClick={onClose}>
      <div className="dp" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="dp-head">
          <div className="dp-head-top">
            <h2 className="dp-title" style={{ marginBottom: 0 }}>Mapping-Methodik &amp; Quellen</h2>
            <button className="dp-close" onClick={onClose}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></button>
          </div>
        </div>
        <div className="dp-section">
          <div className="dp-section-label">Regulatorische Grundlage</div>
          <p className="dp-desc">Dieses Tool bildet die Anforderungen aus <strong>Artikel 21 Absatz 2 der NIS2-Richtlinie</strong> (EU) 2022/2555 ab — konkretisiert durch die <strong>Durchführungsverordnung (EU) 2024/2690</strong> vom 17. Oktober 2024. Die Durchführungsverordnung definiert die technischen und methodischen Anforderungen, die in den 10 Maßnahmenbereichen des Art. 21 zu erfüllen sind.</p>
        </div>
        <div className="dp-section">
          <div className="dp-section-label">ISO-Basis</div>
          <p className="dp-desc">Die Zuordnung erfolgt auf Basis der <strong>93 Controls aus Annex A der ISO/IEC 27001:2022</strong> (aktuelle Version). Das Mapping zeigt, welche ISO-Controls die jeweiligen NIS2-Teilanforderungen adressieren — und wo NIS2 über den ISO-Scope hinausgeht (sog. NIS2-Gaps).</p>
          <p className="dp-desc" style={{ marginTop: 8 }}>Die Beschreibungstexte zu den einzelnen Controls sind eigenständig formulierte, praxisorientierte Erklärungen — sie geben nicht den offiziellen Wortlaut der ISO-Norm wieder. Für den verbindlichen Normtext ist die Originalnorm bei ISO bzw. dem nationalen Normungsinstitut (z.&nbsp;B. DIN/Beuth) zu beziehen.</p>
        </div>
        <div className="dp-section">
          <div className="dp-section-label">Mapping-Herkunft</div>
          <p className="dp-desc">Das Mapping basiert auf dem <strong>OpenKRITIS NIS2 Security Mapping</strong> (openkritis.de, Stand April 2025), das die Anforderungen aus §30 BSIG den ISO 27001:2022-Controls zuordnet. Die Verteilung auf die Unterabschnitte der Durchführungsverordnung wurde von <strong>DextraData</strong> vorgenommen. Ein offizielles, normatives 1:1-Mapping zwischen ISO 27001 und NIS2 existiert nicht.</p>
        </div>
        <div className="dp-section">
          <div className="dp-section-label">Berechnungsmodell</div>
          <p className="dp-desc">Der NIS2-Deckungsgrad berechnet sich wie folgt: Jeder NIS2-Teilanforderung sind ISO-Controls zugeordnet. Der Sub-Score einer Teilanforderung ist der Durchschnitt der Erfüllungsgrade der zugeordneten Controls (nicht anwendbare Controls zählen als 0%). NIS2-spezifische Gaps ohne ISO-Entsprechung senken den Bereichs-Score zusätzlich. Der Gesamtwert ist der Durchschnitt aller 10 Bereichs-Scores.</p>
        </div>
        <div className="dp-section">
          <div className="dp-section-label">Quellen</div>
          <div className="meth-sources">
            <div className="meth-src">
              <span className="meth-src-tag">NIS2</span>
              <span>Richtlinie (EU) 2022/2555 — Artikel 21 Absatz 2</span>
            </div>
            <div className="meth-src">
              <span className="meth-src-tag">DVO</span>
              <span>Durchführungsverordnung (EU) 2024/2690 vom 17.10.2024</span>
            </div>
            <div className="meth-src">
              <span className="meth-src-tag">ISO</span>
              <span>ISO/IEC 27001:2022, Annex A (93 Controls)</span>
            </div>
            <div className="meth-src">
              <span className="meth-src-tag">MAP</span>
              <span>OpenKRITIS NIS2 Security Mapping (openkritis.de)</span>
            </div>
          </div>
        </div>
        <div className="meth-disc">Dieses Mapping ist eine fachliche Interpretation und kein rechtsverbindliches Dokument. Für verbindliche Aussagen zur NIS2-Konformität ist eine individuelle Prüfung durch qualifizierte Fachleute erforderlich.</div>
      </div>
    </div>
  );
}

function DetailPanel({ control, onClose, cm }) {
  if (!control) return null;
  const pct = control.erfuellung;
  const desc = CDESC[control.id];
  const refs = NIS2_REV[control.id] || [];
  const isN = refs.length > 0;
  return (
    <div className="dp-overlay" onClick={onClose}>
      <div className="dp" onClick={e => e.stopPropagation()}>
        <div className="dp-head">
          <div className="dp-head-top">
            <span className="dp-id">{control.id}</span>
            <button className="dp-close" onClick={onClose}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg></button>
          </div>
          <h2 className="dp-title">{control.name}</h2>
          <div className="dp-tags">
            <span className={`dp-tag ${control.applicable ? "dp-tag-on" : "dp-tag-off"}`}>{control.applicable ? "Anwendbar" : "Nicht anwendbar"}</span>
            {isN ? <span className="dp-tag dp-tag-nis2">NIS2-relevant</span> : <span className="dp-tag dp-tag-no">kein NIS2-Bezug</span>}
          </div>
        </div>
        {control.applicable && (
          <div className="dp-section">
            <div className="dp-section-label">Erfüllungsgrad</div>
            <div className="dp-bar-wrap">
              <div className="dp-bar">
                <div className="dp-bar-fill" style={{ width: `${Math.max(pct, 2)}%`, background: amp(pct) }} />
              </div>
              <span className="dp-bar-val" style={{ color: amp(pct) }}>{pct}%</span>
            </div>
          </div>
        )}
        <div className="dp-section">
          <div className="dp-section-label">Beschreibung</div>
          {desc ? <p className="dp-desc">{desc}</p> : <p className="dp-empty">Noch keine Beschreibung hinterlegt.</p>}
          <div className="dp-disc">Hinweis: Dies ist eine praxisorientierte Erklärung, kein offizieller Normtext. Für den verbindlichen Wortlaut siehe ISO/IEC 27001:2022.</div>
        </div>
        {refs.length > 0 && (
          <div className="dp-section">
            <div className="dp-section-label">NIS2-Zuordnung ({refs.length})</div>
            <div className="dp-nis2-list">
              {refs.map((r, i) => (
                <div key={i} className="dp-nis2-item">
                  <span className="dp-nis2-badge">{r.areaId}</span>
                  <div className="dp-nis2-text"><span className="dp-nis2-sub">{r.subId}</span><span className="dp-nis2-name">{r.subName}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function IsoHelp() {
  const [open, setOpen] = useState(false);
  return (
    <div className="iso-help" style={{ marginBottom: 12 }}>
      <div className="iso-help-head" onClick={() => setOpen(!open)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1"/><path d="M7 6.2v3.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><circle cx="7" cy="4.3" r=".7" fill="currentColor"/></svg>
        <span>So funktioniert diese Ansicht</span>
        <svg className={`iso-help-chev${open ? " open" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {open && <div className="iso-help-body">
        <p>Hier siehst du alle 93 Maßnahmen (Controls) der ISO 27001:2022 Annex A. Für jede Maßnahme kannst du festlegen:</p>
        <ul>
          <li><strong>Anwendbar:</strong> Schalte den Toggle ein, wenn diese Maßnahme in deinem ISMS relevant ist.</li>
          <li><strong>Erfüllungsgrad:</strong> Gib einen Prozentwert (0–100 %) ein, der den aktuellen Umsetzungsstand widerspiegelt. Beim Aktivieren wird standardmäßig 100 % eingetragen.</li>
        </ul>
        <p>Klick auf eine Zeile, um die Detailansicht mit Beschreibung und NIS2-Zuordnung zu öffnen. Alternativ kannst du deine Daten per CSV importieren.</p>
      </div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [controls, setControls] = useState(initControls);
  const [snapshot, setSnapshot] = useState(null);
  const [view, setView] = useState("dashboard");
  const isMob = () => window.innerWidth <= 640;
  const [collapsed, setCollapsed] = useState(isMob);
  const [dark, setDark] = useState(false);
  /* Auto-collapse sidebar when resizing to mobile */
  useEffect(() => { const h = () => { if (isMob()) setCollapsed(true); }; window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  const [toast, setToast] = useState(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfDetails, setPdfDetails] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [selCtrlId, setSelCtrlId] = useState(null);
  const [methOpen, setMethOpen] = useState(false);
  const fileRef = useRef(null);
  const titles = { dashboard: "Dashboard", controls: "ISO 27001 Annex A" };
  const nav = useCallback(v => { setView(v); if (isMob()) setCollapsed(true); }, []);
  const showToast = useCallback((t, c) => { setToast({ type: t, content: c }); setTimeout(() => setToast(null), 5000); }, []);
  const upd = useCallback((id, p) => { setControls(prev => prev.map(c => c.id === id ? { ...c, ...p } : c)); }, []);
  const reset = useCallback(() => { setControls(initControls()); setSnapshot(null); }, []);
  const applyIsoCert = useCallback(() => { const nc = controls.map(c => ({ ...c, applicable: true, erfuellung: 100, realispieler: 100, ziel: 100 })); setControls(nc); setSnapshot(nc.map(c => ({ ...c }))); showToast("ok", "Alle 93 Controls auf anwendbar / 100 % gesetzt."); }, [controls, showToast]);
  const hasDev = useMemo(() => { if (!snapshot) return false; return controls.some((c, i) => { const s = snapshot[i]; return c.applicable !== s.applicable || c.realispieler !== s.realispieler || c.erfuellung !== s.erfuellung || c.ziel !== s.ziel; }); }, [controls, snapshot]);
  const cm = useMemo(() => { const m = {}; controls.forEach(c => { m[c.id] = c; }); return m; }, [controls]);
  const cov = useMemo(() => nis2Cov(cm), [cm]);
  const dn = useMemo(() => globalDonut(cm), [cm]);
  const handleImport = useCallback(e => {
    const file = e.target.files?.[0]; if (!file) return; e.target.value = "";
    const reader = new FileReader(); reader.onload = evt => {
      const res = parseCsv(evt.target.result); if (res.error) { showToast("err", res.error); return; }
      const nc = CD.map(cd => { const imp = res.parsed[cd.id]; return imp ? { id: cd.id, cat: cd.cat, name: cd.name, ...imp } : { id: cd.id, cat: cd.cat, name: cd.name, applicable: false, realispieler: 0, erfuellung: 0, ziel: 0 }; });
      setControls(nc); setSnapshot(nc.map(c => ({ ...c }))); setView("dashboard");
      showToast("ok", `${res.format}-Format. ${res.matched} Maßnahmen importiert${res.skipped > 0 ? `, ${res.skipped} übersprungen` : ""}${93 - res.matched > 0 ? `, ${93 - res.matched} ohne Daten` : ""}.`);
    }; reader.readAsText(file);
  }, [showToast]);
  const handlePdf = useCallback(async () => {
    setPdfBusy(true);
    try { await exportPdf(cm, pdfDetails); setPdfOpen(false); }
    catch (e) { showToast("err", e.message || "PDF-Export fehlgeschlagen"); }
    finally { setPdfBusy(false); }
  }, [cm, pdfDetails, showToast]);

  return (<>
    <style>{CSS}</style>
    <div className="sh">
      {toast && <div className={`toast ${toast.type}`} onClick={() => setToast(null)}><strong>{toast.type === "ok" ? "Import erfolgreich" : "Import fehlgeschlagen"}</strong>{toast.content}</div>}
      <div className={`sb${collapsed ? " col" : ""}`}>
        <div className="sl"><svg viewBox="0 0 28 28" fill="none" onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer" }}><rect width="28" height="28" rx="6" fill="rgba(255,255,255,0.15)" /><path d="M7 8h14M7 14h10M7 20h14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" /><circle cx="21" cy="14" r="3" fill="#fff" opacity="0.8" /></svg><span>NIS2 Readiness Check<small>by DextraData</small></span></div>
        <div className="nv">
          <div className={`ni${view === "dashboard" ? " ac" : ""}`} onClick={() => nav("dashboard")}><svg viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" /></svg><span className="ni-label">Dashboard</span></div>
          <div className={`ni${view === "controls" ? " ac" : ""}`} onClick={() => nav("controls")}><svg viewBox="0 0 18 18" fill="none"><rect x="2" y="1" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.1" /><path d="M5.5 5.5L7 7L10.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><line x1="5.5" y1="10.5" x2="12.5" y2="10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" /><line x1="5.5" y1="14" x2="12.5" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" /></svg><span className="ni-label">ISO 27001 Annex A</span></div>
        </div>
        <div className="meth-link" onClick={() => setMethOpen(true)}><span className="meth-link-label">Mapping-Methodik &amp; Quellen</span></div>
        <div className="sf"><a className="sf-card" href="https://grasp-grc.com/produkte/internal-audit/?dexid=CjwKCAjw46HPBhAMEiwASZpLRNaMPKV-N20VYmfRpjZiLdqxXtOz5zVJcbuHS6S2NY402TkbhtuQzRoCmvAQAvD_BwE&utm_term=&utm_campaign=GRASP/DE&utm_source=adwords&utm_medium=ppc&hsa_acc=5779191755&hsa_cam=20004324144&hsa_grp=163269351792&hsa_ad=700390228445&hsa_src=g&hsa_tgt=kwd-3500001&hsa_kw=&hsa_mt=b&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=20004324144&gbraid=0AAAAADfOXqz2Ssu7uah4EvTb0uQd3eQcP&gclid=CjwKCAjw46HPBhAMEiwASZpLRNaMPKV-N20VYmfRpjZiLdqxXtOz5zVJcbuHS6S2NY402TkbhtuQzRoCmvAQAvD_BwE" target="_blank" rel="noopener noreferrer"><div className="sf-logo"><svg viewBox="0 0 30 34" fill="none"><path d="M15 2l8.5 3h2.5v11c0 7.5-11 15-11 15S4 23.5 4 16V5h2.5L15 2z" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" fill="rgba(255,255,255,.1)"/><circle cx="15" cy="14" r="5" stroke="#fff" strokeWidth="2.2" fill="none"/><line x1="11.2" y1="17.8" x2="6.5" y2="22.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/><path d="M12.8 12.2a3 3 0 0 1 4.2.6" stroke="#E8A0A0" strokeWidth="1.4" strokeLinecap="round" fill="none"/></svg></div><div className="sf-body"><span className="sf-title">Gaps gefunden?</span><span className="sf-sub">Mit GRASP schließen</span></div><svg className="sf-chev" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></a></div>
      </div>
      {!collapsed && <div className="mob-backdrop" onClick={() => setCollapsed(true)} />}
      <div className="mn">
        <div className="tb"><button className="mob-menu" onClick={() => setCollapsed(c => !c)}><svg viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></button><h1>{titles[view]}</h1><div className="tb-right">{snapshot && <button className="ta-reset" onClick={reset}>Zurücksetzen</button>}<button className={`dm-toggle2${dark ? " moon" : " sun"}`} onClick={() => setDark(d => !d)} title={dark ? "Light Mode" : "Dark Mode"}>{dark ? <svg viewBox="0 0 20 20" fill="none"><path d="M16.8 11.9A7.2 7.2 0 0 1 8.1 3.2a7.2 7.2 0 1 0 8.7 8.7z" fill="#E8EDF5" stroke="#E8EDF5" strokeWidth="0.5" strokeLinejoin="round"/></svg> : <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" fill="#FFD43B" stroke="#F5C211" strokeWidth="0.8"/><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M5.1 5.1l1.4 1.4M13.5 13.5l1.4 1.4M5.1 14.9l1.4-1.4M13.5 6.5l1.4-1.4" stroke="#F5C211" strokeWidth="1.4" strokeLinecap="round"/></svg>}</button></div></div>
        <div className="ct">
          <div className="ct-actions">
            {view === "dashboard" && <button className="pm" onClick={() => setPdfOpen(true)}>Export PDF</button>}
            {view === "controls" && <><input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleImport} /><span className="ta-tip-wrap"><button className="ta-iso" onClick={applyIsoCert}>ISO 27001 zertifiziert</button><span className="ta-tip">Setzt alle 93 Controls auf anwendbar / 100&nbsp;%. Zeigt die theoretische NIS2-Baseline bei vollständiger ISO-Umsetzung.</span></span><button onClick={dlTemplate}>Vorlage CSV</button><button onClick={() => fileRef.current?.click()}>Import CSV</button></>}
          </div>
          {view === "dashboard" && (<div>
            <div className="cd">
              <div className="ct2" style={{ fontSize: 15 }}>NIS2-Deckungsgrad</div>
              <div className="dash-status">
                <Donut f={dn.fulfilled} o={dn.open} g={dn.gaps} t={dn.total} /><div className="dv" />
                <div className="dash-nis2"><div className="dash-nis2-val" style={{ color: amp(cov) }}>{cov}%</div><div className="dash-nis2-label">NIS2-Deckung</div></div>
                <div className="dv" />
                <div className="dash-guide">{(() => { const nAppl = controls.filter(c => c.applicable).length; return nAppl === 0 ? (<><p className="dash-guide-text">Noch keine ISO-Maßnahmen bewertet. Wechsle zur Ansicht <strong>ISO 27001 Annex A</strong>, um deine Controls zu bewerten oder importiere eine CSV-Datei.</p><button className="dash-guide-btn" onClick={() => setView("controls")}>Zur ISO-Ansicht</button></>) : (<><p className="dash-guide-text">Basierend auf <strong>{nAppl} von 93</strong> als anwendbar bewerteten Maßnahmen.</p><button className="dash-guide-btn" onClick={() => setView("controls")}>Bewertungen anpassen</button></>); })()}</div>
              </div>
            </div>
            <div className="cd dash-leg-card">
              <div className="dash-legend">
                <div className="dash-legend-row"><div className="dash-legend-dot" style={{ background: "var(--cg)" }} /><span className="dash-legend-label">Erfüllt</span><span className="dash-legend-val">{dn.fulfilled} von {T_NIS2}</span></div>
                <div className="dash-legend-row"><div className="dash-legend-dot dash-legend-dot-stripe" /><span className="dash-legend-label">Offen, abdeckbar durch ISO</span><span className="dash-legend-val">{dn.open} von {T_NIS2}</span></div>
                <div className="dash-legend-row"><div className="dash-legend-dot" style={{ background: "var(--cz)" }} /><span className="dash-legend-label">NIS2-Zusätze</span><span className="dash-legend-val">{dn.gaps} von {T_NIS2}</span></div>
              </div>
            </div>
            <div className="cd nc">
              <div className="ct2" style={{ fontSize: 15 }}>Abdeckung pro NIS2-Bereich (Art. 21 Abs. 2)</div>
              <div className="gap-banner"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" /><path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg><span><strong>ISO 27001 ≠ NIS2.</strong> Der schraffierte Bereich in den Balken zeigt den Anteil, der durch ISO 27001 allein nicht erreichbar ist. Hover über einen Balken für Details pro Bereich.</span></div>
              {NIS2.areas.map(a => (<N2Area key={a.id} area={a} cm={cm} />))}
            </div>
          </div>)}
          {view === "controls" && (<div>
            {hasDev && <div className="dev-ban-wrap"><div className="dev-ban show"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L15 14H1L8 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M8 6v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg><span>Änderungen gegenüber dem Import erkannt</span><button onClick={reset}>Zurücksetzen</button></div></div>}
            <IsoHelp />
            {CATS.map((cat, i) => (<CatGroup key={cat.key} cat={cat} controls={controls} onChange={upd} snapshot={snapshot} defOpen={i === 0} onSelect={c => setSelCtrlId(c.id)} selectedId={selCtrlId} />))}
          </div>)}
        </div>
      </div>
    </div>
      {pdfOpen && (<div className="pdf-overlay" onClick={e => { if (e.target === e.currentTarget) setPdfOpen(false); }}>
        <div className="pdf-modal">
          <div className="pdf-title">PDF-Export</div>
          <div className="pdf-sub">Erstellt einen Bericht mit Deckblatt, Übersichtsseite und optional allen Detailseiten pro NIS2-Bereich.</div>
          <div className="pdf-opt" onClick={() => setPdfDetails(!pdfDetails)}>
            <div className={`pdf-cb${pdfDetails ? " on" : ""}`}><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
            <div><div className="pdf-opt-text">Detailseiten einschließen</div><div className="pdf-opt-hint">Alle NIS2-Bereiche aufgeklappt mit Controls und Werten</div></div>
          </div>
          <div className="pdf-btns">
            <button onClick={() => setPdfOpen(false)}>Abbrechen</button>
            <button className="pdf-go" onClick={handlePdf} disabled={pdfBusy}>{pdfBusy ? "Wird erstellt\u2026" : "Exportieren"}</button>
          </div>
        </div>
      </div>)}
      {selCtrlId && cm[selCtrlId] && <DetailPanel control={cm[selCtrlId]} onClose={() => setSelCtrlId(null)} cm={cm} />}
      {methOpen && <MethodikPanel onClose={() => setMethOpen(false)} />}
  </>);
}
