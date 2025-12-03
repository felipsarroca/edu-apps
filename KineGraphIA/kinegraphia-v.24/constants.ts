import { MovementType, Example } from "./types";

export const COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F97316', '#D946EF', '#8B5CF6']; // Red, Blue, Green, Orange, Fuchsia, Violet
export const LIGHT_COLORS = ['#FECACA', '#BFDBFE', '#A7F3D0', '#FED7AA', '#F5D0FE', '#DDD6FE']; // Light Red, Blue, Green, Orange, Fuchsia, Violet
export const G = 9.8;

const UN_MOBIL: Example[] = [
    {
        statement: "Un cotxe parteix del repòs i accelera a raó de 3 m/s² durant 10 segons. Quina distància recorre?",
        mobiles: [{ nom: "Cotxe", tipus: MovementType.MRUA, s0: 0, v0: 0, a: 3, t: 12 }],
        recommendedTime: 12,
        solution: "El cotxe recorrerà **150 metres** en 10 segons."
    },
    {
        statement: "Un tren que viatja a 90 km/h comença a frenar amb una desacceleració de 1.5 m/s². Quant de temps triga a aturar-se?",
        mobiles: [{ nom: "Tren", tipus: MovementType.MRUA, s0: 0, v0: 25, a: -1.5, t: 20 }], // 90 km/h = 25 m/s
        recommendedTime: 16.67,
        solution: "El tren trigarà **16.67 segons** a aturar-se completament."
    },
    {
        statement: "Una atleta corre els 100 metres llisos. Accelera des del repòs durant 4 segons amb una acceleració de 2.5 m/s² i després manté la velocitat constant. En quin temps completa la cursa?",
        mobiles: [{ nom: "Atleta", tipus: MovementType.MRUA, s0: 0, v0: 0, a: 2.5, t: 4, t_explicit: true }],
        recommendedTime: 12,
        solution: "L'atleta completa la cursa en **12 segons**."
    },
    {
        statement: "Un ciclista es mou a una velocitat constant de 18 km/h durant 30 segons. Quina distància ha recorregut?",
        mobiles: [{ nom: "Ciclista", tipus: MovementType.MRU, s0: 0, v0: 5, a: 0, t: 30 }], // 18 km/h = 5 m/s
        recommendedTime: 30,
        solution: "El ciclista haurà recorregut **150 metres**."
    },
    {
        statement: "Un coet ja es mou a 100 m/s i encén els seus propulsors, proporcionant una acceleració de 20 m/s² durant 5 segons.",
        mobiles: [{ nom: "Coet", tipus: MovementType.MRUA, s0: 0, v0: 100, a: 20, t: 10 }],
        recommendedTime: 10,
        solution: "La seva velocitat final després de 5 segons serà de **200 m/s**."
    },
    {
        statement: "Un vehicle es troba a 50m de l'origen i es mou cap a ell a 20 m/s, però amb una acceleració positiva de 2 m/s². Quan torna a passar per l'origen?",
        mobiles: [{ nom: "Vehicle", tipus: MovementType.MRUA, s0: 50, v0: -20, a: 2, t: 15 }],
        recommendedTime: 15,
        solution: "El vehicle passa per l'origen als **2.93 segons** i als **17.07 segons**."
    },
    {
        statement: "Un objecte recorre 300 metres en 10 segons amb una acceleració constant de 4 m/s². Quina era la seva velocitat inicial?",
        mobiles: [{ nom: "Objecte", tipus: MovementType.MRUA, s0: 0, v0: 10, v0_explicit: true, a: 4, t: 10 }],
        recommendedTime: 10,
        solution: "La velocitat inicial de l'objecte era de **10 m/s**."
    },
    {
        statement: "Un motorista que va a 54 km/h veu un semàfor en vermell a 40 metres i frena amb una desacceleració de 2 m/s². Aconsegueix aturar-se a temps?",
        mobiles: [{ nom: "Motorista", tipus: MovementType.MRUA, s0: 0, v0: 15, a: -2, t: 8 }],
        recommendedTime: 7.5,
        solution: "No, no s'atura a temps. Necessita **56.25 metres** per frenar completament."
    },
    {
        statement: "Un ascensor baixa des d'una alçada de 30 metres a velocitat constant, trigant 1.5 minuts a arribar a la planta baixa. Quina és la seva velocitat en m/s?",
        mobiles: [{ nom: "Ascensor", tipus: MovementType.MRU, s0: 30, v0: -0.33, a: 0, t: 90 }],
        recommendedTime: 90,
        solution: "La velocitat de l'ascensor és de **-0.33 m/s**."
    },
    {
        statement: "Una partícula parteix de s=10m amb v=15m/s i a=-2m/s². En quins instants de temps la seva posició és s=50m?",
        mobiles: [{ nom: "Partícula", tipus: MovementType.MRUA, s0: 10, v0: 15, a: -2, t: 12 }],
        recommendedTime: 12,
        solution: "Arriba a la posició s=50m als **3.47 segons** i als **11.53 segons**."
    }
];

const DOS_MOBILS: Example[] = [
    {
        statement: "Un cotxe A surt de Barcelona cap a Girona a 100 km/h. Al mateix temps, un cotxe B surt de Girona (a 100 km) cap a Barcelona a 80 km/h. On i quan es creuen?",
        mobiles: [
            { nom: "Cotxe A", tipus: MovementType.MRU, s0: 0, v0: 27.78, a: 0, t: 4000 },
            { nom: "Cotxe B", tipus: MovementType.MRU, s0: 100000, v0: -22.22, a: 0, t: 4000 }
        ],
        recommendedTime: 2000,
        solution: "Es creuaran a **55.56 km** de Barcelona després de **0.56 hores**."
    },
    {
        statement: "Un lladre fuig en un cotxe a 120 km/h. Un policia, inicialment en repòs, el veu passar i accelera a 3 m/s² per atrapar-lo. Quan i on l'atrapa?",
        mobiles: [
            { nom: "Lladre", tipus: MovementType.MRU, s0: 0, v0: 33.33, a: 0, t: 30 },
            { nom: "Policia", tipus: MovementType.MRUA, s0: 0, v0: 0, a: 3, t: 30 }
        ],
        recommendedTime: 22.22,
        solution: "El policia atraparà al lladre en **22.22 segons** a una distància de **740.6 metres**."
    },
    {
        statement: "Dos trens circulen en sentit contrari per la mateixa via. Un va a 60 km/h i l'altre a 90 km/h. Estan separats per 2 km. Quan i on xoquen?",
        mobiles: [
            { nom: "Tren A", tipus: MovementType.MRU, s0: 0, v0: 16.67, a: 0, t: 60 },
            { nom: "Tren B", tipus: MovementType.MRU, s0: 2000, v0: -25, a: 0, t: 60 }
        ],
        recommendedTime: 48,
        solution: "Els trens xocaran en **48 segons** a **800 metres** de la posició inicial del Tren A."
    },
    {
        statement: "Un cotxe de carreres que parteix del repòs accelera a 5 m/s². Un segon cotxe passa per la sortida 2 segons més tard a una velocitat constant de 40 m/s. Aconsegueix el primer cotxe atrapar el segon?",
        mobiles: [
            { nom: "Corredor A", tipus: MovementType.MRUA, s0: 0, v0: 0, a: 5, t: 20 },
            { nom: "Corredor B", tipus: MovementType.MRU, s0: -80, v0: 40, a: 0, t: 20 } // s0 = -80 per simular la sortida 2s abans
        ],
        recommendedTime: 18.94,
        solution: "Sí, el Corredor A atraparà al B a l'instant **t = 18.94 s**."
    },
    {
        statement: "Un autobús surt d'una parada amb una acceleració de 1 m/s². En aquest instant, una persona que està a 6 metres darrere la parada comença a córrer a una velocitat constant per atrapar-lo. Quina és la velocitat mínima que ha de portar per atrapar-lo?",
        mobiles: [
            { nom: "Autobús", tipus: MovementType.MRUA, s0: 0, v0: 0, a: 1, t: 10 },
            { nom: "Persona", tipus: MovementType.MRU, s0: -6, v0: 3.46, a: 0, t: 10 }
        ],
        recommendedTime: 5,
        solution: "La velocitat mínima de la persona ha de ser **3.46 m/s**."
    },
    {
        statement: "Un cotxe A parteix del repòs amb a=2 m/s². Tres segons més tard, un cotxe B parteix del mateix punt a una velocitat constant de 25 m/s. Quan i on es troben?",
        mobiles: [
            { nom: "Cotxe A", tipus: MovementType.MRUA, s0: 0, v0: 0, a: 2, t: 30 },
            { nom: "Cotxe B", tipus: MovementType.MRU, s0: -75, v0: 25, a: 0, t: 30 } // s0 simula la sortida tardana
        ],
        recommendedTime: 21.5,
        solution: "Es troben als **21.5 segons** del temps del Cotxe A, a una distància de **462.25 metres**."
    },
    {
        statement: "Un vehicle policial a s=0 accelera a 3 m/s² per atrapar un camió a s=1000m que es mou en sentit contrari a -20 m/s. On es creuen?",
        mobiles: [
            { nom: "Policia", tipus: MovementType.MRUA, s0: 0, v0: 0, a: 3, t: 20 },
            { nom: "Camió", tipus: MovementType.MRU, s0: 1000, v0: -20, a: 0, t: 20 }
        ],
        recommendedTime: 16.05,
        solution: "Es creuen a la posició **s = 386.4 metres**."
    },
    {
        statement: "La llebre i la tortuga. La tortuga surt de l'origen a 0.1 m/s. La llebre surt del mateix lloc 1 minut més tard a 5 m/s. Quan atrapa la llebre a la tortuga?",
        mobiles: [
            { nom: "Tortuga", tipus: MovementType.MRU, s0: 0, v0: 0.1, a: 0, t: 70 },
            { nom: "Llebre", tipus: MovementType.MRU, s0: -300, v0: 5, a: 0, t: 70 } // s0 simula sortida 60s a 5m/s
        ],
        recommendedTime: 61.22,
        solution: "La llebre atrapa la tortuga als **61.22 segons** del temps de la tortuga, a **6.12 metres** de la sortida."
    },
    {
        statement: "Un cotxe A va a 20 m/s. Un cotxe B, que està a 500m, es mou cap a ell. Si es troben a 200m de la posició inicial d'A, quina era la velocitat de B?",
        mobiles: [
            { nom: "Cotxe A", tipus: MovementType.MRU, s0: 0, v0: 20, a: 0, t: 12 },
            { nom: "Cotxe B", tipus: MovementType.MRU, s0: 500, v0: -30, v0_explicit: true, a: 0, t: 12 }
        ],
        recommendedTime: 10,
        solution: "La velocitat del Cotxe B era de **-30 m/s**."
    },
    {
        statement: "Un camió va a 72 km/h. Un cotxe, 50m darrere, accelera des de 72 km/h amb a=2 m/s² per avançar-lo. Quant triga a estar 50m per davant del camió?",
        mobiles: [
            { nom: "Camió", tipus: MovementType.MRU, s0: 50, v0: 20, a: 0, t: 12 },
            { nom: "Cotxe", tipus: MovementType.MRUA, s0: 0, v0: 20, a: 2, t: 12 }
        ],
        recommendedTime: 10,
        solution: "El cotxe triga **10 segons** a completar l'avançament."
    }
];

const CAIGUDA_LLIURE: Example[] = [
    {
        statement: "Es deixa caure una pilota des d'una alçada de 80 metres. Quant de temps triga a arribar a terra i amb quina velocitat?",
        mobiles: [{ nom: "Pilota", tipus: MovementType.CaigudaLliure, s0: 80, v0: 0, a: -9.8, t: 5 }],
        recommendedTime: 4.04,
        solution: "La pilota trigarà **4.04 segons** a arribar a terra amb una velocitat de **-39.59 m/s**."
    },
    {
        statement: "Es llança una pedra verticalment cap amunt des de terra amb una velocitat de 25 m/s. Quina és l'alçada màxima que assoleix?",
        mobiles: [{ nom: "Pedra", tipus: MovementType.TirVertical, s0: 0, v0: 25, a: -9.8, t: 6 }],
        recommendedTime: 5.1,
        solution: "La pedra assolirà una alçada màxima de **31.89 metres**."
    },
    {
        statement: "Des d'un pont de 40 metres d'alçada, es llança una moneda cap avall amb una velocitat inicial de 5 m/s. Amb quina velocitat arriba a l'aigua?",
        mobiles: [{ nom: "Moneda", tipus: MovementType.CaigudaLliure, s0: 40, v0: -5, a: -9.8, t: 4 }],
        recommendedTime: 2.39,
        solution: "La moneda arribarà a l'aigua amb una velocitat de **-28.86 m/s**."
    },
    {
        statement: "Un globus aerostàtic puja a una velocitat constant de 10 m/s. Quan es troba a 120 metres d'alçada, es deixa caure un sac de sorra. Quant de temps triga el sac a arribar a terra?",
        mobiles: [{ nom: "Sac", tipus: MovementType.TirVertical, s0: 120, v0: 10, a: -9.8, t: 7 }],
        recommendedTime: 6.04,
        solution: "El sac de sorra trigarà **6.04 segons** a arribar a terra."
    },
    {
        statement: "Una persona en un penya-segat de 60 metres llança una bola verticalment cap amunt a 15 m/s. La bola puja i després cau al mar. Calcula el temps total de vol.",
        mobiles: [{ nom: "Bola", tipus: MovementType.TirVertical, s0: 60, v0: 15, a: -9.8, t: 6 }],
        recommendedTime: 5.23,
        solution: "El temps total de vol de la bola serà de **5.23 segons**."
    },
    {
        statement: "Un ascensor baixa a 2 m/s. Quan està a 50m d'alçada, un cargol cau del seu sostre, que està 3m per sobre del terra de l'ascensor. Quant triga el cargol a arribar al terra de l'ascensor?",
        mobiles: [{ nom: "Cargol", tipus: MovementType.CaigudaLliure, s0: 3, v0: 0, a: -9.8, t: 1 }],
        recommendedTime: 0.78,
        solution: "El cargol trigarà **0.78 segons** a arribar al terra de l'ascensor (vist des de dins)."
    },
    {
        statement: "Una pilota llançada cap amunt arriba just a una alçada de 15 metres. Amb quina velocitat inicial es va llançar?",
        mobiles: [{ nom: "Pilota", tipus: MovementType.TirVertical, s0: 0, v0: 17.15, v0_explicit: true, a: -9.8, t: 3.5 }],
        recommendedTime: 3.5,
        solution: "La pilota es va llançar amb una velocitat inicial de **17.15 m/s**."
    },
    {
        statement: "Es deixa caure una bola des de 40m. Quant de temps triga a passar per davant d'una finestra de 2m d'alçada, si la part superior de la finestra està a 20m del terra?",
        mobiles: [{ nom: "Bola", tipus: MovementType.CaigudaLliure, s0: 40, v0: 0, a: -9.8, t: 3 }],
        recommendedTime: 2.86,
        solution: "La bola és visible a la finestra durant **0.1 segons**."
    },
    {
        statement: "Una bola A es llança cap amunt des del terra a 30 m/s. Al mateix temps, una bola B es deixa caure des de 50m d'alçada. On i quan es creuen?",
        mobiles: [
            { nom: "Bola A", tipus: MovementType.TirVertical, s0: 0, v0: 30, a: -9.8, t: 4 },
            { nom: "Bola B", tipus: MovementType.CaigudaLliure, s0: 50, v0: 0, a: -9.8, t: 4 }
        ],
        recommendedTime: 1.67,
        solution: "Es creuen a l'instant **t = 1.67 s**, a una alçada de **36.5 metres**."
    },
    {
        statement: "Un coet té una velocitat de 50 m/s quan es troba a una alçada de 100 metres i se li acaba el combustible. Quina alçada màxima total assoleix?",
        mobiles: [{ nom: "Coet", tipus: MovementType.TirVertical, s0: 100, v0: 50, a: -9.8, t: 12 }],
        recommendedTime: 10.3,
        solution: "El coet assoleix una alçada màxima de **227.55 metres**."
    }
];

const TIR_PARABOLIC: Example[] = [
    {
        statement: "Un canó dispara un projectil amb una velocitat de 150 m/s i un angle de 35 graus sobre l'horitzontal des de terra. Quin és l'abast màxim del projectil?",
        mobiles: [{ nom: "Projectil", tipus: MovementType.TirParabolic, s0: 0, v0: 86.04, vx0: 122.87, a: -9.8, t: 20, angle: 35, angle_explicit: true }], // v0y = 150*sin(35), vx0 = 150*cos(35)
        recommendedTime: 17.56,
        solution: "L'abast màxim horitzontal del projectil serà de **2136 metres**."
    },
    {
        statement: "Un avió de bombers vola horitzontalment a 500 m d'alçada a una velocitat de 180 km/h. A quina distància horitzontal de l'incendi ha de deixar caure el paquet d'aigua?",
        mobiles: [{ nom: "Paquet", tipus: MovementType.TirParabolic, s0: 500, v0: 0, vx0: 50, a: -9.8, t: 12 }], // 180 km/h = 50 m/s
        recommendedTime: 10.1,
        solution: "Ha de deixar caure el paquet a una distància de **505 metres** de l'incendi."
    },
    {
        statement: "Un golfista colpeja una pilota des d'una elevació de 10 metres amb una velocitat de 40 m/s i un angle de 25 graus. A quina distància aterra la pilota?",
        mobiles: [{ nom: "Pilota", tipus: MovementType.TirParabolic, s0: 10, v0: 16.9, vx0: 36.25, a: -9.8, t: 5, angle: 25, angle_explicit: true }], // v0y = 40*sin(25), vx0 = 40*cos(25)
        recommendedTime: 3.94,
        solution: "La pilota aterrarà a una distància horitzontal de **142.9 metres**."
    },
    {
        statement: "Una moto de motocròs salta des d'una rampa de 2 metres d'alçada. En el moment del salt, la seva velocitat horitzontal és de 20 m/s i la vertical és de 5 m/s. Calcula el temps de vol.",
        mobiles: [{ nom: "Moto", tipus: MovementType.TirParabolic, s0: 2, v0: 5, v0_explicit: true, vx0: 20, vx0_explicit: true, a: -9.8, t: 2 }],
        recommendedTime: 1.32,
        solution: "La moto estarà a l'aire durant **1.32 segons**."
    },
    {
        statement: "Es llança una javelina des d'una alçada de 1.8 metres amb una velocitat de 28 m/s i un angle de 40 graus. Quina és l'alçada màxima que assoleix respecte a terra?",
        mobiles: [{ nom: "Javelina", tipus: MovementType.TirParabolic, s0: 1.8, v0: 18.0, vx0: 21.45, a: -9.8, t: 4, angle: 40, angle_explicit: true }],
        recommendedTime: 3.77,
        solution: "La javelina assoleix una alçada màxima de **18.28 metres** respecte a terra."
    },
    {
        statement: "Un tennista serveix horitzontalment a 180 km/h des de 2.5m d'alçada. La xarxa està a 12m i fa 0.9m d'alt. Passa la pilota per sobre de la xarxa?",
        mobiles: [{ nom: "Pilota", tipus: MovementType.TirParabolic, s0: 2.5, v0: 0, vx0: 50, a: -9.8, t: 1 }],
        recommendedTime: 0.71,
        solution: "Sí, la pilota passa per sobre de la xarxa a una alçada de **2.22 metres**."
    },
    {
        statement: "Un canó dispara a 100 m/s amb un angle de 40°. Hi ha una muralla de 15m d'alt a 300m de distància. El projectil passa per sobre?",
        mobiles: [{ nom: "Projectil", tipus: MovementType.TirParabolic, s0: 0, v0: 64.28, vx0: 76.6, a: -9.8, t: 14, angle: 40, angle_explicit: true }],
        recommendedTime: 13.12,
        solution: "Sí, el projectil passa molt per sobre, a una alçada de **176.4 metres** quan està a la distància de la muralla."
    },
    {
        statement: "Una catapulta llança una pedra a 45 m/s per colpejar un objectiu a 180m a la mateixa alçada. Quin és l'angle de llançament més baix possible?",
        mobiles: [{ nom: "Pedra", tipus: MovementType.TirParabolic, s0: 0, v0: 22.7, vx0: 38.8, a: -9.8, t: 5, angle: 30.29, angle_explicit: true }],
        recommendedTime: 4.63,
        solution: "L'angle de llançament més baix possible és de **30.29 graus**."
    },
    {
        statement: "Un avió puja amb un angle de 15 graus a 200 m/s. A 1000m d'alçada, deixa anar un paquet. Quina és la trajectòria del paquet?",
        mobiles: [{ nom: "Paquet", tipus: MovementType.TirParabolic, s0: 1000, v0: 51.76, vx0: 193.2, a: -9.8, t: 20, angle: 15 }],
        recommendedTime: 19.8,
        solution: "El paquet continuarà pujant inicialment i després seguirà una trajectòria parabòlica fins a terra, aterrant molt lluny."
    },
    {
        statement: "Un jugador de dards llança un dard a 15 m/s amb un angle de 10° cap amunt des d'una alçada de 1.7m. La diana està a 2.5m de distància. A quina alçada colpeja el dard?",
        mobiles: [{ nom: "Dard", tipus: MovementType.TirParabolic, s0: 1.7, v0: 2.6, vx0: 14.77, a: -9.8, t: 1, angle: 10, angle_explicit: true }],
        recommendedTime: 0.8,
        solution: "El dard colpeja la diana a una alçada de **2.0 metres**."
    }
];

export const EXAMPLES_BY_CATEGORY = {
    UN_MOBIL,
    DOS_MOBILS,
    CAIGUDA_LLIURE,
    TIR_PARABOLIC
};