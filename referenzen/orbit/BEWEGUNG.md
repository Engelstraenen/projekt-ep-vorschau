# ORBIT – umgesetzte Bewegung

Öffentliche Quelle: Instagram-Reel `DfWbHvERnE6` von designedby.russ (ca. 11 s, 360×640, Monitoraufnahme). Stand der Sichtung: 6. November 2026. Die Marke, die Texte und die Geräte auf dem Monitor gehören nicht zu ORBIT und werden nicht nachgebaut. Übernommen ist die Abfolge der Kamerafahrt.

## Was im Reel sichtbar ist

1. Gelbes Feld, sehr große schwarze Schrift, schwebendes glänzendes Gerät, dünne Pill-Navigation, Mauszeiger.
2. Das Gerät dreht sich mit dem Scrollen. Ein schwarzer Fleck zieht quer über das Bild.
3. Die Kamera fährt in das Gerät hinein. Das Gelb wird zu einem dunklen Close-up.
4. Danach wechseln bunte, eigenständige Projektbilder in der Tiefe, nicht als gleiche Karten.
5. Eine dichte Studiozeile auf Gelb (im Reel). ORBIT setzt die Studioaussagen auf Schwarz, wie im freigegebenen Storyboard.
6. Abschluss mit großer Zeile und direktem Aufruf. Im Reel schwarz mit gelbem Schwung. ORBIT bleibt hier gelb, Text „Was soll bewegt werden?“.

Die freigegebene Erstkomposition (Schrift links, Gerät rechts, Notiz „Digital mit Charakter.“) ist der Ruhezustand vor der Fahrt, nicht das zentrierte Wortbild des Reels.

## Was die Seite daraus macht

- GSAP ScrollTrigger pinnt Hero, Studio und Arbeiten. Lenis glättet das Scrollen nur bei feinem Zeiger, ab 900 px, und nur ohne Reduced Motion. Eine Glättung, kein zweites System.
- Three.js: eine Kamera, Keyframes von der Ruhepose über einen Orbit und einen seitlichen Pass bis zum Dolly in die dunkle Fläche. Zeiger kippt Kamera und Gerät leicht. Im Stillstand dreht das Gerät langsam.
- Ein schwarzes, glänzendes Volumen zieht im ersten Drittel quer durchs Bild.
- Studio: drei große weiße Sätze, nacheinander, auf Schwarz.
- Arbeiten: Funke, Nordlicht, Salon. Volle Flächen, Wechsel über Deckkraft, Drehung und Tiefe.
- Zusammenarbeit: drei kompakte Schritte, die Schiene füllt sich mit dem Scrollen. Alle drei bleiben lesbar.
- Kontakt: gelb, schwarzer Schwung zeichnet sich, Knopf „Projekt starten“ öffnet ein Formular ohne Versand.

## Reduced Motion und Ausfall

Ohne Bewegung oder ohne JavaScript stehen alle Abschnitte untereinander, Texte sichtbar, das Gerät als gezeichnete Ersatzform. WebGL mit Reduced Motion rendert genau eine ruhende Pose und läuft nicht weiter. Nichts wird dauerhaft auf Deckkraft 0 gesetzt, außer der dekorative Canvas, sobald die Fahrt vorbei ist. Zurückscrollen holt ihn wieder.

## Grenzen

Das Reel ist eine Handyaufnahme eines Monitors, nicht die Seite selbst. Zwischenbilder unter einer halben Sekunde, der genaue Shader des schwarzen Flecks und die originale Projektgeometrie sind daraus nicht sauber ablesbar. Es gibt keine Flüssigkeits-Simulation und kein nachgebautes Fremdmodell. Auf dem Handy ist die Fahrt kürzer, damit man nicht in einem Pin hängen bleibt.
