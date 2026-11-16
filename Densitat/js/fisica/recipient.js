/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Física dels recipients: comprovació de boca, capes de líquid, mescles, nivells i vessament.
 * Mòdul pur del motor físic (02-model-cientific.md §2.4, §4.5, §4.8, regles R14 i R18).
 */

import { netejaDecimal } from "./unitats.js";
import { diametreEntradaObjecte } from "./geometria.js";
import { sonMiscibles, calculaMesclaIdeal } from "./liquids.js";

/**
 * Comprova si un objecte cap per la boca d'un recipient (cas T04b).
 * @param {object} obj
 * @param {object} recipient
 * @returns {{hiCap: boolean, diametreObjecte: number, diametreBoca: number, motiu: string|null}}
 */
export function hiCapObjecte(obj, recipient) {
  const diamObj = diametreEntradaObjecte(obj);
  const diamBoca = recipient?.diametreBoca ?? Infinity;
  const hiCap = diamObj <= diamBoca + 1e-6;
  return {
    hiCap,
    diametreObjecte: netejaDecimal(diamObj, 2),
    diametreBoca: netejaDecimal(diamBoca, 2),
    motiu: hiCap
      ? null
      : `No hi cap: la boca de ${recipient.nom || "la proveta"} fa ${String(diamBoca).replace(".", ",")} cm.`
  };
}

/**
 * Aboca un líquid dins d'una llista de capes existents (ordenades de baix a dalt: índex 0 = fons).
 * Segueix 02-model-cientific.md §4.8 i el cas de prova T20:
 * - Si s'aboca amb cura (`ambCura = true`), forma capes separades ordenades de més densa (baix, índex 0)
 *   a menys densa (dalt). Si dues capes contínues són de la mateixa família (ex. alcohol sobre aigua),
 *   la frontera es marca com a `inestable: true` (frontera difuminada).
 * - Si s'aboca sense cura (`ambCura = false`), els líquids de la mateixa família es mesclen i les fases
 *   resultants s'ordenen per densitat.
 *
 * @param {Array<object>} capesActuals Llista de capes de baix (0) a dalt
 * @param {object} nouLiquid { liquid, nom, familia, densitat, volum, color }
 * @param {object} [opcions={}]
 * @param {boolean} [opcions.ambCura=false]
 * @returns {Array<object>} Nova llista de capes de baix (0) a dalt
 */
export function abocaLiquid(capesActuals, nouLiquid, opcions = {}) {
  const { ambCura = false } = opcions;
  if (!nouLiquid || (nouLiquid.volum ?? 0) <= 0) {
    return capesActuals.map(c => ({ ...c }));
  }

  const capes = capesActuals.map(c => ({ ...c }));
  const nova = {
    liquid: nouLiquid.liquid || nouLiquid.id,
    nom: nouLiquid.nom || nouLiquid.liquid || nouLiquid.id,
    familia: nouLiquid.familia || "aquosa",
    densitat: Number(nouLiquid.densitat),
    volum: Number(nouLiquid.volum),
    color: nouLiquid.color || "#BAE6FD",
    viscositatVisual: nouLiquid.viscositatVisual || "baixa",
    inestable: false
  };

  capes.push(nova);

  if (ambCura) {
    return consolidaIOrdenaCapes(capes, false);
  }
  return consolidaIOrdenaCapes(capes, true);
}

/**
 * Construeix una columna de líquids abocats amb cura en qualsevol ordre (cas T20).
 * @param {Array<object>} llistaLiquids
 * @returns {Array<object>} Capes ordenades de baix (més dens) a dalt (menys dens)
 */
export function construeixColumnaLiquids(llistaLiquids) {
  let capes = [];
  for (const liq of llistaLiquids) {
    capes = abocaLiquid(capes, liq, { ambCura: true });
  }
  return capes;
}

/**
 * Remena el recipient: mescla tots els líquids de la mateixa família i ordena les fases resultants
 * de més densa (baix, índex 0) a menys densa (dalt). Regla R18.
 * @param {Array<object>} capesActuals
 * @returns {Array<object>}
 */
export function remenaCapes(capesActuals) {
  return consolidaIOrdenaCapes(capesActuals, true);
}

function consolidaIOrdenaCapes(capes, mesclaMateixaFamilia) {
  if (!capes || capes.length === 0) return [];

  if (!mesclaMateixaFamilia) {
    // Fusiona només si és exactament el mateix líquid i mateixa densitat
    const perLiquid = [];
    for (const c of capes) {
      const existent = perLiquid.find(
        x => x.liquid === c.liquid && Math.abs(x.densitat - c.densitat) < 1e-6
      );
      if (existent) {
        existent.volum = netejaDecimal(existent.volum + c.volum, 6);
      } else {
        perLiquid.push({ ...c, inestable: false });
      }
    }
    // Ordena de més dens (baix, índex 0) a menys dens (dalt)
    perLiquid.sort((a, b) => b.densitat - a.densitat);
    // Marca com a inestable si una capa té a sota o a sobre una capa de la mateixa família
    // (ex. alcohol sobre aigua, o aigua sobre mel si no s'ha remenat)
    for (let i = 1; i < perLiquid.length; i++) {
      if (sonMiscibles(perLiquid[i], perLiquid[i - 1])) {
        perLiquid[i].inestable = true;
      }
    }
    return perLiquid;
  }

  // Mescla tots els líquids de la mateixa família (R18)
  const grupsFamilia = new Map();
  for (const c of capes) {
    const clau = c.familia || c.liquid;
    if (!grupsFamilia.has(clau)) {
      grupsFamilia.set(clau, []);
    }
    grupsFamilia.get(clau).push(c);
  }

  const resultats = [];
  for (const [, grup] of grupsFamilia.entries()) {
    if (grup.length === 1) {
      resultats.push({ ...grup[0], inestable: false });
    } else {
      const totsIguals = grup.every(
        x => x.liquid === grup[0].liquid && Math.abs(x.densitat - grup[0].densitat) < 1e-6
      );
      const { volumTotal, densitat } = calculaMesclaIdeal(grup);
      if (totsIguals) {
        resultats.push({
          ...grup[0],
          volum: volumTotal,
          densitat,
          inestable: false
        });
      } else {
        const noms = [...new Set(grup.map(g => g.nom || g.liquid))];
        resultats.push({
          liquid: `mescla_${grup.map(g => g.liquid).join("_")}`,
          nom: `mescla (${noms.join(" + ")})`,
          familia: grup[0].familia,
          densitat,
          volum: volumTotal,
          color: grup[0].color || "#A5F3FC",
          viscositatVisual: grup[0].viscositatVisual || "baixa",
          inestable: false,
          esMescla: true
        });
      }
    }
  }

  // Ordena de més dens (baix, índex 0) a menys dens (dalt)
  resultats.sort((a, b) => b.densitat - a.densitat);
  return resultats;
}

/**
 * Calcula el nivell del líquid, si està fora d'escala i el volum vessat en un recipient (02-model-cientific.md §4.5, R14).
 * @param {object} recipient Dades del recipient ({ capacitat, bec, seccio, tipus })
 * @param {Array<object>} capes Capes de líquid dins del recipient
 * @param {number} [volumSubmergitTotal=0] Suma dels volums submergits dels objectes dins del líquid (cm³ = mL)
 * @returns {{
 *   volumLiquidInicial: number,
 *   volumSubmergit: number,
 *   volumTotalAparent: number,
 *   nivellLlegit: number,
 *   pujadaNivell: number,
 *   volumVessat: number,
 *   foraDEscala: boolean,
 *   alcadaCm: number,
 *   cotesCapes: Array<{liquid: string, densitat: number, vInici: number, vFi: number, yIniciCm: number, yFiCm: number}>
 * }}
 */
export function calculaNivellIVessament(recipient, capes = [], volumSubmergitTotal = 0) {
  const cap = recipient?.capacitat ?? 500;
  const seccio = recipient?.seccio ?? 20;
  const volLiquid = netejaDecimal(
    capes.reduce((s, c) => s + (c.volum || 0), 0),
    6
  );
  const vSub = netejaDecimal(Math.max(0, volumSubmergitTotal), 6);
  const volAparent = netejaDecimal(volLiquid + vSub, 6);

  // En un vas de vessament, el que passa del bec vessa al vas col·lector
  const teBec = recipient?.tipus === "vessament" || typeof recipient?.bec === "number";
  const limitBec = recipient?.bec ?? cap;

  let volumVessat = 0;
  let nivellLlegit = volAparent;
  let foraDEscala = false;

  if (teBec) {
    if (volAparent > limitBec) {
      volumVessat = netejaDecimal(volAparent - limitBec, 6);
      nivellLlegit = limitBec;
    }
  } else {
    // En una proveta o vas normal, si supera la darrera marca està fora d'escala (T10)
    if (volAparent > cap + 1e-6) {
      foraDEscala = true;
    }
    // Si supera un 10 % extra de la vora física, vessa
    const voraFisica = recipient?.voraFisica ?? cap * 1.1;
    if (volAparent > voraFisica) {
      volumVessat = netejaDecimal(volAparent - voraFisica, 6);
    }
  }

  const pujadaNivell = netejaDecimal(nivellLlegit - Math.min(volLiquid, teBec ? limitBec : Infinity), 6);
  const alcadaCm = seccio > 0 ? netejaDecimal(nivellLlegit / seccio, 4) : 0;

  // Cotes de cada capa (escalades proporcionalment si hi ha volum submergit)
  const factorExpansio = volLiquid > 0 ? nivellLlegit / volLiquid : 1;
  let vAcum = 0;
  const cotesCapes = capes.map(c => {
    const vInici = vAcum;
    const vCapa = netejaDecimal((c.volum || 0) * factorExpansio, 6);
    const vFi = netejaDecimal(vInici + vCapa, 6);
    vAcum = vFi;
    return {
      ...c,
      vInici,
      vFi,
      yIniciCm: seccio > 0 ? netejaDecimal(vInici / seccio, 4) : 0,
      yFiCm: seccio > 0 ? netejaDecimal(vFi / seccio, 4) : 0
    };
  });

  return {
    volumLiquidInicial: volLiquid,
    volumSubmergit: vSub,
    volumTotalAparent: volAparent,
    nivellLlegit: foraDEscala ? null : nivellLlegit,
    nivellBrut: nivellLlegit,
    pujadaNivell,
    volumVessat,
    foraDEscala,
    alcadaCm,
    cotesCapes
  };
}
