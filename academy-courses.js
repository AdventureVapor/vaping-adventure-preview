"use strict";
(() => {
  const lang = () => window.MVA_LOCALES?.getLanguage?.() || window.MVA_I18N?.getLanguage?.() || "de";
  const data = {
    de: [
      {"id":"ecig-structure","title":"Aufbau einer E-Zigarette","level":"Grundlagen","description":"Lerne Aufbau, Bauteile, Funktionsweise, verschiedene Systeme und wichtige Sicherheitsgrundlagen von E-Zigaretten kennen.","lessons":["Eine E-Zigarette ist ein elektrisch betriebenes Gerät, das Liquid erhitzt und dabei ein inhalierbares Aerosol erzeugt. Je nach Bauart besteht sie aus Energiequelle, Elektronik, Tank oder Pod, Verdampferkopf und Mundstück. Bei geschlossenen Systemen sind einzelne Teile nicht für den Austausch durch Nutzer vorgesehen.","Der Akku liefert elektrische Energie. Die Elektronik steuert – abhängig vom Gerät – die Energiezufuhr zum Heizelement und kann Schutzfunktionen wie Kurzschluss-, Überhitzungs- oder Überlastungsschutz enthalten. Sensoren können die Aktivierung per Zug erkennen. Schutzfunktionen ersetzen keine sorgfältige Nutzung.","Liquid gelangt aus Tank oder Pod zum Dochtmaterial im Verdampferkopf. Das Heizelement erwärmt das benetzte Material; dabei entsteht ein Aerosol, das mit dem Luftstrom durch Luftkanäle und Mundstück geführt wird. Das Aerosol ist kein harmloser Wasserdampf und kann gesundheitsschädliche Stoffe enthalten.","Es gibt Einweggeräte, nachfüllbare Pod-Systeme und Geräte mit separatem Akkuträger und Tank. Pods können einen fest integrierten oder wechselbaren Verdampfer enthalten. Bauweise, Bedienung und Wartungsmöglichkeiten unterscheiden sich. Nicht jedes Zubehör oder Ersatzteil ist mit jedem Gerät kompatibel.","Fertigcoil-Verdampfer verwenden vorgefertigte Verdampferköpfe. Selbstwickelverdampfer wie RTA, RDA oder RDTA besitzen eine dafür vorgesehene Basis, die technisch anders aufgebaut ist. Mesh bezeichnet ein Heizelement aus Metallgewebe. Airflow bezeichnet die Luftzufuhr. Arbeiten an Heizwendeln und elektrischen Bauteilen erfordern Fachkenntnis und sind nicht Gegenstand dieses Kurses.","E-Liquids enthalten typischerweise Propylenglykol (PG), Glycerin (VG), Aromastoffe und gegebenenfalls Nikotin. PG und VG sind Trägerstoffe; ihr Verhältnis beschreibt die Zusammensetzung, aber keine gesundheitliche Unbedenklichkeit. Volt (V) bezeichnet elektrische Spannung, Watt (W) elektrische Leistung, Ohm (Ω) den Widerstand und mAh eine Angabe zur Akkukapazität.","Beachte stets Bedienungsanleitung und Sicherheitshinweise des Herstellers. Beschädigte oder ungewöhnlich heiße Akkus und Geräte nicht weiterverwenden. Nur geeignete Ladegeräte und kompatible Teile verwenden. Geräte vor extremer Hitze und Feuchtigkeit schützen. Liquids nicht verschlucken und kindersicher lagern. E-Zigaretten sind nicht risikofrei; Nikotin kann abhängig machen."],"questions":[["Was erzeugt eine E-Zigarette?",["Harmlosen Wasserdampf","Ein Aerosol durch Erhitzen von Liquid","Tabakrauch durch Verbrennung"],1],["Welche Bauteile gehören je nach Bauart zum Gerät?",["Nur Tank und Mundstück","Nur Akku und Display","Akku, Elektronik, Tank/Pod, Verdampferkopf und Mundstück"],2],["Welche Aufgabe hat die Elektronik?",["Sie stellt das Aroma her","Sie steuert die Energiezufuhr und kann Schutzfunktionen übernehmen","Sie ersetzt den Akku"],1],["Welche Aufgabe hat das Dochtmaterial?",["Es lädt den Akku","Es filtert alle Schadstoffe","Es transportiert Liquid zum Heizelement"],2],["Was unterscheidet ein Pod-System von einem klassischen Mod-Tank-System?",["Ein Pod-System nutzt eine Pod-/Kartuscheneinheit","Ein Pod-System benötigt keinen Strom","Ein Pod-System enthält immer Tabak"],0],["Wofür steht Mesh?",["Ein spezieller Akkutyp","Ein Heizelement aus Metallgewebe","Ein Liquidbestandteil"],1],["Was bedeutet Airflow?",["Akkukapazität","Liquidstärke","Luftzufuhr beziehungsweise Luftstrom"],2],["Wofür steht die Einheit Watt?",["Elektrischer Widerstand","Elektrische Leistung","Akkukapazität"],1],["Welche Aussage zu PG/VG ist richtig?",["Das Verhältnis beschreibt die Trägerstoffzusammensetzung","Es garantiert gesundheitliche Unbedenklichkeit","Es bezeichnet die Akkuspannung"],0],["Was ist bei einem beschädigten oder ungewöhnlich heißen Akku richtig?",["Weiterverwenden, solange das Gerät funktioniert","Mit einem beliebigen Ladegerät testen","Nutzung beenden und Herstellerhinweise beachten"],2]],"disclaimer":"Allgemeine technische Information, keine Konsumempfehlung. Geräte unterscheiden sich; maßgeblich sind die Anleitung und Sicherheitshinweise des Herstellers. E-Zigaretten sind nicht risikofrei. Nikotin kann abhängig machen."},
      {id:"liquid-calculator",title:"Liquid selber mischen – der Rechenkurs",level:"Grundlagen",description:"Übe Volumen-, Prozent- und Mischungsverhältnis-Rechnungen mit neutralen Beispielen – ohne Anleitung zum Umgang mit konzentriertem Nikotin.",lessons:[
        "Prozent bedeutet „von hundert“. Für einen Anteil gilt: Gesamtmenge × Prozentzahl ÷ 100. Beispiel: 20 % von 50 ml sind 10 ml. Rechne Einheiten immer einheitlich.",
        "Bei einer Mischung addieren sich die Teilmengen zum Gesamtvolumen. Beispiel mit Wasser und farbiger Übungsflüssigkeit: 30 ml + 20 ml ergeben 50 ml. Der Anteil einer Komponente ist ihre Menge geteilt durch die Gesamtmenge, mal 100.",
        "PG/VG-Angaben beschreiben ein Verhältnis der Trägerstoffe, nicht eine Qualitäts- oder Sicherheitsgarantie. Dieses Lernmodul behandelt nur Mathematik mit ungefährlichen Übungswerten. Keine hochkonzentrierten Stoffe verwenden oder umfüllen; unbekannte Mischungen nicht nutzen."
      ],questions:[
        ["Wie viel sind 10 % von 80 ml?",["4 ml","8 ml","18 ml"],1],
        ["30 ml und 20 ml ergeben zusammen …",["40 ml","50 ml","60 ml"],1],
        ["Wie berechnest du den Prozentanteil?",["Teilmenge ÷ Gesamtmenge × 100","Gesamtmenge × 100","Teilmenge + 100"],0],
        ["Wofür steht ein PG/VG-Verhältnis?",["Für die Farbe","Für das Verhältnis zweier Trägerstoffe","Für die Akkuspannung"],1],
        ["Was ist die Sicherheitsgrenze dieses Kurses?",["Konzentriertes Nikotin praktisch mischen","Nur harmlose Rechenbeispiele verwenden","Unbekannte Flüssigkeiten probieren"],1]
      ],disclaimer:"Rechenunterricht mit neutralen Beispielen, keine Mischanleitung und keine Dosierungsberatung. Keine hochkonzentrierten Nikotinprodukte handhaben. Liquids kindersicher und gemäß Kennzeichnung lagern."},
      {id:"tobacco-heater-structure",title:"Aufbau und Funktion eines Tabakerhitzers",level:"Grundlagen",description:"Verstehe Heizeinheit, Tabakstick, Luftführung und die Unterschiede zu Zigarette und E-Zigarette.",lessons:[
        "Ein Tabakerhitzer besteht typischerweise aus Akku, Steuerung, Heizeinheit und einer Aufnahme für speziell vorgesehene Tabaksticks. Aufbau und Heiztechnik unterscheiden sich je nach Modell.",
        "Die Steuerung regelt den Heizvorgang. Tabak wird erhitzt statt wie in einer klassischen Zigarette verbrannt. Dabei entsteht ein Aerosol, das Nikotin und weitere gesundheitsschädliche Stoffe enthalten kann.",
        "Ein Tabakerhitzer nutzt echten Tabak in dafür vorgesehenen Sticks. Eine E-Zigarette erhitzt dagegen Liquid; ein Kräuterverdampfer erhitzt getrocknetes Pflanzenmaterial. Keines dieser Produkte ist risikofrei."
      ],questions:[
        ["Was wird in einem Tabakerhitzer verwendet?",["Beliebiges E-Liquid","Dafür vorgesehene Tabaksticks","Lose Akkuzellen"],1],
        ["Was geschieht mit dem Tabak?",["Er wird erhitzt","Er wird vollständig zu Asche verbrannt","Er wird durch Wasser gefiltert"],0],
        ["Welche Komponente steuert den Heizvorgang?",["Das Mundstück allein","Die Elektronik/Steuerung","Der Tabakstick"],1],
        ["Was unterscheidet ihn von einer E-Zigarette?",["Er nutzt Tabaksticks statt Liquid","Er enthält grundsätzlich keinen Akku","Er erzeugt keinen Ausstoß"],0],
        ["Welche Aussage ist zutreffend?",["Tabakerhitzer sind risikofrei","Aerosole können Schadstoffe und Nikotin enthalten","Erhitzter Tabak ist medizinisch unbedenklich"],1]
      ],disclaimer:"Sachliche Produktkunde, keine Konsumempfehlung. Tabakerhitzer sind gesundheitlich nicht unbedenklich; Nikotin macht abhängig. Herstellerhinweise und Altersgrenzen beachten."},
      {id:"vaporizer-structure",title:"Aufbau und Funktion eines Vaporizers",level:"Grundlagen",description:"Lerne Heizkammer, Temperaturregelung, Luftweg sowie Konduktion und Konvektion kennen.",lessons:[
        "Ein Kräuterverdampfer besitzt meist eine Heizkammer, Temperatursteuerung, Luftkanal und Mundstück. Je nach Modell kommen Akku oder Netzteil sowie austauschbare Siebe und Kammerteile hinzu.",
        "Bei Konduktion wird Material durch direkten Kontakt mit einer erwärmten Oberfläche erhitzt. Bei Konvektion strömt erwärmte Luft durch das Material. Viele Geräte kombinieren beide Prinzipien.",
        "Temperaturanzeigen und Bauarten unterscheiden sich. Nur vorgesehene Materialien und die Herstelleranleitung verwenden. Erhitzte Pflanzen können Wirkstoffe und Reizstoffe freisetzen; Verdampfen ist nicht automatisch risikofrei."
      ],questions:[
        ["Was gehört typischerweise zum Vaporizer?",["Heizkammer und Luftweg","Tabakstick-Heizeinheit zwingend","Benzintank"],0],
        ["Was bedeutet Konduktion?",["Erwärmung durch direkten Kontakt","Erwärmung ausschließlich durch Licht","Kühlung durch Verdunstung"],0],
        ["Was bedeutet Konvektion?",["Wärmeübertragung durch strömende Luft","Mechanisches Zermahlen","Aufladen des Akkus"],0],
        ["Warum ist die Temperatursteuerung relevant?",["Sie beeinflusst den Erhitzungsvorgang","Sie ersetzt die Reinigung","Sie macht jedes Material sicher"],0],
        ["Welche Aussage ist richtig?",["Verdampfen ist immer risikofrei","Nur vorgesehene Materialien und Herstellerhinweise beachten","Jedes Pflanzenmaterial ist geeignet"],1]
      ],disclaimer:"Allgemeine Geräte- und Sicherheitskunde, keine medizinische Beratung oder Konsumempfehlung. Auch beim Verdampfen können gesundheitliche Risiken bestehen."},
      {id:"cannabis-effects",title:"Cannabis – Wirkungen und Nebenwirkungen",level:"Gesundheitswissen",description:"Sachliche Aufklärung über mögliche akute und längerfristige Wirkungen, Risiken, Wechselwirkungen und Warnzeichen.",lessons:[
        "Cannabis kann Wahrnehmung, Aufmerksamkeit, Gedächtnis, Reaktionszeit und Koordination beeinflussen. Wirkung und Dauer unterscheiden sich unter anderem nach Person, Produkt und Aufnahmeweg.",
        "Mögliche unerwünschte Wirkungen sind unter anderem Angst, Unruhe, Schwindel, Herzrasen, Übelkeit oder vorübergehende Verwirrtheit. Bei manchen Menschen können psychische Beschwerden verstärkt oder ausgelöst werden. Häufiger oder früher Konsum kann zusätzliche Risiken bergen.",
        "Cannabis kann mit Medikamenten und anderen berauschenden Substanzen wechselwirken. Nicht fahren oder Maschinen bedienen, solange eine Beeinträchtigung möglich ist. Bei schweren Symptomen, Bewusstseinsstörungen, Atemproblemen oder akuter Gefahr medizinische Hilfe holen."
      ],questions:[
        ["Welche Fähigkeiten kann Cannabis beeinträchtigen?",["Reaktionszeit und Koordination","Nur die Haarfarbe","Keine Fähigkeiten"],0],
        ["Welche unerwünschte Wirkung ist möglich?",["Angst oder Schwindel","Garantiert bessere Konzentration","Sicherer Schlaf bei allen"],0],
        ["Was gilt bei Medikamenten?",["Wechselwirkungen sind möglich","Kombinationen sind immer unbedenklich","Medikamente grundsätzlich eigenmächtig absetzen"],0],
        ["Wann sollte man nicht fahren?",["Solange eine Beeinträchtigung möglich ist","Nur nachts","Nur auf Autobahnen"],0],
        ["Was ist bei schweren Symptomen wichtig?",["Abwarten und allein bleiben","Medizinische Hilfe holen","Weitere Substanzen einnehmen"],1]
      ],disclaimer:"Allgemeine Gesundheitsinformation, keine Diagnose oder individuelle Therapieempfehlung. Bei medizinischen Fragen ärztlichen Rat einholen; bei akuter Gefahr den Notruf wählen."},
      {id:"coil-wick-care",title:"Coil, Watte und Verdampferpflege",level:"Aufbauwissen",description:"Erkenne Verschleiß, verstehe die Rolle des Dochts und lerne sichere Pflegegrundlagen.",lessons:[
        "Der Verdampferkopf enthält ein Heizelement und meist Dochtmaterial. Dieses nimmt Liquid auf und führt es zum Heizelement. Bauformen und Wechselintervalle unterscheiden sich je nach Gerät.",
        "Veränderter Geschmack, nachlassende Leistung oder sichtbare Beschädigung können Hinweise auf Wartungsbedarf sein. Gerät ausschalten, abkühlen lassen und die Anleitung für Reinigung oder Austausch beachten.",
        "Keine beschädigten Teile weiterverwenden. Elektronik und Akkuanschlüsse trocken halten. Selbstwickelarbeiten erfordern Fachkenntnis; dieser Kurs gibt keine Anleitung zum Bau oder zur elektrischen Abstimmung von Heizwendeln."
      ],questions:[
        ["Welche Aufgabe hat die Watte?",["Liquid zum Heizelement leiten","Den Akku schützen","Die Luft filtern"],0],
        ["Was kann auf Wartungsbedarf hinweisen?",["Beschädigung oder ungewöhnlicher Geschmack","Ein voller Akku","Die Farbe des Geräts"],0],
        ["Was ist vor der Reinigung wichtig?",["Gerät ausschalten und abkühlen lassen","Während des Ladens reinigen","Elektronik unter Wasser halten"],0],
        ["Was sollte trocken bleiben?",["Elektronik und Akkuanschlüsse","Nur die Verpackung","Das Display allein"],0],
        ["Was vermittelt dieser Kurs nicht?",["Grundlegende Pflegehinweise","Elektrische Bauanleitungen für Heizwendeln","Hinweise auf Herstelleranleitungen"],1]
      ],disclaimer:"Allgemeine Pflegehinweise. Nur kompatible Ersatzteile nutzen und Herstelleranleitungen befolgen. Keine Selbstbau- oder Widerstandsberechnungsanleitung."},
      {id:"liquid-knowledge",title:"Liquid-Wissen",level:"Grundlagen",description:"Lerne typische Bestandteile, Kennzeichnungen, Lagerung und wichtige Sicherheitsregeln kennen.",lessons:[
        "E-Liquids enthalten häufig Propylenglykol (PG), pflanzliches Glycerin (VG), Aromastoffe und gegebenenfalls Nikotin. Zusammensetzung und Kennzeichnung müssen auf dem Produkt nachvollziehbar sein.",
        "PG und VG sind Trägerstoffe mit unterschiedlichen Eigenschaften. Ein angegebenes Verhältnis beschreibt ihre Anteile; es sagt allein nichts über die gesundheitliche Unbedenklichkeit aus.",
        "Nikotin macht abhängig. Liquids niemals trinken, nicht auf Haut oder Augen bringen und stets kindersicher sowie gemäß Produktkennzeichnung lagern. Bei Kontakt oder Verschlucken die Hinweise auf der Verpackung beachten und gegebenenfalls medizinischen Rat einholen."
      ],questions:[
        ["Was bedeuten PG und VG?",["Bezeichnungen für Trägerstoffe","Akku-Typen","Aromenamen"],0],
        ["Was sagt ein PG/VG-Verhältnis aus?",["Das Mengenverhältnis der Trägerstoffe","Die Nikotinstärke automatisch","Die Haltbarkeit garantiert"],0],
        ["Welche Aussage zu Nikotin stimmt?",["Nikotin kann abhängig machen","Nikotin ist immer harmlos","Nikotin ist ein Konservierungsmittel"],0],
        ["Wie sollten Liquids gelagert werden?",["Kindersicher und gemäß Kennzeichnung","Offen neben Lebensmitteln","In Getränkeflaschen"],0],
        ["Was ist bei unbekannter Flüssigkeit sinnvoll?",["Nicht verwenden und Kennzeichnung prüfen","Probieren","Mit anderen Liquids mischen"],0]
      ],disclaimer:"Allgemeine Produktinformation. Keine individuelle Nikotinberatung und keine Mischanleitung. Kennzeichnung, Sicherheitsdaten und örtliche Vorschriften beachten."},
      {id:"nicotine-knowledge",title:"Nikotin verstehen",level:"Gesundheitswissen",description:"Lerne, wie Nikotin wirkt, warum es abhängig machen kann und welche Risiken und Warnzeichen wichtig sind.",lessons:[
        "Nikotin ist ein psychoaktiver Stoff und kann abhängig machen. Es beeinflusst unter anderem das Belohnungssystem und kann kurzfristig Aufmerksamkeit, Puls und Blutdruck verändern.",
        "Eine Abhängigkeit kann sich durch starkes Verlangen, Kontrollverlust und Entzugssymptome zeigen. Mögliche Entzugssymptome sind Reizbarkeit, Unruhe, Schlafprobleme und Konzentrationsschwierigkeiten.",
        "Nikotinprodukte sind nicht für Minderjährige, Nichtraucher oder Schwangere geeignet. Bei Fragen zu Abhängigkeit oder Entzug können Arztpraxis, Apotheke und Suchtberatung unterstützen. Dieser Kurs gibt keine individuelle Dosierungsempfehlung."
      ],questions:[
        ["Kann Nikotin abhängig machen?",["Ja","Nein","Nur in Lebensmitteln"],0],
        ["Was kann ein Entzug auslösen?",["Reizbarkeit und Unruhe","Garantiert bessere Konzentration","Keine Veränderungen"],0],
        ["Wen soll dieser Kurs nicht zum Nikotinkonsum ermutigen?",["Minderjährige und Nichtraucher","Alle Erwachsenen","Nur Fachpersonal"],0],
        ["Welche Unterstützung kann bei Abhängigkeit helfen?",["Suchtberatung und medizinische Fachpersonen","Ungeprüfte Internet-Tipps","Eigenmächtige Medikamentenänderung"],0],
        ["Gibt dieser Kurs persönliche Nikotin-Dosierungen vor?",["Ja","Nein"],1]
      ],disclaimer:"Allgemeine Gesundheitsinformation. Nikotin macht abhängig. Keine individuelle Dosierungs- oder Therapieempfehlung; bei Fragen professionelle Unterstützung nutzen."},
      {id:"troubleshooting-basics",title:"Fehlerbehebung für Einsteiger",level:"Grundlagen",description:"Ordne typische Probleme ein und lerne, wann du ein Gerät außer Betrieb nehmen solltest.",lessons:[
        "Bei fehlender Funktion zuerst einfache, sichere Punkte prüfen: Ist das Gerät eingeschaltet, geladen und korrekt zusammengesetzt? Die Anleitung erklärt die modellabhängigen Anzeigen und Sperren.",
        "Bei Leckage, ungewöhnlicher Hitze, beschädigtem Akku, verschmortem Geruch oder sichtbaren Schäden die Nutzung beenden. Gerät nicht öffnen oder eigenmächtig reparieren, wenn dies nicht ausdrücklich vorgesehen ist.",
        "Nur kompatibles Zubehör verwenden und bei ungelösten Problemen den Hersteller oder qualifizierten Kundendienst kontaktieren. Sicherheitswarnungen nicht durch wiederholtes Aktivieren umgehen."
      ],questions:[
        ["Was prüfst du zuerst bei einem scheinbar leeren Gerät?",["Ladestand und Anleitung","Das Gehäuse aufbohren","Beliebiges Netzteil anschließen"],0],
        ["Was tust du bei ungewöhnlicher Hitze oder Beschädigung?",["Weiterverwenden","Nutzung beenden","Das Gerät in Wasser legen"],1],
        ["Welches Zubehör ist geeignet?",["Vom Hersteller als kompatibel ausgewiesen","Jedes beliebige","Beschädigtes Zubehör"],0],
        ["Was ist bei ungelösten Fehlern sinnvoll?",["Kundendienst kontaktieren","Schutzfunktionen umgehen","Das Gerät gewaltsam öffnen"],0],
        ["Sollte man Sicherheitswarnungen ignorieren?",["Ja, wenn es eilig ist","Nein","Nur bei vollem Akku"],1]
      ],disclaimer:"Allgemeine Orientierung. Im Zweifel Gerät nicht weiterverwenden und Hersteller/Kundendienst kontaktieren. Keine Reparatur- oder Modifikationsanleitung."}
    ],
    en: [
      {"id":"ecig-structure","title":"How an E-Cigarette Is Built","level":"Basics","description":"Learn the components, operation, device types and essential safety principles of e-cigarettes.","lessons":["An e-cigarette is an electrically powered device that heats liquid and produces an inhalable aerosol. Depending on its design, it contains a power source, electronics, a tank or pod, an atomizer head and a mouthpiece. In closed systems, some parts are not user-replaceable.","The battery supplies electrical energy. Depending on the device, the electronics control power to the heating element and may include short-circuit, overheating or overload protections. Sensors may detect a user's draw. Protection features do not replace careful operation.","Liquid moves from the tank or pod to wicking material in the atomizer head. The heating element warms the saturated material and creates an aerosol, which travels with the airflow through air channels and the mouthpiece. This is not harmless water vapour and may contain harmful substances.","Device types include disposables, refillable pod systems and devices with a separate battery mod and tank. A pod may contain an integrated or replaceable atomizer. Designs, operation and maintenance differ. Not every accessory or replacement part is compatible with every device.","Replaceable-coil tanks use prefabricated atomizer heads. Rebuildable atomizers such as RTAs, RDAs and RDTAs have a dedicated build deck and a different construction. Mesh is a heating element made from metal mesh. Airflow means the air supply. Work on coils and electrical components requires expertise and is outside this course.","E-liquids typically contain propylene glycol (PG), glycerol (VG), flavourings and sometimes nicotine. PG and VG are carrier liquids; their ratio describes composition, not health safety. Volt (V) measures electrical voltage, watt (W) electrical power, ohm (Ω) resistance, and mAh is a measure of battery capacity.","Always follow the manufacturer's instructions and safety warnings. Do not use damaged or unusually hot batteries or devices. Use only suitable chargers and compatible parts. Protect devices from extreme heat and moisture. Never swallow liquids and keep them away from children. E-cigarettes are not risk-free; nicotine can cause dependence."],"questions":[["What does an e-cigarette produce?",["Harmless water vapour","An aerosol by heating liquid","Smoke from burning tobacco"],1],["Which parts may be found in an e-cigarette?",["Only a tank and mouthpiece","Only a battery and display","Battery, electronics, tank/pod, atomizer head and mouthpiece"],2],["What is the role of the electronics?",["Create the flavour","Control power delivery and possibly provide protection features","Replace the battery"],1],["What does the wick do?",["Charge the battery","Filter out all harmful substances","Carry liquid to the heating element"],2],["What distinguishes a pod system from a mod-and-tank system?",["A pod system uses a pod or cartridge unit","A pod system needs no electricity","A pod system always contains tobacco"],0],["What does mesh refer to?",["A type of battery","A heating element made from metal mesh","An ingredient in e-liquid"],1],["What does airflow mean?",["Battery capacity","Liquid strength","The air supply or air path"],2],["What does watt measure?",["Electrical resistance","Electrical power","Battery capacity"],1],["Which statement about PG/VG is correct?",["The ratio describes the carrier-liquid composition","It guarantees the liquid is harmless","It refers to battery voltage"],0],["What should you do with a damaged or unusually hot battery?",["Keep using it while the device still works","Test it with any charger","Stop using it and follow the manufacturer's guidance"],2]],"disclaimer":"General technical information, not a recommendation to use e-cigarettes. Devices differ; follow the manufacturer's instructions and safety warnings. E-cigarettes are not risk-free. Nicotine can cause dependence."},
      {id:"liquid-calculator",title:"E-Liquid Maths – The Calculation Course",level:"Basics",description:"Practise volume, percentage and ratio calculations using neutral examples, without handling concentrated nicotine.",lessons:[
        "Percent means 'per hundred'. Calculate a share by multiplying the total by the percentage and dividing by 100. Example: 20% of 50 ml is 10 ml. Keep units consistent.",
        "The component volumes add up to the total. Example using water and a harmless coloured practice liquid: 30 ml + 20 ml = 50 ml. A component's percentage is its volume divided by the total, multiplied by 100.",
        "A PG/VG figure describes a carrier ratio, not a guarantee of quality or safety. This lesson uses harmless practice values only. Do not handle or transfer concentrated substances; do not use unknown mixtures."
      ],questions:[
        ["What is 10% of 80 ml?",["4 ml","8 ml","18 ml"],1],
        ["30 ml plus 20 ml equals …",["40 ml","50 ml","60 ml"],1],
        ["How do you calculate a percentage share?",["Part ÷ total × 100","Total × 100","Part + 100"],0],
        ["What does a PG/VG ratio describe?",["Colour","The ratio of two carriers","Battery voltage"],1],
        ["What is the safety boundary of this course?",["Practise mixing concentrated nicotine","Use harmless calculation examples only","Taste unknown liquids"],1]
      ],disclaimer:"Maths education with neutral examples, not a mixing guide or dosing advice. Do not handle concentrated nicotine. Store liquids securely and follow their labels."},
      {id:"tobacco-heater-structure",title:"How a Heated-Tobacco Device Works",level:"Basics",description:"Understand the heater, tobacco stick, airflow and differences from cigarettes and e-cigarettes.",lessons:[
        "A heated-tobacco device typically contains a battery, control electronics, a heating unit and a holder for specially designed tobacco sticks. Designs vary by model.",
        "The control system regulates heating. Tobacco is heated rather than burned like in a conventional cigarette. The resulting aerosol can contain nicotine and other harmful substances.",
        "A heated-tobacco device uses real tobacco in purpose-made sticks. An e-cigarette heats liquid; a dry-herb vaporizer heats dried plant material. None of these products is risk-free."
      ],questions:[
        ["What is used in a heated-tobacco device?",["Any e-liquid","Purpose-made tobacco sticks","Loose battery cells"],1],
        ["What happens to the tobacco?",["It is heated","It is fully burned to ash","It is filtered through water"],0],
        ["Which part controls heating?",["The mouthpiece alone","The electronics/control system","The tobacco stick"],1],
        ["How does it differ from an e-cigarette?",["It uses tobacco sticks rather than liquid","It never has a battery","It produces no emissions"],0],
        ["Which statement is accurate?",["Heated tobacco is risk-free","Aerosols may contain harmful substances and nicotine","Heated tobacco is medically harmless"],1]
      ],disclaimer:"Neutral product information, not a recommendation. Heated-tobacco products are not harmless; nicotine is addictive. Follow instructions and age restrictions."},
      {id:"vaporizer-structure",title:"How a Dry-Herb Vaporizer Works",level:"Basics",description:"Learn about the heating chamber, temperature control, airflow, conduction and convection.",lessons:[
        "A dry-herb vaporizer usually has a heating chamber, temperature control, air path and mouthpiece. Depending on the model, it may use a battery or mains power and replaceable screens.",
        "With conduction, material is heated by direct contact with a hot surface. With convection, heated air flows through the material. Many devices combine both methods.",
        "Temperature displays and designs vary. Use only intended materials and follow the manual. Heated plants can release active compounds and irritants; vaporising is not automatically risk-free."
      ],questions:[
        ["What is commonly part of a vaporizer?",["Heating chamber and air path","A tobacco-stick heater is required","Fuel tank"],0],
        ["What does conduction mean?",["Heating through direct contact","Heating only with light","Cooling by evaporation"],0],
        ["What does convection mean?",["Heat transfer by moving air","Mechanical grinding","Charging the battery"],0],
        ["Why does temperature control matter?",["It affects the heating process","It replaces cleaning","It makes every material safe"],0],
        ["Which statement is correct?",["Vaporising is always risk-free","Use intended materials and follow the manual","Every plant material is suitable"],1]
      ],disclaimer:"General device and safety information, not medical advice or a recommendation to use. Vaporising can also involve health risks."},
      {id:"cannabis-effects",title:"Cannabis – Effects and Side Effects",level:"Health Knowledge",description:"Balanced information about possible short- and long-term effects, risks, interactions and warning signs.",lessons:[
        "Cannabis can affect perception, attention, memory, reaction time and coordination. Effects and duration vary with the person, product and route of administration.",
        "Possible unwanted effects include anxiety, agitation, dizziness, a racing heart, nausea or temporary confusion. Mental health symptoms may worsen or be triggered in some people. Frequent or early use can add risks.",
        "Cannabis can interact with medicines and other intoxicating substances. Do not drive or operate machinery while impairment is possible. Seek medical help for severe symptoms, loss of consciousness, breathing problems or immediate danger."
      ],questions:[
        ["Which abilities can cannabis affect?",["Reaction time and coordination","Hair colour only","No abilities"],0],
        ["Which unwanted effect is possible?",["Anxiety or dizziness","Guaranteed better focus","Safe sleep for everyone"],0],
        ["What applies to medicines?",["Interactions are possible","Combining them is always harmless","Stop prescribed medicines on your own"],0],
        ["When should you avoid driving?",["Whenever impairment may be present","Only at night","Only on motorways"],0],
        ["What matters in case of severe symptoms?",["Wait alone","Seek medical help","Take more substances"],1]
      ],disclaimer:"General health information, not a diagnosis or individual treatment recommendation. Consult a healthcare professional; call emergency services if there is immediate danger."},
      {id:"coil-wick-care",title:"Coils, Wicking and Atomizer Care",level:"Device Knowledge",description:"Understand wear, the role of wicking material and basic safe maintenance.",lessons:[
        "An atomizer head contains a heating element and usually wicking material. The wick absorbs liquid and carries it to the heater. Designs and replacement intervals vary by device.",
        "A changed taste, reduced performance or visible damage can indicate maintenance is needed. Switch the device off, let it cool and follow the manual for cleaning or replacement.",
        "Do not continue using damaged parts. Keep electronics and battery contacts dry. Rebuilding requires specialist knowledge; this course does not teach coil construction or electrical tuning."
      ],questions:[
        ["What does the wick do?",["Carry liquid to the heater","Protect the battery","Filter the air"],0],
        ["What may indicate maintenance is needed?",["Damage or unusual taste","A full battery","The device colour"],0],
        ["What should happen before cleaning?",["Switch off and let it cool","Clean while charging","Wet the electronics"],0],
        ["What should stay dry?",["Electronics and battery contacts","Only the packaging","Only the display"],0],
        ["What is not taught here?",["Basic care","Electrical coil-building instructions","Following manufacturer guidance"],1]
      ],disclaimer:"General care information. Use compatible parts and follow manufacturer instructions. No coil-building or resistance-calculation instructions."},
      {id:"liquid-knowledge",title:"Understanding E-Liquids",level:"Basics",description:"Learn common ingredients, labels, storage and important safety rules.",lessons:[
        "E-liquids commonly contain propylene glycol (PG), vegetable glycerine (VG), flavourings and sometimes nicotine. The product label should make the composition clear.",
        "PG and VG are carrier ingredients with different properties. A stated ratio describes their proportions; it does not by itself indicate that a liquid is safe.",
        "Nicotine is addictive. Never drink e-liquid or get it on skin or in eyes. Store it securely and follow the label. In case of exposure or swallowing, follow package guidance and seek medical advice when appropriate."
      ],questions:[
        ["What do PG and VG refer to?",["Carrier ingredients","Battery types","Flavour names"],0],
        ["What does a PG/VG ratio tell you?",["The proportion of the carriers","The nicotine strength automatically","Guaranteed shelf life"],0],
        ["Which statement about nicotine is true?",["It can cause dependence","It is always harmless","It is a preservative"],0],
        ["How should liquids be stored?",["Securely and according to the label","Open beside food","In drink bottles"],0],
        ["What should you do with an unknown liquid?",["Do not use it; check the label","Taste it","Mix it with other liquids"],0]
      ],disclaimer:"General product information. No personal nicotine advice or mixing instructions. Follow labels, safety information and local rules."},
      {id:"nicotine-knowledge",title:"Understanding Nicotine",level:"Health Knowledge",description:"Learn how nicotine works, why it can cause dependence and which risks and warning signs matter.",lessons:[
        "Nicotine is a psychoactive substance and can cause dependence. It affects the brain's reward system and can temporarily change attention, heart rate and blood pressure.",
        "Dependence may involve strong cravings, loss of control and withdrawal symptoms. Possible symptoms include irritability, restlessness, sleep problems and difficulty concentrating.",
        "Nicotine products are not suitable for minors, non-smokers or pregnant people. Healthcare professionals, pharmacists and addiction services can help with questions about dependence or withdrawal. This course gives no personal dosage advice."
      ],questions:[
        ["Can nicotine cause dependence?",["Yes","No","Only in food"],0],
        ["What can withdrawal involve?",["Irritability and restlessness","Guaranteed better focus","No changes"],0],
        ["Who should this course not encourage to use nicotine?",["Minors and non-smokers","All adults","Only professionals"],0],
        ["What support may help with dependence?",["Addiction services and healthcare professionals","Unverified online tips","Changing medication without advice"],0],
        ["Does this course provide personal nicotine dosages?",["Yes","No"],1]
      ],disclaimer:"General health information. Nicotine is addictive. No individual dosage or treatment advice; seek professional support when needed."},
      {id:"troubleshooting-basics",title:"Troubleshooting for Beginners",level:"Basics",description:"Recognise common issues and learn when a device should be taken out of service.",lessons:[
        "If a device does not work, check simple safe points first: is it switched on, charged and assembled correctly? The manual explains model-specific indicators and locks.",
        "Stop using a device if it leaks, becomes unusually hot, has a damaged battery, smells burnt or shows visible damage. Do not open or repair it unless the manufacturer explicitly allows it.",
        "Use compatible accessories and contact the manufacturer or qualified service if the problem remains. Never bypass safety warnings by repeatedly activating the device."
      ],questions:[
        ["What should you check first if a device seems empty?",["Charge level and manual","Drill into the case","Use any charger"],0],
        ["What should you do if it overheats or is damaged?",["Keep using it","Stop using it","Put it in water"],1],
        ["Which accessories are suitable?",["Those confirmed compatible by the manufacturer","Any accessory","Damaged accessories"],0],
        ["What is sensible if a problem remains?",["Contact support","Bypass safety functions","Force the device open"],0],
        ["Should safety warnings be ignored?",["Yes, when in a hurry","No","Only when fully charged"],1]
      ],disclaimer:"General guidance. If unsure, stop using the device and contact the manufacturer or service provider. No repair or modification instructions."}
    ],
    fr: [
      {"id":"ecig-structure","title":"Structure d’une cigarette électronique","level":"Bases","description":"Découvre les composants, le fonctionnement, les différents systèmes et les règles essentielles de sécurité des cigarettes électroniques.","lessons":["Une cigarette électronique est un appareil électrique qui chauffe un liquide et produit un aérosol inhalable. Selon sa conception, elle comprend une source d’énergie, une électronique, un réservoir ou pod, une tête d’atomiseur et un embout. Dans les systèmes fermés, certaines pièces ne sont pas remplaçables par l’utilisateur.","La batterie fournit l’énergie électrique. Selon l’appareil, l’électronique commande l’alimentation de l’élément chauffant et peut intégrer des protections contre les courts-circuits, la surchauffe ou les surcharges. Des capteurs peuvent détecter l’aspiration. Ces protections ne remplacent pas une utilisation prudente.","Le liquide passe du réservoir ou pod vers la mèche de la tête d’atomiseur. L’élément chauffant réchauffe la mèche imbibée et produit un aérosol, entraîné par le flux d’air dans les conduits puis vers l’embout. Cet aérosol n’est pas de la vapeur d’eau inoffensive et peut contenir des substances nocives.","Il existe des appareils jetables, des systèmes à pods rechargeables et des appareils avec une box séparée et un réservoir. Un pod peut intégrer un atomiseur fixe ou remplaçable. La conception, l’utilisation et l’entretien varient. Tous les accessoires et toutes les pièces ne sont pas compatibles avec chaque appareil.","Les réservoirs à résistance remplaçable utilisent des têtes préfabriquées. Les atomiseurs reconstructibles comme RTA, RDA ou RDTA possèdent une base dédiée et une construction différente. Mesh désigne un élément chauffant en grille métallique. Airflow désigne l’arrivée d’air. Les travaux sur les résistances et les composants électriques nécessitent des compétences et ne sont pas abordés dans ce cours.","Les e-liquides contiennent généralement du propylène glycol (PG), de la glycérine (VG), des arômes et parfois de la nicotine. Le PG et le VG sont des supports ; leur proportion décrit la composition, mais ne garantit pas l’innocuité. Le volt (V) mesure la tension électrique, le watt (W) la puissance, l’ohm (Ω) la résistance et le mAh indique la capacité d’une batterie.","Respecte toujours la notice et les consignes de sécurité du fabricant. N’utilise pas une batterie ou un appareil endommagé ou anormalement chaud. Utilise uniquement des chargeurs adaptés et des pièces compatibles. Protège les appareils de la chaleur extrême et de l’humidité. N’avale jamais les liquides et garde-les hors de portée des enfants. Les cigarettes électroniques ne sont pas sans risque ; la nicotine peut entraîner une dépendance."],"questions":[["Que produit une cigarette électronique ?",["De la vapeur d’eau inoffensive","Un aérosol en chauffant un liquide","De la fumée issue de la combustion du tabac"],1],["Quels éléments peut-on trouver dans une cigarette électronique ?",["Uniquement un réservoir et un embout","Uniquement une batterie et un écran","Batterie, électronique, réservoir/pod, tête d’atomiseur et embout"],2],["Quel est le rôle de l’électronique ?",["Créer l’arôme","Commander l’alimentation et éventuellement assurer des protections","Remplacer la batterie"],1],["À quoi sert la mèche ?",["Charger la batterie","Filtrer toutes les substances nocives","Acheminer le liquide vers l’élément chauffant"],2],["Quelle différence caractérise un système pod par rapport à une box avec réservoir ?",["Le système pod utilise une cartouche ou un pod","Le système pod n’a pas besoin d’électricité","Le système pod contient toujours du tabac"],0],["Que désigne le terme mesh ?",["Un type de batterie","Un élément chauffant en grille métallique","Un ingrédient du e-liquide"],1],["Que signifie airflow ?",["La capacité de la batterie","La concentration du liquide","L’arrivée ou le trajet de l’air"],2],["Que mesure le watt ?",["La résistance électrique","La puissance électrique","La capacité de la batterie"],1],["Quelle affirmation sur PG/VG est correcte ?",["La proportion décrit la composition des supports","Elle garantit l’innocuité du liquide","Elle indique la tension de la batterie"],0],["Que faire avec une batterie endommagée ou anormalement chaude ?",["Continuer tant que l’appareil fonctionne","La tester avec n’importe quel chargeur","Cesser de l’utiliser et suivre les consignes du fabricant"],2]],"disclaimer":"Informations techniques générales, sans recommandation d’utilisation. Les appareils diffèrent ; respecter la notice et les consignes de sécurité du fabricant. Les cigarettes électroniques ne sont pas sans risque. La nicotine peut entraîner une dépendance."},
      {id:"liquid-calculator",title:"Calculs de e-liquide – cours de calcul",level:"Bases",description:"Exerce-toi aux volumes, pourcentages et proportions avec des exemples neutres, sans manipuler de nicotine concentrée.",lessons:[
        "Un pourcentage signifie « sur cent ». Pour calculer une part, multiplie le total par le pourcentage puis divise par 100. Exemple : 20 % de 50 ml = 10 ml. Garde des unités cohérentes.",
        "Les volumes des composants s’additionnent. Exemple avec de l’eau et un liquide coloré sans danger : 30 ml + 20 ml = 50 ml. Le pourcentage d’un composant est son volume divisé par le total, puis multiplié par 100.",
        "Une proportion PG/VG décrit le rapport entre deux supports, pas une garantie de qualité ou de sécurité. Ce cours utilise uniquement des valeurs d’exercice inoffensives. Ne manipule pas de substances concentrées et n’utilise pas de mélanges inconnus."
      ],questions:[
        ["Combien font 10 % de 80 ml ?",["4 ml","8 ml","18 ml"],1],
        ["30 ml + 20 ml donnent …",["40 ml","50 ml","60 ml"],1],
        ["Comment calculer une proportion en pourcentage ?",["Partie ÷ total × 100","Total × 100","Partie + 100"],0],
        ["Que décrit un rapport PG/VG ?",["La couleur","La proportion de deux supports","La tension de la batterie"],1],
        ["Quelle est la limite de sécurité de ce cours ?",["Mélanger de la nicotine concentrée","Utiliser uniquement des exemples de calcul inoffensifs","Goûter des liquides inconnus"],1]
      ],disclaimer:"Cours de calcul avec exemples neutres, pas une recette ni un conseil de dosage. Ne manipule pas de nicotine concentrée. Conserve les liquides en sécurité et respecte leur étiquetage."},
      {id:"tobacco-heater-structure",title:"Structure et fonctionnement du tabac chauffé",level:"Bases",description:"Comprends le système de chauffe, le stick de tabac, le flux d’air et les différences avec la cigarette et la cigarette électronique.",lessons:[
        "Un appareil de tabac chauffé comprend généralement une batterie, une électronique de commande, un système de chauffe et un logement pour des sticks de tabac spécifiques. La conception varie selon le modèle.",
        "Le système de commande régule la chauffe. Le tabac est chauffé au lieu d’être brûlé comme dans une cigarette classique. L’aérosol produit peut contenir de la nicotine et d’autres substances nocives.",
        "Le tabac chauffé utilise du vrai tabac dans des sticks dédiés. Une cigarette électronique chauffe un liquide ; un vaporisateur d’herbes chauffe une matière végétale séchée. Aucun de ces produits n’est sans risque."
      ],questions:[
        ["Qu’utilise un appareil de tabac chauffé ?",["N’importe quel e-liquide","Des sticks de tabac prévus à cet effet","Des cellules de batterie libres"],1],
        ["Que devient le tabac ?",["Il est chauffé","Il est entièrement brûlé en cendres","Il est filtré par l’eau"],0],
        ["Quelle partie commande la chauffe ?",["L’embout seul","L’électronique de commande","Le stick de tabac"],1],
        ["Quelle différence avec une cigarette électronique ?",["Il utilise des sticks de tabac plutôt qu’un liquide","Il n’a jamais de batterie","Il ne produit aucune émission"],0],
        ["Quelle affirmation est exacte ?",["Le tabac chauffé est sans risque","L’aérosol peut contenir des substances nocives et de la nicotine","Le tabac chauffé est médicalement inoffensif"],1]
      ],disclaimer:"Information neutre sur le produit, sans recommandation d’utilisation. Le tabac chauffé n’est pas inoffensif ; la nicotine crée une dépendance. Respecte les consignes et limites d’âge."},
      {id:"vaporizer-structure",title:"Structure et fonctionnement d’un vaporisateur",level:"Bases",description:"Découvre la chambre de chauffe, le contrôle de température, le flux d’air, la conduction et la convection.",lessons:[
        "Un vaporisateur d’herbes sèches possède généralement une chambre de chauffe, un contrôle de température, un conduit d’air et un embout. Selon le modèle, il fonctionne sur batterie ou secteur.",
        "Par conduction, la matière est chauffée par contact direct avec une surface chaude. Par convection, de l’air chaud traverse la matière. De nombreux appareils combinent les deux méthodes.",
        "Les affichages de température et les conceptions varient. Utilise uniquement les matières prévues et respecte la notice. Les plantes chauffées peuvent libérer des substances actives et irritantes ; la vaporisation n’est pas automatiquement sans risque."
      ],questions:[
        ["Quel élément fait généralement partie d’un vaporisateur ?",["Chambre de chauffe et conduit d’air","Un chauffage de stick de tabac obligatoire","Réservoir de carburant"],0],
        ["Que signifie conduction ?",["Chauffage par contact direct","Chauffage uniquement par lumière","Refroidissement par évaporation"],0],
        ["Que signifie convection ?",["Transfert de chaleur par air en mouvement","Broyage mécanique","Recharge de la batterie"],0],
        ["Pourquoi le contrôle de température est-il important ?",["Il influence le processus de chauffe","Il remplace le nettoyage","Il rend toute matière sans risque"],0],
        ["Quelle affirmation est correcte ?",["La vaporisation est toujours sans risque","Utiliser les matières prévues et suivre la notice","Toutes les plantes conviennent"],1]
      ],disclaimer:"Informations générales sur l’appareil et la sécurité, sans conseil médical ni recommandation d’utilisation. La vaporisation peut également présenter des risques."},
      {id:"cannabis-effects",title:"Cannabis – effets et effets indésirables",level:"Connaissances santé",description:"Informations équilibrées sur les effets possibles à court et long terme, les risques, interactions et signes d’alerte.",lessons:[
        "Le cannabis peut modifier la perception, l’attention, la mémoire, le temps de réaction et la coordination. Les effets et leur durée varient selon la personne, le produit et le mode d’administration.",
        "Les effets indésirables possibles comprennent anxiété, agitation, vertiges, palpitations, nausées ou confusion temporaire. Chez certaines personnes, des troubles psychiques peuvent être aggravés ou déclenchés. Un usage fréquent ou précoce comporte des risques supplémentaires.",
        "Le cannabis peut interagir avec des médicaments et d’autres substances psychoactives. Ne conduis pas et n’utilise pas de machines tant qu’une altération est possible. En cas de symptômes graves, perte de conscience ou difficulté respiratoire, demande une aide médicale."
      ],questions:[
        ["Quelles capacités le cannabis peut-il affecter ?",["Temps de réaction et coordination","Uniquement la couleur des cheveux","Aucune capacité"],0],
        ["Quel effet indésirable est possible ?",["Anxiété ou vertiges","Concentration toujours meilleure","Sommeil garanti pour tous"],0],
        ["Que faut-il savoir au sujet des médicaments ?",["Des interactions sont possibles","Les associations sont toujours sans danger","Arrêter seul un traitement prescrit"],0],
        ["Quand faut-il éviter de conduire ?",["Tant qu’une altération est possible","Uniquement la nuit","Uniquement sur autoroute"],0],
        ["Que faire en cas de symptômes graves ?",["Attendre seul","Demander une aide médicale","Prendre d’autres substances"],1]
      ],disclaimer:"Information générale sur la santé, pas un diagnostic ni une recommandation thérapeutique individuelle. Consulte un professionnel de santé ; en cas de danger immédiat, appelle les secours."},
      {id:"coil-wick-care",title:"Résistances, mèches et entretien",level:"Connaissances appareil",description:"Comprends l’usure, le rôle de la mèche et les bases d’un entretien sûr.",lessons:[
        "La tête d’atomiseur contient un élément chauffant et généralement une mèche. Celle-ci absorbe le liquide et l’amène vers le chauffage. Les modèles et intervalles de remplacement varient.",
        "Un goût modifié, une performance réduite ou des dommages visibles peuvent signaler un entretien nécessaire. Éteins l’appareil, laisse-le refroidir et suis la notice.",
        "N’utilise pas de pièces endommagées. Garde l’électronique et les contacts de batterie au sec. Le reconstructible demande des connaissances spécialisées ; ce cours n’enseigne pas la fabrication ou le réglage électrique de résistances."
      ],questions:[
        ["Quel est le rôle de la mèche ?",["Acheminer le liquide vers le chauffage","Protéger la batterie","Filtrer l’air"],0],
        ["Qu’est-ce qui peut indiquer un entretien nécessaire ?",["Dommage ou goût inhabituel","Batterie pleine","Couleur de l’appareil"],0],
        ["Que faire avant le nettoyage ?",["Éteindre et laisser refroidir","Nettoyer pendant la charge","Mouiller l’électronique"],0],
        ["Qu’est-ce qui doit rester sec ?",["Électronique et contacts de batterie","Seulement l’emballage","Seulement l’écran"],0],
        ["Que n’enseigne pas ce cours ?",["Les bases de l’entretien","Les instructions de fabrication électrique de résistances","Le respect de la notice"],1]
      ],disclaimer:"Conseils généraux d’entretien. Utilise des pièces compatibles et respecte la notice. Pas d’instructions de fabrication ou de calcul de résistance."},
      {id:"liquid-knowledge",title:"Comprendre les e-liquides",level:"Bases",description:"Découvre les ingrédients courants, l’étiquetage, le stockage et les règles de sécurité.",lessons:[
        "Les e-liquides contiennent souvent du propylène glycol (PG), de la glycérine végétale (VG), des arômes et parfois de la nicotine. La composition doit être indiquée sur l’étiquette.",
        "Le PG et la VG sont des supports aux propriétés différentes. Leur proportion ne garantit pas à elle seule l’innocuité du liquide.",
        "La nicotine crée une dépendance. Ne bois jamais de e-liquide et évite tout contact avec la peau ou les yeux. Stocke-le en sécurité et respecte l’étiquette. En cas d’exposition ou d’ingestion, suis les consignes et demande un avis médical si nécessaire."
      ],questions:[
        ["Que désignent PG et VG ?",["Des supports","Des types de batterie","Des noms d’arômes"],0],
        ["Que décrit un rapport PG/VG ?",["La proportion des supports","Automatiquement le taux de nicotine","Une durée de conservation garantie"],0],
        ["Quelle affirmation sur la nicotine est vraie ?",["Elle peut entraîner une dépendance","Elle est toujours inoffensive","C’est un conservateur"],0],
        ["Comment stocker les liquides ?",["En sécurité et selon l’étiquette","Ouverts près des aliments","Dans des bouteilles de boisson"],0],
        ["Que faire avec un liquide inconnu ?",["Ne pas l’utiliser et vérifier l’étiquette","Le goûter","Le mélanger à d’autres liquides"],0]
      ],disclaimer:"Information générale sur les produits. Pas de conseil individuel sur la nicotine ni de recette de mélange. Respecte les étiquettes et règles locales."},
      {id:"nicotine-knowledge",title:"Comprendre la nicotine",level:"Connaissances santé",description:"Découvre le fonctionnement de la nicotine, son potentiel de dépendance et les risques et signes d’alerte.",lessons:[
        "La nicotine est une substance psychoactive qui peut entraîner une dépendance. Elle agit notamment sur le système de récompense du cerveau et peut modifier temporairement l’attention, le rythme cardiaque et la tension artérielle.",
        "La dépendance peut se manifester par une forte envie, une perte de contrôle et des symptômes de sevrage. Ceux-ci peuvent inclure irritabilité, agitation, troubles du sommeil et difficultés de concentration.",
        "Les produits contenant de la nicotine ne conviennent pas aux mineurs, aux non-fumeurs ni aux personnes enceintes. Médecins, pharmaciens et services d’addictologie peuvent aider. Ce cours ne donne aucun conseil individuel de dosage."
      ],questions:[
        ["La nicotine peut-elle entraîner une dépendance ?",["Oui","Non","Uniquement dans les aliments"],0],
        ["Que peut provoquer le sevrage ?",["Irritabilité et agitation","Une meilleure concentration garantie","Aucun changement"],0],
        ["Qui ce cours ne doit-il pas encourager à utiliser de la nicotine ?",["Les mineurs et les non-fumeurs","Tous les adultes","Uniquement les professionnels"],0],
        ["Quel soutien peut aider en cas de dépendance ?",["Services d’addictologie et professionnels de santé","Conseils Internet non vérifiés","Modifier seul un traitement"],0],
        ["Ce cours donne-t-il des dosages individuels de nicotine ?",["Oui","Non"],1]
      ],disclaimer:"Information générale sur la santé. La nicotine crée une dépendance. Aucun conseil individuel de dosage ou de traitement ; demande un accompagnement professionnel si nécessaire."},
      {id:"troubleshooting-basics",title:"Dépannage pour débutants",level:"Bases",description:"Identifie les problèmes courants et apprends quand arrêter d’utiliser un appareil.",lessons:[
        "Si l’appareil ne fonctionne pas, vérifie d’abord les points simples et sûrs : est-il allumé, chargé et correctement assemblé ? La notice explique les indicateurs et verrouillages propres au modèle.",
        "Arrête l’utilisation en cas de fuite, chaleur inhabituelle, batterie endommagée, odeur de brûlé ou dommage visible. N’ouvre pas et ne répare pas l’appareil sauf autorisation explicite du fabricant.",
        "Utilise des accessoires compatibles et contacte le fabricant ou un service qualifié si le problème persiste. Ne contourne jamais les avertissements de sécurité."
      ],questions:[
        ["Que vérifier d’abord si l’appareil semble déchargé ?",["Charge et notice","Percer le boîtier","Brancher n’importe quel chargeur"],0],
        ["Que faire en cas de surchauffe ou dommage ?",["Continuer","Arrêter l’utilisation","Le mettre dans l’eau"],1],
        ["Quels accessoires conviennent ?",["Ceux déclarés compatibles par le fabricant","Tous les accessoires","Les accessoires endommagés"],0],
        ["Que faire si le problème persiste ?",["Contacter le support","Contourner les protections","Forcer l’ouverture"],0],
        ["Faut-il ignorer les avertissements de sécurité ?",["Oui, si l’on est pressé","Non","Uniquement si la batterie est pleine"],1]
      ],disclaimer:"Conseils généraux. En cas de doute, cesse d’utiliser l’appareil et contacte le fabricant ou le service après-vente. Pas d’instructions de réparation ou de modification."}
    ]
  };
  window.MVA_ACADEMY_COURSES = { getCourses(){ return (data[lang()] || data.de).map(course => ({...course,xp:30,coins:20})); } };
})();