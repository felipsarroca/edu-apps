const DIA_MS = 86400000;
const MESOS = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];

const aUTC = (iso) => {
  const [a, m, d] = iso.split('-').map(Number);
  return Date.UTC(a, m - 1, d);
};

/** Dies entre dues dates ISO. Funciona igual amb el calendari julià perquè només en compara la diferència. */
export const diesEntre = (inici, fi) => Math.round((aUTC(fi) - aUTC(inici)) / DIA_MS);

/** «10 d'agost de 1519» */
export function dataLlarga(iso) {
  const [a, m, d] = iso.split('-').map(Number);
  const mes = MESOS[m - 1];
  const de = /^[aeiouàèéíòóú]/.test(mes) ? "d'" : 'de ';
  return `${d} ${de}${mes} de ${a}`;
}

export const escapa = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const redueixMoviment = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const suau = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Ajusta cada longitud perquè no salti més de 180° respecte de l'anterior (ruta contínua sobre el Pacífic). */
export function desplega(punts, lngInicial = punts[0][1]) {
  let prev = lngInicial;
  return punts.map(([lat, lng]) => {
    let l = lng;
    while (l - prev > 180) l -= 360;
    while (prev - l > 180) l += 360;
    prev = l;
    return [lat, l];
  });
}

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
