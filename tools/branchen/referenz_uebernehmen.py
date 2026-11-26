#!/usr/bin/env python3
"""Musterseite oder Kundenseite nach referenzen/<slug>/ uebernehmen (beliebig oft ausfuehrbar).

  python3 tools/branchen/referenz_uebernehmen.py <quellordner> <slug> [--kunde] [--kamera] [--basis /alter-pfad/]

<quellordner> = fertiger statischer Stand (z. B. site/ bzw. gh-pages eines Demo-Repos).
Macht:
  1. Ordner nach referenzen/<slug>/ spiegeln (alter Stand wird ersetzt).
  2. Google Fonts lokal ablegen (assets/fonts-lokal/), keine Anfragen an Google (CSP 'self', DSGVO).
  3. Inline-Skripte in assets/inline/*.js auslagern (strikte CSP ohne 'unsafe-inline').
  4. --basis: absolute Pfade eines Exports (z. B. Next.js basePath /eiswerk-site) auf /referenzen/<slug>/ umschreiben.
  5. .htaccess mit eigener CSP + noindex schreiben (wie die anderen Referenzen).
  --kunde: echte Kundenseite (kein Demo-Hinweis wird ergaenzt; nichts wird als erfunden markiert).
  --kamera: Kamera fuer diese Seite erlauben (z. B. LUPENREIN Ring-Anprobe), plus 'wasm-unsafe-eval'.
Gibt am Ende alle verbliebenen externen Adressen aus.
"""
import os, re, sys, shutil, hashlib, urllib.request, argparse

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
TEXT = ('.html', '.htm', '.js', '.mjs', '.css', '.txt', '.json', '.webmanifest', '.svg')
SKIP = {'.git', '.github', 'node_modules', '.DS_Store'}

def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()

def fonts(dst, html_files):
    """Google-Fonts-Links durch lokale Kopie ersetzen."""
    link_re = re.compile(r'<link[^>]+href="(https://fonts\.googleapis\.com/css2?\?[^"]+)"[^>]*>', re.I)
    pre_re = re.compile(r'<link[^>]+rel="preconnect"[^>]+href="https://fonts\.(googleapis|gstatic)\.com"[^>]*>\s*', re.I)
    fdir = os.path.join(dst, 'assets', 'fonts-lokal'); done = {}
    for f in html_files:
        s = open(f, encoding='utf-8').read(); o = s
        for url in set(link_re.findall(s)):
            u = url.replace('&amp;', '&')
            if u not in done:
                css = get(u).decode()
                os.makedirs(fdir, exist_ok=True)
                def dl(m):
                    fu = m.group(1); n = hashlib.sha1(fu.encode()).hexdigest()[:12] + os.path.splitext(fu)[1]
                    p = os.path.join(fdir, n)
                    if not os.path.exists(p): open(p, 'wb').write(get(fu))
                    return 'url(' + n + ')'
                css = re.sub(r'url\((https://fonts\.gstatic\.com/[^)]+)\)', dl, css)
                name = 'g-' + hashlib.sha1(u.encode()).hexdigest()[:8] + '.css'
                open(os.path.join(fdir, name), 'w').write('/* lokal abgelegt von ' + u + ' */\n' + css)
                done[u] = name
            rel = os.path.relpath(os.path.join(fdir, done[u]), os.path.dirname(f)).replace(os.sep, '/')
            s = re.sub(r'<link[^>]+href="' + re.escape(url) + r'"[^>]*>', '<link rel="stylesheet" href="' + rel + '">', s)
        s = pre_re.sub('', s)
        if s != o: open(f, 'w', encoding='utf-8').write(s)

def inline(dst, html_files):
    """Inline-Skripte (ohne JSON/LD-JSON) in Dateien auslagern."""
    sc = re.compile(r'<script(?P<a>(?:\s+(?!src=)[^>]*)?)>(?P<c>.*?)</script>', re.S | re.I)
    idir = os.path.join(dst, 'assets', 'inline'); n = 0
    for f in html_files:
        s = open(f, encoding='utf-8').read()
        def rep(m):
            nonlocal n
            a, c = m.group('a') or '', m.group('c')
            if not c.strip() or re.search(r'type="(application/(ld\+)?json|text/template)"', a, re.I): return m.group(0)
            os.makedirs(idir, exist_ok=True)
            h = hashlib.sha1(c.encode()).hexdigest()[:12] + '.js'
            open(os.path.join(idir, h), 'w', encoding='utf-8').write(c); n += 1
            rel = os.path.relpath(os.path.join(idir, h), os.path.dirname(f)).replace(os.sep, '/')
            return '<script' + a + ' src="' + rel + '"></script>'
        s2 = sc.sub(rep, s)
        if 'onsubmit="return false"' in s2:  # Inline-Handler sind unter strikter CSP gesperrt -> per Datei nachbilden
            os.makedirs(idir, exist_ok=True)
            open(os.path.join(idir, 'nosubmit.js'), 'w').write("document.addEventListener('submit',function(e){if(e.target.matches('form[data-nosubmit]'))e.preventDefault()},true);\n")
            rel = os.path.relpath(os.path.join(idir, 'nosubmit.js'), os.path.dirname(f)).replace(os.sep, '/')
            s2 = s2.replace('onsubmit="return false"', 'data-nosubmit').replace('</body>', '<script src="' + rel + '"></script>\n</body>', 1)
        rest = re.findall(r'<[a-z]+[^>]*\son[a-z]+="', s2)
        if rest: print('  Achtung, Inline-Handler bleiben in', os.path.relpath(f, dst), len(rest))
        if s2 != s: open(f, 'w', encoding='utf-8').write(s2)
    return n

HT = """# {name} – Referenz (statische Seite, PROJEKT EX). Nur fuer IONOS/Apache relevant, GitHub Pages ignoriert diese Datei.
# Erzeugt von tools/branchen/referenz_uebernehmen.py. Nur eigene Dateien (Schriften und Skripte lokal), keine Drittanbieter.
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self'{wasm}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' blob: data:; media-src 'self' blob:; worker-src 'self' blob:; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self' mailto:; manifest-src 'self'; upgrade-insecure-requests; frame-ancestors 'none'"
  Header always set X-Robots-Tag "noindex, nofollow"
{perm}</IfModule>
"""

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('quelle'); ap.add_argument('slug')
    ap.add_argument('--kunde', action='store_true'); ap.add_argument('--kamera', action='store_true'); ap.add_argument('--basis')
    a = ap.parse_args()
    src = os.path.abspath(a.quelle); dst = os.path.join(ROOT, 'referenzen', a.slug)
    if os.path.exists(dst): shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=lambda d, names: [x for x in names if x in SKIP or x.endswith('.md')])
    files = [os.path.join(d, x) for d, _, fs in os.walk(dst) for x in fs]
    if a.basis:
        ba = a.basis.rstrip('/'); nb = '/referenzen/' + a.slug
        for f in files:
            if f.endswith(TEXT):
                s = open(f, encoding='utf-8', errors='surrogateescape').read()
                if ba in s:
                    s = s.replace('https://engelstraenen.github.io' + ba, 'https://projektex.de' + nb).replace(ba, nb)
                    open(f, 'w', encoding='utf-8', errors='surrogateescape').write(s)
    html = [f for f in files if f.endswith(('.html', '.htm'))]
    fonts(dst, html); n = inline(dst, html)
    perm = '  Header always set Permissions-Policy "accelerometer=(), autoplay=(self), camera=(self), display-capture=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"\n' if a.kamera else ''
    open(os.path.join(dst, '.htaccess'), 'w').write(HT.format(name=a.slug.upper(), wasm=" 'wasm-unsafe-eval'" if a.kamera else '', perm=perm))
    ext = set()
    for f in [os.path.join(d, x) for d, _, fs in os.walk(dst) for x in fs if x.endswith(TEXT)]:
        s = open(f, encoding='utf-8', errors='ignore').read()
        for m in re.finditer(r'(?:src|href|import\(|url\()\s*=?\s*["\']?(https?://[^"\')\s]+)', s): ext.add(m.group(1).split('/')[2])
    size = sum(os.path.getsize(os.path.join(d, x)) for d, _, fs in os.walk(dst) for x in fs)
    print(f'{a.slug}: {len(html)} HTML, {n} Inline-Skripte ausgelagert, {size/1e6:.1f} MB, externe Hosts: {sorted(ext) or "keine"}')

if __name__ == '__main__': main()
