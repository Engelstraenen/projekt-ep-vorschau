(function () {
  const path = location.pathname;
  const inPaket3d = path.includes("/paketstadt3d");
  const onPersonal = path.includes("/personal");
  const onBotsPage = /\/bots\/?$/.test(path) || path.includes("/bots/");
  const root3d = inPaket3d ? "./" : "../paketstadt3d/";

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

  // Redirect personal/#/bots -> dedicated bots demo (avoids login wall / wrong chrome)
  if (onPersonal && (location.hash === "#/bots" || location.hash.startsWith("#/bots"))) {
    location.replace("../bots/");
    return;
  }

  function activeKey() {
    if (onBotsPage) return "bots";
    if (onPersonal) return "personal";
    if (path.includes("/social")) return "social";
    if (path.includes("/shop-raum") || path.includes("/dashboard")) return "dashboard";
    if (location.hash === "#social") return "social";
    if (location.hash === "#lager" || location.search.includes("view=lager")) return "lager";
    if (location.hash === "#dashboard") return "dashboard";
    return "stadt";
  }

  const items = [
    { id: "stadt", label: "Stadt", href: root3d + "?style=A" },
    { id: "lager", label: "Lager", href: root3d + "?style=A#lager" },
    { id: "dashboard", label: "Dashboard", href: root3d + "?style=A#dashboard" },
    { id: "personal", label: "Personal", href: onPersonal ? "#/" : "../personal/" },
    { id: "bots", label: "Bots", href: onBotsPage ? "./" : "../bots/" },
    { id: "social", label: "Social", href: root3d + "?style=A#social" }
  ];

  function scrollActiveIntoView(root) {
    const on = root.querySelector('[aria-current="page"], .active');
    if (on && on.scrollIntoView) on.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }

  function buildNav(mountHideNative) {
    if (document.getElementById("exPaketNav")) return document.getElementById("exPaketNav");
    const wrap = document.createElement("div");
    wrap.id = "exPaketNav";
    wrap.setAttribute("role", "navigation");
    wrap.setAttribute("aria-label", "Paketstadt Bereiche");
    const cur = activeKey();
    wrap.innerHTML =
      '<div class="ex-nav-shell"><span class="ex-nav-fade l" aria-hidden="true"></span><div class="ex-nav-scroll" role="tablist">' +
      items
        .map((it) => {
          const on = it.id === cur;
          return `<a href="${it.href}" role="tab" data-ex-tab="${it.id}" ${on ? 'aria-current="page" class="active"' : ""}>${it.label}</a>`;
        })
        .join("") +
      '</div><span class="ex-nav-fade r" aria-hidden="true"></span></div>';
    document.body.appendChild(wrap);
    if (mountHideNative) document.body.classList.add("ex-paket-nav-on");
    setTimeout(() => scrollActiveIntoView(wrap), 50);
    wrap.querySelectorAll("a[data-ex-tab]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("data-ex-tab");
        if (id === "bots") ensureLogin();
        if (id === "personal") ensureLogin();
      });
    });
    return wrap;
  }

  if (inPaket3d && document.querySelector("nav.switch")) {
    document.body.classList.add("ex-has-native-switch");
    const sw = document.querySelector("nav.switch");

    // Intercept Bots -> /bots/ with auto-login (not personal/#/bots)
    document.addEventListener(
      "click",
      (e) => {
        const b = e.target.closest && e.target.closest('button[data-view="bots"]');
        if (!b || !sw.contains(b)) return;
        e.preventDefault();
        e.stopPropagation();
        ensureLogin();
        location.href = "../bots/";
      },
      true
    );

    function applyHash() {
      const h = location.hash.replace("#", "");
      if (h === "social") {
        document.getElementById("exSocialTab")?.click();
        return;
      }
      if (h === "dashboard" || h === "lager" || h === "stadt") {
        sw.querySelector('[data-view="' + h + '"]')?.click();
      }
    }
    window.addEventListener("hashchange", applyHash);
    if (location.hash) setTimeout(applyHash, 700);

    sw.querySelectorAll("button[data-view]").forEach((b) => {
      b.addEventListener("click", () => {
        if (document.body.classList.contains("ex-social-open")) {
          document.getElementById("exSocialClose")?.click();
        }
      });
    });

    // When social opens, show shared nav clone for the 6 tabs
    const obs = new MutationObserver(() => {
      if (document.body.classList.contains("ex-social-open")) {
        const nav = buildNav(false);
        nav.querySelectorAll("a").forEach((a) => {
          a.classList.toggle("active", a.getAttribute("data-ex-tab") === "social");
          if (a.getAttribute("data-ex-tab") === "social") a.setAttribute("aria-current", "page");
          else a.removeAttribute("aria-current");
        });
        scrollActiveIntoView(nav);
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // Zoom + marker
    injectZoom();
    injectMarker();
    // Scroll native switch so Social/Bots visible hint
    setTimeout(() => {
      const bots = sw.querySelector('[data-view="bots"]');
      bots && bots.scrollIntoView({ inline: "nearest", block: "nearest" });
    }, 800);
    return;
  }

  buildNav(true);

  function injectZoom() {
    if (document.getElementById("exZoomHelp")) return;
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
            window.paketstadt.setView && window.paketstadt.setView("stadt");
          } catch (_) {}
          const back = document.getElementById("backBtn");
          if (back && !back.hidden) back.click();
        }
      });
    }, 100);
  }

  function injectMarker() {
    if (document.getElementById("exSocialMarker")) return;
    const btn = document.createElement("button");
    btn.id = "exSocialMarker";
    btn.type = "button";
    btn.innerHTML = "<b>Social Studio</b><small>Kanäle &amp; Ads · tippen</small>";
    btn.addEventListener("click", () => document.getElementById("exSocialTab")?.click());
    document.body.appendChild(btn);
  }
})();
