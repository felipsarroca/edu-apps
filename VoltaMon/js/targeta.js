import { ETAPES } from './dades/etapes.js';
import { GLOSSARI } from './dades/glossari.js';
import { escapa, dataLlarga } from './util.js';
import { diaDe } from './marcador.js';

const TOTAL = ETAPES.filter((e) => !e.epileg).length;

const CAIXES = {
  sabies: { titol: 'Sabies que…?', icona: '✦' },
  perspectiva: { titol: 'Una altra mirada', icona: '◐' },
  debat: { titol: 'Fet o interpretació?', icona: '⚖' },
};

/** Text de les dades → HTML: **negreta** i {terme:paraula} del glossari. */
function format(text) {
  return escapa(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\{([\w-]+):([^}]+)\}/g, (_, terme, paraula) =>
      GLOSSARI[terme] ? `<button type="button" class="mot" data-terme="${terme}">${paraula}</button>` : paraula);
}

const textPla = (text) => text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\{[\w-]+:([^}]+)\}/g, '$1');

const paragrafs = (llista) => llista.map((p) => `<p>${format(p)}</p>`).join('');

function capcalera(e, index) {
  if (e.epileg) return '<span class="t-num">Epíleg</span>';
  const data = `${e.aprox ? '≈ ' : ''}${e.dataText || dataLlarga(e.data)}`;
  return `
    <span class="t-num">Etapa ${index + 1} de ${TOTAL}</span>
    <span class="t-data">${escapa(data)} · dia ${diaDe(e)}</span>`;
}

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

  const veu = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let etapaActual = null;

  function llegeix(boto) {
    if (!veu) return;
    if (veu.speaking) {
      veu.cancel();
      return;
    }
    const e = etapaActual;
    const parts = [e.titol, ...e.text];
    if (e.decisio) parts.push(e.decisio.pregunta);
    const d = el.querySelector('.d-resultat');
    if (d && !d.hidden) parts.push(...e.decisio.resultat);
    if (e.cita) parts.push(e.cita.text);
    const frase = new SpeechSynthesisUtterance(parts.map(textPla).join('. '));
    frase.lang = 'ca-ES';
    const catala = veu.getVoices().find((v) => v.lang.toLowerCase().startsWith('ca'));
    if (catala) frase.voice = catala;
    frase.rate = 0.95;
    frase.onstart = () => boto.classList.add('actiu');
    frase.onend = frase.onerror = () => boto.classList.remove('actiu');
    veu.speak(frase);
  }

  function mostra(index) {
    veu?.cancel();
    amagaPop();
    const e = ETAPES[index];
    etapaActual = e;
    const darrera = index === ETAPES.length - 1;
    const seguentText = darrera ? 'Torna a començar ↺' : ETAPES[index + 1].epileg ? 'Què va passar després? ▸' : 'Continua el viatge ▸';

    el.innerHTML = `
      <div class="t-cap">
        <div class="t-meta">${capcalera(e, index)}</div>
        <div class="t-botons">
        ${veu ? '<button type="button" class="t-veu" aria-label="Escolta el text" title="Escolta el text"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>' : ''}
        <button type="button" class="t-plega" aria-label="Plega o desplega el text" aria-expanded="${!el.classList.contains('plegada')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
      </div>
      <h2 class="t-titol" tabindex="-1">${escapa(e.titol)}</h2>
      <p class="t-lloc"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>${escapa(e.lloc)}</p>
      <div class="t-cos">
        ${paragrafs(e.text)}
        ${e.decisio ? htmlDecisio(e.decisio) : ''}
        ${e.cita ? `<blockquote class="cita"><p>${format(e.cita.text)}</p><footer>— ${escapa(e.cita.autor)}</footer></blockquote>` : ''}
        ${e.caixa ? `<aside class="caixa caixa-${e.caixa.tipus}"><h3><span aria-hidden="true">${CAIXES[e.caixa.tipus].icona}</span> ${CAIXES[e.caixa.tipus].titol}</h3><p>${format(e.caixa.text)}</p></aside>` : ''}
        ${e.resum ? `<section class="resum"><h3>Què va canviar aquest viatge?</h3><ul>${e.resum.map((r) => `<li>${format(r)}</li>`).join('')}</ul></section>` : ''}
      </div>
      <div class="t-nav">
        <button type="button" class="boto boto-secundari t-anterior" ${index === 0 ? 'disabled' : ''} aria-label="Etapa anterior">◂</button>
        <button type="button" class="boto boto-principal t-seguent">${seguentText}</button>
      </div>`;

    el.scrollTop = 0;
    el.querySelector('.t-veu')?.addEventListener('click', (ev) => llegeix(ev.currentTarget));
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

  return { mostra, focus: () => el.querySelector('.t-titol')?.focus({ preventScroll: true }) };
}
