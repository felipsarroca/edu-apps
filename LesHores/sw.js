const CACHE_NAME = "leshores-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./engine.js",
  "./favicon.svg",
  "./icona.svg",
  "./CC_BY-NC-SA.svg",
  "./levels.json",
  "./badges.json",
  "./time_bank.json",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Força l'activació immediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      ).then(() => self.clients.claim()); // Pren el control de les pàgines immediatament
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});