import type { VoyageId } from "../types";

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export const quizBank: Record<VoyageId, QuizQuestion[]> = {
  viatge1: [
    {
      prompt: "Quin era l'objectiu declarat del primer viatge?",
      options: [
        "Colonitzar Hispaniola amb nous assentaments",
        "Arribar a l'Àsia navegant cap a l'oest",
        "Trobar una ruta més curta cap a l'Àfrica",
      ],
      correctIndex: 1,
      rationale: "Colom volia arribar a l'Àsia navegant cap a l'oest per trobar noves rutes comercials.",
    },
    {
      prompt: "Què va passar amb la nau Santa Maria la nit de Nadal de 1492?",
      options: [
        "Va liderar el retorn triomfal a Espanya",
        "Va naufragar i se'n va fer un fort",
        "Va ser capturada pels portuguesos",
      ],
      correctIndex: 1,
      rationale: "La Santa Maria va embarrancar i Colom va aprofitar la fusta per construir el fort de la Nativitat.",
    },
    {
      prompt: "Qui va albirar terra la matinada del 12 d'octubre?",
      options: [
        "Cristòfor Colom",
        "Rodrigo de Triana",
        "Els germans Pinzón",
      ],
      correctIndex: 1,
      rationale: "El mariner Rodrigo de Triana va cridar 'Tierra!', tot i que no va cobrar la recompensa.",
    },
  ],
  viatge2: [
    {
      prompt: "Per què el segon viatge tenia un caràcter clarament colonitzador?",
      options: [
        "Només portava científics i cartògrafs",
        "Portava soldats, artesans, animals i eines",
        "Es va fer amb només tres caravel·les",
      ],
      correctIndex: 1,
      rationale: "La flota incloïa persones i recursos per fundar assentaments permanents.",
    },
    {
      prompt: "Què va trobar Colom quan va arribar al fort de la Nativitat?",
      options: [
        "Un assentament prosper i reforçat",
        "El fort destruït i els colons desapareguts",
        "Un nou port construït pels taínos",
      ],
      correctIndex: 1,
      rationale: "El fort havia estat arrasat i els espanyols del primer viatge havien mort o desaparegut.",
    },
    {
      prompt: "Quin sistema d'explotació es va iniciar durant el segon viatge?",
      options: [
        "La ruta del galeó de Manila",
        "El repartiment d'encomiendes sobre els taínos",
        "La introducció del comerç triangular",
      ],
      correctIndex: 1,
      rationale: "Colom va instaurar les encomiendes, sotmetent els taínos a treballs forçats.",
    },
  ],
  viatge3: [
    {
      prompt: "Quina novetat geogràfica va aportar el tercer viatge?",
      options: [
        "El descobriment de la costa sud-americana",
        "La primera travessa directa cap a Mèxic",
        "La circumval·lació de l'Àsia",
      ],
      correctIndex: 0,
      rationale: "Colom va explorar Trinitat i el delta de l'Orinoco, intuint que era un nou continent.",
    },
    {
      prompt: "Per què Colom va perdre el càrrec de governador a Hispaniola?",
      options: [
        "Perquè va voler tornar a Europa",
        "Per denúncies de tirania i mala gestió",
        "Perquè els Reis Catòlics van morir",
      ],
      correctIndex: 1,
      rationale: "Les denúncies de maltractaments i desordre van portar Bobadilla a empresonar-lo i destituir-lo.",
    },
    {
      prompt: "Què va fer Colom amb la flota en sortir de Sanlúcar el 1498?",
      options: [
        "Va navegar amb totes les naus cap al nord",
        "Va dividir la flota: tres naus cap a Hispaniola i tres cap al sud",
        "Va vendre dues naus per finançar-se",
      ],
      correctIndex: 1,
      rationale: "Va separar la flota per reforçar Hispaniola i explorar una ruta més meridional.",
    },
  ],
  viatge4: [
    {
      prompt: "Quin era l'objectiu del quart viatge?",
      options: [
        "Trobar un pas cap a l'Àsia a través de Centreamèrica",
        "Reconstruir La Isabela",
        "Fundar colònies a Florida",
      ],
      correctIndex: 0,
      rationale: "Colom volia localitzar un pas cap a l'oceà Índic vorejant Centreamèrica.",
    },
    {
      prompt: "Com va mantenir Colom l'autoritat mentre era encallat a Jamaica?",
      options: [
        "Mitjançant un eclipsi de lluna per impressionar els indígenes",
        "Amb reforços militars arribats de Cuba",
        "Subornant els caps locals amb or",
      ],
      correctIndex: 0,
      rationale: "Va aprofitar la predicció d'un eclipsi per convèncer els indígenes que Déu estava amb ell.",
    },
    {
      prompt: "Quin va ser el balanç final del quart viatge?",
      options: [
        "Descobriment del canal cap a l'oceà Índic",
        "Naufragis generalitzats i retorn malalt a Castella",
        "Conquesta de Tenochtitlan",
      ],
      correctIndex: 1,
      rationale: "Les quatre caravel·les van naufragar i Colom va tornar derrotat i malalt el 1504.",
    },
  ],
};
