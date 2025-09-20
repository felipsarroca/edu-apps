// Aplicació: Configuració electrònica + Taula periòdica
// Llengua: Català

// Ordre demplenament (Aufbau): n i capacitats
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
  { Z:57, s:'La', period:6, group:3,  block:'d', name:'Lantani' },
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
  { Z:85, s:'At', period:6, group:17, block:'p', name:'stat' },
  { Z:86, s:'Rn', period:6, group:18, block:'p', name:'Radó' },
  { Z:87, s:'Fr', period:7, group:1,  block:'s', name:'Franci' },
  { Z:88, s:'Ra', period:7, group:2,  block:'s', name:'Radi' },
  { Z:89, s:'Ac', period:7, group:3,  block:'d', name:'Actini' },
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

const SVG_NS = 'http://www.w3.org/2000/svg';
const SHELL_CAPACITY = new Map();
ORBITAL_ORDER.forEach((orb) => {
  SHELL_CAPACITY.set(orb.n, (SHELL_CAPACITY.get(orb.n) || 0) + orb.max);
});
const SHELL_LIST = Array.from(SHELL_CAPACITY.entries())
  .sort((a, b) => a[0] - b[0])
  .map(([n, max]) => ({ n, max }));
const SHELL_INDEX = new Map(SHELL_LIST.map((shell, idx) => [shell.n, idx]));
const SHELL_SP_ORBITALS = new Map();
ORBITAL_ORDER.forEach((orb, index) => {
  if (orb.l === 's' || orb.l === 'p') {
    if (!SHELL_SP_ORBITALS.has(orb.n)) SHELL_SP_ORBITALS.set(orb.n, {});
    SHELL_SP_ORBITALS.get(orb.n)[orb.l] = index;
  }
});
const SHELL_BASE_RADIUS = 52;
const SHELL_RADIUS_STEP = 18;
const SHELL_CENTER = 180;
const SHELL_BADGE_RADIUS = 11;

// Selecció delements del DOM
const $count = document.getElementById('electron-count');
const $configFull = document.getElementById('config-full');
const $configNoble = document.getElementById('config-noble');
const $diagram = document.getElementById('orbital-diagram');
const $periodicMain = document.getElementById('periodic-main');
const $periodicLan = document.getElementById('periodic-f-lan');
const $periodicAct = document.getElementById('periodic-f-act');
const $coords = document.getElementById('coords');
const $elTitle = document.getElementById('el-title');
const $atomVisual = document.getElementById('atom-visual');
const $atomSymbol = document.getElementById('atom-symbol');
const $atomName = document.getElementById('atom-name');
const $atomNumber = document.getElementById('atom-number');
const $atomShellGroup = document.getElementById('atom-shell-group');
const $atomShellBadges = document.getElementById('atom-shell-badges');
const $atomShellList = document.getElementById('atom-shell-list');
const $aufbauDisplay = document.getElementById('aufbau-config-display');
const $oxidationStates = document.getElementById('oxidation-states');

const $btnAdd = document.getElementById('add-electron');
const $btnRemove = document.getElementById('remove-electron');
const $btnReset = document.getElementById('reset');
const $groupHeader = document.getElementById('group-header');
const $periodLabels = document.getElementById('period-labels');

// Estat d'ocupació (per orbital) i índex ràpid n|l  posició a ORBITAL_ORDER
let occ = ORBITAL_ORDER.map(o => ({ n: o.n, l: o.l, max: o.max, e: 0 }));
let Z = 0; // compatibilitat amb flux anterior
const INDEX_BY_NL = new Map();
ORBITAL_ORDER.forEach((o, i) => INDEX_BY_NL.set(`${o.n}|${o.l}`, i));

// Construcció inicial
buildOrbitalDiagram();
buildPeriodicTable();
buildPeriodicLabels();
updateAll();

// Events
$btnAdd.addEventListener('click', addElectronByOrder);
$btnRemove.addEventListener('click', removeElectronByOrder);
$btnReset.addEventListener('click', () => {
  if (typeof setZ === 'function') {
    setZ(0);
  } else {
    Z = 0;
    updateAll();
  }
});


// Clic sobre orbitals: selecciona o desactiva el comptador d'electrons.
$diagram.addEventListener('click', (ev) => {
  const dot = ev.target.closest('.dot');
  if (dot) {
    const electronNumber = Number(dot.dataset.electron);
    if (!Number.isNaN(electronNumber)) {
      const current = typeof getZ === 'function' ? getZ() : Z;
      let desired = electronNumber;
      if (electronNumber === current) desired = electronNumber - 1;
      desired = Math.max(0, Math.min(MAX_ELECTRONS, desired));
      if (typeof setZ === 'function') setZ(desired);
      else {
        Z = desired;
        updateAll();
      }
    }
    return;
  }

  const pair = ev.target.closest('.dot-pair');
  if (!pair) return;

  const rangeEnd = Number(pair.dataset.rangeEnd);
  if (Number.isNaN(rangeEnd)) return;

  const rangeStart = Number(pair.dataset.rangeStart);
  const current = typeof getZ === 'function' ? getZ() : Z;
  let desired = rangeEnd;

  if (!Number.isNaN(rangeStart) && current >= rangeStart && current <= rangeEnd) {
    desired = rangeStart - 1;
  }

  desired = Math.max(0, Math.min(MAX_ELECTRONS, desired));
  if (typeof setZ === 'function') setZ(desired);
  else {
    Z = desired;
    updateAll();
  }
});


/**
 * Afegeix un electró (incrementa Z) i actualitza la vista, fins a un màxim de 118.
 */
function addElectronByOrder() {
  const current = typeof getZ === 'function' ? getZ() : Z;
  if (current >= MAX_ELECTRONS) return;
  const desired = Math.min(MAX_ELECTRONS, current + 1);
  if (typeof setZ === 'function') {
    setZ(desired);
  } else {
    Z = desired;
    updateAll();
  }
}


/**
 * Treu un electró (decrementa Z) i actualitza la vista, fins a un mínim de 0.
 */
function removeElectronByOrder() {
  const current = typeof getZ === 'function' ? getZ() : Z;
  if (current <= 0) return;
  const desired = Math.max(0, current - 1);
  if (typeof setZ === 'function') {
    setZ(desired);
  } else {
    Z = desired;
    updateAll();
  }
}


/**
 * Troba la posició del següent electró a afegir segons l'ordre d'Aufbau.
 * @param {Array<object>} occArray - L'array d'ocupació actual.
 * @returns {object|null} Un objecte {oi, ei} amb l'índex de l'orbital i de l'electró, o null si està ple.
 */
function getNextSlot(occArray) {
  for (let oi = 0; oi < occArray.length; oi++) {
    const o = occArray[oi];
    if (o.e < o.max) {
      return { oi, ei: o.e };
    }
  }
  return null; // Tot ple
}

/**
 * Troba la posició del darrer electró afegit.
 * @param {Array<object>} occArray - L'array d'ocupació actual.
 * @returns {object|null} Un objecte {oi, ei} amb l'índex de l'orbital i de l'electró, o null si està buit.
 */
function getLastFilledSlot(occArray) {
  for (let oi = occArray.length - 1; oi >= 0; oi--) {
    const o = occArray[oi];
    if (o.e > 0) {
      return { oi, ei: o.e - 1 };
    }
  }
  return null; // Buit
}

//  Funcions de vista i lògica 

function buildOrbitalDiagram() {
  const blocks = ['s', 'p', 'd', 'f'];
  const grid = document.createElement('div');
  grid.className = 'orbital-grid';

  

  blocks.forEach((block) => {
    const header = document.createElement('div');
    header.className = 'og-label';
    header.dataset.block = block;
    header.textContent = `Bloc ${block}`;
    grid.appendChild(header);
  });

  for (let n = 1; n <= 7; n++) {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'row-label';
    rowLabel.textContent = `Capa ${n}`;
    rowLabel.dataset.shell = String(n);
    grid.appendChild(rowLabel);

    for (const l of blocks) {
      const has = (l === 's' && n >= 1) || (l === 'p' && n >= 2) || (l === 'd' && n >= 3) || (l === 'f' && n >= 4);
      const cell = document.createElement('div');
      cell.className = `og-cell ${l} ${has ? 'has' : ''}`;
      cell.dataset.block = l;
      cell.dataset.shell = String(n);

      if (has) {
        const oi = INDEX_BY_NL.get(`${n}|${l}`);
        if (oi !== undefined) {
          const o = ORBITAL_ORDER[oi];
          const dots = document.createElement('div');
          dots.className = 'dots';
          const pairCount = Math.ceil(o.max / 2);
          const blockColumns = o.l === 's' ? 1 : o.l === 'p' ? 3 : o.l === 'd' ? 5 : 7;
          const colSetting = Math.max(1, Math.min(pairCount, blockColumns));
          dots.style.setProperty('--pair-columns', String(colSetting));

          for (let pairIndex = 0; pairIndex < pairCount; pairIndex++) {
            const pair = document.createElement('div');
            pair.className = 'dot-pair empty';
            pair.dataset.oi = String(oi);
            pair.dataset.pi = String(pairIndex);

            for (let slot = 0; slot < 2; slot++) {
              const eIndex = pairIndex * 2 + slot;
              if (eIndex >= o.max) break;
              const d = document.createElement('span');
              d.className = 'dot';
              d.dataset.oi = String(oi);
              d.dataset.ei = String(eIndex);
              pair.appendChild(d);
            }

            dots.appendChild(pair);
          }

          cell.appendChild(dots);
        }
      }

      grid.appendChild(cell);
    }
  }

  $diagram.innerHTML = '';
  $diagram.appendChild(grid);
}

function buildPeriodicTable() {
  // Main grid: excloem f-bloc (excepte La i Ac que es mostren al principal)
  $periodicMain.innerHTML = '';
  const main = ELEMENTS.filter(e => !(isLanthanide(e.Z) || isActinide(e.Z)) || e.Z === 57 || e.Z === 89);
  main.forEach(e => {
    const tile = makeElementTile(e, 'main');
    tile.style.gridColumn = String(e.group);
    tile.style.gridRow = String(e.period);
    $periodicMain.appendChild(tile);
  });

  // f-bloc: alineació sota La/Ac
  if ($periodicLan) {
    $periodicLan.innerHTML = '';
    const lanSpacer = document.createElement('div');
    lanSpacer.className = 'f-spacer';
    lanSpacer.setAttribute('aria-hidden', 'true');
    $periodicLan.appendChild(lanSpacer);

    for (let z = 57; z <= 71; z++) {
      const e = ELEMENTS.find((x) => x.Z === z);
      if (!e) continue;
      $periodicLan.appendChild(makeElementTile(e, 'f'));
    }
  }

  if ($periodicAct) {
    $periodicAct.innerHTML = '';
    const actSpacer = document.createElement('div');
    actSpacer.className = 'f-spacer';
    actSpacer.setAttribute('aria-hidden', 'true');
    $periodicAct.appendChild(actSpacer);

    for (let z = 89; z <= 103; z++) {
      const e = ELEMENTS.find((x) => x.Z === z);
      if (!e) continue;
      $periodicAct.appendChild(makeElementTile(e, 'f'));
    }
  }
}

function buildPeriodicLabels() {
  // grups 1..18
  if ($groupHeader) {
    $groupHeader.innerHTML = '';
    for (let g = 1; g <= 18; g++) {
      const cell = document.createElement('div');
      cell.className = 'group';
      cell.textContent = String(g);
      $groupHeader.appendChild(cell);
    }
  }
  // períodes 1..7
  if ($periodLabels) {
    $periodLabels.innerHTML = '';
    for (let p = 1; p <= 7; p++) {
      const cell = document.createElement('div');
      cell.className = 'period';
      cell.textContent = String(p);
      $periodLabels.appendChild(cell);
    }
  }
}

function makeElementTile(e, region) {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = `element-tile ${e.block}`;
  tile.title = `${e.Z} · ${e.s}    període ${e.period}${e.block==='f'?' · bloc f':''}${e.group?` · grup ${e.group}`:''}`;
  tile.id = `el-${region}-${e.Z}`;
  tile.innerHTML = `<span class="Z">${e.Z}</span><span class="symbol">${e.s}</span>`;
  tile.addEventListener('click', () => { setZ(e.Z); });
  return tile;
}

function isLanthanide(z) { return z >= 58 && z <= 71; }
function isActinide(z) { return z >= 90 && z <= 103; }

function computeOccupancy(Zvalue) {
  let left = Zvalue;
  const occ = ORBITAL_ORDER.map(o => ({ n: o.n, l: o.l, max: o.max, e: 0 }));
  for (const slot of occ) {
    if (left <= 0) break;
    const add = Math.min(slot.max, left);
    slot.e = add;
    left -= add;
  }
  return occ;
}

function configToString(occ) {
  return occ.filter(x => x.e > 0).map(x => `${x.n}${x.l}${x.e === x.max ? `<sup>${x.e}</sup>` : `<sup>${x.e}</sup>`}`).join(' ');
}

function configToColoredString(occ) {
  if (occ.reduce((sum, o) => sum + o.e, 0) === 0) return '';
  return occ.filter(x => x.e > 0)
    .map(x => `<span class="config-part-${x.l}">${x.n}${x.l}<sup>${x.e}</sup></span>`)
    .join(' ');
}

// Notació amb gas noble abreujada
const NOBLE_GASES = [
  { Z: 2, s: 'He' },
  { Z: 10, s: 'Ne' },
  { Z: 18, s: 'Ar' },
  { Z: 36, s: 'Kr' },
  { Z: 54, s: 'Xe' },
  { Z: 86, s: 'Rn' },
];

function nobleCore(Zvalue) {
  // Retorna el gas noble immediatament inferior (Z < Zvalue). Si no n'hi ha, null.
  let core = null;
  for (const g of NOBLE_GASES) {
    if (g.Z < Zvalue) core = g; else break;
  }
  return core; // null si Zvalue <= 2
}

function configToNobleString(Zvalue) {
  const core = nobleCore(Zvalue);
  if (!core) return '';
  const occ = computeOccupancy(Zvalue);
  const occCore = computeOccupancy(core.Z);
  const remainder = occ.map((o, i) => ({ ...o, e: Math.max(0, o.e - occCore[i].e) }));
  const remText = remainder.filter(x => x.e > 0).map(x => `${x.n}${x.l}<sup>${x.e}</sup>`).join(' ');
  return remText ? `[${core.s}] ${remText}` : `[${core.s}]`;
}

function computeShellSummary(occupancy) {
  const shells = SHELL_LIST.map(shell => ({ ...shell, electrons: 0 }));
  occupancy.forEach(slot => {
    const idx = SHELL_INDEX.get(slot.n);
    if (idx === undefined) return;
    shells[idx].electrons += slot.e;
  });
  let lastIndex = -1;
  shells.forEach((shell, idx) => {
    if (shell.electrons > 0) lastIndex = idx;
  });
  return lastIndex >= 0 ? shells.slice(0, lastIndex + 1) : [];
}

function updateAtomVisual(occData, element) {
  if (!$atomShellGroup || !$atomSymbol || !$atomName || !$atomNumber || !$atomVisual) return;
  const shells = computeShellSummary(occData);
  const totalElectrons = occData.reduce((sum, slot) => sum + slot.e, 0);
  $atomShellGroup.innerHTML = '';
  if ($atomShellBadges) $atomShellBadges.innerHTML = '';
  if ($atomShellList) $atomShellList.innerHTML = '';

  if (shells.length === 0) {
    if ($atomShellList) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'shell-item empty';
      emptyItem.textContent = totalElectrons === 0 ? 'Encara no hi ha electrons assignats' : 'Sense capes actives';
      $atomShellList.appendChild(emptyItem);
    }
  } else {
    shells.forEach((shell, idx) => {
      const radius = SHELL_BASE_RADIUS + idx * SHELL_RADIUS_STEP;
      const isFull = shell.electrons >= shell.max;
      const badgeState = isFull ? 'full' : 'partial';

      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', SHELL_CENTER);
      circle.setAttribute('cy', SHELL_CENTER);
      circle.setAttribute('r', String(radius));
      circle.setAttribute('data-shell', String(shell.n));
      circle.classList.add('atom-shell-circle', badgeState);
      $atomShellGroup.appendChild(circle);

      if ($atomShellBadges) {
        const badgeGroup = document.createElementNS(SVG_NS, 'g');
        badgeGroup.setAttribute('data-shell', String(shell.n));

        const badgeCircle = document.createElementNS(SVG_NS, 'circle');
        badgeCircle.classList.add('shell-badge', badgeState);
        badgeCircle.setAttribute('cx', SHELL_CENTER);
        badgeCircle.setAttribute('cy', String(SHELL_CENTER - radius));
        badgeCircle.setAttribute('r', String(SHELL_BADGE_RADIUS));

        const badgeText = document.createElementNS(SVG_NS, 'text');
        badgeText.classList.add('shell-badge-text', badgeState);
        badgeText.setAttribute('x', SHELL_CENTER);
        badgeText.setAttribute('y', String(SHELL_CENTER - radius));
        badgeText.setAttribute('dominant-baseline', 'middle');
        badgeText.textContent = String(shell.electrons);

        badgeGroup.appendChild(badgeCircle);
        badgeGroup.appendChild(badgeText);
        $atomShellBadges.appendChild(badgeGroup);
      }

      if ($atomShellList) {
        const item = document.createElement('li');
        item.className = `shell-item ${badgeState}`;

        const indexSpan = document.createElement('span');
        indexSpan.className = 'shell-index';
        indexSpan.textContent = `Capa ${shell.n}`;

        const countSpan = document.createElement('span');
        countSpan.className = 'shell-count';
        countSpan.textContent = `${shell.electrons}/${shell.max} electrons`;

        item.appendChild(indexSpan);
        item.appendChild(countSpan);

        if (!isFull) {
          const noteSpan = document.createElement('span');
          noteSpan.className = 'shell-note';
          noteSpan.textContent = `${shell.max - shell.electrons} per completar`;
          item.appendChild(noteSpan);
        }

        $atomShellList.appendChild(item);
      }
    });
  }

  const hasElement = Boolean(element);
  const symbol = hasElement ? element.s : '–';
  const displayName = hasElement ? (element.name || element.s) : 'Cap element';
  
  $atomSymbol.textContent = symbol;
  $atomName.textContent = displayName;
  $atomNumber.textContent = `Z = ${totalElectrons}`;

  // Reset classes and apply new ones
  $atomSymbol.className = 'atom-core-symbol';
  $atomNumber.className = 'atom-core-number';
  $atomName.className = 'atom-core-name';
  if (hasElement) {
    $atomSymbol.classList.add(`color-${element.block}`);
    $atomNumber.classList.add(`color-${element.block}`);
    $atomName.classList.add(`color-${element.block}`);
  }

  if ($atomVisual) {
    const shellLabel = shells.length === 0 ? 'cap capa activa' : shells.length === 1 ? '1 capa' : `${shells.length} capes`;
    const electronsLabel = totalElectrons === 1 ? '1 electró' : `${totalElectrons} electrons`;
    const shellDetails = shells.length
      ? shells.map(shell => `n=${shell.n} (${shell.electrons}/${shell.max})`).join(', ')
      : 'sense capes actives';
    const ariaParts = hasElement
      ? [`tom de ${displayName}`, electronsLabel, shellLabel, shellDetails]
      : [electronsLabel, shellDetails];
    $atomVisual.setAttribute('aria-label', ariaParts.join('. '));
  }
}

function formatOxidationState(value) {
  if (Number.isNaN(value)) return '';
  if (value > 0) return `+${value}`;
  if (value < 0) return `${value}`;
  return '0';
}

function updateShellOctetState(occArr) {
  if (!Array.isArray(occArr)) return;
  SHELL_SP_ORBITALS.forEach((orbitals, shellNumber) => {
    const label = document.querySelector(`.row-label[data-shell="${shellNumber}"]`);
    if (!label) return;
    const sIndex = orbitals.s;
    const pIndex = orbitals.p;
    const hasFullS = typeof sIndex === 'number' && occArr[sIndex] && occArr[sIndex].e === occArr[sIndex].max;
    const hasFullP = typeof pIndex === 'number' && occArr[pIndex] && occArr[pIndex].e === occArr[pIndex].max;
    const hasOctet = hasFullS && (typeof pIndex !== 'number' ? true : hasFullP);
    label.classList.toggle('row-label-octet', hasOctet);
  });
}

function updateOxidationStates(element) {
  if (!$oxidationStates) return;
  if (!element) {
    $oxidationStates.innerHTML = '<span class="oxidation-placeholder">Selecciona un element per veure les valències d\'oxidació</span>';
    return;
  }
  const data = OXIDATION_DATA.get(element.Z);
  if (!data) {
    $oxidationStates.innerHTML = '<span class="oxidation-placeholder">Sense dades disponibles per a aquest element</span>';
    return;
  }
  const { states, common } = data;
  if (!states || states.length === 0) {
    $oxidationStates.innerHTML = '<span class="oxidation-placeholder">Sense valències conegudes</span>';
    return;
  }
  const commonSet = new Set(common);
  const chips = states.map((state) => {
    const classes = ['oxidation-chip'];
    if (state > 0) classes.push('positive');
    else if (state < 0) classes.push('negative');
    else classes.push('zero');
    if (commonSet.has(state)) classes.push('common');
    const title = commonSet.has(state) ? 'València habitual' : 'València menys freqüent';
    return `<span class="${classes.join(' ')}" title="${title}">${formatOxidationState(state)}</span>`;
  }).join('');
  if (!chips) {
    $oxidationStates.innerHTML = '<span class="oxidation-placeholder">Sense valències disponibles</span>';
    return;
  }
  $oxidationStates.innerHTML = chips;
}

function updateOrbitalDiagram(occ) {
  // neteja i emplena puntets
  const allDots = $diagram.querySelectorAll('.dot');
  allDots.forEach(d => d.classList.remove('filled','next'));
  occ.forEach((o, oi) => {
    const dots = $diagram.querySelectorAll(`.dot[data-oi="${oi}"]`);
    dots.forEach((d, idx) => { if (idx < o.e) d.classList.add('filled'); });
    const pairCount = Math.ceil(o.max / 2);
    for (let pairIndex = 0; pairIndex < pairCount; pairIndex++) {
      const pair = $diagram.querySelector(`.dot-pair[data-oi="${oi}"][data-pi="${pairIndex}"]`);
      if (!pair) continue;
      pair.classList.remove('full', 'partial', 'empty');
      const electronsInPair = Math.max(0, Math.min(2, o.e - pairIndex * 2));
      const pairCapacity = Math.min(2, o.max - pairIndex * 2);
      if (electronsInPair === 0) pair.classList.add('empty');
      else if (electronsInPair >= pairCapacity) pair.classList.add('full');
      else pair.classList.add('partial');
    }
  });
  updateShellOctetState(occ);
  const next = getNextSlot(occ);
  if (next) {
    const d = $diagram.querySelector(`.dot[data-oi="${next.oi}"][data-ei="${next.ei}"]`);
    if (d) d.classList.add('next');
  }
}

function findElementByZ(z) {
  return ELEMENTS.find(e => e.Z === z) || null;
}

function highlightElement(el) {
  // Treu selecció prèvia
  document.querySelectorAll('.element-tile.selected').forEach(n => n.classList.remove('selected'));
  if (!el) return;

  // Decideix on ressaltar
  const isLn = isLanthanide(el.Z) || el.Z === 57; // incloem La a la fila f també
  const isAn = isActinide(el.Z) || el.Z === 89;   // incloem Ac a la fila f també

  // Principal
  const main = document.getElementById(`el-main-${el.Z}`);
  if (main) main.classList.add('selected');

  // f-bloc: si sescau
  if (isLn) {
    const t = document.getElementById(`el-f-${el.Z}`);
    if (t) t.classList.add('selected');
  }
  if (isAn) {
    const t = document.getElementById(`el-f-${el.Z}`);
    if (t) t.classList.add('selected');
  }
}

function coordsText(el) {
  if (!el) return '–';
  if (el.block === 'f') {
    const serie = el.period === 6 ? 'lantànids' : el.period === 7 ? 'actínids' : 'bloc f';
    return `període ${el.period} · bloc f (${serie})${el.group ? ` · grup ${el.group}` : ''}`;
  }
  return `període ${el.period} · grup ${el.group}`;
}

function updateAll() {
  // Estat de comptador i element
  $count.textContent = String(Z);
  const occ = computeOccupancy(Z);
  $configFull.innerHTML = Z === 0 ? '–' : configToString(occ);
  $configNoble.innerHTML = Z === 0 ? '–' : configToNobleString(Z);
  updateOrbitalDiagram(occ);

  const el = findElementByZ(Z);
  $elTitle.textContent = el ? `${el.Z} · ${el.s}` : '';
  $coords.textContent = el ? coordsText(el) : '';
  updateAtomVisual(occ, el);
  highlightElement(el);
  updateOxidationStates(el);
  if ($aufbauDisplay) $aufbauDisplay.innerHTML = configToColoredString(occ);
}
