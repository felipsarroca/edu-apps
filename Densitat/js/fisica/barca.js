/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Física de les barques (buc obert), càrrega, inundació, estabilitat i submarí.
 * Mòdul pur del motor físic (02-model-cientific.md §4.6, §4.7, regla R15, casos T29–T34).
 */

import { netejaDecimal, iguals, massaAPes } from "./unitats.js";
import { calculaEmpenyiment } from "./flotacio.js";

export const GRUIX_MINIM_PARET_CM = 0.15;

/**
 * Resol numèricament el gruix de paret `t` d'un buc prismàtic obert de dimensions exteriors L × B × H
 * i volum de material Vmat:
 * Vmat = L·B·H − (L − 2t)·(B − 2t)·(H − t)
 * @param {number} L Llargada (cm)
 * @param {number} B Amplada (cm)
 * @param {number} H Alçada (cm)
 * @param {number} Vmat Volum de material (cm³)
 * @returns {number} Gruix t en cm
 */
export function resolGruixParetBuc(L, B, H, Vmat) {
  const Venv = L * B * H;
  if (Vmat <= 0) return 0;
  const maxT = Math.min(L / 2, B / 2, H);
  if (Vmat >= Venv) return maxT;

  let lo = 0;
  let hi = maxT;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const vInt = Math.max(0, L - 2 * mid) * Math.max(0, B - 2 * mid) * Math.max(0, H - mid);
    const vCalc = Venv - vInt;
    if (vCalc < Vmat) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return netejaDecimal((lo + hi) / 2, 4);
}

/**
 * Calcula l'estat complet d'un buc prismàtic (barca) dins d'un líquid de densitat dL (02-model-cientific.md §4.6).
 * Compliment estricte de la regla R15 i dels casos T29–T33.
 *
 * @param {object} params
 * @param {number} [params.massaBarca=200] Massa del material de la barca (g)
 * @param {number} [params.densitatMaterial=1.50] Densitat del material del buc (g/cm³)
 * @param {number} [params.volumMaterial] Volum del material (cm³); si no es dona, es calcula massaBarca / densitatMaterial
 * @param {number} [params.L=12] Llargada exterior (cm)
 * @param {number} [params.B=10] Amplada exterior (cm)
 * @param {number} [params.H=5] Alçada exterior (cm)
 * @param {number} [params.carrega=0] Massa de la càrrega afegida (g)
 * @param {number} [params.aiguaEmbarcada=0] Massa d'aigua que ha entrat per una via d'aigua (g)
 * @param {boolean} [params.viaDAigua=false] Si té un forat al buc pel qual acaba inundant-se
 * @param {number} [params.alcadaCarregaCm=1.5] Alçada del centre de gravetat de la càrrega per a l'estabilitat
 * @param {number} [params.densitatLiquid=1.00] Densitat del líquid (g/cm³)
 * @param {number} [params.g=9.8] Gravetat (N/kg)
 * @param {number} [params.gruixMinim=GRUIX_MINIM_PARET_CM] Gruix mínim estructural (cm)
 * @returns {object}
 */
export function calculaBuc(params = {}) {
  const {
    material = "plastilina",
    massaBarca = 200,
    densitatMaterial = 1.5,
    L = 12,
    B = 10,
    H = 5,
    carrega = 0,
    aiguaEmbarcada = 0,
    viaDAigua = false,
    alcadaCarregaCm = 1.5,
    densitatLiquid = 1.0,
    g = 9.8,
    gruixMinim = GRUIX_MINIM_PARET_CM
  } = params;

  const Vmat = netejaDecimal(params.volumMaterial ?? massaBarca / densitatMaterial, 6);
  const Venv = netejaDecimal(L * B * H, 6);
  const gruixParet = resolGruixParetBuc(L, B, H, Vmat);
  const gruixParetArrodonit = netejaDecimal(gruixParet, 2);
  const paretMassaFina = gruixParet < gruixMinim;
  const volumCavitat = netejaDecimal(Math.max(0, Venv - Vmat), 6);

  const massaTotal = netejaDecimal(massaBarca + carrega + aiguaEmbarcada, 6);
  const areaBase = L * B;
  const calatTeoric = areaBase > 0 && densitatLiquid > 0
    ? netejaDecimal(massaTotal / (densitatLiquid * areaBase), 6)
    : Infinity;

  const carregaMaxima = netejaDecimal(Math.max(0, densitatLiquid * Venv - massaBarca), 6);

  // R15: Un buc obert s'inunda quan el calat supera l'alçada del costat (h > H), o si té via d'aigua oberta
  const inundada = Boolean(viaDAigua || calatTeoric > H + 1e-6);

  let volumMaximDesplacable = inundada ? Vmat : Venv;
  let volumSubmergit;
  let sura;

  if (inundada) {
    // Un cop inundat l'interior, només desplaça el volum del material (i el de les peses si n'hi ha)
    sura = densitatMaterial <= densitatLiquid;
    volumSubmergit = sura ? netejaDecimal(massaTotal / densitatLiquid, 6) : Vmat;
  } else {
    sura = true;
    volumSubmergit = netejaDecimal(massaTotal / densitatLiquid, 6);
  }

  const calat = inundada ? H : netejaDecimal(calatTeoric, 4);
  const francbord = inundada ? 0 : netejaDecimal(Math.max(0, H - calatTeoric), 4);
  const densitatMitjana = volumMaximDesplacable > 0
    ? netejaDecimal(massaTotal / volumMaximDesplacable, 6)
    : densitatMaterial;

  const pes = massaAPes(massaTotal, g);
  const empenyimentMaxim = calculaEmpenyiment(densitatLiquid, volumMaximDesplacable, g);
  const empenyiment = sura ? pes : empenyimentMaxim;
  const normal = sura ? 0 : netejaDecimal(Math.max(0, pes - empenyimentMaxim), 6);

  // Estabilitat simplificada (02-model-cientific.md §4.6): GM = h/2 + B²/(12·h) − zG
  const zGBarca = H * 0.35;
  const zG = massaTotal > 0
    ? (massaBarca * zGBarca + (carrega + aiguaEmbarcada) * alcadaCarregaCm) / massaTotal
    : zGBarca;
  const hEst = Math.max(0.2, calat);
  const GM = netejaDecimal(hEst / 2 + (B * B) / (12 * hEst) - zG, 4);
  const bolca = sura && GM < 0;

  return {
    material,
    L,
    B,
    H,
    massaBarca,
    carrega,
    aiguaEmbarcada,
    massaTotal,
    densitatMaterial,
    densitatLiquid,
    volumMaterial: Vmat,
    volumCavitat,
    volumEnvoltant: Venv,
    volumMaximDesplacable,
    volumSubmergit,
    densitatMitjana,
    gruixParet,
    gruixParetArrodonit,
    paretMassaFina,
    formaValida: !paretMassaFina && Venv > Vmat,
    calat: netejaDecimal(calat, 2),
    calatExacte: calat,
    francbord: netejaDecimal(francbord, 2),
    francbordExacte: francbord,
    carregaMaxima,
    inundada,
    sura: sura && !bolca,
    suraSenseBolcar: sura,
    bolca,
    alcadaMetacentricaGM: GM,
    pes,
    empenyiment,
    empenyimentMaxim,
    normal
  };
}

/**
 * Calcula l'estat d'un submarí amb tanc de llast (02-model-cientific.md §4.7, cas T34, investigació F5).
 * @param {object} params
 * @param {number} [params.volumExterior=1000] Volum exterior fix Vext (cm³)
 * @param {number} [params.massaBuc=700] Massa del buc buit mb (g)
 * @param {number} [params.capacitatTanc=400] Capacitat del tanc de llast Vt (cm³)
 * @param {number} [params.volumAiguaTanc] Volum d'aigua al tanc (cm³); si no es dona, es calcula amb fraccioTanc
 * @param {number} [params.fraccioTanc=0] Fracció d'ompliment x (0..1)
 * @param {number} [params.densitatLiquid=1.00] Densitat del líquid exterior i d'ompliment (g/cm³)
 * @param {number} [params.g=9.8]
 * @returns {object}
 */
export function estatSubmari(params = {}) {
  const {
    volumExterior = 1000,
    massaBuc = 700,
    capacitatTanc = 400,
    densitatLiquid = 1.0,
    g = 9.8
  } = params;

  const volAigua = typeof params.volumAiguaTanc === "number"
    ? Math.max(0, Math.min(capacitatTanc, params.volumAiguaTanc))
    : Math.max(0, Math.min(1, params.fraccioTanc ?? 0)) * capacitatTanc;

  const fraccioTanc = capacitatTanc > 0 ? netejaDecimal(volAigua / capacitatTanc, 6) : 0;
  const massaAiguaLlast = netejaDecimal(volAigua * densitatLiquid, 6);
  const massaTotal = netejaDecimal(massaBuc + massaAiguaLlast, 6);
  const densitatMitjana = netejaDecimal(massaTotal / volumExterior, 6);

  // Volum d'aigua al tanc necessari per a l'equilibri neutre: mb + dL * Veq = dL * Vext
  const volumEquilibri = densitatLiquid > 0
    ? netejaDecimal((densitatLiquid * volumExterior - massaBuc) / densitatLiquid, 4)
    : 0;
  const percentatgeEquilibri = capacitatTanc > 0
    ? netejaDecimal((volumEquilibri / capacitatTanc) * 100, 2)
    : 0;

  let comportament;
  if (iguals(densitatMitjana, densitatLiquid, 1e-4)) {
    comportament = "equilibri";
  } else if (densitatMitjana < densitatLiquid) {
    comportament = "puja";
  } else {
    comportament = "baixa";
  }

  const pes = massaAPes(massaTotal, g);
  const empenyimentMaxim = calculaEmpenyiment(densitatLiquid, volumExterior, g);
  const empenyiment = comportament === "puja" ? pes : empenyimentMaxim;
  const forcaNeta = netejaDecimal(empenyimentMaxim - pes, 6);

  return {
    volumExterior,
    massaBuc,
    capacitatTanc,
    volumAiguaTanc: netejaDecimal(volAigua, 4),
    fraccioTanc,
    percentatgeTanc: netejaDecimal(fraccioTanc * 100, 2),
    massaAiguaLlast,
    massaTotal,
    densitatMitjana,
    densitatLiquid,
    volumEquilibri,
    percentatgeEquilibri,
    comportament,
    equilibri: comportament === "equilibri",
    puja: comportament === "puja",
    baixa: comportament === "baixa",
    pes,
    empenyiment,
    empenyimentMaxim,
    forcaNeta
  };
}
