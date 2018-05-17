const restaurantCache = 'mnw-restaurant-stage-1';
const urlsToFetch = [
    '/index.html',
    '/restaurant.html',
    '/service-worker.js',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/css/styles.css',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];
// install sw

self.addEventListener('install', function (event) {

    event.waitUntil(
        caches.open(restaurantCache).then(function (cache) {
            return cache.addAll(urlsToFetch)
        })
    )
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function(resp) {
            return resp || fetch(event.request);
        })
    );
});
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('mnw-restaurant-stage-') && cacheName !== restaurantCache;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    )
});