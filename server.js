
var http = require('http');
var express = require('express');
var path = require('path');
var request = require('request');


// **************************************************************************

// Build the server
var app = express();

// map access to public files
app.use("/public", express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

module.exports = app;






