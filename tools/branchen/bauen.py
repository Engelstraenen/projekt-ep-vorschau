#!/usr/bin/env python3
"""Erzeugt aus tools/branchen/branchen.json (beliebig oft ausfuehrbar):
  branchen.html                       Hub /branchen (Top-Referenzen, Gruppen, Branchenkarten)
  branchen/website-<slug>.html        eine Seite je Branche
  referenzen/index.html               Index /referenzen/ (dieselben Gruppen, Referenzkarten)
  leistungen/websites.html            Bereich zwischen <!--bx-start--> und <!--bx-ende-->
  sitemap.xml                         Bereich zwischen <!-- branchen-start --> und <!-- branchen-ende -->
Seitenrahmen (Kopf, Menue, Fuss) wird aus prozess.html bzw. leistungen/websites.html uebernommen.
Handgeschriebene Inhalte zwischen <!--inhalt-start--> und <!--inhalt-ende--> bleiben erhalten.
  --variante v2|v3  nur fuer die Vorschau: andere Kartenansicht (schreibt nach --ziel, nicht ins Repo)
"""
import os, re, json, html, sys, argparse, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
D = json.load(open(os.path.join(ROOT, 'tools', 'branchen', 'branchen.json'), encoding='utf-8'))
PR37 = '/workspace/pex-seo'  # Quelle fuer den ersten Uebernahmelauf der 7 SEO-Seiten aus PR #37
SITE = 'https://projektex.de'
E = lambda s: html.escape(s, quote=True)
ap = argparse.ArgumentParser(); ap.add_argument('--variante', default='v1'); ap.add_argument('--ziel', default=ROOT)
A = ap.parse_args(); V = A.variante; OUT = A.ziel

def rd(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
def wr(p, s):
    p = os.path.join(OUT, p); os.makedirs(os.path.dirname(p), exist_ok=True)
    if os.path.exists(p) and open(p, encoding='utf-8').read() == s: return
    open(p, 'w', encoding='utf-8').write(s)

REFS = D['referenzen']; GR = {g['id']: g for g in D['gruppen']}
BR = [b for b in D['branchen'] if b.get('status') != 'offen']
def sichtbar(r): return r in REFS and REFS[r].get('status') != 'offen'
def br_of(ref):
    for b in BR:
        if ref in b['refs']: return b
BADGE = {'demo': 'Musterseite', 'kunde': 'Kundenprojekt', 'eigen': 'Eigenes Projekt'}

# ---------- Seitenrahmen ----------
def shell(tpl, pre):
    s = rd(tpl)
    head = s[:s.index('</head>')]
    head = re.sub(r'<script type="application/ld\+json">.*?</script>\s*', '', head, flags=re.S)
    head = re.sub(r'<style>.*?</style>\s*', '', head, flags=re.S)
    head = re.sub(r'<link rel="stylesheet" href="[^"]*(tracking|showcase)\.css[^"]*">\s*', '', head)
    if 'themen.css' not in head: head += '<link rel="stylesheet" href="' + pre + 'assets/themen.css">\n'
    head += '<link rel="stylesheet" href="' + pre + 'assets/branchen.css">\n'
    body = s[s.index('<body>'):s.index('<main id="main">')].replace(' aria-current="page"', '')
    foot = s[s.index('</main>') + 7:]
    foot = foot[:foot.index('<script')]
    scripts = ''.join('<script src="' + pre + 'assets/' + x + '" defer></script>\n' for x in
                      ('nav.js', 'vendor/cookieconsent/cookieconsent.umd.js', 'consent.js', 'ep-fx.js', 'rubriken.js', 'branchen.js'))
    return head, body, foot, scripts

def page(tpl, pre, title, desc, url, ld, main):
    head, body, foot, scripts = shell(tpl, pre)
    head = re.sub(r'<title>.*?</title>', '<title>' + E(title) + '</title>', head)
    for k, v in (('name="description"', desc), ('property="og:title"', title), ('property="og:description"', desc), ('property="og:url"', url)):
        head = re.sub(r'<meta ' + k + r' content="[^"]*">', '<meta ' + k + ' content="' + E(v) + '">', head)
    head = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="' + url + '">', head)
    head = re.sub(r'<meta property="og:image" content="[^"]*">', '<meta property="og:image" content="' + SITE + '/assets/og/websites.jpg">', head)
    head = re.sub(r'<meta property="og:image:alt" content="[^"]*">', '<meta property="og:image:alt" content="Website-Beispiele nach Branche">', head)
    head += '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False, separators=(',', ':')) + '</script>\n'
    return head + '</head>\n' + body + '<main id="main">\n' + main + '\n</main>' + foot + scripts + '</body>\n</html>\n'

def crumbs(pre, items):
    out = ['<a href="' + pre + 'index.html">Start</a>']
    for t, h in items: out.append('<a href="' + h + '">' + E(t) + '</a>' if h else '<span aria-current="page">' + E(t) + '</span>')
    return '<nav class="crumbs" aria-label="Brotkrumen">' + ' / '.join(out) + '</nav>'

def bc_ld(items):
    return {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(items)]}

def hero(kicker, h1, lead):
    words = h1.split(' ')
    h = ' '.join('<span class="hw"><span style="--i:%d">%s</span></span>' % (i, E(w)) for i, w in enumerate(words))
    return ('<section class="hero page-hero solo sc-hero th-hero">\n    <div>\n      <p class="kicker"><span></span><span>' + E(kicker) + '</span></p>\n'
            '      <h1 data-hw>' + h + '</h1>\n      <p class="lead">' + lead + '</p>\n    </div>\n  </section>')

# ---------- Karten ----------
def karte(ref, pre, mit_branche=True):
    r = REFS[ref]; b = br_of(ref)
    bh = (pre + 'branchen/website-' + b['slug'] + '.html') if (b and mit_branche) else ''
    img = pre + r['bild']; href = pre + r['href']
    ph = ' is-phone' if '-480' in r['bild'] else ''
    attrs = ' data-bx-name="%s" data-bx-label="%s" data-bx-kurz="%s" data-bx-badge="%s" data-bx-bild="%s"%s' % (
        E(r['name']), E(r['label']), E(r['kurz']), E(BADGE[r['art']]), E(img), (' data-bx-branche="' + E(bh) + '"') if bh else '')
    if V == 'v2':
        return ('<li class="bx2-row"><details><summary><span class="bx2-th' + ph + '"><img src="' + img + '" alt="" width="96" height="60" loading="lazy" decoding="async"></span>'
                '<span class="bx2-t"><b>' + E(r['name']) + '</b><small>' + E(r['label']) + '</small></span><span class="bx-badge bx-' + r['art'] + '">' + BADGE[r['art']] + '</span></summary>'
                '<div class="bx2-body"><img src="' + img + '" alt="Startseite von ' + E(r['name']) + '" width="960" height="600" loading="lazy" decoding="async"><p>' + E(r['kurz']) + '</p>'
                '<p class="bx-acts"><a class="btn small" href="' + href + '" target="_blank" rel="noopener">Website öffnen ↗</a>' + (('<a class="bx-sec" href="' + bh + '">Zur Branchenseite</a>') if bh else '') + '</p></div></details></li>')
    return ('<li class="bx-card"><a class="bx-link" href="' + href + '" target="_blank" rel="noopener"' + attrs + '>'
            '<span class="bx-img' + ph + '"><img src="' + img + '" alt="" width="960" height="600" loading="lazy" decoding="async"></span>'
            '<span class="bx-t"><b>' + E(r['name']) + '</b><small>' + E(r['label']) + '</small></span>'
            '<span class="bx-badge bx-' + r['art'] + '">' + BADGE[r['art']] + '</span></a></li>')

def liste(refs, pre, cls=''):
    refs = [r for r in refs if sichtbar(r)]
    if not refs: return ''
    tag = 'ul class="bx2-list' if V == 'v2' else 'ul class="bx-grid'
    return '<' + tag + cls + '" role="list">' + ''.join(karte(r, pre) for r in refs) + '</ul>'

def top(pre):
    sel = [r for r in D.get('top', []) if sichtbar(r)][:6]
    if sel: inner = liste(sel, pre, ' bx-grid--top')
    else:
        inner = '<ul class="bx-grid bx-grid--top" role="list">' + ''.join(
            '<li class="bx-ph" aria-label="Platzhalter %d"><span class="bx-ph-n">%02d</span><span>Top-Referenz</span><small>Auswahl folgt</small></li>' % (i, i) for i in (1, 2, 3)) + '</ul>'
    return ('<section class="block bx-top" id="top-referenzen" aria-labelledby="bx-top-h"><div class="bx-gh"><h2 id="bx-top-h">Top-Referenzen</h2>'
            '<p>Eine Auswahl unserer stärksten Websites.</p></div>' + inner + '</section>')

def refs_der_gruppe(gid):
    out = []
    for b in BR:
        if b['gruppe'] == gid:
            out += [r for r in b['refs'] if r not in out]
    return out

def jump(items):
    return ('<nav class="rb-jump" aria-label="Branchen auf dieser Seite"><div class="rb-jump-in"><p class="rb-jump-t" aria-hidden="true">Branchen</p><ol role="list">' +
            ''.join('<li><a href="#%s"><span class="rb-nr">%02d</span>%s</a></li>' % (i_d, n + 1, E(t)) for n, (i_d, t) in enumerate(items)) + '</ol></div></nav>')

DLG = ('<dialog class="bx-dlg" id="bx-dlg" aria-labelledby="bx-dlg-h"><div class="bx-dlg-in"><button class="bx-x" type="button" aria-label="Schließen">×</button>'
       '<span class="bx-dlg-img"><img alt="" width="960" height="600"></span><div class="bx-dlg-t"><p class="bx-dlg-k"><span class="bx-badge"></span><span class="bx-dlg-l"></span></p>'
       '<h2 id="bx-dlg-h"></h2><p class="bx-dlg-p"></p><p class="bx-acts"><a class="btn" target="_blank" rel="noopener">Website öffnen ↗</a><a class="bx-sec">Zur Branchenseite</a></p></div></div></dialog>')

def preserved(path, key):
    p = os.path.join(ROOT, path)
    for src in (p, os.path.join(PR37, path)):
        if os.path.exists(src):
            s = open(src, encoding='utf-8').read()
            m = re.search(r'<!--inhalt-start-->(.*?)<!--inhalt-ende-->', s, re.S)
            if m: return m.group(1)
            if src.startswith(PR37):
                main = s[s.index('<main id="main">'):s.index('</main>')]
                a = main.index('</section>', main.index('class="hero')) + 10
                z = main.index('<section class="cta-band">')
                body = main[a:z]
                if key == 'hub':  # Gruppen-Abschnitte des alten Hubs ersetzt der Generator
                    body = body[body.index('<section class="block lp" aria-labelledby="lp-h4">'):]
                h1 = re.search(r'<h1[^>]*>(.*?)</h1>', main, re.S).group(1); lead = re.search(r'<p class="lead">(.*?)</p>', main, re.S).group(1)
                meta = {'title': html.unescape(re.search(r'<title>(.*?)</title>', s).group(1)), 'meta': html.unescape(re.search(r'<meta name="description" content="([^"]*)"', s).group(1)),
                        'h1': html.unescape(re.sub(r'<[^>]+>', '', h1)), 'lead': lead}
                return '<!--meta ' + json.dumps(meta, ensure_ascii=False) + ' -->' + body
    return None

CTA = ('<section class="cta-band"><h2>{h}</h2><p class="lp-cta-text">Schreibt uns ein paar Sätze zu eurem Betrieb. Im kostenlosen Erstgespräch zeigen wir euch, was für eure Branche sinnvoll ist.</p>'
       '<div class="ctas"><a class="btn" href="{p}kontakt.html">Kostenloses Erstgespräch anfragen</a></div>'
       '<p class="lp-cta-kontakt"><a href="mailto:kontakt@projektex.de">kontakt@projektex.de</a> · <a href="tel:+4915204388945">+49 1520 4388945</a> · Mo–So, 24 Stunden erreichbar</p></section>')

# ---------- Branchenseiten ----------
sitemap = [SITE + '/branchen', SITE + '/referenzen/']
for b in BR:
    path = 'branchen/website-' + b['slug'] + '.html'; url = SITE + '/branchen/website-' + b['slug']
    g = GR[b['gruppe']]
    if b.get('aus_pr37'):
        body = preserved(path, b['slug'])
        m = re.match(r'<!--meta (.*?) -->', body); meta = json.loads(m.group(1)); inhalt = body
    else:
        meta = b
        inhalt = ('\n  <section class="block lp" aria-labelledby="lp-h1"><div class="split"><h2 id="lp-h1">Was eine Website für ' + E(b['name']) + ' leisten muss</h2><div>' +
                  ''.join('<p>' + E(t) + '</p>' for t in b['text']) + '</div></div></section>\n'
                  '  <section class="block lp" aria-labelledby="lp-h2"><div class="wrap"><h2 id="lp-h2">Die Bausteine</h2><div class="cards n3">' +
                  ''.join('<article class="card"><h3>' + E(t) + '</h3><p>' + E(p) + '</p></article>' for t, p in b['bausteine']) + '</div></div></section>\n')
        old = os.path.join(ROOT, path)
        if os.path.exists(old):
            m = re.search(r'<!--inhalt-start-->(.*?)<!--inhalt-ende-->', open(old, encoding='utf-8').read(), re.S)
            if m and 'data-hand' in m.group(1): inhalt = m.group(1)  # von Hand ueberarbeitet: nicht ueberschreiben
    refs = [r for r in b['refs'] if sichtbar(r)]
    bsp = ''
    if refs:
        bsp = ('\n  <section class="block bx-sec-refs" aria-labelledby="bx-b-h"><div class="bx-gh"><h2 id="bx-b-h">' + ('Beispiel' if len(refs) == 1 else 'Beispiele') + ' aus dieser Branche</h2>'
               '<p>Klicken für die große Ansicht, dann die Website live ausprobieren.</p></div>' + liste(refs, '../') + '</section>')
    andere = [x for x in BR if x['gruppe'] == b['gruppe'] and x['slug'] != b['slug']]
    weitere = ''
    if andere:
        weitere = ('\n  <section class="block bx-more" aria-labelledby="bx-m-h"><h2 id="bx-m-h">Weitere Branchen: ' + E(g['name']) + '</h2><ul class="bx-chips" role="list">' +
                   ''.join('<li><a href="website-' + x['slug'] + '.html">' + E(x['name']) + '</a></li>' for x in andere) +
                   '<li><a href="../branchen.html">Alle Branchen</a></li></ul></section>')
    main = ('  ' + crumbs('../', [('Branchen', '../branchen.html'), (meta['h1'].split(':')[0], '')]) + '\n  ' + hero('Branchen · ' + g['name'], meta['h1'], meta['lead'] if b.get('aus_pr37') else E(meta['lead'])) +
            bsp + '\n<!--inhalt-start-->' + inhalt + '<!--inhalt-ende-->' + weitere + '\n  ' + CTA.format(h='Website für ' + E(b['name']) + '?', p='../') + '\n' + DLG)
    ld = {'@context': 'https://schema.org', '@graph': [{'@type': 'WebPage', '@id': url + '#webpage', 'url': url, 'name': meta['title'], 'description': meta['meta'], 'inLanguage': 'de-DE',
          'isPartOf': {'@id': SITE + '/#website'}, 'about': {'@type': 'Service', 'serviceType': 'Webdesign für ' + b['name'], 'provider': {'@id': SITE + '/#organization'}, 'areaServed': 'DE'}},
          bc_ld([('Start', SITE + '/'), ('Branchen', SITE + '/branchen'), (b['name'], url)])]}
    wr(path, page('leistungen/websites.html', '../', meta['title'], meta['meta'], url, ld, main))
    sitemap.append(url)

# ---------- Hub /branchen ----------
gruppen = [g for g in D['gruppen'] if any(x['gruppe'] == g['id'] for x in BR)]
secs = []
for g in gruppen:
    items = []
    for b in [x for x in BR if x['gruppe'] == g['id']]:
        refs = [r for r in b['refs'] if sichtbar(r)]
        img = REFS[refs[0]]['bild'] if refs else ''
        names = ', '.join(REFS[r]['name'] for r in refs) if refs else 'Beispiel folgt'
        ph = ' is-phone' if '-480' in img else ''
        items.append('<li class="bx-card bx-branche"><a class="bx-link" href="branchen/website-' + b['slug'] + '.html"><span class="bx-img' + ph + (' bx-noimg' if not img else '') + '">' +
                     (('<img src="' + img + '" alt="" width="960" height="600" loading="lazy" decoding="async">') if img else '<span aria-hidden="true">' + E(b['name'][:1]) + '</span>') +
                     '</span><span class="bx-t"><b>' + E(b['name']) + '</b><small>' + E(names) + '</small></span></a></li>')
    secs.append('<section class="block bx-group" id="' + g['id'] + '" aria-labelledby="h-' + g['id'] + '"><div class="bx-gh"><h2 id="h-' + g['id'] + '">' + E(g['name']) + '</h2><p>' + E(g['text']) + '</p></div>'
                '<ul class="bx-grid" role="list">' + ''.join(items) + '</ul></section>')
hub_rest = preserved('branchen.html', 'hub') or ''
if hub_rest.startswith('<!--meta'): hub_rest = hub_rest[hub_rest.index('-->') + 3:]
hub_rest = hub_rest.replace('<section class="block lp"', '<section class="block lp"') if 'lp wrap' not in hub_rest else hub_rest
title = 'Websites nach Branche: Handwerk, Gastro, Sport & mehr | PROJEKT EX'
desc = 'Branchen-Websites von PROJEKT EX: Handwerk, Gebäudeservice, Garten, Fahrzeuge, Gastronomie, Sport, Handel und mehr. Jede Branche mit Live-Beispiel zum Ausprobieren.'
main = ('  ' + crumbs('', [('Branchen', '')]) + '\n  ' + hero('Branchen', 'Websites für eure Branche', 'Jede Branche hat eigene Fragen, die eine Website beantworten muss. Wählt eure Branche und probiert die passende Beispiel-Website live aus. Neue Branchen kommen laufend dazu.') +
        '\n  ' + jump([('top-referenzen', 'Top')] + [(g['id'], g['name'].split(',')[0].split(' und ')[0]) for g in gruppen]) + '\n  ' + top('') + '\n  ' + '\n  '.join(secs) +
        '\n  <p class="bx-alle"><a class="btn ghost" href="referenzen/">Alle Referenzen ansehen</a></p>' +
        '\n<!--inhalt-start-->' + hub_rest + '<!--inhalt-ende-->\n  ' + CTA.format(h='Welche Branche seid ihr?', p='') + '\n' + DLG)
items = [{'@type': 'ListItem', 'position': i + 1, 'url': SITE + '/branchen/website-' + b['slug'], 'name': 'Website für ' + b['name']} for i, b in enumerate(BR)]
ld = {'@context': 'https://schema.org', '@graph': [{'@type': 'CollectionPage', '@id': SITE + '/branchen#webpage', 'url': SITE + '/branchen', 'name': title, 'description': desc, 'inLanguage': 'de-DE',
      'isPartOf': {'@id': SITE + '/#website'}, 'mainEntity': {'@type': 'ItemList', 'itemListElement': items}}, bc_ld([('Start', SITE + '/'), ('Branchen', SITE + '/branchen')])]}
wr('branchen.html', page('prozess.html', '', title, desc, SITE + '/branchen', ld, main))

# ---------- Referenzen-Index ----------
secs = []
for g in gruppen:
    l = liste(refs_der_gruppe(g['id']), '../')
    if l: secs.append('<section class="block bx-group" id="' + g['id'] + '" aria-labelledby="h-' + g['id'] + '"><div class="bx-gh"><h2 id="h-' + g['id'] + '">' + E(g['name']) +
                      '</h2><p>' + E(g['text']) + '</p></div>' + l + '</section>')
xg = D['extra_gruppe']
secs.append('<section class="block bx-group bx-extra" id="' + xg['id'] + '" aria-labelledby="h-' + xg['id'] + '"><div class="bx-gh"><h2 id="h-' + xg['id'] + '">' + E(xg['name']) + '</h2><p>' + E(xg['text']) +
            ' <a href="../leistungen/websites.html">Websites</a> · <a href="../leistungen/apps.html">Apps</a></p></div>' + liste(D['shops_apps'], '../') + '</section>')
title = 'Referenzen nach Branche: Website-Beispiele | PROJEKT EX'
desc = 'Alle Website-Referenzen von PROJEKT EX nach Branche sortiert: Musterseiten und Kundenprojekte zum Ausprobieren, dazu Shops, Apps und Systeme.'
main = ('  ' + crumbs('../', [('Referenzen', '')]) + '\n  ' + hero('Referenzen', 'Referenzen nach Branche', 'Alle Websites zum Ausprobieren, sortiert nach Branche. Klickt auf eine Karte für die große Ansicht. Musterseiten zeigen erfundene Betriebe, Kundenprojekte echte Unternehmen.') +
        '\n  ' + jump([('top-referenzen', 'Top')] + [(g['id'], g['name'].split(',')[0].split(' und ')[0]) for g in gruppen if refs_der_gruppe(g['id'])] + [(xg['id'], 'Shops & Apps')]) +
        '\n  ' + top('../') + '\n  ' + '\n  '.join(secs) + '\n  <p class="bx-alle"><a class="btn ghost" href="../branchen.html">Alle Branchen ansehen</a></p>\n  ' + CTA.format(h='Eure Website als nächste Referenz?', p='../') + '\n' + DLG)
ld = {'@context': 'https://schema.org', '@graph': [{'@type': 'CollectionPage', '@id': SITE + '/referenzen/#webpage', 'url': SITE + '/referenzen/', 'name': title, 'description': desc, 'inLanguage': 'de-DE',
      'isPartOf': {'@id': SITE + '/#website'}}, bc_ld([('Start', SITE + '/'), ('Referenzen', SITE + '/referenzen/')])]}
wr('referenzen/index.html', page('leistungen/websites.html', '../', title, desc, SITE + '/referenzen/', ld, main))

# ---------- Galerie auf leistungen/websites.html ----------
if OUT == ROOT:
    s = rd('leistungen/websites.html')
    blk = ['<div class="bx-websites" id="nach-branche">']
    for g in gruppen:
        l = liste(refs_der_gruppe(g['id']), '../')
        if l: blk.append('<div class="bx-wg"><h3 class="bx-wh">' + E(g['name']) + '</h3>' + l + '</div>')
    blk.append('<p class="bx-alle"><a class="btn ghost" href="../branchen.html">Alle Branchen</a> <a class="btn ghost" href="../referenzen/">Alle Referenzen</a></p></div>' + DLG)
    new = '<!--bx-start-->' + ''.join(blk) + '<!--bx-ende-->'
    s = re.sub(r'<!--bx-start-->.*?<!--bx-ende-->', lambda m: new, s, flags=re.S) if '<!--bx-start-->' in s else s
    open(os.path.join(ROOT, 'leistungen/websites.html'), 'w', encoding='utf-8').write(s)
    sm = rd('sitemap.xml'); today = datetime.date.today().isoformat()
    ent = '<!-- branchen-start -->\n' + ''.join('  <url><loc>%s</loc><lastmod>%s</lastmod></url>\n' % (u, today) for u in sitemap) + '  <!-- branchen-ende -->'
    if '<!-- branchen-start -->' in sm:
        old = re.search(r'<!-- branchen-start -->.*?<!-- branchen-ende -->', sm, re.S).group(0)
        if re.sub(r'<lastmod>[^<]*', '', old) != re.sub(r'<lastmod>[^<]*', '', ent): sm = sm.replace(old, ent)
    else: sm = sm.replace('</urlset>', '  ' + ent + '\n</urlset>')
    open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write(sm)
print('gebaut:', len(BR), 'Branchenseiten, Hub, Referenzen-Index, Variante', V)
