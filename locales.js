"use strict";
/*
 * My Vaping Adventure – zentrale, schlüsselbasierte Übersetzungen.
 * Neue UI-Texte werden mit data-i18n-key oder MVA_LOCALES.t() übersetzt.
 * Die bisherige Ersetzung deutscher Textfragmente bleibt während der
 * schrittweisen Migration als Rückwärtskompatibilität aktiv.
 */
(() => {
  const dictionaries = {
    de: {
      "brand.tagline": "ADVENTURE · DEIN PRIVATES TAGEBUCH",
      "nav.section.personal": "DEIN BEREICH",
      "nav.overview": "Übersicht",
      "nav.diary": "Vaping Diary",
      "nav.strains": "Strain Collection",
      "nav.devices": "Geräte",
      "nav.gallery": "Photo Gallery",
      "nav.guestbook": "Gästebuch",
      "nav.section.adventure": "ADVENTURE",
      "nav.quests": "Quests & Ziele",
      "nav.education": "Education",
      "storage.local.badge": "Nur auf diesem Gerät",
      "storage.sidebar.title": "Du entscheidest, wo gespeichert wird.",
      "storage.sidebar.description": "Wähle lokalen Speicher oder richte eine clientseitig verschlüsselte Cloud ein.",
      "storage.sidebar.link": "Speicher & Backup →",
      "mobile.home": "Home",
      "mobile.diary": "Tagebuch",
      "mobile.strains": "Sorten",
      "mobile.quests": "Quests",
      "mobile.more": "Mehr",
      "theme.button": "🎨 Design",
      "help.button": "Hilfe",
      "page.diary.eyebrow": "DEINE AUFZEICHNUNGEN",
      "page.diary.title": "Vaping Diary",
      "page.diary.description.local": "Deine Sessions und Eindrücke, lokal auf diesem Gerät gespeichert.",
      "page.diary.description.cloud": "Deine Sessions und Eindrücke im verschlüsselten Cloud-Spielstand.",
      "action.newEntry": "＋ Neuer Eintrag",
      "diary.search": "Suche in Einträgen …",
      "diary.allDevices": "Alle Geräte",
      "diary.allCategories": "Alle Kategorien",
      "diary.newest": "Neueste zuerst",
      "diary.oldest": "Älteste zuerst",
      "action.edit": "Bearbeiten",
      "action.delete": "Löschen",
      "diary.noResults": "Keine Einträge gefunden",
      "diary.noResultsHint": "Passe deine Suche an oder dokumentiere eine neue Session.",
      "page.strains.eyebrow": "DEINE SAMMLUNG",
      "page.strains.title": "My Strain Collection",
      "page.strains.description": "Speichere Sortennamen und Notizen für deine Tagebucheinträge.",
      "action.addStrain": "＋ Sorte hinzufügen",
      "strains.search": "Sorten durchsuchen …",
      "page.devices.eyebrow": "DEINE AUSRÜSTUNG",
      "page.devices.title": "Geräte",
      "page.devices.description": "Verwalte deine Geräteklassen, Beschreibungen und Fotos.",
      "action.addDevice": "＋ Gerät hinzufügen",
      "devices.none": "Noch keine Geräte",
      "devices.noneHint": "Füge dein erstes Gerät hinzu.",
      "devices.noDescription": "Noch keine Beschreibung",
      "page.gallery.eyebrow": "DEINE MOMENTE",
      "page.gallery.title": "My Photo Gallery",
      "page.gallery.description": "Fotos werden mit dem aktiven Spielstand gespeichert und können Sessions oder Geräten zugeordnet werden.",
      "action.addPhoto": "＋ Foto hinzufügen",
      "gallery.openPhoto": "Foto {number} groß anzeigen",
      "gallery.deletePhoto": "Foto löschen",
      "gallery.empty": "Deine Galerie ist noch leer",
      "gallery.emptyHint": "Füge Fotos von Geräten oder besonderen Momenten hinzu.",
      "gallery.moment": "Moment",
      "gallery.general": "Allgemein",
      "page.quests.eyebrow": "FORTSCHRITT OHNE KONSUMZIELE",
      "page.quests.title": "Quests & Adventure",
      "page.quests.description": "Belohnungen gibt es für Dokumentation, Lernen und Gerätepflege.",
      "quests.level": "LEVEL",
      "quests.xp": "XP",
      "quests.coins": "COINS",
      "quests.weekGoal": "WOCHENZIEL",
      "quests.nextLevel": "{xp}/100 XP bis zum nächsten Level",
      "quests.documentation": "Dokumentationstagebuch · freiwillig",
      "quests.title": "Deine Quests",
      "quests.completed": "ABGESCHLOSSEN",
      "quests.quest": "QUEST",
      "quests.done": "Erledigt ✓",
      "quests.claim": "Belohnung abholen",
      "quests.notReached": "Noch nicht erreicht",
      "page.learn.eyebrow": "LERNEN & WISSEN",
      "page.learn.title": "Education",
      "page.learn.description": "Kurse zu Bedienung, Sicherheit, Pflege und gesundheitlicher Aufklärung.",
      "learn.progress": "DEIN LERNFORTSCHRITT",
      "learn.passed": "{done} von {total} Kursen bestanden",
      "learn.lessons": "LEKTIONEN",
      "learn.learnBasics": "Lerne wichtige Grundlagen und beantworte anschließend einen kurzen Wissenstest.",
      "learn.passedLabel": "Bestanden · {score}%",
      "learn.reward": "Belohnung: {xp} XP · {coins} Coins",
      "learn.viewResult": "Ergebnis ansehen",
      "learn.openCourse": "Kurs öffnen",
      "learn.disclaimer": "Lerninhalte sind allgemeine Informationen und ersetzen keine Herstellerhinweise oder medizinische Beratung."
    },
    en: {
      "brand.tagline": "ADVENTURE · YOUR PRIVATE DIARY",
      "nav.section.personal": "YOUR SPACE",
      "nav.overview": "Overview",
      "nav.diary": "Vaping Diary",
      "nav.strains": "Strain Collection",
      "nav.devices": "Devices",
      "nav.gallery": "Photo Gallery",
      "nav.guestbook": "Guestbook",
      "nav.section.adventure": "ADVENTURE",
      "nav.quests": "Quests & Goals",
      "nav.education": "Education",
      "storage.local.badge": "This device only",
      "storage.sidebar.title": "You decide where your data is stored.",
      "storage.sidebar.description": "Choose local storage or set up an end-to-end encrypted cloud.",
      "storage.sidebar.link": "Storage & Backup →",
      "mobile.home": "Home",
      "mobile.diary": "Diary",
      "mobile.strains": "Strains",
      "mobile.quests": "Quests",
      "mobile.more": "More",
      "theme.button": "🎨 Design",
      "help.button": "Help",
      "page.diary.eyebrow": "YOUR RECORDS",
      "page.diary.title": "Vaping Diary",
      "page.diary.description.local": "Your sessions and impressions, saved locally on this device.",
      "page.diary.description.cloud": "Your sessions and impressions in your encrypted cloud save.",
      "action.newEntry": "＋ New entry",
      "diary.search": "Search entries …",
      "diary.allDevices": "All devices",
      "diary.allCategories": "All categories",
      "diary.newest": "Newest first",
      "diary.oldest": "Oldest first",
      "action.edit": "Edit",
      "action.delete": "Delete",
      "diary.noResults": "No entries found",
      "diary.noResultsHint": "Adjust your search or document a new session.",
      "page.strains.eyebrow": "YOUR COLLECTION",
      "page.strains.title": "Strain Collection",
      "page.strains.description": "Save strain names and notes for your diary entries.",
      "action.addStrain": "＋ Add strain",
      "strains.search": "Search strains …",
      "page.devices.eyebrow": "YOUR GEAR",
      "page.devices.title": "Devices",
      "page.devices.description": "Manage your devices, descriptions and photos.",
      "action.addDevice": "＋ Add device",
      "devices.none": "No devices yet",
      "devices.noneHint": "Add your first device.",
      "devices.noDescription": "No description yet",
      "page.gallery.eyebrow": "YOUR MOMENTS",
      "page.gallery.title": "My Photo Gallery",
      "page.gallery.description": "Photos are saved with your active save and can be linked to sessions or devices.",
      "action.addPhoto": "＋ Add photo",
      "gallery.openPhoto": "View photo {number} large",
      "gallery.deletePhoto": "Delete photo",
      "gallery.empty": "Your gallery is still empty",
      "gallery.emptyHint": "Add photos of devices or special moments.",
      "gallery.moment": "Moment",
      "gallery.general": "General",
      "page.quests.eyebrow": "PROGRESS WITHOUT CONSUMPTION GOALS",
      "page.quests.title": "Quests & Adventure",
      "page.quests.description": "Earn rewards for documenting, learning and caring for your devices.",
      "quests.level": "LEVEL",
      "quests.xp": "XP",
      "quests.coins": "COINS",
      "quests.weekGoal": "WEEKLY GOAL",
      "quests.nextLevel": "{xp}/100 XP to the next level",
      "quests.documentation": "Diary documentation · optional",
      "quests.title": "Your quests",
      "quests.completed": "COMPLETED",
      "quests.quest": "QUEST",
      "quests.done": "Completed ✓",
      "quests.claim": "Claim reward",
      "quests.notReached": "Not reached yet",
      "page.learn.eyebrow": "LEARNING & KNOWLEDGE",
      "page.learn.title": "Education",
      "page.learn.description": "Courses about operation, safety, care and health awareness.",
      "learn.progress": "YOUR LEARNING PROGRESS",
      "learn.passed": "{done} of {total} courses passed",
      "learn.lessons": "LESSONS",
      "learn.learnBasics": "Learn important basics and then answer a short knowledge quiz.",
      "learn.passedLabel": "Passed · {score}%",
      "learn.reward": "Reward: {xp} XP · {coins} Coins",
      "learn.viewResult": "View result",
      "learn.openCourse": "Open course",
      "learn.disclaimer": "Learning content is general information and does not replace manufacturer instructions or medical advice."
    },
    fr: {
      "brand.tagline": "ADVENTURE · VOTRE JOURNAL PRIVÉ",
      "nav.section.personal": "VOTRE ESPACE",
      "nav.overview": "Vue d’ensemble",
      "nav.diary": "Journal de vapotage",
      "nav.strains": "Collection de variétés",
      "nav.devices": "Appareils",
      "nav.gallery": "Galerie photo",
      "nav.guestbook": "Livre d’or",
      "nav.section.adventure": "AVENTURE",
      "nav.quests": "Missions et objectifs",
      "nav.education": "Apprentissage",
      "storage.local.badge": "Sur cet appareil uniquement",
      "storage.sidebar.title": "Vous choisissez où vos données sont enregistrées.",
      "storage.sidebar.description": "Choisissez le stockage local ou configurez un cloud chiffré côté client.",
      "storage.sidebar.link": "Stockage et sauvegarde →",
      "mobile.home": "Accueil",
      "mobile.diary": "Journal",
      "mobile.strains": "Variétés",
      "mobile.quests": "Missions",
      "mobile.more": "Plus",
      "theme.button": "🎨 Thème",
      "help.button": "Aide",
      "page.diary.eyebrow": "VOS NOTES",
      "page.diary.title": "Journal de vapotage",
      "page.diary.description.local": "Vos sessions et impressions, enregistrées localement sur cet appareil.",
      "page.diary.description.cloud": "Vos sessions et impressions dans votre sauvegarde cloud chiffrée.",
      "action.newEntry": "＋ Nouvelle entrée",
      "diary.search": "Rechercher dans les entrées …",
      "diary.allDevices": "Tous les appareils",
      "diary.allCategories": "Toutes les catégories",
      "diary.newest": "Les plus récentes d’abord",
      "diary.oldest": "Les plus anciennes d’abord",
      "action.edit": "Modifier",
      "action.delete": "Supprimer",
      "diary.noResults": "Aucune entrée trouvée",
      "diary.noResultsHint": "Modifiez votre recherche ou consignez une nouvelle session.",
      "page.strains.eyebrow": "VOTRE COLLECTION",
      "page.strains.title": "Collection de variétés",
      "page.strains.description": "Enregistrez les noms des variétés et vos notes dans votre journal.",
      "action.addStrain": "＋ Ajouter une variété",
      "strains.search": "Rechercher des variétés …",
      "page.devices.eyebrow": "VOTRE ÉQUIPEMENT",
      "page.devices.title": "Appareils",
      "page.devices.description": "Gérez vos appareils, leurs descriptions et leurs photos.",
      "action.addDevice": "＋ Ajouter un appareil",
      "devices.none": "Aucun appareil pour le moment",
      "devices.noneHint": "Ajoutez votre premier appareil.",
      "devices.noDescription": "Aucune description pour le moment",
      "page.gallery.eyebrow": "VOS MOMENTS",
      "page.gallery.title": "Ma galerie photo",
      "page.gallery.description": "Les photos sont enregistrées avec les données actives et peuvent être associées à des sessions ou à des appareils.",
      "action.addPhoto": "＋ Ajouter une photo",
      "gallery.openPhoto": "Afficher la photo {number} en grand",
      "gallery.deletePhoto": "Supprimer la photo",
      "gallery.empty": "Votre galerie est encore vide",
      "gallery.emptyHint": "Ajoutez des photos de vos appareils ou de moments particuliers.",
      "gallery.moment": "Moment",
      "gallery.general": "Général",
      "page.quests.eyebrow": "PROGRESSION SANS OBJECTIF DE CONSOMMATION",
      "page.quests.title": "Missions et aventure",
      "page.quests.description": "Gagnez des récompenses en documentant, en apprenant et en prenant soin de vos appareils.",
      "quests.level": "NIVEAU",
      "quests.xp": "XP",
      "quests.coins": "PIÈCES",
      "quests.weekGoal": "OBJECTIF HEBDOMADAIRE",
      "quests.nextLevel": "{xp}/100 XP avant le niveau suivant",
      "quests.documentation": "Journal de documentation · facultatif",
      "quests.title": "Vos missions",
      "quests.completed": "TERMINÉ",
      "quests.quest": "MISSION",
      "quests.done": "Terminé ✓",
      "quests.claim": "Récupérer la récompense",
      "quests.notReached": "Pas encore atteint",
      "page.learn.eyebrow": "APPRENTISSAGE ET CONNAISSANCES",
      "page.learn.title": "Apprentissage",
      "page.learn.description": "Cours sur l’utilisation, la sécurité, l’entretien et l’information sur la santé.",
      "learn.progress": "VOTRE PROGRESSION",
      "learn.passed": "{done} cours validés sur {total}",
      "learn.lessons": "LEÇONS",
      "learn.learnBasics": "Découvrez les notions essentielles, puis répondez à un court questionnaire.",
      "learn.passedLabel": "Réussi · {score} %",
      "learn.reward": "Récompense : {xp} XP · {coins} pièces",
      "learn.viewResult": "Voir le résultat",
      "learn.openCourse": "Ouvrir le cours",
      "learn.disclaimer": "Ces contenus sont des informations générales et ne remplacent ni les consignes du fabricant ni un avis médical."
    }
  };
  let language = "de";
  const getLanguage = () => language;
  const t = (key, params = {}) => {
    const template = dictionaries[language]?.[key] ?? dictionaries.de[key] ?? key;
    return String(template).replace(/\{(\w+)\}/g, (_, name) =>
      Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : `{${name}}`);
  };
  const apply = (root = document) => {
    const elements = [];
    if (root.nodeType === 1 && root.hasAttribute("data-i18n-key")) elements.push(root);
    root.querySelectorAll?.("[data-i18n-key]").forEach(el => elements.push(el));
    for (const el of elements) {
      const key = el.getAttribute("data-i18n-key");
      if (key && dictionaries.de[key]) el.textContent = t(key);
    }
    const attrs = ["placeholder", "title", "aria-label"];
    const attrElements = [];
    if (root.nodeType === 1 && root.hasAttribute("data-i18n-attr")) attrElements.push(root);
    root.querySelectorAll?.("[data-i18n-attr]").forEach(el => attrElements.push(el));
    for (const el of attrElements) {
      for (const pair of (el.getAttribute("data-i18n-attr") || "").split(",")) {
        const [attr, key] = pair.split(":").map(s => s.trim());
        if (attrs.includes(attr) && key && dictionaries.de[key]) el.setAttribute(attr, t(key));
      }
    }
  };
  const setLanguage = value => {
    language = ["de", "en", "fr"].includes(value) ? value : "de";
    apply(document);
    return language;
  };
  const audit = () => {
    const keys = Object.keys(dictionaries.de);
    return Object.fromEntries(["en", "fr"].map(lang => [
      lang, { total: keys.length, missing: keys.filter(key => !dictionaries[lang][key]) }
    ]));
  };
  window.MVA_LOCALES = Object.freeze({ t, apply, setLanguage, getLanguage, audit });
  document.addEventListener("DOMContentLoaded", () => apply(document), { once: true });
  const observer = new MutationObserver(records => {
    for (const record of records) record.addedNodes?.forEach(node => {
      if (node.nodeType === 1) apply(node);
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
