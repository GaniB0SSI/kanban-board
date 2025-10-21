const CACHE_NAME = 'kanban-cache-v1';
const RUNTIME_CACHE = 'kanban-runtime-v1';

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/offline.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/manifest-icon-192.maskable.png',
  '/icons/manifest-icon-512.maskable.png'
];

// Install: precache app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== RUNTIME_CACHE) return caches.delete(key);
        })
      );
      await self.clients.claim();
    })()
  );
});

// Utility: send message to all clients
async function broadcastMessage(msg) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage(msg);
  }
}

// Fetch: try cache first for navigation, fallback to offline page. For others, use stale-while-revalidate.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // For navigation requests, respond with cached index or offline page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Save a copy in runtime cache
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match('/');
          return cached || cache.match('/offline.html');
        })
    );
    return;
  }

  // For other requests, try cache, then network, and update cache in background
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((res) => {
          // Only cache successful responses
          if (!res || res.status !== 200 || res.type === 'opaque') return res;
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(() => null);

      return cached || networkFetch.then((res) => res) || caches.match('/offline.html');
    })
  );
});

// Listen for messages from the client
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Notify clients when a new service worker is waiting to activate
self.addEventListener('controllerchange', () => {
  broadcastMessage({ type: 'SW_UPDATED' });
});