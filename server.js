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

// ExpressJS configuration for single tenant
var express = require('express');

// Build the server
var app = express();

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

// map access to public files
app.use(express.static(__dirname + '/public'));

module.exports = app;


