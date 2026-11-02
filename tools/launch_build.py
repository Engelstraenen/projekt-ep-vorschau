#!/usr/bin/env python3
"""Deploy-Paket für https://projekt-ep.de (IONOS) bauen – ändert NICHTS im Repo.

Sammelt nur öffentliche, von Git verfolgte Dateien in einem Zielordner (Standard: ../ep-launch/dist)
und stellt dort von "GitHub-Pages-Vorschau" auf "Launch" um:
  - noindex aus allen Seiten der sitemap.xml entfernen (404, Demos, Referenzen und Alt-Adressen bleiben noindex)
  - robots.txt: Allow + Sitemap-Zeile
  - Canonical/og:url/sitemap prüfen (müssen auf https://projekt-ep.de/ zeigen)
  - Rechtstexte: Abschnitte für NICHT genutzte Dienste ausblenden (Kategorien unten, Standard: chat, tracking;
    optional: zahlung). Die Vorschau-Quelle bleibt unverändert, die Abschnitte sind so später wieder einsetzbar.
  - Prüft, dass alle Inline-Skript-Hashes in der CSP der .htaccess stehen.

Aufruf:  python3 tools/launch_build.py [--out PFAD] [--entfernen chat,tracking[,zahlung]]
"""
import argparse, base64, hashlib, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOMAIN = 'https://projekt-ep.de'

# Nicht öffentlich: Repo-, Werkzeug- und Doku-Dateien, interne Vorschauen
EXCLUDE_PREFIX = ('.github/', 'docs/', 'tools/', 'node_modules/', 'steak-seite/', 'hq-showcase/')
EXCLUDE_FILES = {'_config.yml', '.nojekyll', 'package.json', 'package-lock.json', '.gitignore',
                 # unverlinkt, internes Showreel – Entscheidung Eugen 02.11.: nicht ins Deploy-Paket
                 'video/portfolio/effekte-showreel-720.mp4'}
# Nachweislich unverlinkt (Prüfung 02.11.: Dateiname bzw. Stamm in keiner HTML/CSS/JS/JSON-Datei) – nur aus dem Paket, nicht aus dem Repo
EXCLUDE_RE = re.compile(r'^(img/portfolio/effekte-showreel-[^/]+'
                        r'|lab/(campaign|game|print)-gallery(-\d+)?\.webp'
                        r'|lab/plan-board(-\d+)?\.webp'
                        r'|img/seite/start-prozess-moodboard-[^/]+'
                        r'|img/logo/(physio-kern|waermewerk)-weiss\.svg'
                        r'|assets/vendor/three/build/three\.(core|module)\.js)$')  # Startseite nutzt three.module.min.js
EXCLUDE_SUFFIX = ('.md', '.py', '.sh', '.log', '.bak', '.orig')

ROBOTS = """User-agent: *
Allow: /
Disallow: /kontakt.php

Sitemap: https://projekt-ep.de/sitemap.xml
"""

S = re.S

# Tracking (nur mit --tracking ga4,ads,meta,tiktok). Je Dienst: ID-Schlüssel in assets/consent.js,
# Überschrift des Datenschutz-Abschnitts und CSP-Freigaben (Quelle: Google-/Meta-/TikTok-Doku zu CSP).
TRACKERS = {
  'ga4':    {'key': 'ga4', 'h3': 'Google Analytics 4',
             'script-src': ['https://www.googletagmanager.com'],
             'connect-src': ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'],
             'img-src': ['https://*.google-analytics.com', 'https://*.googletagmanager.com']},
  'ads':    {'key': 'googleAds', 'h3': 'Google Ads und Conversion-Tracking',
             'script-src': ['https://www.googletagmanager.com', 'https://www.googleadservices.com', 'https://googleads.g.doubleclick.net'],
             'connect-src': ['https://www.google.com', 'https://*.doubleclick.net', 'https://www.googleadservices.com', 'https://pagead2.googlesyndication.com'],
             'img-src': ['https://www.google.com', 'https://www.google.de', 'https://*.doubleclick.net', 'https://www.googleadservices.com'],
             'frame-src': ['https://td.doubleclick.net', 'https://www.googletagmanager.com']},
  'meta':   {'key': 'metaPixel', 'h3': 'Meta-Pixel (Facebook/Instagram)',
             'script-src': ['https://connect.facebook.net'],
             'connect-src': ['https://www.facebook.com', 'https://connect.facebook.net'],
             'img-src': ['https://www.facebook.com']},
  'tiktok': {'key': 'tiktokPixel', 'h3': 'TikTok-Pixel',
             'script-src': ['https://analytics.tiktok.com'],
             'connect-src': ['https://analytics.tiktok.com', 'https://*.tiktok.com'],
             'img-src': ['https://analytics.tiktok.com']},
}

def csp_extend(policy, add):
    parts = [p.strip() for p in policy.split(';') if p.strip()]
    names = [p.split()[0] for p in parts]
    for d, srcs in add.items():
        if d in names:
            i = names.index(d); have = parts[i].split()
            parts[i] = ' '.join(have + [x for x in srcs if x not in have])
        else:
            parts.insert(len(parts) - 1, d + " 'self' " + ' '.join(srcs)); names = [p.split()[0] for p in parts]
    return '; '.join(parts)
# (Kategorie, Datei, Muster (Regex), Ersatz). Jedes Muster MUSS genau einmal passen, sonst Abbruch
# (so fällt auf, wenn sich der Quelltext geändert hat).
RULES = [
  # --- Chat-Assistent und WhatsApp-Benachrichtigung (Launch ohne Chat-Widget, Eugen 02.11.) ---
  ('chat', 'datenschutz.html', r'<a href="#chat">Website-Chat</a>', ''),
  ('chat', 'datenschutz.html', r'\s*<section class="legal" id="chat".*?</section>', ''),
  ('chat', 'datenschutz.html', r'3b\. Aufträge', '3a. Aufträge'),
  ('chat', 'datenschutz.html', r'\s*<p>Unser Chat-Assistent legt.*?</p>', ''),
  ('chat', 'datenschutz.html', r' bei Sofort-Meldungen aus dem Website-Chat WhatsApp bzw\. unser E-Mail-Anbieter,', ''),
  ('chat', 'rechtliches.html', r'\s*<p>Unser Chat-Assistent speichert.*?</p>', ''),
  ('chat', 'rechtliches.html', r', per E-Mail oder im Website-Chat ist', ' oder per E-Mail ist'),
  ('chat', 'widerruf.html', r', per E-Mail oder im Chat ist', ' oder per E-Mail ist'),
  # --- Google Analytics 4, Google Ads Conversion, Meta-Pixel (Launch ohne Tracking, Eugen 02.11.) ---
  ('tracking', 'datenschutz.html', r'<a href="#tracking">Analyse &amp; Werbung</a>', ''),
  ('tracking', 'datenschutz.html', r'\s*<section class="legal" id="tracking".*?</section>', ''),
  ('tracking', 'datenschutz.html', r'6\. Empfänger', '5. Empfänger'),
  ('tracking', 'datenschutz.html', r' sowie – nur nach Ihrer Einwilligung – die genannten Analyse- und Werbedienste', ''),
  ('tracking', 'datenschutz.html', r'Dienste zur Statistik und Werbung laden wir erst, nachdem Sie im Banner zugestimmt haben',
   'Dienste zur Statistik und Werbung setzen wir derzeit nicht ein. Sollten wir sie einführen, laden wir sie erst, nachdem Sie im Banner zugestimmt haben'),
  # --- Zahlungsarten (optional: --entfernen chat,tracking,zahlung) -> nur Rechnung/Überweisung ---
  ('zahlung', 'datenschutz.html', r'<h3>Zahlungsdienstleister</h3>.*?(?=\s*</section>)',
   '<h3>Zahlung</h3>\n    <p>Sie bezahlen per Rechnung bzw. Überweisung. Dabei verarbeiten Ihre Bank und unsere Bank '
   '<span class="ph">[Name der Bank – trägt Eugen ein]</span> die Zahlungsdaten (Art. 6 Abs. 1 lit. b und c DSGVO).</p>'),
  ('zahlung', 'datenschutz.html', r'bei Zahlungen der von Ihnen gewählte Zahlungsdienst \(PayPal, Klarna bzw\. die oben genannten Anbieter\),',
   'bei Zahlungen die beteiligten Banken,'),
  ('zahlung', 'rechtliches.html', r'<p>\(3a\) Zahlungswege:.*?</p>',
   '<p>(3a) Zahlungsweg: Rechnung bzw. Überweisung. Für die Nutzung des Zahlungsmittels fallen für Verbraucher keine zusätzlichen Entgelte an (§ 312a Abs. 4 BGB, § 270a BGB).</p>'),
  ('zahlung', 'faq.html', r'<strong>Mit allen gängigen Zahlungswegen\.</strong>.*?</p>',
   '<strong>Per Rechnung.</strong> Ihr bekommt eine Rechnung und überweist innerhalb von 14 Tagen.</p>'),
  ('zahlung', 'faq.html', r'"text":"Mit allen gängigen Zahlungswegen\.[^"]*"',
   '"text":"Per Rechnung. Ihr bekommt eine Rechnung und überweist innerhalb von 14 Tagen."'),
]

def tracked_files():
    out = subprocess.run(['git', '-C', ROOT, 'ls-files', '-z'], capture_output=True, check=True).stdout
    return [p for p in out.decode().split('\0') if p]

def public(p):
    if p.startswith(EXCLUDE_PREFIX) or p in EXCLUDE_FILES or p.endswith(EXCLUDE_SUFFIX): return False
    if '/tools/' in p: return False
    if EXCLUDE_RE.match(p): return False
    return True

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=os.path.join(os.path.dirname(ROOT), 'ep-launch', 'dist'))
    ap.add_argument('--entfernen', default='chat,tracking,zahlung')
    ap.add_argument('--tracking', default='', help='z. B. ga4,ads,meta,tiktok – nur wenn IDs in assets/consent.js stehen')
    ap.add_argument('--hsts-start', action=argparse.BooleanOptionalAction, default=True,
                    help='HSTS max-age=300 für den ersten Tag (Standard). --no-hsts-start = 1 Jahr aus .htaccess')
    a = ap.parse_args()
    cats = {c.strip() for c in a.entfernen.split(',') if c.strip()}
    trk = [t.strip() for t in a.tracking.split(',') if t.strip()]
    for t in trk:
        if t not in TRACKERS: sys.exit(f'unbekannter Dienst: {t} (erlaubt: {", ".join(TRACKERS)})')
    if trk: cats.discard('tracking')   # Datenschutz-Abschnitte zu Analyse/Werbung bleiben dann sichtbar
    out = os.path.abspath(a.out)
    if os.path.commonpath([out, ROOT]) == ROOT: sys.exit('Zielordner darf nicht im Repo liegen')
    if os.path.isdir(out): shutil.rmtree(out)
    files = [p for p in tracked_files() if public(p)]
    for p in files:
        dst = os.path.join(out, p); os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(os.path.join(ROOT, p), dst)
    print(f'{len(files)} Dateien nach {out}')
    skipped = [p for p in tracked_files() if EXCLUDE_RE.match(p)]
    print(f'{len(skipped)} unverlinkte Dateien ausgeschlossen')
    errors, warns = [], []

    # GitHub-Pages-Pfadpräfix entfernen (z. B. Next-Export referenzen/nivora mit basePath /projekt-ep-vorschau)
    TEXT = ('.html', '.htm', '.js', '.mjs', '.css', '.json', '.txt', '.xml', '.svg', '.webmanifest', '.vtt')
    fixed = 0
    for d, _, fs in os.walk(out):
        for fn in fs:
            if not fn.endswith(TEXT): continue
            f = os.path.join(d, fn); b = open(f, 'rb').read()
            if b'/projekt-ep-vorschau/' in b:
                open(f, 'wb').write(b.replace(b'/projekt-ep-vorschau/', b'/')); fixed += 1
            if b'projekt-ep-vorschau' in open(f, 'rb').read() or b'github.io' in open(f, 'rb').read():
                errors.append(f'{os.path.relpath(f, out)}: Vorschau-Adresse (github.io/projekt-ep-vorschau) im Code')
    print(f'Pfadpräfix /projekt-ep-vorschau/ in {fixed} Dateien entfernt')

    # HSTS am ersten Tag kurz (300 s, ohne preload). Nach 1–2 stabilen Tagen (HTTPS für projekt-ep.de UND www,
    # keine Zertifikatsfehler) erhöhen: Die Repo-.htaccess enthält bereits 1 Jahr -> Paket mit --no-hsts-start bauen und hochladen.
    if a.hsts_start:
        hp = os.path.join(out, '.htaccess'); ht = open(hp, encoding='utf-8').read()
        ht2, n = re.subn(r'Strict-Transport-Security "max-age=31536000; includeSubDomains"',
                         'Strict-Transport-Security "max-age=300"', ht)
        if n != 1: errors.append('HSTS-Zeile in .htaccess nicht gefunden')
        ht2 = ht2.replace('# HSTS: erst aktivieren', '# GO-LIVE-TAG: HSTS bewusst nur 300 s und ohne includeSubDomains/preload.\n  # Nach 1–2 stabilen Tagen auf "max-age=31536000; includeSubDomains" erhöhen (Paket ohne --hsts-start bauen).\n  # HSTS: erst aktivieren', 1)
        open(hp, 'w', encoding='utf-8').write(ht2)
        print('HSTS: Startwert max-age=300')

    # robots.txt
    open(os.path.join(out, 'robots.txt'), 'w').write(ROBOTS)

    # noindex nur auf den Seiten der Sitemap entfernen
    sitemap = open(os.path.join(out, 'sitemap.xml'), encoding='utf-8').read()
    locs = re.findall(r'<loc>([^<]+)</loc>', sitemap)
    for loc in locs:
        if not loc.startswith(DOMAIN + '/'): errors.append(f'sitemap: {loc}')
        path = loc[len(DOMAIN) + 1:] or 'index'
        f = os.path.join(out, path if path.endswith('.html') else path + '.html')
        if not os.path.isfile(f): errors.append(f'sitemap-Ziel fehlt: {loc}'); continue
        h = open(f, encoding='utf-8').read()
        h = re.sub(r'\s*<meta name="robots" content="noindex[^"]*">', '', h)
        for tag, attr in (('link rel="canonical" href', 'canonical'), ('meta property="og:url" content', 'og:url')):
            m = re.search(r'<' + tag + r'="([^"]+)"', h)
            if not m: errors.append(f'{path}: {attr} fehlt')
            elif m.group(1).rstrip('/') != loc.rstrip('/'): errors.append(f'{path}: {attr}={m.group(1)} != {loc}')
        open(f, 'w', encoding='utf-8').write(h)

    # Tracking-Schalter: IDs prüfen, CSP (Header + Meta) erweitern, Datenschutz anpassen, Banner neu fragen
    if trk:
        cj = open(os.path.join(out, 'assets/consent.js'), encoding='utf-8').read()
        add = {}
        for t in trk:
            m = re.search(TRACKERS[t]['key'] + r":\s*'([^']*)'", cj)
            if not m or not m.group(1): errors.append(f'Tracking {t}: keine ID in assets/consent.js ({TRACKERS[t]["key"]})')
            for d, v in TRACKERS[t].items():
                if d.endswith('-src'): add.setdefault(d, []).extend(x for x in v if x not in add.get(d, []))
        # Einwilligungen, die ohne aktive Dienste erteilt wurden, neu abfragen
        cj = re.sub(r'revision: (\d+)', lambda m: f'revision: {int(m.group(1)) + 1}', cj, count=1)
        open(os.path.join(out, 'assets/consent.js'), 'w', encoding='utf-8').write(cj)
        hp = os.path.join(out, '.htaccess'); ht = open(hp, encoding='utf-8').read()
        ht = re.sub(r'(Content-Security-Policy ")([^"]+)(")', lambda m: m.group(1) + csp_extend(m.group(2), add) + m.group(3), ht, count=1)
        open(hp, 'w', encoding='utf-8').write(ht)
        for d, _, fs in os.walk(out):
            if os.path.relpath(d, out).startswith('referenzen'): continue
            for fn in fs:
                if not fn.endswith('.html'): continue
                f = os.path.join(d, fn); h = open(f, encoding='utf-8').read()
                h2 = re.sub(r'(<meta http-equiv="Content-Security-Policy" content=")([^"]+)(")', lambda m: m.group(1) + csp_extend(m.group(2), add) + m.group(3), h)
                if h2 != h: open(f, 'w', encoding='utf-8').write(h2)
        # Datenschutz: nur gewählte Dienste behalten, Hinweis-Platzhalter dazu entfernen
        dp = os.path.join(out, 'datenschutz.html'); h = open(dp, encoding='utf-8').read()
        for t, cfg in TRACKERS.items():
            sec = re.escape('<h3>' + cfg['h3'] + '</h3>') + r'\s*<p>.*?</p>'
            if t in trk:
                h = re.sub('(' + sec + ')', lambda m: m.group(1).replace('<span class="ph">[nur bei Einsatz]</span> ', ''), h, count=1, flags=S)
            else:
                h, n = re.subn(r'\s*' + sec, '', h, count=1, flags=S)
                if n != 1: errors.append(f'Datenschutz-Abschnitt {cfg["h3"]} nicht gefunden')
        h = re.sub(r'\s*<p><span class="ph">\[Abschnitt nur behalten, wenn.*?</p>', '', h, count=1, flags=S)
        open(dp, 'w', encoding='utf-8').write(h)
        print('Tracking freigeschaltet (nach Einwilligung):', ', '.join(trk))

    # Rechtstexte: nicht genutzte Dienste ausblenden
    for cat, fn, pat, rep in RULES:
        if cat not in cats: continue
        f = os.path.join(out, fn); h = open(f, encoding='utf-8').read()
        h2, n = re.subn(pat, rep, h, flags=S)
        if n != 1: errors.append(f'Regel {cat}/{fn}: {n} Treffer statt 1 ({pat[:50]})'); continue
        open(f, 'w', encoding='utf-8').write(h2)
    print('ausgeblendet:', ', '.join(sorted(cats)) or '-')

    # Kontrollen über alle HTML-Dateien des Pakets (ohne referenzen/: eigene CSP je Ordner)
    ht = open(os.path.join(out, '.htaccess'), encoding='utf-8').read()
    csp = re.search(r'Content-Security-Policy "([^"]+)"', ht).group(1)
    ph = 0
    for d, _, fs in os.walk(out):
        for fn in fs:
            if not fn.endswith('.html'): continue
            f = os.path.join(d, fn); rel = os.path.relpath(f, out); h = open(f, encoding='utf-8').read()
            if re.search(r'github\.io|localhost|127\.0\.0\.1', h): errors.append(f'{rel}: Vorschau-/Test-URL im Code')
            if rel.startswith('referenzen/'): continue
            for m in re.finditer(r'<script(?P<a>[^>]*)>(?P<b>.*?)</script>', h, S):
                if 'src=' in m['a'] or 'ld+json' in m['a'] or 'text/plain' in m['a']: continue
                hs = base64.b64encode(hashlib.sha256(m['b'].encode()).digest()).decode()
                if f"'sha256-{hs}'" not in csp: errors.append(f'{rel}: Inline-Skript-Hash fehlt in .htaccess-CSP (python3 tools/csp.py)')
            n = h.count('class="ph"'); ph += n
            if n: warns.append(f'{rel}: {n} offene Platzhalter (span.ph)')
            if 'ENTWURF' in h: warns.append(f'{rel}: ENTWURF-Hinweis noch enthalten')
    # Sicherheitsnetz: ausgeschlossene Dateien dürfen nirgends im Paket referenziert sein
    blob = []
    for d, _, fs in os.walk(out):
        for fn in fs:
            if fn.endswith(('.html', '.css', '.js', '.mjs', '.json')):
                blob.append(open(os.path.join(d, fn), encoding='utf-8', errors='ignore').read())
    blob = '\n'.join(blob)
    for p in skipped:
        stem = re.sub(r'(-\d+)?\.(webp|avif|svg)$', '', os.path.basename(p))
        if stem in blob: errors.append(f'ausgeschlossene Datei wird referenziert: {p}')
    for w in warns: print('WARNUNG', w)
    for e in errors: print('FEHLER ', e)
    print(f'offene Platzhalter gesamt: {ph}')
    sys.exit(1 if errors else 0)

if __name__ == '__main__':
    main()
