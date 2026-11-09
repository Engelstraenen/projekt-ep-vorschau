(function () {
  const path = location.pathname;
  const inPaket3d = path.includes("/paketstadt3d");
  const onPersonal = path.includes("/personal");
  const onBotsPage = path.includes("/bots");
  const onDashboard = path.includes("/dashboard") && path.includes("/systeme/");
  const onShop = path.includes("/shop-raum");
  const root3d = inPaket3d ? "./" : "../paketstadt3d/";
  // Dashboard = originales Paketstadt-Dashboard (Shop-Raum), genau wie der native Tab im 3D-Bundle
  const dashHref = onShop ? location.pathname + location.search : "../shop-raum/?from=paketstadt3d&style=A";

  function ensureLogin() {
    try {
      const cur = JSON.parse(localStorage.getItem("ep-login") || "null");
      if (!cur || !cur.ma) {
        localStorage.setItem(
          "ep-login",
          JSON.stringify({ rolle: "gf", ma: "ma17", name: "Markus B.", rollenname: "Geschäftsführung" })
        );
      }
    } catch (_) {}
  }
  ensureLogin();

  // ---------- v2: Icons + "Rein-Gefühl"-Überblendung (Tür) zwischen den Bereichen ----------
  const ICON = {
    stadt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20h18M5 20V10l7-5 7 5v10M9 20v-5h6v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    lager: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-5 9 5v11H3zM7 20v-7h10v7M7 16h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    dashboard: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V11M10 20V5M16 20v-6M21 20H3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
    personal: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5M16 5.5a3 3 0 010 5.6M18 14c1.7.6 2.8 2.2 3 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    bots: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="8" width="16" height="11" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8V4.5M9 13h.01M15 13h.01M9.5 16.2h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="3.8" r="1.2" fill="currentColor"/></svg>',
    social: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.6A4 4 0 0112 8a4 4 0 017 2.4C19 15.6 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };
  const ORT = {
    stadt: ["Stadt-Zentrale", "Stadt"], lager: ["Lager", "Lager"], dashboard: ["Laden", "Dashboard"],
    personal: ["Office", "Personal"], bots: ["Bot-Zentrum", "Bots"], social: ["Social-Studio", "Social"]
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gate = (function () {
    let el = null;
    function make() {
      if (el) return el;
      el = document.createElement("div");
      el.id = "exGate";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = '<span class="g-wing l"></span><span class="g-wing r"></span><div class="g-c"><span class="g-ic"></span><b></b><small>Beispieldaten</small></div>';
      (document.body || document.documentElement).appendChild(el);
      return el;
    }
    function fill(id, sub) {
      const e = make();
      const o = ORT[id] || ["", ""];
      e.dataset.id = id || "";
      e.querySelector(".g-ic").innerHTML = ICON[id] || "";
      e.querySelector("b").textContent = o[0] + (o[1] && o[1] !== o[0] ? " · " + o[1] : "");
      e.querySelector("small").textContent = sub || "Beispieldaten";
      return e;
    }
    return {
      // Tür schließt sich (Blende herein)
      show(id, dur, sub) {
        const e = fill(id, sub || "du gehst hinein …");
        e.classList.remove("open", "instant");
        if (dur === 0 || reduce) e.classList.add("instant");
        e.style.setProperty("--gd", (dur == null ? 0.4 : dur) + "s");
        void e.offsetWidth;
        e.classList.add("on");
      },
      // Tür geht auf (Blende hinaus)
      hide() {
        if (!el || !el.classList.contains("on")) return;
        el.classList.remove("instant");
        el.classList.add("open");
        setTimeout(() => el && el.classList.remove("on", "open"), reduce ? 0 : 900);
      },
      showInstant(id, sub) { this.show(id, 0, sub); }
    };
  })();
  window.exGate = gate;
  const fresh = (k, ms) => {
    try {
      const v = JSON.parse(sessionStorage.getItem(k) || "null");
      return v && Date.now() - v.ts < ms ? v : null;
    } catch (_) { return null; }
  };
  const pageKey = () =>
    inPaket3d ? null : onBotsPage ? "bots" : onPersonal ? "personal" : (onDashboard || onShop) ? "dashboard" : path.includes("/social") ? "social" : null;
  // Ankunft: Tür öffnet sich auf der Zielseite
  {
    const inn = fresh("ex-gate", 8000);
    const out = inPaket3d ? fresh("ex-gate-out", 12000) : null;
    if (inn && !inPaket3d) {
      try { sessionStorage.removeItem("ex-gate"); } catch (_) {}
      const go = () => {
        gate.showInstant(inn.id, "du bist drin");
        setTimeout(() => gate.hide(), 260);
      };
      document.body ? go() : document.addEventListener("DOMContentLoaded", go);
    } else if (inn && inPaket3d) {
      try { sessionStorage.removeItem("ex-gate"); } catch (_) {}
    }
    if (out) {
      const go = () => {
        if (out.to === "social") {
          // v3: Social von außen = direkt ins Social-Studio, keine Stadt-Zwischenfahrt
          document.body.dataset.exTab = "social";
          gate.showInstant("social", "Social wird geöffnet …");
        } else gate.showInstant(out.from, "zurück in die Stadt …");
        setTimeout(() => gate.hide(), 9000);
      };
      document.body ? go() : document.addEventListener("DOMContentLoaded", go);
    }
  }

  if (onPersonal && (location.hash === "#/bots" || location.hash.startsWith("#/bots"))) {
    location.replace("../bots/");
    return;
  }

  // Aktiver Tab aus dem echten App-Zustand: der native (ausgeblendete) Switch bekommt von der
  // Paketstadt bei jedem Ansichtswechsel aria-selected (auch bei Klick auf Gebäude/Lager in 3D).
  function nativeView() {
    const b = document.querySelector('nav.switch button[data-view][aria-selected="true"]');
    return b ? b.getAttribute("data-view") : null;
  }
  function activeKey() {
    if (inPaket3d) {
      const t = document.body.dataset.exTab;
      if (t && ["stadt", "lager", "dashboard", "personal", "bots", "social"].includes(t)) return t;
      if (document.body.classList.contains("ex-social-open")) return "social";
      const v = nativeView();
      if (v && items.some((i) => i.id === v)) return v;
      if (/[?&]view=lager/.test(location.search) || location.hash === "#lager") return "lager";
      return "stadt";
    }
    if (onBotsPage) return "bots";
    if (onPersonal) return "personal";
    if (onDashboard || onShop) return "dashboard";
    if (path.includes("/social")) return "social";
    if (location.hash === "#social" || document.body.classList.contains("ex-social-open")) return "social";
    if (location.hash === "#lager" || /view=lager/.test(location.search)) return "lager";
    return "stadt";
  }

  const items = [
    { id: "stadt", label: "Stadt", href: root3d + "?style=A" },
    { id: "lager", label: "Lager", href: root3d + "?style=A#lager" },
    { id: "dashboard", label: "Dashboard", href: dashHref },
    { id: "personal", label: "Personal", href: onPersonal ? "#/" : "../personal/" },
    { id: "bots", label: "Bots", href: onBotsPage ? "./" : "../bots/" },
    { id: "social", label: "Social", href: root3d + "?style=A#social" }
  ];

  function setActive(root, key) {
    root.querySelectorAll("a[data-ex-tab]").forEach((a) => {
      const on = a.getAttribute("data-ex-tab") === key;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    const on = root.querySelector("a.active");
    if (on) on.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }

  function buildNav() {
    let wrap = document.getElementById("exPaketNav");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "exPaketNav";
      wrap.setAttribute("role", "navigation");
      wrap.setAttribute("aria-label", "Paketstadt Bereiche");
      wrap.innerHTML =
        '<div class="ex-nav-shell"><span class="ex-nav-fade l" aria-hidden="true"></span><div class="ex-nav-scroll" role="tablist"></div><span class="ex-nav-fade r" aria-hidden="true"></span></div>';
      document.body.appendChild(wrap);
      const scroll = wrap.querySelector(".ex-nav-scroll");
      items.forEach((it) => {
        const a = document.createElement("a");
        a.href = it.href;
        a.setAttribute("role", "tab");
        a.setAttribute("data-ex-tab", it.id);
        a.innerHTML = (ICON[it.id] || "") + "<span>" + it.label + "</span>";
        a.setAttribute("aria-label", it.label);
        a.addEventListener("click", (e) => {
          if (it.id === "bots" || it.id === "personal") ensureLogin();
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
          if (inPaket3d && window.paketstadt && window.paketstadt.enter && !/[?&]capture/.test(location.search)) {
            e.preventDefault();
            setActive(wrap, it.id);
            document.body.dataset.exTab = it.id;
            window.paketstadt.enter(it.id);
            return;
          }
          if (!inPaket3d) {
            const from = pageKey();
            if (from === it.id) return;
            e.preventDefault();
            setActive(wrap, it.id);
            const to3d = it.id === "stadt" || it.id === "lager" || it.id === "social";
            try {
              if (to3d && from && from !== "social") sessionStorage.setItem("ex-gate-out", JSON.stringify({ from, to: it.id, ts: Date.now() }));
              else sessionStorage.setItem("ex-gate", JSON.stringify({ id: it.id, ts: Date.now() }));
            } catch (_) {}
            const toSocial = it.id === "social";
            gate.show(to3d && !toSocial && from && from !== "social" ? from : it.id, 0.36, to3d && !toSocial ? "zurück in die Stadt …" : "du gehst hinein …");
            const href = to3d ? root3d + "?style=A" + (from && from !== "social" ? "" : it.id === "stadt" ? "" : "#" + it.id) : a.href;
            setTimeout(() => (location.href = href), reduce ? 0 : 380);
            return;
          }
          if (inPaket3d && (it.id === "stadt" || it.id === "lager" || it.id === "dashboard")) {
            e.preventDefault();
            closeSocial();
            const api = window.paketstadt;
            if (it.id === "dashboard") {
              // Original-Verhalten der Paketstadt: Kamerafahrt ins Shop-Gebäude, dann Shop-Raum-Dashboard
              const nb = document.querySelector('nav.switch button[data-view="dashboard"]');
              setActive(wrap, "dashboard");
              if (nb && api && !/[?&]capture/.test(location.search)) nb.click();
              else location.href = it.href;
              return;
            }
            try {
              // Auf dem Handy startet die Paketstadt in der Problem-Liste: für Stadt/Lager auf 3D umschalten
              if (api && api.ops && api.ops.setMode && document.body.classList.contains("ops-full")) api.ops.setMode("3d");
              if (api && api.setView) api.setView(it.id);
              else location.href = it.href;
            } catch (_) {
              location.href = it.href;
            }
            setActive(wrap, it.id);
            return;
          }
          if (inPaket3d && it.id === "social") {
            e.preventDefault();
            document.getElementById("exSocialTab")?.click();
            setActive(wrap, "social");
            return;
          }
        });
        scroll.appendChild(a);
      });
    }
    document.body.classList.add("ex-paket-nav-on");
    if (inPaket3d) document.body.classList.add("ex-has-native-switch");
    setActive(wrap, activeKey());
    return wrap;
  }

  function closeSocial() {
    if (!document.body.classList.contains("ex-social-open")) return;
    const btn = document.getElementById("exSocialClose");
    if (btn) btn.click();
    document.body.classList.remove("ex-social-open");
    const panel = document.getElementById("exSocialPanel");
    if (panel) {
      panel.classList.remove("open");
      panel.setAttribute("aria-hidden", "true");
    }
  }

  const nav = buildNav();

  // Intercept native switch (hidden) for bots/dashboard if somehow clicked
  if (inPaket3d) {
    document.addEventListener(
      "click",
      (e) => {
        const b = e.target.closest && e.target.closest("nav.switch button[data-view]");
        if (!b) return;
        const v = b.getAttribute("data-view");
        if (v === "bots") {
          e.preventDefault();
          e.stopPropagation();
          ensureLogin();
          location.href = "../bots/";
        } else if (v === "personal") {
          e.preventDefault();
          e.stopPropagation();
          ensureLogin();
          location.href = "../personal/";
        }
      },
      true
    );

    let lastKey = null;
    const sync = () => {
      const k = activeKey();
      if (k === lastKey) return;
      lastKey = k;
      setActive(nav, k);
    };
    const obs = new MutationObserver(sync);
    obs.observe(document.body, { attributes: true, attributeFilter: ["class", "data-ex-tab"] });
    const sw = document.querySelector("nav.switch");
    if (sw) obs.observe(sw, { subtree: true, attributes: true, attributeFilter: ["aria-selected"] });
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);

    function applyHash() {
      const h = location.hash.replace("#", "");
      if ((h === "social" || h === "lager") && window.paketstadt && window.paketstadt.enter) {
        window.paketstadt.enter(h);
        setActive(nav, h);
      } else if (h === "social") document.getElementById("exSocialTab")?.click();
      else if (h === "lager" || h === "stadt") {
        try {
          window.paketstadt && window.paketstadt.setView && window.paketstadt.setView(h);
        } catch (_) {}
        setActive(nav, h || "stadt");
      } else if (h === "dashboard") document.querySelector('#exPaketNav a[data-ex-tab="dashboard"]')?.click();
    }
    window.addEventListener("hashchange", applyHash);
    if (location.hash) setTimeout(applyHash, 500);

    // Zoom + marker
    (function zoom() {
      let n = 0;
      const t = setInterval(() => {
        n++;
        if (!window.paketstadt && n < 80) return;
        clearInterval(t);
        if (!window.paketstadt || document.getElementById("exZoomHelp")) return;
        const box = document.createElement("div");
        box.id = "exZoomHelp";
        box.innerHTML =
          '<button type="button" data-z="in" aria-label="Reinzoomen">+</button>' +
          '<button type="button" data-z="out" aria-label="Rauszoomen">−</button>' +
          '<button type="button" class="ex-zoom-back" data-z="back" aria-label="Zurück">Zurück</button>';
        document.body.appendChild(box);
        const canvas = document.getElementById("c");
        function wheel(delta) {
          if (!canvas) return;
          const r = canvas.getBoundingClientRect();
          canvas.dispatchEvent(
            new WheelEvent("wheel", {
              bubbles: true,
              cancelable: true,
              clientX: r.left + r.width / 2,
              clientY: r.top + r.height / 2,
              deltaY: delta
            })
          );
        }
        box.addEventListener("click", (e) => {
          const z = e.target.getAttribute("data-z");
          if (z === "in") wheel(-140);
          else if (z === "out") wheel(140);
          else if (z === "back") {
            try {
              window.paketstadt.setView("stadt");
            } catch (_) {}
            document.getElementById("backBtn")?.click();
            setActive(nav, "stadt");
          }
        });
      }, 100);
    })();

    // Social als Ort in der Stadt: Pin hängt am Laden-Gebäude (folgt dem nativen 3D-Label bei Drehen/Zoomen)
    if (!document.getElementById("exSocialPin")) {
      const pin = document.createElement("button");
      pin.id = "exSocialPin";
      pin.type = "button";
      pin.className = "lbl";
      pin.setAttribute("aria-label", "Social Media öffnen (Beispieldaten)");
      pin.innerHTML = '<i></i>Social<span class="go">· Kanäle &amp; Ads</span>';
      pin.addEventListener("click", () => document.getElementById("exSocialTab")?.click());
      document.body.appendChild(pin);
      let ladenEl = null;
      const findLaden = () => {
        if (ladenEl && ladenEl.isConnected) return ladenEl;
        ladenEl = [...document.querySelectorAll("#labels .lbl")].find((e) => /^Laden/.test(e.textContent.trim())) || null;
        return ladenEl;
      };
      const follow = () => {
        const l = findLaden();
        const vis = l && !l.classList.contains("hidden") && getComputedStyle(l).display !== "none" &&
          !document.body.classList.contains("ops-full") && !document.body.classList.contains("ex-social-open");
        if (vis) {
          const r = l.getBoundingClientRect();
          pin.style.left = r.left + r.width / 2 + "px";
          pin.style.top = r.bottom + 40 + "px";
        }
        pin.classList.toggle("ex-off", !vis);
        requestAnimationFrame(follow);
      };
      requestAnimationFrame(follow);
    }
  }
})();
