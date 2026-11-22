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

## 7. Konkrete Supabase-Auth-Vorlagen

Unter `supabase/` liegen direkt übertragbare deutsche HTML- und Nur-Text-Vorlagen:

| Supabase-E-Mail-Anlass | HTML-Datei | Nur-Text-Datei | Betreffvorschlag |
| --- | --- | --- | --- |
| Confirm signup / Registrierung bestätigen | `signup-confirmation.html` | `signup-confirmation.txt` | Bitte bestätige deine E-Mail-Adresse – My Vaping Adventure |
| Reset Password / Passwort zurücksetzen | `password-reset.html` | `password-reset.txt` | Passwort zurücksetzen – My Vaping Adventure |
| Change Email Address / E-Mail-Adresse ändern | `email-change.html` | `email-change.txt` | Neue E-Mail-Adresse bestätigen – My Vaping Adventure |

Alle drei HTML-Vorlagen verwenden den Supabase-Template-Ausdruck `{{ .ConfirmationURL }}` für Aktionsbutton und Ersatzlink. Diesen Ausdruck beim Einfügen in den jeweils passenden Supabase-E-Mail-Editor unverändert lassen. Die Dateien sind für den jeweiligen Anlass formuliert; nicht eine Vorlage für einen anderen Anlass einsetzen.

### Übernahme in Supabase

1. Im Supabase-Dashboard das richtige Projekt öffnen.
2. Zu **Authentication → Email Templates** wechseln.
3. Den passenden Anlass öffnen (Confirm signup, Reset Password oder Change Email Address).
4. Den Inhalt der jeweiligen HTML-Datei in das HTML-Feld übernehmen.
5. Den Betreffvorschlag separat im Betreff-Feld eintragen.
6. Die Nur-Text-Fassung als Textalternative verwenden, sofern der konfigurierte Versandweg ein separates Textfeld unterstützt; andernfalls muss der Maildienst eine Textalternative erzeugen.
7. Mit einem separaten Testkonto den vollständigen Ablauf auslösen und den Link testen.

**Noch nicht erledigt:** Die Vorlagen liegen ausschließlich im Preview-Repository. Es wurde keine Supabase-Dashboard-Einstellung verändert. Die Betreffzeilen sind Vorschläge und der Absendername/-adresse müssen im Auth-/SMTP-Setup separat festgelegt werden. Die Dateien sind derzeit auf Deutsch; englische und französische Fassungen sowie Tests in Gmail, Apple Mail und Outlook stehen noch aus.

### Wichtiger Hinweis zu Sprachen

Supabase Auth verwendet nicht automatisch drei verschiedene HTML-Dateien anhand der App-Sprachauswahl. Eine echte sprachabhängige Zustellung benötigt eine passende Lösung im Auth-/E-Mail-Versandablauf (z. B. sprachbezogene Vorlagen über einen eigenen sicheren Mailversand). Bis dahin ist die deutsche Vorlage die festgelegte Basis; keine automatische Sprachumschaltung behaupten.
