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

/* Logo (JPEG base64 — white bg, 800×192px) */
const LOGO_B64 = "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";
const LOGO_W = 800, LOGO_H = 196;


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
  const FTY = H - 18; /* footer top y */
  const MBOT = FTY - 3; /* max content y before footer */
  const pgs = []; let pg;
  const np = () => { pg = { s: "" }; pgs.push(pg); };
  const o = (v) => { pg.s += v + "\n"; };
  const yP = (y) => ((H - y) * PT).toFixed(2);

  /* ── Colors ── */
  const BX=[124,35,72],TX=[42,42,42],TX2=[107,107,107],TX3=[154,154,154];
  const CG=[15,110,86],CA=[184,117,14],CR=[163,45,45],BGS=[245,245,243],CZ=[140,140,140];
  const SWOOP_DARK=[74,78,80], SWOOP_BX=[124,35,72], SWOOP_LT=[218,216,212];
  const FT_BG=[42,42,42]; /* dark footer background */
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

  /* ── Hatching helper: diagonal lines inside clipped rounded rect ── */
  const hatchRect = (x,y,w,h,r,col) => {
    /* Save state, build clip path (rounded rect), then draw diagonal lines */
    const px=x*PT, py=(H-y-h)*PT, pw=w*PT, ph=h*PT, pr=Math.min(r*PT,pw/2,ph/2), k=pr*.5522848;
    o("q");
    o(`${(px+pr).toFixed(2)} ${py.toFixed(2)} m ${(px+pw-pr).toFixed(2)} ${py.toFixed(2)} l ${(px+pw-pr+k).toFixed(2)} ${py.toFixed(2)} ${(px+pw).toFixed(2)} ${(py+pr-k).toFixed(2)} ${(px+pw).toFixed(2)} ${(py+pr).toFixed(2)} c ${(px+pw).toFixed(2)} ${(py+ph-pr).toFixed(2)} l ${(px+pw).toFixed(2)} ${(py+ph-pr+k).toFixed(2)} ${(px+pw-pr+k).toFixed(2)} ${(py+ph).toFixed(2)} ${(px+pw-pr).toFixed(2)} ${(py+ph).toFixed(2)} c ${(px+pr).toFixed(2)} ${(py+ph).toFixed(2)} l ${(px+pr-k).toFixed(2)} ${(py+ph).toFixed(2)} ${px.toFixed(2)} ${(py+ph-pr+k).toFixed(2)} ${px.toFixed(2)} ${(py+ph-pr).toFixed(2)} c ${px.toFixed(2)} ${(py+pr).toFixed(2)} l ${px.toFixed(2)} ${(py+pr-k).toFixed(2)} ${(px+pr-k).toFixed(2)} ${py.toFixed(2)} ${(px+pr).toFixed(2)} ${py.toFixed(2)} c W n`);
    strk(col); lw(.3);
    const step = 2.2 * PT;
    for (let lx = px - ph; lx < px + pw + ph; lx += step) {
      o(`${lx.toFixed(2)} ${py.toFixed(2)} m ${(lx+ph).toFixed(2)} ${(py+ph).toFixed(2)} l S`);
    }
    o("Q"); lw(.2);
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

  /* ── Reusable page furniture ── */
  const drawLogo = (wide) => {
    const lW = wide ? 55 : 40, lH = lW * LOGO_H / LOGO_W;
    const ly = wide ? 14 : 10;
    o(`q ${(lW*PT).toFixed(2)} 0 0 ${(lH*PT).toFixed(2)} ${((W-MR-lW)*PT).toFixed(2)} ${((H-ly-lH)*PT).toFixed(2)} cm /Logo Do Q`);
  };

  /* ═══════ PAGE 1: COVER ═══════ */
  np();
  drawLogo(true);

  /* Title */
  fill(TX); txt("NIS2 Readiness Check", ML, 72, "B", 26, "l");
  fill(TX2); txt(`Bericht vom ${ds}`, ML, 83, "N", 11, "l");

  /* Big score */
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

  /* ═══════ PAGE 2: OVERVIEW ═══════ */
  np(); let y = MT;
  drawLogo(false);
  fill(BX); txt("Abdeckung pro NIS2-Bereich", ML, y, "B", 16, "l"); y += 7;
  fill(TX2); txt("Artikel 21 Absatz 2 der NIS2-Richtlinie", ML, y, "N", 9, "l"); y += 14;
  const barW = 78, barH2 = 5.5, barX = ML + 70;
  ad.forEach(a => {
    if (y > MBOT - 20) { np(); y = MT; drawLogo(false); }
    const st = a.st, col = ampC(st.avg);
    /* Area label: "a" not "a)" — matching dashboard style */
    fill(BX); txt(a.id, ML, y+4, "B", 10, "l");
    fill(TX2); txt(trunc(a.name, 42), ML+8, y+4, "N", 8.5, "l");
    /* Pill bar */
    fill(BGS); rRect(barX, y, barW, barH2, barH2/2);
    if (st.avg > 0) { fill(col); rRect(barX, y, Math.max(st.avg/100*barW, barH2), barH2, barH2/2); }
    /* Diagonal hatching for unreachable zone */
    if (st.maxPct < 100) {
      const hx = barX + st.maxPct/100*barW;
      const hw = barW - st.maxPct/100*barW;
      hatchRect(hx, y, hw, barH2, barH2/2, CZ);
    }
    fill(col); txt(`${st.avg}%`, barX+barW+4, y+4, "B", 10, "l");
    y += 18;
  });
  /* Legend — centered, no background */
  y += 6; if (y > MBOT - 14) { np(); y = MT; drawLogo(false); }
  strk([220,218,215]); lw(.3); ln(ML, y, ML+PW, y); lw(.2); y += 6;
  fill(TX3);
  txt(">=80% = gr\u00fcn (erf\u00fcllt)  \u00b7  50\u201379% = gelb (teilweise)  \u00b7  <50% = rot (kritisch)", W/2, y, "N", 7, "c");
  txt("Schraffur = durch ISO 27001 allein nicht erreichbar", W/2, y+4.5, "N", 7, "c");

  /* ═══════ PAGES 3+: DETAILS ═══════ */
  if (includeDetails) {
    ad.forEach(a => {
      const st = a.st, col = ampC(st.avg);
      /* Helper: draw area header (used on first page + every continuation) */
      const drawAreaHdr = () => {
        fill(BX); txt(a.id, ML, y, "B", 14, "l");
        fill(TX2);
        const hL = wrap(a.name, PW - 10, 14, true);
        hL.forEach((l,j) => txt(l, ML+10, y + j*6, "B", 14, "l"));
        y += hL.length * 6 + 1;
        strk(BX); lw(.4); ln(ML, y, ML+PW, y); lw(.2); y += 4;
        fill(col); txt(`Deckungsgrad: ${st.avg}%`, ML, y, "B", 10, "l");
        if (st.maxPct < 100) { fill(TX3); txt(`(max. erreichbar: ${st.maxPct}%)`, ML + 42, y, "N", 10, "l"); }
        y += 10;
      };
      const areaBreak = () => { np(); y = MT; drawLogo(false); drawAreaHdr(); };

      np(); y = MT;
      drawLogo(false);
      drawAreaHdr();

      a.sections.forEach(sec => sec.subs.forEach(sub => {
        if (y > MBOT - 12) { areaBreak(); }
        const avg = Math.round(subScore(sub, cm)), sc = ampC(avg);
        fill([248,248,246]); rect(ML, y-4, PW, 8);
        fill(BX); txt(sub.id, ML+2, y, "B", 8.5, "l");
        fill(TX); txt(trunc(sub.name, 58), ML+16, y, "B", 8.5, "l");
        fill(sc); txt(`${avg}%`, ML+PW-2, y, "B", 8.5, "r");
        y += 8;
        sub.controls.forEach(cid => {
          if (y > MBOT - 6) { areaBreak(); }
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
        if (y > MBOT - 15) { areaBreak(); }
        y += 2; strk(CZ); lw(.3); dash(2,1); ln(ML, y, ML+PW, y); dashOff(); lw(.2); y += 5;
        fill(CZ); txt(`${a.gaps.length} NIS2-ZUS\u00c4TZE OHNE ISO-ENTSPRECHUNG`, ML, y, "B", 7.5, "l"); y += 6;
        a.gaps.forEach(g => {
          if (y > MBOT - 6) { areaBreak(); }
          fill(CZ); circ(ML+3, y-1, 1.3);
          fill(TX2); txt(trunc(g, 68), ML+7, y, "N", 7.5, "l");
          fill(CZ); txt("0%", ML+PW-2, y, "B", 7.5, "r");
          y += 5;
        });
      }
    });
  }

  /* ── Post-process: add footer + watermark to EVERY page ── */
  const FT_TX = [84,88,90]; /* #54585A */
  const totalP = pgs.length;
  for (let i = 0; i < totalP; i++) {
    const p = pgs[i];
    let fx = "";
    /* Centered footer on ALL pages — signature style */
    const ftY1 = H - 14, ftY2 = H - 10.5;
    const ft1 = "DextraData GRC Technologies GmbH  |  Girardetstra\u00dfe 4  |  D-45131 Essen  |  Gesch\u00e4ftsf\u00fchrer: Marco Wehler";
    const ft2 = "Amtsgericht Essen HRB 37332  |  Ust.Ident-Nr.: DE 458 594 296";
    const ft1x = (W/2 - tw(ft1, 5.5, false)/2) * PT;
    const ft2x = (W/2 - tw(ft2, 5.5, false)/2) * PT;
    fx += `${rgb([220,218,215])} RG\n0.5 w\n`;
    fx += `${(ML*PT).toFixed(2)} ${yP(ftY1-3)} m ${((W-MR)*PT).toFixed(2)} ${yP(ftY1-3)} l S\n0.57 w\n`;
    fx += `${rgb(FT_TX)} rg\n`;
    fx += `BT /F1 5.5 Tf ${ft1x.toFixed(2)} ${yP(ftY1)} Td ${pS(ft1)} Tj ET\n`;
    fx += `BT /F1 5.5 Tf ${ft2x.toFixed(2)} ${yP(ftY2)} Td ${pS(ft2)} Tj ET\n`;
    /* Page number — small, right-aligned */
    if (i > 0) {
      const sT = `Seite ${i+1}`;
      const sW = sT.length * 5.5 * .48;
      fx += `BT /F1 5.5 Tf ${((W-MR)*PT - sW).toFixed(2)} ${yP(ftY2)} Td ${pS(sT)} Tj ET\n`;
    }
    /* Watermark — tiled pattern, alternating texts */
    fx += `q\n${rgb([200,198,194])} rg\n`;
    const cos45 = 0.7071, sin45 = 0.7071, wmSz = 9;
    const wmA = "NIS2 Readiness Check", wmB = "DextraData GRC Technologies GmbH";
    const gx = 55, gy = 40; let wmIdx = 0;
    for (let wy = 20; wy < H - 20; wy += gy) {
      const rowOff = (Math.floor(wy / gy) % 2) * (gx / 2);
      for (let wx = -20 + rowOff; wx < W + 20; wx += gx) {
        const px = (wx * PT).toFixed(2), py = yP(wy);
        const wt = (wmIdx++ % 2 === 0) ? wmA : wmB;
        fx += `BT /F1 ${wmSz} Tf ${cos45.toFixed(4)} ${sin45.toFixed(4)} ${(-sin45).toFixed(4)} ${cos45.toFixed(4)} ${px} ${py} Tm ${pS(wt)} Tj ET\n`;
      }
    }
    fx += `Q\n`;
    p.s += fx;
  }

  /* ═══════ ASSEMBLE PDF FILE ═══════ */
  const _raw = atob(LOGO_B64), _jpg = new Uint8Array(_raw.length);
  for (let k = 0; k < _raw.length; k++) _jpg[k] = _raw.charCodeAt(k);

  const objs = [];
  const add = c => { objs.push(c); return objs.length; };
  const addBin = (dict, bin) => { objs.push({ dict, bin }); return objs.length; };

  const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const f1b = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const f1i = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>");
  const imgId = addBin(
    `<< /Type /XObject /Subtype /Image /Width ${LOGO_W} /Height ${LOGO_H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${_jpg.length} >>`,
    _jpg
  );

  const fontRes = `/Font << /F1 ${f1} 0 R /F1B ${f1b} 0 R /F1I ${f1i} 0 R >>`;
  const xobjRes = ` /XObject << /Logo ${imgId} 0 R >>`;
  const pIdx = add("@"); const pIds = [];
  pgs.forEach(p => {
    const sLen = p.s.length;
    const sObj = add(`<< /Length ${sLen} >>\nstream\n${p.s}\nendstream`);
    /* Logo XObject on ALL pages */
    pIds.push(add(`<< /Type /Page /Parent ${pIdx} 0 R /MediaBox [0 0 ${(W*PT).toFixed(2)} ${(H*PT).toFixed(2)}] /Contents ${sObj} 0 R /Resources << ${fontRes}${xobjRes} >> >>`));
  });
  objs[pIdx-1] = `<< /Type /Pages /Kids [${pIds.map(i=>`${i} 0 R`).join(" ")}] /Count ${pIds.length} >>`;
  const cat = add(`<< /Type /Catalog /Pages ${pIdx} 0 R >>`);

  const te = new TextEncoder();
  const parts = []; let tLen = 0;
  const ps2 = s => { const b = te.encode(s); parts.push(b); tLen += b.length; };

  ps2("%PDF-1.4\n");
  const offs = [];
  objs.forEach((obj, i) => {
    offs.push(tLen);
    if (obj && obj.bin) {
      ps2(`${i+1} 0 obj\n${obj.dict}\nstream\n`);
      parts.push(obj.bin); tLen += obj.bin.length;
      ps2(`\nendstream\nendobj\n`);
    } else {
      ps2(`${i+1} 0 obj\n${obj}\nendobj\n`);
    }
  });
  const xr = tLen;
  ps2(`xref\n0 ${objs.length+1}\n0000000000 65535 f \r\n`);
  offs.forEach(off => { ps2(`${String(off).padStart(10,"0")} 00000 n \r\n`); });
  ps2(`trailer\n<< /Size ${objs.length+1} /Root ${cat} 0 R >>\nstartxref\n${xr}\n%%EOF`);

  const bytes = new Uint8Array(tLen);
  let bOff = 0;
  for (const p of parts) { bytes.set(p, bOff); bOff += p.length; }

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
.cr-val input{font-size:16px;padding:6px 4px}
.cr-tog{width:32px;height:18px;border-radius:9px}.cr-tog::after{width:14px;height:14px;top:2px;left:2px}.cr-tog.on::after{left:16px}
.cg-head{padding:10px 12px}
.dp{width:100vw;max-width:100vw}
.dp-head{padding:16px 16px 12px}
.dp-section{padding:14px 16px}
.dp-close{width:36px;height:36px}
.pdf-modal{width:100%;margin:0 8px;padding:20px 18px}
.toast{left:12px;right:12px;top:auto;bottom:env(safe-area-inset-bottom,20px);max-width:none}
.ta-tip,.bt-hatch-tip,.bi .area-tip,.tip-box{display:none!important}
.iso-help-body{font-size:12px}
.dev-ban{font-size:11px;padding:0 12px;min-height:40px}
.ct2{font-size:14px;margin-bottom:16px}
.sb{padding-top:env(safe-area-inset-top,0px)}
.tb{padding-top:max(10px,env(safe-area-inset-top,0px))}
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
        <div className="sl"><svg viewBox="0 0 28 28" fill="none" onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer" }}><circle cx="14" cy="14" r="13" fill="rgba(255,255,255,0.15)" /><line x1="7" y1="7.5" x2="20" y2="7.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><line x1="6" y1="11.5" x2="21" y2="11.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><line x1="6" y1="15.5" x2="21" y2="15.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><line x1="7" y1="19.5" x2="20" y2="19.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg><span>NIS2 Readiness Check<small>by DextraData</small></span></div>
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
