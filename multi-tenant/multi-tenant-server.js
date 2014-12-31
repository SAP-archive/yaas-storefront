
var http = require('http');
var express = require('express');
var path = require('path');
var request = require('request');
require('request').debug = true;
var async = require('async');

// **************************************************************************

// Build the server
var app = express();

app.use("/:storename/", express.static(__dirname + '/../public/'));

// ANGULAR UI-ROUTER WORKAROUND - append trailing '/'
// Long-term, this should be fixed in app.js.
app.get(/^\/\w+$/, function(request, response){
    var newUrl = request.url+'/';
    //console.log('redirect to '+newUrl);
    response.redirect(newUrl);
});

module.exports = app;





