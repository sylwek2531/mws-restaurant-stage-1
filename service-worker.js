const restaurantCache = 'mnw-restaurant-stage-1';

// install sw

self.addEventListener('install', function (event) {
    let urlsToFetch = [
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
    event.waitUntil(
        caches.open(restaurantCache).then(function (cache) {
            return cache.addAll(urlsToFetch)
        })
    )
});


self.addEventListener('fetch', function (event) {
    event.respondWith(async function() {
        // Try to get the response from a cache.
        const cache = await caches.open(restaurantCache);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            // If we found a match in the cache, return it, but also
            // update the entry in the cache in the background.
            event.waitUntil(cache.add(event.request));
            return cachedResponse;
        }

        // If we didn't find a match in the cache, use the network.
        return fetch(event.request);
    }());
});