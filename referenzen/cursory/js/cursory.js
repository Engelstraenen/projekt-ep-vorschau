(function () {
  var gsap = window.gsap;
  var stage = document.getElementById("stage");
  var page = document.getElementById("page");
  var wires = document.getElementById("wires");
  var framesHost = document.getElementById("frames");
  var statusEl = document.getElementById("status");
  var heroImg = document.getElementById("hero-img");
  var heroLine = document.getElementById("hero-line");
  var buildBtn = document.getElementById("build");
  var restartBtn = document.getElementById("restart");
  var calmBtn = document.getElementById("calm");
  var pieces = Array.prototype.slice.call(document.querySelectorAll(".piece"));
  var steps = Array.prototype.slice.call(document.querySelectorAll("#steps li"));
  var picks = Array.prototype.slice.call(document.querySelectorAll(".pick"));

  var PICKS = {
    reben: { src: "img/reben.webp", label: "Trauben in der Abendsonne", pos: "center" },
    glas: { src: "img/glas.webp", label: "Glas über der Lage", pos: "center 18%" },
    hang: { src: "img/hang.webp", label: "Licht über dem Hang", pos: "center" }
  };
  var NAMES = {
    nav: "Nav",
    hero: "Auftakt",
    signet: "Signet",
    rebe: "Lage",
    keller: "Keller",
    besuch: "Besuch",
    termine: "Termine",
    haus: "Haus"
  };
  var WIDE = {
    nav: { x: 0.16, y: 0.02, w: 0.46, h: 0.1 },
    hero: { x: 0.05, y: 0.15, w: 0.5, h: 0.44 },
    signet: { x: 0.6, y: 0.03, w: 0.36, h: 0.28 },
    rebe: { x: 0.03, y: 0.62, w: 0.28, h: 0.34 },
    keller: { x: 0.33, y: 0.62, w: 0.26, h: 0.34 },
    besuch: { x: 0.63, y: 0.35, w: 0.33, h: 0.24 },
    termine: { x: 0.63, y: 0.62, w: 0.33, h: 0.18 },
    haus: { x: 0.63, y: 0.82, w: 0.33, h: 0.15 }
  };
  var NARROW = {
    nav: { x: 0.05, y: 0.02, w: 0.9, h: 0.09 },
    hero: { x: 0.06, y: 0.13, w: 0.88, h: 0.3 },
    signet: { x: 0.04, y: 0.45, w: 0.44, h: 0.2 },
    rebe: { x: 0.52, y: 0.45, w: 0.44, h: 0.2 },
    keller: { x: 0.04, y: 0.67, w: 0.44, h: 0.16 },
    besuch: { x: 0.52, y: 0.67, w: 0.44, h: 0.16 },
    termine: { x: 0.04, y: 0.85, w: 0.44, h: 0.13 },
    haus: { x: 0.52, y: 0.85, w: 0.44, h: 0.13 }
  };
  var LINKS = [
    ["nav", "b", "hero", "t"],
    ["hero", "r", "signet", "l"],
    ["hero", "b", "rebe", "t"],
    ["rebe", "r", "keller", "l"],
    ["signet", "b", "besuch", "t"],
    ["keller", "b", "termine", "t"],
    ["besuch", "b", "haus", "t"]
  ];

  var current = "reben";
  var state = "canvas";
  var timeline = null;
  var narrowMq = window.matchMedia("(max-width: 800px)");
  var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var calm = reduceMq.matches;

  function specs() {
    return narrowMq.matches ? NARROW : WIDE;
  }

  function measure() {
    var h = stage.clientHeight;
    var w = stage.clientWidth;
    page.style.setProperty("--stage-h", h + "px");
    page.style.setProperty("--stage-w", w + "px");
  }

  function setSteps(n) {
    steps.forEach(function (li, i) {
      li.classList.toggle("is-on", i <= n);
    });
  }

  function say(text) {
    statusEl.textContent = text;
  }

  function applyImage(id, fade) {
    var pick = PICKS[id];
    if (!pick) return;
    current = id;
    heroImg.src = pick.src;
    heroImg.alt = pick.label;
    heroImg.style.objectPosition = pick.pos;
    heroImg.classList.toggle("crop-low", id === "glas");
    heroLine.textContent = pick.label;
    picks.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-pick") === id ? "true" : "false");
    });
    setSteps(2);
    if (fade && gsap && !calm && state === "built") {
      gsap.fromTo(heroImg, { autoAlpha: 0.4 }, { autoAlpha: 1, duration: 0.4, overwrite: "auto", ease: "power1.out" });
    }
  }

  function edge(slot, side, width, height) {
    var x = slot.x * width;
    var y = slot.y * height;
    var w = slot.w * width;
    var h = slot.h * height;
    if (side === "t") return [x + w / 2, y];
    if (side === "b") return [x + w / 2, y + h];
    if (side === "l") return [x, y + h / 2];
    return [x + w, y + h / 2];
  }

  function drawWires() {
    var map = specs();
    var w = stage.clientWidth;
    var h = stage.clientHeight;
    wires.setAttribute("viewBox", "0 0 " + w + " " + h);
    var markup = "";
    LINKS.forEach(function (link) {
      if (!map[link[0]] || !map[link[2]]) return;
      var a = edge(map[link[0]], link[1], w, h);
      var b = edge(map[link[2]], link[3], w, h);
      var dx = (b[0] - a[0]) * 0.45;
      markup += '<path d="M' + a[0] + " " + a[1] + " C " + (a[0] + dx) + " " + a[1] + ", " + (b[0] - dx) + " " + b[1] + ", " + b[0] + " " + b[1] + '"></path>';
      markup += '<circle cx="' + a[0] + '" cy="' + a[1] + '" r="3.2"></circle>';
      markup += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="3.2"></circle>';
    });
    wires.innerHTML = markup;
  }

  function placeFrames() {
    var map = specs();
    Array.prototype.forEach.call(framesHost.children, function (el) {
      var slot = map[el.getAttribute("data-frame")];
      if (!slot) return;
      el.style.left = slot.x * 100 + "%";
      el.style.top = slot.y * 100 + "%";
      el.style.width = slot.w * 100 + "%";
      el.style.height = slot.h * 100 + "%";
    });
  }

  function fit(slot, end, stageRect) {
    var slotLeft = stageRect.left + slot.x * stageRect.width;
    var slotTop = stageRect.top + slot.y * stageRect.height;
    var slotW = slot.w * stageRect.width;
    var slotH = slot.h * stageRect.height;
    if (!end.width || !end.height) return { x: 0, y: 0, scale: 1 };
    var scale = Math.min(slotW / end.width, slotH / end.height);
    var visualW = end.width * scale;
    var visualH = end.height * scale;
    var left = slotLeft + (slotW - visualW) / 2;
    var top = slotTop + (slotH - visualH) / 2;
    return { x: left - end.left, y: top - end.top, scale: scale };
  }

  function applyCanvas() {
    measure();
    if (gsap) gsap.set(pieces, { clearProps: "transform" });
    var map = specs();
    var stageRect = stage.getBoundingClientRect();
    pieces.forEach(function (el) {
      var slot = map[el.getAttribute("data-id")];
      if (!slot || !gsap) return;
      var placed = fit(slot, el.getBoundingClientRect(), stageRect);
      gsap.set(el, { x: placed.x, y: placed.y, scale: placed.scale, transformOrigin: "0 0" });
    });
    placeFrames();
    drawWires();
    if (gsap) gsap.set([".frames", ".wires", ".dots"], { autoAlpha: 1 });
  }

  function showCanvas() {
    if (timeline) {
      timeline.kill();
      timeline = null;
    }
    stage.classList.remove("is-built");
    page.scrollTop = 0;
    state = "canvas";
    buildBtn.disabled = false;
    applyCanvas();
    setSteps(2);
    say("Knoten liegen bereit. Bild: " + PICKS[current].label + ".");
  }

  function showBuilt() {
    if (timeline) {
      timeline.kill();
      timeline = null;
    }
    if (gsap) gsap.set(pieces, { clearProps: "transform" });
    stage.classList.add("is-built");
    page.scrollTop = 0;
    state = "built";
    buildBtn.disabled = false;
    setSteps(4);
    say("Seite steht. Bild: " + PICKS[current].label + ".");
  }

  function scrollBeat(sc, id, at, dur) {
    timeline.to(sc, {
      y: function () {
        var el = document.getElementById(id);
        return el ? el.offsetTop : 0;
      },
      duration: dur,
      ease: "power2.inOut",
      onUpdate: function () { page.scrollTop = sc.y; }
    }, at);
  }

  function play() {
    if (!gsap || calm) {
      showBuilt();
      return;
    }
    if (timeline) timeline.kill();
    applyImage(current, false);
    showCanvas();
    state = "play";
    buildBtn.disabled = true;
    say("Knoten laufen in die Seite.");
    var sc = { y: 0 };
    timeline = gsap.timeline({
      onComplete: function () {
        state = "built";
        buildBtn.disabled = false;
        say("Vorschau steht. Bild: " + PICKS[current].label + ".");
      }
    });
    timeline.to(pieces, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 4.5,
      stagger: 0.05,
      ease: "power3.inOut",
      transformOrigin: "0 0"
    }, 0.3);
    timeline.to([".frames", ".wires", ".dots"], { autoAlpha: 0, duration: 0.7, ease: "power1.out" }, 1.1);
    timeline.call(function () { setSteps(3); say("Abschnitte setzen sich."); }, null, 1.4);
    timeline.call(function () {
      gsap.set(pieces, { clearProps: "transform" });
      stage.classList.add("is-built");
      page.scrollTop = 0;
      sc.y = 0;
      setSteps(4);
      say("Seite gesetzt. Die Vorschau läuft.");
    }, null, 5.25);
    scrollBeat(sc, "weine", 6.0, 1.0);
    scrollBeat(sc, "lage", 7.15, 1.0);
    scrollBeat(sc, "keller", 8.3, 1.0);
    scrollBeat(sc, "besuch", 9.45, 1.0);
    scrollBeat(sc, "termine", 10.6, 0.95);
    scrollBeat(sc, "haus", 11.7, 1.1);
  }

  function ask() {
    if (state !== "built") return;
    var haus = document.getElementById("haus");
    if (haus) page.scrollTop = haus.offsetTop;
    say("Nichts wird gesendet. Besuch anfragen ist nur die Zeile.");
  }

  function go(href) {
    if (state !== "built" || !href || href.charAt(0) !== "#") return;
    var el = document.getElementById(href.slice(1));
    if (!el) return;
    if (calm || !gsap) {
      page.scrollTop = el.offsetTop;
      return;
    }
    var sc = { y: page.scrollTop };
    gsap.to(sc, {
      y: el.offsetTop,
      duration: 0.7,
      ease: "power2.inOut",
      overwrite: true,
      onUpdate: function () { page.scrollTop = sc.y; }
    });
  }

  picks.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyImage(btn.getAttribute("data-pick"), true);
      say("Bild gewechselt: " + PICKS[current].label + ".");
    });
  });

  buildBtn.addEventListener("click", function () {
    applyImage(current, false);
    if (calm) showBuilt();
    else play();
  });
  restartBtn.addEventListener("click", function () {
    if (calm) showBuilt();
    else showCanvas();
  });
  calmBtn.addEventListener("click", function () {
    calm = !calm;
    calmBtn.setAttribute("aria-pressed", calm ? "true" : "false");
    calmBtn.textContent = calm ? "Bewegt" : "Ruhig";
    if (calm) showBuilt();
    else showCanvas();
  });
  document.getElementById("ask").addEventListener("click", ask);
  document.getElementById("ask-bar").addEventListener("click", ask);
  page.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link) return;
    event.preventDefault();
    go(link.getAttribute("href"));
  });
  page.addEventListener("wheel", function () {
    if (state === "play" && timeline) {
      timeline.kill();
      if (gsap) gsap.set(pieces, { clearProps: "transform" });
      stage.classList.add("is-built");
      state = "built";
      buildBtn.disabled = false;
    }
  }, { passive: true });

  function boot() {
    measure();
    Object.keys(NAMES).forEach(function (id) {
      var frame = document.createElement("div");
      frame.className = "frame";
      frame.setAttribute("data-frame", id);
      var label = document.createElement("span");
      label.textContent = NAMES[id];
      frame.appendChild(label);
      framesHost.appendChild(frame);
    });
    if (reduceMq.matches) {
      calm = true;
      calmBtn.setAttribute("aria-pressed", "true");
      calmBtn.textContent = "Bewegt";
    }
    document.documentElement.classList.add("ready");
    if (calm || !gsap) showBuilt();
    else showCanvas();
  }

  var resizeTick = 0;
  window.addEventListener("resize", function () {
    cancelAnimationFrame(resizeTick);
    resizeTick = requestAnimationFrame(function () {
      measure();
      if (state === "canvas") applyCanvas();
    });
  });
  narrowMq.addEventListener("change", function () {
    if (state === "canvas") applyCanvas();
  });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
  else boot();
})();
