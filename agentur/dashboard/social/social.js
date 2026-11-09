(function () {
  const D = window.EX_AGENTUR;
  const gsap = window.gsap;
  const ids = Object.keys(D.channels);
  let view = "all";
  let section = "overview";
  let feedTimer = null;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nf = new Intl.NumberFormat("de-DE");
  const eu = (n) => {
    const d = Math.abs(n) < 10 && n % 1 !== 0 ? 2 : 0;
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
  };
  const pct = (n) => nf.format(n) + " %";
  const short = { instagram: "IG", tiktok: "TT", youtube: "YT", google: "G" };
  const posts = [
    { ch: "instagram", title: "Reel: Ablauf in 30s", reach: 22100, eng: "5,2 %" },
    { ch: "tiktok", title: "Hook: Dashboard statt Chaos", reach: 51000, eng: "8,4 %" },
    { ch: "youtube", title: "Erklärfilm Systeme", reach: 13200, eng: "3,6 %" },
    { ch: "google", title: "Search · Leistungen", reach: 9800, eng: "2,7 %" }
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
    const o = { followers: 0, reach: 0, views: 0, likes: 0, comments: 0, shares: 0, spend: 0, impressions: 0, clicks: 0, leads: 0, conversions: 0, roas: 0 };
    list.forEach((id) => {
      const c = D.channels[id];
      Object.keys(c.organic).forEach((k) => { o[k] += c.organic[k] || 0; });
      ["spend", "impressions", "clicks", "leads", "conversions", "roas"].forEach((k) => { o[k] += c.ads[k] || 0; });
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
    return out.slice(-18);
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
  function chartSVG(values) {
    const w = 320, h = 140, pad = 8, max = Math.max(...values, 1);
    const step = (w - pad * 2) / Math.max(values.length - 1, 1);
    const pts = values.map((v, i) => [pad + i * step, h - pad - (v / max) * (h - pad * 2)]);
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    const area = line + ` L${pts.at(-1)[0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="agFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0071e3" stop-opacity=".4"/><stop offset="100%" stop-color="#0071e3" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#agFill)"/><path d="${line}" fill="none" stroke="#0071e3" stroke-width="2.5" stroke-linecap="round"/>
      ${pts.map((p, i) => `<circle class="sx-dot" data-v="${values[i]}" cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#fff" stroke="#0071e3" stroke-width="2"/>`).join("")}</svg><div class="sx-tip" id="sxTip"></div>`;
  }

  function render() {
    const o = metrics();
    const s = series();
    const list = view === "all" ? ids : [view];
    const funnel = [
      ["Impressionen", o.impressions, 1],
      ["Klicks", o.clicks, o.impressions ? o.clicks / o.impressions : 0],
      ["Leads", o.leads, o.clicks ? o.leads / o.clicks : 0],
      ["Conversions", o.conversions, o.leads ? o.conversions / o.leads : 0]
    ];
    document.getElementById("app").innerHTML = `<div class="sx sx-ag" id="sxRoot">
      <div class="sx-hero">
        <div class="sx-hero-top">
          <div><h2>Social Studio</h2><p class="sub">${D.hinweis} Verbunden mit Interessenten/CRM – nicht mit Versand.</p></div>
          <span class="sx-badge">${D.label}</span>
        </div>
        <div class="sx-rings" role="tablist">${["all", ...ids].map((id) => `<button type="button" class="sx-ring ${view === id ? "active" : ""}" data-v="${id}"><div class="orb">${id === "all" ? "Alle" : short[id]}</div>${id === "all" ? "Mix" : D.channels[id].name}</button>`).join("")}</div>
        <div class="sx-kpis">
          <div class="sx-kpi"><b data-n="${o.followers}">0</b><span>Follower</span></div>
          <div class="sx-kpi"><b data-n="${o.reach}">0</b><span>Reichweite</span></div>
          <div class="sx-kpi"><b data-n="${o.views}">0</b><span>Views</span></div>
          <div class="sx-kpi"><b data-n="${o.leads}">0</b><span>Ads-Leads · ROAS ${nf.format(o.roas)}</span></div>
        </div>
      </div>
      <div class="sx-tabs">${[["overview","Überblick"],["ads","Ads"],["posts","Posts"],["live","Live"],["camp","Kampagnen"]].map(([id,l])=>`<button type="button" data-sec="${id}" class="${section===id?"active":""}">${l}</button>`).join("")}</div>

      <div class="sx-panel ${section==="overview"?"on":""}">
        <div class="sx-sec"><h3>Verlauf</h3><div class="sx-chart" id="sxChart">${chartSVG(s)}</div></div>
        <div class="sx-sec"><h3>Anbindung</h3>${list.map((id)=>`<div class="sx-feed"><div class="item on"><strong>${D.channels[id].name}</strong> · ${D.channels[id].handle}<div class="sub">${D.channels[id].status}</div></div></div>`).join("")}</div>
      </div>
      <div class="sx-panel ${section==="ads"?"on":""}">
        <div class="sx-sec"><h3>Ads-Funnel</h3>
          <div class="sx-funnel">${funnel.map(([lab,val,r])=>`<div class="sx-funnel-row"><span>${lab}</span><i style="--r:${Math.max(.08,r)}"></i><b>${nf.format(val)}</b></div>`).join("")}</div>
          <p class="sub" style="margin-top:8px">Ausgaben ${eu(o.spend)} · CTR ${pct(o.ctr)} · CPC ${eu(o.cpc)}</p>
        </div>
      </div>
      <div class="sx-panel ${section==="posts"?"on":""}">
        <div class="sx-sec"><h3>Top-Posts</h3>
          <div class="sx-carousel">${posts.filter((p)=>view==="all"||p.ch===view).map((p)=>`<article class="sx-post"><div class="ph"><b>${D.channels[p.ch].name}</b></div><div class="meta"><strong>${p.title}</strong><span class="sub">${nf.format(p.reach)} · Eng. ${p.eng}</span></div></article>`).join("")}</div>
        </div>
      </div>
      <div class="sx-panel ${section==="live"?"on":""}">
        <div class="sx-sec"><h3>Live-Feed</h3><div class="sx-feed" id="sxFeed"></div></div>
        <div class="sx-sec"><h3>Kommentare</h3>${comments().map((c,i)=>{const snt=sentiments[i%sentiments.length];const lab=snt==="pos"?"positiv":snt==="neg"?"kritisch":"neutral";return `<div class="sx-feed"><div class="item on"><strong>${c.a}</strong> · ${c.ch}<span class="sx-sent ${snt}">${lab}</span><div>${c.t}</div></div></div>`;}).join("")}</div>
        <div class="sx-sec"><h3>Social-Leads → CRM</h3>${leads().map((l)=>`<div class="sx-feed"><div class="item on"><strong>${l.name}</strong><div class="sub">${D.channels[l.channel].name} · ${l.interest} · ${l.status}</div><a href="../#kunden" style="color:var(--sx-blue);font-weight:700;font-size:12px">${l.crm}</a></div></div>`).join("")}</div>
      </div>
      <div class="sx-panel ${section==="camp"?"on":""}">
        <div class="sx-sec sx-camp"><h3>Kampagnen</h3>${camps.filter((c)=>view==="all"||c.ch===view).map((c)=>{const w=Math.round(c.spend/c.budget*100);return `<article><strong>${c.name}</strong><div class="sub">${eu(c.spend)} / ${eu(c.budget)} · ${c.leads} Leads</div><div class="bar"><i data-w="${w}"></i></div></article>`;}).join("")}</div>
      </div>
    </div>`;

    document.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => { view = b.getAttribute("data-v"); render(); }));
    document.querySelectorAll("[data-sec]").forEach((b) => b.addEventListener("click", () => { section = b.getAttribute("data-sec"); render(); }));
    const tip = document.getElementById("sxTip");
    const chart = document.getElementById("sxChart");
    chart?.querySelectorAll(".sx-dot").forEach((dot) => {
      const show = () => {
        tip.textContent = nf.format(+dot.getAttribute("data-v")) + " · Beispiel";
        tip.style.left = (dot.getAttribute("cx") / 320) * 100 + "%";
        tip.style.top = (dot.getAttribute("cy") / 140) * 100 + "%";
        tip.style.opacity = "1";
      };
      dot.addEventListener("pointerenter", show);
      dot.addEventListener("pointerdown", show);
      dot.addEventListener("pointerleave", () => { tip.style.opacity = "0"; });
    });
    document.querySelectorAll(".sx-kpi b[data-n]").forEach((el) => {
      const target = +el.getAttribute("data-n");
      if (reduce || !gsap) { el.textContent = nf.format(target); return; }
      const obj = { v: 0 };
      gsap.to(obj, { v: target, duration: 0.85, ease: "power3.out", onUpdate: () => { el.textContent = nf.format(Math.round(obj.v)); } });
    });
    if (!reduce && gsap) {
      gsap.from(".sx-kpi", { y: 12, autoAlpha: 0, duration: 0.45, stagger: 0.05, ease: "power3.out" });
      document.querySelectorAll(".sx-funnel-row i").forEach((el, i) => {
      gsap.fromTo(el, { scaleX: 0.08 }, { scaleX: parseFloat(el.style.getPropertyValue("--r") || "1"), duration: 0.7, delay: i * 0.08, ease: "power3.out" });
    });
      document.querySelectorAll(".sx-camp .bar>i").forEach((el) => gsap.to(el, { width: el.getAttribute("data-w") + "%", duration: 0.8, ease: "power3.out" }));
    } else {
      document.querySelectorAll(".sx-funnel-row i").forEach((el) => { el.style.transform = "scaleX(" + (el.style.getPropertyValue("--r") || 1) + ")"; });
      document.querySelectorAll(".sx-camp .bar>i").forEach((el) => { el.style.width = el.getAttribute("data-w") + "%"; });
    }
    if (feedTimer) clearInterval(feedTimer);
    const feed = document.getElementById("sxFeed");
    if (feed && section === "live") {
      const pool = ["+18 Likes · Instagram · Beispiel", "Neuer Kommentar · TikTok · Beispiel", "+4 CRM-Leads · Google · Beispiel", "Story 91 % Completion · Beispiel"];
      let i = 0;
      const push = () => {
        const el = document.createElement("div");
        el.className = "item";
        el.textContent = pool[i++ % pool.length];
        feed.prepend(el);
        requestAnimationFrame(() => el.classList.add("on"));
        while (feed.children.length > 6) feed.removeChild(feed.lastChild);
      };
      push();
      if (!reduce) feedTimer = setInterval(push, 2800);
    }
  }
  render();
})();
