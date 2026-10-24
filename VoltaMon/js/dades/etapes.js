// Etapes del viatge (1519-1522).
//
// Convencions:
// - `data`: data ISO segons el calendari julià, el que es feia servir aleshores.
//   Els dies de viatge es calculen a partir d'aquí; no s'escriuen a mà.
// - `aprox`: la data o la posició són aproximades.
// - `pos`: [latitud, longitud] del punt de l'etapa (longitud entre -180 i 180).
// - `ruta`: punts intermedis des de l'etapa anterior, perquè el traç segueixi el mar.
// - `homes`: persones a bord després dels fets de l'etapa (xifres aproximades).
// - `balanc`: per què canvia el nombre d'homes respecte de l'etapa anterior
//   (`balancTipus: 'marxen'` quan no són morts sinó homes que se'n van).
// - `naus`: canvis d'estat de les naus en aquesta etapa.
// - Al text, {terme:paraula} enllaça la paraula amb el glossari.

export const DATA_SORTIDA = '1519-08-10';
export const HOMES_INICIALS = 250;

export const NAUS = [
  { id: 'trinidad', nom: 'Trinidad', capita: 'Ferran de Magallanes' },
  { id: 'sanantonio', nom: 'San Antonio', capita: 'Juan de Cartagena' },
  { id: 'concepcion', nom: 'Concepción', capita: 'Gaspar de Quesada' },
  { id: 'victoria', nom: 'Victoria', capita: 'Luis de Mendoza' },
  { id: 'santiago', nom: 'Santiago', capita: 'Juan Serrano' },
];

export const ETAPES = [
  {
    id: 'sevilla',
    lloc: 'Sevilla',
    data: '1519-08-10',
    pos: [37.38, -6.0],
    titol: 'Cinc naus surten de Sevilla',
    text: [
      "El 10 d'agost de 1519, cinc {nau:naus} surten del port de Sevilla i baixen pel riu Guadalquivir. Les dirigeix Ferran de Magallanes (en portuguès, Fernão de Magalhães), un navegant portuguès al servei del rei de Castella, Carles I.",
      "L'objectiu és arribar a les {moluques:Moluques}, les illes de les {especies:espècies}, navegant sempre cap a l'oest. Ningú no ho ha fet mai.",
    ],
    caixa: {
      tipus: 'sabies',
      text: "A bord hi ha homes de més de deu procedències: castellans, bascos, portuguesos, italians, grecs, francesos, flamencs, alemanys, africans… i un jove de Vicenza, Antonio Pigafetta, que escriu un diari de tot el viatge. Gràcies a ell en sabem molts detalls.",
    },
    homes: 250,
  },
  {
    id: 'sanlucar',
    lloc: 'Sanlúcar de Barrameda',
    data: '1519-09-20',
    pos: [36.78, -6.36],
    titol: "Cap a l'oceà obert",
    text: [
      "Durant més d'un mes, la flota espera a Sanlúcar, a la desembocadura del Guadalquivir. Hi carreguen aigua, vi, oli, {galeta:galeta}, formatge i carn salada per a dos anys.",
      "El 20 de setembre surten per fi al {mar-ocea:mar Oceà}, l'Atlàntic. Magallanes no explica a ningú la ruta exacta.",
    ],
    homes: 250,
  },
  {
    id: 'tenerife',
    lloc: 'Tenerife (illes Canàries)',
    data: '1519-09-26',
    pos: [28.3, -16.2],
    ruta: [[33.5, -10.5]],
    titol: 'Un avís secret',
    text: [
      "Fan escala a Tenerife per carregar aigua, llenya i menjar. Hi arriba un avís: el rei de Portugal ha enviat naus per aturar-los, i alguns capitans castellans no pensen obeir Magallanes.",
      "Magallanes canvia la ruta prevista i baixa arran de la costa d'Àfrica.",
    ],
    homes: 250,
  },
  {
    id: 'calmes',
    lloc: 'Davant de la costa de Guinea',
    data: '1519-10-30',
    aprox: true,
    dataText: 'octubre i novembre de 1519',
    pos: [7.0, -17.5],
    ruta: [[22, -19], [14, -18.5]],
    titol: 'Ni una gota de vent',
    text: [
      "Prop de la costa africana, la flota queda atrapada en les calmes: setmanes sense vent, amb una calor sufocant i tempestes sobtades.",
      "Juan de Cartagena, capità de la San Antonio, desafia Magallanes davant de tothom. Magallanes l'arresta i li treu el comandament. És la primera crisi de l'expedició.",
    ],
    homes: 250,
  },
  {
    id: 'rio',
    lloc: 'Badia de Rio de Janeiro',
    data: '1519-12-13',
    pos: [-23.0, -43.15],
    ruta: [[0, -27], [-8, -33.5], [-17, -37.5]],
    titol: 'Una badia meravellosa',
    text: [
      "Després de creuar l'equador, arriben a la badia on avui hi ha Rio de Janeiro. Segons el {tordesillas:Tractat de Tordesillas}, aquesta terra és de Portugal, però s'hi aturen dues setmanes per descansar.",
      "Canvien ganivets, miralls i cascavells per gallines, fruita i moniatos amb els tupinambà, el poble que hi viu.",
    ],
    cita: {
      text: "Per un ham o un ganivet ens donaven cinc o sis gallines, i per una pinta, un parell d'oques.",
      autor: 'Antonio Pigafetta',
    },
    caixa: {
      tipus: 'perspectiva',
      text: "Els tupinambà no van ser «descoberts»: vivien en aquesta costa des de feia segles. Per a ells, els estrangers eren uns visitants estranys amb objectes que no havien vist mai.",
    },
    homes: 250,
  },
  {
    id: 'plata',
    lloc: 'Río de la Plata',
    data: '1520-01-10',
    pos: [-35.0, -56.0],
    ruta: [[-26, -46.5], [-31, -50]],
    titol: 'Serà aquest el pas?',
    text: [
      "Arriben a un estuari tan ample que sembla un mar. Magallanes creu que pot ser el pas cap a l'altre oceà i l'explora durant setmanes.",
      "Però l'aigua és dolça: és la desembocadura d'un riu enorme, no un {estret:estret}. Cal continuar cap al sud, cada vegada amb més fred.",
    ],
    caixa: {
      tipus: 'debat',
      text: "Alguns mapes de l'època dibuixaven un pas cap a l'oest que ningú no havia vist. Magallanes estava convençut que existia (fet), però no sabia on era: la seva idea era una hipòtesi, no una certesa.",
    },
    homes: 250,
  },
  {
    id: 'sanjulian',
    lloc: 'Port de San Julián (Patagònia)',
    data: '1520-03-31',
    pos: [-49.3, -67.6],
    ruta: [[-38.5, -56.8], [-42.5, -62], [-46, -66.8]],
    titol: 'Motí a la Patagònia',
    text: [
      "Arriba l'hivern austral i Magallanes decideix {hivernar:hivernar} en aquesta badia freda i aïllada. Hi ha gana i fred, i el menjar es raciona.",
      "La nit de l'1 al 2 d'abril, tres capitans castellans es revolten i prenen tres de les cinc naus. Volen tornar a Castella.",
    ],
    decisio: {
      pregunta: 'Ets Magallanes. Tres naus estan en mans dels rebels. Què fas?',
      opcions: [
        {
          text: 'Negocio i accepto tornar a Castella.',
          comentari: "L'expedició s'hauria acabat aquí, i potser Magallanes hauria estat jutjat pel fracàs.",
        },
        {
          text: 'Recupero les naus per la força i castigo els caps.',
          comentari: 'És el que va fer Magallanes.',
        },
        {
          text: 'Deixo marxar els rebels i continuo amb dues naus.',
          comentari: "Molt arriscat: amb dues naus i la meitat d'homes, l'expedició hauria quedat molt debilitada.",
        },
      ],
      resultat: [
        "Magallanes envia homes de confiança a la Victoria amb una carta. Mentre el capità Luis de Mendoza la llegeix, el maten a punyalades. Les altres naus es rendeixen.",
        "Gaspar de Quesada és executat, i Juan de Cartagena i un capellà són abandonats en aquella costa. Una quarantena d'amotinats condemnats a mort són perdonats perquè Magallanes necessita mariners. Entre ells hi ha Juan Sebastián Elcano.",
      ],
    },
    cita: {
      text: 'Era tan alt que li arribàvem a la cintura.',
      autor: 'Antonio Pigafetta, sobre un habitant de la Patagònia',
    },
    caixa: {
      tipus: 'debat',
      text: "Pigafetta parla de «gegants» i els anomena patagons. Els aonikenk (tehuelches) eren alts, però no gegants: és una exageració. El nom potser ve de Patagón, un gegant d'una novel·la de cavalleries de l'època.",
    },
    balanc: "morts, executats o abandonats pel motí",
    homes: 245,
  },
  {
    id: 'santiago',
    lloc: 'Riu Santa Cruz',
    data: '1520-05-22',
    pos: [-50.15, -68.25],
    ruta: [[-49.75, -67.3]],
    titol: 'Es perd la primera nau',
    text: [
      "Magallanes envia la Santiago, la nau més petita, a explorar cap al sud. Una tempesta la llança contra la costa i s'enfonsa a la desembocadura del riu Santa Cruz.",
      "Gairebé tota la tripulació se salva i torna a peu, durant dies, per la costa gelada fins a San Julián. Queden quatre naus.",
    ],
    naus: { santiago: { estat: 'naufragada', nota: 'naufraga a la Patagònia (maig de 1520)' } },
    balanc: "un mariner mor en el naufragi",
    homes: 244,
  },
  {
    id: 'estret',
    lloc: 'Cap de les Verges',
    data: '1520-10-21',
    pos: [-52.35, -68.15],
    ruta: [[-50.5, -67.7], [-51.6, -67.9]],
    titol: 'Un pas entre muntanyes',
    text: [
      "Després de cinc mesos d'hivern, el 21 d'octubre veuen un cap i, darrere, una entrada estreta. És el pas que buscaven: avui en diem l'{estret:estret} de Magallanes.",
      "Hi entren amb molta por: corrents forts, vents gelats i canals que no porten enlloc. De nit, a la riba sud, veuen moltes fogueres. Magallanes l'anomena Terra dels Fums; més endavant es dirà Terra del Foc.",
    ],
    balanc: "morts durant l'hivern austral",
    homes: 240,
  },
  {
    id: 'desercio',
    lloc: "Dins de l'estret",
    data: '1520-11-08',
    aprox: true,
    dataText: 'principis de novembre de 1520',
    pos: [-53.75, -70.75],
    ruta: [[-52.55, -69.4], [-52.75, -70.2], [-53.2, -70.65]],
    titol: 'Continuar o tornar?',
    text: [
      "Magallanes reuneix els oficials. Queda menjar per a uns tres mesos. El pilot Esteban Gómez proposa tornar a Castella ara que han trobat el pas, i preparar un altre viatge.",
    ],
    decisio: {
      pregunta: 'Ets Magallanes. Què decideixes?',
      opcions: [
        {
          text: 'Continuo endavant, encara que el menjar sigui poc.',
          comentari: 'És el que va decidir Magallanes.',
        },
        {
          text: 'Torno a Castella per explicar la troballa.',
          comentari: "Hauria estat més segur, però el pas cap a les Moluques continuaria sense provar-se.",
        },
      ],
      resultat: [
        "Magallanes decideix continuar. Pocs dies després, la San Antonio, que explorava un altre canal, desapareix: els oficials empresonen el capità i giren cap a Castella.",
        "Hi arriben el maig de 1521 i acusen Magallanes. S'emporten uns 55 homes i bona part dels queviures de tota la flota.",
      ],
    },
    naus: { sanantonio: { estat: 'desertora', nota: 'deserta i torna a Castella (novembre de 1520)' } },
    balancTipus: 'marxen',
    balanc: "no moren: tornen a Castella amb la San Antonio",
    homes: 185,
  },
  {
    id: 'pacific',
    lloc: 'Cap Desitjat',
    data: '1520-11-28',
    pos: [-52.7, -74.8],
    ruta: [[-53.9, -71.3], [-53.6, -72.3], [-53.05, -73.6]],
    titol: 'Un oceà nou',
    text: [
      "Després de 38 dies dins de l'estret, les tres naus que queden surten a un oceà immens i tranquil. Segons Pigafetta, Magallanes plora d'alegria.",
      "L'anomena mar Pacífic. No saben que és l'oceà més gran del món.",
    ],
    cita: {
      text: "L'anomenàrem Pacífic perquè, en tot aquell temps, no vam patir cap tempesta.",
      autor: 'Antonio Pigafetta',
    },
    caixa: {
      tipus: 'sabies',
      text: "L'estret de Magallanes fa uns 570 km. Encara avui és un pas difícil per als vaixells.",
    },
    homes: 185,
  },
  {
    id: 'escorbut',
    lloc: 'Illes Desventurades',
    data: '1521-01-24',
    pos: [-14.8, -138.8],
    ruta: [[-47, -77.5], [-38, -79], [-29, -86], [-21, -112]],
    titol: 'Fam i escorbut',
    text: [
      "Naveguen més de tres mesos sense trobar terra habitada. Només veuen dues illetes buides, que anomenen illes Desventurades.",
      "La galeta es podreix, l'aigua fa pudor i molts mariners emmalalteixen d'{escorbut:escorbut}: les genives se'ls inflen tant que no poden menjar. En moren uns vint.",
    ],
    cita: {
      text: "Menjàvem galeta que ja no era galeta, sinó pols plena de cucs. Bevíem aigua groga, podrida feia dies. Menjàvem el cuir que cobria les vergues, i les rates es venien a mig ducat.",
      autor: 'Antonio Pigafetta',
    },
    caixa: {
      tipus: 'sabies',
      text: "L'escorbut el causa la manca de vitamina C, que hi ha a la fruita i la verdura fresques. Aleshores ningú no en sabia la causa.",
    },
    balanc: "morts per l'escorbut i la fam",
    homes: 165,
  },
  {
    id: 'guam',
    lloc: 'Illes Marianes (Guam)',
    data: '1521-03-06',
    pos: [13.3, 144.6],
    ruta: [[-11.4, -151.8], [0, -162], [12, -176]],
    titol: 'Les illes dels Lladres',
    text: [
      "Per fi veuen terra habitada. Els chamorros pugen a les naus i s'emporten objectes, entre ells una barca. Magallanes respon cremant cases i matant set homes.",
      "Els europeus anomenen aquestes illes illes dels Lladres.",
    ],
    caixa: {
      tipus: 'perspectiva',
      text: "Per als europeus, era un robatori. Alguns historiadors pensen que els chamorros entenien la propietat d'una altra manera i que, per a ells, era un intercanvi. És una interpretació, no un fet segur.",
    },
    homes: 165,
  },
  {
    id: 'cebu',
    lloc: 'Cebu (Filipines)',
    data: '1521-04-07',
    pos: [10.35, 123.95],
    ruta: [[11.5, 132], [10.7, 125.9], [9.95, 125.05], [10.15, 124.3]],
    titol: 'Un intèrpret que torna a casa',
    text: [
      "El 16 de març arriben a les illes que més endavant es diran Filipines. Enrique, un esclau malai que Magallanes havia comprat anys enrere a Malaca, entén la llengua dels habitants i fa d'{interpret:intèrpret}.",
      "A Cebu, el {raja:rajà} Humabon fa un pacte amb Magallanes, i centenars de persones són batejades.",
    ],
    caixa: {
      tipus: 'debat',
      text: "Si Enrique era originari d'aquestes illes, potser va ser la primera persona que va fer la volta al món sencera. No sabem del cert d'on venia: és una hipòtesi, no un fet demostrat.",
    },
    balanc: "morts per malaltia",
    homes: 160,
  },
  {
    id: 'mactan',
    lloc: 'Mactan (Filipines)',
    data: '1521-04-27',
    pos: [10.28, 124.05],
    titol: 'La batalla de Mactan',
    text: [
      "Magallanes vol que tots els caps de la regió obeeixin Humabon i el rei de Castella. Lapu-Lapu, cap de la petita illa de Mactan, s'hi nega.",
    ],
    decisio: {
      pregunta: 'Ets Magallanes. Lapu-Lapu no es vol sotmetre. Què fas?',
      opcions: [
        {
          text: "Ho deixo córrer: el meu objectiu són les Moluques.",
          comentari: 'Molts oficials pensaven el mateix.',
        },
        {
          text: "Ataco amb molts homes i amb els guerrers d'Humabon.",
          comentari: 'Si volia lluitar, era la manera més prudent de fer-ho.',
        },
        {
          text: 'Ataco només amb els meus homes per mostrar la força europea.',
          comentari: 'És el que va fer Magallanes.',
        },
      ],
      resultat: [
        "Magallanes ataca de matinada amb uns 60 homes i rebutja l'ajuda d'Humabon. Les naus no es poden acostar a la platja pels esculls, i més de mil guerrers de Lapu-Lapu els esperen.",
        "Magallanes és ferit a la cama per una fletxa i mor a la vora del mar, cobrint la retirada dels seus homes.",
      ],
    },
    cita: {
      text: 'Van matar el nostre mirall, la nostra llum, el nostre consol i el nostre veritable guia.',
      autor: 'Antonio Pigafetta, sobre la mort de Magallanes',
    },
    caixa: {
      tipus: 'perspectiva',
      text: "A les Filipines, Lapu-Lapu és un heroi nacional: el primer que va resistir els europeus. El 2021, el país va commemorar els 500 anys de la «victòria de Mactan».",
    },
    balanc: "Magallanes i vuit homes moren a la batalla",
    homes: 150,
  },
  {
    id: 'bohol',
    lloc: 'Bohol (Filipines)',
    data: '1521-05-02',
    aprox: true,
    dataText: 'maig de 1521',
    pos: [9.45, 123.8],
    ruta: [[10.0, 123.75]],
    titol: 'Traïció i foc',
    text: [
      "L'1 de maig, el rajà Humabon convida una trentena d'europeus a un banquet i hi són assassinats, entre ells els nous capitans. La resta fuig.",
      "No queden prou mariners per a tres naus. Prop de l'illa de Bohol, cremen la Concepción. Només en queden dues: la Trinidad i la Victoria.",
    ],
    naus: { concepcion: { estat: 'cremada', nota: 'cremada a Bohol (maig de 1521)' } },
    balanc: "uns 27 assassinats al banquet de Cebu, i altres baixes",
    homes: 115,
  },
  {
    id: 'brunei',
    lloc: 'Brunei (illa de Borneo)',
    data: '1521-07-09',
    pos: [5.05, 115.1],
    ruta: [[8.6, 122.3], [8.9, 120.4], [9.4, 119.0], [8.2, 117.6], [7.4, 116.6], [6.2, 115.6]],
    titol: 'Una ciutat sobre l\'aigua',
    text: [
      "Sense un rumb clar, les dues naus vaguen per les illes durant mesos. A Brunei, a l'illa de Borneo, troben una ciutat rica, amb milers de cases construïdes sobre l'aigua.",
      "El {sulta:sultà} els rep i envia elefants guarnits amb seda per portar-los al palau. Els europeus descobreixen que no són els únics amb riquesa i poder.",
    ],
    balanc: "homes retinguts a Brunei o morts",
    homes: 110,
  },
  {
    id: 'tidore',
    lloc: 'Tidore (Moluques)',
    data: '1521-11-08',
    pos: [0.75, 127.3],
    ruta: [[6.0, 115.2], [7.3, 116.5], [7.4, 118.6], [6.0, 121.4], [5.8, 123.0], [5.1, 125.0], [3.0, 126.2], [1.6, 126.7]],
    titol: 'Les illes de les espècies!',
    text: [
      "Vint-i-set mesos després de sortir de Sevilla, arriben a Tidore, a les {moluques:Moluques}. El sultà Al-Mansur els rep amb amabilitat i els ven tones de {clau:clau}, una de les espècies més cares a Europa.",
      "Ara Juan Sebastián Elcano, l'amotinat perdonat a la Patagònia, és el capità de la Victoria.",
    ],
    cita: {
      text: "Quan vam arribar, vam disparar tota l'artilleria en senyal d'alegria.",
      autor: 'Antonio Pigafetta',
    },
    caixa: {
      tipus: 'debat',
      text: "De qui eren les Moluques? Segons Tordesillas, el món es dividia en dues meitats, però ningú no sabia mesurar bé la {longitud:longitud}. Castella i Portugal les reclamaven. El 1529, pel Tractat de Saragossa, Carles I hi va renunciar a canvi de diners.",
    },
    balanc: "morts per malaltia",
    homes: 105,
  },
  {
    id: 'separacio',
    lloc: 'Tidore (Moluques)',
    data: '1521-12-21',
    pos: [0.3, 126.9],
    titol: 'Una decisió difícil',
    text: [
      "Les dues naus estan carregades de clau i a punt de marxar. Però la Trinidad té una via d'aigua greu: cal descarregar-la i reparar-la, i això durarà mesos.",
    ],
    decisio: {
      pregunta: 'Ets Elcano, capità de la Victoria. Què proposes?',
      opcions: [
        {
          text: 'Esperar la Trinidad i tornar plegats.',
          comentari: "Plegats és més segur, però perdrien els vents favorables i els portuguesos podrien arribar.",
        },
        {
          text: "Sortir ara, sols, cap a l'oest per l'oceà Índic.",
          comentari: "Era una ruta portuguesa: si els atrapaven, els farien presoners. És el que va fer la Victoria.",
        },
        {
          text: 'Tornar pel Pacífic, per on havien vingut.',
          comentari: "En aquesta direcció, els vents del Pacífic bufen en contra. Ho va intentar la Trinidad.",
        },
      ],
      resultat: [
        "Decideixen separar-se. El 21 de desembre, la Victoria surt sola cap a l'oest amb 47 europeus i 13 moluquesos.",
        "La Trinidad es queda a Tidore per reparar-se, amb uns 54 homes, i intentarà tornar pel Pacífic. No es tornaran a veure.",
      ],
    },
    naus: { trinidad: { estat: 'separada', nota: 'es queda a Tidore per reparar-se' } },
    balancTipus: 'marxen',
    balanc: "es queden 54 homes a la Trinidad; s'hi sumen 13 moluquesos",
    homes: 60,
    homesEtiqueta: 'a la Victoria',
  },
  {
    id: 'timor',
    lloc: 'Timor',
    data: '1522-01-26',
    pos: [-8.75, 124.4],
    ruta: [[-1.5, 127.0], [-3.9, 126.9], [-6.5, 125.6]],
    titol: "L'última terra",
    text: [
      "La Victoria fa escala a Timor per comprar carn, arròs i fruita. La nau fa aigües i la tripulació està esgotada.",
      "Elcano pren una decisió valenta: per evitar els portuguesos, no tocaran terra fins a l'Àfrica. Tenen al davant tot l'oceà Índic.",
    ],
    balanc: "dos desertors i un mort",
    homes: 57,
    homesEtiqueta: 'a la Victoria',
  },
  {
    id: 'bonaesperanca',
    lloc: 'Cap de Bona Esperança',
    data: '1522-05-19',
    aprox: true,
    dataText: 'maig de 1522',
    pos: [-35.0, 18.4],
    ruta: [[-12.5, 118], [-25, 95], [-37.8, 77.5], [-40.5, 50], [-38.5, 30]],
    titol: 'El cap de les Tempestes',
    text: [
      "Durant setmanes, la Victoria lluita contra vents contraris al sud de l'Àfrica. Elcano baixa fins a latituds molt fredes per superar-los.",
      "Alguns volen rendir-se als portuguesos de Moçambic per salvar la vida, però la majoria decideix continuar. Finalment, passen el cap de Bona Esperança.",
    ],
    cita: {
      text: "Però la majoria, que estimava més l'honor que la vida, va decidir intentar tornar a Espanya, vius o morts.",
      autor: 'Antonio Pigafetta',
    },
    balanc: "morts de fam i d'escorbut",
    homes: 42,
    homesEtiqueta: 'a la Victoria',
  },
  {
    id: 'capverd',
    lloc: 'Illes de Cap Verd',
    data: '1522-07-09',
    pos: [14.85, -23.6],
    ruta: [[-26, 8], [-10, -6], [3, -16]],
    titol: 'Un dia perdut',
    text: [
      "Amb homes morint de gana, han de parar a Cap Verd, que és portuguès. Diuen que tornen d'Amèrica per no despertar sospites.",
      "Allà descobreixen una cosa sorprenent: segons el seu diari és dimecres, però a terra és dijous! Quan els portuguesos s'adonen de la veritat, n'empresonen tretze. Elcano fuig amb la resta.",
    ],
    cita: {
      text: "Vam manar que preguntessin quin dia era, i ens van dir que dijous. Ens va estranyar molt, perquè per a nosaltres era dimecres.",
      autor: 'Antonio Pigafetta',
    },
    caixa: {
      tipus: 'sabies',
      text: "Navegant sempre cap a l'oest, seguint el sol, cada dia els durava una mica més. Sumant tota la volta, havien «perdut» un dia sencer. Avui, la {canvi-data:línia de canvi de data} resol aquest problema.",
    },
    balanc: "13 presos pels portuguesos i uns 11 morts pel camí",
    homes: 18,
    homesEtiqueta: 'a la Victoria',
  },
  {
    id: 'sanlucar-tornada',
    lloc: 'Sanlúcar de Barrameda',
    data: '1522-09-06',
    pos: [36.78, -6.36],
    ruta: [[25, -31], [37.4, -27], [37.2, -12]],
    titol: 'Tornen divuit',
    text: [
      "Tres anys després de marxar, la Victoria entra a Sanlúcar, mig desfeta i amb divuit homes esgotats. De cinc naus, n'ha tornat una.",
      "Per primera vegada, un vaixell ha fet la {circumnavegacio:volta al món}. Aquell mateix dia, Elcano escriu al rei Carles I.",
    ],
    cita: {
      text: 'Sàpiga Vostra Majestat que hem descobert i donat la volta a tota la rodonesa del món.',
      autor: 'Juan Sebastián Elcano, carta al rei',
    },
    caixa: {
      tipus: 'sabies',
      text: "Amb la venda del clau que duia la Victoria es van pagar les despeses de tota l'expedició. Les fonts parlen de divuit supervivents europeus; alguns autors hi sumen tres moluquesos.",
    },
    homes: 18,
    homesEtiqueta: 'a la Victoria',
  },
  {
    id: 'sevilla-tornada',
    lloc: 'Sevilla',
    data: '1522-09-08',
    pos: [37.38, -6.0],
    titol: 'Descalços i amb una espelma',
    text: [
      "La Victoria remunta el Guadalquivir fins a Sevilla. L'endemà, els supervivents van a l'església en camisa, descalços i amb una espelma a la mà, per complir la promesa que havien fet en els moments més durs.",
    ],
    cita: {
      text: 'Vam anar tots en camisa i descalços, cadascun amb una espelma a la mà, a visitar Santa Maria de la Victòria.',
      autor: 'Antonio Pigafetta',
    },
    caixa: {
      tipus: 'sabies',
      text: "Carles I va donar a Elcano un escut amb un globus terraqüi i la frase llatina Primus circumdedisti me: «Tu vas ser el primer a envoltar-me».",
    },
    homes: 18,
    homesEtiqueta: 'a la Victoria',
  },
  {
    id: 'epileg',
    epileg: true,
    lloc: 'El món',
    titol: 'I els altres, què?',
    text: [
      "**La Trinidad** va sortir de Tidore l'abril de 1522 per tornar pel Pacífic. Els vents contraris la van obligar a girar cua i els portuguesos la van capturar a les Moluques. Dels seus homes, només quatre van tornar a Europa, anys després.",
      "**La San Antonio** havia arribat a Sevilla el maig de 1521. **Els tretze presoners de Cap Verd** van ser alliberats i van tornar poques setmanes després de la Victoria.",
      "**Elcano** va tornar a sortir cap a les Moluques el 1525 i va morir al Pacífic el 1526.",
    ],
    caixa: {
      tipus: 'debat',
      text: "Qui va fer la primera volta al món? Elcano i els divuit de la Victoria? Magallanes, que la va planificar però va morir a mig camí? Enrique, l'intèrpret? Depèn de com ho mirem: en podeu debatre a classe.",
    },
    resum: [
      "Es va demostrar a la pràctica que es pot donar la volta a la Terra per mar.",
      "El món era molt més gran del que es creia: el Pacífic és l'oceà més extens.",
      "Va començar a connectar Europa, Amèrica, Àsia i Àfrica: un primer pas cap a la globalització.",
      "El preu va ser enorme: de 250 homes en van tornar 18, i molts pobles van patir la violència dels europeus.",
    ],
    naus: { trinidad: { estat: 'capturada', nota: 'capturada pels portuguesos (1522)' } },
    homes: 18,
    homesEtiqueta: 'a la Victoria',
  },
];

// Ruta de la Trinidad després de separar-se (aproximada): intenta tornar pel
// Pacífic, puja cap al nord i ha de tornar a les Moluques.
export const RUTA_TRINIDAD = [
  [0.75, 127.3], [4, 130], [12, 138], [22, 143], [32, 148], [42, 152],
  [34, 150], [22, 145], [12, 136], [4, 129.5], [0.9, 127.5],
];

// Línia de Tordesillas (1494): 370 llegües a l'oest de Cap Verd (posició aproximada)
// i el seu antimeridià, la frontera en disputa a l'altra banda del món.
export const TORDESILLAS = -46.6;
export const ANTIMERIDIA = 133.4;
