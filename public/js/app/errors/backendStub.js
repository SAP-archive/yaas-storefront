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
		// if not requested only add a blank stub to app dependency.
		angular.module('ds.backendMock', []);

	} else if (document.URL.match(/\?nobackend$/)) {

	    // if the query string is present add a module with a run definition to replace the back end.
		angular.module('ds.backendMock', ['ngMockE2E'])

			.run(function($httpBackend) {

				var BUILD_DOMAIN = 'yaas-test.apigee.net/test';
				var BUILD_TENANT = '8bwhetym79cq';

				// category-service.js #121 getCategories MOCK - an excellent test mock because it is a simple call/response call on home page.
				$httpBackend.whenGET('https://'+BUILD_DOMAIN+'/category/v2/'+BUILD_TENANT+'/categories?expand=subcategories&toplevel=true')
					.respond(
						//MOCK-ERROR-STATUS-CODE
						// 404  //passing back single integer (instead of array) is status code. Any non 200 will fall to error handler.
						//MOCK-DATA-RESPONSE
						[{
						  "id" : "256",
						  "name" : "Mugs",
						  "description" : "description",
						  "image" : "https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a4c755ceb64199047c02",
						  "subcategories" : [ {
						    "id" : "28384512",
						    "parentId" : "256",
						    "name" : "Beersteins",
						    "description" : "",
						    "subcategories" : [ {
						      "id" : "28385024",
						      "parentId" : "28384512",
						      "name" : "Traditional",
						      "description" : ""
						    } ]
						  }, {
						    "id" : "41452032",
						    "parentId" : "256",
						    "name" : "hybris Mugs",
						    "description" : "",
						    "image" : "http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/y_ondemand_backoffice/media/546f5ee1f0ee5477bf977ca4"
						  } ]
						}, {
						  "id" : "2304",
						  "name" : "Accessories",
						  "image" : "https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a4d555ceb64199047c46",
						  "subcategories" : [ {
						    "id" : "28379136",
						    "parentId" : "2304",
						    "name" : "Small Mugs",
						    "description" : "",
						    "image" : "http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/y_ondemand_backoffice/media/54647b7b79ae1910e885193f"
						  }, {
						    "id" : "46116096",
						    "parentId" : "2304",
						    "name" : "Housewear"
						  } ]
						}, {
						  "id" : "3584",
						  "name" : "Sports",
						  "image" : "https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/548196fce46e11c342fd4df8"
						}, {
						  "id" : "4096",
						  "name" : "Safety",
						  "image" : "https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5481f5dd55ceb64199043c72"
						}, {
						  "id" : "4864",
						  "name" : "Computer Accessories",
						  "image" : "https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a48a55ceb64199047bc0"
						}, {
						  "id" : "5632",
						  "name" : "Cosmetics",
						  "image" : "https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a4a255ceb64199047bc2"
						}, {
						  "id" : "102403072",
						  "name" : "Candy",
						  "subcategories" : [ {
						    "id" : "43524096",
						    "parentId" : "102403072",
						    "name" : "Chewing Gum",
						    "description" : "",
						    "image" : "http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/547d9b01b80ec710ea0e8498",
						    "subcategories" : [ {
						      "id" : "43525632",
						      "parentId" : "43524096",
						      "name" : "Hubba Bubba",
						      "description" : "",
						      "image" : "http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/548045411bae31f953e73e3f"
						    } ]
						  } ]
						}, {
						  "id" : "7680",
						  "name" : "T-shirts",
						  "image" : "https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a4b155ceb64199047bc4"
						} ]
					); //end mock.

					// sometimes data can be stale for non-mocked downstream services, copy and paste updated values to mimic state.
					// $httpBackend.whenGET('https://yaas-test.apigee.net/test/configuration/v4/8bwhetym79cq/configurations').respond(function(){
					// 	console.log('MOCK: CONFIGURATION');
					// 	// return 500;
					// 	return [{
					// 		  "key" : "customer.passwordreset.redirecturl",
					// 		  "value" : "http://demo-store.test.cf.hybris.com/8bwhetym79cq/#!/changePassword?token="
					// 		}, {
					// 		  "key" : "store.settings.name",
					// 		  "value" : "Sushi Dev Store"
					// 		}, {
					// 		  "key" : "payment.stripe.key.public",
					// 		  "value" : "pk_test_KQWQGIbDxdKyIJtpasGbSgCz"
					// 		}, {
					// 		  "key" : "payment.stripe.key.private",
					// 		  "value" : "sk_test_aSCS3gx0bJsUw61g6KJBjb23"
					// 		}, {
					// 		  "key" : "bente.kamperud@hybris.com_lang",
					// 		  "value" : "[{\"id\":\"en\",\"label\":\"English\",\"default\":true,\"required\":true}]"
					// 		}, {
					// 		  "key" : "project_lang",
					// 		  "value" : "[{\"id\":\"en\",\"label\":\"English\",\"default\":true,\"required\":true},{\"id\":\"de\",\"label\":\"German\",\"default\":false,\"required\":true}]"
					// 		}, {
					// 		  "key" : "facebook.app.id",
					// 		  "value" : "611545182284242"
					// 		}, {
					// 		  "key" : "google.client.id",
					// 		  "value" : "566749370288-git5emebgh3to7p1gscq2j9etsvmds4i.apps.googleusercontent.com"
					// 		}, {
					// 		  "key" : "bente.kamperud@hybris.com_curr",
					// 		  "value" : "[{\"id\":\"USD\",\"label\":\"US Dollar\",\"default\":true,\"required\":true}]"
					// 		}, {
					// 		  "key" : "project_curr",
					// 		  "value" : "[{\"id\":\"USD\",\"label\":\"US Dollar\",\"default\":true,\"required\":true},{\"id\":\"EUR\",\"label\":\"Euro\",\"default\":false,\"required\":false}]"
					// 		}, {
					// 		  "key" : "store.settings.image.logo.url",
					// 		  "value" : "https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/548179d0e46e11c342fd4a23"
					// 		}, {
					// 		  "key" : "order.notification.email.from",
					// 		  "value" : "bente.kamperud@hybris.com"
					// 		} ];
					// });

					// various passthroughs. these allow existing services to work, while some are mocked.
					$httpBackend.whenGET('./js/app/auth/templates/signin.html').passThrough();
					$httpBackend.whenGET('./js/app/auth/templates/signup.html').passThrough();


				    // dont mock everything else, specify pass through to avoid error.
				    $httpBackend.whenGET(/^\w+.*/).passThrough();
				    $httpBackend.whenPOST(/^\w+.*/).passThrough();

				});


		}

})(angular);