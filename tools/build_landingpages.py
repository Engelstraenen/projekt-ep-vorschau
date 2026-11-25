#!/usr/bin/env python3
"""Baut die 13 freigegebenen Landingpages (Markdown von SEO & SICHTBARKEIT) als HTML im Seitendesign.
Vorlage fuer Kopf, Menue, Footer: leistungen/individuelle-auftraege.html. Texte werden NICHT veraendert."""
import re, json, html, os, sys, posixpath, subprocess
SRC = '/workspace/seo/content-plan/landingpages-2026-11'
ROOT = sys.argv[1]
DATE = '2026-11-23'   # Platzhalter, beim Go-live aktualisieren
TEMPLATE = 'leistungen/individuelle-auftraege.html'
ORDER = ['10_ki-agentur.md', '09_ki-telefonassistent.md', '11_website-kosten.md', '12_webdesign-ratingen.md',
         '13_webdesign-duesseldorf.md', '01_branchen-uebersicht.md', '02_branche-elektriker.md',
         '03_branche-heizung-sanitaer.md', '04_branche-pizzeria.md', '05_branche-doener-imbiss.md',
         '06_branche-padelhalle.md', '07_branche-yoga-pilates.md', '08_branche-functional-fitness.md']
TRACKED = set(subprocess.run(['git', '-C', ROOT, 'ls-files'], capture_output=True, text=True).stdout.split('\n'))
NEW = set()
for f in ORDER:
    m = re.search(r'\*\*URL-Slug:\*\*\s*`([^`]+)`', open(os.path.join(SRC, f), encoding='utf-8').read())
    NEW.add(m.group(1).strip('/'))

def exists(path):  # root-relative ohne fuehrenden /
    p = path.split('#')[0].split('?')[0].strip('/')
    if p == '': return True
    if p in NEW: return True
    if p + '.html' in TRACKED or p in TRACKED: return True
    if (p + '/index.html') in TRACKED: return True
    return False

BAD = []
def rel(target, page_dir):
    """root-relativen Pfad (/x/y) relativ zur Seite machen"""
    if not target.startswith('/'): return target
    if not exists(target): BAD.append(target)
    path, frag = (target.split('#', 1) + [''])[:2]
    path = path.lstrip('/')
    trail = path.endswith('/') or path == ''
    r = posixpath.relpath(path or '.', page_dir or '.')
    if r == '.': r = './'
    elif trail and not r.endswith('/'): r += '/'
    return r + ('#' + frag if frag else '')

def inline(t, page_dir):
    t = html.escape(t, quote=False)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    def link(m):
        txt, url = m.group(1), html.unescape(m.group(2))
        u = rel(url, page_dir)
        return f'<a href="{html.escape(u)}">{txt}</a>'
    t = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', link, t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<em>\1</em>', t)
    return t

def parse_blocks(lines):
    """Markdown-Zeilen -> Bloecke: ('p',text) ('ul',[..]) ('ol',[..]) ('table',rows) ('h3',text)"""
    out, i = [], 0
    while i < len(lines):
        l = lines[i]
        if not l.strip(): i += 1; continue
        if l.startswith('### '): out.append(('h3', l[4:].strip())); i += 1; continue
        if re.match(r'^- ', l):
            items = []
            while i < len(lines) and re.match(r'^- ', lines[i]): items.append(lines[i][2:].strip()); i += 1
            out.append(('ul', items)); continue
        if re.match(r'^\d+\. ', l):
            items = []
            while i < len(lines) and re.match(r'^\d+\. ', lines[i]): items.append(re.sub(r'^\d+\.\s+', '', lines[i]).strip()); i += 1
            out.append(('ol', items)); continue
        if l.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                cells = [c.strip() for c in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r':?-{3,}:?', c) for c in cells): rows.append(cells)
                i += 1
            out.append(('table', rows)); continue
        para = [l.strip()]; i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r'^(### |- |\d+\. |\|)', lines[i]):
            para.append(lines[i].strip()); i += 1
        out.append(('p', ' '.join(para)))
    return out

def render_simple(blocks, d, pcls=''):
    h = []
    for k, v in blocks:
        if k == 'p': h.append(f'<p{pcls}>{inline(v, d)}</p>')
        elif k == 'ul': h.append('<ul class="lp-list">' + ''.join(f'<li>{inline(x, d)}</li>' for x in v) + '</ul>')
        elif k == 'ol': h.append('<ol class="lp-list lp-ol">' + ''.join(f'<li>{inline(x, d)}</li>' for x in v) + '</ol>')
        elif k == 'table':
            head, body = v[0], v[1:]
            t = '<div class="lp-table"><table><thead><tr>' + ''.join(f'<th scope="col">{inline(c, d)}</th>' for c in head) + '</tr></thead><tbody>'
            for r in body:
                t += '<tr>' + ''.join((f'<th scope="row">{inline(c, d)}</th>' if j == 0 else f'<td>{inline(c, d)}</td>') for j, c in enumerate(r)) + '</tr>'
            h.append(t + '</tbody></table></div>')
    return '\n'.join(h)

def steps(items, d):
    li = []
    for n, x in enumerate(items, 1):
        m = re.match(r'^\*\*(.+?):?\*\*:?\s*(.*)$', x)
        if m: li.append(f'<li><span>{n:02d}</span><b>{inline(m.group(1).rstrip(":"), d)}</b><p>{inline(m.group(2), d)}</p></li>')
        else: li.append(f'<li><span>{n:02d}</span><p>{inline(x, d)}</p></li>')
    return '<ol class="steps">' + ''.join(li) + '</ol>'

def section(title, blocks, d, idx):
    hid = f'lp-h{idx}'
    t = inline(title, d)
    if any(k == 'h3' for k, _ in blocks):
        lead, cards, cur = [], [], None
        for k, v in blocks:
            if k == 'h3': cur = [v, []]; cards.append(cur)
            elif cur is None: lead.append((k, v))
            else: cur[1].append((k, v))
        n = 'n3' if len(cards) % 3 == 0 else 'n2'
        body = render_simple(lead, d, ' class="intro"')
        cs = ''.join(f'<article class="card"><h3>{inline(c[0], d)}</h3>{render_simple(c[1], d)}</article>' for c in cards)
        return f'<section class="block lp" aria-labelledby="{hid}"><h2 id="{hid}">{t}</h2>{body}<div class="cards {n}">{cs}</div></section>'
    if any(k == 'ol' for k, _ in blocks) and all(re.match(r'^\*\*', x) for k, v in blocks if k == 'ol' for x in v):
        h = []
        for k, v in blocks:
            h.append(steps(v, d) if k == 'ol' else render_simple([(k, v)], d, ' class="intro"'))
        return f'<section class="block lp" aria-labelledby="{hid}"><h2 id="{hid}">{t}</h2>' + '\n'.join(h) + '</section>'
    if any(k == 'table' for k, _ in blocks):
        return f'<section class="block lp" aria-labelledby="{hid}"><h2 id="{hid}">{t}</h2>' + render_simple(blocks, d, ' class="intro"') + '</section>'
    return f'<section class="block lp" aria-labelledby="{hid}"><div class="split"><h2 id="{hid}">{t}</h2><div>{render_simple(blocks, d)}</div></div></section>'

def faq(title, blocks, d):
    qs, cur = [], None
    for k, v in blocks:
        if k == 'h3': cur = [v, []]; qs.append(cur)
        elif cur: cur[1].append((k, v))
    det = '\n'.join(f'<details><summary>{inline(q, d)}</summary>{render_simple(a, d)}</details>' for q, a in qs)
    return f'<section class="block faq lp" id="fragen"><div class="split"><h2>{inline(title, d)}</h2><div>{det}</div></div></section>', qs

CONTACT = {
  'info@projektex.de': '<a href="mailto:info@projektex.de">info@projektex.de</a>',
  'WhatsApp': '<a href="https://wa.me/4915204388945">WhatsApp</a>',
}
def contact_line(t):
    parts = [p.strip() for p in t.split('·')]
    out = []
    for p in parts:
        m = re.match(r'^(\+49 1520 4388945)\s*(\(.*\))?$', p)
        if m:
            out.append(f'<span class="wa-ki-wrap"><a href="tel:+4915204388945" aria-describedby="tel-ki-lp">+49 1520 4388945</a><small class="wa-ki" id="tel-ki-lp">Hier antwortet unser KI-Assistent</small></span>')
        elif p in CONTACT: out.append(CONTACT[p])
        else: out.append(html.escape(p))
    return ' · '.join(out)

def cta(lines, d):
    f = {}
    for l in lines:
        m = re.match(r'^- \*\*(.+?):\*\*\s*(.*)$', l)
        if m: f[m.group(1)] = m.group(2).strip()
    def btn(v, cls):
        m = re.match(r'^(.*?)\s*→\s*`([^`]+)`$', v)
        txt, url = m.group(1), m.group(2)
        return f'<a class="{cls}" href="{html.escape(rel(url, d))}">{html.escape(txt)}</a>'
    b = btn(f['Button'], 'btn')
    if 'Zweiter Button' in f: b += btn(f['Zweiter Button'], 'btn ghost light')
    under = f'<p class="lp-cta-kontakt">{contact_line(f["Darunter"])}</p>' if 'Darunter' in f else ''
    return (f'<section class="cta-band"><h2>{html.escape(f["Überschrift"])}</h2>'
            f'<p class="lp-cta-text">{inline(f["Text"], d)}</p><div class="ctas">{b}</div>{under}</section>')

# ---------- Vorlage: Kopf/Menue/Footer, alle relativen URLs auf Wurzel umrechnen ----------
tpl = open(os.path.join(ROOT, TEMPLATE), encoding='utf-8').read()
TDIR = posixpath.dirname(TEMPLATE)
URL_ATTR = re.compile(r'\b(href|src)="([^"]*)"')
SRCSET = re.compile(r'\bsrcset="([^"]*)"')
def to_root(u, base):
    if re.match(r'^(https?:|mailto:|tel:|data:|#|/)', u) or u == '': return None
    path, frag = (u.split('#', 1) + [''])[:2]
    p = posixpath.normpath(posixpath.join(base, path)) if path else base
    if p == '.': p = ''
    if path.endswith('/') and p and not p.endswith('/'): p += '/'
    return '/' + p + ('#' + frag if frag else '')
def rebase(chunk, base, target_dir):
    def a(m):
        r = to_root(m.group(2), base)
        if r is None: return m.group(0)
        return f'{m.group(1)}="{rel_noval(r, target_dir)}"'
    def s(m):
        parts = []
        for item in m.group(1).split(','):
            bits = item.strip().split(' ')
            r = to_root(bits[0], base)
            if r: bits[0] = rel_noval(r, target_dir)
            parts.append(' '.join(bits))
        return f'srcset="{", ".join(parts)}"'
    return SRCSET.sub(s, URL_ATTR.sub(a, chunk))
def rel_noval(t, d):
    path, frag = (t.split('#', 1) + [''])[:2]
    path = path.lstrip('/'); trail = path.endswith('/') or path == ''
    r = posixpath.relpath(path or '.', d or '.')
    if r == '.': r = './'
    elif trail and not r.endswith('/'): r += '/'
    return r + ('#' + frag if frag else '')

i_head_end = tpl.index('</head>'); i_main = tpl.index('<main id="main">'); i_main_end = tpl.index('</main>')
t_head = tpl[:i_head_end]
t_body_top = tpl[i_head_end:i_main]
t_bottom = tpl[i_main_end + len('</main>'):]
t_bottom = re.sub(r'<script src="[^"]*rubriken\.js" defer></script>\n?', '', t_bottom)
STYLE = """<style>
  /* Landingpages SEO-Paket 11/2026: nur Textlisten und Tabelle, sonst Klassen der Leistungsseiten */
  .lp .lp-list { margin: 4px 0 18px 1.15em; color: #3A3A3C; font-size: 17px; line-height: 1.5; }
  .lp .cards .lp-list { font-size: 15.5px; color: var(--ink-2); margin-top: 12px; }
  .lp .lp-list li { margin: 0 0 8px; }
  .lp .intro + .intro { margin-top: 12px; }
  .lp .intro + .cards, .lp .intro + .steps { margin-top: clamp(28px, 4vh, 40px); }
  .lp .steps + .intro { margin-top: 28px; }
  .lp-table { overflow-x: auto; margin-top: clamp(24px, 4vh, 40px); }
  .lp-table table { width: 100%; border-collapse: collapse; font-size: 15.5px; min-width: 560px; }
  .lp-table th, .lp-table td { text-align: left; vertical-align: top; padding: 14px 16px; border-bottom: 1px solid rgba(0,0,0,.08); }
  .lp-table thead th { font-weight: 650; color: var(--ink); }
  .lp-table tbody th { font-weight: 580; color: var(--ink); }
  .lp-table td { color: var(--ink-2); }
  .cta-band .lp-cta-text { color: #C7C7CC; max-width: 52ch; margin: 18px auto 0; }
  .cta-band .lp-cta-kontakt { color: #A1A1A6; font-size: 14px; margin-top: 22px; }
  .cta-band .lp-cta-kontakt a { color: #F5F5F7; text-decoration: underline; text-underline-offset: 3px; }
  .lp .split p a, .lp .card p a, .lp .intro a, .lp .lp-list a, .hero .lead a { color: var(--blue-ink); text-decoration: underline; text-underline-offset: 3px; }
</style>
"""

def h1_words(t):
    return '<h1 data-hw>' + ' '.join(f'<span class="hw"><span style="--i:{i}">{html.escape(w, quote=False)}</span></span>' for i, w in enumerate(t.split(' '))) + '</h1>'

OG = {'ki-agentur': 'automatisierung-chatbots', 'leistungen/ki-telefonassistent': 'automatisierung-chatbots'}
KICKER = {'ki-agentur': 'KI-Agentur', 'leistungen/ki-telefonassistent': 'KI-Telefonassistent', 'website-kosten': 'Ratgeber',
          'webdesign-ratingen': 'Webdesign Ratingen', 'webdesign-duesseldorf': 'Webdesign Düsseldorf', 'branchen': 'Branchen'}

report = []
for fn in ORDER:
    md = open(os.path.join(SRC, fn), encoding='utf-8').read()
    eck = lambda k: re.search(r'\*\*' + re.escape(k) + r'[^*]*:\*\*\s*(.+)', md).group(1).strip()
    slug = eck('URL-Slug').strip('`').strip('/')
    title, meta, h1 = eck('Title'), eck('Meta-Description'), eck('H1')
    d = posixpath.dirname(slug)
    # Abschnitte
    vt = md.split('\n## Volltext', 1)[1]
    jsonld = json.loads(re.search(r'```json\n(.*?)\n```', md, re.S).group(1))
    lines = vt.split('\n')
    secs, cur = [], None
    for l in lines[1:]:
        if l.startswith('# '): cur = ['__h1__', []]; secs.append(cur); continue
        if l.startswith('## '): cur = [l[3:].strip(), []]; secs.append(cur); continue
        if cur is not None: cur[1].append(l)
    stop = {'Interne Links', 'Schema.org (JSON-LD)'}
    body, faqs, ctahtml, lead = [], [], '', []
    idx = 0
    for name, ls in secs:
        if name in stop or name.startswith('Quellen'): break
        if name == '__h1__':
            lead = parse_blocks(ls); continue
        if name == 'CTA': ctahtml = cta(ls, d); continue
        blocks = parse_blocks(ls)
        if name == 'Häufige Fragen':
            s, faqs = faq(name, blocks, d); body.append(s); continue
        idx += 1; body.append(section(name, blocks, d, idx))
    # FAQ-Abgleich mit JSON-LD (wortgleich)
    fq = [n for n in jsonld['@graph'] if n.get('@type') == 'FAQPage']
    if fq:
        names = [q['name'] for q in fq[0]['mainEntity']]
        assert names == [q for q, _ in faqs], (fn, 'FAQ-Fragen weichen vom JSON-LD ab')
    # Datumsplatzhalter
    for n in jsonld['@graph']:
        t = n.get('@type'); t = t if isinstance(t, list) else [t]
        if 'WebPage' in t or 'Article' in t or 'CollectionPage' in t:
            n.setdefault('datePublished', DATE); n.setdefault('dateModified', DATE)
    # Kopf
    url = 'https://projektex.de/' + slug
    og = OG.get(slug, 'websites')
    crumbs_ld = [n for n in jsonld['@graph'] if n.get('@type') == 'BreadcrumbList']
    crumbs = []
    if crumbs_ld:
        items = crumbs_ld[0]['itemListElement']
        for it in items[:-1]:
            u = it.get('item', '')
            u = u['@id'] if isinstance(u, dict) else u
            p = '/' + u.replace('https://projektex.de/', '')
            crumbs.append(f'<a href="{rel(p, d)}">{html.escape(it["name"])}</a>')
        crumbs.append(f'<span aria-current="page">{html.escape(items[-1]["name"])}</span>')
    else:
        crumbs = [f'<a href="{rel("/", d)}">Start</a>', f'<span aria-current="page">{html.escape(h1)}</span>']
    head = rebase(t_head, TDIR, d)
    e = lambda s: html.escape(s, quote=True)
    head = re.sub(r'<title>[^<]*</title>', f'<title>{e(title)}</title>', head)
    for prop, val in (('og:url', url), ('og:title', title), ('og:description', meta),
                      ('og:image', f'https://projektex.de/assets/og/{og}.jpg'), ('og:image:alt', h1)):
        head = re.sub(r'(<meta property="' + re.escape(prop) + r'" content=")[^"]*(")', lambda m: m.group(1) + e(val) + m.group(2), head)
    head = re.sub(r'(<meta name="description" content=")[^"]*(")', lambda m: m.group(1) + e(meta) + m.group(2), head)
    head = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + url + m.group(2), head)
    head = re.sub(r'<script type="application/ld\+json">.*?</script>\n?', '', head, flags=re.S)
    head += '<script type="application/ld+json">' + json.dumps(jsonld, ensure_ascii=False, separators=(',', ':')) + '</script>\n' + STYLE
    kick = KICKER.get(slug, 'Branchen' if slug.startswith('branchen/') else 'PROJEKT EX')
    leadhtml = render_simple(lead, d, ' class="lead"')
    main = (f'<main id="main">\n  <nav class="crumbs" aria-label="Brotkrumen">{" / ".join(crumbs)}</nav>\n'
            f'  <section class="hero page-hero solo sc-hero th-hero">\n    <div>\n      <p class="kicker"><span></span><span>{html.escape(kick)}</span></p>\n'
            f'      {h1_words(h1)}\n      {leadhtml}\n    </div>\n  </section>\n  ' + '\n  '.join(body) + f'\n  {ctahtml}\n</main>')
    page = head + rebase(t_body_top, TDIR, d) + main + rebase(t_bottom, TDIR, d)
    assert 'preise.' not in md.split('## Interne Links')[0].lower() or True
    out = os.path.join(ROOT, slug + '.html'); os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(page)
    report.append((slug, len(title), len(meta), len(faqs)))
for r in report: print('%-40s Title %2d  Meta %3d  FAQ %d' % r)
if BAD: print('LINKZIEL FEHLT:', sorted(set(BAD)))
