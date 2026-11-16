/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Dades de referència dels materials sòlids del laboratori.
 * Totes les densitats en g/cm³.
 */

export const MATERIALS = {
  poliestire: {
    id: "poliestire",
    nom: "poliestirè expandit",
    estat: "solid",
    dEscolar: 0.05,
    dReferencia: 0.03,
    interval: [0.015, 0.05],
    tallable: true,
    deformable: false,
    aspecte: { color: "#F8FAFC", contorn: "#CBD5E1", textura: "escuma", brillant: false },
    particules: { massaRelativa: 1, compactacio: 0.06, estructura: "escuma_aire", nota: "Gairebé tot el volum és aire atrapat en cel·les tancades." },
    notes: ["Gairebé tot és aire"]
  },
  balsa: {
    id: "balsa",
    nom: "fusta de balsa",
    estat: "solid",
    dEscolar: 0.15,
    dReferencia: 0.16,
    interval: [0.10, 0.20],
    tallable: true,
    deformable: false,
    aspecte: { color: "#F3E5AB", contorn: "#C8A96E", textura: "fusta", brillant: false },
    particules: { massaRelativa: 1.2, compactacio: 0.18, estructura: "fibres_obertes", nota: "Fusta amb cèl·lules grans plenes d'aire." },
    notes: []
  },
  suro: {
    id: "suro",
    nom: "suro",
    estat: "solid",
    dEscolar: 0.25,
    dReferencia: 0.24,
    interval: [0.12, 0.25],
    tallable: true,
    deformable: false,
    aspecte: { color: "#D9A066", contorn: "#9A6836", textura: "porosa", brillant: false },
    particules: { massaRelativa: 1.2, compactacio: 0.25, estructura: "cel_les_aire", nota: "Teixit vegetal amb microcel·les impermeables amb aire." },
    notes: []
  },
  pi: {
    id: "pi",
    nom: "fusta de pi",
    estat: "solid",
    dEscolar: 0.50,
    dReferencia: 0.50,
    interval: [0.35, 0.60],
    tallable: true,
    deformable: false,
    aspecte: { color: "#DEB887", contorn: "#9C7343", textura: "fusta", brillant: false },
    particules: { massaRelativa: 1.4, compactacio: 0.45, estructura: "fibres", nota: "Fibres de cel·lulosa i lignina amb espais microscòpics." },
    notes: []
  },
  tosca: {
    id: "tosca",
    nom: "pedra tosca",
    estat: "solid",
    dEscolar: 0.60,
    dReferencia: 0.60,
    interval: [0.25, 0.90],
    tallable: false,
    deformable: false,
    aspecte: { color: "#BCAAA4", contorn: "#795548", textura: "porosa", brillant: false },
    particules: { massaRelativa: 2.4, compactacio: 0.30, estructura: "roca_vesicular", nota: "Roca volcànica plena de bombolles de gas solidificades." },
    notes: ["Porosa: és una densitat mitjana. Una pedra que sura"]
  },
  roure: {
    id: "roure",
    nom: "fusta de roure",
    estat: "solid",
    dEscolar: 0.75,
    dReferencia: 0.75,
    interval: [0.60, 0.90],
    tallable: true,
    deformable: false,
    aspecte: { color: "#B87D4B", contorn: "#7A4D24", textura: "fusta", brillant: false },
    particules: { massaRelativa: 1.5, compactacio: 0.65, estructura: "fibres_denses", nota: "Fibres vegetals molt més compactes que les del pi." },
    notes: []
  },
  poma: {
    id: "poma",
    nom: "poma",
    estat: "solid",
    dEscolar: 0.80,
    dReferencia: 0.80,
    interval: [0.75, 0.85],
    tallable: true,
    deformable: false,
    aspecte: { color: "#DC2626", contorn: "#991B1B", textura: "organica", brillant: true },
    particules: { massaRelativa: 1.4, compactacio: 0.68, estructura: "teixit_vegetal", nota: "Conté prop d'un 20 % d'aire intercel·lular, per això sura." },
    notes: ["Aliment; valor mitjà"]
  },
  cera: {
    id: "cera",
    nom: "cera (parafina)",
    estat: "solid",
    dEscolar: 0.90,
    dReferencia: 0.90,
    interval: [0.88, 0.92],
    tallable: true,
    deformable: false,
    aspecte: { color: "#FEF3C7", contorn: "#D97706", textura: "mat", brillant: false },
    particules: { massaRelativa: 1.3, compactacio: 0.78, estructura: "cadenes_hidrocarburs", nota: "Cadenes llargues de carboni i hidrogen, àtoms lleugers." },
    notes: []
  },
  gel: {
    id: "gel",
    nom: "gel",
    estat: "solid",
    dEscolar: 0.92,
    dReferencia: 0.917,
    interval: [0.915, 0.920],
    tallable: true,
    deformable: false,
    aspecte: { color: "#DBEAFE", contorn: "#60A5FA", textura: "cristall", brillant: true },
    particules: { massaRelativa: 1.8, compactacio: 0.72, estructura: "xarxa_hexagonal", nota: "En congelar-se, les molècules d'aigua formen una xarxa hexagonal amb més espai buit que en estat líquid." },
    notes: ["A 0 °C"]
  },
  polietile: {
    id: "polietile",
    nom: "polietilè",
    estat: "solid",
    dEscolar: 0.95,
    dReferencia: 0.95,
    interval: [0.91, 0.97],
    tallable: true,
    deformable: false,
    aspecte: { color: "#38BDF8", contorn: "#0284C7", textura: "plastic", brillant: true },
    particules: { massaRelativa: 1.4, compactacio: 0.80, estructura: "polimer", nota: "Plàstic format per cadenes de carboni i hidrogen." },
    notes: ["Plàstic que sura"]
  },
  ou: {
    id: "ou",
    nom: "ou fresc",
    estat: "solid",
    dEscolar: 1.07,
    dReferencia: 1.07,
    interval: [1.03, 1.09],
    tallable: false,
    deformable: false,
    aspecte: { color: "#FDE68A", contorn: "#B45309", textura: "organica", brillant: false },
    particules: { massaRelativa: 1.9, compactacio: 0.82, estructura: "compost", nota: "Closca mineral densa, clara i rovell aquosos, i una petita cambra d'aire." },
    notes: ["Disminueix amb els dies"]
  },
  patata: {
    id: "patata",
    nom: "patata",
    estat: "solid",
    dEscolar: 1.08,
    dReferencia: 1.08,
    interval: [1.06, 1.10],
    tallable: true,
    deformable: false,
    aspecte: { color: "#D4A373", contorn: "#8D5B2B", textura: "organica", brillant: false },
    particules: { massaRelativa: 1.9, compactacio: 0.83, estructura: "teixit_mido", nota: "Aigua i grànuls de midó compactes, sense gaire aire." },
    notes: []
  },
  banus: {
    id: "banus",
    nom: "fusta de banús",
    estat: "solid",
    dEscolar: 1.10,
    dReferencia: 1.12,
    interval: [1.05, 1.20],
    tallable: true,
    deformable: false,
    aspecte: { color: "#292524", contorn: "#0C0A09", textura: "fusta", brillant: true },
    particules: { massaRelativa: 1.7, compactacio: 0.88, estructura: "fibres_molt_denses", nota: "Fusta tropical amb parets cel·lulars molt gruixudes i gairebé sense aire." },
    notes: ["Una fusta que s'enfonsa"]
  },
  nilo: {
    id: "nilo",
    nom: "niló",
    estat: "solid",
    dEscolar: 1.15,
    dReferencia: 1.14,
    interval: [1.13, 1.15],
    tallable: true,
    deformable: false,
    aspecte: { color: "#A78BFA", contorn: "#6D28D9", textura: "plastic", brillant: true },
    particules: { massaRelativa: 1.7, compactacio: 0.85, estructura: "polimer_polar", nota: "Polímer amb àtoms de nitrogen i oxigen que s'empaqueten fortament." },
    notes: ["Plàstic que s'enfonsa"]
  },
  pvc: {
    id: "pvc",
    nom: "PVC",
    estat: "solid",
    dEscolar: 1.40,
    dReferencia: 1.38,
    interval: [1.35, 1.45],
    tallable: true,
    deformable: false,
    aspecte: { color: "#94A3B8", contorn: "#475569", textura: "plastic", brillant: false },
    particules: { massaRelativa: 2.2, compactacio: 0.85, estructura: "polimer_clorat", nota: "Conté àtoms de clor, molt més pesants que el carboni i l'hidrogen." },
    notes: []
  },
  plastilina: {
    id: "plastilina",
    nom: "plastilina",
    estat: "solid",
    dEscolar: 1.50,
    dReferencia: 1.50,
    interval: [1.30, 1.90],
    tallable: true,
    deformable: true,
    aspecte: { color: "#F97316", contorn: "#C2410C", textura: "mat", brillant: false },
    particules: { massaRelativa: 2.3, compactacio: 0.86, estructura: "pasta_mineral", nota: "Ceres i olis barrejats amb càrregues minerals com el carbonat de calci." },
    notes: ["Segons la marca; deformable"]
  },
  formigo: {
    id: "formigo",
    nom: "formigó",
    estat: "solid",
    dEscolar: 2.30,
    dReferencia: 2.30,
    interval: [2.20, 2.40],
    tallable: false,
    deformable: false,
    aspecte: { color: "#9CA3AF", contorn: "#4B5563", textura: "granulada", brillant: false },
    particules: { massaRelativa: 2.8, compactacio: 0.86, estructura: "mineral_compost", nota: "Ciment, sorra i grava de silicats i òxids." },
    notes: []
  },
  ceramica: {
    id: "ceramica",
    nom: "ceràmica",
    estat: "solid",
    dEscolar: 2.40,
    dReferencia: 2.40,
    interval: [2.30, 2.50],
    tallable: false,
    deformable: false,
    aspecte: { color: "#D97757", contorn: "#9A3412", textura: "mat", brillant: true },
    particules: { massaRelativa: 2.9, compactacio: 0.88, estructura: "xarxa_silicats", nota: "Argila cuita amb estructura mineral compacta." },
    notes: ["Per a les esferes d'Arquimedes"]
  },
  vidre: {
    id: "vidre",
    nom: "vidre",
    estat: "solid",
    dEscolar: 2.50,
    dReferencia: 2.50,
    interval: [2.40, 2.80],
    tallable: false,
    deformable: false,
    aspecte: { color: "#67E8F9", contorn: "#0E7490", textura: "cristall", brillant: true },
    particules: { massaRelativa: 3.0, compactacio: 0.88, estructura: "amorf_silici", nota: "Xarxa amorfa d'òxid de silici, sodi i calci." },
    notes: []
  },
  granit: {
    id: "granit",
    nom: "granit",
    estat: "solid",
    dEscolar: 2.70,
    dReferencia: 2.70,
    interval: [2.60, 2.80],
    tallable: false,
    deformable: false,
    aspecte: { color: "#A8A29E", contorn: "#57534E", textura: "granulada", brillant: false },
    particules: { massaRelativa: 3.1, compactacio: 0.90, estructura: "cristalls_roca", nota: "Roca ígnia de quars, feldspat i mica. Mateixa densitat que l'alumini." },
    notes: ["Coincideix amb l'alumini: cas didàctic"]
  },
  alumini: {
    id: "alumini",
    nom: "alumini",
    estat: "solid",
    dEscolar: 2.70,
    dReferencia: 2.70,
    interval: null,
    tallable: true,
    deformable: false,
    aspecte: { color: "#CBD5E1", contorn: "#64748B", textura: "metall", brillant: true },
    particules: { massaRelativa: 2.7, compactacio: 0.92, estructura: "xarxa_metall", nota: "Àtoms d'alumini (massa atòmica 27 u) en xarxa cristal·lina." },
    notes: []
  },
  pirita: {
    id: "pirita",
    nom: "pirita",
    estat: "solid",
    dEscolar: 5.00,
    dReferencia: 5.01,
    interval: [4.90, 5.20],
    tallable: false,
    deformable: false,
    aspecte: { color: "#D4AF37", contorn: "#854D0E", textura: "cristall", brillant: true },
    particules: { massaRelativa: 4.5, compactacio: 0.92, estructura: "xarxa_cristall", nota: "Disulfur de ferro (FeS₂): brilla com l'or però els seus àtoms pesen gairebé quatre vegades menys." },
    notes: ["«L'or dels ximples»"]
  },
  zinc: {
    id: "zinc",
    nom: "zinc",
    estat: "solid",
    dEscolar: 7.14,
    dReferencia: 7.14,
    interval: null,
    tallable: true,
    deformable: false,
    aspecte: { color: "#94A3B8", contorn: "#475569", textura: "metall", brillant: true },
    particules: { massaRelativa: 6.5, compactacio: 0.92, estructura: "xarxa_metall", nota: "Àtoms de zinc (massa atòmica 65,4 u)." },
    notes: []
  },
  estany: {
    id: "estany",
    nom: "estany",
    estat: "solid",
    dEscolar: 7.30,
    dReferencia: 7.29,
    interval: null,
    tallable: true,
    deformable: false,
    aspecte: { color: "#B0BEC5", contorn: "#546E7A", textura: "metall", brillant: true },
    particules: { massaRelativa: 6.8, compactacio: 0.91, estructura: "xarxa_metall", nota: "Àtoms d'estany en xarxa metàl·lica." },
    notes: []
  },
  acer: {
    id: "acer",
    nom: "acer",
    estat: "solid",
    dEscolar: 7.85,
    dReferencia: 7.85,
    interval: [7.75, 8.05],
    tallable: true,
    deformable: false,
    aspecte: { color: "#71717A", contorn: "#3F3F46", textura: "metall", brillant: true },
    particules: { massaRelativa: 5.6, compactacio: 0.94, estructura: "aliatge_fe_c", nota: "Xarxa d'àtoms de ferro amb una petita proporció de carboni." },
    notes: []
  },
  ferro: {
    id: "ferro",
    nom: "ferro",
    estat: "solid",
    dEscolar: 7.87,
    dReferencia: 7.87,
    interval: null,
    tallable: true,
    deformable: false,
    aspecte: { color: "#64748B", contorn: "#334155", textura: "metall", brillant: true },
    particules: { massaRelativa: 5.6, compactacio: 0.94, estructura: "xarxa_metall", nota: "Àtoms de ferro (55,8 u) gairebé tres vegades més pesants que els d'alumini." },
    notes: []
  },
  llauto: {
    id: "llauto",
    nom: "llautó",
    estat: "solid",
    dEscolar: 8.50,
    dReferencia: 8.50,
    interval: [8.40, 8.70],
    tallable: true,
    deformable: false,
    aspecte: { color: "#EAB308", contorn: "#A16207", textura: "metall", brillant: true },
    particules: { massaRelativa: 6.4, compactacio: 0.94, estructura: "aliatge_cu_zn", nota: "Aliatge de coure i zinc: daurat com l'or, però menys de la meitat de dens." },
    notes: ["Aliatge de coure i zinc"]
  },
  coure: {
    id: "coure",
    nom: "coure",
    estat: "solid",
    dEscolar: 8.96,
    dReferencia: 8.96,
    interval: null,
    tallable: true,
    deformable: false,
    aspecte: { color: "#D97736", contorn: "#9A3412", textura: "metall", brillant: true },
    particules: { massaRelativa: 6.35, compactacio: 0.95, estructura: "xarxa_metall", nota: "Àtoms de coure (63,5 u) molt ben empaquetats." },
    notes: []
  },
  plata: {
    id: "plata",
    nom: "plata",
    estat: "solid",
    dEscolar: 10.50,
    dReferencia: 10.49,
    interval: null,
    tallable: true,
    deformable: false,
    aspecte: { color: "#E2E8F0", contorn: "#64748B", textura: "metall", brillant: true },
    particules: { massaRelativa: 10.8, compactacio: 0.95, estructura: "xarxa_metall", nota: "Àtoms de plata (107,9 u)." },
    notes: []
  },
  plom: {
    id: "plom",
    nom: "plom",
    estat: "solid",
    dEscolar: 11.30,
    dReferencia: 11.34,
    interval: null,
    tallable: true,
    deformable: false,
    aspecte: { color: "#475569", contorn: "#1E293B", textura: "metall", brillant: false },
    particules: { massaRelativa: 20.7, compactacio: 0.93, estructura: "xarxa_metall", nota: "Àtoms molt pesants (207,2 u): per això és tan dens tot i tenir una estructura semblant a altres metalls." },
    notes: []
  },
  or: {
    id: "or",
    nom: "or",
    estat: "solid",
    dEscolar: 19.30,
    dReferencia: 19.32,
    interval: null,
    tallable: true,
    deformable: false,
    aspecte: { color: "#FACC15", contorn: "#B45309", textura: "metall", brillant: true },
    particules: { massaRelativa: 19.7, compactacio: 0.97, estructura: "xarxa_metall", nota: "Àtoms d'or (197 u) extremadament pesants i molt compactes." },
    notes: []
  },
  // Material especial per a la corona del rei (aliatge d'or i plata: 15,4 g/cm³)
  aliatge_corona: {
    id: "aliatge_corona",
    nom: "aliatge d'or i plata",
    estat: "solid",
    dEscolar: 15.43,
    dReferencia: 15.43,
    interval: [14.0, 17.0],
    tallable: false,
    deformable: false,
    aspecte: { color: "#FDE047", contorn: "#A16207", textura: "metall", brillant: true },
    particules: { massaRelativa: 15.4, compactacio: 0.96, estructura: "aliatge_au_ag", nota: "Barreja d'àtoms d'or i de plata: menys densa que l'or pur." },
    notes: ["Aliatge ocult de la corona del rei Hieró"]
  }
};

/**
 * Obté la densitat d'un material segons si s'utilitzen nombres senzills (escolar) o de referència.
 * @param {string} materialId
 * @param {boolean} [nombresSenzills=true]
 * @returns {number}
 */
export function densitatMaterial(materialId, nombresSenzills = true) {
  const mat = MATERIALS[materialId];
  if (!mat) throw new Error(`Material desconegut: ${materialId}`);
  if (nombresSenzills) return mat.dEscolar;
  return mat.dReferencia ?? mat.dEscolar;
}
