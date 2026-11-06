# Cursory – interaktive Konzeptdemo

Eigene Route: `referenzen/cursory/`. Bestehende Demos, auch ORBIT, sind unberührt. Kein Deploy.

Cursory ist hier eine Konzeptdemo, kein Produkt von Cursor. Die gesetzte Seite gehört zum frei erfundenen Weingut Elmen. Es wird nichts gesendet.

## Was das Reel tatsächlich zeigt

Quelle der Frames: angehängtes `reel3.mp4`, 14,5 s, 720×1280, 30 fps. Ein Schreibtisch mit Monitor. Auf dem Schirm läuft eine fertige Weingut-Seite, kein Knoten-Editor.

| Zeit | Bild |
| --- | --- |
| 0–3 s | Vollbild-Hero, Sonnenuntergang, Motiv wechselt von Traube zu Glas. Schwebende dunkle Glas-Pille als Navigation. |
| 3–4,5 s | Weich in ein tiefes Burgunder, zentriertes goldenes Signet und Wortmarke. |
| 4,5–8 s | Malve, dann dunkleres Braun. Foto links, Serif-Überschrift rechts. |
| 8,5–10,5 s | Zitat, großes Bild, Einladung zum Besuch. |
| 10,5–12 s | Drei Karten nebeneinander. |
| 12–14,5 s | Fuß: Foto, goldene Pille, Linkspalten, sehr große Wortmarke. |

Farben aus dem Schirm: Sonnenuntergang im Foto, Fläche etwa `#321b1e` bis `#5e373b`, Fuß eher `#3d2a20`, helle Serif, goldene Pille. Kein weißes Frucht-Layout, kein roter Produktkasten.

## Abstand zur Referenz

- Das Reel enthält keine Cursory-Knoten. Die Knotenfläche ist die geforderte interaktive Hülle um diese Seitenfolge. Eine Pixeldeckung der Knoten mit dem Reel wird nicht behauptet.
- Marke, Texte und Fotos sind unabhängig. Name, Signet, hebräische Zeilen und Einzelbilder aus dem Clip werden nicht übernommen.
- Der Hero-Morph im Reel ist eine gerenderte Bewegung Traube → Flüssigkeit → Glas. Hier bleibt das Hero ein stehendes Foto. Der Wechsel ist die Wahl Reben, Glas oder Hang; Bauen setzt genau dieses Bild.
- Zimmer, Tastatur und der Einblendtext über dem Monitor sind Social-Verpackung und nicht Teil der Seite.
- Drei.js entfällt. Im Reel sind keine eigenen 3D-Objekte zu bauen, und ein nachgebauter Flüssigkeits-Effekt würde billig wirken.
- Der Zusammenbau der Knoten dauert etwa 5 s (GSAP). Danach läuft die Vorschau in der Reihenfolge der Beats weiter, insgesamt etwa 13 s. `Ruhig` und `prefers-reduced-motion` zeigen die gesetzte Seite ohne Tween. Bildwahl bleibt.

Fotos: Unsplash-Lizenz, lokal als WebP. Keine Laufzeit-Anfragen.
