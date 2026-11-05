// Liquid Glass: SVG-Brechungsfilter (#lg-refract) — idempotent, Chromium only.
// Auf Seiten ohne nav.js/rubriken.js laden; doppeltes Laden ist harmlos.
(() => {
  if (document.getElementById('lg-refract')) return;
  const chromium = !!(navigator.userAgentData && navigator.userAgentData.brands.some((b) => /Chrom/.test(b.brand)));
  if (!chromium || matchMedia('(prefers-reduced-transparency: reduce)').matches) return;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">'
    + '<filter id="lg-refract" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">'
    + '<feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="7" result="n"/>'
    + '<feGaussianBlur in="n" stdDeviation="2" result="nb"/>'
    + '<feDisplacementMap in="SourceGraphic" in2="nb" scale="14" xChannelSelector="R" yChannelSelector="G"/>'
    + '</filter></svg>';
  const mount = () => {
    document.body.insertAdjacentHTML('beforeend', svg);
    document.documentElement.classList.add('lg-svg');
  };
  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
