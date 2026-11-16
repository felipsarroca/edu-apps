/* SPDX-License-Identifier: AGPL-3.0-or-later */
/**
 * Investigacions del bloc D (Flotabilitat, D1–D8).
 * Basat en 06-cataleg-investigacions-2.md i 10-llengua-i-glossari.md.
 */

export const BLOC_D = [
  {
    id: "D1",
    titol: "Sura o s'enfonsa?",
    pregunta: "Què fa que un objecte suri?",
    preguntaFacil: "Per què uns objectes suren (floten) i d'altres s'enfonsen?",
    bloc: "D",
    nivells: [1],
    fase: "1a",
    durada: 15,
    idees: ["IP-01", "IP-02", "IP-18"],
    escena: {
      taula: "mesura",
      objectes: ["clau", "B", "C", "A", "tap", "espelma", "glaco", "bala_vidre", "peca_escacs", "pedra_tosca"],
      liquids: ["aigua"],
      recipients: ["vas600"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Predicció", "Resultat", "Massa (g)"],
    valorsEsperats: "Suren: bloc de fusta B (100 g), tap de suro (5 g), espelma (45 g), glaçó (27,6 g), pedra tosca (30 g). S'enfonsen: clau (15,7 g), bola plastilina C (60 g), bloc metàl·lic A (270 g), bala de vidre (10 g), peça de banús (22 g).",
    conclusio: "Surar no depèn només de la massa ni només de la mida: hi ha objectes pesants que suren (bloc de fusta de 100 g) i objectes lleugers que s'enfonsen (clau de 15,7 g).",
    conclusioFacil: "Un objecte gran com la fusta (100 g) sura, i un de petit com el clau (15,7 g) s'enfonsa. El pes sol no ho explica!",
    passos: [
      {
        tipus: "observa",
        text: "Tenim deu objectes al prestatge: des d'un clau petit de ferro (15,7 g) i una bala de vidre (10 g) fins a un bloc de fusta (100 g), una peça d'escacs de fusta de banús i una pedra tosca.",
        facil: "Mira els deu objectes del prestatge i el vas d'aigua."
      },
      {
        tipus: "prediu",
        text: "El bloc de fusta B té una massa de 100 g i el clau de ferro només té 15,7 g. Què passarà quan els posem a l'aigua?",
        facil: "El bloc de fusta pesa 100 g i el clau pesa 15,7 g. Què passarà a l'aigua?",
        opcions: [
          { id: "pes", text: "El bloc de fusta s'enfonsarà perquè pesa molt més que el clau", idea: "IP-01" },
          { id: "real", text: "El bloc de fusta (100 g) surarà i el clau (15,7 g) s'enfonsarà", correcta: true },
          { id: "tots_suren", text: "Tots dos suraran perquè pesen menys d'un quilo", idea: "IP-01" }
        ],
        motius: [
          { id: "m1", text: "Perquè el que pesa molt sempre s'enfonsa", idea: "IP-01" },
          { id: "m2", text: "Perquè la flotació depèn de la relació entre massa i volum (el material), no de la massa sola", correcta: true }
        ]
      },
      {
        tipus: "experimenta",
        text: "Prova els objectes al vas d'aigua (especialment el clau, el bloc de fusta B, la pedra tosca i la peça de banús) i pesa'ls a la balança.",
        facil: "Posa els objectes al vas d'aigua i a la balança. Prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Porta el bloc B i el clau al vas d'aigua per comprovar qui sura (flota) i qui s'enfonsa.",
          "Prova la pedra tosca (una pedra que sura!) i la peça d'escacs de banús (una fusta que s'enfonsa!).",
          "Pesa'ls a la balança i prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Per què aquest experiment desmunta la idea que «els objectes pesants s'enfonsen i els lleugers suren»?",
        facil: "Per què no és veritat que «el que pesa poc sura»?",
        opcions: [
          { id: "e1", text: "Perquè la bala de vidre (10 g) i el clau (15,7 g) s'enfonsen, mentre que el bloc de fusta (100 g) sura", correcta: true },
          { id: "e2", text: "Perquè totes les fustes suren i totes les pedres s'enfonsen sense excepció", idea: "IP-18" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un tronc de pi té una massa de 2000 g (2 kg) i un volum de 4000 cm³. Calcula la seva densitat (en g/cm³) per comprovar que és inferior a la de l'aigua (1,00 g/cm³).",
        facil: "Un tronc té 2000 g de massa i 4000 cm³ de volum. Calcula la seva densitat (2000 ÷ 4000) en g/cm³:",
        respostaNumerica: { valor: 0.5, unitat: "g/cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "Divideix la massa (2000 g) entre el volum (4000 cm³).",
          "2000 ÷ 4000 = 0,50 g/cm³.",
          "Escriu 0,5 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "D2",
    titol: "Quatre esferes",
    pregunta: "Massa, volum o densitat: què decideix si una esfera sura?",
    preguntaFacil: "Què decideix si una esfera sura (flota) a l'aigua: la massa, el volum o la densitat?",
    bloc: "D",
    nivells: [1, 2],
    fase: "1a",
    durada: 20,
    idees: ["IP-01", "IP-02"],
    escena: {
      taula: "mesura",
      objectes: ["esfera_pi_20", "esfera_pi_60", "esfera_plast_20", "esfera_plast_60"],
      liquids: ["aigua"],
      recipients: ["proveta500", "vas600"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Esfera", "Massa (g)", "Volum (cm³)", "Densitat (g/cm³)", "Sura?"],
    valorsEsperats: "E1 (fusta petita): 10 g, 20 cm³, d = 0,50 g/cm³ (sura); E2 (fusta gran): 30 g, 60 cm³, d = 0,50 g/cm³ (sura); E3 (plastilina petita): 30 g, 20 cm³, d = 1,50 g/cm³ (s'enfonsa); E4 (plastilina gran): 90 g, 60 cm³, d = 1,50 g/cm³ (s'enfonsa).",
    conclusio: "Un objecte massís sura a l'aigua si la seva densitat és més petita que la de l'aigua (1,00 g/cm³), i s'enfonsa si és més gran.",
    conclusioFacil: "Si la densitat de l'objecte és més petita que 1,00 g/cm³ (la de l'aigua), sura. Si és més gran, s'enfonsa.",
    passos: [
      {
        tipus: "observa",
        text: "Tenim quatre esferes: dues de fusta (E1 petita i E2 gran) i dues de plastilina (E3 petita i E4 gran). Fixa't que E2 i E3 tenen exactament la mateixa massa (30 g)!",
        facil: "Mira les quatre esferes E1, E2, E3 i E4."
      },
      {
        tipus: "prediu",
        text: "L'esfera gran de fusta (E2) i l'esfera petita de plastilina (E3) tenen exactament la mateixa massa (30 g). Què faran a l'aigua?",
        facil: "E2 (fusta gran) i E3 (plastilina petita) pesen 30 g totes dues. Què faran a l'aigua?",
        opcions: [
          { id: "igual", text: "Faran el mateix perquè totes dues tenen 30 g de massa", idea: "IP-01" },
          { id: "gran_enfonsa", text: "La gran (E2) s'enfonsarà perquè és més grossa", idea: "IP-02" },
          { id: "fusta_sura", text: "La de fusta (E2) surarà (d = 0,50 g/cm³) i la de plastilina (E3) s'enfonsarà (d = 1,50 g/cm³)", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè la densitat de la fusta és menor que la de l'aigua i la de la plastilina és major", correcta: true },
          { id: "m2", text: "Perquè la massa és l'única cosa que importa", idea: "IP-01" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Mesura la massa de les esferes a la balança, comprova el seu comportament al vas d'aigua i anota les dades al quadern.",
        facil: "Pesa E2 i E3, prova-les al vas d'aigua i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 2 },
        pistes: [
          "Pesa E2 (30 g) i E3 (30 g) a la balança i prem Anota.",
          "Posa E2 i E3 al vas d'aigua: tot i pesar 30 g totes dues, E2 sura i E3 s'enfonsa.",
          "Mesura també el volum a la proveta (usant la Vareta per a les de fusta)."
        ]
      },
      {
        tipus: "explica",
        text: "Quina condició ha de complir la densitat d'un objecte massís perquè suri en l'aigua (d = 1,00 g/cm³)?",
        facil: "Quan sura un objecte massís a l'aigua?",
        opcions: [
          { id: "e1", text: "La densitat de l'objecte ha de ser més petita que la densitat de l'aigua (d < 1,00 g/cm³)", correcta: true },
          { id: "e2", text: "La densitat de l'objecte ha de ser més gran que 1,00 g/cm³", idea: "IP-02" }
        ]
      },
      {
        tipus: "aplica",
        text: "Tenim tres objectes: una espelma de cera (0,90 g/cm³), un glaçó de gel (0,92 g/cm³) i una peça de fusta de banús (1,10 g/cm³). Quina és la densitat (en g/cm³) de l'únic dels tres que s'enfonsarà a l'aigua?",
        facil: "Entre la cera (0,90), el gel (0,92) i el banús (1,10), quin té una densitat més gran que l'aigua (1,00 g/cm³) i s'enfonsa?",
        respostaNumerica: { valor: 1.1, unitat: "g/cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "S'enfonsen en l'aigua els objectes amb densitat superior a 1,00 g/cm³.",
          "0,90 i 0,92 són menors que 1,00 (suren). 1,10 g/cm³ és major que 1,00 (s'enfonsa).",
          "Escriu 1,10 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "D3",
    titol: "La columna de líquids",
    pregunta: "On queda cada líquid i on queda cada bola?",
    preguntaFacil: "En quin ordre es col·loquen els líquids i les boles dins d'una columna?",
    bloc: "D",
    nivells: [1, 2],
    fase: "1a",
    durada: 20,
    idees: ["IP-16", "IP-01"],
    escena: {
      taula: "columna",
      objectes: ["bola_col_poliestire", "bola_col_cera", "bola_col_polietile", "bola_col_nilo", "bola_col_estany"],
      liquids: ["mel", "aigua", "oli", "alcohol"],
      recipients: ["proveta500"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Bola / Líquid", "Material", "Densitat (g/cm³)", "Posició a la columna"],
    valorsEsperats: "Capes de baix a dalt: mel (1,42) → aigua (1,00) → oli (0,92) → alcohol (0,79). Boles: poliestirè (0,05) a dalt de tot; cera (0,90) entre alcohol i oli; polietilè (0,95) entre oli i aigua; niló (1,15) entre aigua i mel; estany (7,30) al fons.",
    conclusio: "Cada líquid i cada bola se situen segons la seva densitat, de més dens a baix a menys dens a dalt.",
    conclusioFacil: "Els líquids i les boles s'ordenen per densitat: els més densos a baix i els menys densos a dalt.",
    passos: [
      {
        tipus: "observa",
        text: "A la taula «Columna» tenim quatre líquids: mel (1,42 g/cm³), aigua (1,00 g/cm³), oli (0,92 g/cm³) i alcohol acolorit (0,79 g/cm³), i cinc boles de materials diferents.",
        facil: "Mira la columna de líquids i les cinc boles B1 a B5."
      },
      {
        tipus: "prediu",
        text: "Si aboquem amb cura mel, aigua, oli i alcohol a la columna, quin quedarà al fons de tot i quin a dalt de tot?",
        facil: "Quin líquid quedarà a baix de tot i quin a dalt de tot?",
        opcions: [
          { id: "ordre_bo", text: "De baix a dalt: mel (1,42) → aigua (1,00) → oli (0,92) → alcohol (0,79)", correcta: true },
          { id: "oli_baix", text: "De baix a dalt: mel → oli → aigua → alcohol, perquè l'oli és més espès que l'aigua", idea: "IP-16" },
          { id: "ordre_abocat", text: "Quedaran en l'ordre en què els hàgim abocat", idea: "IP-16" }
        ],
        motius: [
          { id: "m1", text: "Perquè s'ordenen per densitat decreixent de baix a dalt", correcta: true },
          { id: "m2", text: "Perquè el líquid més espès va sempre a sota", idea: "IP-16" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Aboca els quatre líquids amb cura a la columna i deixa-hi caure les boles B1 (poliestirè), B2 (cera), B3 (polietilè), B4 (niló) i B5 (estany).",
        facil: "Posa els quatre líquids a la columna i deixa-hi caure les boles B1 a B5.",
        condicio: { tipus: "objecte_en_columna", min: 1 },
        pistes: [
          "Prem el botó «Omple les 4 capes» o aboca mel, aigua, oli i alcohol amb l'opció «Amb cura».",
          "Arrossega les boles B1..B5 a la proveta de la columna i observa en quina frontera s'atura cadascuna."
        ]
      },
      {
        tipus: "explica",
        text: "On s'atura la bola B2 de cera (densitat 0,90 g/cm³) dins la columna i per què?",
        facil: "La cera té densitat 0,90 g/cm³. Entre quins dos líquids queda?",
        opcions: [
          { id: "e1", text: "Queda a la frontera entre l'alcohol (0,79) i l'oli (0,92), perquè és més densa que l'alcohol però menys que l'oli", correcta: true },
          { id: "e2", text: "Va fins al fons de la mel perquè és sòlida", idea: "IP-01" }
        ]
      },
      {
        tipus: "aplica",
        text: "Deixem caure una peça de niló (densitat 1,15 g/cm³) a la columna. Quina és la densitat (en g/cm³) del líquid sobre el qual surarà (entre l'aigua d'1,00 i la mel d'1,42)?",
        facil: "El niló (1,15 g/cm³) s'enfonsa a l'aigua (1,00) però sura sobre la mel. Quina densitat té la mel en g/cm³?",
        respostaNumerica: { valor: 1.42, unitat: "g/cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "El niló (1,15 g/cm³) baixa a través de l'alcohol (0,79), l'oli (0,92) i l'aigua (1,00), i s'atura sobre la capa de mel.",
          "La densitat de la mel és 1,42 g/cm³.",
          "Escriu 1,42 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "D4",
    titol: "Canviem el líquid",
    pregunta: "Un objecte que s'enfonsa a l'aigua, s'enfonsa a tot arreu?",
    preguntaFacil: "Si un objecte s'enfonsa a l'aigua, s'enfonsa en tots els líquids?",
    bloc: "D",
    nivells: [2],
    fase: "1a",
    durada: 15,
    idees: ["IP-17"],
    escena: {
      taula: "mesura",
      objectes: ["espelma", "ou", "dau_polietile", "clau"],
      liquids: ["alcohol", "aigua", "aigua_salada", "mercuri"],
      recipients: ["vas600"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Objecte", "Densitat objecte (g/cm³)", "Líquid", "Densitat líquid (g/cm³)", "Resultat"],
    valorsEsperats: "Espelma (0,90): s'enfonsa en alcohol (0,79) i sura en aigua (1,00); Ou (1,07): s'enfonsa en aigua (1,00) i sura en aigua salada (1,20); Clau de ferro (7,87): s'enfonsa en aigua i sura en mercuri (13,55).",
    conclusio: "Surar depèn tant de l'objecte com del líquid: cal comparar les dues densitats (dobj < dL). La quantitat de líquid no hi influeix.",
    conclusioFacil: "Un mateix objecte pot surar en un líquid i enfonsar-se en un altre. Tot depèn de si el líquid és més dens que l'objecte.",
    passos: [
      {
        tipus: "observa",
        text: "Tenim quatre objectes: una espelma de cera (0,90 g/cm³), un ou (1,07 g/cm³), un dau de polietilè (0,95 g/cm³) i un clau de ferro (7,87 g/cm³), i quatre líquids: alcohol (0,79), aigua (1,00), aigua salada (1,20) i mercuri (13,55).",
        facil: "Mira l'espelma, l'ou, el dau i el clau, i els quatre líquids."
      },
      {
        tipus: "prediu",
        text: "L'espelma de cera (0,90 g/cm³) sura a l'aigua, i el clau de ferro (7,87 g/cm³) s'hi enfonsa. Què passarà si posem l'espelma en alcohol (0,79 g/cm³) i el clau de ferro en mercuri (13,55 g/cm³)?",
        facil: "Què faran l'espelma en alcohol (0,79) i el clau de ferro en mercuri (13,55)?",
        opcions: [
          { id: "invers", text: "L'espelma s'enfonsarà en l'alcohol i el clau de ferro surarà en el mercuri", correcta: true },
          { id: "igual_aigua", text: "L'espelma continuarà surant i el ferro continuarà enfonsant-se a tot arreu", idea: "IP-17" }
        ],
        motius: [
          { id: "m1", text: "Perquè 0,90 > 0,79 (cera en alcohol) i 7,87 < 13,55 (ferro en mercuri)", correcta: true },
          { id: "m2", text: "Perquè surar és una propietat fixa de l'objecte", idea: "IP-17" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Canvia el líquid del vas entre aigua, alcohol, aigua salada i mercuri, prova-hi l'espelma, l'ou i el clau, i anota les observacions.",
        facil: "Prova l'espelma en alcohol i el clau en mercuri al vas.",
        condicio: { tipus: "objecte_en_vas_o_anotat", min: 1 },
        pistes: [
          "Selecciona el líquid «alcohol» per al vas i posa-hi l'espelma (Es): veuràs que s'enfonsa!",
          "Selecciona el líquid «mercuri» i posa-hi el clau (Cl): veuràs que el ferro sura al 58 %!"
        ]
      },
      {
        tipus: "explica",
        text: "Per què costa menys surar quan nedes al mar que quan nedes en una piscina d'aigua dolça?",
        facil: "Per què surem millor a l'aigua del mar que a la piscina?",
        opcions: [
          { id: "e1", text: "Perquè l'aigua de mar conté sal dissolta i és més densa (1,03 g/cm³) que l'aigua dolça (1,00 g/cm³)", correcta: true },
          { id: "e2", text: "Perquè al mar hi ha molta més quantitat d'aigua que a la piscina", idea: "IP-17" }
        ]
      },
      {
        tipus: "aplica",
        text: "El ferro (7,87 g/cm³) sura en el mercuri (13,55 g/cm³). I una peça d'or pur (19,30 g/cm³)? Escriu la densitat de l'or en g/cm³ per confirmar que és superior a 13,55 g/cm³ i s'enfonsa fins i tot en mercuri.",
        facil: "L'or té una densitat de 19,3 g/cm³ (més gran que el mercuri, 13,55). Escriu la densitat de l'or en g/cm³:",
        respostaNumerica: { valor: 19.3, unitat: "g/cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "Com que 19,30 g/cm³ > 13,55 g/cm³, l'or és dels pocs metalls que s'enfonsen en el mercuri.",
          "Escriu 19,3 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "D5",
    titol: "L'ou que sura",
    pregunta: "Pots fer surar un ou sense tocar-lo?",
    preguntaFacil: "Com podem fer que un ou pugi del fons del vas sense tocar-lo?",
    bloc: "D",
    nivells: [1, 2],
    fase: "1a",
    durada: 15,
    idees: ["IP-17"],
    escena: {
      taula: "columna",
      objectes: ["ou"],
      liquids: ["aigua"],
      recipients: ["vas600", "matras100"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Sal afegida (g)", "Densitat de l'aigua (g/mL)", "Comportament de l'ou"],
    valorsEsperats: "Ou fresc (60 g, 56 cm³, d = 1,071 g/cm³): en aigua dolça (1,00) s'enfonsa; en afegir sal fins a superar d = 1,071 g/mL (~10 % en massa, unes 11 cullerades de 5 g en 500 mL) l'ou puja i sura.",
    conclusio: "L'ou comença a surar quan l'aigua salada arriba a la seva densitat (1,07 g/cm³). No ha canviat l'ou: ha canviat la densitat del líquid.",
    conclusioFacil: "Quan afegim sal i remenem, l'aigua es fa més densa. Quan supera 1,07 g/cm³, l'ou puja i sura!",
    passos: [
      {
        tipus: "observa",
        text: "A la taula tenim un vas amb aigua dolça, un ou fresc (60 g, 56 cm³, d = 1,07 g/cm³) i un pot de sal amb cullerades de 5 g.",
        facil: "Mira l'ou al vas d'aigua i el pot de sal."
      },
      {
        tipus: "prediu",
        text: "L'ou fresc s'enfonsa a l'aigua dolça perquè la seva densitat (1,07 g/cm³) és més gran que la de l'aigua (1,00 g/cm³). Què passarà si anem afegint sal a l'aigua i remenem?",
        facil: "Què passarà amb l'ou si afegim cullerades de sal a l'aigua?",
        opcions: [
          { id: "sura", text: "Quan la densitat de l'aigua salada superi 1,07 g/cm³, l'ou pujarà i surarà", correcta: true },
          { id: "enfonsa_mes", text: "S'enfonsarà encara més perquè la sal pesa damunt de l'ou", idea: "IP-01" },
          { id: "igual", text: "No canviarà res perquè l'ou continua pesant 60 g", idea: "IP-17" }
        ],
        motius: [
          { id: "m1", text: "Perquè la sal dissolta augmenta la massa de l'aigua gairebé sense augmentar-ne el volum, fent el líquid més dens", correcta: true },
          { id: "m2", text: "Perquè la flotació només depèn de l'ou", idea: "IP-17" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa l'ou a l'aigua i afegeix cullerades de sal (+5 g) fins que l'ou comenci a surar. Anota la densitat assolida.",
        facil: "Posa l'ou al líquid i prem el botó «+ Sal (5 g)» fins que l'ou suri.",
        condicio: { tipus: "sal_afegida_o_anotat", minSal: 15 },
        pistes: [
          "Posa l'ou (Ou) dins del recipient amb aigua.",
          "Prem diverses vegades el botó «+ 5 g de sal» fins que la densitat del líquid superi 1,07 g/cm³.",
          "Observa com l'ou puja a la superfície i anota la mesura."
        ]
      },
      {
        tipus: "explica",
        text: "Què passa si continuem afegint sal quan ja hem superat el límit de saturació (26 % en massa, uns 36 g de sal per cada 100 g d'aigua)?",
        facil: "Què passa si posem massa sal a l'aigua?",
        opcions: [
          { id: "e1", text: "La sal sobrant ja no es dissol: queda al fons del vas i la densitat del líquid es manté en 1,20 g/cm³", correcta: true },
          { id: "e2", text: "La densitat de l'aigua creix fins a l'infinit", idea: "IP-16" }
        ]
      },
      {
        tipus: "aplica",
        text: "L'ou té una massa de 60 g i un volum de 56 cm³. Calcula la seva densitat (en g/cm³), que és la densitat mínima que ha de tenir el líquid perquè comenci a surar.",
        facil: "Divideix la massa de l'ou (60 g) entre el seu volum (56 cm³). Quina densitat mínima (en g/cm³) ha de tenir l'aigua salada?",
        respostaNumerica: { valor: 1.07, unitat: "g/cm³", toleranciaRelativa: 0.02 },
        pistes: [
          "Divideix 60 g ÷ 56 cm³.",
          "60 ÷ 56 = 1,071 g/cm³.",
          "Escriu 1,07 i la unitat g/cm³."
        ]
      }
    ]
  },
  {
    id: "D6",
    titol: "Quina part queda submergida?",
    pregunta: "Tots els objectes que suren ho fan igual?",
    preguntaFacil: "Tots els objectes que suren s'enfonsen la mateixa part sota l'aigua?",
    bloc: "D",
    nivells: [2, 3],
    fase: "2",
    durada: 20,
    idees: ["IP-14"],
    escena: {
      taula: "tanc",
      objectes: ["cub10_suro", "cub10_pi", "cub10_roure", "cub10_cera", "cub10_gel", "cub10_polietile"],
      liquids: ["aigua", "aigua_salada"],
      recipients: ["tanc"],
      instruments: ["regle"],
      visibilitat: "experimental"
    },
    columnesDades: ["Material", "Densitat (g/cm³)", "Alçada submergida (cm)", "Fracció submergida (%)"],
    valorsEsperats: "En aigua (1,00 g/cm³), per a cubs de 10 cm d'alçada: suro (0,25) -> 2,5 cm (25 %); pi (0,50) -> 5,0 cm (50 %); roure (0,75) -> 7,5 cm (75 %); cera (0,90) -> 9,0 cm (90 %); gel (0,92) -> 9,2 cm (92 %); polietilè (0,95) -> 9,5 cm (95 %).",
    conclusio: "La fracció submergida d'un sòlid massís que sura és el quocient entre la densitat de l'objecte i la del líquid (dobj / dL). Cap objecte que sura queda tot fora de l'aigua.",
    conclusioFacil: "Com més s'acosta la densitat de l'objecte a la de l'aigua, més part queda sota l'aigua: el pi (0,50) s'enfonsa el 50 % i el gel (0,92) el 92 %.",
    passos: [
      {
        tipus: "observa",
        text: "Tenim sis cubs de 10 cm d'aresta de materials que suren: suro (0,25), pi (0,50), roure (0,75), cera (0,90), gel (0,92) i polietilè (0,95).",
        facil: "Mira els sis cubs de 10 cm d'alçada al prestatge."
      },
      {
        tipus: "prediu",
        text: "Quin d'aquests sis cubs quedarà més enfonsat (amb més part sota la línia de flotació) i quin quedarà més amunt?",
        facil: "Quin cub s'enfonsarà més sota l'aigua i quin quedarà més a fora?",
        opcions: [
          { id: "tots_igual", text: "Tots sis quedaran del tot per sobre de la superfície de l'aigua", idea: "IP-14" },
          { id: "proporcional", text: "El suro (0,25) només s'enfonsarà un 25 % i el polietilè (0,95) quedarà submergit un 95 %", correcta: true },
          { id: "invers", text: "El suro s'enfonsarà gairebé tot i el polietilè quedarà a dalt", idea: "IP-14" }
        ],
        motius: [
          { id: "m1", text: "Perquè la fracció submergida és igual a la densitat de l'objecte dividida per la del líquid (dobj / dL)", correcta: true },
          { id: "m2", text: "Perquè tot el que sura queda per damunt de l'aigua", idea: "IP-14" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa almenys dos dels cubs de 10 cm al tanc d'aigua, observa el calat (alçada submergida en cm) i anota-ho al quadern.",
        facil: "Posa el cub de suro i el de roure al tanc i anota la mesura.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Arrossega Su10 (suro) i Ro10 (roure) al tanc d'aigua.",
          "Observa que de 10 cm d'alçada, el suro en té 2,5 cm sota l'aigua (25 %) i el roure 7,5 cm (75 %).",
          "Prem Anota al panell del tanc."
        ]
      },
      {
        tipus: "explica",
        text: "Si canviem l'aigua dolça (1,00 g/cm³) per aigua salada (1,20 g/cm³), què li passa a la part submergida del cub de fusta de roure (0,75 g/cm³)?",
        facil: "En aigua salada (més densa), el cub de fusta s'enfonsa més o menys que en aigua dolça?",
        opcions: [
          { id: "e1", text: "Es redueix del 75 % al 62,5 % (0,75 ÷ 1,20): el cub sura més amunt", correcta: true },
          { id: "e2", text: "S'enfonsa més perquè l'aigua salada pesa més", idea: "IP-17" }
        ]
      },
      {
        tipus: "aplica",
        text: "Un tronc de fusta de roure (d = 0,75 g/cm³) sura en aigua dolça (1,00 g/cm³) amb un 75 % del seu volum sota l'aigua. Quin percentatge (%) del tronc queda visible per sobre de l'aigua?",
        facil: "Si el 75 % del tronc de roure està sota l'aigua, quin percentatge (%) es veu per fora?",
        respostaNumerica: { valor: 25, unitat: "%", toleranciaRelativa: 0.02 },
        pistes: [
          "El total del tronc és el 100 %. Si el 75 % està submergit, resta 100 % − 75 %.",
          "100 − 75 = 25 %.",
          "Escriu 25 i el símbol %."
        ]
      }
    ]
  },
  {
    id: "D7",
    titol: "Capes o mescla?",
    pregunta: "Dos líquids de densitat diferent sempre fan capes?",
    preguntaFacil: "Tots els líquids de densitat diferent fan capes separades com l'aigua i l'oli?",
    bloc: "D",
    nivells: [2],
    fase: "2",
    durada: 15,
    idees: ["IP-16"],
    escena: {
      taula: "columna",
      objectes: ["bola_col_cera"],
      liquids: ["aigua", "alcohol", "oli", "mel"],
      recipients: ["proveta500"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Parella de líquids", "Es mesclen?", "Densitat mescla (g/cm³)"],
    valorsEsperats: "Aigua (1,00) + alcohol (0,79): són miscibles; abocats amb cura fan una frontera difuminada inestable, però en remenar es mesclen (parts iguals -> d = 0,895 g/cm³). Aigua + oli: inmiscibles, es tornen a separar en capes.",
    conclusio: "Només fan capes estables els líquids que no es mesclen (inmiscibles). Que un líquid sigui espès (viscós), com l'oli, no vol dir que sigui més dens que l'aigua.",
    conclusioFacil: "L'aigua i l'alcohol es mesclen quan remenem. L'aigua i l'oli no es mesclen mai i sempre fan dues capes.",
    passos: [
      {
        tipus: "observa",
        text: "A la taula «Columna» pots abocar líquids amb cura o normalment, i tens el botó «Remena» amb la vareta de vidre.",
        facil: "Mira les ampolles d'aigua, d'alcohol i d'oli, i el botó «Remena»."
      },
      {
        tipus: "prediu",
        text: "L'aigua (1,00 g/cm³) i l'alcohol (0,79 g/cm³) tenen densitats ben diferents. Què passarà si els posem junts i remenem amb la vareta, i què passarà amb l'aigua i l'oli?",
        facil: "Què passarà si remenem aigua i alcohol, i si remenem aigua i oli?",
        opcions: [
          { id: "capes_sempre", text: "Tant l'alcohol com l'oli tornaran a fer capes separades perquè tenen densitat diferent de l'aigua", idea: "IP-16" },
          { id: "miscibles", text: "L'aigua i l'alcohol es mesclaran formant un sol líquid, mentre que l'aigua i l'oli se separaran en dues capes", correcta: true }
        ],
        motius: [
          { id: "m1", text: "Perquè l'aigua i l'alcohol són miscibles (mateixa família aquosa), mentre que l'oli és inmiscible amb l'aigua", correcta: true },
          { id: "m2", text: "Perquè només importa la diferència de densitat", idea: "IP-16" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Aboca aigua i alcohol a la columna i prem «Remena» per mesclar-los. Observa i anota la densitat de la mescla.",
        facil: "Aboca aigua i alcohol i prem el botó «Remena». Anota el resultat.",
        condicio: { tipus: "remenat_o_anotat" },
        pistes: [
          "Buida la columna si cal, aboca 100 mL d'aigua i 100 mL d'alcohol.",
          "Prem el botó «Remena»: les dues capes es fusionen en una sola mescla de densitat 0,895 g/cm³!"
        ]
      },
      {
        tipus: "explica",
        text: "L'oli és força més espès (viscós) que l'aigua. Per què sura a sobre de l'aigua?",
        facil: "L'oli és més espès que l'aigua. Per què queda a sobre de l'aigua?",
        opcions: [
          { id: "e1", text: "Perquè la viscositat (ser espès) i la densitat són propietats diferents: l'oli és més viscós però menys dens (0,92 < 1,00)", correcta: true },
          { id: "e2", text: "Perquè l'aigua és més espessa que l'oli", idea: "IP-16" }
        ]
      },
      {
        tipus: "aplica",
        text: "Si mesclem 100 mL d'aigua (100 g) i 100 mL d'alcohol (79 g), la massa total és 179 g per a uns 200 mL. Quina és la densitat ideal de la mescla (en g/mL)?",
        facil: "Divideix la massa total (179 g) entre el volum total (200 mL). Quina densitat té la mescla en g/mL?",
        respostaNumerica: { valor: 0.895, unitat: "g/mL", toleranciaRelativa: 0.02 },
        pistes: [
          "Suma les masses: 100 g + 79 g = 179 g. Suma els volums: 100 mL + 100 mL = 200 mL.",
          "Divideix 179 ÷ 200 = 0,895 g/mL.",
          "Escriu 0,895 i la unitat g/mL."
        ]
      }
    ]
  },
  {
    id: "D8",
    titol: "Ni amunt ni avall",
    pregunta: "Pot un objecte quedar-se quiet al mig de l'aigua?",
    preguntaFacil: "Com pot un objecte quedar suspès al mig de l'aigua, sense pujar ni anar al fons?",
    bloc: "D",
    nivells: [2, 3],
    fase: "2",
    durada: 15,
    idees: ["IP-15"],
    escena: {
      taula: "tanc",
      objectes: ["capsula_d8"],
      liquids: ["aigua", "aigua_salada"],
      recipients: ["tanc"],
      instruments: ["balanca_laboratori"],
      visibilitat: "experimental"
    },
    columnesDades: ["Massa total (g)", "Volum (cm³)", "Densitat mitjana (g/cm³)", "Comportament"],
    valorsEsperats: "Càpsula de 100 cm³ (40 g buida): en aigua (1,00 g/cm³) calen 60 g de llast (massa total 100 g, dmitj = 1,00 g/cm³) per quedar en equilibri neutre. En aigua salada (1,20 g/cm³) calen 80 g de llast (massa total 120 g).",
    conclusio: "Un objecte queda en equilibri indiferent al mig d'un líquid quan la seva densitat mitjana és exactament igual a la del líquid.",
    conclusioFacil: "Quan la densitat mitjana de la càpsula és igual que la de l'aigua (1,00 g/cm³), ni puja ni baixa: es queda al mig!",
    passos: [
      {
        tipus: "observa",
        text: "Tenim una càpsula estanca (Cap) d'un volum exterior fix de 100 cm³ i una massa buida de 40 g, a la qual podem afegir peses de llast a l'interior.",
        facil: "Mira la càpsula Cap de 100 cm³ i 40 g."
      },
      {
        tipus: "prediu",
        text: "Quina massa total (càpsula + llast interior) ha de tenir la càpsula de 100 cm³ per quedar suspesa en equilibri al mig de l'aigua dolça (d = 1,00 g/cm³)?",
        facil: "La càpsula ocupa 100 cm³. Quants grams ha de pesar en total per quedar al mig de l'aigua?",
        opcions: [
          { id: "cent", text: "100 g en total (40 g de la càpsula + 60 g de llast), perquè la seva densitat mitjana sigui 1,00 g/cm³", correcta: true },
          { id: "cinquanta", text: "50 g, perquè quedi a la meitat d'alçada del tanc", idea: "IP-12" },
          { id: "impossible", text: "És impossible: tot objecte o puja a la superfície o va fins al fons", idea: "IP-15" }
        ],
        motius: [
          { id: "m1", text: "Perquè quan la densitat mitjana iguala la del líquid, el pes i l'empenyiment es compensen dins del líquid", correcta: true },
          { id: "m2", text: "Perquè a mitja alçada hi ha la meitat de densitat", idea: "IP-12" }
        ]
      },
      {
        tipus: "experimenta",
        text: "Posa la càpsula (Cap) al tanc d'aigua, ajusta-hi la càrrega interna i anota l'estat d'equilibri al quadern.",
        facil: "Posa la càpsula Cap al tanc i prem Anota.",
        condicio: { tipus: "anotacions_minimes", min: 1 },
        pistes: [
          "Arrossega la càpsula Cap al tanc d'aigua.",
          "Comprova que amb 60 g de càrrega (massa total 100 g en 100 cm³) queda en equilibri neutre al mig de l'aigua i prem Anota."
        ]
      },
      {
        tipus: "explica",
        text: "Quan la càpsula està quieta en equilibri al mig de l'aigua, quines forces actuen sobre ella?",
        facil: "Si la càpsula està quieta al mig de l'aigua, hi ha forces?",
        opcions: [
          { id: "e1", text: "Hi actuen el pes cap avall (0,98 N) i l'empenyiment cap amunt (0,98 N), que són iguals i es compensen", correcta: true },
          { id: "e2", text: "No hi actua cap força perquè està quieta", idea: "IP-15" }
        ]
      },
      {
        tipus: "aplica",
        text: "Si passem la mateixa càpsula de 100 cm³ (massa buida 40 g) a aigua salada saturada (d = 1,20 g/cm³), quina massa total (en g) haurà de tenir ara per quedar en equilibri al mig del líquid?",
        facil: "En aigua salada (1,20 g/cm³), quants grams ha de pesar en total la càpsula de 100 cm³ per tenir densitat 1,20 g/cm³?",
        respostaNumerica: { valor: 120, unitat: "g", toleranciaRelativa: 0.01 },
        pistes: [
          "Perquè la densitat mitjana sigui 1,20 g/cm³ amb un volum de 100 cm³, multiplica m = d · V.",
          "1,20 g/cm³ × 100 cm³ = 120 g (40 g de la càpsula + 80 g de llast).",
          "Escriu 120 i la unitat g."
        ]
      }
    ]
  }
];
