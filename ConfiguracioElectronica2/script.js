// Aplicació: Configuració electrònica + Taula periòdica
// Llengua: Català

// Ordre d'emplenament (Aufbau): n i capacitats
const ORBITAL_ORDER = [
  { n: 1, l: 's', max: 2 },
  { n: 2, l: 's', max: 2 },
  { n: 2, l: 'p', max: 6 },
  { n: 3, l: 's', max: 2 },
  { n: 3, l: 'p', max: 6 },
  { n: 4, l: 's', max: 2 },
  { n: 3, l: 'd', max: 10 },
  { n: 4, l: 'p', max: 6 },
  { n: 5, l: 's', max: 2 },
  { n: 4, l: 'd', max: 10 },
  { n: 5, l: 'p', max: 6 },
  { n: 6, l: 's', max: 2 },
  { n: 4, l: 'f', max: 14 },
  { n: 5, l: 'd', max: 10 },
  { n: 6, l: 'p', max: 6 },
  { n: 7, l: 's', max: 2 },
  { n: 5, l: 'f', max: 14 },
  { n: 6, l: 'd', max: 10 },
  { n: 7, l: 'p', max: 6 },
];
const ORBITAL_PREFIX_SUMS = [];
let runningTotalElectrons = 0;
ORBITAL_ORDER.forEach((orb, index) => {
  ORBITAL_PREFIX_SUMS[index] = runningTotalElectrons;
  runningTotalElectrons += orb.max;
});
const MAX_ELECTRONS = runningTotalElectrons;

// Dades bàsiques de la taula periòdica: Z, símbol, període, grup, bloc
const ELEMENTS = [
  { Z:1,  s:'H',  period:1, group:1,  block:'s', name:'Hidrogen' },
  { Z:2,  s:'He', period:1, group:18, block:'s', name:'Heli' },
  { Z:3,  s:'Li', period:2, group:1,  block:'s', name:'Liti' },
  { Z:4,  s:'Be', period:2, group:2,  block:'s', name:'Beril·li' },
  { Z:5,  s:'B',  period:2, group:13, block:'p', name:'Bor' },
  { Z:6,  s:'C',  period:2, group:14, block:'p', name:'Carboni' },
  { Z:7,  s:'N',  period:2, group:15, block:'p', name:'Nitrogen' },
  { Z:8,  s:'O',  period:2, group:16, block:'p', name:'Oxigen' },
  { Z:9,  s:'F',  period:2, group:17, block:'p', name:'Fluor' },
  { Z:10, s:'Ne', period:2, group:18, block:'p', name:'Neó' },
  { Z:11, s:'Na', period:3, group:1,  block:'s', name:'Sodi' },
  { Z:12, s:'Mg', period:3, group:2,  block:'s', name:'Magnesi' },
  { Z:13, s:'Al', period:3, group:13, block:'p', name:'Alumini' },
  { Z:14, s:'Si', period:3, group:14, block:'p', name:'Silici' },
  { Z:15, s:'P',  period:3, group:15, block:'p', name:'Fòsfor' },
  { Z:16, s:'S',  period:3, group:16, block:'p', name:'Sofre' },
  { Z:17, s:'Cl', period:3, group:17, block:'p', name:'Clor' },
  { Z:18, s:'Ar', period:3, group:18, block:'p', name:'Argó' },
  { Z:19, s:'K',  period:4, group:1,  block:'s', name:'Potassi' },
  { Z:20, s:'Ca', period:4, group:2,  block:'s', name:'Calci' },
  { Z:21, s:'Sc', period:4, group:3,  block:'d', name:'Escandi' },
  { Z:22, s:'Ti', period:4, group:4,  block:'d', name:'Titani' },
  { Z:23, s:'V',  period:4, group:5,  block:'d', name:'Vanadi' },
  { Z:24, s:'Cr', period:4, group:6,  block:'d', name:'Crom' },
  { Z:25, s:'Mn', period:4, group:7,  block:'d', name:'Manganès' },
  { Z:26, s:'Fe', period:4, group:8,  block:'d', name:'Ferro' },
  { Z:27, s:'Co', period:4, group:9,  block:'d', name:'Cobalt' },
  { Z:28, s:'Ni', period:4, group:10, block:'d', name:'Níquel' },
  { Z:29, s:'Cu', period:4, group:11, block:'d', name:'Coure' },
  { Z:30, s:'Zn', period:4, group:12, block:'d', name:'Zinc' },
  { Z:31, s:'Ga', period:4, group:13, block:'p', name:'Gal·li' },
  { Z:32, s:'Ge', period:4, group:14, block:'p', name:'Germani' },
  { Z:33, s:'As', period:4, group:15, block:'p', name:'Arsènic' },
  { Z:34, s:'Se', period:4, group:16, block:'p', name:'Seleni' },
  { Z:35, s:'Br', period:4, group:17, block:'p', name:'Brom' },
  { Z:36, s:'Kr', period:4, group:18, block:'p', name:'Criptó' },
  { Z:37, s:'Rb', period:5, group:1,  block:'s', name:'Rubidi' },
  { Z:38, s:'Sr', period:5, group:2,  block:'s', name:'Estronci' },
  { Z:39, s:'Y',  period:5, group:3,  block:'d', name:'Itri' },
  { Z:40, s:'Zr', period:5, group:4,  block:'d', name:'Zirconi' },
  { Z:41, s:'Nb', period:5, group:5,  block:'d', name:'Niobi' },
  { Z:42, s:'Mo', period:5, group:6,  block:'d', name:'Molibdè' },
  { Z:43, s:'Tc', period:5, group:7,  block:'d', name:'Tecneci' },
  { Z:44, s:'Ru', period:5, group:8,  block:'d', name:'Ruteni' },
  { Z:45, s:'Rh', period:5, group:9,  block:'d', name:'Rodi' },
  { Z:46, s:'Pd', period:5, group:10, block:'d', name:'Pal·ladi' },
  { Z:47, s:'Ag', period:5, group:11, block:'d', name:'Argent' },
  { Z:48, s:'Cd', period:5, group:12, block:'d', name:'Cadmi' },
  { Z:49, s:'In', period:5, group:13, block:'p', name:'Indi' },
  { Z:50, s:'Sn', period:5, group:14, block:'p', name:'Estany' },
  { Z:51, s:'Sb', period:5, group:15, block:'p', name:'Antimoni' },
  { Z:52, s:'Te', period:5, group:16, block:'p', name:'Tel·luri' },
  { Z:53, s:'I',  period:5, group:17, block:'p', name:'Iode' },
  { Z:54, s:'Xe', period:5, group:18, block:'p', name:'Xenó' },
  { Z:55, s:'Cs', period:6, group:1,  block:'s', name:'Cesi' },
  { Z:56, s:'Ba', period:6, group:2,  block:'s', name:'Bari' },
  { Z:57, s:'La', period:6, group:3,  block:'f', name:'Lantani' },
  { Z:58, s:'Ce', period:6, group:3,  block:'f', name:'Ceri' },
  { Z:59, s:'Pr', period:6, group:3,  block:'f', name:'Praseodimi' },
  { Z:60, s:'Nd', period:6, group:3,  block:'f', name:'Neodimi' },
  { Z:61, s:'Pm', period:6, group:3,  block:'f', name:'Prometi' },
  { Z:62, s:'Sm', period:6, group:3,  block:'f', name:'Samari' },
  { Z:63, s:'Eu', period:6, group:3,  block:'f', name:'Europi' },
  { Z:64, s:'Gd', period:6, group:3,  block:'f', name:'Gadolini' },
  { Z:65, s:'Tb', period:6, group:3,  block:'f', name:'Terbi' },
  { Z:66, s:'Dy', period:6, group:3,  block:'f', name:'Disprosi' },
  { Z:67, s:'Ho', period:6, group:3,  block:'f', name:'Holmi' },
  { Z:68, s:'Er', period:6, group:3,  block:'f', name:'Erbi' },
  { Z:69, s:'Tm', period:6, group:3,  block:'f', name:'Tuli' },
  { Z:70, s:'Yb', period:6, group:3,  block:'f', name:'Iterbi' },
  { Z:71, s:'Lu', period:6, group:3,  block:'d', name:'Luteci' },
  { Z:72, s:'Hf', period:6, group:4,  block:'d', name:'Hafni' },
  { Z:73, s:'Ta', period:6, group:5,  block:'d', name:'Tàntal' },
  { Z:74, s:'W',  period:6, group:6,  block:'d', name:'Tungstè' },
  { Z:75, s:'Re', period:6, group:7,  block:'d', name:'Reni' },
  { Z:76, s:'Os', period:6, group:8,  block:'d', name:'Osmi' },
  { Z:77, s:'Ir', period:6, group:9,  block:'d', name:'Iridi' },
  { Z:78, s:'Pt', period:6, group:10, block:'d', name:'Platí' },
  { Z:79, s:'Au', period:6, group:11, block:'d', name:'Or' },
  { Z:80, s:'Hg', period:6, group:12, block:'d', name:'Mercuri' },
  { Z:81, s:'Tl', period:6, group:13, block:'p', name:'Tal·li' },
  { Z:82, s:'Pb', period:6, group:14, block:'p', name:'Plom' },
  { Z:83, s:'Bi', period:6, group:15, block:'p', name:'Bismut' },
  { Z:84, s:'Po', period:6, group:16, block:'p', name:'Poloni' },
  { Z:85, s:'At', period:6, group:17, block:'p', name:'Àstat' },
  { Z:86, s:'Rn', period:6, group:18, block:'p', name:'Radó' },
  { Z:87, s:'Fr', period:7, group:1,  block:'s', name:'Franci' },
  { Z:88, s:'Ra', period:7, group:2,  block:'s', name:'Radi' },
  { Z:89, s:'Ac', period:7, group:3,  block:'f', name:'Actini' },
  { Z:90, s:'Th', period:7, group:3,  block:'f', name:'Tori' },
  { Z:91, s:'Pa', period:7, group:3,  block:'f', name:'Protoactini' },
  { Z:92, s:'U',  period:7, group:3,  block:'f', name:'Urani' },
  { Z:93, s:'Np', period:7, group:3,  block:'f', name:'Neptuni' },
  { Z:94, s:'Pu', period:7, group:3,  block:'f', name:'Plutoni' },
  { Z:95, s:'Am', period:7, group:3,  block:'f', name:'Americi' },
  { Z:96, s:'Cm', period:7, group:3,  block:'f', name:'Curi' },
  { Z:97, s:'Bk', period:7, group:3,  block:'f', name:'Berkeli' },
  { Z:98, s:'Cf', period:7, group:3,  block:'f', name:'Californi' },
  { Z:99, s:'Es', period:7, group:3,  block:'f', name:'Einsteini' },
  { Z:100,s:'Fm', period:7, group:3,  block:'f', name:'Fermi' },
  { Z:101,s:'Md', period:7, group:3,  block:'f', name:'Mendelevi' },
  { Z:102,s:'No', period:7, group:3,  block:'f', name:'Nobeli' },
  { Z:103,s:'Lr', period:7, group:3,  block:'d', name:'Lawrenci' },
  { Z:104,s:'Rf', period:7, group:4,  block:'d', name:'Rutherfordi' },
  { Z:105,s:'Db', period:7, group:5,  block:'d', name:'Dubni' },
  { Z:106,s:'Sg', period:7, group:6,  block:'d', name:'Seaborgi' },
  { Z:107,s:'Bh', period:7, group:7,  block:'d', name:'Bohri' },
  { Z:108,s:'Hs', period:7, group:8,  block:'d', name:'Hassi' },
  { Z:109,s:'Mt', period:7, group:9,  block:'d', name:'Meitneri' },
  { Z:110,s:'Ds', period:7, group:10, block:'d', name:'Darmstadti' },
  { Z:111,s:'Rg', period:7, group:11, block:'d', name:'Roentgeni' },
  { Z:112,s:'Cn', period:7, group:12, block:'d', name:'Copernici' },
  { Z:113,s:'Nh', period:7, group:13, block:'p', name:'Nihoni' },
  { Z:114,s:'Fl', period:7, group:14, block:'p', name:'Flerovi' },
  { Z:115,s:'Mc', period:7, group:15, block:'p', name:'Moscovi' },
  { Z:116,s:'Lv', period:7, group:16, block:'p', name:'Livermori' },
  { Z:117,s:'Ts', period:7, group:17, block:'p', name:'Tennes' },
  { Z:118,s:'Og', period:7, group:18, block:'p', name:'Oganessó' },
];

const OXIDATION_DATA = new Map();
function setOxidation(z, states, commonStates) {
  const unique = Array.from(new Set(states)).map(Number).sort((a, b) => a - b);
  const commons = commonStates ? Array.from(new Set(commonStates)).map(Number) : unique;
  const filtered = commons.filter((value) => unique.includes(value));
  OXIDATION_DATA.set(z, { states: unique, common: filtered });
}

setOxidation(1, [-1, +1], [+1]);
setOxidation(2, [0]);
setOxidation(3, [+1]);
setOxidation(4, [+2]);
setOxidation(5, [-3, +3], [+3]);
setOxidation(6, [-4, -2, +2, +4], [-4, +4]);
setOxidation(7, [-3, -2, -1, +1, +2, +3, +4, +5], [-3, +3, +5]);
setOxidation(8, [-2, -1, 0, +1, +2], [-2]);
setOxidation(9, [-1]);
setOxidation(10, [0]);
setOxidation(11, [+1]);
setOxidation(12, [+2]);
setOxidation(13, [+3]);
setOxidation(14, [-4, +2, +4], [+4]);
setOxidation(15, [-3, +1, +3, +5], [+3, +5]);
setOxidation(16, [-2, -1, 0, +2, +4, +6], [-2, +4, +6]);
setOxidation(17, [-1, +1, +3, +5, +7], [-1, +1, +5]);
setOxidation(18, [0]);
setOxidation(19, [+1]);
setOxidation(20, [+2]);
setOxidation(21, [+3]);
setOxidation(22, [+2, +3, +4], [+4]);
setOxidation(23, [-1, +2, +3, +4, +5], [+4, +5]);
setOxidation(24, [-2, -1, 0, +1, +2, +3, +4, +5, +6], [+3, +6]);
setOxidation(25, [-3, -2, -1, 0, +1, +2, +3, +4, +5, +6, +7], [+2, +4, +7]);
setOxidation(26, [-2, -1, 0, +1, +2, +3, +4, +5, +6], [+2, +3]);
setOxidation(27, [-1, 0, +1, +2, +3, +4, +5], [+2, +3]);
setOxidation(28, [-2, -1, 0, +1, +2, +3, +4], [+2]);
setOxidation(29, [-2, -1, 0, +1, +2, +3, +4], [+1, +2]);
setOxidation(30, [-2, 0, +1, +2], [+2]);
setOxidation(31, [+1, +3], [+3]);
setOxidation(32, [-4, +2, +4], [+2, +4]);
setOxidation(33, [-3, +3, +5], [+3, +5]);
setOxidation(34, [-2, 0, +2, +4, +6], [+4, +6]);
setOxidation(35, [-1, +1, +3, +5, +7], [-1, +5]);
setOxidation(36, [0, +2, +4], [0]);
setOxidation(37, [+1]);
setOxidation(38, [+2]);
setOxidation(39, [+3]);
setOxidation(40, [+2, +3, +4], [+4]);
setOxidation(41, [-1, +1, +2, +3, +4, +5], [+5]);
setOxidation(42, [-2, -1, 0, +1, +2, +3, +4, +5, +6], [+4, +6]);
setOxidation(43, [-3, -1, 0, +1, +2, +4, +5, +7], [+7, +4]);
setOxidation(44, [-2, 0, +1, +2, +3, +4, +5, +6, +7, +8], [+3, +4]);
setOxidation(45, [-1, 0, +1, +2, +3, +4, +5, +6], [+3]);
setOxidation(46, [-2, 0, +1, +2, +3, +4], [+2]);
setOxidation(47, [-2, -1, 0, +1, +2, +3], [+1]);
setOxidation(48, [-2, 0, +1, +2], [+2]);
setOxidation(49, [+1, +3], [+3]);
setOxidation(50, [-4, +2, +4], [+2, +4]);
setOxidation(51, [-3, +3, +5], [+3, +5]);
setOxidation(52, [-2, 0, +2, +4, +6], [+4]);
setOxidation(53, [-1, +1, +3, +5, +7], [-1, +5]);
setOxidation(54, [0, +2, +4, +6, +8], [0, +6]);
setOxidation(55, [+1]);
setOxidation(56, [+2]);
setOxidation(57, [+3]);
setOxidation(58, [+2, +3, +4], [+3, +4]);
setOxidation(59, [+2, +3, +4], [+3]);
setOxidation(60, [+2, +3, +4], [+3]);
setOxidation(61, [+2, +3, +4], [+3]);
setOxidation(62, [+2, +3], [+3]);
setOxidation(63, [+2, +3], [+3, +2]);
setOxidation(64, [+2, +3, +4], [+3]);
setOxidation(65, [+3, +4], [+3]);
setOxidation(66, [+2, +3, +4], [+3]);
setOxidation(67, [+2, +3], [+3]);
setOxidation(68, [+2, +3], [+3]);
setOxidation(69, [+2, +3], [+3]);
setOxidation(70, [+2, +3], [+3, +2]);
setOxidation(71, [+3]);
setOxidation(72, [+2, +3, +4], [+4]);
setOxidation(73, [-1, +2, +3, +4, +5], [+5]);
setOxidation(74, [-2, 0, +2, +3, +4, +5, +6], [+6]);
setOxidation(75, [-3, -1, 0, +1, +2, +3, +4, +5, +6, +7], [+7, +4]);
setOxidation(76, [-2, 0, +2, +3, +4, +6, +7, +8], [+4, +6]);
setOxidation(77, [-3, -1, 0, +1, +2, +3, +4, +5, +6], [+3, +4]);
setOxidation(78, [-2, 0, +2, +4, +5, +6], [+2, +4]);
setOxidation(79, [-2, -1, 0, +1, +2, +3, +5], [+1, +3]);
setOxidation(80, [-2, 0, +1, +2], [+2, +1]);
setOxidation(81, [+1, +3]);
setOxidation(82, [-4, +2, +4], [+2, +4]);
setOxidation(83, [-3, +3, +5], [+3, +5]);
setOxidation(84, [-2, 0, +2, +4, +6], [+2, +4]);
setOxidation(85, [-1, +1, +3, +5, +7], [-1, +5]);
setOxidation(86, [0, +2, +4, +6], [0, +2]);
setOxidation(87, [+1]);
setOxidation(88, [+2]);
setOxidation(89, [+3]);
setOxidation(90, [+2, +3, +4], [+4]);
setOxidation(91, [+3, +4, +5], [+5]);
setOxidation(92, [+3, +4, +5, +6], [+6, +4]);
setOxidation(93, [+2, +3, +4, +5, +6, +7], [+5]);
setOxidation(94, [+3, +4, +5, +6, +7], [+4]);
setOxidation(95, [+2, +3, +4, +5, +6], [+3]);
setOxidation(96, [+3, +4], [+3]);
setOxidation(97, [+3, +4], [+3]);
setOxidation(98, [+2, +3, +4], [+3]);
setOxidation(99, [+2, +3, +4], [+3]);
setOxidation(100, [+2, +3], [+3]);
setOxidation(101, [+2, +3], [+3]);
setOxidation(102, [+2, +3], [+2]);
setOxidation(103, [+3]);
setOxidation(104, [+2, +3, +4], [+4]);
setOxidation(105, [+3, +4, +5], [+5]);
setOxidation(106, [+4, +5, +6], [+6]);
setOxidation(107, [+3, +4, +5, +7], [+7]);
setOxidation(108, [+2, +4, +6], [+6]);
setOxidation(109, [+1, +3, +5], [+3]);
setOxidation(110, [+2, +4, +6], [+2]);
setOxidation(111, [+1, +3], [+1]);
setOxidation(112, [+2, +4], [+2]);
setOxidation(113, [+1, +3], [+1]);
setOxidation(114, [+2, +4], [+2]);
setOxidation(115, [+1, +3], [+3]);
setOxidation(116, [+2, +4], [+2]);
setOxidation(117, [+1, +3, +5], [+5]);
setOxidation(118, [0, +2, +4], [0]);

// Elements amb una configuració experimental diferent de la que dona l'ordre d'Aufbau (fonamental, en fase gasosa)
const REAL_CONFIG = new Map([
  [24, { core: 'Ar', rest: '3d5 4s1', stable: true }],
  [29, { core: 'Ar', rest: '3d10 4s1', stable: true }],
  [41, { core: 'Kr', rest: '4d4 5s1' }],
  [42, { core: 'Kr', rest: '4d5 5s1', stable: true }],
  [44, { core: 'Kr', rest: '4d7 5s1' }],
  [45, { core: 'Kr', rest: '4d8 5s1' }],
  [46, { core: 'Kr', rest: '4d10', stable: true }],
  [47, { core: 'Kr', rest: '4d10 5s1', stable: true }],
  [57, { core: 'Xe', rest: '5d1 6s2' }],
  [58, { core: 'Xe', rest: '4f1 5d1 6s2' }],
  [64, { core: 'Xe', rest: '4f7 5d1 6s2' }],
  [78, { core: 'Xe', rest: '4f14 5d9 6s1' }],
  [79, { core: 'Xe', rest: '4f14 5d10 6s1', stable: true }],
  [89, { core: 'Rn', rest: '6d1 7s2' }],
  [90, { core: 'Rn', rest: '6d2 7s2' }],
  [91, { core: 'Rn', rest: '5f2 6d1 7s2' }],
  [92, { core: 'Rn', rest: '5f3 6d1 7s2' }],
  [93, { core: 'Rn', rest: '5f4 6d1 7s2' }],
  [96, { core: 'Rn', rest: '5f7 6d1 7s2' }],
  [103, { core: 'Rn', rest: '5f14 7s2 7p1' }],
]);

const NOBLE_GASES = [
  { Z: 2, s: 'He' },
  { Z: 10, s: 'Ne' },
  { Z: 18, s: 'Ar' },
  { Z: 36, s: 'Kr' },
  { Z: 54, s: 'Xe' },
  { Z: 86, s: 'Rn' },
];

const SVG_NS = 'http://www.w3.org/2000/svg';
const SHELL_CAPACITY = new Map();
ORBITAL_ORDER.forEach((orb) => {
  SHELL_CAPACITY.set(orb.n, (SHELL_CAPACITY.get(orb.n) || 0) + orb.max);
});
const SHELL_LIST = Array.from(SHELL_CAPACITY.entries())
  .sort((a, b) => a[0] - b[0])
  .map(([n, max]) => ({ n, max }));
const SHELL_SP_ORBITALS = new Map();
ORBITAL_ORDER.forEach((orb, index) => {
  if (orb.l === 's' || orb.l === 'p') {
    if (!SHELL_SP_ORBITALS.has(orb.n)) SHELL_SP_ORBITALS.set(orb.n, {});
    SHELL_SP_ORBITALS.get(orb.n)[orb.l] = index;
  }
});
const SHELL_BASE_RADIUS = 58;
const SHELL_RADIUS_STEP = 18;
const SHELL_CENTER = 180;
const SHELL_BADGE_RADIUS = 14;

const INDEX_BY_NL = new Map();
ORBITAL_ORDER.forEach((o, i) => INDEX_BY_NL.set(`${o.n}|${o.l}`, i));

// Selecció d'elements del DOM
const $count = document.getElementById('electron-count');
const $configNoble = document.getElementById('config-noble');
const $configException = document.getElementById('config-exception');
const $diagram = document.getElementById('orbital-diagram');
const $periodicTable = document.getElementById('periodic-table');
const $coords = document.getElementById('coords');
const $elTitle = document.getElementById('el-title');
const $atomVisual = document.getElementById('atom-visual');
const $atomSymbol = document.getElementById('atom-symbol');
const $atomName = document.getElementById('atom-name');
const $atomNumber = document.getElementById('atom-number');
const $atomNucleusText = document.getElementById('atom-nucleus-text');
const $atomShellGroup = document.getElementById('atom-shell-group');
const $atomShellBadges = document.getElementById('atom-shell-badges');
const $atomShellList = document.getElementById('atom-shell-list');
const $aufbauDisplay = document.getElementById('aufbau-config-display');
const $oxidationStates = document.getElementById('oxidation-states');
const $btnAdd = document.getElementById('add-electron');
const $btnRemove = document.getElementById('remove-electron');
const $btnReset = document.getElementById('reset');

// Estat: nombre d'electrons (= Z de l'àtom neutre)
let Z = 0;

function setZ(value) {
  const parsed = Math.floor(Number(value));
  if (Number.isNaN(parsed)) return;
  Z = Math.max(0, Math.min(MAX_ELECTRONS, parsed));
  updateAll();
}

// Construcció inicial
buildOrbitalDiagram();
buildPeriodicTable();
updateAll();

// Esdeveniments
$btnAdd.addEventListener('click', () => setZ(Z + 1));
$btnRemove.addEventListener('click', () => setZ(Z - 1));
$btnReset.addEventListener('click', () => setZ(0));

document.addEventListener('keydown', (ev) => {
  if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
  if (ev.key === 'ArrowRight' || ev.key === '+') { ev.preventDefault(); setZ(Z + 1); }
  else if (ev.key === 'ArrowLeft' || ev.key === '-') { ev.preventDefault(); setZ(Z - 1); }
});

// Clic sobre un punt: s'emplena fins a aquell electró (o es treu si ja era l'últim)
$diagram.addEventListener('click', (ev) => {
  const dot = ev.target.closest('.dot');
  if (dot) {
    const electron = Number(dot.dataset.electron);
    setZ(electron === Z ? electron - 1 : electron);
    return;
  }
  // Clic sobre la càpsula: omple l'orbital sencer o, si ja és ple, el buida
  const pair = ev.target.closest('.dot-pair');
  if (!pair) return;
  const electrons = Array.from(pair.querySelectorAll('.dot')).map((d) => Number(d.dataset.electron));
  const top = Math.max(...electrons);
  setZ(Z >= top ? Math.min(...electrons) - 1 : top);
});

// Funcions de vista i lògica

function buildOrbitalDiagram() {
  const blocks = ['s', 'p', 'd', 'f'];
  const grid = document.createElement('div');
  grid.className = 'orbital-grid';

  const corner = document.createElement('div');
  corner.className = 'og-label og-label-blank';
  grid.appendChild(corner);

  blocks.forEach((block) => {
    const header = document.createElement('div');
    header.className = 'og-label';
    header.dataset.block = block;
    header.innerHTML = `<span class="label-word">Bloc&nbsp;</span>${block}`;
    grid.appendChild(header);
  });

  for (let n = 1; n <= 7; n++) {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    rowLabel.innerHTML = `<span class="row-word">Capa&nbsp;</span>${n}`;
    rowLabel.dataset.shell = String(n);
    rowLabel.title = `Capa ${n} (n = ${n})`;
    grid.appendChild(rowLabel);

    for (const l of blocks) {
      const oi = INDEX_BY_NL.get(`${n}|${l}`);
      const cell = document.createElement('div');
      cell.className = `og-cell ${l}`;

      if (oi !== undefined) {
        cell.classList.add('has');
        const o = ORBITAL_ORDER[oi];
        const start = ORBITAL_PREFIX_SUMS[oi];
        const orbitals = o.max / 2;
        const dots = document.createElement('div');
        dots.className = 'dots';

        for (let k = 0; k < orbitals; k++) {
          const pair = document.createElement('div');
          pair.className = 'dot-pair empty';
          pair.title = `Orbital ${n}${l}`;
          // Regla de Hund: primer un electró a cada orbital (spin ↑) i després s'aparellen (spin ↓)
          for (let spin = 0; spin < 2; spin++) {
            const electron = start + spin * orbitals + k + 1;
            const d = document.createElement('span');
            d.className = 'dot';
            d.dataset.electron = String(electron);
            d.title = `Electró ${electron} · ${n}${l} ${spin === 0 ? '↑' : '↓'}`;
            pair.appendChild(d);
          }
          dots.appendChild(pair);
        }
        cell.appendChild(dots);
      }
      grid.appendChild(cell);
    }
  }

  $diagram.innerHTML = '';
  $diagram.appendChild(grid);
}

function buildPeriodicTable() {
  $periodicTable.innerHTML = '';
  const place = (node, row, col, span = 1) => {
    node.style.gridRow = String(row);
    node.style.gridColumn = span > 1 ? `${col} / span ${span}` : String(col);
    $periodicTable.appendChild(node);
  };
  const label = (cls, text, row, col, span) => {
    const node = document.createElement('div');
    node.className = cls;
    node.textContent = text;
    node.setAttribute('aria-hidden', 'true');
    place(node, row, col, span);
  };

  // Fila 1: grups; columna 1: períodes
  for (let g = 1; g <= 18; g++) label('pt-group', String(g), 1, g + 1);
  for (let p = 1; p <= 7; p++) label('pt-period', String(p), p + 1, 1);

  // Taula principal (disposició IUPAC: Lu i Lr al grup 3; el bloc f, a part)
  ELEMENTS
    .filter((e) => !(isLanthanide(e.Z) || isActinide(e.Z)))
    .forEach((e) => place(makeElementTile(e, 'main'), e.period + 1, e.group + 1));

  // Files del bloc f (La–Yb i Ac–No), alineades a partir del grup 3
  label('pt-series-label', 'Lantànids', 10, 1, 3);
  label('pt-series-label', 'Actínids', 11, 1, 3);
  for (let i = 0; i < 14; i++) {
    place(makeElementTile(findElementByZ(57 + i), 'f'), 10, 4 + i);
    place(makeElementTile(findElementByZ(89 + i), 'f'), 11, 4 + i);
  }
}

function makeElementTile(e, region) {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = `element-tile ${e.block}`;
  tile.id = `el-${region}-${e.Z}`;
  tile.title = `${e.name} · Z = ${e.Z}`;
  tile.setAttribute('aria-label', `${e.name}, Z ${e.Z}`);
  tile.innerHTML = `<span class="Z">${e.Z}</span><span class="symbol">${e.s}</span>`;
  tile.addEventListener('click', () => setZ(e.Z));
  return tile;
}

function isLanthanide(z) { return z >= 57 && z <= 70; }
function isActinide(z) { return z >= 89 && z <= 102; }

function computeOccupancy(Zvalue) {
  let left = Zvalue;
  return ORBITAL_ORDER.map((o) => {
    const e = Math.max(0, Math.min(o.max, left));
    left -= e;
    return { n: o.n, l: o.l, max: o.max, e };
  });
}

function configToColoredString(occ) {
  return occ.filter((x) => x.e > 0)
    .map((x) => `<span class="config-part-${x.l}">${x.n}${x.l}<sup>${x.e}</sup></span>`)
    .join(' ');
}

function nobleCore(Zvalue) {
  // Gas noble immediatament anterior (Z < Zvalue); null si no n'hi ha
  let core = null;
  for (const g of NOBLE_GASES) {
    if (g.Z < Zvalue) core = g; else break;
  }
  return core;
}

function configToNobleString(Zvalue) {
  const core = nobleCore(Zvalue);
  if (!core) return null;
  const occ = computeOccupancy(Zvalue);
  const occCore = computeOccupancy(core.Z);
  const remText = occ
    .map((o, i) => ({ ...o, e: o.e - occCore[i].e }))
    .filter((x) => x.e > 0)
    .map((x) => `${x.n}${x.l}<sup>${x.e}</sup>`)
    .join(' ');
  return `[${core.s}] ${remText}`;
}

function formatSubshells(text) {
  return text.split(' ').map((part) => part.replace(/^(\d[spdf])(\d+)$/, '$1<sup>$2</sup>')).join(' ');
}

function computeShellSummary(occupancy) {
  const shells = SHELL_LIST.map((shell) => ({ ...shell, electrons: 0 }));
  occupancy.forEach((slot) => { shells[slot.n - 1].electrons += slot.e; });
  let last = -1;
  shells.forEach((shell, idx) => { if (shell.electrons > 0) last = idx; });
  return shells.slice(0, last + 1);
}

function updateAtomVisual(occData, element) {
  const shells = computeShellSummary(occData);
  $atomShellGroup.innerHTML = '';
  $atomShellBadges.innerHTML = '';
  $atomShellList.innerHTML = '';

  if (shells.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'shell-item empty';
    emptyItem.textContent = 'Encara no hi ha electrons. Prem «+ electró» o tria un element.';
    $atomShellList.appendChild(emptyItem);
  }

  shells.forEach((shell, idx) => {
    const radius = SHELL_BASE_RADIUS + idx * SHELL_RADIUS_STEP;
    const state = shell.electrons >= shell.max ? 'full' : 'partial';

    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', SHELL_CENTER);
    circle.setAttribute('cy', SHELL_CENTER);
    circle.setAttribute('r', String(radius));
    circle.classList.add('atom-shell-circle', state);
    $atomShellGroup.appendChild(circle);

    // Les etiquetes es reparteixen en angles diferents perquè no se solapin
    const angle = (-90 + idx * 38) * Math.PI / 180;
    const bx = SHELL_CENTER + radius * Math.cos(angle);
    const by = SHELL_CENTER + radius * Math.sin(angle);
    const badge = document.createElementNS(SVG_NS, 'circle');
    badge.classList.add('shell-badge', state);
    badge.setAttribute('cx', bx.toFixed(1));
    badge.setAttribute('cy', by.toFixed(1));
    badge.setAttribute('r', String(SHELL_BADGE_RADIUS));
    const text = document.createElementNS(SVG_NS, 'text');
    text.classList.add('shell-badge-text');
    text.setAttribute('x', bx.toFixed(1));
    text.setAttribute('y', by.toFixed(1));
    text.textContent = String(shell.electrons);
    $atomShellBadges.append(badge, text);

    const item = document.createElement('li');
    item.className = `shell-item ${state}`;
    const missing = shell.max - shell.electrons;
    item.innerHTML = `<span class="shell-index">Capa ${shell.n}</span>`
      + `<span class="shell-count">${shell.electrons}/${shell.max} e⁻${state === 'partial' ? ` <span class="shell-note">· falten ${missing}</span>` : ''}</span>`;
    $atomShellList.appendChild(item);
  });

  const block = element ? element.block : null;
  $atomSymbol.textContent = element ? element.s : '—';
  $atomName.textContent = element ? element.name : 'Cap element';
  $atomNumber.textContent = `Z = ${Z}`;
  $atomNucleusText.textContent = Z > 0 ? `${Z}+` : '';
  [$atomSymbol, $atomName, $atomNumber].forEach((node) => {
    node.classList.remove('color-s', 'color-p', 'color-d', 'color-f');
    if (block) node.classList.add(`color-${block}`);
  });

  const electronsLabel = Z === 1 ? '1 electró' : `${Z} electrons`;
  const shellDetails = shells.length
    ? shells.map((shell) => `capa ${shell.n}: ${shell.electrons} de ${shell.max}`).join(', ')
    : 'sense capes actives';
  const parts = element ? [`Àtom de ${element.name}`, electronsLabel, shellDetails] : [electronsLabel, shellDetails];
  $atomVisual.setAttribute('aria-label', parts.join('. '));
}

function formatOxidationState(value) {
  return value > 0 ? `+${value}` : String(value);
}

function updateShellOctetState(occArr) {
  SHELL_SP_ORBITALS.forEach((orbitals, shellNumber) => {
    const label = $diagram.querySelector(`.row-label[data-shell="${shellNumber}"]`);
    if (!label) return;
    const full = (i) => i === undefined || occArr[i].e === occArr[i].max;
    label.classList.toggle('row-label-octet', full(orbitals.s) && full(orbitals.p));
  });
}

function updateOxidationStates(element) {
  if (!element) {
    $oxidationStates.innerHTML = '<span class="oxidation-placeholder">Tria un element per veure els seus nombres d\'oxidació</span>';
    return;
  }
  const data = OXIDATION_DATA.get(element.Z);
  if (!data || data.states.length === 0) {
    $oxidationStates.innerHTML = '<span class="oxidation-placeholder">Sense dades disponibles per a aquest element</span>';
    return;
  }
  const commonSet = new Set(data.common);
  $oxidationStates.innerHTML = data.states.map((state) => {
    const classes = ['oxidation-chip', state > 0 ? 'positive' : state < 0 ? 'negative' : 'zero'];
    if (commonSet.has(state)) classes.push('common');
    const title = commonSet.has(state) ? 'Nombre d\'oxidació habitual' : 'Nombre d\'oxidació menys freqüent';
    return `<span class="${classes.join(' ')}" title="${title}">${formatOxidationState(state)}</span>`;
  }).join('');
}

function updateOrbitalDiagram(occ) {
  $diagram.querySelectorAll('.dot').forEach((d) => {
    const electron = Number(d.dataset.electron);
    d.classList.toggle('filled', electron <= Z);
    d.classList.toggle('next', electron === Z + 1);
  });
  $diagram.querySelectorAll('.dot-pair').forEach((pair) => {
    const filled = pair.querySelectorAll('.dot.filled').length;
    pair.classList.remove('full', 'partial', 'empty');
    pair.classList.add(filled === 2 ? 'full' : filled === 1 ? 'partial' : 'empty');
  });
  updateShellOctetState(occ);
}

function updateConfiguration(occ, element) {
  $aufbauDisplay.innerHTML = Z === 0 ? '<span class="oxidation-placeholder">—</span>' : configToColoredString(occ);
  const noble = configToNobleString(Z);
  $configNoble.innerHTML = noble || '—';

  const real = element ? REAL_CONFIG.get(element.Z) : null;
  $configException.hidden = !real;
  if (real) {
    $configException.innerHTML = `<strong>Excepció:</strong> la configuració real (experimental) ${withDe(element.name)} és `
      + `<strong>[${real.core}] ${formatSubshells(real.rest)}</strong>.`
      + (real.stable ? ' Un subnivell d semiple o ple és especialment estable.' : ' L\'ordre d\'Aufbau és una aproximació.');
  }
}

// «del crom», «de l'or»
function withDe(name) {
  const lower = name.toLowerCase();
  return /^[aeiouàèéíòóú]/.test(lower) ? `de l'${lower}` : `del ${lower}`;
}

function findElementByZ(z) {
  return ELEMENTS.find((e) => e.Z === z) || null;
}

function highlightElement(el) {
  document.querySelectorAll('.element-tile.selected').forEach((n) => n.classList.remove('selected'));
  if (!el) return;
  ['main', 'f'].forEach((region) => {
    const tile = document.getElementById(`el-${region}-${el.Z}`);
    if (tile) tile.classList.add('selected');
  });
}

function coordsText(el) {
  if (el.block === 'f') {
    return `període ${el.period} · bloc f (${el.period === 6 ? 'lantànids' : 'actínids'})`;
  }
  return `període ${el.period} · grup ${el.group} · bloc ${el.block}`;
}

function updateAll() {
  const occ = computeOccupancy(Z);
  const el = findElementByZ(Z);
  $count.textContent = String(Z);
  $btnRemove.disabled = Z === 0;
  $btnAdd.disabled = Z === MAX_ELECTRONS;
  updateOrbitalDiagram(occ);
  $elTitle.textContent = el ? `${el.name} (${el.s}, Z = ${el.Z})` : '—';
  $coords.textContent = el ? coordsText(el) : '—';
  updateAtomVisual(occ, el);
  highlightElement(el);
  updateOxidationStates(el);
  updateConfiguration(occ, el);
}
