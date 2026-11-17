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
    descripcio: "Metall lleuger però més dens que l'aigua"
  },
  {
    id: "ferro",
    nom: "Bloc de ferro",
    categoria: "metalls",
    forma: "bloc_ferro",
    massa: 393,
    volum: 50,
    descripcio: "Acer/ferro massís de 50 cm³"
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
    descripcio: "Extremadament dens (11,34 g/cm³)"
  },
  {
    id: "or",
    nom: "Lingot d'or",
    categoria: "metalls",
    forma: "lingot_or",
    massa: 965,
    volum: 50,
    descripcio: "Or pur de 24 quirats (19,30 g/cm³)"
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
    descripcio: "Roca volcànica porosa que sura!"
  },

  // Fustes i lleugers
  {
    id: "pi",
    nom: "Bloc de pi",
    categoria: "fustes",
    forma: "fusta_pi",
    massa: 100,
    volum: 200,
    descripcio: "Fusta habitual: meitat dins, meitat fora"
  },
  {
    id: "roure",
    nom: "Bloc de roure",
    categoria: "fustes",
    forma: "fusta_roure",
    massa: 150,
    volum: 200,
    descripcio: "Fusta densa, s'enfonsa un 75 % a l'aigua"
  },
  {
    id: "banus",
    nom: "Fusta de banús",
    categoria: "fustes",
    forma: "fusta_banus",
    massa: 240,
    volum: 200,
    descripcio: "Una fusta tropical que s'enfonsa a l'aigua!"
  },
  {
    id: "suro",
    nom: "Tap de suro",
    categoria: "fustes",
    forma: "tap_suro",
    massa: 15,
    volum: 60,
    descripcio: "Molt lleuger: només s'enfonsa un 25 %"
  },
  {
    id: "poliestire",
    nom: "Bloc de porexpan",
    categoria: "fustes",
    forma: "porexpan",
    massa: 10,
    volum: 200,
    descripcio: "Ple d'aire atrapat (0,05 g/cm³)"
  },
  {
    id: "gel",
    nom: "Glaçó de gel",
    categoria: "fustes",
    forma: "glaco",
    massa: 92,
    volum: 100,
    descripcio: "Sura amb el 92 % sota l'aigua (iceberg)"
  },
  {
    id: "espelma",
    nom: "Espelma de cera",
    categoria: "fustes",
    forma: "espelma",
    massa: 90,
    volum: 100,
    descripcio: "Parafina sòlida (0,90 g/cm³)"
  },

  // Quotidians i curiositats
  {
    id: "poma",
    nom: "Poma vermella",
    categoria: "quotidians",
    forma: "poma",
    massa: 140,
    volum: 175,
    descripcio: "Té aire entre les cèl·lules i sura"
  },
  {
    id: "ou",
    nom: "Ou fresc",
    categoria: "quotidians",
    forma: "ou",
    massa: 60,
    volum: 56,
    descripcio: "S'enfonsa a l'aigua dolça, sura en salmorra"
  },
  {
    id: "patata",
    nom: "Patata",
    categoria: "quotidians",
    forma: "patata",
    massa: 162,
    volum: 150,
    descripcio: "Densitat lleugerament superior a l'aigua"
  },
  {
    id: "llauna_normal",
    nom: "Llauna de refresc",
    categoria: "quotidians",
    forma: "llauna_normal",
    massa: 385,
    volum: 355,
    descripcio: "Amb sucre dissolt: més densa que l'aigua"
  },
  {
    id: "llauna_zero",
    nom: "Llauna Zero",
    categoria: "quotidians",
    forma: "llauna_zero",
    massa: 345,
    volum: 355,
    descripcio: "Sense sucre: menys densa que l'aigua i sura!"
  },
  {
    id: "plastilina",
    nom: "Bola de plastilina",
    categoria: "quotidians",
    forma: "plastilina",
    massa: 72,
    volum: 45,
    descripcio: "En bola compacta s'enfonsa (1,60 g/cm³)"
  },
  {
    id: "corona",
    nom: "Corona d'Arquimedes",
    categoria: "quotidians",
    forma: "corona",
    massa: 1000,
    volum: 85,
    descripcio: "És or pur (19,3) o té plata barrejada?"
  },
  {
    id: "anec",
    nom: "Ànec de goma",
    categoria: "quotidians",
    forma: "anec",
    massa: 45,
    volum: 100,
    descripcio: "Buit per dins: flota molt amunt"
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
