/** Shared organic edge. DOM clip-path and the WebGL discard use the same numbers. */

export const HERO_EDGE = {
  from: 1.18,
  to: -0.48,
  waves: [
    [5.4, 0.35, 0.055],
    [13.8, 2.05, 0.024],
    [2.15, 0.8, 0.082],
  ],
  bumps: [
    [0.18, 3.6, 0.22],
    [0.42, 5.4, -0.28],
    [0.67, 4.1, 0.2],
    [0.86, 6.2, -0.12],
  ],
};

export const MANIFEST_EDGE = {
  from: 1.26,
  to: -0.24,
  waves: [
    [4.6, 1.15, 0.062],
    [11.2, 0.25, 0.028],
    [2.55, 2.35, 0.054],
  ],
  bumps: [
    [0.18, 4.4, -0.15],
    [0.46, 7.6, 0.16],
    [0.8, 5.8, -0.09],
  ],
};

export function edgeY(x, t, spec) {
  const base = spec.from + (spec.to - spec.from) * t;
  let w = 0;
  for (const [freq, phase, amp] of spec.waves) w += Math.sin(x * freq + phase) * amp;
  for (const [cx, k, amp] of spec.bumps) {
    const d = (x - cx) * k;
    w += Math.exp(-(d * d)) * amp;
  }
  const env = 0.32 + 0.68 * Math.sin(Math.PI * Math.min(1, Math.max(0, t) * 1.12));
  return base + w * env;
}

export function clipPolygon(spec, t, mode) {
  const n = 42;
  const pts = [];
  const sample = (i) => {
    const x = i / n;
    const y = Math.min(1.12, Math.max(-0.12, edgeY(x, t, spec)));
    return `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
  };
  if (mode === "hero") {
    pts.push("0% 0%", "100% 0%");
    for (let i = n; i >= 0; i--) pts.push(sample(i));
  } else {
    for (let i = 0; i <= n; i++) pts.push(sample(i));
    pts.push("100% 110%", "0% 110%");
  }
  return `polygon(${pts.join(",")})`;
}
