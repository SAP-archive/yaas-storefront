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
		return ; // app will not use stubbed backend.
	}


angular.module('ds.backendMock', ['ngMockE2E'])
    /**
     *  Stub out fake responses to API calls. Allows front some autonomy.
     */
		.run(function($httpBackend) {


				$httpBackend.whenGET('./js/app/auth/templates/signin.html').passThrough();
				$httpBackend.whenGET('./js/app/auth/templates/signup.html').passThrough();

				$httpBackend.whenGET(/^\/templates\//).passThrough();

				   // Don't mock the html views
			    $httpBackend.whenGET(/views\/\w+.*/).passThrough();
			 
			    // For everything else, don't mock
			    $httpBackend.whenGET(/^\w+.*/).passThrough();
			    $httpBackend.whenPOST(/^\w+.*/).passThrough();


				// $httpBackend
				// 	.expectGET('/js/app/auth/services/auth-rest.js')
				// 	.respond(function (method, url, data, headers) {
				// 		debugger;
				// 	    return [409, 'response body', {}, 'TestPhrase'];
				// });

				// $httpBackend.whenGET('http://dev.local:9000/js/vendor-static/jquery.min.map').respond(function(){
				// 	console.log('HELLOminmap');
				// 	return 500;
				// });

				// $httpBackend.whenGET('/configurations').respond(500, {message: 'world'});

				// $httpBackend.whenGET('https://api.yaas.io/category/v2/defaultproj/categories').respond(function(){
				// 	console.log('HELLOCcategories');
				// 	return "500";
				// });

				// $httpBackend.whenGET('https://api.yaas.io/configuration/v4/defaultproj/configurations').respond(function(){
				// 	console.log('HELLOCconfigurations');
				// 	return "500";
				// });

				// $httpBackend.whenGET('https://api.yaas.io/cart/v5/defaultproj/carts').respond(function(){
				// 	console.log('HELLOCART');
				// 	return "500";
				// });


				
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
				// 	.expectGET('https://api.yaas.io/cart/v5/defaultproj/carts')
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
// 					.expectGET('https://api.yaas.io/cart/v5/defaultproj/carts')
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