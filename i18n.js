"use strict";
(() => {
  const pairs = {
    "ADVENTURE · DEIN PRIVATES TAGEBUCH":"ADVENTURE · YOUR PRIVATE DIARY",
    "Nur auf diesem Gerät":"On this device only",
    "DEIN BEREICH":"YOUR SPACE","Übersicht":"Overview","Strain Collection":"Strain Collection","Geräte":"Devices","Photo Gallery":"Photo Gallery",
    "DEIN PERSÖNLICHES TAGEBUCH":"YOUR PERSONAL DIARY","Schön, dass du da bist.":"Welcome back.",
    "Halte deine Sessions, Geräte und Entdeckungen an einem Ort fest.":"Keep your sessions, devices and discoveries in one place.",
    "＋ Neuer Eintrag":"＋ New entry","DEIN ADVENTURE BEGINNT HIER":"YOUR ADVENTURE STARTS HERE",
    "Dein Weg. Deine Aufzeichnungen.":"Your journey. Your records.",
    "Dokumentiere deine Erfahrungen, lerne deine Geräte kennen und sammle Fortschritt durch Wissen und gute Pflege.":"Document your experiences, get to know your devices and make progress through knowledge and good care.",
    "Zum Tagebuch →":"Go to diary →","gesammelt ·":"collected ·","TAGEBUCHEINTRÄGE":"DIARY ENTRIES",
    "Deine dokumentierten Sessions":"Your recorded sessions","GERÄTE":"DEVICES","In deiner Sammlung":"In your collection",
    "PUFFS / ZÜGE":"PUFFS / DRAWS","Optional erfasste Gesamtzahl":"Optional recorded total","SORTEN":"STRAINS",
    "Zuletzt im Tagebuch":"Recently in your diary","Alle ansehen →":"View all →",
    "Deine Geschichte beginnt hier":"Your story starts here","Dein erster Eintrag wartet auf dich.":"Your first entry is waiting for you.",
    "Eintrag erstellen":"Create entry","Dein nächster Schritt":"Your next step","Alle Quests →":"All quests →",
    "WISSEN & PFLEGE":"KNOWLEDGE & CARE","Lerne etwas Neues":"Learn something new",
    "Kurse zu Akkusicherheit, Reinigung und Gerätekunde.":"Courses on battery safety, cleaning and device knowledge.",
    "Kurse entdecken →":"Explore courses →","DEINE AUFZEICHNUNGEN":"YOUR RECORDS",
    "Deine Sessions und Eindrücke im verschlüsselten Cloud-Spielstand.":"Your sessions and impressions in your encrypted cloud save.",
    "Deine Sessions und Eindrücke, lokal auf diesem Gerät gespeichert.":"Your sessions and impressions, stored locally on this device.",
    "Suche in Einträgen …":"Search entries …","Alle Geräte":"All devices","Alle Kategorien":"All categories",
    "Neueste zuerst":"Newest first","Älteste zuerst":"Oldest first","Bearbeiten":"Edit","Löschen":"Delete",
    "Keine Einträge gefunden":"No entries found","Passe deine Suche an oder dokumentiere eine neue Session.":"Adjust your search or record a new session.",
    "Fertig":"Done",
    "Schließen":"Close","Abbrechen":"Cancel","Speichern":"Save","Gerät auswählen (optional)":"Select device (optional)",
    "Eintrag bearbeiten":"Edit entry","Neue Session":"New session","Datum":"Date","Uhrzeit":"Time",
    "Geräteklasse":"Device type","Gerät":"Device","Sorte / Material":"Strain / material",
    "Puffs / Züge · optional":"Puffs / draws · optional","Dauer · Minuten":"Duration · minutes",
    "Temperatur · °C":"Temperature · °C","Ort":"Location","Geschmack · 1–5":"Taste · 1–5",
    "Keine Angabe":"Not specified","Notizen":"Notes",
    "Neue Sorte automatisch in meiner Sammlung speichern":"Automatically save new strain to my collection",
    "Änderungen speichern":"Save changes","Eintrag speichern":"Save entry","Bitte alle Fragen beantworten":"Please answer all questions",
    "Eintrag gespeichert":"Entry saved","DEINE SAMMLUNG":"YOUR COLLECTION","Speichere Sortennamen und Notizen für deine Tagebucheinträge.":"Save strain names and notes for your diary entries.","Sorten durchsuchen …":"Search strains …",
    "＋ Sorte hinzufügen":"＋ Add strain","Noch keine Sorten":"No strains yet","Füge deine erste Sorte hinzu.":"Add your first strain.",
    "Sorte bearbeiten":"Edit strain","Sorte hinzufügen":"Add strain","Sortenname":"Strain name","Hersteller":"Manufacturer",
    "Kategorie":"Category","z. B. Blüte, Liquid":"e.g. flower, e-liquid","Sorte speichern":"Save strain",
    "Bitte einen Sortennamen eintragen":"Please enter a strain name","Hersteller nicht angegeben":"Manufacturer not specified",
    "DEINE AUSRÜSTUNG":"YOUR EQUIPMENT","Verwalte deine Geräteklassen, Beschreibungen und Fotos.":"Manage your device types, descriptions and photos.",
    "＋ Gerät hinzufügen":"＋ Add device","Noch keine Geräte":"No devices yet","Füge dein erstes Gerät hinzu.":"Add your first device.",
    "Gerät bearbeiten":"Edit device","Gerät hinzufügen":"Add device","Gerätename":"Device name",
    "Beschreibung":"Description","Gerätefoto · wird mit dem Spielstand gespeichert":"Device photo · saved with your game data",
    "Ein neues Foto ersetzt das bisherige.":"A new photo replaces the existing one.","Gerät speichern":"Save device",
    "Bitte Namen eintragen":"Please enter a name","Noch keine Beschreibung":"No description yet","Gerät wird noch verwendet":"Device is still in use",
    "DEINE MOMENTE":"YOUR MOMENTS","My Photo Gallery":"My Photo Gallery",
    "Fotos werden mit dem aktiven Spielstand gespeichert und können Sessions oder Geräten zugeordnet werden.":"Photos are saved with the active game data and can be linked to sessions or devices.",
    "＋ Foto hinzufügen":"＋ Add photo","Deine Galerie ist noch leer":"Your gallery is still empty",
    "Füge Fotos von Geräten oder besonderen Momenten hinzu.":"Add photos of devices or special moments.",
    "Foto hinzufügen":"Add photo","Foto":"Photo","Bezeichnung":"Title","Mein Gerät …":"My device …",
    "Zu Gerät":"Link to device","Zu Tagebucheintrag":"Link to diary entry","Keine Zuordnung":"No link",
    "Foto speichern":"Save photo","Bitte ein Foto auswählen":"Please select a photo","Moment":"Moment","Allgemein":"General",
    "FORTSCHRITT OHNE KONSUMZIELE":"PROGRESS WITHOUT CONSUMPTION GOALS",
    "Quests & Ziele":"Quests & Goals","Quests & Adventure":"Quests & Adventure",
    "Belohnungen gibt es für Dokumentation, Lernen und Gerätepflege.":"Rewards are earned for documenting, learning and device care.",
    "LEVEL":"LEVEL","bis zum nächsten Level":"until next level","Durch Wissen und Pflege":"Through knowledge and care",
    "COINS":"COINS","Deine Lernbelohnungen":"Your learning rewards","WOCHENZIEL":"WEEKLY GOAL",
    "Dokumentationstagebuch · freiwillig":"Diary activity · optional","Deine Quests":"Your quests","Erster Eintrag":"First entry","Ausrüstung im Blick":"Equipment check","Augenblicke festhalten":"Capture moments","Wissen wächst":"Knowledge grows",
    "ABGESCHLOSSEN":"COMPLETED","QUEST":"QUEST","Erster Eintrag":"First entry",
    "Dokumentiere deinen ersten Tagebucheintrag.":"Record your first diary entry.","Füge ein Gerät mit Beschreibung hinzu.":"Add a device with a description.","Ergänze ein Foto in deiner Galerie.":"Add a photo to your gallery.","Bestehe einen Lernkurs.":"Pass a learning course.",
    "Ausrüstung im Blick":"Equipment check","Füge ein Gerät mit Beschreibung hinzu.":"Add a device with a description.",
    "Augenblicke festhalten":"Capture moments","Ergänze ein Foto in deiner Galerie.":"Add a photo to your gallery.",
    "Wissen wächst":"Knowledge grows","Bestehe einen Lernkurs.":"Pass a learning course.",
    "Erledigt ✓":"Completed ✓","Belohnung abholen":"Claim reward","Noch nicht erreicht":"Not reached yet",
    "Du entscheidest, wo gespeichert wird.":"You decide where your data is stored.",
    "Wähle lokalen Speicher oder richte eine clientseitig verschlüsselte Cloud ein.":"Choose local storage or set up a client-side encrypted cloud.",
    "Speicher & Backup →":"Storage & backup →",
     "Speicher & Backup":"Storage & backup",
    "Akkusicherheit":"Battery safety",
    "Reinigung & Pflege":"Cleaning & care",
    "Gerätekunde":"Device knowledge",
    "Lerninhalte sind allgemeine Informationen und ersetzen keine Herstellerhinweise oder medizinische Beratung.":"Learning content provides general information and does not replace manufacturer instructions or medical advice.",
    "LERNEN & WISSEN":"LEARNING & KNOWLEDGE","Kurse zu Bedienung, Sicherheit, Pflege und gesundheitlicher Aufklärung.":"Courses on operation, safety, care and health awareness.",
    "DEIN LERNFORTSCHRITT":"YOUR LEARNING PROGRESS","Kursen bestanden":"courses passed",
    "Grundlagen":"Basics","Einführung":"Introduction","Akkusicherheit":"Battery safety","Reinigung & Pflege":"Cleaning & care","Gerätekunde":"Device knowledge","LEKTIONEN":"LESSONS","Lerne wichtige Grundlagen und beantworte anschließend einen kurzen Wissenstest.":"Learn important basics and then answer a short knowledge quiz.",
    "Bestanden":"Passed","Ergebnis ansehen":"View result","Kurs öffnen":"Open course","Belohnung:":"Reward:",
    "Kurzübersicht":"Overview","Wissenstest":"Knowledge quiz","Prüfung abgeben":"Submit quiz",
    "Noch nicht bestanden":"Not passed yet","Bitte alle Fragen beantworten":"Please answer all questions",
    "DEINE DATEN, DEINE KONTROLLE":"YOUR DATA, YOUR CONTROL","Datensicherung":"Data & backups",
    "Wechsle zwischen lokalem Spielstand und verschlüsselter Cloud. Exportiere zusätzlich ein Backup.":"Switch between local game data and encrypted cloud storage. You can also export a backup.",
    "AKTIV · VERSCHLÜSSELT":"ACTIVE · ENCRYPTED","Cloud-Konto:":"Cloud account:",
    "Spielstände werden vor dem Senden mit AES-GCM verschlüsselt. Dein Kennwort wird nur für die Anmeldung verwendet und bleibt im Arbeitsspeicher dieser Sitzung.":"Game data is encrypted with AES-GCM before being sent. Your password is only used to sign in and remains in this session's memory.",
    "Deine Konto-ID und dein verschlüsselter Cloud-Spielstand bleiben erhalten.":"Your account ID and encrypted cloud save will remain unchanged.",
    "Passwort ändern":"Change password",
    "Ändere dein Anmeldepasswort direkt, ohne den Weg über „Passwort vergessen“ zu nehmen. Dein verschlüsselter Cloud-Spielstand wird dabei mit dem neuen Passwort verknüpft.":"Change your sign-in password directly without using “Forgot password?”. Your encrypted cloud save will be re-linked using the new password.",
    "Bisheriges Passwort":"Current password",
    "Neues Passwort (mindestens 8 Zeichen)":"New password (at least 8 characters)",
    "Neues Passwort wiederholen":"Repeat new password",
    "Zu lokalem Spielstand wechseln":"Switch to local game data","OPTIONAL · AES-GCM":"OPTIONAL · AES-GCM",
    "Verschlüsselte Cloud":"Encrypted cloud","Mit E-Mail-Adresse und Kennwort anmelden. Der Cloud-Spielstand ist vom lokalen Spielstand getrennt. Beim ersten Verbinden kannst du vorhandene lokale Daten verschlüsselt hochladen.":"Sign in with your email address and password. Cloud data is separate from local data. The first time you connect, you can upload your existing local data in encrypted form.",
    "Einmalige Einrichtung erforderlich: Supabase-Projekt konfigurieren. Siehe cloud-setup.md.":"One-time setup required: configure a Supabase project. See cloud-setup.md.",
    "E-Mail-Adresse":"Email address",
    "E-Mail-Adresse (bei älteren Konten: bisheriger Benutzername)":"Email address (existing username for older accounts)","Kennwort · mindestens 8 Zeichen":"Password · at least 8 characters",
    "Anmelden":"Sign in","Registrieren":"Create account","Passwort vergessen?":"Forgot password?",
    "Du erhältst eine E-Mail zur Bestätigung. Jeder Account hat ausschließlich Zugriff auf seinen eigenen Cloud-Spielstand.":"You will receive a confirmation email. Each account can only access its own cloud save.",
    "EMPFOHLEN":"RECOMMENDED","JSON-Backup":"JSON backup",
    "Enthält Tagebuch, Geräte, Sortensammlung, Fotos, Quests und Lernfortschritt. Fotos können die Datei groß machen.":"Includes your diary, devices, strain collection, photos, quests and learning progress. Photos can make the file large.",
    "Backup herunterladen":"Download backup","WIEDERHERSTELLEN":"RESTORE","Backup einspielen":"Restore backup",
    "Ein Backup ersetzt den aktiven Spielstand. Vorher wird eine Sicherheitskopie heruntergeladen.":"A backup replaces the active game data. A safety copy will be downloaded first.",
    "JSON auswählen & einspielen":"Select & restore JSON","TAGEBUCH":"DIARY","CSV exportieren":"Export CSV",
    "CSV importieren":"Import CSV","Aktiver Spielstand":"Active game data",
    "Cloudspeicherung ist aktiv. Deine lokalen Daten bleiben auf diesem Gerät erhalten.":"Cloud storage is active. Your local data remains on this device.",
    "Die Daten liegen nur in diesem Browser, bis du sie in ein verbundenes Cloud-Konto überträgst.":"Data stays in this browser until you transfer it to a connected cloud account.",
    "Einträge":"entries","Fotos":"photos","Speicher fast voll. Exportiere ein Backup und verkleinere Fotos.":"Storage almost full. Export a backup and reduce photo sizes.",
    "Verschlüsselungsschlüssel fehlt":"Encryption key missing","Unbekanntes Cloud-Backup-Format":"Unknown cloud backup format",
    "Cloud ist noch nicht eingerichtet. Folge der Anleitung in cloud-setup.md.":"Cloud is not set up yet. Follow the instructions in cloud-setup.md.",
    "Cloud ist noch nicht eingerichtet.":"Cloud is not set up yet.",
    "Bitte eine gültige E-Mail-Adresse eingeben.":"Please enter a valid email address.",
    "Das Kennwort muss mindestens 8 Zeichen haben.":"The password must be at least 8 characters long.",
    "Einen Moment …":"One moment …","Cloud gespeichert":"Cloud saved","Änderungen werden gespeichert …":"Saving changes …",
    "Cloud-Speicherung fehlgeschlagen":"Cloud save failed","Cloud-Speicherung fehlgeschlagen. Prüfe deine Verbindung und melde dich erneut an.":"Cloud save failed. Check your connection and sign in again.",
    "Registrierung gestartet. Bitte bestätige zuerst den Link in deiner E-Mail.":"Registration started. Please confirm using the link in your email.",
    "Cloud-Spielstand gefunden. OK = Cloud-Spielstand verwenden. Abbrechen = lokalen Spielstand anbieten.":"Cloud save found. OK = use cloud save. Cancel = choose local data.",
    "Soll dein lokaler Spielstand den vorhandenen Cloud-Spielstand ERSETZEN?":"Should your local data REPLACE the existing cloud save?",
    "Das Cloud-Konto ist leer. Deinen lokalen Spielstand jetzt verschlüsselt hochladen?":"This cloud account is empty. Upload your local data in encrypted form now?",
    "Dein persönlicher Wiederherstellungscode lautet:":"Your personal recovery code is:",
    "Bewahre ihn sicher außerhalb dieses Geräts auf. Er wird nur einmal angezeigt und wird benötigt, um dein verschlüsseltes Tagebuch nach einem Passwort-Reset wieder zu öffnen.":"Keep it safe somewhere other than this device. It is shown only once and is required to reopen your encrypted diary after a password reset.",
    "Konto erstellt":"Account created","Erfolgreich angemeldet":"Signed in successfully","Lokal gespeichert":"Saved locally",
    "Cloud-Verbindung fehlgeschlagen":"Cloud connection failed","Bitte zuerst deine E-Mail-Adresse eingeben.":"Please enter your email address first.",
    "Wenn das Konto existiert, wurde eine E-Mail zum Zurücksetzen versendet.":"If the account exists, a password reset email has been sent.",
    "E-Mail konnte nicht versendet werden":"Could not send email","Versand fehlgeschlagen":"Sending failed",
    "Bitte gib deinen Vaping-Adventure-Wiederherstellungscode ein.":"Enter your Vaping Adventure recovery code.",
    "Wiederherstellung abgebrochen.":"Recovery cancelled.","Bitte lege dein neues Passwort fest (mindestens 8 Zeichen).":"Set your new password (at least 8 characters).",
    "Passwort muss mindestens 8 Zeichen haben.":"Password must be at least 8 characters long.",
    "Für dieses Konto ist kein kompatibler Wiederherstellungsschlüssel vorhanden.":"No compatible recovery key is available for this account.",
    "Neues Passwort konnte nicht gespeichert werden.":"Could not save the new password.",
    "Konto konnte nicht bestätigt werden.":"Could not verify the account.",
    "Verschlüsselungsschlüssel konnte nicht aktualisiert werden. Bitte den Support kontaktieren.":"Could not update the encryption key. Please contact support.",
    "Passwort geändert. Bitte melde dich jetzt mit dem neuen Passwort an.":"Password changed. Please sign in with your new password.",
    "Wiederherstellung fehlgeschlagen. Prüfe den Code.":"Recovery failed. Check the code.",
    "Lokaler Spielstand aktiviert":"Local save activated","Gerät wird noch verwendet":"Device is still in use",
    "Bitte Namen eintragen":"Please enter a name","Eintrag löschen?":"Delete entry?",
    "Die Datei ist kein gültiges Backup":"This file is not a valid backup","Dieses Backup ersetzt alle aktuellen lokalen Daten. Fortfahren?":"This backup will replace all current local data. Continue?",
    "Backup wiederhergestellt":"Backup restored","CSV konnte nicht gelesen werden":"Could not read CSV",
    "Neue Einträge übernehmen":"Import new entries","mögliche Duplikate":"possible duplicates","erkannt":"detected","neu":"new",
    "Bitte eine gültige E-Mail-Adresse eingeben.":"Please enter a valid email address.",
    "Wir unterstützen den:":"We support:",
    "Dein Profil":"Your profile","Abmelden":"Sign out","Gastmodus":"Guest mode","Du bist aktuell nicht mit einem Cloud-Konto angemeldet.":"You are not currently signed in to a cloud account.",
    "Verschlüsselte Cloud aktiv":"Encrypted cloud active","Nur auf diesem Gerät gespeichert":"Stored on this device only",
    "Speicher & Backup öffnen →":"Open storage & backup →","Cloud-Konto verbinden →":"Connect cloud account →",
    "Profil von ":"Profile of "," öffnen":" open","Profilmenü öffnen":"Open profile menu","Hilfe-Bibliothek öffnen":"Open help library",
    "Hier findest du deine Geräte, Fotosammlung, Lerninhalte und Einstellungen.":"Here you can find your devices, photo gallery, learning content and settings.",
    "Dein persönlicher Vaping-Adventure-Wiederherstellungscode lautet:":"Your personal Vaping Adventure recovery code is:",
    "Bewahre ihn sicher und getrennt von deinem Gerät auf. Er wird nur einmal angezeigt. Ohne diesen Code kann ein Passwort-Reset den verschlüsselten Spielstand nicht wiederherstellen.":"Keep it safe and separate from your device. It is shown only once. Without this code, a password reset cannot restore your encrypted save.",
    "Registrierung fehlgeschlagen":"Registration failed","Bitte E-Mail-Adresse oder bisherigen Benutzernamen eingeben.":"Please enter your email address or previous username.",
    "Registrierung angelegt. Bitte bestätige zuerst den Link in deiner E-Mail und melde dich danach mit deiner E-Mail-Adresse an.":"Registration created. Please confirm the link in your email, then sign in with your email address.",
    "Lokalen Spielstand hochladen":"Upload local save",
    "Ersetzt den bisherigen Cloud-Spielstand mit den Daten dieses Browsers.":"Replaces the existing cloud save with the data from this browser.",
    "Cloud-Spielstand laden":"Load cloud save",
    "Sorten":"strains",
    "Spielstand auswählen":"Choose save data","Auswahl übernehmen":"Confirm selection",
    "Wirklich den lokalen Spielstand hochladen und den bisherigen Cloud-Spielstand ersetzen?":"Are you sure you want to upload the local save and replace the existing cloud save?",
    "Cloud-Übertragung fehlgeschlagen":"Cloud transfer failed","Upload fehlgeschlagen. Deine lokalen Daten bleiben erhalten.":"Upload failed. Your local data will be kept.",
    "Die Cloud-Migration ist fehlgeschlagen. Deine lokalen Daten bleiben erhalten.":"Cloud migration failed. Your local data will be kept.",
    "Lokaler Spielstand sicher in die Cloud übertragen":"Local save securely transferred to the cloud",
    "Wiederherstellungs-E-Mail konnte nicht gesendet werden.":"Recovery email could not be sent.",
    "E-Mail-Versand fehlgeschlagen":"Email delivery failed","Bitte zuerst anmelden.":"Please sign in first.",
    "Bestätigungslink wurde angefordert. Bitte prüfe dein E-Mail-Postfach und bestätige die neue Adresse.":"Confirmation link requested. Please check your inbox and confirm the new address.",
    "E-Mail-Adresse konnte nicht geändert werden.":"Could not change email address.","Cloud wird gesichert …":"Saving cloud data …",
    "Alle Geräte":"All devices","Alle Kategorien":"All categories","Älteste zuerst":"Oldest first","Löschen":"Delete",
    "Gerät auswählen (optional)":"Select device (optional)","Aus Sammlung wählen oder neu eingeben":"Choose from collection or enter a new one",
    "Geschmack · 1–5":"Taste · 1–5","Keine Angabe":"Not specified",
    "THC: keine Angabe":"THC: not specified","CBD: keine Angabe":"CBD: not specified",
    "Angaben optional; Werte laut Verpackung, Laboranalyse oder Hersteller.":"Details are optional; use values from the packaging, lab analysis or manufacturer.",
    "THC und CBD müssen zwischen 0 und 100 % liegen":"THC and CBD must be between 0 and 100%.",
    "Foto löschen":"Delete photo","Foto-Großansicht":"Photo enlarged view","Großansicht schließen":"Close enlarged view","Nächstes Bild":"Next image",
    "Beschädigte Akkus nicht weiterverwenden.":"Do not continue using damaged batteries.",
    "Lose Lithium-Ionen-Akkus gegen Kurzschluss schützen.":"Protect loose lithium-ion batteries against short circuits.",
    "Nur passende Ladegeräte nach Herstellerangaben nutzen.":"Only use suitable chargers according to the manufacturer's instructions.",
    "Akkus trocken und geschützt lagern.":"Store batteries in a dry, protected place.",
    "Was machst du mit einem beschädigten Akku?":"What should you do with a damaged battery?",
    "Weiterverwenden":"Continue using it","Nicht weiterverwenden":"Stop using it","Mit Klebeband reparieren":"Repair it with tape",
    "Wie transportierst du lose Akkus?":"How should you transport loose batteries?",
    "Ungeschützt":"Unprotected","Mit Schlüsseln zusammen":"Together with keys","In einer geeigneten Schutzhülle":"In a suitable protective case",
    "Welches Ladegerät nutzt du?":"Which charger should you use?","Geeignet nach Herstellerangaben":"A suitable one according to the manufacturer's instructions",
    "Irgendein Netzteil":"Any power adapter","Beschädigtes Kabel":"Damaged cable",
    "Gerät vor der Reinigung ausschalten und abkühlen lassen.":"Switch off the device and let it cool down before cleaning.",
    "Anweisungen des Herstellers beachten.":"Follow the manufacturer's instructions.",
    "Keine Flüssigkeit in Elektronik oder Akkuöffnungen bringen.":"Keep liquids away from electronics and battery openings.",
    "Wann reinigst du ein Gerät?":"When should you clean a device?","Eingeschaltet":"While switched on",
    "Ausgeschaltet und abgekühlt":"Switched off and cooled down","Während des Ladens":"While charging",
    "Was vermeidest du?":"What should you avoid?","Herstellerhinweise":"Manufacturer instructions","Flüssigkeit in Elektronik":"Liquid in electronics","Abkühlen lassen":"Letting it cool down",
    "Lies Bedienungsanleitung und Warnhinweise.":"Read the user manual and safety warnings.",
    "Prüfe Gerät und Zubehör regelmäßig.":"Check the device and accessories regularly.",
    "Nutze nur kompatible Teile.":"Use compatible parts only.",
    "Wo findest du passende Nutzungshinweise?":"Where can you find the correct usage instructions?",
    "Bedienungsanleitung":"User manual","Beliebige Werbung":"Random advertising","Nirgends":"Nowhere",
    "Sorte":"Strain","Bitte gib deinen persönlichen Vaping-Adventure-Wiederherstellungscode ein.":"Please enter your personal Vaping Adventure recovery code.",
    "Bitte lege dein neues Login-Passwort fest (mindestens 8 Zeichen).":"Please set your new login password (at least 8 characters).",
    "Bitte gib das neue Login-Passwort zur Bestätigung erneut ein.":"Please enter your new login password again to confirm it.",
    "Die Passwörter stimmen nicht überein. Bitte starte die Wiederherstellung erneut.":"The passwords do not match. Please restart the recovery process.",
    "Wiederherstellungs-Sitzung konnte nicht bestätigt werden.":"Could not verify the recovery session.",
    "Cloud-Spielstand konnte nicht gelesen werden.":"Could not read cloud save data.",
    "Für diesen Cloud-Spielstand ist kein Wiederherstellungscode eingerichtet. Ein älteres Backup (Format 1) kann damit nicht wiederhergestellt werden.":"No recovery code is configured for this cloud save. An older backup (format 1) cannot be restored with it.",
    "Der Wiederherstellungscode ist ungültig oder passt nicht zu diesem Cloud-Spielstand.":"The recovery code is invalid or does not match this cloud save.",
    "Der neue Verschlüsselungsschlüssel konnte nicht gespeichert werden. Bitte melde dich beim Support.":"The new encryption key could not be saved. Please contact support.",
    "Das Login-Passwort wurde geändert, aber der Cloud-Schlüssel noch nicht aktualisiert. Fordere einen neuen Wiederherstellungslink an und verwende denselben Code.":"The login password was changed, but the cloud key has not yet been updated. Request a new recovery link and use the same code.",
    "Wiederherstellung fehlgeschlagen. Prüfe den Code und versuche es erneut.":"Recovery failed. Check the code and try again.",
    "Wir unterstützen den:":"We support:",
    "Vaporizer":"Vaporizer","E-Zigarette":"E-cigarette","Tabakerhitzer":"Tobacco heater",
    "Keine Sorte angegeben":"No strain specified","Noch keine Beschreibung":"No description yet",
    "Aus Sammlung wählen oder neu eingeben":"Choose from collection or enter a new one",
    "Optional":"Optional","Session":"Session","Puffs":"Puffs","Züge":"draws","min":"min",
    "In deinem Cloud-Konto ist bereits ein Spielstand gespeichert. Entscheide, welche Daten künftig auf allen Geräten verwendet werden sollen.":"A save already exists in your cloud account. Choose which data should be used on all your devices from now on.",
    "Ersetzt den aktuell angezeigten lokalen Spielstand auf diesem Gerät.":"Replaces the local save currently displayed on this device.",
    "Dein JSON-Backup bleibt davon unberührt. Wähle bewusst aus, welcher Spielstand maßgeblich sein soll.":"Your JSON backup will not be affected. Carefully choose which save should be the primary one.",
    "Deine Geräte verwalten und Fotos ergänzen":"Manage your devices and add photos",
    "Dein nächster Schritt":"Your next step",
    "E-Mail-Adresse hinterlegen / ändern":"Add or change email address",
    "Bestätigungslink anfordern":"Request confirmation link",
    "Bei älteren Konten bitte zuerst mit dem bisherigen Benutzernamen anmelden. Die E-Mail-Änderung behält dieselbe Konto-ID und damit deinen Cloud-Spielstand.":"For older accounts, please sign in with your existing username first. Changing the email address keeps the same account ID and your cloud save.",
    "E-Mail-Adresse (bei alten Konten zunächst bisheriger Benutzername)":"Email address (existing username first for older accounts)",
    "Bisheriges Cloud-Verschlüsselungskennwort (nur falls abweichend)":"Previous cloud encryption password (only if different)",
    "Dein Benutzername bleibt als Profilname erhalten. Nach der Umstellung meldest du dich mit deiner E-Mail-Adresse an. Bestehende Cloud-Spielstände bleiben beim E-Mail-Wechsel am selben Konto.":"Your username will remain as your profile name. After the change, you will sign in with your email address. Existing cloud saves remain linked to the same account when you change your email.",
    "Exportiere deine Tagebucheinträge oder importiere eine CSV mit Vorschau und Duplikaterkennung.":"Export your diary entries or import a CSV with a preview and duplicate detection.",
    "CLOUD-SPIELSTAND AKTIV":"CLOUD SAVE ACTIVE",
    "LOKALER SPIELSTAND AKTIV":"LOCAL SAVE ACTIVE",
    "Das verwendete Tagebuch":"The active diary",
    "Du arbeitest gerade mit dem verschlüsselten Cloud-Spielstand von ":"You are currently using the encrypted cloud save for ",
    "deinem Konto":"your account",
    ". Änderungen werden mit der Cloud synchronisiert. Dein lokaler Spielstand auf diesem Gerät bleibt getrennt und unverändert.":". Changes are synchronized with the cloud. Your local save on this device remains separate and unchanged.",
    "Du arbeitest gerade mit dem lokalen Spielstand dieses Geräts. Diese Daten werden nicht automatisch mit deinem Cloud-Konto synchronisiert.":"You are currently using this device’s local save. This data is not automatically synchronized with your cloud account.",
    "Tagebucheinträge":"diary entries",
    "📱 LOKALER SPIELSTAND AKTIV":"📱 LOCAL SAVE ACTIVE",
    "☁️ CLOUD-SPIELSTAND AKTIV":"☁️ CLOUD SAVE ACTIVE",
    "Tagebucheinträge · ":"diary entries · ",
    "Öffnen →":"Open →",

    "Hilfe":"Help",
    "Hilfe-Bibliothek":"Help library",
    "Hilfe durchsuchen …":"Search help …",
    "Willkommen bei My Vaping Adventure. Hier findest du kurze Erklärungen zu allen Bereichen und Funktionen.":"Welcome to My Vaping Adventure. Here you will find short explanations of all sections and features.",
    "Erste Schritte":"Getting started",
    "Auf der Übersicht findest du deine wichtigsten Zahlen und die zuletzt erfassten Sessions. Über die Navigation wechselst du zwischen den Bereichen.":"The overview shows your key statistics and most recently recorded sessions. Use the navigation to move between sections.",
    "Vaping Diary – Tagebuch":"Vaping Diary",
    "Mit „Neuer Eintrag“ dokumentierst du Datum, Uhrzeit, Gerät, Sorte, Züge, Temperatur, Ort und Notizen. Vorhandene Einträge kannst du bearbeiten oder löschen. Die Suche und Filter helfen beim Wiederfinden.":"Use “New entry” to record the date, time, device, strain, draws, temperature, location and notes. You can edit or delete existing entries. Search and filters help you find them again.",
    "Strain Collection – Sorten":"Strain Collection",
    "Lege Sorten in deiner Sammlung an und ergänze ihre Angaben. THC- und CBD-Werte kannst du als Prozentangaben eintragen, sofern du verlässliche Produktinformationen hast.":"Add strains to your collection and enter their details. You can enter THC and CBD values as percentages if you have reliable product information.",
    "Verwalte deine Vaporizer, E-Zigaretten und Tabakerhitzer. Du kannst Geräte ergänzen, bearbeiten und mit Fotos dokumentieren. Bilder werden innerhalb der Geräte-Karten passend dargestellt.":"Manage your vaporizers, e-cigarettes and tobacco heaters. You can add and edit devices and document them with photos. Images are displayed within the device cards.",
    "Photo Gallery – Fotos":"Photo Gallery",
    "Füge Bilder hinzu, um besondere Geräte, Setups oder Momente festzuhalten. Achte darauf, regelmäßig ein Backup zu erstellen, wenn du viele Fotos speicherst.":"Add images to capture special devices, setups or moments. Remember to create backups regularly if you store many photos.",
    "Quests & Ziele":"Quests & Goals",
    "Quests belohnen deinen Fortschritt mit Erfahrungspunkten und Coins. Erledigte Aufgaben und dein Level werden mit deinem Spielstand gespeichert.":"Quests reward your progress with experience points and coins. Completed tasks and your level are saved with your game data.",
    "Education – Lernbereich":"Education – Learning area",
    "Hier findest du Lerninhalte und Kurse, zum Beispiel zu Gerätekunde, Reinigung und Akkusicherheit. Dein Lernfortschritt gehört zu deinem Spielstand.":"Here you will find learning content and courses, for example on device knowledge, cleaning and battery safety. Your learning progress is part of your saved game data.",
    "Lokal speichern":"Local storage",
    "Im lokalen Modus liegen deine Daten im Browser auf genau diesem Gerät. Sie werden nicht automatisch auf andere Geräte übertragen. Browserdaten löschen oder ein Gerätewechsel kann lokale Daten entfernen.":"In local mode, your data is stored in the browser on this device only. It is not automatically transferred to other devices. Clearing browser data or changing devices may remove local data.",
    "Verschlüsselte Cloud":"Encrypted cloud",
    "Du kannst dich mit deinem Konto anmelden und deinen Spielstand geräteübergreifend synchronisieren. Die Daten werden vor dem Hochladen im Browser verschlüsselt. Bewahre dein Verschlüsselungskennwort sicher auf.":"You can sign in to your account and synchronize your saved game data across devices. The data is encrypted in your browser before uploading. Keep your encryption password safe.",
    "Backup & Wiederherstellung":"Backup & recovery",
    "Unter „Speicher & Backup“ kannst du ein vollständiges JSON-Backup herunterladen und später wieder einspielen. Einspielen ersetzt den aktiven Spielstand; erstelle deshalb vorher eine Sicherung. CSV eignet sich für den Export und Import von Tagebucheinträgen.":"Under “Storage & backup”, you can download a complete JSON backup and restore it later. Restoring replaces the active save, so create a backup first. CSV is suitable for exporting and importing diary entries.",
    "Cloud-Spielstand auf das Gerät übernehmen":"Transfer cloud save to this device",
    "Wenn du deinen Cloud-Spielstand dauerhaft in den lokalen Speicher dieses Geräts übernehmen möchtest: 1. Melde dich mit deinem Cloud-Konto an. 2. Öffne „Speicher & Backup“ und klicke bei „JSON-Backup“ auf „Backup herunterladen“. Damit sicherst du den gerade aktiven Cloud-Spielstand als Datei. 3. Wechsle anschließend über „Zu lokalem Spielstand wechseln“ beziehungsweise melde dich ab. 4. Im lokalen Modus öffnest du wieder „Speicher & Backup“, wählst unter „Backup einspielen“ die zuvor heruntergeladene JSON-Datei aus und klickst auf „JSON auswählen & einspielen“. Dadurch wird der lokale Spielstand durch den Cloud-Spielstand aus der Datei ersetzt. Wichtig: Nicht den lokalen Spielstand in die Cloud hochladen, wenn du die Cloud-Daten übernehmen möchtest. Bewahre die Backup-Datei sicher auf.":"If you want to permanently transfer your cloud save to this device’s local storage: 1. Sign in to your cloud account. 2. Open “Storage & backup” and click “Download backup” under “JSON backup”. This saves the currently active cloud data as a file. 3. Then switch to local storage using “Switch to local save” or sign out. 4. In local mode, open “Storage & backup” again, select the JSON file you downloaded under “Restore backup”, and click “Select & restore JSON”. This replaces the local save with the cloud save from the file. Important: Do not upload the local save to the cloud if you want to transfer cloud data. Keep the backup file safe.",
    "Konto und Anmeldung":"Account and sign-in",
    "Für die Cloud kannst du ein Konto mit E-Mail-Adresse und Passwort erstellen. Bestätige deine E-Mail-Adresse. Über die Passwort-zurücksetzen-Funktion kannst du einen Wiederherstellungslink anfordern.":"For cloud storage, you can create an account with an email address and password. Confirm your email address. You can request a recovery link using the password reset function.",
    "Sprache einstellen":"Change language",
    "Oben rechts findest du den Sprachschalter mit einer kleinen Flagge. Tippe auf „English“, um die Oberfläche auf Englisch umzustellen, oder auf „Deutsch“, um zurückzuwechseln. Deine Auswahl wird automatisch in diesem Browser gespeichert und beim nächsten Besuch wieder verwendet. Die Spracheinstellung ändert nur die Anzeigesprache – deine Tagebucheinträge, Notizen und persönlichen Inhalte bleiben unverändert. Wenn einzelne Bereiche nach dem Wechsel noch in der alten Sprache angezeigt werden, lade die Seite einmal neu.":"At the top right, you will find the language switch with a small flag. Tap “English” to change the interface to English, or “Deutsch” to switch back. Your choice is saved automatically in this browser and will be used on your next visit. The language setting changes only the display language — your diary entries, notes and personal content remain unchanged. If individual sections still appear in the previous language after switching, reload the page once.",
    "Hilfe auf dem iPhone":"Help on iPhone",
    "Die Seite passt sich auch kleinen Bildschirmen an. Unten findest du die mobile Navigation; unter „Mehr“ liegen weitere Bereiche wie Geräte, Fotos, Education und Backups.":"The page also adapts to small screens. You will find mobile navigation at the bottom; under “More” are additional sections such as Devices, Photos, Education and Backups."

  };
  const reverse = Object.fromEntries(Object.entries(pairs).map(([de,en])=>[en,de]));
  let language = localStorage.getItem("mva_language") || "de";
  const textOriginal = new WeakMap();
  const textRendered = new WeakMap();
  const attrOriginal = new WeakMap();
  const attrRendered = new WeakMap();
  const excluded = "[data-i18n-switch],[data-user-content],input,textarea,select,[contenteditable=true],.item-content,.photo";
  const keys = Object.keys(pairs).sort((a,b)=>b.length-a.length);
  const reverseKeys = Object.keys(reverse).sort((a,b)=>b.length-a.length);

  function translateText(value, targetLanguage) {
    const dictionary = targetLanguage === "en" ? pairs : reverse;
    const ordered = targetLanguage === "en" ? keys : reverseKeys;
    let output = value;
    for (const source of ordered) {
      if (output.includes(source)) output = output.split(source).join(dictionary[source]);
    }
    return output;
  }

  function translateTextNode(node) {
    if (!node.parentElement || node.parentElement.closest(excluded)) return;
    const current = node.nodeValue;
    let original = textOriginal.get(node);
    const rendered = textRendered.get(node);

    // If the app itself changed this node since our last pass, treat the
    // new value as the canonical source (normally German).
    if (original === undefined || (rendered !== undefined && current !== rendered)) {
      original = current;
      textOriginal.set(node, original);
    }
    const next = translateText(original, language);
    if (current !== next) node.nodeValue = next;
    textRendered.set(node, next);
  }

  function translateAttribute(element, name) {
    const current = element.getAttribute(name);
    if (current === null) return;
    let originals = attrOriginal.get(element);
    let rendereds = attrRendered.get(element);
    if (!originals) { originals = new Map(); attrOriginal.set(element, originals); }
    if (!rendereds) { rendereds = new Map(); attrRendered.set(element, rendereds); }
    let original = originals.get(name);
    const rendered = rendereds.get(name);
    if (original === undefined || (rendered !== undefined && current !== rendered)) {
      original = current;
      originals.set(name, original);
    }
    const next = translateText(original, language);
    if (current !== next) element.setAttribute(name, next);
    rendereds.set(name, next);
  }

  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    for (const attr of ["placeholder","title","aria-label"]) translateAttribute(node, attr);
    if (node.matches(excluded)) return;
    node.childNodes.forEach(translateNode);
  }

  function updateSwitch() {
    const button = document.querySelector("[data-i18n-switch]");
    if (!button) return;
    const flag = language === "de"
      ? '<svg class="language-flag" viewBox="0 0 60 40" role="img" aria-label="United Kingdom"><rect width="60" height="40" fill="#012169"/><path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="9"/><path d="M0 0 60 40M60 0 0 40" stroke="#c8102e" stroke-width="4"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="13"/><path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="7"/></svg>'
      : '<svg class="language-flag" viewBox="0 0 60 40" role="img" aria-label="Deutschland"><rect width="60" height="13.333" fill="#000"/><rect y="13.333" width="60" height="13.334" fill="#dd0000"/><rect y="26.667" width="60" height="13.333" fill="#ffce00"/></svg>';
    button.innerHTML = flag + (language === "de" ? '<span>English</span>' : '<span>Deutsch</span>');
    button.setAttribute("aria-label", language === "de" ? "Switch to English" : "Zu Deutsch wechseln");
  }

  function apply() {
    document.documentElement.lang = language;
    updateSwitch();
    document.body.childNodes.forEach(translateNode);
    document.querySelectorAll(".sidebar-note,.sidebar .nav-label,.sidebar .nav").forEach(translateNode);
  }

  function addSwitch() {
    const right = document.querySelector(".topright");
    if (!right) return;
    let button = document.querySelector("[data-i18n-switch]");
    if (!button) {
      button = document.createElement("button");
      button.className = "language-switch";
      button.type = "button";
      button.setAttribute("data-i18n-switch","");
      right.insertBefore(button, right.firstChild);
    }
    // Always attach the handler: the switch already exists in index.html.
    button.addEventListener("click", () => {
      language = language === "de" ? "en" : "de";
      localStorage.setItem("mva_language", language);
      apply();
    });
    updateSwitch();
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "characterData") {
        translateTextNode(record.target);
      } else if (record.type === "attributes") {
        if (!record.target.closest?.(excluded)) translateAttribute(record.target, record.attributeName);
      } else {
        record.addedNodes?.forEach(translateNode);
      }
    }
  });

  function init() {
    addSwitch();
    apply();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder","title","aria-label"]
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }

  window.MVA_I18N = {
    getLanguage: () => language,
    setLanguage(value) {
      language = value === "en" ? "en" : "de";
      localStorage.setItem("mva_language", language);
      apply();
    }
  };
})();