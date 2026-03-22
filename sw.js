const CACHE = 'wellness-v1';
const FILES = [
  '/Wellness-Tracker/',
  '/Wellness-Tracker/index.html',
  '/Wellness-Tracker/manifest.json',
  '/Wellness-Tracker/icon.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(FILES); })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request); })
  );
});
