const CACHE_NAME = 'factisizer-static-v1';
const OFFLINE_FALLBACK_URL = '/';

const PRECACHE_URLS = [
  '/',
  '/privacy-policy',
  '/manifest.webmanifest',
  '/icon-192.png',
  '/icon-512.png',
  '/header.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedPage = await caches.match(request);
        return cachedPage || caches.match(OFFLINE_FALLBACK_URL);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(request);

        const shouldCache =
          networkResponse.ok &&
          (request.destination === 'image' ||
            url.pathname === '/manifest.webmanifest' ||
            url.pathname.startsWith('/_next/static/'));

        if (shouldCache) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        return caches.match(request);
      }
    })
  );
});