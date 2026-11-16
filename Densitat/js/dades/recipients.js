/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Dades dels recipients del laboratori (03-dades-de-referencia.md §7).
 */

export const RECIPIENTS = {
  proveta25: {
    id: "proveta25",
    nom: "proveta de 25 mL",
    tipus: "proveta",
    capacitat: 25,
    graduacio: 0.5,
    diametreBoca: 1.6,
    massaBuit: 30,
    seccio: Math.PI * 0.8 * 0.8,
    alcadaEscala: 12.5,
    us: "Objectes petits, màxima resolució"
  },
  proveta100: {
    id: "proveta100",
    nom: "proveta de 100 mL",
    tipus: "proveta",
    capacitat: 100,
    graduacio: 1,
    diametreBoca: 2.6,
    massaBuit: 80,
    seccio: Math.PI * 1.3 * 1.3,
    alcadaEscala: 18.8,
    us: "Ús general"
  },
  proveta250: {
    id: "proveta250",
    nom: "proveta de 250 mL",
    tipus: "proveta",
    capacitat: 250,
    graduacio: 2,
    diametreBoca: 3.6,
    massaBuit: 150,
    seccio: Math.PI * 1.8 * 1.8,
    alcadaEscala: 24.6,
    us: "Objectes mitjans"
  },
  proveta500: {
    id: "proveta500",
    nom: "proveta de 500 mL",
    tipus: "proveta",
    capacitat: 500,
    graduacio: 5,
    diametreBoca: 5.0,
    massaBuit: 280,
    seccio: Math.PI * 2.5 * 2.5,
    alcadaEscala: 25.5,
    us: "Columna de líquids i objectes mitjans-grans"
  },
  proveta1000: {
    id: "proveta1000",
    nom: "proveta de 1000 mL",
    tipus: "proveta",
    capacitat: 1000,
    graduacio: 10,
    diametreBoca: 6.0,
    massaBuit: 450,
    seccio: Math.PI * 3.0 * 3.0,
    alcadaEscala: 35.4,
    us: "Objectes grans"
  },
  vas250: {
    id: "vas250",
    nom: "vas de precipitats de 250 mL",
    tipus: "vas",
    capacitat: 250,
    graduacio: 25,
    orientativa: true,
    diametreBoca: 6.8,
    massaBuit: 100,
    seccio: Math.PI * 3.4 * 3.4,
    alcadaEscala: 8.0,
    us: "Contenir, no mesurar"
  },
  vas600: {
    id: "vas600",
    nom: "vas de precipitats de 600 mL",
    tipus: "vas",
    capacitat: 600,
    graduacio: 50,
    orientativa: true,
    diametreBoca: 8.6,
    massaBuit: 200,
    seccio: Math.PI * 4.3 * 4.3,
    alcadaEscala: 11.5,
    us: "Proves de flotació"
  },
  matras100: {
    id: "matras100",
    nom: "matràs aforat de 100 mL",
    tipus: "matras",
    capacitat: 100,
    graduacio: 0.1,
    aforat: true,
    diametreBoca: 1.8,
    massaBuit: 60,
    seccio: 10,
    alcadaEscala: 10,
    us: "Volum exacte de líquid"
  },
  ampolla1L: {
    id: "ampolla1L",
    nom: "ampolla d'1 L",
    tipus: "ampolla",
    capacitat: 1000,
    graduacio: 1,
    aforat: true,
    diametreBoca: 3.0,
    massaBuit: 40,
    seccio: 50,
    alcadaEscala: 20,
    us: "Quanta massa té un litre?"
  },
  cub1dm: {
    id: "cub1dm",
    nom: "cub d'1 dm",
    tipus: "cub",
    capacitat: 1000,
    graduacio: 1,
    diametreBoca: 10.0,
    massaBuit: 250,
    seccio: 100,
    alcadaEscala: 10.0,
    us: "Construïm un litre"
  },
  vasVessament: {
    id: "vasVessament",
    nom: "vas de vessament",
    tipus: "vessament",
    capacitat: 600,
    bec: 600,
    graduacio: 1,
    diametreBoca: 9.0,
    massaBuit: 220,
    seccio: 60,
    alcadaEscala: 12.0,
    us: "Recollir el líquid desplaçat; hi caben la poma i la patata"
  },
  tanc: {
    id: "tanc",
    nom: "tanc",
    tipus: "tanc",
    capacitat: 10000,
    graduacio: 1,
    diametreBoca: 30.0,
    llargada: 30.0,
    amplada: 15.0,
    massaBuit: 1500,
    seccio: 450,
    alcadaEscala: 50.0,
    us: "Barques, forces i pressió"
  }
};
