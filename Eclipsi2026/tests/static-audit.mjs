import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('index.html');
const app = read('app.js');
const css = read('styles.css');
const sw = read('sw.js');
const infantQuestions = JSON.parse(read('data/preguntes-infantils.json'));
const manifest = JSON.parse(read('manifest.webmanifest'));
const markup = `${index}\n${app}`;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

const imageTags = [...markup.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
check(imageTags.length >= 10, 'Falten imatges pertinents a les pantalles.');
check(imageTags.every(tag => /\balt="[^"]*"/.test(tag)), 'Hi ha una imatge sense text alternatiu.');
check(imageTags.every(tag => /\bwidth="[^"]+"/.test(tag) && /\bheight="[^"]+"/.test(tag)), 'Hi ha una imatge sense dimensions reservades.');
const imageSources = [...markup.matchAll(/src="(assets\/images\/[^"$]+)"/g)].map(match => match[1]);
for (const source of imageSources) check(fs.existsSync(path.join(root, source)), `Imatge inexistent: ${source}`);

check(infantQuestions.length === 90, `S’esperaven 90 preguntes infantils i n’hi ha ${infantQuestions.length}.`);
check(new Set(infantQuestions.map(question => question.id)).size === 90, 'Hi ha identificadors de pregunta repetits.');
check(infantQuestions.every(question => Array.isArray(question.options) && question.options.length >= 2 && question.options.length <= 3), 'Totes les preguntes han de tenir dues o tres opcions.');
check(infantQuestions.every(question => Number.isInteger(question.correct) && question.correct >= 0 && question.correct < question.options.length), 'Hi ha una resposta correcta fora de rang.');
check(infantQuestions.some(question => question.options.length === 2) && infantQuestions.some(question => question.options.length === 3), 'El banc ha de combinar preguntes de dues i tres opcions.');
check(infantQuestions.filter(question => question.options.length === 2 && question.options.every(option => option.label === 'SÍ' || option.label === 'NO')).length >= 30, 'Falten preguntes binàries SÍ/NO.');
check(app.includes('optionOrders') && app.includes('shuffled(question.options'), 'Les opcions no es barregen a cada ronda.');
check(app.includes("slice(0, 5)"), 'No es detecta la selecció aleatòria de cinc preguntes.');
check(app.includes("state.kids5.phase === 'retry'") && app.includes('data-kids-review'), 'No es detecta la ronda de rectificació d’errors.');
check(app.includes('Crònica de la jornada'), 'Falta la crònica final de 10–12 anys.');
check(app.includes('data-observation') && app.includes("'not-seen'") && app.includes("'unchecked'"), 'Falten els tres estats de les observacions.');
check(app.includes('data-young-profile') && app.includes('youngProfiles'), 'Falten els perfils independents de 10–12 anys.');
check(app.includes('data-print-report') && app.includes('data-export-young'), 'Falten les sortides PDF o JSON de la crònica.');
check(app.includes('data-adult-checked') && app.includes('data-timeline-toggle') && app.includes('data-pending-filter'), 'Falten controls operatius de la vista adulta.');
check(app.includes('data-kids-effects') && app.includes('kidsHistory'), 'Falten els efectes configurables o l’historial infantil.');
check(index.includes('id="image-dialog"') && app.includes('data-lightbox'), 'Falta l’ampliació accessible de les imatges.');
check(markup.includes('infantil-eclipsi-nena.webp'), 'Falta representació visual infantil inclusiva.');

const ranges = [...app.matchAll(/<input\b[^>]*type="range"[^>]*>/g)].map(match => match[0]);
check(ranges.length === 6, `S’esperaven 6 selectors i n’hi ha ${ranges.length}.`);
check(ranges.every(tag => /aria-label=|\bid="predictedDrop"/.test(tag)), 'Hi ha un selector sense nom accessible.');

const externalBlankLinks = [...markup.matchAll(/<a\b[^>]*href="https:[^"]+"[^>]*target="_blank"[^>]*>/g)].map(match => match[0]);
check(externalBlankLinks.every(tag => /rel="noopener noreferrer"/.test(tag)), 'Hi ha un enllaç extern sense protecció noopener.');

check(index.includes('Aplicació creada per <a href="https://ja.cat/felipsarroca"'), 'Falta el crèdit corporatiu de Felip.');
check(index.includes('Obra sota llicència <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca"'), 'Falta la llicència corporativa.');
check(css.includes('min-height: 48px') && css.includes('min-height: 44px'), 'No es detecten les mides tàctils mínimes.');
check(css.includes(':focus-visible'), 'Falta un indicador de focus visible.');
check(css.includes('prefers-reduced-motion'), 'Falta el tractament de moviment reduït.');
check(css.includes('@media print') && css.includes('.report-meta'), 'Falta el full d’estils imprimible de la crònica.');

for (const route of ['inici', 'adults', 'joves', 'infants']) {
  check(markup.includes(`data-route="${route}"`), `Falta la ruta ${route}.`);
}

check(manifest.display === 'standalone', 'El manifest no està configurat com a aplicació independent.');
check(manifest.icons.some(icon => icon.sizes === '192x192'), 'Falta la icona PWA de 192 px.');
check(manifest.icons.some(icon => icon.sizes === '512x512'), 'Falta la icona PWA de 512 px.');
check(sw.includes("eclipsi-2026-v5"), 'La memòria cau del PWA no s’ha actualitzat a la versió 5.');

const shellFiles = [...sw.matchAll(/'\.\/([^']*)'/g)].map(match => match[1]);
for (const relative of shellFiles) {
  check(fs.existsSync(path.join(root, relative)), `Recurs offline inexistent: ${relative}`);
}
for (const source of new Set(imageSources)) check(sw.includes(`'./${source}'`), `Imatge no disponible offline: ${source}`);

check(!/TODO|PLACEHOLDER|lorem ipsum/i.test(markup), 'S’ha trobat contingut provisional.');
console.log(`AUDITORIA CORRECTA · ${imageTags.length} imatges · ${ranges.length} selectors · ${externalBlankLinks.length} enllaços externs · ${shellFiles.length} recursos offline`);
