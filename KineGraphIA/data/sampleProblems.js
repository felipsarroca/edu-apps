export const SAMPLE_PROBLEMS = [
  {
    titol: 'Cotxes en MRU i MRUA',
    enunciat: 'Dos cotxes parteixen alhora. El primer surt del repòs i accelera 2 m/s². El segon porta velocitat constant de 10 m/s.',
    resposta: {
      mobils: [
        { nom: 'Cotxe A', tipus: 'MRUA', v0: 0, a: 2, s0: 0, t: 12 },
        { nom: 'Cotxe B', tipus: 'MRU', v0: 10, a: 0, s0: 0, t: 12 }
      ]
    }
  }
];

console.log('[sampleProblems.js] carregat');
