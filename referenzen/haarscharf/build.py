#!/usr/bin/env python3
"""HAARSCHARF – Seiten bauen (index + Unterseiten). python3 build.py"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
V = '27j'
has = lambda k: os.path.exists(os.path.join(H, 'assets/img', k + '.webp'))
SEQ = json.load(open(os.path.join(H, 'assets/seq/seq.json'))) if os.path.exists(os.path.join(H, 'assets/seq/seq.json')) else None

NAV = [('Schnitt', 'index.html#grad-90'), ('Looks', 'index.html#looks'), ('Farbe', 'index.html#farbe'), ('Team', 'index.html#team'),
       ('Karriere', 'index.html#karriere'), ('Bewertungen', 'index.html#bewertungen')]


def pic(key, alt, cls='', lazy=True, sizes='100vw', full=False):
    if not has(key): return ''
    m = f'<source media="(max-width: 860px)" srcset="assets/img/{key}-m.webp">' if has(key + '-m') else ''
    return f'<picture class="{cls}">{m}<img src="assets/img/{key}.webp" alt="{alt}" {"loading=lazy" if lazy else "fetchpriority=high"} decoding="async"></picture>'


def head(title, desc, extra=''):
    return f'''<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title><meta name="description" content="{desc}"><meta name="theme-color" content="#d8d5ce">
<link rel="preload" href="assets/fonts/archivo-latin-1.woff2" as="font" type="font/woff2" crossorigin>
{extra}<link rel="stylesheet" href="assets/css/fonts.css?v={V}"><link rel="stylesheet" href="assets/css/style.css?v={V}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='11' fill='none' stroke='%23c8102e' stroke-width='4'/%3E%3Crect x='14' y='1' width='4' height='9' fill='%23c8102e'/%3E%3C/svg%3E">
</head><body>'''


def header(sub=False):
    links = ''.join(f'<a href="{h if sub else h.replace("index.html", "")}">{t}</a>' for t, h in NAV)
    return f'''<header class="hd"><a class="logo" href="{"index.html" if sub else "#top"}" aria-label="HAARSCHARF Startseite"><i></i>HAARSCHARF</a>
<nav class="nav" id="nav">{links}<a class="btn" href="{"index.html" if sub else ""}#termin">Termin wählen</a></nav>
<button class="burger" aria-label="Menü" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button></header>'''


FOOT = '''<footer class="ft" id="kontakt"><div class="ftring"></div><div class="wrap"><div class="grid">
<div><span class="kick">360° · Kontakt</span><h2 class="disp">Einmal rum.<br>Und du sitzt.</h2>
<p style="max-width:40ch;opacity:.8">Lindenstraße 12 · 40233 Düsseldorf (Demo-Adresse)<br>Telefon 0211 000 000 0 (Demo)</p>
<p style="margin-top:22px"><a class="btn" href="{p}#termin">Termin wählen</a></p></div>
<div><span class="kick">Öffnungszeiten</span><div style="margin-top:14px">
<div class="row"><span>Mo</span><span>geschlossen</span></div><div class="row"><span>Di – Fr</span><span>9 – 19 Uhr</span></div>
<div class="row"><span>Do</span><span>bis 21 Uhr</span></div><div class="row"><span>Sa</span><span>9 – 16 Uhr</span></div></div></div>
<div><span class="kick">Mehr</span><ul style="margin-top:8px"><li><a href="beratung.html">Beratung</a></li><li><a href="schnitt.html">Schnitt &amp; Übergang</a></li>
<li><a href="farbe.html">Farbe</a></li><li><a href="termin.html">So läuft dein Termin</a></li><li><a href="team.html">Team</a></li><li><a href="karriere.html">Karriere</a></li></ul></div>
</div><div class="fine"><span>HAARSCHARF ist eine Demo-Webseite eines Musterbetriebs. Formulare senden nichts, Termine sind Beispiele.</span>
<span><a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></span></div></div></footer>
<div class="dlg" id="dlg-ok" role="dialog" aria-modal="true" aria-labelledby="dlg-t"><div class="box"><h3 id="dlg-t">Termin reserviert</h3><p></p><button class="btn" data-close>Alles klar</button></div></div>
<script src="assets/js/app.js?v={v}" defer></script></body></html>'''


def foot(sub=False):
    return FOOT.replace('{p}', 'index.html' if sub else '').replace('{v}', V)


GENDER = {'look1': 'm', 'look2': 'm', 'look3': 'm', 'look4': 'm', 'look7': 'm', 'look8': 'm', 'look5': 'w', 'look6': 'w', 'look9': 'w', 'look10': 'w', 'look11': 'w', 'look12': 'w'}
LOOKS = [
    ('look1', 'Buzz Cut', 'Line-up', 'kurz wenig glatt', 'Ein Aufsatz rundum, dafür eine messerscharfe Kontur an Stirn und Schläfe.', '3–4 Wochen', ['Maschine mit einer Länge rundum (3–6 mm)', 'Konturen mit dem Trimmer, Stirnlinie gerade gezogen', 'Kopfhaut-Check und Pflege-Tipp']),
    ('look2', 'French Crop', 'Low Fade', 'kurz wenig glatt', 'Oben strukturiert mit kurzem Pony, an den Seiten ein tiefer Übergang.', '3–4 Wochen', ['Oberkopf mit der Schere strukturiert', 'Low Fade von 0,5 auf 6 mm', 'Matte Paste, mit den Fingern gestylt']),
    ('look3', 'Modern Mullet', 'Soft', 'mittel mittel locken', 'Oben locker, Seiten getapert, hinten länger. Wirkt lässig, nicht verkleidet.', '5–6 Wochen', ['Seiten und Schläfen weich getapert', 'Nacken bleibt länger, nur ausgedünnt', 'Salzspray für Bewegung']),
    ('look4', 'Curly Taper', 'Locken', 'kurz mittel locken', 'Locken oben stehen lassen, an den Seiten sauber auslaufen lassen.', '3–4 Wochen', ['Locken trocken geschnitten, Locke für Locke', 'Taper an Schläfe und Nacken', 'Curl-Creme statt Gel']),
    ('look5', 'Long Layers', 'Curtain Bangs', 'lang mittel glatt', 'Lange Stufen für Bewegung, ein weicher Vorhang-Pony rahmt das Gesicht.', '8–10 Wochen', ['Stufen trocken nachgeschnitten', 'Curtain Bangs auf Wangenknochenhöhe', 'Föhnen mit Rundbürste, Hitzeschutz']),
    ('look6', 'Sleek Bob', 'Blunt', 'kurz viel glatt', 'Kinnlang, eine einzige gerade Linie. Glänzt, wenn man ihn glatt föhnt.', '6–8 Wochen', ['Gerade Grundlinie auf Kinnhöhe', 'Innen leicht gestuft, damit er fällt', 'Glanzspray und Glätteisen']),
    ('look7', 'Textured Quiff', 'Volumen', 'mittel viel glatt', 'Oben Länge mit Textur, nach hinten gestylt. Seiten kurz getapert, damit der Kopf schmal wirkt.', '4–5 Wochen', ['Oberkopf mit der Schere in Stufen, Textur per Point-Cut', 'Seiten getapert von 3 auf 9 mm', 'Föhnen mit Volumen, Clay mit den Fingern']),
    ('look8', 'Long Flow', 'Schulterlang', 'lang wenig glatt', 'Lang wachsen lassen, aber mit Plan: Spitzen gesund, Form bleibt auch hinterm Ohr.', '8–10 Wochen', ['Spitzen trocken geschnitten, Länge bleibt', 'Gewicht innen rausgenommen', 'Leichtes Öl in die Spitzen, lufttrocknen']),
    ('look9', 'Pixie Cut', 'Textur', 'kurz wenig glatt', 'Kurz, aber weich: längerer Pony zur Seite, Nacken eng. Morgens in zwei Minuten fertig.', '5–6 Wochen', ['Nacken und Ohren eng geschnitten', 'Oberkopf strukturiert, Pony bleibt länger', 'Etwas Paste, mit den Fingern in Form']),
    ('look10', 'Curly Shag', 'Locken', 'mittel mittel locken', 'Stufen, die Locken Platz geben. Vorhang-Pony rahmt das Gesicht, nichts wird glatt gezogen.', '8–10 Wochen', ['Locke für Locke trocken geschnitten', 'Stufen rund um den Kopf, Pony auf Augenhöhe', 'Curl-Creme, Diffusor auf niedriger Stufe']),
    ('look11', 'Wavy Lob', 'Beach Waves', 'mittel wenig locken', 'Schlüsselbeinlang mit lockeren Wellen. Sieht gestylt aus, ist aber eher luftgetrocknet.', '6–8 Wochen', ['Grundlinie leicht abgerundet auf Schlüsselbeinhöhe', 'Innen ausgedünnt für Bewegung', 'Salzspray ins feuchte Haar, lufttrocknen']),
    ('look12', 'Curl Cut', 'Lange Locken', 'lang wenig locken', 'Lange Locken in runder Form, damit nichts dreieckig absteht. Länge bleibt, Sprungkraft kommt zurück.', '10–12 Wochen', ['Trocken in natürlicher Lockenform geschnitten', 'Runde Stufen für Volumen oben', 'Leave-in, Locken nur kneten, nie bürsten']),
]
LOOKS = [L for L in LOOKS if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'img', L[0] + '.webp'))]  # fehlt ein Bild: Look weglassen, nie Platzhalter
COLORS = [('color-asch', 'Aschblond', '#c9b99a'), ('color-honig', 'Honig', '#b8864b'), ('color-kupfer', 'Kupfer', '#a8481f'), ('color-espresso', 'Espresso', '#3b2a22'), ('color-rose', 'Rosé', '#b9737a')]
TEAM = [('mara', 'Mara', 'Farbe', 'team-mara'), ('jonas', 'Jonas', 'Fade & Bart', 'team-jonas'), ('aylin', 'Aylin', 'Schnitt & Bob', 'team-aylin'), ('theo', 'Theo', 'Meister · Ausbildung', 'team-theo')]


def index():
    seq = ''
    if SEQ:
        seq = f' data-n="{SEQ["n"]}" data-seq="assets/seq/d/f_###.webp?v={V}" data-seqm="assets/seq/m/f_###.webp?v={V}" data-mask="assets/seq/dm/f_###.webp?v={V}" data-maskm="assets/seq/mm/f_###.webp?v={V}"'
    preload = '<link rel="preload" as="image" href="assets/img/hero.webp" media="(min-width: 861px)" fetchpriority="high"><link rel="preload" as="image" href="assets/img/hero-m.webp" media="(max-width: 860px)" fetchpriority="high">'
    call = lambda ch, x, y, t, r=False, l=90, mx=None, my=None, ml=None: f'<div class="call{" r" if r else ""}" data-ch="{ch}" style="left:{x}%;top:{y}%;--l:{l}px;--mx:{mx if mx is not None else x}%;--my:{my if my is not None else y}%;--ml:{ml or l}px">{t}</div>'
    lk = lambda g: ''.join(f'''<a class="look rv" href="look-{k}.html" data-sub data-tags="{tags}"><span class="match">Passt zu dir</span>{pic(k, f"{n} – Beispiel-Look")}<div class="cap"><b>{n}</b><small>{s}</small></div></a>''' for k, n, s, tags, *_ in LOOKS if GENDER[k] == g)
    looks = f'<div class="grid6" data-g="m" id="looks-m">{lk("m")}</div><div class="grid6" data-g="w" id="looks-w" hidden>{lk("w")}</div>'
    cimgs = ''.join(f'<img src="assets/img/{k}.webp" alt="Haarfarbe {n}" loading="lazy" class="{"on" if k == "color-kupfer" else ""}">' for k, n, _ in COLORS if has(k))
    chips = ''.join(f'<button class="chip{" on" if k == "color-kupfer" else ""}" style="background:{c}" data-name="{n}" aria-label="{n}"><span>{n}</span></button>' for k, n, c in COLORS if has(k))
    sty = ''.join(f'<button class="sty" data-s="{k}" data-name="{n}">{"<img src=assets/img/" + a + ".webp alt=" + n + " loading=lazy>" if has(a) else ""}{n}<small>{r}</small></button>' for k, n, r, a in TEAM)
    return head('HAARSCHARF – Friseur für jede Frisur', 'HAARSCHARF: Schnitt, Fade, Farbe und Styling für Frauen und Männer. Look-Finder, Farbwechsel und Online-Termin mit Stylistenwahl.', preload) + header() + f'''
<main id="top">
<section class="spin" aria-label="360 Grad: Schnitt von allen Seiten">
 <div class="stage"{seq}>
  <div class="head"><picture><source media="(max-width: 860px)" srcset="assets/img/hero-m.webp"><img src="assets/img/hero.webp" alt="Junger Mann mit frischem Mid Fade, Studioporträt von vorn" fetchpriority="high" decoding="async"></picture></div>
  <div class="brand" aria-hidden="true">HAARSCHARF</div>
  <picture class="front-p" aria-hidden="true"><source media="(max-width: 860px)" srcset="assets/img/hero-m.webp"><img class="front" src="assets/img/hero.webp" alt=""></picture>
  <canvas class="cv" aria-hidden="true"></canvas>
  <div class="dial" aria-hidden="true"><svg viewBox="0 0 100 100"><circle class="ring" cx="50" cy="50" r="46"/>
   {''.join(f'<line class="tick" x1="50" y1="{3 if i % 9 == 0 else 3.6}" x2="50" y2="{6 if i % 9 == 0 else 5}" transform="rotate({i * 10} 50 50)"/>' for i in range(36))}
   <circle class="prog" cx="50" cy="50" r="46" transform="rotate(-90 50 50)"/></svg></div>
  <span class="scrollhint">Scroll · wir drehen einmal um dich</span>
  <div class="hero-cta"><a class="btn" href="#termin">Termin wählen</a><a class="btn ghost" href="#looks">Look finden</a></div>
  {call(1, 24, 36, '9 mm', True, 150, 4, 50, 120)}{call(1, 24, 46, '3 mm', True, 170, 4, 56, 130)}{call(1, 24, 56, '0,5 mm', True, 190, 4, 62, 140)}
  {call(2, 60, 66, 'Nacken freihand', True, 90, 52, 78, 50)}{call(3, 32, 62, 'Bart &amp; Kontur', False, 90, 30, 70, 50)}
  <article class="panel" data-ch="0"><span class="kick">0° · Vorne</span><h2 class="disp">Erst reden.<br>Dann schneiden.</h2><p>Jeder Termin beginnt mit fünf Minuten Beratung vor dem Spiegel. Kopfform, Wirbel, Alltag – dann entscheiden wir zusammen.</p><a class="link" href="beratung.html" data-sub>So läuft die Beratung</a></article>
  <article class="panel r" data-ch="1" id="grad-90"><span class="kick">90° · Seite</span><h2 class="disp">Der Übergang macht den Schnitt.</h2><p>Drei Aufsätze, dann freie Hand: Wir blenden 0,5 auf 9 mm, bis keine Kante mehr zu sehen ist.</p><a class="link" href="schnitt.html" data-sub>Schnitt &amp; Übergang im Detail</a></article>
  <article class="panel" data-ch="2"><span class="kick">180° · Hinten</span><h2 class="disp">Hinten sieht's jeder. Außer dir.</h2><p>Rund, eckig oder ausgefadet: Die Nackenlinie zeigen wir dir im Handspiegel, bevor du aufstehst.</p><a class="link" href="nacken.html" data-sub>Nackenlinien erklärt</a></article>
  <article class="panel r" data-ch="3"><span class="kick">270° · Seite</span><h2 class="disp">Bart und Kontur aus einer Hand.</h2><p>Wangenlinie, Hals, Übergang vom Fade in den Bart – im selben Termin, ohne zweiten Stuhl.</p><a class="link" href="bart.html" data-sub>Bart &amp; Kontur</a></article>
  <article class="panel" data-ch="4"><span class="kick">360° · Einmal rum</span><h2 class="disp">Und welcher Look passt zu dir?</h2><p>Männer oder Frauen, drei Fragen, sechs Looks. Der Kopf ist rum – jetzt bist du dran.</p><a class="link" href="#looks">Zum Look-Finder</a></article>
  <div class="dialnav" role="tablist" aria-label="Grad">{''.join(f'<button>{t}</button>' for t in ['0° Vorne', '90° Seite', '180° Hinten', '270° Bart', '360° Looks'])}</div>
  <div class="deg" aria-hidden="true">0°</div>
 </div>
</section>

<section class="blk" id="looks"><div class="wrap">
 <div class="looks-head"><div><span class="kick">Look-Finder</span><h2 class="disp">Welcher Look<br>passt zu dir?</h2></div>
 <p class="lead">Beantworte drei Fragen. Wir markieren, was passt – und jeder Look hat eine eigene Seite mit Ablauf, Pflege und „Wann wieder?“.</p></div>
 <div class="gsw" role="tablist" aria-label="Looks für"><button role="tab" aria-selected="true" aria-controls="looks-m" data-g="m">Männer</button><button role="tab" aria-selected="false" aria-controls="looks-w" data-g="w">Frauen</button><i aria-hidden="true"></i></div>
 <div class="quiz">
  <div class="q" data-q="len"><span>Länge</span><button data-v="kurz">Kurz</button><button data-v="mittel">Mittel</button><button data-v="lang">Lang</button></div>
  <div class="q" data-q="care"><span>Styling morgens</span><button data-v="wenig">2 Minuten</button><button data-v="mittel">5 Minuten</button><button data-v="viel">Gern mehr</button></div>
  <div class="q" data-q="type"><span>Haar</span><button data-v="glatt">Glatt</button><button data-v="locken">Wellig / Locken</button></div>
 </div>
 {looks}
</div></section>

<section class="blk farbe" id="farbe"><div class="wrap split">
 <div class="colorbox">{cimgs}</div>
 <div><span class="kick">Farbe</span><h2 class="disp">Dieselbe Frau.<br>Fünf Farben.</h2>
 <p class="lead">Tipp auf eine Farbe. Kein Filter: Jede Variante ist ein eigenes Foto, damit du siehst, wie die Farbe auf echtem Haar fällt.</p>
 <div class="chips">{chips}</div><div class="cname">Kupfer</div>
 <p class="lead" style="margin-top:14px">Ansatz und Glanz halten 6–8 Wochen. Vorher machen wir einen Strähnentest.</p>
 <a class="link" href="farbe.html" data-sub style="color:var(--bg)">Farbe, Balayage &amp; Pflege</a></div>
</div></section>

<section class="blk termin" id="termin"><div class="wrap split">
 <div class="chairwrap">{pic('chair', 'Leerer schwarzer Friseurstuhl im Studio')}</div>
 <div><span class="kick">Termin · 24/7</span><h2 class="disp">Dein Stuhl.<br>Deine Zeit.</h2>
 <p class="lead" style="margin-bottom:22px">Kein Anruf, während wir schneiden. Wähle Leistung, Stylist und Zeit – frei werdende Termine bekommst du auf Wunsch per SMS.</p>
 <div class="card" id="booking">
  <h3>1 · Leistung</h3><div class="opts">{''.join(f'<button class="opt" data-svc="{s}">{s}</button>' for s in ['Schnitt', 'Schnitt & Bart', 'Fade', 'Farbe', 'Balayage', 'Styling'])}</div>
  <h3>2 · Stylist</h3><div class="stylists">{sty}</div>
  <h3>3 · Tag &amp; Zeit</h3><div class="days"></div><div class="slots" style="margin-top:10px"></div>
  <label class="toggle"><input type="checkbox" checked> Bei früherem freien Termin per SMS melden (Warteliste)</label>
  <label class="toggle photo"><input type="file" accept="image/*" aria-label="Foto vom Wunschlook"> <span>Foto vom Wunschlook anhängen (optional, bleibt in der Demo auf deinem Gerät)</span></label>
  <div class="sum"><p></p><button class="btn" disabled>Termin sichern</button></div>
  <p class="demo-note" style="margin-top:10px">Demo: Zeiten sind Beispiele, es wird nichts gebucht.</p>
 </div><a class="link" href="termin.html" data-sub>So läuft dein Termin ab</a></div>
</div></section>

<section class="teamstage" id="team">{pic('team', 'Das Team: vier Stylistinnen und Stylisten auf einem runden Podest im Studio')}
 <div class="teamtxt rv"><span class="kick">Team</span><h2 class="disp">Vier Paar Hände.<br>Eine Linie.</h2><a class="link" href="team.html" data-sub>Alle vier kennenlernen</a></div>
 <div class="who">{''.join(f'<span>{n} · <em>{r}</em></span>' for _, n, r, _ in TEAM)}</div>
</section>

<section class="blk daten" id="daten"><div class="wrap">
 <span class="kick">Branche in Zahlen</span><h2 class="disp">Warum wir<br>Nachwuchs feiern.</h2>
 <div class="stats">
  <div class="stat"><b data-count="80118">0</b><p>Friseursalons in Deutschland, Ende 2025 – 245 weniger als im Vorjahr.</p></div>
  <div class="stat"><b data-count="7497">0</b><p>neue Ausbildungsverträge Friseur/-in 2025 – bundesweit.</p></div>
  <div class="stat"><b data-count="40.6" data-dec="1" data-pre="−" data-suf=" %">0</b><p>weniger Friseur-Azubis in NRW seit 2014.</p></div>
 </div>
 <h3 class="disp" style="font-size:clamp(30px,3.4vw,48px);margin:60px 0 6px">Wann wieder?</h3><p class="lead">So lange hält ein Schnitt, bis er rauswächst (Erfahrungswerte).</p>
 <div class="bars" data-bars>
  <div class="bar"><span class="t">Skin Fade</span><div class="tr"><i class="f" data-w="25"></i></div><span class="v">2–3 Wo.</span></div>
  <div class="bar"><span class="t">Kurzhaarschnitt</span><div class="tr"><i class="f" data-w="50"></i></div><span class="v">4–6 Wo.</span></div>
  <div class="bar"><span class="t">Farbe / Ansatz</span><div class="tr"><i class="f" data-w="66"></i></div><span class="v">6–8 Wo.</span></div>
  <div class="bar"><span class="t">Lange Stufen</span><div class="tr"><i class="f" data-w="83"></i></div><span class="v">8–10 Wo.</span></div>
 </div>
 <p class="src">Quellen: Zentralverband des Deutschen Friseurhandwerks, PM 06/2026 „Wirtschaftliche Lage“ (Salons, Ausbildungsverträge nach BIBB); Bezirksregierung Arnsberg (NRW seit 2014). Stand 11/2026.</p>
</div></section>

<section class="blk karriere" id="karriere"><div class="wrap split">
 <div><span class="kick">Karriere</span><div class="kin"><span>Ausbildung.</span><span>Meisterkurs.</span><span>4-Tage-Woche.</span></div>
 <p class="lead">Wir suchen Azubis und Friseur:innen. Feste Kundschaft ab dem ersten Monat, Meisterkurs bezahlt, Freitag oder Montag frei.</p>
 <a class="link" href="karriere.html" data-sub>Alles zu Ausbildung &amp; Job</a></div>
 <div class="apply"><span class="timer">60 s</span><h3>Bewerben in<br>60 Sekunden</h3><div class="prog60"><i></i></div>
  <div class="step on"><p style="opacity:.8;margin-bottom:12px">Kein Anschreiben. Drei Tipps.</p><button class="btn" data-next>Los geht's</button></div>
  <div class="step"><label>Was suchst du?</label><div class="opts">{''.join(f'<button class="opt" data-next data-pick="1">{t}</button>' for t in ['Ausbildung', 'Job als Friseur:in', 'Praktikum'])}</div></div>
  <div class="step"><label>Wie viel Erfahrung?</label><div class="opts">{''.join(f'<button class="opt" data-next data-pick="1">{t}</button>' for t in ['Keine', 'Unter 2 Jahre', '2 Jahre +', 'Meister:in'])}</div></div>
  <div class="step"><form><label for="ap-n">Vorname</label><input id="ap-n" autocomplete="given-name" required><label for="ap-t">Handynummer</label><input id="ap-t" type="tel" autocomplete="tel" required><p style="margin-top:16px"><button class="btn" type="submit">Abschicken</button></p></form></div>
  <div class="step"><h3 style="color:var(--or)">Danke!</h3><p style="opacity:.8;margin-top:8px">Demo: Es wurde nichts gesendet. Im echten Betrieb ruft Theo innerhalb von 48 Stunden zurück.</p></div>
 </div>
</div></section>

<section class="blk" id="bewertungen"><div class="wrap">
 <span class="kick">Bewertungen</span><h2 class="disp">Was Kund:innen<br>sagen könnten.</h2>
 <p class="lead">Dieser Musterbetrieb hat noch keine echten Bewertungen. Im echten Betrieb stehen hier Google-Note, Anzahl und Stand – live gezählt.</p>
 <div class="revs">
  <div class="rev"><p>„Endlich hat mir jemand erklärt, warum mein Wirbel immer absteht – und den Schnitt danach gerichtet.“</p><small>Beispiel · noch keine echte Bewertung</small></div>
  <div class="rev"><p>„Termin um 22 Uhr im Bett gebucht, am nächsten Morgen war eine Lücke frei. Kein Anruf nötig.“</p><small>Beispiel · noch keine echte Bewertung</small></div>
  <div class="rev"><p>„Farbe vorher auf dem Foto gesehen, genau so ist sie geworden.“</p><small>Beispiel · noch keine echte Bewertung</small></div>
 </div>
</div></section>
</main>''' + foot()


def subpage(name, title, kick, h1, lead, img, body, desc):
    return head(f'{title} – HAARSCHARF', desc) + header(True) + f'''<main>
<section class="sub-hero"><div class="wrap"><a class="back" href="index.html#zurueck">Zurück zur Umdrehung</a><br><span class="kick">{kick}</span><h1 class="disp">{h1}</h1><p class="lead">{lead}</p></div></section>
<div class="wrap"><div class="sub-img rv">{pic(img, title, sizes='100vw')}</div></div>
<section class="blk" style="padding-top:60px"><div class="wrap">{body}
<p style="margin-top:40px;display:flex;gap:12px;flex-wrap:wrap"><a class="btn" href="index.html#termin">Termin wählen</a><a class="btn ghost" href="index.html#zurueck">Zurück zur Umdrehung</a></p></div></section></main>''' + foot(True)


def steps(items): return '<div class="steps">' + ''.join(f'<div><b>{a}</b><p>{b}</p></div>' for a, b in items) + '</div>'
def faq(items): return '<div class="faq">' + ''.join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in items) + '</div>'


PAGES = {
 'beratung': ('Beratung', '0° · Vorne', 'Erst reden.<br>Dann schneiden.', 'Fünf Minuten vor dem Spiegel sparen dir sechs Wochen Ärger. So läuft unsere Beratung.', 'beratung',
   steps([('Kopfform', 'Wir schauen auf Stirn, Hinterkopf und Wirbel – sie entscheiden, wo Länge bleibt.'), ('Alltag', 'Helm, Mütze, Sport, Büro: Dein Morgen bestimmt, wie viel Styling realistisch ist.'), ('Foto', 'Zeig uns deinen Wunschlook. Wir sagen ehrlich, was bei deinem Haar geht.'), ('Plan', 'Länge oben, Übergang, Nacken – wir sprechen jeden Schritt ab, bevor die Maschine angeht.')])
   + '<div class="prose"><h2>Foto vorher schicken</h2><p>Du kannst beim Buchen ein Foto deines Wunschlooks anhängen. Dein Stylist sieht es vor dem Termin und plant die Zeit richtig ein.</p><h2>Ruhige Stunde</h2><p>Donnerstags von 19 bis 21 Uhr: Termine ohne Smalltalk, gedimmtes Licht, leise Musik. Für alle, die beim Friseur einfach abschalten wollen.</p></div>'
   + faq([('Kostet die Beratung extra?', 'Nein, sie ist Teil jedes Termins.'), ('Kann ich ohne Termin kommen?', 'Wenn ein Stuhl frei ist, ja. Sicherer ist ein Termin – die Warteliste meldet freie Lücken per SMS.')]), 'Beratung vor jedem Schnitt bei HAARSCHARF.'),
 'schnitt': ('Schnitt & Übergang', '90° · Seite', 'Der Übergang<br>macht den Schnitt.', 'Was 0,5 mm von 9 mm unterscheidet – und warum ein guter Fade keine Stufen hat.', 'look2',
   '<div class="mm"><span class="kick">mm-Lineal</span><h3 class="disp" style="font-size:34px;margin:8px 0 14px">Was bedeutet die Zahl auf dem Aufsatz?</h3><input type="range" min="0" max="5" value="2" aria-label="Aufsatzlänge"><div class="scale"><span>0,5</span><span>1,5</span><span>3</span><span>6</span><span>9</span><span>12 mm</span></div><div class="out"><b>3 mm</b><div><p></p><div class="hairbar"></div></div></div></div>'
   + steps([('Grundlänge', 'Oben wird mit der Schere die Länge festgelegt, nass oder trocken je nach Haar.'), ('Linie setzen', 'Die Fade-Höhe (low, mid, high) wird als erste Linie gesetzt.'), ('Blenden', 'Mit drei Aufsätzen und halben Stufen wird die Kante weggearbeitet.'), ('Freihand', 'Zum Schluss Schere über Kamm und Trimmer – bis kein Absatz mehr sichtbar ist.')])
   + '<div class="prose"><h2>Low, Mid oder High?</h2><ul><li><b>Low Fade</b>: beginnt knapp über dem Ohr, dezent, bürotauglich.</li><li><b>Mid Fade</b>: auf Schläfenhöhe, der Klassiker.</li><li><b>High Fade</b>: bis zur Kopfrundung, starker Kontrast.</li></ul><h2>Wann wieder?</h2><p>Ein Skin Fade wächst nach 2–3 Wochen sichtbar heraus, ein weicher Taper hält 4–6 Wochen.</p></div>', 'Fade, Taper und Übergang erklärt.'),
 'nacken': ('Nackenlinie', '180° · Hinten', 'Hinten sieht\'s jeder.<br>Außer dir.', 'Rund, eckig oder ausgefadet: Die Nackenlinie entscheidet, wie gepflegt ein Schnitt nach zwei Wochen aussieht.', 'look3',
   steps([('Rund', 'Weich, wächst unauffällig heraus. Gut bei Wirbeln im Nacken.'), ('Eckig', 'Klare Kante, wirkt frisch geschnitten – braucht öfter Pflege.'), ('Ausgefadet', 'Läuft auf Haut aus, keine Linie sichtbar. Hält am längsten sauber.'), ('Handspiegel', 'Bevor du aufstehst, zeigen wir dir den Hinterkopf im Spiegel.')])
   + '<div class="prose"><h2>Nacken nachschneiden zwischendurch</h2><p>Für Stammkund:innen: Konturen-Termin in 15 Minuten, ohne Waschen.</p></div>', 'Nackenlinien rund, eckig, ausgefadet.'),
 'bart': ('Bart & Kontur', '270° · Seite', 'Bart und Kontur<br>aus einer Hand.', 'Der Übergang vom Fade in den Bart ist die schwierigste Stelle am Kopf. Darum machen wir beides im selben Termin.', 'look1',
   steps([('Länge', 'Bart mit Aufsatz auf eine Länge, Kinn etwas länger für Form.'), ('Wangenlinie', 'Natürlich oder scharf – wir richten sie nach deiner Gesichtsform.'), ('Hals', 'Zwei Finger über dem Adamsapfel, nie höher.'), ('Übergang', 'Der Fade läuft ohne Absatz in den Bart.')])
   + faq([('Rasiert ihr auch nass?', 'Ja, mit Einwegklinge und warmem Tuch – hygienisch, ohne Rasiermesser-Show.'), ('Wie oft Bartpflege?', 'Alle 2–3 Wochen, dazwischen hält ein Trimmer die Linie.')]), 'Bart und Kontur bei HAARSCHARF.'),
 'farbe': ('Farbe', 'Farbe', 'Dieselbe Frau.<br>Fünf Farben.', 'Von Aschblond bis Espresso: wie wir Farbe planen, testen und pflegen.', 'farbe-prozess',
   steps([('Haaranalyse', 'Ausgangsfarbe, Struktur und frühere Färbungen bestimmen, was geht.'), ('Strähnentest', 'Eine Strähne vorher, damit du das Ergebnis siehst.'), ('Färben', 'Balayage frei Hand, Foliensträhnen oder Ansatz – mit Pflege-Bond.'), ('Glossing', 'Glanz und Tonung zum Schluss, hält 6–8 Wochen.')])
   + '<div class="prose"><h2>Balayage oder Strähnen?</h2><p>Balayage wird frei Hand gemalt und wächst weich heraus. Foliensträhnen sind gleichmäßiger und heller. Wir zeigen dir beides an Fotos.</p></div>'
   + faq([('Wie lange dauert ein Farbtermin?', 'Ansatz rund 1,5 Stunden, Balayage 3 bis 4 Stunden.'), ('Schadet Färben dem Haar?', 'Wir arbeiten mit Bond-Pflege, die die Haarstruktur beim Aufhellen schützt.')]), 'Haarfarbe, Balayage und Pflege.'),
 'termin': ('Dein Termin', 'Termin', 'Dein Stuhl.<br>Deine Zeit.', 'Online buchen, erinnert werden, Lücken nutzen: So läuft ein Termin bei uns.', 'salon',
   steps([('Buchen', 'Leistung, Stylist, Zeit – rund um die Uhr, auch nachts.'), ('Erinnerung', '24 Stunden vorher kommt eine SMS. Verschieben geht per Tipp.'), ('Warteliste', 'Wird früher etwas frei, melden wir uns zuerst bei dir.'), ('Im Salon', 'Beratung, Waschen, Schnitt, Styling. Bezahlen mit Karte oder Handy.')])
   + faq([('Was passiert, wenn ich nicht kann?', 'Bis 12 Stunden vorher kostenlos verschieben. Der Platz geht an die Warteliste.'), ('Kann ich einen Wunsch-Stylisten wählen?', 'Ja, oder „egal wer“ für den frühesten Termin.')]), 'Online-Termin mit Stylistenwahl.'),
 'team': ('Team', 'Team', 'Vier Paar Hände.<br>Eine Linie.', 'Jede:r hat einen Schwerpunkt – und alle schneiden nach derselben Beratung.', 'team',
   '<div class="steps">' + ''.join(f'<div><b>{n}</b><p>{r}</p></div>' for _, n, r, _ in TEAM) + '</div><div class="prose"><h2>Weiterbildung</h2><p>Jeden Monat ein Trainingsabend im Salon, zweimal im Jahr ein Seminar extern – bezahlt.</p></div>', 'Das Team von HAARSCHARF.'),
 'karriere': ('Karriere', 'Karriere', 'Ausbildung.<br>Meisterkurs.<br>4-Tage-Woche.', 'Wir suchen Azubis und Friseur:innen. Was du bekommst – offen und ohne Kleingedrucktes.', 'ausbildung',
   steps([('Ausbildung', '3 Jahre, Trainingsabend jede Woche, eigene Kundschaft ab dem 2. Jahr.'), ('Meisterkurs', 'Wir zahlen den Meisterkurs, du bleibst danach zwei Jahre.'), ('4-Tage-Woche', 'Montag oder Freitag frei, fester Plan vier Wochen im Voraus.'), ('Feste Kundschaft', 'Online-Termine landen direkt in deinem Kalender.')])
   + '<div class="prose"><h2>Warum das wichtig ist</h2><p>Ende 2025 gab es in Deutschland 80.118 Friseursalons, aber nur 7.497 neue Ausbildungsverträge. In NRW ist die Zahl der Friseur-Azubis seit 2014 um 40,6 % gesunken. Wer jetzt lernt, wird gebraucht.</p><p style="font-size:13px;color:var(--mute)">Quellen: Zentralverband des Deutschen Friseurhandwerks, PM 06/2026; Bezirksregierung Arnsberg. Stand 11/2026.</p></div>'
   + '<p><a class="btn" href="index.html#karriere">In 60 Sekunden bewerben</a></p>', 'Ausbildung und Jobs bei HAARSCHARF.'),
}


def lookpage(k, n, s, tags, txt, rhythm, how):
    wk = int(rhythm.split('–')[-1].split()[0])
    body = steps([(f'Schritt {i + 1}', h) for i, h in enumerate(how)] + [('Wann wieder?', f'Nach {rhythm} wächst der Look sichtbar raus.')])
    body += f'<p><button class="btn ghost" data-ics="{wk}" data-title="HAARSCHARF: {n} nachschneiden">Erinnerung in {wk} Wochen in den Kalender</button></p>'
    others = ''.join(f'<a class="look" href="look-{k2}.html" data-tags="">{pic(k2, n2)}<div class="cap"><b>{n2}</b><small>{s2}</small></div></a>' for k2, n2, s2, *_ in LOOKS if k2 != k and GENDER[k2] == GENDER[k])
    body += f'<h2 class="disp" style="font-size:clamp(30px,3.4vw,48px);margin:60px 0 18px">Andere Looks</h2><div class="grid6">{others}</div>'
    return subpage('look-' + k, n, f'Look · {s}', n + '.', txt, k, body, f'{n}: Ablauf, Pflege und Rhythmus.')


LEGAL = '<div class="prose"><p>{t}</p></div>'
if __name__ == '__main__':
    open(os.path.join(H, 'index.html'), 'w').write(index())
    for k, v in PAGES.items(): open(os.path.join(H, k + '.html'), 'w').write(subpage(k, *v))
    for L in LOOKS: open(os.path.join(H, f'look-{L[0]}.html'), 'w').write(lookpage(*L))
    open(os.path.join(H, 'impressum.html'), 'w').write(subpage('impressum', 'Impressum', 'Rechtliches', 'Impressum', 'HAARSCHARF ist eine Demo-Webseite eines Musterbetriebs.', 'salon', LEGAL.format(t='Diese Seite zeigt, wie eine moderne Friseur-Webseite aussehen kann. Es gibt keinen echten Salon HAARSCHARF. Konzept und Umsetzung: Projekt EX, projektex.de. Alle Personen auf den Fotos sind KI-generiert. Adresse, Telefon, Termine und Bewertungen sind Beispiele.'), 'Impressum'))
    open(os.path.join(H, 'datenschutz.html'), 'w').write(subpage('datenschutz', 'Datenschutz', 'Rechtliches', 'Datenschutz', 'Kurz: Diese Demo speichert nichts und sendet nichts.', 'salon', LEGAL.format(t='Schriften liegen auf diesem Server, es werden keine Daten an Google oder andere Dienste übertragen. Es gibt keine Cookies, kein Tracking und keine Formularübermittlung. Eingaben in Termin- und Bewerbungsformular bleiben in deinem Browser und werden beim Neuladen gelöscht. Hosting: GitHub Pages (GitHub Inc.), dabei werden technisch notwendige Server-Logs erfasst.'), 'Datenschutz'))
    print('ok', 3 + len(PAGES) + len(LOOKS), 'Seiten')
