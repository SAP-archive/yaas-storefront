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

var express = require('express');
// Build the server
var app = express();

app.set('trust proxy', true); //for https redirect
var https_redirect = function (req, res, next) {
  console.log('HTTPS REDIRECT: ', req.protocol);
  if ('https' == req.protocol) {
  	next();
  } else {
      //redirect to https based url provided by ELB
    	console.log('INSECURE REDIRECTING TO: ' + 'https://' + req.get('host') + req.url);
      return res.redirect(301, 'https://' + req.get('host') + req.url);  //Infinite loop.
  }
};
app.use(https_redirect);

// map access to public files, index.html
app.use(express.static(__dirname + '/../public'));

module.exports = app;
