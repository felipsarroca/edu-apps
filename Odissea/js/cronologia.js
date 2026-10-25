import { ETAPES } from './dades/etapes.js';
import { escapa } from './util.js';

const ICONES = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
  pausa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>',
};

export function creaCronologia(el, { onEtapa, onPlay }) {
  let anyAnterior = null;
  let darreraMarca = -2;
  const punts = ETAPES.map((e, i) => {
    // Marca on canvien els anys que fa que Ulisses és lluny de casa.
    // Si l'etiqueta anterior és just al costat, al mòbil s'amaga (classe a-prop).
    let marcaAny = '';
    if (e.anys !== anyAnterior) {
      marcaAny = ` data-any="${e.anys} anys"${i - darreraMarca === 1 ? ' class="a-prop"' : ''}`;
      darreraMarca = i;
    }
    anyAnterior = e.anys;
    const etiqueta = e.epileg ? 'Epíleg' : `${i + 1}. ${e.lloc}`;
    return `<li${marcaAny}><button type="button" class="c-punt${e.epileg ? ' c-epileg' : ''}" data-i="${i}" title="${escapa(etiqueta)}" aria-label="${escapa(etiqueta)}">${e.epileg ? '★' : `<span>${i + 1}</span>`}</button></li>`;
  }).join('');

  el.style.setProperty('--n', ETAPES.length);
  el.innerHTML = `
    <button type="button" class="c-play" aria-label="Reprodueix el viatge automàticament">${ICONES.play}</button>
    <div class="c-pista">
      <div class="c-carril">
        <div class="c-linia"><span class="c-feta"></span></div>
        <ol class="c-punts">${punts}</ol>
      </div>
    </div>`;

  const play = el.querySelector('.c-play');
  const feta = el.querySelector('.c-feta');
  const botons = [...el.querySelectorAll('.c-punt')];

  play.addEventListener('click', onPlay);
  botons.forEach((b) => b.addEventListener('click', () => onEtapa(Number(b.dataset.i))));

  function actualitza(index) {
    botons.forEach((b, i) => {
      b.classList.toggle('feta', i < index);
      b.classList.toggle('actual', i === index);
      if (i === index) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    feta.style.width = `${(index / (ETAPES.length - 1)) * 100}%`;
  }

  function enReproduccio(actiu) {
    play.innerHTML = actiu ? ICONES.pausa : ICONES.play;
    play.classList.toggle('actiu', actiu);
    play.setAttribute('aria-label', actiu ? 'Atura la reproducció' : 'Reprodueix el viatge automàticament');
  }

  return { actualitza, enReproduccio };
}
