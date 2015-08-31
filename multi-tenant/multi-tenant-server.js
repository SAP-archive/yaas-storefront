
var http = require('http');
var express = require('express');
var compression = require('compression');

// **************************************************************************

// Build the server
var app = express();
var helmet = require('helmet');

// compress all requests
app.use(compression({level:6}));

// Don't allow anyone to put content in a frame.
app.use(helmet.frameguard('deny'));
app.use(helmet.xssFilter());
app.disable('x-powered-by');

app.use("/:storename/", express.static(__dirname + '/../public/'));

// ANGULAR UI-ROUTER WORKAROUND - append trailing '/'
// Long-term, this should be fixed in app.js.
app.get(/^\/\w+$/, function(request, response){
    var newUrl = request.url+'/';
    //console.log('redirect to '+newUrl);
    response.redirect(newUrl);
});

module.exports = app;





