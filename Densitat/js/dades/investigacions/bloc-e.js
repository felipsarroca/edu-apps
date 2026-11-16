/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Investigacions del bloc E (Forces i Arquimedes, E1–E7).
 * Basat en 06-cataleg-investigacions-2.md i 10-llengua-i-glossari.md.
 */

export const BLOC_E = [
  {
    id: "E1",
    titol: "El pes que desapareix",
    pregunta: "Un objecte pesa el mateix dins de l'aigua que fora?",
    preguntaFacil: "El dinamòmetre marca el mateix quan l'objecte és fora de l'aigua i quan és a dins?",
    bloc: "E",
    nivells: [3],
    fase: "2",
    durada: 15,
    idees: ["IP-11", "EM-06"],
    escena: {
      taula: "tanc",
      objectes: ["A", "pedra"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["dinamometre_5"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Pes a l'aire P (N)", "Pes aparent Pa (N)", "Empenyiment E (N)"],
    valorsEsperats: "Bloc A (270 g, 100 cm³): P = 2,65 N a l'aire; Pa = 1,67 N submergit en aigua; E = P − Pa = 0,98 N. Pedra (81 g, 30 cm³): P = 0,79 N; Pa = 0,50 N; E = 0,29 N.",
    conclusio: "L'aigua empeny cap amunt tots els objectes submergits, també els que s'enfonsen. Aquesta força és l'empenyiment: E = P − Pa.",
    conclusioFacil: "Dins l'aigua sembla que els objectes pesin menys (pes aparent) perquè l'aigua els empeny cap amunt amb una força anomenada empenyiment.",
    passos: [
      {
        tipus: "observa",
        text: "A la taula del «Tanc» tenim el dinamòmetre sensible amb suport regulable i el bloc metàl·lic A (270 g, 100 cm³).",
        facil: "Mira el dinamòmetre i el bloc A a la taula del Tanc."
      },
      {
        tipus: "prediu",
        text: "El bloc metàl·lic A s'enfonsa a l'aigua i a l'aire pesa 2,65 N. Què marcarà el dinamòmetre quan submergim el bloc dins de l'aigua (sense tocar el fons)?",
        facil: "Fora de l'aigua el bloc A pesa 2,65 N. Què marcarà el dinamòmetre dins l'aigua?",
        opcions: [
          { id: "igual", text: "Marcarà 2,65 N igualment, perquè com que s'enfonsa l'aigua no l'empeny", idea: "IP-11" },
          { id: "menys", text: "Marcarà menys (1,67 N), perquè l'aigua l'empeny cap amunt amb una força de 0,98 N", correcta: true },
          { id: "zero", text: "Marcarà 0 N tan bon punt toqui l'aigua", idea: "IP-11" }
        ],
        motius: [
          { id: "m1", text: "Perquè tot cos submergit rep un empenyiment vertical cap amunt que resta al pes real", correcta: true },
          { id: "m2", text: "Perquè l'aigua només empeny la fusta i els objectes que suren", idea: "IP-11" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Penja el bloc A del dinamòmetre, anota el seu pes a l'aire (2,65 N), baixa'l amb el control fins a submergir-lo en l'aigua i anota el pes aparent (1,67 N).",
        facil: "Penja el bloc A del dinamòmetre, baixa'l dins l'aigua i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Selecciona el bloc A i porta'l al dinamòmetre del Tanc.",
          "Amb el control d'immersió a 0 % (a l'aire) marca 2,65 N; en baixar-lo al 100 % (dins l'aigua) marca 1,67 N.",
          "Prem Anota al dinamòmetre."
        ]
      },
      {
        tipus: "explica",
        text: "Si baixem encara més el suport fins que el bloc A reposa al fons del tanc i el fil queda fluix, ha deixat l'aigua d'empènyer-lo cap amunt?",
        facil: "Quan el bloc toca el fons del tanc, l'aigua continua empenyent-lo?",
        opcions: [
          { id: "e1", text: "L'aigua continua exercint 0,98 N d'empenyiment; la resta fins a 2,65 N (1,67 N) la sosté la força normal del fons", correcta: true },
          { id: "e2", text: "Al fons ja no hi ha empenyiment", idea: "IP-11" }
        ]
      },
      {
        tipus: "aplica",
        text: "Una roca pesa 686 N fora de l'aigua i, quan està totalment submergida, l'aigua hi exerceix un empenyiment de 254 N. Quina força (pes aparent, en N) cal fer per aixecar-la dins de l'aigua?",
        facil: "La roca pesa 686 N i l'aigua ajuda empenyent 254 N cap amunt. Quina força en N cal fer per sostenir-la dins l'aigua (686 − 254)?",
        respostaNumerica: { valor: 432, unitat: "N", toleranciaRelativa: 0.01 },
        pistes: [
          "El pes aparent és Pa = P − E.",
          "Resta 686 N − 254 N = 432 N.",
          "Escriu 432 i la unitat N."
        ]
      }
    ]
  },
  {
    id: "E2",
    titol: "L'aigua desplaçada",
    pregunta: "Quanta aigua fa vessar cada objecte?",
    preguntaFacil: "Quanta aigua surt pel bec del vas de vessament quan hi posem un objecte?",
    bloc: "E",
    nivells: [2, 3],
    fase: "2",
    durada: 15,
    idees: ["IP-10", "IP-14"],
    escena: {
      taula: "tanc",
      objectes: ["cilindre_alumini", "cilindre_plom", "B"],
      liquids: ["aigua"],
      recipients: ["vasVessament"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Massa (g)", "Volum (cm³)", "Volum vessat (mL)", "Massa aigua vessada (g)"],
    valorsEsperats: "Cilindres d'alumini (54 g) i plom (226 g) de 20 cm³ -> fan vessar 20 mL (20 g d'aigua) cadascun. Bloc de fusta B (100 g, 200 cm³) que sura -> fa vessar 100 mL (100 g d'aigua, igual a la massa del bloc).",
    conclusio: "Un objecte enfonsat desplaça un volum d'aigua igual al seu volum total. Un objecte que sura desplaça una quantitat d'aigua que té exactament la seva mateixa massa.",
    conclusioFacil: "Si l'objecte s'enfonsa, vessa el seu volum. Si l'objecte sura, l'aigua que vessa pesa exactament igual que l'objecte!",
    passos: [
      {
        tipus: "observa",
        text: "Tenim el muntatge del vas de vessament (ple d'aigua fins al bec) amb el vas col·lector situat a sobre d'una balança.",
        facil: "Mira el vas de vessament i el vas petit sobre la balança."
      },
      {
        tipus: "prediu",
        text: "El bloc de fusta B té un volum de 200 cm³ i una massa de 100 g (sura amb la meitat submergida). Quants mil·lilitres (i grams) d'aigua farà vessar al vas col·lector?",
        facil: "El bloc de fusta B fa 200 cm³ i pesa 100 g (sura per la meitat). Quanta aigua farà vessar?",
        opcions: [
          { id: "zero", text: "0 mL, perquè com que sura no desplaça aigua", idea: "IP-14" },
          { id: "cent", text: "100 mL (100 g d'aigua), que corresponen a la meitat submergida i igualen els 100 g del bloc", correcta: true },
          { id: "dos_cents", text: "200 mL, perquè tot el bloc ocupa 200 cm³", idea: "EP-04" }
        ],
        motius: [
          { id: "m1", text: "Perquè només desplaça aigua la part que queda sota la superfície, i la massa d'aquesta aigua iguala la massa de l'objecte que sura", correcta: true },
          { id: "m2", text: "Perquè els objectes que suren no entren a l'aigua", idea: "IP-14" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Introdueix el bloc B o un dels cilindres al tanc / vas de vessament i anota el volum i la massa de l'aigua desplaçada.",
        facil: "Posa el bloc B a l'aigua i anota l'aigua desplaçada.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Porta el bloc B al tanc / vas de vessament.",
          "Observa al vas col·lector que s'han recollit 100 mL (100 g) d'aigua desplaçada i prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Amb quina magnitud del bloc de fusta B (que sura) coincideix exactament la massa dels 100 mL d'aigua vessada?",
        facil: "Els 100 mL d'aigua que han sortit pesen 100 g. Amb què coincideix?",
        opcions: [
          { id: "e1", text: "Coincideix exactament amb la massa del bloc de fusta B (100 g)", correcta: true },
          { id: "e2", text: "Coincideix amb el volum total del bloc (200 cm³)", idea: "EP-04" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un vaixell de joguina de 350 g de massa es posa a surar en un vas de vessament ple d'aigua fins al bec. Quants grams (g) d'aigua cauran al vas col·lector?",
        facil: "Un vaixell de 350 g sura a l'aigua. Quants grams (g) d'aigua desplaça?",
        respostaNumerica: { valor: 350, unitat: "g", toleranciaRelativa: 0.01 },
        pistes: [
          "Tot objecte que sura desplaça una massa de líquid exactament igual a la seva pròpia massa (regla R8).",
          "Si el vaixell té una massa de 350 g, desplaça 350 g d'aigua.",
          "Escriu 350 i la unitat g."
        ]
      }
    ]
  },
  {
    id: "E3",
    titol: "El principi d'Arquimedes",
    pregunta: "Amb què coincideix l'empenyiment?",
    preguntaFacil: "Quant val la força d'empenyiment que fa un líquid?",
    bloc: "E",
    nivells: [3],
    fase: "2",
    durada: 25,
    idees: ["IP-13", "EM-07"],
    escena: {
      taula: "tanc",
      objectes: ["arq_plast_20", "arq_ceram_20", "arq_acer_20", "arq_plast_50", "arq_ceram_50", "arq_acer_50"],
      liquids: ["aigua", "alcohol"],
      recipients: ["vasVessament"],
      instruments: ["dinamometre_5", "balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Esfera", "Pes P (N)", "Pes aparent Pa (N)", "Empenyiment E (N)", "Volum desplaçat (cm³)", "Pes líquid desplaçat (N)"],
    valorsEsperats: "En aigua: les 3 esferes de 20 cm³ desplacen 20 g d'aigua i reben E = 0,196 N (≈ 0,20 N); les 3 esferes de 50 cm³ desplacen 50 g d'aigua i reben E = 0,490 N. Aplica: esfera de 35 cm³ en alcohol (0,79 g/cm³) -> E = 0,271 N.",
    conclusio: "Principi d'Arquimedes: tot cos submergit en un fluid experimenta un empenyiment vertical cap amunt igual al pes del fluid desplaçat (E = dL · g · Vsub).",
    conclusioFacil: "L'empenyiment (E) és exactament igual al pes del líquid que l'objecte aparta (E = dL · g · V).",
    passos: [
      {
        tipus: "observa",
        text: "Disposem de sis esferes d'Arquimedes (plastilina, ceràmica i acer, de 20 cm³ i de 50 cm³) i del muntatge complet amb dinamòmetre i vas de vessament.",
        facil: "Mira les sis esferes AP20..AA50 i el muntatge d'Arquimedes."
      },
      {
        tipus: "prediu",
        text: "Les tres esferes de 50 cm³ són de plastilina (75 g), ceràmica (120 g) i acer (392,5 g). Quan les submergim del tot en aigua, quina rebrà més empenyiment?",
        facil: "Les tres esferes de 50 cm³ tenen la mateixa mida però pesen molt diferent. Quina rebrà més empenyiment?",
        opcions: [
          { id: "acer", text: "La d'acer, perquè pesa molt més", idea: "IP-13" },
          { id: "plastilina", text: "La de plastilina, perquè és més lleugera", idea: "IP-13" },
          { id: "igual", text: "Totes tres rebran exactament el mateix empenyiment (0,49 N), perquè desplacen els mateixos 50 cm³ d'aigua", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè l'empenyiment és igual al pes de l'aigua desplaçada (50 g -> 0,49 N), sigui quin sigui el material de l'esfera", correcta: true },
          { id: "m2", text: "Perquè l'empenyiment depèn del pes de l'objecte", idea: "IP-13" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Submergeix almenys dues de les esferes de 50 cm³ amb el dinamòmetre i comprova que l'empenyiment E = P − Pa coincideix amb el pes del líquid recollit al vas col·lector.",
        facil: "Mesura amb el dinamòmetre l'esfera de plastilina i la d'acer de 50 cm³ i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Penja AP50 (plastilina 50 cm³) o AA50 (acer 50 cm³) al dinamòmetre i baixa-la dins l'aigua.",
          "Observa que en tots dos casos l'empenyiment val 0,49 N, que és exactament el pes dels 50 g d'aigua desplaçada!",
          "Prem Anota per desar-ho al quadern."
        ]
      },
      {
        tipus: "explica",
        text: "Amb quina columna de la taula coincideix sempre el valor de l'empenyiment E (en N), tant en aigua com en alcohol?",
        facil: "Amb què coincideix sempre l'empenyiment E en newtons?",
        opcions: [
          { id: "e1", text: "Amb el pes del líquid desplaçat: E = mL · g = dL · g · Vsub", correcta: true },
          { id: "e2", text: "Amb el pes de l'objecte submergit", idea: "IP-13" }
        ]
      },
      {
        tipus: "aplica",
        text: "Prediu amb la fórmula d'Arquimedes (E = dL · g · V) quin empenyiment en newtons (N) rebrà una esfera de 35 cm³ totalment submergida en alcohol (dL = 0,79 g/cm³ = 790 kg/m³, amb g = 9,8 N/kg).",
        facil: "35 cm³ d'alcohol pesen 35 × 0,79 = 27,65 g (0,02765 kg). Multiplica per 9,8 N/kg per trobar l'empenyiment en N:",
        respostaNumerica: { valor: 0.271, unitat: "N", toleranciaRelativa: 0.03 },
        pistes: [
          "La massa d'alcohol desplaçat és 35 cm³ × 0,79 g/cm³ = 27,65 g = 0,02765 kg.",
          "Multiplica per g = 9,8 N/kg: 0,02765 × 9,8 = 0,271 N.",
          "Escriu 0,27 i la unitat N."
        ]
      }
    ]
  },
  {
    id: "E4",
    titol: "Arquimedes quan sura",
    pregunta: "Els objectes que suren també compleixen el principi d'Arquimedes?",
    preguntaFacil: "Quan una esfera sura a l'aigua, quant val l'empenyiment?",
    bloc: "E",
    nivells: [3],
    fase: "2",
    durada: 15,
    idees: ["IP-14", "IP-15"],
    escena: {
      taula: "tanc",
      objectes: ["esf_sura_cera", "esf_sura_polietile", "esf_sura_pi", "esf_sura_suro"],
      liquids: ["aigua"],
      recipients: ["vasVessament"],
      instruments: ["dinamometre_5", "balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Esfera (50 cm³)", "Pes P (N)", "Volum desplaçat (cm³)", "Pes líquid desplaçat E (N)"],
    valorsEsperats: "Esferes de 50 cm³ en aigua: cera (45 g, P = 0,441 N) desplaça 45 cm³ (E = 0,441 N); polietilè (47,5 g, P = 0,466 N) desplaça 47,5 cm³; pi (25 g, P = 0,245 N) desplaça 25 cm³; suro (12,5 g, P = 0,123 N) desplaça 12,5 cm³.",
    conclusio: "Un objecte que sura s'enfonsa just fins que el pes del líquid desplaçat (l'empenyiment) iguala el seu propi pes (E = P).",
    conclusioFacil: "Quan un objecte sura, l'empenyiment cap amunt és exactament igual al seu pes cap avall (E = P).",
    passos: [
      {
        tipus: "observa",
        text: "Tenim quatre esferes de 50 cm³ que suren a l'aigua: cera (45 g), polietilè (47,5 g), pi (25 g) i suro (12,5 g).",
        facil: "Mira les quatre esferes que suren: SC, SPo, SPi i SSu."
      },
      {
        tipus: "prediu",
        text: "Quina de les quatre esferes de 50 cm³ desplaçarà menys aigua i rebrà menys empenyiment quan suri lliurement?",
        facil: "Quina esfera apartarà menys aigua quan suri?",
        opcions: [
          { id: "suro", text: "La de suro (12,5 g), perquè com que pesa menys ja assoleix l'equilibri (E = P) desplaçant només 12,5 cm³ d'aigua", correcta: true },
          { id: "totes_50", text: "Totes quatre desplaçaran 50 cm³ perquè totes fan 50 cm³", idea: "EP-04" },
          { id: "cap", text: "Cap, perquè quan suren el seu empenyiment és més gran que el seu pes", idea: "IP-15" }
        ],
        motius: [
          { id: "m1", text: "Perquè en equilibri de flotació l'empenyiment iguala el pes de cada esfera (E = P)", correcta: true },
          { id: "m2", text: "Perquè si suren vol dir que l'empenyiment guanya al pes en repòs", idea: "IP-15" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa una de les esferes que suren (per exemple SPi de pi o SC de cera) al tanc, activa la vista «Forces» i anota la mesura.",
        facil: "Posa l'esfera SPi al tanc, activa el botó «Forces» i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Arrossega SPi (esfera de pi de 50 cm³ i 25 g) al tanc d'aigua.",
          "Activa la vista «Forces» i «Valors» a la barra superior: P = 0,245 N i E = 0,245 N.",
          "Prem Anota al panell."
        ]
      },
      {
        tipus: "explica",
        text: "Com podem enunciar la condició de flotació fent servir el pes del cos (P) i l'empenyiment màxim que rebria si s'enfonsés del tot (Emàx)?",
        facil: "Quan pot surar un objecte segons les forces?",
        opcions: [
          { id: "e1", text: "Un cos sura si l'empenyiment màxim (quan està tot submergit) és superior al seu pes (Emàx > P); aleshores puja fins que E = P", correcta: true },
          { id: "e2", text: "Quan està quiet surant a la superfície, l'empenyiment és més gran que el pes", idea: "IP-15" }
        ]
      },
      {
        tipus: "aplica",
        text: "L'esfera de cera de 50 cm³ té una massa de 45 g (pes P = 0,441 N). Quants centímetres cúbics (cm³) d'aigua desplaça quan sura en equilibri?",
        facil: "L'esfera de cera pesa 45 g i sura a l'aigua (1 g cada cm³). Quants cm³ d'aigua desplaça?",
        respostaNumerica: { valor: 45, unitat: "cm³", toleranciaRelativa: 0.01 },
        pistes: [
          "Per igualar els 45 g de l'esfera de cera, cal desplaçar 45 g d'aigua.",
          "Com que l'aigua té densitat 1,00 g/cm³, 45 g d'aigua ocupen 45 cm³.",
          "Escriu 45 i la unitat cm³."
        ]
      }
    ]
  },
  {
    id: "E5",
    titol: "De què depèn l'empenyiment?",
    pregunta: "Massa, volum, forma, profunditat, líquid: què fa canviar l'empenyiment?",
    preguntaFacil: "Quins factors fan canviar la força d'empenyiment dins d'un líquid?",
    bloc: "E",
    nivells: [3],
    fase: "2",
    durada: 20,
    idees: ["IP-12", "IP-13"],
    escena: {
      taula: "tanc",
      objectes: ["A", "arq_plast_50", "arq_acer_50", "C"],
      liquids: ["aigua", "alcohol", "aigua_salada"],
      recipients: ["tanc"],
      instruments: ["dinamometre_5"],
      visibilitat: "experimental"
    },
    columnesDades: ["Factor", "Situació A", "Situació B", "Empenyiment A (N)", "Empenyiment B (N)", "Depèn?"],
    valorsEsperats: "L'empenyiment (E = dL · g · Vsub) només depèn del volum submergit i de la densitat del líquid (i de g). NO depèn de la massa de l'objecte, ni del material, ni de la forma, ni de la profunditat un cop totalment submergit.",
    conclusio: "L'empenyiment només depèn del volum submergit i de la densitat del líquid (i de la gravetat). No depèn de la massa, del material, de la forma ni de la profunditat.",
    conclusioFacil: "Un cop l'objecte està tot sota l'aigua, encara que el baixem més avall l'empenyiment no canvia!",
    passos: [
      {
        tipus: "observa",
        text: "Obre l'eina «Comparador» a la barra d'eines per comparar dues situacions A i B canviant una sola variable cada vegada.",
        facil: "Obre el «Comparador» i mira el dinamòmetre al tanc."
      },
      {
        tipus: "prediu",
        text: "El bloc A ja està totalment submergit a 10 cm de profunditat i rep un empenyiment de 0,98 N. Què passarà amb l'empenyiment si el baixem fins a 40 cm de profunditat?",
        facil: "El bloc ja és tot sota l'aigua. Si el baixem més avall (de 10 cm a 40 cm), canviarà l'empenyiment?",
        opcions: [
          { id: "augmenta", text: "Augmentarà fins al quàdruple, perquè com més avall més empeny l'aigua", idea: "IP-12" },
          { id: "constant", text: "Es mantindrà exactament igual (0,98 N), perquè el volum d'aigua desplaçat continua sent 100 cm³", correcta: true },
          { id: "disminueix", text: "Disminuirà perquè a baix hi ha més pressió cap avall", idea: "IP-12" }
        ],
        motius: [
          { id: "m1", text: "Perquè E = dL · g · Vsub, i un cop submergit del tot, Vsub ja no canvia amb la profunditat", correcta: true },
          { id: "m2", text: "Perquè a més profunditat hi ha més aigua a sobre", idea: "IP-12" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Penja el bloc A del dinamòmetre al tanc, observa com canvia l'empenyiment mentre entra a l'aigua (de 0 % a 100 %) i comprova que en baixar-lo més profund (de 10 cm a 40 cm) l'empenyiment es manté en 0,98 N.",
        facil: "Baixa el bloc A amb el dinamòmetre i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Penja el bloc A del dinamòmetre a la taula del Tanc.",
          "Mou el control de profunditat entre 10 cm i 40 cm amb el bloc submergit i comprova que E = 0,98 N no varia.",
          "Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Per què l'empenyiment sí que augmenta mentre el bloc està entrant a l'aigua (de la superfície fins a quedar cobert), però deixa de canviar un cop ja és tot a dins?",
        facil: "Per què l'empenyiment creix mentre entra a l'aigua i després es queda fix?",
        opcions: [
          { id: "e1", text: "Perquè mentre entra a l'aigua el volum submergit (Vsub) va creixent, i un cop cobert Vsub ja és constant (100 cm³)", correcta: true },
          { id: "e2", text: "Perquè l'aigua només empeny a prop de la superfície", idea: "IP-12" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un bloc de 100 cm³ totalment submergit en aigua salada saturada (dL = 1,20 g/cm³ = 1200 kg/m³) es baixa de 15 cm a 45 cm de profunditat. Quant val l'empenyiment (en N) a 45 cm de profunditat (amb g = 9,8 N/kg)?",
        facil: "100 cm³ d'aigua salada pesen 120 g (0,120 kg). Multiplica 0,120 kg × 9,8 N/kg per trobar l'empenyiment en N:",
        respostaNumerica: { valor: 1.176, unitat: "N", toleranciaRelativa: 0.02 },
        pistes: [
          "La profunditat (45 cm) no afecta l'empenyiment perquè ja està totalment submergit.",
          "Massa d'aigua salada desplaçada: 100 cm³ × 1,20 g/cm³ = 120 g = 0,120 kg. E = 0,120 × 9,8 = 1,176 N.",
          "Escriu 1,18 (o 1,176) i la unitat N."
        ]
      }
    ]
  },
  {
    id: "E6",
    titol: "El diagrama de forces",
    pregunta: "Quines forces actuen sobre un objecte dins de l'aigua?",
    preguntaFacil: "Com són les fletxes de les forces quan un objecte sura, puja, baixa o és al fons?",
    bloc: "E",
    nivells: [3],
    fase: "2",
    durada: 15,
    idees: ["IP-15", "IP-11"],
    escena: {
      taula: "tanc",
      objectes: ["B", "A", "pedra"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["dinamometre_5"],
      visibilitat: "experimental"
    },
    columnesDades: ["Situació", "Forces cap avall", "Forces cap amunt", "Força neta (N)", "Estat"],
    valorsEsperats: "1) Fusta surant quieta: P = 0,98 N (avall), E = 0,98 N (amunt), Fneta = 0; 2) Bloc A al fons: P = 2,65 N (avall), E = 0,98 N + N = 1,67 N (amunt), Fneta = 0; 3) Bloc A penjat del dinamòmetre dins l'aigua: P = 2,65 N (avall), E = 0,98 N + T = 1,67 N (amunt).",
    conclusio: "Un objecte en repòs no està lliure de forces: les té exactament compensades (força neta zero). Si no es compensen, accelera en el sentit de la força neta.",
    conclusioFacil: "Quan un objecte està quiet (surant o al fons), les forces cap amunt i cap avall sumen exactament el mateix!",
    passos: [
      {
        tipus: "observa",
        text: "Activa el botó «Forces» i «Valors» a la barra superior per visualitzar els vectors de pes (P), empenyiment (E), força normal (N) i tensió (T).",
        facil: "Activa els botons «Forces» i «Valors» a dalt."
      },
      {
        tipus: "prediu",
        text: "Quan el bloc de fusta B (pes 0,98 N) està quiet surant a la superfície de l'aigua, com són el vector del pes (P) i el vector de l'empenyiment (E)?",
        facil: "El bloc de fusta B està quiet surant. Com són les fletxes del pes (P) i de l'empenyiment (E)?",
        opcions: [
          { id: "iguals", text: "Tenen exactament la mateixa llargada (0,98 N) i sentits oposats, de manera que la força neta és 0 N", correcta: true },
          { id: "empenyiment_gran", text: "La fletxa de l'empenyiment és més llarga que la del pes perquè està surant", idea: "IP-15" },
          { id: "cap_forca", text: "No hi ha cap fletxa perquè està quiet", idea: "IP-15" }
        ],
        motius: [
          { id: "m1", text: "Perquè segons les lleis de la dinàmica, tot cos en repòs té una força resultant nul·la (E = P)", correcta: true },
          { id: "m2", text: "Perquè per mantenir-se a dalt cal que l'empenyiment guanyi sempre al pes", idea: "IP-15" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa el bloc B i el bloc A al tanc d'aigua amb la vista «Forces» activada, compara els diagrames i anota una observació al quadern.",
        facil: "Posa el bloc B i el bloc A al tanc amb «Forces» activat i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Activa «Forces» a la barra superior i porta el bloc B i el bloc A al tanc.",
          "Observa que en el bloc A al fons hi ha tres forces en equilibri: P = 2,65 N cap avall, i E = 0,98 N + N = 1,67 N cap amunt.",
          "Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "En quin moment l'empenyiment sobre el bloc de fusta B sí que és més gran que el seu pes (E > P)?",
        facil: "Quan és més gran l'empenyiment que el pes en un bloc de fusta?",
        opcions: [
          { id: "e1", text: "Només si l'hem enfonsat al fons i el deixem anar: mentre accelera cap amunt, E > P fins que arriba a la línia de flotació", correcta: true },
          { id: "e2", text: "Sempre que està quiet a la superfície", idea: "IP-15" }
        ]
      },
      {
        tipus: "aplica",
        text: "El bloc metàl·lic A (pes P = 2,646 N) reposa quiet al fons del tanc d'aigua, on rep un empenyiment E = 0,980 N cap amunt. Quant val la força normal N (en N) que el fons del tanc exerceix cap amunt sobre el bloc?",
        facil: "El bloc pesa 2,646 N cap avall i l'aigua fa 0,980 N cap amunt. Quina força normal N (en N) fa el fons (2,646 − 0,980)?",
        respostaNumerica: { valor: 1.666, unitat: "N", toleranciaRelativa: 0.02 },
        pistes: [
          "Al fons en equilibri: E + N = P, per tant N = P − E.",
          "Resta 2,646 N − 0,980 N = 1,666 N.",
          "Escriu 1,666 (o 1,67) i la unitat N."
        ]
      }
    ]
  },
  {
    id: "E7",
    titol: "Suraria igual a la Lluna?",
    pregunta: "Un vaixell s'enfonsaria més a la Lluna?",
    preguntaFacil: "Si tinguéssim una piscina a la Lluna, un bloc de fusta s'hi enfonsaria més o menys?",
    bloc: "E",
    nivells: [3],
    fase: "2",
    durada: 10,
    idees: ["IP-07"],
    escena: {
      taula: "tanc",
      objectes: ["B"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["dinamometre_5"],
      visibilitat: "experimental"
    },
    columnesDades: ["Astre", "Gravetat g (N/kg)", "Pes P (N)", "Empenyiment E (N)", "Fracció submergida (%)"],
    valorsEsperats: "Bloc de fusta B (100 g, 200 cm³) en aigua: Terra (g = 9,8) -> P = E = 0,98 N, submergit 50 %; Lluna (g = 1,6) -> P = E = 0,16 N, submergit 50 %; Mart (g = 3,7) -> P = E = 0,37 N, submergit 50 %.",
    conclusio: "En canviar la gravetat, el pes de l'objecte i el pes del líquid desplaçat (l'empenyiment) canvien en la mateixa proporció, de manera que la fracció submergida (dobj / dL) no canvia.",
    conclusioFacil: "A la Lluna tant el bloc com l'aigua pesen 6 vegades menys: per això el bloc de fusta sura exactament amb el mateix 50 % sota l'aigua!",
    passos: [
      {
        tipus: "observa",
        text: "Posa el bloc de fusta B al tanc d'aigua, activa «Forces» i «Valors» i localitza el selector de gravetat (Terra, Lluna, Mart).",
        facil: "Mira el bloc B al tanc i el selector de gravetat (Terra, Lluna, Mart)."
      },
      {
        tipus: "prediu",
        text: "A la Terra (g = 9,8 N/kg), el bloc de fusta de pi sura amb el 50 % del seu volum sota l'aigua. Quina part quedarà submergida a la Lluna (g = 1,6 N/kg)?",
        facil: "A la Terra el bloc de fusta s'enfonsa la meitat (50 %). Quant s'enfonsarà a la Lluna?",
        opcions: [
          { id: "menys", text: "S'enfonsarà molt menys, perquè a la Lluna el bloc pesa sis vegades menys", idea: "IP-07" },
          { id: "igual", text: "S'enfonsarà exactament el mateix 50 %, perquè tant el pes del bloc com el de l'aigua es redueixen en la mateixa proporció", correcta: true },
          { id: "mes", text: "S'enfonsarà més perquè l'aigua té menys força", idea: "IP-07" }
        ],
        motius: [
          { id: "m1", text: "Perquè en igualar P = m · g i E = dL · Vsub · g, la gravetat g es cancel·la a tots dos costats (Vsub / V = dobj / dL)", correcta: true },
          { id: "m2", text: "Perquè la gravetat només afecta els sòlids i no els líquids", idea: "IP-07" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa el bloc B al tanc i canvia la gravetat entre Terra (9,8 N/kg), Lluna (1,6 N/kg) i Mart (3,7 N/kg). Anota l'observació.",
        facil: "Canvia la gravetat a «Lluna» i prem Anota al tanc.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Arrossega el bloc B al tanc.",
          "Canvia el selector de gravetat a Lluna (1,6 N/kg) i observa que P i E passen de 0,98 N a 0,16 N, però la línia de flotació continua al 50 %!",
          "Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Per què la fracció submergida d'un objecte que sura (Vsub / V = dobj / dL) és independent de la gravetat g (regla R13)?",
        facil: "Per què no canvia la part submergida quan canvia la gravetat?",
        opcions: [
          { id: "e1", text: "Perquè la gravetat multiplica tant el pes del cos com el pes del líquid desplaçat i es simplifica en igualar-los", correcta: true },
          { id: "e2", text: "Perquè el pes en newtons no canvia a la Lluna", idea: "IP-07" }
        ]
      },
      {
        tipus: "aplica",
        text: "A la Lluna (g = 1,6 N/kg), quant val en newtons (N) l'empenyiment que manté surant el bloc de fusta B de 100 g (0,100 kg)?",
        facil: "El bloc té una massa de 0,100 kg i a la Lluna g = 1,6 N/kg. Quant val el seu pes i el seu empenyiment en N (0,100 × 1,6)?",
        respostaNumerica: { valor: 0.16, unitat: "N", toleranciaRelativa: 0.02 },
        pistes: [
          "En flotació, l'empenyiment és igual al pes del bloc a la Lluna: E = P = m · gLluna.",
          "Multiplica 0,100 kg × 1,6 N/kg = 0,16 N.",
          "Escriu 0,16 i la unitat N."
        ]
      }
    ]
  }
];
