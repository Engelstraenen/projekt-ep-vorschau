// Übersicht · Stempeluhr · Schichtplan
import { ic, esc, de, deKurz, av, STATUS, ORT, act, get, toast, dialog, link3d, LINKS, isGF, login, chipSt, sevIc } from './core.js';

const need = (o) => { const a = o.aktiv.length, p = o.pause.length, f = o.fehlt.length; const cells = []; for (let i = 0; i < Math.max(o.bedarf, a + p); i++) cells.push(i < a ? '<i></i>' : i < a + p ? '<i class="p"></i>' : i < a + p + f ? '<i class="x"></i>' : '<i class="e"></i>');
  const bad = o.anwesend < o.bedarf; return `<a class="need" href="${link3d('station:' + o.id)}" title="Im Lager zeigen"><div><b>${esc(o.name)}</b><small>${o.pause.length ? o.pause.length + ' in Pause · ' : ''}${o.fehlt.length ? o.fehlt.length + ' fehlt · ' : ''}${o.spaeter.length ? o.spaeter.length + ' später' : bad ? 'Lücke' : 'besetzt'}</small></div><div class="bar">${cells.join('')}</div><div class="v ${bad ? 'bad' : ''}">${o.anwesend}/${o.bedarf}</div></a>`; };

export function exItem(p, compact = false) {
  return `<div class="ex ${p.schwere}"><span class="ic">${ic(sevIc[p.typ] || 'alert')}</span><div style="min-width:0;flex:1"><b>${esc(p.titel)}</b><p>${esc(p.text)}</p>
    ${compact ? '' : `<div class="row wrap gap6"><a class="chip" href="${link3d(p.ziel.ref, p.ziel.view)}">${ic('pin')}${p.ziel.view === 'office' ? 'Im Office zeigen' : 'Im Lager zeigen'}</a><a class="chip" href="${p.personal || '#/'}">${ic('arrow')}Öffnen</a><a class="chip" href="${LINKS.lager}&ops=probleme">${ic('alert')}Problem-Center</a></div>`}</div></div>`;
}
export function propCard(v, small = false) {
  if (!v) return '';
  const [a, b] = v.satz.split(' brauchst du ');
  return `<div class="card prop"><span class="lbl">Besetzungsvorschlag · aus Scannern + Paketprognose</span><h3>${esc(a)} brauchst du <em>${esc(b)}</em>.</h3>
    <p class="calc">${esc(v.rechnung)}<br>Eingeplant jetzt: <b>${v.eingeplant}</b> (${esc(v.eingeplant_namen.join(', ') || '–')})${v.endet_vor_cutoff.length ? ` · ${esc(v.endet_vor_cutoff.map((x) => x.anzeige + ' bis ' + x.bis).join(', '))}` : ''}${v.spaeter.length ? ` · später: ${esc(v.spaeter.map((x) => x.anzeige + ' ab ' + x.ab).join(', '))}` : ''}</p>
    ${small ? '' : `<p class="calc muted" style="margin-top:6px">Tagesplan: ${esc(v.tagesplan.text)} (${esc(v.tagesplan.rechnung)}).</p>`}
    <div class="row wrap gap6" style="margin-top:12px">${v.status === 'ok' ? '<span class="chip g">' + ic('check') + 'Besetzung reicht bis Cutoff</span>' : v.vorschlaege.map((s, i) => `<button class="btn ${i ? '' : 'p'} sm" data-prop='${esc(JSON.stringify(s.aktion))}'>${ic(i ? 'arrow' : 'check')}${esc(s.text)}</button>`).join('')}</div></div>`;
}
export function bindProps(el, refresh) { el.querySelectorAll('[data-prop]').forEach((b) => b.addEventListener('click', async () => { b.disabled = true; const r = await act(JSON.parse(b.dataset.prop)); if (r) toast(r.event?.text || 'Übernommen', '', 'Figur im Lager reagiert live · <a href="' + LINKS.lager + '">Lager öffnen</a>'); refresh(); })); }

export function uebersicht(S) {
  const k = S.kpi; const me = S.mitarbeiter.find((m) => m.id === login.get()?.ma); const st = S.stationen; const pp = S.problems;
  const wo = (pred) => S.mitarbeiter.filter(pred);
  const groups = [['Lager', wo((m) => m.ort_3d.startsWith('lager:') && m.status === 'eingestempelt')], ['Pause', wo((m) => m.status === 'pause')], ['Office', wo((m) => m.ort_3d.startsWith('office:') && m.status === 'eingestempelt')], ['Mobil', wo((m) => m.ort_3d === 'mobil')], ['Nicht da', wo((m) => !['eingestempelt', 'pause'].includes(m.status))]];
  return { title: `Guten Tag, ${esc(me?.vorname || 'Markus')}`, sub: `Do 29.10.2026 · ${S.jetzt} Demo-Uhr · wer da ist, was Lager und Versand brauchen und was rot ist`,
    act: `<a class="btn" href="${LINKS.lager}">${ic('map')}Im Lager ansehen</a><a class="btn p" href="#/plan">${ic('cal')}Schichtplan</a>`,
    html: `<div class="grid g4">
      <div class="card stat"><span class="lbl">Eingestempelt</span><b>${k.eingestempelt}</b><small>von ${k.gesamt} · ${k.anwesend} im Betrieb</small></div>
      <div class="card stat"><span class="lbl">Pause</span><b>${k.pause}</b><small>${esc(wo((m) => m.status === 'pause').map((m) => m.anzeige).join(', ') || '–')}</small></div>
      <div class="card stat ${k.krank ? 'bad' : ''}"><span class="lbl">Abwesend</span><b>${k.krank + k.urlaub}</b><small>${k.krank} krank · ${k.urlaub} Urlaub</small></div>
      <div class="card stat"><span class="lbl">Später</span><b>${k.spaeter}</b><small>Spätschicht ab 14:00</small></div></div>
    <div class="grid g21" style="margin-top:16px">
      <div class="grid" style="align-content:start">
        <div class="card"><div class="ch"><h2>Bedarf je Station</h2><span class="lbl">aus Versand & WWS</span><div class="r"><a class="jump" href="${LINKS.lager}">${ic('pin')}3D-Lager</a></div></div>
          ${st.map(need).join('')}
          <div class="legend"><span><i></i>da</span><span><i class="p" style="background:var(--amber)"></i>Pause</span><span><i class="k"></i>fehlt (krank/Urlaub)</span><span><i style="background:#e6ddd2;border:0"></i>offen</span></div></div>
        ${propCard(S.vorschlag)}
        <div class="card"><div class="ch"><h2>Wer ist wo</h2><span class="lbl">gleiche Daten wie die Figuren in der Paketstadt</span></div>
          <div class="grid g2" style="gap:6px 20px">${groups.map(([n, l]) => `<div><span class="lbl">${n} · ${l.length}</span><div class="list" style="margin-top:4px">${l.map((m) => `<a class="li" href="#/akte/${m.id}">${av(m)}<span class="tx"><b>${esc(m.anzeige)}</b><small>${esc(m.status === 'eingestempelt' ? ORT(m.ort_3d) : STATUS[m.status] + (m.pause_min != null ? ' · ' + m.pause_min + ' Min.' : ''))}</small></span></a>`).join('') || '<div class="empty">–</div>'}</div></div>`).join('')}</div></div>
      </div>
      <div class="grid" style="align-content:start">
        <div class="card"><div class="ch"><h2>Ausnahmen Personal</h2><span class="chip c">${pp.length}</span><div class="r"><a class="jump" href="${LINKS.lager}&ops=probleme">${ic('alert')}Problem-Center</a></div></div>${pp.map((p) => exItem(p)).join('') || '<div class="empty">Keine Ausnahmen</div>'}</div>
        <div class="card"><div class="ch"><h2>Freigaben</h2><span class="chip ${k.freigaben_offen ? 'c' : 'g'}">${k.freigaben_offen} offen</span><div class="r"><a class="jump" href="#/freigaben">alle ${ic('chev')}</a></div></div>
          <div class="list">${S.freigaben.filter((f) => f.status === 'offen').slice(0, 4).map((f) => `<a class="li" href="#/freigaben">${av({ anzeige: f.anzeige, abteilung_id: S.mitarbeiter.find((m) => m.id === f.ma)?.abteilung_id })}<span class="tx"><b>${esc(f.anzeige)} · ${esc(f.titel)}</b><small>${esc(f.text)}</small></span>${f.konflikt ? '<span class="chip c">Konflikt</span>' : ''}</a>`).join('')}</div></div>
        <div class="card"><div class="ch"><h2>Personal & Umsatz</h2><span class="lbl">heute · auch in Shop-Raum H</span></div>
          <div class="kv"><span>Personalkosten (Plan)</span><b>${de(k.personalkosten_tag)} €</b><span>Umsatz heute</span><b>${de(k.umsatz_tag)} €</b><span>Quote</span><b>${de(k.personalkostenquote, 1)} %</b></div><p class="muted" style="font-size:11.5px;margin-top:8px">${esc(k.hinweis_kosten)}</p>
          <a class="jump" style="margin-top:8px" href="${LINKS.dashboard}">${ic('store')}Im Dashboard (Shop-Raum H)</a></div>
        <div class="card"><div class="ch"><h2>Live-Protokoll</h2><span class="lbl">Event-Bus</span></div><div class="list">${S.protokoll.slice(0, 7).map((p) => `<div class="li"><span class="muted" style="font-size:12px;width:40px">${p.uhr}</span><span class="tx"><b style="font-weight:550;white-space:normal">${esc(p.text)}</b><small>${esc(p.wer)}</small></span></div>`).join('')}</div></div>
      </div></div>`,
    bind: (el, ctx) => bindProps(el, ctx.refresh) };
}

// ---------- Stempeluhr ----------
const hm = (min) => `${Math.floor(Math.max(0, min) / 60)}:${String(Math.max(0, min) % 60).padStart(2, '0')}`;
export function stempelCard(m, compact = false) {
  const az = m.arbeitszeit_heute; const st = m.status; const s = (art) => [...(m.stempel || [])].reverse().find((x) => x.art === art);
  const pill = st === 'eingestempelt' ? '<span class="statuspill"><i></i>eingestempelt</span>' : st === 'pause' ? `<span class="statuspill pause"><i></i>Pause seit ${m.pause_seit}</span>` : st === 'krank' ? '<span class="statuspill krank"><i></i>krank gemeldet</span>' : `<span class="statuspill off"><i></i>${esc(STATUS[st] || st)}</span>`;
  const btns = st === 'eingestempelt' ? `<button class="btn lg pause" data-st="pause_start">${ic('pause')}Pause starten</button><button class="btn lg c" data-st="gehen">${ic('out')}Gehen</button>`
    : st === 'pause' ? `<button class="btn lg pause" data-st="pause_ende">${ic('play')}Pause beenden</button><button class="btn lg c" data-st="gehen">${ic('out')}Gehen</button>`
    : st === 'krank' || st === 'urlaub' || m.zeiterfassung ? '' : `<button class="btn lg p" data-st="kommen">${ic('play')}Kommen</button>`;
  return `<div class="card clockcard" data-ma="${m.id}"><div class="row">${av(m)}<div><b style="font-size:15px">Hallo ${esc(m.vorname)}</b><div class="muted" style="font-size:12px">${esc(m.rolle)} · ${esc(m.station_name)}</div></div><span class="sp"></span>${pill}</div>
    ${m.zeiterfassung ? `<p class="note" style="margin-top:14px">${esc(m.zeiterfassung)} – keine Stempelpflicht.</p>` : `<div class="bigtime" data-live-start="${(m.stempel || []).find((x) => x.art === 'kommen') ? 1 : 0}">${hm(az.netto)}</div><div class="muted" style="font-size:12.5px">${m.eingestempelt_um ? 'seit ' + m.eingestempelt_um + ' eingestempelt · netto heute' : 'heute noch nicht eingestempelt'}</div>
    <div class="stl"><div><span>Kommen</span><b>${m.eingestempelt_um || '–'}</b></div><div class="pa"><span>Pause</span><b>${st === 'pause' ? 'läuft seit ' + m.pause_seit : az.pause ? az.pause + ' Min.' : '–'}</b></div><div><span>Gehen</span><b>${s('gehen')?.uhr || '–'}</b></div><div><span>Ort</span><b>${esc(ORT(m.ort_3d))}</b></div>${m.aufgabe ? `<div><span>Aufgabe</span><b>${esc(m.aufgabe)}</b></div>` : ''}</div>
    ${m.arbzg?.map((a) => `<p class="note ${a.schwere === 'hoch' ? 'w' : ''}" style="margin-bottom:10px">${ic('clock')}${esc(a.text)}</p>`).join('') || ''}
    <div class="stbtns">${btns}</div>`}
    ${compact ? '' : `<p class="muted" style="font-size:11.5px;margin-top:12px">${ic('pin')} Stempeln wirkt sofort: Figur in der Paketstadt geht an die Station, in den Pausenraum oder verschwindet. <span class="bd s">BEISPIELDATEN</span></p>`}</div>`;
}
export function bindStempel(el, ctx, quelleGF = false) {
  el.querySelectorAll('[data-st]').forEach((b) => b.addEventListener('click', async () => { const ma = b.closest('[data-ma]').dataset.ma; b.disabled = true; const r = await act({ typ: 'stempel', ma, art: b.dataset.st, quelle: quelleGF ? 'Korrektur GF' : undefined }); if (r) toast(r.event.text + ' · ' + r.event.uhr, '', 'Paketstadt: <a href="' + link3d('ma:' + ma) + '">Figur ansehen</a>'); ctx.refresh(); }));
}
export function stempel(S, ctx) {
  const L = login.get(); const mine = S.ich || S.mitarbeiter.find((m) => m.id === L?.ma);
  if (!isGF()) return { title: 'Stempeluhr', sub: 'Kommen, Pause, Gehen – vom Handy, wirkt sofort im Lager', html: `<div class="grid g2"><div>${stempelCard(mine)}</div><div class="grid" style="align-content:start">${ichHeute(mine)}</div></div>`, bind: (el) => bindStempel(el, ctx) };
  const sel = ctx.param || 'ma02'; const m = S.mitarbeiter.find((x) => x.id === sel) || S.mitarbeiter[1];
  const rows = S.mitarbeiter.filter((x) => !x.zeiterfassung);
  return { title: 'Zeiterfassung', sub: 'Stempeluhr der Mitarbeitenden · links live, rechts Vorschau der Handy-App (GF kann korrigieren, wird protokolliert)',
    html: `<div class="grid g21"><div class="card"><div class="ch"><h2>Heute · ${S.jetzt}</h2><span class="lbl">Terminal + App</span></div><div class="tscroll"><table class="tbl"><thead><tr><th>Person</th><th>Status</th><th>Kommen</th><th class="n">Pause</th><th class="n">Netto</th><th>ArbZG</th></tr></thead><tbody>
      ${rows.map((x) => `<tr style="cursor:pointer" data-go="#/stempel/${x.id}" ${x.id === m.id ? 'class="sel" style="background:#f6f0e8"' : ''}><td><div class="pn">${av(x)}<div><b>${esc(x.anzeige)}</b><div class="muted" style="font-size:11.5px">${esc(x.station_name)}</div></div></div></td><td><span class="chip ${chipSt(x.status)}">${esc(STATUS[x.status] || x.status)}</span></td><td>${x.eingestempelt_um || '–'}</td><td class="n">${x.arbeitszeit_heute.pause ? x.arbeitszeit_heute.pause + "'" : '–'}</td><td class="n">${x.eingestempelt_um ? hm(x.arbeitszeit_heute.netto) : '–'}</td><td>${x.arbzg.map((a) => `<span class="chip ${a.schwere === 'hoch' ? 'c' : 'a'}" title="${esc(a.text)}">${a.art === 'ruhezeit' ? '§ 5 Ruhezeit' : a.art === 'pause' ? '§ 4 Pause' : '§ 3'}</span>`).join(' ') || '<span class="muted">ok</span>'}</td></tr>`).join('')}</tbody></table></div></div>
      <div><span class="lbl" style="display:block;margin:0 0 8px 4px">Handy-App von ${esc(m.anzeige)} (Vorschau)</span>${stempelCard(m)}</div></div>`,
    bind: (el) => { bindStempel(el, ctx, true); el.querySelectorAll('[data-go]').forEach((r) => r.addEventListener('click', () => (location.hash = r.dataset.go))); } };
}
export function ichHeute(m) {
  const p = m.schicht_heute || {}; return `<div class="card"><div class="ch"><h2>Heute</h2></div><div class="kv"><span>Schicht</span><b>${p.von ? p.von + '–' + p.bis : esc(m.schichtmodell)}</b><span>Station</span><b>${esc(m.station_name)}</b><span>Urlaub übrig</span><b>${m.urlaub_rest ?? '–'} Tage</b><span>Zeitkonto</span><b>${m.saldo_h == null ? '–' : (m.saldo_h > 0 ? '+' : '') + de(m.saldo_h, 1) + ' h'}</b></div>
    ${m.sperren?.length ? `<div class="lockbox" style="margin-top:12px">${ic('lock')}<div><b>Stapler für dich gesperrt</b><small>${esc((m.qualifikationen || []).filter((q) => q.status !== 'gueltig' && q.status !== 'laeuft_ab').map((q) => q.name + ' ' + (q.status === 'fehlt' ? 'fehlt' : 'abgelaufen')).join(' · '))}</small></div></div>` : ''}
    <div class="row wrap gap6" style="margin-top:12px"><a class="btn sm" href="#/abwesenheiten">${ic('heart')}Krank melden</a><a class="btn sm" href="#/abwesenheiten">${ic('sun')}Urlaub beantragen</a><a class="btn sm" href="#/akte/${m.id}">${ic('user')}Meine Akte</a></div></div>`;
}

// ---------- Schichtplan mit Paketkurve + Drag-Umplanung ----------
const H0 = 6, H1 = 22; const pctOf = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return ((h + m / 60 - H0) / (H1 - H0)) * 100; };
const toHM = (p) => { let t = H0 + (p / 100) * (H1 - H0); t = Math.round(t * 4) / 4; const h = Math.floor(t), m = Math.round((t - h) * 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; };
export async function plan(S, ctx) {
  const L0 = login.get() || {}; const P = await get('/plan' + (L0.rolle === 'ma' ? `?rolle=ma&ma=${L0.ma}` : '')); const mode = ctx.param === 'woche' ? 'woche' : 'tag'; const me = login.get()?.ma; const gf = isGF();
  const people = Object.fromEntries((S.mitarbeiter || [S.ich]).map((m) => [m.id, m]));
  const head = `<div class="seg" role="tablist"><button class="${mode === 'tag' ? 'on' : ''}" data-mode="tag">Tag · Do 29.10.</button><button class="${mode === 'woche' ? 'on' : ''}" data-mode="woche">Woche KW 44</button></div>`;
  if (mode === 'woche') {
    const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']; const ids = gf ? Object.keys(P.wochenplan) : [me];
    return { title: 'Schichtplan', sub: 'KW 44 · 26.10.–01.11.2026', act: head, html: `<div class="card"><div class="tscroll"><table class="tbl week"><thead><tr><th>Person</th>${P.woche.map((d, i) => `<th class="${d === P.heute ? 'today' : ''}">${days[i]} ${deKurz(d)}</th>`).join('')}</tr></thead><tbody>
      ${ids.map((id) => { const m = P.tag.find((t) => t.ma === id); return `<tr><td><div class="pn">${av(m)}<div><b>${esc(m.anzeige)}</b><div class="muted" style="font-size:11.5px">${esc(m.rolle)}</div></div></div></td>${P.woche.map((d) => { const e = P.wochenplan[id][d] || {}; return `<td class="${d === P.heute ? 'today' : ''}"><span class="cell ${e.typ}">${e.von ? e.von + '–' + e.bis : e.typ === 'frei' ? 'frei' : e.typ === 'krank' ? 'krank' : e.typ === 'urlaub' ? 'Urlaub' : '–'}</span></td>`; }).join('')}</tr>`; }).join('')}</tbody></table></div></div>`, bind: (el) => el.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => (location.hash = '#/plan/' + b.dataset.mode))) };
  }
  const kurve = P.paketkurve; const max = Math.max(...kurve.map((k) => k.pakete)) || 1;
  const pts = kurve.map((k) => [((k.h + 0.5 - H0) / (H1 - H0)) * 1000, 90 - (k.pakete / max) * 78]);
  const path = 'M' + pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' L');
  const nowP = pctOf(P.jetzt), cutP = pctOf(P.cutoff);
  const rows = P.stationen.map((st) => { const sh = P.tag.filter((t) => t.station === st.id && (t.von || t.typ === 'krank' || t.typ === 'urlaub'));
    return `<div class="prow ${st.luecke ? 'gap' : ''}" data-row="${st.id}"><div class="lb"><b>${esc(st.name)}</b><small class="${st.luecke ? 'bad' : ''}">${st.anwesend}/${st.bedarf}${st.luecke ? ' · unterbesetzt' : ''}</small></div><div class="lane" style="height:${Math.max(64, sh.length * 28 + 12)}px">
      ${sh.map((t, i) => { const m = people[t.ma] || t; const typ = t.typ === 'krank' || t.typ === 'urlaub' ? t.typ : t.typ === 'spaet' ? 'spaet' : ''; const von = t.von || '08:00', bis = t.bis || '16:30'; const l = pctOf(typ ? (t.ma === 'ma05' ? '06:00' : '08:00') : von), r = pctOf(typ ? '16:30' : bis);
        const can = gf && !typ && ['eingestempelt', 'pause', 'spaetschicht'].includes(t.status); const lock = (m.sperren || []).length && st.id !== 'wareneingang' ? '' : '';
        return `<div class="sh ${typ} ${t.status === 'pause' ? 'pause' : ''} ${t.ma === me ? 'mine' : ''} ${can ? '' : 'ro'}" data-ma="${t.ma}" data-st="${t.status}" style="left:${l}%;width:${r - l}%;top:${6 + i * 28}px" title="${esc(m.anzeige)} ${typ ? '· ' + typ : von + '–' + bis}">${av(m)}${esc(m.anzeige)} <small>${typ === 'krank' ? 'krank' : typ === 'urlaub' ? 'Urlaub' : von + '–' + bis}${t.umgeplant ? ' · umgeplant ' + t.umgeplant : ''}${t.status === 'pause' ? ' · Pause' : ''}</small>${lock}</div>`; }).join('')}</div></div>`; }).join('');
  const ticks = [6, 8, 10, 12, 14, 16, 18, 20, 22].map((h) => `<span style="left:${((h - H0) / (H1 - H0)) * 100}%">${h}</span>`).join('');
  const v = P.vorschlag;
  return { title: 'Schichtplan', sub: `Bedarf aus Paketprognose (${v.prognose} Pakete), Cutoff ${P.cutoff} und Retouren · ${gf ? 'Balken auf eine andere Station ziehen = umplanen (Figur geht im Lager mit), seitlich ziehen = Schichtbeginn verschieben' : 'deine Schicht ist markiert'}`, act: head,
    html: `<div class="grid g21"><div class="card"><div class="plan" id="plan">
      <div class="axis"><div></div><div class="ticks">${ticks}</div></div>
      <div class="curve"><div class="lb"><b>Paketkurve</b><small>${v.prognose} Pakete · Prognose Shop</small></div><svg viewBox="0 0 1000 96" preserveAspectRatio="none"><defs><linearGradient id="pk" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9735a" stop-opacity=".32"/><stop offset="1" stop-color="#d9735a" stop-opacity=".02"/></linearGradient></defs>
        <rect x="${pctOf(P.packfenster[0]) * 10}" y="0" width="${(pctOf(P.packfenster[1]) - pctOf(P.packfenster[0])) * 10}" height="96" fill="#e3e7da" opacity=".45"/>
        <path d="${path} L${pts[pts.length - 1][0]},96 L${pts[0][0]},96 Z" fill="url(#pk)"/><path d="${path}" fill="none" stroke="#d9735a" stroke-width="2.2" vector-effect="non-scaling-stroke"/></svg></div>
      ${rows}
      <div class="now" style="left:calc(190px + (100% - 190px) * ${nowP / 100})"><b>jetzt ${P.jetzt}</b></div><div class="cut" style="left:calc(190px + (100% - 190px) * ${cutP / 100})"><b>Cutoff ${P.cutoff}</b></div>
    </div><div class="legend"><span><i></i>Früh/Normal</span><span><i class="l"></i>Spät</span><span><i class="k"></i>krank/Urlaub</span><span><i class="p"></i>gerade Pause</span><span>${ic('drag')}ziehen zum Umplanen</span></div></div>
    <div class="grid" style="align-content:start">${propCard(v, true)}<div class="card"><div class="ch"><h2>Regeln beim Umplanen</h2></div><div class="list">
      <div class="li">${ic('lock')}<span class="tx"><b>Qualifikation</b><small class="w">Wareneingang/Stapler nur mit gültigem Staplerschein + Unterweisung – Mehmet Y. und Emma K. sind gesperrt.</small></span></div>
      <div class="li">${ic('clock')}<span class="tx"><b>Arbeitszeitgesetz</b><small class="w">Ruhezeit (§ 5) und Pausen (§ 4) werden geprüft und als Warnung gezeigt.</small></span></div>
      <div class="li">${ic('users')}<span class="tx"><b>Plätze je Station</b><small class="w">Kommissionierung 3 · Packen 3 · Versand 1 · Retouren 2 · Wareneingang 1.</small></span></div></div></div></div></div>
    <p class="muted only-m" style="margin-top:10px;font-size:12.5px">Am Handy: Balken antippen, dann Station wählen.</p>`,
    bind: (el) => { el.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => (location.hash = '#/plan/' + b.dataset.mode))); bindProps(el, ctx.refresh); if (gf) bindDrag(el, P, ctx); } };
}
function stationDialog(ma, P, ctx) {
  const t = P.tag.find((x) => x.ma === ma);
  dialog(`<h3>${esc(t.anzeige)} umplanen</h3><p class="muted">Heute · jetzt ${P.jetzt}. Die Figur geht in der Paketstadt sofort an die neue Station.</p><div class="opts">${P.stationen.map((s) => `<button data-s="${s.id}" ${s.id === t.station ? 'disabled' : ''}>${ic('pin')}<span><b>${esc(s.name)}</b><small>${s.anwesend}/${s.bedarf} besetzt${s.id === t.station ? ' · aktuelle Station' : ''}</small></span></button>`).join('')}</div><div class="bt"><button class="btn q" data-close>Abbrechen</button></div>`,
    (d, close) => d.querySelectorAll('[data-s]').forEach((b) => b.addEventListener('click', async () => { close(); const r = await act({ typ: 'umplanen', ma, station: b.dataset.s }); if (r) toast(r.event.text, '', '<a href="' + link3d('ma:' + ma) + '">Im Lager zusehen</a>'); ctx.refresh(); })));
}
function bindDrag(el, P, ctx) {
  const plan = el.querySelector('#plan'); if (!plan) return;
  plan.querySelectorAll('.sh:not(.ro)').forEach((bar) => {
    let st = null;
    bar.addEventListener('pointerdown', (e) => { if (e.button) return; e.preventDefault(); bar.setPointerCapture(e.pointerId); const lane = bar.parentElement; st = { x: e.clientX, y: e.clientY, l: parseFloat(bar.style.left), w: lane.getBoundingClientRect().width, row: bar.closest('.prow'), moved: false }; });
    bar.addEventListener('pointermove', (e) => { if (!st) return; const dx = e.clientX - st.x, dy = e.clientY - st.y; if (!st.moved && Math.hypot(dx, dy) < 6) return; st.moved = true; bar.classList.add('drag');
      bar.style.transform = `translate(${dx}px,${dy}px)`; plan.querySelectorAll('.prow').forEach((r) => r.classList.remove('drop')); const r = document.elementsFromPoint(e.clientX, e.clientY).find((n) => n.classList?.contains('prow')); if (r && r !== st.row) r.classList.add('drop'); st.target = r; st.dx = dx; st.dy = dy; });
    const end = async (e) => { if (!st) return; const s = st; st = null; bar.classList.remove('drag'); plan.querySelectorAll('.prow').forEach((r) => r.classList.remove('drop'));
      if (!s.moved) { stationDialog(bar.dataset.ma, P, ctx); return; }
      bar.style.transform = ''; const ma = bar.dataset.ma;
      if (s.target && s.target !== s.row) { const r = await act({ typ: 'umplanen', ma, station: s.target.dataset.row }); if (r) toast(r.event.text, '', 'Figur läuft im Lager zur neuen Station · <a href="' + link3d('ma:' + ma) + '">ansehen</a>'); ctx.refresh(); return; }
      if (Math.abs(s.dx) > 8 && bar.dataset.st === 'spaetschicht') { const von = toHM(s.l + (s.dx / s.w) * 100); const r = await act({ typ: 'schicht_verschieben', ma, von }); if (r) toast(r.event.text); ctx.refresh(); return; }
      if (Math.abs(s.dx) > 8) toast('Laufende Schichten lassen sich nicht verschieben – nur noch nicht begonnene (z. B. Spätschicht).', 'err');
      ctx.refresh(); };
    bar.addEventListener('pointerup', end); bar.addEventListener('pointercancel', end);
  });
}
