/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Motor de diagnosi d'idees prèvies i inferència adaptativa bayesiana (07-guia-quadern-i-avaluacio.md §5).
 * Implementa tant el model determinista d'estats (no_observada -> activa -> en_revisio -> superada)
 * com el model adaptatiu bayesià combinat (perfil A+C) seguint l'especificació operativa v2.6 de Juan José de Haro.
 */

import { IDEES_PREVIES } from "../dades/idees.js";
import { BANC_DIAGNOSTIC_BAYESIA } from "../dades/investigacions/index.js";
import { netejaDecimal } from "../fisica/unitats.js";

// Escala fixa theta per a n = 3 hipòtesis ordinals: theta_i = 2*(i-1) - (n-1) => [-2, 0, +2]
export const THETA_NIVELLS = [-2, 0, 2];
export const NOMS_NIVELLS = ["Inicial (Descoberta)", "Intermedi (Mesura)", "Avançat (Models)"];
export const A_EF = 1.25;
export const SOSTRE_DOMINI = 0.95;
export const P_MIN_CONFIANCA = 0.80;
export const MIN_PREGUNTES_DIAGNOSTIC = 5;
export const MAX_PREGUNTES_DIAGNOSTIC = 10;
export const MOSTRA_MINIMA_FACTOR = 2;

/**
 * Crea l'estat inicial de diagnosi (determinista + bayesià).
 */
export function creaEstatDiagnosiInicial() {
  const idees = {};
  const factorsBayes = {};

  for (const [codi, info] of Object.entries(IDEES_PREVIES)) {
    const prior = Math.max(0.15, Math.min(0.40, info.prior ?? 0.25));
    idees[codi] = {
      codi,
      estat: "no_observada", // "no_observada" | "activa" | "en_revisio" | "superada"
      evidenciesError: 0,
      evidenciesCorrectes: 0,
      encertAplicacio: false,
      contextosCorrectes: []
    };
    factorsBayes[codi] = {
      codi,
      prior,
      probPresent: prior,
      intents: 0,
      historial: []
    };
  }

  return {
    idees,
    bayesia: {
      posteriorNivell: [1 / 3, 1 / 3, 1 / 3],
      factors: factorsBayes,
      respostes: [],
      tancat: false,
      motiuTancament: null
    }
  };
}

/**
 * Actualitza l'estat determinista d'una idea prèvia (07-guia-quadern-i-avaluacio.md §5.2):
 * no_observada ──► activa ──► en_revisio ──► superada
 *                    ▲             │
 *                    └─────────────┘ (si torna a aparèixer)
 *
 * @param {object} estatDiagnosi
 * @param {object} ev
 * @param {string} ev.codi Codi IP-xx
 * @param {boolean} ev.correcta Si l'alumne ha respost superant la idea equivocada
 * @param {string} [ev.context="general"] Identificador de la investigació o pregunta
 * @param {boolean} [ev.esAplicacio=false] Si és el pas de transferència («Aplica»)
 * @param {number} [ev.creditParcial=1] Entre 0 i 1 (reduït si ha usat pistes)
 */
export function registraEvidenciaIdea(estatDiagnosi, ev) {
  const { codi, correcta, context = "general", esAplicacio = false, creditParcial = 1 } = ev;
  if (!codi || !estatDiagnosi?.idees?.[codi]) return estatDiagnosi;

  const item = estatDiagnosi.idees[codi];
  if (!correcta) {
    item.evidenciesError += 1;
    item.estat = "activa";
  } else {
    item.evidenciesCorrectes += 1;
    if (!item.contextosCorrectes.includes(context)) {
      item.contextosCorrectes.push(context);
    }
    if (esAplicacio && creditParcial >= 0.7) {
      item.encertAplicacio = true;
    }

    if (item.estat === "activa") {
      item.estat = "en_revisio";
    } else if (item.estat === "en_revisio" || item.estat === "no_observada") {
      if (item.contextosCorrectes.length >= 2 && item.encertAplicacio) {
        item.estat = "superada";
      } else {
        item.estat = "en_revisio";
      }
    }
  }

  // També actualitzem el factor bayesià corresponent
  actualitzaFactorErrorBayesia(
    estatDiagnosi.bayesia,
    codi,
    correcta ? creditParcial : 0
  );

  return estatDiagnosi;
}

/**
 * Probabilitat d'encert sota la hipòtesi ordinal H_i (IRT 3PL amb a = 1.25 / (1 - c_q) i sostre <= 0.95).
 * @param {number} theta Valor latent de la hipòtesi (-2, 0, +2)
 * @param {number} b Dificultat de l'ítem a [-1, +1]
 * @param {number} [m=3] Nombre d'opcions (0 si és oberta)
 * @returns {number}
 */
export function probabilitatEncert3PL(theta, b, m = 3) {
  const c = m && m >= 2 ? 1 / m : 0;
  const a = A_EF / (1 - c);
  const bClamped = Math.max(-1, Math.min(1, b));
  const p = c + (1 - c) / (1 + Math.exp(-a * (theta - bClamped)));
  return Math.min(SOSTRE_DOMINI, Math.max(c + 0.01, p));
}

/**
 * Versemblança geomètrica per a respostes amb crèdit parcial s in [0, 1] (per exemple, després de pistes):
 * L(H_i) = P(encert | H_i)^s * (1 - P(encert | H_i))^(1 - s)
 * @param {number} pEncert
 * @param {number} s Puntuació parcial entre 0 i 1
 * @returns {number}
 */
export function versemblancaCreditParcial(pEncert, s) {
  const sClamped = Math.max(0, Math.min(1, s));
  if (sClamped === 1) return pEncert;
  if (sClamped === 0) return 1 - pEncert;
  return (pEncert ** sClamped) * ((1 - pEncert) ** (1 - sClamped));
}

/**
 * Actualitza la distribució posterior de nivells ordinals amb una resposta d'un ítem de dificultat `b` i `m` opcions.
 * @param {Array<number>} prior Array de 3 probabilitats que sumen 1
 * @param {object} item { dificultat, m }
 * @param {number} s Puntuació obtinguda entre 0 (error) i 1 (encert sense pistes)
 * @returns {Array<number>} Nou vector posterior normalitzat
 */
export function actualitzaPosteriorNivell(prior, item, s) {
  const b = item.dificultat ?? 0;
  const m = item.m ?? 3;
  const noNormalitzat = THETA_NIVELLS.map((theta, i) => {
    const pEnc = probabilitatEncert3PL(theta, b, m);
    const versemblanca = versemblancaCreditParcial(pEnc, s);
    return prior[i] * versemblanca;
  });
  const suma = noNormalitzat.reduce((acc, v) => acc + v, 0);
  if (suma <= 0) return [1 / 3, 1 / 3, 1 / 3];
  return noNormalitzat.map(v => netejaDecimal(v / suma, 6));
}

/**
 * Actualitza la probabilitat marginal d'un factor d'error nominal (IP-xx).
 * Sota la presència de l'error, la probabilitat d'encertar un ítem que l'ataca és baixa (0.20),
 * i sota l'absència de l'error és alta (0.88).
 * @param {object} estatBayesia
 * @param {string} codiIdea
 * @param {number} s Puntuació entre 0 i 1 (0 si ha triat el distractor de la idea equivocada)
 * @param {boolean} [haTriatDistractorEspecific=false]
 */
export function actualitzaFactorErrorBayesia(estatBayesia, codiIdea, s, haTriatDistractorEspecific = false) {
  const factor = estatBayesia?.factors?.[codiIdea];
  if (!factor) return;

  const pPresent = factor.probPresent;
  const pAbsent = 1 - pPresent;

  // Versemblança d'encert si l'error és present vs absent
  const pEncSiPresent = haTriatDistractorEspecific ? 0.15 : 0.25;
  const pEncSiAbsent = 0.88;

  const lPresent = versemblancaCreditParcial(pEncSiPresent, s);
  const lAbsent = versemblancaCreditParcial(pEncSiAbsent, s);

  const postPresent = pPresent * lPresent;
  const postAbsent = pAbsent * lAbsent;
  const total = postPresent + postAbsent;

  if (total > 0) {
    // Evitem 0 o 1 absoluts perquè cap resposta aïllada faci irreversible el diagnòstic
    factor.probPresent = netejaDecimal(Math.max(0.01, Math.min(0.99, postPresent / total)), 5);
  }
  factor.intents += 1;
}

/**
 * Calcula l'entropia de Shannon (en bits) d'una distribució discreta.
 * @param {Array<number>} dist
 * @returns {number}
 */
export function entropiaShannon(dist) {
  let h = 0;
  for (const p of dist) {
    if (p > 1e-12) {
      h -= p * Math.log2(p);
    }
  }
  return netejaDecimal(h, 6);
}

/**
 * Calcula el guany esperat d'informació (IG, en bits) d'un ítem candidat sobre la distribució de nivell
 * i sobre el factor d'error associat.
 * @param {Array<number>} posteriorNivell
 * @param {object} factors
 * @param {object} item
 * @returns {{igNivell: number, igError: number, igTotal: number}}
 */
export function calculaGuanyInformacioItem(posteriorNivell, factors, item) {
  const hActualNivell = entropiaShannon(posteriorNivell);
  const b = item.dificultat ?? 0;
  const m = item.m ?? 3;

  // Probabilitat marginal d'encert (s=1) i d'error (s=0)
  const pEncPerH = THETA_NIVELLS.map(th => probabilitatEncert3PL(th, b, m));
  const pMarginalEnc = posteriorNivell.reduce((acc, pH, i) => acc + pH * pEncPerH[i], 0);
  const pMarginalErr = 1 - pMarginalEnc;

  const postSiEnc = actualitzaPosteriorNivell(posteriorNivell, item, 1);
  const postSiErr = actualitzaPosteriorNivell(posteriorNivell, item, 0);

  const hEsperadaNivell =
    pMarginalEnc * entropiaShannon(postSiEnc) + pMarginalErr * entropiaShannon(postSiErr);
  const igNivell = Math.max(0, netejaDecimal(hActualNivell - hEsperadaNivell, 6));

  // Guany sobre el factor d'error associat
  let igError = 0;
  const f = factors?.[item.idea];
  if (f) {
    const pP = f.probPresent;
    const hActualErr = entropiaShannon([pP, 1 - pP]);
    const pEncP = 0.20;
    const pEncA = 0.88;
    const pMargE = pP * pEncP + (1 - pP) * pEncA;
    const postPEnc = (pP * pEncP) / pMargE;
    const postPErr = (pP * (1 - pEncP)) / (1 - pMargE);
    const hEspErr =
      pMargE * entropiaShannon([postPEnc, 1 - postPEnc]) +
      (1 - pMargE) * entropiaShannon([postPErr, 1 - postPErr]);
    igError = Math.max(0, netejaDecimal(hActualErr - hEspErr, 6));
  }

  return {
    igNivell,
    igError,
    igTotal: netejaDecimal(igNivell + igError, 6)
  };
}

/**
 * Selecciona el següent ítem òptim del banc diagnòstic bayesià combinant els blocs pedagògics
 * (`nivell` i `errors`) i evitant repeticions.
 * @param {object} estatBayesia
 * @param {Array<object>} [banc=BANC_DIAGNOSTIC_BAYESIA]
 * @returns {object|null}
 */
export function seleccionaSeguentItemBayesia(estatBayesia, banc = BANC_DIAGNOSTIC_BAYESIA) {
  const jaFets = new Set((estatBayesia.respostes || []).map(r => r.id));
  const candidats = banc.filter(q => !jaFets.has(q.id));
  if (candidats.length === 0) return null;

  // Primer ítem: comencem amb una pregunta assequible (dificultat propera a -0.5) per motivar l'alumne
  if (jaFets.size === 0) {
    const inicials = [...candidats].sort(
      (a, b) => Math.abs(a.dificultat - -0.5) - Math.abs(b.dificultat - -0.5)
    );
    return inicials[0];
  }

  const avaluats = candidats.map(q => {
    const ig = calculaGuanyInformacioItem(estatBayesia.posteriorNivell, estatBayesia.factors, q);
    return { item: q, ...ig };
  });

  const maxIgNivell = Math.max(...avaluats.map(a => a.igNivell), 1e-6);
  const maxIgError = Math.max(...avaluats.map(a => a.igError), 1e-6);

  const nivellDecidit =
    jaFets.size >= MIN_PREGUNTES_DIAGNOSTIC &&
    Math.max(...estatBayesia.posteriorNivell) >= 0.80;

  const wNivell = nivellDecidit ? 0.25 : 0.55;
  const wError = 1 - wNivell;

  avaluats.forEach(a => {
    const normNiv = a.igNivell / maxIgNivell;
    const normErr = a.igError / maxIgError;
    a.utilitat = wNivell * normNiv + wError * normErr;
  });

  avaluats.sort((a, b) => b.utilitat - a.utilitat);
  return avaluats[0].item;
}

/**
 * Registra una resposta al test diagnòstic bayesià i comprova el criteri d'aturada.
 * @param {object} estatBayesia
 * @param {object} item Ítem del banc
 * @param {string} opcioId Id de l'opció triada
 * @param {number} [pistesUsades=0]
 * @returns {object}
 */
export function responItemDiagnosticBayesia(estatBayesia, item, opcioId, pistesUsades = 0) {
  const opcio = (item.opcions || []).find(o => o.id === opcioId);
  const correcta = Boolean(opcio?.correcta);
  const s = correcta
    ? (pistesUsades === 0 ? 1 : pistesUsades === 1 ? 0.65 : 0.35)
    : 0;

  estatBayesia.posteriorNivell = actualitzaPosteriorNivell(
    estatBayesia.posteriorNivell,
    item,
    s
  );

  const ideaItem = opcio?.distractorIdea || item.idea;
  if (ideaItem) {
    actualitzaFactorErrorBayesia(
      estatBayesia,
      ideaItem,
      s,
      Boolean(opcio?.distractorIdea)
    );
  }

  estatBayesia.respostes.push({
    id: item.id,
    correcta,
    s,
    dificultat: item.dificultat,
    m: item.m ?? 3,
    idea: ideaItem,
    opcioId
  });

  // Comprovem criteri d'aturada (n = 3 <= 4: tanca quan nPreguntes >= MIN i max(p_i) >= 0.80, o s'arriba a MAX)
  const nResp = estatBayesia.respostes.length;
  const maxP = Math.max(...estatBayesia.posteriorNivell);
  if (nResp >= MIN_PREGUNTES_DIAGNOSTIC && maxP >= 0.80) {
    estatBayesia.tancat = true;
    estatBayesia.motiuTancament = "confianca_assolida";
  } else if (nResp >= MAX_PREGUNTES_DIAGNOSTIC || nResp >= BANC_DIAGNOSTIC_BAYESIA.length) {
    estatBayesia.tancat = true;
    estatBayesia.motiuTancament = maxP >= 0.80 ? "confianca_assolida" : "maxim_preguntes_provisional";
  }

  return estatBayesia;
}

/**
 * Calcula l'índex d'ajust del patró individual de respostes (person-fit l_z) sota la hipòtesi MAP.
 * Valors molt negatius (< -2) indiquen respostes incoherents amb la dificultat (descuit o atzar).
 * @param {object} estatBayesia
 * @returns {number}
 */
export function calculaPersonFitLz(estatBayesia) {
  const respostes = estatBayesia?.respostes || [];
  if (respostes.length < 3) return 0;

  const post = estatBayesia.posteriorNivell;
  const idxMap = post.indexOf(Math.max(...post));
  const theta = THETA_NIVELLS[idxMap];

  let logL = 0;
  let esperat = 0;
  let variancia = 0;

  for (const r of respostes) {
    const p = probabilitatEncert3PL(theta, r.dificultat ?? 0, r.m ?? 3);
    const q = 1 - p;
    const u = r.correcta ? 1 : 0;
    logL += u * Math.log(p) + (1 - u) * Math.log(q);
    esperat += p * Math.log(p) + q * Math.log(q);
    const logOdds = Math.log(p / q);
    variancia += p * q * logOdds * logOdds;
  }

  if (variancia <= 1e-9) return 0;
  return netejaDecimal((logL - esperat) / Math.sqrt(variancia), 2);
}

/**
 * Genera l'informe pedagògic complet de l'estat bayesià (distingint vista d'alumne i vista docent).
 * Segueix les regles d'especificacio-operativa.md:
 * - No declara un factor absent sense la mostra mínima d'evidència (MOSTRA_MINIMA_FACTOR = 2).
 * - Comunica els errors com a hipòtesis a comprovar i destaca la recomanació de tasca.
 * @param {object} estatBayesia
 * @returns {object}
 */
export function generaInformeBayesia(estatBayesia) {
  const post = estatBayesia.posteriorNivell || [1 / 3, 1 / 3, 1 / 3];
  const maxP = Math.max(...post);
  const idxGuanyador = post.indexOf(maxP);
  const nResp = (estatBayesia.respostes || []).length;
  const provisional = nResp < MIN_PREGUNTES_DIAGNOSTIC || maxP < 0.80;
  const lz = calculaPersonFitLz(estatBayesia);
  const alertaAtzar = lz < -2.0;

  const factorsAvaluats = Object.values(estatBayesia.factors || {}).map(f => {
    const info = IDEES_PREVIES[f.codi];
    let estatFactor = "sense_evidencia_suficient";
    if (f.intents >= MOSTRA_MINIMA_FACTOR) {
      if (f.probPresent >= 0.70) estatFactor = "present";
      else if (f.probPresent <= 0.30) estatFactor = "absent_confirmat";
      else estatFactor = "indeterminat";
    } else if (f.intents === 1 && f.probPresent >= 0.55) {
      estatFactor = "indeterminat";
    }
    return {
      codi: f.codi,
      enunciat: info?.enunciat || f.codi,
      contrast: info?.contrast || "",
      investigacions: info?.investigacions || [],
      probPresent: f.probPresent,
      intents: f.intents,
      estatFactor
    };
  });

  const errorsPresentsOProbables = factorsAvaluats.filter(
    f => f.estatFactor === "present" || (f.intents >= 1 && f.probPresent >= 0.48)
  );
  const absentsConfirmats = factorsAvaluats.filter(f => f.estatFactor === "absent_confirmat");

  let recomanacioTasca = "Continua amb les investigacions del bloc C (C3 i C4) i del bloc D (D1 i D2) per consolidar la relació entre massa, volum i flotació.";
  let pasSeguent = "C4";
  if (errorsPresentsOProbables.length > 0) {
    const primer = errorsPresentsOProbables[0];
    pasSeguent = primer.investigacions[0] || "D2";
    recomanacioTasca = `Comprovem junts aquesta idea al laboratori amb la investigació ${pasSeguent}: ${primer.contrast}`;
  } else if (idxGuanyador === 2 && !provisional) {
    pasSeguent = "E3";
    recomanacioTasca = "Domines les bases de densitat i flotabilitat. Et convé explorar el principi d'Arquimedes (E3) i el taller de barques (F1–F3).";
  } else if (idxGuanyador === 1) {
    pasSeguent = "D4";
    recomanacioTasca = "Et convé practicar la flotació en diferents líquids (D4 i D5) i la gràfica massa-volum (C5).";
  }

  return {
    nivellIndex: idxGuanyador,
    nivellRecomanat: idxGuanyador + 1,
    etiquetaNivellDocent: NOMS_NIVELLS[idxGuanyador],
    probabilitatNivell: netejaDecimal(maxP, 3),
    distribucioPosterior: post,
    provisional,
    nombreRespostes: nResp,
    personFitLz: lz,
    alertaAtzar,
    recomanacioTasca,
    pasSeguent,
    errorsDetectats: errorsPresentsOProbables,
    fortalesesConfirmades: absentsConfirmats,
    factorsAvaluats
  };
}

/**
 * Validació Monte Carlo de la separabilitat del disseny del banc diagnòstic (especificacio-operativa.md §Validació i fiabilitat).
 * Usa un generador pseudoaleatori sembrat (Mulberry32) perquè sigui 100 % reproduïble.
 * @param {number} [simulacionsPerNivell=500]
 * @param {number} [llavor=20261116]
 * @returns {object}
 */
export function validaSeparabilitatMonteCarlo(simulacionsPerNivell = 500, llavor = 20261116) {
  let state = llavor >>> 0;
  const rand = () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Matriu de confusió 3x3: files = nivell real (0, 1, 2), columnes = nivell diagnosticat (0, 1, 2)
  const matriu = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  let totalPreguntes = 0;
  let totalIndeterminats = 0;

  for (let realIdx = 0; realIdx < 3; realIdx++) {
    const thetaReal = THETA_NIVELLS[realIdx];
    for (let s = 0; s < simulacionsPerNivell; s++) {
      const diag = creaEstatDiagnosiInicial().bayesia;
      while (!diag.tancat) {
        const item = seleccionaSeguentItemBayesia(diag, BANC_DIAGNOSTIC_BAYESIA);
        if (!item) break;
        const pEnc = probabilitatEncert3PL(thetaReal, item.dificultat, item.m ?? 3);
        const encerta = rand() < pEnc;
        const opcio = encerta
          ? item.opcions.find(o => o.correcta)
          : item.opcions.find(o => !o.correcta);
        responItemDiagnosticBayesia(diag, item, opcio.id, 0);
      }
      totalPreguntes += diag.respostes.length;
      const maxP = Math.max(...diag.posteriorNivell);
      if (maxP < 0.55) totalIndeterminats += 1;
      const predIdx = diag.posteriorNivell.indexOf(maxP);
      matriu[realIdx][predIdx] += 1;
    }
  }

  const taxesPerNivell = [0, 1, 2].map(i =>
    netejaDecimal(matriu[i][i] / simulacionsPerNivell, 3)
  );
  const exactitudEquilibrada = netejaDecimal(
    (taxesPerNivell[0] + taxesPerNivell[1] + taxesPerNivell[2]) / 3,
    3
  );
  const totalSim = simulacionsPerNivell * 3;

  return {
    simulacionsPerNivell,
    totalSimulacions: totalSim,
    matriuConfusio: matriu,
    taxesPerNivell,
    exactitudEquilibrada,
    taxaIndeterminats: netejaDecimal(totalIndeterminats / totalSim, 3),
    longitudMitjanaSessio: netejaDecimal(totalPreguntes / totalSim, 2),
    benSeparat: taxesPerNivell.every(t => t >= 0.70)
  };
}
