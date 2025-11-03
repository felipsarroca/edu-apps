\u00ef\u00bb\u00bfexport const SAMPLE_PROBLEMS = [
  {
    titol: 'Cotxes en MRU i MRUA',
    enunciat: "Dos cotxes parteixen alhora. El primer surt del rep\u00F2s i accelera 2 m/s\u00B2. El segon mant\u00E9 una velocitat constant de 10 m/s.",
    resposta: {
      mobils: [
        { nom: 'Cotxe A', tipus: 'MRUA', v0: 0, a: 2, s0: 0, t: 14 },
        { nom: 'Cotxe B', tipus: 'MRU', v0: 10, a: 0, s0: 0, t: 14 }
      ]
    }
  },
  {
    titol: 'Trens que coincideixen',
    enunciat: "Un tren surt del rep\u00F2s amb acceleraci\u00F3 1,5 m/s\u00B2 durant 8 segons. Un altre tren circula a 12 m/s constants i es vol comparar el moviment durant 12 segons.",
    resposta: {
      mobils: [
        { nom: 'Tren A', tipus: 'MRUA', v0: 0, a: 1.5, s0: 0, t: 12 },
        { nom: 'Tren B', tipus: 'MRU', v0: 12, a: 0, s0: 0, t: 12 }
      ]
    }
  },
  {
    titol: 'Caiguda lliure de dues boles',
    enunciat: "Llancem dues boles des d'una torre de 20 metres. La primera la deixem caure des del rep\u00F2s. La segona la llencem cap avall amb velocitat inicial de 5 m/s. Compara-les durant 3 segons.",
    resposta: {
      mobils: [
        { nom: 'Bola 1', tipus: 'CAIGUDA', v0: 0, s0: 20, g: 9.81, t: 3 },
        { nom: 'Bola 2', tipus: 'CAIGUDA', v0: -5, s0: 20, g: 9.81, t: 3 }
      ]
    }
  },
  {
    titol: 'Pilota en tir vertical',
    enunciat: "Llancem una pilota cap amunt amb velocitat inicial de 18 m/s des d'una al\u00E7ada de 1,5 m. Analitzem els primers 6 segons.",
    resposta: {
      mobils: [
        { nom: 'Pilota', tipus: 'TIR_VERTICAL', v0: 18, s0: 1.5, g: 9.81, t: 6 }
      ]
    }
  },
  {
    titol: 'Triple duel de corredors',
    enunciat: "Tres atletes surten de la mateixa l\u00EDnia. El primer fa un MRU a 6 m/s, el segon accelera 0,8 m/s\u00B2 des del rep\u00F2s i el tercer surt amb 3 m/s i accelera 0,4 m/s\u00B2. Observa'ls durant 18 segons.",
    resposta: {
      mobils: [
        { nom: 'Corredor A', tipus: 'MRU', v0: 6, a: 0, s0: 0, t: 18 },
        { nom: 'Corredor B', tipus: 'MRUA', v0: 0, a: 0.8, s0: 0, t: 18 },
        { nom: 'Corredor C', tipus: 'MRUA', v0: 3, a: 0.4, s0: 0, t: 18 }
      ]
    }
  },
  {
    titol: 'Tir parab\u00F2lic de pilota',
    enunciat: "Una pilota es dispara amb velocitat inicial de 22 m/s amb un angle de 40\u00B0 respecte l'horitzontal. Analitza el moviment vertical durant 4,5 segons.",
    resposta: {
      mobils: [
        { nom: 'Pilota parab\u00F2lica', tipus: 'TIR_PARABOLIC', v0: 22, angle: 40, s0: 0, g: 9.81, t: 4.5 }
      ]
    }
  }
];

console.log('[sampleProblems.js] carregat');