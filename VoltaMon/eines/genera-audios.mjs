// Genera la narració en MP3 de cada etapa amb una veu neuronal catalana.
//
// Requisits: Node 22 o posterior i edge-tts (pip install edge-tts).
// Ús, des de la carpeta VoltaMon:
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
import { dataLlarga } from '../js/util.js';

const VEU = 'ca-ES-JoanaNeural';
const VELOCITAT = '-5%';
const CARPETA = 'audio';

const CAIXES = { sabies: 'Sabies que…?', perspectiva: 'Una altra mirada.', debat: 'Fet o interpretació?' };
const ORDINALS = ['Primera', 'Segona', 'Tercera', 'Quarta'];

const pla = (t) => t.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\{[\w-]+:([^}]+)\}/g, '$1');

const INTRO = [
  'La primera volta al món. L\'expedició de Magallanes i Elcano.',
  'Per què volien arribar a les Moluques?',
  'Fa 500 anys, espècies com el clau, el pebre o la canyella valien una fortuna a Europa. El clau només creixia en unes petites illes d\'Àsia: les Moluques.',
  'Portugal hi arribava navegant cap a l\'est, envoltant l\'Àfrica. Castella no podia fer servir aquella ruta: el Tractat de Tordesillas, del 1494, havia repartit el món entre els dos regnes. Magallanes va proposar una idea agosarada: arribar-hi navegant cap a l\'oest.',
];

function textEtapa(e, i) {
  const parts = [`${e.titol}.`];
  if (!e.epileg) parts.push(`${e.lloc}. ${e.dataText || dataLlarga(e.data)}.`);
  if (e.balanc) {
    const n = Math.abs(e.homes - ETAPES[i - 1].homes);
    parts.push(`${n > 1 ? 'Uns ' : ''}${n} ${n === 1 ? 'home' : 'homes'} menys: ${e.balanc}.`);
  }
  parts.push(...e.text);
  if (e.decisio) {
    parts.push('Què hauries fet tu?', e.decisio.pregunta);
    e.decisio.opcions.forEach((o, i) => parts.push(`${ORDINALS[i]} opció: ${o.text}`));
  }
  if (e.cita) parts.push(`Cita de ${e.cita.autor}: «${e.cita.text}»`);
  if (e.caixa) parts.push(CAIXES[e.caixa.tipus], e.caixa.text);
  if (e.resum) parts.push('Què va canviar aquest viatge?', ...e.resum);
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
