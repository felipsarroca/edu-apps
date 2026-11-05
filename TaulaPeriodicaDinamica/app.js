/* Taula periòdica dinàmica
   Dades: data/elements.js (PeriodicTableJSON), data/propietats.js (dades revisades),
   data/noms_ca.js i data/summaries_ca.js. */
(() => {
  'use strict';

  const D = window.PT_DADES || {};
  const NAMES = window.PT_NOMS_CA || {};
  const SUMMARIES = window.SUMMARIES_CA || {};
  const ELS = ((window.PT_ELEMENTS && window.PT_ELEMENTS.elements) || []).filter(e => e.number <= 118);
  const root = document.documentElement;

  /* ---------- emmagatzematge (tolerant a navegadors que el bloquegen) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('tpd:' + k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('tpd:' + k, v); } catch (e) { /* sense emmagatzematge */ } }
  };

  const state = {
    mode: store.get('mode', 'families'),
    temp: store.get('temp', 'C'),
    yearLimit: 2010,
    focus: null,       // categoria destacada a la llegenda
    hover: null,       // element de la vista prèvia
    compare: null,     // array de símbols quan el mode comparació és actiu
    quiz: null         // estat del repte
  };

  /* ================= format de nombres (convencions catalanes) ================= */
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const minus = s => String(s).replace(/^-/, '−');
  const comma = s => String(s).replace('.', ',');
  function fmtFixed(v, d) { return minus(comma(v.toFixed(d))); }
  function fmtSig(v, sig = 3) {
    if (v === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(v)));
    if (e >= 5 || e <= -4) {
      const m = v / Math.pow(10, e);
      return minus(comma(String(Number(m.toPrecision(sig))))) + '·10' + String(e).split('').map(c => SUP[c]).join('');
    }
    return minus(comma(String(Number(v.toPrecision(sig)))));
  }
  const fmtPct = v => fmtSig(v, 3) + ' %';
  function fmtTemp(k, unit = state.temp) {
    return unit === 'K' ? Math.round(k) + ' K' : minus(Math.round(k - 273.15)) + ' °C';
  }
  function fmtYear(y) {
    if (y < 0) return 'c. ' + (-y) + ' aC';
    if (y < 1600) return 'c. ' + y;
    return String(y);
  }
  const fmtOx = arr => arr.slice().sort((a, b) => a - b).map(n => n > 0 ? '+' + n : n === 0 ? '0' : minus(n)).join(', ');
  /* durades: tria la unitat més entenedora (anys, dies, hores, minuts, segons, mil·lisegons) */
  const YEAR_S = 31557600; // any julià, en segons
  const DUR_UNITS = [[YEAR_S, 'a', 'anys'], [86400, 'd', 'dies'], [3600, 'h', 'hores'], [60, 'min', 'minuts'], [1, 's', 'segons'], [1e-3, 'ms', 'mil·lisegons']];
  function numCa(x) {
    const r = Number(x.toPrecision(3));
    if (r >= 1e3 && Number.isInteger(r)) return String(r).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return comma(String(r));
  }
  function fmtDur(sec, long = false) {
    const [f, short, word] = DUR_UNITS.find(([u]) => sec >= u) || DUR_UNITS[DUR_UNITS.length - 1];
    const v = sec / f;
    if (short === 'a' && v >= 1e5) {
      if (long && v < 1e12) return numCa(v / 1e6) + ' milions d\'anys';
      return fmtSig(v, 2) + (long ? ' anys' : ' a');
    }
    return numCa(v) + ' ' + (long ? word : short);
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ================= consultes de dades ================= */
  const nameOf = el => NAMES[el.symbol] || el.name;
  const isPredicted = el => el.number >= 104;           // propietats predites, no mesurades
  const noBulk = el => el.number >= 100;                // no se n'ha obtingut mai una mostra visible
  const inList = (list, s) => Array.isArray(list) && list.includes(s);
  const groupOf = el => (el.ypos <= 7 ? el.xpos : null);

  function family(el) {
    const s = el.symbol, z = el.number;
    for (const [k, list] of Object.entries(D.families || {})) if (list.includes(s)) return k;
    if (z >= 57 && z <= 71) return 'lantanid';
    if (z >= 89 && z <= 103) return 'actinid';
    return 'transicio';
  }
  const isMetalFamily = f => ['alcali', 'alcalinoterri', 'transicio', 'lantanid', 'actinid', 'altresMetalls'].includes(f);

  const val = {
    en: el => (isPredicted(el) ? null : (typeof el.electronegativity_pauling === 'number' ? el.electronegativity_pauling : null)),
    ion: el => (isPredicted(el) ? null : (Array.isArray(el.ionization_energies) && typeof el.ionization_energies[0] === 'number' ? el.ionization_energies[0] : null)),
    radius: el => (typeof (D.radi || {})[el.symbol] === 'number' ? D.radi[el.symbol] : null),
    isGas: el => el.phase === 'Gas',
    densityRaw: el => (noBulk(el) || typeof el.density !== 'number' ? null : el.density),
    density: el => { const d = val.densityRaw(el); return d === null ? null : (val.isGas(el) ? d / 1000 : d); },
    melt: el => (noBulk(el) || typeof el.melt !== 'number' ? null : el.melt),
    boil: el => (noBulk(el) || typeof el.boil !== 'number' ? null : el.boil),
    sigma: el => { const r = (D.resistivitat || {})[el.symbol]; if (typeof r === 'number') return 1e9 / r; const s = (D.semiconductors || {})[el.symbol]; return typeof s === 'number' ? s : null; },
    thermal: el => (typeof (D.termica || {})[el.symbol] === 'number' ? D.termica[el.symbol] : null),
    abund: (key, el) => (typeof ((D[key] || {})[el.symbol]) === 'number' ? D[key][el.symbol] : null),
    ox: el => (D.oxidacio || {})[el.symbol] || null,
    year: el => ((D.descobriment || {})[el.symbol] || [null])[0],
    discoverer: el => ((D.descobriment || {})[el.symbol] || [null, null])[1],
    /* període de semidesintegració en segons (null si té isòtops estables o és el bismut) */
    halfData: el => (D.semivida || {})[el.symbol] || null,
    halfSec: el => { const h = val.halfData(el); return h ? h[0] * HALF_UNIT[h[1]] : null; },
    halfLife: el => (el.symbol === 'Bi' ? null : val.halfSec(el))
  };
  const HALF_UNIT = { ms: 1e-3, s: 1, min: 60, h: 3600, d: 86400, a: YEAR_S };
  const DECAY_MODE = { 'α': 'desintegració alfa', 'β⁻': 'desintegració beta', CE: 'captura electrònica', FE: 'fissió espontània' };
  const supNum = n => String(n).split('').map(c => SUP[c]).join('');
  const isotopeOf = el => { const h = val.halfData(el); return h ? supNum(h[2]) + el.symbol : ''; };
  // «el radi-226», «l'urani-238»
  const isoName = el => { const n = nameOf(el).toLowerCase(), h = val.halfData(el); return (/^[aeiouàèéíòóúh]/.test(n) ? 'l’' : 'el ') + n + '-' + (h ? h[2] : ''); };
  function halfCat(el) {
    if (el.symbol === 'Bi') return 'quasi';
    return val.halfData(el) ? null : 'estable';
  }
  function halfText(el) {
    const cat = halfCat(el), h = val.halfData(el);
    if (cat === 'estable') return 'Estable (té isòtops que no es desintegren)';
    const base = `${fmtDur(val.halfSec(el), true)} (${isotopeOf(el)}, ${DECAY_MODE[h[3]] || h[3]})`;
    return cat === 'quasi' ? base + ' · pràcticament estable' : base;
  }
  const fmtDensity = el => { const d = val.densityRaw(el); return d === null ? '—' : fmtSig(d, 3) + (val.isGas(el) ? ' g/L' : ' g/cm³'); };

  /* ================= definició dels modes ================= */
  const NODATA = { k: 'nodata', label: 'Sense dades', color: null };
  const FAMILY_CATS = [
    { k: 'alcali', label: 'Metalls alcalins', color: '#fca5a5' },
    { k: 'alcalinoterri', label: 'Metalls alcalinoterris', color: '#fdba74' },
    { k: 'transicio', label: 'Metalls de transició', color: '#fde68a' },
    { k: 'altresMetalls', label: 'Altres metalls (bloc p)', color: '#93c5fd' },
    { k: 'semimetall', label: 'Semimetalls', color: '#6ee7b7' },
    { k: 'noMetall', label: 'No-metalls', color: '#d9f99d' },
    { k: 'halogen', label: 'Halògens', color: '#c4b5fd' },
    { k: 'gasNoble', label: 'Gasos nobles', color: '#f9a8d4' },
    { k: 'lantanid', label: 'Lantànids', color: '#a5f3fc' },
    { k: 'actinid', label: 'Actínids', color: '#e7c9a9' }
  ];
  const FAMILY_LABEL = Object.fromEntries(FAMILY_CATS.map(c => [c.k, c.label]));
  const PREDICTED_NOTE = 'Elements 104–118 (vora discontínua): només se n\'han obtingut uns quants àtoms; la classificació i les propietats són predites.';

  function reactivity(el) {
    const f = family(el), s = el.symbol;
    if (el.number >= 99) return 'nodata';
    if (f === 'gasNoble') return 'inert';
    if (f === 'alcali' || s === 'F' || s === 'Cl') return 'molt';
    if (['Ca', 'Sr', 'Ba', 'Ra', 'Br', 'I', 'O', 'P'].includes(s)) return 'bastant';
    if (['Cu', 'Ag', 'Au', 'Pt', 'Pd', 'Rh', 'Ir', 'Os', 'Ru', 'Hg', 'N'].includes(s)) return 'poc';
    return 'moderat';
  }
  function condClass(el) {
    if (inList(D.aillants, el.symbol)) return 'aillant';
    if (el.symbol in (D.semiconductors || {})) return 'semi';
    const s = val.sigma(el);
    if (s === null) return 'nodata';
    if (s >= 1e7) return 'molt';
    if (s >= 1e6) return 'bo';
    return 'moderat';
  }
  function yearCat(y) {
    if (y === null) return 'nodata';
    if (y < 500) return 'antic';
    if (y < 1650) return 'mitja';
    if (y < 1800) return 'c18';
    if (y < 1850) return 'c19a';
    if (y < 1900) return 'c19b';
    if (y < 1950) return 'c20a';
    return 'c20b';
  }

  const MODES = {
    blank: {
      label: 'En blanc', kind: 'none',
      desc: 'Taula sense colors per localitzar els elements pel nombre atòmic i el símbol. Clica qualsevol element per veure\'n la fitxa.'
    },

    /* --- classificació --- */
    families: {
      label: 'Famílies', group: 'Classificació', kind: 'cat', cats: FAMILY_CATS, catOf: family,
      desc: 'Els elements d\'una mateixa família tenen propietats químiques semblants perquè tenen el mateix nombre d\'electrons de valència.',
      note: 'L\'hidrogen és un no-metall, tot i encapçalar el grup 1. ' + PREDICTED_NOTE
    },
    metallic: {
      label: 'Metalls, semimetalls i no-metalls', group: 'Classificació', kind: 'cat',
      cats: [
        { k: 'metall', label: 'Metalls', color: '#7dd3fc' },
        { k: 'semimetall', label: 'Semimetalls', color: '#6ee7b7' },
        { k: 'nometall', label: 'No-metalls', color: '#fcd34d' }
      ],
      catOf: el => { const f = family(el); return isMetalFamily(f) ? 'metall' : f === 'semimetall' ? 'semimetall' : 'nometall'; },
      desc: 'Una línia en escala separa els metalls (a l\'esquerra) dels no-metalls (a la dreta). Els semimetalls tenen propietats intermèdies.',
      trend: { h: ['←', 'Caràcter metàl·lic: augmenta cap a l\'esquerra'], v: ['↓', 'i cap avall del grup'] },
      note: 'Po i At tenen una classificació debatuda. ' + PREDICTED_NOTE
    },
    blocks: {
      label: 'Blocs electrònics (s, p, d, f)', group: 'Classificació', kind: 'cat',
      cats: [
        { k: 's', label: 'Bloc s', color: '#7dd3fc' },
        { k: 'p', label: 'Bloc p', color: '#f9a8d4' },
        { k: 'd', label: 'Bloc d', color: '#86efac' },
        { k: 'f', label: 'Bloc f', color: '#fcd34d' }
      ],
      catOf: el => (el.block || 'nodata').toLowerCase(),
      desc: 'El bloc indica el tipus d\'orbital (s, p, d o f) on entra l\'últim electró segons la configuració electrònica.',
      note: 'L\'heli és del bloc s, però se situa al grup 18. La posició de La, Ac, Lu i Lr és objecte de debat a la IUPAC.'
    },
    state: {
      label: 'Estat físic a 25 °C', group: 'Classificació', kind: 'cat',
      cats: [
        { k: 'Solid', label: 'Sòlid', color: '#86efac' },
        { k: 'Liquid', label: 'Líquid', color: '#60a5fa' },
        { k: 'Gas', label: 'Gas', color: '#fde047' },
        { k: 'nodata', label: 'Desconegut', color: null }
      ],
      catOf: el => (noBulk(el) ? 'nodata' : el.phase || 'nodata'),
      desc: 'Estat de cada element a 25 °C i 1 atm. Només el brom i el mercuri són líquids; el gal·li i el cesi es fonen a poc més de 28 °C.',
      note: 'Dels elements 100–118 no se n\'ha obtingut mai una mostra visible: l\'estat és desconegut.'
    },

    /* --- estructura i enllaç --- */
    valence: {
      label: 'Estats d\'oxidació (valències)', group: 'Estructura i enllaç', kind: 'cat',
      cats: [
        { k: 'pos', label: 'Només positius', color: '#fca5a5' },
        { k: 'neg', label: 'Només negatius', color: '#93c5fd' },
        { k: 'both', label: 'Positius i negatius', color: '#d8b4fe' },
        { k: 'zero', label: 'Només 0', color: '#d1d5db' },
        NODATA
      ],
      catOf: el => { const a = val.ox(el); if (!a) return 'nodata'; const p = a.some(n => n > 0), n = a.some(n => n < 0); return p && n ? 'both' : p ? 'pos' : n ? 'neg' : 'zero'; },
      metaOf: el => { const a = val.ox(el); return a ? fmtOx(a) : ''; },
      desc: 'Nombres d\'oxidació habituals que es fan servir en formulació inorgànica. Els metalls només en tenen de positius.',
      note: 'Selecció escolar: molts elements tenen altres estats d\'oxidació menys freqüents.'
    },
    electronegativity: {
      label: 'Electronegativitat', group: 'Estructura i enllaç', kind: 'num', value: val.en,
      fmt: v => fmtFixed(v, 2), legendFmt: v => fmtFixed(v, 1),
      desc: 'Tendència d\'un àtom a atreure els electrons d\'un enllaç. El fluor és l\'element més electronegatiu (3,98).',
      trend: { h: ['→', 'Augmenta al llarg del període'], v: ['↑', 'i cap amunt del grup'] },
      note: 'He, Ne i Ar no tenen valor a l\'escala de Pauling perquè no formen compostos estables.',
      source: 'Escala de Pauling. Font: PeriodicTableJSON.'
    },
    ionization: {
      label: 'Energia d\'ionització', group: 'Estructura i enllaç', kind: 'num', value: val.ion,
      fmt: v => Math.round(v) + ' kJ/mol', legendFmt: v => Math.round(v) + ' kJ/mol',
      desc: 'Energia necessària per arrencar l\'electró més extern d\'un àtom en estat gasós (primera energia d\'ionització).',
      trend: { h: ['→', 'Augmenta al llarg del període'], v: ['↑', 'i cap amunt del grup'] },
      source: 'Primera energia d\'ionització (kJ/mol). Font: PeriodicTableJSON (NIST).'
    },
    atomicRadius: {
      label: 'Radi atòmic', group: 'Estructura i enllaç', kind: 'num', value: val.radius,
      fmt: v => v + ' pm', legendFmt: v => Math.round(v) + ' pm',
      desc: 'Mida aproximada de l\'àtom, en picòmetres (1 pm = 10⁻¹² m).',
      trend: { h: ['←', 'Augmenta cap a l\'esquerra del període'], v: ['↓', 'i cap avall del grup'] },
      source: 'Radi empíric (Slater, 1964); gasos nobles: radi calculat (Clementi, 1967).'
    },

    /* --- propietats físiques --- */
    density: {
      label: 'Densitat', group: 'Propietats físiques', kind: 'num', value: val.density,
      fmt: (v, el) => fmtDensity(el), legendFmt: v => (v < 0.01 ? '≈ 0' : fmtSig(v, 2)) + ' g/cm³',
      desc: 'Massa per unitat de volum. L\'osmi (22,6 g/cm³) és l\'element més dens.',
      note: 'Els gasos es donen en g/L (0 °C, 1 atm): 1 g/L = 0,001 g/cm³.',
      source: 'Font: PeriodicTableJSON.'
    },
    meltPoint: {
      label: 'Punt de fusió', group: 'Propietats físiques', kind: 'num', value: val.melt, temp: true,
      fmt: v => fmtTemp(v), legendFmt: v => fmtTemp(v),
      desc: 'Temperatura a què el sòlid passa a líquid a 1 atm. El tungstè té el punt de fusió més alt dels metalls.',
      note: 'El carboni i l\'arsènic subliment a pressió atmosfèrica; l\'heli només se solidifica a pressió elevada.',
      source: 'Font: PeriodicTableJSON.'
    },
    boilPoint: {
      label: 'Punt d\'ebullició', group: 'Propietats físiques', kind: 'num', value: val.boil, temp: true,
      fmt: v => fmtTemp(v), legendFmt: v => fmtTemp(v),
      desc: 'Temperatura a què el líquid bull a 1 atm. L\'heli té el punt d\'ebullició més baix (−269 °C).',
      source: 'Font: PeriodicTableJSON.'
    },
    condElectric: {
      label: 'Conductivitat elèctrica', group: 'Propietats físiques', kind: 'cat',
      cats: [
        { k: 'molt', label: 'Molt bons conductors (≥ 10⁷ S/m)', color: '#ef4444' },
        { k: 'bo', label: 'Bons conductors (10⁶–10⁷ S/m)', color: '#fb923c' },
        { k: 'moderat', label: 'Conductors moderats (< 10⁶ S/m)', color: '#fde047' },
        { k: 'semi', label: 'Semiconductors', color: '#a78bfa' },
        { k: 'aillant', label: 'Aïllants', color: '#60a5fa' },
        NODATA
      ],
      catOf: condClass,
      metaOf: el => { const s = val.sigma(el); return s !== null ? fmtSig(s, 3) : (condClass(el) === 'semi' ? 'variable' : ''); },
      desc: 'Capacitat de conduir el corrent elèctric, en siemens per metre (S/m). L\'argent és el millor conductor.',
      note: 'Valors a 20 °C. Carboni: grafit (el diamant és aïllant). Silici i germani: purs (intrínsecs).',
      source: 'Font: CRC Handbook of Chemistry and Physics.'
    },
    condThermal: {
      label: 'Conductivitat tèrmica', group: 'Propietats físiques', kind: 'num', value: val.thermal, log: true,
      fmt: v => fmtSig(v, 3), legendFmt: v => fmtSig(v, 1) + ' W/m·K',
      desc: 'Capacitat de conduir la calor, en W/m·K. Els metalls condueixen molt millor que els gasos.',
      note: 'Valors a 300 K. Escala logarítmica: cada pas de color multiplica el valor.',
      source: 'Font: CRC Handbook of Chemistry and Physics.'
    },
    ferromagnetism: {
      label: 'Ferromagnetisme', group: 'Propietats físiques', kind: 'cat',
      cats: [
        { k: 'si', label: 'Ferromagnètic a temperatura ambient', color: '#38bdf8' },
        { k: 'fred', label: 'Ferromagnètic per sota de 20 °C', color: '#a5f3fc' },
        { k: 'no', label: 'No ferromagnètic', color: '#d1d5db' }
      ],
      catOf: el => (inList(D.ferromagnetics, el.symbol) ? 'si' : el.symbol === 'Gd' ? 'fred' : 'no'),
      desc: 'Els materials ferromagnètics són atrets amb força pels imants i es poden imantar.',
      note: 'Altres lantànids (Tb, Dy) són ferromagnètics només a temperatures molt baixes.'
    },

    /* --- química i vida --- */
    reactivity: {
      label: 'Reactivitat', group: 'Química i vida', kind: 'cat',
      cats: [
        { k: 'molt', label: 'Molt reactius', color: '#ef4444' },
        { k: 'bastant', label: 'Bastant reactius', color: '#fb923c' },
        { k: 'moderat', label: 'Reactivitat moderada', color: '#fde047' },
        { k: 'poc', label: 'Poc reactius', color: '#86efac' },
        { k: 'inert', label: 'Gairebé inerts', color: '#cbd5e1' },
        NODATA
      ],
      catOf: reactivity,
      desc: 'Facilitat amb què l\'element reacciona amb l\'aire, l\'aigua o els àcids. Els alcalins i els halògens són els més reactius.',
      note: 'Classificació qualitativa i aproximada: la reactivitat depèn del medi i de la forma de l\'element. El nitrogen és poc reactiu perquè la molècula N₂ és molt estable.'
    },
    bioessential: {
      label: 'Bioelements', group: 'Química i vida', kind: 'cat',
      cats: [
        { k: 'primari', label: 'Primaris (≈ 96 % de la massa)', color: '#22c55e' },
        { k: 'secundari', label: 'Secundaris', color: '#86efac' },
        { k: 'oligo', label: 'Oligoelements essencials', color: '#bef264' },
        { k: 'possible', label: 'Possiblement essencials', color: '#fef08a' },
        { k: 'no', label: 'No essencials', color: '#e5e7eb' }
      ],
      catOf: el => { const b = D.bioelements || {}; for (const k of ['primari', 'secundari', 'oligo', 'possible']) if (inList(b[k], el.symbol)) return k; return 'no'; },
      desc: 'Elements que formen part dels éssers vius. Els primaris (C, H, O, N, P, S) formen les biomolècules.',
      note: 'Els oligoelements són imprescindibles en quantitats molt petites; en excés poden ser tòxics.'
    },
    toxic: {
      label: 'Toxicitat', group: 'Química i vida', kind: 'cat',
      cats: [
        { k: 'alta', label: 'Molt tòxics', color: '#ef4444' },
        { k: 'compostos', label: 'Tòxics en alguns compostos o en excés', color: '#fdba74' },
        { k: 'no', label: 'No destacats', color: '#e5e7eb' }
      ],
      catOf: el => (inList((D.toxicitat || {}).alta, el.symbol) ? 'alta' : inList((D.toxicitat || {}).compostos, el.symbol) ? 'compostos' : 'no'),
      desc: 'Selecció d\'elements amb toxicitat química destacada, com els metalls pesants (mercuri, plom, cadmi).',
      note: 'La toxicitat depèn de la dosi i de la forma química. Per al perill radioactiu, vegeu el mode Radioactivitat.'
    },
    radioactive: {
      label: 'Radioactivitat', group: 'Química i vida', kind: 'cat',
      cats: [
        { k: 'estable', label: 'Té isòtops estables', color: '#86efac' },
        { k: 'natural', label: 'Radioactiu natural', color: '#fdba74' },
        { k: 'artificial', label: 'Radioactiu artificial', color: '#f87171' }
      ],
      catOf: el => { const z = el.number; if (z === 43 || z === 61 || z >= 93) return 'artificial'; if (z >= 84) return 'natural'; return 'estable'; },
      desc: 'Els elements sense isòtops estables emeten radiació. Del poloni (84) en endavant, tots són radioactius.',
      note: 'Tc i Pm no tenen isòtops estables. Se\'n troben traces a la natura, com també de Np i Pu. El bismut es considera estable a la pràctica.'
    },
    halfLife: {
      label: 'Període de semidesintegració', group: 'Química i vida', kind: 'num', log: true,
      value: val.halfLife,
      fmt: v => fmtDur(v), longFmt: v => fmtDur(v, true), legendFmt: v => fmtDur(v),
      cats: [
        { k: 'estable', label: 'Estables', color: null },
        { k: 'quasi', label: 'Pràcticament estable (Bi)', color: '#94a3b8' }
      ],
      catOf: halfCat,
      metaOf: el => (el.symbol === 'Bi' ? fmtDur(val.halfSec(el)) : 'estable'),
      valueLabel: 'Radioactius',
      refs: [[1, '1 s'], [86400, '1 dia'], [1000 * YEAR_S, '1.000 anys'], [4.54e9 * YEAR_S, 'edat de la Terra', 1]],
      desc: 'Temps que triga a desintegrar-se la meitat dels àtoms d\'una mostra (isòtop més estable de cada element). Exemple: d\'1 g de radi-226, al cap de 1.600 anys en queda 0,5 g; al cap de 3.200 anys, 0,25 g.',
      trend: { h: ['→', 'Del plom (82) endavant, cap element és estable'], v: ['↓', 'Com més pesant és el nucli, menys dura'] },
      note: 'Escala logarítmica: cada color multiplica el temps. a = anys, d = dies, h = hores, min = minuts, s = segons, ms = mil·lisegons. Clica un element per veure\'n la corba de desintegració. Els valors dels elements 104–118 són aproximats.',
      source: 'Font: NUBASE2020 (Kondev et al., 2021) i IAEA LiveChart.'
    },

    /* --- abundància --- */
    earth: {
      label: 'Escorça terrestre', group: 'Abundància (% en massa)', kind: 'num', log: true,
      value: el => val.abund('escorca', el), fmt: v => fmtPct(v), legendFmt: v => fmtPct(v),
      desc: 'Percentatge en massa de cada element a l\'escorça terrestre. L\'oxigen i el silici en formen el 74 %.',
      note: 'Escala logarítmica. En gris, elements sense dades o només en traces.',
      source: 'Font: CRC Handbook of Chemistry and Physics.'
    },
    body: {
      label: 'Cos humà', group: 'Abundància (% en massa)', kind: 'num', log: true,
      value: el => val.abund('cos', el), fmt: v => fmtPct(v), legendFmt: v => fmtPct(v),
      desc: 'Percentatge en massa en una persona adulta. L\'oxigen, el carboni, l\'hidrogen i el nitrogen en formen el 96 %.',
      note: 'Escala logarítmica. En gris, elements absents o només en traces.',
      source: 'Font: J. Emsley, The Elements (adult de 70 kg).'
    },
    universe: {
      label: 'Univers', group: 'Abundància (% en massa)', kind: 'num', log: true,
      value: el => val.abund('univers', el), fmt: v => fmtPct(v), legendFmt: v => fmtPct(v),
      desc: 'Percentatge en massa a la nostra galàxia. L\'hidrogen i l\'heli, formats al Big Bang, en són gairebé el 98 %.',
      note: 'Escala logarítmica. En gris, elements molt minoritaris (sense dades).',
      source: 'Font: K. Croswell (1996), fracció en massa a la Via Làctia.'
    },

    /* --- història --- */
    discovery: {
      label: 'Any de descobriment', group: 'Història', kind: 'cat',
      cats: [
        { k: 'antic', label: 'Antiguitat', color: '#d6a35c' },
        { k: 'mitja', label: 'Edat mitjana i moderna (500–1649)', color: '#fcd34d' },
        { k: 'c18', label: '1650–1799', color: '#bef264' },
        { k: 'c19a', label: '1800–1849', color: '#6ee7b7' },
        { k: 'c19b', label: '1850–1899', color: '#7dd3fc' },
        { k: 'c20a', label: '1900–1949', color: '#a5b4fc' },
        { k: 'c20b', label: 'Des de 1950', color: '#f0abfc' }
      ],
      catOf: el => yearCat(val.year(el)),
      metaOf: el => { const y = val.year(el); return y === null ? '' : fmtYear(y); },
      desc: 'Any en què l\'element es va identificar o aïllar. Mou el control lliscant per veure com creix la taula al llarg de la història.',
      note: 'Els anys anteriors al 1600 són aproximats. Mendeléiev va publicar la seva taula el 1869.',
      source: 'Font: taula d\'anys de descobriment (Viquipèdia).'
    }
  };
  const MODE_KEYS = Object.keys(MODES);
  if (!MODES[state.mode]) state.mode = 'families';

  /* ================= colors ================= */
  const SEQ = ['#2563eb', '#0ea5e9', '#22c55e', '#eab308', '#f97316', '#dc2626'];
  const hexToRgb = h => { const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0]; };
  function paletteAt(t) {
    t = Math.min(1, Math.max(0, t));
    const x = t * (SEQ.length - 1), i = Math.min(SEQ.length - 2, Math.floor(x)), f = x - i;
    const a = hexToRgb(SEQ[i]), b = hexToRgb(SEQ[i + 1]);
    return '#' + a.map((c, j) => Math.round(c + (b[j] - c) * f).toString(16).padStart(2, '0')).join('');
  }
  function fgFor(hex) {
    const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const [r, g, b] = hexToRgb(hex);
    const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    // contrast amb negre (L+0.05)/0.05 vs amb blanc 1.05/(L+0.05)
    return (L + 0.05) / 0.05 >= 1.05 / (L + 0.05) ? '#111318' : '#ffffff';
  }
  function setBG(node, color) {
    node.style.background = color;
    node.style.setProperty('--cell-fg', fgFor(color));
  }
  function buildScale(valueFn, log, els = ELS) {
    const vals = els.map(valueFn).filter(v => typeof v === 'number' && (!log || v > 0));
    if (!vals.length) return null;
    const f = log ? Math.log10 : (v => v);
    const lo = f(Math.min(...vals)), hi = f(Math.max(...vals));
    const inv = log ? (x => Math.pow(10, x)) : (x => x);
    return {
      min: inv(lo), max: inv(hi), mid: inv((lo + hi) / 2),
      color: v => paletteAt(hi === lo ? 0.5 : (f(v) - lo) / (hi - lo))
    };
  }

  /* ================= construcció de la graella ================= */
  const grid = document.getElementById('periodic-grid');
  const cells = {};
  let infoPanel = null;

  function addLabel(cls, text, col, row) {
    const d = document.createElement('div');
    d.className = cls; d.textContent = text;
    d.style.gridColumn = col; d.style.gridRow = row;
    d.setAttribute('aria-hidden', 'true');
    grid.appendChild(d);
    return d;
  }

  function createGrid() {
    grid.innerHTML = '';
    for (let g = 1; g <= 18; g++) addLabel('grid-label-group', g, g + 1, 1);
    for (let p = 1; p <= 7; p++) addLabel('grid-label-period', p, 1, p + 1);
    // referències al bloc f dins del grup 3
    const ref6 = addLabel('fblock-ref', '', 4, 7); ref6.innerHTML = '<span>57–71</span><span>*</span>';
    const ref7 = addLabel('fblock-ref', '', 4, 8); ref7.innerHTML = '<span>89–103</span><span>**</span>';
    const l1 = addLabel('grid-label-f', '* Lantànids', '1 / 4', 10);
    const l2 = addLabel('grid-label-f', '** Actínids', '1 / 4', 11);
    l1.removeAttribute('aria-hidden'); l2.removeAttribute('aria-hidden');

    infoPanel = document.createElement('div');
    infoPanel.className = 'info-panel';
    infoPanel.setAttribute('aria-live', 'polite');
    grid.appendChild(infoPanel);

    for (const el of ELS) {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'cell';
      c.style.gridColumn = el.xpos + 1;
      c.style.gridRow = el.ypos + 1;
      c.dataset.sym = el.symbol;
      c.innerHTML = `<span class="num">${el.number}</span><span class="sym">${el.symbol}</span><span class="name">${esc(nameOf(el))}</span><span class="meta"></span>`;
      c.addEventListener('click', () => onCellClick(el));
      c.addEventListener('mouseenter', () => { state.hover = el.symbol; if (!state.quiz && !state.compare) renderInfo(); });
      c.addEventListener('focus', () => { state.hover = el.symbol; if (!state.quiz && !state.compare) renderInfo(); });
      cells[el.symbol] = c;
      grid.appendChild(c);
    }
  }

  /* ================= pintat ================= */
  function cellState(el, m, scale) {
    if (m.kind === 'cat') {
      const k = m.catOf(el);
      const def = m.cats.find(c => c.k === k);
      return { cat: k, color: def ? def.color : null, meta: m.metaOf ? m.metaOf(el) : '' };
    }
    if (m.kind === 'num') {
      // categories fixes dins d'un mode numèric (p. ex. elements estables)
      const k = m.catOf ? m.catOf(el) : null;
      if (k) { const def = m.cats.find(c => c.k === k); return { cat: k, color: def.color, meta: m.metaOf ? m.metaOf(el) : '' }; }
      const v = m.value(el);
      if (v === null || v === undefined || (m.log && v <= 0) || !scale) return { cat: 'nodata', color: null, meta: '' };
      return { cat: 'value', color: scale.color(v), meta: m.fmt(v, el) };
    }
    return { cat: null, color: null, meta: '' };
  }

  function paint() {
    const q = state.quiz;
    const m = MODES[state.mode];
    const scale = m.kind === 'num' ? buildScale(m.value, m.log) : null;
    const qScale = q ? buildScale(q.prop.value, q.prop.log, q.set.map(s => ELS.find(e => e.symbol === s))) : null;

    for (const el of ELS) {
      const c = cells[el.symbol];
      c.className = 'cell';
      c.style.background = '';
      c.style.removeProperty('--cell-fg');
      let st;
      if (q) {
        const inSet = q.set.includes(el.symbol);
        st = { cat: null, color: null, meta: '' };
        if (!inSet) c.classList.add('dim');
        else if (q.answered) { const v = q.prop.value(el); st = { color: qScale.color(v), meta: q.prop.fmt(v, el) }; }
        if (q.answered && el.symbol === q.answer) c.classList.add('right');
        if (q.answered && el.symbol === q.picked && q.picked !== q.answer) c.classList.add('wrong');
      } else {
        st = cellState(el, m, scale);
        if (m.kind !== 'none' && isPredicted(el)) c.classList.add('predicted');
        if (state.focus && st.cat !== state.focus) c.classList.add('dim');
        if (state.mode === 'discovery') { const y = val.year(el); if (y !== null && y > state.yearLimit) c.classList.add('dim'); }
        if (state.compare && state.compare.includes(el.symbol)) c.classList.add('picked');
      }
      if (st.color) { setBG(c, st.color); c.classList.add('colored'); }
      else if (st.cat === 'nodata') c.style.background = 'var(--nodata)';
      const meta = c.querySelector('.meta');
      meta.textContent = st.meta || '';
      const long = (st.meta || '').length > 12;
      meta.classList.toggle('long', long);
      c.classList.toggle('has-long', long);
      c.setAttribute('aria-label', `${nameOf(el)}, ${el.symbol}, nombre atòmic ${el.number}${st.meta ? ', ' + st.meta : ''}`);
    }
    renderLegend();
    renderInfo();
  }

  /* ================= panell d'informació (espai buit de la taula) ================= */
  function previewHTML(el) {
    if (!el) return '<div class="info-preview empty">Passa per sobre d\'un element per veure\'l aquí</div>';
    const m = MODES[state.mode];
    const st = cellState(el, m, m.kind === 'num' ? buildScale(m.value, m.log) : null);
    let valText = st.meta;
    if (m.kind === 'cat' && st.cat) { const def = m.cats.find(c => c.k === st.cat); if (def) valText = def.label + (st.meta ? ' · ' + st.meta : ''); }
    if (st.cat === 'nodata' && m.kind === 'num') valText = 'Sense dades';
    if (m.kind === 'num' && st.cat === 'value' && m.longFmt) valText = m.longFmt(m.value(el), el);
    if (m.kind === 'num' && m.cats && st.cat !== 'value' && st.cat !== 'nodata') {
      const def = m.cats.find(c => c.k === st.cat); if (def) valText = def.label.replace(/\s*\([^)]*\)$/, '');
    }
    const style = st.color ? `style="background:${st.color};--cell-fg:${fgFor(st.color)}"` : '';
    return `<div class="info-preview" ${style}>
      <span class="num">${el.number}</span><span class="sym">${el.symbol}</span>
      <span class="name">${esc(nameOf(el))}</span><span class="val">${esc(valText || '')}</span></div>`;
  }

  function renderInfo() {
    if (!infoPanel) return;
    const q = state.quiz;
    if (q) {
      const fb = q.answered
        ? (q.picked === q.answer
          ? `<p class="quiz-feedback ok">Correcte! ${esc(nameOf(bySym(q.answer)))}: ${esc(q.prop.longFmt(q.prop.value(bySym(q.answer)), bySym(q.answer)))}.</p>`
          : `<p class="quiz-feedback ko">No és correcte. La resposta és ${esc(nameOf(bySym(q.answer)))} (${esc(q.prop.longFmt(q.prop.value(bySym(q.answer)), bySym(q.answer)))}).</p>`)
        : '<p class="info-text">Clica l\'element que creguis correcte. Pensa en les tendències de la taula!</p>';
      infoPanel.innerHTML = `<div class="info-body">
        <p class="quiz-score">Repte · ${q.score} encerts de ${q.total}</p>
        <p class="quiz-q">${esc(q.text)}</p>${fb}
        <div class="panel-actions">
          ${q.answered ? '<button type="button" class="panel-btn" data-act="next">Següent repte</button>' : ''}
          <button type="button" class="panel-btn secondary" data-act="quit">Surt del repte</button>
        </div></div>`;
      return;
    }
    if (state.compare) {
      const picked = state.compare.map(s => `<strong>${esc(nameOf(bySym(s)))}</strong>`).join(' i ');
      infoPanel.innerHTML = `${previewHTML(state.hover ? bySym(state.hover) : null)}<div class="info-body">
        <p class="info-title">Compara dos elements</p>
        <p class="info-text">${picked ? 'Has triat ' + picked + '. Ara tria el segon element.' : 'Clica dos elements de la taula per comparar-ne les propietats.'}</p>
        <div class="panel-actions"><button type="button" class="panel-btn secondary" data-act="stopcmp">Cancel·la</button></div></div>`;
      return;
    }
    const m = MODES[state.mode];
    const trend = m.trend ? `<div class="trend">
        <span class="trend-box"><span class="trend-arrow">${m.trend.h[0]}</span>${esc(m.trend.h[1])}</span>
        <span class="trend-box"><span class="trend-arrow">${m.trend.v[0]}</span>${esc(m.trend.v[1])}</span></div>` : '';
    infoPanel.innerHTML = `${previewHTML(state.hover ? bySym(state.hover) : null)}<div class="info-body">
      <p class="info-title">${esc(m.label)}</p><p class="info-text">${esc(m.desc)}</p>${trend}</div>`;
  }
  const bySym = s => ELS.find(e => e.symbol === s);

  /* ================= llegenda i opcions ================= */
  function renderLegend() {
    const box = document.getElementById('legend');
    const m = MODES[state.mode];
    let html = '<h2>Llegenda</h2>';
    const q = state.quiz;
    if (q) {
      if (q.answered) {
        const sc = buildScale(q.prop.value, q.prop.log, q.set.map(bySym));
        html += `<div class="gradient" style="background:linear-gradient(90deg, ${SEQ.join(', ')})"></div>
          <div class="ticks"><span>${esc(q.prop.legendFmt(sc.min))}</span><span>${esc(q.prop.legendFmt(sc.max))}</span></div>
          <p class="note">${esc(q.prop.label)} dels elements del repte.</p>`;
      } else html += '<p class="note" style="margin-top:0">Repte en curs: els colors i els valors apareixeran quan responguis.</p>';
      box.innerHTML = html;
      return;
    }
    if (m.kind === 'none') {
      html += '<p class="note" style="margin-top:0">Sense colors: només número atòmic, símbol i nom. Clica un element per obrir-ne la fitxa.</p>';
    } else if (m.kind === 'cat') {
      const counts = {};
      for (const el of ELS) { const k = m.catOf(el); counts[k] = (counts[k] || 0) + 1; }
      html += '<div class="items">';
      for (const c of m.cats) {
        if (!counts[c.k]) continue;
        const sw = c.color ? `background:${c.color}` : 'background:var(--nodata)';
        html += `<button type="button" class="item" data-cat="${c.k}" aria-pressed="${state.focus === c.k}"><span class="swatch" style="${sw}"></span>${esc(c.label)} <span class="count">${counts[c.k]}</span></button>`;
      }
      html += '</div><p class="hint">Clica una categoria per destacar-ne els elements.</p>';
    } else {
      const sc = buildScale(m.value, m.log);
      if (sc) {
        const stops = SEQ.map((c, i) => `${c} ${Math.round(i / (SEQ.length - 1) * 100)}%`).join(', ');
        html += `<div class="gradient" style="background:linear-gradient(90deg, ${stops})"></div>`;
        if (m.refs && m.log) {
          // marques de referència (1 s, 1 dia...) situades a la seva posició de l'escala
          const lo = Math.log10(sc.min), hi = Math.log10(sc.max);
          const two = m.refs.some(r => r[2]);
          html += `<div class="refs${two ? ' two' : ''}">` + m.refs.map(([v, label, row]) => {
            const t = (Math.log10(v) - lo) / (hi - lo);
            if (t < 0 || t > 1) return '';
            const align = t > 0.85 ? 'end' : t < 0.12 ? 'start' : 'mid';
            return `<span class="ref ${align}${row ? ' row1' : ''}" style="left:${(t * 100).toFixed(1)}%"><i></i>${esc(label)}</span>`;
          }).join('') + '</div>';
          html += `<div class="ticks"><span>${esc(m.legendFmt(sc.min))}</span><span>${esc(m.legendFmt(sc.max))}</span></div>`;
        } else {
          html += `<div class="ticks"><span>${esc(m.legendFmt(sc.min))}</span><span>${esc(m.legendFmt(sc.mid))}</span><span>${esc(m.legendFmt(sc.max))}</span></div>`;
        }
      }
      const fixedCat = el => (m.catOf ? m.catOf(el) : null);
      if (m.cats) {
        const counts = {};
        for (const el of ELS) { const k = fixedCat(el); if (k) counts[k] = (counts[k] || 0) + 1; }
        const nVal = ELS.filter(el => !fixedCat(el) && typeof m.value(el) === 'number').length;
        html += '<div class="items">';
        if (m.valueLabel) html += `<button type="button" class="item" data-cat="value" aria-pressed="${state.focus === 'value'}"><span class="swatch" style="background:linear-gradient(90deg, ${SEQ.join(', ')})"></span>${esc(m.valueLabel)} <span class="count">${nVal}</span></button>`;
        for (const c of m.cats) {
          if (!counts[c.k]) continue;
          html += `<button type="button" class="item" data-cat="${c.k}" aria-pressed="${state.focus === c.k}"><span class="swatch" style="background:${c.color || 'var(--bg-blank-cell)'}"></span>${esc(c.label)} <span class="count">${counts[c.k]}</span></button>`;
        }
        html += '</div><p class="hint">Clica una categoria per destacar-ne els elements.</p>';
      }
      const nodata = ELS.filter(el => { if (fixedCat(el)) return false; const v = m.value(el); return v === null || v === undefined; }).length;
      if (nodata) html += `<div class="items"><span class="item"><span class="swatch" style="background:var(--nodata)"></span>Sense dades <span class="count">${nodata}</span></span></div>`;
    }
    if (m.note) html += `<p class="note">${esc(m.note)}</p>`;
    if (m.source) html += `<p class="source">${esc(m.source)}</p>`;
    box.innerHTML = html;
  }

  function renderOptions() {
    const box = document.getElementById('mode-options');
    const m = MODES[state.mode];
    if (m.temp) {
      box.innerHTML = `<div class="opt-row">Unitats:
        <span class="seg" role="group" aria-label="Unitats de temperatura">
          <button type="button" data-temp="C" aria-pressed="${state.temp === 'C'}">°C</button>
          <button type="button" data-temp="K" aria-pressed="${state.temp === 'K'}">K</button>
        </span></div>`;
    } else if (state.mode === 'discovery') {
      box.innerHTML = `<label class="opt-row" for="year-range">Descoberts fins a
        <input id="year-range" type="range" min="1650" max="2010" step="5" value="${state.yearLimit}">
        <output class="year-out" id="year-out">${state.yearLimit >= 2010 ? 'avui' : state.yearLimit}</output></label>`;
    } else box.innerHTML = '';
  }

  function setMode(mode) {
    if (!MODES[mode]) mode = 'families';
    state.mode = mode;
    state.focus = null;
    store.set('mode', mode);
    document.getElementById('mode-select').value = mode;
    renderOptions();
    renderLegend();
    paint();
  }

  function buildSelect() {
    const sel = document.getElementById('mode-select');
    let html = '', group = undefined;
    for (const k of MODE_KEYS) {
      const m = MODES[k];
      if (m.group !== group) {
        if (group) html += '</optgroup>';
        if (m.group) html += `<optgroup label="${esc(m.group)}">`;
        group = m.group;
      }
      html += `<option value="${k}">${esc(m.label)}</option>`;
    }
    if (group) html += '</optgroup>';
    sel.innerHTML = html;
    sel.addEventListener('change', e => setMode(e.target.value));
  }

  /* ================= fitxa de l'element ================= */
  function configHTML(el) {
    const raw = (el.electron_configuration_semantic || el.electron_configuration || '').replace(/^\*/, '');
    return esc(raw).replace(/([spdf])(\d+)/g, '$1<sup>$2</sup>');
  }
  function massText(el) {
    const m = el.atomic_mass;
    if (typeof m !== 'number') return '—';
    return Number.isInteger(m) ? `[${m}]` : fmtFixed(m, 2);
  }
  function catLabel(modeKey, el) {
    const m = MODES[modeKey], k = m.catOf(el), def = m.cats.find(c => c.k === k);
    return def ? def.label.replace(/\s*\([^)]*\)$/, '') : '—';
  }
  function fitxaRows(el) {
    const pred = isPredicted(el) ? ' (predit)' : '';
    const g = groupOf(el);
    const sigma = val.sigma(el);
    const condTxt = catLabel('condElectric', el) + (sigma !== null ? ' · ' + fmtSig(sigma, 3) + ' S/m' : '');
    const th = val.thermal(el);
    const abund = (k, mode) => { const v = val.abund(k, el); return [MODES[mode].label, v === null ? 'traces o sense dades' : fmtPct(v), mode]; };
    const t = (k) => (k === null ? '—' : `${fmtTemp(k, 'C')} (${fmtTemp(k, 'K')})`);
    const y = val.year(el);
    return [
      ['Nombre atòmic (Z)', el.number, 'blank'],
      ['Massa atòmica (u)', massText(el), null],
      ['Grup · període', `${g ? g : (family(el) === 'lantanid' ? 'lantànids' : 'actínids')} · ${el.period}`, null],
      ['Bloc', (el.block || '—').toLowerCase(), 'blocks'],
      ['Família', FAMILY_LABEL[family(el)] + pred, 'families'],
      ['Estat a 25 °C', catLabel('state', el), 'state'],
      ['Configuració electrònica', configHTML(el) + pred, null, true, true],
      ['Estats d\'oxidació habituals', val.ox(el) ? fmtOx(val.ox(el)) : '—', 'valence'],
      ['Electronegativitat (Pauling)', val.en(el) !== null ? fmtFixed(val.en(el), 2) : '—', 'electronegativity'],
      ['1a energia d\'ionització', val.ion(el) !== null ? Math.round(val.ion(el)) + ' kJ/mol' : '—', 'ionization'],
      ['Radi atòmic', val.radius(el) !== null ? val.radius(el) + ' pm' : '—', 'atomicRadius'],
      ['Densitat', fmtDensity(el), 'density'],
      ['Punt de fusió', t(val.melt(el)), 'meltPoint'],
      ['Punt d\'ebullició', t(val.boil(el)), 'boilPoint'],
      ['Conductivitat elèctrica', condTxt, 'condElectric'],
      ['Conductivitat tèrmica', th !== null ? fmtSig(th, 3) + ' W/m·K' : '—', 'condThermal'],
      abund('escorca', 'earth'), abund('cos', 'body'), abund('univers', 'universe'),
      ['Bioelement', catLabel('bioessential', el), 'bioessential'],
      ['Toxicitat', catLabel('toxic', el), 'toxic'],
      ['Radioactivitat', catLabel('radioactive', el), 'radioactive'],
      ['Període de semidesintegració', halfText(el), 'halfLife', false, true],
      ['Magnetisme', catLabel('ferromagnetism', el), 'ferromagnetism'],
      ['Reactivitat', catLabel('reactivity', el), 'reactivity'],
      ['Any de descobriment', y === null ? '—' : fmtYear(y), 'discovery']
    ];
  }

  let lastFocus = null;
  function openModal(html, tileColor) {
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-content').innerHTML = html;
    if (tileColor) {
      const tile = overlay.querySelector('.fitxa-tile');
      if (tile) setBG(tile, tileColor);
    }
    lastFocus = document.activeElement;
    overlay.classList.remove('hidden');
    document.getElementById('element-modal').focus();
  }
  function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* corba de desintegració: quantitat que queda al cap de 1, 2, 3 i 4 períodes */
  function decayHTML(el) {
    const T = val.halfLife(el);
    const ctx = (D.semividaContext || {})[el.symbol];
    if (T === null) return ctx && el.symbol !== 'Bi' ? `<p class="fitxa-note">${esc(ctx)}</p>` : '';
    const W = 440, H = 150, L = 46, R = 14, TOP = 12, B = 30;
    const x = k => L + (W - L - R) * k / 4, y = p => TOP + (H - TOP - B) * (1 - p / 100);
    let path = '';
    for (let i = 0; i <= 80; i++) { const k = i / 20; path += (i ? 'L' : 'M') + x(k).toFixed(1) + ' ' + y(100 * Math.pow(2, -k)).toFixed(1); }
    const pct = ['100 %', '50 %', '25 %', '12,5 %', '6,25 %'];
    let guides = '', labels = '';
    for (let k = 0; k <= 4; k++) {
      const p = 100 / Math.pow(2, k);
      if (k > 0) guides += `<path class="guide" d="M${x(k)} ${y(0)}V${y(p)}H${L}"/><circle class="dot" cx="${x(k)}" cy="${y(p)}" r="3.5"/>`;
      labels += `<text x="${x(k)}" y="${H - 10}" text-anchor="${k === 4 ? 'end' : k === 0 ? 'start' : 'middle'}">${k ? esc(fmtDur(T * k)) : '0'}</text>`;
      if (k < 4) labels += `<text x="${L - 6}" y="${y(p) + 4}" text-anchor="end">${pct[k]}</text>`;
    }
    const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Corba de desintegració de ${esc(isotopeOf(el))}: la quantitat es redueix a la meitat cada ${esc(fmtDur(T, true))}">
      <path class="axis" d="M${L} ${TOP}V${y(0)}H${W - R}"/>${guides}<path class="curve" d="${path}"/>${labels}</svg>`;
    return `<div class="decay">
      <p class="decay-title">Com es desintegra ${esc(isoName(el))} (${esc(isotopeOf(el))})</p>
      <p class="decay-text">Cada <strong>${esc(fmtDur(T, true))}</strong>, la quantitat es redueix a la meitat: de cada 100 àtoms, al cap d'un període en queden 50; al cap de dos, 25; al cap de tres, uns 12.</p>
      ${svg}
      ${ctx ? `<p class="decay-text">${esc(ctx)}</p>` : ''}</div>`;
  }

  function showElement(el) {
    const m = MODES[state.mode];
    const st = cellState(el, m, m.kind === 'num' ? buildScale(m.value, m.log) : null);
    const rows = fitxaRows(el).map(([k, v, mode, isHTML, wide]) =>
      `<div class="${[mode === state.mode && mode !== 'blank' ? 'current' : '', wide ? 'wide' : ''].join(' ').trim()}"><dt>${esc(k)}</dt><dd>${isHTML ? v : esc(v)}</dd></div>`).join('');
    const note = (D.notes || {})[el.symbol];
    const disc = val.discoverer(el);
    const y = val.year(el);
    const html = `
      <div class="fitxa-head">
        <div class="fitxa-tile"><span class="z">${el.number}</span><span class="s">${el.symbol}</span></div>
        <div><h2 id="modal-title">${esc(nameOf(el))}</h2>
          <div class="sub">${esc(FAMILY_LABEL[family(el)])}${isPredicted(el) ? ' · propietats predites' : ''}</div></div>
      </div>
      <dl class="fitxa-props">${rows}</dl>
      ${note ? `<p class="fitxa-note">${esc(note)}</p>` : ''}
      ${decayHTML(el)}
      <p class="fitxa-summary">${esc(SUMMARIES[el.symbol] || '')}</p>
      ${disc ? `<p class="fitxa-disc"><strong>Descobriment:</strong> ${esc(disc)}${y !== null ? ' (' + esc(fmtYear(y)) + ')' : ''}.</p>` : ''}`;
    openModal(html, st.color);
  }

  /* ================= comparació ================= */
  const CMP_ROWS = [
    ['Nombre atòmic', el => el.number, v => String(v)],
    ['Massa atòmica (u)', el => el.atomic_mass, v => (Number.isInteger(v) ? `[${v}]` : fmtFixed(v, 2))],
    ['Electronegativitat', val.en, v => fmtFixed(v, 2)],
    ['1a energia d\'ionització (kJ/mol)', val.ion, v => String(Math.round(v))],
    ['Radi atòmic (pm)', val.radius, v => String(v)],
    ['Densitat (g/cm³)', val.density, v => fmtSig(v, 3)],
    ['Punt de fusió', val.melt, v => fmtTemp(v)],
    ['Punt d\'ebullició', val.boil, v => fmtTemp(v)],
    ['Conductivitat elèctrica (S/m)', val.sigma, v => fmtSig(v, 3)],
    ['Conductivitat tèrmica (W/m·K)', val.thermal, v => fmtSig(v, 3)],
    ['Escorça terrestre (%)', el => val.abund('escorca', el), v => fmtSig(v, 3)],
    ['Període de semidesintegració', val.halfSec, v => fmtDur(v, true), el => (halfCat(el) === 'estable' ? 'estable' : null)],
    ['Any de descobriment', val.year, v => fmtYear(v)]
  ];
  function showCompare(a, b) {
    const rows = CMP_ROWS.map(([label, f, fmt, alt]) => {
      const va = f(a), vb = f(b);
      const ok = x => typeof x === 'number';
      const hiA = ok(va) && ok(vb) && va > vb, hiB = ok(va) && ok(vb) && vb > va;
      const txt = (v, el) => (ok(v) ? esc(fmt(v)) : esc((alt && alt(el)) || '—'));
      return `<tr><td>${esc(label)}</td><td class="${hiA ? 'hi' : ''}">${txt(va, a)}</td><td class="${hiB ? 'hi' : ''}">${txt(vb, b)}</td></tr>`;
    }).join('');
    const extra = [['Família', el => FAMILY_LABEL[family(el)]], ['Estat a 25 °C', el => catLabel('state', el)], ['Estats d\'oxidació', el => (val.ox(el) ? fmtOx(val.ox(el)) : '—')]]
      .map(([l, f]) => `<tr><td>${esc(l)}</td><td>${esc(f(a))}</td><td>${esc(f(b))}</td></tr>`).join('');
    openModal(`<h2 id="modal-title" style="margin:0 0 6px">Comparació</h2>
      <table class="cmp-table"><thead><tr><th></th><th>${esc(nameOf(a))} (${a.symbol})</th><th>${esc(nameOf(b))} (${b.symbol})</th></tr></thead>
      <tbody>${extra}${rows}</tbody></table>
      <p class="fitxa-disc">En negreta, el valor més alt de cada propietat. Densitat dels gasos convertida a g/cm³.</p>`);
  }
  function setCompare(on) {
    state.compare = on ? [] : null;
    document.getElementById('compare-btn').setAttribute('aria-pressed', String(on));
    if (on) setQuiz(false);
    paint();
  }

  /* ================= repte ================= */
  const QUIZ_PROPS = [
    { key: 'electronegativity', max: 'l\'electronegativitat més alta', min: 'l\'electronegativitat més baixa' },
    { key: 'ionization', max: 'la primera energia d\'ionització més alta', min: 'la primera energia d\'ionització més baixa' },
    { key: 'atomicRadius', max: 'el radi atòmic més gran', min: 'el radi atòmic més petit' },
    { key: 'meltPoint', max: 'el punt de fusió més alt', min: 'el punt de fusió més baix' },
    { key: 'density', max: 'la densitat més alta', min: 'la densitat més baixa' },
    { key: 'halfLife', max: 'el període de semidesintegració més llarg (dura més)', min: 'el període de semidesintegració més curt (dura menys)', radio: true }
  ];
  // conjunts d'elements radioactius per a les preguntes de semidesintegració
  const RADIO_SETS = [
    ['del període 7', e => e.period === 7 && e.ypos <= 7],
    ['dels actínids', e => e.ypos === 10],
    ['entre el poloni (84) i l’urani (92)', e => e.number >= 84 && e.number <= 92],
    ['entre l’urani (92) i el fermi (100)', e => e.number >= 92 && e.number <= 100]
  ];
  const MAIN_GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
  const rnd = a => a[Math.floor(Math.random() * a.length)];
  function newQuestion(prev) {
    for (let tries = 0; tries < 200; tries++) {
      const p = rnd(QUIZ_PROPS), m = MODES[p.key];
      const byPeriod = Math.random() < 0.55;
      let set, where;
      if (p.radio) {
        const [w, f] = rnd(RADIO_SETS);
        set = ELS.filter(f);
        where = w;
      } else if (byPeriod) {
        const per = rnd([2, 3, 4, 5, 6]);
        set = ELS.filter(e => e.period === per && e.ypos <= 7 && MAIN_GROUPS.includes(groupOf(e)));
        where = `del període ${per}`;
      } else {
        const g = rnd([1, 2, 13, 14, 15, 16, 17]);
        set = ELS.filter(e => groupOf(e) === g && e.period <= 6);
        where = `del grup ${g}`;
      }
      set = set.filter(e => m.value(e) !== null);
      if (set.length < 3) continue;
      const want = Math.random() < 0.5 ? 'max' : 'min';
      const sorted = set.slice().sort((a, b) => m.value(a) - m.value(b));
      const ans = want === 'max' ? sorted[sorted.length - 1] : sorted[0];
      const runner = want === 'max' ? sorted[sorted.length - 2] : sorted[1];
      if (m.value(ans) === m.value(runner)) continue;
      const text = `Quin element ${where} té ${p[want]}?`;
      return {
        prop: { value: m.value, fmt: m.fmt, longFmt: m.longFmt || m.fmt, log: m.log, legendFmt: m.legendFmt, label: m.label },
        set: set.map(e => e.symbol), answer: ans.symbol, text,
        answered: false, picked: null,
        score: prev ? prev.score : 0, total: prev ? prev.total : 0
      };
    }
    return null;
  }
  function setQuiz(on) {
    state.quiz = on ? newQuestion(null) : null;
    document.getElementById('quiz-btn').setAttribute('aria-pressed', String(!!state.quiz));
    if (on && state.compare) { state.compare = null; document.getElementById('compare-btn').setAttribute('aria-pressed', 'false'); }
    paint();
  }

  function onCellClick(el) {
    const q = state.quiz;
    if (q) {
      if (q.answered || !q.set.includes(el.symbol)) return;
      q.answered = true; q.picked = el.symbol; q.total++;
      if (el.symbol === q.answer) q.score++;
      paint();
      return;
    }
    if (state.compare) {
      if (state.compare.includes(el.symbol)) state.compare = state.compare.filter(s => s !== el.symbol);
      else state.compare.push(el.symbol);
      if (state.compare.length === 2) {
        const [a, b] = state.compare.map(bySym);
        state.compare = [];
        paint();
        showCompare(a, b);
        return;
      }
      paint();
      return;
    }
    showElement(el);
  }

  /* ================= adaptació a la pantalla =================
     Com a Equacions: la interfície es pensa per a 1440 × 820 px útils. En
     pantalles d'ordinador més petites (p. ex. 1366 × 768, o escalat del 125 %)
     es redueix tota sencera (--ui-zoom). A més, la graella s'escala per omplir
     l'espai disponible sense retalls. En mòbils i tauletes, la barra es col·loca
     a dalt i la taula es pot desplaçar dins del seu marc. */
  const BASE_W = 1440, BASE_H = 820, MIN_ZOOM = 0.75, MOBILE_W = 900;
  const isMobile = () => window.innerWidth < MOBILE_W;

  function fitScale() {
    const w = window.innerWidth, h = window.innerHeight;
    let z = Math.min(1, w / BASE_W, h / BASE_H);
    z = Math.max(MIN_ZOOM, Math.floor(z * 20) / 20);
    if (isMobile() || root.classList.contains('projector')) z = 1;
    root.style.setProperty('--ui-zoom', String(z));
    placeFooter();
    fitGrid();
  }

  function placeFooter() {
    const footer = document.querySelector('.felip-app-footer');
    const target = isMobile() ? document.getElementById('app') : document.querySelector('.sidebar');
    if (footer && footer.parentElement !== target) target.appendChild(footer);
  }

  function fitGrid() {
    const vp = document.getElementById('grid-viewport');
    const scaler = document.getElementById('grid-scale');
    const gw = grid.offsetWidth, gh = grid.offsetHeight;
    if (!gw || !gh) return;
    let s;
    if (isMobile()) {
      s = Math.min(1, Math.max(0.5, (vp.clientWidth - 4) / gw));
    } else {
      const vw = vp.clientWidth - 12, vh = vp.clientHeight - 12;
      if (vw <= 0 || vh <= 0) return;
      s = Math.min(vw / gw, vh / gh, 1.5);
    }
    grid.style.transform = `scale(${s})`;
    scaler.style.width = (gw * s) + 'px';
    scaler.style.height = (gh * s) + 'px';
  }

  /* ================= tema i projector ================= */
  function initToggles() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const projBtn = document.getElementById('projector-btn');
    const syncTheme = () => themeBtn.setAttribute('aria-pressed', String(root.classList.contains('dark-mode')));
    themeBtn.addEventListener('click', () => {
      root.classList.toggle('dark-mode');
      store.set('theme', root.classList.contains('dark-mode') ? 'dark' : 'light');
      syncTheme();
    });
    syncTheme();
    if (store.get('projector', '0') === '1') root.classList.add('projector');
    projBtn.setAttribute('aria-pressed', String(root.classList.contains('projector')));
    projBtn.addEventListener('click', () => {
      root.classList.toggle('projector');
      const on = root.classList.contains('projector');
      store.set('projector', on ? '1' : '0');
      projBtn.setAttribute('aria-pressed', String(on));
      fitScale();
    });
  }

  /* ================= esdeveniments ================= */
  function initEvents() {
    document.getElementById('legend').addEventListener('click', e => {
      const b = e.target.closest('button[data-cat]');
      if (!b) return;
      state.focus = state.focus === b.dataset.cat ? null : b.dataset.cat;
      renderLegend();
      paint();
    });
    document.getElementById('mode-options').addEventListener('click', e => {
      const b = e.target.closest('button[data-temp]');
      if (!b) return;
      state.temp = b.dataset.temp;
      store.set('temp', state.temp);
      renderOptions(); renderLegend(); paint();
    });
    document.getElementById('mode-options').addEventListener('input', e => {
      if (e.target.id !== 'year-range') return;
      state.yearLimit = Number(e.target.value);
      document.getElementById('year-out').textContent = state.yearLimit >= 2010 ? 'avui' : state.yearLimit;
      paint();
    });
    grid.addEventListener('click', e => {
      const b = e.target.closest('button[data-act]');
      if (!b) return;
      if (b.dataset.act === 'next') { state.quiz = newQuestion(state.quiz); paint(); }
      if (b.dataset.act === 'quit') setQuiz(false);
      if (b.dataset.act === 'stopcmp') setCompare(false);
    });
    document.getElementById('compare-btn').addEventListener('click', () => setCompare(!state.compare));
    document.getElementById('quiz-btn').addEventListener('click', () => setQuiz(!state.quiz));

    const overlay = document.getElementById('modal-overlay');
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (!overlay.classList.contains('hidden')) closeModal();
        else if (state.quiz) setQuiz(false);
        else if (state.compare) setCompare(false);
      }
    });

    window.addEventListener('resize', fitScale);
    if ('ResizeObserver' in window) new ResizeObserver(() => fitGrid()).observe(document.getElementById('grid-viewport'));
  }

  /* ================= inici ================= */
  function main() {
    if (!ELS.length) {
      grid.textContent = 'No s\'han pogut carregar les dades (data/elements.js).';
      return;
    }
    buildSelect();
    createGrid();
    initToggles();
    initEvents();
    setMode(state.mode);
    fitScale();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
  else main();
})();
