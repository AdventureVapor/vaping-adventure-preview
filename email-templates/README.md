# My Vaping Adventure – zentrales E-Mail-Designsystem

**Status:** verbindliche Master-Vorlage für alle ausgehenden E-Mails  
**Gestaltungsentscheidung:** Dunkelgrün passend zur App; im Kopfbereich ausschließlich das Logo.

## 1. Verbindliche Markenregeln

- **Kopfbereich:** dunkelgrüne Fläche (App-Grün `#315b4a`), mittig ausschließlich das offizielle Logo. Kein zusätzlicher Schriftzug und kein Slogan im Header.
- **Grundfläche:** warmes, sehr helles App-Neutral `#f5f5f0`; Nachrichtenkarte weiß.
- **Akzent:** helles Naturgrün `#eef2e9`; dezente Linien `#e8e9e3`.
- **Text:** dunkles Grün-Schwarz `#202b28`; Fließtext `#46534b`; ergänzende Hinweise `#77817b`.
- **Aktionsbutton:** App-Grün `#315b4a` mit weißer, gut lesbarer Beschriftung.
- **Form:** zentrierte Nachrichtenkarte, maximal 600 px breit, auf Mobilgeräten flüssig auf volle Breite angepasst.
- **Sprache und Ton:** freundlich, klar, respektvoll und sachlich. Eine E-Mail behandelt genau einen Anlass und hat eine eindeutige nächste Handlung.
- **Absenderidentität:** „My Vaping Adventure“; als Kontaktadresse `myvapingadventure@gmail.com`.

## 2. Einheitlicher Aufbau

1. Unsichtbarer Vorschautext (Preheader), der den Anlass knapp erklärt.
2. Dunkelgrüner Kopf mit Logo allein.
3. Kleine Anlasszeile (optional), klare Überschrift und persönliche Anrede im Nachrichtentext.
4. Individueller Nachrichtentext.
5. Ein hervorgehobener Hauptbutton, wenn eine Handlung erforderlich ist.
6. Klartext-Fallback-Link für den Fall, dass der Button nicht funktioniert.
7. Sicherheits-/Hinweiszeile, sofern für den Anlass relevant.
8. Einheitlicher Footer mit Projektname, Kontaktadresse und ggf. erforderlichem System-/Rechtshinweis.

## 3. Platzhalter der HTML-Masterdatei

Die Datei `master-template.html` ist ein Layout-Master, kein direkt versendbares Template. Vor dem Versand müssen die Platzhalter passend zum jeweiligen E-Mail-Anbieter ersetzt werden:

- `{{SUBJECT}}` – Betreff (wird im HTML-Dokumenttitel verwendet; den eigentlichen Mail-Betreff separat im Anbieter setzen).
- `{{PREHEADER}}` – Vorschautext.
- `{{EYEBROW}}` – kurze Anlasszeile; bei Bedarf leer lassen.
- `{{HEADING}}` – Hauptüberschrift.
- `{{BODY_HTML}}` – individueller HTML-Nachrichtentext; nur vertrauenswürdigen, korrekt escapten Inhalt einsetzen.
- `{{ACTION_URL}}` – Zieladresse des Hauptbuttons und des Fallback-Links.
- `{{ACTION_LABEL}}` – kurze Button-Beschriftung.
- `{{FALLBACK_TEXT}}` – Einleitung zum alternativen Link.
- `{{SECURITY_NOTE}}` – Sicherheits- oder Gültigkeitshinweis; wenn nicht benötigt, den gesamten Hinweisblock entfernen.
- `{{FOOTER_TEXT}}` – einheitlicher kurzer Footertext.
- `{{LEGAL_OR_SYSTEM_LINE}}` – optionaler Systemhinweis am Ende.

## 4. Technische E-Mail-Regeln

- Tabellenlayout und weitgehend Inline-CSS für robuste Darstellung in Gmail, Apple Mail und Outlook.
- Keine JavaScript-Ausführung, keine externen Stylesheets, keine Hintergrundbilder und keine eingebetteten Formulare.
- Logo als öffentlich erreichbares HTTPS-Bild mit Alternativtext; E-Mails müssen auch bei blockierten Bildern verständlich bleiben.
- Immer eine passende Nur-Text-Version mitsenden.
- Links müssen HTTPS verwenden, soweit der jeweilige Auth-Anbieter dies unterstützt; keine Zugangsdaten oder privaten Inhalte in den Nachrichtentext schreiben.
- Für jede Sprache (Deutsch, Englisch, Französisch) denselben Aufbau und dieselbe visuelle Hierarchie beibehalten.
- Keine pauschalen Marketing-/Newsletter-Elemente in sicherheitsrelevante Systemmails einbauen.

## 5. Verwendung in Supabase

Supabase verwaltet die Auth-E-Mail-Vorlagen je Anlass separat (z. B. Registrierung/Bestätigung und Passwort-Zurücksetzen). Deshalb wird dieses Masterlayout in jede benötigte Vorlage übernommen; nur Betreff, Anlasszeile, Text, Button-Beschriftung, Anbieter-Variablen und Sicherheitshinweise unterscheiden sich. Supabase-Platzhalter wie Bestätigungs- oder Reset-URLs müssen exakt aus der jeweiligen Supabase-Vorlage übernommen werden. Die Master-Platzhalter aus dieser Datei dürfen nicht unverändert in eine produktive Vorlage gelangen.

**Wichtig:** Diese Änderung dokumentiert und erstellt die verbindliche Gestaltungsvorlage im Preview-Repository. Sie ändert noch keine Supabase-Dashboard-Einstellungen und versendet keine E-Mails. SMTP-Absendername, Absenderadresse, Zustellbarkeit und alle drei Sprachvarianten sind separat zu konfigurieren bzw. zu prüfen.

## 6. Vorlagen für neue E-Mail-Anlässe

Für jede neue Nachricht werden vor dem Einbau festgelegt: Anlass, Empfängergruppe, Betreff, Preheader, Überschrift, Nachrichtentext, Hauptaktion, Fallback-Link, Sicherheits-/Gültigkeitshinweis und Nur-Text-Version. Die visuelle Masterstruktur bleibt unverändert.
