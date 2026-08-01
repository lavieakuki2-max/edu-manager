const CACHE_VERSION = 'edumanager-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_CACHE = `${CACHE_VERSION}-offline`;
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
    OFFLINE_URL,
    '/manifest.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(OFFLINE_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((key) => !key.startsWith(CACHE_VERSION)).map((key) => caches.delete(key))))
            .then(() => self.clients.claim()),
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) return;

    if (url.pathname === OFFLINE_URL || url.pathname === '/manifest.json') {
        event.respondWith(
            caches.match(request).then((cached) => cached || fetch(request).then((response) => {
                const copy = response.clone();
                caches.open(OFFLINE_CACHE).then((cache) => cache.put(request, copy));
                return response;
            })),
        );
        return;
    }

    const isNavigation = request.mode === 'navigate';
    const isBuildAsset = url.pathname.startsWith('/build/');

    if (isNavigation) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() =>
                    caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)),
                ),
        );
        return;
    }

    if (isBuildAsset) {
        event.respondWith(
            caches.open(STATIC_CACHE).then((cache) =>
                cache.match(request).then((cached) => {
                    const networkFetch = fetch(request).then((response) => {
                        cache.put(request, response.clone());
                        return response;
                    }).catch(() => cached);
                    return cached || networkFetch;
                }),
            ),
        );
        return;
    }

    event.respondWith(
        fetch(request).catch(() => caches.match(request)),
    );
});
