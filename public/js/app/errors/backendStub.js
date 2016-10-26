/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ('Confidential Information'). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */
'use strict';

(function() {
	/** BACKEND-MOCK-INSTRUCTIONS:
	 *  Use the querystring parameter ?nobackend in url to load this module, otherwise it is empty in codebase.
	 *  This module is multi-purpose. It can be used to a) mock data b) mock errors or c) passthrough desired services.
	 *  To change state of mocking from error to data, change comments to pass back data, error integer, or passthrough at bottom.
	 *  For error-mock: uncomment integer to mock status code. Integer return will hit error handler and mock error. Also comment out mock data.
	 *  For data-mock: uncomment the JSON data return, and comment out the status code integer.
	 *  Realize that some mock data might go stale based on session state, if so, then paste updated JSON from response tabs.
	 *  Sometimes clicking back the ?nobackend parameter can be removed causing unexpected results. Good to watch for that.
	 *  Also, be sure that the domain and tenant id settings (below) are correct for your build environment.
	**/
	if( !document.URL.match(/\?nobackend$/) ){
		// if not requested only add a blank stub to app dependency.
		angular.module('ds.backendMock', []);

	} else if (document.URL.match(/\?nobackend$/)) {

	    // if the query string is present add a module with a run definition to replace the back end.
		angular.module('ds.backendMock', ['ngMockE2E'])

			.run(function($httpBackend) {

				// MOCK-RUNNER-CONFIGURATION-. TODO - update or remove.
				var BUILD_DOMAIN = 'yaas-test.apigee.net/test',
				    BUILD_TENANT = '8bwhetym79cq',
				    MOCK_PRODUCT =  '5436899a3cceb8a9381288d9',
				    MOCK_ORDER   =  'X38KIHUG';

				// CATEGORY: category-service.js #121 getCategories MOCK - an excellent test mock because it is a simple call/response call on home page.
				$httpBackend.whenGET('https://'+BUILD_DOMAIN+'/category/v2/'+BUILD_TENANT+'/categories?expand=subcategories&toplevel=true')
					.respond(
						//MOCK-ERROR-STATUS-CODE
						//401 //500 //404  //uncomment integer to mock status code. Int will hit error handler and mock error. Also comment out mock data.
						//MOCK-DATA-RESPONSE
						[{
						  'id' : '256',
						  'name' : 'MOCK',
						  'description' : 'description',
						  'image' : 'https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a4c755ceb64199047c02',
						  'subcategories' : [ {
						    'id' : '28384512',
						    'parentId' : '256',
						    'name' : 'Beersteins',
						    'description' : '',
						    'subcategories' : [ {
						      'id' : '28385024',
						      'parentId' : '28384512',
						      'name' : 'Traditional',
						      'description' : ''
						    } ]
						  }, {
						    'id' : '41452032',
						    'parentId' : '256',
						    'name' : 'hybris Mugs',
						    'description' : '',
						    'image' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/y_ondemand_backoffice/media/546f5ee1f0ee5477bf977ca4'
						  } ]
						}, {
						  'id' : '2304',
						  'name' : 'Accessories',
						  'image' : 'https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a4d555ceb64199047c46',
						  'subcategories' : [ {
						    'id' : '28379136',
						    'parentId' : '2304',
						    'name' : 'Small Mugs',
						    'description' : '',
						    'image' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/y_ondemand_backoffice/media/54647b7b79ae1910e885193f'
						  }, {
						    'id' : '46116096',
						    'parentId' : '2304',
						    'name' : 'Housewear'
						  } ]
						}, {
						  'id' : '3584',
						  'name' : 'Sports',
						  'image' : 'https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/548196fce46e11c342fd4df8'
						}, {
						  'id' : '4096',
						  'name' : 'Safety',
						  'image' : 'https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5481f5dd55ceb64199043c72'
						}, {
						  'id' : '4864',
						  'name' : 'Computer Accessories',
						  'image' : 'https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a48a55ceb64199047bc0'
						}, {
						  'id' : '5632',
						  'name' : 'Cosmetics',
						  'image' : 'https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a4a255ceb64199047bc2'
						}, {
						  'id' : '102403072',
						  'name' : 'Candy',
						  'subcategories' : [ {
						    'id' : '43524096',
						    'parentId' : '102403072',
						    'name' : 'Chewing Gum',
						    'description' : '',
						    'image' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/547d9b01b80ec710ea0e8498',
						    'subcategories' : [ {
						      'id' : '43525632',
						      'parentId' : '43524096',
						      'name' : 'Hubba Bubba',
						      'description' : '',
						      'image' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/548045411bae31f953e73e3f'
						    } ]
						  } ]
						}, {
						  'id' : '7680',
						  'name' : 'T-shirts',
						  'image' : 'https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a4b155ceb64199047bc4'
						} ]
					); //end mock.

				// ANONYMOUS-LOGIN: Account Service. Use to mock Authentication errors.
				// $httpBackend.whenPOST('https://yaas-test.apigee.net/test/account/v1/auth/anonymous/login?hybris-tenant=8bwhetym79cq')
				// 	.respond(
				// 		//MOCK-ERROR-STATUS-CODE
				// 		//401 //500 //404  //uncomment integer to mock status code. Int will hit error handler and mock error. Also comment out mock data.
				// 		//MOCK-DATA-RESPONSE
				// 		// {
				// 		//   'status' : 403,
				// 		//   'message' : 'Project BAD8bwhetym79cq does not exist',
				// 		//   'type' : 'insufficient_permissions'
				// 		// }
				// 	); //end mock.


				// PRODUCT-DETAILS: white mug MOCK.
				$httpBackend.whenGET('https://'+BUILD_DOMAIN+'/product-details/v3/'+BUILD_TENANT+'/productdetails/'+ MOCK_PRODUCT+'?expand=media')
					.respond(
						//MOCK-ERROR-STATUS-CODE
						//401 //500 //404  //uncomment integer to mock status code. Int will hit error handler and mock error. Also comment out mock data.
						//MOCK-DATA-RESPONSE
						{
						  'id' : '5436899a3cceb8a9381288d9',
						  'sku' : 'P1234000',
						  'name' : 'hybris Coffee Mug - MOCK',
						  'description' : 'MOCK Drink your morning, afternoon, and evening coffee from the hybris mug.  Get caffinated in style. ',
						  'published' : true,
						  'images' : [ {
						    'id' : '5436899af2ee256c97bed3c0',
						    'url' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/product/media/5436899af2ee256c97bed3c0'
						  }, {
						    'id' : '5436899bf2ee256c97bed3c2',
						    'url' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/product/media/5436899bf2ee256c97bed3c2'
						  }, {
						    'id' : '5436899bf2ee256c97bed3c4',
						    'url' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/product/media/5436899bf2ee256c97bed3c4'
						  }, {
						    'id' : '5436899bf2ee256c97bed3c6',
						    'url' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/product/media/5436899bf2ee256c97bed3c6'
						  } ],
						  'inStock' : true,
						  'created' : '2014-10-09T13:11:54.108+0000',
						  'color' : 'White',
						  'itemCondition' : 'NEW',
						  'adult' : false,
						  'customAttributes' : [ ],
						  'defaultPrice' : {
						    'currency' : 'USD',
						    'priceId' : '5436899c5acee4d3c910b7cf',
						    'value' : 9.99
						  },
						  'categories' : [ {
						    'id' : '256',
						    'name' : 'Mugs',
						    'description' : 'description',
						    'image' : 'https://yaas-test.apigee.net/test/media-repository/v2/8bwhetym79cq/SJ8Gkp4vpyKjuC7FCDw2kY1KUf6iEyRc/media/5485a4c755ceb64199047c02'
						  } ]
						}
					); //end mock.

				// ORDERS: order confirmation MOCK.
				// This will mock data for pages at: http://dev.local:9000/8bwhetym79cq/#!/confirmation/X38KIHUG/?nobackend and
				// http://dev.local:9000/8bwhetym79cq/#!/orderDetail/X38KIHUG?nobackend
				$httpBackend.whenGET('https://'+BUILD_DOMAIN+'/order/v4/'+BUILD_TENANT+'/orders/'+ MOCK_ORDER)
					.respond(
						//MOCK-ERROR-STATUS-CODE
						//401 //404 //500  //uncomment integer to mock status code. Int will hit error handler and mock error. Also comment out mock data.
						//MOCK-DATA-RESPONSE
						{
						  'created' : '2015-02-02T19:12:55.765Z',
						  'status' : 'CREATED',
						  'entries' : [ {
						    'amount' : 4,
						    'price' : 9.99,
						    'totalPrice' : 39.96,
						    'id' : '5436899a3cceb8a9381288d9',
						    'product' : {
						      'id' : '5436899a3cceb8a9381288d9',
						      'sku' : 'P1234000',
						      'name' : 'hybris Coffee Mug - White',
						      'description' : 'Drink your morning, afternoon, and evening coffee from the hybris mug.  Get caffinated in style. ',
						      'published' : true,
						      'inStock' : true,
						      'created' : '2014-10-09T13:11:54.108+0000',
						      'externalImages' : [ ],
						      'images' : [ {
						        'id' : '5436899af2ee256c97bed3c0',
						        'url' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/product/media/5436899af2ee256c97bed3c0'
						      }, {
						        'id' : '5436899bf2ee256c97bed3c2',
						        'url' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/product/media/5436899bf2ee256c97bed3c2'
						      }, {
						        'id' : '5436899bf2ee256c97bed3c4',
						        'url' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/product/media/5436899bf2ee256c97bed3c4'
						      }, {
						        'id' : '5436899bf2ee256c97bed3c6',
						        'url' : 'http://media-repository-v2.test.cf.hybris.com/8bwhetym79cq/product/media/5436899bf2ee256c97bed3c6'
						      } ],
						      'color' : 'White',
						      'itemCondition' : 'NEW',
						      'adult' : false,
						      'customAttributes' : [ ]
						    }
						  } ],
						  'customer' : {
						    'id' : 'C9851410463',
						    'name' : 'asdfsasdf asfd',
						    'title' : 'Mr.',
						    'firstName' : 'asdfsasdf',
						    'lastName' : 'asfd',
						    'email' : 'test1@test1.com- MOCK'
						  },
						  'billingAddress' : {
						    'contactName' : 'MOCK9999',
						    'street' : '9999MOCK',
						    'zipCode' : '999',
						    'city' : '999',
						    'country' : 'US',
						    'state' : 'AK',
						    'contactPhone' : '9999'
						  },
						  'shippingAddress' : {
						    'contactName' : '99MOCK99',
						    'street' : '9999MOCK',
						    'zipCode' : '999MOCK',
						    'city' : '999',
						    'country' : 'US',
						    'state' : 'AK',
						    'contactPhone' : '9999'
						  },
						  'payments' : [ {
						    'status' : 'SUCCESS - MOCK',
						    'method' : 'Visa',
						    'paymentResponse' : 'ChargeId - ch_15Rpcx424QP3MpDM8oUPHenk',
						    'paidAmount' : 42.94,
						    'currency' : 'USD'
						  } ],
						  'shipping' : {
						    'total' : {
						      'amount' : 2.98,
						      'currency' : 'USD'
						    }
						  },
						  'tax' : {
						    'lines' : [ ],
						    'total' : {
						      'amount' : 0,
						      'currency' : 'USD',
						      'inclusive' : false
						    }
						  },
						  'totalPrice' : 42.94,
						  'currency' : 'USD'
						}
					); //end mock.
					
					$httpBackend.expectGET('https://api.yaas.io/hybris/customer/v1/saphybriscaas/me/addresses/28e7d417bc').respond(500);

					$httpBackend.whenPUT('https://api.yaas.io/hybris/customer/v1/saphybriscaas/me/addresses/28e7d417bc')
					.respond(
						//MOCK-ERROR-STATUS-CODE
						//401 //404 //500  //uncomment integer to mock status code. Int will hit error handler and mock error. Also comment out mock data.
						//MOCK-DATA-RESPONSE
						500
					);

					$httpBackend.whenDELETE('https://api.yaas.io/hybris/customer/v1/saphybriscaas/me/addresses/28e7d417bc')
					.respond(500);

					$httpBackend.whenDELETE('https://api.yaas.io/hybris/customer/v1/saphybriscaas/me/addresses/3af291947a')
					.respond(500);

					$httpBackend.whenPUT('https://api.yaas.io/hybris/customer/v1/saphybriscaas/me/addresses/3af291947a')
					.respond(500);

					$httpBackend.whenDELETE('https://api.yaas.io/hybris/customer/v1/saphybriscaas/me/addresses/1ef631bd25')
					.respond(500);

					$httpBackend.whenPUT('https://api.yaas.io/hybris/customer/v1/saphybriscaas/me/addresses/1ef631bd25')
					.respond(500);
					
					/*$httpBackend.whenGET('https://api.yaas.io/hybris/customer/b1/saphybriscaas/me')
					.respond(
						//MOCK-ERROR-STATUS-CODE
						//401 //404 //500  //uncomment integer to mock status code. Int will hit error handler and mock error. Also comment out mock data.
						//MOCK-DATA-RESPONSE
						500
					);*/
					
					/*$httpBackend.whenGET('https://api.yaas.io/hybris/customer/b1/saphybriscaas/me/addresses?pageNumber=1&pageSize=6')
					.respond(
						//MOCK-ERROR-STATUS-CODE
						//401 //404 //500  //uncomment integer to mock status code. Int will hit error handler and mock error. Also comment out mock data.
						//MOCK-DATA-RESPONSE
						500
					);*/

					
					$httpBackend.whenGET('https://api.yaas.io/hybris/order/v1/saphybriscaas/orders?pageSize=10')
					.respond(
						//MOCK-ERROR-STATUS-CODE
						//401 //404 //500  //uncomment integer to mock status code. Int will hit error handler and mock error. Also comment out mock data.
						//MOCK-DATA-RESPONSE
						500
					);

					/** MOCK-PASSTHROUGHS
					  * - These are required for anything that is not mocked. The HTTPBackendProxy passes them through to the server.
					  * - When the site is fully mocked, these can be removed.
					  * - Removing these will give errors for every service that can still be mocked.
					**/

					// various passthroughs. these allow existing services to work, while some are mocked.
					$httpBackend.whenGET('./js/app/auth/templates/signin.html').passThrough();
					$httpBackend.whenGET('./js/app/auth/templates/signup.html').passThrough();
					$httpBackend.whenGET('./js/app/account/templates/addresses.html').passThrough();

					$httpBackend.whenGET('./js/app/account/templates/address-form.html').passThrough();

					$httpBackend.whenGET('./js/app/cart/templates/cart-costs.html').passThrough();
					$httpBackend.whenGET('./js/app/coupons/templates/coupon-apply.html').passThrough();
					



					// dont mock everything else, specify pass through to avoid error.
					$httpBackend.whenGET(/^\w+.*/).passThrough();
					$httpBackend.whenPOST(/^\w+.*/).passThrough();

				});


		}

})(angular);