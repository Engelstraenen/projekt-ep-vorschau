# Menü & Preisübersicht – lokale Überarbeitung

Kein Push, keine Veröffentlichung. Preise und Abo-Konditionen bleiben Entwurf.

## Diagnose

- Alle 13 Leistungslinks waren bereits vorhanden. Bei 390×844 sind genau sieben vollständig auf dem ersten Menübildschirm sichtbar; bei 375×667 fünf. Die übrigen stehen darunter. In Chromium war das ursprüngliche Mobilmenü bereits programmatisch scrollbar (850 / 1064 px Scrollweg auf der Startseite), kein belegter overflow-hidden-Fehler. Ein Safari-spezifischer Fehler ist damit weder bestätigt noch ausgeschlossen.
- Preise war bereits letzter Desktop-Hauptlink, auf Mobil aber nur in den Extras weit unten und dort nicht der letzte Eintrag.
- Absicherung: explizite 100dvh-Höhe und vh-Fallback, eigenes natives Scrollen inkl. Touch/overscroll und Safe-Area, data-lenis-prevent, sichtbarer Scrollhinweis. Desktop-Menü jetzt auch in niedrigen Viewports begrenzt/scrollbar. Preise bleibt letzter Desktop-Hauptlink und ist jetzt letzter Mobilmenüpunkt.
- https://projektex.de ist aus Browser und curl wegen TLS-Fehler nicht abrufbar; HTTP liefert 500. Ob dort ein älterer Menüstand liegt, kann nicht festgestellt werden. Nichts an Produktion geändert.

## Preisübersicht

- Ruhiger Platzhalter für noch nicht produziertes Erklärvideo, ohne Fake-Player.
- Basis- und ausführlicher Website-Check vor den Paketen.
- Alle 13 Bereiche, 532 Katalogzeilen und 18 Analyse-Teilprüfungen: insgesamt 550 Einzelpreiszeilen, durchgehend „Preis folgt nach Prüfung“. Paketpreise ebenfalls offen.
- Katalogquelle/Inventur: docs/preise-leistungskatalog.json; Leistungsseiten verlinkt. Vorschläge zu neuen Abos ausdrücklich markiert.
- Verbraucher-Gesamtpreise inklusive 19 % MwSt. hervorgehoben; B2B netto zuzüglich MwSt. Keine erfundenen Eurobeträge.

## Als Vorschlag markierte Paketinhalte

### Klein

- Feed-Posts: Vorschlag Im Wechsel mit einem Reel; insgesamt 1 Veröffentlichung pro Woche.
- Reels: Vorschlag Reel statt Feed-Post, nicht zusätzlich; Anteil im Redaktionsplan festlegen.
- Stories: Vorschlag 1 Story-Set pro Woche; Anzahl der einzelnen Slides noch abstimmen.
- Ads: Vorschlag Optional separat; Kampagnenbetreuung und Werbebudget nicht automatisch enthalten.
- Kanäle: Vorschlag 1 gemeinsam gewählter Kanal, z. B. Instagram.
- Reporting: Vorschlag Monatlicher Kurzbericht mit Reichweite, Interaktionen und nächsten Schritten.
- Betreuung: Vorschlag Redaktionsplan, Text, Gestaltung, Terminierung und Freigabe je Veröffentlichung.

### Mittel

- Feed-Posts: Vorschlag 2 Feed-Posts pro Woche.
- Reels: Vorschlag 1 Reel pro Woche; zusammen mit den Feed-Posts 3 Veröffentlichungen.
- Stories: Vorschlag 3 Story-Sets pro Woche; Slides je Set noch abstimmen.
- Ads: Vorschlag Laufende Betreuung einer abgestimmten Kampagne, Werbebudget separat.
- Kanäle: Vorschlag 2 gemeinsam gewählte Kanäle; Adaption / Crossposting der 3 Veröffentlichungen.
- Reporting: Vorschlag Monatlicher Kanalvergleich, Kampagnenauswertung und Optimierungsgespräch.
- Betreuung: Vorschlag Redaktionsplan, Produktion, Terminierung und gebündelte Freigaben.

### Groß

- Feed-Posts: Vorschlag 4 Feed-Posts pro Woche und Kanal.
- Reels: Vorschlag 3 Reels pro Woche und Kanal; mit Feed-Posts insgesamt täglich eine Veröffentlichung.
- Stories: Vorschlag Tägliche Story-Sets; Anzahl der Slides gemeinsam festlegen.
- Ads: Virale Ads inklusive. Vorschlag Creative-Tests und laufende Kampagnenoptimierung; Anzahl und Produktionsumfang vor Vertrag festlegen.
- Kanäle: Jeder gemeinsam vereinbarte Kanal. Vorschlag Konkrete Kanalliste, Plattformadaptionen und Crossposting vor Start festlegen.
- Reporting: Vorschlag Wöchentlicher Kurzstatus plus Monatsreport mit Optimierungsplan.
- Betreuung: Komplettbetreuung. Vorschlag Strategie, Redaktionsplan, Produktion, Veröffentlichung, Community-Management und Abstimmung; Erreichbarkeit und Reaktionszeiten noch festlegen.

## Prüfung / Grenzen

Playwright Chromium: 1440×900, 390×844, 375×667, jeweils Startseite, SEO-Unterseite und Preisübersicht; Maus, Enter/Escape/Tab (alle 13 Links), echte synthetische Touch-Swipes. Alle 18 Navigations-/Preislink-Zielseiten HTTP 200, keine 404 im Test. Screenshots und JSON-Protokolle unter /workspace/preise-nav2/.

WebKit ist installiert, startet aber wegen fehlender Hostbibliotheken nicht. Die reguläre Installation der Abhängigkeiten scheitert am Debian-Mirror (HTTP 500 / Repository nicht signiert). Daher KEINE verifizierte iPhone-Safari-Freigabe; WebKit-/Gerätetest bleibt offen.

Wiederholung: lokalen HTTP-Server im Repo auf Port 8827 starten, dann python3 tests/test_nav_preise.py (Python Playwright und BeautifulSoup erforderlich). node --check assets/nav.js und assets/ep-fx.js; git diff --check.

Zusatztest mit normaler Bewegung: Desktop 1440×500 mit aktivem Lenis scrollt das Menü per Mausrad (154 px); beide Mobilgrößen scrollen per Touch um 405 px. Designprüfung: zunächst 5 Hinweise (Zeilenlänge / einzelne Schlusswörter), nach Korrektur 0. Syntaxprüfung aller assets/*.js und git diff --check erfolgreich.
