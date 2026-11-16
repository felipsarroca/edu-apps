/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Investigacions dels blocs F (Construïm i apliquem, F1–F11) i G (Pressió i hidrostàtica, G1–G3).
 * Basat en 06-cataleg-investigacions-2.md i 10-llengua-i-glossari.md.
 */

export const BLOC_F = [
  {
    id: "F1",
    titol: "De la bola a la barqueta",
    pregunta: "Pots fer surar 200 g de plastilina sense treure'n ni afegir-ne?",
    preguntaFacil: "Com podem fer que una bola de plastilina de 200 g suri a l'aigua?",
    bloc: "F",
    nivells: [1, 2, 3],
    fase: "3",
    durada: 20,
    idees: ["IP-18", "IP-05"],
    escena: {
      taula: "taller",
      objectes: ["plastilina_taller"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Forma", "Massa (g)", "Volum plastilina (cm³)", "Volum desplaçable (cm³)", "Densitat mitjana (g/cm³)", "Sura?"],
    valorsEsperats: "Bola de 200 g: Vmat = 133,3 cm³, Vmax = 133,3 cm³, d = 1,50 g/cm³ (s'enfonsa, Emàx = 1,31 N < P = 1,96 N). Barca de 12 × 10 × 5 cm: Vmat = 133,3 cm³, Venv = 600 cm³, gruix paret 0,43 cm, dmitj = 0,33 g/cm³ (sura amb calat 1,67 cm i francbord 3,33 cm, Emàx = 5,88 N).",
    conclusio: "La forma no canvia la densitat de la plastilina (1,50 g/cm³), però modelar-la com a buc obert augmenta el volum d'aigua que pot desplaçar i redueix la densitat mitjana del conjunt (plastilina + cavitat d'aire) per sota d'1,00 g/cm³.",
    conclusioFacil: "La bola de plastilina s'enfonsa, però si li donem forma de barqueta buida per dins pot apartar molta més aigua i sura!",
    passos: [
      {
        tipus: "observa",
        text: "A la taula del «Taller» tenim 200 g de plastilina (133,3 cm³, d = 1,50 g/cm³) i el banc per donar-li forma de barca (buc obert de dimensions L × B × H).",
        facil: "Mira la plastilina de 200 g i el constructor de barques del Taller."
      },
      {
        tipus: "prediu",
        text: "Com a bola massissa, els 200 g de plastilina només poden desplaçar 133,3 cm³ d'aigua i s'enfonsen. Per què surarà si la modelem en forma de barqueta de 12 cm × 10 cm × 5 cm (volum envoltant de 600 cm³)?",
        facil: "Per què la mateixa plastilina de 200 g sura quan li donem forma de barqueta?",
        opcions: [
          { id: "volum_env", text: "Perquè el buc buit pot desplaçar fins a 600 cm³ d'aigua i la seva densitat mitjana baixa a 0,33 g/cm³", correcta: true },
          { id: "pesa_menys", text: "Perquè en fer-la buida la plastilina perd massa i pesa menys a la balança", idea: "IP-05" },
          { id: "densitat_mat", text: "Perquè la plastilina es transforma en un altre material menys dens", idea: "IP-05" }
        ],
        motius: [
          { id: "m1", text: "Perquè per igualar els 200 g de pes només necessita desplaçar 200 cm³ d'aigua, i el buc en pot desplaçar fins a 600 cm³", correcta: true },
          { id: "m2", text: "Perquè els objectes plans no tenen gravetat", idea: "IP-05" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Al Taller, modela els 200 g de plastilina com a barca (per exemple, 12 × 10 × 5 cm) i prova-la al tanc d'aigua. Anota el resultat.",
        facil: "Crea la barca de 12 × 10 × 5 cm al Taller i prova-la al tanc.",
        condicio: { tipus: "barca_provada_o_anotat" },
        pistes: [
          "A la taula Taller (o Tanc), configura el buc amb L = 12 cm, B = 10 cm i H = 5 cm.",
          "Observa que el gruix de paret és 0,43 cm i que a l'aigua sura amb un calat d'1,67 cm i un francbord de 3,33 cm.",
          "Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Què ha canviat i què NO ha canviat en passar de la bola massissa de 200 g a la barqueta de 12 × 10 × 5 cm?",
        facil: "Què es manté igual i què canvia entre la bola i la barca?",
        opcions: [
          { id: "e1", text: "La massa (200 g) i el volum de plastilina (133,3 cm³) es mantenen iguals; canvia el volum màxim d'aigua que pot desplaçar (de 133,3 a 600 cm³)", correcta: true },
          { id: "e2", text: "Ha canviat la massa de la plastilina", idea: "IP-05" }
        ]
      },
      {
        tipus: "aplica",
        text: "El buc de 12 cm × 10 cm × 5 cm té un volum envoltant fins a la vora de 600 cm³ i una massa de 200 g. Quina és la seva densitat mitjana (en g/cm³) comptant la cavitat d'aire?",
        facil: "Divideix la massa de la barca (200 g) entre el seu volum total fins a la vora (600 cm³) en g/cm³:",
        respostaNumerica: { valor: 0.333, unitat: "g/cm³", toleranciaRelativa: 0.03 },
        pistes: [
          "La densitat mitjana és dmitj = m / Venv = 200 g ÷ 600 cm³.",
          "200 ÷ 600 = 0,33 g/cm³ (molt inferior a 1,00 g/cm³).",
          "Escriu 0,33 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "F2",
    titol: "Quanta càrrega aguanta?",
    pregunta: "Quantes peses pot portar la barca abans d'enfonsar-se?",
    preguntaFacil: "Quants grams de càrrega podem posar dins la barca abans que s'inundi?",
    bloc: "F",
    nivells: [2, 3],
    fase: "3",
    durada: 20,
    idees: ["IP-18"],
    escena: {
      taula: "tanc",
      objectes: ["plastilina_taller"],
      liquids: ["aigua", "aigua_salada"],
      recipients: ["tanc"],
      instruments: ["regle"],
      visibilitat: "experimental"
    },
    columnesDades: ["Càrrega (g)", "Massa total (g)", "Calat h (cm)", "Francbord f (cm)", "Sura?"],
    valorsEsperats: "Barca de 200 g i 12 × 10 × 5 cm (Venv = 600 cm³): sense càrrega, calat = 1,67 cm; amb 200 g de càrrega, calat = 3,33 cm; amb 400 g de càrrega (massa total 600 g), calat = 5,00 cm (límit). Amb 401 g l'aigua entra i s'enfonsa. En aigua salada (1,20) la càrrega màxima és 520 g.",
    conclusio: "Cada gram afegit a la barca l'obliga a desplaçar 1/dL cm³ més de líquid. La càrrega màxima és dL · Venv − mbarca; si se supera, el calat arriba a l'alçada del buc (francbord zero), l'aigua entra i s'enfonsa.",
    conclusioFacil: "Una barca de 600 cm³ pot desplaçar fins a 600 g d'aigua. Com que la barca pesa 200 g, aguanta fins a 400 g de càrrega!",
    passos: [
      {
        tipus: "observa",
        text: "Tenim al tanc la barca de plastilina de 200 g i dimensions 12 cm × 10 cm × 5 cm (volum envoltant de 600 cm³), amb peses per carregar-la.",
        facil: "Mira la barca de 12 × 10 × 5 cm i el control per afegir-hi càrrega."
      },
      {
        tipus: "prediu",
        text: "El buc té un volum fins a la vora de 600 cm³ (pot desplaçar com a màxim 600 g d'aigua dolça) i la barca buida ja té una massa de 200 g. Quina és la càrrega màxima (en g) que pot transportar abans que l'aigua entri per la vora?",
        facil: "La barca pot apartar fins a 600 g d'aigua i ella ja pesa 200 g. Quants grams de càrrega pot portar com a màxim?",
        opcions: [
          { id: "quatre_cents", text: "400 g de càrrega (perquè 200 g de la barca + 400 g de càrrega = 600 g màxims)", correcta: true },
          { id: "sis_cents", text: "600 g de càrrega, perquè el volum és 600 cm³", idea: "IP-18" },
          { id: "dos_cents", text: "200 g, perquè no pot portar més del seu propi pes", idea: "IP-01" }
        ],
        motius: [
          { id: "m1", text: "Perquè la massa total (barca + càrrega) no pot superar la massa màxima d'aigua desplaçable (600 g)", correcta: true },
          { id: "m2", text: "Perquè la massa de la barca no compta", idea: "IP-18" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Afegeix càrrega a la barca al panell del buc (prova amb 200 g, 400 g i més de 400 g), observa el calat i el francbord, i anota les dades.",
        facil: "Afegeix peses de càrrega a la barca i mira com puja el calat fins que s'inunda.",
        condicio: { tipus: "barca_provada_o_anotat" },
        pistes: [
          "Al panell del buc, puja la càrrega a 200 g (calat 3,33 cm) i a 400 g (calat 5,00 cm, arran de vora).",
          "Si passes de 400 g, l'aigua entra a la cavitat i la barca s'enfonsa!",
          "Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Per què la barca s'enfonsa fins al fons quan el calat supera l'alçada H de la paret (5 cm)?",
        facil: "Per què la barca s'enfonsa de cop quan l'aigua supera la vora?",
        opcions: [
          { id: "e1", text: "Perquè l'aigua inunda la cavitat d'aire interior i aleshores només desplaça els 133,3 cm³ de la plastilina (d = 1,50 > 1,00)", correcta: true },
          { id: "e2", text: "Perquè la plastilina es dissol en l'aigua", idea: "IP-18" }
        ]
      },
      {
        tipus: "aplica",
        text: "Si portem aquesta mateixa barca (massa 200 g, volum envoltant 600 cm³) a aigua salada saturada (dL = 1,20 g/cm³), quina càrrega màxima (en g) podrà aguantar abans d'inundar-se?",
        facil: "600 cm³ d'aigua salada (1,20 g/cm³) pesen 720 g. Si la barca pesa 200 g, quina és la càrrega màxima en grams (720 − 200)?",
        respostaNumerica: { valor: 520, unitat: "g", toleranciaRelativa: 0.01 },
        pistes: [
          "Massa màxima d'aigua salada desplaçable: 600 cm³ × 1,20 g/cm³ = 720 g.",
          "Resta la massa de la barca: 720 g − 200 g = 520 g.",
          "Escriu 520 i la unitat g."
        ]
      }
    ]
  },
  {
    id: "F3",
    titol: "El repte de la drassana",
    pregunta: "Quina és la millor barca que es pot fer amb 200 g de plastilina?",
    preguntaFacil: "Com podem dissenyar una barca amb 200 g de plastilina que aguanti molta càrrega sense trencar-se ni bolcar?",
    bloc: "F",
    nivells: [2, 3],
    fase: "3",
    durada: 30,
    idees: ["IP-18"],
    escena: {
      taula: "taller",
      objectes: ["plastilina_taller"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["regle"],
      visibilitat: "experimental"
    },
    columnesDades: ["Disseny (L × B × H)", "Gruix paret t (cm)", "Volum envoltant (cm³)", "Càrrega màxima (g)", "Vàlida?"],
    valorsEsperats: "Amb 200 g de plastilina (133,3 cm³), fer el buc més gran augmenta la càrrega màxima però aprima les parets; per sota de t = 0,15 cm la paret es trenca. Amb L = 15, B = 12, H = 6 (Venv = 1080 cm³), t ≈ 0,28 cm i aguanta 880 g.",
    conclusio: "Dissenyar una embarcació exigeix un compromís d'enginyeria entre volum desplaçable (capacitat de càrrega), gruix mínim de paret (resistència estructural), francbord de seguretat i amplada (estabilitat).",
    conclusioFacil: "Una barca més gran aguanta més càrrega, però si la fem massa gran les parets queden massa fines i es trenquen!",
    passos: [
      {
        tipus: "observa",
        text: "Al Taller de barques (Drassana) pots ajustar lliurement la llargada (L), l'amplada (B) i l'alçada (H) del buc fet amb 200 g de plastilina.",
        facil: "Mira els controls de llargada L, amplada B i alçada H del buc al Taller."
      },
      {
        tipus: "prediu",
        text: "Per què no podem fer amb només 200 g de plastilina una barca gegant de 50 cm × 50 cm × 20 cm perquè aguanti 50 quilos?",
        facil: "Què passa si intentem estirar els 200 g de plastilina per fer una barca gegant?",
        opcions: [
          { id: "paret_fina", text: "Perquè el volum de plastilina és fix (133,3 cm³) i les parets quedarien tan fines que es trencarien", correcta: true },
          { id: "no_sura", text: "Perquè les barques grans s'enfonsen encara que estiguin buides", idea: "IP-02" }
        ],
        motius: [
          { id: "m1", text: "Perquè en augmentar la superfície del buc amb la mateixa quantitat de material, el gruix de paret disminueix", correcta: true },
          { id: "m2", text: "Perquè l'aire de dins pesa massa", idea: "IP-09" }
        ]
      },
      {
        tipus: "experimenta",
        text: " Dissenya al Taller una barca vàlida (gruix de paret ≥ 0,15 cm) que superi els 500 g de càrrega màxima i anota el teu disseny al quadern.",
        facil: "Ajusta L, B i H per aconseguir una càrrega màxima superior a 500 g sense que la paret es trenqui, i prem Anota.",
        condicio: { tipus: "barca_provada_o_anotat" },
        pistes: [
          "Prova per exemple L = 14 cm, B = 10 cm, H = 6 cm (Venv = 840 cm³, càrrega màxima = 640 g, gruix t = 0,34 cm).",
          "Prem Anota per desar el teu disseny al quadern."
        ]
      },
      {
        tipus: "explica",
        text: "Si fem una barca molt estreta i molt alta i hi col·loquem la càrrega a dalt, quin risc d'estabilitat té?",
        facil: "Què passa si una barca és molt estreta i alta?",
        opcions: [
          { id: "e1", text: "El centre de gravetat queda massa alt respecte al metacentre (GM < 0) i la barca bolca de costat", correcta: true },
          { id: "e2", text: "La densitat de l'aigua canvia", idea: "IP-17" }
        ]
      },
      {
        tipus: "aplica",
        text: "Dissenyes un buc rectangular de 15 cm de llargada, 10 cm d'amplada i 6 cm d'alçada (Venv = 900 cm³) amb 200 g de plastilina. Quina és la càrrega màxima teòrica en aigua dolça (en g)?",
        facil: "El volum total del buc és 900 cm³ (aguanta fins a 900 g en total). Si la barca pesa 200 g, quants grams de càrrega pot portar (900 − 200)?",
        respostaNumerica: { valor: 700, unitat: "g", toleranciaRelativa: 0.01 },
        pistes: [
          "El volum envoltant és 15 × 10 × 6 = 900 cm³, així que pot desplaçar fins a 900 g d'aigua.",
          "Resta la massa de la barca: 900 g − 200 g = 700 g.",
          "Escriu 700 i la unitat g."
        ]
      }
    ]
  },
  {
    id: "F4",
    titol: "Per què sura un vaixell d'acer?",
    pregunta: "L'acer s'enfonsa. Com pot surar un vaixell d'acer?",
    preguntaFacil: "L'acer és gairebé 8 vegades més dens que l'aigua. Per què suren els vaixells d'acer?",
    bloc: "F",
    nivells: [2, 3],
    fase: "3",
    durada: 20,
    idees: ["IP-18", "IP-19"],
    escena: {
      taula: "tanc",
      objectes: ["acer_taller", "bola_buida_fina", "bola_buida_gruixuda"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Massa (g)", "Volum material (cm³)", "Volum desplaçable (cm³)", "Densitat mitjana (g/cm³)", "Sura?"],
    valorsEsperats: "Bloc massís d'acer de 500 g: Vmat = 63,7 cm³, d = 7,85 g/cm³ (s'enfonsa). Buc d'acer de 500 g (15 × 8 × 6 cm): Venv = 720 cm³, dmitj = 0,69 g/cm³ (sura amb calat 4,17 cm). Boles buides d'acer de 100 cm³: BB1 (60 g, dmitj = 0,60) sura; BB2 (300 g, dmitj = 3,00) s'enfonsa.",
    conclusio: "Un vaixell d'acer sura perquè és un buc buit que engloba un gran volum d'aire, de manera que la seva densitat mitjana és inferior a la de l'aigua. Però no tot el que és buit sura: cal que la densitat mitjana sigui menor que la del líquid.",
    conclusioFacil: "El vaixell d'acer té molt d'aire a dins i la seva densitat mitjana és més petita que 1,00 g/cm³. Però si una bola buida té les parets massa gruixudes, s'enfonsa!",
    passos: [
      {
        tipus: "observa",
        text: "Tenim una planxa d'acer de 500 g (63,7 cm³) que podem conformar com a bloc o com a buc de 15 × 8 × 6 cm (720 cm³), i dues boles buides d'acer de 100 cm³: BB1 (paret fina, 60 g) i BB2 (paret gruixuda, 300 g). Activa la vista «Volums».",
        facil: "Mira les dues boles buides d'acer BB1 i BB2 i activa el botó «Volums»."
      },
      {
        tipus: "prediu",
        text: "Totes dues boles d'acer (BB1 i BB2) tenen un volum exterior de 100 cm³ i tenen una cavitat buida a l'interior, però BB1 té una massa de 60 g i BB2 té parets gruixudes i una massa de 300 g. Quines suraran?",
        facil: "BB1 (60 g) i BB2 (300 g) són totes dues boles buides de 100 cm³. Quina surarà?",
        opcions: [
          { id: "totes_dues", text: "Totes dues suraran, perquè tot objecte que és buit per dins sura", idea: "IP-19" },
          { id: "nomes_bb1", text: "Només surarà BB1 (dmitj = 0,60 g/cm³); BB2 s'enfonsarà perquè la seva densitat mitjana és 3,00 g/cm³", correcta: true },
          { id: "cap", text: "Cap de les dues, perquè són d'acer i el metall sempre s'enfonsa", idea: "IP-18" }
        ],
        motius: [
          { id: "m1", text: "Perquè el que decideix és si la densitat mitjana (massa total ÷ volum exterior) és menor que 1,00 g/cm³", correcta: true },
          { id: "m2", text: "Perquè tenir aire a dins garanteix sempre la flotació", idea: "IP-19" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Prova les dues boles buides BB1 i BB2 al tanc d'aigua, i prova també el buc d'acer i l'efecte d'obrir-hi una «Via d'aigua».",
        facil: "Posa BB1 i BB2 al tanc d'aigua i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Arrossega BB1 (sura al 60 %) i BB2 (s'enfonsa!) al tanc d'aigua.",
          "Activa la vista «Volums» per veure el gruix de material i la cavitat de cadascuna, i prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Què passa quan s'obre una via d'aigua al buc d'un vaixell d'acer de 500 g i l'aigua omple la cavitat interior?",
        facil: "Per què s'enfonsa un vaixell d'acer quan s'omple d'aigua per un forat?",
        opcions: [
          { id: "e1", text: "L'aigua substitueix l'aire de la cavitat i la densitat mitjana del conjunt supera la de l'aigua", correcta: true },
          { id: "e2", text: "L'acer es torna més dens quan es mulla", idea: "IP-18" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un buc d'acer té una massa de 500 g i les seves dimensions exteriors són 15 cm × 8 cm × 6 cm (volum envoltant de 720 cm³). Quants centímetres de calat (alçada submergida, en cm) tindrà en aigua dolça?",
        facil: "La base del buc fa 15 × 8 = 120 cm² i ha de desplaçar 500 cm³ d'aigua. Divideix 500 ÷ 120 per trobar el calat en cm:",
        respostaNumerica: { valor: 4.17, unitat: "cm", toleranciaRelativa: 0.02 },
        pistes: [
          "L'àrea de la base del buc és L × B = 15 cm × 8 cm = 120 cm².",
          "Per desplaçar 500 cm³ d'aigua, el calat és h = 500 cm³ ÷ 120 cm² = 4,17 cm.",
          "Escriu 4,17 i la unitat cm."
        ]
      }
    ]
  },
  {
    id: "F5",
    titol: "El submarí",
    pregunta: "Com puja i baixa un submarí?",
    preguntaFacil: "Com s'ho fa un submarí per enfonsar-se, quedar-se quiet o tornar a pujar?",
    bloc: "F",
    nivells: [2, 3],
    fase: "3",
    durada: 15,
    idees: ["IP-15", "IP-17"],
    escena: {
      taula: "tanc",
      objectes: ["capsula_d8"],
      liquids: ["aigua", "aigua_mar"],
      recipients: ["tanc"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Aigua al tanc de llast (cm³)", "Massa total (g)", "Densitat mitjana (g/cm³)", "Comportament"],
    valorsEsperats: "Submarí de Vext = 1000 cm³, massa del buc = 700 g, tanc de llast = 400 cm³: en aigua dolça (1,00 g/cm³), equilibri neutre amb 300 cm³ d'aigua al llast (75 % del tanc, massa total 1000 g). En aigua de mar (1,03 g/cm³), equilibri amb 320,4 cm³ d'aigua de mar (massa total 1030 g).",
    conclusio: "El submarí manté constant el seu volum exterior (1000 cm³) i regula la seva massa (i per tant la seva densitat mitjana) omplint o buidant d'aigua els tancs de llast.",
    conclusioFacil: "El submarí no canvia de mida: deixa entrar aigua als tancs de llast per pesar més i baixar, o l'expulsa amb aire comprimit per pujar!",
    passos: [
      {
        tipus: "observa",
        text: "A la taula del «Tanc» activa el mode «Submarí»: té un volum exterior fix de 1000 cm³, una massa de buc de 700 g i un tanc intern de llast de 400 cm³ de capacitat.",
        facil: "Mira el comandament del Submarí (1000 cm³ i 700 g buit) a la taula del Tanc."
      },
      {
        tipus: "prediu",
        text: "Amb el tanc de llast buit, el submarí té una massa de 700 g i un volum exterior de 1000 cm³ (dmitj = 0,70 g/cm³), així que sura. Quants cm³ d'aigua dolça (1,00 g/cm³) cal deixar entrar al tanc de llast perquè quedi en equilibri neutre entre dues aigües?",
        facil: "El submarí ocupa 1000 cm³ i buit pesa 700 g. Quants cm³ (grams) d'aigua han d'entrar al tanc perquè pesi 1000 g en total?",
        opcions: [
          { id: "tres_cents", text: "300 cm³ d'aigua (el 75 % del tanc de 400 cm³), perquè la massa total sigui 700 + 300 = 1000 g", correcta: true },
          { id: "quatre_cents", text: "400 cm³ (el 100 % del tanc)", idea: "IP-15" },
          { id: "dos_cents", text: "200 cm³ (la meitat del tanc)", idea: "IP-15" }
        ],
        motius: [
          { id: "m1", text: "Perquè amb 1000 g de massa total en 1000 cm³ de volum exterior, la densitat mitjana és 1,00 g/cm³", correcta: true },
          { id: "m2", text: "Perquè amb mig tanc es queda a mitja alçada", idea: "IP-12" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Ajusta el tanc de llast del submarí a 300 cm³ (75 %) per aconseguir l'equilibri neutre en aigua dolça i anota l'estat al quadern.",
        facil: "Posa el tanc de llast del submarí a 300 cm³ (75 %) i prem Anota.",
        condicio: { tipus: "submari_equilibri_o_anotat" },
        pistes: [
          "Al panell del Submarí a la taula del Tanc, mou el control del tanc de llast fins a 300 cm³ (75 %).",
          "Observa que la densitat mitjana és 1,00 g/cm³ i queda en equilibri. Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Com s'ho fan la majoria dels peixos ossis per quedar-se quiets a qualsevol profunditat sense haver de nedar contínuament?",
        facil: "Quin òrgan tenen els peixos que funciona com el tanc d'un submarí?",
        opcions: [
          { id: "e1", text: "Regulen el volum de gas de la seva bufeta natatòria per igualar la seva densitat mitjana a la de l'aigua", correcta: true },
          { id: "e2", text: "No tenen pes quan són dins de l'aigua", idea: "IP-11" }
        ]
      },
      {
        tipus: "aplica",
        text: "Si el submarí (volum exterior 1000 cm³, massa del buc 700 g) passa d'un riu d'aigua dolça al mar (dL = 1,03 g/cm³), quina massa total (buc + llast, en g) ha de tenir per mantenir-se en equilibri neutre dins l'aigua de mar?",
        facil: "Per tenir una densitat mitjana d'1,03 g/cm³ amb un volum de 1000 cm³, quants grams ha de pesar el submarí en total (1,03 × 1000)?",
        respostaNumerica: { valor: 1030, unitat: "g", toleranciaRelativa: 0.01 },
        pistes: [
          "Per estar en equilibri en aigua de mar (1,03 g/cm³), la massa total ha de ser m = dL · Vext.",
          "1,03 g/cm³ × 1000 cm³ = 1030 g (700 g del buc + 330 g d'aigua al llast).",
          "Escriu 1030 i la unitat g."
        ]
      }
    ]
  },
  {
    id: "F6",
    titol: "L'iceberg",
    pregunta: "Quina part d'un iceberg es veu?",
    preguntaFacil: "Per què gairebé tot l'iceberg queda amagat sota l'aigua?",
    bloc: "F",
    nivells: [2, 3],
    fase: "3",
    durada: 15,
    idees: ["IP-14"],
    escena: {
      taula: "tanc",
      objectes: ["cub10_gel", "glaco"],
      liquids: ["aigua", "aigua_mar"],
      recipients: ["tanc"],
      instruments: ["regle"],
      visibilitat: "experimental"
    },
    columnesDades: ["Líquid", "Densitat líquid (g/cm³)", "Fracció submergida (%)", "Fracció visible (%)"],
    valorsEsperats: "Gel (d = 0,917 g/cm³; escolar 0,92): en aigua dolça (1,00) queda submergit el 91,7 % (92 %) i visible el 8,3 % (8 %). En aigua de mar (1,03) queda submergit el 89,0 % i visible l'11,0 %. Quan es fon en aigua dolça, el nivell no canvia.",
    conclusio: "El gel és lleugerament menys dens que l'aigua líquida (0,917 enfront d'1,00 g/cm³), de manera que sura amb prop del 90 % del seu volum sota la superfície.",
    conclusioFacil: "Com que la densitat del gel (0,92) és gairebé igual que la de l'aigua (1,00), al mar només es veu un 11 % de l'iceberg i el 89 % està sota l'aigua!",
    passos: [
      {
        tipus: "observa",
        text: "Tenim el bloc de gel (Ge10, densitat de referència 0,917 g/cm³ o escolar 0,92 g/cm³) i el tanc amb aigua dolça (1,00) i aigua de mar (1,03).",
        facil: "Mira el bloc de gel Ge10 al tanc."
      },
      {
        tipus: "prediu",
        text: "Per què s'utilitza l'expressió «això és només la punta de l'iceberg»? Quina part d'un iceberg queda sota l'aigua?",
        facil: "Quina part d'un iceberg està sota l'aigua del mar?",
        opcions: [
          { id: "vuitanta_nou", text: "Prop del 89 % al mar (i el 92 % en aigua dolça), perquè la densitat del gel és molt propera a la de l'aigua", correcta: true },
          { id: "meitat", text: "Exactament el 50 %, la meitat a dins i la meitat a fora", idea: "IP-14" },
          { id: "deu", text: "Només un 10 % queda sota l'aigua", idea: "IP-14" }
        ],
        motius: [
          { id: "m1", text: "Perquè la fracció submergida és dgel / dmar = 0,917 / 1,03 ≈ 89 %", correcta: true },
          { id: "m2", text: "Perquè el gel sempre flota per sobre de la superfície", idea: "IP-14" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa el cub de gel (Ge10) al tanc amb aigua dolça i amb aigua de mar, observa la fracció submergida i anota la mesura.",
        facil: "Posa el cub de gel Ge10 al tanc i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Arrossega Ge10 al tanc d'aigua dolça (submergit al 92 % amb nombres senzills o 91,7 % amb referència).",
          "Canvia el líquid del tanc a «aigua de mar» (1,03 g/cm³) i observa que ara queda submergit un 89 %.",
          "Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Un glaçó de gel sura dins d'un got d'aigua dolça. Quan el glaçó es fon del tot i es converteix en aigua líquida, puja el nivell de l'aigua del got?",
        facil: "Si es fon un glaçó que surava en un got d'aigua dolça, puja el nivell de l'aigua?",
        opcions: [
          { id: "e1", text: "No canvia el nivell: mentre surava ja desplaçava un volum d'aigua de massa igual a la seva, que és exactament el volum que ocupa en fondre's", correcta: true },
          { id: "e2", text: "El nivell puja perquè la punta del glaçó que sobresortia s'afegeix a l'aigua", idea: "IP-14" }
        ]
      },
      {
        tipus: "aplica",
        text: "Amb el valor de referència del gel (0,917 g/cm³) i de l'aigua de mar (1,030 g/cm³), quin percentatge (%) del volum d'un iceberg queda submergit sota el mar?",
        facil: "Divideix 0,917 entre 1,030 i multiplica per 100 per trobar el percentatge (%) submergit:",
        respostaNumerica: { valor: 89.0, unitat: "%", toleranciaRelativa: 0.02 },
        pistes: [
          "Calcula (0,917 ÷ 1,030) × 100.",
          "0,917 ÷ 1,030 × 100 = 89,0 %.",
          "Escriu 89 i el símbol %."
        ]
      }
    ]
  },
  {
    id: "F7",
    titol: "La corona del rei",
    pregunta: "La corona és d'or pur?",
    preguntaFacil: "Com va descobrir Arquimedes si la corona del rei era d'or pur o portava plata barrejada?",
    bloc: "F",
    nivells: [3],
    fase: "3",
    durada: 20,
    idees: ["EM-01", "EM-07"],
    escena: {
      taula: "tanc",
      objectes: ["corona", "lingot_or"],
      liquids: ["aigua"],
      recipients: ["vasVessament"],
      instruments: ["balanca_laboratori", "dinamometre_20"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Massa (g)", "Volum desplaçat (cm³)", "Pes aparent en aigua (N)", "Densitat (g/cm³)"],
    valorsEsperats: "Lingot d'or pur: 1000 g, V = 51,8 cm³, d = 19,3 g/cm³, P = 9,80 N, Pa = 9,29 N. Corona del rei: 1000 g, V = 64,8 cm³, d = 15,43 g/cm³, P = 9,80 N, Pa = 9,165 N. Conclusió: l'orfebre hi va barrejar plata!",
    conclusio: "Tant pel mètode del volum d'aigua desplaçat com pel mètode del pes aparent amb el dinamòmetre, la corona de 1000 g ocupa 64,8 cm³ (d = 15,4 g/cm³ < 19,3 g/cm³): no és d'or pur.",
    conclusioFacil: "La corona i el lingot d'or pesen igual (1000 g), però la corona desplaça més aigua (64,8 cm³ en lloc de 51,8 cm³) perquè té plata barrejada!",
    passos: [
      {
        tipus: "observa",
        text: "El rei Hieró de Siracusa va lliurar 1000 g d'or a un orfebre per fer una corona. La corona entregada (Cor) pesa exactament 1000 g, igual que el lingot d'or pur (Or), però el rei sospita que l'orfebre s'ha quedat una part de l'or i l'ha substituït pel mateix pes de plata (més barata i menys densa: 10,5 g/cm³).",
        facil: "Mira la corona Cor (1000 g) i el lingot d'or pur Or (1000 g)."
      },
      {
        tipus: "prediu",
        text: "Si l'orfebre ha substituït una part de l'or (19,3 g/cm³) pel mateix pes de plata (10,5 g/cm³), com serà el volum d'aigua que desplaçarà la corona comparat amb el del lingot d'or pur de 1000 g?",
        facil: "La plata és menys densa que l'or (ocupa més espai pel mateix pes). Quina peça farà vessar més aigua?",
        opcions: [
          { id: "mes_volum", text: "La corona desplaçarà més volum d'aigua (i tindrà una densitat menor que 19,3 g/cm³)", correcta: true },
          { id: "igual_volum", text: "Desplaçaran exactament la mateixa aigua perquè totes dues tenen 1000 g de massa", idea: "IP-10" },
          { id: "menys_volum", text: "La corona desplaçarà menys aigua", idea: "IP-04" }
        ],
        motius: [
          { id: "m1", text: "Perquè la mateixa massa de plata ocupa gairebé el doble de volum que l'or", correcta: true },
          { id: "m2", text: "Perquè l'aigua desplaçada només depèn dels grams de massa", idea: "IP-10" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Submergeix la corona (Cor) i el lingot d'or (Or) al tanc / vas de vessament (o mesura'ls amb el dinamòmetre) i anota les mesures al quadern.",
        facil: "Posa la corona Cor a l'aigua o al dinamòmetre i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Porta la corona (Cor) al tanc / vas de vessament: desplaça 64,8 mL d'aigua (mentre que el lingot d'or pur només en desplaça 51,8 mL).",
          "Prem Anota per registrar la mesura."
        ]
      },
      {
        tipus: "explica",
        text: "Com es pot comprovar el frau de la corona fent servir únicament una balança de braços submergida dins de l'aigua?",
        facil: "Si pengem la corona i el lingot d'or als dos braços d'una balança i els fiquem dins l'aigua, s'equilibren?",
        opcions: [
          { id: "e1", text: "Dins l'aigua es desequilibren: com que la corona té més volum (64,8 cm³), rep més empenyiment cap amunt i té menys pes aparent que el lingot", correcta: true },
          { id: "e2", text: "Dins l'aigua continuen equilibrats perquè tots dos tenen 1000 g de massa", idea: "IP-13" }
        ]
      },
      {
        tipus: "aplica",
        text: "La corona té una massa de 1000 g i desplaça un volum de 64,8 cm³ d'aigua. Calcula la densitat real de la corona (en g/cm³).",
        facil: "Divideix la massa de la corona (1000 g) entre el seu volum (64,8 cm³) per trobar la densitat en g/cm³:",
        respostaNumerica: { valor: 15.43, unitat: "g/cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "Divideix 1000 g ÷ 64,8 cm³.",
          "1000 ÷ 64,8 = 15,43 g/cm³ (molt per sota dels 19,30 g/cm³ de l'or pur!).",
          "Escriu 15,4 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "F8",
    titol: "Objectes que enganyen",
    pregunta: "Per què una taronja sura amb pell i s'enfonsa sense?",
    preguntaFacil: "Per què la taronja amb pell sura i quan la pelem s'enfonsa?",
    bloc: "F",
    nivells: [1, 2],
    fase: "4",
    durada: 15,
    idees: ["IP-01", "IP-18"],
    escena: {
      taula: "mesura",
      objectes: ["taronja_pell", "taronja_pelada", "llauna_sucre", "llauna_zero", "pedra_tosca"],
      liquids: ["aigua"],
      recipients: ["vas600"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Massa (g)", "Volum exterior (cm³)", "Densitat mitjana (g/cm³)", "Sura?"],
    valorsEsperats: "Taronja amb pell: 209 g, 220 cm³, dmitj = 0,95 g/cm³ (sura tot i pesar més!). Taronja pelada: 172,8 g, 160 cm³, d = 1,08 g/cm³ (s'enfonsa). Llauna amb sucre: 382 g, 360 cm³, dmitj = 1,06 g/cm³ (s'enfonsa); Llauna sense sucre: 352 g, 360 cm³, dmitj = 0,98 g/cm³ (sura).",
    conclusio: "Molts objectes quotidians són compostos. El que determina si suren és la seva densitat mitjana: la pell porosa de la taronja conté aire atrapat que actua com una armilla salvavides.",
    conclusioFacil: "Quan pelem la taronja pesa menys, però s'enfonsa! Això passa perquè la pell és esponjosa i plena d'aire que feia baixar la densitat mitjana.",
    passos: [
      {
        tipus: "observa",
        text: "Al prestatge tenim una taronja amb pell (Tr+, 209 g) i la mateixa taronja pelada (Tr-, 172,8 g), a més de dues llaunes de refresc de 360 cm³ exteriors: una amb sucre (Ll-S) i una sense sucre (Ll-0).",
        facil: "Mira la taronja amb pell Tr+, la pelada Tr- i les dues llaunes."
      },
      {
        tipus: "prediu",
        text: "La taronja amb pell (209 g) sura a l'aigua. Si li traiem la pell, ara pesa menys (172,8 g). Què farà la taronja pelada quan la posem a l'aigua?",
        facil: "La taronja amb pell sura. Si la pelem (ara pesa menys!), què farà a l'aigua?",
        opcions: [
          { id: "sura_mes", text: "Surarà encara més amunt, perquè li hem tret el pes de la pell", idea: "IP-01" },
          { id: "enfonsa", text: "S'enfonsarà, perquè la pell porosa contenia molt d'aire que reduïa la densitat mitjana per sota d'1,00 g/cm³", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè sense la pell porosa el volum disminueix proporcionalment més que la massa, i la polpa té d = 1,08 g/cm³", correcta: true },
          { id: "m2", text: "Perquè com menys pesa un objecte, millor sura", idea: "IP-01" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Prova al vas d'aigua la taronja amb pell (Tr+) i la pelada (Tr-), i també les dues llaunes (Ll-S i Ll-0). Pesa-les i anota-ho al quadern.",
        facil: "Posa Tr+ i Tr- al vas d'aigua i a la balança, i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Posa Tr+ (sura) i Tr- (s'enfonsa!) al vas d'aigua.",
          "Prova Ll-S (s'enfonsa) i Ll-0 (sura) i pesa-les a la balança. Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Per què la llauna de refresc amb sucre s'enfonsa i la llauna sense sucre (edulcorant) sura, si totes dues tenen el mateix envàs d'alumini i el mateix volum?",
        facil: "Per què la llauna amb sucre s'enfonsa i la llauna Zero sura?",
        opcions: [
          { id: "e1", text: "Perquè la llauna normal porta uns 35 g de sucre dissolt (més dens que l'aigua), mentre que d'edulcorant només en calen uns mil·ligrams", correcta: true },
          { id: "e2", text: "Perquè l'alumini de la llauna Zero és menys dens", idea: "IP-18" }
        ]
      },
      {
        tipus: "aplica",
        text: "La taronja amb pell té una massa de 209 g i un volum exterior de 220 cm³. Calcula la seva densitat mitjana (en g/cm³).",
        facil: "Divideix 209 g entre 220 cm³ per obtenir la densitat mitjana de la taronja amb pell en g/cm³:",
        respostaNumerica: { valor: 0.95, unitat: "g/cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "Divideix la massa total (209 g) pel volum exterior (220 cm³).",
          "209 ÷ 220 = 0,95 g/cm³ (< 1,00 g/cm³, per això sura).",
          "Escriu 0,95 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "F9",
    titol: "Globus i aire calent",
    pregunta: "Per què uns globus pugen i d'altres cauen?",
    preguntaFacil: "Per què un globus d'heli puja cap al sostre i un globus bufat amb els pulmons cau a terra?",
    bloc: "F",
    nivells: [2, 3],
    fase: "4",
    durada: 20,
    idees: ["IP-09"],
    escena: {
      taula: "tanc",
      objectes: ["bola_buida_fina"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["dinamometre_5"],
      visibilitat: "experimental"
    },
    columnesDades: ["Gas del globus", "Densitat gas (g/L)", "Pes total P (N)", "Empenyiment de l'aire E (N)", "Força neta (N)"],
    valorsEsperats: "Cambra d'aire (dAire = 1,20 g/L), globus de 10 L amb coberta de 3 g: amb heli (0,17 g/L) -> m = 4,7 g, P = 0,046 N, E = 0,118 N, Fneta = +0,072 N (puja); amb aire (1,20 g/L) -> m = 15,0 g, P = 0,147 N > E = 0,118 N (cau pel pes de la goma); amb CO₂ (1,80 g/L) -> m = 21,0 g (cau ràpid); amb aire calent a 100 °C (0,95 g/L) en gran volum -> puja.",
    conclusio: "L'aire també és un fluid i exerceix empenyiment d'Arquimedes cap amunt (E = daire · g · V). Un globus s'enlaira si la seva densitat mitjana (gas + coberta) és inferior a la de l'aire exterior (1,20 g/L).",
    conclusioFacil: "Estem al fons d'un oceà d'aire! Un globus puja si el gas de dins i la goma pesen menys que l'aire que aparten.",
    passos: [
      {
        tipus: "observa",
        text: "A la taula del «Tanc», selecciona el mòdul d'ampliació «Globus i gasos»: un globus de 10 L (coberta de goma de 3 g) que podem omplir d'heli (0,17 g/L), aire calent (0,95 g/L), aire (1,20 g/L) o CO₂ (1,80 g/L).",
        facil: "Mira el simulador de globus i gasos a la taula del Tanc."
      },
      {
        tipus: "prediu",
        text: "Un globus de goma buit pesa 3 g. Si l'inflem amb 10 L d'aire dels pulmons (densitat igual a l'aire exterior, 1,20 g/L), per què cau a terra en deixar-lo anar?",
        facil: "Per què cau a terra un globus inflat amb aire normal?",
        opcions: [
          { id: "coberta", text: "Perquè els 10 L d'aire de dins pesen igual que l'empenyiment de l'aire exterior (12 g), però els 3 g de la coberta de goma fan que la densitat mitjana sigui superior a 1,20 g/L", correcta: true },
          { id: "aire_no_empeny", text: "Perquè l'aire no és un fluid i no fa cap empenyiment", idea: "IP-09" }
        ],
        motius: [
          { id: "m1", text: "Perquè el pes total és 12 g (aire) + 3 g (goma) = 15 g, mentre que l'aire desplaçat és de només 12 g", correcta: true },
          { id: "m2", text: "Perquè l'heli té gravetat negativa", idea: "IP-07" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Prova el globus de 10 L amb heli (0,17 g/L) i amb CO₂ (1,80 g/L) al mòdul de gasos del Tanc i anota els resultats.",
        facil: "Tria el gas «heli» per al globus al Tanc i prem Anota.",
        condicio: { tipus: "globus_provat_o_anotat" },
        pistes: [
          "Al panell d'ampliació de la taula Tanc, selecciona «Globus» i tria el gas «Heli (0,17 g/L)».",
          "Observa que E = 0,118 N cap amunt, P = 0,046 N cap avall i la força neta és +0,072 N cap amunt. Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Com s'ho fa un globus aerostàtic per enlairar-se si està obert per sota i només conté aire?",
        facil: "Per què puja un globus aerostàtic quan encenen el cremador?",
        opcions: [
          { id: "e1", text: "El cremador escalfa l'aire interior, que es dilata i es fa menys dens (0,95 kg/m³ a 100 °C) que l'aire fred exterior (1,20 kg/m³)", correcta: true },
          { id: "e2", text: "El foc destrueix la gravetat dins la cistella", idea: "IP-07" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un globus de 10 L ple d'heli (0,17 g/L -> 1,7 g d'heli) amb una coberta de 3 g té un pes total P = 0,046 N i rep un empenyiment de l'aire E = 0,118 N. Quina força neta ascendent (en N) l'impulsa cap amunt?",
        facil: "Resta l'empenyiment (0,118 N) menys el pes total del globus (0,046 N) en N:",
        respostaNumerica: { valor: 0.072, unitat: "N", toleranciaRelativa: 0.03 },
        pistes: [
          "La força neta ascendent és Fneta = E − P.",
          "0,118 N − 0,046 N = 0,072 N.",
          "Escriu 0,072 i la unitat N."
        ]
      }
    ]
  },
  {
    id: "F10",
    titol: "Temperatura i densitat",
    pregunta: "L'aigua calenta i l'aigua freda tenen la mateixa densitat?",
    preguntaFacil: "Com canvia la densitat de l'aigua quan l'escalfem o quan es congela?",
    bloc: "F",
    nivells: [3],
    fase: "4",
    durada: 20,
    idees: ["IP-16"],
    escena: {
      taula: "tanc",
      objectes: ["glaco"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["termometre"],
      visibilitat: "experimental"
    },
    columnesDades: ["Temperatura (°C)", "Estat", "Densitat de l'aigua (g/cm³)"],
    valorsEsperats: "Gel a 0 °C: 0,917 g/cm³; Aigua líquida a 0 °C: 0,9998 g/cm³; a 4 °C: 1,0000 g/cm³ (densitat màxima!); a 20 °C: 0,9982 g/cm³; a 80 °C: 0,9718 g/cm³; a 100 °C: 0,9584 g/cm³.",
    conclusio: "En escalfar-se, l'aigua líquida es dilata i la seva densitat disminueix. Presenta una anomalia única entre 0 °C i 4 °C: assoleix la densitat màxima (1,0000 g/cm³) a 4 °C i el gel és menys dens que l'aigua, per això els llacs es glacen per la superfície.",
    conclusioFacil: "L'aigua calenta és menys densa i puja. A 4 °C l'aigua té la seva densitat màxima (1,0000 g/cm³), i el gel (0,917) sura a dalt!",
    passos: [
      {
        tipus: "observa",
        text: "A la taula del «Tanc», activa el control de Temperatura (−5 °C a 100 °C) i la vista de «Partícules» a la barra superior.",
        facil: "Mira el termòmetre i el control de temperatura al Tanc, i activa «Partícules»."
      },
      {
        tipus: "prediu",
        text: "A quina temperatura l'aigua líquida assoleix la seva densitat màxima (1,0000 g/cm³), i per què els llacs d'alta muntanya es congelen per dalt i l'aigua del fons es manté líquida a 4 °C?",
        facil: "A quina temperatura és més densa l'aigua líquida i queda al fons d'un llac glaçat?",
        opcions: [
          { id: "quatre", text: "A 4 °C: l'aigua a 4 °C és la més densa i va al fons, mentre que l'aigua a 0 °C i el gel (0,917 g/cm³) són menys densos i queden a dalt", correcta: true },
          { id: "zero", text: "Com més freda i glaçada està l'aigua, més densa és i per això es glaça des del fons", idea: "IP-16" }
        ],
        motius: [
          { id: "m1", text: "Perquè en congelar-se les molècules d'aigua formen una xarxa hexagonal oberta que ocupa més volum", correcta: true },
          { id: "m2", text: "Perquè el fred sempre puja", idea: "IP-16" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Varia la temperatura del bany d'aigua al Tanc entre 0 °C, 4 °C, 20 °C i 80 °C i anota la densitat al quadern.",
        facil: "Mou el control de temperatura a 4 °C i a 80 °C i prem Anota.",
        condicio: { tipus: "temperatura_provada_o_anotat" },
        pistes: [
          "Al panell d'ampliació del Tanc, ajusta la temperatura a 4 °C (1,0000 g/cm³) i a 80 °C (0,9718 g/cm³).",
          "Activa la vista «Partícules» per veure l'estructura hexagonal del gel i l'agitació tèrmica. Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Què passa si ajuntem amb cura aigua calenta a 80 °C (acolorida de vermell, d = 0,972 g/cm³) i aigua freda a 10 °C (acolorida de blau, d = 1,000 g/cm³)?",
        facil: "On va l'aigua calenta i on va l'aigua freda?",
        opcions: [
          { id: "e1", text: "L'aigua calenta és menys densa i puja a la part superior, mentre que l'aigua freda baixa al fons (corrents de convecció)", correcta: true },
          { id: "e2", text: "Tenen exactament la mateixa densitat a qualsevol temperatura", idea: "IP-16" }
        ]
      },
      {
        tipus: "aplica",
        text: "A 80 °C la densitat de l'aigua és de 0,9718 g/cm³. Quina massa en grams (g) té 1 litre (1000 cm³) d'aigua a 80 °C?",
        facil: "Multiplica 0,9718 g/cm³ per 1000 cm³ per trobar quants grams pesa 1 L d'aigua calenta a 80 °C:",
        respostaNumerica: { valor: 971.8, unitat: "g", toleranciaRelativa: 0.01 },
        pistes: [
          "Multiplica la densitat a 80 °C (0,9718 g/cm³) pel volum (1000 cm³).",
          "0,9718 × 1000 = 971,8 g (gairebé 28 g menys que a 4 °C!).",
          "Escriu 971,8 i la unitat g."
        ]
      }
    ]
  },
  {
    id: "F11",
    titol: "El densímetre",
    pregunta: "Es pot mesurar la densitat d'un líquid només mirant com sura un objecte?",
    preguntaFacil: "Com funciona un densímetre per saber la densitat de la llet, l'oli o l'aigua salada?",
    bloc: "F",
    nivells: [2, 3],
    fase: "4",
    durada: 15,
    idees: ["IP-14", "IP-17"],
    escena: {
      taula: "tanc",
      objectes: ["cub10_pi"],
      liquids: ["alcohol", "oli", "aigua", "llet", "aigua_salada", "mel"],
      recipients: ["tanc"],
      instruments: ["densimetre"],
      visibilitat: "experimental"
    },
    columnesDades: ["Líquid", "Enfonsament del densímetre", "Lectura del densímetre (g/cm³)"],
    valorsEsperats: "El densímetre s'enfonsa més en líquids poc densos (alcohol 0,79, oli 0,92) i sura més amunt en líquids més densos (aigua 1,00, llet 1,03, aigua salada 1,20, mel 1,42). L'escala té el 0,70 a dalt de la tija i l'1,50 a baix.",
    conclusio: "Com que el pes del densímetre és fix, el volum submergit és inversament proporcional a la densitat del líquid (Vsub = m / dL): com més dens és el líquid, menys s'enfonsa el flotador.",
    conclusioFacil: "En un líquid més dens (com l'aigua salada o la mel), el densímetre s'enfonsa menys i sura més amunt!",
    passos: [
      {
        tipus: "observa",
        text: "Activa el «Densímetre» al tanc: és un flotador de vidre llastat a la base amb una tija graduada de 0,70 a 1,50 g/cm³.",
        facil: "Mira el Densímetre dins del tanc."
      },
      {
        tipus: "prediu",
        text: "Com estan col·locats els números a l'escala de la tija d'un densímetre: les densitats petites (0,79) són a la part de dalt de la tija o a la part de baix?",
        facil: "En l'alcohol (0,79 g/cm³), el densímetre s'enfonsarà més o menys que en l'aigua salada (1,20 g/cm³)?",
        opcions: [
          { id: "dalt_petit", text: "En l'alcohol s'enfonsa més (per tant, la marca 0,79 és a la part alta de la tija i la d'1,20 és més a baix)", correcta: true },
          { id: "baix_petit", text: "En l'alcohol s'enfonsa menys perquè l'alcohol pesa menys", idea: "IP-17" }
        ],
        motius: [
          { id: "m1", text: "Perquè en un líquid menys dens cal submergir més volum de densímetre per igualar el seu pes", correcta: true },
          { id: "m2", text: "Perquè totes les escales tenen els números petits a baix", idea: "IP-14" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Prova el densímetre al Tanc canviant el líquid entre alcohol (0,79), aigua (1,00) i aigua salada (1,20), i anota la lectura.",
        facil: "Activa el Densímetre al Tanc, canvia el líquid i prem Anota.",
        condicio: { tipus: "densimetre_provat_o_anotat" },
        pistes: [
          "A la taula Tanc, activa el mòdul «Densímetre» i canvia el líquid a oli (0,92) o aigua salada (1,20).",
          "Prem Anota per desar la lectura al quadern."
        ]
      },
      {
        tipus: "explica",
        text: "Si un lactodensímetre (densímetre per a la llet, que hauria de marcar 1,03 g/cm³) s'enfonsa més del compte i marca 1,015 g/cm³, què indica?",
        facil: "La llet normal té 1,03 g/cm³. Si el densímetre marca 1,015 g/cm³ (més a prop d'1,00), què ha passat?",
        opcions: [
          { id: "e1", text: "Que la llet ha estat aigualida (s'hi ha afegit aigua d'1,00 g/cm³, abaixant-ne la densitat)", correcta: true },
          { id: "e2", text: "Que la llet té més nata i més calci del normal", idea: "IP-16" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un densímetre té una massa total de 24 g. Quants centímetres cúbics (cm³) del seu volum queden submergits quan sura en aigua salada de densitat 1,20 g/cm³?",
        facil: "Divideix la massa del densímetre (24 g) entre la densitat del líquid (1,20 g/cm³) per trobar el volum submergit en cm³:",
        respostaNumerica: { valor: 20, unitat: "cm³", toleranciaRelativa: 0.01 },
        pistes: [
          "Quan sura, el volum submergit és Vsub = m / dL.",
          "Divideix 24 g ÷ 1,20 g/cm³ = 20 cm³.",
          "Escriu 20 i la unitat cm³."
        ]
      }
    ]
  }
];

export const BLOC_G = [
  {
    id: "G1",
    titol: "Més avall, més pressió",
    pregunta: "Com canvia la pressió dins d'un líquid?",
    preguntaFacil: "Com canvia la pressió de l'aigua a mesura que baixem més avall?",
    bloc: "G",
    nivells: [3],
    fase: "4",
    durada: 15,
    idees: ["IP-12"],
    escena: {
      taula: "tanc",
      objectes: ["A"],
      liquids: ["aigua", "aigua_salada", "alcohol"],
      recipients: ["tanc"],
      instruments: ["sonda_pressio"],
      visibilitat: "experimental"
    },
    columnesDades: ["Líquid", "Densitat (g/cm³)", "Profunditat h (cm)", "Pressió hidrostàtica p (Pa)"],
    valorsEsperats: "En aigua (1,00 g/cm³ = 1000 kg/m³, g = 9,8 N/kg): a 10 cm (0,1 m) -> 980 Pa; a 20 cm -> 1960 Pa; a 50 cm (0,5 m) -> 4900 Pa; a 100 cm (1 m) -> 9800 Pa; a 200 cm (2 m) -> 19 600 Pa.",
    conclusio: "La pressió hidrostàtica dins d'un líquid en repòs és directament proporcional a la profunditat i a la densitat del líquid: p = dL · g · h.",
    conclusioFacil: "Com més avall baixem i com més dens és el líquid, més gran és la pressió: p = d · g · h.",
    passos: [
      {
        tipus: "observa",
        text: "A la taula del «Tanc» activa la «Sonda de pressió», que pots desplaçar a qualsevol profunditat h (en cm) per llegir la pressió hidrostàtica en pascals (Pa).",
        facil: "Activa la «Sonda de pressió» a la taula del Tanc."
      },
      {
        tipus: "prediu",
        text: "A 10 cm de profunditat dins d'aigua dolça, la sonda marca 980 Pa. Què marcarà si baixem la sonda al doble de profunditat (20 cm)?",
        facil: "A 10 cm hi ha 980 Pa de pressió. Quina pressió hi haurà al doble de profunditat (20 cm)?",
        opcions: [
          { id: "doble", text: "El doble: 1960 Pa, perquè la pressió hidrostàtica és directament proporcional a la profunditat (p = dL · g · h)", correcta: true },
          { id: "igual", text: "980 Pa igualment, perquè dins d'un mateix líquid tot és igual", idea: "IP-12" }
        ],
        motius: [
          { id: "m1", text: "Perquè a doble profunditat sosté el pes d'una columna de líquid el doble d'alta", correcta: true },
          { id: "m2", text: "Perquè la pressió és el mateix que l'empenyiment", idea: "IP-12" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Mou la sonda de pressió a diferents profunditats (per exemple 10 cm, 20 cm i 40 cm) i canvia el líquid. Anota almenys una lectura al quadern.",
        facil: "Mou la sonda de pressió dins l'aigua i prem Anota.",
        condicio: { tipus: "sonda_provada_o_anotat" },
        pistes: [
          "A la taula Tanc, activa la «Sonda de pressió» i mou el control de profunditat a 20 cm (1960 Pa).",
          "Prem Anota al panell de la sonda."
        ]
      },
      {
        tipus: "explica",
        text: "Si una ampolla plena d'aigua té tres forats a alçades diferents, per quin forat surt el doll d'aigua amb més velocitat i arriba més lluny?",
        facil: "Per quin dels tres forats d'una ampolla surt l'aigua amb més força?",
        opcions: [
          { id: "e1", text: "Pel forat més baix, perquè és a més profunditat sota la superfície lliure i la pressió és més gran", correcta: true },
          { id: "e2", text: "Pels tres forats surt exactament igual", idea: "IP-12" }
        ]
      },
      {
        tipus: "aplica",
        text: "Calcula amb p = dL · g · h la pressió hidrostàtica en pascals (Pa) a 2 m (200 cm) de profunditat en una piscina d'aigua dolça (dL = 1000 kg/m³, g = 9,8 N/kg).",
        facil: "Multiplica 1000 kg/m³ × 9,8 N/kg × 2 m per calcular la pressió en Pa:",
        respostaNumerica: { valor: 19600, unitat: "Pa", toleranciaRelativa: 0.01 },
        pistes: [
          "Aplica p = dL · g · h amb dL = 1000 kg/m³, g = 9,8 N/kg i h = 2 m.",
          "1000 × 9,8 × 2 = 19 600 Pa.",
          "Escriu 19600 i la unitat Pa."
        ]
      }
    ]
  },
  {
    id: "G2",
    titol: "La forma del recipient importa?",
    pregunta: "Hi ha més pressió al fons d'un recipient ample que al d'un d'estret?",
    preguntaFacil: "A la mateixa profunditat, hi ha més pressió en un tanc ample que en un tub estret?",
    bloc: "G",
    nivells: [3],
    fase: "4",
    durada: 15,
    idees: ["IP-20"],
    escena: {
      taula: "tanc",
      objectes: [],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["sonda_pressio"],
      visibilitat: "experimental"
    },
    columnesDades: ["Forma del recipient", "Profunditat h (cm)", "Volum total d'aigua (mL)", "Pressió p (Pa)"],
    valorsEsperats: "A 30 cm de profunditat en aigua (1,00 g/cm³), tant en un tub estret (150 mL) com en un tanc ample (9000 mL) o en un vas cònic, la pressió és exactament 2940 Pa (paradoxa hidrostàtica).",
    conclusio: "Paradoxa hidrostàtica: a una mateixa profunditat dins d'un mateix líquid, la pressió és idèntica sigui quina sigui la forma o l'amplada del recipient i la quantitat total de líquid.",
    conclusioFacil: "A la mateixa profunditat la pressió és sempre la mateixa: no importa si és un got estret o un llac sencer!",
    passos: [
      {
        tipus: "observa",
        text: "Al mòdul d'hidrostàtica del «Tanc» podem comparar recipients de formes diferents (estret, ample, cònic obert i cònic tancat) omplerts fins a la mateixa alçada d'aigua.",
        facil: "Mira els recipients de formes diferents amb la sonda de pressió."
      },
      {
        tipus: "prediu",
        text: "Un tanc ample conté 10 litres d'aigua i una proveta estreta en conté només 0,2 litres, però en tots dos el nivell de l'aigua té una alçada de 30 cm. En quin dels dos hi ha més pressió a 30 cm de profunditat?",
        facil: "El tanc ample i el tub estret tenen 30 cm d'alçada d'aigua. On hi ha més pressió al fons?",
        opcions: [
          { id: "ample", text: "Al tanc ample, perquè conté 50 vegades més aigua", idea: "IP-20" },
          { id: "igual", text: "Hi ha exactament la mateixa pressió (2940 Pa), perquè només depèn de la profunditat (30 cm) i de la densitat del líquid", correcta: true },
          { id: "estret", text: "Al tub estret, perquè l'aigua està més apretada", idea: "IP-20" }
        ],
        motius: [
          { id: "m1", text: "Perquè a la fórmula p = dL · g · h no hi intervé ni l'àrea ni el volum total del recipient", correcta: true },
          { id: "m2", text: "Perquè tota la massa d'aigua del tanc es concentra en el punt de la sonda", idea: "IP-20" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Compara amb la sonda la pressió a la mateixa profunditat canviant la forma del recipient i anota la lectura al quadern.",
        facil: "Mesura la pressió amb la sonda i prem Anota.",
        condicio: { tipus: "sonda_provada_o_anotat" },
        pistes: [
          "Activa la Sonda de pressió al Tanc, posa-la a 30 cm de profunditat (2940 Pa) i canvia la forma del recipient.",
          "Comprova que la lectura és idèntica en tots els recipients i prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Com va demostrar Blaise Pascal el 1646 que la pressió només depèn de l'alçada de la columna i no de la quantitat d'aigua?",
        facil: "Com funciona l'experiment del barril de Pascal?",
        opcions: [
          { id: "e1", text: "Amb un sol got d'aigua abocat per un tub molt prim i molt alt (10 m) va fer rebentar per pressió un barril ple", correcta: true },
          { id: "e2", text: "Posant una tona de ferro a sobre del barril", idea: "IP-20" }
        ]
      },
      {
        tipus: "aplica",
        text: "Quina pressió hidrostàtica (en Pa) hi ha al fons d'un tub prim vertical de 30 cm (0,30 m) d'alçada ple d'aigua (dL = 1000 kg/m³, g = 9,8 N/kg)?",
        facil: "Multiplica 1000 × 9,8 × 0,30 m per calcular la pressió en Pa a 30 cm de profunditat:",
        respostaNumerica: { valor: 2940, unitat: "Pa", toleranciaRelativa: 0.01 },
        pistes: [
          "Aplica p = dL · g · h amb dL = 1000 kg/m³, g = 9,8 N/kg i h = 0,30 m.",
          "1000 × 9,8 × 0,30 = 2940 Pa.",
          "Escriu 2940 i la unitat Pa."
        ]
      }
    ]
  },
  {
    id: "G3",
    titol: "D'on surt l'empenyiment?",
    pregunta: "Si la pressió augmenta amb la profunditat, per què l'empenyiment no?",
    preguntaFacil: "Com expliquem la força d'empenyiment amb la pressió que fa l'aigua per sota i per sobre d'un cub?",
    bloc: "G",
    nivells: [3],
    fase: "4",
    durada: 20,
    idees: ["IP-12"],
    escena: {
      taula: "tanc",
      objectes: ["cub10_pi", "A"],
      liquids: ["aigua"],
      recipients: ["tanc"],
      instruments: ["sonda_pressio", "dinamometre_20"],
      visibilitat: "experimental"
    },
    columnesDades: ["Profunditat cara sup. (cm)", "Força superior Fsup (N)", "Força inferior Finf (N)", "Diferència Finf − Fsup (N)", "Empenyiment E (N)"],
    valorsEsperats: "Cub de 10 cm d'aresta (S = 100 cm² = 0,01 m², V = 1000 cm³) en aigua: 1) Cara superior a 5 cm (p = 490 Pa -> Fsup = 4,9 N avall) i cara inferior a 15 cm (p = 1470 Pa -> Finf = 14,7 N amunt) -> diferència = 14,7 − 4,9 = 9,8 N = E. 2) Cara superior a 25 cm (Fsup = 24,5 N) i cara inferior a 35 cm (Finf = 34,3 N) -> diferència = 34,3 − 24,5 = 9,8 N = E!",
    conclusio: "L'empenyiment d'Arquimedes és la resultant de les forces de pressió hidrostàtica: la cara inferior està a més profunditat que la superior i rep una força cap amunt més gran que la força cap avall sobre la cara superior (Finf − Fsup = dL · g · V = E). En baixar el cub, totes dues forces creixen igual i la seva diferència es manté constant.",
    conclusioFacil: "L'aigua estreny més fort per sota del cub que per sobre perquè la cara de sota és més fonda! Quan baixem el cub, les dues forces creixen igual i la resta (9,8 N) no canvia.",
    passos: [
      {
        tipus: "observa",
        text: "Al Tanc tenim un cub submergit de 10 cm d'aresta (àrea de cada cara S = 100 cm² = 0,01 m², volum V = 1000 cm³) amb les fletxes de pressió hidrostàtica sobre les seves cares.",
        facil: "Mira les fletxes de pressió sobre les cares de dalt, de baix i dels costats del cub de 10 cm."
      },
      {
        tipus: "prediu",
        text: "Amb la cara superior del cub de 10 cm a 5 cm de profunditat, l'aigua empeny la cara de dalt cap avall amb Fsup = 4,9 N, i la cara de baix (a 15 cm) cap amunt amb Finf = 14,7 N (diferència = 9,8 N). Què passarà amb la diferència Finf − Fsup si baixem el cub perquè tingui la cara superior a 25 cm i la inferior a 35 cm?",
        facil: "A 5 cm les forces són 14,7 N − 4,9 N = 9,8 N. Si baixem el cub 20 cm més avall, quant valdrà la resta Finf − Fsup?",
        opcions: [
          { id: "constant", text: "Tant Finf (34,3 N) com Fsup (24,5 N) augmenten en 19,6 N, així que la diferència continua sent exactament 9,8 N", correcta: true },
          { id: "creix", text: "La diferència serà molt més gran perquè estem més avall", idea: "IP-12" }
        ],
        motius: [
          { id: "m1", text: "Perquè la diferència de profunditat entre la cara inferior i la superior és sempre l'alçada del cub (10 cm)", correcta: true },
          { id: "m2", text: "Perquè la cara de dalt no rep pressió", idea: "IP-12" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Activa el visor de «Pressió sobre cares» al Tanc, compara les forces superior i inferior a dues profunditats i anota les dades al quadern.",
        facil: "Mira les forces sobre la cara superior i inferior del cub al Tanc i prem Anota.",
        condicio: { tipus: "sonda_provada_o_anotat" },
        pistes: [
          "A la taula Tanc, activa «Sonda / Pressió» i observa Fsup = 4,9 N i Finf = 14,7 N per al cub de 10 cm.",
          "Comprova que Finf − Fsup = 9,8 N coincideix amb l'empenyiment d'Arquimedes d'1000 cm³ d'aigua. Prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "I què passa amb les forces de pressió que l'aigua fa sobre les cares laterals (esquerra i dreta) del cub?",
        facil: "Per què les forces dels costats esquerre i dret no mouen el cub cap als costats?",
        opcions: [
          { id: "e1", text: "A cada alçada tenen la mateixa profunditat, la mateixa magnitud i sentits oposats, així que es cancel·len mútuament", correcta: true },
          { id: "e2", text: "Els líquids només fan pressió en vertical i mai cap als costats", idea: "IP-20" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un cub de 10 cm d'aresta (àrea S = 0,01 m²) té la cara superior a 25 cm (Fsup = 24,5 N cap avall) i la cara inferior a 35 cm (Finf = 34,3 N cap amunt). Calcula la força resultant vertical (empenyiment E = Finf − Fsup, en N).",
        facil: "Resta la força de la cara de sota (34,3 N) menys la de la cara de dalt (24,5 N) en N:",
        respostaNumerica: { valor: 9.8, unitat: "N", toleranciaRelativa: 0.01 },
        pistes: [
          "Resta Finf − Fsup = 34,3 N − 24,5 N.",
          "34,3 − 24,5 = 9,8 N (exactament igual que quan era a 5 cm!).",
          "Escriu 9,8 i la unitat N."
        ]
      }
    ]
  }
];
