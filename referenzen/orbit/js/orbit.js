import Lenis from '../../../assets/vendor/lenis/lenis.mjs';
import { mountScene } from './scene.js';

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

const backCanvas = document.getElementById('stage');
const frontCanvas = document.getElementById('front');
const dialog = document.getElementById('projekt');
const form = document.getElementById('projekt-form');
const result = document.getElementById('projekt-result');
const menuBtn = document.querySelector('[data-menu]');
const menu = document.getElementById('menu');
const bar = document.querySelector('.bar');
const sheet = document.querySelector('[data-sheet]');
const ink = document.querySelector('[data-ink]');
const hole = document.getElementById('portal-hole');
const caps = document.querySelector('[data-caps]');
const copy = document.querySelector('.hero-copy');

const scene = !reduce && backCanvas && frontCanvas
  ? mountScene(backCanvas, frontCanvas, { mobile: window.innerWidth < 900 })
  : null;

if (scene) {
  document.body.classList.add('has-webgl');
}

const pointer = { x: 0, y: 0 };
let heroBlend = 0;
let portal = 0;

function layoutPointer() {
  if (!ink) return;
  const scale = portal > 0.02 ? 1.04 + portal * 10.5 : 1;
  const x = pointer.x * 70 + heroBlend * -110;
  const y = pointer.y * 36 + heroBlend * 28;
  ink.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
  if (copy && portal < 0.02) {
    copy.style.transform = `translate3d(${pointer.x * -14}px, ${pointer.y * -10 + heroBlend * -18}px, 0)`;
  }
}

function setPortal(amount) {
  portal = amount < 0 ? 0 : amount > 1 ? 1 : amount;
  const wiping = portal > 0.02 && portal < 0.97;
  document.body.classList.toggle('is-portaling', wiping);
  if (hole) {
    const scale = 0.9 + portal * 11;
    hole.setAttribute('transform', `translate(0.64 0.48) scale(${scale})`);
  }
  if (sheet) {
    sheet.style.visibility = portal > 0.97 ? 'hidden' : 'visible';
    sheet.style.transform = portal > 0.02 ? `translate3d(0, ${-portal * 108}%, 0)` : '';
  }
  if (ink) ink.style.visibility = portal > 0.9 ? 'hidden' : 'visible';
  layoutPointer();
}

function closeMenu() {
  if (!menuBtn || !menu) return;
  menuBtn.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
}

if (menuBtn && menu) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    menu.classList.toggle('is-open', !open);
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
}

function openDialog() {
  if (!dialog) return;
  if (result) result.hidden = true;
  if (form) form.hidden = false;
  dialog.showModal();
}

document.querySelectorAll('[data-open-projekt]').forEach((btn) => {
  btn.addEventListener('click', openDialog);
});

if (dialog) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => dialog.close());
  });
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const error = form.querySelector('[data-error]');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk) {
      if (error) {
        error.hidden = false;
        error.textContent = name
          ? 'Die E-Mail braucht ein @ und eine Domain.'
          : 'Bitte Namen und E-Mail eintragen. Es wird trotzdem nichts gesendet.';
      }
      form.querySelector(name ? '[name="email"]' : '[name="name"]')?.focus();
      return;
    }
    if (error) error.hidden = true;
    form.hidden = true;
    if (result) {
      result.hidden = false;
      const who = result.querySelector('[data-who]');
      if (who) who.textContent = name;
    }
  });
}

const dots = [...document.querySelectorAll('.dots a')];
function setDot(id) {
  dots.forEach((dot) => {
    const on = dot.getAttribute('href') === `#${id}`;
    if (on) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
}

if (!reduce && window.matchMedia('(pointer: fine)').matches && scene) {
  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    scene.setPointer(pointer.x, pointer.y);
    if (heroBlend >= 0) layoutPointer();
  }, { passive: true });
}

window.addEventListener('resize', () => scene?.resize(), { passive: true });

if (gsap && ScrollTrigger && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const mm = gsap.matchMedia();

  mm.add('(min-width: 900px) and (pointer: fine)', () => {
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    root.classList.add('is-motion');
    const wide = window.matchMedia('(min-width: 900px)').matches;
    const pin = (trigger, pinEl, end, onUpdate) => ScrollTrigger.create({
      trigger,
      start: 'top top',
      end,
      pin: pinEl,
      scrub: 0.35,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate,
    });

    pin('#hero', '.hero-pin', wide ? '+=168%' : '+=130%', (self) => {
      const p = self.progress;
      if (p < 0.64) {
        heroBlend = p / 0.64;
        setPortal(0);
        document.body.classList.remove('is-dark');
        scene?.setBeat('hero', heroBlend);
      } else {
        heroBlend = 1;
        const wipe = (p - 0.64) / 0.36;
        setPortal(wipe);
        if (wipe > 0.18) document.body.classList.add('is-dark');
        scene?.setBeat('wipe', wipe);
      }
      setDot('hero');
    });

    pin('#dunkel', '.pass-pin', wide ? '+=105%' : '+=80%', (self) => {
      setPortal(1);
      scene?.setBeat('dark', self.progress);
      document.body.classList.add('is-dark');
      setDot('dunkel');
    });

    pin('#studio', '.manifest-pin', wide ? '+=145%' : '+=110%', (self) => {
      setPortal(1);
      if (sheet) sheet.style.visibility = 'hidden';
      scene?.setBeat('manifest', self.progress);
      document.body.classList.remove('is-dark');
      setDot('studio');
    });

    pin('#arbeiten', '.works-pin', wide ? '+=155%' : '+=120%', (self) => {
      scene?.setBeat('works', self.progress);
      caps?.classList.toggle('is-in', self.progress > 0.62);
      document.body.classList.remove('is-dark');
      setDot('arbeiten');
    });

    const contact = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '#kontakt',
        start: 'top top',
        end: wide ? '+=120%' : '+=90%',
        pin: '.reach-pin',
        scrub: 0.35,
        anticipatePin: 1,
        onUpdate: (self) => {
          scene?.setBeat('contact', self.progress);
          document.body.classList.add('is-dark');
          setDot('kontakt');
        },
        onLeave: () => document.body.classList.remove('is-dark'),
        onLeaveBack: () => document.body.classList.add('is-dark'),
      },
    });
    contact.to('[data-strip]', { yPercent: -120 }, 0);
    contact.fromTo('.splash', { scale: 0.86, transformOrigin: '70% 40%' }, { scale: 1.08 }, 0);

    ScrollTrigger.create({
      trigger: '#dunkel',
      start: 'top 80px',
      endTrigger: '#studio',
      end: 'top 80px',
      toggleClass: { targets: bar, className: 'is-solid' },
    });
    ScrollTrigger.create({
      trigger: '#kontakt',
      start: 'top 80px',
      end: 'bottom top',
      toggleClass: { targets: bar, className: 'is-solid' },
    });

    return () => {
      root.classList.remove('is-motion');
      document.body.classList.remove('is-dark', 'is-portaling');
      bar?.classList.remove('is-solid');
      scene?.setActive(true);
    };
  });
} else if (reduce) {
  caps?.classList.add('is-in');
}

function playBuild() {
  if (!gsap || reduce) return;
  const layer = document.querySelector('.cursors');
  if (!layer) return;
  const cursors = [...layer.children];
  const picks = [
    ['.mark', 0],
    ['.links', 1],
    ['.cta', 2],
    ['#hero-title', 0],
    ['.ink', 1],
    ['.bubble', 2],
  ];
  const els = picks.map(([sel]) => document.querySelector(sel)).filter(Boolean);
  gsap.set(els, { autoAlpha: 0 });
  scene?.setIntro(0);
  const tl = gsap.timeline();
  picks.forEach(([sel, ci], index) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const at = index * 0.34;
    tl.add(() => {
      const rect = el.getBoundingClientRect();
      gsap.to(cursors[ci], {
        left: rect.left + Math.min(rect.width * 0.25, 80),
        top: rect.top + 6,
        duration: 0.42,
        ease: 'power2.inOut',
      });
    }, at);
    tl.fromTo(el, {
      x: (ci - 1) * 110,
      y: -24,
      autoAlpha: 0,
    }, {
      x: 0,
      y: 0,
      autoAlpha: 1,
      duration: 0.5,
      ease: 'power3.out',
    }, at + 0.1);
  });
  const introState = { p: 0 };
  tl.to(introState, {
    p: 1,
    duration: 1.05,
    ease: 'power2.out',
    onUpdate: () => scene?.setIntro(introState.p),
  }, 0.45);
  tl.to(cursors, { autoAlpha: 0, duration: 0.3 }, '>-0.05');
}

setPortal(0);
layoutPointer();
playBuild();
