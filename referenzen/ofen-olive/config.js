/* Gemeinsame Konfiguration fuer Website- und App-Demo. Name, Ort, Logo, Karte hier tauschen. */
window.OO_CONFIG = {
  name: "Ofen & Olive",
  ort: "Ratingen",
  claim: "Neapolitanische Pizza aus dem Holzofen",
  logo: "img/logo-ink.png",        // relativ zu referenzen/ofen-olive/ (dunkel, fuer helle Flaechen)
  icon: "img/icon.png",             // App-Icon (Push)
  logoHell: "img/logo-hell.png",
  status: "Jetzt geöffnet · Küche bis 22:00 · Abholung & Lieferung",
  zeiten: [["Mo – Do", "11:30 – 22:00"], ["Fr – Sa", "11:30 – 23:00"], ["So", "12:00 – 21:30"]],
  zeitenHinweis: "Küche schließt 30 Min. vorher",
  liefergebiet: ["Ratingen Mitte", "Ratingen West", "Lintorf", "Hösel", "Breitscheid"],
  liefergebuehr: 2.5, mindestwert: 15, abholMin: 20, lieferMin: 40,
  pizzen: [
    { id: "margherita", name: "Margherita", preis: 9.5, bild: "img/p-margherita.webp",
      text: "San-Marzano-Tomate, Fior di Latte, Basilikum, Olivenöl aus Apulien." },
    { id: "quattro", name: "Quattro Formaggi", preis: 12.9, bild: "img/p-quattro.webp",
      text: "Fior di Latte, Gorgonzola dolce, Fontina, Parmigiano 24 Monate." },
    { id: "prosciutto", name: "Prosciutto & Burrata", preis: 14.5, bild: "img/p-prosciutto.webp",
      text: "Prosciutto di Parma, Burrata aus Apulien, Rucola, nach dem Backen belegt." },
    { id: "diavola", name: "Diavola", preis: 11.9, bild: "img/p-diavola.webp",
      text: "Salame piccante, Tomate, Fior di Latte, Chili-Öl aus dem eigenen Ansatz." }
  ],
  // Ganze Karte (Website-Kapitel + App-Bestellmenue). Pizzen mit Bild oben in "pizzen"; hier alles Weitere.
  // typ "pizza" = oeffnet in der App das Groessen/Extras-Sheet, sonst direkt in den Warenkorb.
  karte: [
    { id: "antipasti", titel: "Antipasti", unter: "Zum Teilen, solange der Ofen vorheizt", gerichte: [
      { id: "focaccia", name: "Focaccia dal forno", preis: 6.5, text: "Aus unserem Pizzateig, Rosmarin, Meersalz, kalt gepresstes Olivenöl." },
      { id: "burrata", name: "Burrata", preis: 12.5, text: "Ganze Burrata, geröstete Kirschtomaten, Basilikumöl, geröstetes Brot." },
      { id: "arancini", name: "Arancini al ragù", preis: 9.5, text: "Drei Reisbällchen, Rinderragù, Erbsen, Caciocavallo im Kern." },
      { id: "vitello", name: "Vitello tonnato", preis: 14.9, text: "Rosa Kalbsnuss, dünn geschnitten, Thunfischcreme, Kapernäpfel." },
      { id: "carpaccio", name: "Carpaccio di manzo", preis: 15.5, text: "Rinderhüfte roh, Rucola, Parmigiano, Zitrone, schwarzer Pfeffer." },
      { id: "tagliere", name: "Tagliere per due", preis: 19.9, text: "Prosciutto di Parma 18 Monate, Mortadella, Pecorino, Oliven, Focaccia. Für zwei." }
    ]},
    { id: "insalate", titel: "Insalate", gerichte: [
      { id: "finocchi", name: "Finocchi e arance", preis: 10.5, text: "Fenchel hauchdünn, Orange, schwarze Oliven, Minze, Olivenöl." },
      { id: "pera", name: "Rucola e pera", preis: 11.5, text: "Rucola, Birne, Pecorino, Walnüsse, alter Balsamico." },
      { id: "panzanella", name: "Panzanella", preis: 10.9, text: "Tomaten, Gurke, rote Zwiebel, Brot vom Vortag, Rotweinessig." }
    ]},
    { id: "pizze", titel: "Weitere Pizze", unter: "Napoletana · 48 Stunden Teigführung · 90 Sekunden bei 450 °C", gerichte: [
      { id: "marinara", typ: "pizza", name: "Marinara", preis: 8.5, text: "San-Marzano-Tomate, Knoblauch, Oregano, Olivenöl. Ohne Käse, wie sie sein soll." },
      { id: "capricciosa", typ: "pizza", name: "Capricciosa", preis: 13.5, text: "Kochschinken, Champignons, Artischocken, Oliven, Fior di Latte." },
      { id: "ortolana", typ: "pizza", name: "Ortolana", preis: 12.9, text: "Zucchini, Aubergine, Paprika aus dem Ofen, Fior di Latte, Basilikum." },
      { id: "nduja", typ: "pizza", name: "’Nduja e stracciatella", preis: 14.5, text: "Scharfe kalabrische ’Nduja, Tomate, nach dem Backen kühle Stracciatella.", tag: "scharf" },
      { id: "salsiccia", typ: "pizza", name: "Salsiccia e friarielli", preis: 14.9, text: "Bianca: Fenchelsalsiccia, Stängelkohl, Provola affumicata, Chili." },
      { id: "porcini", typ: "pizza", name: "Porcini", preis: 15.9, text: "Bianca: Steinpilze, Fior di Latte, Thymian, Parmigiano, Knoblauchöl." },
      { id: "mortadella", typ: "pizza", name: "Mortadella e pistacchio", preis: 15.5, text: "Bianca: Mortadella aus Bologna, Pistaziencreme, Burrata, Zitronenabrieb." },
      { id: "tartufo", typ: "pizza", name: "Tartufo", preis: 19.5, text: "Bianca: Fior di Latte, Pecorino, frisch gehobelter Sommertrüffel. Solange Saison." }
    ]},
    { id: "pasta", titel: "Pasta fresca", unter: "Täglich frisch, römisch gedacht", gerichte: [
      { id: "cacio", name: "Tonnarelli cacio e pepe", preis: 14.5, text: "Pecorino Romano, viel schwarzer Pfeffer, sonst nichts." },
      { id: "carbonara", name: "Rigatoni carbonara", preis: 15.5, text: "Guanciale, Eigelb, Pecorino Romano, Pfeffer. Ohne Sahne." },
      { id: "amatriciana", name: "Bucatini all’amatriciana", preis: 14.9, text: "Guanciale, San-Marzano-Tomate, Pecorino, ein Hauch Chili." },
      { id: "norma", name: "Paccheri alla Norma", preis: 14.5, text: "Gebratene Aubergine, Tomate, Basilikum, gesalzener Ricotta." },
      { id: "ravioli", name: "Ravioli ricotta e limone", preis: 15.9, text: "Handgefüllt, Salbeibutter, Zitronenabrieb, Parmigiano." },
      { id: "ragu", name: "Pappardelle al ragù", preis: 17.5, text: "Sechs Stunden geschmortes Rinderragù, Rotwein, Parmigiano." },
      { id: "funghi", name: "Tagliatelle ai porcini", preis: 18.5, text: "Steinpilze, Butter, Petersilie, Knoblauch, Parmigiano." },
      { id: "lasagna", name: "Lasagna al forno", preis: 15.9, text: "Frische Eierplatten, Ragù, Béchamel, im Holzofen gratiniert." }
    ]},
    { id: "dolci", titel: "Dolci", gerichte: [
      { id: "tiramisu", name: "Tiramisù", preis: 7.5, text: "Savoiardi, Espresso, Mascarpone, Kakao. Am Morgen geschichtet." },
      { id: "pannacotta", name: "Panna cotta", preis: 6.9, text: "Vanille, Amarenakirschen." },
      { id: "cannolo", name: "Cannolo", preis: 5.5, text: "Knusprige Rolle, erst bei Bestellung mit Ricotta und Pistazie gefüllt." },
      { id: "caprese", name: "Torta caprese", preis: 7.5, text: "Schokolade und Mandel, ohne Mehl, ein Löffel Mascarpone." },
      { id: "affogato", name: "Affogato", preis: 5.9, text: "Fior-di-latte-Eis, mit heißem Espresso übergossen." }
    ]},
    { id: "bevande", titel: "Bevande", gerichte: [
      { id: "acqua", name: "Acqua minerale", preis: 4.9, text: "Still oder frizzante, 0,75 l." },
      { id: "limonata", name: "Limonata della casa", preis: 4.5, text: "Zitrone, Rohrzucker, Soda, 0,4 l." },
      { id: "chinotto", name: "Chinotto", preis: 4.2, text: "Bittere Zitruslimonade, 0,275 l." },
      { id: "birra", name: "Birra chiara", preis: 4.9, text: "Helles Lagerbier aus Italien, 0,33 l." },
      { id: "rosso", name: "Primitivo, Glas", preis: 7.5, text: "Apulien, rund und dunkelfruchtig, 0,2 l." },
      { id: "bianco", name: "Falanghina, Glas", preis: 7.2, text: "Kampanien, frisch und mineralisch, 0,2 l." },
      { id: "espresso", name: "Espresso", preis: 2.6, text: "Kräftige Röstung, auch zum Mitnehmen." }
    ]}
  ],
  extras: [
    { id: "bufala", name: "Büffelmozzarella", preis: 2.5 },
    { id: "rucola", name: "Rucola", preis: 1.0 },
    { id: "oliven", name: "Taggiasca-Oliven", preis: 1.2 },
    { id: "parmigiano", name: "Parmigiano gehobelt", preis: 1.5 },
    { id: "chili", name: "Scharfes Öl", preis: 0.8 },
    { id: "basilikum", name: "Extra Basilikum", preis: 0.5 }
  ],
  demoHinweis: "Beispiel-Visualisierung · Demo von PROJEKT EX · erfundene Pizzeria, kein Live-Betrieb, keine echte Bestellung"
};
