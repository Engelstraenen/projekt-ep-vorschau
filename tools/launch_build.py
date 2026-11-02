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
EXCLUDE_SUFFIX = ('.md', '.py', '.sh', '.log', '.bak', '.orig')

ROBOTS = """User-agent: *
Allow: /
Disallow: /kontakt.php

Sitemap: https://projekt-ep.de/sitemap.xml
"""

S = re.S
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
    return True

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=os.path.join(os.path.dirname(ROOT), 'ep-launch', 'dist'))
    ap.add_argument('--entfernen', default='chat,tracking')
    a = ap.parse_args()
    cats = {c.strip() for c in a.entfernen.split(',') if c.strip()}
    out = os.path.abspath(a.out)
    if os.path.commonpath([out, ROOT]) == ROOT: sys.exit('Zielordner darf nicht im Repo liegen')
    if os.path.isdir(out): shutil.rmtree(out)
    files = [p for p in tracked_files() if public(p)]
    for p in files:
        dst = os.path.join(out, p); os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(os.path.join(ROOT, p), dst)
    print(f'{len(files)} Dateien nach {out}')
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
    for w in warns: print('WARNUNG', w)
    for e in errors: print('FEHLER ', e)
    print(f'offene Platzhalter gesamt: {ph}')
    sys.exit(1 if errors else 0)

if __name__ == '__main__':
    main()
