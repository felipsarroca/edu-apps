/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Dades dels instruments de mesura del laboratori (03-dades-de-referencia.md §8).
 */

export const INSTRUMENTS = {
  balanca_cuina: {
    id: "balanca_cuina",
    tipus: "balanca_digital",
    model: "De cuina",
    nom: "balança digital de cuina",
    rangMax: 5000,
    resolucio: 1,
    unitats: ["g", "kg"],
    fase: 1
  },
  balanca_laboratori: {
    id: "balanca_laboratori",
    tipus: "balanca_digital",
    model: "De laboratori",
    nom: "balança digital de laboratori",
    rangMax: 2000,
    resolucio: 0.1,
    unitats: ["g", "kg"],
    fase: 1
  },
  balanca_precisio: {
    id: "balanca_precisio",
    tipus: "balanca_digital",
    model: "De precisió",
    nom: "balança digital de precisió",
    rangMax: 200,
    resolucio: 0.01,
    unitats: ["g"],
    fase: 2
  },
  balanca_bracos: {
    id: "balanca_bracos",
    tipus: "balanca_bracos",
    model: "Amb masses patró",
    nom: "balança de braços",
    rangMax: 1000,
    resolucio: 1,
    massesPatro: [500, 200, 200, 100, 50, 20, 20, 10, 5, 2, 2, 1],
    unitats: ["g"],
    fase: 2
  },
  regle: {
    id: "regle",
    tipus: "regle",
    model: "30 cm",
    nom: "regle graduat",
    rangMax: 30,
    resolucio: 0.1, // 1 mm = 0,1 cm
    unitats: ["cm", "mm"],
    fase: 1
  },
  peu_de_rei: {
    id: "peu_de_rei",
    tipus: "peu_de_rei",
    model: "Simplificat",
    nom: "peu de rei",
    rangMax: 15,
    resolucio: 0.01, // 0,1 mm = 0,01 cm
    unitats: ["cm", "mm"],
    fase: 2
  },
  dinamometre_5: {
    id: "dinamometre_5",
    tipus: "dinamometre",
    model: "Sensible",
    nom: "dinamòmetre sensible (5 N)",
    rangMax: 5,
    resolucio: 0.01,
    unitats: ["N"],
    fase: 2
  },
  dinamometre_20: {
    id: "dinamometre_20",
    tipus: "dinamometre",
    model: "General",
    nom: "dinamòmetre general (20 N)",
    rangMax: 20,
    resolucio: 0.05,
    unitats: ["N"],
    fase: 2
  },
  dinamometre_100: {
    id: "dinamometre_100",
    tipus: "dinamometre",
    model: "Gran",
    nom: "dinamòmetre gran (100 N)",
    rangMax: 100,
    resolucio: 0.5,
    unitats: ["N"],
    fase: 3
  },
  sonda_pressio: {
    id: "sonda_pressio",
    tipus: "sonda_pressio",
    model: "Estàndard",
    nom: "sonda de pressió",
    rangMax: 20000,
    resolucio: 10,
    unitats: ["Pa", "kPa"],
    fase: 4
  },
  termometre: {
    id: "termometre",
    tipus: "termometre",
    model: "Digital",
    nom: "termòmetre",
    rangMin: -10,
    rangMax: 110,
    resolucio: 1,
    unitats: ["°C"],
    fase: 4
  },
  densimetre: {
    id: "densimetre",
    tipus: "densimetre",
    model: "Universal",
    nom: "densímetre",
    rangMin: 0.70,
    rangMax: 1.50,
    resolucio: 0.01,
    unitats: ["g/cm³"],
    fase: 4
  }
};
