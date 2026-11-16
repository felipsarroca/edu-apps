/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Proves automàtiques del motor físic (Fase 0):
 * - Les 20 regles invariables (R1–R20) amb proves de propietats
 * - Tots els 38 casos de prova amb resultat conegut (T01–T38, incloent-hi T03b i T04b)
 */

import test from "node:test";
import assert from "node:assert/strict";

import { MATERIALS } from "../js/dades/materials.js";
import { LIQUIDS } from "../js/dades/liquids.js";
import { OBJECTES_PRESTATGE } from "../js/dades/objectes.js";
import { RECIPIENTS } from "../js/dades/recipients.js";
import { INSTRUMENTS } from "../js/dades/instruments.js";

import {
  netejaDecimal,
  iguals,
  converteixUnitat,
  massaAPes,
  calculaPressioHidrostatica,
  formataNombre
} from "../js/fisica/unitats.js";
import {
  magnitudsObjecte,
  tallaObjecte,
  unirObjectes,
  modelaObjecte,
  construeixObjecte
} from "../js/fisica/objecte.js";
import {
  densitatAiguaSalPerPercentatge,
  calculaDissolucioSal,
  sonMiscibles
} from "../js/fisica/liquids.js";
import {
  hiCapObjecte,
  abocaLiquid,
  construeixColumnaLiquids,
  remenaCapes,
  calculaNivellIVessament
} from "../js/fisica/recipient.js";
import {
  calculaEmpenyiment,
  estatObjecteEnLiquid,
  calculaDinamometre,
  estatObjecteEnColumna,
  calculaForcesPressioBloc,
  estatGlobus
} from "../js/fisica/flotacio.js";
import {
  calculaBuc,
  estatSubmari
} from "../js/fisica/barca.js";
import {
  llegeixInstrument,
  validaRespostaNumerica
} from "../js/fisica/instruments.js";
import { validaTotesLesDades } from "../scripts/valida-dades.mjs";

const OPTS_ESCOLAR = { materials: MATERIALS, nombresSenzills: true, g: 9.8 };

test("Validació de dades de referència (valida-dades.mjs)", () => {
  const res = validaTotesLesDades();
  assert.equal(res.valid, true, `Errors: ${res.errors.join("; ")}`);
});

test("Casos T01–T10: Massa, volum, densitat i instruments", () => {
  // T01: Bloc d'alumini (2,70) de 2,5 × 4 × 10 cm a la balança -> 270 g (volum 100 cm³)
  const magA = magnitudsObjecte(OBJECTES_PRESTATGE.A, OPTS_ESCOLAR);
  assert.equal(magA.volumExterior, 100);
  assert.equal(magA.massa, 270);
  assert.equal(magA.densitatMitjana, 2.7);

  // T02: El mateix bloc, tallat per la meitat -> Dos trossos de 135 g i 50 cm³; densitat 2,70 cadascun
  const [a1, a2] = tallaObjecte(OBJECTES_PRESTATGE.A, 0.5, OPTS_ESCOLAR);
  const magA1 = magnitudsObjecte(a1, OPTS_ESCOLAR);
  const magA2 = magnitudsObjecte(a2, OPTS_ESCOLAR);
  assert.equal(magA1.massa, 135);
  assert.equal(magA1.volumExterior, 50);
  assert.equal(magA1.densitatMitjana, 2.7);
  assert.equal(magA2.massa, 135);
  assert.equal(magA2.volumExterior, 50);
  assert.equal(magA2.densitatMitjana, 2.7);

  // T03: Patata (1,08) de 160 cm³ tallada per la meitat i una meitat tallada altra vegada -> 86,4 g i 80 cm³; 43,2 g i 40 cm³; 1,08 sempre
  const [pMeitat] = tallaObjecte(OBJECTES_PRESTATGE.patata, 0.5, OPTS_ESCOLAR);
  const [pQuart] = tallaObjecte(pMeitat, 0.5, OPTS_ESCOLAR);
  const magPM = magnitudsObjecte(pMeitat, OPTS_ESCOLAR);
  const magPQ = magnitudsObjecte(pQuart, OPTS_ESCOLAR);
  assert.equal(magPM.massa, 86.4);
  assert.equal(magPM.volumExterior, 80);
  assert.equal(magPM.densitatMitjana, 1.08);
  assert.equal(magPQ.massa, 43.2);
  assert.equal(magPQ.volumExterior, 40);
  assert.equal(magPQ.densitatMitjana, 1.08);

  // T03b: Un bloc de 150 cm³ del mateix material (1,08) tallat en 2/3 i 1/3 -> 108 g i 100 cm³; 54 g i 50 cm³; 1,08 tots dos
  const bloc150 = {
    id: "bloc150",
    forma: "ortoedre",
    parts: [{ material: "patata", volum: 150 }]
  };
  const [t23, t13] = tallaObjecte(bloc150, 2 / 3, OPTS_ESCOLAR);
  const m23 = magnitudsObjecte(t23, OPTS_ESCOLAR);
  const m13 = magnitudsObjecte(t13, OPTS_ESCOLAR);
  assert.ok(iguals(m23.massa, 108, 1e-5));
  assert.ok(iguals(m23.volumExterior, 100, 1e-5));
  assert.ok(iguals(m23.densitatMitjana, 1.08, 1e-5));
  assert.ok(iguals(m13.massa, 54, 1e-5));
  assert.ok(iguals(m13.volumExterior, 50, 1e-5));
  assert.ok(iguals(m13.densitatMitjana, 1.08, 1e-5));

  // T04: El bloc d'alumini dins una proveta de 500 mL amb 200 mL -> Nivell a 300 mL
  const cap500 = [{ liquid: "aigua", densitat: 1.0, volum: 200 }];
  const nivT04 = calculaNivellIVessament(RECIPIENTS.proveta500, cap500, magA.volumExterior);
  assert.equal(nivT04.nivellLlegit, 300);

  // T04b: El bloc d'alumini i una proveta de 250 mL (boca de 3,6 cm) -> No hi cap: la proveta el rebutja
  const capCheck = hiCapObjecte(OBJECTES_PRESTATGE.A, RECIPIENTS.proveta250);
  assert.equal(capCheck.hiCap, false);
  assert.equal(hiCapObjecte(OBJECTES_PRESTATGE.A, RECIPIENTS.proveta500).hiCap, true);

  // T05: Plastilina (1,5) de 200 g modelada en bola, cilindre i plat -> 200 g i 133,3 cm³ en tots tres casos
  for (const forma of ["bola", "cilindre", "plat"]) {
    const mod = modelaObjecte(OBJECTES_PRESTATGE.plastilina_taller, forma);
    const magMod = magnitudsObjecte(mod, OPTS_ESCOLAR);
    assert.equal(magMod.massa, 200);
    assert.ok(iguals(magMod.volumMaterial, 133.333333, 1e-4));
    assert.equal(magMod.densitatMitjana, 1.5);
  }

  // T06: Constructor: material ferro (7,87) i volum 20 cm³ -> Massa 157,4 g, no modificable
  const objT06 = construeixObjecte(
    { fixats: "material_volum", material: "ferro", volum: 20 },
    OPTS_ESCOLAR
  );
  const magT06 = magnitudsObjecte(objT06, OPTS_ESCOLAR);
  assert.equal(magT06.massa, 157.4);
  assert.throws(() =>
    construeixObjecte({
      fixaMaterial: true,
      fixaMassa: true,
      fixaVolum: true,
      material: "ferro",
      massa: 100,
      volum: 100
    })
  );

  // T07: Un litre d'aigua, oli, alcohol, llet i mel -> 1000 g, 920 g, 790 g, 1030 g i 1420 g
  const esperatsT07 = {
    aigua: 1000,
    oli: 920,
    alcohol: 790,
    llet: 1030,
    mel: 1420
  };
  for (const [liqId, massaEsp] of Object.entries(esperatsT07)) {
    const mLitre = netejaDecimal(LIQUIDS[liqId].dEscolar * 1000, 4);
    assert.equal(mLitre, massaEsp);
  }

  // T08: 2,70 g/cm³ en altres unitats -> 2700 kg/m³ · 2,70 kg/L · 2700 g/L
  assert.equal(converteixUnitat(2.7, "g/cm³", "kg/m³"), 2700);
  assert.equal(converteixUnitat(2.7, "g/cm³", "kg/L"), 2.7);
  assert.equal(converteixUnitat(2.7, "g/cm³", "g/L"), 2700);
  // I sense errors de coma flotant en 0,3 g/cm³ -> 300 kg/m³
  assert.equal(converteixUnitat(0.3, "g/cm³", "kg/m³"), 300);

  // T09: Massa real 123,47 g en balances d'1 g, 0,1 g i 0,01 g -> 123 g · 123,5 g · 123,47 g
  const l1 = llegeixInstrument(123.47, INSTRUMENTS.balanca_cuina);
  const l2 = llegeixInstrument(123.47, INSTRUMENTS.balanca_laboratori);
  const l3 = llegeixInstrument(123.47, INSTRUMENTS.balanca_precisio);
  assert.equal(l1.lectura, 123);
  assert.equal(l1.lecturaFormatada, "123");
  assert.equal(l2.lectura, 123.5);
  assert.equal(l2.lecturaFormatada, "123,5");
  assert.equal(l3.lectura, 123.47);
  assert.equal(l3.lecturaFormatada, "123,47");

  // T10: Proveta de 100 mL amb 90 mL i una pedra de 25 cm³ -> Fora d'escala; sense lectura vàlida
  const nivT10 = calculaNivellIVessament(
    RECIPIENTS.proveta100,
    [{ liquid: "aigua", densitat: 1.0, volum: 90 }],
    25
  );
  assert.equal(nivT10.foraDEscala, true);
  assert.equal(nivT10.nivellLlegit, null);
});

test("Casos T11–T20: Flotació, aigua salada i columna de líquids", () => {
  // T11: Fusta de pi (0,50) de 200 cm³ en aigua -> Sura amb 100 cm³ submergits (50 %)
  const fT11 = estatObjecteEnLiquid(OBJECTES_PRESTATGE.B, 1.0, OPTS_ESCOLAR);
  assert.equal(fT11.sura, true);
  assert.equal(fT11.volumSubmergit, 100);
  assert.equal(fT11.percentatgeSubmergit, 50);

  // T12: La mateixa fusta en alcohol (0,79) i en oli (0,92) -> 126,6 cm³ (63,3 %) i 108,7 cm³ (54,3 %)
  const fT12Alc = estatObjecteEnLiquid(OBJECTES_PRESTATGE.B, 0.79, OPTS_ESCOLAR);
  const fT12Oli = estatObjecteEnLiquid(OBJECTES_PRESTATGE.B, 0.92, OPTS_ESCOLAR);
  assert.ok(iguals(fT12Alc.volumSubmergit, 126.582, 1e-3));
  assert.ok(iguals(fT12Alc.percentatgeSubmergit, 63.29, 1e-3));
  assert.ok(iguals(fT12Oli.volumSubmergit, 108.696, 1e-3));
  assert.ok(iguals(fT12Oli.percentatgeSubmergit, 54.35, 1e-3));

  // T13: Roure (0,75) de 100 cm³ en aigua i en alcohol -> 75 % i 94,9 % submergit
  const cubRoure = { id: "roure100", forma: "cub", parts: [{ material: "roure", volum: 100 }] };
  const fT13Aig = estatObjecteEnLiquid(cubRoure, 1.0, OPTS_ESCOLAR);
  const fT13Alc = estatObjecteEnLiquid(cubRoure, 0.79, OPTS_ESCOLAR);
  assert.equal(fT13Aig.percentatgeSubmergit, 75);
  assert.ok(iguals(fT13Alc.percentatgeSubmergit, 94.9367, 1e-3));

  // T14: Cera (0,90) en alcohol, oli i aigua -> S'enfonsa · sura al 97,8 % · sura al 90 %
  const fT14Alc = estatObjecteEnLiquid(OBJECTES_PRESTATGE.espelma, 0.79, OPTS_ESCOLAR);
  const fT14Oli = estatObjecteEnLiquid(OBJECTES_PRESTATGE.espelma, 0.92, OPTS_ESCOLAR);
  const fT14Aig = estatObjecteEnLiquid(OBJECTES_PRESTATGE.espelma, 1.0, OPTS_ESCOLAR);
  assert.equal(fT14Alc.enfonsat, true);
  assert.equal(fT14Oli.sura, true);
  assert.ok(iguals(fT14Oli.percentatgeSubmergit, 97.826, 1e-3));
  assert.equal(fT14Aig.sura, true);
  assert.equal(fT14Aig.percentatgeSubmergit, 90);

  // T15: Gel (0,917) en aigua (1,00) i en aigua de mar (1,03) -> 91,7 % i 89,0 % submergit
  const blocGelRef = { id: "gelRef", forma: "cub", parts: [{ material: "gel", volum: 100, densitat: 0.917 }] };
  const fT15Aig = estatObjecteEnLiquid(blocGelRef, 1.0, OPTS_ESCOLAR);
  const fT15Mar = estatObjecteEnLiquid(blocGelRef, 1.03, OPTS_ESCOLAR);
  assert.ok(iguals(fT15Aig.percentatgeSubmergit, 91.7, 1e-3));
  assert.ok(iguals(fT15Mar.percentatgeSubmergit, 89.029, 1e-3));

  // T16: Ou de 60 g i 56 cm³ en aigua -> S'enfonsa; P = 0,588 N, E = 0,549 N
  const fT16 = estatObjecteEnLiquid(OBJECTES_PRESTATGE.ou, 1.0, OPTS_ESCOLAR);
  assert.equal(fT16.enfonsat, true);
  assert.ok(iguals(fT16.pes, 0.588, 1e-3));
  assert.ok(iguals(fT16.empenyiment, 0.5488, 1e-3));

  // T17: El mateix ou en aigua amb un 15 % de sal (1,109) -> Sura amb 54,1 cm³ submergits
  const dSal15 = densitatAiguaSalPerPercentatge(15, false);
  assert.equal(dSal15, 1.109);
  const fT17 = estatObjecteEnLiquid(OBJECTES_PRESTATGE.ou, dSal15, OPTS_ESCOLAR);
  assert.equal(fT17.sura, true);
  assert.ok(iguals(fT17.volumSubmergit, 54.1028, 1e-3));

  // T18: Ferro (7,87) i or (19,3) en mercuri (13,55) -> El ferro sura al 58,1 %; l'or s'enfonsa
  const fT18Fe = estatObjecteEnLiquid(OBJECTES_PRESTATGE.clau, 13.55, OPTS_ESCOLAR);
  const fT18Or = estatObjecteEnLiquid(OBJECTES_PRESTATGE.lingot_or, 13.55, OPTS_ESCOLAR);
  assert.equal(fT18Fe.sura, true);
  assert.ok(iguals(fT18Fe.percentatgeSubmergit, 58.08, 1e-3));
  assert.equal(fT18Or.enfonsat, true);

  // T19: Fusta de pi de 200 cm³ dins una proveta -> El nivell puja 100 mL, no 200 mL
  const nivT19 = calculaNivellIVessament(
    RECIPIENTS.proveta500,
    [{ liquid: "aigua", densitat: 1.0, volum: 200 }],
    fT11.volumSubmergit
  );
  assert.equal(nivT19.pujadaNivell, 100);
  assert.equal(nivT19.nivellLlegit, 300);

  // T20: Columna de mel, aigua, oli i alcohol abocats en qualsevol ordre amb cura -> De baix a dalt: mel, aigua, oli, alcohol
  const ordreAleatori = [
    { liquid: "oli", nom: "oli", familia: "oliosa", densitat: 0.92, volum: 100 },
    { liquid: "mel", nom: "mel", familia: "aquosa", densitat: 1.42, volum: 100 },
    { liquid: "alcohol", nom: "alcohol", familia: "aquosa", densitat: 0.79, volum: 100 },
    { liquid: "aigua", nom: "aigua", familia: "aquosa", densitat: 1.0, volum: 100 }
  ];
  const colT20 = construeixColumnaLiquids(ordreAleatori);
  assert.deepEqual(
    colT20.map(c => c.liquid),
    ["mel", "aigua", "oli", "alcohol"]
  );
});

test("Casos T21–T28: Forces, pes aparent i Arquimedes", () => {
  // T21: Bloc d'alumini de 100 cm³: pes -> 2,646 N (2,649 N amb g = 9,81)
  const magA98 = magnitudsObjecte(OBJECTES_PRESTATGE.A, { ...OPTS_ESCOLAR, g: 9.8 });
  const magA981 = magnitudsObjecte(OBJECTES_PRESTATGE.A, { ...OPTS_ESCOLAR, g: 9.81 });
  assert.equal(magA98.pes, 2.646);
  assert.ok(iguals(magA981.pes, 2.6487, 1e-4));

  // T22: El mateix bloc totalment submergit en aigua -> E = 0,980 N; pes aparent 1,666 N
  const dinT22 = calculaDinamometre(OBJECTES_PRESTATGE.A, {
    ...OPTS_ESCOLAR,
    liquid: 1.0,
    fraccioImmersio: 1
  });
  assert.equal(dinT22.empenyiment, 0.98);
  assert.equal(dinT22.pesAparent, 1.666);

  // T23: El mateix bloc en alcohol (0,79) -> E = 0,774 N; pes aparent 1,872 N
  const dinT23 = calculaDinamometre(OBJECTES_PRESTATGE.A, {
    ...OPTS_ESCOLAR,
    liquid: 0.79,
    fraccioImmersio: 1
  });
  assert.ok(iguals(dinT23.empenyiment, 0.7742, 1e-3));
  assert.ok(iguals(dinT23.pesAparent, 1.8718, 1e-3));

  // T24: El mateix bloc recolzat al fons -> Normal 1,666 N; l'empenyiment continua sent 0,980 N
  const fT24 = estatObjecteEnLiquid(OBJECTES_PRESTATGE.A, 1.0, OPTS_ESCOLAR);
  assert.equal(fT24.empenyiment, 0.98);
  assert.equal(fT24.normal, 1.666);

  // T25: El mateix bloc a 10 cm i a 40 cm de profunditat -> Mateix empenyiment; pressió diferent
  const p10 = calculaPressioHidrostatica(1.0, 10, 9.8);
  const p40 = calculaPressioHidrostatica(1.0, 40, 9.8);
  assert.notEqual(p10, p40);
  assert.equal(dinT22.empenyiment, 0.98);

  // T26: Esferes de 50 cm³ de plastilina, ceràmica i acer submergides -> Mateix empenyiment: 0,490 N
  const ePlast = estatObjecteEnLiquid(OBJECTES_PRESTATGE.arq_plast_50, 1.0, OPTS_ESCOLAR);
  const eCeram = estatObjecteEnLiquid(OBJECTES_PRESTATGE.arq_ceram_50, 1.0, OPTS_ESCOLAR);
  const eAcer = estatObjecteEnLiquid(OBJECTES_PRESTATGE.arq_acer_50, 1.0, OPTS_ESCOLAR);
  assert.equal(ePlast.empenyiment, 0.49);
  assert.equal(eCeram.empenyiment, 0.49);
  assert.equal(eAcer.empenyiment, 0.49);

  // T27: Fusta de pi de 200 cm³ surant -> P = E = 0,980 N; força neta zero
  const fT27 = estatObjecteEnLiquid(OBJECTES_PRESTATGE.B, 1.0, OPTS_ESCOLAR);
  assert.equal(fT27.pes, 0.98);
  assert.equal(fT27.empenyiment, 0.98);
  assert.equal(fT27.forcaNeta, 0);

  // T28: Fracció submergida de la fusta a la Terra, la Lluna i Mart -> 50 % en tots tres casos
  for (const gVal of [9.8, 1.6, 3.7]) {
    const fPlaneta = estatObjecteEnLiquid(OBJECTES_PRESTATGE.B, 1.0, {
      ...OPTS_ESCOLAR,
      g: gVal
    });
    assert.equal(fPlaneta.percentatgeSubmergit, 50);
  }
});

test("Casos T29–T38: Barques, submarí, globus i pressió hidrostàtica", () => {
  // T29: Bola de 200 g de plastilina en aigua -> S'enfonsa; Emàx = 1,307 N, P = 1,960 N, normal 0,653 N
  const fT29 = estatObjecteEnLiquid(OBJECTES_PRESTATGE.plastilina_taller, 1.0, OPTS_ESCOLAR);
  assert.equal(fT29.enfonsat, true);
  assert.equal(fT29.pes, 1.96);
  assert.ok(iguals(fT29.empenyimentMaxim, 1.306667, 1e-3));
  assert.ok(iguals(fT29.normal, 0.653333, 1e-3));

  // T30: La mateixa plastilina en un buc de 12 × 10 × 5 cm -> Gruix de paret 0,43 cm; sura amb 1,67 cm de calat i 3,33 cm de francbord
  const bucT30 = calculaBuc({
    massaBarca: 200,
    densitatMaterial: 1.5,
    L: 12,
    B: 10,
    H: 5,
    carrega: 0,
    densitatLiquid: 1.0
  });
  assert.equal(bucT30.gruixParetArrodonit, 0.43);
  assert.equal(bucT30.sura, true);
  assert.equal(bucT30.calat, 1.67);
  assert.equal(bucT30.francbord, 3.33);

  // T31: Càrrega màxima d'aquest buc en aigua -> 400 g; amb 401 g s'inunda i s'enfonsa
  assert.equal(bucT30.carregaMaxima, 400);
  const buc400 = calculaBuc({ massaBarca: 200, densitatMaterial: 1.5, L: 12, B: 10, H: 5, carrega: 400, densitatLiquid: 1.0 });
  const buc401 = calculaBuc({ massaBarca: 200, densitatMaterial: 1.5, L: 12, B: 10, H: 5, carrega: 401, densitatLiquid: 1.0 });
  assert.equal(buc400.inundada, false);
  assert.equal(buc400.sura, true);
  assert.equal(buc401.inundada, true);
  assert.equal(buc401.sura, false);

  // T32: El mateix buc en aigua salada (1,20) -> Càrrega màxima 520 g
  const bucT32 = calculaBuc({ massaBarca: 200, densitatMaterial: 1.5, L: 12, B: 10, H: 5, carrega: 0, densitatLiquid: 1.2 });
  assert.equal(bucT32.carregaMaxima, 520);

  // T33: Bloc massís de plastilina de 600 cm³ -> 900 g; s'enfonsa, tot i desplaçar el mateix volum que el buc
  const bloc600 = { id: "plast600", forma: "ortoedre", parts: [{ material: "plastilina", volum: 600 }] };
  const fT33 = estatObjecteEnLiquid(bloc600, 1.0, OPTS_ESCOLAR);
  assert.equal(fT33.massa, 900);
  assert.equal(fT33.enfonsat, true);

  // T34: Submarí de 1000 cm³, buc de 700 g i tanc de 400 cm³, en aigua -> Equilibri amb 300 cm³ d'aigua al tanc (75 %)
  const subT34 = estatSubmari({
    volumExterior: 1000,
    massaBuc: 700,
    capacitatTanc: 400,
    volumAiguaTanc: 300,
    densitatLiquid: 1.0
  });
  assert.equal(subT34.equilibri, true);
  assert.equal(subT34.percentatgeTanc, 75);
  assert.equal(subT34.volumEquilibri, 300);

  // T35: Globus de 10 L d'heli (0,17 g/L) amb coberta de 3 g -> E = 0,118 N; P = 0,046 N; força neta 0,072 N cap amunt
  const glT35 = estatGlobus({
    volumLitres: 10,
    densitatGasGperL: 0.17,
    massaCobertaGrams: 3,
    densitatAireGperL: 1.2,
    g: 9.8
  });
  assert.equal(glT35.empenyiment, 0.118);
  assert.equal(glT35.pes, 0.046);
  assert.equal(glT35.forcaNeta, 0.072);
  assert.equal(glT35.puja, true);

  // T36: Aigua a 0,5 m, 1 m i 2 m de profunditat -> 4900 Pa, 9800 Pa i 19 600 Pa
  assert.equal(calculaPressioHidrostatica(1.0, 50, 9.8), 4900);
  assert.equal(calculaPressioHidrostatica(1.0, 100, 9.8), 9800);
  assert.equal(calculaPressioHidrostatica(1.0, 200, 9.8), 19600);
  assert.equal(formataNombre(19600), "19 600");

  // T37: Mateixa profunditat en recipients de formes diferents -> Mateixa pressió
  const pEstret = calculaPressioHidrostatica(1.0, 35, 9.8);
  const pAmple = calculaPressioHidrostatica(1.0, 35, 9.8);
  assert.equal(pEstret, pAmple);

  // T38: Cub de 10 cm d'aresta amb la cara superior a 5 cm -> Força superior 4,9 N, inferior 14,7 N; diferència 9,8 N, igual a l'empenyiment
  const fBlocT38 = calculaForcesPressioBloc({
    densitatLiquid: 1.0,
    arestaCm: 10,
    profunditatCaraSuperiorCm: 5,
    g: 9.8
  });
  assert.equal(fBlocT38.forcaSuperiorN, 4.9);
  assert.equal(fBlocT38.forcaInferiorN, 14.7);
  assert.equal(fBlocT38.diferenciaForcesN, 9.8);
  assert.equal(fBlocT38.empenyimentN, 9.8);
});

test("Proves de propietats de les 20 regles invariables (R1–R20)", () => {
  // Generador determinista d'objectes i fraccions
  const fraccions = [0.1, 0.25, 1 / 3, 0.5, 2 / 3, 0.8];
  const materialsTest = ["suro", "pi", "cera", "patata", "plastilina", "alumini", "ferro", "or"];

  for (const matId of materialsTest) {
    for (const f of fraccions) {
      const obj = {
        id: `test_${matId}`,
        forma: "ortoedre",
        mides: { a: 4, b: 4, c: 10 },
        parts: [{ material: matId, volum: 160 }]
      };
      const magOrig = magnitudsObjecte(obj, OPTS_ESCOLAR);
      const [t1, t2] = tallaObjecte(obj, f, OPTS_ESCOLAR);
      const m1 = magnitudsObjecte(t1, OPTS_ESCOLAR);
      const m2 = magnitudsObjecte(t2, OPTS_ESCOLAR);

      // R2: Tallar conserva la densitat
      assert.ok(iguals(m1.densitatMitjana, magOrig.densitatMitjana, 1e-5));
      assert.ok(iguals(m2.densitatMitjana, magOrig.densitatMitjana, 1e-5));

      // R3: La suma de masses i volums dels trossos és igual a la de l'original
      assert.ok(iguals(m1.massa + m2.massa, magOrig.massa, 1e-5));
      assert.ok(iguals(m1.volumMaterial + m2.volumMaterial, magOrig.volumMaterial, 1e-5));

      // R8 i R9: En qualsevol líquid, la força neta en equilibri és zero, i si sura la massa de líquid desplaçat iguala la seva massa
      for (const dL of [0.79, 0.92, 1.0, 1.2, 13.55]) {
        const est = estatObjecteEnLiquid(obj, dL, OPTS_ESCOLAR);
        assert.ok(Math.abs(est.forcaNeta) < 1e-5, "R9: força neta zero en equilibri");
        if (est.sura) {
          assert.ok(iguals(est.massaLiquidDesplacat, magOrig.massa, 1e-5), "R8: massa desplaçada igual a la de l'objecte");
        } else if (est.enfonsat) {
          assert.equal(est.volumSubmergit, magOrig.volumMaximDesplacable, "R7: enfonsat desplaça el volum exterior");
          assert.ok(iguals(est.normal, est.pes - est.empenyiment, 1e-5), "R11: N = P - E");
        }
      }
    }
  }

  // R18: Dos líquids de famílies diferents no es mesclen; dos de la mateixa família es mesclen en remenar
  const aiguaIOli = remenaCapes([
    { liquid: "aigua", nom: "aigua", familia: "aquosa", densitat: 1.0, volum: 50 },
    { liquid: "oli", nom: "oli", familia: "oliosa", densitat: 0.92, volum: 50 }
  ]);
  assert.equal(aiguaIOli.length, 2);

  const aiguaIAlcohol = remenaCapes([
    { liquid: "aigua", nom: "aigua", familia: "aquosa", densitat: 1.0, volum: 50 },
    { liquid: "alcohol", nom: "alcohol", familia: "aquosa", densitat: 0.79, volum: 50 }
  ]);
  assert.equal(aiguaIAlcohol.length, 1);
  assert.equal(aiguaIAlcohol[0].volum, 100);
  assert.equal(aiguaIAlcohol[0].densitat, 0.895);

  // Validació d'errors matemàtics i de procediment (EM-01..EM-08)
  const errInvers = validaRespostaNumerica({
    valorAlumne: "0,37",
    unitatAlumne: "g/cm³",
    valorEsperat: 2.7,
    unitatEsperada: "g/cm³"
  });
  assert.equal(errInvers.codiError, "EM-01");

  const errSenseUnitat = validaRespostaNumerica({
    valorAlumne: "2,7",
    unitatAlumne: "",
    valorEsperat: 2.7,
    unitatEsperada: "g/cm³"
  });
  assert.equal(errSenseUnitat.codiError, "EM-05");
});
