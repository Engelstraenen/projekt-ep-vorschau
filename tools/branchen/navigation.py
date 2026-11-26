#!/usr/bin/env python3
"""Branchen/Referenzen in Kopf- und Fussnavigation aller Hauptseiten eintragen (idempotent).
Kopf: 'Branchen' nach 'Prozess' (Preise bleibt letzter Punkt). Fuss (Studio): 'Branchen' und 'Referenzen' vor 'Kontakt'.
Ersetzt NICHT tools/shared.py (das darf nicht laufen); aendert nur diese zwei Stellen."""
import os, re, glob
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
files = glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, 'leistungen', '*.html')) + glob.glob(os.path.join(ROOT, 'branchen', '*.html')) + [os.path.join(ROOT, 'referenzen', 'index.html')]
n = 0
for f in files:
    if not os.path.exists(f): continue
    s = open(f, encoding='utf-8').read(); o = s
    s = re.sub(r'(<a href="((?:\.\./)?)prozess\.html"(?: aria-current="page")?>Prozess</a>)(?=<a )(?!<a href="[^"]*branchen\.html")',
               lambda m: m.group(1) + '<a href="' + m.group(2) + 'branchen.html">Branchen</a>', s)
    s = re.sub(r'(<li><a href="((?:\.\./)?)kontakt\.html">Kontakt</a></li></ul></nav>)',
               lambda m: m.group(1) if 'branchen.html">Branchen</a></li><li><a href="' + m.group(2) + 'referenzen/' in s else
               '<li><a href="' + m.group(2) + 'branchen.html">Branchen</a></li><li><a href="' + m.group(2) + 'referenzen/">Referenzen</a></li>' + m.group(1), s)
    if s != o: open(f, 'w', encoding='utf-8').write(s); n += 1
print('Navigation ergaenzt in', n, 'Dateien')
