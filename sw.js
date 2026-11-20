// Réseau d'abord : chaque mise à jour poussée sur GitHub Pages arrive tout de suite.
// Le cache ne sert que hors connexion. Incrémenter VERSION à chaque grosse mise à jour.
const VERSION = 'hurricane-younes-v2';
const ASSETS = ['./', './index.html', './style.css', './data.js', './app.js', './manifest.json', './icon-192.png', './icon-512.png', './celebration.webp', './bebas-neue.woff2', './oswald-600.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Open Food Facts : toujours en ligne
  e.respondWith(
    fetch(e.request).then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(self.clients.matchAll({ type: 'window' }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow('./index.html'))); });
