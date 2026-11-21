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

## Spätere Ausbaustufe

### Version 1.4 – Ideen / Planung
- [ ] Individuelle Registrierungs-/Bestätigungsmail gestalten (Absendername, Betreff, Text, Logo/Branding und Gestaltung; abhängig von Supabase-/SMTP-Anbieter)
- [ ] Französische Sprache ergänzen
- [ ] Französische Flagge und Übersetzungen integrieren
- [ ] Gewählte Sprache dauerhaft speichern und Sprachwechsel prüfen
- [ ] Individuelle Darstellung der gesamten App über auswählbare Design-Themen (zunächst eine kleine Auswahl, später erweiterbar auf etwa 5–10 Themen); Vorschau und dauerhafte Speicherung der Auswahl

## Technischer Stand

- **Preview-Repository:** `AdventureVapor/vaping-adventure-preview`
- **Preview-Branch:** `main`; QA-Vorbereitungsbranch `release-1.3-qa-prep` wurde per PR #1 in `main` übernommen
- **Produktions-Repository:** `AdventureVapor/vaping-adventure`
- **Produktionsbranch:** `main` – bleibt bis zur ausdrücklichen Freigabe unangetastet.
- **Release-Kandidat:** QA-Vorbereitungsänderungen sind in Preview `main` enthalten (Merge-Commit `491971abdf6afbcacfb3e8f72b9959886203e0bc`).
- **Pull Request:** Preview-PR #1 wurde gemergt; Produktions-Repository und Produktionsbranch wurden nicht verändert.

---

*Die Roadmap wird während der Entwicklung fortgeschrieben. Bereits bestätigte Funktionen werden nicht erneut als offen geführt; noch nicht abschließend geprüfte Funktionen bleiben als QA-Punkte markiert.*
