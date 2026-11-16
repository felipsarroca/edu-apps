/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Renderitzador vectorial SVG d'alta riquesa visual i pedagògica per a les quatre taules de treball:
 * 1. Taula de Mesura (Balança digital, Proveta graduada amb cota ΔV = Vf − V0, menisc i vareta, Vas de flotació i Escala de densitats)
 * 2. Taula de la Columna (Columna multicapa amb fronteres de densitat + Dissolució de sal i flotació de l'ou)
 * 3. Taula del Tanc (Dinamòmetre i igualtat d'Arquimedes, Buc naval acotat, Submarí amb llast, Vectors de pressió G1–G3, Globus, Temperatura, Densímetre)
 * 4. Taula del Taller i Drassana (Banc visual SVG de tall/modelat, previsualització a escala C7 i plànol naval acotat F1–F4)
 */

import { MATERIALS } from "../dades/materials.js";
import { LIQUIDS, GASOS } from "../dades/liquids.js";
import { RECIPIENTS } from "../dades/recipients.js";
import { INSTRUMENTS } from "../dades/instruments.js";
import { formataNombre, calculaPressioHidrostatica } from "../fisica/unitats.js";
import { magnitudsObjecte, tallaObjecte } from "../fisica/objecte.js";
import { calculaDissolucioSal, densitatAiguaTemperatura } from "../fisica/liquids.js";
import { calculaNivellIVessament } from "../fisica/recipient.js";
import {
  estatObjecteEnLiquid,
  calculaDinamometre,
  estatObjecteEnColumna,
  calculaForcesPressioBloc,
  estatGlobus
} from "../fisica/flotacio.js";
import { calculaBuc, estatSubmari } from "../fisica/barca.js";
import { llegeixInstrument, llegeixMenisc } from "../fisica/instruments.js";
import {
  dibuixaVectorsForcaSVG,
  renderitzaPanellVistesEspecials,
  renderitzaEscalaDensitatsViva
} from "../eines/forces.js";
import { icona } from "../eines/icones.js";

/**
 * Definicions de gradients i patrons reutilitzables per als SVGs del laboratori.
 */
function defsSVGComuns() {
  return `
    <defs>
      <linearGradient id="grad-vidre" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.88"/>
        <stop offset="25%" stop-color="#F8FAFC" stop-opacity="0.55"/>
        <stop offset="85%" stop-color="#E2E8F0" stop-opacity="0.65"/>
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.9"/>
      </linearGradient>
      <linearGradient id="grad-taula" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#E2E8F0"/>
        <stop offset="100%" stop-color="#CBD5E1"/>
      </linearGradient>
      <pattern id="patro-cubets" width="11" height="11" patternUnits="userSpaceOnUse">
        <path d="M 11 0 L 0 0 0 11" fill="none" stroke="#0F172A" stroke-width="0.9" stroke-opacity="0.45"/>
      </pattern>
    </defs>
  `;
}

/**
 * Dibuixa un objecte en SVG a la posició indicada (cx, cy corresponen al centre de l'objecte),
 * amb il·lustració reconeixible per família (patata, ou, fusta amb veta, suro porós, corona, llauna, esfera buida, glaçó, metall)
 * i suport directe per a les vistes sincronitzades de Cubets i Volums.
 */
function dibuixaObjecteSVG(obj, cx, cy, ampladaPx = 48, alcadaPx = 36, mostraVolums = false, mostraCubets = false) {
  if (!obj) return "";
  const id = obj.id || "";
  const matId = obj.parts?.[0]?.material || "alumini";
  const mat = MATERIALS[matId] || MATERIALS.alumini;
  const color = obj.misteri ? "#94A3B8" : mat.aspecte?.color || "#CBD5E1";
  const contorn = obj.misteri ? "#475569" : mat.aspecte?.contorn || "#475569";
  const eti = obj.etiqueta || obj.id;
  const teCavitat = (obj.cavitatsTancades && obj.cavitatsTancades.length > 0) || Boolean(obj.cavitatOberta);
  const x = cx - ampladaPx / 2;
  const y = cy - alcadaPx / 2;

  let figura = "";

  // 1. Corona d'Arquimedes (E4)
  if (id.includes("corona")) {
    figura = `
      <path d="M ${x + 3} ${y + alcadaPx} L ${x} ${y + 6} L ${x + ampladaPx * 0.25} ${y + alcadaPx * 0.55} L ${cx} ${y + 2} L ${x + ampladaPx * 0.75} ${y + alcadaPx * 0.55} L ${x + ampladaPx} ${y + 6} L ${x + ampladaPx - 3} ${y + alcadaPx} Z"
            fill="#FACC15" stroke="#A16207" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="${cx}" cy="${y + 5}" r="2.5" fill="#DC2626"/>
      <circle cx="${x + 2}" cy="${y + 7}" r="2" fill="#2563EB"/>
      <circle cx="${x + ampladaPx - 2}" cy="${y + 7}" r="2" fill="#2563EB"/>
    `;
  }
  // 2. Ou fresc (D5)
  else if (id === "ou" || matId === "ou") {
    const rx = ampladaPx * 0.44;
    const ry = alcadaPx * 0.52;
    figura = `
      <path d="M ${cx} ${cy - ry} C ${cx + rx * 0.85} ${cy - ry}, ${cx + rx} ${cy - ry * 0.1}, ${cx + rx} ${cy + ry * 0.25} C ${cx + rx} ${cy + ry * 0.85}, ${cx + rx * 0.55} ${cy + ry}, ${cx} ${cy + ry} C ${cx - rx * 0.55} ${cy + ry}, ${cx - rx} ${cy + ry * 0.85}, ${cx - rx} ${cy + ry * 0.25} C ${cx - rx} ${cy - ry * 0.1}, ${cx - rx * 0.85} ${cy - ry}, ${cx} ${cy - ry} Z"
            fill="#FDE68A" stroke="#B45309" stroke-width="2"/>
      <ellipse cx="${cx - rx * 0.3}" cy="${cy - ry * 0.25}" rx="${rx * 0.22}" ry="${ry * 0.32}" fill="#FFFFFF" opacity="0.55"/>
    `;
  }
  // 3. Patata sencera o tallada (C4)
  else if (id.startsWith("patata") || matId === "patata") {
    const rx = ampladaPx / 2;
    const ry = alcadaPx / 2;
    const esTallada = id.includes("_");
    figura = esTallada
      ? `
        <path d="M ${cx - rx} ${cy + ry * 0.7} C ${cx - rx} ${cy - ry * 0.9}, ${cx + rx} ${cy - ry * 0.9}, ${cx + rx} ${cy + ry * 0.7} Z"
              fill="#D6A86E" stroke="#78350F" stroke-width="2"/>
        <line x1="${cx - rx + 2}" y1="${cy + ry * 0.65}" x2="${cx + rx - 2}" y2="${cy + ry * 0.65}" stroke="#FEF08A" stroke-width="3"/>
      `
      : `
        <path d="M ${cx - rx} ${cy} C ${cx - rx} ${cy - ry * 0.95}, ${cx + rx * 0.75} ${cy - ry * 1.05}, ${cx + rx} ${cy - ry * 0.1} C ${cx + rx * 1.05} ${cy + ry * 0.9}, ${cx - rx * 0.8} ${cy + ry}, ${cx - rx} ${cy} Z"
              fill="#C69C6D" stroke="#78350F" stroke-width="2"/>
        <circle cx="${cx - rx * 0.45}" cy="${cy - ry * 0.3}" r="1.6" fill="#78350F" opacity="0.65"/>
        <circle cx="${cx + rx * 0.35}" cy="${cy + ry * 0.35}" r="1.8" fill="#78350F" opacity="0.65"/>
      `;
  }
  // 4. Llaunes de refresc (F8)
  else if (id.startsWith("llauna_")) {
    const esZero = id.includes("zero");
    const colLlauna = esZero ? "#0284C7" : "#DC2626";
    figura = `
      <rect x="${x + 5}" y="${y}" width="${ampladaPx - 10}" height="${alcadaPx}" rx="5" fill="${colLlauna}" stroke="#1E293B" stroke-width="1.8"/>
      <rect x="${x + 5}" y="${y}" width="${ampladaPx - 10}" height="5" rx="2" fill="#CBD5E1" stroke="#475569" stroke-width="1.2"/>
      <rect x="${x + 5}" y="${y + alcadaPx - 4}" width="${ampladaPx - 10}" height="4" rx="2" fill="#CBD5E1" stroke="#475569" stroke-width="1.2"/>
      <line x1="${x + 9}" y1="${y + 6}" x2="${x + 9}" y2="${y + alcadaPx - 5}" stroke="#FFFFFF" stroke-width="2" opacity="0.45"/>
    `;
  }
  // 5. Esferes (massisses o amb cavitat interior)
  else if (obj.forma === "esfera" || obj.formaModelada === "bola") {
    const r = Math.min(ampladaPx, alcadaPx) / 2;
    figura = `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" stroke="${contorn}" stroke-width="2"/>
      <ellipse cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" rx="${r * 0.28}" ry="${r * 0.18}" fill="#FFFFFF" opacity="0.5"/>
      ${
        teCavitat
          ? `<circle cx="${cx}" cy="${cy}" r="${r * (mostraVolums ? 0.68 : 0.45)}" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.5" stroke-dasharray="3 2" opacity="${mostraVolums ? "0.95" : "0.65"}"/>`
          : ""
      }
    `;
  }
  // 6. Objectes irregulars (pedra, pedra tosca, etc.)
  else if (obj.forma === "irregular") {
    const rx = ampladaPx / 2;
    const ry = alcadaPx / 2;
    figura = `
      <path d="M ${cx - rx} ${cy + 2} L ${cx - rx * 0.7} ${cy - ry} L ${cx + rx * 0.35} ${cy - ry * 0.9} L ${cx + rx} ${cy - 2} L ${cx + rx * 0.75} ${cy + ry} L ${cx - rx * 0.6} ${cy + ry * 0.95} Z"
            fill="${color}" stroke="${contorn}" stroke-width="2" stroke-linejoin="round"/>
      ${
        matId === "pedra_tosca"
          ? `<circle cx="${cx - 8}" cy="${cy - 5}" r="2" fill="#475569" opacity="0.5"/>
             <circle cx="${cx + 9}" cy="${cy - 4}" r="1.8" fill="#475569" opacity="0.5"/>
             <circle cx="${cx + 6}" cy="${cy + 7}" r="2.2" fill="#475569" opacity="0.5"/>`
          : ""
      }
    `;
  }
  // 7. Blocs, cubs i cilindres (fusta amb veta, suro amb porus, glaçó cristal·lí, metalls amb brillantor)
  else {
    const rx = obj.forma === "cilindre" || obj.formaModelada === "cilindre" ? 8 : 4;
    let detallsMaterial = "";
    if (["pi", "roure", "balsa"].includes(matId) && !obj.misteri) {
      detallsMaterial = `
        <path d="M ${x + 4} ${y + 9} Q ${cx} ${y + 6} ${x + ampladaPx - 4} ${y + 9}" fill="none" stroke="${contorn}" stroke-width="1" opacity="0.45"/>
        <path d="M ${x + 4} ${y + alcadaPx - 8} Q ${cx} ${y + alcadaPx - 5} ${x + ampladaPx - 4} ${y + alcadaPx - 8}" fill="none" stroke="${contorn}" stroke-width="1" opacity="0.45"/>
      `;
    } else if (matId === "suro" && !obj.misteri) {
      detallsMaterial = `
        <circle cx="${x + 9}" cy="${y + 9}" r="1.3" fill="${contorn}" opacity="0.5"/>
        <circle cx="${x + ampladaPx - 10}" cy="${y + 11}" r="1.5" fill="${contorn}" opacity="0.5"/>
        <circle cx="${x + 12}" cy="${y + alcadaPx - 8}" r="1.4" fill="${contorn}" opacity="0.5"/>
      `;
    } else if (matId === "gel") {
      detallsMaterial = `
        <line x1="${x + 6}" y1="${y + 6}" x2="${x + 16}" y2="${y + 14}" stroke="#FFFFFF" stroke-width="2" opacity="0.8"/>
      `;
    }
    figura = `
      <rect x="${x}" y="${y}" width="${ampladaPx}" height="${alcadaPx}" rx="${rx}" fill="${color}" stroke="${contorn}" stroke-width="2"/>
      <line x1="${x + 4}" y1="${y + 4}" x2="${x + ampladaPx - 4}" y2="${y + 4}" stroke="#FFFFFF" stroke-width="1.8" opacity="0.55"/>
      ${detallsMaterial}
      ${
        mostraVolums && teCavitat
          ? `<rect x="${x + 7}" y="${y + 6}" width="${ampladaPx - 14}" height="${alcadaPx - 12}" rx="3" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.5" stroke-dasharray="3 2"/>`
          : ""
      }
    `;
  }

  // Superposició de la retícula de cubets d'1 cm³ directament sobre l'objecte si la vista Cubets està activa
  const capaCubets = mostraCubets
    ? `<rect x="${x + 2}" y="${y + 2}" width="${ampladaPx - 4}" height="${alcadaPx - 4}" rx="3" fill="url(#patro-cubets)" pointer-events="none"/>`
    : "";

  const wEti = Math.max(26, eti.length * 7.2 + 10);
  return `
    <g class="svg-objecte" data-selecciona-obj="${obj.id}" style="cursor:pointer">
      ${figura}
      ${capaCubets}
      <rect x="${cx - wEti / 2}" y="${cy - 9}" width="${wEti}" height="17" rx="4" fill="#0F172A" opacity="0.88"/>
      <text x="${cx}" y="${cy + 3.5}" fill="#FFFFFF" font-size="10.5" font-weight="700" text-anchor="middle">${eti}</text>
    </g>
  `;
}

/**
 * 1. TAULA DE MESURA: Balança + Proveta (amb cota ΔV explícita) + Vas de flotació + Escala de densitats en viu
 */
export function renderitzaTaulaMesura(estat) {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
  const vistes = lab.vistes;

  const idBalanca = Object.keys(lab.ubicacions).find(k => lab.ubicacions[k] === "balanca");
  const idProveta = Object.keys(lab.ubicacions).find(k => lab.ubicacions[k] === "proveta");
  const idVas = Object.keys(lab.ubicacions).find(k => lab.ubicacions[k] === "vas");

  const objBalanca = idBalanca ? lab.objectes[idBalanca] : null;
  const objProveta = idProveta ? lab.objectes[idProveta] : null;
  const objVas = idVas ? lab.objectes[idVas] : null;

  const objSel = lab.objectes[lab.objecteSeleccionat] || lab.objectes.A;
  const magSel = objSel
    ? magnitudsObjecte(objSel, { materials: MATERIALS, nombresSenzills: cfg.nombresSenzills, g: cfg.g })
    : null;

  // --- Càlcul Balança ---
  const modelBal = INSTRUMENTS[lab.balanca.model] || INSTRUMENTS.balanca_laboratori;
  let massaAlPlat = 0;
  let nomMostraBalanca = "Plat buit";
  let idMostraBalanca = "balanca";

  if (objBalanca) {
    const magB = magnitudsObjecte(objBalanca, {
      materials: MATERIALS,
      nombresSenzills: cfg.nombresSenzills,
      g: cfg.g
    });
    massaAlPlat += magB.massa;
    nomMostraBalanca = objBalanca.nom;
    idMostraBalanca = objBalanca.id;
  }

  if (lab.balanca.recipientSobrePlat) {
    const recB = RECIPIENTS[lab.balanca.tipusRecipient] || RECIPIENTS.vas250;
    const liqB = LIQUIDS[lab.balanca.liquidRecipient] || LIQUIDS.aigua;
    const dLiqB = cfg.nombresSenzills ? liqB.dEscolar : liqB.dReferencia;
    const massaLiqB = (lab.balanca.volumRecipient || 0) * dLiqB;
    massaAlPlat += recB.massaBuit + massaLiqB;
    nomMostraBalanca =
      lab.balanca.volumRecipient > 0
        ? `${liqB.nom} (${lab.balanca.volumRecipient} mL)`
        : `${recB.nom} buit`;
    idMostraBalanca = lab.balanca.volumRecipient > 0 ? liqB.id : recB.id;
  }

  const lecturaBal = llegeixInstrument(massaAlPlat, {
    rangMax: modelBal.rangMax,
    resolucio: modelBal.resolucio,
    tara: lab.balanca.tara,
    desplacamentZero: lab.balanca.desplacamentZero,
    unitat: lab.balanca.unitat,
    unitatBase: "g"
  });

  // --- Càlcul Proveta ---
  const recProv = RECIPIENTS[lab.proveta.tipus] || RECIPIENTS.proveta250;
  const liqProv = LIQUIDS[lab.proveta.liquid] || LIQUIDS.aigua;
  const dLiqProv = cfg.nombresSenzills ? liqProv.dEscolar : liqProv.dReferencia;

  let estObjProv = null;
  let vSubProv = 0;
  if (objProveta) {
    estObjProv = estatObjecteEnLiquid(objProveta, dLiqProv, {
      materials: MATERIALS,
      nombresSenzills: cfg.nombresSenzills,
      g: cfg.g,
      vareta: lab.proveta.vareta,
      volumLiquidDisponible: lab.proveta.volumInicial
    });
    vSubProv = estObjProv.volumSubmergit;
  }

  const nivProv = calculaNivellIVessament(
    recProv,
    [{ liquid: liqProv.id, densitat: dLiqProv, volum: lab.proveta.volumInicial }],
    vSubProv
  );
  const meniscProv = llegeixMenisc(nivProv.volumTotalAparent, recProv, {
    tipusMenisc: liqProv.menisc || "concau",
    posicioUll: lab.proveta.posicioUll || "altura",
    puntLectura: lab.proveta.puntLectura || "tangent"
  });

  // --- Càlcul Vas de flotació ---
  const liqVas = LIQUIDS[lab.vas.liquid] || LIQUIDS.aigua;
  const dLiqVas = cfg.nombresSenzills ? liqVas.dEscolar : liqVas.dReferencia;
  let estObjVas = null;
  if (objVas) {
    estObjVas = estatObjecteEnLiquid(objVas, dLiqVas, {
      materials: MATERIALS,
      nombresSenzills: cfg.nombresSenzills,
      g: cfg.g
    });
  }

  // Coordenades SVG de la proveta (yBase = 305, alçada útil = 195 px)
  const yBaseProv = 305;
  const hEscalaPx = 195;
  const fraccioInicialProv = Math.min(1.0, lab.proveta.volumInicial / recProv.capacitat);
  const yInicialProv = yBaseProv - fraccioInicialProv * hEscalaPx;
  const fraccioNivellProv = Math.min(1.06, nivProv.volumTotalAparent / recProv.capacitat);
  const ySuperficieProv = yBaseProv - fraccioNivellProv * hEscalaPx;

  // Coordenades SVG del vas (yBase = 305, ySup = 195)
  const yBaseVas = 305;
  const ySupVas = 195;
  let cyObjVas = 240;
  if (estObjVas) {
    if (cfg.amagaResultats) {
      cyObjVas = 148;
    } else if (estObjVas.sura) {
      const hObjPx = 36;
      const yFonsObj = ySupVas + hObjPx * estObjVas.fraccioSubmergida;
      cyObjVas = yFonsObj - hObjPx / 2;
    } else {
      cyObjVas = yBaseVas - 20;
    }
  }

  return `
    <div class="escena-wrapper">
      <svg viewBox="0 0 880 350" class="svg-escena" role="img" aria-label="Taula de mesura amb balança digital, proveta graduada i vas de flotació">
        ${defsSVGComuns()}
        <!-- Fons i superfície de la taula de laboratori -->
        <rect x="0" y="0" width="880" height="312" fill="#F8FAFC"/>
        <rect x="0" y="312" width="880" height="38" fill="url(#grad-taula)"/>
        <line x1="0" y1="312" x2="880" y2="312" stroke="#94A3B8" stroke-width="2.5"/>

        <!-- Barra d'escala de referència (5 cm) -->
        <g transform="translate(24, 326)">
          <line x1="0" y1="0" x2="60" y2="0" stroke="#475569" stroke-width="2"/>
          <line x1="0" y1="-4" x2="0" y2="4" stroke="#475569" stroke-width="2"/>
          <line x1="60" y1="-4" x2="60" y2="4" stroke="#475569" stroke-width="2"/>
          <text x="30" y="13" fill="#475569" font-size="10" font-weight="600" text-anchor="middle">Escala: 5 cm</text>
        </g>

        <!-- ==================== ESTACIÓ 1: BALANÇA DIGITAL (x = 30..275) ==================== -->
        <g class="zona-drop" data-drop-zone="balanca" style="cursor:pointer">
          <title>Fes clic o arrossega per pesar «${objSel?.nom || "l'objecte"}» a la balança</title>
          <rect x="30" y="52" width="245" height="256" rx="10" fill="transparent" stroke="transparent" class="drop-highlight"/>
          <text x="152" y="36" fill="#16303F" font-size="13" font-weight="700" text-anchor="middle">1. Balança (${modelBal.model}, ${formataNombre(modelBal.resolucio)} g)</text>

          <!-- Plat metàl·lic i cos de la balança -->
          <rect x="72" y="226" width="160" height="8" rx="3" fill="#94A3B8" stroke="#475569" stroke-width="1.5"/>
          <rect x="139" y="234" width="26" height="14" fill="#64748B"/>
          <path d="M 58 248 L 246 248 L 258 310 L 46 310 Z" fill="#FFFFFF" stroke="#64748B" stroke-width="2"/>

          <!-- Pantalla LCD de la balança -->
          <rect x="79" y="259" width="146" height="36" rx="5" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
          <text x="215" y="284" fill="#38BDF8" font-family="monospace" font-size="20" font-weight="700" text-anchor="end">
            ${lecturaBal.sobrecarrega ? "— — —" : `${lecturaBal.lecturaFormatada} ${lecturaBal.unitat}`}
          </text>
          ${
            lab.balanca.tara !== 0
              ? `<text x="87" y="272" fill="#FBBF24" font-size="9" font-weight="700">TARA</text>`
              : ""
          }

          <!-- Recipient per pesar líquids si està actiu -->
          ${
            lab.balanca.recipientSobrePlat
              ? `
            <g>
              <rect x="112" y="144" width="80" height="82" rx="3" fill="url(#grad-vidre)" stroke="#475569" stroke-width="2"/>
              ${
                lab.balanca.volumRecipient > 0
                  ? `<rect x="114" y="${224 - Math.min(75, (lab.balanca.volumRecipient / 1000) * 75)}" width="76" height="${Math.min(75, (lab.balanca.volumRecipient / 1000) * 75)}" fill="${(LIQUIDS[lab.balanca.liquidRecipient] || LIQUIDS.aigua).color}" opacity="0.85"/>`
                  : ""
              }
              <text x="152" y="136" fill="#16303F" font-size="10.5" font-weight="600" text-anchor="middle">${nomMostraBalanca}</text>
            </g>`
              : ""
          }

          <!-- Objecte sobre el plat de la balança -->
          ${objBalanca ? dibuixaObjecteSVG(objBalanca, 152, 204, 56, 42, vistes.volums, vistes.cubets) : ""}
          ${
            !objBalanca && !lab.balanca.recipientSobrePlat
              ? `<g opacity="0.85">
                  <rect x="82" y="176" width="140" height="34" rx="6" fill="#F1F5F9" stroke="#94A3B8" stroke-dasharray="4 3"/>
                  <text x="152" y="191" fill="#334155" font-size="10" font-weight="600" text-anchor="middle">Fes clic aquí o arrossega</text>
                  <text x="152" y="203" fill="#0E7C86" font-size="10" font-weight="700" text-anchor="middle">per pesar «${objSel?.etiqueta || "A"}»</text>
                 </g>`
              : ""
          }
        </g>

        <!-- ==================== ESTACIÓ 2: PROVETA GRADUADA AMB COTA ΔV (x = 295..565) ==================== -->
        <g class="zona-drop" data-drop-zone="proveta" style="cursor:pointer">
          <title>Fes clic o arrossega per submergir «${objSel?.nom || "l'objecte"}» a la proveta</title>
          <rect x="295" y="50" width="270" height="258" rx="10" fill="transparent" stroke="transparent" class="drop-highlight"/>
          <text x="438" y="36" fill="#16303F" font-size="13" font-weight="700" text-anchor="middle">2. ${recProv.nom} (div. ${formataNombre(recProv.graduacio)} mL · Ø ${formataNombre(recProv.diametreBoca)} cm)</text>

          <!-- Base i cos cilíndric de la proveta -->
          <rect x="382" y="299" width="112" height="11" rx="3" fill="#CBD5E1" stroke="#475569" stroke-width="2"/>
          <rect x="398" y="89" width="80" height="210" fill="url(#grad-vidre)" stroke="#475569" stroke-width="2.2"/>

          <!-- Líquid dins la proveta i corba del menisc -->
          <rect x="400" y="${Math.max(90, ySuperficieProv - 6)}" width="76" height="${Math.max(0, yBaseProv - 6 - Math.max(90, ySuperficieProv - 6))}" fill="${liqProv.color}" opacity="0.84"/>
          <path d="M 400 ${Math.max(90, ySuperficieProv - 6)} Q 438 ${Math.max(90, ySuperficieProv - 6) + (liqProv.menisc === "convex" ? -5 : 5)} 476 ${Math.max(90, ySuperficieProv - 6)}"
                fill="none" stroke="#0284C7" stroke-width="2.2"/>

          <!-- Línia de memòria del nivell inicial V0 i cota ΔV quan hi ha un objecte submergit -->
          ${
            objProveta && nivProv.pujadaNivell > 0.05
              ? `
            <g class="cota-desplacament">
              <!-- Línia discontínua del nivell inicial V0 -->
              <line x1="382" y1="${yInicialProv - 6}" x2="478" y2="${yInicialProv - 6}" stroke="#D97706" stroke-width="1.8" stroke-dasharray="4 3"/>
              <text x="394" y="${yInicialProv + 7}" fill="#B45309" font-size="9.5" font-weight="700" text-anchor="end">V₀ = ${formataNombre(lab.proveta.volumInicial)} mL</text>

              <!-- Fletxa de cota ΔV entre V0 i Vf -->
              <line x1="388" y1="${yInicialProv - 6}" x2="388" y2="${Math.max(92, ySuperficieProv - 6)}" stroke="#0F766E" stroke-width="2.5"/>
              <rect x="294" y="${(yInicialProv + Math.max(92, ySuperficieProv)) / 2 - 20}" width="90" height="26" rx="5" fill="#CCFBF1" stroke="#0F766E" stroke-width="1.5"/>
              <text x="339" y="${(yInicialProv + Math.max(92, ySuperficieProv)) / 2 - 9}" fill="#0F766E" font-size="9.5" font-weight="700" text-anchor="middle">Desplaçament ΔV</text>
              <text x="339" y="${(yInicialProv + Math.max(92, ySuperficieProv)) / 2 + 2}" fill="#115E59" font-size="11" font-weight="800" text-anchor="middle">+${formataNombre(nivProv.pujadaNivell)} cm³</text>
            </g>`
              : `
            <!-- Indicador de lectura del nivell inicial quan no hi ha objecte -->
            <g transform="translate(314, ${Math.max(98, Math.min(278, ySuperficieProv - 18))})">
              <rect x="0" y="0" width="76" height="22" rx="5" fill="#1D6FB8"/>
              <text x="38" y="14.5" fill="#FFFFFF" font-size="10.5" font-weight="700" text-anchor="middle">
                V₀ = ${formataNombre(meniscProv.lecturaObservada)} mL
              </text>
            </g>`
          }

          <!-- Indicador del nivell final Vf quan hi ha objecte -->
          ${
            objProveta
              ? `<g transform="translate(314, ${Math.max(88, Math.min(255, ySuperficieProv - 22))})">
                  <rect x="0" y="0" width="76" height="20" rx="4" fill="#1D6FB8"/>
                  <text x="38" y="13.5" fill="#FFFFFF" font-size="10" font-weight="700" text-anchor="middle">
                    ${nivProv.foraDEscala ? "Fora d'escala!" : `Vf = ${formataNombre(meniscProv.lecturaObservada)} mL`}
                  </text>
                 </g>`
              : ""
          }

          <!-- Objecte dins la proveta -->
          ${
            objProveta && estObjProv
              ? dibuixaObjecteSVG(
                  objProveta,
                  438,
                  estObjProv.sura && !lab.proveta.vareta ? ySuperficieProv : yBaseProv - 28,
                  44,
                  32,
                  vistes.volums,
                  vistes.cubets
                )
              : ""
          }

          <!-- Alerta pedagògica si l'objecte sura a la proveta i la vareta no està activada -->
          ${
            objProveta && estObjProv && estObjProv.sura && !lab.proveta.vareta
              ? `<g>
                  <rect x="336" y="54" width="204" height="26" rx="5" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5"/>
                  <text x="438" y="70" fill="#92400E" font-size="10" font-weight="700" text-anchor="middle">⚠ Sura! Activa la «Vareta» per al volum total</text>
                 </g>`
              : ""
          }

          <!-- Vareta d'immersió si està activada -->
          ${
            lab.proveta.vareta && objProveta
              ? `
            <line x1="438" y1="68" x2="438" y2="${yBaseProv - 44}" stroke="#0F766E" stroke-width="3" stroke-linecap="round"/>
            <circle cx="438" cy="68" r="5" fill="#0F766E"/>
            <text x="448" y="74" fill="#0F766E" font-size="10" font-weight="700">Vareta activa</text>
          `
              : ""
          }

          <!-- Marques de graduació de la proveta -->
          ${[0.2, 0.4, 0.6, 0.8, 1.0]
            .map(f => {
              const yM = yBaseProv - 6 - f * hEscalaPx;
              const vM = Math.round(recProv.capacitat * f);
              return `
              <line x1="462" y1="${yM}" x2="478" y2="${yM}" stroke="#16303F" stroke-width="1.5"/>
              <text x="483" y="${yM + 3.5}" fill="#16303F" font-size="10" font-weight="600">${vM}</text>
            `;
            })
            .join("")}
        </g>

        <!-- ==================== ESTACIÓ 3: VAS DE FLOTACIÓ (x = 585..860) ==================== -->
        <g class="zona-drop" data-drop-zone="vas" style="cursor:pointer">
          <title>Fes clic o arrossega per provar si «${objSel?.nom || "l'objecte"}» sura al vas</title>
          <rect x="585" y="52" width="275" height="256" rx="10" fill="transparent" stroke="transparent" class="drop-highlight"/>
          <text x="722" y="36" fill="#16303F" font-size="13" font-weight="700" text-anchor="middle">3. Vas de flotació (${liqVas.nom}: ${formataNombre(dLiqVas, 2)} g/cm³)</text>

          <!-- Vas de 600 mL -->
          <rect x="632" y="130" width="180" height="180" rx="6" fill="url(#grad-vidre)" stroke="#475569" stroke-width="2.2"/>
          <rect x="634" y="${ySupVas - 4}" width="176" height="${yBaseVas - ySupVas + 10}" rx="4" fill="${liqVas.color}" opacity="0.84"/>
          <line x1="634" y1="${ySupVas - 4}" x2="810" y2="${ySupVas - 4}" stroke="#0284C7" stroke-width="2"/>

          <!-- Objecte al vas -->
          ${objVas ? dibuixaObjecteSVG(objVas, 722, cyObjVas - 4, 58, 36, vistes.volums, vistes.cubets) : ""}
          ${
            objVas && estObjVas && vistes.forces && !cfg.amagaResultats
              ? dibuixaVectorsForcaSVG({
                  cx: 722,
                  cy: cyObjVas - 4,
                  pes: estObjVas.pes,
                  empenyiment: estObjVas.empenyiment,
                  normal: estObjVas.normal,
                  mostraValors: true
                })
              : ""
          }

          <!-- Etiqueta d'estat de flotació al vas -->
          ${
            objVas && estObjVas
              ? `<rect x="632" y="92" width="180" height="26" rx="6" fill="${estObjVas.sura ? "#DCFCE7" : "#FEE2E2"}" stroke="${estObjVas.sura ? "#16A34A" : "#DC2626"}" stroke-width="1.5"/>
                 <text x="722" y="109" fill="#16303F" font-size="11" font-weight="700" text-anchor="middle">
                   ${
                     cfg.amagaResultats
                       ? "Prediu abans de deixar anar!"
                       : estObjVas.sura
                       ? `Sura (${formataNombre(estObjVas.percentatgeSubmergit, 1)} % submergit)`
                       : "S'enfonsa al fons (d > dL)"
                   }
                 </text>`
              : `<g opacity="0.88">
                  <rect x="652" y="232" width="140" height="32" rx="6" fill="#FFFFFF" fill-opacity="0.82" stroke="#0284C7" stroke-dasharray="4 3"/>
                  <text x="722" y="246" fill="#16303F" font-size="10" font-weight="600" text-anchor="middle">Fes clic aquí per provar</text>
                  <text x="722" y="258" fill="#0E7C86" font-size="10" font-weight="700" text-anchor="middle">si «${objSel?.etiqueta || "A"}» sura o s'enfonsa</text>
                 </g>`
          }
        </g>
      </svg>

      <!-- Escala comparativa de densitats i frontera de flotació en viu -->
      ${renderitzaEscalaDensitatsViva(estat, dLiqVas, liqVas.nom)}

      <!-- Barra de controls ràpids de cada instrument de la Taula de Mesura -->
      <div class="controls-estacions-grid">
        <!-- Controls Balança -->
        <div class="targeta-control-estacio">
          <div class="fila-entre">
            <strong>${icona("balanca")} Balança digital</strong>
            <select id="sel-model-balanca" aria-label="Model de balança">
              <option value="balanca_cuina" ${lab.balanca.model === "balanca_cuina" ? "selected" : ""}>Cuina (5000 g · 1 g)</option>
              <option value="balanca_laboratori" ${lab.balanca.model === "balanca_laboratori" ? "selected" : ""}>Laboratori (2000 g · 0,1 g)</option>
              <option value="balanca_precisio" ${lab.balanca.model === "balanca_precisio" ? "selected" : ""}>Precisió (200 g · 0,01 g)</option>
            </select>
          </div>
          <div class="bts-estacio">
            <button type="button" class="bt bt-secundari bt-petit" data-accio-balanca="tara">Tara (0,0)</button>
            <button type="button" class="bt bt-secundari bt-petit" data-accio-balanca="unitat">Unitat (${lab.balanca.unitat})</button>
            <button type="button" class="bt bt-secundari bt-petit ${lab.balanca.recipientSobrePlat ? "actiu" : ""}" data-accio-balanca="recipient">
              ${lab.balanca.recipientSobrePlat ? "Treu recipient" : "+ Vas / 1 L líquid"}
            </button>
            <button type="button" class="bt bt-primari bt-petit" data-anota-instrument="balanca"
                    data-obj-id="${idMostraBalanca}" data-obj-nom="${nomMostraBalanca}"
                    data-val="${lecturaBal.lectura ?? 0}" data-uni="${lecturaBal.unitat}" data-res="${lecturaBal.resolucio}" data-inst="${modelBal.nom}">
              ${icona("anota")} Anota (${lecturaBal.lecturaFormatada} ${lecturaBal.unitat})
            </button>
          </div>
          ${
            lab.balanca.recipientSobrePlat
              ? `<div class="subcontrol-recipient-balanca">
                  <select id="sel-liq-balanca" aria-label="Líquid a pesar">
                    ${["aigua", "oli", "alcohol", "llet", "mel", "glicerina"].map(l => `<option value="${l}" ${lab.balanca.liquidRecipient === l ? "selected" : ""}>${LIQUIDS[l].nom}</option>`).join("")}
                  </select>
                  <select id="sel-vol-balanca" aria-label="Volum al recipient">
                    ${[0, 50, 100, 150, 500, 1000].map(v => `<option value="${v}" ${Number(lab.balanca.volumRecipient) === v ? "selected" : ""}>${v === 0 ? "Recipient buit" : `${v} mL`}</option>`).join("")}
                  </select>
                </div>`
              : ""
          }
        </div>

        <!-- Controls Proveta -->
        <div class="targeta-control-estacio">
          <div class="fila-entre">
            <strong>${icona("proveta")} Proveta i menisc</strong>
            <select id="sel-model-proveta" aria-label="Mida de la proveta">
              <option value="proveta25" ${lab.proveta.tipus === "proveta25" ? "selected" : ""}>25 mL (div. 0,5 mL · Ø 1,6 cm)</option>
              <option value="proveta100" ${lab.proveta.tipus === "proveta100" ? "selected" : ""}>100 mL (div. 1 mL · Ø 2,6 cm)</option>
              <option value="proveta250" ${lab.proveta.tipus === "proveta250" ? "selected" : ""}>250 mL (div. 2 mL · Ø 3,6 cm)</option>
              <option value="proveta500" ${lab.proveta.tipus === "proveta500" ? "selected" : ""}>500 mL (div. 5 mL · Ø 5,0 cm)</option>
              <option value="proveta1000" ${lab.proveta.tipus === "proveta1000" ? "selected" : ""}>1000 mL (div. 10 mL · Ø 6,0 cm)</option>
            </select>
          </div>
          <div class="bts-estacio">
            <button type="button" class="bt bt-secundari bt-petit ${lab.proveta.vareta ? "actiu" : ""}" data-accio-proveta="vareta">
              ${icona("vareta")} Vareta (${lab.proveta.vareta ? "Sí" : "No"})
            </button>
            <button type="button" class="bt bt-secundari bt-petit" data-obre-eina="lupa">
              ${icona("lupa")} Lupa menisc
            </button>
            ${
              objProveta && (!estObjProv.sura || lab.proveta.vareta) && !nivProv.foraDEscala
                ? `<button type="button" class="bt bt-primari bt-petit" data-anota-instrument="proveta"
                          data-obj-id="${objProveta.id}" data-obj-nom="${objProveta.nom}"
                          data-mag="Volum per desplaçament" data-val="${nivProv.pujadaNivell}" data-uni="cm³" data-res="${recProv.graduacio}" data-inst="${recProv.nom}">
                    ${icona("anota")} Anota ΔV (${formataNombre(nivProv.pujadaNivell)} cm³)
                  </button>`
                : `<button type="button" class="bt bt-primari bt-petit" data-anota-instrument="proveta"
                          data-obj-id="${objProveta ? objProveta.id : lab.proveta.liquid}" data-obj-nom="${objProveta ? objProveta.nom : liqProv.nom}"
                          data-mag="Volum llegit" data-val="${meniscProv.lecturaObservada ?? 0}" data-uni="mL" data-res="${recProv.graduacio}" data-inst="${recProv.nom}">
                    ${icona("anota")} Anota lectura (${formataNombre(meniscProv.lecturaObservada)} mL)
                  </button>`
            }
          </div>
        </div>

        <!-- Controls Vas de Flotació -->
        <div class="targeta-control-estacio">
          <div class="fila-entre">
            <strong>${icona("vas")} Vas d'assaig</strong>
            <select id="sel-liquid-vas" aria-label="Líquid del vas">
              ${["aigua", "alcohol", "oli", "aigua_salada", "mel", "mercuri"]
                .map(
                  l =>
                    `<option value="${l}" ${lab.vas.liquid === l ? "selected" : ""}>${LIQUIDS[l].nom} (${formataNombre(cfg.nombresSenzills ? LIQUIDS[l].dEscolar : LIQUIDS[l].dReferencia, 2)} g/cm³)</option>`
                )
                .join("")}
            </select>
          </div>
          <div class="bts-estacio">
            ${
              objVas && estObjVas
                ? `<button type="button" class="bt bt-primari bt-petit" data-anota-instrument="vas"
                          data-obj-id="${objVas.id}" data-obj-nom="${objVas.nom}"
                          data-mag="Flotació en ${liqVas.nom}" data-val="${estObjVas.percentatgeSubmergit}" data-uni="%" data-res="1" data-inst="Vas d'assaig">
                    ${icona("anota")} Anota resultat (${estObjVas.sura ? `Sura ${formataNombre(estObjVas.percentatgeSubmergit, 0)} %` : "S'enfonsa"})
                  </button>`
                : `<span class="etiqueta-petita">Fes clic al vas o arrossega qualsevol objecte per comprovar si sura o s'enfonsa.</span>`
            }
          </div>
        </div>
      </div>

      ${renderitzaPanellVistesEspecials(objSel, magSel, vistes, dLiqVas, liqVas.nom)}
    </div>
  `;
}

/**
 * 2. TAULA DE LA COLUMNA: Columna de líquids + Vas amb sal i l'ou (D3, D5, D7)
 */
export function renderitzaTaulaColumna(estat) {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
  const vistes = lab.vistes;
  const capes = lab.columna.capes || [];

  const disSal = calculaDissolucioSal(500, lab.salGrams || 0, cfg.nombresSenzills);
  const objOu = lab.objectes.ou || { id: "ou", nom: "Ou fresc", etiqueta: "Ou", forma: "esfera", massaFixa: 60, parts: [{ material: "ou", volum: 56 }] };
  const estOu = estatObjecteEnLiquid(objOu, disSal.densitat, {
    materials: MATERIALS,
    nombresSenzills: cfg.nombresSenzills,
    g: cfg.g
  });

  const bolesIds = lab.columna.objectesEnColumna || ["bola_col_poliestire", "bola_col_cera", "bola_col_polietile", "bola_col_nilo", "bola_col_estany"];
  const idExtraCol = Object.keys(lab.ubicacions).find(k => lab.ubicacions[k] === "columna");
  const llistaBoles = [...new Set([...bolesIds, ...(idExtraCol ? [idExtraCol] : [])])];

  const yBaseCol = 300;
  const hTotalColPx = 200;
  const volTotalCapes = Math.max(100, capes.reduce((s, c) => s + c.volum, 0));
  let yCursor = yBaseCol;
  const capesRender = capes.map((c, idx) => {
    const hPx = (c.volum / Math.max(400, volTotalCapes)) * hTotalColPx;
    const ySup = yCursor - hPx;
    const item = { ...c, idx, yInf: yCursor, ySup, hPx };
    yCursor = ySup;
    return item;
  });

  const objSel = lab.objectes[lab.objecteSeleccionat] || objOu;
  const magSel = magnitudsObjecte(objSel, { materials: MATERIALS, nombresSenzills: cfg.nombresSenzills, g: cfg.g });

  return `
    <div class="escena-wrapper">
      <svg viewBox="0 0 880 345" class="svg-escena" role="img" aria-label="Taula de la columna de densitats i dissolució d'aigua amb sal">
        ${defsSVGComuns()}
        <rect x="0" y="0" width="880" height="308" fill="#F8FAFC"/>
        <rect x="0" y="308" width="880" height="37" fill="url(#grad-taula)"/>
        <line x1="0" y1="308" x2="880" y2="308" stroke="#94A3B8" stroke-width="2.5"/>

        <!-- ==================== ESTACIÓ 1: COLUMNA DE LÍQUIDS (x = 40..460) ==================== -->
        <g class="zona-drop" data-drop-zone="columna" style="cursor:pointer">
          <title>Fes clic per deixar caure «${objSel.nom}» a la columna de líquids</title>
          <text x="245" y="34" fill="#16303F" font-size="13.5" font-weight="700" text-anchor="middle">1. Columna de líquids i fronteres d'equilibri (D3, D7)</text>
          <rect x="145" y="298" width="170" height="11" rx="3" fill="#CBD5E1" stroke="#475569" stroke-width="2"/>
          <rect x="160" y="70" width="140" height="228" fill="url(#grad-vidre)" stroke="#475569" stroke-width="2.5"/>

          <!-- Capes de líquids ordenades -->
          ${capesRender
            .map(
              c => `
            <g>
              <rect x="162" y="${c.ySup}" width="136" height="${c.hPx}" fill="${c.color}" opacity="0.86"/>
              <line x1="162" y1="${c.ySup}" x2="298" y2="${c.ySup}" stroke="#334155" stroke-width="1.5" ${c.inestable ? 'stroke-dasharray="4 3"' : ""}/>
              <rect x="308" y="${c.ySup + c.hPx / 2 - 10}" width="145" height="20" rx="4" fill="#FFFFFF" stroke="#CBD5E1"/>
              <text x="315" y="${c.ySup + c.hPx / 2 + 4}" fill="#16303F" font-size="10.5" font-weight="700">
                ${c.nom}: ${formataNombre(c.densitat, 2)} g/cm³${c.inestable ? " ⚠" : ""}
              </text>
            </g>`
            )
            .join("")}

          <!-- Boles posicionades a les seves fronteres exactes -->
          ${llistaBoles
            .map((bId, i) => {
              const objB = lab.objectes[bId];
              if (!objB || capesRender.length === 0) return "";
              const estCol = estatObjecteEnColumna(objB, capesRender, {
                materials: MATERIALS,
                nombresSenzills: cfg.nombresSenzills,
                g: cfg.g
              });
              let cyBola = yBaseCol - 15;
              if (estCol.posicio === "superficie") {
                cyBola = capesRender[capesRender.length - 1].ySup;
              } else if (estCol.posicio === "fons") {
                cyBola = yBaseCol - 14;
              } else if (estCol.posicio === "frontera") {
                const cInf = capesRender[estCol.indexCapaInferior];
                if (cInf) cyBola = cInf.ySup;
              } else if (estCol.posicio === "dins_capa") {
                const c = capesRender[estCol.indexCapaInferior];
                if (c) cyBola = c.ySup + c.hPx / 2;
              }
              const cxBola = 185 + ((i * 23) % 90);
              return dibuixaObjecteSVG(objB, cxBola, cyBola, 28, 28, vistes.volums, vistes.cubets);
            })
            .join("")}
        </g>

        <!-- ==================== ESTACIÓ 2: L'OU I L'AIGUA SALADA (x = 490..850) ==================== -->
        <g class="zona-drop" data-drop-zone="vas" style="cursor:pointer">
          <text x="675" y="34" fill="#16303F" font-size="13.5" font-weight="700" text-anchor="middle">2. Dissolució de sal i flotació de l'ou (D5)</text>

          <rect x="575" y="106" width="200" height="202" rx="6" fill="url(#grad-vidre)" stroke="#475569" stroke-width="2.5"/>
          <rect x="577" y="140" width="196" height="166" rx="4" fill="${disSal.pctMassa > 2 ? "#67E8F9" : "#BAE6FD"}" opacity="0.84"/>
          <line x1="577" y1="140" x2="773" y2="140" stroke="#0284C7" stroke-width="2"/>

          <!-- Puntets de sal dissolta i sal al fons quan se supera la saturació (26 %) -->
          ${
            (lab.salGrams || 0) > 0
              ? `<g opacity="0.55">
                  <circle cx="610" cy="180" r="1.5" fill="#FFFFFF"/><circle cx="735" cy="195" r="1.5" fill="#FFFFFF"/>
                  <circle cx="640" cy="240" r="1.5" fill="#FFFFFF"/><circle cx="715" cy="255" r="1.5" fill="#FFFFFF"/>
                 </g>`
              : ""
          }
          ${
            disSal.massaSalFons > 0
              ? `<rect x="585" y="296" width="180" height="9" rx="4" fill="#F8FAFC" stroke="#94A3B8"/>
                 <text x="675" y="291" fill="#475569" font-size="10" font-weight="700" text-anchor="middle">Sal al fons (${formataNombre(disSal.massaSalFons, 1)} g · saturació 26 %!)</text>`
              : ""
          }

          <!-- Dibuix de l'ou (sura si dLiq >= 1,071 g/cm³) -->
          ${dibuixaObjecteSVG(
            objOu,
            675,
            estOu.sura ? 140 + 38 * estOu.fraccioSubmergida - 19 : 278,
            42,
            38,
            vistes.volums,
            vistes.cubets
          )}
          ${
            vistes.forces
              ? dibuixaVectorsForcaSVG({
                  cx: 675,
                  cy: estOu.sura ? 140 + 38 * estOu.fraccioSubmergida - 19 : 278,
                  pes: estOu.pes,
                  empenyiment: estOu.empenyiment,
                  normal: estOu.normal,
                  mostraValors: true
                })
              : ""
          }

          <!-- Marcador comparatiu de densitat de l'aigua salada vs l'ou -->
          <rect x="528" y="50" width="294" height="44" rx="6" fill="#0F172A"/>
          <text x="675" y="67" fill="#E2E8F0" font-size="10.5" text-anchor="middle">
            Sal afegida: ${formataNombre(lab.salGrams || 0)} g (${formataNombre(disSal.pctMassa, 1)} % massa) · Densitat ou: 1,071 g/cm³
          </text>
          <text x="675" y="84" fill="${estOu.sura ? "#4ADE80" : "#38BDF8"}" font-size="11.5" font-weight="700" text-anchor="middle">
            d_líquid = ${formataNombre(disSal.densitat, 3)} g/mL ${estOu.sura ? "> 1,071 → L'OU SURA!" : "< 1,071 → L'ou s'enfonsa"}
          </text>
        </g>
      </svg>

      <!-- Escala comparativa de densitats per al vas de sal i les boles -->
      ${renderitzaEscalaDensitatsViva(estat, disSal.densitat, `aigua salada (${formataNombre(disSal.pctMassa, 0)} %)`)}

      <div class="controls-estacions-grid">
        <div class="targeta-control-estacio">
          <div class="fila-entre">
            <strong>Columna de líquids (abocar i remenar)</strong>
            <label class="fila-switch">
              <input type="checkbox" id="chk-amb-cura" ${lab.columna.ambCura ? "checked" : ""}>
              <span>Aboca amb cura</span>
            </label>
          </div>
          <div class="bts-estacio">
            ${["mel", "aigua", "oli", "alcohol"]
              .map(
                l => `
              <button type="button" class="bt bt-secundari bt-petit" data-aboca-columna="${l}">
                + ${LIQUIDS[l].nom.split(" ")[0]} (${formataNombre(LIQUIDS[l].dEscolar, 2)})
              </button>`
              )
              .join("")}
            <button type="button" class="bt bt-secundari bt-petit" data-accio-columna="remena">
              ${icona("remena")} Remena
            </button>
            <button type="button" class="bt bt-secundari bt-petit" data-accio-columna="quatre_capes">
              4 capes (D3)
            </button>
            <button type="button" class="bt bt-secundari bt-petit" data-accio-columna="buida">
              Buida
            </button>
            <button type="button" class="bt bt-primari bt-petit" data-anota-instrument="columna"
                    data-obj-id="columna" data-obj-nom="Columna (${capes.length} capes)"
                    data-mag="Densitat capa superior" data-val="${capes[capes.length - 1]?.densitat ?? 1}" data-uni="g/cm³" data-res="0.01" data-inst="Columna">
              ${icona("anota")} Anota
            </button>
          </div>
        </div>

        <div class="targeta-control-estacio">
          <div class="fila-entre">
            <strong>${icona("sal")} Aigua amb sal i l'ou (500 mL d'aigua inicial)</strong>
            <span>Ou: 60 g / 56 cm³ (1,071 g/cm³)</span>
          </div>
          <div class="bts-estacio">
            <button type="button" class="bt bt-primari bt-petit" data-afegeix-sal="5">+ 1 cullerada de sal (5 g)</button>
            <button type="button" class="bt bt-secundari bt-petit" data-afegeix-sal="25">+ 5 cullerades (25 g)</button>
            <button type="button" class="bt bt-secundari bt-petit" data-afegeix-sal="0">Aigua dolça (0 g sal)</button>
            <button type="button" class="bt bt-primari bt-petit" data-anota-instrument="sal"
                    data-obj-id="ou" data-obj-nom="Ou en aigua amb ${lab.salGrams || 0} g de sal"
                    data-mag="Densitat aigua salada" data-val="${disSal.densitat}" data-uni="g/mL" data-res="0.001" data-inst="Matràs 100 mL + Balança">
              ${icona("anota")} Anota (${formataNombre(disSal.densitat, 3)} g/mL)
            </button>
          </div>
        </div>
      </div>

      ${renderitzaPanellVistesEspecials(objSel, magSel, vistes, disSal.densitat, "aigua salada")}
    </div>
  `;
}

/**
 * 3. TAULA DEL TANC: Dinamòmetre + Vas de vessament d'Arquimedes + Mòduls de Barques, Submarí, Pressió, Globus, Temperatura i Densímetre
 */
export function renderitzaTaulaTanc(estat) {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
  const vistes = lab.vistes;
  const modeEsp = lab.tanc.modeEspecial || "normal";

  const liqTanc = LIQUIDS[lab.tanc.liquid] || LIQUIDS.aigua;
  const dLiq =
    modeEsp === "temperatura"
      ? densitatAiguaTemperatura(lab.tanc.temperaturaC ?? 20, (lab.tanc.temperaturaC ?? 20) < 0 ? "gel" : "liquid")
      : cfg.nombresSenzills
      ? liqTanc.dEscolar
      : liqTanc.dReferencia;

  const idObjTanc =
    Object.keys(lab.ubicacions).find(k => lab.ubicacions[k] === "tanc" || lab.ubicacions[k] === "dinamometre") ||
    lab.objecteSeleccionat ||
    "A";
  const objActiu = lab.objectes[idObjTanc] || lab.objectes.A;

  const dinRes = calculaDinamometre(objActiu, {
    liquid: dLiq,
    fraccioImmersio: lab.tanc.fraccioImmersio ?? 1,
    recolzatAlFons: lab.tanc.recolzatAlFons,
    g: cfg.g,
    materials: MATERIALS,
    nombresSenzills: cfg.nombresSenzills
  });

  const bucRes = calculaBuc({
    ...lab.taller.barca,
    densitatLiquid: dLiq,
    g: cfg.g
  });
  const nomMaterialBarca = MATERIALS[bucRes.material]?.nom || bucRes.material || "plastilina";

  const subRes = estatSubmari({
    volumExterior: 1000,
    massaBuc: 700,
    capacitatTanc: 400,
    volumAiguaTanc: lab.tanc.submariVolumAigua ?? 300,
    densitatLiquid: dLiq,
    g: cfg.g
  });
  const gasInfo = GASOS[lab.tanc.globusGas || "heli"] || GASOS.heli;
  const globusRes = estatGlobus({
    volumLitres: lab.tanc.globusVolumL ?? 10,
    densitatGasGperL: cfg.nombresSenzills ? gasInfo.dEscolar : gasInfo.dReferencia,
    massaCobertaGrams: 3,
    densitatAireGperL: 1.2,
    g: cfg.g
  });
  const pressioSonda = calculaPressioHidrostatica(dLiq, lab.tanc.sondaProfunditatCm ?? 20, cfg.g);
  const forcesBlocG3 = calculaForcesPressioBloc({
    densitatLiquid: dLiq,
    arestaCm: 10,
    profunditatCaraSuperiorCm: Math.max(2, (lab.tanc.sondaProfunditatCm ?? 15) - 5),
    g: cfg.g
  });

  return `
    <div class="escena-wrapper">
      <!-- Selector de mòdul del Tanc -->
      <div class="barra-submodes-tanc" role="tablist" aria-label="Muntatges de la taula del tanc">
        ${[
          { id: "normal", label: "Dinamòmetre i Arquimedes", ic: "dinamometre" },
          { id: "barca", label: "Barques i càrrega (F1–F4)", ic: "barca" },
          { id: "submari", label: "Submarí (F5)", ic: "submari" },
          { id: "pressio", label: "Pressió i hidrostàtica (G1–G3)", ic: "sonda" },
          { id: "globus", label: "Globus i gasos (F9)", ic: "globus" },
          { id: "temperatura", label: "Temperatura (F10)", ic: "termometre" },
          { id: "densimetre", label: "Densímetre (F11)", ic: "proveta" }
        ]
          .map(
            m => `
          <button type="button" class="bt-submode ${modeEsp === m.id ? "actiu" : ""}" data-tanc-mode="${m.id}">
            ${icona(m.ic)} ${m.label}
          </button>`
          )
          .join("")}
      </div>

      <svg viewBox="0 0 880 335" class="svg-escena" role="img" aria-label="Tanc hidrostàtic, dinamòmetre i vas de vessament">
        ${defsSVGComuns()}
        <rect x="0" y="0" width="880" height="298" fill="#F8FAFC"/>
        <rect x="0" y="298" width="880" height="37" fill="url(#grad-taula)"/>
        <line x1="0" y1="298" x2="880" y2="298" stroke="#94A3B8" stroke-width="2.5"/>

        <!-- Suport i Tanc Principal (x = 110..520) -->
        <g class="zona-drop" data-drop-zone="tanc" style="cursor:pointer">
          <rect x="110" y="75" width="410" height="221" rx="6" fill="url(#grad-vidre)" stroke="#334155" stroke-width="2.5"/>
          <rect x="113" y="115" width="404" height="178" rx="4" fill="${liqTanc.color}" opacity="0.84"/>
          <line x1="113" y1="115" x2="517" y2="115" stroke="#0284C7" stroke-width="2.2"/>
        </g>

        <!-- Regle lateral del tanc (profunditat en cm) -->
        ${[0, 10, 20, 30, 40]
          .map(cm => {
            const yCm = 115 + (cm / 45) * 175;
            return `
            <line x1="110" y1="${yCm}" x2="122" y2="${yCm}" stroke="#16303F" stroke-width="1.5"/>
            <text x="104" y="${yCm + 3.5}" fill="#16303F" font-size="10" font-weight="600" text-anchor="end">${cm} cm</text>
          `;
          })
          .join("")}

        <!-- Contingut del Tanc segons el mode actiu -->
        ${
          modeEsp === "normal"
            ? `
          <!-- Suport i Dinamòmetre + Caixa d'igualtat d'Arquimedes -->
          <line x1="70" y1="18" x2="70" y2="298" stroke="#475569" stroke-width="6"/>
          <line x1="70" y1="20" x2="310" y2="20" stroke="#475569" stroke-width="5"/>
          <rect x="236" y="20" width="148" height="40" rx="6" fill="#0F172A" stroke="#334155" stroke-width="2"/>
          <text x="310" y="34" fill="#94A3B8" font-size="9" text-anchor="middle">DINAMÒMETRE (P = ${formataNombre(dinRes.pesReal, 2)} N)</text>
          <text x="310" y="52" fill="#38BDF8" font-family="monospace" font-size="14.5" font-weight="700" text-anchor="middle">Pa = ${formataNombre(dinRes.pesAparent, 2)} N</text>

          <!-- Pont d'igualtat d'Arquimedes (E = P - Pa = Pes líquid desplaçat) -->
          <rect x="392" y="18" width="224" height="42" rx="6" fill="#CCFBF1" stroke="#0F766E" stroke-width="1.8"/>
          <text x="504" y="34" fill="#115E59" font-size="9.5" font-weight="700" text-anchor="middle">PRINCIPI D'ARQUIMEDES VERIFICAT</text>
          <text x="504" y="51" fill="#0F766E" font-size="10.5" font-weight="800" text-anchor="middle">
            E = P − Pa = ${formataNombre(dinRes.empenyiment, 2)} N = Pes líq.
          </text>

          <!-- Fil del dinamòmetre i objecte -->
          ${(() => {
            const fImm = lab.tanc.fraccioImmersio ?? 1;
            const cyObj = lab.tanc.recolzatAlFons
              ? 270
              : fImm === 0
              ? 92
              : dinRes.filFluix
              ? 117
              : 115 + fImm * 88;
            return `
              <line x1="310" y1="60" x2="310" y2="${cyObj - 18}" stroke="#0F766E" stroke-width="2" ${dinRes.filFluix ? 'stroke-dasharray="3 3"' : ""}/>
              ${dibuixaObjecteSVG(objActiu, 310, cyObj, 56, 38, vistes.volums, vistes.cubets)}
              ${
                vistes.forces
                  ? dibuixaVectorsForcaSVG({
                      cx: 310,
                      cy: cyObj,
                      pes: dinRes.pesReal,
                      empenyiment: dinRes.empenyiment,
                      normal: dinRes.normal,
                      tensio: dinRes.tensio,
                      mostraValors: true
                    })
                  : ""
              }
            `;
          })()}
        `
            : modeEsp === "barca"
            ? `
          <!-- Buc naval seccionat i acotat (Calat h i Francbord H - h) -->
          ${(() => {
            const wBarca = Math.min(250, Math.max(110, bucRes.L * 14));
            const hBarca = Math.min(100, Math.max(46, bucRes.H * 14));
            const calatPx = Math.min(hBarca, (bucRes.calatExacte / bucRes.H) * hBarca);
            const ySupBarca = bucRes.inundada ? 290 - hBarca : 115 + calatPx - hBarca;
            const yFonsBarca = ySupBarca + hBarca;
            const tPx = Math.max(4, Math.min(16, bucRes.gruixParet * 11));
            const colBuc = bucRes.material === "acer" ? "#64748B" : "#F97316";
            const xEsq = 315 - wBarca / 2;
            const xDret = 315 + wBarca / 2;

            return `
              <g>
                <!-- Cos trapezoïdal del buc i cavitat interior d'aire -->
                <polygon points="${xEsq},${ySupBarca} ${xDret},${ySupBarca} ${xDret - 12},${yFonsBarca} ${xEsq + 12},${yFonsBarca}"
                         fill="${colBuc}" stroke="#1E293B" stroke-width="2.2" stroke-linejoin="round"/>
                <polygon points="${xEsq + tPx},${ySupBarca} ${xDret - tPx},${ySupBarca} ${xDret - 12 - tPx * 0.7},${yFonsBarca - tPx} ${xEsq + 12 + tPx * 0.7},${yFonsBarca - tPx}"
                         fill="${bucRes.inundada ? liqTanc.color : "#E0F2FE"}" opacity="0.92"/>

                <!-- Etiqueta d'aire intern Vbuit -->
                ${
                  !bucRes.inundada
                    ? `<text x="315" y="${ySupBarca + 15}" fill="#0369A1" font-size="9" font-weight="700" text-anchor="middle">Aire: ${formataNombre(bucRes.volumCavitat, 0)} cm³ (d_mitj = ${formataNombre(bucRes.densitatMitjana, 2)})</text>`
                    : ""
                }

                <!-- Peses de càrrega apilades al fons del buc -->
                ${
                  bucRes.carrega > 0
                    ? `<rect x="275" y="${yFonsBarca - tPx - 20}" width="80" height="20" rx="3" fill="#1E293B" stroke="#F8FAFC" stroke-width="1"/>
                       <text x="315" y="${yFonsBarca - tPx - 6}" fill="#FBBF24" font-size="10.5" font-weight="700" text-anchor="middle">Càrrega: +${bucRes.carrega} g</text>`
                    : ""
                }

                <!-- Cotes verticals de Francbord i Calat si sura -->
                ${
                  !bucRes.inundada
                    ? `
                  <!-- Cota de Francbord (sobre l'aigua, a la dreta) -->
                  <line x1="${xDret + 12}" y1="${ySupBarca}" x2="${xDret + 12}" y2="115" stroke="#16A34A" stroke-width="2.2"/>
                  <text x="${xDret + 18}" y="${(ySupBarca + 115) / 2 + 3}" fill="#15803D" font-size="10" font-weight="700">Francbord: ${formataNombre(bucRes.francbord, 2)} cm</text>
                  <!-- Cota de Calat (sota l'aigua, a la dreta) -->
                  <line x1="${xDret + 12}" y1="115" x2="${xDret + 12}" y2="${yFonsBarca}" stroke="#1D4ED8" stroke-width="2.2"/>
                  <text x="${xDret + 18}" y="${(115 + yFonsBarca) / 2 + 3}" fill="#1E40AF" font-size="10" font-weight="700">Calat h: ${formataNombre(bucRes.calat, 2)} cm</text>
                `
                    : ""
                }

                <!-- Banner superior d'estat de la barca -->
                <rect x="145" y="24" width="340" height="32" rx="6" fill="${bucRes.paretMassaFina || bucRes.inundada ? "#FEE2E2" : "#ECFDF5"}" stroke="${bucRes.paretMassaFina || bucRes.inundada ? "#DC2626" : "#059669"}" stroke-width="1.5"/>
                <text x="315" y="44" fill="#0F172A" font-size="11" font-weight="700" text-anchor="middle">
                  ${
                    bucRes.paretMassaFina
                      ? "⚠ Paret massa fina (< 0,15 cm): es trencaria!"
                      : bucRes.inundada
                      ? "S'ha inundat! El calat ha superat l'alçada H i s'enfonsa"
                      : `Buc de ${nomMaterialBarca} (${bucRes.massaBarca} g) · Càrrega màx: ${formataNombre(bucRes.carregaMaxima, 0)} g`
                  }
                </text>
              </g>
            `;
          })()}
        `
            : modeEsp === "submari"
            ? `
          <!-- Submarí detallat amb torreta, periscopi i tanc de llast (F5) -->
          ${(() => {
            const cySub = subRes.puja ? 132 : subRes.baixa ? 258 : 196;
            const hAiguaPx = (subRes.volumAiguaTanc / 400) * 32;
            return `
              <g>
                <!-- Torreta i periscopi -->
                <path d="M 290 ${cySub - 26} L 296 ${cySub - 44} L 330 ${cySub - 44} L 336 ${cySub - 26} Z" fill="#F59E0B" stroke="#1E293B" stroke-width="2"/>
                <path d="M 312 ${cySub - 44} L 312 ${cySub - 54} L 322 ${cySub - 54}" fill="none" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>
                <!-- Hèlix posterior -->
                <polygon points="215,${cySub - 12} 225,${cySub} 215,${cySub + 12}" fill="#64748B" stroke="#1E293B" stroke-width="1.5"/>
                <!-- Casc exterior del submarí (Vext = 1000 cm³) -->
                <rect x="225" y="${cySub - 26}" width="175" height="52" rx="26" fill="#FBBF24" stroke="#1E293B" stroke-width="2.5"/>
                <!-- Finestra del tanc de llast intern (capacitat 400 cm³) -->
                <rect x="262" y="${cySub - 16}" width="102" height="32" rx="6" fill="#F8FAFC" stroke="#334155" stroke-width="1.8"/>
                <rect x="263" y="${cySub + 16 - hAiguaPx}" width="100" height="${hAiguaPx}" rx="4" fill="#0284C7" opacity="0.88"/>
                <text x="313" y="${cySub + 4}" fill="#0F172A" font-size="10" font-weight="800" text-anchor="middle">Llast: ${formataNombre(subRes.volumAiguaTanc, 0)} / 400 cm³</text>

                <!-- Vectors de força sobre el submarí -->
                ${dibuixaVectorsForcaSVG({
                  cx: 313,
                  cy: cySub,
                  pes: subRes.pes,
                  empenyiment: subRes.empenyimentMaxim,
                  mostraValors: true
                })}

                <rect x="145" y="24" width="340" height="32" rx="6" fill="#0F172A"/>
                <text x="315" y="44" fill="${subRes.equilibri ? "#4ADE80" : "#38BDF8"}" font-size="11.5" font-weight="700" text-anchor="middle">
                  Massa: ${formataNombre(subRes.massaTotal)} g · d_mitj = ${formataNombre(subRes.densitatMitjana, 3)} g/cm³ → ${
              subRes.equilibri ? "EQUILIBRI NEUTRE" : subRes.puja ? "PUJA A LA SUPERFÍCIE" : "BAIXA AL FONS"
            }
                </text>
              </g>
            `;
          })()}
        `
            : modeEsp === "pressio"
            ? `
          <!-- Sonda de pressió i cub de 10 cm amb vectors de pressió sobre les 4 cares (G1, G2, G3) -->
          ${(() => {
            const hSonda = lab.tanc.sondaProfunditatCm ?? 20;
            const ySonda = 115 + (hSonda / 45) * 175;
            return `
              <g>
                <!-- Cub de 10 cm (G3) amb fletxes de pressió hidrostàtica -->
                <rect x="205" y="158" width="74" height="74" fill="#CBD5E1" fill-opacity="0.78" stroke="#334155" stroke-width="2"/>
                <text x="242" y="198" fill="#16303F" font-size="10.5" font-weight="700" text-anchor="middle">Cub 10 cm</text>

                <!-- Fletxes cara superior (Fsup cap avall) -->
                <line x1="222" y1="136" x2="222" y2="156" stroke="#C2410C" stroke-width="2.2"/>
                <line x1="242" y1="136" x2="242" y2="156" stroke="#C2410C" stroke-width="2.2"/>
                <line x1="262" y1="136" x2="262" y2="156" stroke="#C2410C" stroke-width="2.2"/>
                <text x="242" y="131" fill="#C2410C" font-size="10.5" font-weight="700" text-anchor="middle">↓ F_sup = ${formataNombre(forcesBlocG3.forcaSuperiorN, 1)} N</text>

                <!-- Fletxes laterals (s'anul·len mútuament) -->
                <line x1="182" y1="195" x2="203" y2="195" stroke="#64748B" stroke-width="2"/>
                <line x1="302" y1="195" x2="281" y2="195" stroke="#64748B" stroke-width="2"/>

                <!-- Fletxes cara inferior (Finf cap amunt, més llargues perquè hi ha més profunditat) -->
                <line x1="222" y1="264" x2="222" y2="234" stroke="#1553A1" stroke-width="2.8"/>
                <line x1="242" y1="264" x2="242" y2="234" stroke="#1553A1" stroke-width="2.8"/>
                <line x1="262" y1="264" x2="262" y2="234" stroke="#1553A1" stroke-width="2.8"/>
                <text x="242" y="278" fill="#1553A1" font-size="10.5" font-weight="800" text-anchor="middle">↑ F_inf = ${formataNombre(forcesBlocG3.forcaInferiorN, 1)} N → E = F_inf − F_sup = ${formataNombre(forcesBlocG3.diferenciaForcesN, 1)} N</text>

                <!-- Sonda puntual de pressió -->
                <line x1="415" y1="60" x2="415" y2="${ySonda}" stroke="#0F172A" stroke-width="2.5"/>
                <circle cx="415" cy="${ySonda}" r="7" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
                <rect x="330" y="28" width="175" height="32" rx="6" fill="#0F172A"/>
                <text x="417" y="48" fill="#38BDF8" font-family="monospace" font-size="13" font-weight="700" text-anchor="middle">
                  h=${hSonda} cm → ${formataNombre(pressioSonda)} Pa
                </text>
              </g>
            `;
          })()}
        `
            : modeEsp === "globus"
            ? `
          <!-- Cambra d'aire i globus (F9) -->
          <rect x="113" y="78" width="404" height="213" fill="#F1F5F9"/>
          <text x="315" y="98" fill="#16303F" font-size="12" font-weight="700" text-anchor="middle">
            Cambra d'aire (1,20 g/L) · Globus de ${globusRes.volumLitres} L amb ${gasInfo.nom} (${formataNombre(gasInfo.dEscolar, 2)} g/L)
          </text>
          <circle cx="315" cy="${globusRes.puja ? 150 : 240}" r="38" fill="#F43F5E" opacity="0.88" stroke="#9F1239" stroke-width="2"/>
          <text x="315" y="${globusRes.puja ? 154 : 244}" fill="#FFFFFF" font-size="11" font-weight="700" text-anchor="middle">${gasInfo.nom}</text>
          ${dibuixaVectorsForcaSVG({
            cx: 315,
            cy: globusRes.puja ? 150 : 240,
            pes: globusRes.pes,
            empenyiment: globusRes.empenyiment,
            mostraValors: true
          })}
        `
            : modeEsp === "temperatura"
            ? `
          <!-- Bany tèrmic i densitat de l'aigua segons la temperatura (F10) -->
          <text x="315" y="98" fill="#16303F" font-size="12.5" font-weight="700" text-anchor="middle">
            Temperatura: ${lab.tanc.temperaturaC ?? 20} °C → Densitat de l'aigua: ${formataNombre(dLiq, 4)} g/cm³
          </text>
          ${dibuixaObjecteSVG(lab.objectes.glaco || objActiu, 315, 130, 48, 38, vistes.volums, vistes.cubets)}
        `
            : `
          <!-- Densímetre graduat (F11) -->
          ${(() => {
            const enfonsamentPx = (1.0 / dLiq) * 95;
            const yBaseDens = 115 + enfonsamentPx;
            return `
              <g>
                <rect x="309" y="${yBaseDens - 115}" width="12" height="95" rx="4" fill="#FFFFFF" stroke="#334155" stroke-width="2"/>
                <circle cx="315" cy="${yBaseDens}" r="18" fill="#475569" stroke="#1E293B" stroke-width="2"/>
                <line x1="302" y1="115" x2="328" y2="115" stroke="#DC2626" stroke-width="2.5"/>
                <text x="315" y="96" fill="#16303F" font-size="12" font-weight="700" text-anchor="middle">
                  Lectura del densímetre a la superfície: ${formataNombre(dLiq, 2)} g/cm³
                </text>
              </g>
            `;
          })()}
        `
        }

        <!-- ==================== VAS DE VESSAMENT I COL·LECTOR SOBRE BALANÇA (x = 565..860) ==================== -->
        <g transform="translate(565, 0)">
          <text x="155" y="36" fill="#16303F" font-size="13" font-weight="700" text-anchor="middle">Líquid desplaçat (Arquimedes)</text>

          ${(() => {
            const vDesp = modeEsp === "barca" ? bucRes.volumSubmergit : dinRes.volumSubmergit;
            const mDesp = vDesp * dLiq;
            const pDesp = (mDesp / 1000) * cfg.g;
            const hLiqCol = Math.min(95, (vDesp / 250) * 95);
            return `
              <!-- Bec de sortida del tanc i raig de líquid quan hi ha desplaçament -->
              <path d="M -45 116 L 45 140" stroke="#334155" stroke-width="4.5" stroke-linecap="round"/>
              ${
                vDesp > 0.5
                  ? `<path d="M 45 140 Q 65 160 68 ${243 - hLiqCol}" fill="none" stroke="#0284C7" stroke-width="3" stroke-dasharray="4 2"/>`
                  : ""
              }

              <!-- Vas col·lector graduat sobre balança -->
              <rect x="55" y="138" width="110" height="105" rx="4" fill="url(#grad-vidre)" stroke="#475569" stroke-width="2"/>
              <rect x="57" y="${241 - hLiqCol}" width="106" height="${hLiqCol}" fill="${liqTanc.color}" opacity="0.86"/>
              <rect x="18" y="244" width="184" height="48" rx="6" fill="#0F172A"/>
              <text x="110" y="261" fill="#E2E8F0" font-size="10.5" text-anchor="middle">
                Volum desplaçat: ${formataNombre(vDesp, 1)} cm³
              </text>
              <text x="110" y="278" fill="#4ADE80" font-family="monospace" font-size="11.5" font-weight="700" text-anchor="middle">
                ${formataNombre(mDesp, 1)} g → Pes líq: ${formataNombre(pDesp, 2)} N
              </text>
            `;
          })()}
        </g>
      </svg>

      <!-- Controls del Tanc segons el mode actiu -->
      <div class="controls-estacions-grid">
        <div class="targeta-control-estacio">
          <div class="fila-entre">
            <strong>Paràmetres del tanc i gravetat</strong>
            <select id="sel-liquid-tanc" aria-label="Líquid del tanc">
              ${["aigua", "alcohol", "oli", "aigua_mar", "aigua_salada", "mel", "mercuri"]
                .map(l => `<option value="${l}" ${lab.tanc.liquid === l ? "selected" : ""}>${LIQUIDS[l].nom} (${formataNombre(LIQUIDS[l].dEscolar, 2)} g/cm³)</option>`)
                .join("")}
            </select>
          </div>
          <div class="bts-estacio">
            <label class="etiqueta-inline">
              <span>Astre (g):</span>
              <select id="sel-astre-tanc">
                <option value="9.8" ${cfg.g === 9.8 ? "selected" : ""}>Terra (9,8 N/kg)</option>
                <option value="1.6" ${cfg.g === 1.6 ? "selected" : ""}>Lluna (1,6 N/kg)</option>
                <option value="3.7" ${cfg.g === 3.7 ? "selected" : ""}>Mart (3,7 N/kg)</option>
              </select>
            </label>
            <button type="button" class="bt bt-primari bt-petit" data-anota-instrument="tanc"
                    data-obj-id="${objActiu.id}" data-obj-nom="${objActiu.nom}"
                    data-mag="${modeEsp === "pressio" ? "Pressió hidrostàtica" : "Empenyiment d'Arquimedes"}"
                    data-val="${modeEsp === "pressio" ? pressioSonda : dinRes.empenyiment}"
                    data-uni="${modeEsp === "pressio" ? "Pa" : "N"}" data-res="0.01" data-inst="Tanc i Dinamòmetre">
              ${icona("anota")} Anota (${modeEsp === "pressio" ? `${formataNombre(pressioSonda)} Pa` : `E = ${formataNombre(dinRes.empenyiment, 2)} N`})
            </button>
          </div>
        </div>

        <div class="targeta-control-estacio">
          ${
            modeEsp === "normal"
              ? `
            <div class="fila-entre">
              <strong>Control del dinamòmetre (${objActiu.nom})</strong>
              <span>P = ${formataNombre(dinRes.pesReal, 2)} N · Pa = ${formataNombre(dinRes.pesAparent, 2)} N · E = ${formataNombre(dinRes.empenyiment, 2)} N</span>
            </div>
            <div class="bts-estacio">
              <label class="etiqueta-inline">
                <span>Immersió:</span>
                <input type="range" id="rng-immersio-din" min="0" max="1" step="0.25" value="${lab.tanc.fraccioImmersio ?? 1}">
                <span>${Math.round((lab.tanc.fraccioImmersio ?? 1) * 100)} %</span>
              </label>
              <label class="fila-switch">
                <input type="checkbox" id="chk-recolzat-fons" ${lab.tanc.recolzatAlFons ? "checked" : ""}>
                <span>Deixa al fons (fil fluix)</span>
              </label>
            </div>`
              : modeEsp === "barca"
              ? `
            <div class="fila-entre">
              <strong>Control de la barca (${bucRes.massaBarca} g de ${nomMaterialBarca})</strong>
              <span>Dimensions: ${bucRes.L} × ${bucRes.B} × ${bucRes.H} cm (Venv = ${bucRes.volumEnvoltant} cm³)</span>
            </div>
            <div class="bts-estacio">
              <label class="etiqueta-inline">
                <span>Càrrega (g):</span>
                <input type="number" id="num-carrega-barca" min="0" max="1000" step="50" value="${bucRes.carrega}" style="width:78px">
              </label>
              <button type="button" class="bt bt-secundari bt-petit" data-barca-carrega="0">0 g</button>
              <button type="button" class="bt bt-secundari bt-petit" data-barca-carrega="200">+200 g</button>
              <button type="button" class="bt bt-secundari bt-petit" data-barca-carrega="400">+400 g (límit)</button>
              <button type="button" class="bt bt-secundari bt-petit" data-barca-carrega="401">401 g (inunda)</button>
            </div>`
              : modeEsp === "submari"
              ? `
            <div class="fila-entre">
              <strong>Tanc de llast del submarí (capacitat 400 cm³)</strong>
              <span>Equilibri: ${formataNombre(subRes.volumEquilibri, 0)} cm³</span>
            </div>
            <div class="bts-estacio">
              <input type="range" id="rng-submari-llast" min="0" max="400" step="10" value="${lab.tanc.submariVolumAigua ?? 300}">
              <button type="button" class="bt bt-secundari bt-petit" data-submari-llast="0">Buit (puja)</button>
              <button type="button" class="bt bt-primari bt-petit" data-submari-llast="${Math.round(subRes.volumEquilibri)}">Equilibri (${formataNombre(subRes.volumEquilibri, 0)} cm³)</button>
              <button type="button" class="bt bt-secundari bt-petit" data-submari-llast="400">Ple (baixa)</button>
            </div>`
              : modeEsp === "pressio"
              ? `
            <div class="fila-entre">
              <strong>Sonda de pressió hidrostàtica (p = dL · g · h)</strong>
              <span>Lectura: ${formataNombre(pressioSonda)} Pa</span>
            </div>
            <div class="bts-estacio">
              <label class="etiqueta-inline">
                <span>Profunditat h (cm):</span>
                <input type="range" id="rng-sonda-prof" min="5" max="45" step="5" value="${lab.tanc.sondaProfunditatCm ?? 20}">
                <span>${lab.tanc.sondaProfunditatCm ?? 20} cm</span>
              </label>
            </div>`
              : modeEsp === "globus"
              ? `
            <div class="fila-entre">
              <strong>Gas del globus (10 L, coberta de 3 g)</strong>
              <span>Força neta: ${formataNombre(globusRes.forcaNeta, 3)} N (${globusRes.puja ? "Puja" : "Cau"})</span>
            </div>
            <div class="bts-estacio">
              ${["hidrogen", "heli", "aire_calent", "aire", "co2"]
                .map(
                  gId =>
                    `<button type="button" class="bt bt-secundari bt-petit ${lab.tanc.globusGas === gId ? "actiu" : ""}" data-globus-gas="${gId}">${GASOS[gId].nom}</button>`
                )
                .join("")}
            </div>`
              : modeEsp === "temperatura"
              ? `
            <div class="fila-entre">
              <strong>Temperatura de l'aigua (−5 °C a 100 °C)</strong>
              <span>Densitat: ${formataNombre(dLiq, 4)} g/cm³</span>
            </div>
            <div class="bts-estacio">
              ${[0, 4, 20, 60, 80, 100]
                .map(
                  t =>
                    `<button type="button" class="bt bt-secundari bt-petit ${Number(lab.tanc.temperaturaC) === t ? "actiu" : ""}" data-temp-aigua="${t}">${t} °C</button>`
                )
                .join("")}
            </div>`
              : `
            <div class="fila-entre">
              <strong>Densímetre calibrat (0,70–1,50 g/cm³)</strong>
              <span>Canvia el líquid del tanc per veure com varia l'enfonsament</span>
            </div>`
          }
        </div>
      </div>
    </div>
  `;
}

/**
 * 4. TAULA DEL TALLER I DRASSANA: Banc visual SVG (Tallar/Modelar + Previsualització C7 + Plànol naval F1–F4) + Controls
 */
export function renderitzaTaulaTaller(estat) {
  const lab = estat.laboratori;
  const cfg = estat.configuracio;
  const vistes = lab.vistes;
  const objSel = lab.objectes[lab.objecteSeleccionat] || lab.objectes.patata || lab.objectes.A;
  const magSel = magnitudsObjecte(objSel, {
    materials: MATERIALS,
    nombresSenzills: cfg.nombresSenzills,
    g: cfg.g
  });

  // Previsualització dels dos fragments si es talla per la meitat
  const [frag1, frag2] = tallaObjecte(objSel, 0.5, {
    materials: MATERIALS,
    nombresSenzills: cfg.nombresSenzills
  });
  const magF1 = magnitudsObjecte(frag1, { materials: MATERIALS, nombresSenzills: cfg.nombresSenzills });

  const cst = lab.taller.constructor;
  const matCst = MATERIALS[cst.material] || MATERIALS.alumini;
  const dCst = matCst.dEscolar ?? 2.7;
  let mCst = cst.massa;
  let vCst = cst.volum;
  if (cst.fixats === "material_volum") mCst = dCst * vCst;
  else if (cst.fixats === "material_massa") vCst = mCst / dCst;

  const buc = calculaBuc({
    ...lab.taller.barca,
    densitatLiquid: 1.0,
    g: cfg.g
  });

  // Mida escalada del bloc del constructor C7
  const costatCstPx = Math.max(28, Math.min(72, Math.cbrt(vCst) * 11));
  const wBucSvg = Math.min(185, Math.max(85, buc.L * 9.5));
  const hBucSvg = Math.min(76, Math.max(36, buc.H * 9.5));
  const tBucPx = Math.max(3.5, Math.min(14, buc.gruixParet * 9));
  const calatBucPx = Math.min(hBucSvg, (buc.calatExacte / buc.H) * hBucSvg);

  return `
    <div class="taller-layout">
      <!-- BANC VISUAL SVG DEL TALLER I LA DRASSANA (3 ESTACIONS GRÀFIQUES EN TEMPS REAL) -->
      <svg viewBox="0 0 880 215" class="svg-escena svg-taller" role="img" aria-label="Banc visual de tall, constructor d'objectes i plànol naval de la drassana">
        ${defsSVGComuns()}
        <rect x="0" y="0" width="880" height="215" fill="#F8FAFC"/>
        <line x1="286" y1="12" x2="286" y2="203" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4"/>
        <line x1="566" y1="12" x2="566" y2="203" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 4"/>

        <!-- ESTACIÓ VISUAL 1: BANC DE TALL I PROPIETAT INTENSIVA (x = 10..280) -->
        <g>
          <text x="145" y="24" fill="#16303F" font-size="12" font-weight="700" text-anchor="middle">1. Banc de tall: la densitat es conserva (C4)</text>
          <!-- Objecte sencer amb línia de tall -->
          ${dibuixaObjecteSVG(objSel, 78, 92, 64, 44, vistes.volums, true)}
          <line x1="78" y1="56" x2="78" y2="128" stroke="#DC2626" stroke-width="2" stroke-dasharray="4 3"/>
          <text x="78" y="144" fill="#334155" font-size="9.5" font-weight="700" text-anchor="middle">${formataNombre(magSel.massa, 0)} g / ${formataNombre(magSel.volumExterior, 0)} cm³</text>
          <text x="78" y="157" fill="#0F766E" font-size="10.5" font-weight="800" text-anchor="middle">d = ${formataNombre(magSel.densitatMitjana, 2)} g/cm³</text>

          <text x="136" y="96" fill="#64748B" font-size="16" font-weight="700" text-anchor="middle">→</text>

          <!-- Dues meitats amb la mateixa densitat -->
          ${dibuixaObjecteSVG(frag1, 185, 82, 34, 34, vistes.volums, true)}
          ${dibuixaObjecteSVG(frag2, 235, 82, 34, 34, vistes.volums, true)}
          <text x="210" y="144" fill="#334155" font-size="9.5" font-weight="700" text-anchor="middle">Cada meitat: ${formataNombre(magF1.massa, 0)} g / ${formataNombre(magF1.volumExterior, 0)} cm³</text>
          <rect x="150" y="162" width="122" height="22" rx="5" fill="#CCFBF1" stroke="#0F766E"/>
          <text x="211" y="177" fill="#0F766E" font-size="10.5" font-weight="800" text-anchor="middle">d₁ = d₂ = ${formataNombre(magF1.densitatMitjana, 2)} g/cm³ ✓</text>
        </g>

        <!-- ESTACIÓ VISUAL 2: PREVISUALITZACIÓ DEL CONSTRUCTOR C7 (x = 295..558) -->
        <g>
          <text x="426" y="24" fill="#16303F" font-size="12" font-weight="700" text-anchor="middle">2. Constructor d'objectes: d = m / V (C7)</text>
          <rect x="${426 - costatCstPx / 2}" y="${95 - costatCstPx / 2}" width="${costatCstPx}" height="${costatCstPx}" rx="5"
                fill="${matCst.aspecte?.color || "#CBD5E1"}" stroke="${matCst.aspecte?.contorn || "#334155"}" stroke-width="2.2"/>
          <text x="426" y="99" fill="#0F172A" font-size="10.5" font-weight="800" text-anchor="middle">${matCst.nom}</text>

          <rect x="312" y="146" width="228" height="42" rx="6" fill="#0F172A"/>
          <text x="426" y="163" fill="#E2E8F0" font-size="10" text-anchor="middle">
            Massa m = ${formataNombre(mCst, 1)} g · Volum V = ${formataNombre(vCst, 1)} cm³
          </text>
          <text x="426" y="179" fill="#38BDF8" font-size="11" font-weight="700" text-anchor="middle">
            Densitat fixa del material: ${formataNombre(dCst, 2)} g/cm³
          </text>
        </g>

        <!-- ESTACIÓ VISUAL 3: PLÀNOL NAVAL DE LA DRASSANA (x = 575..870) -->
        <g>
          <text x="724" y="24" fill="#16303F" font-size="12" font-weight="700" text-anchor="middle">3. Plànol naval de la Drassana (${buc.L} × ${buc.B} × ${buc.H} cm)</text>

          <!-- Línia d'aigua de referència -->
          <rect x="590" y="95" width="268" height="58" rx="4" fill="#BAE6FD" opacity="0.55"/>
          <line x1="590" y1="95" x2="858" y2="95" stroke="#0284C7" stroke-width="1.8" stroke-dasharray="5 3"/>

          <!-- Secció transversal del buc -->
          ${(() => {
            const ySup = 95 + calatBucPx - hBucSvg;
            const xEsq = 724 - wBucSvg / 2;
            return `
              <rect x="${xEsq}" y="${ySup}" width="${wBucSvg}" height="${hBucSvg}" rx="3"
                    fill="${buc.material === "acer" ? "#64748B" : "#F97316"}" stroke="#1E293B" stroke-width="2"/>
              <rect x="${xEsq + tBucPx}" y="${ySup}" width="${wBucSvg - 2 * tBucPx}" height="${hBucSvg - tBucPx}"
                    fill="#E0F2FE"/>
              <text x="724" y="${ySup + hBucSvg / 2 + 3}" fill="#0369A1" font-size="9.5" font-weight="700" text-anchor="middle">
                t = ${formataNombre(buc.gruixParetArrodonit, 2)} cm · V_buit = ${formataNombre(buc.volumCavitat, 0)} cm³
              </text>
            `;
          })()}

          <rect x="590" y="158" width="268" height="30" rx="5" fill="${buc.paretMassaFina ? "#FEE2E2" : "#ECFDF5"}" stroke="${buc.paretMassaFina ? "#DC2626" : "#059669"}"/>
          <text x="724" y="177" fill="#0F172A" font-size="10.5" font-weight="700" text-anchor="middle">
            d_mat = ${formataNombre(buc.densitatMaterial, 2)} g/cm³ → d_mitjana buc = ${formataNombre(buc.densitatMitjana, 2)} g/cm³ (SURA!)
          </text>
        </g>
      </svg>

      <div class="taller-grid-2">
        <!-- 1. Tallar i Modelar objectes del prestatge -->
        <div class="targeta-consulta">
          <h3>${icona("ganivet")} 1. Tallar i modelar l'objecte seleccionat (${objSel.etiqueta} · ${objSel.nom})</h3>
          <p class="etiqueta-petita">En tallar un objecte homogeni, la massa i el volum es reparteixen proporcionalment i la densitat es conserva (R2 i R3). En modelar es conserven la massa i el volum de material (R5).</p>
          <div class="taller-bloc-accions">
            <div>
              <strong>Dividir amb el ganivet:</strong>
              <div class="bts-estacio">
                <button type="button" class="bt bt-primari bt-petit" data-talla-rapid="${objSel.id}" data-frac="0.5">Talla per la meitat (1/2 i 1/2)</button>
                <button type="button" class="bt bt-secundari bt-petit" data-talla-rapid="${objSel.id}" data-frac="0.25">Talla 1/4 i 3/4</button>
                <button type="button" class="bt bt-secundari bt-petit" data-talla-rapid="${objSel.id}" data-frac="0.333333">Talla 1/3 i 2/3</button>
              </div>
            </div>
            <div>
              <strong>Modelar en formes compactes (sense cavitats):</strong>
              <div class="bts-estacio">
                ${["bola", "cilindre", "bloc", "plat"]
                  .map(
                    f => `
                  <button type="button" class="bt bt-secundari bt-petit" data-modela-forma="${f}" data-obj="${objSel.id}">
                    Forma: ${f}
                  </button>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Constructor d'objectes i «L'objecte impossible» (C7) -->
        <div class="targeta-consulta">
          <h3>${icona("taller")} 2. Constructor d'objectes («L'objecte impossible», C7)</h3>
          <p class="etiqueta-petita">Només es poden fixar dues de les tres magnituds: la tercera queda determinada per <em>d = m / V</em> (regla R4).</p>
          <div class="constructor-form">
            <label class="comp-fila">
              <span>Quines dues magnituds fixes?</span>
              <select id="cst-fixats">
                <option value="material_volum" ${cst.fixats === "material_volum" ? "selected" : ""}>Fixa Material i Volum → calcula Massa</option>
                <option value="material_massa" ${cst.fixats === "material_massa" ? "selected" : ""}>Fixa Material i Massa → calcula Volum</option>
              </select>
            </label>
            <label class="comp-fila">
              <span>Material (densitat)</span>
              <select id="cst-material">
                ${["suro", "pi", "cera", "patata", "plastilina", "alumini", "ferro", "coure", "plom", "or"]
                  .map(
                    m =>
                      `<option value="${m}" ${cst.material === m ? "selected" : ""}>${MATERIALS[m].nom} (${formataNombre(MATERIALS[m].dEscolar, 2)} g/cm³)</option>`
                  )
                  .join("")}
              </select>
            </label>
            <div class="fila-2-inputs">
              <label>
                <span>Massa (g) ${cst.fixats === "material_volum" ? "<em>(calculada)</em>" : ""}</span>
                <input type="number" id="cst-massa" value="${Math.round(mCst * 10) / 10}" ${cst.fixats === "material_volum" ? "readonly" : ""} min="5" max="2000">
              </label>
              <label>
                <span>Volum (cm³) ${cst.fixats === "material_massa" ? "<em>(calculat)</em>" : ""}</span>
                <input type="number" id="cst-volum" value="${Math.round(vCst * 10) / 10}" ${cst.fixats === "material_massa" ? "readonly" : ""} min="5" max="2000">
              </label>
            </div>
            <button type="button" class="bt bt-primari bt-petit" data-construeix-obj="true">
              + Construeix l'objecte i posa'l al prestatge
            </button>
          </div>
        </div>
      </div>

      <!-- 3. Drassana de barques (F1, F2, F3, F4) -->
      <div class="targeta-consulta">
        <div class="fila-entre">
          <div>
            <h3>${icona("barca")} 3. Drassana: constructor de barques i bucs (F1–F4)</h3>
            <p class="etiqueta-petita">Dóna forma de buc obert (L × B × H) a 200 g de plastilina o a 500 g d'acer. El motor calcula el gruix de paret <em>t</em>, el calat, el francbord i la càrrega màxima.</p>
          </div>
          <div class="bts-estacio">
            <button type="button" class="bt bt-secundari bt-petit" data-preset-barca="plastilina">200 g de plastilina (12 × 10 × 5 cm)</button>
            <button type="button" class="bt bt-secundari bt-petit" data-preset-barca="acer">500 g d'acer (15 × 8 × 6 cm)</button>
            <button type="button" class="bt bt-primari bt-petit" data-prova-barca-tanc="true">
              Prova la barca al Tanc →
            </button>
          </div>
        </div>

        <div class="drassana-grid">
          <div class="drassana-sliders">
            <label class="comp-fila">
              <span>Llargada L: <strong>${buc.L} cm</strong></span>
              <input type="range" id="buc-l" min="6" max="24" step="1" value="${buc.L}">
            </label>
            <label class="comp-fila">
              <span>Amplada B: <strong>${buc.B} cm</strong></span>
              <input type="range" id="buc-b" min="6" max="20" step="1" value="${buc.B}">
            </label>
            <label class="comp-fila">
              <span>Alçada H: <strong>${buc.H} cm</strong></span>
              <input type="range" id="buc-h" min="3" max="12" step="0.5" value="${buc.H}">
            </label>
          </div>
          <div class="drassana-resum ${buc.paretMassaFina ? "amb-avis" : ""}">
            <div><span>Material i massa:</span> <strong>${buc.massaBarca} g (${formataNombre(buc.volumMaterial, 1)} cm³)</strong></div>
            <div><span>Volum envoltant (L·B·H):</span> <strong>${formataNombre(buc.volumEnvoltant)} cm³</strong></div>
            <div><span>Gruix de paret calculat <em>t</em>:</span> <strong>${formataNombre(buc.gruixParetArrodonit, 2)} cm ${buc.paretMassaFina ? "⚠ Es trencaria (< 0,15 cm)" : "✓"}</strong></div>
            <div><span>Densitat mitjana del buc:</span> <strong>${formataNombre(buc.densitatMitjana, 2)} g/cm³</strong></div>
            <div><span>Calat actual / Francbord:</span> <strong>${formataNombre(buc.calat, 2)} cm / ${formataNombre(buc.francbord, 2)} cm</strong></div>
            <div><span>Càrrega màxima en aigua:</span> <strong>${formataNombre(buc.carregaMaxima, 0)} g</strong></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderitza la Lupa de lectura del menisc (04-laboratori-i-instruments.md §3.4).
 */
export function renderitzaLupaMenisc(estat) {
  const lab = estat.laboratori;
  const recProv = RECIPIENTS[lab.proveta.tipus] || RECIPIENTS.proveta250;
  const liqProv = LIQUIDS[lab.proveta.liquid] || LIQUIDS.aigua;
  const dLiqProv = estat.configuracio.nombresSenzills ? liqProv.dEscolar : liqProv.dReferencia;
  const idProveta = Object.keys(lab.ubicacions).find(k => lab.ubicacions[k] === "proveta");
  const objProv = idProveta ? lab.objectes[idProveta] : null;
  const estObj = objProv
    ? estatObjecteEnLiquid(objProv, dLiqProv, {
        materials: MATERIALS,
        nombresSenzills: estat.configuracio.nombresSenzills,
        vareta: lab.proveta.vareta
      })
    : null;
  const niv = calculaNivellIVessament(
    recProv,
    [{ liquid: liqProv.id, densitat: dLiqProv, volum: lab.proveta.volumInicial }],
    estObj?.volumSubmergit ?? 0
  );
  const menisc = llegeixMenisc(niv.volumTotalAparent, recProv, {
    tipusMenisc: liqProv.menisc || "concau",
    posicioUll: lab.proveta.posicioUll || "altura",
    puntLectura: lab.proveta.puntLectura || "tangent"
  });

  const ull = lab.proveta.posicioUll || "altura";
  const punt = lab.proveta.puntLectura || "tangent";

  return `
    <div class="eina-flotant eina-lupa" role="region" aria-label="Lupa de lectura del menisc">
      <div class="eina-cap">
        <h4>${icona("lupa")} Lupa de lectura del menisc (${recProv.nom}, div. ${formataNombre(recProv.graduacio)} mL)</h4>
        <button type="button" class="bt-icona" data-tanca-eina="true" aria-label="Tanca la lupa">${icona("tanca")}</button>
      </div>
      <div class="lupa-layout">
        <svg viewBox="0 0 220 150" class="svg-lupa-menisc" aria-label="Vista ampliada del menisc">
          <rect x="35" y="10" width="120" height="130" fill="#F8FAFC" stroke="#475569" stroke-width="2"/>
          <rect x="37" y="75" width="116" height="63" fill="${liqProv.color}" opacity="0.82"/>
          ${
            ull === "altura"
              ? `<path d="M 37 64 Q 95 ${liqProv.menisc === "convex" ? 52 : 76} 153 64" fill="${liqProv.color}" stroke="#0284C7" stroke-width="2.5"/>
                 <line x1="25" y1="76" x2="175" y2="76" stroke="#16A34A" stroke-width="1.8" stroke-dasharray="4 3"/>`
              : `<ellipse cx="95" cy="${ull === "alt" ? 68 : 82}" rx="57" ry="9" fill="${liqProv.color}" stroke="#D97706" stroke-width="2"/>`
          }
          <text x="165" y="79" fill="#16303F" font-size="11" font-weight="700">${formataNombre(menisc.lecturaCorrecta)} mL</text>
        </svg>
        <div class="lupa-controls">
          <label class="comp-fila">
            <span>Posició de l'ull (paral·laxi):</span>
            <select id="lupa-pos-ull">
              <option value="alt" ${ull === "alt" ? "selected" : ""}>Ull massa alt (es veu el·lipse · EP-03)</option>
              <option value="altura" ${ull === "altura" ? "selected" : ""}>Ull a l'altura del líquid (correcte)</option>
              <option value="baix" ${ull === "baix" ? "selected" : ""}>Ull massa baix (es veu el·lipse · EP-03)</option>
            </select>
          </label>
          <label class="comp-fila">
            <span>Punt de lectura del menisc (${liqProv.menisc === "convex" ? "convex" : "còncau"}):</span>
            <select id="lupa-punt-lectura">
              <option value="tangent" ${punt === "tangent" ? "selected" : ""}>Base tangent de la corba (correcte)</option>
              <option value="vora" ${punt === "vora" ? "selected" : ""}>Vora superior que toca el vidre (EP-02)</option>
            </select>
          </label>
          <div class="lupa-resultat">
            <span>Lectura observada: <strong>${menisc.foraDEscala ? "Fora d'escala" : `${formataNombre(menisc.lecturaObservada)} mL`}</strong></span>
            ${
              menisc.errorProcediment
                ? `<span class="badge-avis-ep">${menisc.errorProcediment === "EP-02" ? "Mira la part més baixa de la corba!" : "Posa l'ull a l'altura del líquid!"}</span>`
                : `<span class="badge-ok-ep">Lectura sense error de paral·laxi ✓</span>`
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderitza l'eina del Regle graduat de 30 cm per mesurar sòlids regulars (A5, C1, C3).
 */
export function renderitzaRegle(estat) {
  const lab = estat.laboratori;
  const obj = lab.objectes[lab.objecteSeleccionat] || lab.objectes.A;
  const mag = magnitudsObjecte(obj, {
    materials: MATERIALS,
    nombresSenzills: estat.configuracio.nombresSenzills
  });
  const m = obj.mides || {};

  return `
    <div class="eina-flotant eina-regle" role="region" aria-label="Regle graduat de 30 cm">
      <div class="eina-cap">
        <h4>${icona("regle")} Regle graduat (0–30 cm · resolució 1 mm) · ${obj.nom}</h4>
        <button type="button" class="bt-icona" data-tanca-eina="true" aria-label="Tanca el regle">${icona("tanca")}</button>
      </div>
      <div class="regle-cos">
        ${
          obj.forma === "ortoedre" || obj.forma === "cub"
            ? `<p>Arestes mesurades amb el regle: <strong>a = ${formataNombre(m.a)} cm</strong> · <strong>b = ${formataNombre(m.b ?? m.a)} cm</strong> · <strong>c = ${formataNombre(m.c ?? m.a)} cm</strong></p>
               <p>Volum geomètric (<em>V = a · b · c</em>): <strong>${formataNombre(mag.volumExterior)} cm³</strong></p>`
            : obj.forma === "cilindre"
            ? `<p>Diàmetre: <strong>${formataNombre(m.diametre)} cm</strong> · Alçada: <strong>${formataNombre(m.alcada)} cm</strong> → Volum: <strong>${formataNombre(mag.volumExterior)} cm³</strong></p>`
            : obj.forma === "esfera"
            ? `<p>Diàmetre de l'esfera: <strong>${formataNombre(m.diametre)} cm</strong> → Volum: <strong>${formataNombre(mag.volumExterior)} cm³</strong></p>`
            : `<p>Aquest objecte (${obj.nom}) té forma irregular: mesura'n el volum per desplaçament a la proveta o al vas de vessament.</p>`
        }
        ${
          obj.forma !== "irregular"
            ? `<button type="button" class="bt bt-primari bt-petit" data-anota-instrument="regle"
                      data-obj-id="${obj.id}" data-obj-nom="${obj.nom}"
                      data-mag="Volum geomètric" data-val="${mag.volumExterior}" data-uni="cm³" data-res="0.1" data-inst="Regle 30 cm">
                ${icona("anota")} Anota volum (${formataNombre(mag.volumExterior)} cm³)
              </button>`
            : ""
        }
      </div>
    </div>
  `;
}
