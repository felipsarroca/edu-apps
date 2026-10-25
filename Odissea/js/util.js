export const escapa = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const redueixMoviment = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const suau = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Suavitza una línia trencada (algorisme de Chaikin) mantenint-ne els extrems. */
export function suavitza(punts, iteracions = 2) {
  let p = punts;
  for (let k = 0; k < iteracions; k++) {
    if (p.length < 3) return p;
    const nou = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const [a, b] = [p[i], p[i + 1]];
      nou.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]);
      nou.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    nou.push(p[p.length - 1]);
    p = nou;
  }
  return p;
}

/** Longituds acumulades d'una línia (en graus, prou bo per repartir l'animació). */
export function acumulades(punts) {
  const acc = [0];
  for (let i = 1; i < punts.length; i++) {
    const [a, b] = [punts[i - 1], punts[i]];
    acc.push(acc[i - 1] + Math.hypot(b[0] - a[0], (b[1] - a[1]) * Math.cos(((a[0] + b[0]) / 2) * Math.PI / 180)));
  }
  return acc;
}

/** Punt situat a la fracció t (0-1) d'una línia; retorna també l'índex del tram. */
export function puntA(punts, acc, t) {
  const total = acc[acc.length - 1];
  if (total === 0) return { punt: punts[punts.length - 1], tram: punts.length - 1 };
  const objectiu = t * total;
  let i = 1;
  while (i < acc.length - 1 && acc[i] < objectiu) i++;
  const tros = acc[i] - acc[i - 1] || 1;
  const f = (objectiu - acc[i - 1]) / tros;
  const [a, b] = [punts[i - 1], punts[i]];
  return { punt: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], tram: i };
}
