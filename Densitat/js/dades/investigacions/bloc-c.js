/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Investigacions del bloc C (La densitat, C1–C10).
 * Basat en 05-cataleg-investigacions-1.md i 10-llengua-i-glossari.md.
 */

export const BLOC_C = [
  {
    id: "C1",
    titol: "Un quilo de palla i un quilo de ferro",
    pregunta: "Què pesa més, un quilo de palla o un quilo de ferro?",
    preguntaFacil: "Què té més massa, 1 kg de poliestirè o 1 kg de ferro?",
    bloc: "C",
    nivells: [1],
    fase: "1b",
    durada: 10,
    idees: ["IP-04"],
    escena: {
      taula: "mesura",
      objectes: ["quilo_poliestire", "quilo_pi", "quilo_alumini", "quilo_ferro"],
      liquids: [],
      recipients: [],
      instruments: ["balanca_cuina", "regle"],
      visibilitat: "experimental"
    },
    columnesDades: ["Material", "Massa (g)", "Volum (cm³)"],
    valorsEsperats: "Totes quatre peces tenen 1000 g (1 kg) de massa. Volums: poliestirè 20 000 cm³, pi 2000 cm³, alumini 370 cm³, ferro 127 cm³.",
    conclusio: "La mateixa massa pot ocupar volums molt diferents: en alguns materials la matèria està més concentrada.",
    conclusioFacil: "1 kg de poliestirè i 1 kg de ferro tenen la mateixa massa (1000 g), però el poliestirè ocupa molt més volum.",
    passos: [
      {
        tipus: "observa",
        text: "Mira les quatre peces del prestatge: poliestirè, fusta de pi, alumini i ferro. Totes quatre són molt diferents de mida.",
        facil: "Mira les quatre peces d'1 kg al prestatge."
      },
      {
        tipus: "prediu",
        text: "Quina de les quatre peces d'un quilo marcarà més massa a la balança?",
        facil: "Quina peça d'1 kg pesa més a la balança?",
        opcions: [
          { id: "ferro", text: "La de ferro, perquè el ferro és molt més pesant", idea: "IP-04" },
          { id: "poliestire", text: "La de poliestirè, perquè és molt més grossa", idea: "IP-02" },
          { id: "iguals", text: "Totes quatre marcaran exactament 1000 g (1 kg), però ocupen volums diferents", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè un quilogram és sempre una massa de 1000 g, sigui quin sigui el material", correcta: true },
          { id: "m2", text: "Perquè el metall sempre pesa més que el plàstic", idea: "IP-04" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Pesa almenys dues de les peces d'un quilo a la balança i mesura'n el volum amb el regle. Anota les lectures.",
        facil: "Pesa dues peces a la balança i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Porta la peça d'1 kg de ferro i la d'1 kg de pi a la balança.",
          "Comprova que totes dues marquen 1000 g.",
          "Activa el Regle per veure que el quilo de pi ocupa 2000 cm³ i el de ferro només 127 cm³."
        ]
      },
      {
        tipus: "explica",
        text: "Per què 1000 g de ferro ocupen un espai tan petit comparat amb 1000 g de poliestirè?",
        facil: "Per què el quilo de ferro és tan petit i el de poliestirè tan gran?",
        opcions: [
          { id: "e1", text: "Perquè al ferro la matèria està molt més concentrada en cada centímetre cúbic (té més densitat)", correcta: true },
          { id: "e2", text: "Perquè la balança s'equivoca amb els objectes grans", idea: "IP-02" }
        ]
      },
      {
        tipus: "aplica",
        text: "I si en lloc d'un quilo agaféssim un litre (1000 cm³) de ferro i un litre (1000 cm³) de fusta de pi: quants grams de massa tindria el litre de ferro (d = 7,87 g/cm³)?",
        facil: "Cada cm³ de ferro té 7,87 g. Quants grams pesen 1000 cm³ (1 litre) de ferro?",
        respostaNumerica: { valor: 7870, unitat: "g", toleranciaRelativa: 0.01 },
        pistes: [
          "1 litre són 1000 cm³. Cada cm³ de ferro té una massa de 7,87 g.",
          "Multiplica 7,87 g/cm³ × 1000 cm³.",
          "El resultat és 7870 g (o 7,87 kg)."
        ]
      }
    ]
  },
  {
    id: "C2",
    titol: "Cubs bessons",
    pregunta: "Cinc cubs iguals de mida. Pesen el mateix?",
    preguntaFacil: "Cinc cubs de la mateixa mida (10 cm³). Tenen la mateixa massa?",
    bloc: "C",
    nivells: [1],
    fase: "1b",
    durada: 10,
    idees: ["IP-04"],
    escena: {
      taula: "mesura",
      objectes: ["cub_suro_10", "cub_pi_10", "cub_alumini_10", "cub_ferro_10", "cub_plom_10"],
      liquids: [],
      recipients: [],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Material", "Volum (cm³)", "Massa (g)", "Massa de cada cubet d'1 cm³ (g)"],
    valorsEsperats: "Tots tenen 10 cm³. Masses: suro 2,5 g (0,25 g/cm³); pi 5,0 g (0,50 g/cm³); alumini 27,0 g (2,70 g/cm³); ferro 78,7 g (7,87 g/cm³); plom 113,0 g (11,30 g/cm³).",
    conclusio: "El mateix volum de materials diferents té masses diferents. Cada material té la seva «massa per cada centímetre cúbic».",
    conclusioFacil: "Els cinc cubs ocupen 10 cm³, però cadascun té una massa diferent. Cada material té els seus grams per cada cm³.",
    passos: [
      {
        tipus: "observa",
        text: "Mira els cinc cubs bessons del prestatge (suro, pi, alumini, ferro i plom). Tots cinc tenen exactament el mateix volum: 10 cm³.",
        facil: "Mira els cinc cubs. Tots tenen 10 cubets d'1 cm³."
      },
      {
        tipus: "prediu",
        text: "Quin és l'ordre dels cinc cubs de 10 cm³, de menys massa a més massa?",
        facil: "Ordena els cinc cubs del més lleuger al més pesant:",
        opcions: [
          { id: "ordre_bo", text: "Suro < pi < alumini < ferro < plom", correcta: true },
          { id: "iguals", text: "Tots pesen igual perquè tenen la mateixa mida (10 cm³)", idea: "IP-04" },
          { id: "ferro_mes", text: "Pi < suro < alumini < plom < ferro", idea: "IP-04" }
        ],
        motius: [
          { id: "m1", text: "Perquè en 1 cm³ de plom hi ha més massa que en 1 cm³ de ferro, d'alumini o de fusta", correcta: true },
          { id: "m2", text: "Perquè mateixa mida vol dir mateixa massa", idea: "IP-04" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Pesa almenys tres dels cubs bessons a la balança de laboratori, activa la vista «Cubets» i anota les mesures.",
        facil: "Pesa tres cubs a la balança i prem Anota. Activa el botó «Cubets».",
        condicio: { tipus: "anotacions_minimes", min: 3 },
        pistes: [
          "Porta el cub de suro (2,5 g), el d'alumini (27,0 g) i el de plom (113,0 g) a la balança i prem Anota a cadascun.",
          "Activa la vista «Cubets» a la barra superior per veure quants grams conté cada cubet d'1 cm³."
        ]
      },
      {
        tipus: "explica",
        text: "Si el cub d'alumini de 10 cm³ té una massa de 27 g, quants grams hi ha a cada cubet d'1 cm³ d'alumini?",
        facil: "10 cubets d'alumini pesen 27 g. Quant pesa 1 sol cubet d'1 cm³?",
        opcions: [
          { id: "e1", text: "2,7 g a cada cubet d'1 cm³ (27 g ÷ 10 cm³)", correcta: true },
          { id: "e2", text: "270 g a cada cubet", idea: "EM-01" }
        ]
      },
      {
        tipus: "aplica",
        text: "El cub de plom de 10 cm³ té una massa de 113 g. Quina és la massa de cada centímetre cúbic de plom (en g/cm³)?",
        facil: "10 cm³ de plom tenen 113 g de massa. Quants g/cm³ té el plom?",
        respostaNumerica: { valor: 11.3, unitat: "g/cm³", toleranciaRelativa: 0.01 },
        pistes: [
          "Divideix la massa total (113 g) entre els 10 cm³.",
          "113 ÷ 10 = 11,3 g/cm³.",
          "Escriu 11,3 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "C3",
    titol: "Construïm la densitat",
    pregunta: "Com podem comparar materials si els objectes tenen mides diferents?",
    preguntaFacil: "Com comparem dos materials si les peces no tenen la mateixa mida?",
    bloc: "C",
    nivells: [1, 2],
    fase: "1a",
    durada: 20,
    idees: ["IP-04", "EM-01", "EM-05"],
    escena: {
      taula: "mesura",
      objectes: ["A", "B", "C", "pedra"],
      liquids: ["aigua"],
      recipients: ["proveta500"],
      instruments: ["balanca_laboratori", "regle"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Massa (g)", "Volum (cm³)", "Densitat (g/cm³)"],
    valorsEsperats: "Bloc A (alumini): 270 g, 100 cm³, d = 2,70 g/cm³; Bloc B (pi): 100 g, 200 cm³, d = 0,50 g/cm³; Bola C (plastilina): 60 g, 40 cm³, d = 1,50 g/cm³. Aplica: pedra (granit) = 81 g / 30 cm³ = 2,70 g/cm³.",
    conclusio: "La densitat és la massa de cada unitat de volum: d = m / V.",
    conclusioFacil: "La densitat és el que pesa cada cm³. Es calcula dividint la massa entre el volum: d = m / V.",
    passos: [
      {
        tipus: "observa",
        text: "Mira els objectes A (bloc metàl·lic), B (bloc de fusta) i C (bola de plastilina). Tenen tant masses com volums diferents.",
        facil: "Mira els objectes A, B i C del prestatge."
      },
      {
        tipus: "prediu",
        text: "El bloc B és el més gran (200 cm³) i el bloc A és el que té més massa (270 g). Com podem saber en quin material està més concentrada la matèria?",
        facil: "Com podem saber quin material té més massa en cada cm³?",
        opcions: [
          { id: "massa_sola", text: "Mirant només quin pesa més a la balança", idea: "IP-04" },
          { id: "volum_sol", text: "Mirant només quin és més gran", idea: "IP-02" },
          { id: "quocient", text: "Calculant quants grams de massa hi ha a cada centímetre cúbic (massa dividida entre volum)", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè en repartir la massa entre els cm³ obtenim el que pesa 1 sol cm³ de cada material", correcta: true },
          { id: "m2", text: "Perquè la massa ja és la densitat", idea: "IP-04" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Mesura i anota la massa (a la balança) i el volum (a la proveta o amb el regle) del bloc A i utilitza la «Calculadora» per obtenir-ne la densitat.",
        facil: "Pesa el bloc A i mesura el seu volum a la proveta. Anota les dues mesures i calcula la densitat amb la Calculadora.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Posa el bloc A a la balança (270 g) i prem Anota.",
          "Posa el bloc A a la proveta de 500 mL (puja 100 mL) o usa el regle (100 cm³) i prem Anota.",
          "Obre la Calculadora a la barra d'eines, divideix 270 g ÷ 100 cm³ = 2,70 g/cm³ i prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Què passaria si dividíssim al revés: el volum (100 cm³) entre la massa (270 g)?",
        facil: "Per què dividim massa entre volum (m / V) i no al revés (V / m)?",
        opcions: [
          { id: "e1", text: "Obtindríem 0,37 cm³/g (l'espai que ocupa cada gram), en lloc de la massa de cada cm³ (2,70 g/cm³)", correcta: true },
          { id: "e2", text: "Dona el mateix resultat dividir d'una manera o de l'altra", idea: "EM-01" }
        ]
      },
      {
        tipus: "aplica",
        text: "Mesura la pedra (Pd) al laboratori (81 g i 30 cm³) i escriu la seva densitat amb la unitat corresponent.",
        facil: "La pedra Pd té 81 g de massa i 30 cm³ de volum. Quina és la seva densitat en g/cm³?",
        respostaNumerica: { valor: 2.7, unitat: "g/cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "Aplica la fórmula d = m / V amb les dades de la pedra: 81 g i 30 cm³.",
          "Divideix 81 ÷ 30 = 2,70.",
          "Escriu 2,7 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "C4",
    titol: "Tallem la patata",
    pregunta: "Si talles una patata per la meitat, què li passa a la densitat?",
    preguntaFacil: "Tallem una patata per la meitat. Canvia la seva densitat?",
    bloc: "C",
    nivells: [1, 2],
    fase: "1a",
    durada: 15,
    idees: ["IP-03", "IP-02"],
    escena: {
      taula: "mesura",
      objectes: ["patata"],
      liquids: ["aigua"],
      recipients: ["proveta500"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Tros", "Massa (g)", "Volum (cm³)", "Densitat (g/cm³)"],
    valorsEsperats: "Patata sencera: 172,8 g i 160 cm³ (d = 1,08 g/cm³); Meitat: 86,4 g i 80 cm³ (d = 1,08 g/cm³); Quart: 43,2 g i 40 cm³ (d = 1,08 g/cm³).",
    conclusio: "En tallar un objecte homogeni, la massa i el volum es redueixen en la mateixa proporció i la densitat no canvia. La densitat és una propietat intensiva del material.",
    conclusioFacil: "Quan tallem la patata per la meitat, té la meitat de massa i la meitat de volum, però la mateixa densitat (1,08 g/cm³).",
    passos: [
      {
        tipus: "observa",
        text: "Tenim una patata sencera (Pt). Pots pesar-la, mesurar-ne el volum a la proveta de 500 mL i tallar-la amb el botó «Talla» de la seva fitxa o al Taller.",
        facil: "Mira la patata Pt. Podem mesurar-la i tallar-la per la meitat."
      },
      {
        tipus: "prediu",
        text: "Si tallem la patata exactament per la meitat, com serà la densitat de cada meitat comparada amb la de la patata sencera?",
        facil: "Tallem la patata per la meitat. Quina densitat tindrà cada tros?",
        opcions: [
          { id: "meitat", text: "La meitat de densitat, perquè només hi ha mitja patata", idea: "IP-03" },
          { id: "igual", text: "Exactament la mateixa densitat, perquè la massa i el volum es redueixen tots dos a la meitat", correcta: true },
          { id: "doble", text: "El doble de densitat, perquè és més petita i compacta", idea: "IP-02" }
        ],
        motius: [
          { id: "m1", text: "Perquè hi ha la meitat de matèria", idea: "IP-03" },
          { id: "m2", text: "Perquè cada centímetre cúbic de patata continua tenint la mateixa massa", correcta: true },
          { id: "m3", text: "Perquè en fer-la petita es comprimeix", idea: "IP-02" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Mesura la massa i el volum de la patata, talla-la per la meitat (des de la fitxa de l'objecte o al Taller) i mesura un dels trossos.",
        facil: "Pesa la patata, talla-la amb el botó «Talla (1/2)» i pesa un dels trossos. Prem Anota.",
        condicio: { tipus: "tallat_o_anotat", min: 2 },
        pistes: [
          "Posa la patata a la balança (172,8 g) i a la proveta (160 cm³) i prem Anota.",
          "Clica sobre la patata i prem «Talla 1/2».",
          "Mesura un dels trossos (Pt1): 86,4 g i 80 cm³. Calcula 86,4 ÷ 80 = 1,08 g/cm³."
        ]
      },
      {
        tipus: "explica",
        text: "Què hem comprovat en comparar la densitat de la patata sencera, la meitat i el quart?",
        facil: "Què passa amb la densitat quan tallem un objecte?",
        opcions: [
          { id: "e1", text: "La massa i el volum depenen de la quantitat (extensives), però la densitat és pròpia del material i es manté constant (1,08 g/cm³)", correcta: true },
          { id: "e2", text: "Com més petits són els trossos, menys densos són", idea: "IP-03" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un lingot d'or té una densitat de 19,3 g/cm³. Quina és la densitat d'un anell petit fet del mateix or pur (en g/cm³)?",
        facil: "Un lingot gran d'or té 19,3 g/cm³. Quina densitat té un anell petit d'or pur?",
        respostaNumerica: { valor: 19.3, unitat: "g/cm³", toleranciaRelativa: 0.01 },
        pistes: [
          "La densitat és una propietat intensiva del material: no depèn de si la peça és un lingot gran o un anell petit.",
          "L'anell d'or pur té exactament la mateixa densitat que el lingot: 19,3 g/cm³.",
          "Escriu 19,3 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "C5",
    titol: "La recta de cada material",
    pregunta: "Quina forma té la gràfica de la massa i el volum d'un mateix material?",
    preguntaFacil: "Si dibuixem en una gràfica la massa i el volum de diverses peces d'alumini, què surt?",
    bloc: "C",
    nivells: [2],
    fase: "1b",
    durada: 20,
    idees: ["IP-02", "IP-03"],
    escena: {
      taula: "mesura",
      objectes: ["serie_al_10", "cilindre_alumini", "serie_al_50", "serie_al_80", "A", "serie_al_150", "B"],
      liquids: ["aigua"],
      recipients: ["proveta500"],
      instruments: ["balanca_laboratori", "regle"],
      visibilitat: "experimental"
    },
    columnesDades: ["Peça", "Volum (cm³)", "Massa (g)", "Densitat (g/cm³)"],
    valorsEsperats: "Peces d'alumini (10, 20, 50, 80, 100, 150 cm³ -> 27, 54, 135, 216, 270, 405 g) formen una recta que passa per (0, 0) amb pendent 2,70 g/cm³. Peça de 65 cm³ d'alumini = 175,5 g.",
    conclusio: "La massa és directament proporcional al volum. El pendent de la recta és la densitat, i cada material té la seva recta.",
    conclusioFacil: "Totes les peces d'un mateix material queden sobre una línia recta. El pendent de la recta és la densitat.",
    passos: [
      {
        tipus: "observa",
        text: "Al prestatge tenim diverses peces d'alumini de mides diferents (10, 20, 50, 80, 100 i 150 cm³). Obre l'eina «Gràfica» a la barra inferior.",
        facil: "Mira les peces d'alumini i obre l'eina «Gràfica»."
      },
      {
        tipus: "prediu",
        text: "Si representem el volum a l'eix horitzontal (X) i la massa a l'eix vertical (Y), com quedaran situats els punts de totes les peces d'alumini?",
        facil: "Com quedaran els punts de les peces d'alumini a la gràfica massa-volum?",
        opcions: [
          { id: "recta", text: "Alineats sobre una recta que passa per l'origen (0, 0)", correcta: true },
          { id: "horitzontal", text: "En una línia horitzontal, perquè tenen la mateixa densitat", idea: "IP-04" },
          { id: "escampats", text: "Escampats a l'atzar segons la mida", idea: "IP-02" }
        ],
        motius: [
          { id: "m1", text: "Perquè la massa és directament proporcional al volum (m = d · V) i el quocient m/V és constant", correcta: true },
          { id: "m2", text: "Perquè la densitat és constant i això fa una ratlla plana", idea: "IP-04" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Mesura i anota al quadern almenys dues peces d'alumini i obre la «Gràfica» per veure la recta i la frontera de l'aigua.",
        facil: "Anota la massa i el volum de dues peces d'alumini i mira la «Gràfica».",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Pesa Al-10 (27 g) i A (270 g) i prem Anota.",
          "Obre l'eina «Gràfica» a la barra inferior per veure com s'alineen els punts sobre la recta de pendent 2,70 g/cm³."
        ]
      },
      {
        tipus: "explica",
        text: "A la gràfica massa-volum, què representa el pendent (la inclinació) de la recta de cada material, i què indica la recta de l'aigua (pendent 1,00 g/cm³)?",
        facil: "Què vol dir que la recta d'un material estigui més inclinada (per sobre) que la de l'aigua?",
        opcions: [
          { id: "e1", text: "El pendent és la densitat: les rectes per sobre de la de l'aigua corresponen a materials més densos que s'enfonsen", correcta: true },
          { id: "e2", text: "Les rectes més inclinades corresponen a materials que suren", idea: "IP-01" }
        ]
      },
      {
        tipus: "aplica",
        text: "Segons la recta de l'alumini (pendent 2,70 g/cm³), quina massa en grams tindrà una peça d'alumini de 65 cm³?",
        facil: "Cada cm³ d'alumini té 2,70 g. Quants grams pesa una peça de 65 cm³?",
        respostaNumerica: { valor: 175.5, unitat: "g", toleranciaRelativa: 0.01 },
        pistes: [
          "Multiplica el volum (65 cm³) pel pendent de la recta (2,70 g/cm³).",
          "65 × 2,70 = 175,5 g.",
          "Escriu 175,5 i la unitat g."
        ]
      }
    ]
  },
  {
    id: "C6",
    titol: "Detectius de materials",
    pregunta: "De què està fet cada objecte?",
    preguntaFacil: "Pots descobrir de quin material està fet cada objecte misteri?",
    bloc: "C",
    nivells: [2, 3],
    fase: "1a",
    durada: 20,
    idees: ["EM-01", "EP-04", "EP-05"],
    escena: {
      taula: "mesura",
      objectes: ["misteri_1", "misteri_2", "misteri_3", "misteri_4", "misteri_5", "misteri_6"],
      liquids: ["aigua"],
      recipients: ["proveta100", "proveta250"],
      instruments: ["balanca_laboratori", "regle"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Massa (g)", "Volum (cm³)", "Densitat (g/cm³)", "Material identificat"],
    valorsEsperats: "M1: 108 g / 40 cm³ = 2,70 g/cm³ (alumini); M2: 236,1 g / 30 cm³ = 7,87 g/cm³ (ferro); M3: 224 g / 25 cm³ = 8,96 g/cm³ (coure); M4: 70 g / 50 cm³ = 1,40 g/cm³ (PVC); M5: 226 g / 20 cm³ = 11,30 g/cm³ (plom); M6: 170 g / 20 cm³ = 8,50 g/cm³ (llautó).",
    conclusio: "La densitat és una propietat característica que permet identificar materials comparant el valor experimental amb una taula de referència.",
    conclusioFacil: "Cada material té la seva densitat. Si mesurem la massa i el volum, podem saber de quin material és l'objecte mirant la taula.",
    passos: [
      {
        tipus: "observa",
        text: "Tenim sis objectes misteri (M1 a M6) pintats de gris neutre. Obre «Consulta → Densitats» per tenir a mà la taula de referència.",
        facil: "Mira els objectes misteri M1 a M6. Tots estan pintats de gris."
      },
      {
        tipus: "prediu",
        text: "Si dos objectes misteri estan pintats del mateix color i tenen mides diferents, com podem identificar de quin material està fet cadascun?",
        facil: "Com podem saber de quin material és l'objecte M1 si està pintat de gris?",
        opcions: [
          { id: "densitat", text: "Mesurant-ne la massa i el volum, calculant la densitat (d = m / V) i buscant-la a la taula de materials", correcta: true },
          { id: "massa", text: "Mirant només la massa a la balança", idea: "IP-04" },
          { id: "aigua", text: "Mirant només si s'enfonsa a l'aigua", idea: "IP-01" }
        ],
        motius: [
          { id: "m1", text: "Perquè la densitat és característica de cada substància independentment de la mida", correcta: true },
          { id: "m2", text: "Perquè cada material té un pes fix", idea: "IP-04" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Mesura la massa i el volum d'almenys dos objectes misteri (per exemple M1 i M2), calcula'n la densitat i identifica'ls amb la taula de Consulta.",
        facil: "Pesa M1, mesura el seu volum a la proveta i anota les dades.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Posa M1 a la balança (108,0 g) i a la proveta (puja 40 mL). 108 ÷ 40 = 2,70 g/cm³ (alumini).",
          "Posa M2 a la balança (236,1 g) i a la proveta (puja 30 mL). 236,1 ÷ 30 = 7,87 g/cm³ (ferro).",
          "Anota les mesures al quadern."
        ]
      },
      {
        tipus: "explica",
        text: " Tant l'alumini com el granit tenen una densitat de 2,70 g/cm³. Si un objecte misteri dona 2,70 g/cm³, n'hi ha prou amb la densitat per distingir si és d'alumini o de granit?",
        facil: "L'alumini i el granit tenen la mateixa densitat (2,70 g/cm³). Com els podem distingir?",
        opcions: [
          { id: "e1", text: "Cal observar una segona propietat característica, com l'aspecte cristal·lí, la conductivitat elèctrica o si és tallable", correcta: true },
          { id: "e2", text: "Són el mateix material perquè tenen la mateixa densitat", idea: "IP-04" }
        ]
      },
      {
        tipus: "aplica",
        text: "Et venen una «moneda d'or» que té una massa de 15,3 g i un volum d'1,8 cm³. Calcula'n la densitat (en g/cm³) per saber si és d'or pur (19,3 g/cm³) o de llautó (8,5 g/cm³).",
        facil: "Una moneda té 15,3 g de massa i 1,8 cm³ de volum. Calcula la seva densitat en g/cm³.",
        respostaNumerica: { valor: 8.5, unitat: "g/cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "Divideix la massa de la moneda (15,3 g) entre el seu volum (1,8 cm³).",
          "15,3 ÷ 1,8 = 8,5 g/cm³ (és de llautó, no d'or!).",
          "Escriu 8,5 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "C7",
    titol: "L'objecte impossible",
    pregunta: "Pots fabricar un objecte d'alumini de 100 g i 100 cm³?",
    preguntaFacil: "Podem fer un bloc massís d'alumini que pesi 100 g i ocupi 100 cm³?",
    bloc: "C",
    nivells: [2],
    fase: "1b",
    durada: 10,
    idees: ["IP-04"],
    escena: {
      taula: "taller",
      objectes: ["A", "B"],
      liquids: ["aigua"],
      recipients: ["vas600"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Material", "Massa (g)", "Volum (cm³)", "Densitat (g/cm³)"],
    valorsEsperats: "Un bloc massís d'alumini (2,70 g/cm³) de 100 cm³ té obligatòriament 270 g; i si és de 100 g ocupa 37,0 cm³. 1 kg de ferro ocupa 127,1 cm³.",
    conclusio: "El material (densitat), la massa i el volum d'un cos massís estan lligats per d = m / V: en fixar-ne dos, el tercer queda determinat.",
    conclusioFacil: "No podem triar alhora el material, la massa i el volum d'un bloc massís: si triem dues coses, la tercera surt sola.",
    passos: [
      {
        tipus: "observa",
        text: "A la taula del «Taller» tens el Constructor d'objectes, on pots triar dues de les tres magnituds: material (densitat), massa i volum.",
        facil: "Mira el Constructor d'objectes a la taula del Taller."
      },
      {
        tipus: "prediu",
        text: "Per què és impossible fabricar un bloc massís d'alumini pur (d = 2,70 g/cm³) que tingui alhora 100 g de massa i 100 cm³ de volum?",
        facil: "Per què un bloc massís d'alumini no pot tenir 100 g i 100 cm³ alhora?",
        opcions: [
          { id: "lligats", text: "Perquè un objecte de 100 g i 100 cm³ té densitat 1,00 g/cm³ (aigua), mentre que cada cm³ d'alumini té 2,70 g", correcta: true },
          { id: "possible", text: "Sí que és possible si el fem molt calent o el premem", idea: "IP-04" }
        ],
        motius: [
          { id: "m1", text: "Perquè la relació m = d · V fixa la tercera magnitud quan en triem dues", correcta: true },
          { id: "m2", text: "Perquè la massa i el volum són independents del material", idea: "IP-04" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Al Taller, utilitza el Constructor d'objectes per crear un objecte nou (per exemple, fixant material i volum) i pesa'l o anota'l al quadern.",
        facil: "Crea un objecte amb el Constructor del Taller.",
        condicio: { tipus: "objecte_construit_o_anotat", min: 1 },
        pistes: [
          "A la taula Taller, tria el material i el volum al Constructor i prem «Construeix al prestatge».",
          "Observa que la tercera casella es calcula automàticament."
        ]
      },
      {
        tipus: "explica",
        text: "Si volem fabricar un objecte massís de 500 g que suri a l'aigua (d < 1,00 g/cm³), com ha de ser el seu volum?",
        facil: "Perquè un objecte de 500 g suri a l'aigua, quin volum ha de tenir?",
        opcions: [
          { id: "e1", text: "Ha de tenir un volum superior a 500 cm³ (per exemple, 1000 cm³ de fusta de pi)", correcta: true },
          { id: "e2", text: "Ha de tenir un volum inferior a 500 cm³", idea: "IP-02" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un anunci ofereix «un lingot massís de ferro (d = 7,87 g/cm³) d'un quilo (1000 g) de la mida d'un terròs de sucre (2 cm³)». Quin volum real en cm³ ocupa 1000 g de ferro?",
        facil: "Divideix 1000 g entre la densitat del ferro (7,87 g/cm³). Quin volum en cm³ ocupa 1 kg de ferro?",
        respostaNumerica: { valor: 127.1, unitat: "cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "Usa la fórmula V = m / d amb m = 1000 g i d = 7,87 g/cm³.",
          "1000 ÷ 7,87 = 127,06 cm³.",
          "Escriu 127,1 i la unitat cm³."
        ]
      }
    ]
  },
  {
    id: "C8",
    titol: "La forma no enganya",
    pregunta: "Si aixafes una bola de plastilina, canvia la seva densitat?",
    preguntaFacil: "Si canviem la forma de la bola de plastilina sense fer-hi buits, canvia la densitat?",
    bloc: "C",
    nivells: [1, 2],
    fase: "1b",
    durada: 10,
    idees: ["IP-05"],
    escena: {
      taula: "mesura",
      objectes: ["C", "plastilina_taller"],
      liquids: ["aigua"],
      recipients: ["proveta250", "proveta100"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Forma", "Massa (g)", "Volum (cm³)", "Densitat (g/cm³)"],
    valorsEsperats: "Bola C (plastilina): 60 g i 40 cm³ en bola, en cilindre, en bloc i en plat compacte; d = 1,50 g/cm³ sempre. El cilindre prim (diàmetre 2,2 cm) cap a la proveta de 100 mL.",
    conclusio: "Canviar la forma d'un objecte massís no en canvia la massa, el volum de material ni la densitat.",
    conclusioFacil: "Si modelem la plastilina en bola, cilindre o bloc massís, té la mateixa massa, el mateix volum i la mateixa densitat (1,50 g/cm³).",
    passos: [
      {
        tipus: "observa",
        text: "Selecciona la bola de plastilina C (60 g, 40 cm³, diàmetre 4,2 cm). Pots modelar-la en formes compactes (bola, cilindre, bloc, plat) des de la seva fitxa o al Taller.",
        facil: "Mira la bola de plastilina C. Podem canviar-li la forma."
      },
      {
        tipus: "prediu",
        text: "Si modelem la bola de plastilina en un cilindre allargat o en un bloc, sense treure'n ni afegir-ne i sense deixar-hi aire a dins, què canviarà?",
        facil: "Fem un cilindre massís amb la mateixa bola de plastilina. Què canviarà?",
        opcions: [
          { id: "res", text: "Només canviarà la forma exterior: la massa, el volum i la densitat es mantindran iguals", correcta: true },
          { id: "volum", text: "Canviarà el volum i, per tant, la densitat", idea: "IP-05" },
          { id: "massa", text: "Pesarà menys quan sigui allargada", idea: "IP-05" }
        ],
        motius: [
          { id: "m1", text: "Perquè tenim la mateixa quantitat de plastilina i ocupa el mateix espai total", correcta: true },
          { id: "m2", text: "Perquè la forma allargada ocupa menys lloc", idea: "IP-05" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Mesura la bola C a la balança i a la proveta, modela-la en «cilindre» i torna-la a mesurar.",
        facil: "Pesa la bola C, canvia la seva forma a «cilindre» i torna-la a pesar i mesurar. Prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Pesa la bola C (60 g) i prem Anota.",
          "A la fitxa de l'objecte C (o al Taller), prem «Modela → Cilindre».",
          "Comprova que com a cilindre prim (diàmetre 2,2 cm) ara fins i tot cap a la proveta de 100 mL i continua desplaçant 40 mL!"
        ]
      },
      {
        tipus: "explica",
        text: "Per què modelar la bola C (diàmetre 4,2 cm) en un cilindre prim (diàmetre 2,2 cm) ens ajuda al laboratori?",
        facil: "Quin avantatge té fer un cilindre prim amb la plastilina?",
        opcions: [
          { id: "e1", text: "Perquè així passa per la boca d'una proveta més estreta (100 mL, boca 2,6 cm), que té més resolució", correcta: true },
          { id: "e2", text: "Perquè així la densitat de la plastilina disminueix", idea: "IP-05" }
        ]
      },
      {
        tipus: "aplica",
        text: "Si modelem 200 g de plastilina (d = 1,50 g/cm³) en un disc pla i massís, quin volum d'aigua (en cm³) desplaçarà quan s'enfonsi?",
        facil: "200 g de plastilina tenen densitat 1,50 g/cm³. Quin volum en cm³ ocupa, tingui la forma massissa que tingui?",
        respostaNumerica: { valor: 133.3, unitat: "cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "El volum de material no depèn de la forma: V = m / d.",
          "Divideix 200 g ÷ 1,50 g/cm³ = 133,3 cm³.",
          "Escriu 133,3 i la unitat cm³."
        ]
      }
    ]
  },
  {
    id: "C9",
    titol: "La densitat dels líquids",
    pregunta: "Com es mesura la densitat d'un líquid?",
    preguntaFacil: "Com mesurem la densitat de l'oli o de l'alcohol?",
    bloc: "C",
    nivells: [2],
    fase: "1b",
    durada: 15,
    idees: ["EP-01", "EP-02"],
    escena: {
      taula: "mesura",
      objectes: [],
      liquids: ["aigua", "oli", "alcohol", "glicerina"],
      recipients: ["proveta100", "matras100"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Líquid", "Volum (mL)", "Massa neta (g)", "Densitat (g/mL)"],
    valorsEsperats: "50 mL d'aigua = 50,0 g (1,00 g/mL); 50 mL d'oli = 46,0 g (0,92 g/mL); 50 mL d'alcohol = 39,5 g (0,79 g/mL); 50 mL de glicerina = 63,0 g (1,26 g/mL).",
    conclusio: "Els líquids també tenen una densitat característica, que es mesura dividint la massa neta (amb tara) pel volum llegit a la proveta o al matràs aforat.",
    conclusioFacil: "Per saber la densitat d'un líquid, fem la tara del recipient buit, hi posem el líquid i dividim la massa entre el volum.",
    passos: [
      {
        tipus: "observa",
        text: "Tenim la balança de laboratori, la proveta de 100 mL (o el matràs aforat de 100 mL) i ampolles d'aigua, oli, alcohol i glicerina.",
        facil: "Mira la balança, la proveta i les ampolles de líquids."
      },
      {
        tipus: "prediu",
        text: "Quin error cometria un alumne si aboqués 50 mL d'oli a la proveta de 100 mL (que buida pesa 80 g), la posés a la balança sense tarar (126 g) i dividís 126 g ÷ 50 mL = 2,52 g/mL?",
        facil: "La proveta buida pesa 80 g i amb 50 mL d'oli pesa 126 g. Per què no podem dividir 126 ÷ 50?",
        opcions: [
          { id: "tara", text: "Perquè estaria incloent els 80 g del vidre de la proveta dins la massa del líquid (error EP-01)", correcta: true },
          { id: "correcte", text: "Cap error: la densitat de l'oli és 2,52 g/mL", idea: "EP-01" }
        ],
        motius: [
          { id: "m1", text: "Perquè la densitat del líquid es calcula només amb la massa del líquid (126 − 80 = 46 g)", correcta: true },
          { id: "m2", text: "Perquè el vidre i l'oli formen un sol cos", idea: "EP-01" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Mesura la massa neta i el volum d'almenys un líquid (oli, alcohol o glicerina) i anota-ho al quadern.",
        facil: "Fes la tara del recipient buit, aboca-hi un líquid i anota la massa i el volum.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Prem Tara a la balança amb el recipient buit.",
          "Aboca oli o glicerina a la proveta i anota tant el volum (mL) com la massa (g)."
        ]
      },
      {
        tipus: "explica",
        text: "Per què un matràs aforat de 100,0 mL és tan útil per mesurar la densitat d'un líquid?",
        facil: "Per a què serveix el matràs aforat de 100 mL?",
        opcions: [
          { id: "e1", text: "Perquè té un coll estret amb una marca única que dona un volum molt exacte de 100,0 mL", correcta: true },
          { id: "e2", text: "Perquè serveix per submergir-hi patates grans", idea: "EP-05" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un matràs aforat buit té una massa de 60,0 g. Ple fins a la marca de 100,0 mL amb un líquid desconegut, té una massa total de 186,0 g. Quina és la densitat del líquid (en g/mL)?",
        facil: "El matràs buit pesa 60 g i amb 100 mL de líquid pesa 186 g. Calcula la densitat del líquid en g/mL.",
        respostaNumerica: { valor: 1.26, unitat: "g/mL", toleranciaRelativa: 0.02 },
        pistes: [
          "Resta primer la massa del matràs buit: 186,0 g − 60,0 g = 126,0 g de líquid.",
          "Divideix la massa del líquid (126,0 g) entre el volum (100,0 mL).",
          "126 ÷ 100 = 1,26 g/mL (és glicerina!)."
        ]
      }
    ]
  },
  {
    id: "C10",
    titol: "Dues balances, una veritat?",
    pregunta: "Si dues balances donen números diferents, quina té raó?",
    preguntaFacil: "Per què tres balances diferents donen tres lectures diferents per a la mateixa peça?",
    bloc: "C",
    nivells: [2, 3],
    fase: "2",
    durada: 15,
    idees: ["EM-08"],
    escena: {
      taula: "mesura",
      objectes: ["peca_precisio", "A"],
      liquids: ["aigua"],
      recipients: ["proveta100"],
      instruments: ["balanca_cuina", "balanca_laboratori", "balanca_precisio"],
      visibilitat: "experimental"
    },
    columnesDades: ["Instrument", "Resolució", "Lectura (g)", "Densitat calculada (g/cm³)"],
    valorsEsperats: "Peça calibrada (massa real 123,47 g): balança de cuina (1 g) -> 123 g; balança de laboratori (0,1 g) -> 123,5 g; balança de precisió (0,01 g) -> 123,47 g.",
    conclusio: "Cap mesura és infinitament exacta. La resolució de l'instrument determina l'arrodoniment i limita les xifres significatives del resultat.",
    conclusioFacil: "Totes tres balances funcionen bé: cadascuna arrodoneix segons la seva resolució (1 g, 0,1 g o 0,01 g).",
    passos: [
      {
        tipus: "observa",
        text: "Posa la peça calibrada Pr (massa real 123,47 g) a la balança i canvia el model de balança entre cuina (1 g), laboratori (0,1 g) i precisió (0,01 g).",
        facil: "Mira la peça calibrada Pr i els tres models de balança."
      },
      {
        tipus: "prediu",
        text: "La peça Pr té una massa real de 123,47 g. Què marcaran les balances d'1 g, de 0,1 g i de 0,01 g de resolució?",
        facil: "Què marcarà cada balança per a una massa de 123,47 g?",
        opcions: [
          { id: "arrodonit", text: "123 g a la d'1 g, 123,5 g a la de 0,1 g i 123,47 g a la de 0,01 g", correcta: true },
          { id: "truncat", text: "123 g, 123,4 g i 123,47 g", idea: "EM-08" },
          { id: "espatllades", text: "Dues de les tres balances estan espatllades perquè donen números diferents", idea: "EM-08" }
        ],
        motius: [
          { id: "m1", text: "Perquè cada instrument arrodoneix al múltiple més proper de la seva resolució", correcta: true },
          { id: "m2", text: "Perquè les balances tallen els decimals sense arrodonir", idea: "EM-08" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Pesa la peça Pr canviant el model de balança i anota almenys dues lectures amb resolucions diferents.",
        facil: "Pesa la peça Pr amb dues balances diferents i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Posa la peça Pr al plat de la balança.",
          "Canvia el selector de model de balança (Cuina 1 g → Laboratori 0,1 g → Precisió 0,01 g) i prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Per què no té sentit escriure «d = 2,6842105 g/cm³» si hem mesurat amb una balança d'1 g i una proveta d'1 mL?",
        facil: "Per què no hem de copiar tots els decimals de la calculadora?",
        opcions: [
          { id: "e1", text: "Perquè el resultat d'un càlcul no pot tenir més precisió de la que permeten els instruments utilitzats (error EM-08)", correcta: true },
          { id: "e2", text: "Perquè com més decimals escrivim, més exacta és la nostra mesura", idea: "EM-08" }
        ]
      },
      {
        tipus: "aplica",
        text: "Quina lectura (en g) donarà una balança de laboratori (resolució 0,1 g) per a un objecte la massa real del qual és 84,66 g?",
        facil: "Arrodoneix 84,66 g a una dècima de gram (0,1 g):",
        respostaNumerica: { valor: 84.7, unitat: "g", toleranciaAbsoluta: 0.01 },
        pistes: [
          "La centèsima és 6 (≥ 5), de manera que la dècima puja de 6 a 7.",
          "84,66 g arrodonit a 0,1 g és 84,7 g.",
          "Escriu 84,7 i la unitat g."
        ]
      }
    ]
  }
];
