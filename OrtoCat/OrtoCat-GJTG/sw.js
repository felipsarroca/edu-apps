const CACHE_NAME = "ortocat-gjtg-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=review27",
  "./app.js?v=review27",
  "./manifest.webmanifest",
  "./data/rules.json?v=review27",
  "./data/words.json?v=review27",
  "./data/homophones.json?v=review27",
  "./assets/CC_BY-NC-SA.png",
  "./favicon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached || fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
