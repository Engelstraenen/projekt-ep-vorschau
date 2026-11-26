#!/usr/bin/env python3
"""leistungen/websites.html: Galerie nach Branchengruppen (idempotent).
- Ueberschrift 'Zehn Website-Beispiele' raus, kompakte Branchen-Galerie (Marker fuer bauen.py) davor.
- Detail-Beispiele nach Branchengruppen sortiert, Label 'Gruppe · Designart', Sprungleiste nach Gruppen.
- EISWERK auf /referenzen/eiswerk/ statt github.io."""
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = os.path.join(ROOT, 'leistungen', 'websites.html'); s = open(P, encoding='utf-8').read()
ORD = [('Handwerk', ['holm', 'waermewerk', 'warmherz', 'russfrei', 'lichtbogen', 'farbkante']),
       ('Fahrzeuge', ['spaltmass']),
       ('Gastronomie', ['alma', 'eiswerk', 'ofen-olive']),
       ('Sport', ['flutlicht27']),
       ('Beratung, Gesundheit, Immobilien', ['quartier', 'lumen', 'feld']),
       ('Shops, Apps & Systeme', ['referenzen', 'kyrzen', 'volta', 'kruemel'])]
s = s.replace('<h2 id="pb-h" class="pb-title">Zehn Website-Beispiele zum Ausprobieren</h2><p>Jede Demo ist live anklickbar. NIVORA ist unser eigenes Projekt, die anderen Marken sind erfunden.</p></div>',
              '<h2 id="pb-h" class="pb-title">Website-Beispiele nach Branche</h2><p>Klickt auf eine Karte für die große Ansicht und probiert die Website live aus. Musterseiten zeigen erfundene Betriebe, Kundenprojekte echte Unternehmen. Darunter ausgewählte Beispiele im Detail.</p></div>\n    <!--bx-start--><!--bx-ende-->')
a = s.index('<article class="pb sc rb"'); z = s.index('</article>', s.rindex('<article class="pb sc rb"')) + len('</article>')
arts = {re.search(r'id="([^"]+)"', m).group(1): m for m in re.findall(r'<article class="pb sc rb".*?</article>', s[a:z], re.S)}
order = [i for _, ids in ORD for i in ids]
if set(order) != set(arts): raise SystemExit('Artikel passen nicht: %s' % (set(arts) ^ set(order)))
out = []
for n, (g, ids) in enumerate(ORD, 1):
    for i in ids:
        art = arts[i]
        art = re.sub(r'<p class="rb-label"><span class="rb-nr">\d+</span><span class="rb-dot" aria-hidden="true"> · </span>(?:[^<·]+ · )?([^<]+)</p>',
                     lambda m: '<p class="rb-label"><span class="rb-nr">%02d</span><span class="rb-dot" aria-hidden="true"> · </span>%s · %s</p>' % (n, g, m.group(1).split(' · ')[-1]), art, count=1)
        out.append(art)
s = s[:a] + '\n    '.join(out) + s[z:]
jump = ('<ol role="list"><li><a href="#nach-branche"><span class="rb-nr">00</span>Übersicht</a></li>' +
        ''.join('<li><a href="#%s"><span class="rb-nr">%02d</span>%s</a></li>' % (ids[0], n, g.split(',')[0]) for n, (g, ids) in enumerate(ORD, 1)) + '</ol>')
s = re.sub(r'(<nav class="rb-jump" aria-label=")[^"]*("><div class="rb-jump-in"><p class="rb-jump-t" aria-hidden="true">Auf dieser Seite</p>)<ol role="list">.*?</ol>',
           lambda m: m.group(1) + 'Branchen auf dieser Seite' + m.group(2) + jump, s, count=1, flags=re.S)
s = s.replace('https://engelstraenen.github.io/eiswerk-site/', '../referenzen/eiswerk/')
s = s.replace('<link rel="stylesheet" href="../assets/liquid-glass.css">', '<link rel="stylesheet" href="../assets/liquid-glass.css">\n<link rel="stylesheet" href="../assets/branchen.css">') if 'branchen.css' not in s else s
s = s.replace('<script src="../assets/rubriken.js" defer></script>', '<script src="../assets/rubriken.js" defer></script>\n<script src="../assets/branchen.js" defer></script>') if 'branchen.js' not in s else s
open(P, 'w', encoding='utf-8').write(s); print('websites.html umgestellt')
