# Mobil-Check Referenzseiten – Bericht je Seite (Stand 22.11.2026)

Messung: Playwright/Chromium, Handy-Emulation mit Touch bei 360, 390, 430 px und Tablet 768 px (teils zusätzlich 360×640, 390×664, 1024×768).
Je Seite: was mobil kaputt war, was geändert wurde (Dateien), wie geprüft wurde, offene Punkte und der Vorschlag für eine Hochformat-Fassung (9:16).
Screenshots (390 px) liegen im selben Ordner.

### holm (index, datenschutz, impressum, danke)
- **Kaputt:**
  - Seitenbreite 1197 px bei 360/390/430 und 1428 px bei 768. Ursache: Laufschrift `.kin` (nowrap, 15vw) blähte die Grid-Spalte auf 1121 px auf. Dadurch waren Überschrift und Absatz „Vier Gewerke“ rechts abgeschnitten, und bei 360 px lief die Holzwahl 29 px aus dem Bild.
  - Footer-Schriftzug abgeschnitten.
  - Menü-Panel hing fest bei `top:100px`: 36 px Lücke nach dem Scrollen; es blieb nach Tipp auf einen Eintrag offen.
  - Tablet hochkant: Vom 16:9-Film waren nur etwa 42 % zu sehen.
  - Hero per GSAP gepinnt; der Wechsel auf `position:fixed` ruckelt bei Touch-Scroll.
  - Film-Canvas wurde bei jedem Resize, also auch durch die Adressleiste, geleert.
  - Rechtstexte ohne Seitenrand; 9–11 Tap-Ziele < 44 px.
- **Geändert:**
  - `mobile-fix.css` (neu, gilt nur < 1060 px), in allen 4 HTML-Seiten eingebunden.
  - `js/holm.js`: Menü schließt bei Link, Esc und Tipp daneben; `ignoreMobileResize`; Hero auf Touch/< 1060 px ohne Pin (Scrub statt Pin).
  - `js/holmfilm.js`: Canvas wird nur bei echter Größenänderung neu aufgesetzt.
  - Tablet hochkant: Film wie am Handy, Bild oben, Text darunter.
- **Geprüft:**
  - scrollWidth 1197 → 360/390/430 und 1428 → 768.
  - Tap-Fehler 9–11 → 0, 0 Texte unter 12 px.
  - Desktop 1440: 16 Screenshots pixelgleich.
- **Offen:** Rechtstexte haben auch am Desktop keinen Seitenrand (nicht angefasst). Die Astro-Quelle braucht dieselben Änderungen.
- **Hochformat-Vorschlag:**
  - Film (218 Frames, 1280×720) neu rendern: 3:4 mit 1080×1440 (ausgeliefert als 720×960 WebP), oder 9:16 mit 1080×1920, wenn er vollflächig laufen soll. Motiv in den oberen 55 %.
  - Fokuspunkte: Stamm x≈0,58, Bohle x≈0,55, Maß mit Kamera ca. 30 % zurück, Korpus x≈0,6, Raum mit ganzer Nische.
  - Einbau: eine Zeile in `holmfilm.js` (`orientation:portrait` → Ordner `film/p/`).

### quartier (index, datenschutz, impressum, danke)
- **Kaputt:**
  - Kein mobiles Menü: Die Kapitel-Navigation war unter 760 px ersatzlos ausgeblendet.
  - 3D-Haus hochkant links und rechts abgeschnitten (festes vertikales Sichtfeld, auf dem Handy nur ca. 18° breit).
  - Renderer, Effekte und Film-Canvas nach `innerHeight` bemessen: bei jedem Adressleisten-Resize neu angelegt und geleert, Bild gestaucht (CSS `100lvh` ≠ Puffer); Karten-Pins mit demselben Versatz.
  - Querformat bekam die Hochformat-Frames.
  - Logo unsichtbar über dem hellen Exposé-Teil, Pin-Beschriftungen abgeschnitten.
  - Unterseiten mit toten Ankern; Logo-Link 14 px hoch.
- **Geändert:**
  - `mobile-fix.css` (neu) und `js/mobile-nav.js` (neu); Menü-Markup in `index.html`.
  - Unterseiten: tote Anker umgebogen.
  - `js/main.js` (Build-Bundle, gezielt gepatcht):
    - stabile Höhe auf Touch, reine Höhen-Resizes werden ignoriert;
    - Sichtfeld im Hochformat geweitet;
    - Frames nach Ausrichtung gewählt;
    - Pin-Labels am Rand nach innen.
- **Geprüft:**
  - Tap-Fehler 9 → 0 (Handy) und 14 → 0 (Tablet), kein Überlauf.
  - Menü listet alle 5 Kapitel plus Exposé.
  - Desktop: Unterseiten pixelgleich; Startseite mit identischem Layout-Snapshot (Bäume werden zufällig platziert, deshalb kein Pixelvergleich).
- **Offen:**
  - Die Sichtfeld-Weitung ist eine Übergangslösung; besser sind eigene Hochformat-Kameraposen in der Quelle.
  - Quelle von `main.js` braucht dieselben Patches.
  - Schon vorher vorhanden: Die Kapitel-Pill zeigt nach einem Sprung manchmal das falsche Kapitel.
- **Hochformat-Vorschlag:**
  - 3 Filmszenen als 9:16 mit 1080×1920 (ausgeliefert als 720×1280).
  - Fokuspunkte: Lobby x≈0,55, Wohnen x≈0,5, Dach x≈0,65 mit Himmel oben.
  - 3D: Kamera bei Hero, Haus und Finale etwa 1,6-fach zurück.

### feld (index, datenschutz, impressum, danke)
- **Kaputt:**
  - Ratgeber-Leiste: 1164 px breit in einem 390-px-Container mit `overflow:hidden`; Karte 2–3 und die Steuertermine waren auf Handy und Tablet nicht erreichbar.
  - Film: Die 16:9-Frames zeigten auf der Handy-Bühne nur 45 % der Breite, starr aus der Mitte. In der Gespräch-Szene waren beide Personen abgeschnitten. Auf dem Tablet waren es 42 % und ein dunkler Verlauf.
  - Kapiteltexte standen beim Übergang übereinander.
  - Hero-Video zeigte nur unscharfen Hintergrund.
  - 20 Tap-Ziele < 44 px, 3 Texte mit 11 px; Canvas wurde bei jedem Adressleisten-Resize neu angelegt.
- **Geändert:**
  - `assets/feld.css`: Block nur ≤ 960 px. Ratgeber wischbar mit Snap, Trefferflächen, Schrift ≥ 12 px, Video-Ausschnitt aufs Motiv, Tablet hochkant als gestapelte Bühne.
  - `assets/feldfilm.js` (≤ 960 px): Bildausschnitt folgt pro Frame dem Motiv, Kapiteltexte blenden nacheinander, Canvas nur bei echter Größenänderung neu.
  - HTML: nur Cache-Version.
- **Geprüft:**
  - 360/390/430/768 sowie 360×640, 390×664 und 1024×768.
  - Tap-Ziele 20 → 0, kleine Texte 3 → 0, Unterseiten 8/7/8 → 0.
  - Desktop pixelgleich (8 Scroll-Positionen).
- **Hochformat-Vorschlag:**
  - 242 Frames neu in 1080×1920 (Web: 720×1280 WebP).
  - Fokus je Szene: Stift 45 %, Akte 70 %, Raum 50 %, Fenster 55 %, Gespräch 72 % (Personen enger stellen), Unterschrift 63 %.
  - Loops `loop-desk` (72 %) und `loop-bogen` (60 %) in 1080×1920.

### alma (index, datenschutz, impressum, danke)
- **Kaputt:**
  - Das Probe-Objekt lag bei 390×664 und 360×640 in 8 von 10 Kapiteln auf dem Lauftext.
  - Eine Desktop-Regel schob die HUD-Instrumente mittig über Probe und Text; Beschriftungen 4–8 px.
  - Canvas aus `innerHeight`: Die Adressleiste skalierte das Bild, die Probe sprang.
  - 6 Tap-Ziele < 44 px.
  - Unterseiten-Menü zeigte auf alte Anker.
- **Geändert:**
  - `assets/v3.css` (≤ 800 px): Bühne `100lvh`, HUD unten in voller Breite, lesbare Beschriftungen, Schatten unter dem Lauftext, Schrift ≥ 12 px, Tap 44 px.
  - `assets/v3.js` (mobil): Puffer aus stabiler Bühnenhöhe; Probe gleitet in den freien Raum zwischen Text und HUD.
  - Unterseiten: Tap-Style, Menülinks auf aktuelle Kapitel.
- **Geprüft:**
  - Tap 6 → 0, kleine Texte 5 → 0, im Film keine Texte unter 12 px mehr (vorher 4,4–7,9 px); Unterseiten 6/5/5 → 0.
  - Menü mit allen 6 Punkten.
  - Desktop pixelgleich.
- **Hochformat:** Die 9:16-Fassung liegt schon vor (`film/v3/m`, 250 Frames), nichts weiter nötig.

### waermewerk (index, datenschutz, impressum, danke)
- **Kaputt:**
  - Scroll-Film: 16:9 als Vollbild auf 390×844, nur 24 % der Bildbreite sichtbar, etwa 2× hochskaliert, Schrift über dem halben Bild.
  - „Haus im Querschnitt“: Die Infokarte verdeckte Bild und Hotspots, die danach unerreichbar waren.
  - Menü blieb nach Linkwahl offen.
  - Schnee-Canvas sprang bei jeder Adressleisten-Bewegung.
  - 31 Tap-Ziele < 44 px (Hotspots 36, Regler 28, Checkbox 13, Logo 15); 4 Texte mit 11 px.
  - Menüpunkt `#check` ins Leere.
- **Geändert:**
  - `css/site.css` (≤ 900 bzw. 700 px): Film als gestapelte Bühne (Bild 58 %, Text darunter), Hotspots und Regler 44 px, Infokarte unter dem Bild, Schrift ≥ 12 px, kein Hover-Versatz bei Touch.
  - `js/app.js`: Menü schließt bei Linkwahl, Tipp daneben und Escape; Bildausschnitt folgt dem Motiv; Canvases und Schnee nur bei echter Größenänderung neu.
  - `index.html`: Checkbox im Label (ganze Zeile antippbar, Desktop-Geometrie identisch).
  - Unterseiten: `#check` → `#konfigurator`.
- **Geprüft:**
  - Tap 31 → 1 (der Rest ist ein unsichtbares Screenreader-Label), kleine Texte 4 → 0, Unterseiten 6/5/5 → 0.
  - Konfigurator und Anfrage per Touch durchgespielt.
  - Desktop pixelgleich.
- **Offen:** `js/check.js` wird von keiner Seite geladen, einen Check-Ablauf gibt es auf der Seite nicht.
- **Hochformat-Vorschlag:**
  - 97 Frames neu in 1080×1920.
  - Fokus: Garten mit Außengerät 56 → 34 % (Gerät im Bild halten), Fassade 55–60 %, Wohnzimmer 62–70 %.
  - Videos als 9:16-Crop: `hero` 60 %, `technik` 72 %, `wohnen` 72 %.

### lichtbogen (Start leitet auf stromausfall/; dazu haus/, schaltschrank/, je mit Rechner, Foto-Check, Jobs; außerdem versionen, datenschutz, impressum)
- **Kaputt:**
  - Intro „Strom weg?“ (stromausfall): Der 16:9-Film lag als 694×387-Streifen in einem 800 px hohen Bild, oben und unten schwarz.
  - 768 px: Seitenbreite 1144 statt 768. Die Schritt-Karten trugen die Klasse `.rv` (fest 360 px), der Notdienst-Knopf ragte aus der Hero-Spalte.
  - Tablet-Kopfzeile brach um; im Foto-Check war „Zählerschrank“ abgeschnitten.
  - 17–30 Tippflächen < 44 px pro Seite (Seitenmenü-Pillen 38 px, Haus-Schalter 41×32, Regler 34, Auslöser 33), bis zu 9 Texte < 12 px.
  - Szenen rechneten mit `innerHeight`: Die Adressleiste verschob Fortschritt und Zoom und baute die Leinwand neu auf.
  - `fx.js`: Ein negativer Ring-Radius konnte die Effekt-Schleife stoppen.
- **Geändert:**
  - `assets/css/style.css`: gemeinsamer Mobil-Block mit 44-px-Pillen (alle 4 passen bei 360), 44-px-Ziele, Silbentrennung, Tablet-Kopf ohne Umbruch.
  - `assets/css/v3.css`: Intro-Film füllt das Hochformat (`.k-wrap` ≥ 179,17svh breit), Karten < 1200 px repariert, Hero 720–1023 einspaltig.
  - `assets/js/v3.js` und `v1.js`: feste Bühnenhöhe bei Touch (`100svh`), reine Höhenänderungen werden ignoriert. `v1` bekommt unsichtbare Trefferflächen für die Haus-Schalter.
  - `assets/css/v2.css`: Beschriftungen 12 px.
  - `assets/js/fx.js`: Radius ≥ 0 (Bugfix, auch Desktop, optisch neutral).
  - `versionen.html`: Links mit 44 px Tippfläche.
  - Cache-Version in allen HTML-Seiten hochgezählt.
- **Geprüft:**
  - 15 Seiten bei 360/390/430/768.
  - 768: 1144 → 768. Tippflächen 17–30 → 0, kleine Texte bis 9 → 0.
  - Adressleisten-Simulation (800 → 730 → 800): Szene unverändert.
  - Desktop 1440: Layout plus 24 berechnete Stile je Element, 0 Abweichungen.
- **Offen:** Videos konnten headless (kein H.264) nur über Poster und Standbilder geprüft werden.
- **Hochformat-Vorschlag:**
  - `schalter.mp4` neu als 1080×1920 `schalter-p.mp4`. Ein Crop aus dem Master ergäbe nur 608×1080, zu unscharf.
  - Keyframes alle 6 Frames, gleiche Zeitmarken (1,7 / 3,5 / 5,45 / 6,7 / 7,9 s).
  - Hauptschalter mittig im oberen Drittel, Hand von unten rechts.
  - Einbau per `<source media="(max-width:719px) and (orientation:portrait)">`.
  - Dazu `kasten-m.jpg`, `kabel.jpg` und `kamera/mappe` jeweils als 1080×1920.

### ofen-olive (Startseite, Pizza-Builder, Reservierung)
- **Kaputt:**
  - Seitenbreite 389 bei 360 und 399–404 bei 390. Ursache: gedrehte Flammen- und Funkenboxen des Builders; lange Belagnamen über dem Rand.
  - Unter 820 px gab es kein Menü (Navigation ausgeblendet).
  - 24–26 Tippflächen < 44 px (S/M/L 40×35, Minus 21×21, Uhrzeiten 39), 65–67 Texte < 12 px.
  - Text über hellen Videos schlecht lesbar; Film rechnete mit `innerHeight`.
- **Geändert:**
  - `index.html` und `js/site.js`: Menü-Knopf; das Menü öffnet und schließt per Knopf, Link, Esc oder Tipp daneben und zeigt alle 5 Links.
  - Feste Bühnenhöhe bei Touch.
  - `css/site.css`: `overflow-x:clip` an der Builder-Sektion, `object-position` je Filmkapitel, stärkere Abdunklung, 44 px und 12 px.
  - `builder/builder.css` und `reservierung/reservierung.css`: 44-px-Ziele, Raster unter 390 px.
- **Geprüft:**
  - 360/390/430/768/1024: kein Überlauf, Tippflächen → 0, kleine Texte → 0.
  - Menü, Builder und Reservierung (4 Schritte) bei 360 und 390 px durchgespielt.
  - Desktop: 0 Abweichungen. Einzige Ausnahme ist ein Zeitslot, der von der Uhrzeit abhängt.
- **Offen:** Unter 900 px fehlen die „+“-Knöpfe in der Karte; das war schon so, bestellt wird über „Zur Bestellung“.
- **Hochformat-Vorschlag:**
  - 6 Kapitel-Filme als 1080×1920 (bzw. 720×1280 bei 1,5–2 Mbit/s), Einbau per `<source media="(max-aspect-ratio:3/4)">`.
  - Käse ist ideal fürs Hochformat; Teig als um 90° gedrehte Draufsicht.
  - Trattoria muss neu gedreht werden: Der Pizzaiolo wandert im Clip von 50 % auf 78 % und damit aus dem Ausschnitt.
  - Übergangsweise ist `object-position` gesetzt.

### ofen-olive-app
- **Kaputt:** 35 Tippflächen < 44 px (Kopf-Links 29, Zurück 40, Abholung/Lieferung 36, Mengen 36), 64–66 Texte < 12 px; kein Überlauf.
- **Geändert:** `app.css` (dazu die gemeinsamen `builder.css` und `reservierung.css`). Hinweisleiste mit 12 px, alle Bedienelemente ≥ 44 px unter 900 px bzw. bei Touch. Der Handy-Rahmen am Desktop bleibt unverändert.
- **Geprüft:** Tippflächen 35 → 0, kleine Texte → 0. Ablauf bauen → backen → Warenkorb → Bestellung → Push sowie die Reservierung durchgespielt.
- **Hochformat:** nicht nötig, die Videos füllen nur Karten bzw. den Hintergrund.

### warmherz (16 Seiten, inkl. foerderung.html, foto-check.html)
- **Kaputt:**
  - Horizontales Scrollen bei 360 px auf 7 Seiten: index 382, foto-check 389, jobs 382, ausbildung 380 (bei 768: 793), fachkraefte 380, ueber-uns 382, kontakt 425 (auch bei 390).
  - Bei 1024 px quer (Tablet) lief die Kopfleiste über den Rand (1066 px).
  - Menü mit offenem „Leistungen“ 760 px hoch bei 640 px Bildschirm: Jobs, Über uns und Kontakt waren unerreichbar, der Foto-Knopf lag darüber, es gab kein Schließen-Symbol.
  - Scroll-Video „−10 °C → 21 °C“ (122 Bilder, 16:9): Auf dem Handy war nur die Bildmitte zu sehen (26 %), die Wärmepumpe nie. Der Fortschritt rechnete mit `innerHeight`, die Leinwand wurde bei jedem Bild neu angelegt.
  - 9–23 Tippflächen < 44 px pro Seite (Schieberegler 8 px hoch, Hotspots 21–35, Brotkrumen 16), 3–9 Texte < 12 px.
- **Geändert:**
  - `assets/css/pages.css`: Block ≤ 1020 px und für Touch-Tablets quer.
    - Burger-Menü bis 1366 px quer bei Touch.
    - Menü mit X, scrollt selbst, 44-px-Zeilen.
    - Überläufe behoben (Grid-Spalten dürfen schrumpfen, Telefon-Mockup, E-Mail, Lernpfad).
    - Tippflächen, Mindestschrift, Schrittnamen sichtbar, Platz für den Foto-Knopf.
  - `assets/js/app.js`: Menü (Höhe, Esc), Wärmebild-Effekt nur mit Maus, größere Hotspot-Flächen bei Touch.
  - `assets/js/pages.js`:
    - Hochformat: Bild in den oberen 70 %, der Ausschnitt folgt dem Motiv (Wärmepumpe 80 % → Fenster 36 % → Familie 44 %).
    - Fortschritt aus der gepinnten Bühne; Leinwand nur bei Größenänderung neu, Pixeldichte max. 2.
- **Geprüft:**
  - 16 Seiten bei 360/390/430/768: Seitenbreite = Viewport, 0 Tippflächen, 0 kleine Texte. 1024 Touch: 1066 → 1024.
  - Foto-Check bei 360 px komplett durchgespielt (3 Fotos hochladen, Absenden → Akte angezeigt).
  - Förderrechner per Touch (Regler, Auswahl, Kind-Schalter, Einkommen).
  - Desktop 1440: alle 16 Seiten mit 0 Abweichungen in Stilen und Maßen; die Scroll-Video-Szene pixelgleich.
- **Hochformat-Vorschlag:**
  - Bildfolge neu in 9:16 mit 720×1280 (oder 1080×1920), 122 Bilder.
  - Bild 1–50 mit Wärmepumpe mittig, dann Fahrt zum Fenster (50–64), Familie im mittleren Drittel (64–122).
  - Unteres Drittel ruhig für Temperatur und Texte.
  - Notdienst-Film optional 1080×1920 mit Fokus auf den Techniker.

### volta (index, datenschutz, impressum, danke), Astro-Export
- **Kaputt:**
  - „Ein Dienstag mit VOLTA“ (gestapelt bis 1000 px): Der 16:9-Film lag gestreckt über 2659 px Höhe, sichtbar waren nur etwa 8 % der Bildbreite.
  - Der Film wurde per Scroll gespult, hat aber nur 1 Schlüsselbild auf 242 Bilder → starkes Ruckeln auf Touch.
  - Kennzahlen lagen über der letzten Karte, Chips quer über den Karten; Höhe aus `innerHeight`.
  - 6 Tippflächen < 44 px, 10 Texte mit 11 px.
- **Geändert:**
  - `assets/volta-mobile.css` (neu, in allen 4 Seiten): Film als bildschirmhohe Sticky-Bühne hinter den Karten (`100svh`), Kennzahlen als Zeile, Tippflächen und 12 px.
  - `assets/volta-enhance.js`: Bis 1000 px bzw. bei Touch läuft der Film als stumme Schleife (nur sichtbar) statt gespult zu werden. Der Ausschnitt folgt dem Motiv (Kartenmonitor 25 % → Stadt 50 %). Höhe bei Touch nur bei Breitenänderung neu gemessen. Desktop spult wie bisher.
- **Geprüft:**
  - Tippflächen 6 → 0 (der Rest ist ein 1-px-Screenreader-Label), kleine Texte 10 → 0, Unterseiten 5–6 → 0.
  - Menü mit allen 6 Punkten; 1024/1180 Touch geprüft.
  - Desktop: 0 Abweichungen.
- **Offen:**
  - Auf Touch-Tablets quer (ab 1001 px) bleibt der horizontale Pin aus dem Bundle; `anticipatePin` lässt sich nur im Quellprojekt setzen.
  - Die Astro-Quelle braucht dieselben Änderungen.
- **Hochformat-Vorschlag:**
  - `ot.mp4` als 1080×1920. Motiv-Mitte: Schreibtisch 25 %, Glasplatten 45 %, Dashboard in der Mitte, Stadt 45–50 %.
  - Mit Schlüsselbild alle 1–6 Bilder kodieren, dann ruckelt das Spulen auch am Desktop nicht.
  - `loop.mp4` als 1080×1920 mit Mitte bei 30 %.

### lumen (index, datenschutz, impressum, danke)
- **Kaputt:**
  - Hero-Film (16:9 im 4:5-Rahmen, 45 % sichtbar, mittig): Der Olivenbaum (zwischen 12 und 42 % der Breite) war meist halb oder ganz abgeschnitten.
  - Menü schob die Seite nach unten; beim Schließen sprang die Scrollposition von 500 auf 27 px.
  - Lounge-Film hinter „Praxis“ und „Termin“ über die volle Abschnittshöhe gestreckt: nur ein Streifen Vorhang sichtbar.
  - Fester Hintergrund mit `inset:0` änderte seine Größe mit der Adressleiste.
  - 3–7 Tippflächen < 44 px.
- **Geändert:** `assets/lumen.css`, Block ≤ 980/700 px bzw. Touch.
  - Menü liegt über der Seite und scrollt selbst.
  - Hero und Fußzeilen-Film mit `object-position` 22 % (Baum).
  - Lounge-Film als Sticky-Bühne in `svh` (Ausschnitt 30 %), Hintergrund `100lvh`.
  - Tippflächen ≥ 44 px.
- **Geprüft:**
  - Tippflächen → 0, kleine Texte 0, Seitenbreite = Viewport.
  - Menü öffnet und schließt ohne Sprung.
  - Desktop: 0 Abweichungen.
- **Hochformat-Vorschlag:**
  - `hero.mp4` als 4:5 (1080×1350) und 9:16 (1080×1920), Baum im mittleren Drittel.
  - `lounge.mp4` als 1080×1920 mit Mitte bei 30 %, Tisch im unteren Drittel.
  - `room.mp4` und `caustics.mp4` brauchen keine eigene Fassung.

### nivora (Start, Shop, 6 Kollektionen, 18 Produktseiten inkl. glacier-shell), Next-Export
- **Kaputt:**
  - Kein Überlauf, aber sehr viele zu kleine Elemente (Tap-Flächen / Texte unter 12 px, kleinste Texte 3,5–5 px):

    | Seite | Tap-Flächen | Texte < 12 px |
    |---|---|---|
    | Start (390) | 74 | 159 |
    | Start (768) | 78 | 165 |
    | glacier-shell | 18 | 62 |
    | Shop | 34 | 94 |
    | Kollektion „alle“ | 77 | 111 |

  - Der Demo-Hinweis verdeckte die Abschnitts-Navigation 01–04.
  - Im Handy-Menü fehlte „Alpine Map/World“ auf Kollektions- und Produktseiten.
  - Film-Dialog im Hochformat als 364×195-Streifen.
  - Technik-Abschnitt bei 768: Überschrift vom Jackenbild verdeckt.
  - „In die Tasche“ blieb 25 px versetzt (CSS-Transition gegen GSAP).
- **Geändert:**
  - CSS an 7 Chunks in `_next/static/chunks/` angehängt, alles ≤ 900 px:
    - Mindestschrift: Labels 12 px, Fließtext 13–15 px, Felder 16 px. Die Regeln sind in Kaskadenreihenfolge wiederholt.
    - Tap-Flächen 44 px, bei kleiner Optik über Pseudo-Element oder Polster.
    - Abstände zum Demo-Hinweis, Tablet-Technik gestapelt.
    - Film-Dialog im Hochformat als 4:5 mit Fokuspunkt.
  - Neue Datei `mobile-nav.js` (in 24 HTML-Seiten): ergänzt fehlende Menüeinträge.
- **Geprüft:**
  - 9 Seiten bei 360/390/430/768.
  - Start 74/159 → 1/1, Shop 34/94 → 1/0, Kollektion 77/111 → 0/0, glacier-shell 18/62 → 0/0. Die Reste sind ein 1-px-Screenreader-Label und der bewusst ausgeblendete Text „Merkliste (0)“.
  - Warenkorb, Film-Dialog, 360°-Foto, Karte und Farb-/Größenwahl per Touch durchgespielt; keine Hydrierungsfehler.
  - Desktop 1440 pixelgleich.
- **Offen:**
  - Tablet quer (1024) zeigt weiter das Desktop-Layout mit sehr kleinen Labels; eine Änderung dort würde den Desktop-Look ändern.
  - Bei 360 px scrollt die Abschnitts-Navigation (8 × 44 px) seitlich.
  - Das Next-Quellprojekt braucht dieselben Regeln.
- **Hochformat-Vorschlag:**
  - „The first light“ als 4:5 mit 1152×1440, Grat mittig.
  - „The perfect line“ als 9:16 mit 1080×1920 aus einem 1215×2160-Ausschnitt, der dem Skifahrer folgt (x 52–58 %).

### flutlicht27, Next-Export
- **Kaputt:**
  - Tap-Flächen / kleine Texte 15/17 (390) bzw. 20/16 (768).
  - Kein Handy-Menü unter 720 px.
  - Bei 768 schob die Desktop-Leiste „Court buchen“ über den Rand.
  - Szene rechnete mit `innerHeight`: Höhe 800 → 870 bei gleicher Scrollposition änderte bis zu 67 Stilwerte.
  - Fortschrittsleiste mit 9,5-px-Labels abgeschnitten.
- **Geändert:**
  - CSS an `_next/static/chunks/38wm2-8_ru5hf.css` angehängt: Menü-Styles, Mindestgrößen, zweizeilige Fortschrittsleiste, Video-Fokus (Clip 1: 38 %, Clip 3: 54 %).
  - `1jhdp-yxblr-q.js`: `innerHeight` → `__pexH()` (stabile Höhe auf Touch).
  - Neue Datei `mobile.js` (Menü-Knopf nach der Hydrierung, Höhe), eingebunden in `index.html`.
- **Geprüft:**
  - 0/0 bei 360/390/430/768, Seitenbreite = Viewport.
  - Menü mit allen 5 Zielen.
  - Adressleisten-Simulation: 0 statt 67 geänderte Werte.
  - Desktop pixelgleich.
- **Offen:** Clip 2 (Match) verliert im mittigen Ausschnitt die vorderen Spieler.
- **Hochformat-Vorschlag:** `clip1`–`clip3` als 1080×1920 neu exportieren. Ein Crop ergäbe nur 608×1080. Clip 2 neu framen (Spieler bei 18 % und 75 %).

### flutlicht27-app, Next-Export
- **Kaputt:** Tab-Leiste 10,5 px; Zeitslots 42, Segmente 38, Chips 38, Plus/Minus 32×32, Schließen 40×40 px.
- **Geändert:**
  - CSS an `0gumuud6xv4_u.css` angehängt (nur < 900 px; darüber bleibt der Telefon-Rahmen).
  - `sw.js`: Cache-Name auf `fl27-app-v2`, damit niemand die alte CSS aus dem Offline-Speicher bekommt.
- **Geprüft:** 2/10 → 0/0 bei 360–768; alle 5 Tabs, Court-Ansicht und Bestellleiste geprüft. Desktop: Layout identisch.

