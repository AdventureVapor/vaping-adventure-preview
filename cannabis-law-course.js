"use strict";
(() => {
  const original = window.MVA_ACADEMY_COURSES?.getCourses;
  if (!original) return;
  const titles = [
    "LEGAL – ABER KEIN NORMALES FACHGESCHÄFT",
    "DREI PFLANZEN – ABER KEIN FREIER GEMEINSAMER VORRAT",
    "„KANN ICH MEINEM PARTNER 2 GRAMM GEBEN?“",
    "50 GRAMM ZU HAUSE – 25 GRAMM UNTERWEGS",
    "„ICH BAUE FÜR MICH AN – ABER WAS, WENN DIE ERNTE ZU GROSS AUSFÄLLT?“",
    "„KANNST DU MIR MEIN CANNABIS MITBRINGEN?“",
    "KEIN CANNABIS-LIEFERSERVICE",
    "NUR EIN ANBAUVEREIN",
    "KEIN „CANNABIS-CLUB FÜR EIN WOCHENENDE“",
    "ANBAUVEREINIGUNG ≠ CANNABIS-SHOP",
    "25 GRAMM PRO TAG – 50 GRAMM PRO MONAT",
    "LEGAL BEKOMMEN – ABER NICHT EINFACH WEITERGEBEN",
    "„WO DARF ICH ÜBERHAUPT DAMPFEN?“",
    "LEGALER EIGENANBAU – ABER MIT SICHERUNGSPFLICHT",
    "„ICH BRAUCHE MEIN MEDIZINISCHES CANNABIS JETZT.“",
    "SÄULE 2 – REGULIERTE FACHGESCHÄFTE?",
    "DER SCHWARZMARKT SOLL ZURÜCKGEDRÄNGT WERDEN – ABER WO IST DAS LEGALE ANGEBOT?",
    "PROHIBITION – HAT VERBOTSPOLITIK IHR ZIEL ERREICHT?"
  ];
  const questions = [
    ["Was bedeutet die Teillegalisierung für den Verkauf in normalen Fachgeschäften?", ["Ein freier Cannabis-Einzelhandel ist allgemein erlaubt", "Ein normales Cannabis-Fachgeschäft gehört nicht zum derzeitigen allgemeinen Modell", "Jeder Supermarkt darf Cannabis verkaufen"], 1],
    ["Wie viele Cannabispflanzen dürfen Erwachsene nach der Ausstellung gleichzeitig privat zum Eigenkonsum anbauen?", ["Bis zu drei", "Bis zu fünf", "Unbegrenzt"], 0],
    ["Darf Cannabis aus dem privaten Eigenanbau an den Partner oder die Partnerin weitergegeben werden?", ["Ja, wenn beide volljährig sind", "Ja, wenn sie zusammenwohnen", "Nein, die Weitergabe an andere Personen ist nicht erlaubt"], 2],
    ["Welche Besitzgrenzen nennt die Ausstellung?", ["25 g zu Hause und 50 g unterwegs", "50 g zu Hause und 25 g unterwegs", "50 g an jedem Ort"], 1],
    ["Was gilt im Beispiel bei einer Ernte von 70 Gramm?", ["Die Besitzgrenze zu Hause bleibt grundsätzlich 50 Gramm; die übrige Menge darf nicht einfach verschenkt werden", "Die gesamte Ernte darf automatisch behalten werden", "Der Überschuss darf an Freunde verteilt werden"], 0],
    ["Darf eine erwachsene Person eigenes privat angebautes Cannabis für eine andere Person mitbringen?", ["Ja, wenn die andere Person es vergessen hat", "Nein, privater Eigenanbau erlaubt keine beliebige Weitergabe", "Ja, bis zu zwei Gramm"], 1],
    ["Dürfen Anbauvereinigungen Cannabis einfach per Paket oder Kurier an Mitglieder liefern?", ["Ja, wie ein gewöhnlicher Online-Shop", "Nur bei Bestellungen über eine App", "Nein, ein Versand- oder Lieferservice ist nicht vorgesehen"], 2],
    ["Wie viele Anbauvereinigungen darf eine Person grundsätzlich als Mitglied nutzen?", ["Eine", "Zwei", "Beliebig viele"], 0],
    ["Welche Mindestdauer der Mitgliedschaft nennt die Ausstellung für eingetragene Vereine?", ["Ein Wochenende", "Drei Monate", "Eine Woche"], 1],
    ["Was unterscheidet eine Anbauvereinigung von einem Cannabis-Shop?", ["Sie ist ein frei zugängliches Geschäft für Laufkundschaft", "Dort kann jede erwachsene Person spontan einkaufen", "Sie gibt Cannabis unter gesetzlichen Voraussetzungen an ihre Mitglieder ab"], 2],
    ["Welche Abgabemengen nennt die Ausstellung für Mitglieder ab 21 Jahren?", ["25 g pro Tag und 50 g pro Monat", "50 g pro Tag und 25 g pro Monat", "25 g pro Woche und 100 g pro Monat"], 0],
    ["Darf ein Mitglied Cannabis aus einer Anbauvereinigung einfach einem anderen Mitglied überlassen?", ["Ja, wenn beide im selben Verein sind", "Nein, die erhaltene Menge darf nicht einfach weitergegeben werden", "Ja, wenn es nur ein Gramm ist"], 1],
    ["Wovon hängt ab, ob Cannabiskonsum an einem öffentlichen Ort verboten ist?", ["Nur davon, ob ein Vaporizer verwendet wird", "Nur von der Tageszeit", "Unter anderem von Ort, Uhrzeit und der Anwesenheit Minderjähriger"], 2],
    ["Wozu verpflichtet die Sicherungspflicht beim privaten Eigenanbau?", ["Cannabis und Vermehrungsmaterial vor dem Zugriff Dritter, besonders von Kindern und Jugendlichen, zu schützen", "Pflanzen öffentlich zugänglich aufzustellen", "Den Anbau nicht kennzeichnen zu müssen"], 0],
    ["Wie erfolgt die reguläre Abgabe von medizinischem Cannabis laut Ausstellung?", ["Durch private Weitergabe", "Auf ärztliche Verschreibung über eine Apotheke", "Über eine Anbauvereinigung"], 1],
    ["Was ist mit der ursprünglich geplanten zweiten Säule gemeint?", ["Private Pflanzen pro Haushalt", "Regionale Modellprojekte mit lizenzierten Verkaufsstellen und kontrollierten Lieferketten", "Ein Versandhandel ohne Auflagen"], 1],
    ["Welche legalen Bezugswege unterscheidet die Ausstellung im derzeitigen Modell?", ["Nur den freien Einzelhandel", "Nur den Schwarzmarkt", "Privaten Eigenanbau, Anbauvereinigungen und den gesonderten medizinischen Versorgungsweg"], 2],
    ["Welche Zahl nennt die Ausstellung für den geschätzten weltweiten Cannabiskonsum im Jahr 2024?", ["331 Millionen", "256 Millionen", "50 Millionen"], 1]
  ];
  const course = {
    id: "cannabis-teillegalisierung",
    title: "Das Kleingedruckte der Cannabis-Teillegalisierung",
    level: "Rechtswissen",
    description: "Ein 18-teiliger Kurs auf Grundlage der Ausstellung von Patrick Dornfeld. Alle 18 Originaltafeln sind vollständig und im Wortlaut eingebunden – mit anschließender Wissensprüfung.",
    xp: 60, coins: 40,
    bannerLabel: "CANNABISRECHT · 18 ORIGINALTAFELN",
    bannerTitle: "Das Kleingedruckte der Cannabis-Teillegalisierung",
    bannerSubtitle: "18 Stationen · Originaltexte · Wissenstest",
    quizIntro: "Der Abschlusstest umfasst 18 Fragen zu den 18 Originaltafeln. Pro Frage ist eine Antwort richtig. Bestanden ist der Test ab 80 % richtigen Antworten (mindestens 15 von 18).",
    lessons: titles.map((title, i) => "Tafel " + String(i + 1).padStart(2, "0") + " – " + title),
    richLessons: titles.map((title, i) => ({
      title: "Tafel " + String(i + 1).padStart(2, "0") + " – " + title,
      html: '<details class="cang-original-panel" name="cang-original-panel"><summary>Originaltafel ' + String(i + 1).padStart(2, "0") + ' öffnen</summary><iframe src="websitecang/Tafel' + (i + 1) + '.html" title="Originaltafel ' + (i + 1) + ': ' + title.replace(/&/g, "&amp;").replace(/"/g, "&quot;") + '" loading="lazy"></iframe></details>'
    })),
    questions,
    disclaimer: "Die 18 Tafeln werden inhaltlich unverändert aus der Originalausstellung übernommen. Ergänzt wurden nur die Einbindung in Education und der Wissenstest. Die Ausstellung nennt den Rechtsstand 03.10.2026. Gesetze und Verwaltungspraxis können sich ändern; für aktuelle Einzelfragen bitte die geltenden amtlichen Vorschriften prüfen. Allgemeine Information, keine Rechtsberatung."
  };
  const previous = original();
  window.MVA_ACADEMY_COURSES.getCourses = function () {
    const courses = previous();
    if (!courses.some(item => item.id === course.id)) courses.push({ ...course });
    return courses;
  };
})();