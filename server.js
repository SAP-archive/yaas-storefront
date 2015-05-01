// ExpressJS configuration for single tenant

var http = require('http');
var express = require('express');
var path = require('path');
var request = require('request');

var fs = require('fs');
var https = require('https');

//Type 1
// var https_options = {
//   key: fs.readFileSync('server/keys/key.pem'),
//   cert: fs.readFileSync('server/keys/cert.pem')
// };

//Type 2
// var https_options = {
//   key: fs.readFileSync('server/keys/hybris-key.pem'),
//   cert: fs.readFileSync('server/keys/hybris-cert.pem')
// };

//Type 3
// var https_options = {
//   key: fs.readFileSync('server/keys/hybris.key.pem'),
//   cert: fs.readFileSync('server/keys/hybris.cert.pem')
// };


// Build the server
var app = express();

console.log('DIRNAME', __dirname);

// map access to public files
app.use(express.static(__dirname + '/public')); 

console.log('STARTING HTTPS SERVER.');

// create https service
// https.createServer(https_options, app).listen(9001);

console.log('HTTPS SERVER STARTED.');

module.exports = app;


