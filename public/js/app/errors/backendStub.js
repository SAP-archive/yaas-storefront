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

(function(ng) {

	if( !document.URL.match(/\?nobackend$/) ){
		angular.module('ds.backendMock', []);
		return ; // app will not use stubbed backend.
	}


angular.module('ds.backendMock', ['ngMockE2E'])
    /**
     *  Stub out fake responses to API calls. Allows front some autonomy.
     */
		.run(function($httpBackend) {

				// $httpBackend
				// 	.expectGET('/js/app/auth/services/auth-rest.js')
				// 	.respond(function (method, url, data, headers) {
				// 		debugger;
				// 	    return [409, 'response body', {}, 'TestPhrase'];
				// });

				$httpBackend.whenGET('https://yaas-test.apigee.net/test/configuration/v4/8bwhetym79cq/configurations').respond(function(){
					console.log('MOCK-CONFIGURATION');
					// return 500;
					return {
  "key" : "customer.passwordreset.redirecturl",
  "value" : "http://demo-store.test.cf.hybris.com/8bwhetym79cq/#!/changePassword?token="
}, {
  "key" : "store.settings.name",
  "value" : "Sushi Dev Store"
}, {
  "key" : "payment.stripe.key.public",
  "value" : "pk_test_KQWQGIbDxdKyIJtpasGbSgCz"
}, {
  "key" : "payment.stripe.key.private",
  "value" : "sk_test_aSCS3gx0bJsUw61g6KJBjb23"
}, {
  "key" : "bente.kamperud@hybris.com_lang",
  "value" : "[{\"id\":\"en\",\"label\":\"English\",\"default\":true,\"required\":true}]"
}, {
  "key" : "project_lang",
  "value" : "[{\"id\":\"en\",\"label\":\"English\",\"default\":true,\"required\":true},{\"id\":\"de\",\"label\":\"German\",\"default\":false,\"required\":true}]"
}, {
  "key" : "facebook.app.id",
  "value" : "611545182284242"
}, {
  "key" : "google.client.id",
  "value" : "566749370288-git5emebgh3to7p1gscq2j9etsvmds4i.apps.googleusercontent.com"
}, {
  "key" : "bente.kamperud@hybris.com_curr",
  "value" : "[{\"id\":\"USD\",\"label\":\"US Dollar\",\"default\":true,\"required\":true}]"
}, {
  "key" : "project_curr",
  "value" : "[{\"id\":\"USD\",\"label\":\"US Dollar\",\"default\":true,\"required\":true},{\"id\":\"EUR\",\"label\":\"Euro\",\"default\":false,\"required\":false}]"
}, {
  "key" : "store.settings.image.logo.url",
  "value" : "https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/548179d0e46e11c342fd4a23"
}, {
  "key" : "order.notification.email.from",
  "value" : "bente.kamperud@hybris.com"
};
				});

				// $httpBackend.whenGET('http://dev.local:9000/js/vendor-static/jquery.min.map').respond(function(){
				// 	console.log('HELLOminmap');
				// 	return 500;
				// });

				// $httpBackend.whenGET('/configurations').respond(500, {message: 'world'});

				// $httpBackend.whenGET('https://api.yaas.io/category/v2/8bwhetym79cq/categories').respond(function(){
				// 	console.log('HELLOCcategories');
				// 	return "500";
				// });

				// $httpBackend.whenGET('https://api.yaas.io/configuration/v4/8bwhetym79cq/configurations').respond(function(){
				// 	console.log('HELLOCconfigurations');
				// 	return "500";
				// });

				// $httpBackend.whenGET(/^\/carts\//).respond(function(){
				// 	console.log('HELLOCART');
				// 	return "500";
				// });

				$httpBackend.whenGET('./js/app/auth/templates/signin.html').passThrough();
				$httpBackend.whenGET('./js/app/auth/templates/signup.html').passThrough();

				$httpBackend.whenGET(/^\/templates\//).passThrough();

				   // Don't mock the html views
			    $httpBackend.whenGET(/views\/\w+.*/).passThrough();

			    // For everything else, don't mock
			    $httpBackend.whenGET(/^\w+.*/).passThrough();
			    $httpBackend.whenPOST(/^\w+.*/).passThrough();




				// $httpBackend
				// 	.expectGET('/js/vendor-static/jquery.min.map')
				// 	.respond(function (method, url, data, headers) {
				// 		debugger;
				// 	    return [409, 'response body', {}, 'TestPhrase'];
				// });
				// $httpBackend.whenGET('/js/vendor-static/jquery.min.map').respond(function(){
				// 	debugger;
				// });
				// $httpBackend.whenGET('/home').respond(function(){
				// 	debugger;
				// });
				// $httpBackend.whenGET('/js/vendor-static/jquery.min.map').respond(function(){
				// 	debugger;
				// });

				// $httpBackend.whenGET(/^\/templates\//).respond(function(){
				// 	debugger;
				// });

				// $httpBackend
				// 	.expectGET('/js/vendor-static/jquery.min.map')
				// 	.respond(function (method, url, data, headers) {
				// 		debugger;
				// 	    return [409, 'response body', {}, 'TestPhrase'];
				// 	});
				// $httpBackend
				// 	.expectGET('https://api.yaas.io/cart/v5/8bwhetym79cq/carts')
				// 	.respond(function (method, url, data, headers) {
				// 		debugger;
				// 	    return [409, 'response body', {}, 'TestPhrase'];
				// 	});
			});

// 		var beMock = ng.module('ds.backendMock', ['ds.router', 'ngMockE2E']);
// 		beMock.run(function($httpBackend) {
// 				debugger;
// 				$httpBackend.whenGET('/home').respond(function(){
// 					debugger;
// 				});
// 				$httpBackend.whenGET('/js/vendor-static/jquery.min.map').respond(function(){
// 					debugger;
// 				});

// 				$httpBackend.whenGET(/^\/templates\//).respond(function(){
// 					debugger;
// 				});

// 				$httpBackend
// 					.expectGET('/js/vendor-static/jquery.min.map')
// 					.respond(function (method, url, data, headers) {
// 						debugger;
// 					    return [409, 'response body', {}, 'TestPhrase'];
// 					});
// 				$httpBackend
// 					.expectGET('https://api.yaas.io/cart/v5/8bwhetym79cq/carts')
// 					.respond(function (method, url, data, headers) {
// 						debugger;
// 					    return [409, 'response body', {}, 'TestPhrase'];
// 					});
// 			})
// 			// .config(function($provide) {
// 			// 	$provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
// 			// })
// 			// .run(function($httpBackend){
// 			// 	$httpBackend
// 			// 		.expectGET('/#!/home') 	
// 			// 		.respond(function (method, url, data, headers) {
// 			// 			debugger;
// 			// 		    return [409, 'response body', {}, 'TestPhrase'];
// 			// 		});
// 			// });
// 	}

})(angular);