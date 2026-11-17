/* SPDX-License-Identifier: AGPL-3.0-or-later AND CC-BY-NC-SA-4.0 */
/**
 * Controlador principal del simulador Densitats.
 */

import { LIQUIDS, CATEGORIES, OBJECTES, EXPERIMENTS } from "./dades.js";
import { fmt, fmtNet, magnitudsObjecte, estatEquilibriLliure, estatDinamometre, G_TERRA } from "./fisica.js";
import { defsObjectes, dibuixaObjecteRealista } from "./objectes-svg.js";
import { renderBalancaSVG, renderProvetaSVG, renderTancSVG, midaVisualObjecte } from "./instruments-svg.js";

const MASSA_GOT = 120; // g
const CAPACITATS = [250, 500, 1000];
const CLAU_GUIA = "densitats:guia-vista";

const estat = {
  categoriaActiva: "tots",
  liquidId: "aigua",
  liquidPersonalitzatDensitat: 1.0,
  mostraForces: true,
  mostraResultats: true,
  revelats: new Set(),
  modePissarra: false,

  objecteSeleccionat: OBJECTES[0], // Bloc d'alumini per defecte
  objecteAnalitzat: OBJECTES[0],
  colocant: false, // s'ha tocat un objecte i s'espera que es toqui un instrument
  objecteCustom: {
    id: "custom",
    nom: "Objecte personalitzat",
    categoria: "personalitzat",
    forma: "custom_bloc",
    materialPersonalitzat: "alumini",
    massa: 200,
    volum: 100,
    descripcio: "Objecte creat a mida"
  },

  balancaObj: OBJECTES[0],
  gotBalanca: false,
  tara: 0,

  provetaObj: OBJECTES[0],
  provetaCap: 500,
  provetaV0: 200,
  varetaSubmergit: false,

  tancObj: OBJECTES[0],
  modeTanc: "dinamometre", // "dinamometre" | "lliure"
  immersioSlider: 100,
  posYAnim: null,
  velYAnim: 0
};

let animFrameId = null;
let zoomActual = 1;

const $ = (id) => document.getElementById(id);

const els = {
  selectLiquid: $("select-liquid"),
  customLiquidWrap: $("custom-liquid-wrap"),
  rangeLiquidDensity: $("range-liquid-density"),
  valLiquidDensity: $("val-liquid-density"),

  btnForces: $("btn-forces"),
  btnCalculs: $("btn-calculs"),
  icCalculs: $("ic-calculs"),
  txtCalculs: $("txt-calculs"),
  btnProjector: $("btn-projector"),
  btnReinicia: $("btn-reinicia"),
  btnAjuda: $("btn-ajuda"),

  catTabs: $("cat-tabs"),
  catGrid: $("cat-grid"),
  customObjPanel: $("custom-obj-panel"),
  customShape: $("custom-shape"),
  customMat: $("custom-mat"),
  customMassa: $("custom-massa"),
  customMassaVal: $("custom-massa-val"),
  customVolum: $("custom-volum"),
  customVolumVal: $("custom-volum-val"),
  btnUseCustom: $("btn-use-custom"),

  selectedThumb: $("selected-thumb"),
  selectedName: $("selected-name"),
  selectedDesc: $("selected-desc"),

  stageBalanca: $("stage-balanca"),
  btnGot: $("btn-got"),
  btnTara: $("btn-tara"),
  btnTreuBalanca: $("btn-treu-balanca"),

  stageProveta: $("stage-proveta"),
  selectProvetaCap: $("select-proveta-cap"),
  rangeV0: $("range-v0"),
  valV0: $("val-v0"),
  btnVareta: $("btn-vareta"),
  btnTreuProveta: $("btn-treu-proveta"),

  stageTanc: $("stage-tanc"),
  btnModeDin: $("btn-mode-din"),
  btnModeLliure: $("btn-mode-lliure"),
  btnTreuTanc: $("btn-treu-tanc"),
  dinamometreControls: $("dinamometre-controls"),
  lliureControls: $("lliure-controls"),
  lliureStatus: $("lliure-status"),
  rangeImmersio: $("range-immersio"),
  immersioLimit: $("immersio-limit"),
  valImmersio: $("val-immersio"),
  btnDeixaCaure: $("btn-deixa-caure"),

  summaryBar: $("summary-bar"),
  sumThumb: $("sum-thumb"),
  sumNom: $("sum-nom"),
  sumMassa: $("sum-massa"),
  sumVolum: $("sum-volum"),
  sumDensitat: $("sum-densitat"),
  sumPes: $("sum-pes"),
  sumEmp: $("sum-emp"),
  sumPap: $("sum-pap"),

  dragGhost: $("drag-ghost"),
  ajuda: $("ajuda"),
  ajudaTanca: $("ajuda-tanca"),
  expGrid: $("exp-grid"),
  btnGuia: $("btn-guia"),
  guiaCapa: $("guia-capa"),
  guiaBombolla: $("guia-bombolla"),
  guiaPas: $("guia-pas"),
  guiaTitol: $("guia-titol"),
  guiaText: $("guia-text"),
  guiaSalta: $("guia-salta"),
  guiaSeguent: $("guia-seguent")
};

const NOMS_ESTACIO = { balanca: "la balança", proveta: "la proveta", tanc: "el tanc" };

/* ===================== Escala de la pantalla =====================
   La interfície està dissenyada per a 1440 × 800 px útils. En pantalles més
   petites (portàtils de 1366 × 768, escalat del sistema al 125 % o 150 %) es
   redueix sencera, sense canviar la disposició. En mode pissarra la referència
   és més petita, de manera que tot es veu més gran. En mòbils, tauletes en
   vertical i pissarres verticals s'apila en una columna amb desplaçament. */
const BASE = { normal: [1440, 800], pissarra: [1280, 720] };
const ZOOM_MIN = 0.5;

function ajustaPantalla() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const root = document.documentElement;
  const apilat = w < 900 || (w < h && w < 1300);
  let z = 1;
  if (apilat) {
    z = estat.modePissarra ? Math.max(1, Math.min(1.5, w / 760)) : 1;
  } else {
    const [bw, bh] = estat.modePissarra ? BASE.pissarra : BASE.normal;
    z = Math.min(w / bw, h / bh);
    z = Math.min(estat.modePissarra ? 1.8 : 1, z);
    z = Math.max(ZOOM_MIN, Math.floor(z * 40) / 40);
  }
  zoomActual = z;
  root.style.setProperty("--z", String(z));
  root.classList.toggle("apilat", apilat);
}

/* ===================== Utilitats ===================== */
function liquidActual() {
  const base = LIQUIDS.find((l) => l.id === estat.liquidId) || LIQUIDS[0];
  if (base.id === "personalitzat") {
    return { ...base, densitat: estat.liquidPersonalitzatDensitat };
  }
  return base;
}

function amagat(clau) {
  return !estat.mostraResultats && !estat.revelats.has(clau);
}

function miniaturaSVG(obj, prefix, w = 48, h = 40) {
  return `
    <svg viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <defs>${defsObjectes(prefix)}</defs>
      ${dibuixaObjecteRealista(obj, w / 2, h / 2, w * 0.8, h * 0.8, prefix)}
    </svg>`;
}

function trobaObjecte(id) {
  if (id === "custom") return { ...estat.objecteCustom };
  return OBJECTES.find((o) => o.id === id) || null;
}

/* ===================== Catàleg ===================== */
function renderCataleg() {
  els.catTabs.innerHTML = CATEGORIES.map(
    (c) => `<button type="button" role="tab" aria-selected="${c.id === estat.categoriaActiva}" class="cat-tab ${c.id === estat.categoriaActiva ? "active" : ""}" data-cat="${c.id}">${c.nom}</button>`
  ).join("");

  if (estat.categoriaActiva === "personalitzat") {
    els.catGrid.classList.add("hidden");
    els.customObjPanel.classList.remove("hidden");
    return;
  }

  els.catGrid.classList.remove("hidden");
  els.customObjPanel.classList.add("hidden");

  const llista =
    estat.categoriaActiva === "tots" ? OBJECTES : OBJECTES.filter((o) => o.categoria === estat.categoriaActiva);

  els.catGrid.innerHTML = llista
    .map((obj) => {
      const sel = estat.objecteSeleccionat?.id === obj.id ? "selected" : "";
      const p = `cat-${obj.id}-`;
      return `
        <button type="button" class="obj-card ${sel}" data-obj-id="${obj.id}" title="${obj.descripcio}" aria-pressed="${Boolean(sel)}">
          <svg viewBox="0 0 60 48" aria-hidden="true">
            <defs>${defsObjectes(p)}</defs>
            ${dibuixaObjecteRealista(obj, 30, 24, 46, 38, p)}
          </svg>
          <span class="obj-card-name">${obj.nom}</span>
        </button>
      `;
    })
    .join("");
}

function marcaSeleccionatAlCataleg() {
  els.catGrid.querySelectorAll(".obj-card").forEach((c) => {
    const sel = c.dataset.objId === estat.objecteSeleccionat?.id;
    c.classList.toggle("selected", sel);
    c.setAttribute("aria-pressed", String(sel));
  });
}

function renderSeleccionat() {
  const obj = estat.objecteSeleccionat;
  if (!obj) {
    els.selectedThumb.innerHTML = "";
    els.selectedName.textContent = "Cap objecte triat";
    els.selectedDesc.textContent = "Toca o arrossega un objecte";
    return;
  }
  els.selectedThumb.innerHTML = miniaturaSVG(obj, "sel-");
  els.selectedName.textContent = obj.nom;
  els.selectedDesc.textContent = obj.descripcio;
}

/* ===================== Col·locar tocant l'instrument ===================== */
function setColocant(actiu) {
  estat.colocant = actiu && Boolean(estat.objecteSeleccionat);
  const nom = estat.objecteSeleccionat?.nom || "";
  document.querySelectorAll(".drop-zone").forEach((zona) => {
    zona.classList.toggle("can-drop", estat.colocant);
    const stage = zona.querySelector(".station-stage");
    if (estat.colocant) stage.dataset.colocar = `Toca aquí per posar-hi: ${nom}`;
    else delete stage.dataset.colocar;
  });
}

/* ===================== Instruments ===================== */
function renderBalanca() {
  const obj = estat.balancaObj;
  const brut = (estat.gotBalanca ? MASSA_GOT : 0) + (obj ? magnitudsObjecte(obj).massa : 0);
  const net = brut - estat.tara;
  els.stageBalanca.innerHTML = renderBalancaSVG({
    obj,
    massaMesurada: net,
    pesMesurat: Math.max(0, (net / 1000) * G_TERRA),
    tara: estat.tara,
    got: estat.gotBalanca,
    amagaPes: amagat("pes")
  });
  els.btnGot.classList.toggle("active", estat.gotBalanca);
  els.btnGot.setAttribute("aria-pressed", String(estat.gotBalanca));
}

/** Limita V₀ perquè l'objecte de la proveta no la faci vessar. */
function actualitzaRangV0() {
  const volObj = estat.provetaObj ? magnitudsObjecte(estat.provetaObj).volum : 0;
  let maxV0 = Math.min(Math.round(estat.provetaCap * 0.75), Math.floor((estat.provetaCap - volObj) / 25) * 25);
  maxV0 = Math.max(50, maxV0);
  els.rangeV0.max = String(maxV0);
  if (estat.provetaV0 > maxV0) estat.provetaV0 = maxV0;
  els.rangeV0.value = String(estat.provetaV0);
  els.valV0.textContent = `${estat.provetaV0} mL`;
}

function renderProveta() {
  actualitzaRangV0();
  const liq = liquidActual();
  const obj = estat.provetaObj;
  const eq = obj ? estatEquilibriLliure(obj, liq.densitat) : null;
  els.stageProveta.innerHTML = renderProvetaSVG({
    obj,
    liquid: liq,
    capacitatMl: estat.provetaCap,
    volumInicialMl: estat.provetaV0,
    varetaSubmergit: estat.varetaSubmergit,
    estatEquilibri: eq,
    amagaDelta: amagat("volum")
  });
  els.btnVareta.classList.toggle("active", estat.varetaSubmergit);
  els.btnVareta.setAttribute("aria-pressed", String(estat.varetaSubmergit));
}

function renderTanc() {
  const liq = liquidActual();
  const obj = estat.tancObj;
  // Un objecte que sura no es pot enfonsar més que el seu punt de flotació:
  // el control s'hi atura perquè, en tornar-lo a baixar, la corda es tensi de seguida
  if (obj && estat.modeTanc === "dinamometre") {
    const dObj = magnitudsObjecte(obj).densitat;
    if (dObj < liq.densitat) {
      const maxImm = (dObj / liq.densitat) * 100;
      if (estat.immersioSlider > maxImm) {
        estat.immersioSlider = maxImm;
        els.rangeImmersio.value = String(maxImm);
      }
    }
  }
  const estatDin = obj ? estatDinamometre(obj, liq.densitat, estat.immersioSlider / 100) : null;
  const estatLliure = obj ? estatEquilibriLliure(obj, liq.densitat) : null;

  els.stageTanc.innerHTML = renderTancSVG({
    obj,
    liquid: liq,
    modeTanc: estat.modeTanc,
    immersioSlider: estat.immersioSlider,
    posYAnim: estat.posYAnim,
    mostraForces: estat.mostraForces,
    estatDin,
    estatLliure,
    amaga: { pes: amagat("pes"), emp: amagat("emp"), pap: amagat("pap"), volum: amagat("volum") }
  });

  // Control d'immersió: marca fins on s'enfonsa sol un objecte que sura
  const fEq = estatDin && estatDin.densitat < liq.densitat ? estatDin.densitat / liq.densitat : null;
  if (estat.modeTanc === "dinamometre" && fEq !== null) {
    els.immersioLimit.classList.remove("hidden");
    els.immersioLimit.style.left = `${(fEq * 100).toFixed(1)}%`;
  } else {
    els.immersioLimit.classList.add("hidden");
  }
  if (fEq !== null && estatDin && !estatDin.cordaTensa && estat.immersioSlider > 1) {
    els.valImmersio.textContent = `${Math.round(fEq * 100)} % (sura)`;
  } else {
    els.valImmersio.textContent = `${estat.immersioSlider} %`;
  }

  if (estat.modeTanc === "lliure") {
    if (!obj) {
      els.lliureStatus.textContent = "Posa un objecte al tanc per veure si sura o s'enfonsa.";
    } else if (estatLliure.sura) {
      const pct = Math.round(estatLliure.fraccioSubmergida * 100);
      els.lliureStatus.textContent = `Sura! En queda un ${pct} % dins ${liq.nom.toLowerCase()}.`;
    } else if (estatLliure.equilibriNeutre) {
      els.lliureStatus.textContent = "Ni sura ni s'enfonsa: té la mateixa densitat que el líquid.";
    } else {
      els.lliureStatus.textContent = "S'enfonsa fins al fons: és més dens que el líquid.";
    }
  }
}

/* ===================== Barra de resultats ===================== */
function celaValor(el, valor, clau) {
  if (clau && amagat(clau)) {
    el.innerHTML = `<button type="button" class="btn-revela" data-revela="${clau}" title="Mostra aquest resultat">
      <svg class="ic" aria-hidden="true"><use href="#i-ull"/></svg>Revela</button>`;
  } else {
    el.textContent = valor;
  }
}

function celaPista(el, text) {
  el.innerHTML = `<span class="sum-pista">${text}</span>`;
}

function renderResum() {
  const obj = estat.objecteAnalitzat || estat.objecteSeleccionat;
  if (!obj) {
    els.sumThumb.innerHTML = "";
    els.sumNom.textContent = "—";
    [els.sumMassa, els.sumVolum, els.sumDensitat, els.sumPes, els.sumEmp, els.sumPap].forEach((el) => {
      el.textContent = "—";
    });
    return;
  }

  els.sumThumb.innerHTML = miniaturaSVG(obj, "sum-");
  els.sumNom.textContent = obj.nom;

  const liq = liquidActual();
  const mag = magnitudsObjecte(obj);
  const mateix = (o) => Boolean(o) && o.id === obj.id;

  const massaMesurada = mateix(estat.balancaObj);
  let volumMesurat = false;
  let suraProveta = false;
  if (mateix(estat.provetaObj)) {
    const eq = estatEquilibriLliure(estat.provetaObj, liq.densitat);
    suraProveta = eq.sura;
    volumMesurat = estat.varetaSubmergit || !eq.sura;
  }
  const alTanc = mateix(estat.tancObj);

  // Massa
  if (massaMesurada) celaValor(els.sumMassa, `${fmtNet(mag.massa, 1)} g`);
  else celaPista(els.sumMassa, "Posa'l a la balança");

  // Volum
  if (volumMesurat) celaValor(els.sumVolum, `${fmtNet(mag.volum, 1)} cm³`, "volum");
  else if (suraProveta) celaPista(els.sumVolum, "Sura: prem «Enfonsa'l»");
  else celaPista(els.sumVolum, "Posa'l a la proveta");

  // Densitat
  if (massaMesurada && volumMesurat) celaValor(els.sumDensitat, `${fmt(mag.densitat, 2)} g/cm³`, "densitat");
  else celaPista(els.sumDensitat, "Cal mesurar m i V");

  // Pes a l'aire
  if (massaMesurada || alTanc) celaValor(els.sumPes, `${fmt(mag.pes, 2)} N`, "pes");
  else celaPista(els.sumPes, "Cal mesurar la massa");

  // Empenyiment i pes dins el líquid
  if (!alTanc) {
    celaPista(els.sumEmp, "Posa'l al tanc");
    celaPista(els.sumPap, "Posa'l al tanc");
  } else if (estat.modeTanc === "dinamometre") {
    const din = estatDinamometre(estat.tancObj, liq.densitat, estat.immersioSlider / 100);
    celaValor(els.sumEmp, `${fmt(din.empenyiment, 2)} N`, "emp");
    celaValor(els.sumPap, din.cordaTensa ? `${fmt(din.tensio, 2)} N` : "0,00 N (sura)", "pap");
  } else {
    const ll = estatEquilibriLliure(estat.tancObj, liq.densitat);
    celaValor(els.sumEmp, `${fmt(ll.empenyiment, 2)} N`, "emp");
    celaValor(els.sumPap, ll.sura || ll.equilibriNeutre ? "0,00 N (sura)" : `${fmt(ll.normal, 2)} N (al fons)`, "pap");
  }
}

function renderTot() {
  renderBalanca();
  renderProveta();
  renderTanc();
  renderResum();
}

/* ===================== Animació de flotació lliure ===================== */
function calculaYEquilibriTanc(obj) {
  const liq = liquidActual();
  const eq = estatEquilibriLliure(obj, liq.densitat);
  const { h } = midaVisualObjecte(obj, 1.32);
  const baseWaterY = 216;
  const risePx = Math.min(34, (eq.volumSubmergit / 100) * 9);
  const waterY = baseWaterY - risePx;
  const tankBot = 340;

  if (!eq.sura) {
    return tankBot - h / 2 - 4;
  }
  return waterY + (eq.fraccioSubmergida - 0.5) * h;
}

function iniciaAnimacioLliure(desDeAire = false) {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  if (estat.modeTanc !== "lliure" || !estat.tancObj) {
    estat.posYAnim = null;
    renderTanc();
    return;
  }

  if (desDeAire || estat.posYAnim === null) {
    estat.posYAnim = 132;
    estat.velYAnim = 0;
  }

  let lastTime = performance.now();
  function pas(now) {
    const dt = Math.min(0.04, (now - lastTime) / 1000);
    lastTime = now;

    if (!estat.tancObj || estat.modeTanc !== "lliure") {
      animFrameId = null;
      return;
    }

    const targetY = calculaYEquilibriTanc(estat.tancObj);
    const diff = targetY - estat.posYAnim;
    // Molla amortida per reproduir la caiguda i la frenada dins el líquid
    const k = 28;
    const damp = 7.2;
    const acc = k * diff - damp * estat.velYAnim;
    estat.velYAnim += acc * dt;
    estat.posYAnim += estat.velYAnim * dt;

    renderTanc();

    if (Math.abs(diff) < 0.35 && Math.abs(estat.velYAnim) < 0.8) {
      estat.posYAnim = targetY;
      estat.velYAnim = 0;
      renderTanc();
      animFrameId = null;
      return;
    }
    animFrameId = requestAnimationFrame(pas);
  }

  animFrameId = requestAnimationFrame(pas);
}

/* ===================== Accions ===================== */
function canviaObjecteAnalitzat(obj) {
  if (estat.objecteAnalitzat?.id !== obj.id) estat.revelats.clear();
  estat.objecteAnalitzat = obj;
}

function enviaObjecteA(target, obj = estat.objecteSeleccionat) {
  if (!obj) return;
  if (target === "balanca" || target === "tots") {
    estat.balancaObj = obj;
  }
  if (target === "proveta" || target === "tots") {
    estat.provetaObj = obj;
    estat.varetaSubmergit = false;
    // Tria una proveta prou gran perquè l'objecte no la faci vessar
    const vol = magnitudsObjecte(obj).volum;
    if (estat.provetaCap - vol < 50) {
      estat.provetaCap = CAPACITATS.find((c) => c - vol >= 50) || 1000;
      els.selectProvetaCap.value = String(estat.provetaCap);
    }
  }
  if (target === "tanc" || target === "tots") {
    estat.tancObj = obj;
    if (estat.modeTanc === "lliure") {
      iniciaAnimacioLliure(true);
    }
  }
  canviaObjecteAnalitzat(obj);
  setColocant(false);
  renderTot();
}

function seleccionaObjecte(obj) {
  const jaEra = estat.objecteSeleccionat?.id === obj.id;
  estat.objecteSeleccionat = obj;
  marcaSeleccionatAlCataleg();
  renderSeleccionat();
  // Tocar l'objecte activa la col·locació; tornar-lo a tocar la cancel·la
  setColocant(!(jaEra && estat.colocant));
}

function ompleLiquids() {
  els.selectLiquid.innerHTML = LIQUIDS.map(
    (l) => `<option value="${l.id}">${l.nom}${l.id === "personalitzat" ? "" : ` (${fmt(l.densitat, 2)} g/cm³)`}</option>`
  ).join("");
  els.selectLiquid.value = estat.liquidId;
}

function canviaLiquid(id) {
  estat.liquidId = id;
  els.selectLiquid.value = id;
  els.customLiquidWrap.classList.toggle("hidden", id !== "personalitzat");
  if (estat.modeTanc === "lliure" && estat.tancObj) iniciaAnimacioLliure(false);
  renderTot();
}

function posaModeTanc(mode) {
  estat.modeTanc = mode;
  const din = mode === "dinamometre";
  els.btnModeDin.classList.toggle("active", din);
  els.btnModeLliure.classList.toggle("active", !din);
  els.btnModeDin.setAttribute("aria-pressed", String(din));
  els.btnModeLliure.setAttribute("aria-pressed", String(!din));
  els.dinamometreControls.classList.toggle("hidden", !din);
  els.lliureControls.classList.toggle("hidden", din);
  if (din) {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    animFrameId = null;
    renderTot();
  } else {
    iniciaAnimacioLliure(true);
    renderResum();
  }
}

function posaImmersio(valor) {
  estat.immersioSlider = valor;
  els.rangeImmersio.value = String(valor);
  renderTanc();
  renderResum();
}

function actualitzaBotoResultats() {
  const amagant = !estat.mostraResultats;
  els.btnCalculs.classList.toggle("active", amagant);
  els.btnCalculs.setAttribute("aria-pressed", String(amagant));
  els.txtCalculs.textContent = amagant ? "Mostra resultats" : "Amaga resultats";
  els.icCalculs.setAttribute("href", amagant ? "#i-ull" : "#i-ull-tancat");
}

async function commutaPissarra() {
  estat.modePissarra = !estat.modePissarra;
  document.documentElement.classList.toggle("mode-pissarra", estat.modePissarra);
  els.btnProjector.classList.toggle("active", estat.modePissarra);
  els.btnProjector.setAttribute("aria-pressed", String(estat.modePissarra));
  try {
    if (estat.modePissarra && !document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    } else if (!estat.modePissarra && document.fullscreenElement) {
      await document.exitFullscreen();
    }
  } catch {
    /* Si el navegador no permet la pantalla completa, el mode pissarra funciona igualment */
  }
  ajustaPantalla();
}

/* ===================== Arrossegar amb ratolí, dit o llapis ===================== */
let arrossega = null;
let ignoraClic = false;

function zonaSota(x, y) {
  const el = document.elementFromPoint(x, y);
  return el ? el.closest(".drop-zone") : null;
}

function mouFantasma(x, y) {
  const g = els.dragGhost;
  g.style.transform = `translate(${x / zoomActual - 37}px, ${y / zoomActual - 30}px)`;
}

function netejaArrossegament() {
  document.querySelectorAll(".drop-zone.drag-over").forEach((z) => z.classList.remove("drag-over"));
  els.dragGhost.classList.add("hidden");
  document.body.classList.remove("arrossegant");
  arrossega = null;
}

function inicialitzaArrossegament() {
  els.catGrid.addEventListener("pointerdown", (e) => {
    const card = e.target.closest(".obj-card");
    if (!card || (e.pointerType === "mouse" && e.button !== 0)) return;
    arrossega = { id: card.dataset.objId, x0: e.clientX, y0: e.clientY, actiu: false, pid: e.pointerId, tipus: e.pointerType };
  });

  window.addEventListener(
    "pointermove",
    (e) => {
      if (!arrossega || e.pointerId !== arrossega.pid) return;
      const dx = e.clientX - arrossega.x0;
      const dy = e.clientY - arrossega.y0;
      if (!arrossega.actiu) {
        if (Math.hypot(dx, dy) < 10) return;
        // Amb el dit, un moviment vertical és per desplaçar el catàleg
        if (arrossega.tipus !== "mouse" && Math.abs(dy) > Math.abs(dx) * 1.2) {
          arrossega = null;
          return;
        }
        const obj = trobaObjecte(arrossega.id);
        if (!obj) {
          arrossega = null;
          return;
        }
        arrossega.actiu = true;
        estat.objecteSeleccionat = obj;
        marcaSeleccionatAlCataleg();
        renderSeleccionat();
        setColocant(false);
        els.dragGhost.innerHTML = miniaturaSVG(obj, "ghost-", 62, 50);
        els.dragGhost.classList.remove("hidden");
        document.body.classList.add("arrossegant");
      }
      e.preventDefault();
      mouFantasma(e.clientX, e.clientY);
      const zona = zonaSota(e.clientX, e.clientY);
      document.querySelectorAll(".drop-zone").forEach((z) => z.classList.toggle("drag-over", z === zona));
    },
    { passive: false }
  );

  window.addEventListener("pointerup", (e) => {
    if (!arrossega || e.pointerId !== arrossega.pid) return;
    if (arrossega.actiu) {
      const zona = zonaSota(e.clientX, e.clientY);
      const obj = trobaObjecte(arrossega.id);
      ignoraClic = true;
      setTimeout(() => {
        ignoraClic = false;
      }, 0);
      netejaArrossegament();
      if (zona && obj) enviaObjecteA(zona.dataset.station, obj);
    } else {
      arrossega = null;
    }
  });

  window.addEventListener("pointercancel", netejaArrossegament);
}

/* ===================== Ajuda ===================== */
const prefixa = (svg, pre) => svg.replace(/(id="|url\(#|href="#)(bal-|prov-|tanc-)/g, `$1${pre}$2`);

function dibuixosAjuda() {
  const aigua = LIQUIDS[0];
  const alumini = OBJECTES[0];
  const pi = OBJECTES.find((o) => o.id === "pi");

  $("dib-balanca").innerHTML = prefixa(
    renderBalancaSVG({ obj: alumini, massaMesurada: 270, pesMesurat: 2.646, got: false }),
    "aj-"
  );
  $("dib-proveta").innerHTML = prefixa(
    renderProvetaSVG({
      obj: alumini,
      liquid: aigua,
      capacitatMl: 500,
      volumInicialMl: 200,
      estatEquilibri: estatEquilibriLliure(alumini, 1)
    }),
    "aj-"
  );
  $("dib-tanc").innerHTML = prefixa(
    renderTancSVG({
      obj: alumini,
      liquid: aigua,
      modeTanc: "dinamometre",
      immersioSlider: 100,
      mostraForces: true,
      estatDin: estatDinamometre(alumini, 1, 1),
      estatLliure: estatEquilibriLliure(alumini, 1)
    }),
    "aj-"
  );

  // Pas 1: targetes del catàleg amb una mà que en toca una
  const p1 = (o, x, sel, nom) => `
    <g transform="translate(${x},22)">
      <rect width="66" height="62" rx="9" fill="${sel ? "#E0F2FE" : "#F8FAFC"}" stroke="${sel ? "#0284C7" : "#CBD5E1"}" stroke-width="${sel ? 2.2 : 1.2}"/>
      ${dibuixaObjecteRealista(o, 33, 28, 40, 32, `p1${x}-`)}
      <text x="33" y="54" text-anchor="middle" font-size="8.5" font-weight="700" fill="#0F172A">${nom}</text>
    </g>`;
  $("dib-pas-1").innerHTML = `
    <svg viewBox="0 0 240 128">
      <defs>${defsObjectes("p140-")}${defsObjectes("p1120-")}</defs>
      ${p1(alumini, 40, false, "Alumini")}${p1(pi, 120, true, "Pi")}
      <use href="#i-ma" x="150" y="62" width="44" height="44" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.6"/>
    </svg>`;

  // Pas 2: objecte que viatja cap als instruments
  $("dib-pas-2").innerHTML = `
    <svg viewBox="0 0 240 128">
      <defs>${defsObjectes("p2-")}</defs>
      ${dibuixaObjecteRealista(pi, 36, 64, 44, 36, "p2-")}
      <path d="M 66 64 C 100 30, 130 30, 150 46" fill="none" stroke="#0284C7" stroke-width="2.6" stroke-dasharray="6 5"/>
      <path d="M 143 38 L 152 47 L 140 50" fill="none" stroke="#0284C7" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
      <g fill="#E0F2FE" stroke="#0284C7" stroke-width="1.8">
        <rect x="150" y="52" width="70" height="56" rx="10" stroke-dasharray="5 4"/>
      </g>
      <g transform="translate(160,58)" fill="none" stroke="#0369A1" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <use href="#i-balanca" width="22" height="22"/>
        <use href="#i-proveta" x="24" width="22" height="22"/>
        <use href="#i-tanc" x="12" y="22" width="22" height="22"/>
      </g>
    </svg>`;

  // Pas 3: lectures dels instruments
  $("dib-pas-3").innerHTML = `
    <svg viewBox="0 0 240 128" font-family="'JetBrains Mono', ui-monospace, monospace">
      <rect x="10" y="20" width="104" height="40" rx="7" fill="#0F172A"/>
      <text x="104" y="47" text-anchor="end" font-size="19" font-weight="700" fill="#34D399">100,0 g</text>
      <text x="16" y="74" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700" fill="#475569">massa</text>
      <rect x="126" y="20" width="104" height="40" rx="7" fill="#0F172A"/>
      <text x="220" y="47" text-anchor="end" font-size="19" font-weight="700" fill="#38BDF8">300 mL</text>
      <text x="132" y="74" font-family="Segoe UI, sans-serif" font-size="11" font-weight="700" fill="#475569">nivell final</text>
      <text x="120" y="108" text-anchor="middle" font-size="15" font-weight="800" fill="#0369A1">V = 300 − 200 = 100 mL</text>
    </svg>`;
}

function renderExperiments() {
  els.expGrid.innerHTML = EXPERIMENTS.map((ex) => {
    const obj = OBJECTES.find((o) => o.id === ex.objecte);
    const liq = LIQUIDS.find((l) => l.id === ex.liquid);
    return `
      <article class="exp-card">
        <div class="exp-vis">
          ${miniaturaSVG(obj, `exp-${ex.id}-`, 56, 46)}
          <span class="exp-liquid"><span class="exp-gota" style="background:${liq.colorBot}"></span>${liq.nom}</span>
        </div>
        <h3>${ex.titol}</h3>
        <p class="exp-pregunta">${ex.pregunta}</p>
        <p>${ex.passos}</p>
        <button type="button" class="btn-primary" data-exp="${ex.id}">Prepara'l</button>
      </article>`;
  }).join("");
}

function preparaExperiment(id) {
  const ex = EXPERIMENTS.find((e) => e.id === id);
  if (!ex) return;
  const obj = OBJECTES.find((o) => o.id === ex.objecte);
  tancaAjuda();
  estat.liquidId = ex.liquid;
  els.selectLiquid.value = ex.liquid;
  els.customLiquidWrap.classList.add("hidden");
  estat.categoriaActiva = "tots";
  estat.objecteSeleccionat = obj;
  renderCataleg();
  renderSeleccionat();
  estat.gotBalanca = false;
  estat.tara = 0;
  if (typeof ex.immersio === "number") {
    estat.immersioSlider = ex.immersio;
    els.rangeImmersio.value = String(ex.immersio);
  }
  estat.modeTanc = ex.mode;
  enviaObjecteA("tots", obj);
  posaModeTanc(ex.mode);
}

function obreAjuda(tab = "com", instrument = null) {
  canviaPestanyaAjuda(tab);
  document.querySelectorAll(".inst-ajuda").forEach((d) => d.classList.toggle("destacat", d.dataset.inst === instrument));
  if (!els.ajuda.open) els.ajuda.showModal();
  if (instrument) {
    const d = document.querySelector(`.inst-ajuda[data-inst="${instrument}"]`);
    d?.scrollIntoView({ block: "center" });
  } else {
    els.ajuda.querySelector(".ajuda-cos").scrollTop = 0;
  }
}

function tancaAjuda() {
  if (els.ajuda.open) els.ajuda.close();
}

function canviaPestanyaAjuda(tab) {
  document.querySelectorAll(".ajuda-tab").forEach((b) => {
    const actiu = b.dataset.tab === tab;
    b.classList.toggle("active", actiu);
    b.setAttribute("aria-selected", String(actiu));
  });
  document.querySelectorAll(".ajuda-panell").forEach((p) => p.classList.toggle("hidden", p.dataset.panell !== tab));
}

/* ===================== Guia ràpida sobre la pantalla ===================== */
const PASSOS_GUIA = [
  {
    sel: ".catalog-panel",
    titol: "Tria un objecte",
    text: "Toca qualsevol objecte del catàleg. Les pestanyes de dalt els ordenen per tipus."
  },
  {
    sel: ".instruments-grid",
    titol: "Posa'l a un instrument",
    text: "Després toca l'instrument on el vols posar, o arrossega-hi l'objecte. El botó «Als 3» el posa a tots alhora."
  },
  {
    sel: ".summary-bar",
    titol: "Llegeix els resultats",
    text: "Aquí apareixen la massa, el volum i la densitat a mesura que els mesures amb cada instrument."
  },
  {
    sel: "#btn-ajuda",
    titol: "Ajuda sempre a mà",
    text: "Aquí trobaràs les instruccions completes, com funciona cada instrument i experiments preparats."
  }
];
let pasGuia = -1;

function factorRect() {
  // Converteix les coordenades de getBoundingClientRect a px de CSS dins l'escala
  const prova = document.createElement("div");
  prova.style.cssText = "position:fixed;left:0;top:0;width:100px;height:1px;visibility:hidden";
  document.body.appendChild(prova);
  const k = prova.getBoundingClientRect().width / 100 || 1;
  prova.remove();
  return k;
}

function mostraPasGuia(i) {
  document.querySelectorAll(".guia-focus").forEach((el) => el.classList.remove("guia-focus"));
  if (i >= PASSOS_GUIA.length) {
    acabaGuia();
    return;
  }
  pasGuia = i;
  const pas = PASSOS_GUIA[i];
  const target = document.querySelector(pas.sel);
  target.classList.add("guia-focus");
  target.scrollIntoView({ block: "nearest" });

  els.guiaPas.textContent = `${i + 1} de ${PASSOS_GUIA.length}`;
  els.guiaTitol.textContent = pas.titol;
  els.guiaText.textContent = pas.text;
  els.guiaSeguent.textContent = i === PASSOS_GUIA.length - 1 ? "Comença!" : "Següent";
  els.guiaCapa.classList.remove("hidden");
  els.guiaBombolla.classList.remove("hidden");

  // Col·loca la bombolla al costat de l'element, dins la pantalla
  const k = factorRect();
  const r = target.getBoundingClientRect();
  const vw = window.innerWidth / k;
  const vh = window.innerHeight / k;
  const rect = { left: r.left / k, top: r.top / k, right: r.right / k, bottom: r.bottom / k };
  const b = els.guiaBombolla;
  const bw = b.offsetWidth;
  const bh = b.offsetHeight;
  let x;
  let y;
  if (rect.right + 16 + bw < vw) {
    x = rect.right + 16;
    y = rect.top + 20;
  } else if (rect.bottom + 16 + bh < vh) {
    x = rect.left + 20;
    y = rect.bottom + 16;
  } else if (rect.top - 16 - bh > 0) {
    x = rect.left + 20;
    y = rect.top - 16 - bh;
  } else {
    x = rect.left + 24;
    y = rect.top + 24;
  }
  x = Math.max(12, Math.min(vw - bw - 12, x));
  y = Math.max(12, Math.min(vh - bh - 12, y));
  b.style.left = `${x}px`;
  b.style.top = `${y}px`;
  els.guiaSeguent.focus();
}

function iniciaGuia() {
  tancaAjuda();
  mostraPasGuia(0);
}

function acabaGuia() {
  pasGuia = -1;
  document.querySelectorAll(".guia-focus").forEach((el) => el.classList.remove("guia-focus"));
  els.guiaCapa.classList.add("hidden");
  els.guiaBombolla.classList.add("hidden");
  try {
    localStorage.setItem(CLAU_GUIA, "1");
  } catch {
    /* sense emmagatzematge: la guia tornarà a sortir la propera vegada */
  }
}

/* ===================== Esdeveniments ===================== */
function inicialitzaEvents() {
  // Líquid
  els.selectLiquid.addEventListener("change", (e) => canviaLiquid(e.target.value));
  els.rangeLiquidDensity.addEventListener("input", (e) => {
    estat.liquidPersonalitzatDensitat = parseFloat(e.target.value);
    els.valLiquidDensity.textContent = `${fmt(estat.liquidPersonalitzatDensitat, 2)} g/cm³`;
    if (estat.modeTanc === "lliure" && estat.tancObj) iniciaAnimacioLliure(false);
    renderTot();
  });

  // Opcions de la classe
  els.btnForces.addEventListener("click", () => {
    estat.mostraForces = !estat.mostraForces;
    els.btnForces.classList.toggle("active", estat.mostraForces);
    els.btnForces.setAttribute("aria-pressed", String(estat.mostraForces));
    renderTanc();
  });

  els.btnCalculs.addEventListener("click", () => {
    estat.mostraResultats = !estat.mostraResultats;
    estat.revelats.clear();
    actualitzaBotoResultats();
    renderTot();
  });

  els.summaryBar.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-revela]");
    if (!btn) return;
    estat.revelats.add(btn.dataset.revela);
    renderTot();
  });

  els.btnProjector.addEventListener("click", commutaPissarra);
  document.addEventListener("fullscreenchange", () => {
    // Si se surt de la pantalla completa amb Esc, també se surt del mode pissarra
    if (!document.fullscreenElement && estat.modePissarra) commutaPissarra();
  });

  els.btnReinicia.addEventListener("click", () => {
    estat.balancaObj = null;
    estat.gotBalanca = false;
    estat.tara = 0;
    estat.provetaObj = null;
    estat.varetaSubmergit = false;
    estat.tancObj = null;
    estat.posYAnim = null;
    estat.revelats.clear();
    setColocant(false);
    renderTot();
  });

  // Catàleg
  els.catTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-tab");
    if (!btn) return;
    estat.categoriaActiva = btn.dataset.cat;
    renderCataleg();
  });

  els.catGrid.addEventListener("click", (e) => {
    if (ignoraClic) return;
    const card = e.target.closest(".obj-card");
    if (!card) return;
    const obj = trobaObjecte(card.dataset.objId);
    if (obj) seleccionaObjecte(obj);
  });

  // Tocar un instrument mentre s'està col·locant un objecte
  document.querySelectorAll(".drop-zone").forEach((zona) => {
    zona.querySelector(".station-stage").addEventListener("click", () => {
      if (estat.colocant) enviaObjecteA(zona.dataset.station);
    });
  });

  document.querySelectorAll(".btn-send").forEach((btn) => {
    btn.addEventListener("click", () => enviaObjecteA(btn.dataset.target));
  });

  // Objecte personalitzat
  const actualitzaCustom = () => {
    estat.objecteCustom.forma = els.customShape.value;
    estat.objecteCustom.materialPersonalitzat = els.customMat.value;
    estat.objecteCustom.massa = parseFloat(els.customMassa.value);
    estat.objecteCustom.volum = parseFloat(els.customVolum.value);
    els.customMassaVal.textContent = `${estat.objecteCustom.massa} g`;
    els.customVolumVal.textContent = `${estat.objecteCustom.volum} cm³`;
    if (estat.objecteSeleccionat?.id === "custom") {
      const nou = () => ({ ...estat.objecteCustom });
      estat.objecteSeleccionat = nou();
      renderSeleccionat();
      if (estat.balancaObj?.id === "custom") estat.balancaObj = nou();
      if (estat.provetaObj?.id === "custom") estat.provetaObj = nou();
      if (estat.tancObj?.id === "custom") estat.tancObj = nou();
      if (estat.objecteAnalitzat?.id === "custom") estat.objecteAnalitzat = nou();
      if (estat.modeTanc === "lliure" && estat.tancObj?.id === "custom") iniciaAnimacioLliure(false);
      renderTot();
    }
  };
  els.customShape.addEventListener("change", actualitzaCustom);
  els.customMat.addEventListener("change", actualitzaCustom);
  els.customMassa.addEventListener("input", actualitzaCustom);
  els.customVolum.addEventListener("input", actualitzaCustom);
  els.btnUseCustom.addEventListener("click", () => {
    estat.objecteSeleccionat = { ...estat.objecteCustom };
    renderSeleccionat();
    enviaObjecteA("tots", estat.objecteSeleccionat);
  });

  // Balança
  els.btnGot.addEventListener("click", () => {
    estat.gotBalanca = !estat.gotBalanca;
    renderBalanca();
  });
  els.btnTara.addEventListener("click", () => {
    const brut = (estat.gotBalanca ? MASSA_GOT : 0) + (estat.balancaObj ? magnitudsObjecte(estat.balancaObj).massa : 0);
    estat.tara = brut;
    renderBalanca();
  });
  els.btnTreuBalanca.addEventListener("click", () => {
    estat.balancaObj = null;
    renderTot();
  });

  // Proveta
  els.selectProvetaCap.addEventListener("change", (e) => {
    estat.provetaCap = parseInt(e.target.value, 10);
    renderProveta();
  });
  els.rangeV0.addEventListener("input", (e) => {
    estat.provetaV0 = parseInt(e.target.value, 10);
    renderProveta();
  });
  els.btnVareta.addEventListener("click", () => {
    estat.varetaSubmergit = !estat.varetaSubmergit;
    renderProveta();
    renderResum();
  });
  els.btnTreuProveta.addEventListener("click", () => {
    estat.provetaObj = null;
    estat.varetaSubmergit = false;
    renderTot();
  });

  // Tanc
  els.btnModeDin.addEventListener("click", () => posaModeTanc("dinamometre"));
  els.btnModeLliure.addEventListener("click", () => posaModeTanc("lliure"));
  els.rangeImmersio.addEventListener("input", (e) => posaImmersio(parseInt(e.target.value, 10)));
  document.querySelectorAll("[data-imm]").forEach((btn) => {
    btn.addEventListener("click", () => posaImmersio(parseInt(btn.dataset.imm, 10)));
  });
  els.btnDeixaCaure.addEventListener("click", () => iniciaAnimacioLliure(true));
  els.btnTreuTanc.addEventListener("click", () => {
    estat.tancObj = null;
    estat.posYAnim = null;
    renderTot();
  });

  // Ajuda
  els.btnAjuda.addEventListener("click", () => obreAjuda("com"));
  els.ajudaTanca.addEventListener("click", tancaAjuda);
  els.ajuda.addEventListener("click", (e) => {
    if (e.target === els.ajuda) tancaAjuda(); // clic al fons fosc
    const tab = e.target.closest(".ajuda-tab");
    if (tab) canviaPestanyaAjuda(tab.dataset.tab);
    const exp = e.target.closest("[data-exp]");
    if (exp) preparaExperiment(exp.dataset.exp);
  });
  document.querySelectorAll("[data-ajuda]").forEach((btn) => {
    btn.addEventListener("click", () => obreAjuda("instruments", btn.dataset.ajuda));
  });
  els.btnGuia.addEventListener("click", iniciaGuia);
  els.guiaSeguent.addEventListener("click", () => mostraPasGuia(pasGuia + 1));
  els.guiaSalta.addEventListener("click", acabaGuia);
  els.guiaCapa.addEventListener("click", acabaGuia);

  // Teclat
  document.addEventListener("keydown", (e) => {
    const escrivint = e.target.matches("input, select, textarea");
    if (e.key === "Escape") {
      if (pasGuia >= 0) acabaGuia();
      if (estat.colocant) setColocant(false);
    } else if (e.key === "?" && !escrivint && !els.ajuda.open) {
      e.preventDefault();
      obreAjuda("com");
    }
  });

  window.addEventListener("resize", () => {
    ajustaPantalla();
    if (pasGuia >= 0) mostraPasGuia(pasGuia);
  });
}

/* ===================== Arrencada ===================== */
ajustaPantalla();
ompleLiquids();
renderCataleg();
renderSeleccionat();
actualitzaBotoResultats();
inicialitzaEvents();
inicialitzaArrossegament();
dibuixosAjuda();
renderExperiments();
els.rangeImmersio.value = String(estat.immersioSlider);
renderTot();

let guiaVista = false;
try {
  guiaVista = localStorage.getItem(CLAU_GUIA) === "1";
} catch {
  guiaVista = false;
}
if (!guiaVista) setTimeout(iniciaGuia, 400);
