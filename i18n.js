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
    "Schließen":"Close","Abbrechen":"Cancel","Speichern":"Save","Gerät auswählen (optional)":"Select device (optional)",
    "Eintrag bearbeiten":"Edit entry","Neue Session":"New session","Datum":"Date","Uhrzeit":"Time",
    "Geräteklasse":"Device type","Gerät":"Device","Sorte / Material":"Strain / material",
    "Puffs / Züge · optional":"Puffs / draws · optional","Dauer · Minuten":"Duration · minutes",
    "Temperatur · °C":"Temperature · °C","Ort":"Location","Geschmack · 1–5":"Taste · 1–5",
    "Keine Angabe":"Not specified","Notizen":"Notes",
    "Neue Sorte automatisch in meiner Sammlung speichern":"Automatically save new strain to my collection",
    "Änderungen speichern":"Save changes","Eintrag speichern":"Save entry","Bitte alle Fragen beantworten":"Please answer all questions",
    "Eintrag gespeichert":"Entry saved","DEINE SAMMLUNG":"YOUR COLLECTION","Sorten durchsuchen …":"Search strains …",
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
    "Belohnungen gibt es für Dokumentation, Lernen und Gerätepflege.":"Rewards are earned for documenting, learning and device care.",
    "LEVEL":"LEVEL","bis zum nächsten Level":"until next level","Durch Wissen und Pflege":"Through knowledge and care",
    "COINS":"COINS","Deine Lernbelohnungen":"Your learning rewards","WOCHENZIEL":"WEEKLY GOAL",
    "Dokumentationstagebuch · freiwillig":"Diary activity · optional","Deine Quests":"Your quests",
    "ABGESCHLOSSEN":"COMPLETED","QUEST":"QUEST","Erster Eintrag":"First entry",
    "Dokumentiere deinen ersten Tagebucheintrag.":"Record your first diary entry.",
    "Ausrüstung im Blick":"Equipment check","Füge ein Gerät mit Beschreibung hinzu.":"Add a device with a description.",
    "Augenblicke festhalten":"Capture moments","Ergänze ein Foto in deiner Galerie.":"Add a photo to your gallery.",
    "Wissen wächst":"Knowledge grows","Bestehe einen Lernkurs.":"Pass a learning course.",
    "Erledigt ✓":"Completed ✓","Belohnung abholen":"Claim reward","Noch nicht erreicht":"Not reached yet",
    "LERNEN & WISSEN":"LEARNING & KNOWLEDGE","Kurse zu Bedienung, Sicherheit, Pflege und gesundheitlicher Aufklärung.":"Courses on operation, safety, care and health awareness.",
    "DEIN LERNFORTSCHRITT":"YOUR LEARNING PROGRESS","Kursen bestanden":"courses passed",
    "Grundlagen":"Basics","Einführung":"Introduction","LEKTIONEN":"LESSONS","Lerne wichtige Grundlagen und beantworte anschließend einen kurzen Wissenstest.":"Learn important basics and then answer a short knowledge quiz.",
    "Bestanden":"Passed","Ergebnis ansehen":"View result","Kurs öffnen":"Open course","Belohnung:":"Reward:",
    "Kurzübersicht":"Overview","Wissenstest":"Knowledge quiz","Prüfung abgeben":"Submit quiz",
    "Noch nicht bestanden":"Not passed yet","Bitte alle Fragen beantworten":"Please answer all questions",
    "DEINE DATEN, DEINE KONTROLLE":"YOUR DATA, YOUR CONTROL","Datensicherung":"Data & backups",
    "Wechsle zwischen lokalem Spielstand und verschlüsselter Cloud. Exportiere zusätzlich ein Backup.":"Switch between local game data and encrypted cloud storage. You can also export a backup.",
    "AKTIV · VERSCHLÜSSELT":"ACTIVE · ENCRYPTED","Cloud-Konto:":"Cloud account:",
    "Spielstände werden vor dem Senden mit AES-GCM verschlüsselt. Dein Kennwort wird nur für die Anmeldung verwendet und bleibt im Arbeitsspeicher dieser Sitzung.":"Game data is encrypted with AES-GCM before being sent. Your password is only used to sign in and remains in this session's memory.",
    "Zu lokalem Spielstand wechseln":"Switch to local game data","OPTIONAL · AES-GCM":"OPTIONAL · AES-GCM",
    "Verschlüsselte Cloud":"Encrypted cloud","Mit E-Mail-Adresse und Kennwort anmelden. Der Cloud-Spielstand ist vom lokalen Spielstand getrennt. Beim ersten Verbinden kannst du vorhandene lokale Daten verschlüsselt hochladen.":"Sign in with your email address and password. Cloud data is separate from local data. The first time you connect, you can upload your existing local data in encrypted form.",
    "Einmalige Einrichtung erforderlich: Supabase-Projekt konfigurieren. Siehe cloud-setup.md.":"One-time setup required: configure a Supabase project. See cloud-setup.md.",
    "E-Mail-Adresse":"Email address","Kennwort · mindestens 8 Zeichen":"Password · at least 8 characters",
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
    "Vaporizer":"Vaporizer","E-Zigarette":"E-cigarette","Tabakerhitzer":"Tobacco heater",
    "Keine Sorte angegeben":"No strain specified","Noch keine Beschreibung":"No description yet",
    "Aus Sammlung wählen oder neu eingeben":"Choose from collection or enter a new one",
    "Optional":"Optional","Session":"Session","Puffs":"Puffs","Züge":"draws","min":"min"
  };
  const reverse = Object.fromEntries(Object.entries(pairs).map(([de,en])=>[en,de]));
  let language = localStorage.getItem("mva_language") || "de";
  const dictionary = () => language === "en" ? pairs : reverse;
  const sortedKeys = () => Object.keys(dictionary()).sort((a,b)=>b.length-a.length);
  function translateText(value) {
    let out = value;
    for (const source of sortedKeys()) {
      if (out.includes(source)) out = out.split(source).join(dictionary()[source]);
    }
    return out;
  }
  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement?.closest("[data-i18n-switch],[data-user-content],input,textarea,select,[contenteditable=true],.item-content,.photo,.tagline,.card:has(.photo) h3,.card:has(.photo) .row b,.card:has(.tagline) h3,.card:has(.tagline) .pill,.card:has(.tagline) > .subheading")) return;
      const next = translateText(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.matches("[data-i18n-switch],[data-user-content],input,textarea,select,[contenteditable=true],.item-content,.photo,.tagline")) return;
      for (const attr of ["placeholder","title","aria-label"]) {
        const value = node.getAttribute(attr);
        if (value) {
          const next = translateText(value);
          if (next !== value) node.setAttribute(attr,next);
        }
      }
      node.childNodes.forEach(translateNode);
    }
  }
  function apply() {
    document.documentElement.lang = language;
    const button = document.querySelector("[data-i18n-switch]");
    if (button) {
      button.textContent = language === "de" ? "🇬🇧 English" : "🇩🇪 Deutsch";
      button.setAttribute("aria-label", language === "de" ? "Switch to English" : "Zu Deutsch wechseln");
    }
    document.body.childNodes.forEach(translateNode);
  }
  function addSwitch() {
    const right = document.querySelector(".topright");
    if (!right || document.querySelector("[data-i18n-switch]")) return;
    const button = document.createElement("button");
    button.className = "language-switch";
    button.type = "button";
    button.setAttribute("data-i18n-switch","");
    button.addEventListener("click", () => {
      language = language === "de" ? "en" : "de";
      localStorage.setItem("mva_language",language);
      apply();
    });
    right.insertBefore(button,right.firstChild);
    apply();
  }
  const observer = new MutationObserver(records => {
    if (records.some(r => r.target?.closest?.("[data-i18n-switch]"))) return;
    if (language === "en") {
      records.forEach(r => r.addedNodes?.forEach(translateNode));
    }
  });
  document.addEventListener("DOMContentLoaded",() => {
    addSwitch();
    apply();
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  });
  window.MVA_I18N = {getLanguage:()=>language,setLanguage(value){language=value==="en"?"en":"de";localStorage.setItem("mva_language",language);apply();}};
})();