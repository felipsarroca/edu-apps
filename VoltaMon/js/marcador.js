import { NAUS, ETAPES, DATA_SORTIDA, HOMES_INICIALS } from './dades/etapes.js';
import { diesEntre, dataLlarga, escapa } from './util.js';

const ICONA_NAU = `
<svg viewBox="0 0 40 34" aria-hidden="true">
  <path class="n-vela" d="M19 3 C25 6 26 13 25 19 L19 19 Z M19 6 C14 9 13 14 14 19 L19 19 Z M28 9 C31 12 32 16 31 20 L28 20 Z"/>
  <path class="n-pal" d="M19 2 V22 M28 7 V22"/>
  <path class="n-buc" d="M3 22 H37 L33 29 Q20 32 7 29 Z"/>
</svg>`;

const ESTATS = {
  activa: 'navega',
  naufragada: 'naufragada',
  desertora: 'desertora',
  cremada: 'cremada',
  separada: 'separada',
  capturada: 'capturada',
};

/** Estat de cada nau en arribar a l'etapa index (els canvis s'acumulen). */
export function estatNaus(index) {
  const estat = Object.fromEntries(NAUS.map((n) => [n.id, { estat: 'activa', nota: `capità inicial: ${n.capita}` }]));
  ETAPES.slice(0, index + 1).forEach((e) => Object.assign(estat, e.naus || {}));
  return estat;
}

export const diaDe = (etapa) => (etapa.data ? diesEntre(DATA_SORTIDA, etapa.data) : null);

export function creaMarcador(el) {
  el.innerHTML = `
    <div class="m-bloc m-dies" aria-live="polite">
      <span class="m-etiqueta">Dia de viatge</span>
      <span class="m-valor"><span class="m-dia">0</span></span>
      <span class="m-sub m-data"></span>
    </div>
    <div class="m-bloc m-naus">
      <span class="m-etiqueta">Naus</span>
      <ul class="m-flota">
        ${NAUS.map((n) => `<li data-nau="${n.id}" tabindex="0">${ICONA_NAU}<span class="m-nom">${escapa(n.nom)}</span></li>`).join('')}
      </ul>
    </div>
    <div class="m-bloc m-homes" aria-live="polite">
      <span class="m-etiqueta">Homes <span class="m-on">a la flota</span></span>
      <span class="m-valor">≈ <span class="m-nombre">${HOMES_INICIALS}</span><span class="m-delta"></span></span>
      <span class="m-barra"><span class="m-omple"></span></span>
    </div>`;

  const q = (s) => el.querySelector(s);
  const dia = q('.m-dia');
  const nombre = q('.m-nombre');
  const omple = q('.m-omple');
  const delta = q('.m-delta');
  let diaActual = 0;
  let homesActuals = HOMES_INICIALS;

  const posaHomes = (n) => {
    nombre.textContent = Math.round(n);
    omple.style.width = `${(n / HOMES_INICIALS) * 100}%`;
  };

  /** Interpola el comptador de dies mentre el vaixell navega. */
  function avanca(diaInici, diaFi, t) {
    dia.textContent = Math.round(diaInici + (diaFi - diaInici) * t);
  }

  function actualitza(index) {
    const e = ETAPES[index];
    // L'epíleg no té data: es manté la de l'última etapa.
    const datada = ETAPES.slice(0, index + 1).reverse().find((x) => x.data);
    diaActual = diaDe(datada);
    dia.textContent = diaActual;
    q('.m-data').textContent = `${datada.aprox ? '≈ ' : ''}${datada.dataText || dataLlarga(datada.data)}`;

    const naus = estatNaus(index);
    el.querySelectorAll('.m-flota li').forEach((li) => {
      const { estat, nota } = naus[li.dataset.nau];
      if (li.dataset.estat && li.dataset.estat !== estat) {
        li.classList.remove('canvi');
        void li.offsetWidth;
        li.classList.add('canvi');
      }
      li.dataset.estat = estat;
      const nom = li.querySelector('.m-nom').textContent;
      li.title = `${nom}: ${nota}`;
      li.setAttribute('aria-label', `${nom}, ${ESTATS[estat]}. ${nota}`);
    });

    q('.m-on').textContent = e.homesEtiqueta || 'a la flota';
    const dif = e.homes - homesActuals;
    if (dif !== 0) {
      delta.textContent = dif > 0 ? `+${dif}` : `−${-dif}`;
      delta.classList.toggle('puja', dif > 0);
      delta.classList.remove('mostra');
      void delta.offsetWidth;
      delta.classList.add('mostra');
    }
    homesActuals = e.homes;
    posaHomes(e.homes);
  }

  return { actualitza, avanca, get dia() { return diaActual; } };
}
