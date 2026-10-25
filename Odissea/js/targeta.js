import { ETAPES } from './dades/etapes.js';
import { GLOSSARI } from './dades/glossari.js';
import { escapa } from './util.js';
import * as veu from './veu.js';

const TOTAL = ETAPES.filter((e) => !e.epileg).length;

const CAIXES = {
  sabies: { titol: 'Sabies que…?', icona: '✦' },
  pensa: { titol: 'Pensa-hi', icona: '◐' },
  mite: { titol: 'Mite o realitat?', icona: '⚖' },
};

/** Text de les dades → HTML: **negreta** i {terme:paraula} del glossari. */
function format(text) {
  return escapa(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\{([\w-]+):([^}]+)\}/g, (_, terme, paraula) =>
      GLOSSARI[terme] ? `<button type="button" class="mot" data-terme="${terme}">${paraula}</button>` : paraula);
}

const paragrafs = (llista) => llista.map((p) => `<p>${format(p)}</p>`).join('');

function capcalera(e, index) {
  if (e.epileg) return '<span class="t-num">Epíleg</span>';
  return `
    <span class="t-num">Etapa ${index + 1} de ${TOTAL}</span>
    <span class="t-data">Odissea, ${escapa(e.cant.replace(/^C/, 'c'))}</span>`;
}

/** Quants companys es perden en aquesta etapa, i per què. */
function htmlBalanc(e, index) {
  if (!e.balanc) return '';
  const n = ETAPES[index - 1].companys - e.companys;
  const xifra = `${n > 6 ? '≈ ' : ''}−${n} ${n === 1 ? 'company' : 'companys'}`;
  return `<p class="t-balanc morts"><span class="tb-xifra">${xifra}</span><span class="tb-motiu">${format(e.balanc)}</span></p>`;
}

const VAIXELL = `<svg class="tv-vaixell" viewBox="0 0 72 46" aria-hidden="true">
  <path class="v-pal" d="M34 6 V36 M20 9 H48"/>
  <path class="v-vela" d="M21 10 H47 Q49 21 46 30 H22 Q19 21 21 10 Z"/>
  <path class="v-ratlles" d="M28 10 V30 M34 10 V30 M40 10 V30"/>
  <path class="v-rems" d="M18 40 L12 46 M26 41 L21 46 M34 41 L30 46 M42 41 L39 46 M50 40 L48 46"/>
  <path class="v-buc" d="M4 34 Q8 33 12 35 H58 Q63 33 66 26 Q67 31 64 36 L60 40 Q36 44 12 41 Q6 39 4 34 Z"/>
  <circle class="v-ull" cx="58" cy="36.5" r="1.4"/>
</svg>
<svg class="tv-onades" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 6 Q7.5 0 15 6 T30 6 T45 6 T60 6 T75 6 T90 6 T105 6 T120 6"/></svg>`;

function htmlDecisio(d) {
  return `
    <section class="decisio" aria-labelledby="decisio-titol">
      <h3 id="decisio-titol"><span aria-hidden="true">?</span> Què hauries fet tu?</h3>
      <p class="d-pregunta">${format(d.pregunta)}</p>
      <div class="d-opcions">
        ${d.opcions.map((o, i) => `<button type="button" class="d-opcio" data-i="${i}">${format(o.text)}</button>`).join('')}
      </div>
      <p class="d-comentari" hidden></p>
      <button type="button" class="d-salta">Mostra què va passar</button>
      <div class="d-resultat" hidden>
        <h4>Què va passar</h4>
        ${paragrafs(d.resultat)}
      </div>
    </section>`;
}

export function creaTargeta(el, { onAnterior, onSeguent }) {
  const pop = document.createElement('div');
  pop.className = 'glossari-pop';
  pop.hidden = true;
  pop.setAttribute('role', 'tooltip');
  document.body.append(pop);

  const amagaPop = () => { pop.hidden = true; };
  document.addEventListener('click', (ev) => { if (!ev.target.closest('.mot, .glossari-pop')) amagaPop(); });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') amagaPop(); });

  let etapaActual = null;

  /** Narra l'etapa i, si ja s'ha revelat, també el desenllaç de la decisió. */
  function llegeix(boto) {
    const e = etapaActual;
    const fitxers = [e.id];
    if (e.decisio && !el.querySelector('.d-resultat').hidden) fitxers.push(`${e.id}-resultat`);
    veu.reprodueix(fitxers, boto);
  }

  /** Canvia tot el contingut de la targeta amb una entrada suau, sempre des de dalt. */
  function posa(html) {
    el.classList.remove('entra');
    el.innerHTML = html;
    el.scrollTop = 0;
    void el.offsetWidth;
    el.classList.add('entra');
  }

  /** Vista de travessia: substitueix l'etapa anterior mentre la nau navega. */
  function navegant(index) {
    veu.atura();
    amagaPop();
    const e = ETAPES[index];
    posa(`
      <div class="t-viatge" role="status">
        <span class="t-num">Etapa ${index + 1} de ${TOTAL}</span>
        <p class="tv-rumb">Rumb a</p>
        <h2 class="tv-desti">${escapa(e.lloc)}</h2>
        <div class="tv-escena">${VAIXELL}</div>
        <p class="tv-dies">${e.durada ? `<span class="tv-comptador">${escapa(e.durada)}</span> de navegació` : 'Navegant…'}</p>
        <div class="tv-barra"><span></span></div>
      </div>`);
  }

  function progres(t) {
    const barra = el.querySelector('.tv-barra span');
    if (barra) barra.style.width = `${t * 100}%`;
  }

  function mostra(index) {
    veu.atura();
    amagaPop();
    const e = ETAPES[index];
    etapaActual = e;
    const darrera = index === ETAPES.length - 1;
    const seguentText = darrera ? 'Torna a començar ↺' : ETAPES[index + 1].epileg ? 'Què va passar després? ▸' : 'Continua el viatge ▸';

    posa(`
      <div class="t-cap">
        <div class="t-meta">${capcalera(e, index)}</div>
        <div class="t-botons">
        <button type="button" class="t-veu" aria-label="Escolta el text" aria-pressed="false" title="Escolta el text"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
        <button type="button" class="t-plega" aria-label="Plega o desplega el text" aria-expanded="${!el.classList.contains('plegada')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
      </div>
      <h2 class="t-titol" tabindex="-1">${escapa(e.titol)}</h2>
      <p class="t-lloc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>${escapa(e.lloc)}</p>
      ${e.on ? `<p class="t-on" title="Ubicació tradicional">${escapa(e.on)}</p>` : ''}
      ${htmlBalanc(e, index)}
      <div class="t-cos">
        ${paragrafs(e.text)}
        ${e.decisio ? htmlDecisio(e.decisio) : ''}
        ${e.cita ? `<blockquote class="cita"><p>${format(e.cita.text)}</p><footer>— ${escapa(e.cita.autor)}</footer></blockquote>` : ''}
        ${[].concat(e.caixa || []).map((c) => `<aside class="caixa caixa-${c.tipus}"><h3><span aria-hidden="true">${CAIXES[c.tipus].icona}</span> ${CAIXES[c.tipus].titol}</h3><p>${format(c.text)}</p></aside>`).join('')}
        ${e.resum ? `<section class="resum"><h3>Què ens explica encara avui?</h3><ul>${e.resum.map((r) => `<li>${format(r)}</li>`).join('')}</ul></section>` : ''}
      </div>
      <div class="t-nav">
        <button type="button" class="boto boto-secundari t-anterior" ${index === 0 ? 'disabled' : ''} aria-label="Etapa anterior">◂</button>
        <button type="button" class="boto boto-principal t-seguent">${seguentText}</button>
      </div>`);

    el.querySelector('.t-veu').addEventListener('click', (ev) => llegeix(ev.currentTarget));
    el.querySelector('.t-plega').addEventListener('click', (ev) => {
      const plegada = el.classList.toggle('plegada');
      ev.currentTarget.setAttribute('aria-expanded', String(!plegada));
    });
    el.querySelector('.t-anterior').addEventListener('click', onAnterior);
    el.querySelector('.t-seguent').addEventListener('click', onSeguent);

    el.querySelectorAll('.mot').forEach((b) => b.addEventListener('click', () => {
      const terme = b.dataset.terme;
      if (!pop.hidden && pop.dataset.terme === terme) return amagaPop();
      pop.dataset.terme = terme;
      pop.innerHTML = `<strong>${escapa(b.textContent)}</strong>${escapa(GLOSSARI[terme])}`;
      pop.hidden = false;
      const r = b.getBoundingClientRect();
      const amplada = pop.offsetWidth;
      pop.style.left = `${Math.max(8, Math.min(window.innerWidth - amplada - 8, r.left + r.width / 2 - amplada / 2))}px`;
      const dalt = r.top - pop.offsetHeight - 10;
      pop.style.top = `${dalt > 8 ? dalt : r.bottom + 10}px`;
    }));

    const decisio = el.querySelector('.decisio');
    if (decisio) {
      const revela = () => {
        decisio.querySelector('.d-resultat').hidden = false;
        decisio.querySelector('.d-salta').hidden = true;
        decisio.classList.add('resolta');
      };
      decisio.querySelectorAll('.d-opcio').forEach((b) => b.addEventListener('click', () => {
        decisio.querySelectorAll('.d-opcio').forEach((x) => x.classList.toggle('triada', x === b));
        const comentari = decisio.querySelector('.d-comentari');
        comentari.textContent = e.decisio.opcions[b.dataset.i].comentari;
        comentari.hidden = false;
        revela();
      }));
      decisio.querySelector('.d-salta').addEventListener('click', revela);
    }
  }

  return { mostra, navegant, progres, focus: () => el.querySelector('.t-titol')?.focus({ preventScroll: true }) };
}
