var request = require('request-promise');
var ps = [];
var orders = [];
var pg1 = {
  uri: 'https://backend-challenge-fall-2017.herokuapp.com/orders.json?page=1',
  json: true
}

 function hasCookie(products){
  var cookie = false;
  products.forEach(function(product){
    if(product.title == "Cookie"){
      cookie = true;
    }
  })
  return cookie;
  }

request(pg1)
.then(function(response){
  var cookies_left = response.available_cookies;
  var numOrd = response.pagination.total;
  var pages = Math.ceil(numOrd/response.pagination.per_page);
  for (var i = 1; i <= pages; i++) {
    var ordersonpg = {
      uri: 'https://backend-challenge-fall-2017.herokuapp.com/orders.json?page='+ i,
      json: true,
    };
    ps.push(request(ordersonpg));
}
Promise.all(ps)
  .then((results) => {
    for (var i = 0; i < pages; i++) {
      orders = orders.concat(results[i].orders);
    }
    orders = orders.filter(function(order){
     return hasCookie(order.products) && !order.fulfilled
   })
   orders.sort(function(a, b){
     a.products.
   })
      // //console.log(orders[0].products);
      // console.log(hasCookie(orders[0].products));
     console.log(orders);

  })
  .catch(err => console.log(err));
})
.catch(function(err){
  throw err;
})
