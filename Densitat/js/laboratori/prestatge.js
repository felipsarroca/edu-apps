/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Prestatge d'objectes persistents amb filtre intel·ligent («Activitat» vs «Tots»),
 * fitxa de l'objecte (mode experimental vs mode d'anàlisi) i selector d'ampolles de líquids (04-laboratori-i-instruments.md §1, §4, §6).
 */

import { MATERIALS } from "../dades/materials.js";
import { LIQUIDS } from "../dades/liquids.js";
import { OBJECTES_PRESTATGE } from "../dades/objectes.js";
import { INVESTIGACIONS } from "../dades/investigacions/index.js";
import { magnitudsObjecte } from "../fisica/objecte.js";
import { formataNombre } from "../fisica/unitats.js";
import { icona } from "../eines/icones.js";

const ETIQUETA_UBICACIO = {
  prestatge: "Prestatge",
  balanca: "Balança",
  proveta: "Proveta",
  vas: "Vas",
  columna: "Columna",
  tanc: "Tanc",
  dinamometre: "Dinamòmetre",
  taller: "Taller"
};

/**
 * Renderitza el prestatge lateral d'objectes i la fitxa de l'objecte seleccionat.
 */
export function renderitzaPrestatge(estat) {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
  const invActiva = INVESTIGACIONS[estat.investigacio?.id] || INVESTIGACIONS.C4;

  // Objectes protagonistes de l'activitat actual (o kit bàsic per taula)
  const kitTaula =
    lab.taula === "columna"
      ? ["ou", "bola_col_poliestire", "bola_col_cera", "bola_col_polietile", "bola_col_nilo", "bola_col_estany"]
      : lab.taula === "tanc"
      ? ["A", "B", "corona", "lingot_or", "arq_plast_50", "arq_acer_50", "bola_buida_fina"]
      : ["A", "B", "C", "patata", "pedra"];

  const idsActivitat = new Set([
    ...(invActiva?.escena?.objectes || []),
    ...kitTaula
  ]);

  // Afegim sempre qualsevol objecte en ús, tallat o construït
  for (const [id, ub] of Object.entries(lab.ubicacions || {})) {
    if (ub !== "prestatge" || id.includes("_") || id.startsWith("const_")) {
      if (ub !== "prestatge" || id.startsWith("patata_") || id.startsWith("B_") || id.startsWith("const_")) {
        idsActivitat.add(id);
      }
    }
  }

  const totsCatalogIds = Object.keys(lab.objectes || {});
  const mostraTots = Boolean(lab.mostraTotsPrestatge);
  const llistaRender = mostraTots ? totsCatalogIds : [...idsActivitat].filter(id => lab.objectes[id]);

  const objSelId =
    lab.objecteSeleccionat && lab.objectes[lab.objecteSeleccionat]
      ? lab.objecteSeleccionat
      : llistaRender[0] || "A";
  const objSel = lab.objectes[objSelId];

  const fitxesHtml = llistaRender
    .map(id => {
      const obj = lab.objectes[id];
      if (!obj) return "";
      const ub = lab.ubicacions[id] || "prestatge";
      const matId = obj.parts?.[0]?.material || "alumini";
      const mat = MATERIALS[matId] || MATERIALS.alumini;
      const color = obj.misteri ? "#94A3B8" : mat.aspecte?.color || "#CBD5E1";
      const contorn = obj.misteri ? "#475569" : mat.aspecte?.contorn || "#475569";
      const actiu = id === objSelId;

      return `
        <button type="button"
                class="fitxa-prestatge ${actiu ? "seleccionada" : ""} ${ub !== "prestatge" ? "en-us" : ""}"
                data-selecciona-obj="${id}"
                draggable="true"
                data-drag-obj="${id}"
                title="${obj.nom} (${ETIQUETA_UBICACIO[ub] || ub})">
          <span class="fitxa-mostra-svg" style="background:${color};border-color:${contorn}">${obj.etiqueta || id}</span>
          <span class="fitxa-prestatge-info">
            <strong>${obj.nom}</strong>
            <small class="badge-ubicacio ${ub !== "prestatge" ? "ub-activa" : ""}">${ETIQUETA_UBICACIO[ub] || ub}</small>
          </span>
        </button>
      `;
    })
    .join("");

  // Opcions per afegir qualsevol altre objecte del catàleg al prestatge
  const altresObjectes = Object.values(OBJECTES_PRESTATGE).filter(o => !idsActivitat.has(o.id));

  return `
    <aside class="laboratori-prestatge" aria-label="Prestatge d'objectes i líquids">
      <div class="prestatge-cap">
        <h4>Prestatge</h4>
        <button type="button" class="bt-link bt-petit" data-endreca="true" title="Torna tots els objectes al prestatge">
          Endreça
        </button>
      </div>

      <div class="prestatge-filtre-tabs" role="tablist" aria-label="Filtre d'objectes del prestatge">
        <button type="button" class="bt-filtre-prest ${!mostraTots ? "actiu" : ""}" data-filtre-prestatge="activitat">
          Activitat (${[...idsActivitat].filter(id => lab.objectes[id]).length})
        </button>
        <button type="button" class="bt-filtre-prest ${mostraTots ? "actiu" : ""}" data-filtre-prestatge="tots">
          Catàleg (${totsCatalogIds.length})
        </button>
      </div>

      <div class="prestatge-llista" role="listbox" aria-label="Objectes disponibles">
        ${fitxesHtml}
      </div>

      ${
        altresObjectes.length > 0 && !mostraTots
          ? `<div class="prestatge-afegir">
              <select id="sel-afegeix-objecte" aria-label="Afegeix més objectes al prestatge">
                <option value="">+ Afegeix peça del catàleg...</option>
                ${altresObjectes.map(o => `<option value="${o.id}">${o.etiqueta} · ${o.nom}</option>`).join("")}
              </select>
            </div>`
          : ""
      }

      ${objSel ? renderitzaFitxaObjecteSeleccionat(estat, objSel) : ""}

      <div class="prestatge-liquids">
        <h4>Líquids del laboratori</h4>
        <div class="ampolles-grid">
          ${["aigua", "alcohol", "oli", "aigua_salada", "mel", "mercuri", "gasolina"]
            .map(lId => {
              const l = LIQUIDS[lId];
              if (!l) return "";
              const actiu =
                (lab.taula === "mesura" && lab.vas.liquid === lId) ||
                (lab.taula === "tanc" && lab.tanc.liquid === lId);
              const nomCurt = lId === "aigua_salada" ? "aigua salada" : l.nom.split(" ")[0];
              const pictograma =
                l.perill === "toxic" || l.perill === "inflamable"
                  ? `<span class="picto-perill" title="${l.perill === "toxic" ? "Tòxic" : "Inflamable"}: precaució al laboratori">${icona("avís", "ic-perill")}</span>`
                  : "";
              return `
                <button type="button" class="bt-ampolla ${actiu ? "activa" : ""}" data-canvia-liquid="${lId}" title="${l.nom} (${formataNombre(cfg.nombresSenzills ? l.dEscolar : l.dReferencia, 2)} g/cm³)">
                  <span class="gota-color" style="background:${l.color}"></span>
                  <span class="ampolla-nom">${nomCurt}</span>
                  ${pictograma}
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
    </aside>
  `;
}

/**
 * Renderitza la fitxa de l'objecte seleccionat, respectant el mode experimental vs anàlisi
 * i permetent alternar-lo amb un clic (04-laboratori-i-instruments.md §6).
 */
function renderitzaFitxaObjecteSeleccionat(estat, obj) {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
  const modeAnalisi = lab.visibilitat === "analisi";
  const mag = magnitudsObjecte(obj, {
    materials: MATERIALS,
    nombresSenzills: cfg.nombresSenzills,
    g: cfg.g
  });

  // Busquem al quadern quines mesures ha anotat l'alumne per a aquest objecte
  const mesuresObj = (estat.quadern?.mesures || []).filter(m => m.objecteId === obj.id);
  const mAnotada = mesuresObj.find(m => m.unitat === "g" || m.unitat === "kg");
  const vAnotat = mesuresObj.find(m => m.unitat === "cm³" || m.unitat === "mL");
  const dAnotada = mesuresObj.find(m => m.unitat === "g/cm³" || m.unitat === "g/mL");

  const txtMassa = modeAnalisi
    ? `${formataNombre(mag.massa)} g`
    : mAnotada
    ? `${formataNombre(mAnotada.valor)} ${mAnotada.unitat} ✓`
    : "— (pesa'l)";

  const txtVolum = modeAnalisi
    ? `${formataNombre(mag.volumExterior)} cm³`
    : vAnotat
    ? `${formataNombre(vAnotat.valor)} ${vAnotat.unitat} ✓`
    : "— (mesura'l)";

  const txtDensitat = modeAnalisi
    ? `${formataNombre(mag.densitatMitjana, 2)} g/cm³`
    : dAnotada
    ? `${formataNombre(dAnotada.valor, 2)} ${dAnotada.unitat} ✓`
    : "— (calcula-la)";

  const matId = obj.parts?.[0]?.material;
  const matInfo = MATERIALS[matId];
  const txtMaterial = obj.misteri && !modeAnalisi ? "? (a descobrir)" : matInfo?.nom || matId;

  const ubActual = lab.ubicacions[obj.id] || "prestatge";

  // Destinacions ràpides segons la taula activa (alternativa accessible a arrossegar o fer clic a l'escena, 04 §2)
  let destinacions = [];
  if (lab.taula === "mesura") {
    destinacions = [
      { id: "balanca", label: "Balança" },
      { id: "proveta", label: "Proveta" },
      { id: "vas", label: "Vas" },
      { id: "prestatge", label: "Prestatge" }
    ];
  } else if (lab.taula === "columna") {
    destinacions = [
      { id: "columna", label: "Columna" },
      { id: "vas", label: "Vas amb sal" },
      { id: "prestatge", label: "Prestatge" }
    ];
  } else if (lab.taula === "tanc") {
    destinacions = [
      { id: "tanc", label: "Tanc / Vessament" },
      { id: "dinamometre", label: "Dinamòmetre" },
      { id: "prestatge", label: "Prestatge" }
    ];
  } else if (lab.taula === "taller") {
    destinacions = [
      { id: "taller", label: "Banc del taller" },
      { id: "prestatge", label: "Prestatge" }
    ];
  }

  return `
    <div class="fitxa-detall-objecte" role="region" aria-label="Fitxa de l'objecte ${obj.nom}">
      <div class="fitxa-detall-cap">
        <strong>${obj.etiqueta} · ${obj.nom}</strong>
        <button type="button" class="badge-mode-vis ${modeAnalisi ? "mode-analisi-actiu" : ""}" data-toggle-visibilitat="true" title="Canvia entre mode Experimental (descobreix mesurant) i mode Anàlisi (mostra dades de referència)">
          ${modeAnalisi ? "Anàlisi (dades)" : "Experimental"}
        </button>
      </div>
      <dl class="fitxa-dl">
        <div><dt>Massa</dt><dd class="num-tabular">${txtMassa}</dd></div>
        <div><dt>Volum</dt><dd class="num-tabular">${txtVolum}</dd></div>
        <div><dt>Densitat</dt><dd class="num-tabular">${txtDensitat}</dd></div>
        <div><dt>Material</dt><dd>${txtMaterial}</dd></div>
      </dl>
      <div class="fitxa-destinacions">
        <span class="etiqueta-petita">Col·loca a (o fes clic a l'instrument):</span>
        <div class="bts-destinacio">
          ${destinacions
            .map(
              d => `
            <button type="button" class="bt-desti ${ubActual === d.id ? "actiu" : ""}" data-mou-obj="${obj.id}" data-desti="${d.id}">
              ${d.label}
            </button>`
            )
            .join("")}
        </div>
      </div>
      <div class="fitxa-accions-rapides">
        ${
          matInfo?.tallable
            ? `<button type="button" class="bt bt-secundari bt-petit" data-talla-rapid="${obj.id}" data-frac="0.5" title="Talla per la meitat">
                ${icona("ganivet")} Talla 1/2
              </button>`
            : ""
        }
        ${
          matInfo?.deformable
            ? `<button type="button" class="bt bt-secundari bt-petit" data-modela-rapid="${obj.id}">
                ${icona("taller")} Modela (${obj.formaModelada || "bola"})
              </button>`
            : ""
        }
      </div>
    </div>
  `;
}
