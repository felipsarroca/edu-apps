/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Magatzem d'estat únic de l'aplicació, accions amb nom i historial de Desfés / Refés (09-arquitectura-tecnica.md §4).
 */

import { OBJECTES_PRESTATGE } from "../dades/objectes.js";
import { LIQUIDS } from "../dades/liquids.js";
import { INVESTIGACIONS } from "../dades/investigacions/index.js";
import { creaEstatDiagnosiInicial, registraEvidenciaIdea } from "../guia/diagnosi.js";
import { carregaEstatLocal, desaEstatLocal, esborraSessioLocal } from "./desament.js";

const oients = new Set();
let pilaDesfes = [];
let pilaRefes = [];

/**
 * Crea l'estat del laboratori per a una escena d'investigació o per al laboratori lliure.
 * @param {object} [escenaDef]
 * @returns {object}
 */
export function creaEstatLaboratori(escenaDef = null) {
  const taula = escenaDef?.taula || "mesura";
  const baseKit = ["A", "B", "C", "patata", "pedra"];
  const llistaIds = escenaDef?.objectes?.length
    ? [...new Set([...escenaDef.objectes, ...baseKit])]
    : [
        "A",
        "B",
        "C",
        "patata",
        "pedra",
        "cilindre_alumini",
        "cilindre_plom",
        "tap",
        "espelma",
        "glaco",
        "ou",
        "clau",
        "bala_vidre",
        "peca_escacs",
        "pedra_tosca",
        "dau_polietile",
        "esfera_pi_20",
        "esfera_pi_60",
        "esfera_plast_20",
        "esfera_plast_60",
        "misteri_1",
        "misteri_2",
        "misteri_3",
        "misteri_4",
        "misteri_5",
        "misteri_6"
      ];

  const objectes = {};
  const ubicacions = {};

  for (const id of llistaIds) {
    if (OBJECTES_PRESTATGE[id]) {
      objectes[id] = JSON.parse(JSON.stringify(OBJECTES_PRESTATGE[id]));
      ubicacions[id] = "prestatge";
    }
  }

  // Afegim també els objectes específics de columna, tanc i taller perquè estiguin disponibles si es canvia de taula
  const extres = [
    "bola_col_poliestire",
    "bola_col_cera",
    "bola_col_polietile",
    "bola_col_nilo",
    "bola_col_estany",
    "arq_plast_20",
    "arq_plast_50",
    "arq_ceram_20",
    "arq_ceram_50",
    "arq_acer_20",
    "arq_acer_50",
    "esf_sura_cera",
    "esf_sura_polietile",
    "esf_sura_pi",
    "esf_sura_suro",
    "cub10_suro",
    "cub10_pi",
    "cub10_roure",
    "cub10_cera",
    "cub10_gel",
    "cub10_polietile",
    "bola_buida_fina",
    "bola_buida_gruixuda",
    "plastilina_taller",
    "acer_taller",
    "corona",
    "lingot_or",
    "capsula_d8",
    "taronja_pell",
    "taronja_pelada",
    "llauna_sucre",
    "llauna_zero",
    "cub_suro_10",
    "cub_pi_10",
    "cub_alumini_10",
    "cub_ferro_10",
    "cub_plom_10",
    "quilo_poliestire",
    "quilo_pi",
    "quilo_alumini",
    "quilo_ferro",
    "bloc_regular_a5",
    "serie_al_10",
    "serie_al_50",
    "serie_al_80",
    "serie_al_150",
    "serie_al_200",
    "peca_precisio"
  ];
  for (const id of extres) {
    if (!objectes[id] && OBJECTES_PRESTATGE[id]) {
      objectes[id] = JSON.parse(JSON.stringify(OBJECTES_PRESTATGE[id]));
      ubicacions[id] = "prestatge";
    }
  }

  const provetaInicial = escenaDef?.recipients?.find(r => r.startsWith("proveta")) || "proveta250";
  const liquidInicial = escenaDef?.liquids?.[0] || "aigua";
  const infoLiq = LIQUIDS[liquidInicial] || LIQUIDS.aigua;
  const modelBalanca =
    escenaDef?.instruments?.find(i => i.startsWith("balanca_")) || "balanca_laboratori";

  return {
    taula,
    objectes,
    objectesPrestatgeDestacats: llistaIds,
    ubicacions,
    objecteSeleccionat: llistaIds[0] || "A",
    balanca: {
      model: modelBalanca,
      tara: 0,
      desplacamentZero: 0,
      unitat: "g",
      recipientSobrePlat: false,
      liquidRecipient: "aigua",
      volumRecipient: 0,
      tipusRecipient: "vas250"
    },
    proveta: {
      tipus: provetaInicial,
      liquid: liquidInicial,
      volumInicial: provetaInicial === "proveta25" ? 15 : provetaInicial === "proveta100" ? 50 : 200,
      vareta: false,
      lupaOberta: false,
      posicioUll: "altura", // "alt" | "altura" | "baix"
      puntLectura: "tangent" // "tangent" | "vora"
    },
    vas: {
      tipus: "vas600",
      liquid: liquidInicial,
      volumInicial: 400,
      salGrams: 0
    },
    columna: {
      tipus: "proveta500",
      ambCura: true,
      salGrams: 0,
      capes: [
        { liquid: "mel", nom: "mel", familia: "aquosa", densitat: 1.42, volum: 100, color: "#F59E0B" },
        { liquid: "aigua", nom: "aigua", familia: "aquosa", densitat: 1.0, volum: 100, color: "#BAE6FD" },
        { liquid: "oli", nom: "oli", familia: "oliosa", densitat: 0.92, volum: 100, color: "#FDE047" },
        { liquid: "alcohol", nom: "alcohol", familia: "aquosa", densitat: 0.79, volum: 100, color: "#DDD6FE" }
      ],
      objectesEnColumna: ["bola_col_poliestire", "bola_col_cera", "bola_col_polietile", "bola_col_nilo", "bola_col_estany"]
    },
    tanc: {
      liquid: infoLiq.id,
      salGrams: 0,
      dinamometreModel: "dinamometre_5",
      fraccioImmersio: 1.0,
      profunditatCm: 20,
      recolzatAlFons: false,
      modeEspecial: "normal", // "normal" | "barca" | "submari" | "pressio" | "globus" | "temperatura" | "densimetre"
      submariVolumAigua: 300,
      globusGas: "heli",
      globusVolumL: 10,
      temperaturaC: 20,
      sondaProfunditatCm: 20,
      formaRecipientPressio: "ample" // "estret" | "ample" | "conic"
    },
    taller: {
      objecteActiu: "plastilina_taller",
      fraccioTall: 0.5,
      formaModelat: "bola",
      constructor: {
        fixats: "material_volum",
        material: "alumini",
        massa: 270,
        volum: 100
      },
      barca: {
        material: "plastilina",
        massaBarca: 200,
        densitatMaterial: 1.5,
        L: 12,
        B: 10,
        H: 5,
        carrega: 0,
        viaDAigua: false,
        alcadaCarregaCm: 1.5
      }
    },
    einaActiva: null, // null | "regle" | "lupa" | "calculadora" | "conversor" | "grafica" | "comparador"
    vistes: {
      cubets: false,
      volums: false,
      forces: false,
      valors: false,
      particules: false
    },
    visibilitat: escenaDef?.visibilitat || "experimental",
    salGrams: 0,
    accionsFetes: {},
    avísFisic: null
  };
}

/**
 * Crea l'estat global per defecte.
 */
export function creaEstatInicial() {
  const invInicial = INVESTIGACIONS.C4;
  return {
    versio: 1,
    pantalla: "inici", // "inici" | "laboratori" | "quadern" | "consulta" | "progres" | "docent"
    modeLaboratori: "investigacio", // "investigacio" | "lliure"
    panellPlegat: false,
    pestanyaPanell: "guia", // "guia" | "dades" | "notes"
    pestanyaConsulta: "formules", // "formules" | "unitats" | "densitats" | "instruments" | "glossari" | "com_funciona"
    modalConsultaObert: false,
    configuracio: {
      nivell: 1,
      nivellFixatPerDocent: false,
      nombresSenzills: true,
      lecturaFacil: false,
      pistesActives: true,
      g: 9.8,
      astre: "terra",
      simbolDensitat: "d",
      moviment: "normal", // "normal" | "reduit"
      projector: false,
      amagaResultats: false
    },
    laboratori: creaEstatLaboratori(invInicial.escena),
    investigacio: {
      id: "C4",
      pas: 0,
      respostes: {},
      pistesPerPas: {},
      feedbackPas: null
    },
    quadern: {
      entrades: {},
      mesures: [],
      notes: "",
      captures: []
    },
    progres: {
      fetes: [],
      evidencies: [],
      diagnosi: creaEstatDiagnosiInicial()
    }
  };
}

let estat = carregaEstatLocal() || creaEstatInicial();
// Assegurem que el subarbre de diagnosi existeixi si ve d'una sessió anterior
if (!estat.progres?.diagnosi?.bayesia) {
  estat.progres = estat.progres || { fetes: [], evidencies: [] };
  estat.progres.diagnosi = creaEstatDiagnosiInicial();
}

export function obteEstat() {
  return estat;
}

export function subscriu(fn) {
  oients.add(fn);
  return () => oients.delete(fn);
}

export function notifica() {
  desaEstatLocal(estat);
  for (const fn of oients) {
    fn(estat);
  }
}

/**
 * Desa una còpia de l'estat del laboratori a la pila de Desfés abans d'una mutació.
 */
export function desaSnapshotLaboratori() {
  pilaDesfes.push(JSON.parse(JSON.stringify(estat.laboratori)));
  if (pilaDesfes.length > 40) pilaDesfes.shift();
  pilaRefes = [];
}

export function potDesfer() {
  return pilaDesfes.length > 0;
}

export function potRefer() {
  return pilaRefes.length > 0;
}

export function desfesLaboratori() {
  if (pilaDesfes.length === 0) return;
  pilaRefes.push(JSON.parse(JSON.stringify(estat.laboratori)));
  estat.laboratori = pilaDesfes.pop();
  notifica();
}

export function refesLaboratori() {
  if (pilaRefes.length === 0) return;
  pilaDesfes.push(JSON.parse(JSON.stringify(estat.laboratori)));
  estat.laboratori = pilaRefes.pop();
  notifica();
}

/**
 * Obre una investigació concreta al laboratori i carrega la seva escena.
 * @param {string} invId
 */
export function obreInvestigacio(invId) {
  const inv = INVESTIGACIONS[invId];
  if (!inv) return;
  desaSnapshotLaboratori();
  estat.pantalla = "laboratori";
  estat.modeLaboratori = "investigacio";
  estat.pestanyaPanell = "guia";
  const entradaExistent = estat.quadern.entrades[invId] || {};
  estat.investigacio = {
    id: invId,
    pas: entradaExistent.ultimPas ?? 0,
    respostes: entradaExistent.respostes || {},
    pistesPerPas: {},
    feedbackPas: null
  };
  estat.laboratori = creaEstatLaboratori(inv.escena);
  // Si és una investigació d'un mòdul especial (F1–F3 barca, F5 submarí, F9 globus, F10 temperatura, F11 densímetre, G1–G3 pressió), activem el mode visual corresponent
  if (["F1", "F2", "F3", "F4"].includes(invId)) {
    estat.laboratori.tanc.modeEspecial = "barca";
    if (invId === "F4") {
      estat.laboratori.taller.barca = {
        material: "acer",
        massaBarca: 500,
        densitatMaterial: 7.85,
        L: 15,
        B: 8,
        H: 6,
        carrega: 0,
        viaDAigua: false,
        alcadaCarregaCm: 1.5
      };
    }
  } else if (invId === "F5") {
    estat.laboratori.tanc.modeEspecial = "submari";
  } else if (invId === "F9") {
    estat.laboratori.tanc.modeEspecial = "globus";
  } else if (invId === "F10") {
    estat.laboratori.tanc.modeEspecial = "temperatura";
  } else if (invId === "F11") {
    estat.laboratori.tanc.modeEspecial = "densimetre";
  } else if (["G1", "G2", "G3"].includes(invId)) {
    estat.laboratori.tanc.modeEspecial = "pressio";
  }
  notifica();
}

/**
 * Obre el laboratori en mode d'exploració lliure.
 * @param {string} [taula="mesura"]
 */
export function obreLaboratoriLliure(taula = "mesura") {
  desaSnapshotLaboratori();
  estat.pantalla = "laboratori";
  estat.modeLaboratori = "lliure";
  estat.pestanyaPanell = "guia";
  estat.laboratori.taula = taula;
  notifica();
}

/**
 * Anota una mesura o càlcul al quadern científic (07-guia-quadern-i-avaluacio.md §7.2).
 * @param {object} dada
 */
export function anotaMesuraQuadern(dada) {
  const ara = new Date();
  const hora = ara.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" });
  const invId = estat.modeLaboratori === "investigacio" ? estat.investigacio.id : "lliure";
  const nova = {
    id: `m_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    moment: hora,
    investigacioId: invId,
    objecteId: dada.objecteId || "—",
    objecteNom: dada.objecteNom || dada.objecteId || "—",
    magnitud: dada.magnitud || "Mesura",
    valor: dada.valor,
    unitat: dada.unitat || "",
    instrument: dada.instrument || "Laboratori",
    resolucio: dada.resolucio ?? "",
    liquid: dada.liquid || ""
  };
  estat.quadern.mesures.push(nova);
  estat.progres.evidencies.push({ dimensio: "procediment", valor: 3 });
  notifica();
  return nova;
}

/**
 * Reinicia l'escena actual del laboratori sense esborrar el quadern ni el progrés.
 */
export function reiniciaEscenaActual() {
  desaSnapshotLaboratori();
  const inv = estat.modeLaboratori === "investigacio" ? INVESTIGACIONS[estat.investigacio.id] : null;
  estat.laboratori = creaEstatLaboratori(inv?.escena || null);
  notifica();
}

/**
 * Torna tots els objectes de la taula al prestatge («Endreça»).
 */
export function endrecaObjectesAlPrestatge() {
  desaSnapshotLaboratori();
  for (const id of Object.keys(estat.laboratori.ubicacions)) {
    estat.laboratori.ubicacions[id] = "prestatge";
  }
  estat.laboratori.avísFisic = null;
  notifica();
}

/**
 * Esborra tota la sessió i reinicia l'app («Comença de nou»).
 */
export function reiniciaSessioCompleta() {
  esborraSessioLocal();
  pilaDesfes = [];
  pilaRefes = [];
  estat = creaEstatInicial();
  notifica();
}

export { registraEvidenciaIdea };
