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

  const COLORS = { instagram:"#c13584", tiktok:"#111111", youtube:"#e11d48", google:"#1a73e8", all:"#0071e3" };
  const GLYPH = {
    all: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="3.2" fill="#c13584"/><circle cx="12" cy="8" r="3.2" fill="#111"/><circle cx="17" cy="12" r="3.2" fill="#e11d48"/><circle cx="12" cy="16" r="3.2" fill="#1a73e8" opacity=".9"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.3" fill="currentColor"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4v9.2a3.8 3.8 0 1 1-2.6-3.6V7.2c.9.9 2.1 1.5 3.4 1.7V4H14z" fill="currentColor"/><path d="M14 4v9.2a3.8 3.8 0 1 1-2.6-3.6" fill="none" stroke="#25f4ee" stroke-width="1.4" opacity=".7"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3.5" fill="currentColor"/><path d="M11 9.5v5l5-2.5-5-2.5z" fill="#fff"/></svg>',
    google: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 0 16c4.2 0 7.2-2.9 7.2-7 0-.5-.05-1-.14-1.4H12v2.9h4.1A4.2 4.2 0 1 1 12 7.8V4z" fill="currentColor"/></svg>'
  };
  function ringBtn(id, label, active, pct){
    const col = COLORS[id] || "#0071e3";
    const r=18, c=2*Math.PI*r, dash = (Math.max(0.08, Math.min(1,pct||0.72))*c).toFixed(1);
    return `<button type="button" class="sx-ring ${active?"active":""}" data-v="${id}" style="--ch:${col}">
      <div class="orb">
        <svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="bg" cx="22" cy="22" r="${r}"/><circle class="fg" cx="22" cy="22" r="${r}" stroke-dasharray="${dash} ${c.toFixed(1)}" transform="rotate(-90 22 22)"/></svg>
        <span class="glyph" style="color:${col}">${GLYPH[id]||GLYPH.all}</span>
      </div>${label}
    </button>`;
  }

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
  function dateLabels(n) {
    const out = [];
    const now = new Date(2026, 10, 9);
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now); d.setDate(now.getDate() - i);
      out.push(d.getDate() + "." + (d.getMonth() + 1));
    }
    return out;
  }
  function chartSVG() {
    const list = view === "all" ? ids : [view];
    const seriesMap = list.map((id) => ({ id, color: COLORS[id], values: D.channels[id].series.slice(-18) }));
    const n = Math.min(...seriesMap.map((s) => s.values.length));
    seriesMap.forEach((s) => { s.values = s.values.slice(-n); });
    const w = 360, h = 168, padL = 36, padR = 10, padT = 12, padB = 28;
    const all = seriesMap.flatMap((s) => s.values);
    const max = Math.max(...all, 1);
    const min = Math.min(...all, 0);
    const span = Math.max(max - min, 1);
    const step = (w - padL - padR) / Math.max(n - 1, 1);
    const labels = dateLabels(n);
    function pts(values, vmax) {
      const lo = view === "all" && list.length > 1 ? 0 : min;
      const sp = view === "all" && list.length > 1 ? Math.max(...seriesMap.flatMap(s=>s.values),1) : span;
      const top = view === "all" && list.length > 1 ? Math.max(...seriesMap.flatMap(s=>s.values),1) : max;
      return values.map((v, i) => {
        const x = padL + i * step;
        const y = padT + (1 - (v - (view==="all"&&list.length>1?0:min)) / (view==="all"&&list.length>1?top:span)) * (h - padT - padB);
        return [x, y, v];
      });
    }
    function path(values) {
      const p = pts(values);
      return p.map((pt, i) => (i ? "L" : "M") + pt[0].toFixed(1) + "," + pt[1].toFixed(1)).join(" ");
    }
    const useOverlay = list.length > 1;
    const scaleMax = useOverlay ? Math.max(...seriesMap.flatMap((s) => s.values), 1) : max;
    const scaleMin = useOverlay ? 0 : min;
    const scaleSpan = Math.max(scaleMax - scaleMin, 1);
    function pts2(values) {
      return values.map((v, i) => {
        const x = padL + i * step;
        const y = padT + (1 - (v - scaleMin) / scaleSpan) * (h - padT - padB);
        return [x, y, v];
      });
    }
    function path2(values) {
      const p = pts2(values);
      return p.map((pt, i) => (i ? "L" : "M") + pt[0].toFixed(1) + "," + pt[1].toFixed(1)).join(" ");
    }
    const axisY = [0, 0.5, 1].map((t) => {
      const v = Math.round(scaleMin + scaleSpan * t);
      const y = padT + (1 - t) * (h - padT - padB);
      return `<text x="${padL-6}" y="${y+3}" text-anchor="end" class="sx-axis">${nf.format(v)}</text><line x1="${padL}" y1="${y}" x2="${w-padR}" y2="${y}" class="sx-grid"/>`;
    }).join("");
    const xLabs = [0, Math.floor((n-1)/2), n-1].map((i) => `<text x="${(padL + i*step).toFixed(1)}" y="${h-8}" text-anchor="middle" class="sx-axis">${labels[i]}</text>`).join("");
    const fillPts = pts2(seriesMap[0].values);
    const fillLine = fillPts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
    const area = !useOverlay ? fillLine + ` L${fillPts.at(-1)[0]},${h-padB} L${fillPts[0][0]},${h-padB} Z` : "";
    const lines = seriesMap.map((s) => {
      const p = path2(s.values);
      const dots = pts2(s.values).filter((_,i)=> i%Math.max(1,Math.floor(n/6))===0 || i===n-1).map((pt)=>`<circle class="sx-dot" data-v="${pt[2]}" data-ch="${s.id}" cx="${pt[0]}" cy="${pt[1]}" r="3.2" fill="#fff" stroke="${s.color}" stroke-width="2"/>`).join("");
      return `<path d="${p}" fill="none" stroke="${s.color}" stroke-width="${useOverlay?2:2.6}" stroke-linecap="round" stroke-linejoin="round"/>${dots}`;
    }).join("");
    const legend = seriesMap.map((s)=>`<span class="sx-leg"><i style="background:${s.color}"></i>${D.channels[s.id].name}</span>`).join("");
    return `<div class="sx-chart-wrap"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Verlauf">
      <defs><linearGradient id="agFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0071e3" stop-opacity=".28"/><stop offset="100%" stop-color="#0071e3" stop-opacity="0"/></linearGradient></defs>
      ${axisY}${xLabs}${area?`<path d="${area}" fill="url(#agFill)"/>`:""}${lines}
    </svg><div class="sx-legend">${legend}</div><div class="sx-tip" id="sxTip"></div></div>`;
  }

  function render() {
    const o = metrics();
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
        <div class="sx-rings" role="tablist">${ringBtn("all","Mix",view==="all",0.88)}${ids.map((id)=>{const o=D.channels[id].organic; const pct=Math.min(0.95,(o.likes||1)/Math.max(o.reach||o.followers||1,1)*6); return ringBtn(id,D.channels[id].name,view===id,pct||0.6);}).join("")}</div>
        <div class="sx-kpis">
          <div class="sx-kpi"><b data-n="${o.followers}">0</b><span>Follower</span></div>
          <div class="sx-kpi"><b data-n="${o.reach}">0</b><span>Reichweite</span></div>
          <div class="sx-kpi"><b data-n="${o.views}">0</b><span>Views</span></div>
          <div class="sx-kpi"><b data-n="${o.leads}">0</b><span>Ads-Leads · ROAS ${nf.format(o.roas)}</span></div>
        </div>
      </div>
      <div class="sx-tabs">${[["overview","Überblick"],["ads","Ads"],["posts","Posts"],["live","Live"],["camp","Kampagnen"]].map(([id,l])=>`<button type="button" data-sec="${id}" class="${section===id?"active":""}">${l}</button>`).join("")}</div>

      <div class="sx-panel ${section==="overview"?"on":""}">
        <div class="sx-sec"><h3>Verlauf</h3><div class="sx-chart" id="sxChart">${chartSVG()}</div></div>
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
      const pool = ["+18 Likes · Instagram · Beispiel", "Neuer Kommentar · TikTok · Beispiel", "+4 CRM-Leads · Google · Beispiel", "Reel 91 % Completion · Beispiel"];
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
