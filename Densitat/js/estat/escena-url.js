/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Codificació i descodificació de l'estat del laboratori o d'una investigació a l'adreça URL (07-guia-quadern-i-avaluacio.md §8, 09-arquitectura-tecnica.md §6).
 * Mai inclou dades personals de l'alumnat: només l'estat de l'escena o els paràmetres d'investigació, nivell i suports.
 */

/**
 * Codifica un objecte d'escena en una cadena Base64-URL segura per al fragment `#`.
 * @param {object} dadesEscena
 * @returns {string}
 */
export function codificaEscenaURL(dadesEscena) {
  try {
    const json = JSON.stringify(dadesEscena);
    const bytes = new TextEncoder().encode(json);
    let bin = "";
    for (const b of bytes) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (e) {
    return "";
  }
}

/**
 * Descodifica una cadena Base64-URL d'una escena.
 * @param {string} codi
 * @returns {object|null}
 */
export function descodificaEscenaURL(codi) {
  try {
    if (!codi) return null;
    const base64 = codi.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
    const bin = atob(base64 + pad);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

/**
 *Construeix un enllaç compartible per a una investigació o escena.
 * Si porta `nivell` a l'adreça, el nivell queda fix per a l'alumne (decisió 5 de PLA.md).
 * @param {object} opcions
 * @param {string} [opcions.baseUrl]
 * @param {string} [opcions.inv]
 * @param {number} [opcions.nivell]
 * @param {boolean} [opcions.facil]
 * @param {boolean} [opcions.senzills]
 * @param {boolean} [opcions.pistes]
 * @param {object} [opcions.escena]
 * @returns {string}
 */
export function generaEnllacCompartible(opcions = {}) {
  const base =
    opcions.baseUrl ||
    (typeof window !== "undefined" ? window.location.href.split("#")[0] : "https://felipsarroca.github.io/edu-apps/Densitat/");
  const params = new URLSearchParams();
  if (opcions.inv) params.set("inv", opcions.inv);
  if (opcions.nivell) params.set("nivell", String(opcions.nivell));
  if (typeof opcions.facil === "boolean") params.set("facil", opcions.facil ? "1" : "0");
  if (typeof opcions.senzills === "boolean") params.set("senzills", opcions.senzills ? "1" : "0");
  if (typeof opcions.pistes === "boolean") params.set("pistes", opcions.pistes ? "1" : "0");
  if (opcions.escena) {
    params.set("escena", codificaEscenaURL(opcions.escena));
  }
  return `${base}#${params.toString()}`;
}

/**
 * Llegeix els paràmetres del fragment `#` de l'adreça actual.
 * @param {string} [hash]
 * @returns {object}
 */
export function llegeixParametresHash(hash = typeof window !== "undefined" ? window.location.hash : "") {
  const net = (hash || "").replace(/^#\/?/, "");
  if (!net) return {};
  const params = new URLSearchParams(net);
  const res = {};
  if (params.has("inv")) res.inv = params.get("inv");
  if (params.has("nivell")) {
    const n = Number(params.get("nivell"));
    if ([1, 2, 3].includes(n)) {
      res.nivell = n;
      res.nivellFixatPerDocent = true;
    }
  }
  if (params.has("facil")) res.lecturaFacil = params.get("facil") === "1";
  if (params.has("senzills")) res.nombresSenzills = params.get("senzills") !== "0";
  if (params.has("pistes")) res.pistesActives = params.get("pistes") !== "0";
  if (params.has("escena")) {
    res.escena = descodificaEscenaURL(params.get("escena"));
  }
  return res;
}
