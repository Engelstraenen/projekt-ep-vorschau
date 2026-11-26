#!/usr/bin/env python3
"""Seiten-spezifische Nacharbeiten nach referenz_uebernehmen.py (beliebig oft ausfuehrbar).

  python3 tools/branchen/nacharbeiten.py bfs        # echte Kundenseite: Beispiel-Kundenstimmen raus
  python3 tools/branchen/nacharbeiten.py lupenrein  # Ring-Anprobe: MediaPipe lokal statt CDN
"""
import os, re, sys, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
R = lambda *p: os.path.join(ROOT, 'referenzen', *p)

def sub(path, old, new, count=1):
    s = open(path, encoding='utf-8').read()
    if new in s: return
    if old not in s: sys.exit(f'Nicht gefunden in {path}: {old[:60]}')
    open(path, 'w', encoding='utf-8').write(s.replace(old, new, count))

def bfs():
    # BFS ist ein echter Ratinger Betrieb: keine Beispiel-/erfundenen Kundenstimmen auf projektex.de.
    p = R('bfs', 'index.html'); s = open(p, encoding='utf-8').read()
    s2 = re.sub(r'\s*<div class="revs"[^>]*>.*?</div>\s*<p class="note">[^<]*</p>\s*</div>', '', s, flags=re.S)
    if s2 != s: open(p, 'w', encoding='utf-8').write(s2)
    sub(R('bfs', 'main.js'), "  setInterval(() => { rt.parentElement", "  if (rt) setInterval(() => { rt.parentElement")

def lupenrein():
    d = R('lupenrein', 'assets', 'vendor', 'mediapipe'); os.makedirs(os.path.join(d, 'wasm'), exist_ok=True)
    B = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/'
    files = {'vision_bundle.mjs': B + 'vision_bundle.mjs', 'LICENSE': 'https://raw.githubusercontent.com/google-ai-edge/mediapipe/master/LICENSE',
             'hand_landmarker.task': 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'}
    for w in ('vision_wasm_internal.js', 'vision_wasm_internal.wasm', 'vision_wasm_nosimd_internal.js', 'vision_wasm_nosimd_internal.wasm'):
        files['wasm/' + w] = B + 'wasm/' + w
    for n, u in files.items():
        p = os.path.join(d, n)
        if not os.path.exists(p): open(p, 'wb').write(urllib.request.urlopen(u, timeout=120).read())
    js = R('lupenrein', 'assets', 'js', 'app.js'); L = "new URL('assets/vendor/mediapipe/"
    sub(js, "import('" + B + "vision_bundle.mjs')", "import(" + L + "vision_bundle.mjs', location.href).href)")
    sub(js, "forVisionTasks('" + B + "wasm')", "forVisionTasks(" + L + "wasm', location.href).href)")
    sub(js, "modelAssetPath: '" + files['hand_landmarker.task'] + "'", "modelAssetPath: " + L + "hand_landmarker.task', location.href).href")

for a in sys.argv[1:]: globals()[a.replace('-', '_')]()
print('ok', sys.argv[1:])
