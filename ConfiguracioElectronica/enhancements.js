// Millores: control per clic i estat d'ocupació global
// Aquest fitxer redefineix algunes funcions perquè l'emplenament sigui per punts

const ORBITAL_PREFIX_SAFE = typeof ORBITAL_PREFIX_SUMS !== 'undefined'
  ? ORBITAL_PREFIX_SUMS
  : (() => {
      const prefixes = [];
      let total = 0;
      ORBITAL_ORDER.forEach((orb, index) => {
        prefixes[index] = total;
        total += orb.max;
      });
      return prefixes;
    })();

const ELECTRON_CAP = typeof MAX_ELECTRONS === 'number'
  ? MAX_ELECTRONS
  : ORBITAL_ORDER.reduce((acc, orb) => acc + orb.max, 0);

// Reimplementació segura del dibuix de la graella d'orbitals
function buildOrbitalDiagram() {
  if (typeof document === 'undefined') return;
  const blocks = ['s', 'p', 'd', 'f'];
  const grid = document.createElement('div');
  grid.className = 'orbital-grid';
  const headEmpty = document.createElement('div');
  headEmpty.className = 'og-label og-label-blank';
  grid.appendChild(headEmpty);
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
      const oi = typeof INDEX_BY_NL !== 'undefined' ? INDEX_BY_NL.get(`${n}|${l}`) : undefined;
      const has = typeof oi === 'number';
      const cell = document.createElement('div');
      cell.className = `og-cell ${l} ${has ? 'has' : ''}`;
      if (has) {
        const o = ORBITAL_ORDER[oi];
        const dots = document.createElement('div');
        dots.className = 'dots';
        const pairCount = Math.ceil(o.max / 2);
        const blockColumns = o.l === 's' ? 1 : o.l === 'p' ? 3 : o.l === 'd' ? 3 : 4;
        const colSetting = Math.max(1, Math.min(pairCount, blockColumns));
        dots.style.setProperty('--pair-columns', String(colSetting));
        const start = Array.isArray(ORBITAL_PREFIX_SAFE) ? ORBITAL_PREFIX_SAFE[oi] || 0 : 0;
        for (let pairIndex = 0; pairIndex < pairCount; pairIndex++) {
          const pair = document.createElement('div');
          pair.className = 'dot-pair empty';
          pair.dataset.oi = String(oi);
          pair.dataset.pi = String(pairIndex);
          const pairCapacity = Math.min(2, o.max - pairIndex * 2);
          const pairStart = start + pairIndex * 2 + 1;
          const pairEnd = pairStart + pairCapacity - 1;
          pair.dataset.rangeStart = String(pairStart);
          pair.dataset.rangeEnd = String(pairEnd);
          for (let slot = 0; slot < 2; slot++) {
            const eIndex = pairIndex * 2 + slot;
            if (eIndex >= o.max) break;
            const electronNumber = start + eIndex + 1;
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.dataset.oi = String(oi);
            dot.dataset.ei = String(eIndex);
            dot.dataset.electron = String(electronNumber);
            pair.appendChild(dot);
          }
          dots.appendChild(pair);
        }
        cell.appendChild(dots);
      }
      grid.appendChild(cell);
    }
  }
  if (typeof $diagram !== 'undefined') {
    $diagram.innerHTML = '';
    $diagram.appendChild(grid);
  }
}

function getZ() {
  return (typeof occ !== 'undefined') ? occ.reduce((a, o) => a + o.e, 0) : 0;
}

function addElectronByOrder() {
  if (!Array.isArray(occ)) return;
  if (getZ() >= ELECTRON_CAP) return;
  const next = getNextSlot(occ);
  if (!next) return;
  occ[next.oi].e = Math.min(occ[next.oi].max, occ[next.oi].e + 1);
  updateAll();
}

function removeElectronByOrder() {
  if (!Array.isArray(occ)) return;
  const last = getLastFilledSlot(occ);
  if (!last) return;
  occ[last.oi].e = Math.max(0, occ[last.oi].e - 1);
  updateAll();
}

function getNextSlot(occArr) {
  for (let oi = 0; oi < occArr.length; oi++) {
    const o = occArr[oi];
    if (o.e < o.max) return { oi, ei: o.e };
  }
  return null;
}

function getLastFilledSlot(occArr) {
  for (let oi = occArr.length - 1; oi >= 0; oi--) {
    const o = occArr[oi];
    if (o.e > 0) return { oi, ei: o.e - 1 };
  }
  return null;
}

function setZ(value) {
  if (typeof computeOccupancy !== 'function') return;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return;
  const clamped = Math.max(0, Math.min(ELECTRON_CAP, Math.floor(parsed)));
  occ = computeOccupancy(clamped);
  if (typeof Z !== 'undefined') Z = clamped;
  updateAll();
}

// Redefineix updateAll per treballar des d'occ
function updateAll() {
  const Znow = getZ();
  if (typeof Z !== 'undefined') Z = Znow;
  if (typeof $count !== 'undefined') $count.textContent = String(Znow);
  if (typeof $configFull !== 'undefined') $configFull.innerHTML = Znow === 0 ? '–' : configToString(occ);
  if (typeof $configNoble !== 'undefined') $configNoble.innerHTML = Znow === 0 ? '–' : configToNobleString(Znow);
  if (typeof updateOrbitalDiagram === 'function') updateOrbitalDiagram(occ);
  const el = typeof findElementByZ === 'function' ? findElementByZ(Znow) : null;
  if (typeof $elTitle !== 'undefined') $elTitle.textContent = el ? `${el.Z} · ${el.s}` : '–';
  if (typeof $coords !== 'undefined') $coords.textContent = el ? coordsText(el) : '–';
  if (typeof updateAtomVisual === 'function') updateAtomVisual(occ, el);
  if (typeof highlightElement === 'function') highlightElement(el);
  if (typeof updateOxidationStates === 'function') updateOxidationStates(el);
  if (typeof $aufbauDisplay !== 'undefined' && typeof configToColoredString === 'function') $aufbauDisplay.innerHTML = configToColoredString(occ);
}

// Notacióó amb gas noble (override, amb retorn '–' si no hi ha nucli)
function configToNobleString(Zvalue) {
  const NOBLE_GASES = [{Z:2,s:'He'},{Z:10,s:'Ne'},{Z:18,s:'Ar'},{Z:36,s:'Kr'},{Z:54,s:'Xe'},{Z:86,s:'Rn'}];
  let core = null; for (const g of NOBLE_GASES) { if (g.Z < Zvalue) core = g; else break; }
  if (!core) return '–';
  const all = computeOccupancy(Zvalue); const coreOcc = computeOccupancy(core.Z);
  const rem = all.map((o,i)=>({ ...o, e: Math.max(0, o.e - coreOcc[i].e) }));
  const remText = rem.filter(x=>x.e>0).map(x=>`${x.n}${x.l}<sup>${x.e}</sup>`).join(' ');
  return remText ? `[${core.s}] ${remText}` : `[${core.s}]`;
}

// Coordenades (override en ASCII segur)
function coordsText(el) {
  if (!el) return '–';
  if (el.block === 'f') {
    const serie = el.period === 6 ? 'lantànids' : el.period === 7 ? 'actínids' : 'bloc f';
    return `període ${el.period} · bloc f (${serie})${el.group ? ` · grup ${el.group}` : ''}`;
  }
  return `període ${el.period} · grup ${el.group}`;
}

function initSafe() {
  try {
    buildOrbitalDiagram();
  } catch (e) {
    // ignora, ja s'ha reparat per sobre
  }
  try { if (typeof buildPeriodicTable === 'function') buildPeriodicTable(); } catch (e) {}
  try { if (typeof buildPeriodicLabels === 'function') buildPeriodicLabels(); } catch (e) {}
  try { bindEventsIfNeeded(); } catch (e) {}
  try { updateAll(); } catch (e) {}
}

// Inicia reparació després de carregar aquest fitxer
initSafe();
