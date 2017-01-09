/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

var express = require('express');
var compression = require('compression');

// **************************************************************************

// Build the server
var app = express();
var helmet = require('helmet');

// compress all requests
app.use(compression({ level: 6 }));

// Don't allow anyone to put content in a frame.
app.use(helmet.frameguard('deny'));
app.use(helmet.xssFilter());
app.disable('x-powered-by');

app.set('trust proxy', true); //for https redirect

var httpsRedirect = function (req, res, next) {
    var host = req.get('host');

    if (req.host === 'localhost') {
        next();
    }
    else {
        console.log('HTTPS REDIRECT: ', req.protocol);
        if ('https' === req.protocol) {
            next();
        } else {
            //redirect to https based url provided by ELB
            console.log('INSECURE REDIRECTING TO: ' + 'https://' + host + req.url);
            return res.redirect(301, 'https://' + host + req.url);  //Infinite loop.
        }
    }
};

var useHttps = /*StartUseHTTPS*/ false /*EndUseHTTPS*/;

if (useHttps) {
    app.use(httpsRedirect);
}

app.use('/:storename/', express.static(__dirname + '/../public/'));

// ANGULAR UI-ROUTER WORKAROUND - append trailing '/'
// Long-term, this should be fixed in app.js.
app.get(/^\/\w+$/, function (request, response) {
    var newUrl = request.url + '/';
    //console.log('redirect to '+newUrl);
    response.redirect(newUrl);
});

module.exports = app;





