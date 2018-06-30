if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}


const dbPromise = idb.open('mws-restaurant', 1, function (upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('restaurants')) {
        let restaurantStore = upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id'
        });
    }
});


dbPromise.then(db => {
    DBHelper.fetchRestaurantServer((error, restaurants) => {
        restaurants.forEach(function (data) {
            let tx = db.transaction('restaurants', 'readwrite');
            let keyValStore = tx.objectStore('restaurants');
            keyValStore.put(data);
            return tx.complete;
        })
    })
});

const dbPromiseReview = idb.open('mws-reviews', 1, function (upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('reviews')) {
        let reviewsStore = upgradeDb.createObjectStore('reviews', {
            autoIncrement: true, keyPath: 'id'
        })
    }
});

dbPromiseReview.then(db => {
    DBHelper.getAllReviewsRestaurant((error, reviews) => {
        reviews.forEach(function (data) {
            let tx = db.transaction('reviews', 'readwrite');
            let keyValStore = tx.objectStore('reviews');
            keyValStore.put(data);
            return tx.complete;
        })
    })
});