const CACHE_NAME = "kanban-board-cache-v2";
const urlsToCache = ["/", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const isSameOrigin = new URL(request.url).origin === self.location.origin;

  // Bypass cross-origin (e.g., geo API) to avoid CORS issues
  if (!isSameOrigin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((network) => {
        if (!network || network.status !== 200 || network.type !== 'basic') {
          return network;
        }
        const copy = network.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return network;
      });
    })
  );
});
