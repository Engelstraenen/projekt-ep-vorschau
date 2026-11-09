(function () {
  const D = window.EX_AGENTUR;
  const ids = Object.keys(D.channels);
  let view = "all";
  let rangeNote = "30 Tage";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nf = new Intl.NumberFormat("de-DE");
  const eu = (n) => {
    const digits = Math.abs(n) < 10 && n % 1 !== 0 ? 2 : 0;
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(n);
  };
  const pct = (n) => nf.format(n) + " %";

  const posts = [
    { ch: "instagram", title: "Reel: Agentur-Ablauf in 30s", reach: 22100, eng: "5,2 %" },
    { ch: "tiktok", title: "Hook: Dashboard statt Chaos", reach: 51000, eng: "8,4 %" },
    { ch: "youtube", title: "Erklärfilm Systeme", reach: 13200, eng: "3,6 %" },
    { ch: "google", title: "Search · Agentur Leistungen", reach: 9800, eng: "2,7 %" }
  ];
  const camps = [
    { name: "Meta · Lead Ads", ch: "instagram", spend: 640, budget: 900, leads: 22 },
    { name: "TikTok · Traffic", ch: "tiktok", spend: 420, budget: 600, leads: 16 },
    { name: "YouTube · Awareness", ch: "youtube", spend: 780, budget: 1100, leads: 14 },
    { name: "Google · Brand + Search", ch: "google", spend: 920, budget: 1200, leads: 28 }
  ];
  const sentiments = ["pos", "pos", "neu", "pos", "neu", "neg"];

  function metrics() {
    const list = view === "all" ? ids : [view];
    const o = {
      followers: 0, reach: 0, views: 0, likes: 0, comments: 0, shares: 0,
      spend: 0, impressions: 0, clicks: 0, leads: 0, conversions: 0, roas: 0
    };
    list.forEach((id) => {
      const c = D.channels[id];
      Object.keys(c.organic).forEach((k) => { o[k] += c.organic[k] || 0; });
      o.spend += c.ads.spend || 0;
      o.impressions += c.ads.impressions || 0;
      o.clicks += c.ads.clicks || 0;
      o.leads += c.ads.leads || 0;
      o.conversions += c.ads.conversions || 0;
      o.roas += c.ads.roas || 0;
    });
    o.ctr = o.impressions ? Math.round((o.clicks / o.impressions) * 10000) / 100 : 0;
    o.cpc = o.clicks ? Math.round((o.spend / o.clicks) * 100) / 100 : 0;
    o.roas = Math.round((o.roas / list.length) * 10) / 10;
    return o;
  }
  function series() {
    const list = view === "all" ? ids : [view];
    const n = Math.min(...list.map((id) => D.channels[id].series.length));
    const out = [];
    for (let i = 0; i < n; i++) out.push(list.reduce((a, id) => a + D.channels[id].series[i], 0));
    return out;
  }
  function comments() {
    const list = view === "all" ? ids : [view];
    const out = [];
    list.forEach((id) => D.channels[id].comments.forEach((c) => out.push({ ...c, ch: D.channels[id].name })));
    return out;
  }
  function leads() {
    return D.leads.filter((l) => view === "all" || l.channel === view);
  }

  function render() {
    const o = metrics();
    const s = series();
    const max = Math.max(...s, 1);
    const list = view === "all" ? ids : [view];
    const tick = [
      "+18 Likes · Instagram · Beispiel",
      "Neuer Kommentar · TikTok · Beispiel",
      "+4 CRM-Leads · Google · Beispiel",
      "Story 91 % Completion · Beispiel",
      "CTR 2,6 % · Meta · Beispiel",
      "+9 Saves · Instagram · Beispiel"
    ];
    document.getElementById("app").innerHTML = `
  <div class="top"><div><h1>Social Studio</h1><p class="sub">${D.hinweis} Verbunden mit Interessenten/CRM – nicht mit Versand.</p></div><div class="badge">${D.label}</div></div>
  <div class="sx-ticker" aria-label="Live-Ticker"><div class="sx-track">${tick.concat(tick).map((t) => `<span>${t}</span>`).join("")}</div></div>
  <div class="filters" role="group" aria-label="Kanal">${["all", ...ids].map((id) => `<button type="button" class="chip ${view === id ? "active" : ""}" data-v="${id}">${id === "all" ? "Alle Kanäle" : D.channels[id].name}</button>`).join("")}</div>
  <section class="status" aria-label="Anbindung">${list.map((id) => `<article class="glass"><b>${D.channels[id].name}</b><span><span class="dot"></span>${D.channels[id].status}<br>${D.channels[id].handle}</span></article>`).join("")}</section>
  <div class="panel-head" style="display:flex;justify-content:space-between;align-items:center;margin:4px 0 10px"><h2 style="font-size:16px;margin:0">Organisch</h2><span class="badge">BEISPIELDATEN · ${rangeNote}</span></div>
  <section class="grid" aria-label="Organische Kennzahlen">
   <article class="glass stat"><div class="stat-label">Follower</div><div class="stat-value">${nf.format(o.followers)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
   <article class="glass stat"><div class="stat-label">Reichweite</div><div class="stat-value">${nf.format(o.reach)}</div><div class="stat-meta"><strong>Beispiel</strong></div></article>
   <article class="glass stat"><div class="stat-label">Views</div><div class="stat-value">${nf.format(o.views)}</div><div class="stat-meta"><strong>Beispiel</strong> · ${nf.format(o.likes)} Likes · ${nf.format(o.comments)} Kommentare</div></article>
  </section>
  <section class="cmp" aria-label="Kanalvergleich">${list.map((id)=>{const c=D.channels[id];return `<article class="glass"><b>${c.name}</b><strong>${nf.format(c.organic.reach)}</strong><span class="stat-meta">Reichweite · Beispiel</span></article>`;}).join("")}</section>
  <section class="glass panel"><h2>Verlauf (Beispielserie)</h2>
    <div class="sx-bars" aria-label="Interaktiver Verlauf">${s.map((v,i)=>`<i style="height:${Math.max(8,Math.round(v/max*100))}%;animation-delay:${i*0.015}s" title="${nf.format(v)} (Beispiel)"></i>`).join("")}</div>
  </section>
  <section class="glass panel" aria-label="Ads Funnel"><h2>Ads-Funnel</h2>
   <div class="sx-funnel">
    <article class="glass stat"><div class="stat-label">Impressionen</div><div class="stat-value">${nf.format(o.impressions)}</div></article>
    <article class="glass stat"><div class="stat-label">Klicks</div><div class="stat-value">${nf.format(o.clicks)}</div><div class="stat-meta">CTR ${pct(o.ctr)} · CPC ${eu(o.cpc)}</div></article>
    <article class="glass stat"><div class="stat-label">Leads</div><div class="stat-value">${nf.format(o.leads)}</div></article>
    <article class="glass stat"><div class="stat-label">Conversions</div><div class="stat-value">${nf.format(o.conversions)}</div><div class="stat-meta">ROAS ${nf.format(o.roas)}</div></article>
   </div>
   <div class="grid" style="margin-top:12px">
    <article class="glass stat"><div class="stat-label">Ausgaben</div><div class="stat-value">${eu(o.spend)}</div></article>
   </div>
   <table class="table" style="margin-top:12px"><thead><tr><th>Kanal</th><th>Ausgaben</th><th>Impressionen</th><th>Klicks</th><th>CTR</th><th>CPC</th><th>Leads</th><th>ROAS</th></tr></thead><tbody>
   ${list.map((id)=>{const a=D.channels[id].ads;return `<tr><td>${D.channels[id].name}</td><td>${eu(a.spend)}</td><td>${nf.format(a.impressions)}</td><td>${nf.format(a.clicks)}</td><td>${pct(a.ctr)}</td><td>${eu(a.cpc)}</td><td>${nf.format(a.leads)}</td><td>${nf.format(a.roas)}</td></tr>`;}).join("")}
   </tbody></table>
  </section>
  <section class="glass panel"><h2>Top-Posts</h2>
   <div class="sx-posts">${posts.filter(p=>view==='all'||p.ch===view).map(p=>`<article class="glass sx-post"><div class="sx-thumb" aria-hidden="true"></div><div><b>${p.title}</b><p class="stat-meta">${D.channels[p.ch].name} · ${nf.format(p.reach)} Reichweite · Eng. ${p.eng}</p></div></article>`).join("")}</div>
  </section>
  <section class="glass panel sx-camp"><h2>Kampagnen · Budget</h2>
   ${camps.filter(c=>view==='all'||c.ch===view).map(c=>{const w=Math.round(c.spend/c.budget*100);return `<article class="item"><span class="who">${c.name}</span><p>${eu(c.spend)} / ${eu(c.budget)} · ${c.leads} Leads · Beispiel</p><div class="bar" style="--w:${w}%"><i></i></div></article>`;}).join("")}
  </section>
  <section class="glass panel"><h2>Kommentare · Stimmung</h2>
   <div class="list">${comments().map((c,i)=>{const snt=sentiments[i%sentiments.length];const lab=snt==='pos'?'positiv':snt==='neg'?'kritisch':'neutral';return `<article class="item"><span class="who">${c.a}</span><span class="when">${c.d} · ${c.ch}</span><span class="sx-sent ${snt}">${lab}</span><p>${c.t}</p></article>`;}).join("")}</div>
  </section>
  <section class="glass panel"><h2>Social-Leads → Interessenten / CRM</h2>
   <div class="list">${leads().map(l=>`<article class="item lead"><div><span class="who">${l.name}</span><p>${D.channels[l.channel].name} · ${l.interest}<br>${l.note} · ${l.status}</p></div><a href="../#kunden">${l.crm}</a></article>`).join("")}</div>
  </section>`;
    document.querySelectorAll("[data-v]").forEach((b) =>
      b.addEventListener("click", () => {
        view = b.getAttribute("data-v");
        render();
      })
    );
    if (!reduce) {
      document.querySelectorAll(".stat-value").forEach((el) => {
        el.animate([{ opacity: 0.4, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], {
          duration: 420,
          easing: "cubic-bezier(0.23, 1, 0.32, 1)",
          fill: "both"
        });
      });
    }
  }
  render();
})();
