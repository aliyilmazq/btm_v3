const CACHE_NAME = 'citalf-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // Diğer statik dosyalar gerekirse eklenebilir
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
}); 