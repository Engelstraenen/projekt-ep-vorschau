# Auftrag an Claude Code: Funktionscheck projektex.de ist ROT

Stand der Prüfung: 23.11.2026, 00:39 Uhr (Europe/Berlin). Bericht und Screenshots: `/workspace/ep-hq/coach/webseiten-checks/2026-11-23/`. Repo: `Engelstraenen/projekt-ep-vorschau`, Ausgangslage `main` (Commit `67edcfc`, nach Merge von PR 34). Diesen Auftrag in der bestehenden Sitzung bzw. auf dem Branch von [PR #35](https://github.com/Engelstraenen/projekt-ep-vorschau/pull/35) (`claude/startseite-mobil-minimal`) weiterführen.

An der Live-Seite und an `main` wird nichts geändert, solange Eugen nicht selbst ja gesagt hat.

## Verbindliche Regeln

- Desktop-Design und Inhalte bleiben unverändert.
- Nur Fehler beheben, keine „Verbesserungen“, keine neuen Elemente, keine umgestalteten Abschnitte.
- Eugens Regel: Die Seiten bleiben, wie sie waren. Sie sollen nur funktionieren.
- Ein PR, nicht mergen, nicht deployen. Livegang erst nach Eugens eigenem Ja.
- Vorschau über GitHub Pages (wie bei PR #35 vorgesehen, z. B. Ordner in `demo-getlayers-01`). Keine raw.githack-Links: raw.githack liefert große Bilder und Videos nicht zuverlässig.
- Die Startseite in PR #35 weiterführen, keinen zweiten PR nur für die Startseite öffnen. Die übrigen Befunde dürfen im selben PR liegen.
- Den Fehler vom 20.11. nicht wiederholen: In `fitChapters` darf die Kapitelhöhe nicht aus der gemessenen Fotohöhe kommen, während das Foto gleichzeitig die freie Höhe füllt. Das hat auf dem iPhone zu endlos wachsenden, leeren Flächen geführt.
- Keine Geheimnisse, keine Kundendaten, keine Passwörter, keine internen Preise in Commits, Kommentaren oder der Vorschau.
- Erledigt ist der Auftrag erst, wenn `webseiten-funktionscheck` gegen die Vorschau **GRÜN** meldet (siehe Abschnitt „Prüfprogramm“). Einzelne Punkte als „Check-Falschmeldung“ zu markieren reicht nicht, solange der Lauf ROT bleibt – außer es ist unten ausdrücklich als Falschmeldung beschrieben und ohne Designänderung nicht behebbar. Solche Fälle kurz im PR begründen.

## Was PR #35 schon abdeckt – und was nicht

PR #35 ändert nur `index.html` und die CSP-Hashes in `.htaccess` (plus Abgleich-Bilder unter `docs/`).

Bereits angegangen (Startseite, unter 861 px):

- Die Rückkopplung der Kapitelhöhe vom 20.11. (Commit `09fa30b`) ist zurückgenommen. Die Seitenhöhe soll wieder stabil sein.
- Texte, die am Handy zuvor ausgeblendet waren (Schrittlisten, Schlagwort-Zeilen, Zusatzabsatz Ads, Zeile im Start-Abschnitt), werden wieder gezeigt, damit die Handy-Seite dieselben Inhalte hat wie der Desktop.
- Querformat: fehlende Gegenregel für Kapitel mit Bild rechts; `fitChapters` gibt auch quer einen Überhang.

Nicht abgedeckt und in diesem Auftrag zu erledigen:

- Überlappung Menü / × auf der Startseite (PR #35 ändert daran nichts).
- Ob die Links „im Detail“, „entdecken“, „Alle Clips ansehen“ und WhatsApp den Funktionscheck bestehen. Der Check misst nach `scrollIntoView({block:'start'})` am Kapitel, ob der Link im ersten Viewport liegt (`r.top > vh - 8`). Wenn ein Kapitel mit Foto 3:2 plus vollständigem Text höher ist als der Viewport, bleibt der Link unten außerhalb – genau das Bild vom 20.11., nur ohne das endlose Wachstum. Die Links müssen erreichbar und antippbar sein, ohne die Rückkopplung vom 20.11. und ohne Desktop-Änderung. Nicht erneut Fotos in einer Feedback-Schleife schrumpfen.
- Alle übrigen Befunde (Überlauf Löschservice und Websites, Videos, 404/500 durch saubere URLs, überdeckte Schaltflächen, systematischer 4-px-Überlauf auf Pixel-7).

---

## Befunde

### 1. Startseite: „im Detail“-Links, WhatsApp, Menü / ×

- **URL:** `https://projektex.de/`
- **Datei:** `index.html`
- **Geräte:** iPhone-13 (390×844) und Pixel-7 (412×915)
- **Befund:** Nach dem Scrollen an den Kapitelanfang liegen die Links außerhalb des sichtbaren Bereichs, typisch y≈1800–3700 px bei 844 bzw. 915 px Viewport: Automatisierung & Chatbots im Detail (`#automatisierung`), Bewertungs-Löschservice im Detail (`#loesch`), Alle Clips ansehen (`#film`), Ads-Management im Detail (`#ads`), Newsletter-Marketing im Detail (`#newsletter`), Print Design entdecken (`#print`), Merch-Produktion entdecken (`#merch`), WhatsApp (`#kontakt`). Zusätzlich überlappen die Elemente „Menü“ und „×“.
- **Vermutete Ursache:**
  - Links: dieselben Vollbild-Kapitel wie am 20.11. Der Check verlangt, dass `a.more` / der Kapitel-Link nach `scrollIntoView({block:'start'})` im Viewport liegt. PR #35 stellt den Stand vor dem 20.11. wieder her (Kapitel darf höher sein als der Viewport). Das behebt die leeren Flächen, besteht den Check aber nur, wenn der Link im ersten Viewport des Kapitels wirklich sichtbar und antippbar ist.
  - Menü / ×: Der Film-Dialog `.kino` ist `position:fixed; inset:0; opacity:0; pointer-events:none`, aber nicht `visibility:hidden` oder `display:none`. Der Schließen-Knopf (Text „×“, `aria-label="Video schließen"`, `position:absolute; top:18px; right:18px`) liegt geometrisch über dem Menü-Knopf rechts oben. Der Check ignoriert `opacity:0` und `inert`. Der Dialog ist geschlossen und nicht bedienbar; sichtbar soll er so bleiben, bis er geöffnet wird.
- **Akzeptanz:** Am Handy (320–430 px hochkant und quer) sind die genannten Links im jeweiligen Kapitel sichtbar und antippbar, ohne dass die Seite wächst oder Inhalte verloren gehen. Menü und × überlappen im geschlossenen Zustand nicht mehr (z. B. `.kino` ohne `.open` vollständig aus dem Trefferbereich nehmen, ohne das geöffnete Erscheinungsbild zu ändern). Desktop unverändert. Der Check meldet für die Startseite keine `cta-abgeschnitten` und keine Überlappung Menü / ×.

### 2. Bewertungs-Löschservice: 984 px Breite bei 390 px Viewport

- **URL:** `https://projektex.de/leistungen/bewertungs-loeschservice`
- **Datei:** `leistungen/bewertungs-loeschservice.html`
- **Geräte:** iPhone-13 984 px bei 390 px; Pixel-7 986 px bei 412 px
- **Vermutete Ursache:** In `@media (max-width: 980px)` steht `.nl-fig img { width: 960px; max-width: none; }`. 960 px plus äußerer Abstand ergeben etwa 984 px. Die Klasse `.nl-fig-scroll` (`max-width:100%; overflow-x:auto`) ist im CSS definiert, im HTML aber nicht verwendet. Das Bild sitzt in `<figure class="nl-fig">` ohne diese Hülle. `sizes` am Bild sagt für schmale Viewports `92vw`, der CSS-Zwang auf 960 px widerspricht dem. `html`/`body` haben `overflow-x: clip`, deshalb gibt es oft keine sichtbare Quer-Leiste, `document.documentElement.scrollWidth` ist trotzdem 984 px.
- **Akzeptanz:** `scrollWidth` höchstens Viewport + 3 px auf 390 und 412 px Breite. Am Desktop bleibt das Bild wie bisher. Keine neue Gestaltung, nur den Überlauf der Seite beseitigen (Bild an die Viewport-Breite binden oder die bereits vorgesehene Scroll-Hülle so nutzen, dass nicht die ganze Seite 960 px breit wird).

### 3. /leistungen/websites: 21 px Überlauf auf dem iPhone

- **URL:** `https://projektex.de/leistungen/websites`
- **Dateien:** `leistungen/websites.html` sowie eingebundene Styles `assets/showcase.css`, `assets/sub.css`, `assets/nav.css`, `assets/themen.css`, `assets/ep-fx.css`
- **Geräte:** iPhone-13 411 px bei 390 px (21 px); Pixel-7 416 px bei 412 px (siehe auch Befund 8)
- **Vermutete Ursache:** Das genaue Element muss im DOM gemessen werden (`scrollWidth`, welches Kind über den Viewport ragt). 21 px bei typischem Seitenrand passen zu einem Klassiker: `width: 100vw` in einem bereits gepaddeten Layout. Auch Raster wie `.sc-shots` in `assets/showcase.css` (unter 700 px drei Kacheln, davon eine Handy-Kachel mit 5 px Outline) kommen als Quelle in Frage. `overflow-x: clip` kann den Balken verstecken, der Check misst trotzdem die Scrollbreite.
- **Akzeptanz:** Kein horizontaler Überlauf über die Toleranz von 3 px auf 390 und 412 px. Desktop unverändert, Kacheln und Vorschaubilder bleiben inhaltlich gleich.

### 4. Scroll-Videos starten nicht, Dateien sind aber erreichbar

- **URLs / Quellen:**
  - Seite `https://projektex.de/leistungen/websites`, Dateien `leistungen/websites.html` und `assets/autoplay.js`. Videos `https://projektex.de/video/websites/alma-scroll.webm` (und mp4), ebenso `ofen-olive-scroll`, `flutlicht27-scroll`, `lichtbogen-scroll`, `eiswerk-scroll` (Ordner `video/websites/`).
  - Seite `https://projektex.de/referenzen/feld/`, Datei `referenzen/feld/index.html`, Video `referenzen/feld/film/loop-bogen.mp4`.
  - Eiswerk-Demo (nicht in diesem Repo): `https://engelstraenen.github.io/eiswerk-site/`, Datei `assets/video/eis-portrait.mp4` im Repo `Engelstraenen/eiswerk-site`.
- **Live-Check per curl (23.11., nach der Prüfung):** Alle genannten Dateien auf projektex.de liefern HTTP 206, `Content-Type` video/webm bzw. video/mp4. `eis-portrait.mp4` auf github.io ebenfalls 206 (ca. 7,7 MB). CSP der Marketing-Seiten erlaubt `media-src 'self' blob:`. Die Pfade stimmen, die Dateien fehlen nicht.
- **Was der Check gesehen hat:**
  - Scroll-Vorschauen auf /leistungen/websites: `readyState=4`, `currentTime=0` (Datei geladen, keine sichtbare Wiedergabe). Ausnahme iPhone: `eiswerk-scroll.webm` einmal mit `currentTime=0,0576` (knapp über der Schwelle 0,05). Desktop: alle fünf inkl. eiswerk bei 0.
  - `loop-bogen.mp4`: `readyState=0`, `currentTime=0` (nicht einmal geladen). Es sitzt als Hintergrund in `#erstgespraech` (`preload="none"`, kein `autoplay` im Markup, im Gegensatz zum Hero-Video `film/loop-desk.mp4`).
  - `eis-portrait.mp4`: `readyState=1`, `currentTime=0`. Andere Portrait-Videos auf derselben Demo-Seite liefen.
- **Vermutete Ursache:** `assets/autoplay.js` startet Videos nur, wenn sie zu mindestens 25 % im Viewport sind (`IntersectionObserver`, `threshold: 0.25`), und pausiert sie sonst sofort wieder. Der Funktionscheck ruft `play()` auf allen `video`-Elementen von oben auf der Seite auf, ohne zu jedem Video zu scrollen, und wertet nach kurzer Wartezeit `currentTime` aus. Offene Videos unterhalb des Falzes werden dadurch typischerweise wieder pausiert (`readyState=4`, `currentTime=0`). Das Pausieren außerhalb des Bildes ist gewolltes Verhalten und darf nicht entfernt werden.
- **Was zu tun ist:**
  - Nicht das Autoplay-außerhalb-des-Bildes abschaffen.
  - Prüfen, dass ein Scroll-Preview **wirklich startet**, sobald seine Karte sichtbar ist (stumm, `playsinline`, Loop). Wenn ein im Viewport liegendes Video nicht startet, dort den Fehler suchen (fehlendes muted/playsinline, Observer, Sperre, Quelle).
  - `loop-bogen.mp4`: prüfen, warum `readyState` 0 bleibt, sobald der Abschnitt `#erstgespraech` sichtbar ist; Datei und Pfad sind korrekt. Nicht das Aussehen des Abschnitts ändern.
  - `eis-portrait.mp4` liegt nicht in `projekt-ep-vorschau`. Wenn der Check die externe Demo weiter prüft und ROT bleibt, den Fix im Repo `eiswerk-site` vorbereiten oder den Blocker im PR benennen. Keine Designänderung, nur Wiedergabe.
- **Akzeptanz:** Sichtbare Vorschauvideos auf /leistungen/websites (alma, ofen-olive, flutlicht27, lichtbogen, eiswerk) spielen stumm, sobald sie im Bild sind. `loop-bogen.mp4` spielt, wenn der Erstgespräch-Abschnitt sichtbar ist. Der Check soll für diese Quellen kein „spielt nicht“ mehr melden. Wenn ein Rest-ROT nur daher kommt, dass der Check Off-Screen-Videos ohne Hinscrollen testet, das im PR sachlich belegen (und nur dann; Ziel bleibt GRÜN).

### 5. 404 und 500: Dateien sind da, die relativen Pfade brechen unter sauberen URLs

Ursache überall gleich: Apache schreibt intern `/pfad/` auf `/pfad.html`, die Adresszeile behält den Schrägstrich. Relative Pfade wie `../assets/…` oder `assets/…` werden dann eine Ebene zu tief aufgelöst. Die Dateien liegen im Repo, sie müssen nicht neu erzeugt werden. Bevorzugt wurzelrelative oder zur echten Dateilage passende Pfade setzen, nicht Assets verdoppeln.

#### 5a. NIVORA-Cockpit

- **URL:** `https://projektex.de/demos/nivora-cockpit/`
- **Datei:** `demos/nivora-cockpit.html`
- **Falsch (live geprüft, HTTP 404, HTML statt CSS/JS):** `/demos/assets/sub.css`, `/demos/assets/praxis-plus.css`, `/demos/assets/cockpit.js`, und der Zurück-Link `/demos/leistungen/systeme/`
- **Richtig (HTTP 200):** `/assets/sub.css`, `/assets/praxis-plus.css`, `/assets/cockpit.js`; Ziel des Links `/leistungen/systeme` (Anker `#cockpit`). Dateien: `assets/sub.css`, `assets/praxis-plus.css`, `assets/cockpit.js`. Es gibt kein Verzeichnis `demos/assets/`.
- **Vermutete Ursache:** Die HTML-Datei nutzt `../assets/…` und `../leistungen/systeme.html#cockpit`, als läge sie unter `/demos/nivora-cockpit.html`. Unter `/demos/nivora-cockpit/` zeigen `../assets/` und `../leistungen/` nach `/demos/assets/` und `/demos/leistungen/`.
- **Akzeptanz:** CSS und JS laden mit 200 und korrektem Content-Type, die Demo erscheint, der Zurück-Link führt auf die Systeme-Seite. Kein 404 unter `/demos/assets/` oder `/demos/leistungen/`.

#### 5b. LICHTBOGEN Unterseiten Rechner und Foto-Check

- **URLs:** `https://projektex.de/referenzen/lichtbogen/stromausfall/rechner/` und `…/foto-check/` (HTML-Dateien `referenzen/lichtbogen/stromausfall/rechner.html` und `foto-check.html`)
- **Falsch (live 404):** `/referenzen/lichtbogen/stromausfall/assets/js/app.js`, `fx.js`, `pages.js`, Schriften, Bilder (`welt-*.jpg`, `haus.jpg`, `haus-pv.jpg` usw.)
- **Richtig (live 200, liegen im Repo):** `referenzen/lichtbogen/assets/…` (css, js, img, fonts, vid). Es gibt kein `stromausfall/assets/`.
- **Vermutete Ursache:** In den Unterseiten steht `../assets/…`. Von `/stromausfall/` (echtes Verzeichnis mit `index.html`) ist das korrekt und die Startseite der Demo lädt. Von `/stromausfall/rechner/` bzw. `/foto-check/` (umgeschriebene HTML-Dateien) wird daraus fälschlich `/stromausfall/assets/`.
- **Akzeptanz:** CSS, JS, Fonts, Bilder auf Rechner und Foto-Check laden mit 200. Die Seiten sind nicht mehr ungestylt.

#### 5c. Dieselbe Pfadklasse: WARMHERZ Foto-Check und Förderung (steht im ROT-Bericht)

- **URLs:** `https://projektex.de/referenzen/warmherz/foto-check/`, `https://projektex.de/referenzen/warmherz/foerderung/`
- **Dateien:** `referenzen/warmherz/foto-check.html`, `foerderung.html`; echte Assets in `referenzen/warmherz/assets/`
- **Live (23.11.):** `/referenzen/warmherz/foto-check/assets/js/app.js` und `/referenzen/warmherz/foerderung/assets/img/display.webp` liefern **HTTP 500** (IONOS-Fehlerseite, `text/html`). Korrekt ist `/referenzen/warmherz/assets/js/app.js` bzw. `/referenzen/warmherz/assets/img/display.webp` (200, javascript bzw. image/webp). Im HTML stehen relative Pfade `assets/…`, die unter der sauberen URL mit Schrägstrich zu `…/foto-check/assets/…` werden.
- **Akzeptanz:** Alle in Foto-Check und Förderung referenzierten CSS/JS/Bilder/Fonts laden mit 200 vom richtigen Ordner `referenzen/warmherz/assets/`. Keine 500/404 mehr unter `…/foto-check/assets/` oder `…/foerderung/assets/`.

### 6. Überdeckte Schaltflächen

Der Check prüft mit `elementFromPoint` in der Seitenmitte einer Schaltfläche, welches Element oben liegt, und misst sichtbare Überlappung von `a`/`button` (Anteil über 35 %). Bitte jeweils das oben liegende Element benennen und nur so viel am Layout ändern, dass Klicks ankommen. Keine neue Navigation erfinden.

#### 6a. Flutlicht27-App

- **URL:** `https://projektex.de/referenzen/flutlicht27-app/`
- **Datei:** `referenzen/flutlicht27-app/index.html` (und zugehöriges CSS der App)
- **Befund:** Überdeckte Schaltfläche „COURT BUCHEN“; Überlappung „COURT BUCHEN / Buchen“ und „COURT BUCHEN / Mitspielen“.
- **Vermutete Ursache:** Im Screenshot der Prüfung sitzt der Button „COURT BUCHEN“ direkt auf der festen `nav.tabbar` (Einträge unter anderem „Buchen“, „Mitspielen“). Dem App-Inhalt fehlt vermutlich der untere Innenabstand in Höhe der Tab-Leiste, sodass der Button und die Tab-Leiste sich überschneiden.
- **Hinweis:** Im Export kommen absolute Pfade mit Präfix `/projekt-ep-vorschau/referenzen/flutlicht27-app/…` vor. Diese URL ist auf projektex.de 404; ohne Präfix (`/referenzen/flutlicht27-app/…`) 200. Falls die Live-HTML noch den Präfix enthält, die Asset-Pfade auf die Live-Wurzel korrigieren, ohne die App umzugestalten.
- **Akzeptanz:** „COURT BUCHEN“ ist frei antippbar und überdeckt die Tab-Leiste nicht. Buchen und Mitspielen bleiben erreichbar.

#### 6b. HOLM, Wärmewerk, Volta

- **URLs / Dateien:**
  - `https://projektex.de/referenzen/holm/` – `referenzen/holm/index.html` (Styles im HTML). Überdeckt: `#leistungen`, `#material`, `#projekte`, `#werkstatt`, `#fragen`
  - `https://projektex.de/referenzen/waermewerk/` – `referenzen/waermewerk/index.html`, `referenzen/waermewerk/css/site.css`. Überdeckt: `#konfigurator`, `#haus`, `#prinzip`, `#vorher`, `#fragen`
  - `https://projektex.de/referenzen/volta/` – `referenzen/volta/index.html`. Überdeckt: `#tag`, `#funktionen`, `#ergebnisse`, `#start`, `#fragen`
- **Vermutete Ursache:** Das sind die `href`s der Abschnittslinks in `header nav.nav` (Desktop) bzw. im mobilen `details.menu`. Der Check wertet `header a[href]` und nutzt den `href` als Bezeichnung, wenn `innerText` leer ist. Auf dem Handy soll die Desktop-Leiste aus und das `details`-Menü an sein (HOLM z. B. `@media (width<=1060px) { .nav>a:not(.btn){display:none} }`, Wärmewerk `@media (max-width:900px){ .nav{display:none} }`). Trotzdem gelten die Ziele im ersten Viewport als überdeckt. Mit `elementFromPoint` feststellen, welches Element oben liegt (Demo-Leiste, klebrige Kopfzeile, Hero, geschlossenes Menü-Panel, das noch Fläche belegt). Kein neues Menü bauen.
- **Hinweis zu Screenshots:** `referenzen-waermewerk__iphone-13.jpg` ist bytegleich mit dem Websites-Screenshot, HOLM fast identisch. Diese JPGs nicht als visuelle Vorlage verwenden, die Live-Seiten prüfen.
- **Akzeptanz:** Alle genannten Abschnitts- und Menüziele sind am Handy antippbar und nicht von einem anderen Element verdeckt. Desktop-Navigation unverändert.

#### 6c. WARMHERZ

- **URL:** `https://projektex.de/referenzen/warmherz/`
- **Datei:** `referenzen/warmherz/index.html`
- **Befund:** Überlappung „Jobs bei uns →“ / „3 Fotos schicken“. Auf Foto-Check und Förderung zusätzlich überdeckte Leistungs-Karten (z. B. „Heizungstausch…“).
- **Vermutete Ursache:** Im Hero liegen die Buttons „Jobs bei uns“ und „3 Fotos schicken“; zusätzlich ist `.fab-foto` („3 Fotos schicken“) fest am unteren Rand. Im Screenshot der Prüfung überdeckt dieser Fix-Button den Hero-Button „Jobs bei uns“. Auf den Unterseiten liegen Leistungs-Karten im Raster so nah, dass der Check eine Überschneidung misst – nur echte, klicknehmende Überdeckung beheben, kein neues Karten-Design.
- **Akzeptanz:** „Jobs bei uns“ und „3 Fotos schicken“ sind getrennt antippbar. Keine überdeckte Schaltfläche in Foto-Check und Förderung durch den Fix-Button oder übereinanderliegende Karten.

### 7. Keine Site-Fehler, bitte nicht „reparieren“

- **Burger-Menü auf /kontakt, /impressum, /datenschutz, /rechtliches:** Diese Seiten haben bewusst nur Logo und „Zurück zur Startseite“, Dateien `kontakt.html`, `impressum.html`, `datenschutz.html`, `rechtliches.html`. Der Check sucht `button.menu-mobile`. Keinen Burger und kein Mega-Menü hinzufügen.
- **HTTP 503 auf der Startseite** im Desktop-Lauf der Prüfung: typisch IONOS unter Last (das Prüfprogramm selbst drosselt deswegen). Live am 23.11. wieder 200. Nicht an der Seite „beheben“, nur neu prüfen.
- **Hinweise im Bericht** (gekürzte Screenshots, Zeitbudget, abgebrochene Range-Requests bei Videos) zählen nicht für ROT.

### 8. Weitere ROT-Punkte, die GRÜN sonst verhindern

Bitte mitprüfen, ohne Design zu ändern:

- Horizontaler Überlauf **416 px bei 412 px** (4 px, Toleranz 3 px) auf sehr vielen Marketing-Seiten unter Pixel-7, u. a. Start, FAQ, Prozess, Preise und fast alle Leistungsseiten. Wahrscheinlich eine gemeinsame Ursache in den geteilten Styles (`assets/sub.css`, `assets/nav.css` o. ä.). Auf dem iPhone tritt dieser 4-px-Effekt so nicht flächig auf; /leistungen/websites hat dort die größeren 21 px aus Befund 3.
- Überlappungen in `https://projektex.de/referenzen/ofen-olive-app/` (Zeitfenster der Abholung/Lieferung), `https://projektex.de/demos/systeme/personal/` (Schichtkarten / Tabs) und `https://projektex.de/referenzen/nivora/` (SCROLL / Zurück zu Projekt EX). Wie in Befund 6: oben liegendes Element ermitteln und nur die Klickbarkeit herstellen.
- `/leistungen/werbeclips`: Video-Elemente ohne Quelle und Zeitüberschreitung bei Stil-Clips im Desktop-Lauf (Prüfbudget 7 s für viele Videos). Zuerst klären, ob wirklich Quellen fehlen oder der Check ins Timeout gelaufen ist.

---

## Prüfprogramm gegen eine Vorschau

Aufruf:

```bash
/workspace/ep-hq/coach/werkzeuge/webseiten-funktionscheck/webseiten-funktionscheck
```

Schalter (aus `ANLEITUNG.md` und dem Skript):

- `--url URL` – andere Startadresse (Standard: `https://projektex.de`)
- `--datum JJJJ-MM-TT` – Name des Ausgabeordners
- `--ohne-vergleich` – nicht mit dem letzten Live-Lauf vergleichen (für eine Vorschau sinnvoll)
- `--out PFAD` – Ausgabeordner setzen

Beispiel, sobald eine GitHub-Pages-Vorschau steht:

```bash
/workspace/ep-hq/coach/werkzeuge/webseiten-funktionscheck/webseiten-funktionscheck \
  --url 'https://<vorschau-host>/<vorschaupfad>' \
  --ohne-vergleich \
  --datum 2026-11-23 \
  --out /workspace/ep-hq/coach/webseiten-checks/2026-11-23-vorschau
```

**Wichtige Einschränkung:** `--url` existiert, reicht für eine GitHub-Pages-Vorschau unter einem Unterpfad aber derzeit nicht aus.

- `HOSTS` ist fest `projektex.de` und `www.projektex.de`. `is_internal()` behandelt andere Hosts nicht als interne Marketing-Seiten.
- Die Sitemap wird über `urljoin(start, "/sitemap.xml")` geladen, also immer vom Host-Root (`https://engelstraenen.github.io/sitemap.xml`), nicht von `/demo-getlayers-01/…/sitemap.xml`.
- Die `<loc>`-Einträge der Live-Sitemap zeigen auf `https://projektex.de/…`. Ein Lauf mit `--url` auf github.io würde ohne Anpassung wieder die Live-Seite oder fast nichts Internes prüfen.

Solange das so ist, den Check nicht gegen raw.githack und nicht naiv gegen eine Unterpfad-Vorschau starten und dann fälschlich GRÜN oder Live-ROT melden. Entweder die Vorschau so legen, dass Host und Sitemap zur Vorschau gehören, oder das Prüfprogramm muss den Host aus `--url` übernehmen und die Sitemap relativ zur Start-URL lesen. Das ist keine Änderung an der Website; im PR nur schreiben, unter welcher URL die Vorschau erreichbar ist, damit WEBSEITE STUDIO den Lauf anstoßen kann. Ziel bleibt: ein Lauf gegen die Vorschau mit Ergebnis GRÜN.

Anleitung: `/workspace/ep-hq/coach/werkzeuge/webseiten-funktionscheck/ANLEITUNG.md`.

---

## Abnahme

1. Ein PR auf Basis von PR #35, nicht gemerged, nicht live.
2. GitHub-Pages-Vorschau, vorher selbst geprüft, dass Bilder und Videos laden (kein raw.githack).
3. Desktop von projektex.de unverändert.
4. `webseiten-funktionscheck` gegen diese Vorschau ist GRÜN.
5. Kurze Liste im PR: was behoben wurde, was PR #35 schon mitgebracht hat, und falls etwas nur eine Check-Grenze ist, der Beleg.
