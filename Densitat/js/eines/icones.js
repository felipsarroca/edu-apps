/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Joc propi d'icones de línia coherents (08-disseny-visual-i-interaccio.md §5.3).
 * Mateix gruix (1.8), extrems arrodonits i zero emojis a la interfície.
 */

export const ICONES_SVG = {
  inici: '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"/>',
  laboratori: '<path d="M9 3h6M10 3v5.4L5.2 17a2 2 0 0 0 1.7 3h10.2a2 2 0 0 0 1.7-3L14 8.4V3"/><path d="M7.5 14h9"/>',
  balanca: '<path d="M12 4v14M6 18h12M4 21h16M5 9h14"/><path d="M6 9l-2 4h4l-2-4zM18 9l-2 4h4l-2-4z"/>',
  proveta: '<path d="M8 3h8v16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V3z"/><path d="M8 7h3M8 11h4M8 15h3M6 3h12"/>',
  regle: '<rect x="3" y="7" width="18" height="10" rx="1.5"/><path d="M7 7v4M11 7v3M15 7v4M19 7v3"/>',
  peu_de_rei: '<path d="M3 7h18v4H7v6H3V7z"/><path d="M11 11v4h3v-4"/>',
  dinamometre: '<rect x="8" y="3" width="8" height="12" rx="2"/><path d="M12 15v3a2 2 0 0 1-4 0M10 7h4M10 10h4"/>',
  vas: '<path d="M5 4h14l-1 15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 4z"/><path d="M6 11h12"/>',
  tanc: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 11h18M18 8v8"/>',
  ganivet: '<path d="M14 4l6 6-9 9H5v-6l9-9z"/><path d="M12 6l6 6"/>',
  taller: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5z"/>',
  vareta: '<path d="M12 3v14"/><path d="M9 14l3 3 3-3"/><circle cx="12" cy="19" r="2"/>',
  lupa: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M8 11h6"/>',
  comptagotes: '<path d="M15 4l5 5-3 3-5-5 3-3z"/><path d="M12 7L5 14v5h5l7-7"/>',
  sal: '<path d="M8 4h8l1 6H7l1-6z"/><circle cx="9" cy="15" r="1"/><circle cx="12" cy="17" r="1"/><circle cx="15" cy="15" r="1"/><circle cx="12" cy="13" r="1"/>',
  remena: '<path d="M16 3L8 19"/><path d="M6 15c2 3 10 3 12 0"/>',
  calculadora: '<rect x="5" y="3" width="14" height="18" rx="2"/><rect x="8" y="6" width="8" height="3" rx="0.5"/><path d="M8 13h2M14 13h2M8 17h2M14 17h2"/>',
  conversor: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  grafica: '<path d="M4 4v16h16"/><path d="M5 18L18 6"/><circle cx="9" cy="14" r="1.5"/><circle cx="14" cy="9.5" r="1.5"/>',
  cubets: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  volums: '<rect x="3" y="5" width="18" height="14" rx="2" stroke-dasharray="3 2"/><rect x="7" y="9" width="10" height="6" rx="1"/>',
  forces: '<circle cx="12" cy="12" r="3"/><path d="M12 3v6M9.5 5.5L12 3l2.5 2.5M12 21v-6M9.5 18.5L12 21l2.5-2.5"/>',
  particules: '<circle cx="7" cy="8" r="2"/><circle cx="16" cy="7" r="2"/><circle cx="12" cy="13" r="2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="16" r="2"/>',
  valors: '<path d="M4 9h16M4 15h16M9 4L7 20M17 4l-2 16"/>',
  comparador: '<rect x="3" y="4" width="8" height="16" rx="1.5"/><rect x="13" y="4" width="8" height="16" rx="1.5"/>',
  quadern: '<path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  anota: '<path d="M12 5v14M5 12h14"/>',
  captura: '<path d="M4 8h3l2-2h6l2 2h3a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3"/>',
  pista: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.6 1 1.4 1 2.5h6c0-1.1.3-1.9 1-2.5A6 6 0 0 0 12 3z"/>',
  desfes: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a5 5 0 0 1 0 10h-3"/>',
  refes: '<path d="M15 14l5-5-5-5"/><path d="M20 9H10a5 5 0 0 0 0 10h3"/>',
  reinicia: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
  endreca: '<path d="M4 6h16M4 12h16M4 18h10"/><path d="M17 15l3 3-3 3"/>',
  projector: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  enllac: '<path d="M10 13a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1.5 1.5"/><path d="M14 11a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1.5-1.5"/>',
  exporta: '<path d="M12 3v12M8 11l4 4 4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  consulta: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5z"/><path d="M8 7h8M8 11h6"/>',
  progres: '<path d="M5 19V11M10 19V7M15 19v-5M20 19V4"/>',
  docent: '<path d="M12 3L2 8l10 5 10-5-10-5z"/><path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"/>',
  verifica: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  avís: '<path d="M12 3L2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>',
  tanca: '<path d="M6 6l12 12M18 6L6 18"/>',
  plega: '<path d="M9 6l6 6-6 6"/>',
  desplega: '<path d="M15 6l-6 6 6 6"/>',
  barca: '<path d="M3 14l2 5h14l2-5H3z"/><path d="M12 5v9M12 5l6 6h-6"/>',
  submari: '<rect x="4" y="10" width="15" height="7" rx="3.5"/><path d="M9 10V7h4v3M19 13.5h2M21 11.5v4"/>',
  sonda: '<circle cx="12" cy="16" r="3"/><path d="M12 3v10M9 6h6"/>',
  termometre: '<path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0z"/>',
  globus: '<path d="M12 3a6 6 0 0 1 6 6c0 4-3 7-6 8-3-1-6-4-6-8a6 6 0 0 1 6-6z"/><path d="M12 17v4"/>'
};

/**
 * Retorna l'element SVG d'una icona de línia.
 * @param {string} nom
 * @param {string} [classe="ic"]
 * @returns {string}
 */
export function icona(nom, classe = "ic") {
  const path = ICONES_SVG[nom] || ICONES_SVG.laboratori;
  return `<svg class="${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}
