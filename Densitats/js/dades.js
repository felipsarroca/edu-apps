/* SPDX-License-Identifier: AGPL-3.0-or-later AND CC-BY-NC-SA-4.0 */
/**
 * Catàleg de líquids i objectes realistes per al simulador Densitats.
 */

export const LIQUIDS = [
  {
    id: "aigua",
    nom: "Aigua dolça",
    densitat: 1.00,
    colorTop: "rgba(125, 211, 252, 0.58)",
    colorBot: "rgba(14, 165, 233, 0.72)",
    meniscColor: "#38BDF8",
    nota: "Referència estàndard: 1,00 g/cm³"
  },
  {
    id: "aigua_mar",
    nom: "Aigua de mar",
    densitat: 1.03,
    colorTop: "rgba(56, 189, 248, 0.62)",
    colorBot: "rgba(2, 132, 199, 0.78)",
    meniscColor: "#0EA5E9",
    nota: "Més densa per la sal dissolta"
  },
  {
    id: "salmorra",
    nom: "Salmorra (aigua molt salada)",
    densitat: 1.20,
    colorTop: "rgba(45, 212, 191, 0.62)",
    colorBot: "rgba(13, 148, 136, 0.78)",
    meniscColor: "#14B8A6",
    nota: "Hi suren l'ou i la patata!"
  },
  {
    id: "oli",
    nom: "Oli d'oliva",
    densitat: 0.92,
    colorTop: "rgba(253, 224, 71, 0.68)",
    colorBot: "rgba(234, 179, 8, 0.82)",
    meniscColor: "#EAB308",
    nota: "Menys dens que l'aigua"
  },
  {
    id: "alcohol",
    nom: "Alcohol (etanol)",
    densitat: 0.79,
    colorTop: "rgba(196, 181, 253, 0.52)",
    colorBot: "rgba(139, 92, 246, 0.68)",
    meniscColor: "#A78BFA",
    nota: "El glaçó de gel s'hi enfonsa"
  },
  {
    id: "glicerina",
    nom: "Glicerina",
    densitat: 1.26,
    colorTop: "rgba(226, 232, 240, 0.68)",
    colorBot: "rgba(148, 163, 184, 0.78)",
    meniscColor: "#94A3B8",
    nota: "Líquid espès i força dens"
  },
  {
    id: "mercuri",
    nom: "Mercuri",
    densitat: 13.60,
    colorTop: "rgba(226, 232, 240, 0.92)",
    colorBot: "rgba(100, 116, 139, 0.97)",
    meniscColor: "#CBD5E1",
    nota: "Metall líquid: fins i tot el plom hi sura"
  },
  {
    id: "personalitzat",
    nom: "Líquid personalitzat",
    densitat: 1.00,
    colorTop: "rgba(103, 232, 249, 0.60)",
    colorBot: "rgba(6, 182, 212, 0.76)",
    meniscColor: "#06B6D4",
    nota: "Ajusta la densitat lliurement"
  }
];

export const CATEGORIES = [
  { id: "tots", nom: "Tots" },
  { id: "metalls", nom: "Metalls i pedres" },
  { id: "fustes", nom: "Fustes i lleugers" },
  { id: "quotidians", nom: "Quotidians" },
  { id: "personalitzat", nom: "Personalitzat" }
];

export const OBJECTES = [
  // Metalls i pedres
  {
    id: "alumini",
    nom: "Bloc d'alumini",
    categoria: "metalls",
    forma: "bloc",
    massa: 270,
    volum: 100,
    descripcio: "Metall lleuger i resistent"
  },
  {
    id: "ferro",
    nom: "Bloc de ferro",
    categoria: "metalls",
    forma: "bloc_ferro",
    massa: 393,
    volum: 50,
    descripcio: "Ferro massís, gris fosc"
  },
  {
    id: "coure",
    nom: "Cilindre de coure",
    categoria: "metalls",
    forma: "cilindre_coure",
    massa: 448,
    volum: 50,
    descripcio: "Metall vermellós molt dens"
  },
  {
    id: "plom",
    nom: "Pes de plom",
    categoria: "metalls",
    forma: "pes_plom",
    massa: 567,
    volum: 50,
    descripcio: "Metall gris, tou i molt pesant"
  },
  {
    id: "or",
    nom: "Lingot d'or",
    categoria: "metalls",
    forma: "lingot_or",
    massa: 965,
    volum: 50,
    descripcio: "Or pur de 24 quirats"
  },
  {
    id: "bola_acer",
    nom: "Bola d'acer",
    categoria: "metalls",
    forma: "esfera_acer",
    massa: 314,
    volum: 40,
    descripcio: "Esfera polida d'acer massís"
  },
  {
    id: "granit",
    nom: "Pedra de granit",
    categoria: "metalls",
    forma: "pedra_granit",
    massa: 216,
    volum: 80,
    descripcio: "Roca compacta sense porus"
  },
  {
    id: "pedra_tosca",
    nom: "Pedra tosca",
    categoria: "metalls",
    forma: "pedra_tosca",
    massa: 48,
    volum: 80,
    descripcio: "Roca volcànica plena de porus"
  },

  // Fustes i lleugers
  {
    id: "pi",
    nom: "Bloc de pi",
    categoria: "fustes",
    forma: "fusta_pi",
    massa: 100,
    volum: 200,
    descripcio: "Fusta clara de pi"
  },
  {
    id: "roure",
    nom: "Bloc de roure",
    categoria: "fustes",
    forma: "fusta_roure",
    massa: 150,
    volum: 200,
    descripcio: "Fusta dura i compacta"
  },
  {
    id: "banus",
    nom: "Fusta de banús",
    categoria: "fustes",
    forma: "fusta_banus",
    massa: 240,
    volum: 200,
    descripcio: "Fusta tropical fosca i molt dura"
  },
  {
    id: "suro",
    nom: "Tap de suro",
    categoria: "fustes",
    forma: "tap_suro",
    massa: 15,
    volum: 60,
    descripcio: "Escorça d'alzina surera"
  },
  {
    id: "poliestire",
    nom: "Bloc de porexpan",
    categoria: "fustes",
    forma: "porexpan",
    massa: 10,
    volum: 200,
    descripcio: "Ple de bombolles d'aire"
  },
  {
    id: "gel",
    nom: "Glaçó de gel",
    categoria: "fustes",
    forma: "glaco",
    massa: 92,
    volum: 100,
    descripcio: "Aigua sòlida, com un petit iceberg"
  },
  {
    id: "espelma",
    nom: "Espelma de cera",
    categoria: "fustes",
    forma: "espelma",
    massa: 90,
    volum: 100,
    descripcio: "Parafina sòlida"
  },

  // Quotidians i curiositats
  {
    id: "poma",
    nom: "Poma vermella",
    categoria: "quotidians",
    forma: "poma",
    massa: 140,
    volum: 175,
    descripcio: "Té aire entre les cèl·lules"
  },
  {
    id: "ou",
    nom: "Ou fresc",
    categoria: "quotidians",
    forma: "ou",
    massa: 60,
    volum: 56,
    descripcio: "Sura o s'enfonsa? Depèn del líquid"
  },
  {
    id: "patata",
    nom: "Patata",
    categoria: "quotidians",
    forma: "patata",
    massa: 162,
    volum: 150,
    descripcio: "Tubercle ple d'aigua i midó"
  },
  {
    id: "llauna_normal",
    nom: "Llauna de refresc",
    categoria: "quotidians",
    forma: "llauna_normal",
    massa: 385,
    volum: 355,
    descripcio: "Refresc amb molt sucre dissolt"
  },
  {
    id: "llauna_zero",
    nom: "Llauna Zero",
    categoria: "quotidians",
    forma: "llauna_zero",
    massa: 345,
    volum: 355,
    descripcio: "El mateix refresc, sense sucre"
  },
  {
    id: "plastilina",
    nom: "Bola de plastilina",
    categoria: "quotidians",
    forma: "plastilina",
    massa: 72,
    volum: 45,
    descripcio: "Plastilina en bola compacta"
  },
  {
    id: "corona",
    nom: "Corona d'Arquimedes",
    categoria: "quotidians",
    forma: "corona",
    massa: 1000,
    volum: 85,
    descripcio: "És d'or pur o té plata barrejada?"
  },
  {
    id: "anec",
    nom: "Ànec de goma",
    categoria: "quotidians",
    forma: "anec",
    massa: 45,
    volum: 100,
    descripcio: "Buit per dins"
  },
  {
    id: "pilota_tennis",
    nom: "Pilota de tennis",
    categoria: "quotidians",
    forma: "pilota_tennis",
    massa: 58,
    volum: 140,
    descripcio: "Cambra d'aire interior"
  }
];

export const MATERIALS_PERSONALITZATS = [
  { id: "fusta", nom: "Fusta", densitatTipica: 0.55 },
  { id: "plastic", nom: "Plàstic", densitatTipica: 0.95 },
  { id: "alumini", nom: "Alumini", densitatTipica: 2.70 },
  { id: "ferro", nom: "Ferro", densitatTipica: 7.86 },
  { id: "or", nom: "Or", densitatTipica: 19.30 },
  { id: "lliure", nom: "Lliure", densitatTipica: 1.00 }
];

/**
 * Experiments preparats per a l'ajuda: un toc configura líquid, objecte i mode del tanc.
 */
export const EXPERIMENTS = [
  {
    id: "ou",
    titol: "Sura l'ou?",
    objecte: "ou",
    liquid: "aigua",
    mode: "lliure",
    pregunta: "A l'aigua dolça s'enfonsa. Què passarà si canviem a salmorra?",
    passos: "Deixa'l caure i després canvia el líquid a «Salmorra»."
  },
  {
    id: "llaunes",
    titol: "Llauna normal o Zero?",
    objecte: "llauna_normal",
    liquid: "aigua",
    mode: "lliure",
    pregunta: "Les dues llaunes tenen el mateix volum. Per què només una sura?",
    passos: "Observa la normal i després prova la Zero."
  },
  {
    id: "corona",
    titol: "La corona és d'or pur?",
    objecte: "corona",
    liquid: "aigua",
    mode: "dinamometre",
    immersio: 100,
    pregunta: "L'or pur té una densitat de 19,3 g/cm³. La corona, quina en té?",
    passos: "Mesura m a la balança i V a la proveta. Calcula ρ = m / V."
  },
  {
    id: "gel",
    titol: "El glaçó a l'alcohol",
    objecte: "gel",
    liquid: "alcohol",
    mode: "lliure",
    pregunta: "A l'aigua el gel sura. I a l'alcohol?",
    passos: "Deixa'l caure i compara-ho amb l'aigua dolça."
  },
  {
    id: "pes-aparent",
    titol: "El pes aparent",
    objecte: "alumini",
    liquid: "aigua",
    mode: "dinamometre",
    immersio: 0,
    pregunta: "Per què el dinamòmetre marca menys quan el bloc és dins l'aigua?",
    passos: "Mou el control d'immersió de 0 % a 100 % i mira el dinamòmetre."
  },
  {
    id: "iceberg",
    titol: "Un petit iceberg",
    objecte: "gel",
    liquid: "aigua_mar",
    mode: "lliure",
    pregunta: "Quina part del glaçó queda sota l'aigua de mar?",
    passos: "Deixa'l caure i compara el volum submergit amb el volum total."
  },
  {
    id: "mercuri",
    titol: "El plom pot surar?",
    objecte: "plom",
    liquid: "mercuri",
    mode: "lliure",
    pregunta: "El plom s'enfonsa a l'aigua. Què passa en mercuri?",
    passos: "Deixa'l caure i després prova el lingot d'or."
  },
  {
    id: "pedra",
    titol: "Densitat d'una pedra",
    objecte: "granit",
    liquid: "aigua",
    mode: "dinamometre",
    immersio: 100,
    pregunta: "Quina és la densitat del granit?",
    passos: "Massa a la balança, volum a la proveta (Vf − V₀), i calcula ρ = m / V."
  }
];
