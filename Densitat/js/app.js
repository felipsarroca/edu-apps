/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Arrencada, navegació, escalat adaptatiu a la pantalla (--ui-zoom com a Equacions)
 * i delegació d'esdeveniments de tota l'aplicació (08-disseny-visual-i-interaccio.md §4, 09-arquitectura-tecnica.md §2).
 */

import { MATERIALS } from "./dades/materials.js";
import { LIQUIDS } from "./dades/liquids.js";
import { OBJECTES_PRESTATGE } from "./dades/objectes.js";
import { RECIPIENTS } from "./dades/recipients.js";
import { INVESTIGACIONS, BANC_DIAGNOSTIC_BAYESIA } from "./dades/investigacions/index.js";

import { magnitudsObjecte, tallaObjecte, modelaObjecte, construeixObjecte } from "./fisica/objecte.js";
import { hiCapObjecte, abocaLiquid, remenaCapes, construeixColumnaLiquids } from "./fisica/recipient.js";

import {
  obteEstat,
  subscriu,
  notifica,
  desaSnapshotLaboratori,
  desfesLaboratori,
  refesLaboratori,
  obreInvestigacio,
  obreLaboratoriLliure,
  anotaMesuraQuadern,
  reiniciaEscenaActual,
  endrecaObjectesAlPrestatge,
  reiniciaSessioCompleta
} from "./estat/magatzem.js";
import {
  desaEscenaAmbNom,
  carregaEscenesDesades,
  generaCSVQuadern,
  descarregaFitxer
} from "./estat/desament.js";
import { llegeixParametresHash } from "./estat/escena-url.js";

import { avaluaRespostaPas } from "./guia/preguntes.js";
import {
  creaEstatDiagnosiInicial,
  registraEvidenciaIdea,
  responItemDiagnosticBayesia,
  validaSeparabilitatMonteCarlo
} from "./guia/diagnosi.js";

import { renderitzaPantallaInici } from "./pantalles/inici.js";
import { renderitzaPantallaLaboratori } from "./laboratori/escena.js";
import { renderitzaPantallaQuadern } from "./quadern/quadern.js";
import { renderitzaPantallaConsulta } from "./pantalles/consulta.js";
import { renderitzaPantallaProgres } from "./pantalles/progres.js";
import { renderitzaPantallaDocent } from "./pantalles/docent.js";
import { icona } from "./eines/icones.js";

// Estat volàtil de la interfície (subvistes, filtres, eines emergents)
const ui = {
  blocIniciObert: null, // null = el tema de la investigació proposada
  menuObert: null, // null | "opcions" | "vistes"
  quadernFiltre: null,
  consultaOpcions: { filtreEstat: "tots", cercaGlossari: "" },
  resultatMonteCarlo: null,
  eines: {
    calculadora: { valA: "270", uniA: "g", op: "÷", valB: "100", uniB: "cm³", segSlot: "A" },
    conversor: { familia: "volum", valor: "1", uOrig: "dm³", uDest: "cm³" },
    grafica: { mostraAigua: true, mostraRectes: true },
    comparador: {
      A: { material: "alumini", volum: 50, liquid: "aigua", profunditat: 10 },
      B: { material: "acer", volum: 50, liquid: "aigua", profunditat: 10 }
    }
  }
};

/**
 * Escalat fluid i modes de composició segons la mida útil de la pantalla (08-disseny-visual-i-interaccio.md §4).
 * Disseny de referència: 1440 × 800 px útils. Mínim del 75 %.
 */
const BASE_W = 1440;
const BASE_H = 800;
const MIN_ZOOM = 0.75;
const MIN_DESKTOP_W = 760;

export function ajustaEscalaPantalla() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const estat = obteEstat();
  const w = window.innerWidth;
  const h = window.innerHeight;
  let z = Math.min(1, w / BASE_W, h / BASE_H);
  z = Math.max(MIN_ZOOM, Math.floor(z * 20) / 20);
  if (estat.configuracio?.projector || w < MIN_DESKTOP_W) {
    z = 1;
  }
  const root = document.documentElement;
  const eh = h / z;
  root.style.setProperty("--ui-zoom", String(z));
  root.classList.toggle("projector", Boolean(estat.configuracio?.projector));
  root.classList.toggle("vista-completa", Boolean(estat.configuracio?.vistaCompleta));
  root.classList.toggle("mode-compacte", w >= 760 && w < 1180);
  root.classList.toggle("mode-mobil", w < 760);
  root.classList.toggle("h-700", eh <= 700);
  root.classList.toggle("h-640", eh <= 640);
}

/**
 * Mostra un avís breu accessible a la part inferior dreta.
 */
function mostraToast(text) {
  const cont = document.getElementById("toast-root");
  if (!cont) return;
  cont.textContent = text;
  cont.classList.add("visible");
  clearTimeout(cont._timer);
  cont._timer = setTimeout(() => cont.classList.remove("visible"), 2600);
}

/**
 * Tanca qualsevol menú emergent obert sense tornar a renderitzar la pantalla
 * (així no es perd res del que l'alumne tingui marcat o escrit a la guia).
 */
function tancaMenus() {
  ui.menuObert = null;
  document.querySelectorAll(".menu-emergent").forEach(m => {
    m.hidden = true;
  });
  document.querySelectorAll("[data-toggle-menu]").forEach(b => {
    b.setAttribute("aria-expanded", "false");
    if (b.classList.contains("bt-suport")) b.classList.remove("actiu");
  });
}

/**
 * Renderitza la barra superior global (48 px, 08-disseny-visual-i-interaccio.md §3.1).
 * Navegació en llenguatge planer; els ajustos (lectura fàcil, vista completa, projector i nivell) s'agrupen al menú «Opcions».
 */
function renderitzaCapcalera(estat) {
  const cfg = estat.configuracio;
  const invActiva = INVESTIGACIONS[estat.investigacio?.id] || INVESTIGACIONS.C4;
  const nMesures = estat.quadern.mesures.length;
  const codiLab = cfg.vistaCompleta
    ? estat.modeLaboratori === "investigacio"
      ? ` (${invActiva.id})`
      : " (lliure)"
    : "";

  const botoNav = (id, ic, text, extra = "") => `
          <button type="button" class="bt-nav ${estat.pantalla === id ? "actiu" : ""}" data-canvia-pantalla="${id}" ${estat.pantalla === id ? 'aria-current="page"' : ""}>
            ${icona(ic)} <span>${text}</span>${extra}
          </button>`;

  const interruptor = (clau, titol, ajuda) => `
            <label class="opcio-fila">
              <input type="checkbox" data-docent-toggle="${clau}" ${cfg[clau] ? "checked" : ""}>
              <span class="opcio-text"><strong>${titol}</strong><small>${ajuda}</small></span>
            </label>`;

  return `
    <div class="header-inner">
      <div class="header-esquerra">
        <button type="button" class="marca-app" data-canvia-pantalla="inici" title="Torna a l'inici">
          <img src="favicon.svg" alt="" width="26" height="26">
          <span class="marca-titol">Densitat</span>
        </button>

        <nav class="nav-principal" aria-label="Espais de l'aplicació">
          ${botoNav("inici", "inici", "Inici")}
          ${botoNav("laboratori", "laboratori", `Laboratori${codiLab}`)}
          ${botoNav("quadern", "quadern", "Quadern", nMesures > 0 ? `<span class="nav-comptador" title="${nMesures} mesures anotades">${nMesures}</span>` : "")}
          ${botoNav("consulta", "consulta", "Fórmules i ajuda")}
          ${botoNav("progres", "progres", "Progrés")}
        </nav>
      </div>

      <div class="header-dreta">
        <button type="button" class="bt-suport ${estat.pantalla === "docent" ? "actiu" : ""}" data-canvia-pantalla="docent" title="Eines per al professorat: enllaços per a Classroom, solucionari i rúbrica">
          ${icona("docent")} <span>Professorat</span>
        </button>

        <div class="menu-ancora" data-menu="opcions">
          <button type="button" class="bt-suport ${ui.menuObert === "opcions" ? "actiu" : ""}" data-toggle-menu="opcions" aria-haspopup="true" aria-expanded="${ui.menuObert === "opcions"}">
            ${icona("opcions")} <span>Opcions</span>
          </button>
          <div class="menu-emergent menu-avall menu-dreta menu-opcions" role="group" aria-label="Opcions" ${ui.menuObert === "opcions" ? "" : "hidden"}>
            ${interruptor("lecturaFacil", "Lectura fàcil", "Textos més curts i senzills")}
            ${interruptor("vistaCompleta", "Vista completa", "Totes les eines i els detalls tècnics a la vista")}
            ${interruptor("projector", "Mode projector", "Lletra més gran per a la pissarra digital")}
            <label class="opcio-fila opcio-fila-select" title="${cfg.nivellFixatPerDocent ? "Nivell fixat per l'enllaç del docent" : "Com més alt, més precisió es demana a les respostes"}">
              <span class="opcio-text"><strong>Nivell</strong><small>Precisió que es demana a les respostes</small></span>
              <select id="header-sel-nivell" ${cfg.nivellFixatPerDocent ? "disabled" : ""}>
                <option value="1" ${cfg.nivell === 1 ? "selected" : ""}>1 · Descoberta</option>
                <option value="2" ${cfg.nivell === 2 ? "selected" : ""}>2 · Mesura</option>
                <option value="3" ${cfg.nivell === 3 ? "selected" : ""}>3 · Models</option>
              </select>
            </label>
            <button type="button" class="menu-element" data-obre-guia-rapida="true">
              ${icona("ajuda")}
              <span class="menu-element-text"><strong>Com funciona el laboratori</strong><small>Torna a veure els primers passos</small></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderitza tota la interfície a partir de l'estat únic.
 */
export function renderitzaApp() {
  const estat = obteEstat();
  ajustaEscalaPantalla();

  const headerEl = document.getElementById("app-header");
  const mainEl = document.getElementById("main");
  if (!headerEl || !mainEl) return;

  headerEl.innerHTML = renderitzaCapcalera(estat);

  switch (estat.pantalla) {
    case "inici":
      mainEl.innerHTML = renderitzaPantallaInici(estat, ui.blocIniciObert);
      break;
    case "laboratori":
      mainEl.innerHTML = renderitzaPantallaLaboratori(estat, ui.eines, ui);
      break;
    case "quadern":
      mainEl.innerHTML = renderitzaPantallaQuadern(estat, ui.quadernFiltre);
      break;
    case "consulta":
      mainEl.innerHTML = renderitzaPantallaConsulta(estat, ui.consultaOpcions);
      break;
    case "progres":
      mainEl.innerHTML = renderitzaPantallaProgres(estat);
      break;
    case "docent":
      mainEl.innerHTML = renderitzaPantallaDocent(estat, ui.resultatMonteCarlo);
      break;
    default:
      mainEl.innerHTML = renderitzaPantallaInici(estat, ui.blocIniciObert);
  }
}

/**
 * Mou un objecte a una destinació del laboratori comprovant si hi cap físicament (p. ex. boca de la proveta, T04b).
 */
function executaMoureObjecte(objId, desti) {
  const estat = obteEstat();
  const lab = estat.laboratori;
  const obj = lab.objectes[objId];
  if (!obj) return;

  // Comprovació de la boca de la proveta (T04b i EP-05)
  if (desti === "proveta") {
    const recProv = RECIPIENTS[lab.proveta.tipus] || RECIPIENTS.proveta250;
    const check = hiCapObjecte(obj, recProv);
    if (!check.hiCap) {
      lab.avísFisic = check.motiu;
      notifica();
      mostraToast(check.motiu);
      return;
    }
  }

  desaSnapshotLaboratori();
  lab.avísFisic = null;

  // Si la destinació només admet un objecte alhora (balança, proveta, vas, dinamòmetre), l'anterior torna al prestatge
  if (["balanca", "proveta", "vas", "dinamometre", "tanc"].includes(desti)) {
    for (const [k, ub] of Object.entries(lab.ubicacions)) {
      if (ub === desti && k !== objId) {
        lab.ubicacions[k] = "prestatge";
      }
    }
  }

  lab.ubicacions[objId] = desti;
  lab.objecteSeleccionat = objId;

  if (desti === "vas") lab.accionsFetes.objecteEnVas = true;
  if (desti === "columna") {
    lab.accionsFetes.objecteEnColumna = true;
    if (!lab.columna.objectesEnColumna.includes(objId)) {
      lab.columna.objectesEnColumna.push(objId);
    }
  }

  notifica();
}

/**
 * Inicialitza tots els escoltadors d'esdeveniments delegats.
 */
function inicialitzaEsdeveniments() {
  document.addEventListener("click", e => {
    const estat = obteEstat();
    const lab = estat.laboratori;

    // 0. Menús emergents (Opcions, Més eines, Mostra): s'obren amb el seu botó i es tanquen en fer clic a fora
    const btMenu = e.target.closest("[data-toggle-menu]");
    if (btMenu) {
      ui.menuObert = ui.menuObert === btMenu.dataset.toggleMenu ? null : btMenu.dataset.toggleMenu;
      renderitzaApp();
      return;
    }
    if (ui.menuObert && !e.target.closest("[data-menu]")) {
      tancaMenus();
    }

    // 0b. Guia ràpida de primers passos del laboratori
    if (e.target.closest("[data-tanca-guia-rapida]")) {
      estat.configuracio.guiaRapidaVista = true;
      notifica();
      return;
    }
    if (e.target.closest("[data-obre-guia-rapida]")) {
      const jaVisible = estat.pantalla === "laboratori" && !estat.configuracio.guiaRapidaVista;
      estat.configuracio.guiaRapidaVista = jaVisible;
      estat.pantalla = "laboratori";
      ui.menuObert = null;
      notifica();
      return;
    }

    // 1. Canvi de pantalla
    const btPantalla = e.target.closest("[data-canvia-pantalla]");
    if (btPantalla) {
      estat.pantalla = btPantalla.dataset.canviaPantalla;
      ui.menuObert = null;
      if (estat.pantalla === "inici") ui.blocIniciObert = null;
      notifica();
      return;
    }

    // 2. Obrir investigació
    const btObreInv = e.target.closest("[data-obre-inv]");
    if (btObreInv) {
      obreInvestigacio(btObreInv.dataset.obreInv);
      return;
    }

    // 3. Obrir laboratori lliure
    const btObreLliure = e.target.closest("[data-obre-lliure]");
    if (btObreLliure) {
      obreLaboratoriLliure(btObreLliure.dataset.obreLliure);
      return;
    }

    // 4. Seleccionar bloc a la pantalla d'Inici
    const btBloc = e.target.closest("[data-selecciona-bloc]");
    if (btBloc) {
      ui.blocIniciObert = btBloc.dataset.seleccionaBloc;
      renderitzaApp();
      return;
    }

    // 5. Vistes i suports de la barra superior
    const btVista = e.target.closest("[data-toggle-vista]");
    if (btVista) {
      const v = btVista.dataset.toggleVista;
      lab.vistes[v] = !lab.vistes[v];
      notifica();
      return;
    }

    if (e.target.closest("[data-toggle-facil]")) {
      estat.configuracio.lecturaFacil = !estat.configuracio.lecturaFacil;
      notifica();
      return;
    }

    if (e.target.closest("[data-toggle-projector]")) {
      estat.configuracio.projector = !estat.configuracio.projector;
      notifica();
      return;
    }

    // 6. Canvi de taula de treball (els objectes tornen al prestatge i conserven dades, 04 §1)
    const btTaula = e.target.closest("[data-canvia-taula]");
    if (btTaula) {
      desaSnapshotLaboratori();
      lab.taula = btTaula.dataset.canviaTaula;
      lab.avísFisic = null;
      notifica();
      return;
    }

    // 7. Obrir / tancar eina de pensament
    const btEina = e.target.closest("[data-obre-eina]");
    if (btEina) {
      const idEina = btEina.dataset.obreEina;
      lab.einaActiva = lab.einaActiva === idEina ? null : idEina;
      ui.menuObert = null;
      notifica();
      return;
    }

    if (e.target.closest("[data-tanca-eina]")) {
      lab.einaActiva = null;
      notifica();
      return;
    }

    if (e.target.closest("[data-tanca-avis]")) {
      lab.avísFisic = null;
      notifica();
      return;
    }

    // 8. Desfés / Refés / Reinicia / Endreça
    if (e.target.closest("[data-desfes]")) {
      desfesLaboratori();
      return;
    }
    if (e.target.closest("[data-refes]")) {
      refesLaboratori();
      return;
    }
    if (e.target.closest("[data-reinicia-escena]")) {
      reiniciaEscenaActual();
      mostraToast("Escena reiniciada (les dades del quadern es conserven).");
      return;
    }
    if (e.target.closest("[data-endreca]")) {
      endrecaObjectesAlPrestatge();
      return;
    }

    // 9. Seleccionar o moure objecte (o clic directe a una estació de l'SVG)
    const btFiltrePrest = e.target.closest("[data-filtre-prestatge]");
    if (btFiltrePrest) {
      lab.mostraTotsPrestatge = btFiltrePrest.dataset.filtrePrestatge === "tots";
      notifica();
      return;
    }

    if (e.target.closest("[data-toggle-visibilitat]")) {
      lab.visibilitat = lab.visibilitat === "analisi" ? "experimental" : "analisi";
      notifica();
      mostraToast(
        lab.visibilitat === "analisi"
          ? "Mode d'anàlisi activat: es mostren les magnituds i l'escala de referència."
          : "Mode experimental activat: descobreix les magnituds mesurant al laboratori."
      );
      return;
    }

    const btSelObj = e.target.closest("[data-selecciona-obj]");
    if (btSelObj) {
      lab.objecteSeleccionat = btSelObj.dataset.seleccionaObj;
      notifica();
      return;
    }

    const btMouObj = e.target.closest("[data-mou-obj]");
    if (btMouObj) {
      executaMoureObjecte(btMouObj.dataset.mouObj, btMouObj.dataset.desti);
      return;
    }

    const zonaDropClicada = e.target.closest("[data-drop-zone]");
    if (zonaDropClicada && !e.target.closest(".svg-objecte")) {
      const desti = zonaDropClicada.dataset.dropZone;
      const objId = lab.objecteSeleccionat || "A";
      executaMoureObjecte(objId, desti);
      return;
    }

    // 10. Canviar líquid des de les ampolles del prestatge
    const btAmpolla = e.target.closest("[data-canvia-liquid]");
    if (btAmpolla) {
      const liqId = btAmpolla.dataset.canviaLiquid;
      if (lab.taula === "mesura") {
        lab.vas.liquid = liqId;
      } else if (lab.taula === "tanc") {
        lab.tanc.liquid = liqId;
      } else if (lab.taula === "columna") {
        const lInfo = LIQUIDS[liqId];
        if (lInfo) {
          desaSnapshotLaboratori();
          lab.columna.capes = abocaLiquid(
            lab.columna.capes,
            { ...lInfo, densitat: estat.configuracio.nombresSenzills ? lInfo.dEscolar : lInfo.dReferencia, volum: 80 },
            { ambCura: lab.columna.ambCura }
          );
        }
      }
      notifica();
      return;
    }

    // 11. Accions de la Balança
    const btAccioBal = e.target.closest("[data-accio-balanca]");
    if (btAccioBal) {
      const acc = btAccioBal.dataset.accioBalanca;
      desaSnapshotLaboratori();
      if (acc === "tara") {
        // Calcula la massa actual sobre el plat i la fixa com a tara
        let mPlat = 0;
        const idB = Object.keys(lab.ubicacions).find(k => lab.ubicacions[k] === "balanca");
        if (idB && lab.objectes[idB]) {
          mPlat += magnitudsObjecte(lab.objectes[idB], {
            materials: MATERIALS,
            nombresSenzills: estat.configuracio.nombresSenzills
          }).massa;
        }
        if (lab.balanca.recipientSobrePlat) {
          const recB = RECIPIENTS[lab.balanca.tipusRecipient] || RECIPIENTS.vas250;
          const liqB = LIQUIDS[lab.balanca.liquidRecipient] || LIQUIDS.aigua;
          mPlat += recB.massaBuit + (lab.balanca.volumRecipient || 0) * liqB.dEscolar;
        }
        lab.balanca.tara = mPlat;
        mostraToast("Balança tarada a 0,0.");
      } else if (acc === "unitat") {
        lab.balanca.unitat = lab.balanca.unitat === "g" ? "kg" : "g";
      } else if (acc === "recipient") {
        lab.balanca.recipientSobrePlat = !lab.balanca.recipientSobrePlat;
      }
      notifica();
      return;
    }

    // 12. Accions de la Proveta
    const btAccioProv = e.target.closest("[data-accio-proveta]");
    if (btAccioProv) {
      if (btAccioProv.dataset.accioProveta === "vareta") {
        lab.proveta.vareta = !lab.proveta.vareta;
        notifica();
      }
      return;
    }

    // 13. Anotar lectura d'un instrument al quadern
    const btAnotaInst = e.target.closest("[data-anota-instrument]");
    if (btAnotaInst) {
      const tipusInst = btAnotaInst.dataset.anotaInstrument;
      const val = Number(btAnotaInst.dataset.val);
      const uni = btAnotaInst.dataset.uni;
      const mag =
        btAnotaInst.dataset.mag ||
        (tipusInst === "balanca" ? "Massa" : tipusInst === "proveta" ? "Volum" : "Mesura");
      anotaMesuraQuadern({
        objecteId: btAnotaInst.dataset.objId,
        objecteNom: btAnotaInst.dataset.objNom,
        magnitud: mag,
        valor: val,
        unitat: uni,
        instrument: btAnotaInst.dataset.inst,
        resolucio: Number(btAnotaInst.dataset.res)
      });
      mostraToast(`Anotat al quadern: ${btAnotaInst.dataset.objNom} → ${val.toString().replace(".", ",")} ${uni}`);
      return;
    }

    // 14. Tallar i modelar objectes (C4, C8)
    const btTalla = e.target.closest("[data-talla-rapid]");
    if (btTalla) {
      const objId = btTalla.dataset.tallaRapid;
      const frac = Number(btTalla.dataset.frac || 0.5);
      const obj = lab.objectes[objId];
      if (obj) {
        desaSnapshotLaboratori();
        const [t1, t2] = tallaObjecte(obj, frac, {
          materials: MATERIALS,
          nombresSenzills: estat.configuracio.nombresSenzills
        });
        lab.objectes[t1.id] = t1;
        lab.objectes[t2.id] = t2;
        lab.ubicacions[t1.id] = lab.ubicacions[objId] || "prestatge";
        lab.ubicacions[t2.id] = "prestatge";
        lab.objecteSeleccionat = t1.id;
        lab.accionsFetes.tallat = true;
        notifica();
        mostraToast(`Objecte dividit en ${t1.etiqueta} i ${t2.etiqueta}.`);
      }
      return;
    }

    const btModelaRapid = e.target.closest("[data-modela-rapid]");
    if (btModelaRapid) {
      const objId = btModelaRapid.dataset.modelaRapid;
      const obj = lab.objectes[objId];
      if (obj) {
        desaSnapshotLaboratori();
        const formes = ["bola", "cilindre", "bloc", "plat"];
        const actual = obj.formaModelada || "bola";
        const seg = formes[(formes.indexOf(actual) + 1) % formes.length];
        lab.objectes[objId] = modelaObjecte(obj, seg);
        notifica();
        mostraToast(`Modelat en forma de ${seg} (massa i volum es conserven).`);
      }
      return;
    }

    const btModelaForma = e.target.closest("[data-modela-forma]");
    if (btModelaForma) {
      const objId = btModelaForma.dataset.obj;
      const forma = btModelaForma.dataset.modelaForma;
      const obj = lab.objectes[objId];
      if (obj) {
        desaSnapshotLaboratori();
        lab.objectes[objId] = modelaObjecte(obj, forma);
        notifica();
        mostraToast(`Modelat en forma de ${forma}.`);
      }
      return;
    }

    // 15. Accions de la Columna i Sal (D3, D5, D7)
    const btAbocaCol = e.target.closest("[data-aboca-columna]");
    if (btAbocaCol) {
      const lId = btAbocaCol.dataset.abocaColumna;
      const lInfo = LIQUIDS[lId];
      if (lInfo) {
        desaSnapshotLaboratori();
        lab.columna.capes = abocaLiquid(
          lab.columna.capes,
          { ...lInfo, densitat: estat.configuracio.nombresSenzills ? lInfo.dEscolar : lInfo.dReferencia, volum: 80 },
          { ambCura: lab.columna.ambCura }
        );
        notifica();
      }
      return;
    }

    const btAccioCol = e.target.closest("[data-accio-columna]");
    if (btAccioCol) {
      desaSnapshotLaboratori();
      const acc = btAccioCol.dataset.accioColumna;
      if (acc === "remena") {
        lab.columna.capes = remenaCapes(lab.columna.capes);
        lab.accionsFetes.remenat = true;
        mostraToast("Columna remenada: els líquids de la mateixa família s'han mesclat.");
      } else if (acc === "buida") {
        lab.columna.capes = [];
      } else if (acc === "quatre_capes") {
        lab.columna.capes = construeixColumnaLiquids([
          { liquid: "mel", nom: "mel", familia: "aquosa", densitat: 1.42, volum: 100, color: "#F59E0B" },
          { liquid: "aigua", nom: "aigua", familia: "aquosa", densitat: 1.0, volum: 100, color: "#BAE6FD" },
          { liquid: "oli", nom: "oli", familia: "oliosa", densitat: 0.92, volum: 100, color: "#FDE047" },
          { liquid: "alcohol", nom: "alcohol", familia: "aquosa", densitat: 0.79, volum: 100, color: "#DDD6FE" }
        ]);
      }
      notifica();
      return;
    }

    const btSal = e.target.closest("[data-afegeix-sal]");
    if (btSal) {
      desaSnapshotLaboratori();
      const q = Number(btSal.dataset.afegeixSal);
      lab.salGrams = q === 0 ? 0 : (lab.salGrams || 0) + q;
      notifica();
      return;
    }

    // 16. Submodes del Tanc i Taller
    const btSubmodeTanc = e.target.closest("[data-tanc-mode]");
    if (btSubmodeTanc) {
      lab.tanc.modeEspecial = btSubmodeTanc.dataset.tancMode;
      notifica();
      return;
    }

    const btBarcaCarrega = e.target.closest("[data-barca-carrega]");
    if (btBarcaCarrega) {
      lab.taller.barca.carrega = Number(btBarcaCarrega.dataset.barcaCarrega);
      lab.accionsFetes.barcaProvada = true;
      notifica();
      return;
    }

    const btSubmariLlast = e.target.closest("[data-submari-llast]");
    if (btSubmariLlast) {
      lab.tanc.submariVolumAigua = Number(btSubmariLlast.dataset.submariLlast);
      lab.accionsFetes.submariProvat = true;
      notifica();
      return;
    }

    const btGlobusGas = e.target.closest("[data-globus-gas]");
    if (btGlobusGas) {
      lab.tanc.globusGas = btGlobusGas.dataset.globusGas;
      lab.accionsFetes.globusProvat = true;
      notifica();
      return;
    }

    const btTempAigua = e.target.closest("[data-temp-aigua]");
    if (btTempAigua) {
      lab.tanc.temperaturaC = Number(btTempAigua.dataset.tempAigua);
      lab.accionsFetes.temperaturaProvada = true;
      notifica();
      return;
    }

    if (e.target.closest("[data-construeix-obj]")) {
      desaSnapshotLaboratori();
      const cst = lab.taller.constructor;
      const nouObj = construeixObjecte(
        {
          fixats: cst.fixats,
          material: cst.material,
          massa: Number(cst.massa),
          volum: Number(cst.volum),
          etiqueta: `N${Object.keys(lab.objectes).length % 20}`,
          nom: `Peça de ${MATERIALS[cst.material]?.nom || cst.material}`
        },
        { materials: MATERIALS, nombresSenzills: estat.configuracio.nombresSenzills }
      );
      lab.objectes[nouObj.id] = nouObj;
      lab.ubicacions[nouObj.id] = "prestatge";
      lab.objecteSeleccionat = nouObj.id;
      lab.accionsFetes.construit = true;
      notifica();
      mostraToast(`Creat i afegit al prestatge: ${nouObj.nom} (${nouObj.calculat.massa} g, ${nouObj.calculat.volum} cm³).`);
      return;
    }

    const btPresetBarca = e.target.closest("[data-preset-barca]");
    if (btPresetBarca) {
      const tipus = btPresetBarca.dataset.presetBarca;
      if (tipus === "plastilina") {
        lab.taller.barca = { material: "plastilina", massaBarca: 200, densitatMaterial: 1.5, L: 12, B: 10, H: 5, carrega: 0, viaDAigua: false, alcadaCarregaCm: 1.5 };
      } else {
        lab.taller.barca = { material: "acer", massaBarca: 500, densitatMaterial: 7.85, L: 15, B: 8, H: 6, carrega: 0, viaDAigua: false, alcadaCarregaCm: 1.5 };
      }
      lab.accionsFetes.barcaProvada = true;
      notifica();
      return;
    }

    if (e.target.closest("[data-prova-barca-tanc]")) {
      lab.taula = "tanc";
      lab.tanc.modeEspecial = "barca";
      lab.accionsFetes.barcaProvada = true;
      notifica();
      return;
    }

    // 17. Calculadora i Conversor
    const btChipCalc = e.target.closest("[data-calc-chip]");
    if (btChipCalc) {
      const slot = ui.eines.calculadora.segSlot || "A";
      if (slot === "A") {
        ui.eines.calculadora.valA = btChipCalc.dataset.val;
        ui.eines.calculadora.uniA = btChipCalc.dataset.uni;
        ui.eines.calculadora.segSlot = "B";
      } else {
        ui.eines.calculadora.valB = btChipCalc.dataset.val;
        ui.eines.calculadora.uniB = btChipCalc.dataset.uni;
        ui.eines.calculadora.segSlot = "A";
      }
      renderitzaApp();
      return;
    }

    const btAnotaCalc = e.target.closest("[data-anota-calcul]");
    if (btAnotaCalc) {
      const objSel = lab.objectes[lab.objecteSeleccionat];
      anotaMesuraQuadern({
        objecteId: objSel?.id || "calcul",
        objecteNom: objSel?.nom || "Càlcul",
        magnitud: btAnotaCalc.dataset.mag || "Densitat calculada",
        valor: Number(btAnotaCalc.dataset.val),
        unitat: btAnotaCalc.dataset.uni,
        instrument: "Calculadora amb unitats"
      });
      mostraToast("Càlcul anotat al quadern científic.");
      return;
    }

    const btConvFam = e.target.closest("[data-conv-familia]");
    if (btConvFam) {
      ui.eines.conversor = { familia: btConvFam.dataset.convFamilia };
      renderitzaApp();
      return;
    }

    // 18. Panell lateral i Guia d'indagació
    const btPlega = e.target.closest("[data-plega-panell]");
    if (btPlega) {
      estat.panellPlegat = btPlega.dataset.plegaPanell === "true";
      notifica();
      return;
    }

    const btPanellTab = e.target.closest("[data-panell-tab]");
    if (btPanellTab) {
      estat.pestanyaPanell = btPanellTab.dataset.panellTab;
      notifica();
      return;
    }

    const btVesPas = e.target.closest("[data-ves-pas]");
    if (btVesPas) {
      estat.investigacio.pas = Number(btVesPas.dataset.vesPas);
      estat.investigacio.feedbackPas = null;
      notifica();
      return;
    }

    const btAvancaPas = e.target.closest("[data-avanca-pas]");
    if (btAvancaPas) {
      const inv = INVESTIGACIONS[estat.investigacio.id];
      if (inv && estat.investigacio.pas < inv.passos.length - 1) {
        estat.investigacio.pas += 1;
        estat.investigacio.feedbackPas = null;
        desaProgresEntradaInvestigacio(estat);
        notifica();
      }
      return;
    }

    const btConfirmaPrediu = e.target.closest("[data-confirma-prediu]");
    if (btConfirmaPrediu) {
      const inv = INVESTIGACIONS[estat.investigacio.id];
      const pas = inv?.passos?.[estat.investigacio.pas];
      const radioSel = document.querySelector('input[name="prediu-opcio"]:checked');
      const motSel = document.getElementById("sel-prediu-motiu")?.value || "";
      if (!radioSel) {
        estat.investigacio.feedbackPas = { ok: false, text: "Tria què penses que passarà abans de provar-ho." };
        notifica();
        return;
      }
      const opcio = (pas.opcions || []).find(o => o.id === radioSel.value);
      estat.investigacio.respostes.prediu = { opcioId: radioSel.value, motiuId: motSel };
      if (opcio?.idea) {
        registraEvidenciaIdea(estat.progres.diagnosi, {
          codi: opcio.idea,
          correcta: Boolean(opcio.correcta),
          context: `${inv.id}_prediu`
        });
      }
      estat.progres.evidencies.push({ dimensio: "raonament", valor: 5 });
      estat.investigacio.feedbackPas = { ok: true, text: "Predicció desada." };
      if (estat.investigacio.pas < inv.passos.length - 1) {
        estat.investigacio.pas += 1;
        estat.investigacio.feedbackPas = null;
      }
      desaProgresEntradaInvestigacio(estat);
      notifica();
      mostraToast("Predicció desada. Ara comprova-ho al laboratori.");
      return;
    }

    const btConfirmaExplica = e.target.closest("[data-confirma-explica]");
    if (btConfirmaExplica) {
      const inv = INVESTIGACIONS[estat.investigacio.id];
      const pas = inv?.passos?.[estat.investigacio.pas];
      const radioSel = document.querySelector('input[name="explica-opcio"]:checked');
      const opcioId = radioSel?.value || "";
      const av = avaluaRespostaPas(pas, { opcioId }, estat.configuracio.nivell);
      estat.investigacio.respostes.explica = { opcioId };

      if (av.ideaDetectada) {
        registraEvidenciaIdea(estat.progres.diagnosi, {
          codi: av.ideaDetectada,
          correcta: false,
          context: `${inv.id}_explica`
        });
      } else if (av.superat) {
        for (const codi of inv.idees || []) {
          registraEvidenciaIdea(estat.progres.diagnosi, {
            codi,
            correcta: true,
            context: `${inv.id}_explica`
          });
        }
      }

      estat.investigacio.feedbackPas = { ok: av.superat, text: av.missatge };
      if (av.superat && estat.investigacio.pas < inv.passos.length - 1) {
        estat.investigacio.pas += 1;
        estat.investigacio.feedbackPas = null;
      }
      desaProgresEntradaInvestigacio(estat);
      notifica();
      return;
    }

    const btConfirmaAplica = e.target.closest("[data-confirma-aplica]");
    if (btConfirmaAplica) {
      const inv = INVESTIGACIONS[estat.investigacio.id];
      const pas = inv?.passos?.[estat.investigacio.pas];
      const val = document.getElementById("input-aplica-valor")?.value || "";
      const uni = document.getElementById("sel-aplica-unitat")?.value || "";
      const av = avaluaRespostaPas(pas, { valor: val, unitat: uni }, estat.configuracio.nivell);
      estat.investigacio.respostes.aplica = { valor: val, unitat: uni };

      const pistesUsades = estat.investigacio.pistesPerPas?.[estat.investigacio.pas] || 0;
      const credit = pistesUsades === 0 ? 1 : pistesUsades === 1 ? 0.7 : 0.4;

      if (av.superat) {
        for (const codi of inv.idees || []) {
          registraEvidenciaIdea(estat.progres.diagnosi, {
            codi,
            correcta: true,
            context: `${inv.id}_aplica`,
            esAplicacio: true,
            creditParcial: credit
          });
        }
        if (!estat.progres.fetes.includes(inv.id)) {
          estat.progres.fetes.push(inv.id);
        }
        estat.investigacio.feedbackPas = {
          ok: true,
          text: "Molt bé, resposta correcta! Has completat la investigació."
        };
      } else {
        estat.investigacio.feedbackPas = { ok: false, text: av.missatge };
      }
      desaProgresEntradaInvestigacio(estat);
      notifica();
      return;
    }

    const btPista = e.target.closest("[data-demana-pista]");
    if (btPista) {
      const idx = Number(btPista.dataset.demanaPista);
      estat.investigacio.pistesPerPas[idx] = (estat.investigacio.pistesPerPas[idx] || 0) + 1;
      notifica();
      return;
    }

    // 19. Quadern i Exportacions
    const btQuadernFiltre = e.target.closest("[data-quadern-filtre]");
    if (btQuadernFiltre) {
      ui.quadernFiltre = btQuadernFiltre.dataset.quadernFiltre;
      renderitzaApp();
      return;
    }

    const btEsborraMesura = e.target.closest("[data-esborra-mesura]");
    if (btEsborraMesura) {
      const mId = btEsborraMesura.dataset.esborraMesura;
      estat.quadern.mesures = estat.quadern.mesures.filter(m => m.id !== mId);
      notifica();
      return;
    }

    if (e.target.closest("[data-exporta-pdf]")) {
      window.print();
      return;
    }

    if (e.target.closest("[data-exporta-csv]")) {
      const csv = generaCSVQuadern(estat.quadern.mesures);
      descarregaFitxer("quadern-densitat.csv", csv, "text/csv;charset=utf-8");
      return;
    }

    if (e.target.closest("[data-exporta-json]")) {
      descarregaFitxer(
        "sessio-densitat.json",
        JSON.stringify(estat, null, 2),
        "application/json;charset=utf-8"
      );
      return;
    }

    // 20. Consulta
    const btConsultaTab = e.target.closest("[data-consulta-tab]");
    if (btConsultaTab) {
      estat.pestanyaConsulta = btConsultaTab.dataset.consultaTab;
      notifica();
      return;
    }

    const btFiltreDens = e.target.closest("[data-filtre-densitat]");
    if (btFiltreDens) {
      ui.consultaOpcions.filtreEstat = btFiltreDens.dataset.filtreDensitat;
      renderitzaApp();
      return;
    }

    // 21. Progrés i Diagnòstic Bayesià
    const btResponBayes = e.target.closest("[data-respon-bayes]");
    if (btResponBayes) {
      const itemId = btResponBayes.dataset.responBayes;
      const opcioId = btResponBayes.dataset.opcioBayes;
      const item = BANC_DIAGNOSTIC_BAYESIA.find(q => q.id === itemId);
      if (item) {
        responItemDiagnosticBayesia(estat.progres.diagnosi.bayesia, item, opcioId, 0);
        notifica();
      }
      return;
    }

    if (e.target.closest("[data-reinicia-bayesia]")) {
      estat.progres.diagnosi.bayesia = creaEstatDiagnosiInicial().bayesia;
      notifica();
      return;
    }

    if (e.target.closest("[data-comenca-de-nou]")) {
      reiniciaSessioCompleta();
      mostraToast("Sessió reiniciada completament.");
      return;
    }

    // 22. Mode Docent
    const btCopiaInput = e.target.closest("[data-copia-input]");
    if (btCopiaInput) {
      const inp = document.getElementById(btCopiaInput.dataset.copiaInput);
      if (inp && navigator.clipboard) {
        navigator.clipboard.writeText(inp.value);
        mostraToast("Enllaç copiat al porta-retalls!");
      }
      return;
    }

    if (e.target.closest("[data-desa-escena]")) {
      const nom = document.getElementById("input-nom-escena")?.value || "Escena preparada";
      desaEscenaAmbNom(nom, estat.laboratori, estat.configuracio);
      renderitzaApp();
      mostraToast(`Escena «${nom}» desada al navegador.`);
      return;
    }

    const btCarregaEscena = e.target.closest("[data-carrega-escena]");
    if (btCarregaEscena) {
      const llista = carregaEscenesDesades();
      const esc = llista.find(x => x.id === btCarregaEscena.dataset.carregaEscena);
      if (esc) {
        desaSnapshotLaboratori();
        estat.laboratori = JSON.parse(JSON.stringify(esc.laboratori));
        estat.pantalla = "laboratori";
        notifica();
      }
      return;
    }

    if (e.target.closest("[data-executa-montecarlo]")) {
      ui.resultatMonteCarlo = validaSeparabilitatMonteCarlo(500, 20261116);
      renderitzaApp();
      return;
    }
  });

  // Escoltador delegat per a inputs i selects (change / input)
  document.addEventListener("change", e => {
    const estat = obteEstat();
    const lab = estat.laboratori;
    const t = e.target;

    if (t.id === "header-sel-nivell") {
      estat.configuracio.nivell = Number(t.value);
      notifica();
      return;
    }
    if (t.id === "sel-investigacio-activa") {
      obreInvestigacio(t.value);
      return;
    }
    if (t.id === "sel-afegeix-objecte" && t.value) {
      const id = t.value;
      if (OBJECTES_PRESTATGE[id]) {
        lab.objectes[id] = JSON.parse(JSON.stringify(OBJECTES_PRESTATGE[id]));
        lab.ubicacions[id] = "prestatge";
        if (!lab.objectesPrestatgeDestacats.includes(id)) {
          lab.objectesPrestatgeDestacats.push(id);
        }
        lab.objecteSeleccionat = id;
        notifica();
      }
      return;
    }
    if (t.id === "sel-model-balanca") {
      lab.balanca.model = t.value;
      notifica();
      return;
    }
    if (t.id === "sel-liq-balanca") {
      lab.balanca.liquidRecipient = t.value;
      notifica();
      return;
    }
    if (t.id === "sel-vol-balanca") {
      lab.balanca.volumRecipient = Number(t.value);
      notifica();
      return;
    }
    if (t.id === "sel-model-proveta") {
      const nouTipus = t.value;
      const rec = RECIPIENTS[nouTipus] || RECIPIENTS.proveta250;
      // Comprovem si l'objecte que hi ha actualment a la proveta hi cap
      const idObjP = Object.keys(lab.ubicacions).find(k => lab.ubicacions[k] === "proveta");
      if (idObjP && lab.objectes[idObjP]) {
        const chk = hiCapObjecte(lab.objectes[idObjP], rec);
        if (!chk.hiCap) {
          lab.ubicacions[idObjP] = "prestatge";
          lab.avísFisic = chk.motiu;
        }
      }
      lab.proveta.tipus = nouTipus;
      lab.proveta.volumInicial =
        nouTipus === "proveta25" ? 15 : nouTipus === "proveta100" ? 50 : 200;
      notifica();
      return;
    }
    if (t.id === "sel-liquid-vas") {
      lab.vas.liquid = t.value;
      notifica();
      return;
    }
    if (t.id === "chk-amb-cura") {
      lab.columna.ambCura = t.checked;
      notifica();
      return;
    }
    if (t.id === "sel-liquid-tanc") {
      lab.tanc.liquid = t.value;
      notifica();
      return;
    }
    if (t.id === "sel-astre-tanc" || t.id === "docent-sel-g") {
      estat.configuracio.g = Number(t.value);
      notifica();
      return;
    }
    if (t.id === "rng-immersio-din") {
      lab.tanc.fraccioImmersio = Number(t.value);
      notifica();
      return;
    }
    if (t.id === "chk-recolzat-fons") {
      lab.tanc.recolzatAlFons = t.checked;
      notifica();
      return;
    }
    if (t.id === "num-carrega-barca") {
      lab.taller.barca.carrega = Math.max(0, Number(t.value));
      lab.accionsFetes.barcaProvada = true;
      notifica();
      return;
    }
    if (t.id === "rng-submari-llast") {
      lab.tanc.submariVolumAigua = Number(t.value);
      lab.accionsFetes.submariProvat = true;
      notifica();
      return;
    }
    if (t.id === "rng-sonda-prof") {
      lab.tanc.sondaProfunditatCm = Number(t.value);
      lab.accionsFetes.sondaProvada = true;
      notifica();
      return;
    }
    if (t.id === "lupa-pos-ull") {
      lab.proveta.posicioUll = t.value;
      notifica();
      return;
    }
    if (t.id === "lupa-punt-lectura") {
      lab.proveta.puntLectura = t.value;
      notifica();
      return;
    }
    if (t.id === "cst-fixats") {
      lab.taller.constructor.fixats = t.value;
      notifica();
      return;
    }
    if (t.id === "cst-material") {
      lab.taller.constructor.material = t.value;
      notifica();
      return;
    }
    if (t.id === "cst-massa") {
      lab.taller.constructor.massa = Number(t.value);
      notifica();
      return;
    }
    if (t.id === "cst-volum") {
      lab.taller.constructor.volum = Number(t.value);
      notifica();
      return;
    }
    if (t.id === "buc-l" || t.id === "buc-b" || t.id === "buc-h") {
      lab.taller.barca.L = Number(document.getElementById("buc-l")?.value || lab.taller.barca.L);
      lab.taller.barca.B = Number(document.getElementById("buc-b")?.value || lab.taller.barca.B);
      lab.taller.barca.H = Number(document.getElementById("buc-h")?.value || lab.taller.barca.H);
      lab.accionsFetes.barcaProvada = true;
      notifica();
      return;
    }

    // Calculadora i Conversor
    if (["calc-val-a", "calc-uni-a", "calc-op", "calc-val-b", "calc-uni-b"].includes(t.id)) {
      ui.eines.calculadora.valA = document.getElementById("calc-val-a")?.value ?? "0";
      ui.eines.calculadora.uniA = document.getElementById("calc-uni-a")?.value ?? "g";
      ui.eines.calculadora.op = document.getElementById("calc-op")?.value ?? "÷";
      ui.eines.calculadora.valB = document.getElementById("calc-val-b")?.value ?? "1";
      ui.eines.calculadora.uniB = document.getElementById("calc-uni-b")?.value ?? "cm³";
      renderitzaApp();
      return;
    }

    if (["conv-val", "conv-orig", "conv-dest"].includes(t.id)) {
      ui.eines.conversor.valor = document.getElementById("conv-val")?.value ?? "1";
      ui.eines.conversor.uOrig = document.getElementById("conv-orig")?.value ?? "dm³";
      ui.eines.conversor.uDest = document.getElementById("conv-dest")?.value ?? "cm³";
      renderitzaApp();
      return;
    }

    // Comparador A / B
    if (t.dataset.compCol && t.dataset.compCamp) {
      ui.eines.comparador[t.dataset.compCol][t.dataset.compCamp] = t.value;
      renderitzaApp();
      return;
    }

    // Mode Docent toggles
    if (t.dataset.docentToggle) {
      const k = t.dataset.docentToggle;
      if (k === "analisi") {
        lab.visibilitat = t.checked ? "analisi" : "experimental";
      } else {
        estat.configuracio[k] = t.checked;
      }
      notifica();
      return;
    }

    // Importació de sessió JSON al Quadern
    if (t.id === "input-importa-json" && t.files?.[0]) {
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const dades = JSON.parse(String(ev.target.result));
          if (dades && dades.versio === 1) {
            Object.assign(estat, dades);
            notifica();
            mostraToast("Sessió JSON carregada correctament.");
          }
        } catch (err) {
          mostraToast("El fitxer JSON no té un format vàlid.");
        }
      };
      reader.readAsText(t.files[0]);
      return;
    }
  });

  // Escoltador per a camps de text en temps real (notes, cerca al glossari, nom d'alumne)
  document.addEventListener("input", e => {
    const estat = obteEstat();
    const t = e.target;
    if (t.id === "quadern-notes-area" || t.id === "panell-notes-area") {
      estat.quadern.notes = t.value;
      return;
    }
    if (t.id === "informe-nom-alumne") {
      estat.quadern.nomAlumne = t.value;
      return;
    }
    if (t.id === "informe-grup-alumne") {
      estat.quadern.grupAlumne = t.value;
      return;
    }
    if (t.id === "input-cerca-glossari") {
      ui.consultaOpcions.cercaGlossari = t.value;
      renderitzaApp();
      const el = document.getElementById("input-cerca-glossari");
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    }
  });

  // Arrossegar i deixar anar (Drag & Drop) des del prestatge cap a les estacions SVG
  let objArrossegatId = null;
  document.addEventListener("dragstart", e => {
    const item = e.target.closest("[data-drag-obj]");
    if (!item) return;
    objArrossegatId = item.dataset.dragObj;
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", objArrossegatId);
      e.dataTransfer.effectAllowed = "move";
    }
  });

  document.addEventListener("dragover", e => {
    const zona = e.target.closest("[data-drop-zone]");
    if (zona) {
      e.preventDefault();
      zona.classList.add("drag-over");
    }
  });

  document.addEventListener("dragleave", e => {
    const zona = e.target.closest("[data-drop-zone]");
    if (zona) zona.classList.remove("drag-over");
  });

  document.addEventListener("drop", e => {
    const zona = e.target.closest("[data-drop-zone]");
    if (!zona) return;
    e.preventDefault();
    zona.classList.remove("drag-over");
    const id = objArrossegatId || e.dataTransfer?.getData("text/plain");
    if (id) {
      executaMoureObjecte(id, zona.dataset.dropZone);
      objArrossegatId = null;
    }
  });

  // Dreceres de teclat (Ctrl+Z per desfer, Ctrl+Y per refer)
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (ui.menuObert) {
        tancaMenus();
      } else if (obteEstat().laboratori.einaActiva) {
        obteEstat().laboratori.einaActiva = null;
        notifica();
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      desfesLaboratori();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
      e.preventDefault();
      refesLaboratori();
    }
  });
}

function desaProgresEntradaInvestigacio(estat) {
  const invId = estat.investigacio.id;
  estat.quadern.entrades[invId] = {
    ultimPas: estat.investigacio.pas,
    respostes: JSON.parse(JSON.stringify(estat.investigacio.respostes))
  };
}

function aplicaParametresInicialsHash() {
  const params = llegeixParametresHash();
  const estat = obteEstat();
  if (params.nivell) {
    estat.configuracio.nivell = params.nivell;
    estat.configuracio.nivellFixatPerDocent = Boolean(params.nivellFixatPerDocent);
  }
  if (typeof params.lecturaFacil === "boolean") estat.configuracio.lecturaFacil = params.lecturaFacil;
  if (typeof params.nombresSenzills === "boolean") estat.configuracio.nombresSenzills = params.nombresSenzills;
  if (typeof params.pistesActives === "boolean") estat.configuracio.pistesActives = params.pistesActives;
  if (params.inv && INVESTIGACIONS[params.inv]) {
    obreInvestigacio(params.inv);
  }
  if (params.escena && typeof params.escena === "object") {
    Object.assign(estat.laboratori, params.escena);
    estat.pantalla = "laboratori";
  }
}

export function iniciaAplicacio() {
  aplicaParametresInicialsHash();
  subscriu(renderitzaApp);
  inicialitzaEsdeveniments();
  window.addEventListener("resize", ajustaEscalaPantalla);
  window.addEventListener("hashchange", () => {
    aplicaParametresInicialsHash();
    renderitzaApp();
  });
  renderitzaApp();
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciaAplicacio);
  } else {
    iniciaAplicacio();
  }
}
