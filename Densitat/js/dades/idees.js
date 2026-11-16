/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Catàleg d'idees prèvies (IP), errors de procediment (EP), errors matemàtics (EM)
 * i simplificacions declarades del model físic (S).
 */

export const IDEES_PREVIES = {
  "IP-01": {
    codi: "IP-01",
    enunciat: "El que pesa molt s'enfonsa i el que pesa poc sura.",
    contrast: "Compara un tauló de fusta de 2 kg o el bloc B (100 g) que suren amb un clau de ferro de 15,7 g que s'enfonsa.",
    investigacions: ["D1", "D2"],
    prior: 0.35
  },
  "IP-02": {
    codi: "IP-02",
    enunciat: "Els objectes grans són més densos o s'enfonsen més fàcilment.",
    contrast: "Mesura dues peces del mateix material i mida diferent: la densitat i la flotació es mantenen.",
    investigacions: ["C4", "D2"],
    prior: 0.30
  },
  "IP-03": {
    codi: "IP-03",
    enunciat: "Si tallo un objecte per la meitat, la seva densitat es redueix a la meitat.",
    contrast: "Mesura la patata sencera (160 cm³), la meitat (80 cm³) i el quart (40 cm³): totes donen 1,08 g/cm³.",
    investigacions: ["C4"],
    prior: 0.35
  },
  "IP-04": {
    codi: "IP-04",
    enunciat: "La densitat és el mateix que la massa.",
    contrast: "Compara objectes de la mateixa massa (1 kg) i volums diferents, o cubs bessons del mateix volum i masses diferents.",
    investigacions: ["C1", "C2", "C3"],
    prior: 0.30
  },
  "IP-05": {
    codi: "IP-05",
    enunciat: "Canviar la forma d'un objecte massís canvia la densitat del material.",
    contrast: "Modela 200 g de plastilina en bola, cilindre, bloc i plat compacte: manté 200 g i 133,3 cm³.",
    investigacions: ["C8"],
    prior: 0.25
  },
  "IP-06": {
    codi: "IP-06",
    enunciat: "Un litre de qualsevol líquid sempre té una massa d'un quilogram.",
    contrast: "Pesa 1 L d'aigua (1000 g), d'oli (920 g), d'alcohol (790 g), de llet (1030 g) i de mel (1420 g).",
    investigacions: ["A1", "B3"],
    prior: 0.30
  },
  "IP-07": {
    codi: "IP-07",
    enunciat: "Massa i pes són el mateix.",
    contrast: "Compara la balança de braços i el dinamòmetre a la Terra (9,8 N/kg), la Lluna (1,6 N/kg) i Mart (3,7 N/kg).",
    investigacions: ["A4", "E7"],
    prior: 0.30
  },
  "IP-08": {
    codi: "IP-08",
    enunciat: "Volum i capacitat són coses independents, o d'un graó de volum a l'altre es multiplica per 10.",
    contrast: "Omple un cub d'1 dm d'aresta amb 1000 cubets d'1 cm³ i amb 1 L d'aigua.",
    investigacions: ["B1", "B2"],
    prior: 0.35
  },
  "IP-09": {
    codi: "IP-09",
    enunciat: "L'aire no ocupa espai ni té massa.",
    contrast: "Enfonsa un got cap per avall amb un paper sec i pesa una pilota abans i després d'inflar-la a pressió.",
    investigacions: ["A2", "F9"],
    prior: 0.25
  },
  "IP-10": {
    codi: "IP-10",
    enunciat: "Com més pesa un objecte submergit, més fa pujar el nivell de l'aigua.",
    contrast: "Submergeix els cilindres bessons d'alumini (54 g) i de plom (226 g): tots dos fan pujar la proveta 20 mL.",
    investigacions: ["A7", "E2"],
    prior: 0.35
  },
  "IP-11": {
    codi: "IP-11",
    enunciat: "L'aigua no empeny cap amunt els objectes que s'enfonsen.",
    contrast: "Penja el bloc metàl·lic A del dinamòmetre: fora de l'aigua marca 2,65 N i a dins marca 1,67 N.",
    investigacions: ["E1", "E6"],
    prior: 0.30
  },
  "IP-12": {
    codi: "IP-12",
    enunciat: "Com més avall està un objecte ja submergit, més empenyiment rep.",
    contrast: "Baixa el bloc submergit de 10 cm a 40 cm de profunditat: el dinamòmetre continua marcant exactament el mateix.",
    investigacions: ["E5", "G3"],
    prior: 0.30
  },
  "IP-13": {
    codi: "IP-13",
    enunciat: "L'empenyiment depèn de la massa o del material de l'objecte submergit.",
    contrast: "Tres esferes de 50 cm³ de plastilina, ceràmica i acer reben el mateix empenyiment: 0,49 N.",
    investigacions: ["E3", "E5"],
    prior: 0.30
  },
  "IP-14": {
    codi: "IP-14",
    enunciat: "Un objecte que sura queda tot per sobre de l'aigua i no en desplaça.",
    contrast: "Observa la fracció submergida de la fusta de pi (50 %), del gel (92 %) i mesura l'aigua desplaçada.",
    investigacions: ["D6", "E2", "E4", "F6"],
    prior: 0.25
  },
  "IP-15": {
    codi: "IP-15",
    enunciat: "Si un objecte està quiet dins l'aigua, no hi actua cap força.",
    contrast: "Activa el diagrama de forces: el pes cap avall i l'empenyiment cap amunt són iguals i oposats.",
    investigacions: ["D8", "E6", "F5"],
    prior: 0.25
  },
  "IP-16": {
    codi: "IP-16",
    enunciat: "Els líquids de densitat diferent sempre fan capes, o el líquid més espès és sempre el més dens.",
    contrast: "L'aigua i l'alcohol es mesclen en remenar; l'oli és més espès que l'aigua però sura a sobre.",
    investigacions: ["D3", "D7"],
    prior: 0.25
  },
  "IP-17": {
    codi: "IP-17",
    enunciat: "Surar depèn només de l'objecte, o amb més quantitat d'aigua un objecte sura millor.",
    contrast: "Prova l'espelma en aigua i en alcohol, o l'ou en aigua dolça i en aigua salada.",
    investigacions: ["D4", "D5"],
    prior: 0.25
  },
  "IP-18": {
    codi: "IP-18",
    enunciat: "El metall sempre s'enfonsa, o els vaixells suren perquè tenen motor.",
    contrast: "Compara un bloc massís d'acer de 500 g amb un buc d'acer de 500 g que desplaça fins a 720 cm³ d'aigua.",
    investigacions: ["F1", "F2", "F3", "F4"],
    prior: 0.30
  },
  "IP-19": {
    codi: "IP-19",
    enunciat: "Tot objecte buit per dins sura.",
    contrast: "Compara dues boles buides d'acer de 100 cm³: la de 60 g sura, però la de parets gruixudes (300 g) s'enfonsa.",
    investigacions: ["F4"],
    prior: 0.20
  },
  "IP-20": {
    codi: "IP-20",
    enunciat: "La pressió al fons depèn de l'amplada del recipient o del total d'aigua que conté.",
    contrast: "Mesura amb la sonda a la mateixa profunditat en recipients amples, estrets i cònics: la pressió és idèntica.",
    investigacions: ["G2"],
    prior: 0.25
  }
};

export const ERRORS_PROCEDIMENT = {
  "EP-01": {
    codi: "EP-01",
    nom: "No tarar el recipient",
    missatge: "Aquesta massa inclou el vas. Com la pots descomptar?"
  },
  "EP-02": {
    codi: "EP-02",
    nom: "Llegir el menisc per dalt",
    missatge: "Mira la part més baixa de la corba del menisc."
  },
  "EP-03": {
    codi: "EP-03",
    nom: "Llegir amb la vista desviada (paral·laxi)",
    missatge: "Posa l'ull a l'altura de la superfície del líquid."
  },
  "EP-04": {
    codi: "EP-04",
    nom: "Mesurar per desplaçament un objecte que sura sense enfonsar-lo",
    missatge: "Una part de l'objecte és fora de l'aigua. Quin volum has mesurat?"
  },
  "EP-05": {
    codi: "EP-05",
    nom: "Triar una proveta inadequada",
    missatge: "Prova amb una proveta que s'ajusti millor a la mida de l'objecte."
  },
  "EP-06": {
    codi: "EP-06",
    nom: "L'objecte no queda cobert pel líquid",
    missatge: "Cal prou líquid per cobrir l'objecte del tot."
  },
  "EP-07": {
    codi: "EP-07",
    nom: "No posar la balança a zero",
    missatge: "Què marca la balança quan està buida?"
  }
};

export const ERRORS_MATEMATICS = {
  "EM-01": {
    codi: "EM-01",
    nom: "Invertir el quocient (V / m)",
    missatge: "Has calculat quant espai ocupa cada gram. La densitat és la massa de cada centímetre cúbic."
  },
  "EM-02": {
    codi: "EM-02",
    nom: "Barrejar unitats incoherents",
    missatge: "Quines unitats té cada dada que has fet servir?"
  },
  "EM-03": {
    codi: "EM-03",
    nom: "Factor de conversió de volum erroni (10 o 100 en lloc de 1000)",
    missatge: "Cada graó de l'escala de volum val 1000."
  },
  "EM-04": {
    codi: "EM-04",
    nom: "Convertir malament g/cm³ i kg/m³",
    missatge: "Recorda que 1 g/cm³ equival a 1000 kg/m³."
  },
  "EM-05": {
    codi: "EM-05",
    nom: "Resultat sense unitat",
    missatge: "Un número sense unitat no és una mesura."
  },
  "EM-06": {
    codi: "EM-06",
    nom: "Confondre massa i pes en una força",
    missatge: "El pes és una força: multiplica la massa en quilograms per g."
  },
  "EM-07": {
    codi: "EM-07",
    nom: "No passar cm³ a m³ a E = dL · g · V",
    missatge: "La densitat està en kg/m³. En quina unitat ha d'estar el volum?"
  },
  "EM-08": {
    codi: "EM-08",
    nom: "Massa xifres decimals per a la resolució de l'instrument",
    missatge: "L'instrument no pot donar tanta precisió."
  }
};

export const SIMPLIFICACIONS = [
  { codi: "S1", titol: "Densitat de l'aigua", descripcio: "Amb «nombres senzills» l'aigua té densitat 1,00 g/cm³. En realitat val 0,998 g/cm³ a 20 °C i depèn de la temperatura (investigació F10)." },
  { codi: "S2", titol: "Un litre d'aigua i un quilogram", descripcio: "L'equivalència de volum 1 dm³ = 1 L és exacta per definició; que 1 L d'aigua tingui una massa d'1 kg és una aproximació pràctica." },
  { codi: "S3", titol: "Efecte de l'aire en les pesades", descripcio: "L'empenyiment de l'aire ambient (1,2 kg/m³) no es descompta a les balances, excepte en estudiar gasos i globus (F9)." },
  { codi: "S4", titol: "Massa de l'aire dins les cavitats", descripcio: "L'aire de dins d'una barca o d'una bola buida és unes 800 vegades menys dens que l'aigua i es menysprea als nivells 1 i 2." },
  { codi: "S5", titol: "Compressibilitat dels líquids", descripcio: "Els líquids es tracten com a incompressibles a les profunditats del laboratori." },
  { codi: "S6", titol: "Absorció d'aigua", descripcio: "Els objectes del laboratori tenen la superfície segellada: no absorbeixen aigua ni s'hi dissolen (tret de la sal)." },
  { codi: "S7", titol: "La vareta i el fil", descripcio: "La vareta per enfonsar objectes que suren i el fil del dinamòmetre no tenen massa ni desplacen volum." },
  { codi: "S8", titol: "Aigua adherida", descripcio: "En treure un objecte d'un recipient, no s'endú gotes de líquid adherides." },
  { codi: "S9", titol: "Moviment en una dimensió vertical", descripcio: "Els objectes pugen i baixen sense girar, tret de la prova d'estabilitat de les barques al nivell 3 (F3)." },
  { codi: "S10", titol: "Viscositat", descripcio: "La viscositat (mel, xarop, oli) alenteix el moviment, però no canvia la posició final d'equilibri, que només depèn de la densitat." },
  { codi: "S11", titol: "Densitat de la plastilina", descripcio: "Al laboratori val 1,50 g/cm³; a l'aula pot variar entre 1,3 i 1,9 g/cm³ segons la marca." },
  { codi: "S12", titol: "Gravetat", descripcio: "Per defecte es pren g = 9,8 N/kg. Des del mode docent es pot canviar a 9,81 o a 10 N/kg." },
  { codi: "S13", titol: "Aliments homogenis", descripcio: "La patata, la poma i l'ou es modelen amb la seva densitat mitjana homogènia; a F8 s'analitzen els objectes compostos." },
  { codi: "S14", titol: "Pressió manomètrica", descripcio: "Al bloc G es mostra per defecte la pressió deguda al líquid (p = d · g · h); la pressió atmosfèrica (101 325 Pa) s'hi pot sumar opcionalment." }
];
