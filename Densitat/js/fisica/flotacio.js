/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Flotació, empenyiment d'Arquimedes, equilibri de forces, dinamòmetre, columna de capes i pressió hidrostàtica.
 * Mòdul pur del motor físic (02-model-cientific.md §4.3, §4.4, §4.7, §4.9, regles R7–R13, R16, R17).
 */

import { netejaDecimal, iguals, massaAPes, calculaPressioHidrostatica } from "./unitats.js";
import { magnitudsObjecte } from "./objecte.js";

/**
 * Calcula l'empenyiment (en N) que exerceix un líquid de densitat dL (g/cm³) per a un volum submergit Vsub (cm³):
 * E = dL * g * Vsub / 1000.
 * @param {number} densitatLiquidGcm3
 * @param {number} volumSubmergitCm3
 * @param {number} [g=9.8]
 * @returns {number} Empenyiment en N
 */
export function calculaEmpenyiment(densitatLiquidGcm3, volumSubmergitCm3, g = 9.8) {
  if (volumSubmergitCm3 <= 0 || densitatLiquidGcm3 <= 0 || g <= 0) return 0;
  const massaLiquidDesplacatGrams = densitatLiquidGcm3 * volumSubmergitCm3;
  return massaAPes(massaLiquidDesplacatGrams, g);
}

/**
 * Calcula l'empenyiment amb diverses capes de líquid (02-model-cientific.md §4.3):
 * E = g * Σ (di * Vi) / 1000.
 * @param {Array<{densitat: number, volumSubmergit: number}>} trams
 * @param {number} [g=9.8]
 * @returns {number} Empenyiment en N
 */
export function calculaEmpenyimentMulticapa(trams, g = 9.8) {
  let massaDesplacada = 0;
  for (const t of trams) {
    if ((t.volumSubmergit ?? 0) > 0 && (t.densitat ?? 0) > 0) {
      massaDesplacada += t.densitat * t.volumSubmergit;
    }
  }
  return massaAPes(massaDesplacada, g);
}

/**
 * Calcula l'estat complet d'equilibri d'un objecte lliure (o enfonsat amb vareta) dins d'un sol líquid (02-model-cientific.md §4.4).
 * Compliment estricte de les regles R7, R8, R9, R10, R11, R12, R13 i R16.
 *
 * @param {object} obj Objecte del laboratori
 * @param {number|object} liquid Densitat del líquid en g/cm³ o objecte líquid
 * @param {object} [opcions={}]
 * @param {number} [opcions.g=9.8]
 * @param {object} [opcions.materials={}]
 * @param {boolean} [opcions.nombresSenzills=true]
 * @param {boolean} [opcions.vareta=false] Si s'obliga a submergir-lo del tot amb la vareta
 * @param {number|null} [opcions.volumLiquidDisponible=null] Per comprovar si l'objecte queda cobert (EP-06)
 * @returns {object}
 */
export function estatObjecteEnLiquid(obj, liquid, opcions = {}) {
  const {
    g = 9.8,
    materials = {},
    nombresSenzills = true,
    vareta = false,
    volumLiquidDisponible = null
  } = opcions;

  const dL = typeof liquid === "number"
    ? liquid
    : (nombresSenzills ? (liquid.dEscolar ?? liquid.densitat ?? 1) : (liquid.dReferencia ?? liquid.dEscolar ?? liquid.densitat ?? 1));

  const mag = magnitudsObjecte(obj, { materials, nombresSenzills, g });
  const m = mag.massa;
  const Vmax = mag.volumMaximDesplacable;
  const P = mag.pes;

  // Volum de líquid necessari per igualar el pes: Vnec = m / dL
  const Vnec = dL > 0 ? netejaDecimal(m / dL, 6) : Infinity;
  const Emax = calculaEmpenyiment(dL, Vmax, g);

  let estat;
  let volumSubmergit;
  let empenyiment;
  let normal = 0;
  let forcaVareta = 0;

  if (vareta) {
    volumSubmergit = Vmax;
    empenyiment = Emax;
    if (Emax >= P) {
      estat = "submergit_amb_vareta";
      forcaVareta = netejaDecimal(Emax - P, 6);
    } else {
      estat = "enfonsat";
      normal = netejaDecimal(P - Emax, 6);
    }
  } else if (iguals(Vnec, Vmax, 1e-6)) {
    estat = "equilibri_neutre";
    volumSubmergit = Vmax;
    empenyiment = P;
  } else if (Vnec < Vmax) {
    estat = "sura";
    volumSubmergit = Vnec;
    empenyiment = P; // En flotació lliure, E = P exactament (R8 i R9)
  } else {
    estat = "enfonsat";
    volumSubmergit = Vmax;
    empenyiment = Emax;
    normal = netejaDecimal(Math.max(0, P - Emax), 6); // R11: N = P - E
  }

  const fraccioSubmergida = Vmax > 0 ? netejaDecimal(volumSubmergit / Vmax, 6) : 0;
  const percentatgeSubmergit = netejaDecimal(fraccioSubmergida * 100, 4);
  const massaLiquidDesplacat = netejaDecimal(volumSubmergit * dL, 6);
  const pesLiquidDesplacat = calculaEmpenyiment(dL, volumSubmergit, g);

  // R9: En equilibri, la suma de forces verticals és zero (cap amunt: E + N, cap avall: P + Fvareta)
  const forcaNeta = netejaDecimal(empenyiment + normal - P - forcaVareta, 6);

  // Comprovació EP-06: si el volum de líquid és massa petit per cobrir l'objecte
  const noCobert = volumLiquidDisponible !== null && volumLiquidDisponible < volumSubmergit * 0.8;

  return {
    estat,
    sura: estat === "sura",
    enfonsat: estat === "enfonsat",
    equilibriNeutre: estat === "equilibri_neutre",
    massa: m,
    volumTotal: Vmax,
    volumMaterial: mag.volumMaterial,
    densitatObjecte: mag.densitatMitjana,
    densitatLiquid: dL,
    volumNecessari: Vnec,
    volumSubmergit,
    fraccioSubmergida,
    percentatgeSubmergit,
    massaLiquidDesplacat,
    pesLiquidDesplacat,
    pes: P,
    empenyiment,
    empenyimentMaxim: Emax,
    normal,
    forcaVareta,
    tensio: 0,
    forcaNeta,
    noCobert
  };
}

/**
 * Calcula l'estat d'un objecte penjat d'un dinamòmetre a l'aire o submergit (parcialment o totalment) en un líquid.
 * Regla R12: T = max(0, P - E(Vsub)), la lectura és el pes aparent i mai és negativa.
 *
 * @param {object} obj
 * @param {object} [opcions={}]
 * @param {number|object} [opcions.liquid=0] Densitat del líquid (0 si és a l'aire)
 * @param {number} [opcions.fraccioImmersio=1] Fracció del volum de l'objecte que ha entrat al líquid (0..1)
 * @param {boolean} [opcions.recolzatAlFons=false] Si s'ha deixat reposar al fons i el fil queda fluix (E1 pas 5)
 * @param {number} [opcions.g=9.8]
 * @param {object} [opcions.materials={}]
 * @param {boolean} [opcions.nombresSenzills=true]
 * @returns {object}
 */
export function calculaDinamometre(obj, opcions = {}) {
  const {
    liquid = 0,
    fraccioImmersio = 1,
    recolzatAlFons = false,
    g = 9.8,
    materials = {},
    nombresSenzills = true
  } = opcions;

  const dL = typeof liquid === "number"
    ? liquid
    : (nombresSenzills ? (liquid.dEscolar ?? liquid.densitat ?? 0) : (liquid.dReferencia ?? liquid.dEscolar ?? liquid.densitat ?? 0));

  const mag = magnitudsObjecte(obj, { materials, nombresSenzills, g });
  const P = mag.pes;
  const Vmax = mag.volumMaximDesplacable;

  const fImm = Math.max(0, Math.min(1, fraccioImmersio));
  // Si l'objecte sura per si sol, un cop la part submergida iguala el pes (Vsub = m / dL),
  // l'objecte ja no baixa més pel seu propi pes i el fil queda fluix (T = 0)
  const Vnec = dL > 0 ? mag.massa / dL : Infinity;
  const vSubGeometric = Vmax * fImm;
  const volumSubmergit = netejaDecimal(Math.min(vSubGeometric, Vnec, Vmax), 6);

  const empenyiment = calculaEmpenyiment(dL, volumSubmergit, g);
  let pesAparent = netejaDecimal(Math.max(0, P - empenyiment), 6);
  let normal = 0;
  let filFluix = pesAparent === 0 && dL > 0;

  if (recolzatAlFons) {
    normal = pesAparent;
    pesAparent = 0;
    filFluix = true;
  }

  return {
    pesReal: P,
    empenyiment,
    pesAparent,
    tensio: pesAparent,
    normal,
    volumSubmergit,
    massaLiquidDesplacat: netejaDecimal(volumSubmergit * dL, 6),
    pesLiquidDesplacat: empenyiment,
    filFluix,
    forcaNeta: 0
  };
}

/**
 * Calcula on queda un objecte dins d'una columna de capes de líquid (ordenades de baix = índex 0 a dalt = últim índex).
 * Segons 02-model-cientific.md §4.4:
 * - Baixa fins a la primera capa de densitat igual o superior a la seva.
 * - Si és menys dens que totes les capes, sura a la superfície de la capa superior (dalt de tot).
 * - Si és més dens que totes les capes, s'enfonsa al fons del recipient (sota la capa 0).
 * - Si la seva densitat queda entre la capa superior `dsup` i la inferior `dinf` (`dsup < dobj < dinf`),
 *   queda a la interfície entre totes dues, amb `m = dsup * Vsup + dinf * Vinf`.
 *
 * @param {object} obj
 * @param {Array<object>} capes Capes ordenades de baix (0, més dens) a dalt (últim, menys dens)
 * @param {object} [opcions={}]
 * @returns {object}
 */
export function estatObjecteEnColumna(obj, capes, opcions = {}) {
  const { g = 9.8, materials = {}, nombresSenzills = true } = opcions;
  const mag = magnitudsObjecte(obj, { materials, nombresSenzills, g });
  const m = mag.massa;
  const V = mag.volumMaximDesplacable;
  const dobj = mag.densitatMitjana;
  const P = mag.pes;

  if (!capes || capes.length === 0) {
    return {
      posicio: "fons",
      indexCapaInferior: -1,
      indexCapaSuperior: -1,
      descripcioPosicio: "Al fons del recipient buit",
      empenyiment: 0,
      pes: P
    };
  }

  // Assegurem ordre de baix (0, més dens) a dalt (n-1, menys dens)
  const ordenades = [...capes].sort((a, b) => b.densitat - a.densitat);
  const dMesLleugera = ordenades[ordenades.length - 1].densitat;
  const dMesDensa = ordenades[0].densitat;

  // 1. Sura a dalt de tot (sobre la capa superior menys densa)
  if (dobj < dMesLleugera) {
    const capaDalt = ordenades[ordenades.length - 1];
    const vSub = netejaDecimal(m / capaDalt.densitat, 6);
    return {
      posicio: "superficie",
      indexCapaInferior: ordenades.length - 1,
      indexCapaSuperior: null,
      capaInferior: capaDalt.liquid,
      capaSuperior: "aire",
      descripcioPosicio: `Sura a dalt de tot (sobre ${capaDalt.nom})`,
      volumEnInferior: vSub,
      volumEnSuperior: netejaDecimal(V - vSub, 6),
      fraccioEnInferior: netejaDecimal(vSub / V, 4),
      empenyiment: P,
      pes: P
    };
  }

  // 2. S'enfonsa al fons de tot (més dens que la capa del fons)
  if (dobj > dMesDensa) {
    const capaFons = ordenades[0];
    const E = calculaEmpenyiment(capaFons.densitat, V, g);
    return {
      posicio: "fons",
      indexCapaInferior: 0,
      indexCapaSuperior: 0,
      capaInferior: capaFons.liquid,
      capaSuperior: capaFons.liquid,
      descripcioPosicio: `Al fons (dins de ${capaFons.nom})`,
      volumEnInferior: V,
      volumEnSuperior: 0,
      fraccioEnInferior: 1,
      empenyiment: E,
      normal: netejaDecimal(P - E, 6),
      pes: P
    };
  }

  // 3. Coincideix exactament amb la densitat d'alguna capa
  const idxExacte = ordenades.findIndex(c => iguals(c.densitat, dobj, 1e-5));
  if (idxExacte !== -1) {
    const capa = ordenades[idxExacte];
    return {
      posicio: "dins_capa",
      indexCapaInferior: idxExacte,
      indexCapaSuperior: idxExacte,
      capaInferior: capa.liquid,
      capaSuperior: capa.liquid,
      descripcioPosicio: `En equilibri dins la capa de ${capa.nom}`,
      volumEnInferior: V,
      volumEnSuperior: 0,
      fraccioEnInferior: 1,
      empenyiment: P,
      pes: P
    };
  }

  // 4. Queda a la frontera entre dues capes: dinf > dobj > dsup
  for (let i = 0; i < ordenades.length - 1; i++) {
    const capaInf = ordenades[i];
    const capaSup = ordenades[i + 1];
    if (capaInf.densitat >= dobj && dobj >= capaSup.densitat) {
      // m = dsup * Vsup + dinf * Vinf, amb Vsup + Vinf = V
      // => dobj * V = dsup * (V - Vinf) + dinf * Vinf => Vinf = V * (dobj - dsup) / (dinf - dsup)
      const fraccioInf = (dobj - capaSup.densitat) / (capaInf.densitat - capaSup.densitat);
      const vInf = netejaDecimal(V * fraccioInf, 6);
      const vSup = netejaDecimal(V - vInf, 6);
      const E = calculaEmpenyimentMulticapa(
        [
          { densitat: capaInf.densitat, volumSubmergit: vInf },
          { densitat: capaSup.densitat, volumSubmergit: vSup }
        ],
        g
      );
      return {
        posicio: "frontera",
        indexCapaInferior: i,
        indexCapaSuperior: i + 1,
        capaInferior: capaInf.liquid,
        capaSuperior: capaSup.liquid,
        descripcioPosicio: `Entre ${capaSup.nom} i ${capaInf.nom}`,
        volumEnInferior: vInf,
        volumEnSuperior: vSup,
        fraccioEnInferior: netejaDecimal(fraccioInf, 4),
        empenyiment: E,
        pes: P
      };
    }
  }

  return {
    posicio: "fons",
    empenyiment: 0,
    pes: P
  };
}

/**
 * Calcula les forces de pressió sobre les cares horitzontals d'un bloc d'àrea S (cm²) i alçada a (cm)
 * amb la cara superior a una profunditat hSup (cm) dins d'un líquid de densitat dL (g/cm³).
 * Cas de prova T38 i investigació G3 (02-model-cientific.md §4.9).
 * @param {object} params
 * @param {number} params.densitatLiquid Densitat en g/cm³
 * @param {number} params.arestaCm Si és un cub, aresta en cm
 * @param {number} [params.areaCm2] Àrea de la base en cm²
 * @param {number} [params.alcadaBlocCm] Alçada del bloc en cm
 * @param {number} params.profunditatCaraSuperiorCm Profunditat de la cara superior en cm
 * @param {number} [params.g=9.8]
 * @returns {object}
 */
export function calculaForcesPressioBloc(params) {
  const {
    densitatLiquid = 1.0,
    arestaCm = 10,
    profunditatCaraSuperiorCm = 5,
    g = 9.8
  } = params;

  const S_cm2 = params.areaCm2 ?? arestaCm * arestaCm;
  const a_cm = params.alcadaBlocCm ?? arestaCm;
  const hSup = profunditatCaraSuperiorCm;
  const hInf = hSup + a_cm;

  const pSup = calculaPressioHidrostatica(densitatLiquid, hSup, g);
  const pInf = calculaPressioHidrostatica(densitatLiquid, hInf, g);

  // S (m²) = S (cm²) / 10 000
  const S_m2 = S_cm2 / 10000;
  const forcaSuperior = netejaDecimal(pSup * S_m2, 6);
  const forcaInferior = netejaDecimal(pInf * S_m2, 6);
  const diferenciaForces = netejaDecimal(forcaInferior - forcaSuperior, 6);
  const volumCm3 = netejaDecimal(S_cm2 * a_cm, 6);
  const empenyiment = calculaEmpenyiment(densitatLiquid, volumCm3, g);

  return {
    profunditatSuperiorCm: hSup,
    profunditatInferiorCm: hInf,
    pressioSuperiorPa: pSup,
    pressioInferiorPa: pInf,
    areaCm2: S_cm2,
    volumCm3,
    forcaSuperiorN: forcaSuperior,
    forcaInferiorN: forcaInferior,
    diferenciaForcesN: diferenciaForces,
    empenyimentN: empenyiment
  };
}

/**
 * Calcula l'equilibri de forces d'un globus de volum V (en L = dm³) ple d'un gas de densitat dGas (en g/L = kg/m³)
 * i una coberta de massa mc (en g), envoltat d'aire de densitat dAire (en g/L = kg/m³).
 * Cas de prova T35 i investigació F9 (02-model-cientific.md §4.7).
 * @param {object} params
 * @param {number} params.volumLitres Volum en L
 * @param {number} params.densitatGasGperL Densitat del gas interior en g/L (o kg/m³)
 * @param {number} params.massaCobertaGrams Massa de l'embolcall en g
 * @param {number} [params.densitatAireGperL=1.20] Densitat de l'aire exterior en g/L
 * @param {number} [params.g=9.8]
 * @returns {object}
 */
export function estatGlobus(params) {
  const {
    volumLitres,
    densitatGasGperL,
    massaCobertaGrams,
    densitatAireGperL = 1.2,
    g = 9.8
  } = params;

  const massaGasGrams = netejaDecimal(volumLitres * densitatGasGperL, 6);
  const massaTotalGrams = netejaDecimal(massaCobertaGrams + massaGasGrams, 6);
  const massaAireDesplacatGrams = netejaDecimal(volumLitres * densitatAireGperL, 6);

  const pes = massaAPes(massaTotalGrams, g);
  const empenyiment = massaAPes(massaAireDesplacatGrams, g);
  const forcaNeta = netejaDecimal(empenyiment - pes, 6);
  const densitatMitjanaGperL = volumLitres > 0 ? netejaDecimal(massaTotalGrams / volumLitres, 6) : 0;

  return {
    volumLitres,
    massaGasGrams,
    massaCobertaGrams,
    massaTotalGrams,
    densitatMitjanaGperL,
    densitatAireGperL,
    pes: netejaDecimal(pes, 3),
    empenyiment: netejaDecimal(empenyiment, 3),
    forcaNeta: netejaDecimal(forcaNeta, 3),
    puja: forcaNeta > 1e-5,
    cau: forcaNeta < -1e-5,
    equilibri: Math.abs(forcaNeta) <= 1e-5
  };
}
