const CACHE_NAME = "intouch-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/style.css",
  "/javascript.js",
  "/img/logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});


self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
