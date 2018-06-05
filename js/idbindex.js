if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}
var dbPromise = idb.open('mws-restaurant', 1, function(upgradeDb){
    if (!upgradeDb.objectStoreNames.contains('restaurants')){
        var restaurantStore = upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id'
        });
    }
});


dbPromise.then(db => {
    DBHelper.fetchRestaurantServer((error, restaurants) => {
        restaurants.forEach(function(data){
            var tx = db.transaction('restaurants', 'readwrite');
            var keyValStore = tx.objectStore('restaurants');
            keyValStore.put(data);
            return tx.complete;
        })
    })
});
