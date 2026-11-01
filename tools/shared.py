#!/usr/bin/env python3
"""Gemeinsame Bausteine für PROJEKT EP (eine Quelle für alle Seiten).
Erzeugt in allen Hauptseiten: Leistungsmenü (Nummern wie Startseite), Rail "Weitere Leistungen",
Nächste-Leistung-Pager, Footer; bindet assets/ep-fx.css/js (Leistungsseiten zusätzlich assets/themen.css) ein; maskiert H1-Wörter für die Einblendung.
Danach immer: python3 tools/csp.py
Aufruf: python3 tools/shared.py [datei ...]   (ohne Argumente: alle Seiten)
"""
import os, re, sys, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAIL = 'kontakt@projekt-ep.de'
# Reihenfolge und Nummern = zehn Themen/Kapitel der Startseite (SEO gehört zu 01, Games zu 03)
S = [
 ('websites', '01', 'Design', 'Websites', 'Design, Entwicklung, SEO &amp; Sichtbarkeit', 'digital-design'),
 ('seo', '01', 'Find', 'SEO &amp; Sichtbarkeit', 'Audit, On-page, Content', 'seo'),
 ('automatisierung-chatbots', '02', 'Connect', 'Automatisierung &amp; Chatbots', 'Chatbots, Integrationen, Abläufe', 'workflow'),
 ('apps', '03', 'Develop', 'App Design', 'UX, UI, Prototyp, Entwicklung', 'app-design'),
 ('games', '03', 'Play', 'Game Design', 'Browser, Mobile, Serious Games', 'game'),
 ('werbeclips', '04', 'Create', 'Werbeclips', 'Werbefilme, Motion Design, Social Ads', 'campaign'),
 ('ads-management', '05', 'Run', 'Ads-Management', 'Meta, TikTok, Google, laufend betreut', 'ads'),
 ('visualisierung', '06', 'Envision', 'Räume &amp; Visualisierung', 'Garten, Interior, Architektur', 'spaces'),
 ('print-design', '07', 'Craft', 'Print Design', 'Textil, Objekte, Packaging', 'print'),
 ('logo-design', '08', 'Brand', 'Logo Design', 'Logo, Farben, Schrift, Brand Guide', 'logo-design'),
 ('merch', '09', 'Produce', 'Merch-Produktion', 'Jersey, Denim, Strick, Kollektionen', 'merch'),
 ('systeme', '10', 'Manage', 'Systeme &amp; Dashboards', 'Warenwirtschaft, Personal, Dashboards', 'dashboards'),
 ('individuelle-auftraege', '', 'Mehr', 'Individuelle Aufträge', 'Wenn deine Idee in kein Raster passt', 'produkt'),
]
ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def tag(nr, verb): return f'{nr} · {verb}' if nr else verb

def mega(p):
    out = []
    for slug, nr, verb, name, desc, img in S:
        out.append(f'      <a class="tile" href="{p}leistungen/{slug}.html"><span class="thumb"><img src="{p}lab/{img}-320.webp" alt="" loading="lazy" decoding="async" width="320" height="213"></span><span><small>{tag(nr, verb)}</small><b>{name}</b><span>{desc}</span></span></a>')
    return '<div class="mega-grid">\n' + '\n'.join(out) + '\n    </div>'

def rail(cur):
    cards = []
    for slug, nr, verb, name, desc, img in S:
        if slug == cur: continue
        cards.append(f'<li><a class="rc" href="{slug}.html"><span class="rc-img"><img src="../lab/{img}-640.webp" srcset="../lab/{img}-320.webp 320w, ../lab/{img}-640.webp 640w" sizes="(max-width: 860px) 74vw, 340px" alt="" loading="lazy" decoding="async" width="640" height="427"></span><small>{tag(nr, verb)}</small><b>{name}</b><span>{desc}</span></a></li>')
    return ('<section class="block others ep-rail" aria-labelledby="rail-h"><div class="rail-head"><h2 id="rail-h">Weitere Leistungen.</h2>'
            '<div class="rail-nav"><button type="button" class="rail-btn" data-dir="-1" aria-label="Zurück blättern" disabled>' + ARROW + '</button>'
            '<button type="button" class="rail-btn" data-dir="1" aria-label="Weiter blättern">' + ARROW + '</button></div></div>'
            '<ul class="rail" role="list">' + ''.join(cards) + '</ul></section>')

def pager(cur):
    order = [s for s in S]
    i = next(k for k, s in enumerate(order) if s[0] == cur)
    nx = order[(i + 1) % len(order)]; pv = order[i - 1]
    return (f'<nav class="pager ep-next" aria-label="Nächste Leistung">'
            f'<a class="nx" href="{nx[0]}.html"><span class="nx-img" aria-hidden="true"><img src="../lab/{nx[5]}-1024.webp" srcset="../lab/{nx[5]}-640.webp 640w, ../lab/{nx[5]}-1024.webp 1024w, ../lab/{nx[5]}.webp 1536w" sizes="(max-width: 1320px) 92vw, 1320px" alt="" loading="lazy" decoding="async"></span>'
            f'<small>Nächste Leistung · {tag(nx[1], nx[2])}</small><b>{nx[3]}</b><i aria-hidden="true">{ARROW}</i></a>'
            f'<a class="pv" href="{pv[0]}.html"><small>Vorherige</small>{pv[3]}</a></nav>')

def footer(p):
    links = ''.join(f'<li><a href="{p}leistungen/{s[0]}.html">{s[3]}</a></li>' for s in S)
    return f'''<footer class="epf" id="epf" role="contentinfo">
  <div class="epf-cta">
    <p class="epf-kicker">Projekt starten</p>
    <p class="epf-big"><a href="{p}kontakt.html">Erzähl uns von deiner Idee. <span>Wir machen sie sichtbar.</span><i aria-hidden="true">{ARROW}</i></a></p>
    <p class="epf-mail"><a href="mailto:{MAIL}">{MAIL}</a></p>
  </div>
  <div class="epf-cols">
    <nav aria-label="Leistungen"><p class="epf-h">Leistungen</p><ul>{links}</ul></nav>
    <nav aria-label="Studio"><p class="epf-h">Studio</p><ul><li><a href="{p}index.html">Start</a></li><li><a href="{p}prozess.html">Prozess</a></li><li><a href="{p}faq.html">FAQ</a></li><li><a href="{p}index.html#finder">Potenzialfinder</a></li><li><a href="{p}kontakt.html">Kontakt</a></li></ul></nav>
    <nav aria-label="Rechtliches"><p class="epf-h">Rechtliches</p><ul><li><a href="{p}impressum.html">Impressum</a></li><li><a href="{p}datenschutz.html">Datenschutz</a></li><li><a href="{p}rechtliches.html#cookies">Cookie-Policy</a></li><li><a href="{p}rechtliches.html#agb">AGB</a></li><li><a href="{p}widerruf.html">Widerruf</a></li><li><a href="{p}rechtliches.html#barrierefreiheit">Barrierefreiheit</a></li><li><a id="cookie-einstellungen" href="#cookie-einstellungen" class="cc-settings-link" data-cc="show-preferencesModal">Cookie-Einstellungen</a></li></ul></nav>
  </div>
  <div class="epf-mark" aria-hidden="true"><span>PROJEKT</span><b>EP</b></div>
  <p class="epf-legal"><span>© 2026 PROJEKT EP</span><span>Vom ersten Gedanken. Zum fertigen Ergebnis.</span></p>
</footer>'''

H1_RE = re.compile(r'(<h1(?: [^>]*)?>)(.*?)(</h1>)', re.S)
def mask_h1(s):
    def rep(m):
        inner = m.group(2)
        if 'class="hw"' in inner: return m.group(0)
        i = [0]
        def words(txt):
            out = []
            for part in re.split(r'(\s+)', txt):
                if not part or part.isspace(): out.append(part); continue
                out.append(f'<span class="hw"><span style="--i:{i[0]}">{part}</span></span>'); i[0] += 1
            return ''.join(out)
        # nur Textknoten ersetzen, Tags unverändert lassen
        new = re.sub(r'>([^<]+)<', lambda t: '>' + words(t.group(1)) + '<', '>' + inner + '<')[1:-1]
        return m.group(1).replace('<h1', '<h1 data-hw', 1) + new + m.group(3)
    return H1_RE.sub(rep, s, count=1)

def process(path):
    rel = os.path.relpath(path, ROOT)
    p = '../' if rel.startswith('leistungen/') else ''
    slug = os.path.basename(rel)[:-5] if rel.startswith('leistungen/') else None
    s = open(path, encoding='utf-8').read(); o = s
    s = re.sub(r'<div class="mega-grid">.*?\n    </div>', lambda m: mega(p), s, count=1, flags=re.S)
    if slug:
        s = re.sub(r'<section class="block others[^"]*".*?</section>', lambda m: rail(slug), s, count=1, flags=re.S)
        s = re.sub(r'<nav class="pager[^"]*".*?</nav>', lambda m: pager(slug), s, count=1, flags=re.S)
        s = mask_h1(s)
        s = re.sub(r'(<figure class="hero-img"><img src="\.\./lab/)([a-z-]+)\.webp"(?! srcset)', lambda m: f'{m.group(1)}{m.group(2)}-1024.webp" srcset="../lab/{m.group(2)}-640.webp 640w, ../lab/{m.group(2)}-1024.webp 1024w, ../lab/{m.group(2)}.webp 1536w" sizes="(max-width: 860px) 92vw, 1320px" fetchpriority="high" decoding="async"', s, count=1)
    s = re.sub(r'<footer[^>]*>.*?</footer>', lambda m: footer(p), s, count=1, flags=re.S)
    s = s.replace('href="mailto:">E-Mail folgt</a>', f'href="mailto:{MAIL}">{MAIL}</a>')
    if 'assets/ep-fx.css' not in s:
        s = s.replace('</head>', f'<link rel="stylesheet" href="{p}assets/ep-fx.css">\n</head>', 1)
    if slug and 'assets/themen.css' not in s:  # Themen-Muster: Kurz-Intro + Use Cases (assets/themen.css)
        s = s.replace(f'<link rel="stylesheet" href="{p}assets/ep-fx.css">\n', f'<link rel="stylesheet" href="{p}assets/ep-fx.css">\n<link rel="stylesheet" href="{p}assets/themen.css">\n', 1)
    if 'assets/ep-fx.js' not in s:
        s = s.replace('</body>', f'<script src="{p}assets/ep-fx.js" defer></script>\n</body>', 1)
    if s != o:
        open(path, 'w', encoding='utf-8').write(s); print('aktualisiert', rel)

if __name__ == '__main__':
    files = sys.argv[1:] or [os.path.join(ROOT, 'index.html'), os.path.join(ROOT, 'kontakt.html'), os.path.join(ROOT, 'prozess.html'), os.path.join(ROOT, 'faq.html')] + \
        [os.path.join(ROOT, 'leistungen', s[0] + '.html') for s in S]
    for f in files: process(os.path.abspath(f))
    # Zeit-Element aus assets/dauer.json
    import runpy; runpy.run_path(os.path.join(ROOT, 'tools', 'dauer.py'), run_name='__main__')
