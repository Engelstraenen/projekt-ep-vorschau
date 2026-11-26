# Branchen und Referenzen pflegen

Alles steht in **tools/branchen/branchen.json**. Danach immer:
```
python3 tools/branchen/bauen.py && python3 tools/csp.py && python3 tools/check-menu-arbeiten.py
```

## Top-Referenzen ändern (ganz oben in /branchen und /referenzen/)
In `branchen.json` die Liste `"top"` füllen, z. B. `"top": ["bfs", "lupenrein", "flutlicht27"]` (bis zu 6, Namen = Schlüssel unter `"referenzen"`). Leere Liste = neutrale Platzhalter.

## Neue Branche (z. B. Pool, Sauna, Tennis, Golf, Autohändler)
1. Referenz übernehmen: `python3 tools/branchen/referenz_uebernehmen.py <ordner-mit-fertiger-seite> <slug>` (echter Kunde: `--kunde`).
2. Vorschaubild 960×600 als `img/branchen/<slug>-960.webp`.
3. In `branchen.json`: Eintrag unter `"referenzen"` und unter `"branchen"` (slug, gruppe, name, refs, title, meta, h1, lead, text, bausteine). Neue Gruppe nur, wenn keine passt.
4. `bauen.py` – Karte im Hub, Unterseite `/branchen/website-<slug>`, Karte im Referenzen-Index, Galerie und Sitemap entstehen automatisch.

`"status": "offen"` blendet Branche oder Referenz aus (z. B. FIRSTWERK, bis eine Variante gewählt ist).
Handgeschriebene Texte zwischen `<!--inhalt-start-->` und `<!--inhalt-ende-->` bleiben beim Neubau erhalten.
