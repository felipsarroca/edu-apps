// Narració amb àudios pregenerats (audio/*.mp3, veu neuronal catalana).
// Es fan servir fitxers i no la síntesi del navegador perquè molts navegadors
// no tenen cap veu catalana i llegeixen el text amb accent castellà.

const audio = new Audio();
audio.preload = 'none';

let cua = [];
let boto = null;

function marca(actiu) {
  if (!boto) return;
  boto.classList.toggle('actiu', actiu);
  boto.setAttribute('aria-pressed', String(actiu));
}

export function atura() {
  audio.pause();
  cua = [];
  marca(false);
  boto = null;
}

function seguent() {
  const fitxer = cua.shift();
  if (!fitxer) return atura();
  audio.src = `audio/${fitxer}.mp3`;
  audio.play().catch(atura);
}

audio.addEventListener('ended', seguent);
audio.addEventListener('error', atura);

/** Reprodueix els fitxers en ordre; si el mateix botó ja sonava, s'atura. */
export function reprodueix(fitxers, element) {
  const mateix = boto === element && !audio.paused;
  atura();
  if (mateix) return;
  boto = element;
  cua = [...fitxers];
  marca(true);
  seguent();
}
