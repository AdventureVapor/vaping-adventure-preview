# Vaping Adventure – Roadmap

**Arbeitsstand:** Alpha 1.3  
**Aktive Entwicklungsumgebung:** Preview  
**Produktivversion:** bleibt bis zur abgeschlossenen Qualitätssicherung unverändert.

Diese Roadmap dokumentiert umgesetzte und vom Nutzer bestätigte Funktionen sowie noch offene Prüfungen. Ein Häkchen bedeutet, dass die Funktion umgesetzt und – soweit sinnvoll – erfolgreich geprüft wurde.

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

## Version 1.4 – Umsetzung in Preview

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

### 3. Französische Sprache – umgesetzt

- [x] Französisch als dritte App-Sprache ergänzt
- [x] Navigation, Menüs und zentrale Oberflächen übersetzt
- [x] Tagebuch, Geräteverwaltung und Galerie übersetzt
- [x] Lernbereiche, Kurse und Gästebuch übersetzt
- [x] Cloud-Speicher, Backups und Kontoverwaltung übersetzt
- [x] Übersetzungsfehler und gemischte Sprachreste in mehreren Korrekturrunden behoben

### 4. Zentrale Übersetzungsarchitektur – umgesetzt, Migration läuft weiter

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

### 7. Vape-Akademie mit sieben Lernleveln – geplant

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
- [ ] Weitere geplante Kurse schrittweise ausarbeiten: Gerätekunde, Akkusicherheit, Coil/Watte/Verdampferpflege, Liquid-Wissen, Fehlerbehebung für Einsteiger und Nikotin verstehen
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

### 9. Vorbereitung auf Benutzerprofile und Community – geplant

- [ ] Anforderungen für ein erweitertes Benutzerprofil und das geplante Forum in Version 1.5/1.6 dokumentieren
- [ ] Bestehende Supabase-Authentifizierung, Benutzer-IDs und Cloud-Datenspeicherung auf Erweiterbarkeit prüfen
- [ ] Datenmodell für getrennte private Kontodaten und später öffentlich angezeigte Profilinformationen konzeptionell vorbereiten
- [ ] Rollen- und Berechtigungsmodell für Gäste, angemeldete Cloudbenutzer und Moderation entwerfen
- [ ] Sicherheitskonzept für private und öffentliche Inhalte einschließlich Supabase-RLS vorbereiten
- [ ] Sicherstellen, dass die Erweiterung bestehende Konten, Tagebücher und Cloud-Spielstände nicht beeinträchtigt

### 8. Abschlussprüfung Version 1.4 – noch offen

- [ ] Vollständige Sprachprüfung Deutsch, Englisch und Französisch
- [ ] Neuen Kurs „Vom Rauchen zum Vapen“ in DE/EN/FR, mit Quiz, Fortschrittsspeicherung und auf Desktop/iPhone prüfen
- [ ] Registrierung, E-Mail-Bestätigung, Anmeldung und Passwort-Zurücksetzen erneut prüfen
- [ ] Tagebuch, Geräte, Fotos und Galerie prüfen
- [ ] Gästebuch einschließlich Moderationsablauf prüfen
- [ ] Cloud-Speicherung und Synchronisierung zwischen Geräten prüfen
- [ ] CSV-Import/-Export sowie JSON-Backup und Wiederherstellung prüfen
- [ ] Responsive Darstellung auf Desktop und iPhone abschließend prüfen
- [ ] Regressionstests und Sicherheitsprüfung abschließen
- [ ] Produktionsübernahme erst nach abgeschlossener QA und ausdrücklicher Freigabe

## Version 1.5 – Benutzersystem und Startanimation

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

### Startanimation „The First Puff”

- [ ] Aus dem ausgewählten My-Vaping-Adventure-Logo eine Startanimation entwickeln
- [ ] Die Person im Logo führt die Vape zum Mund und nimmt einen Zug
- [ ] Anschließend wird der Dampf sichtbar ausgeatmet
- [ ] Die Person pustet den Dampf in Richtung Betrachter
- [ ] Der Dampf breitet sich aus und füllt nach und nach den gesamten Bildschirm
- [ ] Der Dampf geht anschließend in die eigentliche Startseite der App über
- [ ] Animation für Desktop und iPhone optimieren
- [ ] Überspringen der Animation ermöglichen
- [ ] Rücksicht auf reduzierte Animationen/„Bewegung reduzieren“ des Betriebssystems nehmen
- [ ] Geeignete Logo-Datei mit transparentem Hintergrund (Alpha-Kanal) vorbereiten; die derzeitige Logo-Datei ist noch nicht als transparent bestätigt

## Version 1.6 – My Vaping Adventure Forum

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

## Technischer Stand

- **Preview-Repository:** `AdventureVapor/vaping-adventure-preview`
- **Preview-Branch:** `main`; QA-Vorbereitungsbranch `release-1.3-qa-prep` wurde per PR #1 in `main` übernommen
- **Produktions-Repository:** `AdventureVapor/vaping-adventure`
- **Produktionsbranch:** `main` – bleibt bis zur ausdrücklichen Freigabe unangetastet.
- **Release-Kandidat:** QA-Vorbereitungsänderungen sind in Preview `main` enthalten (Merge-Commit `491971abdf6afbcacfb3e8f72b9959886203e0bc`).
- **Pull Request:** Preview-PR #1 wurde gemergt; Produktions-Repository und Produktionsbranch wurden nicht verändert.

---

*Die Roadmap wird während der Entwicklung fortgeschrieben. Bereits bestätigte Funktionen werden nicht erneut als offen geführt; noch nicht abschließend geprüfte Funktionen bleiben als QA-Punkte markiert.*
