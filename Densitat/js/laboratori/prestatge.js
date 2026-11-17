/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Prestatge d'objectes persistents: llista dels objectes de l'activitat (amb accés a tot el catàleg),
 * fitxa de l'objecte triat amb les destinacions possibles i, en la vista completa, les ampolles de líquids
 * (04-laboratori-i-instruments.md §1, §4, §6).
 */

import { MATERIALS } from "../dades/materials.js";
import { LIQUIDS } from "../dades/liquids.js";
import { OBJECTES_PRESTATGE } from "../dades/objectes.js";
import { INVESTIGACIONS } from "../dades/investigacions/index.js";
import { magnitudsObjecte } from "../fisica/objecte.js";
import { formataNombre } from "../fisica/unitats.js";
import { icona } from "../eines/icones.js";

const ETIQUETA_UBICACIO = {
  prestatge: "Al prestatge",
  balanca: "A la balança",
  proveta: "A la proveta",
  vas: "Al vas",
  columna: "A la columna",
  tanc: "Al tanc",
  dinamometre: "Al dinamòmetre",
  taller: "Al taller"
};

const ICONA_DESTI = {
  balanca: "balanca",
  proveta: "proveta",
  vas: "vas",
  columna: "proveta",
  tanc: "tanc",
  dinamometre: "dinamometre",
  taller: "taller"
};

/**
 * Renderitza el prestatge lateral d'objectes i la fitxa de l'objecte seleccionat.
 */
export function renderitzaPrestatge(estat) {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
  const completa = Boolean(cfg.vistaCompleta);
  const invActiva = INVESTIGACIONS[estat.investigacio?.id] || INVESTIGACIONS.C4;

  // Objectes protagonistes de l'activitat actual (o kit bàsic per taula)
  const kitTaula =
    lab.taula === "columna"
      ? ["ou", "bola_col_poliestire", "bola_col_cera", "bola_col_polietile", "bola_col_nilo", "bola_col_estany"]
      : lab.taula === "tanc"
      ? ["A", "B", "corona", "lingot_or", "arq_plast_50", "arq_acer_50", "bola_buida_fina"]
      : ["A", "B", "C", "patata", "pedra"];

  const idsActivitat = new Set([
    ...(estat.modeLaboratori === "investigacio" ? invActiva?.escena?.objectes || [] : []),
    ...kitTaula
  ]);

  // Afegim sempre qualsevol objecte en ús, tallat o construït
  for (const [id, ub] of Object.entries(lab.ubicacions || {})) {
    if (ub !== "prestatge" || !OBJECTES_PRESTATGE[id]) {
      idsActivitat.add(id);
    }
  }

  const totsCatalogIds = Object.keys(lab.objectes || {});
  const mostraTots = Boolean(lab.mostraTotsPrestatge);
  const idsActivitatValids = [...idsActivitat].filter(id => lab.objectes[id]);
  const llistaRender = mostraTots ? totsCatalogIds : idsActivitatValids;

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
      const enUs = ub !== "prestatge";

      return `
        <button type="button"
                class="fitxa-prestatge ${actiu ? "seleccionada" : ""} ${enUs ? "en-us" : ""}"
                data-selecciona-obj="${id}"
                draggable="true"
                data-drag-obj="${id}"
                aria-pressed="${actiu}"
                title="${obj.nom} (${ETIQUETA_UBICACIO[ub] || ub})">
          <span class="fitxa-mostra-svg" style="background:${color};border-color:${contorn}">${obj.etiqueta || id}</span>
          <span class="fitxa-prestatge-info">
            <strong>${obj.nom}</strong>
            ${enUs || completa ? `<small class="badge-ubicacio ${enUs ? "ub-activa" : ""}">${ETIQUETA_UBICACIO[ub] || ub}</small>` : ""}
          </span>
        </button>
      `;
    })
    .join("");

  // Opcions per afegir qualsevol altre objecte del catàleg al prestatge (vista completa)
  const altresObjectes = Object.values(OBJECTES_PRESTATGE).filter(o => !idsActivitat.has(o.id));

  const capcaleraLlista = completa
    ? `
      <div class="prestatge-filtre-tabs" role="tablist" aria-label="Filtre d'objectes del prestatge">
        <button type="button" class="bt-filtre-prest ${!mostraTots ? "actiu" : ""}" data-filtre-prestatge="activitat">
          Activitat (${idsActivitatValids.length})
        </button>
        <button type="button" class="bt-filtre-prest ${mostraTots ? "actiu" : ""}" data-filtre-prestatge="tots">
          Catàleg (${totsCatalogIds.length})
        </button>
      </div>`
    : `<p class="prestatge-ajuda">Tria'n un i posa'l en un instrument.</p>`;

  const peuLlista = completa
    ? altresObjectes.length > 0 && !mostraTots
      ? `<div class="prestatge-afegir">
          <select id="sel-afegeix-objecte" aria-label="Afegeix més objectes al prestatge">
            <option value="">+ Afegeix peça del catàleg...</option>
            ${altresObjectes.map(o => `<option value="${o.id}">${o.etiqueta} · ${o.nom}</option>`).join("")}
          </select>
        </div>`
      : ""
    : `<button type="button" class="bt-mes-objectes" data-filtre-prestatge="${mostraTots ? "activitat" : "tots"}">
        ${mostraTots ? `${icona("enrere")} Només els d'aquesta activitat` : `${icona("anota")} Més objectes (${totsCatalogIds.length})`}
      </button>`;

  const liquidsHtml = completa
    ? `
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
      </div>`
    : "";

  return `
    <aside class="laboratori-prestatge ${completa ? "" : "prestatge-senzill"}" aria-label="Objectes del laboratori">
      <div class="prestatge-cap">
        <h4>${completa ? "Prestatge" : "Objectes"}</h4>
        <button type="button" class="bt-link bt-petit" data-endreca="true" title="Torna tots els objectes al prestatge">
          Endreça
        </button>
      </div>

      ${capcaleraLlista}

      <div class="prestatge-llista" role="group" aria-label="Objectes disponibles">
        ${fitxesHtml}
      </div>

      ${peuLlista}

      ${objSel ? renderitzaFitxaObjecteSeleccionat(estat, objSel) : ""}

      ${liquidsHtml}
    </aside>
  `;
}

/**
 * Renderitza la fitxa de l'objecte seleccionat: on es pot posar, què se'n pot fer i què se n'ha descobert.
 * Respecta el mode experimental (només el que l'alumne ha mesurat) i el mode d'anàlisi (dades reals) (04 §6).
 */
function renderitzaFitxaObjecteSeleccionat(estat, obj) {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
  const completa = Boolean(cfg.vistaCompleta);
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

  const pendent = text => `<span class="dada-pendent">${text}</span>`;
  const sabuda = text => `<span class="dada-sabuda">${text}</span>`;

  const txtMassa = modeAnalisi
    ? sabuda(`${formataNombre(mag.massa)} g`)
    : mAnotada
    ? sabuda(`${formataNombre(mAnotada.valor)} ${mAnotada.unitat}`)
    : pendent("pesa'l");

  const txtVolum = modeAnalisi
    ? sabuda(`${formataNombre(mag.volumExterior)} cm³`)
    : vAnotat
    ? sabuda(`${formataNombre(vAnotat.valor)} ${vAnotat.unitat}`)
    : pendent("mesura'l");

  const txtDensitat = modeAnalisi
    ? sabuda(`${formataNombre(mag.densitatMitjana, 2)} g/cm³`)
    : dAnotada
    ? sabuda(`${formataNombre(dAnotada.valor, 2)} ${dAnotada.unitat}`)
    : pendent("calcula-la");

  const matId = obj.parts?.[0]?.material;
  const matInfo = MATERIALS[matId];
  const txtMaterial = obj.misteri && !modeAnalisi ? pendent("a descobrir") : matInfo?.nom || matId;

  const ubActual = lab.ubicacions[obj.id] || "prestatge";

  // Destinacions segons la zona de treball activa (alternativa accessible a arrossegar o fer clic a l'escena, 04 §2)
  let destinacions = [];
  if (lab.taula === "mesura") {
    destinacions = [
      { id: "balanca", label: "Balança" },
      { id: "proveta", label: "Proveta" },
      { id: "vas", label: "Vas" }
    ];
  } else if (lab.taula === "columna") {
    destinacions = [
      { id: "columna", label: "Columna" },
      { id: "vas", label: "Vas amb sal" }
    ];
  } else if (lab.taula === "tanc") {
    destinacions = [
      { id: "tanc", label: "Tanc" },
      { id: "dinamometre", label: "Dinamòmetre" }
    ];
  } else if (lab.taula === "taller") {
    destinacions = [{ id: "taller", label: "Banc del taller" }];
  }

  return `
    <div class="fitxa-detall-objecte" role="region" aria-label="Fitxa de l'objecte ${obj.nom}">
      <div class="fitxa-detall-cap">
        <strong>${obj.etiqueta} · ${obj.nom}</strong>
        ${
          completa
            ? `<button type="button" class="badge-mode-vis ${modeAnalisi ? "mode-analisi-actiu" : ""}" data-toggle-visibilitat="true" title="Canvia entre mode Experimental (descobreix mesurant) i mode Anàlisi (mostra dades de referència)">
                ${modeAnalisi ? "Anàlisi (dades)" : "Experimental"}
              </button>`
            : ""
        }
      </div>

      <div class="fitxa-destinacions">
        <span class="etiqueta-petita">Posa'l a…</span>
        <div class="bts-destinacio">
          ${destinacions
            .map(
              d => `
            <button type="button" class="bt-desti ${ubActual === d.id ? "actiu" : ""}" data-mou-obj="${obj.id}" data-desti="${d.id}" aria-pressed="${ubActual === d.id}">
              ${icona(ICONA_DESTI[d.id] || "laboratori")} <span>${d.label}</span>
            </button>`
            )
            .join("")}
        </div>
        ${
          ubActual !== "prestatge"
            ? `<button type="button" class="bt-torna-prestatge" data-mou-obj="${obj.id}" data-desti="prestatge">
                ${icona("enrere")} Torna'l al prestatge
              </button>`
            : ""
        }
      </div>

      ${
        matInfo?.tallable || matInfo?.deformable
          ? `<div class="fitxa-accions-rapides">
              ${
                matInfo?.tallable
                  ? `<button type="button" class="bt bt-secundari bt-petit" data-talla-rapid="${obj.id}" data-frac="0.5" title="Divideix l'objecte en dues meitats">
                      ${icona("ganivet")} Talla per la meitat
                    </button>`
                  : ""
              }
              ${
                matInfo?.deformable
                  ? `<button type="button" class="bt bt-secundari bt-petit" data-modela-rapid="${obj.id}" title="Dona-li una altra forma (ara: ${obj.formaModelada || "bola"})">
                      ${icona("taller")} Modela (canvia la forma)
                    </button>`
                  : ""
              }
            </div>`
          : ""
      }

      <dl class="fitxa-dl">
        <div><dt>Massa</dt><dd>${txtMassa}</dd></div>
        <div><dt>Volum</dt><dd>${txtVolum}</dd></div>
        <div><dt>Densitat</dt><dd>${txtDensitat}</dd></div>
        <div><dt>Material</dt><dd>${txtMaterial}</dd></div>
      </dl>

      ${
        completa
          ? ""
          : `<button type="button" class="bt-link bt-dades-reals" data-toggle-visibilitat="true" title="Mostra o amaga la massa, el volum i la densitat reals de cada objecte">
              ${modeAnalisi ? "Amaga les dades reals" : "Mostra les dades reals"}
            </button>`
      }
    </div>
  `;
}
