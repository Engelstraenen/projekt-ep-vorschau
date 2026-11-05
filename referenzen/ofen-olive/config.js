/* Gemeinsame Konfiguration fuer Website- und App-Demo. Name, Ort, Logo, Karte hier tauschen. */
const PIZZEN = [
  { id: "margherita", name: "Margherita", preis: 9.5, bild: "img/p-margherita.webp",
    text: "San-Marzano-Tomate, Fior di Latte, Basilikum, Olivenöl aus Apulien." },
  { id: "quattro", name: "Quattro Formaggi", preis: 12.9, bild: "img/p-quattro.webp",
    text: "Fior di Latte, Gorgonzola dolce, Fontina, Parmigiano 24 Monate." },
  { id: "prosciutto", name: "Prosciutto & Burrata", preis: 14.5, bild: "img/p-prosciutto.webp",
    text: "Prosciutto di Parma, Burrata aus Apulien, Rucola, nach dem Backen belegt." },
  { id: "diavola", name: "Diavola", preis: 11.9, bild: "img/p-diavola.webp",
    text: "Salame piccante, Tomate, Fior di Latte, Chili-Öl aus dem eigenen Ansatz." }
];

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
  pizzen: PIZZEN,
  // Ganze Karte (Website-Kapitel + App-Bestellmenue). Die vier Builder-Pizzen (PIZZEN) stehen in der Sektion "pizze" vorne.
  // typ "pizza" = oeffnet in der App das Groessen/Extras-Sheet, sonst direkt in den Warenkorb.
  karte: [
    { id: "antipasti", titel: "Antipasti", unter: "Zum Teilen, solange der Ofen vorheizt", gerichte: [
      { id: "focaccia", bild: "img/d-focaccia.webp", name: "Focaccia dal forno", preis: 6.5, text: "Aus unserem Pizzateig, Rosmarin, Meersalz, kalt gepresstes Olivenöl." },
      { id: "burrata", bild: "img/d-burrata.webp", name: "Burrata", preis: 12.5, text: "Ganze Burrata, geröstete Kirschtomaten, Basilikumöl, geröstetes Brot." },
      { id: "arancini", bild: "img/d-arancini.webp", name: "Arancini al ragù", preis: 9.5, text: "Drei Reisbällchen, Rinderragù, Erbsen, Caciocavallo im Kern." },
      { id: "vitello", bild: "img/d-vitello.webp", name: "Vitello tonnato", preis: 14.9, text: "Rosa Kalbsnuss, dünn geschnitten, Thunfischcreme, Kapernäpfel." },
      { id: "carpaccio", bild: "img/d-carpaccio.webp", name: "Carpaccio di manzo", preis: 15.5, text: "Rinderhüfte roh, Rucola, Parmigiano, Zitrone, schwarzer Pfeffer." },
      { id: "tagliere", bild: "img/d-tagliere.webp", name: "Tagliere per due", preis: 19.9, text: "Prosciutto di Parma 18 Monate, Mortadella, Pecorino, Oliven, Focaccia. Für zwei." }
    ]},
    { id: "insalate", titel: "Insalate", gerichte: [
      { id: "finocchi", bild: "img/d-finocchi.webp", name: "Finocchi e arance", preis: 10.5, text: "Fenchel hauchdünn, Orange, schwarze Oliven, Minze, Olivenöl." },
      { id: "pera", bild: "img/d-pera.webp", name: "Rucola e pera", preis: 11.5, text: "Rucola, Birne, Pecorino, Walnüsse, alter Balsamico." },
      { id: "panzanella", bild: "img/d-panzanella.webp", name: "Panzanella", preis: 10.9, text: "Tomaten, Gurke, rote Zwiebel, Brot vom Vortag, Rotweinessig." }
    ]},
    { id: "pizze", titel: "Pizze", unter: "Napoletana · 48 Stunden Teigführung · 90 Sekunden bei 450 °C", gerichte: [
      ...PIZZEN.map(p => ({ ...p, typ: "pizza" })),
      { id: "marinara", bild: "img/d-marinara.webp", typ: "pizza", name: "Marinara", preis: 8.5, text: "San-Marzano-Tomate, Knoblauch, Oregano, Olivenöl. Ohne Käse, wie sie sein soll." },
      { id: "capricciosa", bild: "img/d-capricciosa.webp", typ: "pizza", name: "Capricciosa", preis: 13.5, text: "Kochschinken, Champignons, Artischocken, Oliven, Fior di Latte." },
      { id: "ortolana", bild: "img/d-ortolana.webp", typ: "pizza", name: "Ortolana", preis: 12.9, text: "Zucchini, Aubergine, Paprika aus dem Ofen, Fior di Latte, Basilikum." },
      { id: "nduja", bild: "img/d-nduja.webp", typ: "pizza", name: "’Nduja e stracciatella", preis: 14.5, text: "Scharfe kalabrische ’Nduja, Tomate, nach dem Backen kühle Stracciatella.", tag: "scharf" },
      { id: "salsiccia", bild: "img/d-salsiccia.webp", typ: "pizza", name: "Salsiccia e friarielli", preis: 14.9, text: "Bianca: Fenchelsalsiccia, Stängelkohl, Provola affumicata, Chili." },
      { id: "porcini", bild: "img/d-porcini.webp", typ: "pizza", name: "Porcini", preis: 15.9, text: "Bianca: Steinpilze, Fior di Latte, Thymian, Parmigiano, Knoblauchöl." },
      { id: "mortadella", bild: "img/d-mortadella.webp", typ: "pizza", name: "Mortadella e pistacchio", preis: 15.5, text: "Bianca: Mortadella aus Bologna, Pistaziencreme, Burrata, Zitronenabrieb." },
      { id: "tartufo", bild: "img/d-tartufo.webp", typ: "pizza", name: "Tartufo", preis: 19.5, text: "Bianca: Fior di Latte, Pecorino, frisch gehobelter Sommertrüffel. Solange Saison." }
    ]},
    { id: "pasta", titel: "Pasta fresca", unter: "Täglich frisch, römisch gedacht", gerichte: [
      { id: "cacio", bild: "img/d-cacio.webp", name: "Tonnarelli cacio e pepe", preis: 14.5, text: "Pecorino Romano, viel schwarzer Pfeffer, sonst nichts." },
      { id: "carbonara", bild: "img/d-carbonara.webp", name: "Rigatoni carbonara", preis: 15.5, text: "Guanciale, Eigelb, Pecorino Romano, Pfeffer. Ohne Sahne." },
      { id: "amatriciana", bild: "img/d-amatriciana.webp", name: "Bucatini all’amatriciana", preis: 14.9, text: "Guanciale, San-Marzano-Tomate, Pecorino, ein Hauch Chili." },
      { id: "norma", bild: "img/d-norma.webp", name: "Paccheri alla Norma", preis: 14.5, text: "Gebratene Aubergine, Tomate, Basilikum, gesalzener Ricotta." },
      { id: "ravioli", bild: "img/d-ravioli.webp", name: "Ravioli ricotta e limone", preis: 15.9, text: "Handgefüllt, Salbeibutter, Zitronenabrieb, Parmigiano." },
      { id: "ragu", bild: "img/d-ragu.webp", name: "Pappardelle al ragù", preis: 17.5, text: "Sechs Stunden geschmortes Rinderragù, Rotwein, Parmigiano." },
      { id: "funghi", bild: "img/d-funghi.webp", name: "Tagliatelle ai porcini", preis: 18.5, text: "Steinpilze, Butter, Petersilie, Knoblauch, Parmigiano." },
      { id: "lasagna", bild: "img/d-lasagna.webp", name: "Lasagna al forno", preis: 15.9, text: "Frische Eierplatten, Ragù, Béchamel, im Holzofen gratiniert." }
    ]},
    { id: "dolci", titel: "Dolci", gerichte: [
      { id: "tiramisu", bild: "img/d-tiramisu.webp", name: "Tiramisù", preis: 7.5, text: "Savoiardi, Espresso, Mascarpone, Kakao. Am Morgen geschichtet." },
      { id: "pannacotta", bild: "img/d-pannacotta.webp", name: "Panna cotta", preis: 6.9, text: "Vanille, Amarenakirschen." },
      { id: "cannolo", bild: "img/d-cannolo.webp", name: "Cannolo", preis: 5.5, text: "Knusprige Rolle, erst bei Bestellung mit Ricotta und Pistazie gefüllt." },
      { id: "caprese", bild: "img/d-caprese.webp", name: "Torta caprese", preis: 7.5, text: "Schokolade und Mandel, ohne Mehl, ein Löffel Mascarpone." },
      { id: "affogato", bild: "img/d-affogato.webp", name: "Affogato", preis: 5.9, text: "Fior-di-latte-Eis, mit heißem Espresso übergossen." }
    ]},
    { id: "bevande", titel: "Bevande", gerichte: [
      { id: "acqua", bild: "img/d-acqua.webp", name: "Acqua minerale", preis: 4.9, text: "Still oder frizzante, 0,75 l." },
      { id: "limonata", bild: "img/d-limonata.webp", name: "Limonata della casa", preis: 4.5, text: "Zitrone, Rohrzucker, Soda, 0,4 l." },
      { id: "chinotto", bild: "img/d-chinotto.webp", name: "Chinotto", preis: 4.2, text: "Bittere Zitruslimonade, 0,275 l." },
      { id: "birra", bild: "img/d-birra.webp", name: "Birra chiara", preis: 4.9, text: "Helles Lagerbier aus Italien, 0,33 l." },
      { id: "rosso", bild: "img/d-rosso.webp", name: "Primitivo, Glas", preis: 7.5, text: "Apulien, rund und dunkelfruchtig, 0,2 l." },
      { id: "bianco", bild: "img/d-bianco.webp", name: "Falanghina, Glas", preis: 7.2, text: "Kampanien, frisch und mineralisch, 0,2 l." },
      { id: "espresso", bild: "img/d-espresso.webp", name: "Espresso", preis: 2.6, text: "Kräftige Röstung, auch zum Mitnehmen." }
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
