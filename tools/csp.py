#!/usr/bin/env python3
"""CSP-Generator für PROJEKT EP.
Berechnet SHA-256-Hashes aller ausführbaren Inline-Skripte je Seite und schreibt
1) ein <meta http-equiv="Content-Security-Policy"> in jede Seite (wirkt auch auf GitHub Pages),
2) die Gesamt-Policy (alle Hashes) in .htaccess zwischen den Markern CSP-BEGIN/CSP-END.
Nach JEDER Änderung an Inline-Skripten erneut ausführen:  python3 tools/csp.py
Hinweis: frame-ancestors, report-to und sandbox wirken NICHT per Meta-Tag, nur als HTTP-Header (.htaccess).
"""
import base64, hashlib, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {'.git', 'steak-seite', 'node_modules', 'assets', 'tools', 'docs', 'referenzen'}  # referenzen/: eigenstaendige Demo-Exporte mit eigener CSP (.htaccess im Ordner)
SCRIPT_RE = re.compile(r'<script(?P<attrs>[^>]*)>(?P<body>.*?)</script>', re.S)
META_RE = re.compile(r'<meta http-equiv="Content-Security-Policy"[^>]*>\n?')

BASE = ["default-src 'self'", "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:",
        "media-src 'self' blob:", "font-src 'self'", "connect-src 'self'", "object-src 'none'",
        "base-uri 'self'", "form-action 'self'", "manifest-src 'self'", "worker-src 'self' blob:",
        "upgrade-insecure-requests"]
# Bei Aktivierung von Tracking (nur nach Opt-in geladen) hier ergänzen, z. B.:
EXTRA_SCRIPT = []   # ["https://www.googletagmanager.com", "https://connect.facebook.net"]
EXTRA_CONNECT = []  # ["https://*.google-analytics.com", "https://www.facebook.com"]

def hashes(html):
    out = []
    for m in SCRIPT_RE.finditer(html):
        a = m.group('attrs')
        if 'src=' in a or 'application/ld+json' in a or 'text/plain' in a: continue
        h = base64.b64encode(hashlib.sha256(m.group('body').encode('utf-8')).digest()).decode()
        out.append(f"'sha256-{h}'")
    return out

def policy(hs):
    p = list(BASE)
    p.insert(1, "script-src 'self' " + ' '.join(sorted(set(hs)) + EXTRA_SCRIPT))
    if EXTRA_CONNECT: p = [x + ' ' + ' '.join(EXTRA_CONNECT) if x.startswith('connect-src') else x for x in p]
    return '; '.join(p)

def pages():
    for d, dirs, files in os.walk(ROOT):
        dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
        for f in files:
            if f.endswith('.html'): yield os.path.join(d, f)

allh = []
for p in pages():
    s = open(p, encoding='utf-8').read()
    s = META_RE.sub('', s)
    hs = hashes(s); allh += hs
    meta = f'<meta http-equiv="Content-Security-Policy" content="{policy(hs)}">\n'
    s = s.replace('<meta charset="utf-8">\n', '<meta charset="utf-8">\n' + meta, 1)
    open(p, 'w', encoding='utf-8').write(s)
    print(os.path.relpath(p, ROOT), len(hs), 'Inline-Skripte gehasht')

ht = os.path.join(ROOT, '.htaccess')
if os.path.exists(ht):
    s = open(ht, encoding='utf-8').read()
    hdr = f'  Header always set Content-Security-Policy "{policy(allh)}; frame-ancestors \'none\'"'
    s = re.sub(r'(# CSP-BEGIN\n).*?(\n\s*# CSP-END)', lambda m: m.group(1) + hdr + m.group(2), s, flags=re.S)
    open(ht, 'w', encoding='utf-8').write(s)
    print('.htaccess aktualisiert,', len(set(allh)), 'Hashes')
