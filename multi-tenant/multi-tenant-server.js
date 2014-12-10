
var http = require('http');
var express = require('express');
var path = require('path');
var request = require('request');
require('request').debug = true;
var async = require('async');

var storeNameConfigKey = 'store.settings.name';

// Dynamic Domain is generated and replaced by build script, see gruntfile.
var dynamicDomain = /*StartDynamicDomain*/ 'yaas-test.apigee.net/test' /*EndDynamicDomain*/;
var configSvcUrl = 'https://' + dynamicDomain + '/configuration/v4/';
var authSvcUrl = 'https://' + dynamicDomain + '/account/v1/auth/';


//****************************************************************
// Load the token for the anonymous login:

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function getAnonymousToken(tenant, callback) {
    //console.log("get anon token for "+tenant);
    request.post(
        { url: authSvcUrl + 'anonymous/login?hybris-tenant=' +tenant,
        formData: { key: 'value' } },
        function (error, response, body) {

            if(response) {
                //console.log('got response!');
                //console.log(response.headers['location']);
                callback(null, getParameterByName('access_token', response.headers['location']),
                    parseInt(getParameterByName('expires_in', response.headers['location'])));
            } else {
                console.log('no anon login response');
                if(error) {
                    console.log(error.message);
                    console.log(error.stack);
                }

                callback(error);
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
    //console.log('tenant is '+tenant);
    if(!tenant){
        console.error('missing storename path parameter!');
    }

    var renderIndex = function (error, token) {
        if(error){
            return next(error);
        }
        var configSvcOptions = {
            url: configSvcUrl+tenant+'/configurations/'+storeNameConfigKey,
            headers: {
                'Authorization' : 'Bearer '+token
            }
        };
        request.get(configSvcOptions, function(err, resp, body) {
            if(!err) {
                //console.log('return index');
                response.render("index", {store: {name: JSON.parse(body).value, style: 'css/app/style.css'}});
            } else {
                console.log(err);
                return next(err);
            }
        })
    };

    getAnonymousToken(tenant, renderIndex);
});

//*********************
// Store-Config route - returns settings with tenant and access token for a particular storefront
app.get('/:storename/storeconfig', function(request, response, next) {
    // tenant and url prefix/store name equivalent at this time
    var tenant  =  request.params["storename"];

    //console.log('request for store config for '+tenant);

    var sendStoreConfig = function(err, token, expiresIn) {
        if(err) {
            console.log(err);
            return next(err);
        } else {
            //console.log('returning store config');
            var json = JSON.stringify( {
                    storeTenant: tenant,
                    token: token ,
                    expiresIn: expiresIn}
            );
            //console.log(json);
            response.send(json);
        }

    }

    getAnonymousToken(tenant, sendStoreConfig);

});


// ANGULAR UI-ROUTER WORKAROUND - append trailing '/'
// Long-term, this should be fixed in app.js.
app.get(/^\/\w+$/, function(request, response){
    var newUrl = request.url+'/';
    //console.log('redirect to '+newUrl);
    response.redirect(newUrl);
});

module.exports = app;





