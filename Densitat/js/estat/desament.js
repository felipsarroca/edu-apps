/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Desament local al navegador, migració d'esquema i exportació/importació en JSON i CSV (09-arquitectura-tecnica.md §6).
 */

import { formataNombre } from "../fisica/unitats.js";

export const CLAU_ESTAT = "densitat:v1:estat";
export const CLAU_ESCENES = "densitat:v1:escenes";
export const CLAU_ACTIVITATS_DOCENT = "densitat:v1:activitats_docent";

/**
 * Llegeix l'estat desat al navegador de manera segura (funciona fins i tot en mode privat o amb localStorage blocat).
 * @returns {object|null}
 */
export function carregaEstatLocal() {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(CLAU_ESTAT);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.versio !== 1) {
      localStorage.setItem(`${CLAU_ESTAT}:backup_v${parsed.versio || 0}`, raw);
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

/**
 * Desa l'estat actual al navegador.
 * @param {object} estat
 */
export function desaEstatLocal(estat) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(CLAU_ESTAT, JSON.stringify(estat));
  } catch (e) {
    // En mode privat o quota plena, l'app continua funcionant en memòria
  }
}

/**
 * Esborra tota la sessió desada al navegador («Comença de nou»).
 */
export function esborraSessioLocal() {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(CLAU_ESTAT);
  } catch (e) {}
}

/**
 * Llegeix les escenes desades amb nom.
 * @returns {Array<object>}
 */
export function carregaEscenesDesades() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(CLAU_ESCENES);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Desa una escena del laboratori amb un nom.
 * @param {string} nom
 * @param {object} laboratoriEstat
 * @param {object} configuracio
 * @returns {Array<object>}
 */
export function desaEscenaAmbNom(nom, laboratoriEstat, configuracio) {
  const llista = carregaEscenesDesades();
  const nova = {
    id: `esc_${Date.now()}`,
    nom: nom.trim() || "Escena del laboratori",
    data: new Date().toISOString(),
    laboratori: JSON.parse(JSON.stringify(laboratoriEstat)),
    configuracio: JSON.parse(JSON.stringify(configuracio))
  };
  llista.unshift(nova);
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(CLAU_ESCENES, JSON.stringify(llista.slice(0, 30)));
    }
  } catch (e) {}
  return llista;
}

/**
 * Carrega i desa activitats personalitzades creades pel docent (Fase 4).
 */
export function carregaActivitatsDocent() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(CLAU_ACTIVITATS_DOCENT);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function desaActivitatDocent(activitat) {
  const llista = carregaActivitatsDocent().filter(a => a.id !== activitat.id);
  llista.unshift(activitat);
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(CLAU_ACTIVITATS_DOCENT, JSON.stringify(llista));
    }
  } catch (e) {}
  return llista;
}

/**
 * Genera el contingut CSV (separat per punt i coma i amb coma decimal) de les mesures del quadern.
 * @param {Array<object>} mesures
 * @returns {string}
 */
export function generaCSVQuadern(mesures = []) {
  const capcalera = [
    "Data",
    "Investigació",
    "Objecte",
    "Magnitud",
    "Valor",
    "Unitat",
    "Instrument",
    "Resolució",
    "Líquid"
  ].join(";");

  const files = mesures.map(m => {
    const valTxt = typeof m.valor === "number" ? formataNombre(m.valor) : String(m.valor ?? "");
    const resTxt = typeof m.resolucio === "number" ? formataNombre(m.resolucio) : String(m.resolucio ?? "");
    return [
      m.moment || "",
      m.investigacioId || "Lliure",
      (m.objecteNom || m.objecteId || "").replace(/;/g, ","),
      (m.magnitud || "").replace(/;/g, ","),
      valTxt,
      m.unitat || "",
      (m.instrument || "").replace(/;/g, ","),
      resTxt,
      (m.liquid || "").replace(/;/g, ",")
    ].join(";");
  });

  return "\uFEFF" + [capcalera, ...files].join("\r\n");
}

/**
 * Descarrega un fitxer de text (CSV o JSON) al navegador.
 * @param {string} nomFitxer
 * @param {string} contingut
 * @param {string} [tipusMime="text/plain;charset=utf-8"]
 */
export function descarregaFitxer(nomFitxer, contingut, tipusMime = "text/plain;charset=utf-8") {
  if (typeof document === "undefined") return;
  const blob = new Blob([contingut], { type: tipusMime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomFitxer;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
