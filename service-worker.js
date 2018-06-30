const restaurantCache = 'mnw-restaurant-stage-v';
const contentImgsCahce = 'mnw-restaurant-stage-img';
const allCaches = [
    restaurantCache,
    contentImgsCahce
];
const urlsToFetch = [
    '/js/part3.js',
    '/js/part3-res.js',
    '/index.html',
    '/manifest.json',
    '/restaurant.html',
    '/service-worker.js',
    '/js/dbhelper.js',
    '/js/idb.js',
    '/js/idbindex.js',
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
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );

});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('mnw-restaurant-stage-v') && !allCaches.includes(cacheName);
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    )
});