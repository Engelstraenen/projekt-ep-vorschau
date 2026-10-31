#!/usr/bin/env python3
"""Zeit-Element „Umsetzung ca. …“ aus assets/dauer.json in die Leistungsseiten schreiben (statisch, läuft ohne JavaScript).
Werte pflegen: assets/dauer.json. null = Element ausgeblendet (nichts im HTML). Idempotent: ersetzt die Blöcke zwischen den Markern."""
import json, os, re, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, 'assets', 'dauer.json'), encoding='utf-8'))
H = html.escape(D['hinweis'])
CLOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path class="d-hand" d="M12 7v5l3.2 2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
M0, M1 = '<!--dauer-->', '<!--/dauer-->'
B0, B1 = '<!--dauer-badge-->', '<!--/dauer-badge-->'

def strip(s):
    s = re.sub(re.escape(M0) + r'.*?' + re.escape(M1) + r'\n?\s*', '', s, flags=re.S)
    return re.sub(re.escape(B0) + r'.*?' + re.escape(B1), '', s, flags=re.S)

def single(v):
    return (f'{M0}<div class="ep-dauer" role="note"><span class="ep-dauer-ic">{CLOCK}</span>'
            f'<p class="ep-dauer-v"><small>Umsetzung</small>ca. {html.escape(v)}</p>'
            f'<p class="ep-dauer-n">{H}</p></div>{M1}')

def scale():
    arten = [a for a in D['website_arten'].values() if a.get('dauer')]
    if not arten: return ''
    top = max(a.get('max_tage') or 0 for a in arten) or 1
    li = ''.join(f'<li style="--w:{round(100 * (a.get("max_tage") or top) / top)}%"><span class="ep-dauer-a">{html.escape(a["name"])}</span>'
                 f'<span class="ep-dauer-bar" aria-hidden="true"><i></i></span><b>ca. {html.escape(a["dauer"])}</b></li>' for a in arten)
    return (f'{M0}<div class="ep-dauer ep-dauer--scale" role="note"><p class="ep-dauer-h"><span class="ep-dauer-ic">{CLOCK}</span>Umsetzung je nach Art</p>'
            f'<ul>{li}</ul><p class="ep-dauer-n">{H}</p></div>{M1}')

def put_hero(s, block):
    if not block: return s
    m = re.search(r'(<section class="hero[^"]*">.*?<p class="lead">.*?</p>)', s, flags=re.S)
    return s[:m.end()] + '\n      ' + block + s[m.end():] if m else s

def process(slug):
    path = os.path.join(ROOT, 'leistungen', slug + '.html')
    s = open(path, encoding='utf-8').read(); o = s; s = strip(s)
    if slug == 'websites':
        s = put_hero(s, scale())
        for demo, art in D['website_demos'].items():
            a = D['website_arten'].get(art) or {}
            if not a.get('dauer'): continue
            badge = f'{B0}<p class="ep-dauer-badge" title="{H}"><span class="ep-dauer-ic">{CLOCK}</span>ca. {html.escape(a["dauer"])}<span class="sc-vh"> Umsetzung, {H}</span></p>{B1}'
            s = re.sub(r'(<h3 id="pb-' + demo + r'">.*?</h3>)', lambda m: m.group(1) + badge, s, count=1, flags=re.S)
    else:
        v = D['rubriken'].get(slug)
        if v: s = put_hero(s, single(v))
    if s != o:
        open(path, 'w', encoding='utf-8').write(s); print('dauer aktualisiert', slug)

if __name__ == '__main__':
    for slug in ['websites'] + list(D['rubriken']): process(slug)
