/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Vistes sincronitzades d'anàlisi i visualitzadors pedagògics:
 * - Vectors proporcionals de força sense solapament amb l'objecte (08-disseny-visual-i-interaccio.md §6.4)
 * - Vista comparativa de cubets d'1 cm³: objecte vs líquid (08-disseny-visual-i-interaccio.md §6.2)
 * - Vista de composició volumètrica Vext = Vmat + Vbuit (08-disseny-visual-i-interaccio.md §6.3)
 * - Model didàctic de partícules amb límits explícits (08-disseny-visual-i-interaccio.md §6.6)
 * - Escala visual de densitats i frontera de flotació en viu (d_obj vs d_líq)
 */

import { MATERIALS } from "../dades/materials.js";
import { formataNombre } from "../fisica/unitats.js";
import { magnitudsObjecte } from "../fisica/objecte.js";

/**
 * Dibuixa els vectors proporcionals de força (P, E, N, T) sobre un objecte en coordenades SVG,
 * evitant qualsevol solapament amb l'etiqueta central de l'objecte i mostrant l'equilibri ΣF.
 * @param {object} params
 * @param {number} params.cx Centre X de l'objecte al SVG
 * @param {number} params.cy Centre Y de l'objecte al SVG
 * @param {number} params.pes Pes P (N)
 * @param {number} params.empenyiment Empenyiment E (N)
 * @param {number} [params.normal=0] Força normal N (N)
 * @param {number} [params.tensio=0] Tensió del fil T (N)
 * @param {boolean} [params.mostraValors=true]
 * @returns {string} Fragment SVG
 */
export function dibuixaVectorsForcaSVG(params) {
  const {
    cx,
    cy,
    pes = 0,
    empenyiment = 0,
    normal = 0,
    tensio = 0,
    mostraValors = true
  } = params;

  const escalaPxPerN = 24;
  const longVector = f => Math.max(22, Math.min(82, Math.abs(f) * escalaPxPerN));

  const fletxaVertical = (x, yInici, longitud, sentitAvall, color, simbol, valorN, costatEti = "dreta") => {
    if (valorN <= 0.005) return "";
    const dy = sentitAvall ? longitud : -longitud;
    const yFi = yInici + dy;
    const puntaY = sentitAvall ? yFi - 7 : yFi + 7;
    const esEsquerra = costatEti === "esquerra";
    const textEti = mostraValors ? `${simbol} = ${formataNombre(valorN, 2)} N` : simbol;
    const wBox = mostraValors ? 72 : 24;
    const boxX = esEsquerra ? x - wBox - 7 : x + 7;
    const textX = boxX + wBox / 2;

    return `
      <g class="vector-forca">
        <circle cx="${x}" cy="${yInici}" r="3" fill="${color}" stroke="#FFFFFF" stroke-width="1"/>
        <line x1="${x}" y1="${yInici}" x2="${x}" y2="${yFi}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        <polygon points="${x},${yFi} ${x - 5.5},${puntaY} ${x + 5.5},${puntaY}" fill="${color}"/>
        <rect x="${boxX}" y="${yFi - 9}" width="${wBox}" height="17" rx="4" fill="#FFFFFF" stroke="${color}" stroke-width="1.2" opacity="0.96"/>
        <text x="${textX}" y="${yFi + 3}" fill="${color}" font-size="10" font-weight="700" text-anchor="middle">${textEti}</text>
      </g>
    `;
  };

  const parts = [];
  // Pes P (taronja #C2410C, neix de la part inferior de l'objecte cap avall)
  parts.push(fletxaVertical(cx - 8, cy + 14, longVector(pes), true, "#C2410C", "P", pes, "esquerra"));
  // Empenyiment E (blau fosc #1553A1, neix de la part superior cap amunt)
  parts.push(fletxaVertical(cx + 8, cy - 14, longVector(empenyiment), false, "#1553A1", "E", empenyiment, "dreta"));
  // Normal N (gris fosc #475569, cap amunt a la dreta)
  if (normal > 0.005) {
    parts.push(fletxaVertical(cx + 22, cy - 10, longVector(normal), false, "#475569", "N", normal, "dreta"));
  }
  // Tensió T (verd fosc #0F766E, cap amunt a l'esquerra)
  if (tensio > 0.005) {
    parts.push(fletxaVertical(cx - 22, cy - 10, longVector(tensio), false, "#0F766E", "T", tensio, "esquerra"));
  }

  return `<g class="capa-vectors-forca">${parts.join("")}</g>`;
}

/**
 * Renderitza l'escala visual de densitats i flotació en viu (comparador d_objecte vs d_líquid).
 * Mostra la frontera del líquid actual i situa els objectes mesurats (o tots en mode anàlisi) a la zona SURA (d < dL) o S'ENFONSA (d > dL).
 */
export function renderitzaEscalaDensitatsViva(estat, dLiquid = 1.0, nomLiquid = "aigua") {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
  const modeAnalisi = lab.visibilitat === "analisi";

  // Mapa no lineal suau per representar de 0 a 3,2 g/cm³ (i comprimir valors > 3,2 fins a 14)
  const posPct = d => {
    if (d <= 2.0) return Math.max(2, Math.min(98, (d / 2.0) * 68));
    return Math.max(68, Math.min(97, 68 + ((Math.min(14, d) - 2.0) / 12.0) * 29));
  };

  const pctLiq = posPct(dLiquid);

  // Recollim quins objectes mostrar a la regleta:
  // En mode Anàlisi: els objectes actualment en taula + seleccionat.
  // En mode Experimental: els objectes dels quals l'alumne ja ha anotat massa i volum (o densitat) al quadern, més l'objecte seleccionat si ja té densitat anotada.
  const mesures = estat.quadern?.mesures || [];
  const puntsObjectes = [];
  const idsCandidats = new Set([
    lab.objecteSeleccionat,
    ...Object.keys(lab.ubicacions).filter(k => lab.ubicacions[k] !== "prestatge"),
    ...(lab.objectesPrestatgeDestacats || []).slice(0, 6)
  ]);

  for (const id of idsCandidats) {
    const obj = lab.objectes[id];
    if (!obj) continue;
    const mag = magnitudsObjecte(obj, {
      materials: MATERIALS,
      nombresSenzills: cfg.nombresSenzills,
      g: cfg.g
    });
    const mObj = mesures.filter(m => m.objecteId === id);
    const teDensAnotada = mObj.some(m => m.unitat === "g/cm³" || m.unitat === "g/mL");
    const teMassaIVolum =
      mObj.some(m => m.unitat === "g" || m.unitat === "kg") &&
      mObj.some(m => m.unitat === "cm³" || m.unitat === "mL");

    if (modeAnalisi || teDensAnotada || teMassaIVolum) {
      const matId = obj.parts?.[0]?.material || "alumini";
      const mat = MATERIALS[matId] || MATERIALS.alumini;
      puntsObjectes.push({
        id: obj.id,
        etiqueta: obj.etiqueta || obj.id,
        nom: obj.nom,
        densitat: mag.densitatMitjana,
        pct: posPct(mag.densitatMitjana),
        sura: mag.densitatMitjana < dLiquid - 1e-4,
        color: obj.misteri ? "#94A3B8" : mat.aspecte?.color || "#CBD5E1"
      });
    }
  }

  // En la vista senzilla, l'escala només apareix quan hi ha algun objecte per situar-hi:
  // així no ocupa espai ni avança la resposta abans que l'alumne hagi mesurat res.
  if (!cfg.vistaCompleta && puntsObjectes.length === 0) return "";

  return `
    <div class="escala-densitats-card" role="region" aria-label="Escala comparativa de densitats i frontera de flotació">
      <div class="escala-densitats-cap">
        <span class="escala-titol">
          <strong>${cfg.vistaCompleta ? "Regla visual de flotació:" : "On queda cada objecte?"}</strong>
          <span class="pindola-zona-sura">SURA si <em>d</em><sub>obj</sub> &lt; <em>d</em><sub>líq</sub></span>
          <span class="pindola-frontera">Frontera (${nomLiquid}): <strong>${formataNombre(dLiquid, 2)} g/cm³</strong></span>
          <span class="pindola-zona-enfonsa">S'ENFONSA si <em>d</em><sub>obj</sub> &gt; <em>d</em><sub>líq</sub></span>
        </span>
        <span class="etiqueta-petita">
          ${
            puntsObjectes.length === 0
              ? "Mesura i calcula la densitat d'un objecte (o activa el mode «Anàlisi» al prestatge) per veure'l situat a l'escala."
              : `${puntsObjectes.length} objecte(s) situats a l'escala`
          }
        </span>
      </div>

      <div class="escala-barra-wrap">
        <div class="escala-zona-sura" style="width:${pctLiq}%">
          <span>← ZONA DE FLOTACIÓ (SURA)</span>
        </div>
        <div class="escala-zona-enfonsa" style="left:${pctLiq}%;width:${100 - pctLiq}%">
          <span>ZONA D'ENFONSAMENT (VA AL FONS) →</span>
        </div>

        <!-- Marques de l'escala -->
        ${[0.25, 0.5, 0.8, 1.0, 1.2, 1.5, 2.0, 2.7, 7.8, 11.3]
          .map(
            v => `
          <span class="escala-tick" style="left:${posPct(v)}%">
            <small>${formataNombre(v, v < 1 ? 2 : 1)}</small>
          </span>`
          )
          .join("")}

        <!-- Frontera del líquid actiu -->
        <div class="escala-agulla-liquid" style="left:${pctLiq}%" title="Frontera del líquid: ${nomLiquid} (${formataNombre(dLiquid, 2)} g/cm³)">
          <span class="agulla-eti">${nomLiquid} (${formataNombre(dLiquid, 2)})</span>
        </div>

        <!-- Marcadors dels objectes -->
        ${puntsObjectes
          .map(
            (p, idx) => `
          <button type="button"
                  class="escala-pin-obj ${p.sura ? "pin-sura" : "pin-enfonsa"}"
                  style="left:${p.pct}%;top:${idx % 2 === 0 ? "4px" : "18px"};background:${p.color}"
                  data-selecciona-obj="${p.id}"
                  title="${p.nom}: ${formataNombre(p.densitat, 2)} g/cm³ (${p.sura ? "Sura" : "S'enfonsa"})">
            <strong>${p.etiqueta}</strong> <small>${formataNombre(p.densitat, 2)}</small>
          </button>`
          )
          .join("")}
      </div>
    </div>
  `;
}

/**
 * Renderitza el panell sincronitzat de les vistes especials:
 * - Cubets d'1 cm³ (comparant 1 cm³ de l'objecte amb 1 cm³ d'aigua)
 * - Volums i cavitats (Vext = Vmat + Vbuit i densitat mitjana vs densitat del material)
 * - Model didàctic de partícules
 */
export function renderitzaPanellVistesEspecials(obj, mag, vistes, dLiquid = 1.0, nomLiquid = "aigua") {
  if (!obj || (!vistes.cubets && !vistes.volums && !vistes.particules)) return "";
  const matId = obj.parts?.[0]?.material || "alumini";
  const mat = MATERIALS[matId] || MATERIALS.alumini;
  const d = mag.densitatMitjana;
  const dMat = mag.densitatMaterial;

  let html = `<div class="vistes-especials-overlay">`;

  if (vistes.cubets) {
    const nCubets = Math.min(20, Math.max(4, Math.round(mag.volumExterior / 8)));
    const opacitat = Math.min(0.96, 0.3 + (d / 10) * 0.66);
    const cubetsGrid = Array.from({ length: nCubets })
      .map(
        () =>
          `<span class="cubet-unitari" style="background:${mat.aspecte?.color || "#CBD5E1"};border-color:${mat.aspecte?.contorn || "#475569"};opacity:${opacitat}" title="1 cm³ = ${formataNombre(d, 2)} g">${formataNombre(d, 1)}g</span>`
      )
      .join("");

    html += `
      <div class="targeta-vista-especial">
        <div class="vista-titol">
          <strong>Vista de cubets d'1 cm³ · ${obj.nom}</strong>
          <span>Total: ${formataNombre(mag.volumExterior)} cubets d'1 cm³</span>
        </div>
        <div class="comparativa-cubet-aigua">
          <div class="cubet-zoom" style="background:${mat.aspecte?.color || "#CBD5E1"}">
            <strong>1 cm³ objecte</strong>
            <span>${formataNombre(d, 2)} g</span>
          </div>
          <span class="vs-simbol">${d < dLiquid ? "&lt;" : d > dLiquid ? "&gt;" : "="}</span>
          <div class="cubet-zoom cubet-zoom-liq">
            <strong>1 cm³ ${nomLiquid}</strong>
            <span>${formataNombre(dLiquid, 2)} g</span>
          </div>
          <span class="veredicte-cubet ${d < dLiquid ? "ok" : "enf"}">
            → ${d < dLiquid ? "1 cm³ pesa menys que el líquid: SURA" : "1 cm³ pesa més que el líquid: S'ENFONSA"}
          </span>
        </div>
        <div class="reticula-cubets">${cubetsGrid}</div>
        <p class="vista-nota">En tallar l'objecte hi ha menys cubets en total, però <strong>cada cubet d'1 cm³ continua tenint ${formataNombre(d, 2)} g</strong>.</p>
      </div>
    `;
  }

  if (vistes.volums) {
    const pctMat = mag.volumExterior > 0 ? Math.round((mag.volumMaterial / mag.volumExterior) * 100) : 100;
    const pctBuit = 100 - pctMat;
    html += `
      <div class="targeta-vista-especial">
        <div class="vista-titol">
          <strong>Desglossament de volums · ${obj.nom}</strong>
          <span><em>V</em><sub>ext</sub> = ${formataNombre(mag.volumExterior)} cm³</span>
        </div>
        <div class="barra-volums-comp">
          <div class="seg-vol-mat" style="width:${Math.max(12, pctMat)}%" title="Volum de material: ${formataNombre(mag.volumMaterial, 1)} cm³">
            Material: ${formataNombre(mag.volumMaterial, 1)} cm³ (${pctMat} %)
          </div>
          ${
            pctBuit > 0
              ? `<div class="seg-vol-buit" style="width:${Math.max(15, pctBuit)}%" title="Volum de buit/aire: ${formataNombre(mag.volumCavitat, 1)} cm³">
                  Aire/buit: ${formataNombre(mag.volumCavitat, 1)} cm³ (${pctBuit} %)
                </div>`
              : ""
          }
        </div>
        <p class="vista-nota">
          Densitat del material: <strong>${formataNombre(dMat, 2)} g/cm³</strong> ·
          Densitat mitjana del conjunt (<em>m / V</em><sub>ext</sub>): <strong>${formataNombre(d, 2)} g/cm³</strong>.
        </p>
      </div>
    `;
  }

  if (vistes.particules) {
    const pInfo = mat.particules || {
      massaRelativa: 2.5,
      compactacio: 0.85,
      nota: "La densitat depèn tant de la massa de cada partícula com de la distància entre elles."
    };
    const rPart = Math.max(4, Math.min(9, 3.5 + Math.sqrt(pInfo.massaRelativa)));
    const sep = Math.round(28 - pInfo.compactacio * 12);
    const puntsSvg = [];
    for (let ry = 14; ry <= 58; ry += sep) {
      for (let rx = 18; rx <= 145; rx += sep) {
        const dx = matId === "gel" && (ry / sep) % 2 === 1 ? 6 : 0;
        puntsSvg.push(
          `<circle cx="${rx + dx}" cy="${ry}" r="${rPart}" fill="${mat.aspecte?.color || "#94A3B8"}" stroke="${mat.aspecte?.contorn || "#334155"}" stroke-width="1.5"/>`
        );
      }
    }

    html += `
      <div class="targeta-vista-especial">
        <div class="vista-titol">
          <strong>Model didàctic de partícules · ${obj.misteri ? "Material misteri" : mat.nom}</strong>
          <span>Simplificació explícita</span>
        </div>
        <div class="particules-layout">
          <svg viewBox="0 0 165 72" class="svg-particules" aria-label="Representació esquemàtica de partícules">
            <rect width="165" height="72" rx="6" fill="#0F172A"/>
            ${puntsSvg.join("")}
          </svg>
          <p class="vista-nota">${pInfo.nota} <em>Avís del model:</em> un material més dens no té només partícules més juntes; també depèn de la massa de cada àtom o molècula.</p>
        </div>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}
