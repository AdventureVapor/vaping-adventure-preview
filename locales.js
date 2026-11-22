"use strict";
/*
 * My Vaping Adventure – zentrale, schlüsselbasierte Übersetzungen.
 * Neue UI-Texte werden künftig mit data-i18n-key oder MVA_LOCALES.t()
 * übersetzt. Die bisherige Ersetzung deutscher Textfragmente bleibt
 * während der schrittweisen Migration als Rückwärtskompatibilität aktiv.
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
      "help.button": "Hilfe"
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
      "help.button": "Help"
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
      "help.button": "Aide"
    }
  };

  let language = "de";
  const getLanguage = () => language;
  const t = (key, params = {}) => {
    const template = dictionaries[language]?.[key] ?? dictionaries.de[key] ?? key;
    return String(template).replace(/\\{(\\w+)\\}/g, (_, name) =>
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