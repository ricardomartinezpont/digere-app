const CACHE = 'digere-v1';
const SHELL = ['./','manifest.json','icon-192.png','icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Solo cachear recursos del shell, no el iframe de Apps Script
  if (SHELL.some(s => e.request.url.endsWith(s.replace('./', '')))) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
