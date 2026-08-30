const CACHE_NAME = 'kp-dashboard-v1';
const urlsToCache = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(
          caches.keys().then(names => Promise.all(
                  names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
                ))
        );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    // Network-first for API calls, cache-first for assets
                        if (e.request.url.includes('api.weatherlink.com') || e.request.url.includes('corsproxy.io') || e.request.url.includes('allorigins.win')) {
                              e.respondWith(
                                      fetch(e.request).catch(() => caches.match(e.request))
                                    );
                        } else {
                              e.respondWith(
                                      caches.match(e.request).then(r => r || fetch(e.request))
                                    );
                        }
});
