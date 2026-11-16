/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Gràfica interactiva massa-volum (04-laboratori-i-instruments.md §7.4, investigació C5).
 * Representa els punts mesurats al quadern, les rectes de pendent = densitat i la recta frontera de l'aigua.
 */

import { formataNombre } from "../fisica/unitats.js";
import { icona } from "./icones.js";

/**
 * Renderitza el panell emergent de la gràfica massa-volum en SVG.
 */
export function renderitzaGraficaMassaVolum(estat, opcionsGrafica = {}) {
  const mostraAigua = opcionsGrafica.mostraAigua ?? true;
  const mostraRectes = opcionsGrafica.mostraRectes ?? true;

  // Agrupem per objecte les mesures de massa (g) i volum (cm³ o mL) del quadern
  const perObj = new Map();
  for (const m of estat.quadern.mesures || []) {
    if (!m.objecteId || m.objecteId === "—") continue;
    if (!perObj.has(m.objecteId)) {
      perObj.set(m.objecteId, { nom: m.objecteNom || m.objecteId, massa: null, volum: null });
    }
    const reg = perObj.get(m.objecteId);
    if (m.unitat === "g") reg.massa = Number(m.valor);
    if (m.unitat === "kg") reg.massa = Number(m.valor) * 1000;
    if (m.unitat === "cm³" || m.unitat === "mL") reg.volum = Number(m.valor);
  }

  const punts = [...perObj.values()].filter(
    p => typeof p.massa === "number" && typeof p.volum === "number" && p.volum > 0
  );

  // Si encara no hi ha punts al quadern, mostrem punts d'exemple de la sèrie d'alumini i de pi
  const puntsMostra =
    punts.length > 0
      ? punts
      : [
          { nom: "Al-10", volum: 10, massa: 27 },
          { nom: "CA", volum: 20, massa: 54 },
          { nom: "Al-50", volum: 50, massa: 135 },
          { nom: "A", volum: 100, massa: 270 },
          { nom: "B (pi)", volum: 200, massa: 100 }
        ];

  const maxV = Math.max(220, ...puntsMostra.map(p => p.volum));
  const maxM = Math.max(300, ...puntsMostra.map(p => p.massa));

  const W = 440;
  const H = 250;
  const padL = 52;
  const padR = 20;
  const padT = 18;
  const padB = 38;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xOf = v => padL + (v / maxV) * plotW;
  const yOf = m => padT + plotH - (m / maxM) * plotH;

  // Funció per traçar una recta de pendent d des de (0,0) fins als límits del gràfic
  const liniaPendent = d => {
    const vFinal = Math.min(maxV, maxM / d);
    const mFinal = vFinal * d;
    return { x1: xOf(0), y1: yOf(0), x2: xOf(vFinal), y2: yOf(mFinal) };
  };

  const lAigua = liniaPendent(1.0);
  const lAlumini = liniaPendent(2.7);
  const lPi = liniaPendent(0.5);

  return `
    <div class="eina-flotant eina-grafica" role="region" aria-label="Gràfica massa-volum">
      <div class="eina-cap">
        <h4>${icona("grafica")} Gràfica massa-volum (pendent = densitat)</h4>
        <button type="button" class="bt-icona" data-tanca-eina="true" aria-label="Tanca la gràfica">${icona("tanca")}</button>
      </div>
      <svg viewBox="0 0 ${W} ${H}" class="svg-grafica" role="img" aria-label="Gràfica de massa en grams en funció del volum en centímetres cúbics">
        <!-- Zones de flotació respecte a l'aigua -->
        ${
          mostraAigua
            ? `
          <polygon points="${xOf(0)},${yOf(0)} ${lAigua.x2},${lAigua.y2} ${padL},${padT}" fill="#FEE2E2" opacity="0.35"/>
          <polygon points="${xOf(0)},${yOf(0)} ${lAigua.x2},${lAigua.y2} ${padL + plotW},${padT + plotH}" fill="#DCFCE7" opacity="0.35"/>
          <line x1="${lAigua.x1}" y1="${lAigua.y1}" x2="${lAigua.x2}" y2="${lAigua.y2}" stroke="#1D6FB8" stroke-width="2" stroke-dasharray="5 3"/>
          <text x="${lAigua.x2 - 6}" y="${lAigua.y2 - 6}" fill="#1D6FB8" font-size="10" font-weight="600" text-anchor="end">Aigua (d = 1,00 g/cm³)</text>
          <text x="${padL + 10}" y="${padT + 16}" fill="#991B1B" font-size="10" font-weight="600">Zona: s'enfonsa (d &gt; 1)</text>
          <text x="${padL + plotW - 10}" y="${padT + plotH - 10}" fill="#166534" font-size="10" font-weight="600" text-anchor="end">Zona: sura (d &lt; 1)</text>
        `
            : ""
        }

        <!-- Rectes de materials -->
        ${
          mostraRectes
            ? `
          <line x1="${lAlumini.x1}" y1="${lAlumini.y1}" x2="${lAlumini.x2}" y2="${lAlumini.y2}" stroke="#6D3FB5" stroke-width="1.8" opacity="0.75"/>
          <text x="${lAlumini.x2 + 4}" y="${lAlumini.y2 + 10}" fill="#6D3FB5" font-size="10" font-weight="600">Alumini (2,70)</text>
          <line x1="${lPi.x1}" y1="${lPi.y1}" x2="${lPi.x2}" y2="${lPi.y2}" stroke="#9C7343" stroke-width="1.8" opacity="0.75"/>
          <text x="${lPi.x2 - 4}" y="${lPi.y2 - 5}" fill="#9C7343" font-size="10" font-weight="600" text-anchor="end">Pi (0,50)</text>
        `
            : ""
        }

        <!-- Eixos -->
        <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}" stroke="#16303F" stroke-width="1.6"/>
        <line x1="${padL}" y1="${padT + plotH}" x2="${padL + plotW}" y2="${padT + plotH}" stroke="#16303F" stroke-width="1.6"/>
        <text x="${padL + plotW / 2}" y="${H - 6}" fill="#1D6FB8" font-size="11" font-weight="700" text-anchor="middle">Volum V (cm³)</text>
        <text x="14" y="${padT + plotH / 2}" fill="#8A5A00" font-size="11" font-weight="700" text-anchor="middle" transform="rotate(-90 14 ${padT + plotH / 2})">Massa m (g)</text>

        <!-- Marques dels eixos -->
        ${[0, 0.25, 0.5, 0.75, 1]
          .map(f => {
            const v = Math.round(maxV * f);
            const m = Math.round(maxM * f);
            const x = xOf(v);
            const y = yOf(m);
            return `
            <line x1="${x}" y1="${padT + plotH}" x2="${x}" y2="${padT + plotH + 4}" stroke="#586A76"/>
            <text x="${x}" y="${padT + plotH + 15}" fill="#586A76" font-size="10" text-anchor="middle">${v}</text>
            <line x1="${padL - 4}" y1="${y}" x2="${padL}" y2="${y}" stroke="#586A76"/>
            <text x="${padL - 7}" y="${y + 3}" fill="#586A76" font-size="10" text-anchor="end">${m}</text>
          `;
          })
          .join("")}

        <!-- Punts -->
        ${puntsMostra
          .map(p => {
            const cx = xOf(p.volum);
            const cy = yOf(p.massa);
            const d = p.massa / p.volum;
            return `
            <g>
              <circle cx="${cx}" cy="${cy}" r="4.5" fill="#0E7C86" stroke="#FFFFFF" stroke-width="1.5"/>
              <text x="${cx + 6}" y="${cy - 5}" fill="#16303F" font-size="10" font-weight="600">${p.nom} (${formataNombre(d, 2)})</text>
            </g>
          `;
          })
          .join("")}
      </svg>
      <p class="etiqueta-petita">
        ${punts.length > 0 ? `Mostrant ${punts.length} objectes amb massa i volum anotats al teu quadern.` : "Mostrant la sèrie de referència (anota massa i volum d'un objecte per afegir-lo a la gràfica)."}
      </p>
    </div>
  `;
}
