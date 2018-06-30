document.addEventListener('DOMContentLoaded', (e) =>{

    document.getElementById('new-review-form').addEventListener('submit', function (e) {
        e.preventDefault();
        let name = document.getElementById('name').value;
        let rating = document.getElementById('rating').value;
        let comments = document.getElementById('comments').value;
        let restaurantId = document.getElementById('restId').value;

        var review ={
            "restaurant_id": restaurantId,
            "name": name,
            "rating": rating,
            "comments": comments
        }

        if(!navigator.onLine){
            alert('You are offline, your review will be submitted as soon as your connection comes back.');
        }
        DBHelper.addReviewsToDB(review).then(function(){
            // request a one-off sync:
            navigator.serviceWorker.ready.then(function(swRegistration) {
                swRegistration.sync.register('review-submission');

            });
        //
        }).catch(function(err) {
            // something went wrong with the database or the sync registration, log and submit the form
            console.error(err);
        });

        const ul = document.getElementById('reviews-list');
        review.createdAt = new Date();
        ul.appendChild(createReviewHTML(review));
        this.reset();
    })
});