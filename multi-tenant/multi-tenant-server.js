
var http = require('http');
var express = require('express');
var path = require('path');
var request = require('request');
var async = require('async');

var storeNameConfigKey = 'store.settings.name';

var configSvcUrl = 'http://configuration-v2.test.cf.hybris.com/configurations/';
var authSvcUrl = 'http://yaas-test.apigee.net/test/account/v1/auth/';


//****************************************************************
// Load the token for the anonymous login:

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function getAnonymousToken(projectId, callback) {
    request.post(
            authSvcUrl + 'anonymous/login?hybris-tenant=' + projectId,
        { form: { key: 'value' } },
        function (error, response, body) {
            if(error){
                console.error(error);
                 console.error(error.stack);
            }
            if(response) {
                //console.log(response.headers);
                callback(error, getParameterByName('access_token', response.headers['location']),
                    parseInt(getParameterByName('expires_in', response.headers['location'])));
            }
        }
    );
}
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

    var renderIndex = function (err, token, expiresIn) {
        if(err)  {
            console.log(err);
            next(err);
        }
        var configSvcOptions = {
            url: configSvcUrl+storeNameConfigKey,
            headers: {
                'hybris-tenant': tenant,
                'Authorization' : token
            }
        };
        request.get(configSvcOptions, function(err, reponse, body) {
            if(!err) {
                //console.log(body);
                response.render("index", {store: {name: JSON.parse(body).value, style: 'css/app/style.css'}});
            } else {
                console.log(err);
                next(err);
            }
        })
    };

    getAnonymousToken(tenant, renderIndex);
});

//*********************
// Store-Config route - returns settings with tenant and access token for a particular storefront
app.get('/:storename/storeconfig', function(request, response) {
    // tenant and url prefix/store name equivalent at this time
    var tenant  =  request.params["storename"];

    //console.log('request for store config for '+tenant);

    var sendStoreConfig = function(err, token, expiresIn) {
        if(err) {
            console.log(err);
            next(err);
        }
        var json = JSON.stringify( {
                storeTenant: tenant,
                token: token ,
                expiresIn: expiresIn}
        );
        //console.log(json);
        response.send(json);
    }

    getAnonymousToken(tenant, sendStoreConfig);

});


// ANGULAR UI-ROUTER WORKAROUND - append trailing '/'
// Long-term, this should be fixed in app.js.
app.get(/^\/\w+$/, function(request, response){
    var newUrl = request.url+'/';
    console.log('redirect to '+newUrl);
    response.redirect(newUrl);
});

module.exports = app;






