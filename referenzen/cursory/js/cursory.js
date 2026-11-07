(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var playing = null;
  var DURATION = 14.5;

  function go(el) {
    var y = el.getBoundingClientRect().top + window.scrollY;
    stop();
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }

  document.querySelectorAll(".pill a, .foot a").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      event.preventDefault();
      go(el);
    });
  });

  function hands() {
    var node = document.getElementById("cur-tpl").content.firstElementChild.cloneNode(true);
    document.body.appendChild(node);
    return {
      mara: node.querySelector(".mara"),
      jonas: node.querySelector(".jonas"),
      lea: node.querySelector(".lea")
    };
  }

  function hideAll(tl, group, at) {
    tl.to([group.mara, group.jonas, group.lea], { autoAlpha: 0, duration: 0.22 }, at);
  }

  function ride(tl, el, x0, y0, x1, y1, at, dur) {
    tl.set(el, { x: x0, y: y0, autoAlpha: 0 }, 0);
    tl.to(el, { x: x1, y: y1, autoAlpha: 1, duration: dur }, at);
  }

  function hold(tl, at) {
    tl.to({}, { duration: 0.01 }, at);
  }

  function pin(el, viewports, build) {
    var tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: function () { return "+=" + Math.round(window.innerHeight * viewports); },
        pin: true,
        scrub: true,
        invalidateOnRefresh: true
      }
    });
    build(tl);
    return tl;
  }

  function split(el, viewports) {
    var fig = el.querySelector("figure");
    var title = el.querySelector("h2");
    var eye = el.querySelector(".eyebrow");
    var body = el.querySelector(".copy p:last-child");
    var c = hands();
    pin(el, viewports, function (tl) {
      tl.set(fig, { x: "-16vw" }, 0);
      tl.set(title, { clipPath: "inset(0 100% 0 0)" }, 0);
      tl.set(eye, { opacity: 0, y: 8 }, 0);
      tl.set(body, { opacity: 0, y: 14 }, 0);
      ride(tl, c.mara, "-6vw", "46vh", "26vw", "40vh", 0.08, 0.7);
      tl.to(fig, { x: 0, duration: 0.7 }, 0.08);
      ride(tl, c.jonas, "88vw", "18vh", "62vw", "30vh", 0.16, 0.45);
      tl.to(eye, { opacity: 1, y: 0, duration: 0.35 }, 0.2);
      ride(tl, c.lea, "58vw", "40vh", "84vw", "40vh", 0.32, 0.62);
      tl.to(title, { clipPath: "inset(0 0% 0 0)", duration: 0.62, ease: "none" }, 0.32);
      tl.to(body, { opacity: 1, y: 0, duration: 0.4 }, 0.78);
      hideAll(tl, c, 1.05);
      hold(tl, 1.35);
    });
  }

  function bootStill() {
    root.classList.add("ready", "still");
  }

  function boot() {
    if (reduce || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      bootStill();
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.set("#traube, #glas, #liquid", { xPercent: -50, yPercent: -50 });

    pin(document.getElementById("auftakt"), 4.6, function (tl) {
      var c = hands();
      tl.set("#traube", { scale: 1, opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(4% 14% 3% 8% round 22%)" }, 0);
      tl.set("#glas", { scale: 0.22, opacity: 0 }, 0);
      tl.set("#liquid", { autoAlpha: 0 }, 0);
      tl.set(c.jonas, { x: "72vw", y: "-12vh", autoAlpha: 1 }, 0);
      tl.set(c.mara, { x: "8vw", y: "78vh", autoAlpha: 1 }, 0);
      tl.set(c.lea, { x: "96vw", y: "70vh", autoAlpha: 1 }, 0);
      tl.to(c.jonas, { x: "46vw", y: "2.4vh", duration: 0.42 }, 0);
      tl.to(c.mara, { x: "44vw", y: "36vh", duration: 0.48 }, 0);
      tl.to(c.lea, { x: "70vw", y: "62vh", duration: 0.48 }, 0);
      tl.to("#traube", {
        scale: 0.42,
        clipPath: "inset(10% 16% 8% 16% round 46%)",
        filter: "blur(1.5px)",
        duration: 0.5,
        ease: "power1.in"
      }, 0.28);
      tl.to("#traube", {
        scale: 0.16,
        y: 24,
        opacity: 0,
        filter: "blur(6px)",
        clipPath: "circle(26% at 50% 58%)",
        duration: 0.55,
        ease: "power2.in"
      }, 0.74);
      tl.to(c.mara, { x: "48vw", y: "44vh", duration: 0.9, ease: "power1.inOut" }, 0.4);
      tl.to("#glas", { scale: 1, opacity: 1, duration: 0.95, ease: "power2.out" }, 0.62);
      tl.to(c.lea, { x: "58vw", y: "46vh", duration: 0.7 }, 0.85);
      tl.to(c.jonas, { x: "52vw", y: "8vh", duration: 0.6 }, 0.7);
      hideAll(tl, c, 1.85);
      hold(tl, 2.25);
    });

    pin(document.getElementById("weine"), 1.4, function (tl) {
      var c = hands();
      var mono = document.querySelector("#weine .mono");
      var title = document.querySelector("#weine h1");
      var eye = document.querySelector("#weine .eyebrow");
      var tag = document.querySelector("#weine .tag");
      tl.set(mono, { scale: 0.35, opacity: 0 }, 0);
      tl.set(title, { clipPath: "inset(0 100% 0 0)" }, 0);
      tl.set(eye, { opacity: 0, y: 8 }, 0);
      tl.set(tag, { opacity: 0, y: 10 }, 0);
      ride(tl, c.mara, "-8vw", "42vh", "46vw", "36vh", 0.06, 0.55);
      tl.to(mono, { scale: 1, opacity: 1, duration: 0.55 }, 0.06);
      ride(tl, c.jonas, "86vw", "16vh", "48vw", "28vh", 0.12, 0.4);
      tl.to(eye, { opacity: 1, y: 0, duration: 0.3 }, 0.16);
      ride(tl, c.lea, "28vw", "56vh", "64vw", "54vh", 0.32, 0.7);
      tl.to(title, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "none" }, 0.32);
      tl.to(tag, { opacity: 1, y: 0, duration: 0.35 }, 0.85);
      hideAll(tl, c, 1.15);
      hold(tl, 1.4);
    });

    split(document.getElementById("lage"), 1.15);
    split(document.getElementById("lese"), 1.05);
    split(document.getElementById("keller"), 1.1);

    pin(document.getElementById("zitat"), 0.9, function (tl) {
      var c = hands();
      var lines = document.querySelectorAll("#zitat blockquote span");
      lines.forEach(function (line, i) {
        tl.set(line, { clipPath: "inset(0 100% 0 0)" }, 0);
        tl.to(line, { clipPath: "inset(0 0% 0 0)", duration: 0.32, ease: "none" }, 0.1 + i * 0.28);
      });
      ride(tl, c.mara, "8vw", "46vh", "22vw", "42vh", 0.08, 0.55);
      ride(tl, c.lea, "30vw", "34vh", "64vw", "56vh", 0.1, 0.84);
      ride(tl, c.jonas, "90vw", "30vh", "74vw", "40vh", 0.2, 0.5);
      hideAll(tl, c, 1.05);
      hold(tl, 1.35);
    });

    pin(document.getElementById("besuch"), 1, function (tl) {
      var c = hands();
      var photo = document.querySelector("#besuch img");
      tl.set(photo, { y: 70 }, 0);
      ride(tl, c.mara, "70vw", "92vh", "42vw", "58vh", 0.06, 0.7);
      ride(tl, c.jonas, "20vw", "92vh", "28vw", "36vh", 0.1, 0.7);
      ride(tl, c.lea, "88vw", "80vh", "62vw", "40vh", 0.14, 0.7);
      tl.to(photo, { y: 0, duration: 0.7 }, 0.06);
      hideAll(tl, c, 0.85);
      hold(tl, 1.1);
    });

    pin(document.getElementById("karten"), 1.2, function (tl) {
      var c = hands();
      var cards = document.querySelectorAll("#karten figure");
      cards.forEach(function (card, i) {
        tl.set(card, { y: 64, opacity: 0.15 }, 0);
        tl.to(card, { y: 0, opacity: 1, duration: 0.55 }, 0.08 + i * 0.16);
      });
      ride(tl, c.mara, "8vw", "88vh", "14vw", "42vh", 0.08, 0.55);
      ride(tl, c.jonas, "40vw", "88vh", "46vw", "42vh", 0.24, 0.55);
      ride(tl, c.lea, "70vw", "88vh", "76vw", "42vh", 0.4, 0.55);
      hideAll(tl, c, 1.05);
      hold(tl, 1.3);
    });

    split(document.getElementById("anreise"), 1.15);

    pin(document.getElementById("haus"), 1.35, function (tl) {
      var c = hands();
      var fig = document.querySelector("#haus figure");
      var gold = document.querySelector("#haus .gold");
      var house = document.querySelector("#haus .house");
      var links = document.querySelector("#haus ul");
      var word = document.querySelector("#haus .word");
      tl.set(fig, { x: -40 }, 0);
      tl.set(gold, { scale: 0.8, opacity: 0 }, 0);
      tl.set(house, { opacity: 0, y: 8 }, 0);
      tl.set(links, { opacity: 0, y: 8 }, 0);
      tl.set(word, { clipPath: "inset(0 100% 0 0)" }, 0);
      ride(tl, c.mara, "-4vw", "24vh", "16vw", "22vh", 0.06, 0.5);
      tl.to(fig, { x: 0, duration: 0.5 }, 0.06);
      ride(tl, c.jonas, "80vw", "8vh", "42vw", "24vh", 0.16, 0.5);
      tl.to(gold, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }, 0.22);
      tl.to(house, { opacity: 1, y: 0, duration: 0.3 }, 0.45);
      ride(tl, c.lea, "8vw", "78vh", "46vw", "82vh", 0.4, 0.7);
      tl.to(word, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "none" }, 0.4);
      tl.to(links, { opacity: 1, y: 0, duration: 0.35 }, 0.55);
      hideAll(tl, c, 0.95);
      hold(tl, 1.45);
    });

    ScrollTrigger.refresh();
    root.classList.add("ready");

    var still = new URLSearchParams(location.search).get("t");
    if (still !== null) {
      seek(parseFloat(still) || 0);
      return;
    }
    if (location.hash) {
      var target = document.querySelector(location.hash);
      if (target) go(target);
      return;
    }
    play();
  }

  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function stop() {
    if (playing) {
      playing.kill();
      playing = null;
    }
  }

  function play() {
    stop();
    var proxy = { y: window.scrollY };
    var rest = 1 - (maxScroll() ? proxy.y / maxScroll() : 0);
    playing = gsap.to(proxy, {
      y: maxScroll(),
      duration: Math.max(0.2, DURATION * rest),
      ease: "none",
      onUpdate: function () { window.scrollTo(0, proxy.y); },
      onComplete: function () { playing = null; }
    });
  }

  function seek(t) {
    stop();
    var p = Math.min(1, Math.max(0, t / DURATION));
    window.scrollTo(0, maxScroll() * p);
  }

  window.__seek = seek;
  window.__beats = function () {
    if (typeof ScrollTrigger === "undefined") return [];
    return ScrollTrigger.getAll().map(function (st) {
      var el = st.trigger;
      return { id: el.id || el.className, start: Math.round(st.start), end: Math.round(st.end) };
    });
  };

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchmove", stop, { passive: true });
  window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "PageDown" || event.key === "PageUp" || event.key === " ") {
      stop();
    }
  });

  function start() {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
    else boot();
  }
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();
