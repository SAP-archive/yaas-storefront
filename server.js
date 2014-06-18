
var http = require('http');
var express = require('express');
var path = require('path');
var request = require('request');

var token = null; // OAuth token for anonymous login
var storeTenant =  process.env.DEFAULT_TENANT || 'onlineshop';
var storeNameConfigKey = 'store.settings.name';
var storeFrontProjectId = '0cf4fd80-462f-4049-b660-75ce8dffd3ab';

var configSvcUrl = 'http://configuration-v2.dprod.cf.hybris.com/configurations/';
var authSvcUrl = 'http://user-service.dprod.cf.hybris.com/auth/';


//****************************************************************
// Load the token for the anonymous login:


function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

request.post(
        authSvcUrl + 'anonymous/login?project='+storeFrontProjectId,
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

app.use(function(req, res, next){
    //console.log('req for '+req.url);

    if(req.url.indexOf('product.image') > -1) {
        res.status(204).send('unresolved angular url');;
    } else {
        next();
    }
});

// map base store access to files in /public to applicable resources
app.use("/public", express.static(__dirname+'/public'));
// map store-specific access to files in  /public
app.use("/:storename/public", express.static(__dirname + '/public'));



app.get('/:storename/', function(req, response){
    var storename = req.params["storename"];
    //console.log('making request to config service');
    var configSvcOptions = {
        url: configSvcUrl+storeNameConfigKey,
        headers: {
            'hybris-tenant': storename
        }
    };
    //console.log(configSvcOptions);
    request.get(configSvcOptions, function(error, reponse, body) {
        //console.log(response);
        if(!error) {
            storename = response.value;
        } else {
            console.log(error);
        }
        response.render("index", {store: {name: storename, style: 'public/css/app/style.css'}});
    })
});



// return base store index page.
app.get('/', function(request, response){
    console.log('return index for default store');
    response.render("index", {store: {name: 'hybris Demo Store', style: 'public/css/app/style.css'}});
});

//*********************
// Store Config route
app.get('/storeconfig', function(request, response) {
    console.log('request for default store config');
    var json = JSON.stringify( {
            storeTenant: storeTenant,
            accessToken: token }
    );
    console.log(json);
    response.send(json);
});

app.get('/:storename/storeconfig', function(request, response) {
    console.log('request for store config for '+request.params["storename"]);
    var json = JSON.stringify( {
            storeTenant: request.params["storename"],
            accessToken: token }
    );
    console.log(json);
    response.send(json);
});

// return store-specific index page
app.get("/:storename", function(request, response){
    var newUrl = request.url+'/';
    console.log('redirect to '+newUrl);
    response.redirect(newUrl);
}) ;

module.exports = app;






