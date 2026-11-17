/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Catàleg unificat de les 51 investigacions (blocs A a G), les 12 targetes de repte
 * i el banc d'ítems de control i diagnosi adaptativa bayesiana.
 */

import { BLOC_A, BLOC_B } from "./bloc-a-b.js";
import { BLOC_C } from "./bloc-c.js";
import { BLOC_D } from "./bloc-d.js";
import { BLOC_E } from "./bloc-e.js";
import { BLOC_F, BLOC_G } from "./bloc-f-g.js";

export const BLOCS = [
  {
    id: "A",
    titol: "Matèria i mesura",
    subtitol: "Massa, volum, balança, tara, proveta, menisc i desplaçament",
    nivellPrincipal: "1r–2n",
    fase: "1"
  },
  {
    id: "B",
    titol: "Unitats i equivalències",
    subtitol: "Escales de massa, capacitat, volum i unitats de la densitat",
    nivellPrincipal: "1r–3r",
    fase: "1"
  },
  {
    id: "C",
    titol: "La densitat",
    subtitol: "Concepte, càlcul, propietat intensiva, gràfica massa-volum i identificació",
    nivellPrincipal: "2n–3r",
    fase: "1"
  },
  {
    id: "D",
    titol: "Flotabilitat",
    subtitol: "Què sura i què s'enfonsa, columna de líquids, aigua salada i fracció submergida",
    nivellPrincipal: "2n–3r",
    fase: "1 i 2"
  },
  {
    id: "E",
    titol: "Forces i Arquimedes",
    subtitol: "Pes aparent, líquid desplaçat, principi d'Arquimedes i diagrama de forces",
    nivellPrincipal: "4t",
    fase: "2"
  },
  {
    id: "F",
    titol: "Construïm i apliquem",
    subtitol: "Barques, drassana, vaixells d'acer, submarí, iceberg, corona, globus i densímetre",
    nivellPrincipal: "2n–4t",
    fase: "3 i 4"
  },
  {
    id: "G",
    titol: "Pressió i hidrostàtica",
    subtitol: "Pressió i profunditat, paradoxa hidrostàtica i origen microscòpic de l'empenyiment",
    nivellPrincipal: "4t",
    fase: "4"
  }
];

export const INVESTIGACIONS_LLISTA = [
  ...BLOC_A,
  ...BLOC_B,
  ...BLOC_C,
  ...BLOC_D,
  ...BLOC_E,
  ...BLOC_F,
  ...BLOC_G
];

export const INVESTIGACIONS = Object.fromEntries(
  INVESTIGACIONS_LLISTA.map(inv => [inv.id, inv])
);

/**
 * Ruta recomanada per començar: les nou investigacions essencials, en ordre.
 */
export const RUTA_RECOMANADA = ["A7", "C3", "C4", "C6", "D1", "D2", "D3", "D4", "D5"];

/**
 * Proposa la investigació següent: primer la ruta recomanada i després la resta del catàleg, saltant les ja fetes.
 * @param {string[]} fetes Ids de les investigacions completades
 * @param {string} [actualId] Investigació que s'acaba de fer (es descarta com a proposta)
 * @returns {object|null}
 */
export function seguentInvestigacio(fetes = [], actualId = "") {
  const pendent = id => id !== actualId && !fetes.includes(id);
  const idRuta = RUTA_RECOMANADA.find(pendent);
  if (idRuta) return INVESTIGACIONS[idRuta];
  const idxActual = INVESTIGACIONS_LLISTA.findIndex(i => i.id === actualId);
  const ordenades = [
    ...INVESTIGACIONS_LLISTA.slice(idxActual + 1),
    ...INVESTIGACIONS_LLISTA.slice(0, Math.max(0, idxActual))
  ];
  return ordenades.find(i => pendent(i.id)) || null;
}

/**
 * Tradueix els nivells d'una investigació a una dificultat entenedora.
 * @param {number[]} nivells
 * @returns {{text: string, grau: number}}
 */
export function dificultatInvestigacio(nivells = [1]) {
  const max = Math.max(...nivells);
  if (max <= 1) return { text: "Fàcil", grau: 1 };
  if (max === 2) return { text: "Mitjana", grau: 2 };
  return { text: "Avançada", grau: 3 };
}

/**
 * Targetes de repte per al laboratori lliure (06-cataleg-investigacions-2.md).
 */
export const REPTES = [
  {
    id: "R1",
    num: 1,
    titol: "Troba dos objectes de la mateixa massa i volum diferent",
    descripcio: "Busca al prestatge dues peces que marquin el mateix a la balança però ocupin volums diferents (per exemple, E2 i E3 de 30 g, o dues peces d'1 kg).",
    taula: "mesura",
    nivell: 1,
    fase: 1
  },
  {
    id: "R2",
    num: 2,
    titol: "Ordena cinc objectes per densitat sense calcular res",
    descripcio: "Fes servir els cubs bessons de 10 cm³ o la columna de líquids per ordenar cinc materials de menys dens a més dens sense fer cap divisió.",
    taula: "columna",
    nivell: 1,
    fase: 1
  },
  {
    id: "R3",
    num: 3,
    titol: "Fabrica un objecte de 300 g que suri",
    descripcio: "Utilitza el constructor d'objectes del Taller per crear un bloc massís de 300 g que suri a l'aigua dolça (haurà de tenir un volum superior a 300 cm³).",
    taula: "taller",
    nivell: 2,
    fase: 1
  },
  {
    id: "R4",
    num: 4,
    titol: "Mesura el volum del tap de suro amb un error inferior a 1 cm³",
    descripcio: "Tria la proveta més estreta on hi càpiga el tap de suro (20 cm³, diàmetre 2,2 cm), enfonsa'l amb la vareta i llegeix el menisc amb la lupa.",
    taula: "mesura",
    nivell: 2,
    fase: 1
  },
  {
    id: "R5",
    num: 5,
    titol: "Descobreix quin dels sis objectes misteri és de plom",
    descripcio: "Identifica quin dels objectes M1 a M6 està fet de plom (11,30 g/cm³) i comprova-ho amb el verificador de detectius.",
    taula: "mesura",
    nivell: 2,
    fase: 1
  },
  {
    id: "R6",
    num: 6,
    titol: "Fes una columna de quatre capes i col·loca una bola a cada frontera",
    descripcio: "Aboca amb cura mel, aigua, oli i alcohol a la columna i situa-hi les boles B1 a B5 a cada interfície.",
    taula: "columna",
    nivell: 2,
    fase: 2
  },
  {
    id: "R7",
    num: 7,
    titol: "Aconsegueix que l'espelma quedi suspesa entre dos líquids",
    descripcio: "L'espelma de cera té densitat 0,90 g/cm³. Prepara una columna amb alcohol (0,79) i oli (0,92) o aigua (1,00) perquè quedi suspesa a la frontera.",
    taula: "columna",
    nivell: 2,
    fase: 2
  },
  {
    id: "R8",
    num: 8,
    titol: "Prepara un líquid on el niló suri",
    descripcio: "El dau de niló té densitat 1,15 g/cm³ i s'enfonsa a l'aigua dolça. Afegeix prou cullerades de sal fins que l'aigua salada superi 1,15 g/cm³.",
    taula: "columna",
    nivell: 2,
    fase: 2
  },
  {
    id: "R9",
    num: 9,
    titol: "Troba el volum d'un objecte fent servir només el dinamòmetre",
    descripcio: "Mesura el pes a l'aire (P) i el pes aparent en aigua (Pa) d'un objecte al Tanc: com que E = P − Pa = dL · g · V, divideix E (en N) per 0,0098 N/cm³!",
    taula: "tanc",
    nivell: 3,
    fase: 2
  },
  {
    id: "R10",
    num: 10,
    titol: "Fes surar 500 g d'acer",
    descripcio: "Al Taller, conforma la planxa d'acer de 500 g en un buc d'almenys 501 cm³ de volum envoltant i comprova al Tanc que sura.",
    taula: "taller",
    nivell: 3,
    fase: 3
  },
  {
    id: "R11",
    num: 11,
    titol: "Carrega 450 g en una barca de 200 g de plastilina",
    descripcio: "Dissenya un buc amb 200 g de plastilina de volum envoltant superior a 650 cm³ (sense que la paret baixi de 0,15 cm) i carrega-hi 450 g al Tanc.",
    taula: "taller",
    nivell: 3,
    fase: 3
  },
  {
    id: "R12",
    num: 12,
    titol: "Mantén el submarí a mitja alçada en equilibri neutre",
    descripcio: "Regula el tanc de llast del submarí (300 cm³ en aigua dolça o 330 g en aigua de mar) perquè la seva densitat mitjana iguali la del líquid.",
    taula: "tanc",
    nivell: 2,
    fase: 3
  }
];

/**
 * Preguntes de control i banc diagnòstic bayesià (07-guia-quadern-i-avaluacio.md §10 i especificació v2.6).
 * Cada ítem té dificultat `b` a l'interval [-1, +1] (per a n = 3 nivells amb theta in {-2, 0, +2}),
 * nombre d'opcions `m = 3`, categoria/dimensió i factor d'error diagnosticat.
 */
export const BANC_DIAGNOSTIC_BAYESIA = [
  {
    id: "Q1",
    categoria: "conceptual",
    dificultat: -0.8,
    m: 3,
    idea: "IP-03",
    enunciat: "Si talles una barra homogènia de ferro exactament per la meitat, com serà la densitat de cada tros?",
    opcions: [
      { id: "a", text: "La meitat de la densitat original, perquè hi ha la meitat de ferro", distractorIdea: "IP-03" },
      { id: "b", text: "Exactament la mateixa densitat, perquè massa i volum es redueixen en la mateixa proporció", correcta: true },
      { id: "c", text: "El doble de densitat, perquè el tros és més petit", distractorIdea: "IP-02" }
    ],
    explicacio: "La densitat és una propietat intensiva del material (d = m / V): en tallar per la meitat, la massa es divideix per 2 i el volum també es divideix per 2, de manera que el quocient no canvia."
  },
  {
    id: "Q2",
    categoria: "conceptual",
    dificultat: -0.5,
    m: 3,
    idea: "IP-01",
    enunciat: "Un tronc de fusta de 2 kg sura a l'aigua, i en canvi una agulla d'acer de 2 g s'hi enfonsa. Com s'explica?",
    opcions: [
      { id: "a", text: "Perquè la fusta té una densitat menor que l'aigua (0,5 g/cm³) i l'acer té una densitat major (7,85 g/cm³)", correcta: true },
      { id: "b", text: "És impossible: l'objecte de 2 kg s'ha d'enfonsar perquè pesa mil vegades més", distractorIdea: "IP-01" },
      { id: "c", text: "Perquè els objectes grans sempre suren millor que els petits", distractorIdea: "IP-02" }
    ],
    explicacio: "La flotació d'un cos massís depèn de la seva densitat comparada amb la del líquid, no de la seva massa total sola."
  },
  {
    id: "Q3",
    categoria: "procediment",
    dificultat: -0.3,
    m: 3,
    idea: "IP-10",
    enunciat: "Tenim dos cilindres massissos de la mateixa mida (20 cm³): un d'alumini (54 g) i un de plom (226 g). Si els submergim del tot en dues provetes idèntiques amb aigua, quin farà pujar més el nivell?",
    opcions: [
      { id: "a", text: "El de plom farà pujar l'aigua quatre vegades més perquè pesa quatre vegades més", distractorIdea: "IP-10" },
      { id: "b", text: "Tots dos faran pujar el nivell exactament 20 mL, perquè tenen el mateix volum", correcta: true },
      { id: "c", text: "El d'alumini farà pujar més l'aigua perquè és més lleuger", distractorIdea: "IP-04" }
    ],
    explicacio: "Un objecte totalment submergit desplaça un volum de líquid idèntic al seu propi volum exterior (20 cm³ = 20 mL), independentment de la seva massa."
  },
  {
    id: "Q4",
    categoria: "matematica",
    dificultat: -0.2,
    m: 3,
    idea: "IP-06",
    enunciat: "Tenim una ampolla amb 1 L d'oli d'oliva (d = 0,92 g/mL) i una altra amb 1 L d'aigua (d = 1,00 g/mL). Tenen la mateixa massa?",
    opcions: [
      { id: "a", text: "Sí, totes dues tenen 1 kg de massa perquè 1 litre sempre és 1 quilo", distractorIdea: "IP-06" },
      { id: "b", text: "No: 1 L d'aigua té una massa de 1000 g i 1 L d'oli té una massa de 920 g", correcta: true },
      { id: "c", text: "No: 1 L d'oli pesa més que 1 L d'aigua perquè l'oli és més espès", distractorIdea: "IP-16" }
    ],
    explicacio: "El litre és una unitat de volum (1000 mL). La massa d'1 L depèn de la densitat de cada líquid: m = d · V."
  },
  {
    id: "Q5",
    categoria: "procediment",
    dificultat: 0.1,
    m: 3,
    idea: "EP-04",
    enunciat: "Volem mesurar el volum total d'un tap de suro (que sura) fent servir una proveta amb aigua. Com ho hem de fer?",
    opcions: [
      { id: "a", text: "Deixar-lo surant a l'aigua i restar el nivell final menys l'inicial", distractorIdea: "EP-04" },
      { id: "b", text: "Anotar el nivell inicial, enfonsar el tap del tot sota l'aigua amb una vareta fina i anotar el nivell final", correcta: true },
      { id: "c", text: "Pesar-lo a la balança, perquè els grams ja són els centímetres cúbics", distractorIdea: "IP-04" }
    ],
    explicacio: "Mentre sura, el tap només desplaça el volum de la part submergida. Per mesurar tot el seu volum per desplaçament cal submergir-lo completament."
  },
  {
    id: "Q6",
    categoria: "raonament",
    dificultat: 0.3,
    m: 3,
    idea: "IP-01",
    enunciat: "Un objecte massís té una massa de 240 g i un volum de 80 cm³. Què farà quan el deixem anar dins d'aigua (d = 1,00 g/cm³)?",
    opcions: [
      { id: "a", text: "S'enfonsarà, perquè la seva densitat és de 3,0 g/cm³ (superior a 1,00 g/cm³)", correcta: true },
      { id: "b", text: "Surarà, perquè la seva densitat és 80 ÷ 240 = 0,33 g/cm³", distractorIdea: "EM-01" },
      { id: "c", text: "Surarà, perquè 240 g és menys d'un quilo", distractorIdea: "IP-01" }
    ],
    explicacio: "La densitat és d = m / V = 240 g / 80 cm³ = 3,0 g/cm³. Com que és major que la de l'aigua (1,00 g/cm³), s'enfonsa."
  },
  {
    id: "Q7",
    categoria: "conceptual",
    dificultat: 0.5,
    m: 3,
    idea: "IP-11",
    enunciat: "Un bloc d'alumini de 100 cm³ pesa 2,65 N a l'aire i s'enfonsa a l'aigua. Quan està penjat d'un dinamòmetre totalment submergit en aigua, què marca el dinamòmetre?",
    opcions: [
      { id: "a", text: "Marca 2,65 N, perquè com que l'alumini s'enfonsa l'aigua no l'empeny cap amunt", distractorIdea: "IP-11" },
      { id: "b", text: "Marca 1,67 N, perquè l'aigua l'empeny cap amunt amb una força de 0,98 N (el pes dels 100 g d'aigua desplaçada)", correcta: true },
      { id: "c", text: "Marca 0 N, perquè dins de l'aigua els objectes no tenen pes", distractorIdea: "IP-07" }
    ],
    explicacio: "Segons el principi d'Arquimedes, tot cos submergit rep un empenyiment cap amunt igual al pes del líquid desplaçat (100 g d'aigua pesen 0,98 N), encara que s'enfonsi."
  },
  {
    id: "Q8",
    categoria: "raonament",
    dificultat: 0.7,
    m: 3,
    idea: "IP-12",
    enunciat: "Un bloc metàl·lic ja està totalment submergit a 10 cm de profunditat dins d'un tanc d'aigua. Si el baixem fins a 40 cm de profunditat, com canvia l'empenyiment?",
    opcions: [
      { id: "a", text: "Es multiplica per quatre, perquè a 40 cm hi ha quatre vegades més pressió", distractorIdea: "IP-12" },
      { id: "b", text: "No canvia: la pressió creix tant a la cara superior com a la inferior, però la diferència de forces (l'empenyiment) es manté constant", correcta: true },
      { id: "c", text: "Disminueix, perquè l'aigua de dalt l'aixafa cap al fons", distractorIdea: "IP-12" }
    ],
    explicacio: "Un cop el cos està totalment submergit, el volum d'aigua desplaçat ja no canvia amb la profunditat i l'empenyiment E = dL · g · V es manté constant."
  },
  {
    id: "Q9",
    categoria: "matematica",
    dificultat: 0.85,
    m: 3,
    idea: "EM-04",
    enunciat: "L'oli d'oliva té una densitat de 0,92 g/cm³. Quin valor té aquesta densitat en el Sistema Internacional (kg/m³)?",
    opcions: [
      { id: "a", text: "920 kg/m³", correcta: true },
      { id: "b", text: "0,00092 kg/m³", distractorIdea: "EM-04" },
      { id: "c", text: "92 kg/m³", distractorIdea: "EM-03" }
    ],
    explicacio: "1 g/cm³ equival a 1000 kg/m³, perquè en 1 m³ hi ha 1 000 000 cm³ i 1 kg són 1000 g. Per tant, 0,92 × 1000 = 920 kg/m³."
  },
  {
    id: "Q10",
    categoria: "raonament",
    dificultat: 0.95,
    m: 3,
    idea: "IP-18",
    enunciat: "Amb 200 g de plastilina (d = 1,50 g/cm³) construïm una barca rectangular de 12 cm × 10 cm × 5 cm (volum envoltant fins a la vora de 600 cm³). Quina càrrega màxima pot transportar en aigua dolça (1,00 g/cm³) abans d'inundar-se?",
    opcions: [
      { id: "a", text: "400 g de càrrega, perquè el buc pot desplaçar fins a 600 g d'aigua i la barca ja pesa 200 g", correcta: true },
      { id: "b", text: "600 g de càrrega, perquè el seu volum és de 600 cm³", distractorIdea: "IP-18" },
      { id: "c", text: "Cap càrrega: s'enfonsarà fins i tot buida perquè la plastilina és més densa que l'aigua", distractorIdea: "IP-18" }
    ],
    explicacio: "El buc pot desplaçar com a màxim 600 cm³ d'aigua (600 g). Descomptant els 200 g de la pròpia barca, admet fins a 400 g de càrrega."
  }
];
