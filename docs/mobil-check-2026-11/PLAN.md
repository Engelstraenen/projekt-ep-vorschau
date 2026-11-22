# Mobil-Plan Referenzseiten (Stand 22.11.2026)

Messung: Playwright/Chromium, Handy-Emulation (Touch) bei 360, 390, 430 px und Tablet 768 px.
„sw“ = Seitenbreite (scrollWidth); größer als die Viewport-Breite heißt horizontales Scrollen.
Regeln für alle Seiten: Desktop-Look bleibt unverändert (Änderungen nur in Mobil-/Tablet-Media-Queries bzw. bei Touch),
Tap-Flächen ≥ 44 px, Fließtext ≥ 15–16 px, kleine Labels ≥ 12 px, keine 100vh-Sprünge durch die Adressleiste.

| Seite | Was ist mobil kaputt (gemessen) | Was wird geändert |
|---|---|---|
| **KYRZEN** site-v5c (`#/product/jacket`) | 3D-Jacke auf fixierter Vollbild-Leinwand läuft beim Touch-Scrollen dem Inhalt hinterher; Adressleiste staucht die Leinwand (100vh ≠ innerHeight); jede Berührung der Bühne löst Hover-Kick und Neigung aus, Scroll-Start auf der Bühne gibt einen Wackel-Impuls. Farbfelder 12 px, Burger 24 px, Schrift ab 8,5 px. | Leinwand auf Touch im Seiteninhalt (scrollt mit, Höhe aus großem Viewport), Hover-Effekte nur mit Maus, Drehen erst bei waagerechtem Wischen. Tap-Flächen 44 px, Schrift min. 11–12 px. |
| **holm** | Seitenbreite 1197 px auf allen Handy-Breiten (horizontales Scrollen), 1428 px auf Tablet; 9–11 Bedienelemente < 44 px. | Überlauf-Ursache isolieren und beschneiden (Wortband/Rail/Großschrift), gepinnte Film-Szene auf Handy mit svh stabil, Bildsequenz mit Fokuspunkt, Tap-Flächen. |
| **flutlicht27** (+ **flutlicht27-app**) | Kein Überlauf; 15–20 Elemente < 44 px (Kapitel-Navigation unten), 17 Textstellen < 12 px; 100vh. App: 2 Taps, 10 Texte zu klein. | CSS-Override für den Next-Export: Kapitel-Navigation mit 44-px-Flächen, Mindestschriftgrößen, svh statt vh, Video-Ausschnitt fürs Hochformat prüfen. |
| **nivora** (inkl. products/glacier-shell, shop, collections) | Kein Überlauf, aber 74–78 Elemente < 44 px (Header-Icons, Filter, Dots, Footer) und ~160 Textstellen < 12 px auf der Startseite. | CSS-Override für den Next-Export: Mindestgrößen für Icons/Buttons/Links, Mindestschrift, Produktseite glacier-shell (Galerie, Größen, Warenkorb) mobil prüfen. |
| **lichtbogen** (inkl. stromausfall/, haus/, schaltschrank/) | Tablet 768 px: Seitenbreite 1144 px (Start, stromausfall); ~20 Taps < 44 px; Intro-Video steht als kleines 16:9-Fenster im Hochformat. | Überlauf auf Tablet beheben, Tap-Flächen, Intro/Video-Szenen fürs Hochformat (Ausschnitt/Fokuspunkt), alle Unterseiten (Rechner, Foto-Check, Jobs) prüfen. |
| **ofen-olive** (+ **ofen-olive-app**) | Seitenbreite 389/403 px bei 360/390 px; 24 Taps < 44 px, 67 Texte < 12 px. App: 35 Taps, 66 Texte zu klein. | Überlauf beheben, Mindestgrößen, Video-Szenen mit Fokuspunkt, Bestell-/Reservierungs-Strecke mobil bedienbar. |
| **quartier** | three.js-/Canvas-Szene; 9 Taps < 44 px; nutzt 100vh und innerHeight-Rechnungen. | Szenen-Höhe stabil (svh/lvh, keine Sprünge durch Adressleiste), Ausschnitt im Hochformat, Tap-Flächen. |
| **volta** | Videos + Lenis/ScrollTrigger mit Pins; 100vh, innerHeight. | Pins/Videos im Hochformat prüfen, stabile Höhen, Taps/Schrift. |
| **feld** | Bildsequenz (525 Frames) + Videos, ScrollTrigger-Pin. | Sequenz im Hochformat mit Fokuspunkt, stabile Pin-Höhe, Taps/Schrift. |
| **alma** | Bildsequenz (512 Frames), ScrollTrigger mit innerHeight. | Sequenz im Hochformat, ignoreMobileResize/svh, Taps/Schrift. |
| **waermewerk** | Bildsequenzen + 4 Videos, Formular-Check. | Hochformat-Ausschnitt, Formular/Check auf Handy bedienbar, Taps/Schrift. |
| **warmherz** (inkl. foerderung.html, foto-check.html) | foto-check 389 px, jobs 382 px, ausbildung 380 px Seitenbreite bei 360 px; einzelne Texte < 12 px auf Tablet. | Überläufe auf Unterseiten beheben, Burger-Menü mit allen Unterseiten prüfen, Förderung/Foto-Check auf Handy bedienbar. |
| **lumen** | 16 Videos, ScrollTrigger-Pin, 100vh. | Video-Szenen im Hochformat, Pin stabil, Taps/Schrift. |
| **Krümel** | GSAP/ScrollTrigger + Lenis, Sektionen mit min-height 100vh, nur ein Mobil-Breakpoint (860 px). | Szenen im Hochformat, stabile Höhen, Navigation auf dem Handy, Taps/Schrift. |

Wo Videos/Bildsequenzen nur in 16:9 vorliegen, wird mit dem vorhandenen Material der bestmögliche Hochformat-Ausschnitt
gebaut; zusätzlich steht im PR je Szene ein Vorschlag für eine echte 9:16-Fassung.
