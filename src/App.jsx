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
const LOGO_B64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCAHkBEwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo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VKaZ9blvH2T4y0cRelLz1j96/VI/JGivVv2kP2Hv2sf2SNRey/aB+Bmu+H4BL5cerSW3nafM3YR3cJaFyf7ofIzyBXlNWfaUa9HEU1UpSUovqndfegooooNQooooAu+HPE3iPwfrdv4l8I+IL7StRtJA9pqGnXbwTwsP4kdCGU+4Nfbf7Lv/AAcF/t4fAP7NonxH1ux+Juhw7Va28VIVvlQdQl7Fhyx/vTCb6V8L0UmkzhxuW4DMocmJpKa81qvR7r5M/oJ/Zd/4OCv2Dvj6bbRPiLrl98Mtcm2q1t4rQNYs57JexZjCj+9MIfpX214c8TeHPGOiW/iXwj4gsdV067j32moabdpPBMv95JEJVh7g1/I5Xov7P/7W/wC0t+yxrg1/9n340694XlMgea30+9Jtbgj/AJ7W77oZhx0dGqXBdD4PMvDnC1bywNRwfaWq+/df+TH9VdFfjN+y1/wc5/EXw+Lbw7+178FrXxBbKQsviXwe4tbwL3Z7WQ+VK3+48I9q/R79l3/gpv8AsSftfrb2Pwc+OmltrNwAB4Z1p/sOpBv7qwTYMxHcxF196hxaPz/MuGs6yq7rUnyr7UdV962+dj3uiiipPBCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDl/jf8TIPgt8F/F/xjutIfUIvCXhfUNZksI5hG1ytrbSTmIOQQpYR7c4OM5wa/Cj9qT/g4X/bm+PAudD+Fd5p/wAMNDmJVYvDYM2osh7PeyjcD/tQpCa/ar9u3/kx/wCMv/ZKfEX/AKbLiv5ZK0gkz9N8P8qy7G0qtbEUlOUWkr6padtvwNDxV4t8V+OtfufFXjbxNqGs6pePvu9S1W9kuLidv7zySEsx9yaz6KK0P1pJRVlsFFFFAwooooAKK9V/Zv8A2If2rv2uNTGn/s+fA/XPEMQk2TapHbiGwgb0kupisKHrwXycHANf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P/BO74e+Gb6y8nVNe04+ItZDLhjNfHzkDDsyQGCMj/pnX1BWEndn868TY1Zhnteqnpey9I6fja4UUUUjwQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAxvDnw5+H3g/WdU8R+E/A2j6ZqGuXX2nWr/T9Nihm1Cbp5k7ooaVscZYk8Vs0Vy3xc+OHwd+AfhWTxv8avidofhbSo8j7brmpR26O39xN5Bkc9lUFj2FBolVr1EleUn82dTRX5oftUf8HLX7Nnw8W48P8A7LXw+1Px/qSgrHrOph9N0xD2YB1+0TY/ulIwez1+bf7VH/BYL9vX9rUXOk+NPjJcaBoNzkN4Z8GhtOtCh6o5RjNMp/uyyOOOlWoNn12WcDZ3j7SqR9lHvLf/AMB3++x+/Piv9uz9kHwX8ZdF/Z7179oHw4PGmv6mun6d4etL37ROLls7YpvKDC3ZiNqiUpuYqBkkCvWq/kY0jWNV8P6va6/oeozWl7ZXKXFnd28hSSGVGDI6sOQwYAgjoRX9M/8AwTN/bX0P9u79k7QPjBHcQr4htYxpvjOwjwDbanEq+YwUfdSUFZk9FlAzlTRKNkacUcJf2DhqdalNzi9JNrZ9NFsn6vVb6n0BRRRUHxIUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABX5tf8AByL+2Gnwo/Zt0r9lTwpqoTW/iLcCfWUif54NHt3ViDjlfOnCKD0ZYplr9EvGnjHwx8PPCGqePfGusw6do+i6fNfapf3DYjt7eJC8kjH0CqT+FfzEft//ALXHiD9t39qvxR8f9XE0Nlf3X2bw7p8zZNjpkOUt4sdA2353xwZJHPergrs+24Gyd5jmyxE17lLX1l9lfr8vM8ZooorU/cgr1z9g/wDZwu/2tf2vPAXwCigke01zXo/7ZaPIMenxAzXbgjoRBHJj/awO9eR1+vP/AAbG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2bCjqSK/Rb9kX/g2k+Ofj17XxR+198QrXwRpbFXl8OaDJHfapIvdHlGbe3OOjAzehUUm0tzy8xzrLMphfFVVF9t2/RLU/NLwx4W8TeNvEFp4T8GeHb7VtUv5hFY6bplo89xcSHoiRoCzsfQAmv0w/YL/AODcX4q/EiWy+Iv7bWsy+D9CbbKng7S5kfVrteoWaQbo7RSMZA3ydQRGea/U/wDZR/YI/ZR/Yr0P+y/2fvhHYaXeSQ+Xe6/cj7RqV4OMiS5ky+0kZ8tSsYPRRXsVZufY/Ms68QcViU6WAj7OP8z+L5LZfi/Q4/4G/AD4M/s1fD+1+F3wK+HWm+GtDtBlLPToNpkfABklc5eaQ4GZHLMcck12FFFQfndSpOrNzm22929WwooooICiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqvq2k6Vr2mz6NrmmW97Z3UZjubS7hWSKVD1VlYEMD6EVYooBNp3R8YftLf8ABBj/AIJ7/tCfadW0H4d3Hw+1qfLDUfBFwLeHf1G60cNbhc9QiIT/AHhxj4F/aF/4Nnf2sPAXnap+z58TfDnj+zTJjsbzOkag3ooWVngb0yZl+np+5NFUpNH0uX8XZ9l1lCrzR7S95fe9V8mj+V/42fsUftb/ALOTTP8AG39nTxd4etoDh9SvNFlayP8Au3KBoW/BzWD8Jf2d/j18edSXSfgr8GvE/iqcvsI0HRJ7lUP+2yKVQepYgDvX9XrokiGORAysMMrDII9KisLCw0uzj0/TLKG2t4l2xQQRhEQegUcAVXtGfUR8SsSqNpYdc/fmdvutf8T8DvgJ/wAG537fXxUeC/8AifH4c+HenyENKdb1Rbu82HusFp5i7v8AZkkjPrg192/s4f8ABt9+xR8J5LfWfjVr2v8AxK1KEgvBfzf2fpxYdCLe3bzDz2eZ1PQjrn9CqKlzkz53H8aZ/j7r2nIu0Fb8dZfic78MfhH8LPgr4Xi8FfCH4daJ4Y0iHlNO0LTIrWHOMbisagMx7sck9zXRUUVJ8tKcpycpO7YUUUUEgORnGKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==";
const LOGO_W = 1100, LOGO_H = 484;



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
    const lW = wide ? 55 : 32, lH = lW * LOGO_H / LOGO_W;
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
    const wmA = "NIS2 Readiness Check", wmB = "GRASP German GRC";
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
:root{--bx:#7C2348;--bx-dark:#3E1124;--bx-50:#FAE8ED;--cg:#0F6E56;--ca:#B8750E;--cr:#A32D2D;--cb:#185FA5;--cgs:#5F5E5A;--cz:#8C8C8C;--bg-p:#fff;--bg-s:#f5f5f3;--bg-t:#ededeb;--tx:#1a1a1a;--tx2:#161314;--tx3:#161314;--bd3:rgba(0,0,0,.08);--bd2:rgba(0,0,0,.15);--rm:8px;--rl:12px;--fs:"Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;--fm:"SF Mono","Fira Code","Fira Mono",monospace}
:root.dark{--bx:#9A9A9A;--bx-dark:#3E1124;--cg:#5DCAA5;--ca:#EF9F27;--cr:#F09595;--cb:#85B7EB;--cgs:#B4B2A9;--cz:#707070;--bg-p:#1a1a1a;--bg-s:#2a2a2a;--bg-t:#222;--tx:#e8e8e8;--tx2:#a0a0a0;--tx3:#707070;--bd3:rgba(255,255,255,.08);--bd2:rgba(255,255,255,.15);--bx-50:rgba(154,154,154,.12)}
*{box-sizing:border-box;margin:0;padding:0}body,#root{font-family:var(--fs);color:var(--tx);background:var(--bg-t);height:100vh}
.sh{display:flex;height:100vh;overflow:hidden}
.sb{width:240px;background:var(--bx);flex-shrink:0;display:flex;flex-direction:column;transition:width .25s;overflow:hidden}.sb.col{width:52px}.sb.col .sl span,.sb.col .ni-label,.sb.col .sf-body,.sb.col .sf-chev,.sb.col .meth-link-label{display:none}.sb.col .meth-link{justify-content:center;padding:10px 0}.sb.col .sl{padding:16px 12px 12px;justify-content:center}.sb.col .ni{padding:10px 0;justify-content:center}.sb.col .sf{padding:0 8px;margin-top:12px}.sb.col .sf-card{padding:8px;justify-content:center}
.sl{padding:20px 16px 12px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,.12)}.sl svg{width:28px;height:28px;flex-shrink:0;cursor:pointer}.sl span{color:#fff;font-size:13px;font-weight:500;letter-spacing:.02em;line-height:1.2;white-space:nowrap;flex:1}
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
.sb-copy{margin-top:auto;padding:12px 16px 14px;font-size:9px;line-height:1.7;color:rgba(255,255,255,.35);border-top:1px solid rgba(255,255,255,.08)}.sb-copy a{color:rgba(255,255,255,.5);text-decoration:none;transition:color .15s}.sb-copy a:hover{color:#fff;text-decoration:underline}.sb-copy .sc-sep{margin:0 4px;opacity:.5}.sb.col .sb-copy{display:none}
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
        <div className="sl"><svg viewBox="0 0 28 28" fill="none" onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer" }}><circle cx="14" cy="14" r="13" fill="rgba(255,255,255,0.15)" /><line x1="7" y1="7.5" x2="20" y2="7.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><line x1="6" y1="11.5" x2="21" y2="11.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><line x1="6" y1="15.5" x2="21" y2="15.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><line x1="7" y1="19.5" x2="20" y2="19.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg><span>NIS2 Readiness Check</span></div>
        <div className="nv">
          <div className={`ni${view === "dashboard" ? " ac" : ""}`} onClick={() => nav("dashboard")}><svg viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><rect x="10" y="1" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><rect x="1" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><rect x="10" y="10" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" /></svg><span className="ni-label">Dashboard</span></div>
          <div className={`ni${view === "controls" ? " ac" : ""}`} onClick={() => nav("controls")}><svg viewBox="0 0 18 18" fill="none"><rect x="2" y="1" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.1" /><path d="M5.5 5.5L7 7L10.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><line x1="5.5" y1="10.5" x2="12.5" y2="10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" /><line x1="5.5" y1="14" x2="12.5" y2="14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.35" /></svg><span className="ni-label">ISO 27001 Annex A</span></div>
        </div>
        <div className="meth-link" onClick={() => setMethOpen(true)}><span className="meth-link-label">Mapping-Methodik &amp; Quellen</span></div>
        <div className="sf"><a className="sf-card" href="https://eu1.hubs.ly/H0v3Xtq0" target="_blank" rel="noopener noreferrer"><div className="sf-logo"><svg viewBox="0 0 30 34" fill="none"><path d="M15 2l8.5 3h2.5v11c0 7.5-11 15-11 15S4 23.5 4 16V5h2.5L15 2z" stroke="#fff" strokeWidth="2.8" strokeLinejoin="round" fill="rgba(255,255,255,.1)"/><circle cx="15" cy="14" r="5" stroke="#fff" strokeWidth="2.2" fill="none"/><line x1="11.2" y1="17.8" x2="6.5" y2="22.5" stroke="#fff" strokeWidth="2.6" strokeLinecap="round"/><path d="M12.8 12.2a3 3 0 0 1 4.2.6" stroke="#E8A0A0" strokeWidth="1.4" strokeLinecap="round" fill="none"/></svg></div><div className="sf-body"><span className="sf-title">Gaps gefunden?</span><span className="sf-sub">Mit GRASP schließen</span></div><svg className="sf-chev" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></a></div>
        <div className="sb-copy">NIS2 Readiness Check – Open Source by <a href="https://www.dextradata.com" target="_blank" rel="noopener noreferrer">DextraData GRC Technologies GmbH</a><br/>Part of <a href="https://grasp-grc.com" target="_blank" rel="noopener noreferrer">GRASP – German GRC</a><span className="sc-sep">·</span>Created by Michael Schillert</div>
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
