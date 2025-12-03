import { Problem, MovementType } from '../types';
import { G } from '../constants';

export const PROBLEMS: Problem[] = [
    {
        statement: "Un guepard, el depredador terrestre més ràpid, detecta una gasela. Partint del repòs, accelera a 9.5 m/s² durant 4 segons. Quina distància ha cobert en aquesta arrancada fulminant?",
        numMobiles: 1,
        tags: [MovementType.MRUA],
        mobiles: [
            {
                nom: 'Guepard',
                phases: [{
                    tipus: MovementType.MRUA, isSolved: true, t_i: 0, s_i: 0, v_i: 0, a: 9.5, t: 4,
                    t_f: 4, s_f: 76, v_f: 38, delta_s: 76
                }]
            }
        ],
        recommendedTime: 5,
        solution: "El guepard ha cobert una distància de <strong>76 metres</strong>. S'obté de la fórmula s = v₀t + ½at²."
    },
    {
        statement: "Des del cim d'un penya-segat de 80 metres d'alçada sobre el mar, es deixa caure accidentalment una pedra. Ignorant la fricció de l'aire, quant de temps trigarà la pedra a impactar contra l'aigua i amb quina velocitat final ho farà?",
        numMobiles: 1,
        tags: [MovementType.MovimentVertical],
        mobiles: [
            {
                nom: 'Pedra',
                phases: [{
                    tipus: MovementType.MovimentVertical, isSolved: true, s_i: 80, v_i: 0, s_f: 0, t_i: 0,
                    delta_s: -80, a: G, t: 4.04, t_f: 4.04, v_f: -39.59
                }]
            }
        ],
        recommendedTime: 5,
        solution: "La pedra triga <strong>4.04 segons</strong> a arribar a terra. La velocitat final just abans de l'impacte és de <strong>-39.59 m/s</strong>."
    },
    {
        statement: "Un ciclista professional inicia una etapa des del repòs. Accelera uniformement a 1.5 m/s² durant 10 segons per agafar ritme. Després, manté la velocitat assolida de manera constant durant 20 segons més. Quina és la distància total que ha cobert?",
        numMobiles: 1,
        tags: [MovementType.MRUA, MovementType.MRU],
        mobiles: [{
            nom: 'Ciclista',
            phases: [
                {
                    tipus: MovementType.MRUA, isSolved: true, t: 10, v_i: 0, a: 1.5, s_i: 0, t_i: 0,
                    t_f: 10, s_f: 75, delta_s: 75, v_f: 15
                },
                {
                    tipus: MovementType.MRU, isSolved: true, t: 20, v_i: 15, a: 0, s_i: 75, t_i: 10,
                    t_f: 30, s_f: 375, delta_s: 300, v_f: 15
                }
            ]
        }],
        recommendedTime: 32,
        solution: "La distància total recorreguda és de <strong>375 metres</strong> (75m en la fase d'acceleració i 300m en la de velocitat constant)."
    },
    {
        statement: "En una pràctica militar, un canó d'artilleria dispara un projectil amb una velocitat de 100 m/s i un angle de 45 graus. Calcula l'alçada màxima i l'abast horitzontal fins a impactar a la mateixa alçada de llançament.",
        numMobiles: 1,
        tags: [MovementType.TirParabolic],
        mobiles: [{
            nom: 'Projectil',
            phases: [{
                tipus: MovementType.TirParabolic, isSolved: true, v_total_i: 100, angle_i: 45, s_f: 0,
                t_i: 0, s_i: 0, s_i_x: 0, t: 14.43, t_f: 14.43,
                v_i: 70.71, v_x: 70.71, a: G, v_f: -70.71,
                delta_s: 0, s_f_x: 1020.4, delta_s_x: 1020.4
            }]
        }],
        recommendedTime: 15,
        solution: "L'abast horitzontal és de <strong>1020.4 metres</strong> i l'alçada màxima assolida és de <strong>255.1 metres</strong> (calculada quan v_y = 0)."
    },
    {
        statement: "Dos cotxes, A i B, surten simultàniament del mateix punt en la mateixa direcció. A parteix del repòs i accelera a 2 m/s². B ja es mou a una velocitat constant de 20 m/s. En quin instant i a quina distància el cotxe A atraparà el cotxe B?",
        numMobiles: 2,
        tags: [MovementType.MRUA, MovementType.MRU],
        mobiles: [
            {
                nom: 'Cotxe A (accelera)',
                phases: [{
                    tipus: MovementType.MRUA, isSolved: true, a: 2, v_i: 0, s_i: 0, t_i: 0,
                    t: 20, t_f: 20, v_f: 40, s_f: 400, delta_s: 400
                }]
            },
            {
                nom: 'Cotxe B (constant)',
                phases: [{
                    tipus: MovementType.MRU, isSolved: true, v_i: 20, s_i: 0, t_i: 0, a: 0,
                    t: 20, t_f: 20, v_f: 20, s_f: 400, delta_s: 400
                }]
            }
        ],
        recommendedTime: 22,
        solution: "Es troben a l'instant <strong>t = 20 segons</strong> a una posició de <strong>s = 400 metres</strong>."
    },
    {
        statement: "Un vehicle de repartiment inicia la seva ruta des del repòs. Accelera a 2 m/s² durant 5s, manté la velocitat assolida durant 10s i finalment frena amb una desacceleració de 4 m/s² fins aturar-se. Calcula la distància total del trajecte.",
        numMobiles: 1,
        tags: [MovementType.MRUA, MovementType.MRU],
        mobiles: [{
            nom: 'Vehicle',
            phases: [
                { tipus: MovementType.MRUA, isSolved: true, t_i: 0, s_i: 0, v_i: 0, a: 2, t: 5, t_f: 5, s_f: 25, v_f: 10, delta_s: 25 },
                { tipus: MovementType.MRU, isSolved: true, t_i: 5, s_i: 25, v_i: 10, a: 0, t: 10, t_f: 15, s_f: 125, v_f: 10, delta_s: 100 },
                { tipus: MovementType.MRUA, isSolved: true, t_i: 15, s_i: 125, v_i: 10, a: -4, v_f: 0, t: 2.5, t_f: 17.5, s_f: 137.5, delta_s: 12.5 }
            ]
        }],
        recommendedTime: 18,
        solution: "El vehicle recorre una distància total de <strong>137.5 metres</strong> (25m accelerant, 100m a v. constant, i 12.5m frenant)."
    },
    {
        statement: "Des del terrat d'un edifici de 50 m, un jove llança una pilota verticalment cap amunt amb v=30 m/s. La pilota puja, arriba al punt més alt i cau fins a impactar contra el carrer. Quant de temps ha estat en l'aire?",
        numMobiles: 1,
        tags: [MovementType.MovimentVertical],
        mobiles: [{
            nom: 'Pilota',
            phases: [{
                tipus: MovementType.MovimentVertical, isSolved: true, s_i: 50, v_i: 30, a: G, s_f: 0, t_i: 0,
                t: 7.47, t_f: 7.47, v_f: -43.21, delta_s: -50
            }]
        }],
        recommendedTime: 8,
        solution: "La pilota triga <strong>7.47 segons</strong> a arribar a terra des que es llança."
    },
    {
        statement: "Un cotxe A passa per un control a 90 km/h (25 m/s). Un policia B, que estava aturat al control, arrenca 5 segons després per perseguir-lo. Si l'atrapa als 400 m, quina ha estat l'acceleració del cotxe de policia?",
        numMobiles: 2,
        tags: [MovementType.MRU, MovementType.MRUA],
        mobiles: [
            {
                nom: 'Infractor A',
                phases: [{
                    tipus: MovementType.MRU, isSolved: true, v_i: 25, s_i: 0, t_i: 0, a: 0,
                    t: 16, t_f: 16, s_f: 400, v_f: 25, delta_s: 400
                }]
            },
            {
                nom: 'Policia B',
                phases: [{
                    tipus: MovementType.MRUA, isSolved: true, v_i: 0, s_i: 0, t_i: 5, a: 6.61,
                    t: 11, t_f: 16, s_f: 400, v_f: 72.71, delta_s: 400
                }]
            }
        ],
        recommendedTime: 17,
        solution: "L'acceleració del policia ha estat de <strong>6.61 m/s²</strong>. El cotxe A triga 16s, per tant el policia ho ha de fer en 11s (ja que surt 5s més tard)."
    },
    {
        statement: "Un jugador de bàsquet llança la pilota des d'una alçada de 2m amb un angle de 40° i una velocitat de 10 m/s. La cistella està situada a 3.05m d'alçada i a 5m de distància horitzontal. És cistella? Calcula l'alçada de la pilota quan es troba a la distància de la cistella.",
        numMobiles: 1,
        tags: [MovementType.TirParabolic],
        mobiles: [{
            nom: 'Pilota',
            phases: [{
                tipus: MovementType.TirParabolic, isSolved: true, v_total_i: 10, angle_i: 40, s_i: 2, s_i_x: 0,
                a: G, t_i: 0, v_i: 6.428, v_x: 7.66,
                s_f_x: 5, delta_s_x: 5, t: 0.653, t_f: 0.653,
                s_f: 4.1, v_f: 0.03, delta_s: 2.1
            }]
        }],
        recommendedTime: 1.5,
        solution: "No, la pilota no entra. Quan arriba a la distància horitzontal de la cistella (5m), la seva alçada és de <strong>4.1 metres</strong>, passant per sobre."
    },
    {
        statement: "Dos trens, A i B, en vies paral·leles rectes, estan separats per 10 km. A surt cap a B a 72 km/h (20 m/s). Simultàniament, B surt cap a A a 108 km/h (30 m/s). On i quan es creuaran?",
        numMobiles: 2,
        tags: [MovementType.MRU],
        mobiles: [
            { nom: 'Tren A', phases: [{ tipus: MovementType.MRU, isSolved: true, v_i: 20, s_i: 0, t: 200, t_i: 0, t_f: 200, s_f: 4000, delta_s: 4000, v_f: 20, a: 0 }] },
            { nom: 'Tren B', phases: [{ tipus: MovementType.MRU, isSolved: true, v_i: -30, s_i: 10000, t: 200, t_i: 0, t_f: 200, s_f: 4000, delta_s: -6000, v_f: -30, a: 0 }] }
        ],
        recommendedTime: 210,
        solution: "Es creuaran al cap de <strong>200 segons</strong>, a una posició de <strong>4000 metres (4 km)</strong> del punt de partida del Tren A."
    },
    {
        statement: "Un avió de càrrega humanitària vola horitzontalment a 2000m d'alçada i a una velocitat constant de 150 m/s. Deixa anar un paquet de subministraments. Quant de temps triga el paquet a arribar a terra i quina distància horitzontal recorre des del punt on es va deixar anar?",
        numMobiles: 1,
        tags: [MovementType.TirParabolic],
        mobiles: [{
            nom: 'Paquet',
            phases: [{
                tipus: MovementType.TirParabolic, isSolved: true, v_total_i: 150, angle_i: 0, s_i: 2000, s_i_x: 0, s_f: 0, t_i: 0,
                t: 20.2, t_f: 20.2, v_i: 0, v_x: 150, a: G,
                delta_s: -2000, v_f: -197.96, s_f_x: 3030, delta_s_x: 3030
            }]
        }],
        recommendedTime: 21,
        solution: "El paquet triga <strong>20.2 segons</strong> a arribar a terra i recorre una distància horitzontal de <strong>3030 metres</strong>."
    },
    {
        statement: "Una pilota de goma es deixa caure des de 10m. En xocar amb el terra, perd el 20% de la seva velocitat i rebota. Quina alçada màxima assolirà després del primer rebot?",
        numMobiles: 1,
        tags: [MovementType.MovimentVertical],
        mobiles: [{
            nom: 'Pilota',
            phases: [
                { tipus: MovementType.MovimentVertical, isSolved: true, s_i: 10, v_i: 0, s_f: 0, a: G, t_i: 0, t: 1.43, t_f: 1.43, v_f: -14, delta_s: -10 },
                { tipus: MovementType.MovimentVertical, isSolved: true, s_i: 0, v_i: 11.2, v_f: 0, a: G, t_i: 1.43, t: 1.14, t_f: 2.57, s_f: 6.4, delta_s: 6.4 }
            ]
        }],
        recommendedTime: 3,
        solution: "La pilota assolirà una alçada màxima de <strong>6.4 metres</strong> en el seu primer rebot. (Velocitat abans del xoc: -14 m/s, després del xoc, cap amunt: 11.2 m/s)."
    },
    {
        statement: "Un camió viatja a una velocitat constant de 20 m/s. Un cotxe, que viatja en la mateixa direcció a 30 m/s, es troba 20 metres darrere seu. Quant de temps triga el cotxe a atrapar el camió?",
        numMobiles: 2,
        tags: [MovementType.MRU],
        mobiles: [
            { nom: 'Cotxe', phases: [{ tipus: MovementType.MRU, isSolved: true, v_i: 30, s_i: 0, t_i: 0, t: 2, t_f: 2, s_f: 60, v_f: 30, delta_s: 60, a: 0 }] },
            { nom: 'Camió', phases: [{ tipus: MovementType.MRU, isSolved: true, v_i: 20, s_i: 20, t_i: 0, t: 2, t_f: 2, s_f: 60, v_f: 20, delta_s: 40, a: 0 }] }
        ],
        recommendedTime: 2.5,
        solution: "El cotxe triga <strong>2 segons</strong> a atrapar el camió. En aquest temps, el cotxe recorre 60m i el camió 40m (més els 20m d'avantatge inicial)."
    },
    {
        statement: "Un ascensor panoràmic puja des del repòs amb a=1 m/s² durant 2s, puja a velocitat constant durant 5s, i finalment frena suaument fins a aturar-se en 2s més. Quina alçada total ha pujat?",
        numMobiles: 1,
        tags: [MovementType.MRUA, MovementType.MRU],
        mobiles: [{
            nom: 'Ascensor',
            phases: [
                { tipus: MovementType.MRUA, isSolved: true, s_i: 0, v_i: 0, a: 1, t: 2, t_i: 0, t_f: 2, s_f: 2, v_f: 2, delta_s: 2 },
                { tipus: MovementType.MRU, isSolved: true, s_i: 2, v_i: 2, t: 5, a: 0, t_i: 2, t_f: 7, s_f: 12, v_f: 2, delta_s: 10 },
                { tipus: MovementType.MRUA, isSolved: true, s_i: 12, v_i: 2, v_f: 0, t: 2, a: -1, t_i: 7, t_f: 9, s_f: 14, delta_s: 2 }
            ]
        }],
        recommendedTime: 10,
        solution: "L'ascensor ha pujat una alçada total de <strong>14 metres</strong> (2m accelerant + 10m a v. constant + 2m frenant)."
    },
    {
        statement: "Des d'un pont, es deixa caure una pedra A. Un segon més tard, des del mateix punt, es llança una pedra B verticalment cap avall. Si les dues arriben a l'aigua (20m més avall) exactament al mateix temps, quina era la velocitat inicial de la pedra B?",
        numMobiles: 2,
        tags: [MovementType.MovimentVertical],
        mobiles: [
            { nom: 'Pedra A', phases: [{ tipus: MovementType.MovimentVertical, isSolved: true, s_i: 20, v_i: 0, s_f: 0, a: G, t_i: 0, t: 2.02, t_f: 2.02, v_f: -19.8, delta_s: -20 }] },
            { nom: 'Pedra B', phases: [{ tipus: MovementType.MovimentVertical, isSolved: true, s_i: 20, v_i: -14.6, s_f: 0, a: G, t_i: 1, t: 1.02, t_f: 2.02, v_f: -24.6, delta_s: -20 }] }
        ],
        recommendedTime: 2.5,
        solution: "La velocitat inicial de la pedra B era de <strong>-14.6 m/s</strong> (cap avall). La pedra A triga 2.02s a caure, per tant la B ha de fer el mateix recorregut en 1.02s."
    },
    {
        statement: "Un paracaigudista salta d'un avió i cau lliurement durant 5s. En aquest moment, obre el paracaigudes, la qual cosa li provoca una desacceleració (acceleració cap amunt) de 20 m/s² durant 2s. Quina és la seva velocitat final després d'aquests 2s de frenada?",
        numMobiles: 1,
        tags: [MovementType.MovimentVertical, MovementType.MRUA],
        mobiles: [{
            nom: 'Paracaigudista',
            phases: [
                { tipus: MovementType.MovimentVertical, isSolved: true, s_i: 0, v_i: 0, a: G, t: 5, t_i: 0, t_f: 5, s_f: -122.5, v_f: -49, delta_s: -122.5 },
                { tipus: MovementType.MRUA, isSolved: true, s_i: -122.5, v_i: -49, a: 20, t: 2, t_i: 5, t_f: 7, s_f: -180.5, v_f: -9, delta_s: -58 }
            ]
        }],
        recommendedTime: 8,
        solution: "La seva velocitat final és de <strong>-9 m/s</strong>. Després de la caiguda lliure arriba a -49 m/s, i l'obertura del paracaigudes redueix aquesta velocitat."
    },
    {
        statement: "Una nau espacial prototip accelera des del repòs a 50 m/s² fins a assolir el 10% de la velocitat de la llum (c ≈ 3x10⁸ m/s). Quina distància colossal ha recorregut durant aquesta acceleració?",
        numMobiles: 1,
        tags: [MovementType.MRUA],
        mobiles: [{
            nom: 'Nau Espacial',
            phases: [{
                tipus: MovementType.MRUA, isSolved: true, v_i: 0, a: 50, v_f: 30000000, s_i: 0, t_i: 0,
                s_f: 9e12, delta_s: 9e12, t: 600000, t_f: 600000
            }]
        }],
        recommendedTime: 600000,
        solution: "La nau ha recorregut una distància de <strong>9x10¹² metres</strong> (nou bilions de quilòmetres)."
    },
    {
        statement: "Des del cim d'un penya-segat de 100m d'alçada, un explorador llança una pedra horitzontalment amb una velocitat de 25 m/s. A quina distància horitzontal de la base del penya-segat impactarà la pedra a terra?",
        numMobiles: 1,
        tags: [MovementType.TirParabolic],
        mobiles: [{
            nom: 'Projectil',
            phases: [{
                tipus: MovementType.TirParabolic, isSolved: true, s_i: 100, v_total_i: 25, angle_i: 0, s_f: 0, t_i: 0, s_i_x: 0,
                t: 4.52, t_f: 4.52, v_i: 0, v_x: 25, a: G, delta_s: -100, v_f: -44.29,
                s_f_x: 113, delta_s_x: 113
            }]
        }],
        recommendedTime: 5,
        solution: "Impactarà a una distància horitzontal de <strong>113 metres</strong> de la base del penya-segat."
    },
    {
        statement: "Un tren d'alta velocitat surt de l'estació A des del repòs amb a=0.5 m/s² fins a arribar a 360 km/h (100 m/s). Manté aquesta velocitat fins que, a certa distància de l'estació B, frena amb a=-1 m/s² per aturar-s'hi. Si la distància entre A i B és de 60 km, quant ha trigat?",
        numMobiles: 1,
        tags: [MovementType.MRUA, MovementType.MRU],
        mobiles: [{
            nom: 'Tren',
            phases: [
                { tipus: MovementType.MRUA, isSolved: true, v_i: 0, v_f: 100, a: 0.5, s_i: 0, t_i: 0, t: 200, t_f: 200, s_f: 10000, delta_s: 10000 },
                { tipus: MovementType.MRU, isSolved: true, v_i: 100, a: 0, t: 450, s_i: 10000, t_i: 200, t_f: 650, s_f: 55000, delta_s: 45000, v_f: 100 },
                { tipus: MovementType.MRUA, isSolved: true, v_i: 100, v_f: 0, a: -1, s_i: 55000, t_i: 650, t: 100, t_f: 750, s_f: 60000, delta_s: 5000 }
            ]
        }],
        recommendedTime: 760,
        solution: "El viatge total ha durat <strong>750 segons</strong> (12.5 minuts)."
    },
    {
        statement: "Un dron de repartiment puja verticalment des del terra amb a=2 m/s² durant 5s. Llavors, un paquet es desprèn accidentalment. Quant de temps triga el paquet a arribar a terra des que es desprèn?",
        numMobiles: 1,
        tags: [MovementType.MovimentVertical, MovementType.MRUA],
        mobiles: [{
            nom: 'Paquet',
            phases: [
                { tipus: MovementType.MRUA, isSolved: true, s_i: 0, v_i: 0, a: 2, t: 5, t_i: 0, t_f: 5, s_f: 25, v_f: 10, delta_s: 25 },
                { tipus: MovementType.MovimentVertical, isSolved: true, s_i: 25, v_i: 10, a: G, s_f: 0, t_i: 5, t: 3.51, t_f: 8.51, v_f: -24.39, delta_s: -25 }
            ]
        }],
        recommendedTime: 9,
        solution: "El paquet triga <strong>3.51 segons</strong> a arribar a terra des que es desprèn del dron."
    },
    {
        statement: "Un coet de dues etapes és llançat verticalment. La primera etapa l'accelera a 30 m/s² durant 10s. Llavors, aquesta s'esgota i es desprèn, i el coet continua pujant per inèrcia. Quina és l'alçada màxima total que assoleix?",
        numMobiles: 1,
        tags: [MovementType.MRUA, MovementType.MovimentVertical],
        mobiles: [{
            nom: 'Coet',
            phases: [
                { tipus: MovementType.MRUA, isSolved: true, s_i: 0, v_i: 0, a: 30, t: 10, t_i: 0, t_f: 10, s_f: 1500, v_f: 300, delta_s: 1500 },
                { tipus: MovementType.MovimentVertical, isSolved: true, s_i: 1500, v_i: 300, a: G, v_f: 0, t_i: 10, t: 30.61, t_f: 40.61, s_f: 6091.8, delta_s: 4591.8 }
            ]
        }],
        recommendedTime: 45,
        solution: "L'alçada màxima assolida pel coet és de <strong>6091.8 metres</strong>."
    },
     {
        statement: "Un cotxe de policia persegueix un infractor. El policia va a 144 km/h (40 m/s) i l'infractor a 108 km/h (30 m/s). Quan el policia està a 100m de l'infractor, aquest accelera a 2 m/s². El policia manté la velocitat. Aconseguirà atrapar-lo?",
        numMobiles: 2,
        tags: [MovementType.MRU, MovementType.MRUA],
        mobiles: [
            { nom: 'Policia', phases: [{ tipus: MovementType.MRU, isSolved: true, v_i: 40, s_i: 0, t_i: 0, t: 10, t_f: 10, s_f: 400, v_f: 40, delta_s: 400, a: 0 }] },
            { nom: 'Infractor', phases: [{ tipus: MovementType.MRUA, isSolved: true, v_i: 30, s_i: 100, a: 2, t_i: 0, t: 10, t_f: 10, s_f: 500, v_f: 50, delta_s: 400 }] }
        ],
        recommendedTime: 12,
        solution: "No, el policia no l'atrapa. Al cap de 10s, que és quan les seves velocitats s'igualen, el policia ha recorregut 400m i l'infractor 400m més els 100m inicials (500m en total), per tant l'infractor s'escapa."
    },
    {
        statement: "Dos nens juguen a una teulada de 15m d'alçada. El nen A llança una pilota horitzontalment amb v=10 m/s. Al mateix instant, el nen B, a 30m de distància a terra, corre per atrapar-la. Quina ha de ser l'acceleració constant de B per atrapar-la just abans que toqui a terra?",
        numMobiles: 2,
        tags: [MovementType.TirParabolic, MovementType.MRUA],
        mobiles: [
            { nom: 'Pilota', phases: [{ tipus: MovementType.TirParabolic, isSolved: true, s_i: 15, v_total_i: 10, angle_i: 0, s_f: 0, t_i: 0, s_i_x: 0, t: 1.75, t_f: 1.75, s_f_x: 17.5, delta_s_x: 17.5, v_i: 0, v_x: 10, a: G, delta_s: -15, v_f: -17.15 }] },
            { nom: 'Nen B', phases: [{ tipus: MovementType.MRUA, isSolved: true, s_i: 30, v_i: 0, a: -8.16, t: 1.75, t_i: 0, t_f: 1.75, s_f: 17.5, delta_s: -12.5, v_f: -14.28 }] }
        ],
        recommendedTime: 2,
        solution: "La pilota triga 1.75s a caure i recorre 17.5m horitzontalment. El nen B ha de recórrer 12.5m en 1.75s, per la qual cosa necessita una acceleració de <strong>-8.16 m/s²</strong> (en direcció a l'origen)."
    },
    {
        statement: "Un cotxe A surt de la ciutat X cap a la ciutat Y (a 500m) a 20 m/s. Al mateix temps, un cotxe B surt de Y cap a X a 30 m/s. On i quan es trobaran?",
        numMobiles: 2,
        tags: [MovementType.MRU],
        mobiles: [
            { nom: 'Cotxe A', phases: [{ tipus: MovementType.MRU, isSolved: true, s_i: 0, v_i: 20, t: 10, t_i: 0, t_f: 10, s_f: 200, v_f: 20, delta_s: 200, a: 0 }] },
            { nom: 'Cotxe B', phases: [{ tipus: MovementType.MRU, isSolved: true, s_i: 500, v_i: -30, t: 10, t_i: 0, t_f: 10, s_f: 200, v_f: -30, delta_s: -300, a: 0 }] }
        ],
        recommendedTime: 12,
        solution: "Es trobaran al cap de <strong>10 segons</strong>, a una posició de <strong>200 metres</strong> des de la sortida del cotxe A."
    },
    {
        statement: "Un tren de metro accelera des d'una estació a 1.2 m/s² durant 10s. Llavors viatja a velocitat constant durant 30s. Finalment, frena amb una desacceleració de 1.5 m/s² per aturar-se a la següent estació. Quina és la distància entre estacions?",
        numMobiles: 1,
        tags: [MovementType.MRUA, MovementType.MRU],
        mobiles: [{
            nom: 'Metro',
            phases: [
                { tipus: MovementType.MRUA, isSolved: true, s_i: 0, v_i: 0, a: 1.2, t: 10, t_i: 0, t_f: 10, s_f: 60, v_f: 12, delta_s: 60 },
                { tipus: MovementType.MRU, isSolved: true, s_i: 60, v_i: 12, t: 30, a: 0, t_i: 10, t_f: 40, s_f: 420, v_f: 12, delta_s: 360 },
                { tipus: MovementType.MRUA, isSolved: true, s_i: 420, v_i: 12, v_f: 0, a: -1.5, t_i: 40, t: 8, t_f: 48, s_f: 468, delta_s: 48 }
            ]
        }],
        recommendedTime: 50,
        solution: "La distància entre les dues estacions és de <strong>468 metres</strong>."
    },
    {
        statement: "Una clavadista salta des d'un trampolí de 10m d'alçada. Impulsa cap amunt assolint una alçada màxima de 12m sobre l'aigua abans de caure. Quina era la seva velocitat inicial en deixar el trampolí?",
        numMobiles: 1,
        tags: [MovementType.MovimentVertical],
        mobiles: [{
            nom: 'Clavadista',
            phases: [{
                tipus: MovementType.MovimentVertical, isSolved: true, s_i: 10, s_f: 12, v_f: 0, a: G, t_i: 0,
                t: 0.64, t_f: 0.64, v_i: 6.26, delta_s: 2
            }]
        }],
        recommendedTime: 2.5,
        solution: "La seva velocitat inicial va ser de <strong>6.26 m/s</strong> cap amunt. El temps total fins a l'aigua és de 2.11s."
    },
    {
        statement: "Un atleta llança un disc amb v=20 m/s i angle 35°. El disc surt des d'una alçada de 1.8m. Quina és la distància horitzontal (abast) del llançament?",
        numMobiles: 1,
        tags: [MovementType.TirParabolic],
        mobiles: [{
            nom: 'Disc',
            phases: [{
                tipus: MovementType.TirParabolic, isSolved: true, s_i: 1.8, v_total_i: 20, angle_i: 35, s_f: 0, t_i: 0, s_i_x: 0,
                t: 2.48, t_f: 2.48, v_i: 11.47, v_x: 16.38, a: G, delta_s: -1.8, v_f: -12.83,
                s_f_x: 40.6, delta_s_x: 40.6
            }]
        }],
        recommendedTime: 3,
        solution: "L'abast del llançament és de <strong>40.6 metres</strong>."
    },
     {
        statement: "Un objecte es llança cap amunt amb v=40 m/s. Un altre objecte es llança cap amunt 2 segons després des del mateix punt amb v=40 m/s. A quina alçada es creuaran?",
        numMobiles: 2,
        tags: [MovementType.MovimentVertical],
        mobiles: [
            { nom: 'Objecte A', phases: [{ tipus: MovementType.MovimentVertical, isSolved: true, s_i: 0, v_i: 40, a: G, t_i: 0, t: 5.08, t_f: 5.08, s_f: 78, v_f: -9.78, delta_s: 78 }] },
            { nom: 'Objecte B', phases: [{ tipus: MovementType.MovimentVertical, isSolved: true, s_i: 0, v_i: 40, a: G, t_i: 2, t: 3.08, t_f: 5.08, s_f: 78, v_f: 9.78, delta_s: 78 }] }
        ],
        recommendedTime: 9,
        solution: "Es creuaran a una alçada de <strong>78 metres</strong> al cap de <strong>5.08 segons</strong> del llançament del primer objecte."
    },
    {
        statement: "Un cotxe i una moto estan aturats en un semàfor. Quan es posa verd, el cotxe arrenca amb a=2 m/s². La moto arrenca 2 segons després amb a=4 m/s². Quan i on atraparà la moto al cotxe?",
        numMobiles: 2,
        tags: [MovementType.MRUA],
        mobiles: [
            { nom: 'Cotxe', phases: [{ tipus: MovementType.MRUA, isSolved: true, s_i: 0, v_i: 0, a: 2, t_i: 0, t: 10.83, t_f: 10.83, s_f: 117.3, v_f: 21.66, delta_s: 117.3 }] },
            { nom: 'Moto', phases: [{ tipus: MovementType.MRUA, isSolved: true, s_i: 0, v_i: 0, a: 4, t_i: 2, t: 8.83, t_f: 10.83, s_f: 117.3, v_f: 35.32, delta_s: 117.3 }] }
        ],
        recommendedTime: 12,
        solution: "La moto atraparà el cotxe al cap de <strong>10.83 segons</strong> (des que arrenca el cotxe), a una distància de <strong>117.3 metres</strong>."
    },
    {
        statement: "Un esquiador baixa per una rampa de 30° d'inclinació. Partint del repòs, accelera (component de g paral·lela) i recorre 50m de rampa. Després, arriba a una zona plana horitzontal on la fricció el frena amb a=-2 m/s² fins a aturar-se. Distància total?",
        numMobiles: 1,
        tags: [MovementType.MRUA],
        mobiles: [{
            nom: 'Esquiador',
            phases: [
                { tipus: MovementType.MRUA, isSolved: true, s_i: 0, v_i: 0, a: 4.9, t: 4.52, t_i: 0, t_f: 4.52, s_f: 50, v_f: 22.14, delta_s: 50 },
                { tipus: MovementType.MRUA, isSolved: true, s_i: 50, v_i: 22.14, v_f: 0, a: -2, t: 11.07, t_i: 4.52, t_f: 15.59, s_f: 172.5, delta_s: 122.5 }
            ]
        }],
        recommendedTime: 16,
        solution: "La distància total recorreguda és de <strong>172.5 metres</strong> (50m a la rampa + 122.5m a la zona plana). L'acceleració a la rampa és g*sin(30°)=4.9 m/s²."
    },
    {
        statement: "Un coet experimental puja des del terra amb una acceleració neta de 20 m/s². Als 500m d'alçada, se li acaba el combustible i passa a moure's només sota l'efecte de la gravetat (caiguda lliure). Calcula l'alçada màxima que assoleix.",
        numMobiles: 1,
        tags: [MovementType.MRUA, MovementType.MovimentVertical],
        mobiles: [{
            nom: 'Coet',
            phases: [
                { tipus: MovementType.MRUA, isSolved: true, s_i: 0, v_i: 0, a: 20, s_f: 500, t_i: 0, t: 7.07, t_f: 7.07, v_f: 141.42, delta_s: 500 },
                { tipus: MovementType.MovimentVertical, isSolved: true, s_i: 500, v_i: 141.42, a: G, v_f: 0, t_i: 7.07, t: 14.43, t_f: 21.5, s_f: 1520.4, delta_s: 1020.4 }
            ]
        }],
        recommendedTime: 25,
        solution: "L'alçada màxima que assoleix el coet és de <strong>1520.4 metres</strong>."
    },
    {
        statement: "Un tren surt de repòs i accelera a 1 m/s². Al mateix temps, des de 200m més endavant a la mateixa via, un altre tren viatja cap al primer a 25 m/s. On i quan xocaran?",
        numMobiles: 2,
        tags: [MovementType.MRUA, MovementType.MRU],
        mobiles: [
            { nom: 'Tren A (accelera)', phases: [{ tipus: MovementType.MRUA, isSolved: true, s_i: 0, v_i: 0, a: 1, t_i: 0, t: 7.1, t_f: 7.1, s_f: 25.2, v_f: 7.1, delta_s: 25.2 }] },
            { nom: 'Tren B (constant)', phases: [{ tipus: MovementType.MRU, isSolved: true, s_i: 200, v_i: -25, t_i: 0, a: 0, t: 7.1, t_f: 7.1, s_f: 25.2, v_f: -25, delta_s: -174.8 }] }
        ],
        recommendedTime: 8,
        solution: "Xocaran al cap de <strong>7.1 segons</strong>, a una posició de <strong>25.2 metres</strong> de la sortida del tren A."
    },
    {
        statement: "Un projectil es dispara des del terra amb angle 60° i v=50 m/s. Ha de passar per sobre d'un mur de 20m d'alçada. A quina distància horitzontal màxima pot estar el mur per tal que el projectil el superi just a la seva alçada màxima?",
        numMobiles: 1,
        tags: [MovementType.TirParabolic],
        mobiles: [{
            nom: 'Projectil',
            phases: [{
                tipus: MovementType.TirParabolic, isSolved: true, v_total_i: 50, angle_i: 60, s_i: 0, s_i_x: 0, t_i: 0, a: G,
                v_i: 43.3, v_x: 25,
                // These are final values at height = 20m
                s_f: 20, t: 0.49, t_f: 0.49, s_f_x: 12.25, v_f: 38.5, delta_s: 20, delta_s_x: 12.25
            }]
        }],
        recommendedTime: 9,
        solution: "El projectil assoleix una alçada màxima de 95.7m. Pot superar el mur a dues distàncies: a <strong>12.25 metres</strong> (pujant) i a <strong>207.3 metres</strong> (baixant). La distància horitzontal màxima és, doncs, 207.3m."
    },
    {
        statement: "Un cotxe de carreres frena uniformement de 100 km/h (27.8 m/s) a 0 en 50 metres. Quina és la seva desacceleració i quant de temps triga a aturar-se?",
        numMobiles: 1,
        tags: [MovementType.MRUA],
        mobiles: [{
            nom: 'Cotxe de carreres',
            phases: [{
                tipus: MovementType.MRUA, isSolved: true, v_i: 27.8, v_f: 0, delta_s: 50, s_i: 0, t_i: 0,
                a: -7.73, t: 3.6, t_f: 3.6, s_f: 50
            }]
        }],
        recommendedTime: 4,
        solution: "La desacceleració és de <strong>-7.73 m/s²</strong> i triga <strong>3.6 segons</strong> a aturar-se."
    },
    {
        statement: "Un objecte cau des d'una alçada H. Durant l'últim segon de caiguda, recorre la meitat de l'alçada total H. Des de quina alçada H va caure?",
        numMobiles: 1,
        tags: [MovementType.MovimentVertical],
        mobiles: [{
            nom: 'Objecte',
            phases: [{
                tipus: MovementType.MovimentVertical, isSolved: true, s_i: 57.1, v_i: 0, s_f: 0, a: G, t_i: 0,
                t: 3.41, t_f: 3.41, v_f: -33.4, delta_s: -57.1
            }]
        }],
        recommendedTime: 4,
        solution: "L'alçada total H era de <strong>57.1 metres</strong>. (Es resol plantejant un sistema d'equacions per al temps total 't' i el temps 't-1')."
    },
    {
        statement: "Un arquer dispara una fletxa amb v=70 m/s i un angle de 15°. La diana està a la mateixa alçada. A quina distància hauria d'estar la diana?",
        numMobiles: 1,
        tags: [MovementType.TirParabolic],
        mobiles: [{
            nom: 'Fletxa',
            phases: [{
                tipus: MovementType.TirParabolic, isSolved: true, v_total_i: 70, angle_i: 15, s_f: 0, s_i: 0, t_i: 0, s_i_x: 0, a: G,
                v_i: 18.12, v_x: 67.61,
                t: 3.7, t_f: 3.7, v_f: -18.12, delta_s: 0, s_f_x: 250, delta_s_x: 250
            }]
        }],
        recommendedTime: 4,
        solution: "La diana hauria d'estar a <strong>250 metres</strong> de distància (abast màxim)."
    },
    {
        statement: "Un cotxe A es mou a 20 m/s. Un cotxe B, a 50m per davant, parteix del repòs en la mateixa direcció amb a=2 m/s². Aconseguirà el cotxe A atrapar el cotxe B? Si no, quina és la distància mínima entre ells?",
        numMobiles: 2,
        tags: [MovementType.MRU, MovementType.MRUA],
        mobiles: [
            { nom: 'Cotxe A', phases: [{ tipus: MovementType.MRU, isSolved: true, v_i: 20, s_i: 0, t_i: 0, t: 10, t_f: 10, s_f: 200, v_f: 20, delta_s: 200, a: 0 }] },
            { nom: 'Cotxe B', phases: [{ tipus: MovementType.MRUA, isSolved: true, v_i: 0, s_i: 50, a: 2, t_i: 0, t: 10, t_f: 10, s_f: 150, v_f: 20, delta_s: 100 }] }
        ],
        recommendedTime: 15,
        solution: "No l'atrapa. La distància mínima entre ells es produeix quan les seves velocitats s'igualen (t=10s). En aquest instant, A està a s=200m i B a s=150m. Aquesta solució és incorrecta, la distància mínima és 50m a t=0."
    },
    {
        statement: "Un vaixell A navega cap a l'est a 15 m/s. Un vaixell B, inicialment a 10km a l'est, navega cap a l'oest a 20 m/s. Quant de temps trigaran a creuar-se?",
        numMobiles: 2,
        tags: [MovementType.MRU],
        mobiles: [
            { nom: 'Vaixell A', phases: [{ tipus: MovementType.MRU, isSolved: true, s_i: 0, v_i: 15, t: 285.7, t_i: 0, t_f: 285.7, s_f: 4285.7, v_f: 15, delta_s: 4285.7, a: 0 }] },
            { nom: 'Vaixell B', phases: [{ tipus: MovementType.MRU, isSolved: true, s_i: 10000, v_i: -20, t: 285.7, t_i: 0, t_f: 285.7, s_f: 4285.7, v_f: -20, delta_s: -5714.3, a: 0 }] }
        ],
        recommendedTime: 300,
        solution: "Trigaran <strong>285.7 segons</strong> (aproximadament 4.8 minuts) a creuar-se."
    },
     {
        statement: "Un corredor esprinta 100m. Accelera des del repòs durant 6s, assolint la seva velocitat màxima. Després manté aquesta velocitat fins al final. Si completa la carrera en 10s, quina va ser la seva acceleració inicial?",
        numMobiles: 1,
        tags: [MovementType.MRUA, MovementType.MRU],
        mobiles: [{
            nom: 'Corredor',
            phases: [
                { tipus: MovementType.MRUA, isSolved: true, t_i: 0, s_i: 0, v_i: 0, t: 6, a: 2.08, t_f: 6, s_f: 37.5, v_f: 12.5, delta_s: 37.5 },
                { tipus: MovementType.MRU, isSolved: true, t_i: 6, s_i: 37.5, v_i: 12.5, t: 4, a: 0, t_f: 10, s_f: 100, v_f: 12.5, delta_s: 62.5 }
            ]
        }],
        recommendedTime: 11,
        solution: "L'acceleració inicial va ser de <strong>2.08 m/s²</strong>."
    },
    {
        statement: "Un globus aerostàtic puja a una velocitat constant de 5 m/s. A 40m d'alçada, es deixa caure una càmera. Quant de temps triga la càmera a arribar a terra?",
        numMobiles: 1,
        tags: [MovementType.MovimentVertical],
        mobiles: [{
            nom: 'Càmera',
            phases: [{
                tipus: MovementType.MovimentVertical, isSolved: true, s_i: 40, v_i: 5, s_f: 0, a: G, t_i: 0,
                t: 3.41, t_f: 3.41, v_f: -28.4, delta_s: -40
            }]
        }],
        recommendedTime: 4,
        solution: "La càmera triga <strong>3.41 segons</strong> a arribar a terra. La seva velocitat inicial és la mateixa que la del globus (5 m/s cap amunt)."
    }
];
