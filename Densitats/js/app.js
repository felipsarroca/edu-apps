/* SPDX-License-Identifier: AGPL-3.0-or-later AND CC-BY-NC-SA-4.0 */
/**
 * Controlador principal del simulador Densitats.
 */

import { LIQUIDS, CATEGORIES, OBJECTES } from "./dades.js";
import { fmt, fmtNet, magnitudsObjecte, estatEquilibriLliure, estatDinamometre } from "./fisica.js";
import { defsObjectes, dibuixaObjecteRealista } from "./objectes-svg.js";
import { renderBalancaSVG, renderProvetaSVG, renderTancSVG, midaVisualObjecte } from "./instruments-svg.js";

const estat = {
  categoriaActiva: "tots",
  liquidId: "aigua",
  liquidPersonalitzatDensitat: 1.00,
  mostraForces: true,
  mostraCalculs: true,
  modePissarra: false,

  objecteSeleccionat: OBJECTES[0], // Bloc d'alumini per defecte
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

// Elements del DOM
const els = {
  selectLiquid: document.getElementById("select-liquid"),
  customLiquidWrap: document.getElementById("custom-liquid-wrap"),
  rangeLiquidDensity: document.getElementById("range-liquid-density"),
  valLiquidDensity: document.getElementById("val-liquid-density"),

  btnForces: document.getElementById("btn-forces"),
  btnCalculs: document.getElementById("btn-calculs"),
  btnProjector: document.getElementById("btn-projector"),
  btnReinicia: document.getElementById("btn-reinicia"),

  catTabs: document.getElementById("cat-tabs"),
  catGrid: document.getElementById("cat-grid"),
  customObjPanel: document.getElementById("custom-obj-panel"),
  customShape: document.getElementById("custom-shape"),
  customMat: document.getElementById("custom-mat"),
  customMassa: document.getElementById("custom-massa"),
  customMassaVal: document.getElementById("custom-massa-val"),
  customVolum: document.getElementById("custom-volum"),
  customVolumVal: document.getElementById("custom-volum-val"),
  btnUseCustom: document.getElementById("btn-use-custom"),

  selectedThumb: document.getElementById("selected-thumb"),
  selectedName: document.getElementById("selected-name"),
  selectedDesc: document.getElementById("selected-desc"),

  stageBalanca: document.getElementById("stage-balanca"),
  btnTara: document.getElementById("btn-tara"),
  btnTreuBalanca: document.getElementById("btn-treu-balanca"),

  stageProveta: document.getElementById("stage-proveta"),
  selectProvetaCap: document.getElementById("select-proveta-cap"),
  rangeV0: document.getElementById("range-v0"),
  valV0: document.getElementById("val-v0"),
  btnVareta: document.getElementById("btn-vareta"),
  btnTreuProveta: document.getElementById("btn-treu-proveta"),

  stageTanc: document.getElementById("stage-tanc"),
  btnModeDin: document.getElementById("btn-mode-din"),
  btnModeLliure: document.getElementById("btn-mode-lliure"),
  btnTreuTanc: document.getElementById("btn-treu-tanc"),
  dinamometreControls: document.getElementById("dinamometre-controls"),
  lliureControls: document.getElementById("lliure-controls"),
  lliureStatus: document.getElementById("lliure-status"),
  rangeImmersio: document.getElementById("range-immersio"),
  valImmersio: document.getElementById("val-immersio"),
  btnDeixaCaure: document.getElementById("btn-deixa-caure"),

  sumMassa: document.getElementById("sum-massa"),
  sumVolum: document.getElementById("sum-volum"),
  sumDensitat: document.getElementById("sum-densitat"),
  sumPes: document.getElementById("sum-pes"),
  sumEmp: document.getElementById("sum-emp"),
  sumPap: document.getElementById("sum-pap")
};

function liquidActual() {
  const base = LIQUIDS.find((l) => l.id === estat.liquidId) || LIQUIDS[0];
  if (base.id === "personalitzat") {
    return { ...base, densitat: estat.liquidPersonalitzatDensitat };
  }
  return base;
}

function renderCataleg() {
  // Pestanyes
  els.catTabs.innerHTML = CATEGORIES.map(
    (c) => `<button type="button" class="cat-tab ${c.id === estat.categoriaActiva ? "active" : ""}" data-cat="${c.id}">${c.nom}</button>`
  ).join("");

  if (estat.categoriaActiva === "personalitzat") {
    els.catGrid.classList.add("hidden");
    els.customObjPanel.classList.remove("hidden");
    return;
  }

  els.catGrid.classList.remove("hidden");
  els.customObjPanel.classList.add("hidden");

  const llista =
    estat.categoriaActiva === "tots"
      ? OBJECTES
      : OBJECTES.filter((o) => o.categoria === estat.categoriaActiva);

  els.catGrid.innerHTML = llista
    .map((obj) => {
      const sel = estat.objecteSeleccionat?.id === obj.id ? "selected" : "";
      const p = `cat-${obj.id}-`;
      return `
        <div class="obj-card ${sel}" draggable="true" data-obj-id="${obj.id}" title="${obj.descripcio}">
          <svg viewBox="0 0 60 48" aria-hidden="true">
            <defs>${defsObjectes(p)}</defs>
            ${dibuixaObjecteRealista(obj, 30, 24, 46, 38, p)}
          </svg>
          <span class="obj-card-name">${obj.nom}</span>
        </div>
      `;
    })
    .join("");
}

function renderSeleccionat() {
  const obj = estat.objecteSeleccionat;
  if (!obj) {
    els.selectedThumb.innerHTML = "";
    els.selectedName.textContent = "Cap objecte triat";
    els.selectedDesc.textContent = "Tria o arrossega un objecte";
    return;
  }
  els.selectedThumb.innerHTML = `
    <svg viewBox="0 0 48 40" aria-hidden="true">
      <defs>${defsObjectes("sel-")}</defs>
      ${dibuixaObjecteRealista(obj, 24, 20, 38, 32, "sel-")}
    </svg>
  `;
  els.selectedName.textContent = obj.nom;
  els.selectedDesc.textContent = obj.descripcio;
}

function renderBalanca() {
  const obj = estat.balancaObj;
  let m = 0;
  let p = 0;
  if (obj) {
    const mag = magnitudsObjecte(obj);
    m = Math.max(0, mag.massa - estat.tara);
    p = Math.max(0, (m / 1000) * 9.8);
  }
  els.stageBalanca.innerHTML = renderBalancaSVG({
    obj,
    massaMesurada: m,
    pesMesurat: p,
    tara: estat.tara
  });
}

function renderProveta() {
  const liq = liquidActual();
  const obj = estat.provetaObj;
  const eq = obj ? estatEquilibriLliure(obj, liq.densitat) : null;
  els.stageProveta.innerHTML = renderProvetaSVG({
    obj,
    liquid: liq,
    capacitatMl: estat.provetaCap,
    volumInicialMl: estat.provetaV0,
    varetaSubmergit: estat.varetaSubmergit,
    estatEquilibri: eq
  });
}

function renderTanc() {
  const liq = liquidActual();
  const obj = estat.tancObj;
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
    estatLliure
  });

  if (estat.modeTanc === "lliure") {
    if (!obj) {
      els.lliureStatus.textContent = "Col·loca un objecte al tanc per veure si sura o s'enfonsa.";
    } else if (estatLliure.sura) {
      const pct = Math.round(estatLliure.fraccioSubmergida * 100);
      els.lliureStatus.textContent = `Sura! (${pct} % submergit dins ${liq.nom.toLowerCase()})`;
    } else if (estatLliure.equilibriNeutre) {
      els.lliureStatus.textContent = "Equilibri neutre: mateixa densitat que el líquid.";
    } else {
      els.lliureStatus.textContent = `S'enfonsa fins al fons (ρ > ${fmt(liq.densitat, 2)} g/cm³).`;
    }
  }
}

function renderResum() {
  // Prioritzem l'objecte que hi hagi al tanc, sinó proveta, sinó balança, sinó seleccionat
  const obj = estat.tancObj || estat.provetaObj || estat.balancaObj || estat.objecteSeleccionat;
  if (!obj) {
    els.sumMassa.textContent = "—";
    els.sumVolum.textContent = "—";
    els.sumDensitat.textContent = "—";
    els.sumPes.textContent = "—";
    els.sumEmp.textContent = "—";
    els.sumPap.textContent = "—";
    return;
  }

  const liq = liquidActual();
  const mag = magnitudsObjecte(obj);
  const amaga = !estat.mostraCalculs;

  els.sumMassa.textContent = `${fmtNet(mag.massa, 1)} g`;
  els.sumVolum.textContent = `${fmtNet(mag.volum, 1)} cm³`;
  els.sumDensitat.textContent = amaga ? "???" : `${fmt(mag.densitat, 2)} g/cm³`;
  els.sumPes.textContent = `${fmt(mag.pes, 2)} N`;

  if (estat.tancObj) {
    if (estat.modeTanc === "dinamometre") {
      const din = estatDinamometre(estat.tancObj, liq.densitat, estat.immersioSlider / 100);
      els.sumEmp.textContent = amaga ? "???" : `${fmt(din.empenyiment, 2)} N`;
      els.sumPap.textContent = amaga ? "???" : `${fmt(din.tensio, 2)} N`;
    } else {
      const ll = estatEquilibriLliure(estat.tancObj, liq.densitat);
      els.sumEmp.textContent = amaga ? "???" : `${fmt(ll.empenyiment, 2)} N`;
      els.sumPap.textContent = amaga ? "???" : ll.sura ? "0,00 N (sura)" : `${fmt(ll.normal, 2)} N (al fons)`;
    }
  } else {
    els.sumEmp.textContent = "—";
    els.sumPap.textContent = "—";
  }
}

function renderTot() {
  renderBalanca();
  renderProveta();
  renderTanc();
  renderResum();
}

/**
 * Animació física amortida per al mode "Flotació lliure" al tanc.
 */
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
    // Molla amortida física per reproduir caiguda + frenada de l'aigua
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

function enviaObjecteA(target, obj = estat.objecteSeleccionat) {
  if (!obj) return;
  if (target === "balanca" || target === "tots") {
    estat.balancaObj = obj;
    estat.tara = 0;
  }
  if (target === "proveta" || target === "tots") {
    estat.provetaObj = obj;
    // Ajusta capacitat si l'objecte més V0 superen la proveta actual
    if (estat.provetaV0 + obj.volum > estat.provetaCap) {
      if (estat.provetaV0 + obj.volum <= 500) estat.provetaCap = 500;
      else estat.provetaCap = 1000;
      els.selectProvetaCap.value = String(estat.provetaCap);
      actualitzaRangV0();
    }
  }
  if (target === "tanc" || target === "tots") {
    estat.tancObj = obj;
    if (estat.modeTanc === "lliure") {
      iniciaAnimacioLliure(true);
    }
  }
  renderTot();
}

function actualitzaRangV0() {
  const maxV0 = Math.round(estat.provetaCap * 0.75);
  els.rangeV0.max = String(maxV0);
  if (estat.provetaV0 > maxV0) {
    estat.provetaV0 = maxV0;
    els.rangeV0.value = String(maxV0);
  }
  els.valV0.textContent = `${estat.provetaV0} mL`;
}

function ompleLiquids() {
  els.selectLiquid.innerHTML = LIQUIDS.map(
    (l) => `<option value="${l.id}">${l.nom} (${fmt(l.densitat, 2)} g/cm³)</option>`
  ).join("");
  els.selectLiquid.value = estat.liquidId;
}

function inicialitzaEvents() {
  // Líquid
  els.selectLiquid.addEventListener("change", (e) => {
    estat.liquidId = e.target.value;
    els.customLiquidWrap.classList.toggle("hidden", estat.liquidId !== "personalitzat");
    if (estat.modeTanc === "lliure" && estat.tancObj) {
      iniciaAnimacioLliure(false);
    }
    renderTot();
  });

  els.rangeLiquidDensity.addEventListener("input", (e) => {
    estat.liquidPersonalitzatDensitat = parseFloat(e.target.value);
    els.valLiquidDensity.textContent = `${fmt(estat.liquidPersonalitzatDensitat, 2)} g/cm³`;
    if (estat.modeTanc === "lliure" && estat.tancObj) {
      iniciaAnimacioLliure(false);
    }
    renderTot();
  });

  // Toggles pissarra
  els.btnForces.addEventListener("click", () => {
    estat.mostraForces = !estat.mostraForces;
    els.btnForces.classList.toggle("active", estat.mostraForces);
    els.btnForces.setAttribute("aria-pressed", String(estat.mostraForces));
    renderTanc();
  });

  els.btnCalculs.addEventListener("click", () => {
    estat.mostraCalculs = !estat.mostraCalculs;
    els.btnCalculs.classList.toggle("active", estat.mostraCalculs);
    els.btnCalculs.setAttribute("aria-pressed", String(estat.mostraCalculs));
    renderResum();
  });

  els.btnProjector.addEventListener("click", () => {
    estat.modePissarra = !estat.modePissarra;
    document.body.classList.toggle("mode-pissarra", estat.modePissarra);
    els.btnProjector.classList.toggle("active", estat.modePissarra);
    els.btnProjector.setAttribute("aria-pressed", String(estat.modePissarra));
  });

  els.btnReinicia.addEventListener("click", () => {
    estat.balancaObj = null;
    estat.tara = 0;
    estat.provetaObj = null;
    estat.varetaSubmergit = false;
    els.btnVareta.classList.remove("active");
    els.btnVareta.setAttribute("aria-pressed", "false");
    estat.tancObj = null;
    estat.posYAnim = null;
    renderTot();
  });

  // Pestanyes catàleg
  els.catTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-tab");
    if (!btn) return;
    estat.categoriaActiva = btn.dataset.cat;
    renderCataleg();
  });

  // Selecció i arrossegament al catàleg
  els.catGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".obj-card");
    if (!card) return;
    const obj = OBJECTES.find((o) => o.id === card.dataset.objId);
    if (!obj) return;
    estat.objecteSeleccionat = obj;
    renderCataleg();
    renderSeleccionat();
    renderResum();
  });

  els.catGrid.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".obj-card");
    if (!card) return;
    e.dataTransfer.setData("text/plain", card.dataset.objId);
    const obj = OBJECTES.find((o) => o.id === card.dataset.objId);
    if (obj) {
      estat.objecteSeleccionat = obj;
      renderSeleccionat();
    }
  });

  // Zones de drop als 3 instruments
  document.querySelectorAll(".drop-zone").forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => {
      zone.classList.remove("drag-over");
    });
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      const id = e.dataTransfer.getData("text/plain");
      const obj = id === "custom" ? { ...estat.objecteCustom } : OBJECTES.find((o) => o.id === id);
      if (obj) {
        enviaObjecteA(zone.dataset.station, obj);
      }
    });
  });

  // Botons ràpids d'enviament
  document.querySelectorAll(".btn-send").forEach((btn) => {
    btn.addEventListener("click", () => {
      enviaObjecteA(btn.dataset.target);
    });
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
      estat.objecteSeleccionat = { ...estat.objecteCustom };
      renderSeleccionat();
      if (estat.balancaObj?.id === "custom") estat.balancaObj = { ...estat.objecteCustom };
      if (estat.provetaObj?.id === "custom") estat.provetaObj = { ...estat.objecteCustom };
      if (estat.tancObj?.id === "custom") estat.tancObj = { ...estat.objecteCustom };
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
  els.btnTara.addEventListener("click", () => {
    if (estat.balancaObj) {
      estat.tara = estat.tara > 0 ? 0 : magnitudsObjecte(estat.balancaObj).massa;
      renderBalanca();
    }
  });
  els.btnTreuBalanca.addEventListener("click", () => {
    estat.balancaObj = null;
    estat.tara = 0;
    renderTot();
  });

  // Proveta
  els.selectProvetaCap.addEventListener("change", (e) => {
    estat.provetaCap = parseInt(e.target.value, 10);
    actualitzaRangV0();
    renderProveta();
  });
  els.rangeV0.addEventListener("input", (e) => {
    estat.provetaV0 = parseInt(e.target.value, 10);
    els.valV0.textContent = `${estat.provetaV0} mL`;
    renderProveta();
  });
  els.btnVareta.addEventListener("click", () => {
    estat.varetaSubmergit = !estat.varetaSubmergit;
    els.btnVareta.classList.toggle("active", estat.varetaSubmergit);
    els.btnVareta.setAttribute("aria-pressed", String(estat.varetaSubmergit));
    renderProveta();
  });
  els.btnTreuProveta.addEventListener("click", () => {
    estat.provetaObj = null;
    estat.varetaSubmergit = false;
    els.btnVareta.classList.remove("active");
    els.btnVareta.setAttribute("aria-pressed", "false");
    renderTot();
  });

  // Tanc i Dinamòmetre
  els.btnModeDin.addEventListener("click", () => {
    estat.modeTanc = "dinamometre";
    els.btnModeDin.classList.add("active");
    els.btnModeLliure.classList.remove("active");
    els.dinamometreControls.classList.remove("hidden");
    els.lliureControls.classList.add("hidden");
    if (animFrameId) cancelAnimationFrame(animFrameId);
    renderTot();
  });
  els.btnModeLliure.addEventListener("click", () => {
    estat.modeTanc = "lliure";
    els.btnModeLliure.classList.add("active");
    els.btnModeDin.classList.remove("active");
    els.dinamometreControls.classList.add("hidden");
    els.lliureControls.classList.remove("hidden");
    iniciaAnimacioLliure(true);
    renderResum();
  });
  els.rangeImmersio.addEventListener("input", (e) => {
    estat.immersioSlider = parseInt(e.target.value, 10);
    els.valImmersio.textContent = `${estat.immersioSlider} %`;
    renderTanc();
    renderResum();
  });
  document.querySelectorAll("[data-imm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      estat.immersioSlider = parseInt(btn.dataset.imm, 10);
      els.rangeImmersio.value = String(estat.immersioSlider);
      els.valImmersio.textContent = `${estat.immersioSlider} %`;
      renderTanc();
      renderResum();
    });
  });
  els.btnDeixaCaure.addEventListener("click", () => {
    iniciaAnimacioLliure(true);
  });
  els.btnTreuTanc.addEventListener("click", () => {
    estat.tancObj = null;
    estat.posYAnim = null;
    renderTot();
  });
}

// Arrencada
ompleLiquids();
actualitzaRangV0();
renderCataleg();
renderSeleccionat();
inicialitzaEvents();
els.valImmersio.textContent = `${estat.immersioSlider} %`;
els.rangeImmersio.value = String(estat.immersioSlider);
renderTot();
