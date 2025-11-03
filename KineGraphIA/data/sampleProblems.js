export const SAMPLE_PROBLEMS = [
  {
    titol: 'Cotxes en MRU i MRUA',
    enunciat:
      'Dos cotxes parteixen alhora. El primer surt del repos i accelera 2 m/s^2. El segon porta velocitat constant de 10 m/s.',
    resposta: {
      mobils: [
        { nom: 'Cotxe A', tipus: 'MRUA', v0: 0, a: 2, s0: 0, t: 12 },
        { nom: 'Cotxe B', tipus: 'MRU', v0: 10, a: 0, s0: 0, t: 12 }
      ]
    }
  },
  {
    titol: 'Trens que coincideixen',
    enunciat:
      'Un tren surt del repos amb acceleracio 1.5 m/s^2 durant 8 segons. Un altre tren circula a 12 m/s constants.',
    resposta: {
      mobils: [
        { nom: 'Tren A', tipus: 'MRUA', v0: 0, a: 1.5, s0: 0, t: 12 },
        { nom: 'Tren B', tipus: 'MRU', v0: 12, a: 0, s0: 0, t: 12 }
      ]
    }
  },
  {
    titol: 'Pilota en tir vertical',
    enunciat:
      'Llancem una pilota cap amunt amb velocitat inicial de 18 m/s des d una alcada inicial de 1.5 m.',
    resposta: {
      mobils: [
        { nom: 'Pilota', tipus: 'TIR_VERTICAL', v0: 18, s0: 1.5, g: 9.81, t: 6 }
      ]
    }
  }
];

console.log('[sampleProblems.js] carregat');
