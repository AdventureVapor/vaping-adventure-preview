# Changelog

Alle relevanten Änderungen für My Vaping Adventure werden hier nachvollziehbar festgehalten.

## Preview – Vorbereitung 1.4.2 (in Entwicklung, PR #85)

### Datenstruktur und Einstellungen
- Eine gemeinsame Material-Sammlung für Vaporizer-Material, E-Liquids, Tabakheater-Sticks, Zigarettenmarken, Joint-Mischungen und Bong-Material bleibt erhalten.
- Materialvorschläge werden nach Kategorie gefiltert; neue Materialien erhalten ihre Kategorie.
- Tagebucheinträge können eine kompakte Material-ID referenzieren und behalten den Namen als lesbare historische Momentaufnahme.
- Zentrales Einstellungsmenü mit Vaping-Konfiguration, Sprache, Design, Anmelde-/Kontobereich, Startanimation An/Aus und Profil-/Datenübersicht ergänzt.
- Kategorien lassen sich global ein- und ausblenden; vorhandene Einträge werden nicht gelöscht.
- Große Fotos und PDF-Anleitungen bleiben vorerst im bestehenden verschlüsselten Spielstand. Die getrennte Medienablage ist vorbereitet, aber noch nicht mit den Formularen aktiviert und benötigt einen privaten Supabase-Storage-Bucket samt RLS-Prüfung.

### Kommunikation und Sichtbarkeit
- Roadmap um eine rechtlich und plattformseitig zu prüfende Kommunikationsstrategie für Instagram/Facebook ergänzt.
- Es wurde noch kein öffentlicher Social-Media-Account angelegt und keine Werbung geschaltet.

## Alpha 1.3 – Release Candidate
**Stand: 21. November 2026**

### Konten und Cloud
- Registrierung und Anmeldung mit E-Mail-Adresse und Passwort.
- E-Mail-Bestätigung sowie Passwort-Zurücksetzen per E-Mail.
- Verschlüsselte Cloud-Spielstände mit AES-GCM und Synchronisierung zwischen Geräten.
- Wiederherstellungscode für den Zugriff auf neue verschlüsselte Cloud-Spielstände nach einem Passwort-Reset.
- Direkter Passwortwechsel mit Aktualisierung der clientseitigen Schlüsselhülle.
- Profilmenü und Speicherstatus für angemeldete Nutzer.

### Tagebuch und Datensicherung
- CSV-Import und -Export für Tagebucheinträge.
- Duplikaterkennung beim CSV-Import verbessert.
- Fehler bei der Erkennung des deutschen CSV-Spaltennamens „Gerät“ behoben.
- Duplikatvergleich berücksichtigt die exportierten Tagebuchfelder.
- JSON-Backup und Wiederherstellung für den vollständigen Spielstand.

### Oberfläche und Bedienung
- Deutsche und englische Benutzeroberfläche weiter vervollständigt.
- Englische Hilfesuche verbessert.
- Hilfebibliothek für Gast- und angemeldete Ansichten geprüft.
- Galerie- und Gerätebilder werden passend und ohne unerwünschten Beschnitt dargestellt.
- Profil-, Sprach- und Speicherfunktionen weiter geprüft.

### Sicherheit und Qualitätssicherung
- Supabase-Einrichtungsanleitung ergänzt und aus dem README verlinkt.
- Doppelte Deklarationen von Hilfsfunktionen in app.js entfernt.
- Supabase Row Level Security und nutzerbezogene Policies geprüft.
- Fremdschlüssel für Cloud-Spielstände und Löschweitergabe geprüft.
- Browser-Konfiguration auf versehentlich eingebundene geheime Supabase-Schlüssel geprüft.
- Synchronisierung zwischen iPhone und PC in beide Richtungen praktisch getestet.

### Status
Alpha 1.3 ist weiterhin ein **Release Candidate**. Die Preview ist die aktive Testumgebung. Die Produktionsversion wird erst nach Abschluss der offenen QA-Punkte und ausdrücklicher Freigabe aktualisiert.
