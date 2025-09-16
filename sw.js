const CACHE_NAME = "intouch-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/style.css",
  "/javascript.js",
  "/img/logo.png"
];

self.addEventListener("install", event => {
  console.log("Service Worker instalado");
});

self.addEventListener("fetch", event => {
  event.respondWith(fetch(event.request));
});
