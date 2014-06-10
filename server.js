
var http = require('http');
var express = require('express');
var path = require('path');

// Build the server
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// map base store access to files in /config & /public to applicable resources
app.use("/config", express.static(__dirname+'/config'));
app.use("/public", express.static(__dirname+'/public'));
// map store-specific access to files in /config and /public
app.use("/:storename/public", express.static(__dirname + '/public'));
app.use("/:storename/config", express.static(__dirname + '/config'));

// return store-specific index page
app.get('/:storename/', function(request, response){
    response.render("index", {store: {name: request.params["storename"], style: 'public/css/app/style.css'}});
});

// return base store index page.
app.get('/', function(request, response){
    response.render("index", {store: {name: 'hybris Demo Store', style: 'public/css/app/style.css'}});
});

module.exports = app;







