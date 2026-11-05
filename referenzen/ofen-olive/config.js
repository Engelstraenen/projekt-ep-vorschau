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
