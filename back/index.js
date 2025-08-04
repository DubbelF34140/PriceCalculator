var path = require('path');
var express = require('express');
var app = express();

var options = {
    index: "myWebPage.html"
  };

var dir = path.join(__dirname, '../front');

app.get('/api', function(req, res){
    res.send("Yes we have an API now")
});

app.get('/api/price', function(req, res){
    var s = req.query.salary;
    var d = req.query.days;
    let finalPrice = 0;
    dailyRate = s/365;
    price = Math.round(dailyRate * d);
    var roundToNearest = 50;
    roundedPrice = Math.round((price+roundToNearest)/roundToNearest) * roundToNearest
    res.send(""+roundedPrice)
});

app.use(express.static(dir, options));

app.use(function ( req, res, next) {
    res.send('This page does not exist!')
});

app.listen(8000, function () {
    console.log('Listening on http://localhost:8000/');
});