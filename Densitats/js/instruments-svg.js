/* SPDX-License-Identifier: AGPL-3.0-or-later AND CC-BY-NC-SA-4.0 */
/**
 * Renderitzat SVG d'alta qualitat per als tres instruments del laboratori:
 * 1. Balança digital de precisió
 * 2. Proveta graduada amb menisc i vareta d'immersió
 * 3. Tanc d'immersió amb dinamòmetre, molla elàstica i vectors de força
 */

import { fmt, fmtNet } from "./fisica.js";
import { defsObjectes, dibuixaObjecteRealista } from "./objectes-svg.js";

/**
 * Calcula una mida visual (w, h) proporcional a l'arrel cúbica del volum, acotada perquè càpiga bé als instruments.
 */
export function midaVisualObjecte(obj, escalaBase = 1) {
  const v = Math.max(15, Math.min(400, obj?.volum || 100));
  const factor = Math.cbrt(v / 100); // 100 cm³ -> 1.0
  const w = Math.round(52 * factor * escalaBase);
  const h = Math.round(44 * factor * escalaBase);
  return {
    w: Math.max(28, Math.min(84 * escalaBase, w)),
    h: Math.max(24, Math.min(72 * escalaBase, h))
  };
}

/**
 * 1. BALANÇA DIGITAL
 */
export function renderBalancaSVG({ obj, massaMesurada, pesMesurat, tara = 0, got = false, amagaPes = false }) {
  const teObj = Boolean(obj);
  const panDip = teObj || got ? 4 : 0;
  const { w, h } = teObj ? midaVisualObjecte(obj, 1.05) : { w: 0, h: 0 };
  const panY = 148 + panDip;

  return `
    <svg class="inst-svg" viewBox="0 0 260 270" role="img" aria-label="Balança digital">
      <defs>
        ${defsObjectes("bal-")}
        <linearGradient id="bal-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="60%" stop-color="#E2E8F0"/>
          <stop offset="100%" stop-color="#CBD5E1"/>
        </linearGradient>
        <linearGradient id="bal-pan" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#94A3B8"/>
          <stop offset="35%" stop-color="#F1F5F9"/>
          <stop offset="65%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#64748B"/>
        </linearGradient>
        <linearGradient id="bal-lcd" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0F172A"/>
          <stop offset="100%" stop-color="#1E293B"/>
        </linearGradient>
      </defs>

      <!-- Ombra sobre la taula -->
      <ellipse cx="130" cy="252" rx="108" ry="10" fill="#0F172A" opacity="0.14"/>

      <!-- Potes de la balança -->
      <rect x="38" y="238" width="22" height="10" rx="3" fill="#334155"/>
      <rect x="200" y="238" width="22" height="10" rx="3" fill="#334155"/>

      <!-- Tija del plat -->
      <rect x="118" y="${panY + 6}" width="24" height="${176 - panY}" fill="#64748B"/>

      <!-- Plat d'acer inoxidable -->
      <rect x="44" y="${panY}" width="172" height="10" rx="4" fill="url(#bal-pan)" stroke="#475569" stroke-width="1.3"/>
      <ellipse cx="130" cy="${panY}" rx="86" ry="5" fill="#F8FAFC" stroke="#94A3B8" stroke-width="1"/>

      <!-- Cos principal de la balança -->
      <path d="M 24 176 L 236 176 L 246 238 C 246 242 242 244 238 244 L 22 244 C 18 244 14 242 14 238 Z"
            fill="url(#bal-body)" stroke="#94A3B8" stroke-width="1.5"/>
      <line x1="26" y1="178" x2="234" y2="178" stroke="#FFFFFF" stroke-width="1.5" opacity="0.8"/>

      <!-- Pantalla LCD -->
      <rect x="52" y="187" width="156" height="46" rx="6" fill="url(#bal-lcd)" stroke="#334155" stroke-width="1.5"/>
      <text x="198" y="214" text-anchor="end" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="22" font-weight="700" fill="#34D399">
        ${fmt(Math.abs(massaMesurada) < 0.05 ? 0 : massaMesurada, 1)} g
      </text>
      <text x="60" y="227" text-anchor="start" font-size="11" font-weight="600" fill="#94A3B8">
        Pes: ${amagaPes ? "?" : fmt(pesMesurat, 2)} N
      </text>
      ${tara > 0 ? `<text x="198" y="227" text-anchor="end" font-size="9.5" font-weight="700" fill="#FBBF24">TARA</text>` : ""}

      <!-- Objecte damunt del plat (dins del got si n'hi ha) -->
      ${
        teObj
          ? `
            <ellipse cx="130" cy="${panY}" rx="${w * 0.44}" ry="4" fill="#0F172A" opacity="0.22"/>
            ${dibuixaObjecteRealista(obj, 130, panY - h / 2 + 1 - (got ? 4 : 0), w, h, "bal-")}
          `
          : `
            <text x="130" y="${got ? 60 : 108}" text-anchor="middle" font-size="12.5" font-weight="600" fill="#64748B" opacity="0.8">
              Col·loca un objecte aquí
            </text>
            <path d="M 130 ${got ? 66 : 116} l 0 14 M 124 ${got ? 74 : 124} l 6 7 l 6 -7" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          `
      }
      ${
        got
          ? `
            <!-- Got de vidre per fer la tara -->
            <path d="M 76 ${panY - 70} L 80 ${panY - 66} L 80 ${panY - 4} Q 80 ${panY} 84 ${panY} L 176 ${panY} Q 180 ${panY} 180 ${panY - 4} L 180 ${panY - 66} L 184 ${panY - 70}"
                  fill="#E0F2FE" fill-opacity="0.28" stroke="#64748B" stroke-width="1.8" stroke-linejoin="round"/>
            <line x1="84" y1="${panY - 62}" x2="84" y2="${panY - 8}" stroke="#FFFFFF" stroke-width="2.5" opacity="0.7"/>
            <rect x="80" y="${panY - 4}" width="100" height="4" fill="#94A3B8" opacity="0.6"/>
          `
          : ""
      }
    </svg>
  `;
}

/**
 * 2. PROVETA GRADUADA
 */
export function renderProvetaSVG({
  obj,
  liquid,
  capacitatMl = 500,
  volumInicialMl = 200,
  varetaSubmergit = false,
  estatEquilibri = null,
  amagaDelta = false
}) {
  const teObj = Boolean(obj);
  const topY = 36;
  const botY = 312;
  const cylH = botY - topY; // 276 px per a capacitatMl
  const cylX = 68;
  const cylW = 92;
  const cylCx = cylX + cylW / 2;

  // Volum desplaçat a la proveta
  let vDesplacat = 0;
  let fSub = 0;
  if (teObj && estatEquilibri) {
    if (varetaSubmergit || !estatEquilibri.sura) {
      fSub = 1;
      vDesplacat = estatEquilibri.volum;
    } else {
      fSub = estatEquilibri.fraccioSubmergida;
      vDesplacat = estatEquilibri.volumSubmergit;
    }
  }

  const vFinal = Math.min(capacitatMl * 1.04, volumInicialMl + vDesplacat);
  const desborda = volumInicialMl + vDesplacat > capacitatMl;

  const nivellPx = (ml) => botY - Math.max(0, Math.min(1.04, ml / capacitatMl)) * cylH;
  const y0 = nivellPx(volumInicialMl);
  const yF = nivellPx(vFinal);

  // Marques de graduació
  const pasPrincipal = capacitatMl <= 250 ? 50 : capacitatMl <= 500 ? 100 : 200;
  const pasSecundari = pasPrincipal / 5;
  let ticks = "";
  for (let ml = pasSecundari; ml <= capacitatMl; ml += pasSecundari) {
    const ty = nivellPx(ml);
    const esPrincipal = Math.abs(ml % pasPrincipal) < 0.01;
    const len = esPrincipal ? 18 : 9;
    ticks += `<line x1="${cylX + 3}" y1="${ty}" x2="${cylX + 3 + len}" y2="${ty}" stroke="#334155" stroke-width="${esPrincipal ? 1.5 : 1}" opacity="${esPrincipal ? 0.85 : 0.5}"/>`;
    if (esPrincipal) {
      ticks += `<text x="${cylX + 25}" y="${ty + 4}" font-size="11" font-weight="700" fill="#1E293B">${ml}</text>`;
    }
  }

  // Posició de l'objecte dins la proveta
  let objMarkup = "";
  if (teObj) {
    const { w, h } = midaVisualObjecte(obj, 0.86);
    const wFit = Math.min(w, cylW - 14);
    const hFit = Math.min(h, 74);

    let objCy;
    if (varetaSubmergit) {
      // Empès per la vareta just sota la superfície
      objCy = Math.min(botY - hFit / 2 - 4, yF + hFit / 2 + 12);
    } else if (!estatEquilibri?.sura) {
      // Enfonsat al fons
      objCy = botY - hFit / 2 - 3;
    } else {
      // Surant a la superfície yF
      objCy = yF + (fSub - 0.5) * hFit;
    }

    objMarkup = dibuixaObjecteRealista(obj, cylCx, objCy, wFit, hFit, "prov-");

    if (varetaSubmergit && estatEquilibri?.sura) {
      const topObj = objCy - hFit / 2;
      objMarkup += `
        <line x1="${cylCx}" y1="10" x2="${cylCx}" y2="${topObj + 2}" stroke="#475569" stroke-width="3.2" stroke-linecap="round"/>
        <line x1="${cylCx - 1}" y1="10" x2="${cylCx - 1}" y2="${topObj + 2}" stroke="#CBD5E1" stroke-width="1" stroke-linecap="round"/>
        <circle cx="${cylCx}" cy="10" r="4" fill="#334155"/>
      `;
    }
  }

  return `
    <svg class="inst-svg" viewBox="0 0 270 360" role="img" aria-label="Proveta graduada">
      <defs>
        ${defsObjectes("prov-")}
        <linearGradient id="prov-glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.55"/>
          <stop offset="18%" stop-color="#FFFFFF" stop-opacity="0.12"/>
          <stop offset="82%" stop-color="#FFFFFF" stop-opacity="0.06"/>
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.45"/>
        </linearGradient>
        <linearGradient id="prov-liq" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${liquid.colorTop}"/>
          <stop offset="100%" stop-color="${liquid.colorBot}"/>
        </linearGradient>
        <clipPath id="prov-clip">
          <rect x="${cylX + 2}" y="${topY}" width="${cylW - 4}" height="${cylH}" rx="2"/>
        </clipPath>
      </defs>

      <!-- Ombra i base hexagonal -->
      <ellipse cx="${cylCx}" cy="336" rx="68" ry="9" fill="#0F172A" opacity="0.14"/>
      <polygon points="${cylCx - 60},328 ${cylCx - 44},314 ${cylCx + 44},314 ${cylCx + 60},328 ${cylCx + 44},336 ${cylCx - 44},336"
               fill="#CBD5E1" stroke="#64748B" stroke-width="1.5" stroke-linejoin="round"/>
      <rect x="${cylX - 3}" y="${botY}" width="${cylW + 6}" height="14" rx="2" fill="#E2E8F0" stroke="#64748B" stroke-width="1.4"/>

      <!-- Interior del cilindre (fons vidre) -->
      <rect x="${cylX}" y="${topY}" width="${cylW}" height="${cylH}" fill="#F8FAFC" opacity="0.65"/>

      <!-- Líquid + Objecte retallats dins del cilindre -->
      <g clip-path="url(#prov-clip)">
        <!-- Líquid -->
        <rect x="${cylX + 1}" y="${yF}" width="${cylW - 2}" height="${botY - yF + 2}" fill="url(#prov-liq)"/>
        <!-- Menisc còncau -->
        <path d="M ${cylX + 1} ${yF - 2} Q ${cylCx} ${yF + 4} ${cylX + cylW - 1} ${yF - 2} L ${cylX + cylW - 1} ${yF + 3} L ${cylX + 1} ${yF + 3} Z"
              fill="${liquid.meniscColor}" opacity="0.6"/>
        <path d="M ${cylX + 1} ${yF - 2} Q ${cylCx} ${yF + 4} ${cylX + cylW - 1} ${yF - 2}"
              fill="none" stroke="${liquid.meniscColor}" stroke-width="1.8"/>

        <!-- Línia discontínua de V0 quan hi ha objecte -->
        ${
          teObj && vDesplacat > 0.2
            ? `<line x1="${cylX + 2}" y1="${y0}" x2="${cylX + cylW - 2}" y2="${y0}" stroke="#0F172A" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.55"/>`
            : ""
        }

        <!-- Objecte -->
        ${objMarkup}
      </g>

      <!-- Reflexos de vidre i contorn -->
      <rect x="${cylX}" y="${topY}" width="${cylW}" height="${cylH}" fill="url(#prov-glass)" stroke="#64748B" stroke-width="1.8"/>
      <!-- Broc superior -->
      <path d="M ${cylX - 5} ${topY} L ${cylX} ${topY + 6} M ${cylX + cylW + 5} ${topY} L ${cylX + cylW} ${topY + 6}" stroke="#64748B" stroke-width="1.8" stroke-linecap="round"/>

      <!-- Graduacions -->
      ${ticks}
      <text x="${cylX + cylW - 8}" y="${topY + 14}" text-anchor="end" font-size="9" font-weight="700" fill="#475569">mL</text>

      <!-- Targeta de lectura del nivell (lupa clara per pissarra) -->
      <g transform="translate(168, ${Math.max(40, Math.min(265, yF - 24))})">
        <line x1="-8" y1="24" x2="0" y2="24" stroke="#0284C7" stroke-width="2"/>
        <circle cx="-8" cy="24" r="3" fill="#0284C7"/>
        <rect x="0" y="0" width="96" height="${teObj ? 58 : 42}" rx="8" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
        <text x="10" y="16" font-size="9.5" font-weight="600" fill="#94A3B8">${teObj ? "Nivell final (Vf)" : "Nivell inicial (V₀)"}</text>
        <text x="10" y="34" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="16" font-weight="700" fill="${desborda ? "#F87171" : "#38BDF8"}">
          ${desborda ? "Desborda!" : `${fmtNet(vFinal, 1)} mL`}
        </text>
        ${
          teObj && !desborda
            ? `<text x="10" y="50" font-size="11" font-weight="700" fill="#34D399">ΔV = ${amagaDelta ? "?" : fmtNet(vDesplacat, 1)} mL</text>`
            : ""
        }
      </g>
    </svg>
  `;
}

/**
 * 3. TANC D'IMMERSIÓ + DINAMÒMETRE + VECTORS DE FORÇA
 */
export function renderTancSVG({
  obj,
  liquid,
  modeTanc = "dinamometre", // "dinamometre" | "lliure"
  immersioSlider = 0, // 0..100
  posYAnim = null, // posició animada en px per al mode lliure
  mostraForces = true,
  estatDin,
  estatLliure,
  amaga = {}
}) {
  const tankX = 54;
  const tankY = 148;
  const tankW = 248;
  const tankH = 192;
  const tankBot = tankY + tankH; // 340
  const tankCx = tankX + tankW / 2; // 178

  const teObj = Boolean(obj);
  const { w, h } = teObj ? midaVisualObjecte(obj, 1.32) : { w: 56, h: 48 };

  // Nivell base de l'aigua i pujada proporcional al volum submergit
  const baseWaterY = 216;
  const fSub = !teObj
    ? 0
    : modeTanc === "dinamometre"
      ? (estatDin?.fraccioSubmergida || 0)
      : (estatLliure?.fraccioSubmergida || 0);
  const vSub = teObj ? obj.volum * fSub : 0;
  // Escala visual: 100 cm³ pugen ~8 px (fins a 28 px màxim)
  const risePx = Math.min(34, (vSub / 100) * 9);
  const waterY = baseWaterY - risePx;

  // Posició Y de l'objecte
  let objCy;
  if (!teObj) {
    objCy = 180;
  } else if (modeTanc === "dinamometre") {
    // 0% -> suspès a l'aire (entre dinamòmetre i aigua)
    // 100% -> submergit del tot (o aturat al seu equilibri si sura!)
    const yAire = baseWaterY - h / 2 - 22;
    const yDins = Math.min(tankBot - h / 2 - 10, baseWaterY + h * 0.85);
    const fReq = immersioSlider / 100;
    // Si flota i el fil queda destensat, s'atura a la seva línia de flotació
    const fEff = estatDin ? Math.min(fReq, estatDin.fraccioSubmergida > 0 ? Math.max(fReq, 0) : fReq) : fReq;
    const yEquilibri = waterY + (fSub - 0.5) * h;
    if (estatDin && !estatDin.cordaTensa && fReq > 0.01) {
      objCy = yEquilibri;
    } else {
      objCy = yAire + (yDins - yAire) * fEff;
      // Ajust precís perquè a fSub = 0.5 el centre coincideixi amb waterY
      if (fReq > 0 && fReq < 1 && estatDin?.cordaTensa) {
        objCy = waterY + (fSub - 0.5) * h;
      }
    }
  } else {
    objCy = posYAnim ?? (waterY + (fSub - 0.5) * h);
  }

  // Forces a dibuixar
  const P = teObj ? (modeTanc === "dinamometre" ? estatDin?.pes : estatLliure?.pes) || 0 : 0;
  const E = teObj ? (modeTanc === "dinamometre" ? estatDin?.empenyiment : estatLliure?.empenyiment) || 0 : 0;
  const T = teObj && modeTanc === "dinamometre" ? (estatDin?.tensio || 0) : 0;
  const N = teObj && modeTanc === "lliure" ? (estatLliure?.normal || 0) : 0;

  // Escala de fletxes en px (màxim ~68 px)
  const maxF = Math.max(P, E, T, N, 0.5);
  const fLen = (val) => (val <= 0.001 ? 0 : Math.max(18, Math.min(68, (val / maxF) * 60)));

  // Molla del dinamòmetre
  const dinY = 14;
  const dinH = 74;
  const extensioMolla = teObj && modeTanc === "dinamometre" ? Math.min(24, (T / Math.max(P, 1)) * 22) : 0;
  const hookY = dinY + dinH + 10 + extensioMolla;
  const springCoils = 7;
  let springPath = `M ${tankCx} ${dinY + dinH}`;
  const coilStart = dinY + dinH + 2;
  const coilEnd = hookY - 4;
  const step = (coilEnd - coilStart) / springCoils;
  for (let i = 0; i < springCoils; i++) {
    const cy1 = coilStart + i * step + step * 0.25;
    const cy2 = coilStart + i * step + step * 0.75;
    springPath += ` L ${tankCx - 5} ${cy1} L ${tankCx + 5} ${cy2}`;
  }
  springPath += ` L ${tankCx} ${hookY}`;

  // Corda fins a l'objecte
  let cordaMarkup = "";
  if (teObj && modeTanc === "dinamometre") {
    const objTop = objCy - h / 2 + 2;
    const tensa = estatDin?.cordaTensa ?? true;
    if (tensa) {
      cordaMarkup = `<line x1="${tankCx}" y1="${hookY + 5}" x2="${tankCx}" y2="${objTop}" stroke="#334155" stroke-width="2"/>`;
    } else {
      // Corda destensada (corbada) perquè l'objecte sura!
      const midY = (hookY + 5 + objTop) / 2;
      cordaMarkup = `<path d="M ${tankCx} ${hookY + 5} Q ${tankCx + 18} ${midY} ${tankCx} ${objTop}" fill="none" stroke="#94A3B8" stroke-width="1.8" stroke-dasharray="3 2"/>`;
    }
  }

  // Vectors de força: les etiquetes van als costats de l'objecte perquè no el tapin
  let vectorsMarkup = "";
  if (teObj && mostraForces) {
    const lenP = fLen(P);
    const lenE = fLen(E);
    const lenT = fLen(T);
    const lenN = fLen(N);
    const xDreta = tankCx + w / 2 + 8;
    const xEsquerra = tankCx - w / 2 - 8;

    const etiqueta = (x, yCentre, costat, nom, valor, amagat, colorVora, colorFons, colorText) => {
      const text = amagat ? `${nom} = ?` : `${nom} = ${fmt(valor, 2)} N`;
      const amp = amagat ? 46 : 90;
      const x0 = costat === "dreta" ? x : x - amp;
      const y0 = Math.max(4, Math.min(330, yCentre - 11));
      return `
        <rect x="${x0}" y="${y0}" width="${amp}" height="22" rx="5" fill="${colorFons}" stroke="${colorVora}" stroke-width="1.3"/>
        <text x="${x0 + amp / 2}" y="${y0 + 15.5}" text-anchor="middle" font-size="12.5" font-weight="800" fill="${colorText}">${text}</text>
      `;
    };

    vectorsMarkup += `<g class="force-vectors">`;
    // Pes P (cap avall, vermell)
    if (lenP > 0) {
      const py2 = Math.min(tankBot - 6, objCy + lenP);
      vectorsMarkup += `
        <line x1="${tankCx}" y1="${objCy}" x2="${tankCx}" y2="${py2}" stroke="#EF4444" stroke-width="3.4" stroke-linecap="round"/>
        <polygon points="${tankCx - 5.5},${py2 - 6} ${tankCx + 5.5},${py2 - 6} ${tankCx},${py2 + 2}" fill="#EF4444"/>
        <line x1="${tankCx + 4}" y1="${py2 - 4}" x2="${xDreta}" y2="${py2 - 4}" stroke="#EF4444" stroke-width="1" stroke-dasharray="2 2"/>
        ${etiqueta(xDreta, py2 - 4, "dreta", "P", P, amaga.pes, "#EF4444", "#FEF2F2", "#B91C1C")}
      `;
    }
    // Empenyiment E (cap amunt, blau, a l'esquerra)
    if (lenE > 0) {
      const ex = tankCx - 10;
      const ey2 = Math.max(40, objCy - lenE);
      vectorsMarkup += `
        <line x1="${ex}" y1="${objCy}" x2="${ex}" y2="${ey2}" stroke="#0284C7" stroke-width="3.4" stroke-linecap="round"/>
        <polygon points="${ex - 5.5},${ey2 + 6} ${ex + 5.5},${ey2 + 6} ${ex},${ey2 - 2}" fill="#0284C7"/>
        <line x1="${ex - 4}" y1="${ey2 + 2}" x2="${xEsquerra}" y2="${ey2 + 2}" stroke="#0284C7" stroke-width="1" stroke-dasharray="2 2"/>
        ${etiqueta(xEsquerra, ey2 + 2, "esquerra", "E", E, amaga.emp, "#0284C7", "#F0F9FF", "#0369A1")}
      `;
    }
    // Tensió T del dinamòmetre (cap amunt, verd, a la dreta)
    if (lenT > 0) {
      const tx = tankCx + 10;
      const ty2 = Math.max(40, objCy - lenT);
      vectorsMarkup += `
        <line x1="${tx}" y1="${objCy}" x2="${tx}" y2="${ty2}" stroke="#10B981" stroke-width="3.4" stroke-linecap="round"/>
        <polygon points="${tx - 5.5},${ty2 + 6} ${tx + 5.5},${ty2 + 6} ${tx},${ty2 - 2}" fill="#10B981"/>
        <line x1="${tx + 4}" y1="${ty2 + 2}" x2="${xDreta}" y2="${ty2 + 2}" stroke="#10B981" stroke-width="1" stroke-dasharray="2 2"/>
        ${etiqueta(xDreta, ty2 + 2, "dreta", "T", T, amaga.pap, "#10B981", "#ECFDF5", "#047857")}
      `;
    }
    // Normal N al fons (cap amunt, ambre, a la dreta)
    if (lenN > 0) {
      const nx = tankCx + 10;
      const ny2 = Math.max(40, objCy - lenN);
      vectorsMarkup += `
        <line x1="${nx}" y1="${objCy}" x2="${nx}" y2="${ny2}" stroke="#F59E0B" stroke-width="3.4" stroke-linecap="round"/>
        <polygon points="${nx - 5.5},${ny2 + 6} ${nx + 5.5},${ny2 + 6} ${nx},${ny2 - 2}" fill="#F59E0B"/>
        <line x1="${nx + 4}" y1="${ny2 + 2}" x2="${xDreta}" y2="${ny2 + 2}" stroke="#F59E0B" stroke-width="1" stroke-dasharray="2 2"/>
        ${etiqueta(xDreta, ny2 + 2, "dreta", "N", N, amaga.pap, "#F59E0B", "#FFFBEB", "#B45309")}
      `;
    }
    vectorsMarkup += `</g>`;
  }

  // Franja d'informació sota el tanc: volum submergit o avís de flotació
  let franja = "";
  if (teObj) {
    const fReq = immersioSlider / 100;
    const suraDin = modeTanc === "dinamometre" && estatDin && estatDin.densitat < liquid.densitat && fReq > 0.01;
    if (suraDin && !estatDin.cordaTensa) {
      const pct = Math.round((estatDin.densitat / liquid.densitat) * 100);
      franja = `
        <rect x="14" y="358" width="332" height="28" rx="7" fill="#FFFBEB" stroke="#F59E0B" stroke-width="1.4"/>
        <text x="180" y="376.5" text-anchor="middle" font-size="12.5" font-weight="700" fill="#92400E">Sura: només se n'enfonsa un ${pct} %. La corda s'afluixa.</text>
      `;
    } else if (vSub > 0.1) {
      franja = `
        <rect x="70" y="358" width="220" height="28" rx="7" fill="#0F172A" opacity="0.9"/>
        <text x="180" y="376.5" text-anchor="middle" font-size="12.5" font-weight="700" fill="#38BDF8">Volum submergit: ${amaga.volum ? "?" : fmtNet(vSub, 1)} cm³</text>
      `;
    }
  }

  // Regle en cm a la paret esquerra del tanc
  let ruler = "";
  for (let cm = 0; cm <= 16; cm += 2) {
    const ry = tankBot - 8 - cm * 10;
    ruler += `<line x1="${tankX + 3}" y1="${ry}" x2="${tankX + (cm % 4 === 0 ? 14 : 9)}" y2="${ry}" stroke="#334155" stroke-width="1.2" opacity="0.65"/>`;
    if (cm % 4 === 0) {
      ruler += `<text x="${tankX + 17}" y="${ry + 3}" font-size="10" font-weight="600" fill="#334155">${cm}</text>`;
    }
  }

  return `
    <svg class="inst-svg" viewBox="0 0 360 392" role="img" aria-label="Tanc d'immersió amb dinamòmetre">
      <defs>
        ${defsObjectes("tanc-")}
        <linearGradient id="tanc-liq" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${liquid.colorTop}"/>
          <stop offset="100%" stop-color="${liquid.colorBot}"/>
        </linearGradient>
        <linearGradient id="tanc-glass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.45"/>
          <stop offset="12%" stop-color="#FFFFFF" stop-opacity="0.06"/>
          <stop offset="88%" stop-color="#FFFFFF" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.35"/>
        </linearGradient>
        <clipPath id="tanc-clip">
          <rect x="${tankX + 2}" y="${tankY + 2}" width="${tankW - 4}" height="${tankH - 4}" rx="4"/>
        </clipPath>
      </defs>

      <!-- Suport vertical de laboratori (peu i barra) -->
      <rect x="20" y="340" width="320" height="10" rx="3" fill="#CBD5E1" stroke="#64748B" stroke-width="1.2"/>
      <rect x="24" y="18" width="10" height="322" rx="3" fill="#64748B"/>
      <rect x="24" y="24" width="${tankCx - 24}" height="8" rx="3" fill="#64748B"/>

      <!-- Dinamòmetre digital superior -->
      <g opacity="${modeTanc === "dinamometre" ? "1" : "0.38"}">
        <rect x="${tankCx - 56}" y="${dinY}" width="112" height="${dinH}" rx="10" fill="#1E293B" stroke="#475569" stroke-width="1.8"/>
        <text x="${tankCx}" y="${dinY + 17}" text-anchor="middle" font-size="9.5" font-weight="700" fill="#94A3B8" letter-spacing="0.6">DINAMÒMETRE</text>
        <rect x="${tankCx - 46}" y="${dinY + 23}" width="92" height="36" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1"/>
        <text x="${tankCx}" y="${dinY + 47}" text-anchor="middle" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="18" font-weight="800" fill="#34D399">
          ${teObj ? (amaga.pap && modeTanc === "dinamometre" ? "? N" : `${fmt(T, 2)} N`) : "0,00 N"}
        </text>
        <text x="${tankCx}" y="${dinY + 69}" text-anchor="middle" font-size="9" font-weight="600" fill="#CBD5E1">
          ${teObj && modeTanc === "dinamometre" ? (fSub > 0 ? "Pes aparent dins el líquid" : "Pes real a l'aire") : "Mode lliure"}
        </text>

        <!-- Molla i ganxo -->
        <path d="${springPath}" fill="none" stroke="#475569" stroke-width="2" stroke-linejoin="round"/>
        <path d="M ${tankCx} ${hookY} A 4 4 0 1 1 ${tankCx - 4} ${hookY + 4}" fill="none" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
      </g>

      <!-- Fons del tanc -->
      <rect x="${tankX}" y="${tankY}" width="${tankW}" height="${tankH}" rx="6" fill="#F8FAFC" opacity="0.72"/>

      <!-- Objecte (si està fora del tanc o parcialment dins) -->
      ${cordaMarkup}
      ${teObj ? dibuixaObjecteRealista(obj, tankCx, objCy, w, h, "tanc-") : ""}

      <!-- Aigua del tanc (semitransparent per sobre perquè es vegi la immersió!) -->
      <g clip-path="url(#tanc-clip)">
        <rect x="${tankX}" y="${waterY}" width="${tankW}" height="${tankBot - waterY}" fill="url(#tanc-liq)"/>
        <!-- Superfície del líquid -->
        <line x1="${tankX}" y1="${waterY}" x2="${tankX + tankW}" y2="${waterY}" stroke="${liquid.meniscColor}" stroke-width="2.5"/>
        <!-- Línia de nivell inicial quan puja -->
        ${
          risePx > 1
            ? `<line x1="${tankX + 2}" y1="${baseWaterY}" x2="${tankX + tankW - 2}" y2="${baseWaterY}" stroke="#0F172A" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.5"/>`
            : ""
        }
      </g>

      <!-- Vidre frontal del tanc i regle -->
      <rect x="${tankX}" y="${tankY}" width="${tankW}" height="${tankH}" rx="6" fill="url(#tanc-glass)" stroke="#475569" stroke-width="2"/>
      ${ruler}

      <!-- Vectors de força per sobre de tot -->
      ${vectorsMarkup}
      ${franja}

      ${
        !teObj
          ? `
            <text x="${tankCx}" y="278" text-anchor="middle" font-size="12.5" font-weight="600" fill="#0F172A" opacity="0.65">
              Toca o arrossega un objecte fins aquí
            </text>
          `
          : ""
      }
    </svg>
  `;
}
