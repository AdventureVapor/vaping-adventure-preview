"use strict";
(() => {
  const button = document.getElementById("open-help");
  const root = document.getElementById("modal-root");
  if (!button || !root) return;

  const topics = [
    ["Erste Schritte", "Auf der Übersicht findest du deine wichtigsten Zahlen und die zuletzt erfassten Sessions. Über die Navigation wechselst du zwischen den Bereichen."],
    ["Vaping Diary – Tagebuch", "Mit „Neuer Eintrag“ dokumentierst du Datum, Uhrzeit, Gerät, Sorte, Züge, Temperatur, Ort und Notizen. Vorhandene Einträge kannst du bearbeiten oder löschen. Die Suche und Filter helfen beim Wiederfinden."],
    ["Strain Collection – Sorten", "Lege Sorten in deiner Sammlung an und ergänze ihre Angaben. THC- und CBD-Werte kannst du als Prozentangaben eintragen, sofern du verlässliche Produktinformationen hast."],
    ["Geräte", "Verwalte deine Vaporizer, E-Zigaretten und Tabakerhitzer. Du kannst Geräte ergänzen, bearbeiten und mit Fotos dokumentieren. Bilder werden innerhalb der Geräte-Karten passend dargestellt."],
    ["Photo Gallery – Fotos", "Füge Bilder hinzu, um besondere Geräte, Setups oder Momente festzuhalten. Achte darauf, regelmäßig ein Backup zu erstellen, wenn du viele Fotos speicherst."],
    ["Quests & Ziele", "Quests belohnen deinen Fortschritt mit Erfahrungspunkten und Coins. Erledigte Aufgaben und dein Level werden mit deinem Spielstand gespeichert."],
    ["Education – Lernbereich", "Hier findest du Lerninhalte und Kurse, zum Beispiel zu Gerätekunde, Reinigung und Akkusicherheit. Dein Lernfortschritt gehört zu deinem Spielstand."],
    ["Lokal speichern", "Im lokalen Modus liegen deine Daten im Browser auf genau diesem Gerät. Sie werden nicht automatisch auf andere Geräte übertragen. Browserdaten löschen oder ein Gerätewechsel kann lokale Daten entfernen."],
    ["Verschlüsselte Cloud", "Du kannst dich mit deiner E-Mail-Adresse und deinem Kennwort anmelden und deinen Spielstand geräteübergreifend synchronisieren. Die Daten werden vor dem Hochladen im Browser verschlüsselt. Bei einem neuen Cloud-Spielstand erhältst du einmalig einen 48-stelligen Wiederherstellungscode. Bewahre ihn sicher und getrennt von deinem Gerät auf. Bei älteren Cloud-Spielständen wird der Code beim nächsten Anmelden und der bewussten Auswahl des Spielstands eingerichtet."],
    ["Backup & Wiederherstellung", "Unter „Speicher & Backup“ kannst du ein vollständiges JSON-Backup herunterladen und später wieder einspielen. Einspielen ersetzt den aktiven Spielstand; erstelle deshalb vorher eine Sicherung. CSV eignet sich für den Export und Import von Tagebucheinträgen."],
    ["Cloud-Spielstand auf das Gerät übernehmen", "Wenn du deinen Cloud-Spielstand dauerhaft in den lokalen Speicher dieses Geräts übernehmen möchtest: 1. Melde dich mit deinem Cloud-Konto an. 2. Öffne „Speicher & Backup“ und klicke bei „JSON-Backup“ auf „Backup herunterladen“. Damit sicherst du den gerade aktiven Cloud-Spielstand als Datei. 3. Wechsle anschließend über „Zu lokalem Spielstand wechseln“ beziehungsweise melde dich ab. 4. Im lokalen Modus öffnest du wieder „Speicher & Backup“, wählst unter „Backup einspielen“ die zuvor heruntergeladene JSON-Datei aus und klickst auf „JSON auswählen & einspielen“. Dadurch wird der lokale Spielstand durch den Cloud-Spielstand aus der Datei ersetzt. Wichtig: Nicht den lokalen Spielstand in die Cloud hochladen, wenn du die Cloud-Daten übernehmen möchtest. Bewahre die Backup-Datei sicher auf."],
    ["Konto und Anmeldung", "Für die Cloud kannst du ein Konto mit E-Mail-Adresse und Passwort erstellen. Bestätige deine E-Mail-Adresse. Über die Passwort-zurücksetzen-Funktion erhältst du einen Wiederherstellungslink. Für die Wiederherstellung des verschlüsselten Spielstands benötigst du zusätzlich deinen persönlichen Wiederherstellungscode. Beim Zurücksetzen legst du dein neues Passwort zweimal fest."],
    ["Hilfe auf dem iPhone", "Die Seite passt sich auch kleinen Bildschirmen an. Unten findest du die mobile Navigation; unter „Mehr“ liegen weitere Bereiche wie Geräte, Fotos, Education und Backups."]
  ];

  function openHelp() {
    root.innerHTML = `<div class="modal-backdrop" id="help-backdrop"><section class="modal help-library" role="dialog" aria-modal="true" aria-labelledby="help-title"><div class="row"><h2 id="help-title">Hilfe-Bibliothek</h2><button class="btn small" type="button" id="close-help">Schließen</button></div><p class="help-intro">Willkommen bei My Vaping Adventure. Hier findest du kurze Erklärungen zu allen Bereichen und Funktionen.</p><input class="field help-search" id="help-search" type="search" placeholder="Hilfe durchsuchen …" aria-label="Hilfe durchsuchen"><div class="help-list" id="help-list">${topics.map(([title, description]) => `<article class="help-topic" data-search="${(title + " " + description).toLowerCase()}"><h3>${title}</h3><p>${description}</p></article>`).join("")}</div><div class="modal-foot"><button class="btn primary" type="button" id="help-done">Fertig</button></div></section></div>`;
    const close = () => { root.innerHTML = ""; button.focus(); };
    root.querySelector("#close-help").addEventListener("click", close);
    root.querySelector("#help-done").addEventListener("click", close);
    root.querySelector("#help-backdrop").addEventListener("click", event => { if (event.target.id === "help-backdrop") close(); });
    root.querySelector("#help-search").addEventListener("input", event => {
      const query = event.target.value.trim().toLowerCase();
      root.querySelectorAll(".help-topic").forEach(topic => { topic.hidden = !topic.dataset.search.includes(query); });
    });
    root.querySelector("#help-search").focus();
  }

  button.addEventListener("click", openHelp);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && root.querySelector("#help-backdrop")) {
      const close = root.querySelector("#close-help");
      if (close) close.click();
    }
  });
})();