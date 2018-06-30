/**
 * Common database helper functions.
 */
class DBHelper {
  static getReviewsDB() {
    return idb.open("mws-reviews", 1, function(upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains("reviews")) {
        let reviewsStore = upgradeDb.createObjectStore("reviews", {
          autoIncrement: true,
          keyPath: "id"
        });
      }
    });
  }
  static addReviewsToDB(review) {
    return this.getReviewsDB().then(function(db) {
      var tx = db.transaction("reviews", "readwrite");
      var store = tx.objectStore("reviews");
      console.log("Putting review into IndexedDB");
      store.put(review);
      return tx.complete;
    });
  }

  /**
   * Adds defered review to local storage and saves 10 up-to-date.
   * @param {*} review - Defered review.
   */
  static getReviewsFromDB(id, callback) {
    let idRestaurant = id;
    return this.getReviewsDB()
      .then(function(db) {
        var tx = db.transaction("reviews", "readonly");
        var store = tx.objectStore("reviews");
      

        return store.getAll();
      })
      .then(function(restaurantsReview) {
        let response = [];
        restaurantsReview.forEach(res => {
          if (res.restaurant_id == idRestaurant) {
            response.push(res);
          }
        });
        callback(null, response);

      });
  }

  /**
   * updates restaurant favourite in case there is no connection
   * @param {*} callback
   */
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    const dbPromise = idb.open("mws-restaurant");
    dbPromise
      .then(function(db) {
        var tx = db.transaction("restaurants", "readonly");
        var store = tx.objectStore("restaurants");
        return store.getAll();
      })
      .then(restaurants => callback(null, restaurants));
  }
  static updateRestaurantFavourite(restaurant) {
    const dbPromise = idb.open("mws-restaurant");

    dbPromise
      .then(function(db) {
        var tx = db.transaction("restaurants");
        var store = tx.objectStore("restaurants");

        return store.getAll();
      })
      .then(function(restaurants) {
        restaurants.forEach(res => {
          if (res.restaurant_id == restaurant.id) {
            let updatedRes = res;
            updatedRes.is_favourite = restaurant.is_favourite;
            store.delete(res);
            store.put(updatedRes);
          }
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  /**
   * Register Service Worker
   */
  static startServiceWorker() {
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker
      .register("service-worker.js")
      .then(function() {
        console.log("Service Worker registered!");
      })
      .catch(function() {
        console.log("Registration Service failed");
      });
  }

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurantServer(callback) {
    fetch(`${DBHelper.DATABASE_URL}`)
      .then(response => response.json())
      .then(restaurant => callback(null, restaurant))
      .catch(function(error) {
        console.log(error);
      });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    const dbPromise = idb.open("mws-restaurant");
    dbPromise
      .then(function(db) {
        var tx = db.transaction("restaurants", "readonly");
        var store = tx.objectStore("restaurants");
        return store.getAll();
      })
      .then(restaurants => callback(null, restaurants));
  }
  /**
   * Fetch review.
   */
  //   static fetchRestaurants(callback) {
  //   let xhr = new XMLHttpRequest();
  //   xhr.open('GET', DBHelper.DATABASE_URL);
  //   xhr.onload = () => {
  //     if (xhr.status === 200) { // Got a success response from server!
  //       const json = JSON.parse(xhr.responseText);
  //       const restaurants = json.restaurants;
  //       callback(null, restaurants);
  //     } else { // Oops!. Got an error from server.
  //       const error = (`Request failed. Returned status of ${xhr.status}`);
  //       callback(error, null);
  //     }
  //   };
  //   xhr.send();
  // }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) {
          // Got the restaurant
          const idRestaurant = restaurant.id;

          DBHelper.getReviewsRestaurant(idRestaurant, (error, reviews) => {
            if (error) {
              callback(null, restaurant);
            } else {
              restaurant.reviews = reviews;
              callback(null, restaurant);
            }
          });
          // callback(null, restaurant);
        } else {
          // Restaurant does not exist in the database
          callback("Restaurant does not exist", null);
        }
      }
    });
  }

  /**
   * Fetch all restaurants reviews by id.
   */
  static getReviewsRestaurant(id, callback) {
    fetch(`http://localhost:1337/reviews/?restaurant_id=${id}`)
      .then(response => response.json())
      .then(reviews =>
        DBHelper.getReviewsFromDB(id, (error, cacheReview) => {
          if (error) {
            callback(null, reviews);
          } else {
            callback(null, cacheReview);
          }
        })
      )
      .catch(function(error) {
        console.log(error);
      });
  }
  /**
   * Fetch all restaurants reviews .
   */
  // DBHelper.fetchRestaurantById(id, (error, restaurant) => {
  static getAllReviewsRestaurant(callback) {
    fetch(`http://localhost:1337/reviews`)
      .then(response => response.json())
      .then(reviews => callback(null, reviews))
      .catch(function(error) {
        console.log(error);
      });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    callback
  ) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != "all") {
          // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != "all") {
          // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map(
          (v, i) => restaurants[i].neighborhood
        );
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter(
          (v, i) => neighborhoods.indexOf(v) == i
        );
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter(
          (v, i) => cuisines.indexOf(v) == i
        );
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return `/img/${restaurant.photograph}.jpg`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }
}
