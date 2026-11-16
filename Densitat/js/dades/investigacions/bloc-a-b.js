/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Investigacions dels blocs A (Matèria i mesura, A1–A8) i B (Unitats i equivalències, B1–B4).
 * Basat en 05-cataleg-investigacions-1.md i 10-llengua-i-glossari.md.
 */

export const BLOC_A = [
  {
    id: "A1",
    titol: "Al supermercat",
    pregunta: "Un litre d'oli i un litre de llet ocupen el mateix. Pesen el mateix?",
    preguntaFacil: "L'oli i la llet ocupen un litre. Pesen igual?",
    bloc: "A",
    nivells: [1],
    fase: "1b",
    durada: 10,
    idees: ["IP-06", "IP-08"],
    escena: {
      taula: "mesura",
      objectes: ["B", "A"],
      liquids: ["oli", "llet", "aigua"],
      recipients: ["ampolla1L", "vas600"],
      instruments: ["balanca_cuina"],
      visibilitat: "experimental"
    },
    columnesDades: ["Producte", "Etiqueta", "Magnitud", "Massa mesurada (g)"],
    valorsEsperats: "1 L d'oli = 920 g; 1 L de llet = 1030 g; 1 L d'aigua = 1000 g. Aplica: 500 g de mel ocupen uns 352 mL.",
    conclusio: "Els grams i els quilograms mesuren massa; els litres i els mil·lilitres, volum. El mateix volum no vol dir la mateixa massa.",
    conclusioFacil: "Els grams mesuren la massa. Els litres mesuren el volum. Un litre d'oli pesa menys que un litre de llet.",
    passos: [
      {
        tipus: "observa",
        text: "Observa les ampolles d'un litre d'oli, de llet i d'aigua a la taula de mesura. Totes tenen el mateix volum: 1 L (1000 mL).",
        facil: "Mira les ampolles d'oli, de llet i d'aigua. Totes tenen 1 litre."
      },
      {
        tipus: "prediu",
        text: "Quina ampolla d'un litre tindrà més massa a la balança: la d'oli o la de llet?",
        facil: "Quin litre pesa més a la balança: l'oli o la llet?",
        opcions: [
          { id: "igual", text: "Totes dues pesen igual (1000 g), perquè són d'un litre", idea: "IP-06" },
          { id: "oli", text: "El litre d'oli, perquè és més espès", idea: "IP-16" },
          { id: "llet", text: "El litre de llet té més massa que el d'oli", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè un litre sempre és un quilo", idea: "IP-06" },
          { id: "m2", text: "Perquè cada líquid té una massa diferent per al mateix volum", correcta: true },
          { id: "m3", text: "Perquè els líquids espessos pesen més", idea: "IP-16" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa l'ampolla d'1 L a la balança, prem Tara quan estigui buida, omple-la amb oli i anota la massa. Repeteix-ho amb la llet.",
        facil: "Posa l'ampolla buida a la balança i prem Tara. Omple-la d'oli i anota la massa. Fes el mateix amb la llet.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Recorda descomptar la massa de l'ampolla buida (40 g) amb el botó Tara.",
          "Aboca 1000 mL d'oli a l'ampolla i prem Anota a la balança. Després buida-la i fes-ho amb llet.",
          "1 L d'oli marca 920 g i 1 L de llet marca 1030 g."
        ]
      },
      {
        tipus: "explica",
        text: "Compara les masses mesurades amb la teva predicció: per què dos líquids amb el mateix volum (1 L) tenen masses diferents?",
        facil: "L'oli i la llet ocupen 1 L. Per què no tenen la mateixa massa?",
        opcions: [
          { id: "e1", text: "Perquè la massa i el volum són magnituds diferents i cada substància té la seva pròpia densitat", correcta: true },
          { id: "e2", text: "Perquè la balança mesura el volum quan hi posem líquids", idea: "IP-04" },
          { id: "e3", text: "Perquè l'ampolla de llet és més gran", idea: "IP-02" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un pot conté 500 g de mel (densitat 1,42 g/mL). Ocupa mig litre (500 mL)? Calcula quin volum ocupa en mL.",
        facil: "Tens 500 g de mel (1,42 g cada mL). Quin volum ocupa en mL?",
        respostaNumerica: { valor: 352.1, unitat: "mL", toleranciaRelativa: 0.03 },
        pistes: [
          "La mel és més densa que l'aigua: cada mil·lilitre té una massa d'1,42 g.",
          "Divideix la massa (500 g) entre la densitat de la mel (1,42 g/mL).",
          "500 ÷ 1,42 = 352,1 mL (menys de mig litre)."
        ]
      }
    ]
  },
  {
    id: "A2",
    titol: "L'aire també és matèria",
    pregunta: "L'aire ocupa espai? Té massa?",
    preguntaFacil: "L'aire ocupa lloc i té massa?",
    bloc: "A",
    nivells: [1, 2],
    fase: "2",
    durada: 15,
    idees: ["IP-09"],
    escena: {
      taula: "tanc",
      objectes: ["bola_buida_fina"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["balanca_precisio"],
      visibilitat: "experimental"
    },
    columnesDades: ["Situació", "Observació", "Massa abans (g)", "Massa inflada (g)"],
    valorsEsperats: "El got cap per avall no es mulla perquè l'aire ocupa espai. 1 L d'aire té una massa d'uns 1,2 g. Aula de 7 × 5 × 3 m (105 m³) = 126 kg d'aire.",
    conclusio: "L'aire ocupa volum i té massa: cada litre d'aire té una massa d'uns 1,2 g.",
    conclusioFacil: "L'aire és matèria: ocupa espai i té massa (1,2 g cada litre).",
    passos: [
      {
        tipus: "observa",
        text: "Tenim un got transparent amb un paper sec enganxat al fons i una pilota amb inflador d'aire a pressió.",
        facil: "Mira el got amb un paper al fons i la pilota amb l'inflador."
      },
      {
        tipus: "prediu",
        text: "Si enfonsem el got ben recte cap per avall dins del tanc d'aigua, es mullarà el paper del fons?",
        facil: "Enfonsem el got cap per avall dins l'aigua. Es mullarà el paper?",
        opcions: [
          { id: "mulla", text: "Sí, l'aigua entrarà i omplirà tot el got", idea: "IP-09" },
          { id: "sec", text: "No, perquè l'aire de dins del got ocupa espai i impedeix que hi entri l'aigua", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè el got està buit i l'aire no ocupa lloc", idea: "IP-09" },
          { id: "m2", text: "Perquè l'aire és matèria i ocupa el volum interior del got", correcta: true }
        ]
      },
      {
        tipus: "experimenta",
        text: "Comprova al laboratori l'experiment del got invertit i pesa l'esfera abans i després d'injectar-hi aire comprimit.",
        facil: "Fes la prova a l'escena i anota la mesura a la balança.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "En inclinar el got surten bombolles d'aire i aleshores l'aigua pot entrar.",
          "Pesa l'objecte a la balança de precisió i prem Anota.",
          "Cada litre d'aire afegit a pressió incrementa la massa en 1,2 g."
        ]
      },
      {
        tipus: "explica",
        text: "Què demostren les bombolles que surten en inclinar el got i l'augment de lectura a la balança?",
        facil: "Què demostra aquest experiment sobre l'aire?",
        opcions: [
          { id: "e1", text: "Que l'aire és matèria perquè ocupa un volum i té massa", correcta: true },
          { id: "e2", text: "Que l'aire ocupa espai però no té massa", idea: "IP-09" }
        ]
      },
      {
        tipus: "aplica",
        text: "L'aire té una densitat d'1,2 kg/m³. Quina massa d'aire (en kg) hi ha dins d'una aula de 7 m × 5 m × 3 m (105 m³)?",
        facil: "L'aula té 105 m³ d'aire. Cada m³ pesa 1,2 kg. Quants kg d'aire hi ha en total?",
        respostaNumerica: { valor: 126, unitat: "kg", toleranciaRelativa: 0.02 },
        pistes: [
          "El volum de l'aula és 7 × 5 × 3 = 105 m³.",
          "Multiplica els 105 m³ per la massa de cada metre cúbic d'aire (1,2 kg/m³).",
          "105 × 1,2 = 126 kg."
        ]
      }
    ]
  },
  {
    id: "A3",
    titol: "Mesurem la massa: la tara",
    pregunta: "Com es pesa un líquid sense pesar el vas?",
    preguntaFacil: "Com pesem l'aigua sense comptar el vas?",
    bloc: "A",
    nivells: [1, 2],
    fase: "1b",
    durada: 10,
    idees: ["EP-01", "EP-07"],
    escena: {
      taula: "mesura",
      objectes: ["pedra"],
      liquids: ["aigua"],
      recipients: ["vas250"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Massa vas buit (g)", "Massa vas + aigua (g)", "Massa aigua per resta (g)", "Massa aigua amb tara (g)"],
    valorsEsperats: "Vas de 250 mL buit = 100 g; amb 150 mL d'aigua = 250 g; massa de l'aigua = 150 g.",
    conclusio: "La tara descompta el recipient i dona directament la massa del contingut.",
    conclusioFacil: "El botó Tara posa la balança a zero amb el vas buit. Així mesurem només el líquid.",
    passos: [
      {
        tipus: "observa",
        text: "Mira la balança de laboratori i el vas de precipitats de 250 mL (que buit té una massa de 100 g).",
        facil: "Mira la balança i el vas buit."
      },
      {
        tipus: "prediu",
        text: "En quin ordre has de fer els passos per mesurar directament la massa de 150 mL d'aigua amb el botó Tara?",
        facil: "Quin és l'ordre correcte per pesar l'aigua amb el botó Tara?",
        opcions: [
          { id: "o1", text: "Posar el vas buit → prémer Tara → abocar l'aigua → llegir la massa", correcta: true },
          { id: "o2", text: "Abocar l'aigua al vas → posar-lo a la balança → prémer Tara", idea: "EP-01" },
          { id: "o3", text: "Prémer Tara amb el plat buit → posar el vas amb aigua → llegir", idea: "EP-01" }
        ],
        motius: [
          { id: "m1", text: "Perquè la tara ha de posar a zero la massa del recipient buit abans d'afegir-hi el líquid", correcta: true },
          { id: "m2", text: "Perquè el vas de vidre no pesa res", idea: "EP-01" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa el vas a la balança, prem Tara i aboca-hi aigua, o bé anota la massa del vas buit i la del vas ple.",
        facil: "Pesa l'aigua fent servir el botó Tara de la balança i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Selecciona el vas o aboca aigua i prem el botó Tara de la balança.",
          "Quan hi afegeixes 100 mL d'aigua després de tarar, la pantalla marca 100,0 g.",
          "Prem Anota al costat de la balança per desar la lectura al quadern."
        ]
      },
      {
        tipus: "explica",
        text: "Què marca la balança quan retires el vas després d'haver fet la tara?",
        facil: "Si fas la tara amb el vas i després treus el vas, què marca la balança?",
        opcions: [
          { id: "e1", text: "Marca la massa del vas en negatiu (per exemple, −100,0 g)", correcta: true },
          { id: "e2", text: "Marca sempre zero", idea: "EP-07" }
        ]
      },
      {
        tipus: "aplica",
        text: "Tens un pot tancat ple d'oli que marca 580 g a la balança, i un pot idèntic buit que marca 120 g. Quina és la massa de l'oli?",
        facil: "El pot ple d'oli pesa 580 g. El pot buit pesa 120 g. Quant pesa l'oli sol?",
        respostaNumerica: { valor: 460, unitat: "g", toleranciaRelativa: 0.01 },
        pistes: [
          "Resta la massa del pot buit (tara) de la massa total del pot ple.",
          "580 g − 120 g = 460 g.",
          "Escriu 460 i la unitat g."
        ]
      }
    ]
  },
  {
    id: "A4",
    titol: "Massa i pes no són el mateix",
    pregunta: "A la Lluna tindries menys massa?",
    preguntaFacil: "A la Lluna tens menys massa o menys pes?",
    bloc: "A",
    nivells: [2, 3],
    fase: "2",
    durada: 15,
    idees: ["IP-07", "EM-06"],
    escena: {
      taula: "tanc",
      objectes: ["A"],
      liquids: [],
      recipients: ["tanc"],
      instruments: ["balanca_bracos", "dinamometre_5"],
      visibilitat: "experimental"
    },
    columnesDades: ["Lloc", "Massa (g)", "Pes (N)", "Pes / massa (N/kg)"],
    valorsEsperats: "Bloc A (270 g = 0,270 kg): Terra P = 2,65 N (g = 9,8 N/kg); Lluna P = 0,43 N (g = 1,6 N/kg); Mart P = 1,00 N (g = 3,7 N/kg). La massa és 270 g als tres astres.",
    conclusio: "La massa és la quantitat de matèria i no canvia; el pes és una força, es mesura en newtons i depèn de la gravetat: P = m · g.",
    conclusioFacil: "La massa no canvia a la Lluna (270 g). El pes és una força en newtons i a la Lluna és més petit.",
    passos: [
      {
        tipus: "observa",
        text: "A la taula del tanc pots penjar el bloc A (270 g) del dinamòmetre i canviar la gravetat entre la Terra, la Lluna i Mart.",
        facil: "Mira el bloc A, la balança i el dinamòmetre."
      },
      {
        tipus: "prediu",
        text: "Si portem el bloc A de 270 g a la Lluna, què canviarà?",
        facil: "Portem el bloc A a la Lluna. Què canvia?",
        opcions: [
          { id: "massa_i_pes", text: "Canviaran tant la massa com el pes, perquè són el mateix", idea: "IP-07" },
          { id: "nomes_pes", text: "La massa continuarà sent 270 g, però el pes en newtons serà més petit", correcta: true },
          { id: "res", text: "No canviarà ni la massa ni el pes", idea: "IP-07" }
        ],
        motius: [
          { id: "m1", text: "Perquè la quantitat de matèria no canvia, però la gravetat de la Lluna és més feble", correcta: true },
          { id: "m2", text: "Perquè a la Lluna tot s'aprima", idea: "IP-07" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Penja el bloc A del dinamòmetre a la Terra (g = 9,8 N/kg), anota el pes i canvia el selector d'entorn a la Lluna (g = 1,6 N/kg).",
        facil: "Mesura el pes del bloc A amb el dinamòmetre i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Arrossega o selecciona el bloc A i porta'l al ganxo del dinamòmetre.",
          "A la Terra (g = 9,8 N/kg), el bloc A de 0,270 kg pesa 2,65 N.",
          "Canvia la gravetat a la Lluna (1,6 N/kg) i observa que el dinamòmetre marca 0,43 N."
        ]
      },
      {
        tipus: "explica",
        text: "Per què la balança de braços amb masses patró s'equilibra igual a la Terra que a la Lluna?",
        facil: "Per què la balança de dos plats marca el mateix a la Terra i a la Lluna?",
        opcions: [
          { id: "e1", text: "Perquè la gravetat disminueix igual als dos plats i compara masses directament", correcta: true },
          { id: "e2", text: "Perquè a la Lluna la gravetat també és 9,8 N/kg", idea: "IP-07" }
        ]
      },
      {
        tipus: "aplica",
        text: "Quant pesa en newtons un objecte de 300 g (0,300 kg) a Mart, on g = 3,7 N/kg?",
        facil: "Un objecte té una massa de 0,3 kg. A Mart g = 3,7 N/kg. Quin és el seu pes en N?",
        respostaNumerica: { valor: 1.11, unitat: "N", toleranciaRelativa: 0.02 },
        pistes: [
          "Passa primer la massa de grams a quilograms: 300 g = 0,300 kg.",
          "Multiplica la massa en kg per la gravetat de Mart: P = 0,300 kg · 3,7 N/kg.",
          "0,300 × 3,7 = 1,11 N."
        ]
      }
    ]
  },
  {
    id: "A5",
    titol: "El volum dels sòlids regulars",
    pregunta: "Quants cubets caben dins d'aquest bloc?",
    preguntaFacil: "Quants cubets d'1 cm³ caben en aquest bloc?",
    bloc: "A",
    nivells: [1, 2],
    fase: "1b",
    durada: 15,
    idees: ["IP-08"],
    escena: {
      taula: "mesura",
      objectes: ["bloc_regular_a5", "A"],
      liquids: [],
      recipients: [],
      instruments: ["regle"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Llargada (cm)", "Amplada (cm)", "Alçada (cm)", "Volum (cm³)"],
    valorsEsperats: "Bloc BR (2 × 4 × 5 cm) = 40 cm³ (8 cubets per capa × 5 capes). Aplica: capsa de 3 × 4 × 6 cm = 72 cm³.",
    conclusio: "El volum és l'espai que ocupa un cos; en un ortoedre, V = a · b · c, i es mesura en unitats cúbiques.",
    conclusioFacil: "El volum d'una capsa es calcula multiplicant llargada × amplada × alçada (en cm³).",
    passos: [
      {
        tipus: "observa",
        text: "Selecciona el bloc regular BR (2 × 4 × 5 cm) i activa la vista «Cubets» a la barra superior i l'eina «Regle».",
        facil: "Mira el bloc BR i activa el botó «Cubets» i el «Regle»."
      },
      {
        tipus: "prediu",
        text: "Quants cubets d'1 cm³ ocupen exactament el mateix espai que un bloc de 2 cm × 4 cm × 5 cm?",
        facil: "El bloc fa 2 cm, 4 cm i 5 cm. Quants cubets d'1 cm³ hi caben?",
        opcions: [
          { id: "suma", text: "11 cubets (2 + 4 + 5)", idea: "IP-08" },
          { id: "prod", text: "40 cubets (2 × 4 × 5)", correcta: true },
          { id: " vint", text: "20 cubets", idea: "IP-08" }
        ],
        motius: [
          { id: "m1", text: "Perquè cada capa de la base té 2 × 4 = 8 cubets i hi ha 5 capes d'alçada", correcta: true },
          { id: "m2", text: "Perquè cal sumar els tres costats", idea: "IP-08" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Activa l'eina Regle per mesurar les arestes del bloc BR o del bloc A i anota'n el volum al quadern.",
        facil: "Mesura el bloc amb el regle i anota el volum.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Clica el botó Regle a la barra inferior i selecciona el bloc BR.",
          "Multiplica les tres arestes: 2 cm × 4 cm × 5 cm = 40 cm³.",
          "Prem Anota al panell del regle per desar el volum al quadern."
        ]
      },
      {
        tipus: "explica",
        text: "Per què la unitat del resultat és cm³ (centímetres cúbics) i no cm?",
        facil: "Per què posem cm³ quan mesurem el volum?",
        opcions: [
          { id: "e1", text: "Perquè multipliquem tres longituds en cm i comptem quants cubs d'1 cm d'aresta hi caben", correcta: true },
          { id: "e2", text: "Perquè és el mateix que mesurar la llargada d'una línia", idea: "IP-08" }
        ]
      },
      {
        tipus: "aplica",
        text: "Una capsa té forma d'ortoedre i fa 3 cm × 4 cm × 6 cm. Quin volum té (en cm³)?",
        facil: "Una capsa fa 3 cm × 4 cm × 6 cm. Quin és el seu volum en cm³?",
        respostaNumerica: { valor: 72, unitat: "cm³", toleranciaRelativa: 0.01 },
        pistes: [
          "Multiplica les tres dimensions de la capsa: V = a · b · c.",
          "3 × 4 = 12, i 12 × 6 = 72.",
          "Escriu 72 i la unitat cm³."
        ]
      }
    ]
  },
  {
    id: "A6",
    titol: "La proveta i el menisc",
    pregunta: "On s'ha de mirar per llegir bé una proveta?",
    preguntaFacil: "Com hem de mirar la proveta per llegir-la bé?",
    bloc: "A",
    nivells: [1, 2],
    fase: "1b",
    durada: 10,
    idees: ["EP-02", "EP-03"],
    escena: {
      taula: "mesura",
      objectes: [],
      liquids: ["aigua", "mercuri"],
      recipients: ["proveta100", "proveta25"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Proveta", "Divisió (mL)", "Posició de l'ull", "Lectura (mL)"],
    valorsEsperats: "Amb l'ull a l'altura del líquid es llegeix la part més baixa del menisc còncau (aigua) i la més alta del menisc convex (mercuri).",
    conclusio: "L'ull ha d'estar a l'altura del líquid i es llegeix la part més baixa de la corba. Cada proveta té la seva divisió.",
    conclusioFacil: "Posa l'ull a l'altura de l'aigua i mira la part de sota de la corba (menisc).",
    passos: [
      {
        tipus: "observa",
        text: "Obre l'eina «Lupa» a la barra inferior per veure ampliada la superfície de l'aigua dins de la proveta.",
        facil: "Obre la «Lupa» per veure de prop la ratlla de l'aigua a la proveta."
      },
      {
        tipus: "prediu",
        text: "L'aigua fa una corba anomenada menisc quan toca el vidre. On hem de situar la vista i quin punt de la corba hem de llegir?",
        facil: "L'aigua fa una corba a dalt. On hem de mirar per llegir el volum?",
        opcions: [
          { id: "alt", text: "Mirant des de dalt i llegint la vora superior que toca el vidre", idea: "EP-02" },
          { id: "altura_baix", text: "Amb l'ull a l'altura del líquid i llegint la part més baixa del menisc", correcta: true },
          { id: "baix", text: "Mirant des de sota perquè es vegi més gran", idea: "EP-03" }
        ],
        motius: [
          { id: "m1", text: "Per evitar l'error de paral·laxi i perquè la vora puja per capil·laritat", correcta: true },
          { id: "m2", text: "Perquè la part de dalt dona un número més gran", idea: "EP-02" }
        ]
      },
      {
        tipus: "experimenta",
        text: "A la Lupa, prova les tres posicions de l'ull (alt, a l'altura, baix), situa'l a l'altura del líquid i anota la lectura.",
        facil: "Posa l'ull a l'altura de l'aigua dins la lupa i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Clica el botó Lupa de la barra d'eines.",
          "Selecciona la posició «Ull a l'altura» i el punt «Base del menisc (tangent)».",
          "Prem Anota per desar la lectura correcta al quadern."
        ]
      },
      {
        tipus: "explica",
        text: "Què passa quan mires la proveta amb l'ull massa alt o massa baix?",
        facil: "Què es veu quan mires des de dalt o des de baix?",
        opcions: [
          { id: "e1", text: "La superfície es veu com una el·lipse i la línia de visió es desvia de l'escala (error de paral·laxi)", correcta: true },
          { id: "e2", text: "El volum real d'aigua dins la proveta canvia", idea: "EP-03" }
        ]
      },
      {
        tipus: "aplica",
        text: "En una proveta de 25 mL (divisió de 0,5 mL), la base del menisc de l'aigua toca exactament tres ratlles per sobre de 15 mL. Quin volum conté?",
        facil: "Cada ratlla petita de la proveta val 0,5 mL. El menisc és 3 ratlles per sobre de 15 mL. Quin volum marca?",
        respostaNumerica: { valor: 16.5, unitat: "mL", toleranciaRelativa: 0.01 },
        pistes: [
          "Cada divisió val 0,5 mL. Tres divisions són 3 × 0,5 = 1,5 mL.",
          "Suma 15 mL + 1,5 mL.",
          "El resultat és 16,5 mL."
        ]
      }
    ]
  },
  {
    id: "A7",
    titol: "El volum per desplaçament",
    pregunta: "Com es mesura el volum d'una pedra?",
    preguntaFacil: "Com mesurem el volum d'una pedra que no té forma de capsa?",
    bloc: "A",
    nivells: [1, 2],
    fase: "1a",
    durada: 15,
    idees: ["IP-10", "EP-04", "EP-06"],
    escena: {
      taula: "mesura",
      objectes: ["cilindre_alumini", "cilindre_plom", "pedra", "tap"],
      liquids: ["aigua"],
      recipients: ["proveta250"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Volum inicial (mL)", "Volum final (mL)", "Volum objecte (cm³)"],
    valorsEsperats: "Cilindre d'alumini (54 g) i cilindre de plom (226 g) fan pujar 20 mL tots dos. Pedra = 30 cm³. Tap de suro amb vareta = 20 cm³.",
    conclusio: "Un objecte submergit del tot fa pujar el líquid tant com el seu volum, pesi el que pesi. Si sura, cal enfonsar-lo amb la vareta.",
    conclusioFacil: "Quan un objecte s'enfonsa del tot, l'aigua puja igual que el seu volum. No importa quant pesa.",
    passos: [
      {
        tipus: "observa",
        text: "Mira els dos cilindres bessons: el d'alumini (CA, 54 g) i el de plom (CP, 226 g) tenen exactament la mateixa mida (20 cm³), però el de plom té més de quatre vegades més massa.",
        facil: "Mira els dos cilindres CA i CP. Tenen la mateixa mida, però el de plom pesa molt més."
      },
      {
        tipus: "prediu",
        text: "Si els submergim d'un en un a la proveta amb aigua, quin dels dos cilindres farà pujar més el nivell de l'aigua?",
        facil: "Quin cilindre farà pujar més l'aigua de la proveta?",
        opcions: [
          { id: "plom", text: "El cilindre de plom, perquè pesa més de quatre vegades més", idea: "IP-10" },
          { id: "igual", text: "Tots dos faran pujar l'aigua exactament igual, perquè tenen el mateix volum", correcta: true },
          { id: "alumini", text: "El d'alumini, perquè és més lleuger", idea: "IP-10" }
        ],
        motius: [
          { id: "m1", text: "Perquè el líquid desplaçat depèn de l'espai que ocupa l'objecte, no de la seva massa", correcta: true },
          { id: "m2", text: "Perquè la massa empeny l'aigua cap amunt amb més força", idea: "IP-10" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Anota el volum inicial de la proveta, introdueix la pedra (Pd) o un dels cilindres i anota el volum final. Després prova el tap de suro (Tp) activant l'eina «Vareta».",
        facil: "Anota el volum d'aigua de la proveta. Posa-hi la pedra i torna a anotar el volum. Per al tap de suro, activa la Vareta.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Prem Anota a la proveta abans de ficar-hi l'objecte (per exemple, 150 mL).",
          "Arrossega la pedra (Pd) a la proveta i torna a prémer Anota (180 mL). La diferència és 30 cm³.",
          "El tap de suro sura: activa el botó «Vareta» a la barra inferior per submergir-lo del tot."
        ]
      },
      {
        tipus: "explica",
        text: "Què passaria si mesuréssim el volum del tap de suro per desplaçament sense enfonsar-lo amb la vareta?",
        facil: "Per què hem d'enfonsar el suro amb la vareta per saber el seu volum?",
        opcions: [
          { id: "e1", text: "Perquè mentre sura només mesuraríem el volum de la part submergida, no el volum total del tap", correcta: true },
          { id: "e2", text: "Perquè si sura no desplaça gens d'aigua", idea: "IP-14" }
        ]
      },
      {
        tipus: "aplica",
        text: "En un aquari rectangular de 60 cm × 40 cm de base, el nivell de l'aigua puja 2 cm quan hi submergim unes roques. Quin volum total tenen les roques (en cm³)?",
        facil: "La base de l'aquari fa 60 cm × 40 cm i l'aigua puja 2 cm. Quin volum tenen les roques en cm³?",
        respostaNumerica: { valor: 4800, unitat: "cm³", toleranciaRelativa: 0.01 },
        pistes: [
          "L'aigua desplaçada té forma de prisma de 60 cm × 40 cm × 2 cm.",
          "Multiplica 60 × 40 × 2.",
          "60 × 40 × 2 = 4800 cm³."
        ]
      }
    ]
  },
  {
    id: "A8",
    titol: "Quina proveta necessito?",
    pregunta: "Totes les provetes serveixen per a tot?",
    preguntaFacil: "Quina proveta és millor per a cada objecte?",
    bloc: "A",
    nivells: [2],
    fase: "1b",
    durada: 10,
    idees: ["EP-05"],
    escena: {
      taula: "mesura",
      objectes: ["clau", "pedra", "patata"],
      liquids: ["aigua"],
      recipients: ["proveta25", "proveta100", "proveta250", "proveta500", "proveta1000"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Volum (cm³)", "Proveta triada", "Divisió (mL)", "Divisions que puja"],
    valorsEsperats: "Clau (2 cm³) -> proveta de 25 mL (puja 4 divisions de 0,5 mL); Pedra (30 cm³) -> proveta de 100 mL; Patata (160 cm³, gruix 4,8 cm) -> proveta de 500 mL (boca 5,0 cm).",
    conclusio: "Es tria la proveta més petita on l'objecte hi càpiga i quedi cobert, perquè és la que té la divisió més fina i es llegeix millor.",
    conclusioFacil: "Tria la proveta més estreta on l'objecte pugui entrar. Així l'aigua puja més ratlles i es llegeix millor.",
    passos: [
      {
        tipus: "observa",
        text: "Disposem de cinc provetes (25, 100, 250, 500 i 1000 mL) i tres objectes molt diferents: un clau (2 cm³), una pedra (30 cm³) i una patata (160 cm³, de 4,8 cm de gruix).",
        facil: "Mira el clau petit, la pedra mitjana i la patata gran."
      },
      {
        tipus: "prediu",
        text: "Quina proveta donarà la mesura més precisa per al clau de ferro (2 cm³)?",
        facil: "Quina proveta va millor per mesurar el clau petit?",
        opcions: [
          { id: "p1000", text: "La proveta de 1000 mL, perquè hi cap molta més aigua", idea: "EP-05" },
          { id: "p25", text: "La proveta de 25 mL, perquè té divisions de 0,5 mL i el nivell pujarà 4 divisions", correcta: true },
          { id: "vas", text: "El vas de precipitats de 600 mL", idea: "EP-05" }
        ],
        motius: [
          { id: "m1", text: "Perquè com més estreta és la proveta, més petita és la divisió i més puja el nivell", correcta: true },
          { id: "m2", text: "Perquè el recipient més gran sempre és més exacte", idea: "EP-05" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Canvia el model de proveta i prova on cap la patata (boca mínima 4,8 cm) i com es llegeix el clau en una proveta petita.",
        facil: "Prova les provetes amb el clau i amb la patata, i anota una mesura.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "La patata fa 4,8 cm de gruix: a la proveta de 250 mL (boca 3,6 cm) no hi cap, però a la de 500 mL (boca 5,0 cm) sí.",
          "Canvia la proveta a 25 mL per mesurar el clau de 2 cm³.",
          "Anota la lectura al quadern."
        ]
      },
      {
        tipus: "explica",
        text: "Per què no fem servir un vas de precipitats per mesurar volums amb precisió?",
        facil: "Per què el vas de precipitats no serveix per mesurar bé el volum?",
        opcions: [
          { id: "e1", text: "Perquè és molt ample i la seva graduació (de 25 o 50 mL) és només orientativa", correcta: true },
          { id: "e2", text: "Perquè no és de vidre", idea: "EP-05" }
        ]
      },
      {
        tipus: "aplica",
        text: "Quantes divisions pujarà el nivell d'una proveta de 25 mL (divisió de 0,5 mL) si hi submergim una bala de vidre de 4 cm³?",
        facil: "La bala de vidre té 4 cm³. A la proveta de 25 mL cada ratlla val 0,5 mL. Quantes ratlles pujarà (escriu el volum 4 mL)?",
        respostaNumerica: { valor: 4, unitat: "mL", toleranciaRelativa: 0.01 },
        pistes: [
          "Una bala de 4 cm³ desplaça exactament 4 mL d'aigua (8 divisions de 0,5 mL).",
          "Escriu 4 i la unitat mL."
        ]
      }
    ]
  }
];

export const BLOC_B = [
  {
    id: "B1",
    titol: "L'escala de les unitats",
    pregunta: "Per què en el volum cada graó val 1000?",
    preguntaFacil: "Per què per canviar d'unitat de volum multipliquem per 1000?",
    bloc: "B",
    nivells: [1, 2],
    fase: "1b",
    durada: 15,
    idees: ["IP-08", "EM-03"],
    escena: {
      taula: "mesura",
      objectes: ["A", "B"],
      liquids: ["aigua"],
      recipients: ["cub1dm"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Valor inicial", "Unitat origen", "Valor convertit", "Unitat destí"],
    valorsEsperats: "En massa (kg ↔ g) i capacitat (L ↔ mL) cada graó val 10; en volum (m³ ↔ dm³ ↔ cm³) cada graó val 1000 (10 × 10 × 10). Aplica: 0,25 L = 250 mL.",
    conclusio: "En passar a una unitat més petita el número creix. En massa i capacitat, cada graó val 10; en volum, 1000.",
    conclusioFacil: "De kg a g multipliquem per 1000 (3 graons de 10). D'1 dm³ a cm³ multipliquem per 1000 en un sol graó.",
    passos: [
      {
        tipus: "observa",
        text: "Obre l'eina «Conversor» a la barra inferior per explorar les tres escales: massa, capacitat i volum.",
        facil: "Obre el botó «Conversor» per veure les escales d'unitats."
      },
      {
        tipus: "prediu",
        text: "Un decímetre (1 dm) són 10 cm. Quants centímetres cúbics (cm³) hi ha en un decímetre cúbic (1 dm³)?",
        facil: "1 dm són 10 cm. Quants cm³ hi ha en 1 dm³?",
        opcions: [
          { id: "deu", text: "10 cm³, perquè és un sol graó de l'escala", idea: "EM-03" },
          { id: "cent", text: "100 cm³ (10 × 10)", idea: "EM-03" },
          { id: "mil", text: "1000 cm³ (10 × 10 × 10)", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè el volum té tres dimensions: 10 cubets de llarg × 10 d'ample × 10 d'alt", correcta: true },
          { id: "m2", text: "Perquè totes les escales van de 10 en 10", idea: "EM-03" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa el bloc A a la balança, canvia la unitat entre g (270 g) i kg (0,27 kg) i anota la lectura al quadern.",
        facil: "Pesa el bloc A en g i en kg a la balança i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Posa el bloc A a la balança i prem el botó «Unitat (g/kg)».",
          "Observa que 270 g equivalen a 0,27 kg.",
          "Prem Anota per registrar la mesura."
        ]
      },
      {
        tipus: "explica",
        text: "Quan passem d'una unitat gran a una unitat més petita (per exemple, de litres a mil·lilitres), què li passa al número?",
        facil: "Si passem de litres a mil·lilitres, el número es fa més gran o més petit?",
        opcions: [
          { id: "e1", text: "El número es fa més gran, perquè la unitat és més petita i en caben més", correcta: true },
          { id: "e2", text: "El número es fa més petit perquè el mil·lilitre és menut", idea: "IP-08" }
        ]
      },
      {
        tipus: "aplica",
        text: "Una recepta demana 0,25 L de llet. Quants mil·lilitres (mL) o centímetres cúbics (cm³) són?",
        facil: "Quants mil·lilitres (mL) hi ha en 0,25 L?",
        respostaNumerica: { valor: 250, unitat: "mL", toleranciaRelativa: 0.01 },
        pistes: [
          "De litres (L) a mil·lilitres (mL) hi ha tres graons de 10: cal multiplicar per 1000.",
          "0,25 × 1000 = 250.",
          "Escriu 250 i la unitat mL (o cm³)."
        ]
      }
    ]
  },
  {
    id: "B2",
    titol: "Construïm un litre",
    pregunta: "Quants cubets d'un centímetre caben en un litre?",
    preguntaFacil: "Quants cubets d'1 cm³ omplen una ampolla d'1 litre?",
    bloc: "B",
    nivells: [1, 2],
    fase: "1b",
    durada: 15,
    idees: ["IP-08"],
    escena: {
      taula: "mesura",
      objectes: ["B"],
      liquids: ["aigua"],
      recipients: ["cub1dm", "ampolla1L"],
      instruments: ["balanca_cuina"],
      visibilitat: "experimental"
    },
    columnesDades: ["Peça", "Nombre de cubets", "Volum (cm³)", "Capacitat (mL)"],
    valorsEsperats: "1 cubet = 1 cm³ = 1 mL; 1 barra = 10 cm³; 1 placa = 100 cm³; 10 plaques = 1 cub d'1 dm = 1000 cm³ = 1 L. Massa d'1 L d'aigua = 1000 g (1 kg).",
    conclusio: "1 dm³ = 1000 cm³ = 1 L = 1000 mL, i per tant 1 cm³ = 1 mL. Un litre d'aigua té una massa d'1 kg, aproximadament.",
    conclusioFacil: "1 litre és exactament igual a 1 dm³ (1000 cm³). Per això 1 cm³ és igual a 1 mL.",
    passos: [
      {
        tipus: "observa",
        text: "Tenim un cub transparent d'1 dm d'aresta (10 cm × 10 cm × 10 cm) i una ampolla d'1 L d'aigua.",
        facil: "Mira el cub de 10 cm de costat i l'ampolla d'1 litre."
      },
      {
        tipus: "prediu",
        text: "Si aboquem 1 L d'aigua dins del cub d'1 dm d'aresta (10 × 10 × 10 cm), què passarà?",
        facil: "Si posem 1 L d'aigua dins del cub de 10 × 10 × 10 cm, què passarà?",
        opcions: [
          { id: "vessa", text: "Vessarà perquè 1 litre és molt més gran que un cub de 10 cm", idea: "IP-08" },
          { id: "exacte", text: "S'omplirà exactament fins a la vora, perquè 1 L equival a 1 dm³ (1000 cm³)", correcta: true },
          { id: "falta", text: "Només n'omplirà una desena part", idea: "IP-08" }
        ],
        motius: [
          { id: "m1", text: "Perquè el litre es defineix exactament com el volum d'un decímetre cúbic (1000 cm³)", correcta: true },
          { id: "m2", text: "Perquè litres i centímetres cúbics no tenen relació", idea: "IP-08" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Omple el recipient amb 1000 mL d'aigua, pesa'l amb la tara descomptada i anota la mesura al quadern.",
        facil: "Omple el cub amb 1000 mL d'aigua i anota la mesura.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Selecciona el cub d'1 dm (1000 cm³) i omple'l d'aigua fins a 1000 mL.",
          "Anota el volum o la massa a la balança."
        ]
      },
      {
        tipus: "explica",
        text: "Si 1000 cm³ són 1000 mL, a quants mil·lilitres equival 1 sol centímetre cúbic (1 cm³)?",
        facil: "Si 1000 cm³ són 1000 mL, quant és 1 cm³?",
        opcions: [
          { id: "e1", text: "1 cm³ és exactament igual a 1 mL", correcta: true },
          { id: "e2", text: "1 cm³ són 10 mL", idea: "EM-03" }
        ]
      },
      {
        tipus: "aplica",
        text: "Quants litres d'aigua caben en un dipòsit d'un metre cúbic (1 m³ = 10 dm × 10 dm × 10 dm)?",
        facil: "Quants litres (L) caben en 1 metre cúbic (1 m³)?",
        respostaNumerica: { valor: 1000, unitat: "L", toleranciaRelativa: 0.01 },
        pistes: [
          "Un metre té 10 dm, així que en un cub d'1 m d'aresta hi caben 10 × 10 × 10 = 1000 cubs d'1 dm³.",
          "Com que 1 dm³ = 1 L, en 1 m³ hi caben 1000 L.",
          "Escriu 1000 i la unitat L."
        ]
      }
    ]
  },
  {
    id: "B3",
    titol: "Quanta massa té un litre?",
    pregunta: "Un litre sempre pesa un quilo?",
    preguntaFacil: "Un litre de qualsevol líquid pesa sempre 1 kg?",
    bloc: "B",
    nivells: [1, 2],
    fase: "1b",
    durada: 10,
    idees: ["IP-06"],
    escena: {
      taula: "mesura",
      objectes: [],
      liquids: ["aigua", "oli", "alcohol", "llet", "mel"],
      recipients: ["ampolla1L"],
      instruments: ["balanca_cuina"],
      visibilitat: "experimental"
    },
    columnesDades: ["Líquid", "Volum (L)", "Massa (g)", "Massa (kg)"],
    valorsEsperats: "Alcohol: 790 g (0,79 kg) < Oli: 920 g (0,92 kg) < Aigua: 1000 g (1,00 kg) < Llet: 1030 g (1,03 kg) < Mel: 1420 g (1,42 kg). Garrafa de 5 L d'oli = 4,6 kg.",
    conclusio: "El mateix volum de líquids diferents té masses diferents. La massa d'un litre, en quilograms, és la densitat en kg/L.",
    conclusioFacil: "Només 1 L d'aigua té una massa d'1 kg. L'alcohol i l'oli pesen menys; la llet i la mel pesen més.",
    passos: [
      {
        tipus: "observa",
        text: "Tenim cinc líquids (aigua, oli, alcohol, llet i mel), una ampolla d'1 L i la balança de cuina.",
        facil: "Mira els cinc líquids i l'ampolla d'1 litre."
      },
      {
        tipus: "prediu",
        text: "Quin és l'ordre correcte d'un litre d'aquests líquids, de menys massa a més massa?",
        facil: "Ordena 1 litre de cada líquid del més lleuger al més pesant:",
        opcions: [
          { id: "iguals", text: "Tots tenen 1000 g (1 kg) de massa perquè tots són 1 litre", idea: "IP-06" },
          { id: "ordre_bo", text: "Alcohol (790 g) < oli (920 g) < aigua (1000 g) < llet (1030 g) < mel (1420 g)", correcta: true },
          { id: "oli_pesant", text: "Alcohol < aigua < llet < oli < mel", idea: "IP-16" }
        ],
        motius: [
          { id: "m1", text: "Perquè cada líquid té una densitat diferent (massa per cada litre)", correcta: true },
          { id: "m2", text: "Perquè un litre equival sempre a un quilogram", idea: "IP-06" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Fes la tara de l'ampolla buida i pesa 1 L (1000 mL) d'almenys dos líquids diferents.",
        facil: "Fes la tara de l'ampolla i pesa 1 L d'aigua, d'oli o de mel. Prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Prem Tara amb l'ampolla buida sobre la balança.",
          "Tria un líquid (oli, alcohol, mel), omple 1000 mL i prem Anota.",
          "Buida l'ampolla i repeteix-ho amb un altre líquid."
        ]
      },
      {
        tipus: "explica",
        text: "Quina relació hi ha entre la massa d'1 L d'un líquid (en kg) i la seva densitat (en g/cm³ o kg/L)?",
        facil: "Si 1 L d'oli té una massa de 0,92 kg, quina és la seva densitat?",
        opcions: [
          { id: "e1", text: "És exactament el mateix número: 0,92 kg/L equival a 0,92 g/cm³", correcta: true },
          { id: "e2", text: "No tenen cap relació numèrica", idea: "IP-06" }
        ]
      },
      {
        tipus: "aplica",
        text: "Si 1 L d'oli té una massa de 0,92 kg (920 g), quina massa en kg té una garrafa de 5 L d'oli?",
        facil: "1 L d'oli té una massa de 0,92 kg. Quants kg pesen 5 L d'oli?",
        respostaNumerica: { valor: 4.6, unitat: "kg", toleranciaRelativa: 0.01 },
        pistes: [
          "Multiplica la massa d'un litre (0,92 kg) per 5 litres.",
          "0,92 × 5 = 4,6 kg (o 4600 g).",
          "Escriu 4,6 i la unitat kg."
        ]
      }
    ]
  },
  {
    id: "B4",
    titol: "Les unitats de la densitat",
    pregunta: "1 g/cm³ i 1000 kg/m³ són la mateixa densitat?",
    preguntaFacil: "1 g/cm³ és el mateix que 1000 kg/m³?",
    bloc: "B",
    nivells: [2, 3],
    fase: "2",
    durada: 15,
    idees: ["EM-04"],
    escena: {
      taula: "mesura",
      objectes: ["A", "B"],
      liquids: ["aigua"],
      recipients: ["cub1dm"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Substància", "g/cm³", "kg/L", "kg/m³", "g/L"],
    valorsEsperats: "1 g/cm³ = 1 g/mL = 1 kg/L = 1000 kg/m³ = 1000 g/L. Alumini: 2,70 g/cm³ = 2700 kg/m³. Aplica: aire 1,2 kg/m³ -> 1,2 g en 1 L.",
    conclusio: "1 g/cm³ = 1 g/mL = 1 kg/L = 1000 kg/m³.",
    conclusioFacil: "Per passar de g/cm³ a kg/m³ multipliquem per 1000: 1 g/cm³ = 1000 kg/m³.",
    passos: [
      {
        tipus: "observa",
        text: "Obre l'eina «Conversor» a la pestanya de densitat per veure els factors de conversió entre g/cm³, kg/L i kg/m³.",
        facil: "Obre el «Conversor» i mira com es converteixen les unitats de densitat."
      },
      {
        tipus: "prediu",
        text: "L'alumini té una densitat de 2,70 g/cm³. Quant val aquesta mateixa densitat expressada en kg/m³ (unitat del Sistema Internacional)?",
        facil: "L'alumini té 2,70 g/cm³. Quant és en kg/m³?",
        opcions: [
          { id: "div", text: "0,0027 kg/m³, perquè passem de grams a quilograms", idea: "EM-04" },
          { id: "igual", text: "2,70 kg/m³", idea: "EM-04" },
          { id: "mult", text: "2700 kg/m³, perquè en 1 m³ hi caben un milió de cm³", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè 1 m³ = 1 000 000 cm³ i 1 kg = 1000 g; el factor net és 1 000 000 / 1000 = 1000", correcta: true },
          { id: "m2", text: "Perquè de g a kg es divideix per 1000", idea: "EM-04" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Utilitza el conversor o la calculadora amb unitats amb les mesures del bloc A (270 g i 100 cm³) i anota el càlcul al quadern.",
        facil: "Calcula la densitat del bloc A i mira l'equivalència al conversor.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Pesa el bloc A (270 g) o obre la Calculadora i divideix 270 g ÷ 100 cm³ = 2,70 g/cm³.",
          "Al Conversor, comprova que 2,70 g/cm³ = 2700 kg/m³.",
          "Prem Anota per desar-ho al quadern."
        ]
      },
      {
        tipus: "explica",
        text: "Per què 1 g/cm³ i 1 kg/L tenen exactament el mateix valor numèric?",
        facil: "Per què 1 g/cm³ és igual a 1 kg/L?",
        opcions: [
          { id: "e1", text: "Perquè tant la massa (de g a kg) com el volum (de cm³ a L) es multipliquen per 1000 alhora", correcta: true },
          { id: "e2", text: "Perquè un gram és igual a un quilogram", idea: "EM-04" }
        ]
      },
      {
        tipus: "aplica",
        text: "L'aire té una densitat d'1,2 kg/m³. Quants grams (g) d'aire hi ha dins d'una ampolla d'un litre (1 L) «buida»?",
        facil: "L'aire té 1,2 kg/m³ (que és igual a 1,2 g/L). Quants grams d'aire hi ha en 1 litre?",
        respostaNumerica: { valor: 1.2, unitat: "g", toleranciaRelativa: 0.02 },
        pistes: [
          "1 m³ són 1000 L i 1,2 kg són 1200 g.",
          "1200 g ÷ 1000 L = 1,2 g per cada litre.",
          "Escriu 1,2 i la unitat g."
        ]
      }
    ]
  }
];
