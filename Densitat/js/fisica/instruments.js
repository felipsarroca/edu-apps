/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Del valor real a la lectura dels instruments de mesura, lectura del menisc i validació de respostes.
 * Mòdul pur del motor físic (02-model-cientific.md §6, regla R19, casos T09–T10).
 */

import {
  netejaDecimal,
  arrodoneixAResolucio,
  decimalsDeResolucio,
  formataNombre,
  converteixUnitat,
  interpretaNombre,
  normalitzaUnitat,
  FACTORS_UNITATS
} from "./unitats.js";

/**
 * Calcula la lectura d'un instrument a partir del valor real (02-model-cientific.md §6, regla R19):
 * lectura = arrodoneix(valor real + desplaçament de zero + soroll − tara, resolució)
 * Si el valor supera el rang màxim de l'instrument, indica sobrecàrrega / fora d'escala i no dona lectura.
 *
 * @param {number} valorReal Valor real en la unitat base de l'instrument
 * @param {object} instrument Configuració de l'instrument
 * @param {number} [instrument.rangMin=0]
 * @param {number} [instrument.rangMax=Infinity]
 * @param {number} [instrument.resolucio=1]
 * @param {number} [instrument.tara=0]
 * @param {number} [instrument.desplacamentZero=0]
 * @param {number} [instrument.soroll=0]
 * @param {string} [instrument.unitat="g"]
 * @param {string} [instrument.unitatBase="g"]
 * @returns {{
 *   lectura: number|null,
 *   lecturaFormatada: string,
 *   sobrecarrega: boolean,
 *   foraDEscala: boolean,
 *   decimals: number,
 *   resolucio: number,
 *   unitat: string
 * }}
 */
export function llegeixInstrument(valorReal, instrument = {}) {
  const {
    rangMin = -Infinity,
    rangMax = Infinity,
    resolucio = 1,
    tara = 0,
    desplacamentZero = 0,
    soroll = 0,
    unitat = "g",
    unitatBase = unitat
  } = instrument;

  const brutBase = valorReal + desplacamentZero + soroll;
  if (brutBase > rangMax + 1e-9 || brutBase < rangMin - 1e-9) {
    return {
      lectura: null,
      lecturaFormatada: "— — —",
      sobrecarrega: brutBase > rangMax + 1e-9,
      foraDEscala: true,
      decimals: decimalsDeResolucio(resolucio),
      resolucio,
      unitat
    };
  }

  const netBase = brutBase - tara;
  const lecturaBase = arrodoneixAResolucio(netBase, resolucio);
  let lecturaFinal = lecturaBase;
  let resolucioFinal = resolucio;

  if (unitat !== unitatBase && FACTORS_UNITATS[unitat] && FACTORS_UNITATS[unitatBase]) {
    lecturaFinal = converteixUnitat(lecturaBase, unitatBase, unitat);
    resolucioFinal = converteixUnitat(resolucio, unitatBase, unitat);
  }

  const decimals = decimalsDeResolucio(resolucioFinal);
  return {
    lectura: lecturaFinal,
    lecturaFormatada: formataNombre(lecturaFinal, decimals),
    sobrecarrega: false,
    foraDEscala: false,
    decimals,
    resolucio: resolucioFinal,
    unitat
  };
}

/**
 * Simula la lectura del menisc en una proveta segons la posició de l'ull i si es llegeix la tangent o la vora.
 * Detecta els errors de procediment EP-02 (llegir el menisc per dalt en aigua) i EP-03 (vista desviada / paral·laxi).
 *
 * @param {number} volumReal Volum real dins la proveta (mL)
 * @param {object} proveta { capacitat, graduacio }
 * @param {object} [opcions={}]
 * @param {string} [opcions.tipusMenisc="concau"] - "concau" (aigua) | "convex" (mercuri)
 * @param {string} [opcions.posicioUll="altura"] - "alt" | "altura" | "baix"
 * @param {string} [opcions.puntLectura="tangent"] - "tangent" (correcte) | "vora" (EP-02)
 * @param {boolean} [opcions.permetMitjaDivisio=false]
 * @returns {{
 *   lecturaCorrecta: number|null,
 *   lecturaObservada: number|null,
 *   foraDEscala: boolean,
 *   errorProcediment: string|null
 * }}
 */
export function llegeixMenisc(volumReal, proveta = {}, opcions = {}) {
  const { capacitat = 100, graduacio = 1 } = proveta;
  const {
    tipusMenisc = "concau",
    posicioUll = "altura",
    puntLectura = "tangent",
    permetMitjaDivisio = false
  } = opcions;

  if (volumReal > capacitat + 1e-6) {
    return {
      lecturaCorrecta: null,
      lecturaObservada: null,
      foraDEscala: true,
      errorProcediment: "EP-05"
    };
  }

  const pas = permetMitjaDivisio ? graduacio / 2 : graduacio;
  const lecturaCorrecta = arrodoneixAResolucio(volumReal, pas);

  let desfasament = 0;
  let errorProcediment = null;

  if (posicioUll === "alt") {
    desfasament -= graduacio;
    errorProcediment = "EP-03";
  } else if (posicioUll === "baix") {
    desfasament += graduacio;
    errorProcediment = "EP-03";
  }

  if (puntLectura === "vora") {
    desfasament += tipusMenisc === "concau" ? graduacio : -graduacio;
    if (!errorProcediment) errorProcediment = "EP-02";
  }

  const lecturaObservada = arrodoneixAResolucio(volumReal + desfasament, pas);

  return {
    lecturaCorrecta,
    lecturaObservada,
    foraDEscala: false,
    errorProcediment
  };
}

/**
 * Valida una resposta numèrica amb unitat introduïda per l'alumne (02-model-cientific.md §6, 01-fonaments-pedagogics.md §7).
 * Diagnostica automàticament EM-01 (quocient invertit V/m), EM-02, EM-03, EM-04, EM-05 (falta unitat), EM-06, EM-07, EM-08.
 *
 * @param {object} params
 * @param {string|number} params.valorAlumne
 * @param {string} params.unitatAlumne
 * @param {number} params.valorEsperat
 * @param {string} params.unitatEsperada
 * @param {number} [params.toleranciaRelativa=0.02] 2 % per defecte al nivell 1
 * @param {number} [params.toleranciaAbsoluta=null]
 * @param {number} [params.nivell=1]
 * @param {number|null} [params.maxDecimals=null] Per detectar EM-08 al nivell 3
 * @returns {{
 *   correcte: boolean,
 *   valorCorrecte: boolean,
 *   unitatCorrecta: boolean,
 *   codiError: string|null,
 *   missatge: string
 * }}
 */
export function validaRespostaNumerica(params) {
  const {
    valorAlumne,
    unitatAlumne = "",
    valorEsperat,
    unitatEsperada = "",
    toleranciaRelativa = 0.02,
    toleranciaAbsoluta = null,
    nivell = 1,
    maxDecimals = null
  } = params;

  const num = interpretaNombre(valorAlumne);
  const uAl = normalitzaUnitat(unitatAlumne);
  const uEsp = normalitzaUnitat(unitatEsperada);

  if (Number.isNaN(num)) {
    return {
      correcte: false,
      valorCorrecte: false,
      unitatCorrecta: false,
      codiError: null,
      missatge: "Escriu un valor numèric."
    };
  }

  // Comprovem si el valor numèric és correcte en la unitat esperada o en una unitat equivalent
  const tol = toleranciaAbsoluta !== null
    ? toleranciaAbsoluta
    : Math.max(Math.abs(valorEsperat) * toleranciaRelativa, 0.01);

  let valorEnUnitatEsperada = num;
  let unitatsCompatibles = uAl === uEsp;

  if (!unitatsCompatibles && uAl && uEsp && FACTORS_UNITATS[uAl] && FACTORS_UNITATS[uEsp]) {
    if (FACTORS_UNITATS[uAl].familia === FACTORS_UNITATS[uEsp].familia) {
      valorEnUnitatEsperada = converteixUnitat(num, uAl, uEsp);
      unitatsCompatibles = true;
    }
  }

  const valorCorrecteDirecte = Math.abs(num - valorEsperat) <= tol;
  const valorCorrecteConvertit = unitatsCompatibles && Math.abs(valorEnUnitatEsperada - valorEsperat) <= tol;

  // EM-05: Resultat sense unitat
  if (uEsp && !uAl) {
    return {
      correcte: false,
      valorCorrecte: valorCorrecteDirecte,
      unitatCorrecta: false,
      codiError: "EM-05",
      missatge: valorCorrecteDirecte
        ? "El càlcul és correcte, però falta la unitat. Un número sense unitat no és una mesura."
        : "Un número sense unitat no és una mesura."
    };
  }

  // EM-01: Invertir el quocient (V / m en lloc de m / V)
  if (valorEsperat > 0 && Math.abs(valorEsperat - 1) > 0.05) {
    const invers = 1 / valorEsperat;
    if (Math.abs(num - invers) <= Math.max(invers * 0.03, 0.01)) {
      return {
        correcte: false,
        valorCorrecte: false,
        unitatCorrecta: unitatsCompatibles,
        codiError: "EM-01",
        missatge: "Has calculat quant espai ocupa cada gram. La densitat és la massa de cada centímetre cúbic."
      };
    }
  }

  // EM-04: Convertir malament g/cm³ i kg/m³ (dividir per 1000 o multiplicar per 100)
  if (FACTORS_UNITATS[uEsp]?.familia === "densitat") {
    if (
      Math.abs(num - valorEsperat / 1000) <= valorEsperat * 0.00005 ||
      Math.abs(num - valorEsperat * 100) <= valorEsperat * 2 ||
      Math.abs(num - valorEsperat / 100) <= valorEsperat * 0.0005
    ) {
      if (!valorCorrecteConvertit) {
        return {
          correcte: false,
          valorCorrecte: false,
          unitatCorrecta: unitatsCompatibles,
          codiError: "EM-04",
          missatge: "Recorda que 1 g/cm³ són 1000 kg/m³."
        };
      }
    }
  }

  // EM-03: Factor de conversió de volum erroni (10 o 100 entre graons en lloc de 1000)
  if (FACTORS_UNITATS[uEsp]?.familia === "volum" && !valorCorrecteConvertit) {
    const r = valorEsperat !== 0 ? num / valorEsperat : 0;
    if ([0.01, 0.1, 10, 100].some(f => Math.abs(r - f) < f * 0.02)) {
      return {
        correcte: false,
        valorCorrecte: false,
        unitatCorrecta: unitatsCompatibles,
        codiError: "EM-03",
        missatge: "Cada graó de volum val 1000."
      };
    }
  }

  // EM-06: Confondre massa i pes en una força
  if (uEsp === "N" && (uAl === "g" || uAl === "kg" || Math.abs(num - (valorEsperat / 9.8) * 1000) < 1)) {
    return {
      correcte: false,
      valorCorrecte: false,
      unitatCorrecta: false,
      codiError: "EM-06",
      missatge: "El pes és una força: massa en quilograms per g."
    };
  }

  // EM-07: No passar cm³ a m³ a E = dL · g · V (resultat 1 000 000 o 1000 vegades més gran)
  if (uEsp === "N" && (Math.abs(num - valorEsperat * 1e6) < valorEsperat * 2e4 || Math.abs(num - valorEsperat * 1e3) < valorEsperat * 20)) {
    return {
      correcte: false,
      valorCorrecte: false,
      unitatCorrecta: unitatsCompatibles,
      codiError: "EM-07",
      missatge: "La densitat està en kg/m³. I el volum?"
    };
  }

  // EM-08: Massa xifres decimals al nivell 3
  if (nivell >= 3 && maxDecimals !== null && typeof valorAlumne === "string") {
    const netStr = valorAlumne.trim().replace(",", ".");
    const parts = netStr.split(".");
    if (parts[1] && parts[1].length > maxDecimals) {
      return {
        correcte: false,
        valorCorrecte: valorCorrecteConvertit,
        unitatCorrecta: unitatsCompatibles,
        codiError: "EM-08",
        missatge: "L'instrument no pot donar tanta precisió."
      };
    }
  }

  if (valorCorrecteDirecte && !unitatsCompatibles) {
    return {
      correcte: false,
      valorCorrecte: true,
      unitatCorrecta: false,
      codiError: "EM-02",
      missatge: "El número és correcte, però revisa la unitat."
    };
  }

  if (valorCorrecteConvertit) {
    return {
      correcte: true,
      valorCorrecte: true,
      unitatCorrecta: true,
      codiError: null,
      missatge: "Correcte."
    };
  }

  return {
    correcte: false,
    valorCorrecte: false,
    unitatCorrecta: unitatsCompatibles,
    codiError: null,
    missatge: "Revisa les dades que has fet servir."
  };
}
