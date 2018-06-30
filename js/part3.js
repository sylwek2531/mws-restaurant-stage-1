document.addEventListener('DOMContentLoaded', (e) =>{
   console.log('1');
    setTimeout(function () {
        console.log('2');
// i don know why i must use set timeout in there
//         i must wait to load file and play code?
        document.querySelectorAll('.restaurant-like').forEach((item) => {
            console.log('3');
            item.addEventListener('click', (event) => {
                event.preventDefault();
                let restaurantID = item.getAttribute('like-id');

                const isFavourite = item.classList.contains('like');
                item.classList.toggle('like');
                const url = 'http://localhost:1337/restaurants/' + restaurantID + '/?is_favorite=' + !isFavourite;
                fetch(url,{
                    method: 'PUT'
                }).then((response) => {
                    return response.json();
                }).catch((err) => {
                    console.log('qqq')
                    let resInfo = {'id' : restaurantID, 'is_favourite' : !isFavourite};
                    DBHelper.updateRestaurantFavourite(resInfo);
                });


            });
        });
    }, 2000)
});