import { ETAPES, NAUS_INICIALS, COMPANYS_INICIALS } from './dades/etapes.js';

const ICONA_NAU = `
<svg viewBox="0 0 40 30" aria-hidden="true">
  <path class="n-vela" d="M12 3 H28 Q29 10 27 16 H13 Q11 10 12 3 Z"/>
  <path class="n-pal" d="M20 2 V20"/>
  <path class="n-buc" d="M2 19 Q5 18 7 20 H32 Q35 18 37 14 Q38 18 35 21 L33 23 Q20 26 7 24 Q3 22 2 19 Z"/>
</svg>`;

export function creaMarcador(el) {
  el.innerHTML = `
    <div class="m-bloc m-anys" aria-live="polite">
      <span class="m-etiqueta">Lluny de casa</span>
      <span class="m-valor">≈ <span class="m-any">10</span><small> anys</small></span>
      <span class="m-sub m-anys-text"></span>
    </div>
    <div class="m-bloc m-naus">
      <span class="m-etiqueta">Naus <span class="m-on m-nombre-naus"></span></span>
      <ul class="m-flota" aria-hidden="true">
        ${Array.from({ length: NAUS_INICIALS }, () => `<li>${ICONA_NAU}</li>`).join('')}
      </ul>
      <span class="m-sub m-flota-text"></span>
    </div>
    <div class="m-bloc m-homes" aria-live="polite">
      <span class="m-etiqueta">Companys</span>
      <span class="m-valor"><span class="m-aprox">≈ </span><span class="m-nombre">${COMPANYS_INICIALS}</span><span class="m-delta"></span></span>
      <span class="m-barra"><span class="m-omple"></span></span>
    </div>`;

  const q = (s) => el.querySelector(s);
  const any = q('.m-any');
  const nombre = q('.m-nombre');
  const omple = q('.m-omple');
  const delta = q('.m-delta');
  const naus = [...el.querySelectorAll('.m-flota li')];
  let anysActuals = ETAPES[0].anys;
  let companysActuals = COMPANYS_INICIALS;
  let nausActuals = NAUS_INICIALS;

  /** Interpola el comptador d'anys mentre la nau navega. */
  function avanca(inici, fi, t) {
    any.textContent = Math.round(inici + (fi - inici) * t);
    q('.m-anys-text').textContent = 'navegant…';
  }

  function actualitza(index) {
    const e = ETAPES[index];
    anysActuals = e.anys;
    any.textContent = e.anys;
    q('.m-anys-text').textContent = e.anysText;

    naus.forEach((li, i) => li.classList.toggle('perduda', i >= e.naus));
    if (e.naus < nausActuals) {
      naus.slice(e.naus, nausActuals).forEach((li) => {
        li.classList.remove('canvi');
        void li.offsetWidth;
        li.classList.add('canvi');
      });
    }
    nausActuals = e.naus;
    q('.m-nombre-naus').textContent = `· ${e.naus}`;
    q('.m-flota-text').textContent = e.flotaText;

    // Fins que no queda sol, el nombre de companys és una estimació.
    q('.m-aprox').hidden = e.companys <= 1;
    const dif = e.companys - companysActuals;
    if (dif !== 0) {
      delta.textContent = dif > 0 ? `+${dif}` : `−${-dif}`;
      delta.classList.toggle('puja', dif > 0);
      delta.classList.remove('mostra');
      void delta.offsetWidth;
      delta.classList.add('mostra');
    }
    companysActuals = e.companys;
    nombre.textContent = e.companys <= 1 ? 'cap' : e.companys;
    omple.style.width = `${(e.companys / COMPANYS_INICIALS) * 100}%`;
    el.querySelector('.m-homes').setAttribute('aria-label', e.companys <= 1 ? 'Companys: cap, Ulisses és sol' : `Companys: unes ${e.companys} persones`);
  }

  return { actualitza, avanca, get anys() { return anysActuals; } };
}
