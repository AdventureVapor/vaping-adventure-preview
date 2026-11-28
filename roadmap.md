# Vaping Adventure – Roadmap

**Arbeitsstand:** Preview – Entwicklung 1.4.1/1.4.2 und technische Stabilisierung  
**Aktive Entwicklungsumgebung:** Preview  
**Produktivversion:** bleibt bis zur abgeschlossenen Qualitätssicherung unverändert.

Diese Roadmap dokumentiert umgesetzte und vom Nutzer bestätigte Funktionen sowie noch offene Prüfungen. Ein Häkchen bedeutet, dass die Funktion umgesetzt und – soweit sinnvoll – erfolgreich geprüft wurde.

## Versionsübersicht – Stand 28.11.2026

| Version | Status | Kurzüberblick |
|---|---|---|
| **Alpha 1.3** | Entwicklung und wesentliche Praxistests erledigt; finale Release-/Sicherheitsfreigabe offen | Registrierung, Login, verschlüsselte Cloud, geräteübergreifende Synchronisierung, CSV/JSON-Backup, Geräte und Galerie umgesetzt und weitgehend praktisch bestätigt. Produktion bleibt gesperrt, bis letzte Sicherheitsprüfung und ausdrückliche Freigabe abgeschlossen sind. |
| **1.4.1** | In Preview umgesetzt, QA offen; Cloud-Speicherung ist Release-Blocker mit höchster Priorität | Design-/Sprach-/Education-Erweiterungen, Gästebuch, Kontaktbereich, E-Mail-Vorlagen, Startanimation, PDF-Geräteanleitungen und sichere Aktivierung der getrennten Cloud-Datengruppen. Release erst nach vollständiger Speicher- und Synchronisationsprüfung. |
| **1.4.2** | In Entwicklung | Kontrolliert Vapen, Vape-Akademie, PWA, weitere Einstellungen sowie sichere Cloud-Datengruppen-/Medienmigration. Umfangreiche Live- und Regressionstests sind offen. |
| **1.5** | Geplant | Google-Anmeldung, erweiterte Benutzerprofile und Kontoverknüpfung. |
| **1.6** | Teilweise in Preview umgesetzt | Forum-Grundlage mit Themen, moderierten Antworten und mehrsprachiger Oberfläche ist vorhanden; Moderation, Sichtbarkeitstests und weitere Community-Funktionen sind offen. |
| **1.7** | Geplant | SEO, öffentliche Projektseiten, mehrsprachige Auffindbarkeit und technische Indexierungssteuerung. |

**Wichtig:** „Umgesetzt“ bedeutet nicht automatisch „produktionsreif“. Alle Änderungen bleiben in Preview, bis die jeweilige QA abgeschlossen und die Produktionsübernahme ausdrücklich freigegeben wurde.

## Neue Education-Erweiterung – Cannabis-Teillegalisierung

**Ziel:** Die Ausstellung „Das Kleingedruckte der Cannabis-Teillegalisierung“ als eigenständigen 18-teiligen Kurs in My Vaping Education integrieren.

- [x] Originalordner `websitecang` mit Startseite und 18 Originaltafeln in Preview bereitgestellt; Produktion bleibt unverändert
- [x] Eigenständigen Education-Kurs mit 18 Lektionen ergänzt; jede Lektion öffnet die zugehörige Originaltafel vollständig und im unveränderten Wortlaut
- [x] Kurs öffnet direkt im Hauptbereich rechts neben der Navigation – kein separates Fenster oder Modal
- [x] Pro Seite wird genau eine Originaltafel angezeigt; Vor-/Zurück-Navigation und Fortschrittsanzeige integriert
- [x] Originaltexte und Inhalte bleiben erhalten, die Gestaltung nutzt die jeweils in Einstellungen gewählte App-Farbpalette
- [x] Abschlusstest mit 18 Fragen erstellt; Bestehensgrenze 80 % (mindestens 15 richtige Antworten), Ergebnis und Kursfortschritt werden über das bestehende Education-System gespeichert
- [x] Hinweis auf den in der Ausstellung genannten Rechtsstand 03.10.2026 und auf die Notwendigkeit der Prüfung aktueller amtlicher Vorschriften ergänzt
- [x] Fehlerhafte Education-Navigation behoben: Link im linken Menü öffnet den Kurs wieder (PR #114)
- [x] Kursansicht im Hauptbereich integriert; jeweils eine Originaltafel mit Vor-/Zurück-Navigation, Fortschritt und Quiz (PR #115)
- [x] Unterschiedliche HTML-Strukturen der Tafeln 1–4 und 5–18 berücksichtigt; alle Tafeln werden über `article.tafel` oder `section.tafel` erkannt (PR #117)
- [ ] Kurs auf Desktop und iPhone praktisch prüfen: alle 18 Tafeln öffnen, Inhalte/Navigation kontrollieren, Quiz vollständig absolvieren und Ergebnis/Fortschritt prüfen
- [ ] Rechtsstand und alle gesetzlichen Aussagen vor einer späteren Veröffentlichung nochmals anhand amtlicher Quellen überprüfen



## Version 1.6 – My Vaping Adventure Forum

**Ziel:** Das Forum beginnt bewusst klein und wird in überschaubaren Schritten erweitert.

- [x] Erste Forum-Oberfläche in Preview vorbereitet: drei Startbereiche, öffentliche Themenübersicht und Formular für angemeldete Cloud-Mitglieder
- [x] Neue Themen werden mit Status „pending“ eingereicht und erst nach Moderationsfreigabe veröffentlicht
- [x] Deutsch, Englisch und Französisch sowie responsive Grundgestaltung ergänzt
- [x] Supabase-Datenbankschema und Row Level Security mit der SQL-Migration eingerichtet; Ausführung im Supabase SQL Editor vom Nutzer mit „Success. No rows returned“ bestätigt
- [x] Erste Forum-Oberfläche in Preview vom Nutzer aufgerufen und grundsätzlich als funktionierend bestätigt
- [ ] Moderation und Sichtbarkeit nach Freigabe praktisch testen
- [x] Themen-Detailansicht und Antwortfunktion ergänzt; Antworten werden ebenfalls zunächst moderiert
- [ ] Freiwillige Profilbilder und öffentliche Profilangaben anbinden
- [ ] Moderationsoberfläche für Moderatoren ergänzen; bis dahin Freigabe über Supabase-Dashboard
- [ ] Eigene Beiträge bearbeiten/löschen, Suche, Reaktionen, Benachrichtigungen und private Nachrichten erst in späteren Ausbaustufen prüfen

## Releaseplanung Version 1.4

Version 1.4 wird in zwei kleinere Produktionsschritte aufgeteilt. Beide Releases werden ausschließlich in Preview vorbereitet, getestet und erst nach ausdrücklicher Freigabe in Produktion übernommen.

### Version 1.4.1 – Oberfläche, Inhalte, E-Mail-Grundlage und Startanimation

**Release-Blocker – Cloud-Speicherung und Datensicherheit (höchste Priorität)**

Die zuverlässige Speicherung in den getrennten Cloud-Datengruppen wird von 1.4.2 auf 1.4.1 vorgezogen. Version 1.4.1 darf erst veröffentlicht werden, wenn die neue Speicherung vollständig funktioniert und die vorhandenen Nutzerdaten nachweislich vollständig erhalten bleiben.

- [x] Statische Altannahme „8 fehlende Einträge“ entfernt: sicherer ID-basierter Ergänzungsplan berechnet die tatsächliche Differenz dynamisch, bewahrt die Altbestand-Reihenfolge und stoppt zusätzliche, doppelte oder inhaltlich abweichende Einträge (Preview-Code + isolierte Tests).
- [ ] Datenmodell und Schreib-/Leseablauf aller sieben getrennten Datengruppen vollständig prüfen; normale App-Speichervorgänge müssen zuverlässig an die neue Speicherung angebunden sein.
- [ ] Sichere Parallelphase umsetzen: Legacy-Cloud-Speicher zunächst als unveränderte Rückfallquelle erhalten; neue Schreibvorgänge kontrolliert in die getrennten Gruppen übernehmen.
- [ ] Vorhandene Abweichungen zwischen Legacy-Spielstand und getrennten Gruppen sicher auflösen; aktuell dokumentierter Prüfstand: 87 Legacy-Tagebucheinträge gegenüber 78 Einträgen in den getrennten Gruppen, neun Einträge fehlen dort. Keine pauschale Überschreibung.
- [ ] Alle 21 Geräte, vier Fotos sowie fünf eingebettete Bilder und zwei eingebettete PDFs vollständig migrieren und jede Medienreferenz durch erneutes Lesen/Entschlüsseln verifizieren.
- [ ] Vollständigkeitsabgleich für Tagebuch, Geräte, Fotos, Spielstand/XP, Einstellungen und Medien durchführen; keine fehlenden, doppelten oder inhaltlich abweichenden Datensätze.
- [ ] Schreibfehler, Netzwerkunterbrechungen, Versionskonflikte, erneute Anmeldung und Wiederholungsversuche testen; Fehler dürfen weder stillschweigend Daten verlieren noch einen falschen Erfolg melden.
- [ ] Synchronisierung mit mindestens zwei Geräten und getrennten Testkonten prüfen; sicherstellen, dass jeder Benutzer ausschließlich seine eigenen Daten lesen und ändern kann.
- [ ] Vollständiges JSON-Backup erstellen und Wiederherstellung praktisch testen.
- [ ] Erst nach erfolgreicher Live-Prüfung und ausdrücklicher Freigabe die getrennte Cloud-Speicherung als regulären Speicher aktivieren.
- [ ] Legacy-Speicher während der gesamten Einführungs- und Beobachtungsphase erhalten; keine automatische Löschung oder Abschaltung im 1.4.1-Release.
- [ ] Abschließende Speicher-Regression auf Desktop und iPhone durchführen und Ergebnisse dokumentieren.

**Wichtig:** Die derzeitige App schreibt reguläre Änderungen weiterhin in den bisherigen monolithischen Cloud-Spielstand. Die getrennten Datengruppen sind vorbereitet, aber noch nicht an den normalen Speichervorgang angeschlossen. Die Aktivierung ist daher ausdrücklich Release-blockierend. Die Roadmap-Eintragung selbst ändert keine Cloud-Daten.


**Ziel:** Die bereits weitgehend umgesetzten Funktionen bündeln, die wichtigsten offenen Praxistests abschließen und einen überschaubaren ersten 1.4-Release veröffentlichungsfähig machen.

- [x] Zehn Designs (Original, Forest & Nature, Ocean Blue, Sunset, Midnight, Sakura, Graphite, Lavender, Desert und Aurora), responsive Oberflächenverbesserungen und französische App-Sprache in Preview umgesetzt
- [x] Gästebuch mit Einreichung und Moderationsablauf in Preview umgesetzt
- [x] Mehrsprachigen festen Willkommenstext für das Gästebuch (Deutsch, Englisch und Französisch) ergänzt und in Preview `main` gemergt (PR #108); vorhandene Gästebucheinträge bleiben unverändert
- [x] Vaporizer-Füllungsart im Tagebuchformular „Eintrag erstellen“ und „Eintrag bearbeiten“ als zweigeteilten Umschalter „Med. Cannabis“ / „Kräuter“ umgesetzt und in Preview `main` gemergt (PR #109); bestehende Material-/Sortenlogik bleibt erhalten
- [ ] Umschalter auf iPhone und Desktop praktisch testen: Auswahl beim Erstellen speichern, beim Bearbeiten korrekt wiederherstellen und zwischen beiden Füllungsarten wechseln
- [x] Kräutervorschläge im Tagebuchformular alphabetisch nach deutschem Pflanzennamen sortieren und dynamische Präfix-Vorschläge direkt unter dem Eingabefeld anzeigen (z. B. „M“ → alle M-Kräuter, „Mi“ → nur Mi-Kräuter, „Min“ → nur Min-Kräuter); Auswahl per Antippen; in Preview `main` gemergt (PR #110)
- [x] Tabellenanzeige „Pflanzen & Kräuter“ nach deutschem Pflanzennamen sortieren (PR #111)
- [x] Quelldaten `plant-catalog.js` selbst alphabetisch nach der ersten Spalte sortieren, damit die Reihenfolge unabhängig von der Anzeige stimmt; in Preview `main` gemergt (PR #112)
- [ ] Kräutervorschläge auf iPhone und Desktop praktisch testen: alphabetische Reihenfolge, Filterung bei mehreren eingegebenen Buchstaben und Übernahme per Antippen
- [x] Lernkurse und mehrsprachige Kursinhalte in Preview ergänzt
- [x] Originalfassung „My Vaping Education – Grundlagen“ mit sieben ausführlichen Lektionen, technischen SVG-Illustrationen, Tabellen und zehn Quizfragen in Preview integriert; bestehende Kurs-ID und gespeicherte Fortschritte bleiben erhalten
- [x] Kontaktbereich und mehrsprachiges Kontaktformular als `mailto:`-Basisversion umgesetzt
- [x] Dunkelgrünes zentrales E-Mail-Design und drei deutsche Supabase-Auth-Vorlagen erstellt
- [x] Alle drei Vorlagen im Supabase-Dashboard eingefügt, Vorschau kontrolliert und gespeichert (Nutzerbestätigung)
- [x] Bereich „Kontrolliert Vapen“ mit Zielsetzung, Erklärung, 12-Schritte-Übersicht und Navigation zu zwölf zunächst bewusst leeren Einzelseiten in Preview umgesetzt; Nutzer hat die Navigation erfolgreich bestätigt
- [ ] Eigenständiges Education-Symbol im Stil des offiziellen App-Logos gestalten: Universität-/Campus-Motiv mit Universitätsmütze, einer vapenden Person und dem Schriftzug „My Vaping Education“; als Symbol für den Education-Bereich in Version 1.4.1 vorbereiten
- [ ] Absendername, Absenderadresse und SMTP-Zustellung für die gestalteten Auth-Mails abschließend konfigurieren bzw. prüfen
- [ ] Registrierung, Passwort-Reset und E-Mail-Änderung mit Testkonten vollständig durchtesten
- [ ] **Social Login:** Anmeldung zusätzlich mit Google-Konto und Facebook-Konto über Supabase Auth ermöglichen; Provider-Zugangsdaten, OAuth-Redirect-URLs und Rückkehr in die App konfigurieren; bestehende E-Mail-/Passwort-Anmeldung beibehalten
- [ ] Google- und Facebook-Anmeldung mit Testkonten auf Desktop und iPhone prüfen; sicherstellen, dass bestehende Benutzerkonten und die benutzergebundene Cloud-Datentrennung erhalten bleiben
- [x] Registrierungs-/Confirm-Mail in der Vorschau geprüft: Gestaltung korrekt, offizielles Logo wird angezeigt (Nutzerbestätigung)
- [ ] E-Mail-Darstellung/Zustellung in Gmail, Apple Mail und Outlook prüfen
- [ ] Kontaktformular auf Windows-PC und iPhone praktisch testen
- [ ] Kurse, Quiz, Fortschrittsspeicherung und Sprachwechsel in DE/EN/FR auf PC und iPhone testen
- [ ] Gästebuch einschließlich Moderations- und Löschablauf abschließend testen
- [ ] Vollständige Sprachprüfung und Regressionstests für die in 1.4.1 enthaltenen Änderungen durchführen
- [ ] Vollständigen automatisierten Secret-Scan des gesamten Git-Verlaufs und Prüfung externer Deployment-Einstellungen durchführen
- [x] Bestehende GIF-Startanimation in Preview eingebunden und an den Login-Ablauf gekoppelt (vollständiger Praxistest noch offen)
- [ ] „The First Puff“ als flüssige, hochwertige Video-/WebM-Animation weiterentwickeln; ursprüngliche Bildfolge, Logo, Landschaft und Dramaturgie unverändert beibehalten – kein neues Design und keine GIF-Ausgabe:
  - [ ] Offizielles Logo wird auf schwarzem Hintergrund eingeblendet
  - [ ] Kamera zoomt in die Landschaft innerhalb des Logos
  - [ ] In der Landschaft sieht man eine Person, die am Vaporizer zieht und sichtbar ausatmet
  - [ ] Der Dampf zieht aus der Logo-Landschaft heraus in den schwarzen Bildschirmbereich
  - [ ] Der Dampf verwirbelt sich und formt den Schriftzug „Your Sessions, Your Devices, Your Adventure“
  - [ ] Der Schriftzug löst sich wieder in Dampf auf; daraus entsteht „My Vaping Adventure“
  - [ ] Übergang von der Animation zur App-Startseite
  - [ ] Bewegungsablauf anhand der eingesendeten Originalanimation abstimmen und die vorhandene Szene flüssiger ausarbeiten; keine abweichenden Stilvarianten erfinden
  - [ ] Für Windows-PC und iPhone optimieren; Animation überspringbar machen
  - [ ] Betriebssystemeinstellung „Bewegung reduzieren“ berücksichtigen und eine reduzierte Alternative anbieten
  - [ ] Logo-Datei mit transparentem Hintergrund/Alpha-Kanal vorbereiten
- [ ] Technische Vorbereitungen für Benutzerprofile in Preview:
  - [ ] Bestehende Supabase-Auth- und Benutzer-ID-Struktur auf Erweiterbarkeit prüfen
  - [ ] Datenmodell für private Kontodaten und später freiwillig öffentliche Profilangaben entwerfen
  - [ ] Profil-Datensatz eindeutig über die Auth-Benutzer-ID zuordnen
  - [ ] RLS-Konzept festlegen, sodass private Profildaten ausschließlich vom jeweiligen Nutzer gelesen und geändert werden können
  - [ ] Trennung zwischen privatem Profil und später öffentlich sichtbarem Profilbereich dokumentieren
  - [ ] Keine öffentlichen Profilfelder oder zusätzlichen personenbezogenen Angaben ohne spätere bewusste Entscheidung aktivieren
  - [ ] Bestehende Konten, Tagebücher und Cloud-Spielstände durch die Vorbereitungen unverändert lassen
- [x] Geräte-Bedienungsanleitungen: pro Gerät eine PDF (max. 3 MB) hinzufügen, austauschen oder entfernen können; anklickbarer PDF-Link direkt unter der jeweiligen Gerätekarte
- [x] PDF-Bedienungsanleitung im integrierten Ansichtsfenster öffnen; PDF.js-Seitenrendering, Scrollbereich sowie „Zurück“-/„Weiter“-Schaltflächen mit Seitenzähler und Pfeiltasten-Navigation umgesetzt und vom Nutzer erfolgreich getestet
- [ ] PDF-Anleitungen in lokalem Spielstand, verschlüsselter Cloud-Synchronisierung sowie JSON-Backup berücksichtigen und Größen-/Speichergrenzen testen
- [ ] Abschließende 1.4.1-Regression: Login, Tagebuch, Geräte, Galerie, Cloud-Synchronisierung, Backups und Sprachwechsel prüfen
- [ ] Produktionsübernahme von 1.4.1 erst nach abgeschlossener QA und ausdrücklicher Freigabe

### Release-Stabilisierung – zuletzt in Preview auf `main` integriert

- [x] Zehn Theme-Optionen einschließlich dynamischer Auswahl und einheitlicher Farb-/Komponentenstile integriert (PR #94); iPhone-/Desktop-Praxistest bleibt offen
- [x] Fehler- und Warnmeldungen bleiben bis zum manuellen Schließen sichtbar; Erfolgsmeldungen schließen weiterhin automatisch (PR #95)
- [x] Diagnose beim Wechsel von Cloud- zu lokalem Speicher um konkrete Fehlerstufe, Browserfehler und – soweit verfügbar – Sicherungsgröße ergänzt (PR #96)
- [ ] Nach Deployment prüfen, dass Preview die aktuellen Änderungen aus `main` lädt und keine veralteten Assets aus dem Cache verwendet
- [ ] Neue Fehlerdiagnose mit dem vorhandenen großen Cloud-Spielstand praktisch prüfen; keine Daten löschen und keinen Speicherwechsel erzwingen
- [ ] Die letzten Änderungen automatisiert und manuell auf iPhone und Desktop regressionsprüfen

### Version 1.4.2 – weitere Funktionen und Ausbau

**Ziel:** Die größeren noch offenen Funktionspakete nach dem 1.4.1-Release fertigstellen.

- [ ] Bereich „Kontrolliertes Vapen“ funktional entwickeln (Wochenziele, Fortschritt, Auswertung, datensparsame Speicherung und Übersetzungen)
  - [x] **Phase 1 – Grundlagen und Programmstruktur:** Zielsetzungskasten und Erklärung „Was ist Kontrolliertes Vapen?“ mit Erläuterungen zu Tages-/Wochenhöchstmenge, vapefreien Tagen und persönlichen Regeln umgesetzt
  - [x] 12-Schritte-Programm mit Grundlagenkarte, zwölf nummerierten Schritten sowie den Bereichen „Nach Ende“ und „Nach Bedarf“ in der Übersicht umgesetzt
  - [x] Für alle zwölf Schritte eigene, verlinkte Seiten angelegt; zunächst jeweils nur Überschrift und Navigation zur Übersicht sowie zum vorherigen/nächsten Schritt
  - [x] Deutsche, englische und französische Texte für Grundlagen, Übersicht und Schritt-Navigation ergänzt
  - [x] Nutzerprüfung der neuen Schrittseiten und Navigation erfolgreich bestätigt
  - [x] Schritt 2 „Pro / Kontra Veränderung“ um eine bearbeitbare Vierfeldertafel ergänzt: Vorteil/Nachteil × Weiterkonsumieren/Konsum ändern; vier Textfelder werden im Spielstand gespeichert und können später geändert und erneut gespeichert werden (DE/EN/FR)
  - [x] Schritt 8 „Freizeit genießen“ um vier frei bearbeitbare eigene Freizeitaktivitäten ergänzt; Eingaben werden gespeichert und beim erneuten Öffnen wieder angezeigt (PR #117)
  - [x] Deutsch, Englisch und Französisch sowie responsive Darstellung ergänzt
- [ ] **Phase 2 – individuelle Wochenziele und Selbstbewertung (Konzept des Nutzers)**
    - [ ] In „Einstellungen → Kontrolliert vapen“ die Konsumkategorien per Checkbox einzeln aktivieren/einblenden oder ausblenden: Vaporizer, E-Zigarette, Tabakheater, Zigarette, Joint und Bong
    - [ ] Für jede aktivierte Kategorie eigene Wochenziele konfigurierbar machen:
      - [ ] Maximale Anzahl Sessions pro Tag (Eingabefeld)
      - [ ] Maximaler Gesamtkonsum pro Woche (Eingabefeld; Einheit passend zu den erfassten Tagebuchdaten festlegen)
      - [ ] Ziel für die Anzahl konsumfreier Tage pro Woche (Eingabefeld)
    - [ ] In der Wochenübersicht je Kategorie eine Tages-Tabelle mit Ist-Werten und Tagesziel anzeigen
    - [ ] Unter der Tages-Tabelle eine Ampel ausgeben: Grün, wenn das tägliche Session-Limit eingehalten wurde; Rot, wenn es überschritten wurde
    - [ ] Wochenziele je Kategorie auswerten:
      - [ ] Anzahl der Tage, an denen das Tageslimit eingehalten wurde, als X/7 anzeigen
      - [ ] Wochen-Gesamtkonsum mit dem festgelegten Maximalziel vergleichen und Zielerreichung mit Ja-/Nein-Symbol (Smiley) darstellen
      - [ ] Tatsächliche Anzahl konsumfreier Tage, das festgelegte Tagesziel und dessen Erreichung (Ja/Nein) anzeigen
    - [ ] Pro Kategorie eine wöchentliche Selbsteinschätzung anbieten: sieben auswählbare Stufen von sehr zufrieden (Smiley 1) bis sehr unzufrieden (Smiley 7)
    - [ ] Ziele und Selbsteinschätzung je Kategorie und Kalenderwoche speichern; beim Wechsel der Woche frühere Werte unverändert wieder anzeigen
    - [ ] Auswertung ausschließlich aus den zugehörigen Tagebucheinträgen berechnen; fehlende oder unvollständige Mengenangaben transparent kennzeichnen und nicht als Nullverbrauch ausgeben
    - [ ] Ausgeblendete Kategorien aus der aktuellen Eingabe/Übersicht ausblenden, aber historische Tagebucheinträge und bisherige Wochenwerte nicht löschen
    - [ ] Einstellungen, Eingabefelder, Ampeln, Wochenziele und Smiley-Skala in Deutsch, Englisch und Französisch übersetzen
    - [ ] Bedienung, Speicherung, Wochenwechsel und Berechnung auf Desktop und iPhone testen
  - [x] Wochen-Navigation in „Woche auswählen“: Pfeil links für Vorwoche und Pfeil rechts für Folgewoche; automatische Aktualisierung der Wochenauswertung in Preview umgesetzt
  - [ ] Pfeilnavigation auf iPhone und Desktop praktisch testen; Wochenwechsel und berechnete Tagebuchwerte gegenprüfen
- [ ] Vape-Akademie mit sieben Lernleveln, Kursquoten, Leveltests und Freischaltlogik umsetzen
- [ ] Bestehende Kursfortschritte bei Einführung der Akademie erhalten und sicher migrieren
- [ ] Akademie-Fortschritt und Freischaltlogik mit mehreren Testkonten und geräteübergreifender Synchronisierung prüfen
- [x] Zentrales Einstellungsmenü in Preview als eigene Seite sowie über Desktop-Navigation und „Mehr“ erreichbar umgesetzt
  - [x] Vaping-Konfiguration mit sechs Kategorien: Vaporizer, E-Zigarette, Tabakheater, Zigarette, Joint und Bong
  - [x] Deaktivierte Kategorien aus neuen Tagebucheinträgen und der Kontrolliert-Vapen-Auswertung ausblenden; bestehende und historische Einträge bleiben erhalten
  - [x] Sprache Deutsch/Englisch/Französisch direkt in den Einstellungen auswählbar
  - [x] Design-Auswahl über den vorhandenen Theme-Picker zentral erreichbar
  - [x] Startanimation per Einstellung ein- und ausschaltbar; Betriebssystem-Einstellung „Bewegung reduzieren“ wird zusätzlich berücksichtigt
  - [x] Anmeldung/Konto und Profil-/Datenübersicht mit Status, E-Mail-Adresse, Datensatzanzahlen und direktem Weg zu „Speicher & Backup“
  - [x] Vaping-Kategorie-Einstellungen werden als kleine Konfiguration im Spielstand gespeichert und mit dem verschlüsselten Cloud-Spielstand synchronisiert
  - [ ] Desktop-/iPhone-Praxistest für alle Einstellungen, Neuladen, Sprachwechsel und Cloud-Synchronisierung
  - [ ] Profil: Nickname/Anzeigename bearbeiten und E-Mail-Änderung mit sicherem Bestätigungsablauf direkt im Einstellungsbereich ermöglichen; bestehende Kontoverwaltung ist derzeit über „Speicher & Backup“ erreichbar
  - [ ] Prüfen, ob Sprache, Design und Animationspräferenz optional geräteübergreifend synchronisiert werden sollen; derzeit sind diese Anzeigepräferenzen lokal auf dem jeweiligen Gerät gespeichert
- [ ] Tagebuch-Kategorien um „Zigarette“ erweitern – zusätzlich zu Vaporizer, E-Zigarette und Tabakerhitzer
  - [ ] Kategorie „Zigarette“ ausschließlich Nutzern anzeigen, die das Zigarettenrauchen in den Einstellungen ausdrücklich aktiviert haben
  - [ ] Wenn „Zigaretten rauchen“ in den Einstellungen nicht aktiviert ist, darf „☠️ Zigarette“ weder in der Kategorienauswahl noch an anderen Stellen der Tagebuch-Erfassung auftauchen
  - [ ] In den Einstellungen einen eigenen Bereich „Konsumarten“ vorsehen: Nutzer können angeben, ob sie vapen und/oder Zigaretten rauchen
  - [ ] Bei aktiviertem Vaping auswählen können, welche Arten genutzt werden (Vaporizer, E-Zigarette und/oder Tabakerhitzer)
  - [ ] Das Rauchen von Zigaretten unabhängig von den Vaping-Arten separat aktivieren/deaktivieren können
  - [ ] Bei Aktivierung des Zigarettenrauchens die Kategorie „☠️ Zigarette“ in der Tagebuchauswahl einblenden; bei Deaktivierung ausblenden
  - [ ] Hilfebibliothek erweitern: erklären, wo die Konsumarten eingestellt werden, wie „Zigaretten rauchen“ aktiviert/deaktiviert wird und wann die Kategorie „☠️ Zigarette“ in der Tagebuchauswahl erscheint
  - [ ] Hilfetext klarstellen: Das Ausblenden der Kategorie löscht keine bereits gespeicherten Zigaretten-Tagebucheinträge; historische Einträge bleiben sichtbar und bearbeitbar
  - [ ] Beim Deaktivieren einer Konsumart vorhandene Tagebucheinträge nicht löschen; historische Einträge weiterhin anzeigen und bearbeiten können
  - [ ] Neue Einstellungen, bedingte Kategorienanzeige und Hilfetexte in DE/EN/FR übersetzen und auf Desktop sowie iPhone testen
- [ ] Englische und französische E-Mail-Vorlagen ergänzen und sprachabhängige Zustellung technisch klären
- [ ] Impressum und erforderliche rechtliche Anbieterinformationen vor Veröffentlichung vollständig klären und einbauen
- [ ] Verbliebene ältere Textfragment-Übersetzungen auf das zentrale Übersetzungssystem umstellen
- [ ] Vollständige Sprachprüfung DE/EN/FR nach Abschluss der neuen Funktionen wiederholen
- [ ] Installierbare PWA für Windows-PC und iPhone umsetzen und auf beiden Plattformen testen

### Intelligente Cloud-Synchronisierung – 1.4.2 (in Entwicklung)
- [x] Fehlerdiagnose für den Nur-Lese-Datengruppenabgleich: Lese- und Entschlüsselungsfehler werden je Datengruppe benannt; Fehler beim Entschlüsseln des bisherigen Spielstands werden separat ausgewiesen. Keine Schreib- oder Migrationsaktion.
- [x] Cache-Busting für `app.js` und `cloud-data.js` ergänzt, damit die Preview die aktualisierte Fehlerdiagnose sicher lädt.


**Ziel:** Nur tatsächlich neue oder geänderte Daten übertragen. Unveränderte Datengruppen und identische große Dateien sollen nicht erneut hochgeladen werden. Bestehende Daten bleiben während Entwicklung und Migration unangetastet.

- [x] Konzept festgelegt: vor dem Speichern lokalen und entschlüsselten Cloud-Stand vergleichen; nur Unterschiede übertragen
- [x] PR #100 angelegt: vollständigen verschlüsselten Spielstand vor Upload vergleichen und identische Stände ohne erneuten Upload überspringen
- [x] PR #100 ergänzt: Medienmodul kann eine bestehende Medienreferenz bytegenau vergleichen und bei Gleichheit wiederverwenden
- [x] Getrenntes Datengruppen-Modul um `sync(type, value)` erweitert: zuerst entschlüsselt lesen und vergleichen, bei identischem Inhalt keine neue Revision schreiben
- [x] Isolierten Browser-Test um Fälle „unverändert“ (kein Schreibaufruf) und „geändert“ (neue Revision) ergänzt
- [x] Cache-Versionen für `app.js`, `cloud-data.js` und `cloud-media.js` in `index.html` aktualisiert, damit Preview nicht versehentlich alte Module lädt
- [x] Browser-Testseite `tests/cloud-data-test.html` in GitHub Actions mit Chromium erfolgreich ausgeführt (inkl. Altbestand-Roundtrip mit Einstellungen)
- [x] Medienvergleich mit simulierten identischen und geänderten Dateien getestet; Upload-Zähler und Byte-Prüfung im Browser-Test erfolgreich
- [x] PostgreSQL-RPC-, CAS-, RLS- und Timeout-nach-Commit-Tests im isolierten CI-Testprojekt erfolgreich ausgeführt
- [x] Lesende Medienbestandsprüfung in „Speicher & Backup“ integriert: bei Cloud-Anmeldung wird der zuletzt gespeicherte Cloud-Stand direkt abgerufen und mit dem angezeigten Stand verglichen; Inline-Dateien, Größen, SHA-256-Duplikate, vorhandene Cloud-Referenzen und ungültige Medien werden angezeigt; keine Uploads/Änderungen/Löschungen
- [ ] Bestehenden vollständigen Cloud-Spielstand eines echten Kontos zunächst nur lesend analysieren; keine automatische Migration und kein Löschen
- [ ] Medien- und Datengruppen-Synchronisierung in Galerie, Geräte, PDF-Anleitungen und Tagebuch schrittweise integrieren
- [ ] Rückwärtskompatibilität für bestehende Data-URLs und bisherige `mva_saves`-Spielstände sicherstellen
- [ ] JSON-Backup/Import einschließlich aller Medien bytegenau testen
- [ ] Zwei-Konten-Isolation sowie Synchronisierung zwischen iPhone und Desktop prüfen
- [ ] Erst nach erfolgreicher QA und ausdrücklicher Freigabe den neuen Speicherweg aktivieren

**Sicherheitsregel:** Ein fehlgeschlagener Cloud-Lesevorgang darf niemals als „keine Daten vorhanden“ behandelt werden. Bei unklarem Cloud-Stand wird abgebrochen statt überschrieben. Die neue Datengruppen-API ist weiterhin nicht mit dem App-Speicherablauf verbunden; die bestehende Speicherung bleibt aktiv.

### Datenmenge und Cloud-Speicherung – 1.4.2
- [x] Datenmodell geprüft: Eine gemeinsame Material-Sammlung mit Kategorie statt sechs getrennten Sammlungen verwenden
- [x] Tagebucheinträge um eine kompakte Material-ID-Referenz ergänzen; der Materialname bleibt als kleine historische Momentaufnahme erhalten
- [x] Vorhandene Einträge ohne Material-ID beim Start nur dann verknüpfen, wenn ein passender Eintrag in der bestehenden Sammlung existiert; keine Materialdatensätze automatisch vervielfachen
- [x] Ursache für große Cloud-Nutzlast eingegrenzt: Der aktuelle Speicherweg verschlüsselt und überträgt weiterhin den vollständigen Spielstand; eingebettete Fotos, Gerätebilder und PDF-Anleitungen vergrößern diesen Datensatz
- [ ] Tatsächliche Größen von Tagebuchdaten, Fotos, Gerätebildern und PDF-Anleitungen mit einem realen Testkonto messen
- [ ] Supabase-Timeout anhand der konkreten Logs untersuchen; Payload-Größe nicht ohne Messung als alleinige Ursache annehmen
- [ ] Private Storage-Bucket-/RLS-Einrichtung zunächst in einem separaten Testprojekt prüfen
- [ ] Vorhandene Module für clientseitig verschlüsselte Einzelmedien mit Galerie, Gerätebildern und PDF-Viewer verbinden; erst nach Upload-/Download-, Kontentrennungs- und Backup-Tests aktivieren
- [ ] Alte Data-URL-Medien rückwärtskompatibel weiter unterstützen und eine sichere, freiwillige Einzelmigration vorsehen
- [ ] Prüfen, ob strukturierte Datengruppen über die vorbereitete mva_data-Architektur schrittweise statt als vollständiger Gesamtdatensatz gespeichert werden können; Backend-Migration und Versionskonflikte zuerst in Preview testen
- [ ] JSON-Backup muss weiterhin alle Medien portabel enthalten oder vollständig und überprüfbar referenzieren
- [ ] PC-/iPhone-Synchronisierung, zwei getrennte Benutzerkonten und Wiederherstellung nach Medienmigration vollständig testen

### Kommunikations- und Sichtbarkeitsstrategie – 1.4.2 (Konzept, noch keine Konten angelegt)
- [ ] Positionierung von My Vaping Adventure als privates, datenschutzorientiertes Tagebuch-/Dokumentationsprojekt klar definieren; keine Aufforderung zum Konsum und keine Verkaufsvermittlung
- [ ] Vor öffentlicher Bewerbung rechtlich prüfen lassen, ob und in welcher Form die App-Kommunikation wegen des Themenfelds E-Zigaretten/Tabak unter das Werbeverbot des TabakerzG (§§ 19–21) und wegen der Cannabis-Funktionen unter das Werbeverbot des KCanG (§ 6) fallen könnte
- [ ] Plattformregeln von Instagram/Facebook prüfen: Werbeanzeigen für Tabak-/Nikotinprodukte und Vaping-Geräte sind untersagt; Inhalte, die deren Nutzung fördern, können von Empfehlungen ausgeschlossen werden
- [ ] Organische Social-Media-Strategie nur nach Rechts- und Plattformprüfung festlegen; keine bezahlten Anzeigen, Produktwerbung, Rabatt-/Affiliate-Angebote, Konsumdarstellungen oder bezahlten Markenkooperationen ohne ausdrückliche rechtliche Freigabe
- [ ] Neutrale Themenfelder prüfen: App-Funktionen und Bedienoberfläche, Datenschutz/Verschlüsselung, Tagebuch- und Backup-Funktionen, technische Entwicklung, Updates und sachliche Gerätepflege
- [ ] Zielgruppe, Altersansprache, Moderationsregeln, Impressum/Datenschutz, Kommentarregeln und Umgang mit gesundheitsbezogenen Aussagen festlegen
- [ ] Instagram- und Facebook-Profil als mögliche Kanäle vergleichen; Reichweiten- und Empfehlungsbeschränkungen für Vaping-Inhalte berücksichtigen
- [ ] Redaktionsplan und wiederverwendbare Bild-/Textvorlagen für einen rechtlich geprüften, sachlichen App-Entwicklungsbericht entwerfen
- [ ] Erst nach abgeschlossener Prüfung entscheiden, ob ein offizieller Account angelegt wird

- [ ] Abschließende Gesamt-QA für 1.4.2 und ausdrückliche Produktionsfreigabe einholen

**Release-Regel:** Ein erledigter Entwicklungspunkt ist nicht automatisch produktionsreif. Jede Version erhält eine eigene QA-Runde, einen geprüften Preview-Stand und eine separate ausdrückliche Freigabe. Die Produktion bleibt bis dahin unverändert.

## Alpha 1.3 – umgesetzt und geprüft

### Konten und Anmeldung
- [x] Registrierung mit echter E-Mail-Adresse
- [x] E-Mail-Bestätigung und SMTP-Versand eingerichtet
- [x] Anmeldung und Abmeldung
- [x] Passwort-Zurücksetzen per E-Mail
- [x] Unterstützung des bisherigen Benutzernamens `PlatinVapor`
- [x] Zwei-Konten-Test: Konten sehen ausschließlich ihre eigenen Daten

### Verschlüsselte Cloud und Datenspeicherung
- [x] Supabase Auth und `mva_saves` eingerichtet
- [x] Tabellenstruktur von `mva_saves` geprüft: `user_id` (`uuid`), `payload` (`jsonb`) und `updated_at` (`timestamptz`)
- [x] Fremdschlüssel von `mva_saves.user_id` auf `auth.users.id` geprüft; `ON DELETE CASCADE` ist aktiv (beim Löschen eines Auth-Benutzerkontos wird auch dessen Cloud-Spielstand gelöscht)
  - [x] Vier vorhandene Datensätze geprüft; keiner verweist auf ein nicht existentes Auth-Benutzerkonto
- [x] Row Level Security (RLS) aktiviert und Policies in Supabase geprüft
  - [x] SELECT: `auth.uid() = user_id` – Nutzer können nur ihren eigenen Spielstand lesen
  - [x] INSERT: `auth.uid() = user_id` – Nutzer können nur einen Spielstand mit ihrer eigenen Benutzer-ID anlegen
  - [x] UPDATE: `auth.uid() = user_id` in `USING` und `WITH CHECK` – Nutzer können nur ihren eigenen Spielstand ändern und die Benutzerzuordnung nicht auf eine fremde ID ändern
  - [x] Alle drei Policies gelten für die Rolle `authenticated`
  - [x] Nutzer hat die Aktivierung von RLS (Anzeige „Disable RLS“) und die SQL-Bedingungen aller drei Policies in der Supabase-Oberfläche bestätigt
- [x] Verschlüsselte Cloud-Speicherung (AES-GCM)
- [x] Lokalen und Cloud-Spielstand auswählen
- [x] Cloud-Spielstand laden und nach erneutem Login wiederherstellen
- [x] Lokalen Spielstand verwenden
- [x] Cloud-Speicherung von Tagebucheinträgen und Geräten
- [x] Galerie-Fotos werden im Cloud-Spielstand gespeichert
- [x] Fehler bei großen Base64-Daten behoben; Foto-Upload und erneutes Laden geprüft
- [x] Nutzer bestätigt: Auf dem iPhone erstellter Tagebuch-Testeintrag blieb nach Abmeldung, erneutem Login und erneutem Laden des Cloud-Spielstands erhalten
- [x] Nutzer bestätigt: iPhone-Testeintrag und zugehöriges Foto waren nach Anmeldung am PC und Laden des Cloud-Spielstands ebenfalls vorhanden
- [x] Nutzer bestätigt: Am PC erstellter Tagebuch-Testeintrag war nach erneutem Laden des Cloud-Spielstands auf dem iPhone vorhanden

### Datenimport und Backups
- [x] CSV-Import
- [x] CSV-Export
- [x] JSON-Backup und Wiederherstellung
- [x] Import älterer CSV-Daten getestet

### Galerie und Geräte
- [x] Galerie-Kacheln zeigen Bilder vollständig und ohne Beschnitt
- [x] Großbildansicht (Lightbox)
- [x] Vor- und Zurück-Navigation in der Lightbox
- [x] Gerätebilder passen sich dem Bildrahmen an
- [x] Gerätebilder behalten ihr Seitenverhältnis und werden nicht beschnitten
- [x] Gerätebild-Darstellung an die Galerie angepasst (4:3-Fläche, `object-fit: contain`)
- [x] Gerätebild-Anpassung vom Nutzer in Preview bestätigt

### Oberfläche und Bedienung
- [x] Aktive-Speicher-Anzeige für lokalen und Cloud-Spielstand
- [x] Profilmenü für angemeldete Nutzer
- [x] Gastansicht mit Anmelde- und Registrierungsoptionen
- [x] Wiederherstellungscode-Dialog mit Kopierfunktion implementiert und in Preview erfolgreich getestet
- [x] Deutsch-/Englisch-Umschalter
- [x] Hilfebibliothek öffnet sich und funktioniert im Praxistest
- [x] Übersetzungen in allen linken Navigationsbereichen vom Nutzer auf Deutsch und Englisch geprüft
- [x] Speicher-/Datensicherungsseite auf fehlende englische Übersetzung geprüft und Satz ergänzt
- [x] Nutzer bestätigt: Bei der abschließenden Durchsicht der Bereiche wurden keine weiteren Übersetzungsfehler gefunden

## Noch offen – Alpha 1.3

### Qualitätssicherung
- [x] Doppelte Deklarationen von Hilfsfunktionen in app.js entfernt.
- [x] Fehlende cloud-setup.md ergänzt und im README verlinkt; Supabase-/RLS-Einrichtung dokumentiert.
- [x] Hilfebibliothek im Gast- und angemeldeten Modus geprüft
  - [x] Gastmodus: Hilfebibliothek öffnen und englische Suche testen
  - [x] Angemeldeter Modus: Hilfebibliothek öffnen und englische Suche testen
  - [x] Nutzer bestätigt, dass die Suche in beiden Modi funktioniert
- [x] Kopierfunktion des Wiederherstellungscode-Dialogs mit einem separaten Testkonto geprüft; Kopieren des Feldinhalts funktioniert
- [x] Sprachumschaltung und sichtbare Übersetzungen in allen linken Bereichen geprüft
- [x] Synchronisierungstest zwischen iPhone und PC in beide Richtungen erfolgreich
  - [x] iPhone → PC: Testeintrag und Foto nach Anmeldung am PC und Laden des Cloud-Spielstands vorhanden
  - [x] PC → iPhone: PC-Testeintrag nach erneutem Laden des Cloud-Spielstands auf dem iPhone vorhanden
  - [x] iPhone: Testeintrag nach Abmeldung, erneutem Login und erneutem Laden des Cloud-Spielstands wiedergefunden
- [x] Abschließende QA-Runde: Anmeldung mit Testkonto 2 erfolgreich
- [x] Abschließende QA-Runde: Tagebucheintrag angelegt, gespeichert und erneut geöffnet; Nutzer bestätigt korrekte Anzeige
- [x] Abschließende QA-Runde: Tagebucheintrag bearbeitet und Änderung gespeichert; Nutzer bestätigt korrekte Anzeige
- [x] Abschließende QA-Runde: Tagebucheintrag gelöscht; Nutzer bestätigt, dass er korrekt aus der Liste verschwindet
- [x] Abschließende QA-Runde: Foto hinzugefügt; Nutzer bestätigt, dass es in der Galerie erscheint (nicht direkt im Tagebucheintrag)
- [x] Abschließende QA-Runde: Nach vollständigem Neuladen erneute Anmeldung erforderlich; Foto war anschließend weiterhin in der Galerie vorhanden (Nutzerbestätigung)
- [x] Abschließende QA-Runde: CSV-Export und CSV-Import vom Nutzer erfolgreich bestätigt
- [x] Abschließende QA-Runde: Vollständiges JSON-Backup heruntergeladen und wieder eingelesen; Nutzer bestätigt erfolgreichen Ablauf
- [x] Abschließende QA-Runde: Nach Abmeldung und erneutem Login Tagebucheinträge, Geräte und Galeriefotos weiterhin vorhanden (Nutzerbestätigung)
- [x] Abschließende QA-Runde: Passwortwechsel-Formular und Cloud-Anmeldebeschriftung in englischer Sprache korrigiert; Nutzer bestätigt die Anzeige nach erneutem Laden
- [x] Abschließende QA-Runde: Neues Gerät mit Foto angelegt und gespeichert; Nutzer bestätigt erfolgreichen Ablauf
- [x] Abschließende QA-Runde: Gerät gelöscht; Nutzer bestätigt erfolgreichen Ablauf
- [x] Abschließende QA-Runde: Galerie-Foto in der Großbildansicht geöffnet, Vor-/Zurück-Navigation und Schließen erfolgreich geprüft (Nutzerbestätigung)
- [x] Abschließende QA-Runde: Galerie und Geräteverwaltung nach Sprachwechsel auf Englisch geprüft; sichtbare Beschriftungen wechseln korrekt (Nutzerbestätigung)
- [x] Abschließende QA-Runde: Hilfebibliothek geöffnet und Suche nach „backup“ erfolgreich getestet (Nutzerbestätigung)
- [x] Abschließende QA-Runde: Nach Abmeldung und erneutem Login Geräte, Tagebucheinträge und Galerie-Fotos weiterhin vorhanden (Nutzerbestätigung)
- [x] Gesamten zentralen Ablauf (Registrierung, Bestätigung und erfolgreiche Anmeldung) mit Testkonto 2 erfolgreich durchlaufen
  - [x] Mit Testkonto abmelden und erneut anmelden
  - [x] Nach erneutem Login: Tagebucheinträge, Geräte und Galerie-Fotos weiterhin vorhanden
  - [x] Registrierung und E-Mail-Bestätigung in einem vollständigen Durchlauf mit Testkonto 2 geprüft
  - [x] Testkonto 2 erfolgreich registriert; Wiederherstellungscode wurde ausgegeben (Nutzerbestätigung)
  - [x] Bestätigungs-E-Mail erhalten und Bestätigungslink erfolgreich angeklickt; Registrierung abgeschlossen (Nutzerbestätigung)
- [x] Fehler aus der abschließenden Testrunde behoben; die gemeldeten englischen Beschriftungen wurden ergänzt und vom Nutzer erneut geprüft
- [x] CSV-Import-Duplikaterkennung nach Korrektur erneut praktisch getestet; Nutzer bestätigt: funktioniert
  - [x] Ursache gefunden: CSV-Export-Überschrift „Gerät“ wurde nach Normalisierung als `gerat` eingelesen, der Import suchte aber nur `geraet`; dadurch blieb das Gerätefeld leer und Duplikate wurden nicht erkannt
  - [x] Import-Mapping für `gerat` ergänzt und Duplikaterkennung auf alle exportierten Tagebuchfelder erweitert
  - [x] Cache-Version der Preview aktualisiert
  - [x] Durch den fehlerhaften Testimport entstandene Duplikate betreffen ausschließlich das Testkonto; keine Bereinigung erforderlich

### Sicherheit und Wiederherstellung
- [x] Direkten Passwortwechsel im angemeldeten Cloud-Konto in Preview getestet; Nutzer bestätigt, dass er funktioniert
- [x] Passwort-Zurücksetzen über „Passwort vergessen“ in Preview erneut getestet; Nutzer bestätigt, dass es funktioniert
- [x] Zusammenspiel von Passwortänderung, Passwort-Zurücksetzen und Wiederherstellungscode abschließend geprüft
  - [x] Wiederherstellungscode extern aufbewahrt und Wiederherstellungsablauf mit Testkonto 2 praktisch getestet
  - [x] Nach Passwort-Reset neues Passwort gesetzt und Zugriff auf den zuvor gespeicherten verschlüsselten Cloud-Spielstand erfolgreich wiederhergestellt (Nutzerbestätigung)
- [x] Umgang mit älteren Cloud-Spielständen ohne Wiederherstellungsumschlag als bekannte Einschränkung dokumentiert; für Alpha 1.3 nicht erforderlich, vor einer späteren Migration erneut bewerten
- [x] Weitere Sicherheits- und Konfigurationspunkte geprüft
  - [x] RLS-Policies und Tabellenstruktur von `mva_saves` geprüft
  - [x] Fremdschlüssel `mva_saves.user_id` → `auth.users.id` einschließlich `ON DELETE CASCADE` geprüft; vier vorhandene Datensätze ohne verwaiste Benutzerzuordnung
  - [x] Browser-Konfiguration `cloud-config.js` geprüft: verwendet einen `sb_publishable_`-Schlüssel und die richtige Supabase-Projektadresse
  - [x] App-Dateien `app.js`, `index.html`, `help.js`, `i18n.js`, `cloud-config.js` und `README.md` auf typische Muster geheimer Supabase-/Datenbank-Schlüssel geprüft; keine entsprechenden Treffer in ausführbarem App-Code oder Konfiguration gefunden
  - [ ] Vor Produktionsfreigabe vollständigen automatisierten Secret-Scan des gesamten Git-Verlaufs und Prüfung externer Deployment-Einstellungen durchführen (bisher nur gezielte Quelltextprüfung)

### Veröffentlichung
- [x] Hilfetexte und Einrichtungsanleitung finalisiert
  - [x] README auf Alpha 1.3 aktualisiert: Einstieg, Speicherarten, Cloud-Sicherheit, Backups und Preview-/Produktionsablauf
  - [x] Hilfebibliothek und bestehende Hilfethemen geprüft
- [x] Versionsnummer und Änderungsübersicht geprüft
  - [x] README und Roadmap führen Alpha 1.3
  - [x] CHANGELOG.md für Alpha 1.3 Release Candidate ergänzt
  - [x] App-Skript verwendet den aktualisierten Cache-Parameter für den CSV-Fix; Release bleibt ausdrücklich RC bis zur finalen Freigabe
- [ ] Alpha-1.3-Qualitätssicherung abschließen – letzte Release-Prüfungen und Sicherheitsprüfung stehen noch aus
- [x] Nach Merge der QA-Vorbereitung in Preview-main: Anmeldung erfolgreich geprüft
- [x] Nach Merge: vorhandene Tagebucheinträge sichtbar
- [x] Nach Merge: Geräte und gespeicherte Fotos vorhanden
- [x] Nach Merge: Galerie zeigt gespeicherte Bilder; Bilder lassen sich öffnen
- [x] Nach Merge: Sprachwechsel Deutsch/Englisch und sichtbare Beschriftungen geprüft
- [x] Nach Merge: „Speicher & Backup“ zeigt Cloud-Konto und Sicherungsfunktionen
- [x] Nach Merge: JSON-Backup-Download erfolgreich gestartet und Datei heruntergeladen (Nutzerbestätigung)
- [x] Nach Merge: CSV-Export und CSV-Import vom Nutzer erfolgreich bestätigt
- [x] Nach Merge: nach Abmeldung und erneutem Login Tagebucheinträge, Geräte und Galeriefotos weiterhin vorhanden (Nutzerbestätigung)
- [ ] Nach Merge: weitere noch offene Regressionstests und vollständige Sicherheitsprüfung
- [ ] Produktionsübernahme vorbereiten – erst nach Abschluss der Release-Prüfungen
- [ ] Produktionsübernahme erst nach QA und ausdrücklicher Freigabe

## Version 1.4 – Detailstatus der aufgeteilten Releases

- [x] Verbindliche visuelle Master-Vorlage für alle ausgehenden E-Mails festgelegt: Dunkelgrün passend zur App
- [x] Kopfbereich verbindlich auf das offizielle Logo allein festgelegt (kein zusätzlicher Schriftzug)
- [x] Wiederverwendbares HTML-Masterlayout mit responsivem Tabellenaufbau, Aktionsbutton, Fallback-Link und Footer erstellt
- [x] Designregeln, Platzhalter, technische E-Mail-Grundsätze und Supabase-Übernahme dokumentiert
- [x] Deutsche Supabase-HTML-Vorlage für Registrierungsbestätigung erstellt (`email-templates/supabase/signup-confirmation.html`)
- [x] Deutsche Supabase-HTML-Vorlage für Passwort-Zurücksetzen erstellt (`email-templates/supabase/password-reset.html`)
- [x] Deutsche Supabase-HTML-Vorlage für Änderung der E-Mail-Adresse erstellt (`email-templates/supabase/email-change.html`)
- [x] Passende Nur-Text-Fassungen für alle drei Auth-Anlässe ergänzt
- [x] Supabase-Platzhalter `{{ .ConfirmationURL }}` in den HTML- und Textvorlagen für Aktionslinks vorgesehen
- [x] Betreffvorschläge und konkrete Übernahmeschritte in `email-templates/README.md` dokumentiert
- [x] Vorlage „Confirm sign up“ im Supabase-Dashboard mit Betreff und dunkelgrüner HTML-Gestaltung eingefügt und vom Nutzer als gespeichert bestätigt
- [x] Vorlage „Reset Password“ mit Betreff und dunkelgrüner HTML-Gestaltung in den Supabase-Editor eingefügt, Vorschau kontrolliert und im Supabase-Dashboard gespeichert (Nutzerbestätigung)
- [x] Vorlage „Change Email Address“ mit Betreff und dunkelgrüner HTML-Gestaltung in den Supabase-Editor eingefügt, Vorschau kontrolliert und im Supabase-Dashboard gespeichert (Nutzerbestätigung)
- [ ] Absendername, tatsächliche Absenderadresse, SMTP-Zustellung und Betreffzeilen final festlegen
- [ ] Englische und französische Fassungen erstellen; sprachabhängige Zustellung technisch klären
- [ ] Registrierung, Passwort-Reset und E-Mail-Änderung mit separaten Testkonten praktisch testen
- [ ] Darstellung und Zustellung in Gmail, Apple Mail und Outlook prüfen

## Version 1.4 – Umsetzung in Preview

- [x] Kontaktbereich mit responsivem Kontaktformular in „Mehr“ integrieren
- [x] Kontaktformular in Deutsch, Englisch und Französisch ergänzen
- [x] Kontaktadresse `myvapingadventure@gmail.com` einbinden; Nachricht wird im Mailprogramm vorbereitet, geprüft und manuell versendet
- [ ] Kontaktformular auf iPhone und Desktop praktisch testen

Die Entwicklung von Version 1.4 erfolgt ausschließlich im Preview-Projekt. Die Produktionsversion 1.3 bleibt bis zum Abschluss der Qualitätssicherung und einer ausdrücklichen Freigabe unverändert.

### 1. Optik und Design-Themen – umgesetzt

- [x] Menü zur Auswahl der Darstellung integriert
- [x] Fünf Designs umgesetzt: Original, Forest & Nature, Ocean Blue, Sunset und Midnight
- [x] Design-Auswahl wird lokal im jeweiligen Browser/Gerät gespeichert
- [x] Typografie, Lesbarkeit und Kontraste überarbeitet
- [x] Responsive Darstellung für Desktop und Mobilgeräte verbessert
- [x] Desktop-Sidebar bündig am linken Bildschirmrand ausgerichtet; vom Nutzer in Preview bestätigt
- [x] Kopfzeile vergrößert und Logo deutlich hervorgehoben
- [x] Doppelte Markenbezeichnung neben dem Logo entfernt; die Kopfzeile zeigt nur noch den passenden Tagebuch-Untertitel
- [x] Untertitel in Deutsch, Englisch und Französisch angepasst

### 2. Gästebuch – umgesetzt

- [x] Öffentlich lesbares Gästebuch
- [x] Neue Einträge können nur von angemeldeten Nutzern eingereicht werden
- [x] Neue Einträge werden zunächst zurückgehalten und müssen moderiert/freigegeben werden
- [x] Moderation und Löschen über das Supabase-Dashboard möglich
- [x] Öffentliche Ansicht und Einreichungsablauf vom Nutzer praktisch geprüft
- [x] Begrüßungs-/Einführungstext oberhalb der Gästebucheinträge ergänzt; Übersetzungen für Deutsch, Englisch und Französisch hinterlegt (PR #108)
- [ ] Neuen Willkommenstext nach Aktualisierung der Preview auf iPhone und Desktop auf Darstellung und Sprachwechsel prüfen

### 3. Französische Sprache – umgesetzt

- [x] Französisch als dritte App-Sprache ergänzt
- [x] Navigation, Menüs und zentrale Oberflächen übersetzt
- [x] Tagebuch, Geräteverwaltung und Galerie übersetzt
- [x] Lernbereiche, Kurse und Gästebuch übersetzt
- [x] Cloud-Speicher, Backups und Kontoverwaltung übersetzt
- [x] Übersetzungsfehler und gemischte Sprachreste in mehreren Korrekturrunden behoben

### 4. Zentrale Übersetzungsarchitektur – umgesetzt; Restmigration in Version 1.4.2

- [x] Einheitliches Key-basiertes Übersetzungssystem eingeführt
- [x] 259 gemeinsame Übersetzungsschlüssel für Deutsch, Englisch und Französisch angelegt
- [x] Dynamische Inhalte und nachträglich eingefügte Oberflächenelemente berücksichtigt
- [x] Platzhalter/Interpolation für dynamische Texte unterstützt
- [x] Prüfung auf fehlende Übersetzungsschlüssel ergänzt
- [ ] Verbliebene ältere Textfragment-Übersetzungen schrittweise durch Übersetzungsschlüssel ersetzen
- [ ] Nach weiteren UI-Änderungen vollständige Sprachprüfung in DE/EN/FR wiederholen

### 5. Desktop- und iPhone-Feinschliff – umgesetzt

- [x] Desktop-Sidebar und Hauptbereich korrekt im Layout verankert
- [x] Kopfzeile und Logo für große und kleine Bildschirme angepasst
- [x] iPhone-Kopfzeile kompakter gestaltet, damit Sprachwahl, Design, Hilfe und Profil Platz finden
- [x] Safe-Area-Abstände für iPhone berücksichtigt (untere Navigation, Dialoge, Galerie-Lightbox und Hinweise)
- [x] Abstand zum unteren Navigationsbereich verbessert, damit Inhalte nicht verdeckt werden
- [x] Horizontales Überlaufen reduziert und Umbruchverhalten verbessert
- [x] Bedienflächen und Dialoge für kleinere Displays optimiert
- [x] Redundanten Text neben dem Logo entfernt; nur der lokalisierte Tagebuch-Untertitel bleibt sichtbar
- [ ] Abschließende Sichtprüfung durch den Nutzer auf verschiedenen iPhone-Größen und am Desktop

### 11. Kontaktformular – Basisversion umgesetzt, Praxistest offen

- [x] Kontaktbereich als eigene Funktion in „Mehr“ integrieren
- [x] Formularfelder für Name, Antwort-E-Mail, Thema, Betreff und Nachricht ergänzen
- [x] Kontaktadresse `myvapingadventure@gmail.com` einbinden
- [x] Kontaktformular in Deutsch, Englisch und Französisch anbieten
- [x] Responsive Darstellung für Desktop und iPhone ergänzen
- [x] Versandweg der Basisversion: Das Formular öffnet per `mailto:` das E-Mail-Programm mit vorbereiteter Nachricht; der Nutzer prüft und versendet die E-Mail selbst
- [ ] Formular auf iPhone und Desktop praktisch testen (Öffnen des E-Mail-Programms und korrekt vorausgefüllte Empfänger-/Nachrichtenfelder)
- [ ] Falls später ein direkter Versand ohne Öffnen eines E-Mail-Programms gewünscht ist: externen/serverseitigen E-Mail-Dienst mit sicherer Konfiguration, serverseitiger Validierung und Spam-Schutz prüfen
- [ ] Datenschutzinformationen und gegebenenfalls Aufbewahrungs-/Löschregeln für eine spätere serverseitige Verarbeitung festlegen

**Hinweis zur aktuellen Umsetzung:** Die Basisversion versendet keine Nachricht automatisch und speichert keine Formulardaten in My Vaping Adventure. Es werden keine E-Mail-Zugangsdaten im Frontend hinterlegt. Der praktische Funktionstest steht noch aus.

### 12. Version 1.4.2: Bereich „Kontrolliertes Vapen“ mit Wochenzielen – Konzept folgt

- [ ] Eigenständigen Bereich „Kontrolliertes Vapen“ konzipieren und in Version 1.4 einplanen
- [ ] Wochenziele und einen nachvollziehbaren Wochenfortschritt als zentrales Element vorsehen
- [ ] Ziele, Ablauf, Auswertung, Erinnerungen und mögliche Anpassungen erst anhand der vom Nutzer angekündigten Informationen konkret festlegen
- [ ] Nutzerbestimmte Ziele und Fortschritte datensparsam und geschützt speichern
- [ ] Keine medizinischen Versprechen oder pauschalen Empfehlungen zur Nikotinmenge bzw. Dosierung geben
- [ ] Gesundheits- und Sicherheitsinformationen ausgewogen darstellen und bei Bedarf auf professionelle Unterstützung verweisen
- [ ] Sprachversionen und Bedienbarkeit auf Desktop und iPhone berücksichtigen

### 7. Version 1.4.2: Vape-Akademie mit sieben Lernleveln – geplant

- [ ] Den bisherigen Lernbereich zu einer fortlaufenden Vape-Akademie mit sieben aufeinander aufbauenden Levels erweitern
- [ ] Lernstufen: Level 1 „Newbie“, Level 2 „Anfänger“, Level 3 „Fortgeschrittener Anfänger“, Level 4 „Fortgeschritten“, Level 5 „Experte“, Level 6 „Profi“ und Level 7 „Master“
- [ ] Level 1 ist von Anfang an frei zugänglich; höhere Levels bleiben bis zum erfolgreichen Aufstieg gesperrt
- [ ] Pro Level mehrere thematisch zusammenhängende Kurse anbieten; Kurse höherer Levels vertiefen und ergänzen das Wissen aus vorherigen Levels
- [ ] Für den Aufstieg mindestens 75 % der Kurse des aktuellen Levels abschließen (auf ganze Kurse aufrunden)
- [ ] Erst nach Erreichen der Kursquote den Level-Abschlusstest freischalten
- [ ] Level-Test mit mindestens 80 % richtigen Antworten bestehen, um das nächste Level freizuschalten
- [ ] Nicht bestandene Tests dürfen wiederholt werden; bereits abgeschlossene Kurse und bestandene Level bleiben dauerhaft freigeschaltet
- [ ] Fortschritt pro Kurs, Kursquote, Testergebnis und erreichtes Level im Benutzerkonto speichern und geräteübergreifend synchronisieren
- [ ] Gesperrte Level und Kurse mit Vorschau anzeigen, damit der Lernpfad und die nächsten Lernziele sichtbar bleiben
- [ ] Level-Abzeichen, Lernfortschritt und bestehendes XP-/Coin-System sinnvoll miteinander verbinden; XP allein darf keine Level freischalten
- [ ] Alle Level, Kurse, Tests und Fortschrittsanzeigen in Deutsch, Englisch und Französisch anbieten
- [ ] Lerninhalte sachlich und sicher gestalten: keine Werbung an Minderjährige oder Nichtraucher, keine individuellen Nikotin-/Dosierungsempfehlungen und klare Hinweise auf Gesundheitsrisiken
- [ ] Kurszuordnung als erster Entwurf:
  - [ ] Level 1 – Newbie: Grundlagen der E-Zigarette, Geräte-Grundlagen und der bestehende Kurs „Vom Rauchen zum Vapen“ (nur für erwachsene Raucher)
  - [ ] Level 2 – Anfänger: Pod-Systeme, MTL/RDL/DL, Gerätetypen und grundlegende Liquidkunde
  - [ ] Level 3 – Fortgeschrittener Anfänger: Coils, Watte, Verdampferpflege und typische Einsteigerfehler
  - [ ] Level 4 – Fortgeschritten: Akkusicherheit, technische Grundlagen und sichere Gerätebedienung
  - [ ] Level 5 – Experte: Liquid-Wissen, Inhaltsstoffe, Nikotin und vertiefte Fehlerdiagnose
  - [ ] Level 6 – Profi: fortgeschrittene Verdampfertechnik, Selbstwickler und systematische Fehlerbehebung
  - [ ] Level 7 – Master: vertiefende Spezialthemen und umfassender Abschlusstest
- [x] Grundlagenkurse vorhanden: Gerätekunde, Akkusicherheit und Reinigung/Pflege (bereits vorhanden) sowie Coil/Watte/Verdampferpflege, Liquid-Wissen, Fehlerbehebung für Einsteiger und Nikotin verstehen (neu ergänzt)
- [ ] Zusätzlich folgende eigenständige Kurse entwickeln und in die passenden Lernlevel integrieren:
  - [x] **Aufbau einer E-Zigarette:** Komponenten, Strom- und Liquidweg, Verdampferkopf, Tank/Pod, Akku und Bedienung – als mehrsprachiger Kurs mit Lektionen und Wissenstest in Preview umgesetzt
  - [x] Kurs „Aufbau einer E-Zigarette“ für 1.4.1 auf sieben aufeinander aufbauende Lektionen und einen Wissenstest mit zehn Fragen erweitert; Inhalte und Quiz vollständig in DE/EN/FR gepflegt, bestehende Kurs-ID `ecig-structure` und gespeicherte Fortschrittsdaten bleiben erhalten
  - [ ] Erweiterten Grundlagenkurs auf Desktop und iPhone prüfen; zehn Fragen, 80-%-Bestehensgrenze, Wiederholungsversuche, Ergebnis-/Fortschrittsspeicherung und Sprachwechsel DE/EN/FR testen
  - [x] **Liquid selber mischen – der Rechenkurs:** Volumen, Mischungsverhältnisse und Prozentrechnung mit neutralen Übungswerten; keine Anleitung zum Umgang mit hochkonzentriertem Nikotin oder riskanten Konzentraten – als mehrsprachiger Kurs mit Wissenstest umgesetzt
  - [x] **Aufbau und Funktion eines Tabakerhitzers:** Heizelement, Tabaksticks, Luftführung, Temperatursteuerung und Unterschiede zur Verbrennungszigarette und E-Zigarette – als mehrsprachiger Kurs mit Wissenstest umgesetzt
  - [x] **Aufbau und Funktion eines Vaporizers:** Heizkammer, Temperaturregelung, Luftweg, Mundstück und Unterschiede zwischen Konduktion und Konvektion – als mehrsprachiger Kurs mit Wissenstest umgesetzt
  - [x] **Cannabis – Wirkungen und Nebenwirkungen:** sachliche Aufklärung zu möglichen akuten und längerfristigen Wirkungen, Nebenwirkungen, Risiken, Wechselwirkungen, Beeinträchtigung der Fahrtüchtigkeit und Warnzeichen; keine Konsumempfehlung oder individuelle medizinische Beratung – als mehrsprachiger Aufklärungskurs mit Wissenstest umgesetzt
- [ ] Bestehende Kursfortschritte und ältere Spielstände bei Einführung des Levelsystems erhalten und sicher migrieren
- [ ] Freischaltlogik, Grenzfälle bei der 75-%-Berechnung, Wiederholungsversuche, Sprachwechsel und Synchronisierung mit mehreren Testkonten prüfen
- [ ] Darstellung und Bedienung der Akademie auf Desktop und iPhone testen

### 7. Kurs „Vom Rauchen zum Vapen“ – in Preview umgesetzt, QA offen

- [x] Eigenständigen Einsteigerkurs für erwachsene Menschen, die bereits rauchen, in der Education-/Lernsektion ergänzt
- [x] Sechs Lektionen zu den Grundlagen (Verbrennung und Aerosol), Zielgruppe und Risiken, Gerätearten, Liquids/Nikotin, sicherer Bedienung und Unterstützung beim Rauchstopp erstellt
- [x] Sachliche Hinweise integriert: E-Zigaretten sind nicht risikofrei, Nikotin macht abhängig; Nichtraucher und Minderjährige sollen nicht anfangen
- [x] MTL-/DL-Geräte und Pod-Systeme sowie Herstellerhinweise und kompatibles Zubehör behandelt
- [x] Dual Use (paralleles Rauchen und Vapen) und professionelle Rauchstopp-Unterstützung angesprochen
- [x] Wissenstest mit fünf Fragen und Bestehensgrenze von 80 Prozent integriert
- [x] Kursfortschritt, Ergebnis und bestehendes XP-/Coin-Belohnungssystem eingebunden
- [x] Vollständige Kursübersetzung für Deutsch, Englisch und Französisch ergänzt
- [x] Kursansicht für Desktop und Mobilgeräte gestaltet
- [ ] Sicht- und Funktionstest durch den Nutzer in Preview (Desktop und iPhone)
- [ ] Quiz-Erfolg, Nichtbestehen, erneutes Absolvieren und Fortschrittsspeicherung prüfen
- [ ] Sprachwechsel während des Kurses in Deutsch, Englisch und Französisch prüfen
- [ ] Inhalte auf Aktualität, rechtliche Vorgaben und sachliche Ausgewogenheit gegenlesen
- [ ] Optionale Illustrationen und zusätzliche Praxisbeispiele ergänzen

### 6. Individuelle Registrierungs- und Bestätigungsmails – noch offen

- [ ] Absendername individuell festlegen
- [ ] Betreff der Bestätigungs-E-Mail anpassen
- [ ] Nachrichtentext individuell gestalten
- [ ] Logo/Branding und Gestaltung der E-Mail bzw. des Bestätigungsbuttons anpassen
- [ ] Vor Umsetzung die konkreten Möglichkeiten und Grenzen des Supabase-/SMTP-Mailanbieters prüfen

### 10. Version 1.4.2: Impressum und rechtliche Anbieterkennzeichnung – geplant

- [ ] Prüfen, welche Impressumspflichten für My Vaping Adventure als öffentliche Web-App mit Benutzerkonten und Community-Funktionen gelten (insbesondere DDG und Medienstaatsvertrag)
- [ ] Tatsächlichen Betreiber der Website und dessen Rechtsform eindeutig festlegen
- [ ] Erforderliche Betreiberangaben zusammentragen: vollständiger Name, ladungsfähige Anschrift und erreichbare Kontaktmöglichkeit einschließlich E-Mail-Adresse
- [ ] Prüfen, ob zusätzliche Angaben erforderlich sind (z. B. Register-/Umsatzsteuerangaben, Aufsichtsbehörde oder journalistisch-redaktionell verantwortliche Person)
- [ ] Privatsphäre des Betreibers berücksichtigen und vor Veröffentlichung klären, ob eine geeignete alternative ladungsfähige Geschäfts-/Zustellanschrift rechtlich verwendet werden kann; keine erfundene Anschrift und keine ungeprüfte Adresse einer Wohneinrichtung verwenden
- [ ] Impressum als eigene, dauerhaft erreichbare Seite erstellen und im Footer gut sichtbar mit „Impressum“ verlinken
- [ ] Impressum klar von der Datenschutzerklärung trennen; beide Seiten gegenseitig sinnvoll erreichbar machen
- [ ] Angaben und rechtliche Einordnung vor Veröffentlichung anhand der tatsächlichen Betreiber- und Angebotsdaten prüfen lassen; keine Platzhalter oder ungeprüften Angaben live schalten
- [ ] Darstellung und Erreichbarkeit des Impressums auf Desktop und iPhone prüfen
- [ ] Sprachversionen für Deutsch, Englisch und Französisch vorsehen; rechtlich maßgebliche Angaben vollständig und konsistent halten

### 9. Version 1.4.1: technische Vorbereitung auf Benutzerprofile und Community – geplant

- [ ] Anforderungen für ein erweitertes Benutzerprofil und das geplante Forum in Version 1.5/1.6 dokumentieren
- [ ] Bestehende Supabase-Authentifizierung, Benutzer-IDs und Cloud-Datenspeicherung auf Erweiterbarkeit prüfen
- [ ] Datenmodell für getrennte private Kontodaten und später öffentlich angezeigte Profilinformationen konzeptionell vorbereiten
- [ ] Rollen- und Berechtigungsmodell für Gäste, angemeldete Cloudbenutzer und Moderation entwerfen
- [ ] Sicherheitskonzept für private und öffentliche Inhalte einschließlich Supabase-RLS vorbereiten
- [ ] Sicherstellen, dass die Erweiterung bestehende Konten, Tagebücher und Cloud-Spielstände nicht beeinträchtigt

### 8. Abschlussprüfung der Releases 1.4.1 und 1.4.2 – noch offen

- [ ] Vollständige Sprachprüfung Deutsch, Englisch und Französisch
- [ ] Neuen Kurs „Vom Rauchen zum Vapen“ in DE/EN/FR, mit Quiz, Fortschrittsspeicherung und auf Desktop/iPhone prüfen
- [ ] Erweiterten Grundlagenkurs „Aufbau einer E-Zigarette“ (sieben Lektionen, zehn Quizfragen) auf Desktop/iPhone, in DE/EN/FR sowie mit Fortschrittsspeicherung und Wiederholungsversuchen prüfen
- [ ] Registrierung, E-Mail-Bestätigung, Anmeldung und Passwort-Zurücksetzen erneut prüfen
- [ ] Tagebuch, Geräte, Fotos und Galerie prüfen
- [ ] Gästebuch einschließlich Moderationsablauf prüfen
- [ ] Cloud-Speicherung und Synchronisierung zwischen Geräten prüfen
- [ ] CSV-Import/-Export sowie JSON-Backup und Wiederherstellung prüfen
- [ ] Responsive Darstellung auf Desktop und iPhone abschließend prüfen
- [ ] Regressionstests und Sicherheitsprüfung abschließen
- [ ] Produktionsübernahme erst nach abgeschlossener QA und ausdrücklicher Freigabe

## Version 1.5 – Benutzersystem

### Vorbereitung Veröffentlichung und Kommunikation – Grundlagen
- [ ] Ziel und Positionierung von My Vaping Adventure als Tagebuch-, Geräteverwaltungs- und sachliche Lern-/Informationsplattform klar beschreiben; keine Bewerbung des Konsums oder einzelner Nikotin-/Tabakprodukte
- [ ] Zielgruppen und Altersabgrenzung für die Kommunikation festlegen; keine Ansprache Minderjähriger, Nichtraucher oder besonders schutzbedürftiger Gruppen
- [ ] Kommunikationsleitlinien für Website, Social Media, Presse-/Projektvorstellung und mögliche Anzeigen erstellen; gesundheitsbezogene Aussagen nur sachlich, belegbar und ohne Heil- oder Erfolgsversprechen
- [ ] Rechtliche Prüfung der geplanten Öffentlichkeitsarbeit und Werbeformen in Deutschland/EU vorbereiten, insbesondere Tabak-/E-Zigarettenwerbung, Jugendschutz, Datenschutz und Plattformrichtlinien
- [ ] Zulässige Kanäle und Formate für eine reine Software-/Projektvorstellung identifizieren; bezahlte Werbung erst nach dokumentierter rechtlicher Prüfung einsetzen
- [ ] Einheitliche Presse-/Projektbeschreibung, Kurzbeschreibung, Logo-Verwendung und Kontaktmöglichkeit vorbereiten
- [ ] Datenschutzfreundliches Konzept für Reichweitenmessung und Erfolgskontrolle festlegen; keine nicht erforderlichen Tracking- oder Werbe-Cookies ohne wirksame Einwilligung
- [ ] Veröffentlichungsanforderungen und offene Freigaben in einer zentralen Launch-Checkliste sammeln



### Google-Anmeldung – geplant

- [ ] Anmeldung und Registrierung mit Google-Konto als zusätzliche Option integrieren
- [ ] Bestehende E-Mail-/Passwort-Anmeldung weiterhin anbieten
- [ ] Sichere Kontoverknüpfung und Verhalten bei bereits vorhandenen Konten testen
- [ ] OAuth-Weiterleitungsadressen für Preview und später Produktion konfigurieren
- [ ] Anmeldung, Abmeldung, Passwort-/Kontowiederherstellung und Cloud-Datenerhalt mit Google-Testkonten prüfen

### Erweiterte Benutzerprofile – geplant

- [ ] Bestehende Supabase-Authentifizierung um ein eigenes Benutzerprofil je Cloudkonto erweitern
- [ ] Nickname als öffentliche Kennung festlegen; Eindeutigkeit und Änderbarkeit definieren
- [ ] Profilfelder vorsehen: Vorname, Nachname, Geburtsdatum, E-Mail-Adresse und Avatar/Profilbild
- [ ] Optionale Homepage/Website-Adresse im Profil unterstützen
- [ ] Optionale WhatsApp-Nummer als private Kontoinformation unterstützen
- [ ] Für Homepage und WhatsApp-Nummer getrennte, freiwillige Sichtbarkeitseinstellungen vorsehen; standardmäßig privat
- [ ] E-Mail-Adresse und Geburtsdatum als private Kontodaten behandeln; keine öffentliche Anzeige
- [ ] Profilbild sicher speichern und Größen-/Dateitypgrenzen festlegen
- [ ] Profilbearbeitung und Anzeige der eigenen Kontodaten vorsehen
- [ ] Rollen und Berechtigungen als Grundlage für das spätere Forum vorbereiten
- [ ] Google-Anmeldung über Supabase Auth (OAuth) vorbereiten und die Google-Cloud-OAuth-Konfiguration einrichten
- [ ] E-Mail-/Passwort-Anmeldung als alternative Anmeldemethode beibehalten
- [ ] Sicheres Verhalten bei bestehenden Konten, identischen E-Mail-Adressen und Kontoverknüpfung festlegen
- [ ] Datenschutz, Einwilligung, Löschung und Aufbewahrung personenbezogener Daten prüfen
- [ ] Bestehende Konten und bisherige Cloud-Daten bei der Erweiterung unverändert erhalten
- [ ] Profil- und Berechtigungsstruktur in Preview mit mehreren Testkonten prüfen

## Version 1.6 – My Vaping Adventure Forum

### Veröffentlichungsvorbereitung und Kommunikationskampagne
- [ ] Veröffentlichungsumfang und Starttermin erst nach abgeschlossener Produkt-, Sicherheits- und Rechtsprüfung festlegen
- [ ] Öffentliche Website-/Landingpage mit verständlicher Beschreibung der App, Funktionen, Systemvoraussetzungen, Kontakt, Impressum und Datenschutzerklärung vorbereiten
- [ ] Öffentliche Inhalte von privaten Tagebüchern, Benutzerprofilen und geschützten Forenbeiträgen technisch und für Suchmaschinen eindeutig trennen
- [ ] Kommunikationspaket vorbereiten: Projektvorstellung, Screenshots, Logo-/Bildmaterial, FAQ, kurze Ankündigungstexte und Presse-/Community-Information
- [ ] Redaktions- und Veröffentlichungsplan für Website und geeignete Social-Media-Kanäle erstellen
- [ ] Werbe-/Anzeigenmotive ausschließlich als sachliche Vorstellung der Software und ihrer Funktionen konzipieren; keine Produktwerbung für E-Zigaretten, Tabakerzeugnisse, Liquids oder Nikotin
- [ ] Vor jeder bezahlten oder organischen Werbemaßnahme rechtliche Zulässigkeit und Plattformregeln prüfen lassen; bei Unsicherheit auf die Maßnahme verzichten
- [ ] Altersgerechte Ausrichtung sicherstellen; keine Minderjährigen ansprechen und keine Konsumanreize, Verharmlosung oder gesundheitlichen Erfolgsversprechen verwenden
- [ ] Datenschutz, Bild-/Musik-/Markenrechte, Einwilligungen und Impressums-/Kennzeichnungspflichten für alle Veröffentlichungsmaterialien prüfen
- [ ] Ablauf für Veröffentlichung, Support-Anfragen, Fehlerberichte und Rückmeldungen nach dem Start festlegen
- [ ] Launch-Checkliste mit Verantwortlichkeiten, Freigabepunkten, Rückfallplan und Kommunikationsablauf abschließen
- [ ] Öffentliche Freigabe und Start einer möglichen Kampagne nur nach ausdrücklicher Betreiberentscheidung



### Community-Forum – geplant

- [ ] Eigenständigen Forum-Bereich in My Vaping Adventure integrieren
- [ ] Forum-Beiträge und Antworten für alle Besucher lesbar machen
- [ ] Erstellen von Beiträgen und Antworten ausschließlich angemeldeten Cloudbenutzern erlauben
- [ ] Vor dem Speichern jedes Beitrags eine gut sichtbare Sichtbarkeitsauswahl anbieten:
  - [ ] „Für angemeldete Benutzer sichtbar“ – nur eingeloggte Cloudbenutzer können den Beitrag sehen
  - [ ] „Öffentlich sichtbar“ – der Beitrag ist auch ohne Anmeldung sichtbar
- [ ] Sichtbarkeit nach dem Speichern zuverlässig durch Datenbankregeln (RLS) absichern; private Beiträge dürfen nicht über direkte Datenbankabfragen oder APIs öffentlich abrufbar sein
- [ ] Beiträge im Forum mit Nickname und freiwillig gewähltem Avatar/Profilbild des Verfassers anzeigen
- [ ] E-Mail-Adresse, Geburtsdatum und weitere private Kontodaten niemals in Beiträgen oder öffentlichen Profilansichten offenlegen
- [ ] Forum-Kategorien, Themenübersicht, Beitragsansicht und Antwortfunktion planen und umsetzen
- [ ] Bearbeiten und Löschen eigener Beiträge sowie Moderationsmöglichkeiten festlegen
- [ ] Spam-Schutz, Meldefunktion und angemessene Moderationsregeln prüfen
- [ ] Berechtigungen und Sichtbarkeit mit Gastzugriff sowie mehreren angemeldeten Testkonten umfassend testen
- [ ] Forum auf Desktop und iPhone responsiv gestalten

## Version 1.7 – Suchmaschinenoptimierung (SEO) und Auffindbarkeit

**Ziel:** Die öffentlich zugänglichen Informationen zu My Vaping Adventure technisch und inhaltlich so aufbereiten, dass Suchmaschinen das Projekt korrekt verstehen und interessierte Erwachsene die App über sachliche Suchanfragen finden können. Private Konten und persönliche Daten bleiben vollständig ausgeschlossen.

### Technische Suchmaschinenoptimierung
- [ ] SEO-Bestandsaufnahme der öffentlichen Website und ihrer indexierbaren Seiten durchführen
- [ ] Suchmaschinenfreundliche, stabile URLs und eine klare Seitenhierarchie für öffentliche Informationsseiten festlegen
- [ ] Aussagekräftige, individuelle Seitentitel und Meta-Descriptions in Deutsch, Englisch und Französisch erstellen
- [ ] Canonical-URLs definieren und doppelte bzw. technisch konkurrierende Seiten vermeiden
- [ ] Sprachversionen mit korrekten hreflang-Verweisen und passenden Sprach-/Ländercodes verbinden
- [ ] XML-Sitemap für ausschließlich öffentliche, indexierbare Seiten erstellen und aktuell halten
- [ ] robots.txt korrekt konfigurieren; Login, Kontobereiche, private Tagebücher, persönliche Geräte-/Galeriedaten und nicht öffentliche Forenbereiche von der Indexierung ausschließen
- [ ] Sicherstellen, dass private Inhalte nicht nur per robots.txt verborgen, sondern serverseitig durch Authentifizierung und Berechtigungen geschützt sind
- [ ] Strukturierte Daten (Schema.org) nur dort ergänzen, wo sie zum tatsächlichen öffentlichen Seiteninhalt passen
- [ ] Open-Graph- und Social-Sharing-Metadaten für öffentliche Projektseiten ergänzen
- [ ] Ladezeiten, mobile Darstellung, Core Web Vitals, Bildgrößen, Alt-Texte und barrierearme Struktur optimieren
- [ ] Weiterleitungen, Fehlerseiten, HTTPS, Crawling und Indexierbarkeit technisch prüfen
- [ ] PWA- und JavaScript-Inhalte auf korrekte Auffindbarkeit durch Suchmaschinen testen

### Inhalte und redaktionelle SEO
- [ ] Relevante Suchbegriffe für Tagebuch, Geräteverwaltung, Vaporizer-/E-Zigaretten-Aufklärung und App-Funktionen recherchieren, ohne Konsum oder Nikotinprodukte zu bewerben
- [ ] Keyword- und Themenstruktur für öffentliche Seiten in DE/EN/FR erstellen
- [ ] Öffentliche Start-/Landingpage mit klarer, sachlicher Nutzenbeschreibung und eindeutigen Funktionsinformationen optimieren
- [ ] Hilfeseiten und öffentlich zugängliche Lerninhalte mit verständlichen Überschriften, präzisen Texten und internen Verlinkungen strukturieren
- [ ] Inhalte fachlich gegenprüfen, Quellen bei Gesundheits- und Sicherheitsthemen nennen und keine medizinischen Wirkversprechen oder individuellen Konsumempfehlungen veröffentlichen
- [ ] Nur tatsächlich öffentliche und freigegebene Inhalte für Suchmaschinen bereitstellen; private Forenbeiträge und personenbezogene Informationen niemals indexieren
- [ ] Regelmäßige Aktualisierung und redaktionelle Qualitätskontrolle der öffentlichen Inhalte festlegen

### Messung, Qualitätssicherung und Veröffentlichung
- [ ] Geeignete Suchmaschinen-Dienste (z. B. Google Search Console und Bing Webmaster Tools) für die öffentliche Domain einrichten
- [ ] Domain-Inhaberschaft verifizieren und Sitemap einreichen
- [ ] Datenschutzfreundliche Reichweitenmessung und Cookie-/Einwilligungsanforderungen rechtlich prüfen
- [ ] Indexierungsstatus, Suchanfragen, Klicks, Darstellungsfehler und technische SEO-Probleme regelmäßig kontrollieren
- [ ] Backlinks und Kooperationen nur seriös, transparent und thematisch passend aufbauen; keine gekauften Links oder manipulativen SEO-Maßnahmen
- [ ] SEO-Prüfung für Desktop, iPhone sowie alle drei Sprachversionen durchführen
- [ ] Abschließende rechtliche Prüfung von Inhalten, Metadaten und Werbeaussagen durchführen
- [ ] SEO-Änderungen zunächst in Preview testen; produktive Veröffentlichung erst nach QA und ausdrücklicher Freigabe

## Technischer Stand

- **Preview-Repository:** `AdventureVapor/vaping-adventure-preview`
- **Preview-Branch:** `main`; QA-Vorbereitungsbranch `release-1.3-qa-prep` wurde per PR #1 in `main` übernommen
- **Produktions-Repository:** `AdventureVapor/vaping-adventure`
- **Produktionsbranch:** `main` – bleibt bis zur ausdrücklichen Freigabe unangetastet.
- **Release-Kandidat:** QA-Vorbereitungsänderungen sind in Preview `main` enthalten (Merge-Commit `491971abdf6afbcacfb3e8f72b9959886203e0bc`).
- **Pull Request:** Preview-PR #1 wurde gemergt; Produktions-Repository und Produktionsbranch wurden nicht verändert.

---

*Die Roadmap wird während der Entwicklung fortgeschrieben. Bereits bestätigte Funktionen werden nicht erneut als offen geführt; noch nicht abschließend geprüfte Funktionen bleiben als QA-Punkte markiert.*

### 13. Version 1.4.2: installierbare PWA für Windows-PC und iPhone – geplant

- [ ] My Vaping Adventure als Progressive Web App (PWA) installierbar machen
- [ ] Web-App-Manifest mit App-Name „My Vaping Adventure“, Kurzname, Beschreibung, Start-URL, passendem Theme-/Hintergrundfarbwert und eigenständigem Darstellungsmodus („standalone“) ergänzen
- [ ] Eigenständige App-Symbole aus dem offiziellen My-Vaping-Adventure-Logo in geeigneten Größen und Formaten bereitstellen; zusätzlich iOS-taugliches Apple-Touch-Icon vorsehen
- [ ] Windows-Installation über einen unterstützten Browser ermöglichen; die installierte App soll in einem eigenen Fenster ohne gewöhnliche Browserleisten starten
- [ ] iPhone-Installation über Safari („Zum Home-Bildschirm“) unterstützen; iOS-spezifische Metadaten, Touch-Icon, Statusleisten-Darstellung und sichere Safe-Area-Abstände berücksichtigen
- [ ] Service Worker und sinnvolle Cache-Strategie ergänzen, damit die App-Oberfläche zuverlässig lädt; private Tagebuch-, Profil- und Cloud-Daten niemals ungeschützt oder geräteübergreifend im öffentlichen Cache speichern
- [ ] Offline-Verhalten klar definieren: statische App-Oberfläche gegebenenfalls offline bereitstellen, Cloud-Funktionen und Synchronisation bei fehlender Verbindung verständlich kennzeichnen und Änderungen erst nach erfolgreicher Synchronisation als gesichert anzeigen
- [ ] Updates der installierten App zuverlässig ausrollen und Versionswechsel ohne Datenverlust ermöglichen
- [ ] Installation und Start auf Windows-PC (mindestens aktuelle Browser mit PWA-Unterstützung) sowie iPhone/Safari prüfen; zusätzlich Anmeldung, Abmeldung, Cloud-Synchronisation, Tagebuch, Fotos, Navigation und Darstellung in beiden Umgebungen testen
- [ ] Installationshinweise innerhalb der App bereitstellen, die je nach Gerät und Browser die passenden Schritte erklären
- [ ] PWA-Funktion in Deutsch, Englisch und Französisch anbieten und auf Desktop sowie iPhone responsiv prüfen



### PDF-Bedienungsanleitungen – Seitennavigation (Preview)
- [x] PDF-Seiten einzeln im integrierten Viewer rendern
- [x] Schaltflächen „Zurück“ und „Weiter“ mit Seitenzähler ergänzen
- [x] Tastatur-Navigation mit Pfeiltasten links/rechts ergänzen
- [x] PDF-Ansicht und Seitennavigation mit echten Anleitungen erfolgreich vom Nutzer getestet


### PDF-Bedienungsanleitungen – Zoomsteuerung (Preview)
- [x] Vergrößern und Verkleinern im integrierten PDF-Viewer ergänzen
- [x] Zoomstufen von 50 % bis 300 % mit Rücksetzen auf 100 % anbieten
- [x] Zoomsteuerung responsiv und mehrsprachig (DE/EN/FR) gestalten
- [x] Zoom und Seitennavigation vom Nutzer erfolgreich getestet


### Cloud-Speicherung – Zuverlässigkeit nach CSV-Import (Preview)
- [x] Cloud-Schreibvorgänge serialisieren und gleichzeitige Uploads zusammenführen, damit keine älteren Datenstände neuere Änderungen überschreiben
- [x] Änderungen während eines laufenden Uploads erkennen und den neuesten Spielstand anschließend automatisch nachspeichern
- [x] Fehlgeschlagene Cloud-Uploads mit begrenzten Wiederholungen (1, 3 und 8 Sekunden) erneut versuchen
- [x] Fehlerantworten der Cloud robuster auswerten, auch wenn der Server keine gültige JSON-Antwort liefert
- [x] Letzten Upload-Stand zusätzlich als lokal gespeicherte, clientseitig verschlüsselte Wiederherstellungskopie ablegen
- [x] CSV-Import meldet die Übernahme getrennt von der noch laufenden Cloud-Synchronisierung
- [ ] Praxistest: CSV-Import mit mehreren Einträgen, Cloud-Status und erneutes Laden nach erfolgreicher Synchronisierung prüfen
- [ ] Praxistest: Cloud-Speicherung bei kurzzeitig unterbrochener Verbindung und automatischen Wiederholungen prüfen
- [ ] Prüfen, dass lokale verschlüsselte Wiederherstellungskopie bei knappem Gerätespeicher keine Datenänderung verhindert

## Version 1.4.1 – Kontrolliertes Vapen

### Phase 1: Bestandsaufnahme – in Preview umgesetzt, Praxistest offen
- [x] Eigenen Bereich „Kontrolliertes Vapen“ in der Navigation freigeschaltet
- [x] Phase 1 als reine Bestandsaufnahme angelegt – ohne vorgegebene Reduktionsziele
- [x] Wochenübersicht nach Montag bis Sonntag und vier Zeitfenstern (0–6, 6–12, 12–18, 18–24 Uhr) umgesetzt
- [x] Sessions automatisch aus den vorhandenen Tagebucheinträgen ermittelt (ein Tagebucheintrag = eine Session)
- [x] Kategorien Vaporizer, E-Zigarette und Tabakheater getrennt ausgewiesen
- [x] Tageswerte, Wochensummen, durchschnittliche Sessions pro Kalendertag und konsumfreie Tage automatisch berechnet
- [x] Startdatum der Bestandsaufnahme speicherbar; 30-Tage-Zeitraum mit Fortschrittsanzeige
- [x] Einträge ohne Uhrzeit werden in Tages- und Wochensummen berücksichtigt und separat ausgewiesen
- [ ] Preview-Praxistest: Woche mit Tagebucheinträgen, Kategorien, Zeitfenstern und konsumfreien Tagen gegenrechnen
- [ ] Startdatum speichern, Neuladen und Synchronisierung zwischen Geräten prüfen
- [ ] Darstellung und Bedienung auf iPhone und Desktop prüfen

### Phase 2: Zielsetzung – noch nicht Bestandteil von 1.4.1
- [ ] Nach etwa einem Monat Bestandsaufnahme die Daten auswerten
- [ ] Individuelle und realistische Ziele gemeinsam festlegen
- [ ] Zielverlauf und Fortschritt auf Grundlage der dokumentierten Sessions abbilden

### Login-Startanimation – in Preview umgesetzt, Praxistest offen
- [x] Die Startanimation `Bilder/vaanimat.gif` aus dem Projekt-Repository auch im Preview-Repository bereitstellen
- [x] Nach erfolgreicher Cloud-Anmeldung ein eigenes bildschirmfüllendes Startfenster über der App öffnen
- [x] GIF automatisch abspielen und die Gesamtdauer anhand der Bildframe-Zeiten ermitteln
- [x] Startfenster nach dem vollständigen Animationsdurchlauf automatisch schließen
- [x] Animation auch nach der erstmaligen Kontoanmeldung nach dem Bestätigen des Wiederherstellungscodes anzeigen
- [x] Animation nicht bei gewöhnlichen Seitenwechseln oder beim Neuladen einer bereits angemeldeten Sitzung erneut starten
- [ ] Anmeldung mit vorhandenem Cloud-Konto und Auswahl des Cloud-Spielstands testen
- [ ] Erstmalige Kontoanmeldung einschließlich Wiederherstellungscode testen
- [ ] Vollständigen Animationsdurchlauf und automatisches Schließen auf iPhone und Desktop prüfen
- [ ] Prüfen, dass die App nach dem Schließen bedienbar bleibt und die Anmeldung/Cloud-Synchronisierung unverändert funktionieren


## Technische Stabilisierung – Datensicherheit, Fehlerbereinigung und Wartbarkeit (Preview)

**Ziel:** Bestehende Daten und Konten schützen, reproduzierbare Fehler vor neuen Funktionen beheben und die Anwendung schrittweise robuster sowie leichter wartbar machen. Alle Änderungen erfolgen zunächst ausschließlich in Preview. Bestehende Cloud-Daten, lokale Daten und Produktionsbetrieb bleiben unangetastet, soweit ein ausdrücklich getesteter Migrationsschritt nichts anderes erfordert.

### Phase 1 – Kritische Speicher- und Kontenabläufe

- [x] Codeprüfung von Cloud-Speicherung, Abmeldung, Speicherwechsel, JSON-/CSV-Import und lokaler Wiederherstellung durchführen
- [x] Fehler gefunden: Beim Wechsel vom Cloud- zum lokalen Modus wurde nach erfolgreicher Cloud-Speicherung der alte lokale Spielstand (localDb) wieder eingesetzt; die aktuell geladenen Cloud-Daten konnten dadurch im aktiven Bildschirm verschwinden
- [x] Fehlerbehebung in Preview umgesetzt: aktuellen Cloud-Spielstand vor dem Wechsel in den lokalen Modus in localStorage übernehmen; bei fehlgeschlagener lokaler Sicherung angemeldet bleiben und den Cloud-Modus nicht verlassen (Praxistest noch offen)
- [ ] Cloud-Schreibwarteschlange und Revisionszähler auf parallele Änderungen, laufende Uploads, Wiederholungen und Fehlerzustände prüfen und gegebenenfalls vereinfachen
- [ ] Speichern, Abmelden, Wechsel Cloud → lokal und erneutes Anmelden mit Testkonten reproduzierbar testen
- [ ] Kurzzeitige Netzwerkunterbrechung, Token-Erneuerung, mehrfaches Speichern und erneute Synchronisierung testen
- [ ] Sicherstellen, dass ein fehlgeschlagener Upload niemals als „Cloud gespeichert“ angezeigt wird und die letzte bestätigte Wiederherstellungskopie erhalten bleibt
- [ ] Lokale Wiederherstellungskopie und Speicherplatzfehler verständlich behandeln; keine Daten stillschweigend verwerfen

### Phase 2 – Datenintegrität und Backups

- [ ] JSON-Import vor dem Ersetzen vollständig validieren (Schema, Pflichtfelder, Datentypen und Größen); ungültige Backups dürfen den vorhandenen Spielstand nicht verändern
- [ ] Vor jeder Wiederherstellung eine Sicherung des aktuellen Datenbestands erstellen und den Wiederherstellungsvorgang erst nach erfolgreicher Prüfung übernehmen
- [ ] CSV-Import mit leeren Feldern, Umlauten, Anführungszeichen, Zeilenumbrüchen, verschiedenen Trennzeichen und Duplikaten testen
- [ ] Datenmodell für Einträge, Geräte, Fotos, PDFs und Lernfortschritt dokumentieren; ältere Datenformate rückwärtskompatibel behandeln
- [ ] Automatische Integritätsprüfung für fehlende IDs, ungültige Datumswerte, unbekannte Kategorien und unvollständige Datensätze konzipieren
- [ ] Sicherstellen, dass Import, Export, Cloud-Sync und Wiederherstellung dieselben Datenfelder erhalten

### Phase 3 – Speicher- und Medienoptimierung

- [ ] Speicherverbrauch von Tagebuchdaten, Gerätebildern, Galerie-Fotos und PDF-Anleitungen messen
- [ ] Foto- und PDF-Daten von häufig synchronisierten Tagebuch-Metadaten konzeptionell trennen
- [ ] Bildgrößen, Formate und Komprimierung optimieren, ohne Originale ungefragt zu überschreiben
- [ ] Grenzen für Dateigröße, Gesamtgröße und Upload-Zeit definieren; verständliche Rückmeldungen bei Überschreitung bereitstellen
- [ ] Prüfen, ob große Medien schrittweise bzw. separat synchronisiert werden können, ohne bestehende verschlüsselte Cloud-Daten zu gefährden
- [ ] JSON-Backup so gestalten, dass alle zugehörigen Medien entweder vollständig enthalten oder klar und überprüfbar referenziert sind

### Phase 4 – Fehlerdiagnose, Übersetzungen und Dokumentation

- [ ] Einheitliche Fehlerbehandlung für Netzwerk, Authentifizierung, Speicherplatz, Dateiverarbeitung und Import/Export einführen
- [ ] Technische Diagnoseinformationen ohne Passwörter, Wiederherstellungscodes, Tokens oder Tagebuchinhalte erfassen
- [ ] Nutzerfreundliche Fehlermeldungen in Deutsch, Englisch und Französisch sicherstellen
- [ ] Veraltete oder fest in der Oberfläche hinterlegte Texte finden und schrittweise in das zentrale Übersetzungssystem überführen
- [ ] Hilfebibliothek mit den aktuellen Funktionen, Einstellungen, Cloud-Abläufen und Wiederherstellungswegen abgleichen
- [ ] README, Versionshinweise und Roadmap mit dem tatsächlichen Preview- und Produktionsstand synchronisieren

### Phase 5 – Wartbarkeit und automatisierte Qualitätssicherung

- [ ] Bestehende Programmstruktur und Abhängigkeiten vollständig erfassen, bevor Dateien aufgeteilt werden
- [ ] app.js schrittweise und ohne Funktionsänderung in klar abgegrenzte Module (Speicher, Tagebuch, Geräte, Galerie, Backups, Einstellungen, Education) aufteilen
- [ ] Automatisierte Tests für Datenmodell, Import/Export, Speicherwarteschlange und Authentifizierungsabläufe ergänzen
- [ ] Regressionstest-Suite für PC und iPhone aufbauen; bestehende Funktionen nach jeder Änderung prüfen
- [ ] Sicherheitsprüfung von Authentifizierung, RLS, Verschlüsselung, lokaler Speicherung, Deployment-Konfiguration und Git-Verlauf wiederholen
- [ ] Jede Phase separat in Preview prüfen; Produktionsübernahme ausschließlich nach vollständiger QA und ausdrücklicher Freigabe

**Arbeitsreihenfolge:** Zuerst den bestätigten Fehler beim Cloud-zu-lokal-Wechsel beheben. Danach Cloud-Speicherwarteschlange und Abmeldeablauf testen. Erst anschließend Import/Backups, Medienoptimierung und größere Strukturänderungen angehen.


## Ergänzung: JSON-Backup-Import absichern (Preview)

- [x] Backup-Datei vor dem Ersetzen der vorhandenen Daten strukturell prüfen.
- [x] Beschädigte oder unvollständige Dateien ablehnen, ohne den aktuellen Datenbestand zu ersetzen.
- [x] Fehlende optionale Bereiche älterer Backups (strains, photos, game) mit sicheren Standardwerten ergänzen.
- [x] Legacy-Geräte-Textwerte beim Import in das aktuelle Geräteformat überführen.
- [ ] Praxistest mit gültigem Backup, älterem Backup, absichtlich beschädigter JSON-Datei und großem Foto-Backup.
- [ ] Cloud-Synchronisierung nach Wiederherstellung auf Erfolg prüfen; Fehlermeldungen und lokale Wiederherstellungskopie kontrollieren.

Die Änderung schützt vor allem vor einem unvollständigen oder fehlerhaften Import, der bisher den laufenden Datenbestand überschreiben konnte. Ein erfolgreicher Import ist noch kein Beleg dafür, dass die Cloud-Synchronisierung abgeschlossen ist; das muss separat getestet werden.


## Cloud-Verbindungsstabilität: Zeitlimits für Anfragen (Preview)

- [x] Cloud-Anfragen erhalten ein Zeitlimit von 20 Sekunden, damit eine ausbleibende Serverantwort nicht unbegrenzt auf Speichern oder Abmelden warten lässt.
- [x] Zeitüberschreitungen werden als verständliche Fehlermeldung ausgegeben; die vorhandenen Wiederholungsversuche der Cloud-Speicherung bleiben aktiv.
- [x] Auch der Token-Aktualisierungsaufruf nutzt dasselbe Zeitlimit.
- [ ] Praxistest mit absichtlich langsamer/unterbrochener Verbindung auf PC und iPhone.
- [ ] Prüfen, ob der konkrete bisherige Cloud-Fehler dadurch verschwindet oder ob die angezeigte Serverfehlermeldung weitere Anpassungen erfordert.

Hinweis: Das Zeitlimit verhindert endlos wartende Netzwerkanfragen. Es ersetzt keinen Test gegen das konfigurierte Cloud-Backend und beweist nicht, dass jeder Speicherfehler behoben ist.


## Datumsfehler: Lokales Kalenderdatum verwenden (Preview)

- [x] Datums-Hilfsfunktion auf lokale Kalenderwerte umgestellt, statt das UTC-Datum aus `toISOString()` zu verwenden.
- [x] Verhindert, dass neue Tagebucheinträge rund um Mitternacht in Zeitzonen östlich von UTC versehentlich dem Vortag zugeordnet werden.
- [ ] Praxistest auf PC und iPhone nahe Mitternacht sowie nach Zeitzonenwechsel.


## JSON-Backup-Import: Datensätze einzeln absichern (Preview)

- [x] Geräteobjekte ohne gültigen Namen vor dem Import ablehnen, damit sie die Geräteansicht und Namensvergleiche nicht zum Absturz bringen.
- [x] Sorteneinträge ohne Namen und Fotoeinträge ohne Bildquelle ablehnen.
- [x] Unbekannte Geräte-Kategorien beim Import auf eine gültige Standardkategorie zurücksetzen.
- [ ] Praxistest mit absichtlich fehlerhaften Geräte-, Sorten- und Fotodatensätzen sowie mit älteren gültigen Backups.


## Speicher- und Medienübersicht (Preview)

- [x] In „Speicher & Backup“ die geschätzte Gesamtgröße des aktiven Spielstands anzeigen.
- [x] Größe der eingebetteten Fotos und PDF-Bedienungsanleitungen sowie Anzahl der Mediendateien separat ausweisen.
- [x] Hinweise in Deutsch, Englisch und Französisch ergänzen.
- [ ] Mit realen Spielständen auf PC und iPhone gegen Dateigröße des JSON-Backups vergleichen.
- [ ] Große Foto- und PDF-Sammlungen sowie Cloud-Synchronisierung mit größeren Datenmengen praktisch testen.

Hinweis: Die Anzeige ist eine Näherung anhand der serialisierten Daten und eingebetteten Base64-Medien. Sie misst nicht den tatsächlich belegten Browser- oder Cloud-Speicher.


## Foto-Komprimierung vor der Cloud-Synchronisierung (Preview)

- [x] Foto-Komprimierung auf eine definierte maximale Daten-URL-Größe von 700.000 Zeichen ausrichten.
- [x] Bei größeren Bildern schrittweise Bildabmessungen und JPEG-Qualität reduzieren, statt nur einen einzigen zweiten Komprimierungsschritt auszuführen.
- [x] Wenn ein Bild die Zielgröße auch nach mehreren Schritten nicht erreicht, verständlich abbrechen, ohne einen übergroßen Fotoeintrag hinzuzufügen.
- [x] Fehler beim Lesen, Dekodieren oder Komprimieren mit einer verständlichen Rückmeldung behandeln.
- [ ] Praxistest mit kleinen, großen und sehr detailreichen Fotos auf PC und iPhone.
- [ ] Anschließend tatsächliche Cloud-Synchronisierungsdauer mit mehreren Fotos und PDF-Anleitungen vergleichen.

Die Anpassung begrenzt die Größe neu hinzugefügter Fotos. Bereits gespeicherte Fotos und PDF-Dateien werden nicht verändert. Die Cloud speichert weiterhin den gesamten verschlüsselten Spielstand als eine Nutzlast; eine echte Trennung in Medienobjekte und Tagebuchdaten erfordert eine separate Backend-Änderung und wird nicht vorweggenommen.


## Cloud-Medienübertragung und lokale Notfallkopie (Preview)

- [x] Geschätzte Größe der verschlüsselten Cloud-Nutzlast zusätzlich zur lokalen Datengröße anzeigen.
- [x] Wenn die lokale verschlüsselte Notfallkopie wegen Browser-Speicherlimits nicht geschrieben werden kann, einmalig deutlich warnen und auf ein zusätzliches JSON-Backup hinweisen.
- [x] Warnung nach erfolgreichem Schreiben einer Notfallkopie zurücksetzen.
- [ ] Cloud-Synchronisierung mit großen Foto- und PDF-Beständen auf PC und iPhone praktisch messen.
- [ ] Supabase-Fehler bei großen Nutzlasten mit vollständigem HTTP-Fehlertext und realen Datenmengen untersuchen.

Die verschlüsselte Nutzlastgröße ist eine Näherung aus UTF-8-Datenlänge, AES-GCM-Tag und Base64-/JSON-Overhead. Sie ist keine Messung des tatsächlichen HTTP-Transfers oder einer Supabase-Grenze.


## Architektur: getrennte, clientseitig verschlüsselte Medienablage (Preview)

- [x] Bestehenden Datenfluss analysiert: Fotos, Gerätebilder und PDF-Anleitungen sind aktuell Base64/Data-URLs innerhalb des vollständigen verschlüsselten `db`-JSON in `mva_saves.payload`.
- [x] Architektur für privaten Supabase-Storage-Bucket mit AES-GCM-Verschlüsselung im Browser und zufälligen Objektpfaden dokumentiert.
- [x] RLS-Policy-Vorschlag für benutzergebundene Storage-Objekte dokumentiert; keine öffentlichen URLs und keine Service-Role-Schlüssel.
- [x] Migration, Altformat-Kompatibilität, portable JSON-Backups, Löschreihenfolge und Rollout-Schritte festgelegt.
- [ ] Storage-Bucket und Policies in einem separaten Supabase-Testprojekt einrichten und mit zwei Konten isoliert testen.
- [ ] Upload-/Download-Prototyp mit dem bestehenden Datenverschlüsselungsschlüssel entwickeln und Byte-genau verifizieren.
- [ ] Galerie, Gerätebilder, PDF-Viewer und JSON-Backup auf Medienreferenzen umstellen; Data-URL-Altbestände weiterhin unterstützen.
- [ ] Erst nach erfolgreichem Backup-/Restore- und Mehrkontentest eine optionale Migration vorhandener Medien freigeben.

Die Architektur ist dokumentiert, aber noch nicht aktiviert. Es wurden keine Supabase-Tabellen, Buckets oder Policies verändert und keine bestehenden Nutzerdaten migriert. Die App verwendet weiterhin das bisherige eingebettete Medienformat.


## Tagebucheinträge: Bearbeiten und Speichern absichern (Preview)

- [x] Dialog-Schaltflächen ausdrücklich als Buttons definieren, damit ein umgebendes Formular keinen unbeabsichtigten Submit auslöst.
- [x] Speichern gegen Doppelklick schützen und Fehler im Dialog abfangen, ohne die Cloud-Anmeldung zu beenden.
- [x] Geändertes Datum vor der Übernahme auf ein gültiges Kalenderdatum prüfen.
- [ ] Den konkreten Fehler beim Bearbeiten des Dr.-Dabber-Switch²-Eintrags (24.11. → 23.11.) auf PC und iPhone reproduzieren und erfolgreich speichern.
- [ ] Prüfen, dass die Änderung nach Neuladen und erneutem Anmelden erhalten bleibt und die Cloud-Synchronisierung abgeschlossen ist.

Hinweis: Die Änderung ist eine defensive Absicherung des Dialogs. Sie beweist noch nicht, dass die vom Nutzer beobachtete Abmeldung vollständig behoben ist; dafür ist der beschriebene Praxistest erforderlich.



## Getrennte Medienablage – technische Grundlage (Preview)

- [x] Datenmodell präzisiert: strukturierte Tagebuch-/Geräte-/Sorten-/Fortschrittsdaten bleiben gemeinsam verschlüsselt; große Fotos und PDFs werden später separat als einzelne Objekte gespeichert.
- [x] Isoliertes Modul `cloud-media.js` mit clientseitiger AES-GCM-Verschlüsselung, frischem IV pro Datei und zufälligen benutzergebundenen Objektpfaden ergänzt.
- [x] Download entschlüsselt erst im Browser; Löschen/Download akzeptieren nur Referenzen aus dem eigenen Benutzerordner.
- [x] Modul in Preview eingebunden, aber noch nicht aktiviert und noch nicht mit bestehenden Formularen verbunden.
- [ ] Privaten Supabase-Bucket und RLS-Policies in einem Testprojekt einrichten und Zwei-Konten-Isolation prüfen.
- [ ] Upload/Download mit Testfoto und Test-PDF durchführen und Byte-genau vergleichen.
- [ ] Galerie, Gerätebilder, PDF-Viewer sowie JSON-Backup/Import auf Medienreferenzen umstellen; Data-URL-Altbestände weiter unterstützen.
- [ ] Erst nach erfolgreicher Prüfung freiwillige Einzelmigration bestehender Medien ermöglichen.

Wichtig: Diese Stufe ändert keine vorhandenen Medien oder Cloud-Datensätze. Der bisherige Speicherweg bleibt aktiv, bis Backend-Einrichtung und vollständige Integration getestet sind.


## Tagebucheinträge: Cloud-Speicherung beim Bearbeiten abwarten (Preview)

- [x] Beim Speichern eines Tagebucheintrags im Cloud-Modus den laufenden Timer abbrechen und den verschlüsselten Cloud-Schreibvorgang unmittelbar abwarten.
- [x] Dialog erst nach bestätigtem Cloud-Speichern schließen; bei Uploadfehler bleibt der Dialog geöffnet und die Anmeldung bestehen, sodass erneut gespeichert werden kann.
- [ ] Switch²-Eintrag konkret von 24.11. auf 23.11. ändern und prüfen, dass der Dialog erst nach erfolgreichem Cloud-Upload schließt.
- [ ] Nach Neuladen und erneutem Anmelden kontrollieren, dass Datum und Eintrag dauerhaft erhalten sind.

Hinweis: Die Änderung verhindert eine voreilige Erfolgsmeldung beim Bearbeiten. Sie garantiert nicht, dass ein übergroßer Cloud-Spielstand oder ein Backend-Fehler automatisch behoben ist; der konkrete Test mit dem vorhandenen Spielstand bleibt erforderlich.


## Lokale verschlüsselte Notfallkopie: IndexedDB statt localStorage (Preview)

- [x] Große verschlüsselte Notfallkopien werden nicht mehr in den stark begrenzten localStorage geschrieben.
- [x] Separate IndexedDB-Datenbank `mva_secure_recovery` mit eigenem Speicherbereich für die Wiederherstellungskopien ergänzt.
- [x] Pro angemeldetem Cloud-Benutzer wird die verschlüsselte Nutzlast separat gespeichert; der Cloud-Spielstand und seine Verschlüsselung bleiben unverändert.
- [x] Fehler beim lokalen Backup werden weiterhin abgefangen und beeinträchtigen nicht den eigentlichen Cloud-Upload.
- [ ] Im Browser mit dem vorhandenen großen Spielstand prüfen, dass Cloud-Speicherung und lokale Notfallkopie erfolgreich abgeschlossen werden.
- [ ] Prüfen, dass mehrere Konten getrennte Wiederherstellungskopien erhalten und die IndexedDB-Daten nach Neuladen erhalten bleiben.

Hinweis: Die IndexedDB-Kopie ist eine lokale zusätzliche Sicherung auf diesem Browser/Gerät. Sie ist nicht mit einem geräteübergreifenden Backup gleichzusetzen. Die bestehenden Cloud-Daten und vorhandenen Medien werden durch diese Änderung nicht migriert oder gelöscht.


## Rückmeldung beim Speichern von Tagebucheinträgen (Preview)

- [x] Speichern-Button zeigt während eines laufenden Speichervorgangs „Speichert …“ und ist gegen Doppelklick gesperrt.
- [x] Im Cloud-Modus wird der Speicherstatus beim manuellen Speichern eines Tagebucheintrags sichtbar auf „Tagebucheintrag wird in der Cloud gespeichert …“ gesetzt.
- [x] Nach Abschluss wird die ursprüngliche Button-Beschriftung wiederhergestellt; Fehler bleiben sichtbar und der Dialog bleibt zur erneuten Speicherung geöffnet.
- [ ] Im Browser mit dem Switch²-Eintrag testen: Button-Rückmeldung, Statuswechsel und erfolgreiche Änderung des Datums.


## Cache-Aktualisierung für die Speichern-Rückmeldung (Preview)

- [x] Versionsparameter des eingebundenen `app.js` in `index.html` erhöht, damit Browser/CDN nicht weiter eine ältere JavaScript-Datei mit unverändertem Cache-Schlüssel verwenden.
- [ ] Nach Aktualisierung der Preview prüfen, dass der Klick auf „Änderungen speichern“ unmittelbar „Speichert …“ anzeigt.


### Phase 2 – Zielsetzung und kontrollierter Konsum (Preview umgesetzt)
- [x] Phase 2 parallel zu Phase 1 sichtbar machen; beide Bereiche bleiben geöffnet und Phase 2 ist als aktiv markiert.
- [x] Sechs Kategorien anbieten: Vaporizer, E-Zigarette, Tabakheater, Zigarette, Joint und Bong.
- [x] Kategorien einzeln aktivieren/deaktivieren; deaktivierte Kategorien aus der aktuellen Phase-2-Ansicht ausblenden, Tagebucheinträge und historische Daten jedoch erhalten.
- [x] Pro Kategorie ein Tageslimit, ein Wochenlimit und ein Ziel für konsumfreie Tage speichern.
- [x] Gesamtkonsum ausdrücklich als Anzahl der Sessions (Tagebucheinträge) zählen – keine Gramm-/Milliliter-Mengen.
- [x] Vorhandene Bezeichnungsfelder nach Kategorie zuordnen: Vaporizer = Sorte/Material, E-Zigarette = Liquid, Tabakheater = Sticks, Zigarette = Marke, Joint = Mischung, Bong = Sorte/Mischung.
- [x] Zufriedenheit auf einer Skala von 1 (sehr zufrieden) bis 7 (sehr unzufrieden) je Kategorie und Kalenderwoche speichern; frühere Wochenbewertungen bleiben erhalten.
- [ ] Noch ergänzen/prüfen: Tagesampel (Limit eingehalten/überschritten), Zielerreichung für konsumfreie Tage und bessere Zusammenfassung der Wochenziele.
- [ ] Prüfen, dass die Bezeichnungsfelder für Liquid, Sticks, Marke und Mischung im Tagebuch tatsächlich komfortabel gepflegt und aus den passenden Sammlungen auswählbar sind.
- [ ] Regressionstests für Zielwerte, Wochenwechsel, historische Bewertungen und deaktivierte Kategorien ergänzen.
- [ ] Preview-Praxistest auf iPhone und Desktop; Neuladen und Cloud-Synchronisierung prüfen.


## Strain Collection: Kategorie zuerst auswählen (Preview)

- [x] Freie Kategorie-Texteingabe durch Auswahl der sechs vorhandenen Konsumkategorien ersetzt.
- [x] Kategorieauswahl im Formular an den Anfang gestellt.
- [x] Vorhandene unbekannte Kategorieangaben beim Bearbeiten als übernommene Altangabe erhalten, bis eine neue Kategorie gewählt wird.
- [ ] Kategorienabhängige Formularfelder und Sammlungs-/Materialtypen im nächsten Schritt ergänzen.
- [ ] Bestehende Einträge prüfen und Kategoriezuordnung auf PC und iPhone testen.


### Ergänzung: App-Einstellungen als eigene Datengruppe
- Bei der Prüfung der tatsächlichen `app.js`-Nutzung wurde zusätzlich `db.settings` gefunden (u. a. benutzerdefinierte Vaping-Kategorien).
- Die neue Gruppenstruktur wurde deshalb von sechs auf sieben Gruppen erweitert: `settings` wird separat verschlüsselt und synchronisiert.
- Codec, Datengruppen-Modul, SQL-Einrichtungsanleitung und isolierte Tests wurden entsprechend angepasst.
- Die Live-App bleibt weiterhin auf dem bisherigen Legacy-Speicher; Migration und Aktivierung sind nicht erfolgt.

- Zusätzliche Sicherung: Der Migrations-Codec weist unbekannte Top-Level-Felder jetzt ausdrücklich zurück, statt sie beim Aufteilen stillschweigend zu verlieren. Ein entsprechender Negativtest wurde ergänzt.
- Die SQL-Anleitung enthält nun auch die Aktualisierung der `data_type`-Constraint für bereits zuvor angelegte `mva_data`-Tabellen, damit `settings` dort zulässig ist.

- Der Adapter für Datengruppen sendet jetzt bei jedem Lese- und Schreibaufruf explizit das Bearer-Token der angemeldeten Sitzung mit; Token-Erneuerung bleibt über `cloudFetch()` erhalten.

- CI-Lauf #142 für den vorherigen Cloud-Audit-Pfad erfolgreich.
- CI-Lauf #152 für den neuen Nur-Lese-Gruppenabgleich erfolgreich; die Tests decken vollständige Übereinstimmung, leeren Gruppenbestand und abweichende Inhalte ab.
- Ein echter Supabase-Live-Test mit angemeldetem Konto sowie iPhone-/Desktop- und Zwei-Konten-Prüfung stehen weiterhin aus.


### Ergänzung: Nur-lesender Abgleich der sieben Datengruppen
- [x] Im Bereich „Speicher & Backup“ eine zusätzliche Prüfung ergänzt, die den bisherigen verschlüsselten Cloud-Spielstand und die sieben getrennten Datengruppen ausschließlich liest.
- [x] Der Abgleich unterscheidet zwischen noch leerem Gruppen-Speicher, vollständiger Übereinstimmung, fehlenden Gruppen und abweichenden Inhalten.
- [x] Keine Schreib-, Migrations-, Lösch- oder Reparaturaktion: der bisherige Cloud-Spielstand bleibt unverändert.
- [x] Isolierte Tests für vollständige Übereinstimmung, leeren Gruppenbestand und abweichende Gruppe ergänzt.
- [ ] Read-only-Liveprüfung mit einem echten angemeldeten Supabase-Testkonto durchführen; dafür im Preview unter „Speicher & Backup“ den Button „Datengruppen abgleichen (nur lesen)“ ausführen und das Ergebnis prüfen.
- [ ] Erst nach dokumentierter Liveprüfung einen gesondert freizugebenden Migrationsschritt planen.


### Cloud-Abgleich: aktiven Entschlüsselungsschlüssel wiederverwenden
- [x] Ursache des fehlgeschlagenen Nur-Lese-Abgleichs gefunden: Das Login löscht das Kennwort nach erfolgreicher Anmeldung, während der spätere Audit erneut eine Schlüsselableitung aus diesem leeren Kennwort versuchte.
- [x] Entschlüsselung für Legacy-Spielstände und verschlüsselte Umschläge so angepasst, dass ein bereits für denselben Salt/Umschlag abgeleiteter Sitzungsschlüssel wiederverwendet wird; das Kennwort muss nicht im Speicher verbleiben.
- [ ] Regressionstest im Preview: Datengruppenabgleich nach regulärer Anmeldung für Legacy- und Umschlag-Format.


## 11. Sichere Übernahme der sieben Cloud-Datengruppen – Preview

- [x] Zweistufiger Ablauf ergänzt: vollständiges JSON-Backup aus dem entschlüsselten bisherigen Cloud-Spielstand erstellen, danach separate ausdrückliche Bestätigung vor dem Migrationsstart
- [x] Vor jeder Übertragung alle sieben Gruppen lesen und vergleichen; bereits identische Gruppen werden übersprungen
- [x] Vorhandene, aber abweichende Gruppen lösen einen vollständigen Sicherheitsstopp aus und werden nicht automatisch überschrieben
- [x] Zusätzlicher atomarer Schutz: neu anzulegende Gruppen werden mit erwarteter Revision 0 geschrieben; wird zwischen Vorprüfung und Schreibvorgang ein Datensatz angelegt, verhindert der Versionskonflikt ein Überschreiben
- [x] Fehlende Gruppen einzeln clientseitig mit AES-GCM verschlüsseln, schreiben und durch erneutes Lesen/Entschlüsseln verifizieren
- [x] Abschließenden Vergleich aller sieben Gruppen nach der Übertragung ergänzen
- [x] Legacy-Spielstand bleibt unangetastet; keine automatische Löschung, Umschaltung oder Migration von Produktionsdaten
- [x] Migration wird blockiert, solange eingebettete Foto-/PDF-Dateien oder ungültige Medienangaben im Spielstand gefunden werden; Medien müssen zuerst separat verifiziert migriert werden
- [ ] Preview-Praxistest mit dem bestehenden Benutzerkonto und vollständigem JSON-Backup durchführen
- [ ] Medienmigration separat implementieren und testen, bevor die sieben Gruppen mit eingebetteten Medien migriert werden
- [ ] Konfliktfall, Abbruch während einer Gruppe, Read-back und erneuter Start testen
- [ ] Erst nach vollständiger QA und ausdrücklicher Nutzerfreigabe die neue Datengruppen-Speicherung aktivieren; Legacy bleibt bis dahin Rückfallquelle


## 12. Verifizierte Medienmigration vor der Datengruppen-Übernahme – Preview

- [x] Separates Modul ergänzt, das eingebettete Data-URL-Fotos und PDFs im entschlüsselten Legacy-Spielstand erkennt.
- [x] Jede Datei vor dem Upload clientseitig mit AES-GCM verschlüsseln; keine Klartextdatei wird an Supabase Storage gesendet.
- [x] Uploads durch erneutes Herunterladen und Entschlüsseln sowie Größen- und SHA-256-Vergleich verifizieren (uploadVerified).
- [x] Byteidentische Dateien innerhalb desselben Migrationslaufs anhand SHA-256 nur einmal hochladen und dieselbe Referenz wiederverwenden.
- [x] Nur die für die neue Datengruppen-Migration vorbereitete In-Memory-Kopie erhält Cloud-Referenzen; der bisherige Legacy-Spielstand und das heruntergeladene JSON-Backup werden nicht umgeschrieben.
- [x] Vor dem Schreiben der sieben Datengruppen erneut prüfen, dass keine eingebetteten oder ungültigen Medienangaben übrig sind.
- [x] Bei Upload-, Entschlüsselungs- oder Verifikationsfehlern wird die Datengruppen-Migration gestoppt; die Legacy-Sicherung wird nicht verändert.
- [ ] Tests für Data-URL-Parsing, PDF-/Foto-Zuordnung, Duplikaterkennung, Uploadfehler und Verifikationsfehler ergänzen.
- [ ] Preview-Live-Test mit dem vorhandenen Konto: alle sieben Medienobjekte müssen erfolgreich hochgeladen und verifiziert werden; anschließend Datengruppen einzeln schreiben und vollständig zurücklesen.
- [ ] Abbruch-/Wiederholungsfall prüfen: bereits hochgeladene, aber noch nicht referenzierte Storage-Objekte können bei einem Abbruch als nicht referenzierte Dateien zurückbleiben; sie dürfen nicht automatisch gelöscht werden.
- [ ] Erst nach erfolgreichem Preview-Test und ausdrücklicher Freigabe den PR mergen. Production bleibt unberührt.

Hinweis: Ein erfolgreicher Medienupload allein ändert weder den Legacy-Spielstand noch die sieben Datengruppen. Die Gruppen werden erst danach und weiterhin mit Revision-0-Schutz angelegt. Ein Abbruch nach einzelnen erfolgreichen Uploads kann nicht referenzierte, verschlüsselte Objekte im privaten Bucket hinterlassen; diese werden aus Sicherheitsgründen nicht automatisch gelöscht.


## Kontrolliert Vapen – Schritt 3: Bilanz ziehen

- [x] Schritt 3 um eine kategoriespezifische Checkliste zur Bilanz des Vapingkonsums ergänzt.
- [x] Fragen (a) und (b): Anzahl der Sessions der vergangenen Woche und Sessions am stärksten Konsumtag als Zahlenfelder.
- [x] Fragen (c) und (d): Ja-/Nein-Kästchen; bei (c) zusätzlich Anzahl vapingfreier Tage sowie ein Textfeld zur Erklärung, bei (d) ein Textfeld zu den Gründen.
- [x] Fragen (e), (f) und (g): eigene mehrzeilige Antwortfelder.
- [x] Fragen und Antworten werden je aktiver Konsumkategorie getrennt angezeigt und gespeichert; Antworten können später bearbeitet und erneut gespeichert werden.
- [x] Speicherung über den bestehenden Spielstand und die vorhandene lokale-/Cloud-Speicherlogik; Übersetzungen für Deutsch, Englisch und Französisch ergänzt.
- [ ] Praxistest im Preview: alle Felder ausfüllen, speichern, Schritt verlassen, erneut öffnen und Werte kontrollieren; zusätzlich Ja/Nein-Auswahl und Cloud-Synchronisierung prüfen.



### 1.4.2 – Ursachenanalyse der abweichenden Datengruppen
- [x] Nur-Lese-Abgleich um eine datensparsame Detaildiagnose erweitert: Gruppengrößen und erste abweichende Feldpfade werden angezeigt, ohne Dateninhalte offenzulegen.
- [x] Diagnose verändert weder Legacy-Spielstand noch getrennte Datengruppen; keine Upload-, Schreib- oder Löschoperationen.
- [x] App-Cachekennung aktualisiert; JavaScript-Syntax lokal geprüft.
- [ ] Detailergebnis mit dem bestehenden Benutzerkonto in der Preview ausführen und die Abweichungspfade auswerten.
- [ ] Erst danach konkrete Ursache beheben und den Nur-Lese-Abgleich erneut ausführen.



### 1.4.3 – Datengruppen-Abgleich nach IDs und Medientypen
- [x] Tagebucheinträge im Nur-Lese-Audit anhand eindeutiger IDs statt Array-Positionen vergleichen; fehlende, zusätzliche, doppelte und geänderte IDs zählen.
- [x] Medienwerte nach eingebetteten Bildern/PDFs, Cloud-Referenzen, leeren Werten und anderen Datentypen unterscheiden.
- [x] XP-Werte beider Spielstände im Audit direkt gegenüberstellen.
- [x] Keine Dateninhalte von Tagebucheinträgen ausgeben; keine Schreib-, Upload-, Lösch- oder Reparaturaktion.
- [x] Cachekennung aktualisiert und JavaScript-Syntax geprüft.
- [ ] Neue Nur-Lese-Prüfung mit dem bestehenden Konto in der Preview ausführen und Ergebnis auswerten.


### 1.4.4 – Medien-Diagnose rekursiv korrigieren
- [x] Medien-Diagnose auf rekursive Suche im vollständigen jeweiligen Datengruppenobjekt umgestellt; Medien können dadurch auch in verschachtelten Feldern erkannt werden.
- [x] Ausgabe zeigt nur Pfade und Medientypen, keine Datei- oder Tagebuchinhalte.
- [x] Nur-Lese-Verhalten beibehalten; keine Cloud-Daten werden verändert.
- [x] Cachekennung aktualisiert und JavaScript-Syntax geprüft.
- [ ] Neue Medien-Diagnose in der Preview ausführen und die gefundenen Pfade auswerten.


### 1.4.5 – Fehlende Tagebucheinträge zeitlich zuordnen
- [x] Nur-Lese-Prüfung ergänzt: Datumswerte der acht ausschließlich im Altbestand vorhandenen Einträge ausgeben, ohne IDs oder Notiztexte offenzulegen.
- [x] Medienprüfung auf den vollständigen Altbestand und den rekonstruierten Satz aller sieben getrennten Gruppen erweitert.
- [x] Keine Schreib-, Upload- oder Löschoperationen; JavaScript-Syntax geprüft.
- [ ] Preview-Prüfung durch Nutzer und zeitliche Einordnung der acht Einträge.


### 1.4.6 – Datumswerte der fehlenden Einträge zuverlässig auslesen
- [x] Datumsdiagnose korrigiert: ISO-Datum, deutsches Datum und Zeitstempel (Sekunden/Millisekunden) werden erkannt.
- [x] Ausgabe beschränkt sich auf Datumswerte; keine IDs oder Notiztexte.
- [x] Nur-Lese-Verhalten beibehalten und JavaScript-Syntax geprüft.
- [ ] Preview-Ergebnis mit den acht fehlenden Einträgen auswerten.


### 1.4.7 – Vollständigkeit der acht fehlenden Tagebucheinträge (nur lesend)
- [x] Für die acht nur im Altbestand vorhandenen Einträge Datum, Uhrzeit und Kategorie ermitteln.
- [x] Anzahl ausgefüllter Detailfelder sowie Vorhandensein von Gerät, Material, Nutzungsmaß und Notizen ausgeben.
- [x] Notiztexte und IDs bleiben verborgen; es werden nur Feldnamen und Textlängen angezeigt.
- [x] Diagnose bleibt rein lesend; keine Übernahme, Löschung oder Änderung.
- [x] JavaScript-Syntax geprüft und Cache-Schlüssel auf 1.6.6 aktualisiert.
- [ ] Ergebnis im Preview prüfen und die acht Einträge fachlich einordnen.


### 1.4.8 – Gezielte Ergänzung der acht fehlenden Tagebucheinträge

- [x] Separaten, ausdrücklich ausgelösten Übernahmeweg ergänzt; die allgemeine Gruppenmigration wird dafür nicht verwendet
- [x] Vor dem Schreiben vollständiges Backup und unveränderten Legacy-Spielstand verlangen
- [x] Nur fehlende Einträge per ID ergänzen; vorhandene Einträge müssen vollständig mit dem Legacy-Bestand übereinstimmen
- [x] Sicherheitsstopps bei fehlenden/duplizierten IDs, fremden oder abweichenden Einträgen und verändertem Bestandsumfang
- [x] Optimistisches Schreiben mit erwarteter Revision und anschließendem entschlüsselten Read-back aller Einträge
- [x] Andere Datengruppen, Medien und XP bleiben unangetastet
- [x] JavaScript-Syntax geprüft; Cache-Version auf 1.6.9 angehoben
- [ ] Nach Deployment Backup erneut erstellen, die acht Einträge ausdrücklich ergänzen und Ergebnis vom Nutzer bestätigen


### 1.4.9 – Gezielte XP-Korrektur in der getrennten Spielgruppe

- [x] Separaten XP-Korrekturweg ergänzt; die allgemeine Gruppenmigration wird nicht verwendet
- [x] Vollständiges Backup und unveränderten Legacy-Spielstand als Voraussetzung
- [x] Nur-Lese-Sicherheitsprüfung: alle Felder außer XP müssen zwischen Altbestand und getrennter Gruppe identisch sein
- [x] Erwartete Ausgangswerte 123 (Altbestand) und 96 (getrennt) werden vor dem Schreiben erneut geprüft
- [x] Ausschließlich XP wird geändert; Coins, Quests, Kurse und übrige Felder bleiben unverändert
- [x] Optimistisches Schreiben mit erwarteter Revision und entschlüsselter Read-back-Prüfung
- [x] JavaScript-Syntax geprüft; Cachekennung aktualisiert
- [ ] In Preview frisches Backup über den Backup-Button im Migrationsbereich erstellen und XP-Korrektur ausdrücklich bestätigen



## Startseite: rollierende Vaping-Session-Übersicht (Preview)

- [x] Statistik-Tabelle unter den bisherigen Startseiten-Inhalten und oberhalb des „Wir unterstützen“-Fußbereichs ergänzt.
- [x] Sieben-Tage-Zeitraum standardmäßig mit dem heutigen Datum als rechtem/letztem Tag; die sechs vorherigen Tage stehen links davon.
- [x] Datumsfeld und Pfeilnavigation ergänzt; jeder Pfeilklick verschiebt den Zeitraum um genau einen Kalendertag.
- [x] Vaporizer, E-Zigarette und Tabakheater nach vier Zeitfenstern sowie Tages- und Zeitraumssummen ausgewertet.
- [x] Sessions werden aus Tagebucheinträgen berechnet; Einträge ohne Uhrzeit zählen zu Tages-/Zeitraumssummen, nicht zu Zeitfenstern.
- [x] Tabelle passt sich der gewählten App-Sprache an und ist auf schmalen Displays horizontal scrollbar.
- [x] Aktueller Kalendertag in der Tabelle farblich über die gesamte Spalte hervorgehoben und mit „Heute“ gekennzeichnet (PR #119).
- [x] Cache-Versionen nach der Hervorhebung aktualisiert (PR #120).
- [x] Uhrzeit-Erkennung erweitert: gespeicherte Uhrzeiten, Zeitstempel und alternative Zeitfelder werden berücksichtigt (PR #121).
- [x] Alle einzelnen Uhrzeitfelder zeigen numerische Werte einschließlich `0` statt eines Gedankenstrichs; Wochenwerte je Zeitfenster ebenfalls numerisch (PR #121).
- [ ] Preview-Praxistest mit echten Tagebucheinträgen, fehlenden Uhrzeiten, Datumswechsel und Pfeilnavigation auf Desktop/iPhone.
