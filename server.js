
var http = require('http');
var express = require('express');
var path = require('path');
var token = null; // OAuth token for anonymous login
var storeTenant =  'onlineshop';

//****************************************************************
// Load the token for the anonymous login:
var request = require('request');

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

request.post(
    'http://user-service.dprod.cf.hybris.com/auth/anonymous/login?project=0cf4fd80-462f-4049-b660-75ce8dffd3ab',
    { form: { key: 'value' } },
    function (error, response, body) {
        console.log('token request response: '+ response.statusCode);
        if (error ) {
            console.log(error);
        } else {
            token = getParameterByName('access_token', response.headers['location']);
        }
    }
);

// **************************************************************************

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


//*********************
// Store Config route
app.get('/storeconfig', function(request, response) {
    console.log('request for store config');
    var json = JSON.stringify( {
        storeTenant: storeTenant,
        accessToken: token }
    );
    response.send(json);
});

module.exports = app;







