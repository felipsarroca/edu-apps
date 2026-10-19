/* ============================================================
   detectiu.js — MÒDUL TRANSVERSAL · Detectiu d'errors
   Es mostra una resolució; cal assenyalar el pas incorrecte
   (o certificar que tot és correcte!), justificar-ho i llegir
   la reparació. Després: un cas anàleg per comprovar l'aprenentatge.
   ============================================================ */
(function (global) {
  'use strict';
  const L = global.L;
  const F = L.fmt, UI = L.UI;

  /* ---------- banc de casos ---------- */
  const CASES = [
    {
      id: 'un-membre', theme: 'primer grau',
      title: 'La resta que només toca un costat',
      intro: 'Algú intenta resoldre aquesta equació:',
      steps: [
        { m: '3x + 4 = 10', n: 'enunciat' },
        { m: '3x + 4 ' + F.MIN + ' 4 = 10', n: '«resto 4 al membre esquerre»' },
        { m: '3x = 10', n: '«redueixo»' },
        { m: 'x = 10/3', n: '«divideixo entre 3»' }
      ],
      wrongIdx: 1,
      why: [
        { label: 'Ha restat 4 només al membre esquerre', correct: true },
        { label: 'No res: el pas és correcte', correct: false },
        { label: 'L\'error és haver restat en lloc de sumar', correct: false }
      ],
      feedback: 'Quan restes 4 a un membre i no a l\'altre, la igualtat <b>deixa de ser certa</b> per als valors que abans la feien certa: has canviat el problema.',
      repair: 'La reparació: restar 4 <b>als dos membres</b>: 3x + 4 ' + F.MIN + ' 4 = 10 ' + F.MIN + ' 4 → 3x = 6 → <b>x = 2</b>. Comprovació: 3·(2) + 4 = 10 ✓. Fixa\'t que 10/3 no ho passa: 3·(10/3) + 4 = 14 ≠ 10.',
    },
    {
      id: 'distr-mala', theme: 'primer grau',
      title: 'Una distributiva distreta',
      intro: 'Desenvolupament d\'un parèntesi:',
      steps: [
        { m: '2(x + 3) = 8', n: 'enunciat' },
        { m: '2x + 3 = 8', n: '«desenvolupo el parèntesi»' },
        { m: '2x = 5', n: '«resto 3»' },
        { m: 'x = 5/2', n: '«divideixo entre 2»' }
      ],
      wrongIdx: 1,
      why: [
        { label: 'El 2 multiplica també el 3, no només la x', correct: true },
        { label: 'El parèntesi no es pot desenvolupar', correct: false },
        { label: 'S\'ha d\'haver dividit entre 2 abans', correct: false }
      ],
      feedback: 'La propietat distributiva exigeix multiplicar <b>cada terme</b> del parèntesi: k·(x + m) = k·x + k·m. Aquí el 3 ha quedat sense multiplicar.',
      repair: 'Correcte seria: 2(x + 3) = 2x + 6 → 2x = 2 → <b>x = 1</b>. Comprovació: 2·(1 + 3) = 8 ✓ (mentre que 2·(5/2 + 3) = 11 ≠ 8).',
    },
    {
      id: 'mul-zero', theme: 'transformacions',
      title: 'L\'esborrat total',
      intro: 'Experiment perillós amb una equació ja resolta:',
      steps: [
        { m: '2x = 6', n: 'enunciat (solució x = 3)' },
        { m: '0 = 0', n: '«multiplico els dos membres per 0»' },
        { m: '«qualsevol valor de x compleix 0 = 0: tots els reals són solució»', n: 'conclusió' }
      ],
      wrongIdx: 1,
      why: [
        { label: 'Multiplicar per 0 no és una transformació reversible: destrueix les solucions', correct: true },
        { label: 'Està bé perquè ho ha fet als dos membres', correct: false },
        { label: 'L\'error és a la conclusió, no al pas 2', correct: false }
      ],
      feedback: 'Multiplicar per zero <b>esborra la informació</b>: de 2x = 6 (una solució) passen a 0 = 0 (infinites «solucions»). No es pot desfer: cap operació recupera l\'equació original.',
      repair: 'Regla: es pot multiplicar o dividir els dos membres per qualsevol nombre <b>diferent de zero</b>. La solució de 2x = 6 és <b>x = 3</b> i cap més.',
    },
    {
      id: 'div-x', theme: 'transformacions',
      title: 'Dividir per la incògnita',
      intro: 'Un clàssic que fa perdre solucions:',
      steps: [
        { m: 'x² = x', n: 'enunciat' },
        { m: 'x = 1', n: '«divideixo els dos membres entre x»' },
        { m: '«única solució: x = 1»', n: 'conclusió' }
      ],
      wrongIdx: 1,
      why: [
        { label: 'Si x = 0, s\'està dividint entre 0: la solució x = 0 s\'ha esvaït', correct: true },
        { label: 'Està bé: dividir entre x és com dividir entre un nombre', correct: false },
        { label: 'L\'error és que x² = x no té solució', correct: false }
      ],
      feedback: 'En dividir entre <b>x</b> s\'assumeix que x ≠ 0. Però x = 0 <b>és</b> solució de l\'original! S\'ha perdut sense avís.',
      repair: 'Forma segura: passa tot a un membre i factoritza: x² ' + F.MIN + ' x = 0 → x(x ' + F.MIN + ' 1) = 0 → <b>x = 0 o x = 1</b> (dues solucions). Si es divideix per una expressió amb la incògnita, cal estudiar abans si pot valer zero.',
    },
    {
      id: 'ineq-noflip', theme: 'inequacions',
      title: 'El signe que no es va girar',
      intro: 'Resolució d\'una inequació:',
      steps: [
        { m: F.MIN + '2x + 3 > 7', n: 'enunciat' },
        { m: F.MIN + '2x > 4', n: '«resto 3 als dos membres»' },
        { m: 'x > ' + F.MIN + '2', n: '«divideixo entre ' + F.MIN + '2»' },
        { m: '«solució: tots els x més grans que ' + F.MIN + '2»', n: 'conclusió' }
      ],
      wrongIdx: 2,
      why: [
        { label: 'En dividir per un negatiu, el sentit de la desigualtat s\'ha d\'invertir', correct: true },
        { label: 'Dividir mai no canvia el sentit', correct: false },
        { label: 'L\'error és al pas 1, en restar 3', correct: false }
      ],
      feedback: 'Al dividir entre <b>' + F.MIN + '2</b> el sentit s\'ha d\'invertir. Sense la inversió, «solució» i realitat no coincideixen: prova x = 0 amb l\'original (3 &gt; 7? No!).',
      repair: 'Correcte: ' + F.MIN + '2x &gt; 4 → <b>x &lt; ' + F.MIN + '2</b> (signe invertit!). Comprovació amb x = ' + F.MIN + '3: ' + F.MIN + '2·(' + F.MIN + '3) + 3 = 9 &gt; 7 ✓.',
    },
    {
      id: 'ineq-ok', theme: 'inequacions',
      title: 'Tot en ordre (vigila!)',
      intro: 'Aquesta resolució... revisa-la amb cura abans d\'acusar ningú:',
      steps: [
        { m: '2x ' + F.MIN + ' 1 ≤ 5', n: 'enunciat' },
        { m: '2x ≤ 6', n: '«sumo 1 als dos membres»' },
        { m: 'x ≤ 3', n: '«divideixo entre 2 (positiu: el sentit es manté)»' }
      ],
      wrongIdx: -1,
      why: [
        { label: 'Tot és correcte: sumar i dividir per un positiu conserva el sentit', correct: true },
        { label: 'El pas 2 està malament perquè no ha canviat el sentit', correct: false },
        { label: 'Falta comprovar el valor frontera', correct: false }
      ],
      feedback: 'Molt bé per no haver caigut a la trampa: sumar el mateix als dos membres i dividir per un <b>positiu</b> són transformacions equivalents també per a inequacions.',
      repair: 'La solució és <b>x ≤ 3</b>, amb extrem <b>tancat</b> (cercle ple a la recta). Comprovació: x = 3 dóna 2·3 ' + F.MIN + ' 1 = 5 ≤ 5 ✓.',
    },
    {
      id: 'q-noroot', theme: 'segon grau',
      title: 'L\'arrel que no existia',
      intro: 'Estudi d\'una quadràtica:',
      steps: [
        { m: 'x² + x + 1 = 0', n: 'enunciat' },
        { m: 'Δ = 1² ' + F.MIN + ' 4·1·1 = ' + F.MIN + '3', n: '«calculo el discriminant»' },
        { m: '«Δ &lt; 0, però tota equació de segon grau té dues arrels: x₁ ≈ ' + F.MIN + '0,5 i x₂ ≈ ' + F.MIN + '0,5»', n: 'conclusió' }
      ],
      wrongIdx: 2,
      why: [
        { label: 'Amb Δ &lt; 0 no hi cap arrel real: √Δ no existeix en els reals', correct: true },
        { label: 'El Δ està mal calculat', correct: false },
        { label: 'Les arrels són correctes perquè la fórmula general sempre funciona', correct: false }
      ],
      feedback: 'Quan Δ &lt; 0, la paràbola <b>no toca l\'eix X</b> i no hi ha cap valor real que anul·li el primer membre. La fórmula general exigiria √(' + F.MIN + '3): impossible en els reals.',
      repair: 'Conclusió correcta: <b>cap arrel real</b> (en els nombres complexes n\'hi ha dues, però això és un altre món). Es diu «cap arrel <b>real</b>», no «cap solució» sense precisar el domini.',
    },
    {
      id: 'q-menysb', theme: 'segon grau',
      title: 'El signe del −b',
      intro: 'Arrel doble, fórmula general:',
      steps: [
        { m: 'x² ' + F.MIN + ' 4x + 4 = 0', n: 'enunciat' },
        { m: 'Δ = (−4)² ' + F.MIN + ' 4·1·4 = 16 ' + F.MIN + ' 16 = 0', n: '«arrel doble»' },
        { m: 'x = b/2a = ' + F.MIN + '4/2 = ' + F.MIN + '2', n: '«aplico la fórmula amb Δ = 0»' },
        { m: '«solució: x = ' + F.MIN + '2»', n: 'conclusió' }
      ],
      wrongIdx: 2,
      why: [
        { label: 'És x = −b/2a: el signe del coeficient b es canvia', correct: true },
        { label: 'La fórmula és b/2a, tal com està escrit', correct: false },
        { label: 'L\'error és al pas 1: Δ no és 0', correct: false }
      ],
      feedback: 'Amb Δ = 0 l\'arrel és <b>x = ' + F.MIN + 'b/(2a)</b>: el signe de b s\'inverteix. Aquí b = ' + F.MIN + '4, o sigui ' + F.MIN + 'b = 4.',
      repair: 'Correcte: x = ' + F.MIN + '(' + F.MIN + '4)/(2·1) = 4/2 = <b>2</b>. Comprovació: (2)² ' + F.MIN + ' 4·(2) + 4 = 4 ' + F.MIN + ' 8 + 4 = 0 ✓. (Amb x = ' + F.MIN + '2 quedaria 4 + 8 + 4 = 16 ≠ 0.)',
    },
    {
      id: 'sys-paral', theme: 'sistemes',
      title: 'Bessones o paral·leles?',
      intro: 'Classificació d\'un sistema:',
      steps: [
        { m: '① 2x + y = 3 &nbsp;&nbsp; ② 4x + 2y = 6', n: 'enunciat' },
        { m: '«multiplico ① per 2: 4x + 2y = 6»', n: 'transformació' },
        { m: '«les dues equacions tenen els coeficients iguals: les rectes són paral·leles»', n: 'classificació' },
        { m: '«el sistema no té cap solució»', n: 'conclusió' }
      ],
      wrongIdx: 2,
      why: [
        { label: 'Són coincidents (la mateixa recta): infinites solucions', correct: true },
        { label: 'És cert: coeficients iguals vol dir paral·leles', correct: false },
        { label: 'L\'error és haver multiplicat l\'equació per 2', correct: false }
      ],
      feedback: 'Coeficients <b>proporcionals, constants incloses</b> = la mateixa recta escrita dues vegades. Paral·leles seria si els coeficients quadressin però les constants no (4x + 2y = 7).',
      repair: 'Aquí ② = 2·① exactament: <b>sistema compatible indeterminat</b>, infinites solucions (tots els punts de la recta 2x + y = 3). Det = 0 i rangs iguals: l\'àlgebra ho confirma.',
    },
    {
      id: 'sys-swap', theme: 'sistemes',
      title: 'La parella desordenada',
      intro: 'Resolució d\'un sistema per igualació:',
      steps: [
        { m: '① y = 2x + 1 &nbsp;&nbsp; ② y = ' + F.MIN + 'x + 4', n: 'enunciat' },
        { m: '2x + 1 = ' + F.MIN + 'x + 4', n: '«igualo les dues expressions de y»' },
        { m: '3x = 3 → x = 1', n: '«resolc»' },
        { m: 'y = 2·(1) + 1 = 3. «Solució: (3, 1)»', n: 'conclusió' }
      ],
      wrongIdx: 3,
      why: [
        { label: 'La parella està invertida: la solució és (1, 3), no (3, 1)', correct: true },
        { label: 'El valor de y està mal calculat', correct: false },
        { label: 'El valor de x està mal calculat', correct: false }
      ],
      feedback: 'Els dos valors són correctes però <b>col·locats al revés</b>: la parella és ordenada, primer x i després y. Comprovem-ho i es veu de seguida.',
      repair: '<b>(1, 3)</b>: eq ① 2·(1) + 1 = 3 ✓ i eq ② ' + F.MIN + '(1) + 4 = 3 ✓. En canvi (3, 1): 2·(3) + 1 = 7 ≠ 1 ✗. Comprovar <b>en les dues equacions</b> evita aquest creuament (i molts altres!).',
    },
    {
      id: 'bq-tneg', theme: 'biquadrades',
      title: 'El t negatiu que es va colar',
      intro: 'Biquadrada amb canvi de variable:',
      steps: [
        { m: 'x⁴ ' + F.MIN + ' 3x² ' + F.MIN + ' 4 = 0', n: 'enunciat' },
        { m: 'amb t = x²: t² ' + F.MIN + ' 3t ' + F.MIN + ' 4 = 0 → t = 4 o t = ' + F.MIN + '1', n: '«equació auxiliar»' },
        { m: '«de t = 4 surt x = ±2; de t = ' + F.MIN + '1 surt x = ±1»', n: '«recupero x»' },
        { m: '«solucions: x = ' + F.MIN + '2, ' + F.MIN + '1, 1, 2»', n: 'conclusió' }
      ],
      wrongIdx: 2,
      why: [
        { label: 't = −1 és impossible: cap x real compleix x² = −1', correct: true },
        { label: 'Tot correcte: cada t dona dues arrels', correct: false },
        { label: 'L\'error és a l\'equació auxiliar del pas 2', correct: false }
      ],
      feedback: 'Un quadrat <b>mai no és negatiu</b>: t = ' + F.MIN + '1 s\'ha de <b>descartar</b>. Acceptar-lo fabrica arrels falses que no compleixen l\'original.',
      repair: 'Correcte: només t = 4 és admissible → <b>x = ±2</b>. Comprovació de la falsa: (' + F.MIN + '1)⁴ ' + F.MIN + ' 3·(' + F.MIN + '1)² ' + F.MIN + ' 4 = 1 ' + F.MIN + ' 3 ' + F.MIN + ' 4 = ' + F.MIN + '6 ≠ 0. I de la bona: 16 ' + F.MIN + ' 12 ' + F.MIN + ' 4 = 0 ✓.',
    },
    {
      id: 'bq-pm', theme: 'biquadrades',
      title: 'Meitat de les arrels',
      intro: 'Una biquadrada senzilla:',
      steps: [
        { m: 'x⁴ ' + F.MIN + ' 5x² + 4 = 0', n: 'enunciat' },
        { m: 't² ' + F.MIN + ' 5t + 4 = 0 → t = 1 o t = 4', n: '«equació auxiliar»' },
        { m: '«de t = 1: x = ±1»', n: '«recupero x (primera part)»' },
        { m: '«de t = 4: x = 2»', n: '«recupero x (segona part)»' },
        { m: '«solucions: x = ' + F.MIN + '1, 1, 2»', n: 'conclusió' }
      ],
      wrongIdx: 3,
      why: [
        { label: 'De t = 4 surten dues arrels: x = 2 i x = −2 (el ±!)', correct: true },
        { label: 'De t = 4 només surt l\'arrel positiva', correct: false },
        { label: 't = 4 s\'hauria de descartar per ser parell', correct: false }
      ],
      feedback: 'Quan <b>t &gt; 0</b>, l\'equació x² = t té <b>dues</b> solucions oposades. Oblidar el signe menys és l\'error més típic de les biquadrades.',
      repair: 'Les solucions completes: <b>x = ' + F.MIN + '2, ' + F.MIN + '1, 1, 2</b> (quatre). Comprovació de l\'oblidada: (' + F.MIN + '2)⁴ ' + F.MIN + ' 5·(' + F.MIN + '2)² + 4 = 16 ' + F.MIN + ' 20 + 4 = 0 ✓.',
    }
  ];

  /* ---------- «Repara-ho tu»: l'alumne escriu el resultat correcte ----------
     list: valors (en qualsevol ordre) · ineq: desigualtat · pair: parella (x, y) · choice: opcions */
  const FIX = {
    'un-membre': { kind: 'list', prompt: 'Quina és la solució correcta de 3x + 4 = 10?', values: [2] },
    'distr-mala': { kind: 'list', prompt: 'Quina és la solució correcta de 2(x + 3) = 8?', values: [1] },
    'mul-zero': { kind: 'list', prompt: 'Quina és la solució de 2x = 6?', values: [3] },
    'div-x': { kind: 'list', prompt: 'Escriu totes les solucions de x² = x, separades per comes.', values: [0, 1] },
    'ineq-noflip': { kind: 'ineq', prompt: 'Escriu la solució correcta de −2x + 3 > 7 (per exemple, x < 5).', sign: '<', bound: -2 },
    'q-noroot': { kind: 'choice', prompt: 'Quantes arrels reals té x² + x + 1 = 0?', options: ['Cap', 'Una', 'Dues'], correct: 0 },
    'q-menysb': { kind: 'list', prompt: 'Quina és la solució correcta de x² − 4x + 4 = 0?', values: [2] },
    'sys-paral': { kind: 'choice', prompt: 'Quantes solucions té el sistema?', options: ['Cap', 'Una', 'Infinites'], correct: 2 },
    'sys-swap': { kind: 'pair', prompt: 'Escriu la solució correcta (x, y).', x: 1, y: 3 },
    'bq-tneg': { kind: 'list', prompt: 'Escriu totes les solucions reals, separades per comes.', values: [-2, 2] },
    'bq-pm': { kind: 'list', prompt: 'Escriu totes les solucions, separades per comes.', values: [-2, -1, 1, 2] }
  };
  /* ---------- casos bessons: el mateix error amb altres nombres (per comprovar la transferència) ---------- */
  const M = F.MIN;
  const TWIN = {
    'un-membre': {
      title: 'La suma que només toca un costat', intro: 'Un altre intent, amb altres nombres:',
      steps: [{ m: '5x ' + M + ' 2 = 13', n: 'enunciat' }, { m: '5x ' + M + ' 2 + 2 = 13', n: '«sumo 2 al membre esquerre»' }, { m: '5x = 13', n: '«redueixo»' }, { m: 'x = 13/5', n: '«divideixo entre 5»' }],
      wrongIdx: 1,
      why: [{ label: 'Ha sumat 2 només al membre esquerre', correct: true }, { label: 'Havia de restar 2, no sumar-lo', correct: false }, { label: 'L\'error és a l\'última divisió', correct: false }],
      feedback: 'El mateix error d\'abans: l\'operació s\'ha de fer <b>als dos membres</b>.',
      repair: '5x ' + M + ' 2 + 2 = 13 + 2 → 5x = 15 → <b>x = 3</b>. Comprovació: 5·3 ' + M + ' 2 = 13 ✓.',
      fix: { kind: 'list', prompt: 'Quina és la solució correcta de 5x − 2 = 13?', values: [3] }
    },
    'distr-mala': {
      title: 'Una altra distributiva distreta', intro: 'Mira aquest parèntesi:',
      steps: [{ m: '3(x ' + M + ' 2) = 9', n: 'enunciat' }, { m: '3x ' + M + ' 2 = 9', n: '«desenvolupo el parèntesi»' }, { m: '3x = 11', n: '«sumo 2»' }, { m: 'x = 11/3', n: '«divideixo entre 3»' }],
      wrongIdx: 1,
      why: [{ label: 'El 3 també multiplica el −2: queda 3x − 6', correct: true }, { label: 'El parèntesi no es pot desenvolupar', correct: false }, { label: 'L\'error és sumar 2', correct: false }],
      feedback: 'El factor de fora multiplica <b>cada terme</b> del parèntesi, també el negatiu.',
      repair: '3(x ' + M + ' 2) = 3x ' + M + ' 6 → 3x = 15 → <b>x = 5</b>. Comprovació: 3·(5 ' + M + ' 2) = 9 ✓.',
      fix: { kind: 'list', prompt: 'Quina és la solució correcta de 3(x − 2) = 9?', values: [5] }
    },
    'mul-zero': {
      title: 'Un altre esborrat total', intro: 'Una altra equació resolta i un experiment perillós:',
      steps: [{ m: '5x = 10', n: 'enunciat' }, { m: '0 = 0', n: '«multiplico els dos membres per 0»' }, { m: '«tots els reals són solució»', n: 'conclusió' }],
      wrongIdx: 1,
      why: [{ label: 'Multiplicar per 0 esborra les solucions: no és reversible', correct: true }, { label: 'Està bé perquè s\'ha fet als dos membres', correct: false }, { label: 'L\'error és a la conclusió', correct: false }],
      feedback: 'Multiplicar per zero no es pot desfer: es perd tota la informació de l\'equació.',
      repair: 'La solució de 5x = 10 és <b>x = 2</b> i cap més.',
      fix: { kind: 'list', prompt: 'Quina és la solució de 5x = 10?', values: [2] }
    },
    'div-x': {
      title: 'Dividir per la incògnita, un altre cop', intro: 'Una altra equació amb x²:',
      steps: [{ m: 'x² = 3x', n: 'enunciat' }, { m: 'x = 3', n: '«divideixo els dos membres entre x»' }, { m: '«única solució: x = 3»', n: 'conclusió' }],
      wrongIdx: 1,
      why: [{ label: 'Si x = 0, divideix entre 0: es perd la solució x = 0', correct: true }, { label: 'Està bé: x és un nombre com qualsevol altre', correct: false }, { label: 'x² = 3x no té solució', correct: false }],
      feedback: 'Dividir entre x suposa que x ≠ 0, però x = 0 també és solució.',
      repair: 'x² ' + M + ' 3x = 0 → x(x ' + M + ' 3) = 0 → <b>x = 0 o x = 3</b>.',
      fix: { kind: 'list', prompt: 'Escriu totes les solucions de x² = 3x, separades per comes.', values: [0, 3] }
    },
    'ineq-noflip': {
      title: 'Un altre signe sense girar', intro: 'Una altra inequació:',
      steps: [{ m: M + '3x ' + M + ' 1 ≤ 8', n: 'enunciat' }, { m: M + '3x ≤ 9', n: '«sumo 1 als dos membres»' }, { m: 'x ≤ ' + M + '3', n: '«divideixo entre ' + M + '3»' }],
      wrongIdx: 2,
      why: [{ label: 'En dividir per −3, el sentit s\'havia d\'invertir', correct: true }, { label: 'Sumar 1 havia de girar el signe', correct: false }, { label: 'Tot és correcte', correct: false }],
      feedback: 'Dividir per un <b>negatiu</b> inverteix el sentit: ≤ passa a ≥.',
      repair: M + '3x ≤ 9 → <b>x ≥ ' + M + '3</b>. Comprovació amb x = 0: ' + M + '1 ≤ 8 ✓.',
      fix: { kind: 'ineq', prompt: 'Escriu la solució correcta de −3x − 1 ≤ 8.', sign: '>=', bound: -3 }
    },
    'ineq-ok': {
      title: 'Tot en ordre, un altre cop?', intro: 'Revisa-la amb cura:',
      steps: [{ m: M + 'x + 2 < 5', n: 'enunciat' }, { m: M + 'x < 3', n: '«resto 2 als dos membres»' }, { m: 'x > ' + M + '3', n: '«divideixo entre ' + M + '1 i giro el signe»' }],
      wrongIdx: -1,
      why: [{ label: 'Tot és correcte: ha girat el signe en dividir per −1', correct: true }, { label: 'No s\'havia de girar el signe', correct: false }, { label: 'L\'error és restar 2', correct: false }],
      feedback: 'Correcte: en dividir per −1 el sentit s\'inverteix, i això és el que s\'ha fet.',
      repair: 'La solució és <b>x &gt; ' + M + '3</b>. Comprovació amb x = 0: 2 &lt; 5 ✓.'
    },
    'q-noroot': {
      title: 'Una altra arrel que no existeix', intro: 'Una altra quadràtica:',
      steps: [{ m: 'x² ' + M + ' 2x + 5 = 0', n: 'enunciat' }, { m: 'Δ = 4 ' + M + ' 20 = ' + M + '16', n: '«calculo el discriminant»' }, { m: '«faig √16 = 4: x = (2 ± 4)/2, és a dir, x = 3 o x = ' + M + '1»', n: 'conclusió' }],
      wrongIdx: 2,
      why: [{ label: 'Amb Δ < 0 no hi ha arrels reals: s\'ha canviat el signe de Δ', correct: true }, { label: 'El Δ està mal calculat', correct: false }, { label: 'Tot és correcte', correct: false }],
      feedback: '√(' + M + '16) no existeix en els reals. No es pot canviar el signe de Δ per poder fer l\'arrel.',
      repair: 'Δ &lt; 0 → <b>cap arrel real</b>. Comprovació: amb x = 3, 9 ' + M + ' 6 + 5 = 8 ≠ 0.',
      fix: { kind: 'choice', prompt: 'Quantes arrels reals té x² − 2x + 5 = 0?', options: ['Cap', 'Una', 'Dues'], correct: 0 }
    },
    'q-menysb': {
      title: 'Un altre −b oblidat', intro: 'Una altra arrel doble:',
      steps: [{ m: 'x² + 6x + 9 = 0', n: 'enunciat' }, { m: 'Δ = 36 ' + M + ' 36 = 0', n: '«arrel doble»' }, { m: 'x = b/2a = 6/2 = 3', n: '«aplico la fórmula»' }],
      wrongIdx: 2,
      why: [{ label: 'És x = −b/2a: el signe de b canvia', correct: true }, { label: 'Δ no és 0', correct: false }, { label: 'Tot és correcte', correct: false }],
      feedback: 'L\'arrel doble és <b>' + M + 'b/(2a)</b>: aquí ' + M + '6/2.',
      repair: 'x = ' + M + '6/2 = <b>' + M + '3</b>. Comprovació: 9 ' + M + ' 18 + 9 = 0 ✓.',
      fix: { kind: 'list', prompt: 'Quina és la solució de x² + 6x + 9 = 0?', values: [-3] }
    },
    'sys-paral': {
      title: 'Bessones o paral·leles, un altre cop?', intro: 'Classifica aquest sistema:',
      steps: [{ m: '① x ' + M + ' y = 2 &nbsp;&nbsp; ② 3x ' + M + ' 3y = 6', n: 'enunciat' }, { m: '«multiplico ① per 3: 3x ' + M + ' 3y = 6»', n: 'transformació' }, { m: '«els coeficients són proporcionals: rectes paral·leles, cap solució»', n: 'classificació' }],
      wrongIdx: 2,
      why: [{ label: 'També les constants són proporcionals: és la mateixa recta', correct: true }, { label: 'És correcte: proporcionals vol dir paral·leles', correct: false }, { label: 'No es pot multiplicar ① per 3', correct: false }],
      feedback: 'Si ② és exactament ① multiplicada per 3, <b>constant inclosa</b>, és la mateixa recta.',
      repair: 'Sistema compatible indeterminat: <b>infinites solucions</b>, tots els punts de x ' + M + ' y = 2.',
      fix: { kind: 'choice', prompt: 'Quantes solucions té aquest sistema?', options: ['Cap', 'Una', 'Infinites'], correct: 2 }
    },
    'sys-swap': {
      title: 'Una altra parella desordenada', intro: 'Un altre sistema per igualació:',
      steps: [{ m: '① y = x + 2 &nbsp;&nbsp; ② y = ' + M + '2x + 8', n: 'enunciat' }, { m: 'x + 2 = ' + M + '2x + 8', n: '«igualo»' }, { m: '3x = 6 → x = 2', n: '«resolc»' }, { m: 'y = 2 + 2 = 4. «Solució: (4, 2)»', n: 'conclusió' }],
      wrongIdx: 3,
      why: [{ label: 'La parella està invertida: és (2, 4)', correct: true }, { label: 'La y està mal calculada', correct: false }, { label: 'La x està mal calculada', correct: false }],
      feedback: 'Primer va la x i després la y.',
      repair: '<b>(2, 4)</b>: ① 2 + 2 = 4 ✓ i ② ' + M + '4 + 8 = 4 ✓.',
      fix: { kind: 'pair', prompt: 'Escriu la solució correcta (x, y).', x: 2, y: 4 }
    },
    'bq-tneg': {
      title: 'Un altre t negatiu colat', intro: 'Una altra biquadrada:',
      steps: [{ m: 'x⁴ ' + M + ' 8x² ' + M + ' 9 = 0', n: 'enunciat' }, { m: 't² ' + M + ' 8t ' + M + ' 9 = 0 → t = 9 o t = ' + M + '1', n: '«equació auxiliar»' }, { m: '«de t = 9 surt x = ±3; de t = ' + M + '1 surt x = ±1»', n: '«recupero x»' }],
      wrongIdx: 2,
      why: [{ label: 't = −1 no dona cap x real: x² no pot ser negatiu', correct: true }, { label: 'Cada t dona dues arrels', correct: false }, { label: 'L\'auxiliar està mal resolta', correct: false }],
      feedback: 'Els t negatius s\'han de <b>descartar</b>.',
      repair: 'Només t = 9 → <b>x = ±3</b>.',
      fix: { kind: 'list', prompt: 'Escriu totes les solucions reals, separades per comes.', values: [-3, 3] }
    },
    'bq-pm': {
      title: 'Una altra meitat d\'arrels', intro: 'Una altra biquadrada:',
      steps: [{ m: 'x⁴ ' + M + ' 10x² + 9 = 0', n: 'enunciat' }, { m: 't = 1 o t = 9', n: '«equació auxiliar»' }, { m: '«de t = 1: x = ±1»', n: '«recupero x»' }, { m: '«de t = 9: x = 3»', n: '«recupero x»' }],
      wrongIdx: 3,
      why: [{ label: 'De t = 9 surten dues arrels: 3 i −3', correct: true }, { label: 'De t = 9 només surt la positiva', correct: false }, { label: 't = 9 s\'ha de descartar', correct: false }],
      feedback: 'Cada t positiu dona <b>dues</b> arrels oposades.',
      repair: '<b>x = ' + M + '3, ' + M + '1, 1, 3</b>.',
      fix: { kind: 'list', prompt: 'Escriu totes les solucions, separades per comes.', values: [-3, -1, 1, 3] }
    }
  };
  CASES.forEach(c => { c.fix = FIX[c.id]; if (TWIN[c.id]) c.twin = Object.assign({ id: c.id + '-b', theme: c.theme }, TWIN[c.id]); });

  function render(main, params) {
    const st = { idx: 0, phase: 'find', wrongClicks: 0, done: new Set(), first: new Set(), twin: false, twinsDone: new Set(), fixFails: 0 };
    const caseNow = () => st.twin ? CASES[st.idx].twin : CASES[st.idx];

    main.innerHTML =
      '<div class="detectiu-wrap"><div class="detectiu-inner">' +
      '<div class="det-progress" id="det-prog"></div>' +
      '<div class="card det-case" id="det-case"></div>' +
      '</div></div>';

    const el = (id) => main.querySelector('#' + id);

    function renderProgress() {
      const prog = el('det-prog');
      const dots = CASES.map((c, i) =>
        '<button class="det-dot' + (st.done.has(c.id) ? ' done' : i === st.idx ? ' current' : '') +
        '" data-i="' + i + '" title="' + caseLabel(c, i) + '" aria-label="' + caseLabel(c, i) + '"></button>').join('');
      prog.innerHTML =
        '<span class="det-dots" role="group" aria-label="Progrés dels casos">' + dots + '</span>' +
        '<span class="help-note"><b id="det-count"></b></span>' +
        '<span class="spacer" style="flex:1"></span>' +
        '<button class="btn ghost small" id="det-next">' + UI.icon('arrows') + 'Següent cas</button>';
      el('det-count').textContent = 'Cas ' + (st.idx + 1) + ' de ' + CASES.length + ' · ' + st.done.size + ' resolts';
      prog.querySelectorAll('.det-dot').forEach(d =>
        d.addEventListener('click', () => { st.idx = +d.dataset.i; st.twin = false; st.phase = 'find'; st.wrongClicks = 0; renderCase(); renderProgress(); }));
      prog.querySelector('#det-next').addEventListener('click', () => {
        st.idx = (st.idx + 1) % CASES.length; st.twin = false; st.phase = 'find'; st.wrongClicks = 0; renderCase(); renderProgress();
      });
    }

    function renderCase() {
      const c = caseNow();
      const box = el('det-case');
      st.fixFails = 0;
      const solved = st.twin ? st.twinsDone.has(c.id) : st.done.has(c.id);
      box.innerHTML =
        '<div class="card-title">' + UI.icon('magnifier') + 'Detectiu d\'errors</div>' +
        '<div class="det-theme">' + c.theme + (st.twin ? ' · cas semblant' : '') + '</div>' +
        // el títol del cas diu on és l'error: només es mostra un cop resolt
        '<h2 id="det-title" style="font-size:1.12rem;margin:4px 0 2px;color:var(--navy-deep)">' + (solved ? c.title : (st.twin ? 'Cas semblant: ' : 'Cas ' + (st.idx + 1) + ': ') + 'on és l\'error?') + '</h2>' +
        '<p style="font-size:.9rem;color:var(--ink-soft)">' + c.intro + '</p>' +
        '<div class="det-steps" id="det-steps"></div>' +
        '<div class="det-ask" id="det-ask"></div>' +
        '<div id="det-extra"></div>';
      const stepsBox = box.querySelector('#det-steps');
      c.steps.forEach((s, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'det-step';
        b.innerHTML = '<span class="math">' + s.m + '</span>' +
          (s.n ? '<div class="ds-note">' + s.n + '</div>' : '');
        b.setAttribute('aria-label', 'Pas ' + (i + 1) + '. Fes-hi clic si creus que és incorrecte.');
        b.addEventListener('click', () => onStepClick(i, b));
        stepsBox.appendChild(b);
      });
      const ask = box.querySelector('#det-ask');
      ask.innerHTML =
        '<span class="da-note">Fes clic al pas <b>incorrecte</b>... o certifica que tot és correcte:</span>' +
        '<button class="btn soft small" id="det-allok">' + UI.icon('check') + 'Tot és correcte</button>';
      ask.querySelector('#det-allok').addEventListener('click', () => {
        if (st.phase !== 'find') return;
        if (c.wrongIdx === -1) {
          st.phase = 'justify';
          markStep(0, 'fixed-ok');
          justify();
        } else {
          st.wrongClicks++;
          showFeedback('bad', 'N\'hi ha un de dolent!', 'No exactament: aquesta resolució <b>sí</b> té un pas incorrecte. Rellegeix cada pas amb malfiança i torna-ho a provar.');
        }
      });
      st.phase = 'find';
    }

    function markStep(i, cls) {
      const steps = el('det-case').querySelectorAll('.det-step');
      if (steps[i]) steps[i].classList.add(cls);
    }

    function showFeedback(kind, title, html) {
      const extra = el('det-extra');
      const div = document.createElement('div');
      div.className = 'det-feedback ' + kind;
      div.innerHTML = '<div class="df-title">' + (kind === 'good' ? UI.icon('check') : kind === 'bad' ? UI.icon('alert') : UI.icon('info')) + title + '</div>' + html;
      extra.innerHTML = '';
      extra.appendChild(div);
      div.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function onStepClick(i, btn) {
      const c = caseNow();
      if (st.phase !== 'find') return;
      if (i === c.wrongIdx) {
        btn.classList.add('marked');
        st.phase = 'justify';
        justify();
      } else {
        st.wrongClicks++;
        btn.classList.remove('fixed-ok'); void btn.offsetWidth;
        btn.classList.add('fixed-ok');
        showFeedback('info', 'Aquest pas és correcte', 'El pas ' + (i + 1) + ' està <b>bé</b>: les operacions que fa són legítimes. L\'error és a un altre lloc (o no n\'hi ha cap!). Torna-ho a mirar.');
      }
    }

    function justify() {
      const c = caseNow();
      const ask = el('det-ask');
      ask.innerHTML = '';
      const extra = el('det-extra');
      extra.innerHTML = '';
      const host = document.createElement('div');
      host.style.marginTop = '10px';
      extra.appendChild(host);
      // la justificació correcta no surt sempre al mateix lloc, i només hi ha un intent
      const card = UI.renderPrediction({
        question: c.wrongIdx === -1
          ? 'Molt bé! I ara, <b>per què</b> és correcta tota la resolució?'
          : 'Ben trobat! I ara, <b>per què</b> és incorrecte aquest pas?',
        shuffle: true,
        options: c.why.map(o => ({ label: o.label, correct: o.correct, why: '' })),
        continueLabel: c.fix ? 'Repara-ho tu ▸' : 'Llegeix la reparació ▸',
        onDone: (ok) => { if (!ok) st.wrongClicks++; if (c.fix) askFix(); else showRepair(); }
      });
      host.appendChild(card);
    }

    /* l'alumne escriu el resultat correcte abans de llegir la reparació */
    function askFix() {
      const c = caseNow(), f = c.fix;
      const extra = el('det-extra');
      let input;
      if (f.kind === 'choice') input = '<div class="pr-row">' + f.options.map((o, i) => '<button type="button" class="btn ghost small" data-o="' + i + '">' + o + '</button>').join('') + '</div>';
      else if (f.kind === 'pair') input = '<div class="pr-row"><span class="math">(</span><input class="input math" id="fx-x" style="width:80px" placeholder="x" aria-label="x"><span class="math">,</span>' +
        '<input class="input math" id="fx-y" style="width:80px" placeholder="y" aria-label="y"><span class="math">)</span><button class="btn primary small" id="fx-go">Comprova</button></div>';
      else input = '<div class="pr-row"><input class="input math" id="fx-in" style="width:220px" placeholder="' + (f.kind === 'ineq' ? 'p. ex. x ≥ 4' : 'p. ex. −2, 3') + '" aria-label="La teva resposta">' +
        '<button class="btn primary small" id="fx-go">Comprova</button></div>' +
        (f.kind === 'ineq' ? '<div class="help-note">Pots escriure &lt;, &gt;, &lt;= o &gt;= (també ≤ i ≥).</div>' : '');
      extra.innerHTML = '<div class="produce-card"><div class="pr-title">' + UI.icon('pencil') + 'Repara-ho tu</div>' +
        '<div>' + f.prompt + '</div>' + input + '<div class="pr-msg" id="fx-msg" aria-live="polite"></div></div>';
      const msg = extra.querySelector('#fx-msg');
      const done = (ok) => {
        if (ok) { showRepair(true); return; }
        st.fixFails++;
        msg.className = 'pr-msg bad';
        msg.innerHTML = 'Encara no. Comprova-ho substituint a l\'enunciat.' +
          (st.fixFails >= 2 ? ' <button class="btn ghost small" id="fx-show">Mostra la reparació</button>' : '');
        const sh = msg.querySelector('#fx-show');
        if (sh) sh.addEventListener('click', () => showRepair(false));
      };
      const val = (s) => L.R.cast(L.parseValue(s));
      if (f.kind === 'choice') {
        extra.querySelectorAll('[data-o]').forEach(b => b.addEventListener('click', () => done(+b.dataset.o === f.correct)));
        return;
      }
      const go = () => {
        try {
          if (f.kind === 'pair') done(val(extra.querySelector('#fx-x').value).eq(f.x) && val(extra.querySelector('#fx-y').value).eq(f.y));
          else if (f.kind === 'ineq') {
            const m = extra.querySelector('#fx-in').value.replace(/\s/g, '').replace('≤', '<=').replace('≥', '>=').match(/^x(<=|>=|<|>)(.+)$/);
            if (!m) throw new Error('Escriu-ho així: x < 5, x >= −2…');
            done(m[1] === f.sign && val(m[2]).eq(f.bound));
          } else {
            // «0, 1», «0; 1» o «0 i 1»: compara conjunts (qualsevol ordre)
            const got = extra.querySelector('#fx-in').value.split(/[;]|,(?!\d)|\si\s|\so\s/).map(s => s.trim()).filter(Boolean).map(val);
            const exp = f.values.map(v => L.R.cast(v));
            done(got.length === exp.length && exp.every(e => got.some(g => g.eq(e))));
          }
        } catch (e) { msg.className = 'pr-msg bad'; msg.textContent = e.message; }
      };
      extra.querySelector('#fx-go').addEventListener('click', go);
      extra.querySelectorAll('input').forEach(i => i.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); }));
      const first = extra.querySelector('input'); if (first) first.focus();
    }

    function showRepair(fixedByStudent) {
      const c = caseNow();
      const first = st.wrongClicks === 0 && fixedByStudent !== false;
      if (st.twin) st.twinsDone.add(c.id);
      else if (!st.done.has(c.id)) {
        st.done.add(c.id);
        L.App.markDone('detectiu', c.id);
        if (first) st.first.add(c.id);
      }
      el('det-title').textContent = c.title;
      const extra = el('det-extra');
      extra.innerHTML =
        '<div class="det-feedback good"><div class="df-title">' + UI.icon('check') +
        (st.twin ? 'Cas semblant resolt: ja saps reparar aquest error!' : 'Cas resolt!' + (first ? ' A la primera!' : '')) + '</div>' +
        (fixedByStudent ? '<b>L\'has reparat tu.</b> ' : '') + c.feedback + '</div>' +
        '<div class="det-repair"><b>Com es repara:</b> ' + c.repair + '</div>' +
        '<div class="btn-row" style="margin-top:12px">' +
        (!st.twin && c.twin ? '<button class="btn primary" id="det-analogy">' + UI.icon('arrows') + 'Prova un cas semblant ▸</button>' : '') +
        '<button class="btn ghost" id="det-next2">Següent cas ▸</button>' +
        '</div>';
      const a = extra.querySelector('#det-analogy');
      if (a) a.addEventListener('click', () => { st.twin = true; st.phase = 'find'; st.wrongClicks = 0; renderCase(); });
      extra.querySelector('#det-next2').addEventListener('click', () => {
        st.idx = (st.idx + 1) % CASES.length; st.twin = false; st.phase = 'find'; st.wrongClicks = 0;
        renderCase(); renderProgress(); checkAllDone();
      });
      renderProgress();
      checkAllDone();
    }

    function caseLabel(c, i) { // a la barra de progrés, el títol només dels casos resolts
      return 'Cas ' + (i + 1) + (st.done.has(c.id) ? ': ' + c.title : '');
    }

    function checkAllDone() {
      if (st.done.size < CASES.length) return;
      const extra = el('det-extra');
      if (extra.querySelector('.det-final')) return;
      const div = document.createElement('div');
      div.className = 'det-final card';
      div.style.marginTop = '6px';
      div.innerHTML =
        '<div class="card-title">' + UI.icon('check') + 'Tots els casos resolts!</div>' +
        '<p style="font-size:.92rem;color:var(--ink-soft)">Has tancat els ' + CASES.length + ' casos: ' + st.first.size + ' els has detectat <b>a la primera</b>. ' +
        'Això és el que fa un bon detectiu: abans de confiar en un resultat, <b>comprova\'l</b> substituint a l\'equació original.</p>' +
        '<div class="btn-row"><button class="btn ghost small" id="det-restart">' + UI.icon('refresh') + 'Torna a començar (barreja\'ls)</button></div>';
      extra.appendChild(div);
      div.querySelector('#det-restart').addEventListener('click', () => {
        shuffle(CASES); st.done.clear(); st.first.clear();
        st.idx = 0; st.twin = false; st.phase = 'find'; st.wrongClicks = 0;
        renderCase(); renderProgress();
        UI.toast('Casos barrejats: a jugar!', 'ok');
      });
    }

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    renderCase();
    renderProgress();
    return function cleanup() { };
  }

  function help() {
    UI.openModal({
      title: 'Detectiu d\'errors · Ajuda', wide: true, icon: UI.icon('help'),
      bodyHTML:
      '<p><b>Com es juga?</b> Es presenta una resolució amb passos. Un d\'ells pot contenir un error (o pot ser que tot sigui correcte!):</p>' +
      '<ol style="list-style:decimal;padding-left:22px;line-height:1.9">' +
      '<li><b>Clica</b> el pas que creus incorrecte, o prem «Tot és correcte».</li>' +
      '<li>Tria la <b>justificació</b> adequada d\'entre les opcions (només tens un intent).</li>' +
      '<li><b>Repara-ho tu:</b> escriu el resultat correcte.</li>' +
      '<li>Llegeix <b>com es repara</b> i prova un <b>cas semblant</b> amb el mateix error.</li></ol>' +

      '<p><b>Errors que caçaràs aquí:</b> operar a un sol membre, distributives distretes, multiplicar per zero, dividir per la incògnita, no invertir el signe d\'una inequació, creure que Δ &lt; 0 té arrels reals, confondre paral·leles amb coincidents, invertir la parella (x, y), acceptar t negatius i oblidar el ±√t.</p>' +
      '<p class="help-note"><b>El mètode del detectiu:</b> quan dubtis d\'un resultat, <b>substitueix</b> la solució a l\'equació original i calcula els dos membres. És la prova definitiva.</p>',
      footHTML: '<button class="btn primary" data-action="ok">Entesos</button>',
      actions: [{ id: 'ok', onClick: (m) => m.close() }]
    });
  }

  L.App.registerLab({
    key: 'detectiu', kind: 'detectiu', num: '?', short: 'Detectiu', goals: 12, goalName: 'casos', goalSuffix: ' resolts',
    title: 'Detectiu d\'errors', sub: 'Mòdul transversal · troba, justifica i repara',
    desc: 'Hi ha un pas equivocat. El trobes?',
    foot: 'L\'art de no deixar-se enganyar',
    iconHTML: '?',
    render, help
  });
})(typeof window !== 'undefined' ? window : globalThis);
