const CACHE = 'eclipsi-2026-v5';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './data/preguntes-infantils.json',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/images/icon-maskable-512.png',
  './assets/images/CC_BY-NC-SA.png',
  './assets/images/eclipsi-ribera-v2.webp',
  './assets/images/perseides-sant-jeroni.webp',
  './assets/images/laboratori-eclipsi.webp',
  './assets/images/infantil-eclipsi.webp',
  './assets/images/infantil-eclipsi-nena.webp',
  './assets/images/diagrama-eclipsi.webp',
  './assets/images/orbita-inclinada.webp',
  './assets/images/seguretat-observacio.webp',
  './assets/images/totalitat-100.webp',
  './assets/images/horitzo-47.webp',
  './assets/images/fenomens-totalitat.webp',
  './assets/images/experiment-colador.webp',
  './assets/images/ombres-volants.webp',
  './assets/images/laboratori-camp.webp',
  './assets/images/orbita-swift-tuttle.webp',
  './assets/images/meteor-atmosfera.webp',
  './assets/images/guia-perseides.webp',
  './1f. Diari de Camp - Eclipsi Solar Total 2026 (versió per imprimir).pdf',
  './2b. Dossier logístic - Eclipsi Solar Total 2026 (versió actualitzada).pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (!response || response.status !== 200 || response.type === 'opaque') return response;
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }))
  );
});
