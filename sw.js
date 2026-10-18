// Guarda los íconos para que la app abra rápido. La página siempre se pide a internet (así nunca queda una versión vieja).
var CACHE = 'tareas-v4';
var ARCHIVOS = ['icono-192.png', 'icono-512.png', 'icono-maskable-512.png', 'favicon.png', 'manifest.webmanifest'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {   // la página: siempre de internet, sin caché
    e.respondWith(fetch(e.request, { cache: 'no-store' }).catch(function () { return caches.match('icono-192.png'); }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
