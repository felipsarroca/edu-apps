
export interface Question {
  id: number;
  sa: 'SA1' | 'SA2' | 'SA4';
  type: 'multiple' | 'trueFalse' | 'match' | 'fillBlank' | 'order';
  question: string;
  options?: string[];
  correctAnswer: string | string[] | { [key: string]: string };
  hints: string[];
  feedback: string;
}

export const questions: Question[] = [
  {
    id: 1,
    sa: 'SA1',
    type: 'multiple',
    question: "Quin valor fonamental de l'ESS explica millor per què una cooperativa decideix rebaixar el sou dels càrrecs directius per millorar el salari dels treballadors base?",
    options: ['A) Equitat', 'B) Solidaritat', 'C) Democràcia', 'D) Sostenibilitat'],
    correctAnswer: 'B) Solidaritat',
    hints: [
      "Quin valor posa l'accent en el suport mutu i la justícia social dins l'empresa?",
      "Revisa els valors clau de l'Economia Social i pensa quin busca reduir les desigualtats internes.",
      "Quins valors s'oposen a l'individualisme propi de les empreses capitalistes?"
    ],
    feedback: "Molt bé! Has identificat la solidaritat com un dels valors centrals de l'ESS. Aquest valor es tradueix en pràctiques com la igualtat salarial, la redistribució de recursos i l'ajuda mútua dins de les organitzacions. Bones connexions!"
  },
  {
    id: 2,
    sa: 'SA1',
    type: 'trueFalse',
    question: "L'economia social pretén competir agressivament amb les empreses capitalistes per ocupar el seu lloc al mercat.",
    correctAnswer: 'Fals',
    hints: [
      "Quin és l'objectiu principal de l'ESS: guanyar quota de mercat o satisfer necessitats socials?",
      "Llegeix sobre el propòsit de transformació social de l'ESS.",
      "L'ESS vol substituir el capitalisme o oferir una alternativa sostenible?"
    ],
    feedback: "Correcte! L'ESS no busca substituir ni desbancar el sistema capitalista, sinó oferir una alternativa centrada en les persones i el bé comú. El seu objectiu no és la competència, sinó la col·laboració i la transformació social. Bona feina!"
  },
  {
    id: 3,
    sa: 'SA1',
    type: 'match',
    question: "Relaciona els conceptes amb les seves definicions:",
    options: ['Equitat', 'Democràcia econòmica', 'Sostenibilitat', 'Reversió beneficis'],
    correctAnswer: {
      'Equitat': 'Tracte just segons les necessitats de cada persona',
      'Democràcia econòmica': 'Participació de tots en les decisions econòmiques',
      'Sostenibilitat': 'Equilibri entre present i futur',
      'Reversió beneficis': 'Reinversió dels guanys en la comunitat'
    },
    hints: [
      "Aquest concepte fa referència a prendre decisions col·lectives. Quin és?",
      "Quin valor s'aplica quan els guanys es tornen a invertir en la comunitat?",
      "Llegeix la definició de sostenibilitat i compara-la amb les opcions."
    ],
    feedback: "Excel·lent! Has sabut definir conceptes clau de l'ESS. Aquests principis asseguren la justícia social, la participació democràtica i la continuïtat del projecte més enllà del benefici individual. La teva precisió mostra una comprensió profunda!"
  },
  {
    id: 4,
    sa: 'SA1',
    type: 'fillBlank',
    question: "Una de les diferències essencials entre les empreses de capital i les de l'ESS és que aquestes últimes prioritzen la _________ per sobre del lucre.",
    correctAnswer: 'persona',
    hints: [
      "L'ESS posa al centre un element clau. Quin és?",
      "No és el capital ni el benefici, sinó...",
      "Revisa el vídeo 'Què és l'Economia Social?' que vau veure a classe."
    ],
    feedback: "Perfecte! L'ESS gira al voltant de la centralitat de la persona. Això implica prioritzar el benestar de les persones treballadores, consumidores i de la comunitat, per davant del benefici econòmic. Molt bona resposta!"
  },
  {
    id: 5,
    sa: 'SA2',
    type: 'order',
    question: "Ordena els passos per crear una cooperativa escolar:",
    options: [
      'Assemblea fundacional',
      'Definir el propòsit del projecte',
      'Redactar els estatuts',
      'Assignar càrrecs i responsabilitats'
    ],
    correctAnswer: ['Definir el propòsit del projecte', 'Redactar els estatuts', 'Assemblea fundacional', 'Assignar càrrecs i responsabilitats'],
    hints: [
      "Què s'ha de tenir clar abans d'escriure uns estatuts?",
      "Quina reunió serveix per aprovar formalment els estatuts?",
      "Revisa el procés de creació d'una cooperativa segons la SA2."
    ],
    feedback: "Enhorabona! Has comprès l'ordre lògic del procés de creació d'una cooperativa. Començar pel propòsit, redactar estatuts, formalitzar-ho en assemblea i definir rols és essencial per a una organització democràtica i coherent. Bona feina!"
  },
  {
    id: 6,
    sa: 'SA2',
    type: 'multiple',
    question: "Quina funció té el càrrec de tresorer/a dins una cooperativa escolar?",
    options: [
      'A) Dirigir les assemblees',
      'B) Redactar les actes de reunions',
      'C) Portar el control econòmic i pressupostari',
      'D) Representar la cooperativa externament'
    ],
    correctAnswer: 'C) Portar el control econòmic i pressupostari',
    hints: [
      "Quin càrrec porta el registre dels diners?",
      "Pensa en qui fa el control pressupostari dins qualsevol organització.",
      "Repassa el document sobre el funcionament dels òrgans d'una cooperativa."
    ],
    feedback: "Molt bé! El tresorer o tresorera és la persona encarregada de vetllar per una gestió econòmica transparent i responsable dins la cooperativa. És una tasca clau per garantir la viabilitat i l'equilibri financer del projecte. Molt encertat!"
  },
  {
    id: 7,
    sa: 'SA2',
    type: 'trueFalse',
    question: "En una cooperativa, els estatuts serveixen per establir les normes de funcionament i no es poden modificar mai.",
    correctAnswer: 'Fals',
    hints: [
      "Pensa en si les regles d'una organització poden evolucionar.",
      "Les cooperatives tenen mecanismes per adaptar-se?",
      "Revisa el paper de l'assemblea general en la presa de decisions."
    ],
    feedback: "Molt bé! Els estatuts són modificables mitjançant l'assemblea general, que és el màxim òrgan de decisió en una cooperativa. Això assegura que el projecte pugui evolucionar i adaptar-se a les noves necessitats. Bona feina!"
  },
  {
    id: 8,
    sa: 'SA2',
    type: 'match',
    question: "Relaciona els càrrecs amb les seves funcions:",
    options: ['President/a', 'Secretari/ària', 'Tresorer/a', 'Vocals'],
    correctAnswer: {
      'President/a': 'Representar oficialment la cooperativa',
      'Secretari/ària': 'Redactar actes i gestionar documentació',
      'Tresorer/a': 'Controlar els comptes i pressupost',
      'Vocals': 'Participar en decisions i tasques específiques'
    },
    hints: [
      "Qui representa oficialment la cooperativa?",
      "Qui porta l'acta i la documentació?",
      "Quin càrrec s'ocupa dels comptes?"
    ],
    feedback: "Perfecte! Has identificat clarament la funció de cada membre de l'equip de govern d'una cooperativa. Conèixer aquests rols és essencial per al bon funcionament i la responsabilitat col·lectiva del projecte. Molt ben fet!"
  },
  {
    id: 9,
    sa: 'SA4',
    type: 'multiple',
    question: "Durant una activitat, un alumne pren moltes decisions i parla sovint, però no escolta els altres. Quina acció formativa relacionada amb l'ESS seria més adequada?",
    options: [
      'A) Assignar-li més responsabilitats',
      'B) Ensenyar tècniques de lideratge autoritari',
      'C) Treballar l\'escolta activa i el lideratge col·laboratiu',
      'D) Evitar-li rols protagonistes per sempre'
    ],
    correctAnswer: 'C) Treballar l\'escolta activa i el lideratge col·laboratiu',
    hints: [
      "Quin tipus de lideratge promou l'ESS?",
      "Quins valors treballa la cohesió d'equips?",
      "Revisa l'activitat 'Quin tipus de líder em considero?'"
    ],
    feedback: "Fantàstic! El lideratge en clau ESS fomenta l'escolta activa, el respecte i la col·laboració. Saber acompanyar els companys és més valuós que dirigir sense tenir en compte les seves opinions. Has respost molt bé!"
  },
  {
    id: 10,
    sa: 'SA4',
    type: 'trueFalse',
    question: "Un bon equip de treball no necessita dedicar temps a la cohesió si compleix els objectius.",
    correctAnswer: 'Fals',
    hints: [
      "La cohesió només és útil per fer equip o també per garantir resultats a llarg termini?",
      "Revisa les activitats de Team Building i la carta al jo del futur.",
      "Què afavoreix la confiança entre membres d'un equip?"
    ],
    feedback: "Enhorabona! La cohesió no només fa més agradable el treball, sinó que millora la qualitat, la sostenibilitat i la resiliència del grup. La cura dels vincles és essencial en qualsevol equip de l'ESS. Molt ben vist!"
  },
  {
    id: 11,
    sa: 'SA4',
    type: 'match',
    question: "Relaciona els rols amb els seus comportaments:",
    options: ['Facilitador/a', 'Observador/a', 'Creatiu/va', 'Gestor/a del temps'],
    correctAnswer: {
      'Facilitador/a': 'Vetlla per les normes i l\'ambient de treball',
      'Observador/a': 'Analitza la dinàmica del grup',
      'Creatiu/va': 'Aporta idees innovadores',
      'Gestor/a del temps': 'Controla els temps i l\'organització'
    },
    hints: [
      "Quin rol vetlla per les normes i l'ambient de treball?",
      "Qui garanteix que no ens passem de temps?",
      "Qui aporta idees innovadores?"
    ],
    feedback: "Excel·lent! Has reconegut les diferents funcions dins un equip cooperatiu. Cada rol contribueix a un clima positiu i una organització eficaç. Saber reconèixer i valorar aquests papers és clau per a un lideratge compartit. Gran resposta!"
  },
  {
    id: 12,
    sa: 'SA4',
    type: 'fillBlank',
    question: "La cohesió d'un equip es construeix a partir de la confiança, la comunicació i la ________ compartida.",
    correctAnswer: 'responsabilitat',
    hints: [
      "Sense aquest element, és difícil mantenir el compromís.",
      "Tots som responsables que el grup funcioni. Què és això?",
      "Què han de tenir clar tots els membres per a la bona marxa del projecte?"
    ],
    feedback: "Molt bé! La responsabilitat compartida és la base d'un equip cohesionat i madur. Quan tothom se sent responsable, les tasques es fan millor i el grup es manté fort. Felicitats per aquesta resposta tan precisa!"
  },
  {
    id: 13,
    sa: 'SA4',
    type: 'multiple',
    question: "Quina d'aquestes accions afavoreix més la cohesió d'un equip segons l'ESS?",
    options: [
      'A) Assignar tasques segons qui ho fa més ràpid',
      'B) Evitar parlar de conflictes per no generar tensions',
      'C) Crear espais per compartir necessitats i malestars',
      'D) Treballar cada membre del grup de forma separada'
    ],
    correctAnswer: 'C) Crear espais per compartir necessitats i malestars',
    hints: [
      "Quin tipus d'espais apareixen a l'activitat 'cura de l'equip'?",
      "Revisa com es fomenta la confiança dins els equips segons l'ESS.",
      "La comunicació emocional és una debilitat o una fortalesa?"
    ],
    feedback: "Fantàstic! Has sabut identificar que la cohesió no s'improvisa: es treballa i es cuida. Els espais per expressar emocions i necessitats són clau per a la convivència i el compromís dins d'un equip cooperatiu. Bona tria!"
  },
  {
    id: 14,
    sa: 'SA2',
    type: 'trueFalse',
    question: "Els càrrecs dins una cooperativa escolar han de ser assignats pel docent per assegurar el bon funcionament.",
    correctAnswer: 'Fals',
    hints: [
      "Qui pren les decisions en una cooperativa?",
      "Què diu el principi de democràcia econòmica sobre la participació?",
      "Revisa com es formen els equips i es reparteixen rols a la SA2."
    ],
    feedback: "Molt bé! En una cooperativa, la participació activa i democràtica és fonamental. Els càrrecs es decideixen col·lectivament per garantir que tothom se senti implicat i reconegut. Enhorabona per la teva resposta encertada!"
  },
  {
    id: 15,
    sa: 'SA2',
    type: 'match',
    question: "Relaciona cada fase amb la seva acció corresponent:",
    options: ['Detecció del repte', 'Redacció dels estatuts', 'Assemblea fundacional', 'Registre del projecte'],
    correctAnswer: {
      'Detecció del repte': 'Identificar una necessitat o oportunitat al centre',
      'Redacció dels estatuts': 'Definir les normes de funcionament',
      'Assemblea fundacional': 'Aprovar l\'organització i nomenar càrrecs',
      'Registre del projecte': 'Fer constar la cooperativa davant les institucions'
    },
    hints: [
      "Quina acció defineix com funciona internament la cooperativa?",
      "Repassa les fases de la SA2 en l'ordre cronològic.",
      "En quin moment es fa oficial la creació de la cooperativa?"
    ],
    feedback: "Excel·lent! Has sabut ordenar i vincular correctament les fases clau de creació d'una cooperativa. Aquest coneixement és fonamental per poder replicar el model en qualsevol context. Bona feina!"
  },
  {
    id: 16,
    sa: 'SA1',
    type: 'fillBlank',
    question: "L'economia social i solidària busca satisfer les necessitats de la comunitat a través d'una gestió ________ i orientada al bé comú.",
    correctAnswer: 'democràtica',
    hints: [
      "Com es prenen les decisions en l'ESS?",
      "Quin valor fa que tothom tingui veu i vot en una organització?",
      "Revisa els vídeos sobre valors de l'ESS."
    ],
    feedback: "Ben jugat! L'ESS posa la democràcia al centre de la seva estructura, perquè només així es pot garantir una gestió justa, participativa i responsable. Molt encertat!"
  },
  {
    id: 17,
    sa: 'SA1',
    type: 'multiple',
    question: "Quina afirmació descriu millor una pràctica coherent amb els valors de l'ESS dins una cooperativa escolar?",
    options: [
      'A) Seleccionar els companys segons les seves habilitats tècniques',
      'B) Mantenir reunions obertes on tothom pugui expressar opinions',
      'C) Donar prioritat a qui té més experiència a l\'hora de decidir',
      'D) Deixar les decisions importants al docent per evitar conflictes'
    ],
    correctAnswer: 'B) Mantenir reunions obertes on tothom pugui expressar opinions',
    hints: [
      "Quin valor promou la participació equitativa de totes les persones?",
      "Revisa què implica el principi de democràcia en la gestió cooperativa.",
      "L'ESS fomenta la jerarquia o la igualtat de veu?"
    ],
    feedback: "Molt bé! Permetre que tothom expressi la seva opinió i participar en les decisions col·lectives són pràctiques fonamentals dins qualsevol experiència d'Economia Social. Així es construeix un model més just i equitatiu. Molt ben vist!"
  },
  {
    id: 18,
    sa: 'SA4',
    type: 'trueFalse',
    question: "Un bon líder cooperatiu ha d'imposar el seu criteri quan el grup no arriba a un acord.",
    correctAnswer: 'Fals',
    hints: [
      "Quina és la diferència entre lideratge autoritari i lideratge cooperatiu?",
      "Com es prenen decisions segons els valors de l'ESS?",
      "Repassa les conclusions de l'activitat sobre estils de lideratge."
    ],
    feedback: "Perfecte! El lideratge cooperatiu es basa en l'escolta, la facilitació i la recerca del consens. Imposar mai és la solució en un entorn que vol ser just i col·laboratiu. Molt bona resposta!"
  },
  {
    id: 19,
    sa: 'SA4',
    type: 'fillBlank',
    question: "Un equip no només treballa per objectius, també ha de cuidar els _______ emocionals dels seus membres.",
    correctAnswer: 'vincles',
    hints: [
      "Què manté unit un equip més enllà de les tasques?",
      "Revisa què diu la SA4 sobre la cohesió i la cura de l'equip.",
      "Pensa en les activitats sobre la comunicació i la confiança."
    ],
    feedback: "Genial! Els vincles emocionals són la base d'una bona convivència i d'un treball cooperatiu sostenible. Quan els equips es cuiden, els projectes creixen amb més força. Molt bona feina!"
  }
];
