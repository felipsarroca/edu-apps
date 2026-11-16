/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Model d'objecte físic: parts, cavitats, magnituds derivades i transformacions (tallar, unir, modelar, construir).
 * Mòdul pur del motor físic (02-model-cientific.md §2.3, §4.1, regles R1–R5).
 */

import { netejaDecimal, massaAPes } from "./unitats.js";

/**
 * Obté la densitat d'un material des d'un diccionari de materials o un valor numèric directe.
 * @param {string|number|object} matSpec
 * @param {object} [catalegMaterials={}]
 * @param {boolean} [nombresSenzills=true]
 * @returns {number}
 */
export function resolDensitatMaterial(matSpec, catalegMaterials = {}, nombresSenzills = true) {
  if (typeof matSpec === "number") return matSpec;
  if (matSpec && typeof matSpec === "object") {
    return nombresSenzills ? (matSpec.dEscolar ?? matSpec.d) : (matSpec.dReferencia ?? matSpec.dEscolar ?? matSpec.d);
  }
  if (typeof matSpec === "string" && catalegMaterials[matSpec]) {
    const m = catalegMaterials[matSpec];
    return nombresSenzills ? m.dEscolar : (m.dReferencia ?? m.dEscolar);
  }
  throw new Error(`No s'ha pogut resoldre la densitat del material: ${JSON.stringify(matSpec)}`);
}

/**
 * Calcula totes les magnituds derivades d'un objecte (mai s'emmagatzemen, es calculen sempre).
 * Compliment estricte de R1: la massa és la suma de les masses de les seves parts i del contingut de les cavitats.
 * @param {object} obj
 * @param {object} [opcions={}]
 * @param {object} [opcions.materials={}] Catàleg de materials
 * @param {boolean} [opcions.nombresSenzills=true]
 * @param {number} [opcions.g=9.8]
 * @param {boolean} [opcions.inclouAireCavitats=false] Simplificació S4
 * @returns {object} Magnituds derivades
 */
export function magnitudsObjecte(obj, opcions = {}) {
  const {
    materials = {},
    nombresSenzills = true,
    g = 9.8,
    inclouAireCavitats = false
  } = opcions;

  const parts = obj.parts || [];
  const cavitatsTancades = obj.cavitatsTancades || [];

  let massaParts = 0;
  let volumMaterial = 0;

  for (const part of parts) {
    const v = part.volum || 0;
    volumMaterial += v;
    if (typeof part.massa === "number") {
      massaParts += part.massa;
    } else {
      const d = typeof part.densitat === "number"
        ? part.densitat
        : resolDensitatMaterial(part.material, materials, nombresSenzills);
      massaParts += d * v;
    }
  }

  // Si l'objecte té una massa fixa declarada (ex. ou de 60 g i 56 cm³, o bola buida de 60 g) i una sola part sense massa explícita
  if (typeof obj.massaFixa === "number" && parts.length === 1 && typeof parts[0].massa !== "number") {
    massaParts = obj.massaFixa;
  }

  let volumCavitatsTancades = 0;
  let massaCavitats = 0;
  for (const cav of cavitatsTancades) {
    const vc = cav.volum || 0;
    volumCavitatsTancades += vc;
    if (typeof cav.massa === "number") {
      massaCavitats += cav.massa;
    } else if (cav.contingut === "aigua" || cav.contingut === "liquid") {
      const dLiq = cav.densitatLiquid ?? 1.0;
      massaCavitats += vc * dLiq;
    } else if (cav.contingut === "aire" && inclouAireCavitats) {
      massaCavitats += vc * 0.0012; // 1,2 kg/m³ = 0,0012 g/cm³
    }
  }

  // Càrrega o llast addicional (barques, càpsula D8, submarí F5)
  const massaCarrega = obj.carrega ?? 0;
  const massaAiguaEmbarcada = obj.aiguaEmbarcada ?? 0;

  const massa = netejaDecimal(massaParts + massaCavitats + massaCarrega + massaAiguaEmbarcada, 6);
  volumMaterial = netejaDecimal(volumMaterial, 6);
  const volumExterior = netejaDecimal(volumMaterial + volumCavitatsTancades, 6);

  const volCavitatOberta = obj.cavitatOberta?.volum ?? 0;
  const volumEnvoltant = netejaDecimal(volumExterior + volCavitatOberta, 6);

  const inundat = Boolean(obj.inundat);
  const volumMaximDesplacable = obj.cavitatOberta
    ? (inundat ? volumMaterial : volumEnvoltant)
    : volumExterior;

  // Densitat del material (només si és d'un sol material)
  let densitatDelMaterial = null;
  if (parts.length === 1 && volumMaterial > 0) {
    densitatDelMaterial = netejaDecimal(massaParts / volumMaterial, 6);
  }

  const densitatMitjana = volumMaximDesplacable > 0
    ? netejaDecimal(massa / volumMaximDesplacable, 6)
    : 0;

  const pes = massaAPes(massa, g);

  return {
    massa,
    massaParts: netejaDecimal(massaParts, 6),
    massaCavitats: netejaDecimal(massaCavitats, 6),
    massaCarrega: netejaDecimal(massaCarrega, 6),
    volumMaterial,
    volumCavitatsTancades: netejaDecimal(volumCavitatsTancades, 6),
    volumExterior,
    volumEnvoltant,
    volumMaximDesplacable: netejaDecimal(volumMaximDesplacable, 6),
    densitatMaterial: densitatDelMaterial,
    densitatMitjana,
    pes
  };
}

/**
 * Talla un objecte homogeni en dues fraccions f i (1 - f).
 * Regles R2 i R3: conserva la densitat i reparteix massa i volum en la mateixa proporció;
 * la suma de masses i volums dels trossos és igual a la de l'original.
 * @param {object} obj
 * @param {number} [fraccio=0.5] Fracció del primer tros (entre 0.05 i 0.95)
 * @param {object} [opcions={}]
 * @returns {[object, object]} Els dos trossos [tros1, tros2]
 */
export function tallaObjecte(obj, fraccio = 0.5, opcions = {}) {
  if (fraccio <= 0 || fraccio >= 1) {
    throw new Error("La fracció de tall ha d'estar entre 0 i 1.");
  }
  const f1 = netejaDecimal(fraccio, 6);
  const f2 = netejaDecimal(1 - f1, 6);

  const partsOrig = obj.parts || [];
  const parts1 = partsOrig.map(p => ({
    ...p,
    volum: netejaDecimal(p.volum * f1, 6),
    ...(typeof p.massa === "number" ? { massa: netejaDecimal(p.massa * f1, 6) } : {})
  }));
  const parts2 = partsOrig.map((p, idx) => ({
    ...p,
    // Per garantir R3 exactament sense residu d'arrodoniment:
    volum: netejaDecimal(p.volum - parts1[idx].volum, 6),
    ...(typeof p.massa === "number" ? { massa: netejaDecimal(p.massa - parts1[idx].massa, 6) } : {})
  }));

  const mides1 = obj.mides ? escalaMidesTall(obj.forma, obj.mides, f1) : null;
  const mides2 = obj.mides ? escalaMidesTall(obj.forma, obj.mides, f2) : null;

  const baseEtiqueta = obj.etiqueta || obj.id || "Obj";
  const tros1 = {
    ...obj,
    id: `${obj.id}_1`,
    etiqueta: `${baseEtiqueta}1`,
    nom: `${obj.nom} (${formataFraccioTall(f1)})`,
    parts: parts1,
    cavitatsTancades: [],
    cavitatOberta: null,
    massaFixa: typeof obj.massaFixa === "number" ? netejaDecimal(obj.massaFixa * f1, 6) : undefined,
    mides: mides1,
    origen: `tallat de ${obj.id}`
  };

  const tros2 = {
    ...obj,
    id: `${obj.id}_2`,
    etiqueta: `${baseEtiqueta}2`,
    nom: `${obj.nom} (${formataFraccioTall(f2)})`,
    parts: parts2,
    cavitatsTancades: [],
    cavitatOberta: null,
    massaFixa: typeof obj.massaFixa === "number"
      ? netejaDecimal(obj.massaFixa - tros1.massaFixa, 6)
      : undefined,
    mides: mides2,
    origen: `tallat de ${obj.id}`
  };

  return [tros1, tros2];
}

function escalaMidesTall(forma, mides, f) {
  if (!mides) return null;
  if (forma === "ortoedre" || forma === "cub") {
    return { ...mides, c: netejaDecimal((mides.c ?? mides.a ?? 1) * f, 4) };
  }
  if (forma === "cilindre" || forma === "irregular") {
    const r = Math.cbrt(f);
    return {
      ...mides,
      diametre: typeof mides.diametre === "number" ? netejaDecimal(mides.diametre * r, 3) : undefined,
      alcada: typeof mides.alcada === "number" ? netejaDecimal(mides.alcada * r, 3) : undefined
    };
  }
  if (forma === "esfera") {
    return {
      ...mides,
      diametre: netejaDecimal((mides.diametre ?? 2) * Math.cbrt(f), 3)
    };
  }
  return { ...mides };
}

function formataFraccioTall(f) {
  if (Math.abs(f - 0.5) < 0.01) return "1/2";
  if (Math.abs(f - 0.25) < 0.01) return "1/4";
  if (Math.abs(f - 0.75) < 0.01) return "3/4";
  if (Math.abs(f - 1 / 3) < 0.01) return "1/3";
  if (Math.abs(f - 2 / 3) < 0.01) return "2/3";
  return `${Math.round(f * 100)} %`;
}

/**
 * Uneix dos objectes en un de sol (02-model-cientific.md §4.1).
 * @param {object} obj1
 * @param {object} obj2
 * @param {object} [opcions={}]
 * @returns {object}
 */
export function unirObjectes(obj1, obj2, opcions = {}) {
  const m1 = magnitudsObjecte(obj1, opcions);
  const m2 = magnitudsObjecte(obj2, opcions);
  const parts1 = (obj1.parts || []).map(p => ({ ...p }));
  const parts2 = (obj2.parts || []).map(p => ({ ...p }));
  const cavitats1 = (obj1.cavitatsTancades || []).map(c => ({ ...c }));
  const cavitats2 = (obj2.cavitatsTancades || []).map(c => ({ ...c }));

  return {
    id: `${obj1.id}_${obj2.id}`,
    etiqueta: `${obj1.etiqueta}+${obj2.etiqueta}`,
    nom: `${obj1.nom} + ${obj2.nom}`,
    forma: "irregular",
    parts: [...parts1, ...parts2],
    cavitatsTancades: [...cavitats1, ...cavitats2],
    cavitatOberta: null,
    massaFixa: netejaDecimal(m1.massa + m2.massa, 6),
    origen: `unió de ${obj1.id} i ${obj2.id}`,
    misteri: Boolean(obj1.misteri || obj2.misteri)
  };
}

/**
 * Modela un objecte deformable en una nova forma compacta (bola, cilindre, bloc, plat).
 * Regla R5: Modelar conserva la massa i el volum de material.
 * @param {object} obj
 * @param {string} novaForma - "bola" | "esfera" | "cilindre" | "bloc" | "ortoedre" | "plat"
 * @returns {object}
 */
export function modelaObjecte(obj, novaForma) {
  const volMat = (obj.parts || []).reduce((s, p) => s + (p.volum || 0), 0);
  let formaGeom = "esfera";
  let mides = {};

  switch (novaForma) {
    case "bola":
    case "esfera": {
      formaGeom = "esfera";
      const d = netejaDecimal(2 * Math.cbrt((3 * volMat) / (4 * Math.PI)), 3);
      mides = { diametre: d };
      break;
    }
    case "cilindre": {
      formaGeom = "cilindre";
      // Cilindre prim perquè càpiga en provetes més estretes (investigació C8: diàmetre 2,2 cm)
      const d = 2.2;
      const r = d / 2;
      const h = netejaDecimal(volMat / (Math.PI * r * r), 3);
      mides = { diametre: d, alcada: h };
      break;
    }
    case "bloc":
    case "ortoedre": {
      formaGeom = "ortoedre";
      const a = netejaDecimal(Math.cbrt(volMat), 2);
      const b = a;
      const c = netejaDecimal(volMat / (a * b), 3);
      mides = { a, b, c };
      break;
    }
    case "plat": {
      formaGeom = "ortoedre";
      const a = netejaDecimal(Math.sqrt(volMat / 1.0), 2);
      const b = a;
      const c = netejaDecimal(volMat / (a * b), 3);
      mides = { a, b, c, estilForma: "plat" };
      break;
    }
    default:
      formaGeom = obj.forma;
      mides = { ...obj.mides };
  }

  return {
    ...obj,
    forma: formaGeom,
    formaModelada: novaForma,
    mides,
    cavitatsTancades: [],
    cavitatOberta: null,
    inundat: false,
    origen: `modelat (${novaForma}) de ${obj.id}`
  };
}

/**
 * Constructor d'objectes (04-laboratori-i-instruments.md §5, regla R4 i cas T06):
 * No es poden fixar alhora material (densitat), massa i volum: dos determinen el tercer.
 * @param {object} params
 * @param {string} [params.fixats="material_volum"] - "material_volum" | "material_massa" | "massa_volum"
 * @param {string} [params.material="alumini"]
 * @param {number} [params.densitat]
 * @param {number} [params.massa]
 * @param {number} [params.volum]
 * @param {object} [opcions={}]
 * @returns {object}
 */
export function construeixObjecte(params, opcions = {}) {
  const { fixats = "material_volum", material = "alumini", etiqueta = "Nou", nom = "Objecte construït" } = params;
  if (
    params.fixaMaterial &&
    params.fixaMassa &&
    params.fixaVolum
  ) {
    throw new Error("R4: No es poden fixar alhora material, massa i volum. Dos determinen el tercer.");
  }

  let d = params.densitat;
  if (typeof d !== "number") {
    d = resolDensitatMaterial(material, opcions.materials || {}, opcions.nombresSenzills ?? true);
  }

  let m = params.massa;
  let V = params.volum;

  if (fixats === "material_volum") {
    if (typeof V !== "number" || V <= 0) throw new Error("Cal un volum positiu.");
    m = netejaDecimal(d * V, 6);
  } else if (fixats === "material_massa") {
    if (typeof m !== "number" || m <= 0) throw new Error("Cal una massa positiva.");
    V = netejaDecimal(m / d, 6);
  } else if (fixats === "massa_volum") {
    if (typeof m !== "number" || m <= 0 || typeof V !== "number" || V <= 0) {
      throw new Error("Calen una massa i un volum positius.");
    }
    d = netejaDecimal(m / V, 6);
  } else {
    throw new Error(`Combinació de paràmetres fixats no vàlida: ${fixats}`);
  }

  const aresta = netejaDecimal(Math.cbrt(V), 2);
  return {
    id: params.id || `const_${Date.now()}`,
    etiqueta,
    nom,
    forma: "cub",
    mides: { a: aresta, b: aresta, c: aresta },
    parts: [{ material: fixats === "massa_volum" ? (params.material || "personalitzat") : material, volum: V, densitat: d, massa: m }],
    cavitatsTancades: [],
    cavitatOberta: null,
    origen: "constructor",
    misteri: false,
    calculat: { densitat: d, massa: m, volum: V, fixats }
  };
}
