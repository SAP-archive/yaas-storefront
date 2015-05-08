// ExpressJS configuration for single tenant

// var express = require('express');

// // Build the server
// var app = express();

// console.log('FULLY WORKING', __dirname);

// // map access to public files
// app.use(express.static(__dirname + '/../public'));

// console.log('STARTING HTTPS SERVER.');

// module.exports = app;


// ExpressJS configuration for single tenant

var express = require('express');

// Build the server
var app = express();

console.log('HTTPS REDIRECT', __dirname);

console.log('SETTING TRUST PROXY');
app.set('trust proxy', true);

// force https redirect if not already secure
var https_redirect = function (req, res, next) {
	console.log('PROTOCOL: ', req.protocol);
    if ('https' == req.protocol) {
    	console.log('SECURE HANDLER');
    	next();
    } else {
    	console.log('INSECURE REDIRECTING TO: ' + 'https://' + req.get('host') + req.url);
        //redirect to https based url provided by ELB
        return res.redirect(301, 'https://' + req.get('host') + req.url);  //Infinite loop.
    }
};
app.use(https_redirect);

// map access to public files, index.html
app.use(express.static(__dirname + '/../public'));

module.exports = app;







// Require and create the Express framework
// var express = require('express');
// var app = express();

// // Determine port to listen on
// var port = 3000;

// // Enable reverse proxy support in Express. This causes the
// // the "X-Forwarded-Proto" header field to be trusted so its
// // value can be used to determine the protocol. See 
// // http://expressjs.com/api#app-settings for more details.
// app.enable('trust proxy');

// // Add a handler to inspect the req.secure flag (see 
// // http://expressjs.com/api#req.secure). This allows us 
// // to know whether the request was via http or https.
// app.use (function (req, res, next) {
// 	if (req.secure) {
// 		// request was via https, so do no special handling
// 		console.log('SECURE NEXT');
// 		// next();
// 	} else {
// 		console.log('REDIRECT', 'https://' + req.headers.host + req.url)
// 		// request was via http, so redirect to https
// 		res.redirect('https://' + req.headers.host + req.url);
// 	}
// });

// // Allow static files in the /public directory to be served
// app.use(express.static(__dirname + '/../public'));

// // Start listening on the port
// var server = app.listen(port, function() {
// 	console.log('Listening on port %d', server.address().port);
// });

// module.exports = app;

// var express = require("express");
// var app     = express();
// var path    = require("path");


// app.use(express.static(__dirname + '/../public/'));

// app.get('/',function(req,res){
//   console.log('ROUTE: ')
//   res.sendFile(path.join(__dirname+'../public/index.html'));
//   //__dirname : It will resolve to your project folder.
// });


// app.listen(3000);

// console.log("Running at Port 3000");
// module.exports = app;


// var http = require('http');
// var express = require('express');
// var compression = require('compression');
// var path = require("path");
// var helmet = require('helmet');

// // Build the server
// var app = express();

// // compress all requests
// app.use(compression({level:6}));

// // Don't allow anyone to put content in a frame.
// app.use(helmet.frameguard('deny'));
// app.use(helmet.xssFilter());
// app.disable('x-powered-by');

// // site path orientation.
// console.log('STARTING SINGLE TENANT PRODUCTION SERVER.');

// var router = express.Router();
// app.use(router);
// // app.use(express.static(path.join(__dirname, 'public')));
// // app.use(express.static(__dirname + '/../public/'));

// router.all('/', function (req, res, next) {
//   console.log('Someone made a request!');
//   next();
// });

// router.get('/', function (req, res) {
//   console.log('PATH', req.url);
//   // res.render('index.html');
//   res.sendFile(path.join(__dirname + '/../public/' + '/index.html'));
// });

// app.listen(8080);
// console.log('Running on 8080');
// module.exports = app;






// allow servers to be located in /server directory, by trimming path.
// console.log('DIRNAME', __dirname);
// var sitepath = __dirname.split(/[\/ ]+/);
// sitepath.splice(sitepath.length - 1,1);
// sitepath = sitepath.join('/');
// console.log('sitepath', sitepath);

// // app.use(express.static(__dirname + '/public'));

// force https redirect if not already secure
// var https_redirect = function (req, res, next) {
//     if (!req.secure) {
//     	console.log('REDIRECTING TO: ' + 'https://' + req.get('host') + req.url);
//         //redirect to https based url provided by ELB
//         return res.redirect('https://' + req.get('host') + req.url);
//     } else {
//     	console.log('SECURE');
//     	// next();
//     }
// };
// app.use(https_redirect);

// // map access to public files
// app.use(express.static(sitepath + '/public', { redirect : false }));
// app.use(express.static(__dirname + '/../public/', {redirect: true }));

// app.get('/', function(request, response, next){
//     console.log('IN APP GET');
  //   var newUrl = request.url+'/';
  //   console.log('redirect to '+newUrl);

 	// if (request.secure) {
 	// 	console.log('SECURE. ..');
 	// 	next();
 	// } else {
 	// 	console.log('NOT SECURE...');
  //  		response.redirect(request.get('host') + newUrl);
 	// }

// });



// app.get('/', function (req, res) {
//   res.render('index.html');
// });

// var routeHandlerHome = function (req, res, next) {
// 	console.log('REQUEST: ', req.get('host') + req.url);
// 	res.send('Hello World!');
// };

// app.get('/', routeHandlerHome);

// module.exports = app;


