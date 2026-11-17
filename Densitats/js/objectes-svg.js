/* SPDX-License-Identifier: AGPL-3.0-or-later AND CC-BY-NC-SA-4.0 */
/**
 * Il·lustracions vectorials realistes (SVG amb degradats 3D, reflexos, ombres i textures)
 * per a tots els objectes del simulador Densitats.
 */

/**
 * Retorna les definicions SVG (<defs>) compartides amb un prefix d'ID per evitar col·lisions entre SVGs.
 * @param {string} p Prefix únic (ex. "tanc-", "bal-", "prov-", "cat-")
 * @returns {string}
 */
export function defsObjectes(p = "o-") {
  return `
    <!-- Metalls -->
    <linearGradient id="${p}alu" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F1F5F9"/>
      <stop offset="35%" stop-color="#CBD5E1"/>
      <stop offset="70%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#64748B"/>
    </linearGradient>
    <linearGradient id="${p}alu-top" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
    <linearGradient id="${p}ferro" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#94A3B8"/>
      <stop offset="30%" stop-color="#475569"/>
      <stop offset="75%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="${p}coure" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#9A3412"/>
      <stop offset="25%" stop-color="#FB923C"/>
      <stop offset="45%" stop-color="#FED7AA"/>
      <stop offset="70%" stop-color="#EA580C"/>
      <stop offset="100%" stop-color="#7C2D12"/>
    </linearGradient>
    <linearGradient id="${p}plom" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#64748B"/>
      <stop offset="40%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="${p}or" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="25%" stop-color="#FACC15"/>
      <stop offset="55%" stop-color="#EAB308"/>
      <stop offset="85%" stop-color="#CA8A04"/>
      <stop offset="100%" stop-color="#854D0E"/>
    </linearGradient>
    <radialGradient id="${p}acer" cx="35%" cy="30%" r="68%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="25%" stop-color="#CBD5E1"/>
      <stop offset="65%" stop-color="#64748B"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </radialGradient>

    <!-- Fustes i materials naturals -->
    <linearGradient id="${p}pi" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="45%" stop-color="#E5B976"/>
      <stop offset="100%" stop-color="#B9833D"/>
    </linearGradient>
    <linearGradient id="${p}roure" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#C89B62"/>
      <stop offset="50%" stop-color="#9A6B38"/>
      <stop offset="100%" stop-color="#6D451B"/>
    </linearGradient>
    <linearGradient id="${p}banus" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4B382F"/>
      <stop offset="50%" stop-color="#291D18"/>
      <stop offset="100%" stop-color="#140D0A"/>
    </linearGradient>
    <linearGradient id="${p}suro" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#A67449"/>
      <stop offset="35%" stop-color="#DFAA74"/>
      <stop offset="75%" stop-color="#C28954"/>
      <stop offset="100%" stop-color="#8C5D34"/>
    </linearGradient>
    <linearGradient id="${p}porexpan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="60%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="${p}gel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E0F2FE" stop-opacity="0.92"/>
      <stop offset="45%" stop-color="#BAE6FD" stop-opacity="0.78"/>
      <stop offset="100%" stop-color="#7DD3FC" stop-opacity="0.88"/>
    </linearGradient>
    <linearGradient id="${p}cera" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="35%" stop-color="#FFFBEB"/>
      <stop offset="70%" stop-color="#FEF3C7"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>

    <!-- Quotidians -->
    <radialGradient id="${p}poma" cx="35%" cy="30%" r="68%">
      <stop offset="0%" stop-color="#FCA5A5"/>
      <stop offset="28%" stop-color="#EF4444"/>
      <stop offset="75%" stop-color="#B91C1C"/>
      <stop offset="100%" stop-color="#7F1D1D"/>
    </radialGradient>
    <radialGradient id="${p}ou" cx="36%" cy="30%" r="68%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="45%" stop-color="#FDE68A"/>
      <stop offset="85%" stop-color="#D9A86C"/>
      <stop offset="100%" stop-color="#A16A38"/>
    </radialGradient>
    <radialGradient id="${p}patata" cx="35%" cy="32%" r="70%">
      <stop offset="0%" stop-color="#E5C08D"/>
      <stop offset="55%" stop-color="#C6955A"/>
      <stop offset="100%" stop-color="#85582A"/>
    </radialGradient>
    <linearGradient id="${p}llauna-vermella" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#991B1B"/>
      <stop offset="25%" stop-color="#EF4444"/>
      <stop offset="42%" stop-color="#FCA5A5"/>
      <stop offset="65%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#7F1D1D"/>
    </linearGradient>
    <linearGradient id="${p}llauna-zero" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="25%" stop-color="#334155"/>
      <stop offset="42%" stop-color="#64748B"/>
      <stop offset="65%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="${p}plastilina" cx="35%" cy="30%" r="68%">
      <stop offset="0%" stop-color="#86EFAC"/>
      <stop offset="45%" stop-color="#22C55E"/>
      <stop offset="100%" stop-color="#15803D"/>
    </radialGradient>
    <radialGradient id="${p}anec" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="45%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </radialGradient>
    <radialGradient id="${p}tennis" cx="35%" cy="30%" r="68%">
      <stop offset="0%" stop-color="#ECFCCB"/>
      <stop offset="35%" stop-color="#BEF264"/>
      <stop offset="80%" stop-color="#84CC16"/>
      <stop offset="100%" stop-color="#4D7C0F"/>
    </radialGradient>
    <radialGradient id="${p}granit" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#CBD5E1"/>
      <stop offset="60%" stop-color="#94A3B8"/>
      <stop offset="100%" stop-color="#475569"/>
    </radialGradient>
    <radialGradient id="${p}tosca" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#E7E5E4"/>
      <stop offset="60%" stop-color="#A8A29E"/>
      <stop offset="100%" stop-color="#78716C"/>
    </radialGradient>
  `;
}

/**
 * Dibuixa un bloc 3D isomètric frontal realista.
 */
function dibuixaBloc3D(x, y, w, h, fillMain, fillTop, stroke, detalls = "") {
  const dx = Math.min(10, w * 0.16);
  const dy = Math.min(7, h * 0.16);
  const fw = w - dx;
  const fh = h - dy;
  const fx = x;
  const fy = y + dy;

  return `
    <g>
      <!-- Cara superior -->
      <polygon points="${fx},${fy} ${fx + dx},${y} ${fx + dx + fw},${y} ${fx + fw},${fy}"
               fill="${fillTop}" stroke="${stroke}" stroke-width="1.3" stroke-linejoin="round"/>
      <!-- Cara lateral dreta -->
      <polygon points="${fx + fw},${fy} ${fx + fw + dx},${y} ${fx + fw + dx},${y + fh} ${fx + fw},${fy + fh}"
               fill="${fillMain}" filter="brightness(0.84)" stroke="${stroke}" stroke-width="1.3" stroke-linejoin="round"/>
      <!-- Cara frontal -->
      <rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="1.5"
            fill="${fillMain}" stroke="${stroke}" stroke-width="1.5"/>
      ${detalls}
      <!-- Brillant de vora -->
      <line x1="${fx + 2}" y1="${fy + 1.5}" x2="${fx + fw - 2}" y2="${fy + 1.5}" stroke="#FFFFFF" stroke-width="1.2" opacity="0.55"/>
    </g>
  `;
}

/**
 * Dibuixa un objecte realista centrat a (cx, cy) dins la caixa (w x h).
 * @param {object} obj
 * @param {number} cx
 * @param {number} cy
 * @param {number} w
 * @param {number} h
 * @param {string} [p="o-"] Prefix d'ID per als degradats
 * @returns {string} SVG markup
 */
export function dibuixaObjecteRealista(obj, cx, cy, w, h, p = "o-") {
  if (!obj) return "";
  const x = cx - w / 2;
  const y = cy - h / 2;
  const forma = obj.forma || "bloc";

  switch (forma) {
    case "bloc": {
      return dibuixaBloc3D(x, y, w, h, `url(#${p}alu)`, `url(#${p}alu-top)`, "#475569", `
        <line x1="${x + 6}" y1="${y + h * 0.45}" x2="${x + w * 0.65}" y2="${y + h * 0.45}" stroke="#FFFFFF" stroke-width="1.2" opacity="0.45"/>
        <text x="${cx - 4}" y="${cy + 5}" text-anchor="middle" font-size="9" font-weight="700" fill="#334155" opacity="0.7">Al</text>
      `);
    }

    case "bloc_ferro": {
      return dibuixaBloc3D(x, y, w, h, `url(#${p}ferro)`, "#64748B", "#0F172A", `
        <text x="${cx - 4}" y="${cy + 5}" text-anchor="middle" font-size="9" font-weight="700" fill="#E2E8F0" opacity="0.75">Fe</text>
      `);
    }

    case "cilindre_coure": {
      const cw = w * 0.72;
      const cx0 = cx - cw / 2;
      const ry = Math.max(4, h * 0.14);
      return `
        <g>
          <path d="M ${cx0} ${y + ry} L ${cx0} ${y + h - ry} A ${cw / 2} ${ry} 0 0 0 ${cx0 + cw} ${y + h - ry} L ${cx0 + cw} ${y + ry} Z"
                fill="url(#${p}coure)" stroke="#7C2D12" stroke-width="1.5"/>
          <ellipse cx="${cx}" cy="${y + ry}" rx="${cw / 2}" ry="${ry}" fill="#FDBA74" stroke="#7C2D12" stroke-width="1.4"/>
          <ellipse cx="${cx - cw * 0.15}" cy="${y + ry}" rx="${cw * 0.18}" ry="${ry * 0.45}" fill="#FFF7ED" opacity="0.55"/>
          <text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="9" font-weight="700" fill="#FFF7ED" opacity="0.8">Cu</text>
        </g>
      `;
    }

    case "pes_plom": {
      const bw = w * 0.78;
      const tw = w * 0.56;
      return `
        <g>
          <!-- Anella superior -->
          <circle cx="${cx}" cy="${y + 5}" r="4.5" fill="none" stroke="#334155" stroke-width="2.5"/>
          <!-- Cos trapezoïdal -->
          <polygon points="${cx - tw / 2},${y + 9} ${cx + tw / 2},${y + 9} ${cx + bw / 2},${y + h - 2} ${cx - bw / 2},${y + h - 2}"
                   fill="url(#${p}plom)" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
          <line x1="${cx - tw * 0.25}" y1="${y + 13}" x2="${cx - bw * 0.3}" y2="${y + h - 6}" stroke="#94A3B8" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
          <text x="${cx}" y="${cy + 9}" text-anchor="middle" font-size="9" font-weight="700" fill="#E2E8F0" opacity="0.85">Pb</text>
        </g>
      `;
    }

    case "lingot_or": {
      const bw = w * 0.96;
      const tw = w * 0.72;
      return `
        <g>
          <polygon points="${cx - tw / 2},${y + 5} ${cx + tw / 2},${y + 5} ${cx + bw / 2},${y + h - 2} ${cx - bw / 2},${y + h - 2}"
                   fill="url(#${p}or)" stroke="#854D0E" stroke-width="1.5" stroke-linejoin="round"/>
          <polygon points="${cx - tw / 2 + 4},${y + 8} ${cx + tw / 2 - 4},${y + 8} ${cx + tw / 2 + 2},${y + 15} ${cx - tw / 2 - 2},${y + 15}"
                   fill="#FEF9C3" opacity="0.7"/>
          <text x="${cx}" y="${cy + 9}" text-anchor="middle" font-size="8.5" font-weight="800" fill="#713F12">999,9 Au</text>
        </g>
      `;
    }

    case "esfera_acer": {
      const r = Math.min(w, h) * 0.47;
      return `
        <g>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}acer)" stroke="#1E293B" stroke-width="1.5"/>
          <ellipse cx="${cx - r * 0.32}" cy="${cy - r * 0.32}" rx="${r * 0.25}" ry="${r * 0.14}" transform="rotate(-30 ${cx - r * 0.32} ${cy - r * 0.32})" fill="#FFFFFF" opacity="0.8"/>
        </g>
      `;
    }

    case "pedra_granit": {
      return `
        <g>
          <path d="M ${cx - w * 0.44} ${cy + h * 0.15} L ${cx - w * 0.32} ${cy - h * 0.38} L ${cx + w * 0.15} ${cy - h * 0.44} L ${cx + w * 0.46} ${cy - h * 0.08} L ${cx + w * 0.36} ${cy + h * 0.42} L ${cx - w * 0.26} ${cy + h * 0.44} Z"
                fill="url(#${p}granit)" stroke="#334155" stroke-width="1.5" stroke-linejoin="round"/>
          <circle cx="${cx - w * 0.15}" cy="${cy - h * 0.12}" r="1.7" fill="#1E293B" opacity="0.65"/>
          <circle cx="${cx + w * 0.18}" cy="${cy - h * 0.16}" r="1.4" fill="#F8FAFC" opacity="0.8"/>
          <circle cx="${cx + w * 0.06}" cy="${cy + h * 0.18}" r="1.8" fill="#1E293B" opacity="0.6"/>
          <circle cx="${cx - w * 0.2}" cy="${cy + h * 0.22}" r="1.3" fill="#F8FAFC" opacity="0.75"/>
          <circle cx="${cx + w * 0.24}" cy="${cy + h * 0.12}" r="1.5" fill="#334155" opacity="0.6"/>
        </g>
      `;
    }

    case "pedra_tosca": {
      return `
        <g>
          <path d="M ${cx - w * 0.45} ${cy + h * 0.1} C ${cx - w * 0.42} ${cy - h * 0.4}, ${cx - w * 0.05} ${cy - h * 0.46}, ${cx + w * 0.35} ${cy - h * 0.32} C ${cx + w * 0.5} ${cy - h * 0.1}, ${cx + w * 0.42} ${cy + h * 0.4}, ${cx + w * 0.05} ${cy + h * 0.44} C ${cx - w * 0.3} ${cy + h * 0.44}, ${cx - w * 0.48} ${cy + h * 0.28}, ${cx - w * 0.45} ${cy + h * 0.1} Z"
                fill="url(#${p}tosca)" stroke="#57534E" stroke-width="1.5"/>
          <circle cx="${cx - w * 0.18}" cy="${cy - h * 0.12}" r="2.4" fill="#57534E" opacity="0.45"/>
          <circle cx="${cx + w * 0.15}" cy="${cy - h * 0.14}" r="2" fill="#44403C" opacity="0.4"/>
          <circle cx="${cx + w * 0.02}" cy="${cy + h * 0.14}" r="2.6" fill="#57534E" opacity="0.45"/>
          <circle cx="${cx - w * 0.22}" cy="${cy + h * 0.18}" r="1.6" fill="#44403C" opacity="0.4"/>
          <circle cx="${cx + w * 0.24}" cy="${cy + h * 0.1}" r="1.8" fill="#57534E" opacity="0.4"/>
        </g>
      `;
    }

    case "fusta_pi":
    case "fusta_roure":
    case "fusta_banus": {
      const grad = forma === "fusta_pi" ? `url(#${p}pi)` : forma === "fusta_roure" ? `url(#${p}roure)` : `url(#${p}banus)`;
      const top = forma === "fusta_pi" ? "#FEF3C7" : forma === "fusta_roure" ? "#D6A874" : "#5C473C";
      const stroke = forma === "fusta_banus" ? "#090605" : "#78350F";
      const veta = forma === "fusta_banus" ? "#78716C" : "#78350F";
      return dibuixaBloc3D(x, y, w, h, grad, top, stroke, `
        <path d="M ${x + 5} ${y + h * 0.42} Q ${cx - 4} ${y + h * 0.34} ${x + w - 12} ${y + h * 0.44}" fill="none" stroke="${veta}" stroke-width="1.2" opacity="0.45"/>
        <path d="M ${x + 5} ${y + h * 0.65} Q ${cx - 2} ${y + h * 0.74} ${x + w - 12} ${y + h * 0.63}" fill="none" stroke="${veta}" stroke-width="1.2" opacity="0.45"/>
        <ellipse cx="${cx - 6}" cy="${y + h * 0.54}" rx="4" ry="2.2" fill="none" stroke="${veta}" stroke-width="1.1" opacity="0.45"/>
      `);
    }

    case "tap_suro": {
      const tw = w * 0.74;
      const bw = w * 0.58;
      return `
        <g>
          <polygon points="${cx - tw / 2},${y + 4} ${cx + tw / 2},${y + 4} ${cx + bw / 2},${y + h - 3} ${cx - bw / 2},${y + h - 3}"
                   fill="url(#${p}suro)" stroke="#78350F" stroke-width="1.4" stroke-linejoin="round"/>
          <ellipse cx="${cx}" cy="${y + 4}" rx="${tw / 2}" ry="4" fill="#E7BD8C" stroke="#78350F" stroke-width="1.3"/>
          <circle cx="${cx - 6}" cy="${cy}" r="1.4" fill="#78350F" opacity="0.45"/>
          <circle cx="${cx + 7}" cy="${cy - 4}" r="1.2" fill="#78350F" opacity="0.45"/>
          <circle cx="${cx + 2}" cy="${cy + 7}" r="1.5" fill="#78350F" opacity="0.45"/>
          <circle cx="${cx - 4}" cy="${cy + 10}" r="1.1" fill="#78350F" opacity="0.45"/>
        </g>
      `;
    }

    case "porexpan": {
      return dibuixaBloc3D(x, y, w, h, `url(#${p}porexpan)`, "#FFFFFF", "#94A3B8", `
        <circle cx="${x + w * 0.25}" cy="${y + h * 0.45}" r="2.2" fill="none" stroke="#CBD5E1" stroke-width="0.9"/>
        <circle cx="${x + w * 0.55}" cy="${y + h * 0.58}" r="2.5" fill="none" stroke="#CBD5E1" stroke-width="0.9"/>
        <circle cx="${x + w * 0.38}" cy="${y + h * 0.78}" r="2" fill="none" stroke="#CBD5E1" stroke-width="0.9"/>
        <circle cx="${x + w * 0.68}" cy="${y + h * 0.42}" r="1.8" fill="none" stroke="#CBD5E1" stroke-width="0.9"/>
      `);
    }

    case "glaco": {
      return dibuixaBloc3D(x, y, w, h, `url(#${p}gel)`, "#F0F9FF", "#38BDF8", `
        <line x1="${x + 6}" y1="${y + h * 0.38}" x2="${x + w * 0.45}" y2="${y + h * 0.72}" stroke="#FFFFFF" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
        <line x1="${x + w * 0.35}" y1="${y + h * 0.36}" x2="${x + w * 0.65}" y2="${y + h * 0.58}" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
      `);
    }

    case "espelma": {
      const cw = w * 0.58;
      const cx0 = cx - cw / 2;
      const ry = Math.max(3.5, h * 0.12);
      return `
        <g>
          <path d="M ${cx0} ${y + 8 + ry} L ${cx0} ${y + h - ry} A ${cw / 2} ${ry} 0 0 0 ${cx0 + cw} ${y + h - ry} L ${cx0 + cw} ${y + 8 + ry} Z"
                fill="url(#${p}cera)" stroke="#94A3B8" stroke-width="1.3"/>
          <ellipse cx="${cx}" cy="${y + 8 + ry}" rx="${cw / 2}" ry="${ry}" fill="#FFFBEB" stroke="#94A3B8" stroke-width="1.2"/>
          <line x1="${cx}" y1="${y + 8 + ry}" x2="${cx}" y2="${y + 2}" stroke="#334155" stroke-width="1.6" stroke-linecap="round"/>
        </g>
      `;
    }

    case "poma": {
      const r = Math.min(w, h) * 0.44;
      return `
        <g>
          <!-- Cua i fulla -->
          <path d="M ${cx} ${cy - r * 0.72} Q ${cx + 2} ${cy - r * 1.1} ${cx + 5} ${cy - r * 1.15}" fill="none" stroke="#78350F" stroke-width="2" stroke-linecap="round"/>
          <path d="M ${cx + 1} ${cy - r * 0.92} Q ${cx + r * 0.55} ${cy - r * 1.25} ${cx + r * 0.65} ${cy - r * 0.78} Q ${cx + r * 0.25} ${cy - r * 0.72} ${cx + 1} ${cy - r * 0.92} Z"
                fill="#22C55E" stroke="#15803D" stroke-width="1"/>
          <!-- Cos de la poma -->
          <path d="M ${cx} ${cy - r * 0.75}
                   C ${cx + r * 0.75} ${cy - r * 0.95}, ${cx + r * 1.12} ${cy - r * 0.2}, ${cx + r * 0.92} ${cy + r * 0.48}
                   C ${cx + r * 0.72} ${cy + r * 0.98}, ${cx + r * 0.22} ${cy + r * 0.95}, ${cx} ${cy + r * 0.82}
                   C ${cx - r * 0.22} ${cy + r * 0.95}, ${cx - r * 0.72} ${cy + r * 0.98}, ${cx - r * 0.92} ${cy + r * 0.48}
                   C ${cx - r * 1.12} ${cy - r * 0.2}, ${cx - r * 0.75} ${cy - r * 0.95}, ${cx} ${cy - r * 0.75} Z"
                fill="url(#${p}poma)" stroke="#7F1D1D" stroke-width="1.4"/>
          <ellipse cx="${cx - r * 0.38}" cy="${cy - r * 0.25}" rx="${r * 0.2}" ry="${r * 0.34}" transform="rotate(-18 ${cx - r * 0.38} ${cy - r * 0.25})" fill="#FFFFFF" opacity="0.42"/>
        </g>
      `;
    }

    case "ou": {
      const rx = w * 0.38;
      const ry = h * 0.47;
      return `
        <g>
          <path d="M ${cx} ${cy - ry}
                   C ${cx + rx * 0.75} ${cy - ry}, ${cx + rx} ${cy - ry * 0.08}, ${cx + rx} ${cy + ry * 0.26}
                   C ${cx + rx} ${cy + ry * 0.84}, ${cx + rx * 0.56} ${cy + ry}, ${cx} ${cy + ry}
                   C ${cx - rx * 0.56} ${cy + ry}, ${cx - rx} ${cy + ry * 0.84}, ${cx - rx} ${cy + ry * 0.26}
                   C ${cx - rx} ${cy - ry * 0.08}, ${cx - rx * 0.75} ${cy - ry}, ${cx} ${cy - ry} Z"
                fill="url(#${p}ou)" stroke="#92400E" stroke-width="1.4"/>
          <ellipse cx="${cx - rx * 0.32}" cy="${cy - ry * 0.24}" rx="${rx * 0.2}" ry="${ry * 0.3}" fill="#FFFFFF" opacity="0.5"/>
        </g>
      `;
    }

    case "patata": {
      const rx = w * 0.46;
      const ry = h * 0.38;
      return `
        <g>
          <path d="M ${cx - rx} ${cy + 2}
                   C ${cx - rx} ${cy - ry * 0.9}, ${cx + rx * 0.65} ${cy - ry * 1.05}, ${cx + rx} ${cy - ry * 0.15}
                   C ${cx + rx * 1.02} ${cy + ry * 0.88}, ${cx - rx * 0.75} ${cy + ry}, ${cx - rx} ${cy + 2} Z"
                fill="url(#${p}patata)" stroke="#78350F" stroke-width="1.4"/>
          <circle cx="${cx - rx * 0.35}" cy="${cy - ry * 0.25}" r="1.5" fill="#78350F" opacity="0.6"/>
          <circle cx="${cx + rx * 0.32}" cy="${cy + ry * 0.28}" r="1.7" fill="#78350F" opacity="0.6"/>
          <circle cx="${cx + rx * 0.12}" cy="${cy - ry * 0.42}" r="1.2" fill="#78350F" opacity="0.55"/>
        </g>
      `;
    }

    case "llauna_normal":
    case "llauna_zero": {
      const cw = w * 0.62;
      const lx = cx - cw / 2;
      const grad = forma === "llauna_zero" ? `url(#${p}llauna-zero)` : `url(#${p}llauna-vermella)`;
      const label = forma === "llauna_zero" ? "ZERO" : "COLA";
      const accent = forma === "llauna_zero" ? "#38BDF8" : "#FFFFFF";
      return `
        <g>
          <rect x="${lx}" y="${y + 4}" width="${cw}" height="${h - 7}" rx="4" fill="${grad}" stroke="#0F172A" stroke-width="1.4"/>
          <!-- Tapa i base metàl·liques -->
          <rect x="${lx + 1}" y="${y + 2}" width="${cw - 2}" height="5" rx="2" fill="#E2E8F0" stroke="#475569" stroke-width="1"/>
          <rect x="${lx + 1}" y="${y + h - 5}" width="${cw - 2}" height="4" rx="2" fill="#CBD5E1" stroke="#475569" stroke-width="1"/>
          <!-- Brillant vertical -->
          <line x1="${lx + cw * 0.28}" y1="${y + 8}" x2="${lx + cw * 0.28}" y2="${y + h - 7}" stroke="#FFFFFF" stroke-width="2.2" opacity="0.35"/>
          <text x="${cx}" y="${cy + 3}" text-anchor="middle" font-size="7.5" font-weight="800" fill="${accent}" letter-spacing="0.5">${label}</text>
        </g>
      `;
    }

    case "plastilina": {
      const r = Math.min(w, h) * 0.45;
      return `
        <g>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}plastilina)" stroke="#166534" stroke-width="1.4"/>
          <ellipse cx="${cx - r * 0.28}" cy="${cy - r * 0.28}" rx="${r * 0.22}" ry="${r * 0.14}" fill="#FFFFFF" opacity="0.4"/>
        </g>
      `;
    }

    case "corona": {
      return `
        <g>
          <path d="M ${x + 4} ${y + h - 3} L ${x + 1} ${y + 9} L ${x + w * 0.28} ${y + h * 0.52} L ${cx} ${y + 4} L ${x + w * 0.72} ${y + h * 0.52} L ${x + w - 1} ${y + 9} L ${x + w - 4} ${y + h - 3} Z"
                fill="url(#${p}or)" stroke="#854D0E" stroke-width="1.5" stroke-linejoin="round"/>
          <rect x="${x + 4}" y="${y + h - 8}" width="${w - 8}" height="5" rx="1.5" fill="#EAB308" stroke="#854D0E" stroke-width="1"/>
          <circle cx="${cx}" cy="${y + 5}" r="3" fill="#DC2626" stroke="#7F1D1D" stroke-width="0.8"/>
          <circle cx="${x + 2}" cy="${y + 10}" r="2.4" fill="#2563EB" stroke="#1E3A8A" stroke-width="0.8"/>
          <circle cx="${x + w - 2}" cy="${y + 10}" r="2.4" fill="#2563EB" stroke="#1E3A8A" stroke-width="0.8"/>
          <circle cx="${cx}" cy="${y + h - 5.5}" r="2" fill="#16A34A"/>
        </g>
      `;
    }

    case "anec": {
      const s = Math.min(w, h);
      return `
        <g transform="translate(${cx}, ${cy}) scale(${s / 44})">
          <!-- Cos -->
          <path d="M -16 4 C -16 -3, -6 -4, 0 -2 C 6 0, 14 -6, 16 -2 C 17 5, 11 13, 0 13 C -11 13, -16 9, -16 4 Z"
                fill="url(#${p}anec)" stroke="#A16207" stroke-width="1.4"/>
          <!-- Ala -->
          <path d="M -4 3 C 3 1, 8 4, 6 9 C 1 10, -5 8, -4 3 Z" fill="#FDE047" stroke="#CA8A04" stroke-width="1"/>
          <!-- Cap -->
          <circle cx="-7" cy="-8" r="7.5" fill="url(#${p}anec)" stroke="#A16207" stroke-width="1.4"/>
          <!-- Bec -->
          <path d="M -14 -9 L -20 -7 L -14 -5 Z" fill="#F97316" stroke="#9A3412" stroke-width="1"/>
          <!-- Ull -->
          <circle cx="-9.5" cy="-9.5" r="1.4" fill="#0F172A"/>
          <circle cx="-10" cy="-10" r="0.4" fill="#FFFFFF"/>
        </g>
      `;
    }

    case "pilota_tennis": {
      const r = Math.min(w, h) * 0.46;
      return `
        <g>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}tennis)" stroke="#3F6212" stroke-width="1.4"/>
          <path d="M ${cx - r * 0.72} ${cy - r * 0.55} Q ${cx - r * 0.1} ${cy} ${cx - r * 0.72} ${cy + r * 0.55}"
                fill="none" stroke="#F8FAFC" stroke-width="2" stroke-linecap="round"/>
          <path d="M ${cx + r * 0.72} ${cy - r * 0.55} Q ${cx + r * 0.1} ${cy} ${cx + r * 0.72} ${cy + r * 0.55}"
                fill="none" stroke="#F8FAFC" stroke-width="2" stroke-linecap="round"/>
        </g>
      `;
    }

    case "custom_esfera": {
      const r = Math.min(w, h) * 0.46;
      const mat = obj.materialPersonalitzat || "alumini";
      const fillMap = {
        fusta: `url(#${p}pi)`,
        plastic: `url(#${p}plastilina)`,
        alumini: `url(#${p}alu)`,
        ferro: `url(#${p}ferro)`,
        or: `url(#${p}or)`,
        lliure: `url(#${p}acer)`
      };
      return `
        <g>
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fillMap[mat] || fillMap.alumini}" stroke="#334155" stroke-width="1.5"/>
          <ellipse cx="${cx - r * 0.3}" cy="${cy - r * 0.3}" rx="${r * 0.22}" ry="${r * 0.14}" fill="#FFFFFF" opacity="0.5"/>
        </g>
      `;
    }

    case "custom_cilindre": {
      const cw = w * 0.72;
      const cx0 = cx - cw / 2;
      const ry = Math.max(4, h * 0.14);
      const mat = obj.materialPersonalitzat || "alumini";
      const fillMap = {
        fusta: `url(#${p}pi)`,
        plastic: `url(#${p}plastilina)`,
        alumini: `url(#${p}alu)`,
        ferro: `url(#${p}ferro)`,
        or: `url(#${p}or)`,
        lliure: `url(#${p}coure)`
      };
      return `
        <g>
          <path d="M ${cx0} ${y + ry} L ${cx0} ${y + h - ry} A ${cw / 2} ${ry} 0 0 0 ${cx0 + cw} ${y + h - ry} L ${cx0 + cw} ${y + ry} Z"
                fill="${fillMap[mat] || fillMap.alumini}" stroke="#334155" stroke-width="1.5"/>
          <ellipse cx="${cx}" cy="${y + ry}" rx="${cw / 2}" ry="${ry}" fill="#E2E8F0" opacity="0.85" stroke="#334155" stroke-width="1.3"/>
        </g>
      `;
    }

    default: {
      // custom_bloc or fallback
      const mat = obj.materialPersonalitzat || "alumini";
      const fillMap = {
        fusta: `url(#${p}pi)`,
        plastic: `url(#${p}plastilina)`,
        alumini: `url(#${p}alu)`,
        ferro: `url(#${p}ferro)`,
        or: `url(#${p}or)`,
        lliure: `url(#${p}alu)`
      };
      const topMap = {
        fusta: "#FEF3C7",
        plastic: "#86EFAC",
        alumini: `url(#${p}alu-top)`,
        ferro: "#64748B",
        or: "#FEF08A",
        lliure: "#E2E8F0"
      };
      return dibuixaBloc3D(x, y, w, h, fillMap[mat] || fillMap.alumini, topMap[mat] || "#E2E8F0", "#334155");
    }
  }
}
