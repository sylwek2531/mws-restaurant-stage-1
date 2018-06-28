if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}


const dbPromise = idb.open('mws-restaurant', 1, function(upgradeDb){
    if (!upgradeDb.objectStoreNames.contains('restaurants')){
        var restaurantStore = upgradeDb.createObjectStore('restaurants', {
            keyPath: 'id'
        });
    }else{
        var tx = db.transaction('restaurants', 'readonly');
        var store = tx.objectStore('restaurants');
        return store.getAll();
    }
});


dbPromise.then(db => {
    DBHelper.fetchRestaurantServer((error, restaurants) => {
        console.log(restaurants, 'sdfdsfEWLO');
        restaurants.forEach(function(data){
            var tx = db.transaction('restaurants', 'readwrite');
            var keyValStore = tx.objectStore('restaurants');
            keyValStore.put(data);
            return tx.complete;
        })
    })
});
