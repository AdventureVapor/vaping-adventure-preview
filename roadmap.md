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
- [x] Row Level Security (RLS) mit benutzergebundenen Richtlinien
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
- [ ] Gesamten zentralen Ablauf (Registrierung, Bestätigung, Login, Datenänderung, Logout, erneuter Login) abschließend durchtesten
  - [x] Mit Testkonto abmelden und erneut anmelden
  - [x] Nach erneutem Login: Tagebucheinträge, Geräte und Galerie-Fotos weiterhin vorhanden
  - [ ] Registrierung und E-Mail-Bestätigung in einem vollständigen Durchlauf prüfen
- [ ] Fehler aus der abschließenden Testrunde beheben

### Sicherheit und Wiederherstellung
- [ ] Zusammenspiel von Passwortänderung, Passwort-Zurücksetzen und Wiederherstellungscode abschließend prüfen
- [ ] Umgang mit älteren Cloud-Spielständen ohne Wiederherstellungsumschlag dokumentieren
- [ ] Sicherheits- und Konfigurationscheckliste abschließend kontrollieren

### Veröffentlichung
- [ ] Hilfetexte und Einrichtungsanleitung finalisieren
- [ ] Versionsnummer und Änderungsübersicht final prüfen
- [ ] Alpha-1.3-Qualitätssicherung abschließen
- [ ] Produktionsübernahme vorbereiten
- [ ] Produktionsübernahme erst nach QA und ausdrücklicher Freigabe

## Spätere Ausbaustufe

### Version 1.4 – Ideen / Planung
- [ ] Französische Sprache ergänzen
- [ ] Französische Flagge und Übersetzungen integrieren
- [ ] Gewählte Sprache dauerhaft speichern und Sprachwechsel prüfen
- [ ] Individuelle Darstellung der gesamten App über auswählbare Design-Themen (zunächst eine kleine Auswahl, später erweiterbar auf etwa 5–10 Themen); Vorschau und dauerhafte Speicherung der Auswahl

## Technischer Stand

- **Preview-Repository:** `AdventureVapor/vaping-adventure-preview`
- **Preview-Branch:** `main`
- **Produktions-Repository:** `AdventureVapor/vaping-adventure`
- **Produktionsbranch:** `main` – bleibt bis zur ausdrücklichen Freigabe unangetastet.
- **Release-Kandidat:** `release-1.3-candidate`
- **Pull Request:** #7 – nicht mergen, bevor die Qualitätssicherung abgeschlossen und die Freigabe erteilt wurde.

---

*Die Roadmap wird während der Entwicklung fortgeschrieben. Bereits bestätigte Funktionen werden nicht erneut als offen geführt; noch nicht abschließend geprüfte Funktionen bleiben als QA-Punkte markiert.*
