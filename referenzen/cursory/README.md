# Elmen

Eine Seite, die dem dritten Reel folgt. Kein Editor, kein Inspector, keine eigenen Kapitel. Marke, Texte und Fotos sind eigenständig (Weingut Elmen, Mosel). Argaman, das Monogramm und die hebräischen Zeilen sind nicht übernommen.

Die Folge startet von selbst und dauert 14,5 Sekunden: Hero-Bildwechsel, dann Scroll durch Signet, Lagen, Keller, Zitat, Besuch, drei Bilder, Anreise und Fuß. Die Glas-Pille bleibt liegen. `Besuch anfragen` springt nur zu `#besuch` und sendet nichts. Bei `prefers-reduced-motion` bleibt die Seite stehen, das Glas ist schon gesetzt, der Scroll ist von Hand.

## Abgleich

Links das Reel, auf den Bildschirm beschnitten. Rechts der Build im Browser, 1440×900, zur selben Zeit. Die Dateien liegen als Review-Artefakte `side-by-side-00.0.jpg` bis `side-by-side-14.0.jpg`.

| Zeit | Reel | Build |
| --- | --- | --- |
| 0,0 | Sonnenuntergang, Traube mittig, Glas-Pille | Eigene Trauben, Pille, Zeile rechts |
| 0,5 | Traube beginnt zu zerfließen | Überblendung Richtung Glas |
| 1,0 | Rote Flüssigkeit, Spirale | Weiter die Überblendung, kein Flüssig-CGI |
| 1,5 | Glasform, Blätter | Überblendung |
| 2,0 | Guss ins Glas | Überblendung |
| 2,5 | Glas mit deren Monogramm | Eigenes Glas über der Lage, ohne deren Logo |
| 3,0 | Unscharf ins Burgund | Scroll ins Signet |
| 3,5 | Goldenes Monogramm | Eigenes E, Wort Elmen |
| 4,0 | Wortmarke zentriert | Signet bleibt stehen |
| 4,5 | Signet scrollt weg | Scroll zur ersten Lage |
| 5,0 | Foto links, Serif rechts, Mauve | Glas und Trauben links, „Alte Reben“ |
| 5,5 | Derselbe Block, weiter unten | Lage steht |
| 6,0 | Nächstes Foto schiebt sich rein | Übergang zum Hang |
| 6,5 | Dunkles Feld, Foto links | „Am Hang“, Landschaft statt Lesehände |
| 7,0 | Keller, Tanks, Text rechts | „Großes Holz“, Flaschen statt Fässer |
| 7,5 | Weiter Keller | Keller steht |
| 8,0 | Flasche am Tisch, dann weg | Übergang zum Zitat |
| 8,5 | Großes Zitat, tief | „Wer den Hang gesehen hat …“ |
| 9,0 | Breites Foto schiebt sich rein | Übergang zum Besuch |
| 9,5 | Breites Foto, Text darunter | Probe, Gläser |
| 10,0 | Foto oben, nächster Block kommt | Übergang zu den drei Bildern |
| 10,5 | Drei Bilder in einer Reihe | Probe, Tafel, Hang |
| 11,0 | Reihe scrollt weg | Übergang zur Anreise |
| 11,5 | Gebäude links, Text rechts | Dieselbe Landschaft noch einmal, „Zum Gut“ |
| 12,0 | Anreise steht | Anreise steht |
| 12,5 | Fuß mit Foto und Goldknopf | Übergang zum Fuß |
| 13,0 | Fuß, große Wortmarke | Foto, „Besuch anfragen“, Elmen |
| 13,5 | Wortmarke am unteren Rand | Fuß steht, Wortmarke im Bild |
| 14,0 | Fuß, Goldknopf, große Schrift | Dasselbe, eigenes Wort |

Das Video der ganzen Folge ist `cursory-build.mp4` (14,5 s, 1440×900).

## Was nicht übereinstimmt

- Der Bildwechsel ist eine Überblendung zweier eigener Fotos, nicht die Traube-zu-Glas-Simulation aus dem Reel.
- Fotos, Name, Monogramm und Texte sind andere. Keine Fässer, kein Gutshaus, keine Lesehände. Hang und Anreise teilen sich ein Bild. Die dritte Karte ist dieselbe Landschaft.
- Das Reel zeigt die Seite in einem kurzen iMac-Ausschnitt. Der Build ist ein ganzes Browserfenster, deshalb ist je Abschnitt mehr Fläche zu sehen.
- Schreibtisch, Pflanze und der Satz über dem Monitor gehören nicht zur Seite und fehlen.
- Die Pille hat vier deutsche Links. Die Wortmarke im Fuß ist kleiner als im Reel, damit sie im Fenster ganz lesbar bleibt.

Kein Netz zur Laufzeit, keine fremden Schriften, kein Three.js. Orbit ist unberührt. Nichts wird gemergt.
