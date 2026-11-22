"use strict";
(() => {
  const lang = () => window.MVA_LOCALES?.getLanguage?.() || window.MVA_I18N?.getLanguage?.() || "de";
  const data = {
    de: [
      {id:"ecig-structure",title:"Aufbau einer E-Zigarette",level:"Grundlagen",description:"Lerne die Bauteile, den Strom- und Liquidweg sowie die Aufgaben von Akku, Elektronik, Tank und Verdampfer kennen.",lessons:[
        "Eine E-Zigarette besteht je nach Bauart aus Energiequelle, Elektronik, Tank oder Pod, Verdampferkopf und Mundstück. Bei geschlossenen Systemen sind einzelne Teile nicht für den Austausch durch Nutzer vorgesehen.",
        "Beim Aktivieren versorgt der Akku die Elektronik. Diese steuert – abhängig vom Gerät – die Energiezufuhr zum Heizelement. Schutzschaltungen und Sensoren können Überlastung oder Fehlbedienung begrenzen; sie ersetzen keine sorgfältige Nutzung.",
        "Liquid wird aus dem Tank oder Pod zum Dochtmaterial im Verdampferkopf geleitet. Das Heizelement erwärmt das Material und erzeugt ein Aerosol, das durch Luftkanäle und Mundstück geführt wird. Das Aerosol ist kein harmloser Wasserdampf."
      ],questions:[
        ["Welche Aufgabe hat der Akku?",["Er speichert elektrische Energie","Er filtert das Aerosol","Er reguliert den Liquidstand"],0],
        ["Wofür ist die Elektronik zuständig?",["Für die Farbe des Liquids","Für Steuerung und Schutzfunktionen","Für die Reinigung des Tanks"],1],
        ["Welche Aufgabe hat das Dochtmaterial?",["Es leitet Liquid zum Heizelement","Es lädt den Akku","Es kühlt das Mundstück"],0],
        ["Was erzeugt das Heizelement?",["Reinen Wasserdampf","Ein Aerosol aus erhitztem Liquid","Sauerstoff"],1],
        ["Welche Aussage ist richtig?",["Alle Geräte sind identisch aufgebaut","Herstellerhinweise und Kompatibilität sind wichtig","Jedes beliebige Teil passt"],1]
      ],disclaimer:"Allgemeine technische Information. Geräte unterscheiden sich; maßgeblich sind die Anleitung und Sicherheitshinweise des Herstellers. E-Zigaretten sind nicht risikofrei."},
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
      {id:"ecig-structure",title:"How an E-Cigarette Is Built",level:"Basics",description:"Learn the parts, power and liquid paths, and the roles of the battery, electronics, tank and atomizer.",lessons:[
        "Depending on the design, an e-cigarette contains a power source, electronics, a tank or pod, an atomizer head and a mouthpiece. In closed systems, some parts are not user-replaceable.",
        "When activated, the battery supplies the electronics. The device controls power to the heating element. Protection circuits and sensors may limit overloads or misuse, but do not replace careful operation.",
        "Liquid travels from the tank or pod to wicking material in the atomizer head. The heater warms it and creates an aerosol that passes through air channels and the mouthpiece. This aerosol is not harmless water vapour."
      ],questions:[
        ["What is the battery's role?",["Store electrical energy","Filter the aerosol","Control the liquid level"],0],
        ["What does the electronics do?",["Choose the liquid colour","Control operation and safety functions","Clean the tank"],1],
        ["What is the wick for?",["Carry liquid to the heater","Charge the battery","Cool the mouthpiece"],0],
        ["What does the heating element produce?",["Pure water vapour","An aerosol from heated liquid","Oxygen"],1],
        ["Which statement is correct?",["All devices have identical designs","Follow manufacturer instructions and compatibility guidance","Any part will fit"],1]
      ],disclaimer:"General technical information. Devices differ; follow the manufacturer's instructions and safety warnings. E-cigarettes are not risk-free."},
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
      {id:"ecig-structure",title:"Structure d’une cigarette électronique",level:"Bases",description:"Découvre les composants, les circuits électrique et de liquide, ainsi que le rôle de la batterie, de l’électronique, du réservoir et de l’atomiseur.",lessons:[
        "Selon le modèle, une cigarette électronique comprend une source d’énergie, une électronique, un réservoir ou pod, une tête d’atomiseur et un embout. Dans les systèmes fermés, certaines pièces ne sont pas remplaçables par l’utilisateur.",
        "Lors de l’activation, la batterie alimente l’électronique, qui commande l’énergie envoyée à l’élément chauffant. Les protections peuvent limiter les surcharges, mais ne remplacent pas une utilisation prudente.",
        "Le liquide passe du réservoir ou pod vers la mèche de la tête d’atomiseur. L’élément chauffant le réchauffe et produit un aérosol qui passe par les conduits d’air et l’embout. Cet aérosol n’est pas de la vapeur d’eau inoffensive."
      ],questions:[
        ["Quel est le rôle de la batterie ?",["Stocker l’énergie électrique","Filtrer l’aérosol","Régler le niveau de liquide"],0],
        ["À quoi sert l’électronique ?",["Choisir la couleur du liquide","Contrôler le fonctionnement et les protections","Nettoyer le réservoir"],1],
        ["À quoi sert la mèche ?",["Acheminer le liquide vers le chauffage","Charger la batterie","Refroidir l’embout"],0],
        ["Que produit l’élément chauffant ?",["De la vapeur d’eau pure","Un aérosol issu du liquide chauffé","De l’oxygène"],1],
        ["Quelle affirmation est correcte ?",["Tous les appareils sont identiques","Respecter les consignes et la compatibilité du fabricant","Toutes les pièces conviennent"],1]
      ],disclaimer:"Informations techniques générales. Les appareils diffèrent ; respecter la notice et les consignes de sécurité du fabricant. Les cigarettes électroniques ne sont pas sans risque."},
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