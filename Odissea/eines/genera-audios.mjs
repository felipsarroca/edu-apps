// Genera la narració en MP3 de cada etapa amb una veu neuronal catalana.
//
// Requisits: Node 22 o posterior i edge-tts (pip install edge-tts).
// Ús, des de la carpeta Odissea:
//   node eines/genera-audios.mjs            → només els àudios que falten
//   node eines/genera-audios.mjs --tots     → els regenera tots (després de canviar textos)
//   node eines/genera-audios.mjs mactan     → només una etapa
//
// Per a cada etapa es crea audio/<id>.mp3 i, si té decisió, audio/<id>-resultat.mp3.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ETAPES } from '../js/dades/etapes.js';

const VEU = 'ca-ES-JoanaNeural';
const VELOCITAT = '-5%';
const CARPETA = 'audio';

const CAIXES = { sabies: 'Sabies que…?', pensa: 'Pensa-hi.', mite: 'Mite o realitat?' };
const ORDINALS = ['Primera', 'Segona', 'Tercera', 'Quarta'];

const pla = (t) => t.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\{[\w-]+:([^}]+)\}/g, '$1');

const INTRO = [
  "L'Odissea. El viatge d'Ulisses, de Troia a Ítaca.",
  'Qui és Ulisses?',
  "Ulisses, en grec Odisseu, és el rei d'Ítaca, una petita illa de Grècia. Fa deu anys que lluita a la guerra de Troia, i és famós per la seva astúcia.",
  "Ara només vol tornar a casa, amb la seva dona Penèlope i el seu fill Telèmac. Però el retorn durarà deu anys més: monstres, deesses, tempestes i la ira de Posidó, el déu del mar. L'Odissea, el poema d'Homer, explica aquest viatge.",
];

function textEtapa(e, i) {
  const parts = [`${e.titol}.`];
  if (!e.epileg) parts.push(`${e.lloc}. ${e.cant} de l'Odissea.`);
  if (e.balanc) {
    const n = ETAPES[i - 1].companys - e.companys;
    parts.push(`${n > 6 ? 'Uns ' : ''}${n} ${n === 1 ? 'company' : 'companys'} menys: ${e.balanc}.`);
  }
  parts.push(...e.text);
  if (e.decisio) {
    parts.push('Què hauries fet tu?', e.decisio.pregunta);
    e.decisio.opcions.forEach((o, i) => parts.push(`${ORDINALS[i]} opció: ${o.text}`));
  }
  if (e.cita) parts.push(`Diu l'Odissea: «${e.cita.text}»`);
  if (e.caixa) parts.push(CAIXES[e.caixa.tipus], e.caixa.text);
  if (e.resum) parts.push('Què ens explica encara avui?', ...e.resum);
  return parts.map(pla).join('\n\n');
}

const textResultat = (e) => ['Què va passar.', ...e.decisio.resultat].map(pla).join('\n\n');

function genera(nom, text, forca) {
  const desti = join(CARPETA, `${nom}.mp3`);
  if (!forca && existsSync(desti)) return;
  const temporal = join(tmpdir(), `voltamon-${nom}.txt`);
  writeFileSync(temporal, text, 'utf8');
  execFileSync('edge-tts', ['--voice', VEU, `--rate=${VELOCITAT}`, '-f', temporal, '--write-media', desti], { stdio: 'inherit' });
  rmSync(temporal);
  console.log(`✓ ${desti}`);
}

const args = process.argv.slice(2);
const forca = args.includes('--tots');
const nomes = args.find((a) => !a.startsWith('--'));
mkdirSync(CARPETA, { recursive: true });

if (!nomes || nomes === 'intro') genera('intro', INTRO.join('\n\n'), forca || nomes === 'intro');
for (const [i, e] of ETAPES.entries()) {
  if (nomes && e.id !== nomes) continue;
  genera(e.id, textEtapa(e, i), forca || !!nomes);
  if (e.decisio) genera(`${e.id}-resultat`, textResultat(e), forca || !!nomes);
}
