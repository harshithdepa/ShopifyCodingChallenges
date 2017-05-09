var request = require('request-promise');
var ps = [];
var orders = [];
var pg1 = {
  uri: 'https://backend-challenge-fall-2017.herokuapp.com/orders.json?page=1',
  json: true
}

 function hasCookie(order){
  var cookie = false;
  for (var i = 0; i < order.products.length; i++) {
    if(order.products[i].title === "Cookie"){
      cookie = true;
      order.cksWant = order.products[i].amount;
    }
    // if(products[i].title !== "Cookie"){
    //   products.splice(i, 1);
    //   i--;
    // }
  }
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
     return hasCookie(order) && !order.fulfilled
   })
   orders.sort(function(a, b){
     return b.cksWant - a.cksWant;
   })
   for (var i = 0; i < orders.length; i++) {
     if(orders[i].cksWant <= cookies_left){
       cookies_left -= orders[i].cksWant;
       orders.splice(i, 1);
       i--;
     }
     }
      // //console.log(orders[0].products);
      // console.log(hasCookie(orders[0].products));
      orders.sort(function (a, b) {
        return a.id - b.id;
      })
     var result = {
       "remaining_cookies": cookies_left,
       "unfulfilled_orders": [],
     }
     for (var i = 0; i < orders.length; i++) {
       result.unfulfilled_orders.push(orders[i].id);
     }
     var shopdata = {
    url: 'http://localhost/spot',
    method: "POST",
    body: result,
    json: true,
  }
     //console.log(result);
  })
  .catch(err => console.log(err));
})
.catch(function(err){
  throw err;
})
