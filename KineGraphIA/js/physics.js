const TIPUS_PERMESOS = ['MRU', 'MRUA', 'CAIGUDA', 'TIR_VERTICAL', 'TIR_PARABOLIC'];

export function calculaCronologia(mobils, opcions = {}) {
  if (!Array.isArray(mobils) || mobils.length === 0) {
    return { temps: [], series: [] };
  }

  const tempsObjectiu = determinarTempsMaxim(mobils, opcions.tempsMaxim);
  const pas = determinarPasTemporal(tempsObjectiu);
  const temps = generarVectorTemps(tempsObjectiu, pas);

  const series = mobils.map((mobil) => {
    const dades = normalitzaMobil(mobil);
    const velocitatX =
      dades.tipus === 'TIR_PARABOLIC'
        ? temps.map((t) => Number(calculaVelocitatComponent(dades, t, 'x').toFixed(4)))
        : undefined;
    const velocitatY =
      dades.tipus === 'TIR_PARABOLIC'
        ? temps.map((t) => Number(calculaVelocitatComponent(dades, t, 'y').toFixed(4)))
        : undefined;

    return {
      nom: dades.nom,
      tipus: dades.tipus,
      posicions: temps.map((t) => Number(calculaPosicio(dades, t).toFixed(4))),
      velocitats: temps.map((t) => Number(calculaVelocitat(dades, t).toFixed(4))),
      velocitatX,
      velocitatY,
      acceleracions: temps.map((t) => Number(calculaAcceleracio(dades, t).toFixed(4)))
    };
  });

  return { temps, pas, series };
}

export function generaResumMobil(mobil) {
  const dades = normalitzaMobil(mobil);
  const components = [
    dades.tipus,
    formatNumber(dades.v0, 'm/s', 'v0'),
    formatNumber(dades.a, 'm/s^2', 'a'),
    formatNumber(dades.s0, 'm', 's0'),
    formatNumber(dades.t, 's', 't')
  ].filter(Boolean);

  return components.join(' | ');
}

export function normalitzaMobil(raw) {
  const tipus = (raw.tipus || '').toUpperCase();
  const tipusValid = TIPUS_PERMESOS.includes(tipus) ? tipus : 'MRU';

  return {
    nom: raw.nom || 'M\u00F2bil',
    tipus: tipusValid,
    v0: convertirNombre(raw.v0, 0),
    a: convertirNombre(raw.a, 0),
    s0: convertirNombre(raw.s0, 0),
    t: convertirNombre(raw.t, 10),
    angle: convertirNombre(raw.angle, 45),
    g: convertirNombre(raw.g, 9.81)
  };
}

function convertirNombre(valor, perDefecte) {
  if (valor === undefined || valor === null || valor === '') return perDefecte;
  const num = Number(valor);
  return Number.isFinite(num) ? num : perDefecte;
}

export function calculaPosicio(mobil, temps) {
  switch (mobil.tipus) {
    case 'MRU':
      return mobil.s0 + mobil.v0 * temps;
    case 'MRUA':
      return mobil.s0 + mobil.v0 * temps + 0.5 * mobil.a * temps ** 2;
    case 'CAIGUDA': {
      const posicio = mobil.s0 + mobil.v0 * temps + 0.5 * (-mobil.g) * temps ** 2;
      return Math.max(0, posicio);
    }
    case 'TIR_VERTICAL': {
      const posicio = mobil.s0 + mobil.v0 * temps + 0.5 * (-mobil.g) * temps ** 2;
      return Math.max(0, posicio);
    }
    case 'TIR_PARABOLIC': {
      const angleRad = (mobil.angle * Math.PI) / 180;
      const vx = mobil.v0 * Math.cos(angleRad);
      const vy = mobil.v0 * Math.sin(angleRad);
      const y = mobil.s0 + vy * temps + 0.5 * (-mobil.g) * temps ** 2;
      return Math.max(0, y);
    }
    default:
      return mobil.s0 + mobil.v0 * temps;
  }
}

export function calculaVelocitat(mobil, temps) {
  switch (mobil.tipus) {
    case 'MRU':
      return mobil.v0;
    case 'MRUA':
      return mobil.v0 + mobil.a * temps;
    case 'CAIGUDA':
    case 'TIR_VERTICAL':
      return mobil.v0 + (-mobil.g) * temps;
    case 'TIR_PARABOLIC': {
      const angleRad = (mobil.angle * Math.PI) / 180;
      const vx = mobil.v0 * Math.cos(angleRad);
      const vy = mobil.v0 * Math.sin(angleRad) + (-mobil.g) * temps;
      const velocitat = Math.sqrt(vx ** 2 + vy ** 2);
      return Number.isFinite(velocitat) ? velocitat : mobil.v0;
    }
    default:
      return mobil.v0;
  }
}

export function calculaVelocitatComponent(mobil, temps, component = 'x') {
  const dades = mobil?.tipus ? mobil : normalitzaMobil(mobil);
  switch (dades.tipus) {
    case 'TIR_PARABOLIC': {
      const angleRad = (dades.angle * Math.PI) / 180;
      const vx = dades.v0 * Math.cos(angleRad);
      const vy = dades.v0 * Math.sin(angleRad) + (-dades.g) * temps;
      if (component === 'x') return vx;
      if (component === 'y') return vy;
      return calculaVelocitat(dades, temps);
    }
    case 'TIR_VERTICAL':
    case 'CAIGUDA':
      if (component === 'y') {
        return dades.v0 + (-dades.g) * temps;
      }
      return calculaVelocitat(dades, temps);
    default:
      return calculaVelocitat(dades, temps);
  }
}

export function calculaAcceleracio(mobil, _temps = 0) {
  switch (mobil.tipus) {
    case 'MRU':
      return 0;
    case 'MRUA':
      return mobil.a;
    case 'CAIGUDA':
    case 'TIR_VERTICAL':
      return -mobil.g;
    case 'TIR_PARABOLIC':
      return -mobil.g;
    default:
      return 0;
  }
}

function determinarTempsMaxim(mobils, tempsOpcional) {
  if (Number.isFinite(tempsOpcional) && tempsOpcional > 0) {
    return tempsOpcional;
  }
  const max = mobils.reduce((acc, mobil) => {
    const temps = convertirNombre(mobil.t, 0);
    return temps > acc ? temps : acc;
  }, 0);
  return max > 0 ? max : 12;
}

function determinarPasTemporal(tempsMaxim) {
  if (tempsMaxim <= 5) return 0.05;
  if (tempsMaxim <= 10) return 0.1;
  if (tempsMaxim <= 20) return 0.2;
  return Math.min(1, tempsMaxim / 150);
}

function generarVectorTemps(tempsMaxim, pas) {
  const temps = [];
  for (let t = 0; t <= tempsMaxim + pas / 2; t += pas) {
    temps.push(Number(t.toFixed(2)));
    if (temps.length > 600) break;
  }
  return temps;
}

function formatNumber(valor, unitat, etiqueta) {
  if (!Number.isFinite(valor)) return '';
  const arrodonit = Math.abs(valor) < 1e-3 ? 0 : Number(valor.toFixed(2));
  return etiqueta ? `${etiqueta} = ${arrodonit} ${unitat}` : `${arrodonit} ${unitat}`;
}

console.log('[physics.js] carregat');






