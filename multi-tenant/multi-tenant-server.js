
var http = require('http');
var express = require('express');
var path = require('path');
var request = require('request');

var token = null; // OAuth token for anonymous login
var storeNameConfigKey = 'store.settings.name';
var storeFrontProjectId = '93b808b0-98f0-42e3-b1a8-ef81dac762b6';

var configSvcUrl = 'http://configuration-v2.test.cf.hybris.com/configurations/';
var authSvcUrl = 'http://user-service.test.cf.hybris.com/auth/';


//****************************************************************
// Load the token for the anonymous login:

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/*
request.post(
        authSvcUrl + 'anonymous/login?hybris-tenant='+storeFrontProjectId,
    { form: { key: 'value' } },
    function (error, response, body) {
        console.log('token request response: '+ response.statusCode);
        if (error ) {
            console.log(error);
        }
        token = getParameterByName('access_token', response.headers['location']);

    }
); */
// **************************************************************************

// Build the server
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use("/:storename/js", express.static(__dirname + '/../public/js'));
app.use("/:storename/css", express.static(__dirname + '/../public/css'));
app.use("/:storename/img", express.static(__dirname + '/../public/img'));

// Generate index.html with store name injected as "title"
// Store name is retrieved from config service
app.get('/:storename?/', function(req, response, next){
    // tenant and url prefix/store name equivalent at this time
    var tenant = req.params["storename"];
    console.log('tenant is '+tenant);
    if(!tenant){
        console.error('missing storename path parameter!');
    }
    var configSvcOptions = {
        url: configSvcUrl+storeNameConfigKey,
        headers: {
            'hybris-tenant': tenant
        }
    };

    //console.log(configSvcOptions);
    request.get(configSvcOptions, function(error, reponse, body) {
        if(!error) {
            //console.log(body);
            response.render("index", {store: {name: JSON.parse(body).value, style: 'css/app/style.css'}});
        } else {
            console.log(error);
            next(error);
        }
    })
});

//*********************
// Store-Config route - returns settings with tenant and access token for a particular storefront
app.get('/:storename/storeconfig', function(request, response) {
    // tenant and url prefix/store name equivalent at this time
    var tenant  =  request.params["storename"];

    console.log('request for store config for '+tenant);
    var json = JSON.stringify( {
            storeTenant: tenant,
            accessToken: token }
    );
    //console.log(json);
    response.send(json);
});


// ANGULAR UI-ROUTER WORKAROUND - append trailing '/'
// Long-term, this should be fixed in app.js.
app.get(/^\/\w+$/, function(request, response){
    var newUrl = request.url+'/';
    console.log('redirect to '+newUrl);
    response.redirect(newUrl);
});

module.exports = app;






