/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

describe('ProductDetailCtrl', function () {

    var $scope, $rootScope,  $location, $controller, $q, mockedCartSvc, mockedFeeSvc, mockedShippingZones, shippingZones, cartDef, feeDef, mockedGlobalData={
        getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('USD'),
        getCurrentTaxConfiguration: jasmine.createSpy('getCurrentTaxConfiguration').andReturn({ rate: "7", label: "Includes Tax/VAT", included: false })
    };

    mockedShippingZones = [{
            'default': true,
            'id': 'europe',
            'methods': [
            {
                'id': 'fedex-2dayground',
                'name': 'FedEx 2Day',
                'active': true,
                'maxOrderValue': {
                  'amount': '200',
                  'currency': 'USD'
                },
                'fees': [
                  {
                    'minOrderValue': {
                      'amount': '0',
                      'currency': 'USD'
                    },
                    'cost': {
                      'amount': '3',
                      'currency': 'USD'
                    }
                  },
                  {
                    'minOrderValue': {
                      'amount': '50',
                      'currency': 'USD'
                    },
                    'cost': {
                      'amount': '1.89',
                      'currency': 'USD'
                    }
                  }
                ]
            }],
            'name': 'Canada',
            'shipTo': ['CA']
        }];

    var mockProduct = {
        product:{
            name: 'product1',
            id: 123,
            published: true,
            mixins: {
                inventory: false
            },
            metadata: {
                mixins: {}
            }
        },
        categories: [
            {
                id: 12345,
                name: 'fakeCat',
                slug: 'fake-cat'
            }
        ],
        prices: [{
            effectiveAmount: 24.99
        }]
    };

    var mockLastCatId = {
        id: '1234'
    };

    var mockCategorySvc = {
        getCategoryById: jasmine.createSpy().andCallFake(function(){
            return cartDef.promise;
        })
    };
    
    var mockedNotification = {
        success: jasmine.createSpy('success').andReturn('')
    };
    
    beforeEach(angular.mock.module('ds.products'));

    beforeEach(module('ds.checkout', function($provide) {
        $provide.value('shippingZones', shippingZones);
    }));

    beforeEach(inject(function ($injector, _$rootScope_, _$controller_, _$q_, _$location_) {
        $q = _$q_;
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $injector.get('$rootScope').$new();
		$location = _$location_;

        // creating the mocked service
        cartDef = $q.defer();
        mockedCartSvc = {
            addProductToCart: jasmine.createSpy().andCallFake(function(){
                return cartDef.promise;
            })
        };

        feeDef = $q.defer();
        mockedFeeSvc = {
            getFeesForItemYrn: jasmine.createSpy('getFeesForItemYrn').andCallFake(function(){
                return feeDef.promise;
            })
        };
    }));

    describe('initialization', function(){

        beforeEach(function () {
            $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope, $location: $location,
                'CartSvc': mockedCartSvc, 'FeeSvc': mockedFeeSvc, 'product': angular.copy(mockProduct), 'lastCatId': mockLastCatId, 'variantId': null, 'GlobalData': mockedGlobalData, 'CategorySvc': mockCategorySvc, 'shippingZones': mockedShippingZones, 'Notification': mockedNotification, 'variants': [], 'variantPrices': []});
        });
			it('should set the category for the breadcrumb', function(){
          expect($scope.category).toBeTruthy();
       });
    });

    describe('buy published product', function () {

        beforeEach(function () {
            $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope, $location: $location,
                'CartSvc': mockedCartSvc, 'FeeSvc': mockedFeeSvc, 'product': angular.copy(mockProduct), 'lastCatId': mockLastCatId, 'variantId': null, 'GlobalData': mockedGlobalData, 'CategorySvc': mockCategorySvc, 'shippingZones': mockedShippingZones, 'Notification': mockedNotification, 'variants': [], 'variantPrices': []});
        });

        it('should add to cart from detail page', function () {
            $scope.addToCartFromDetailPage();
            expect(mockedCartSvc.addProductToCart).toHaveBeenCalled();
        });

        it('should disable Buy button', function () {
            $scope.addToCartFromDetailPage();
            expect($scope.buyButtonEnabled).toBeFalsy();
        });

        it('should set error msg on error', function(){
            $scope.addToCartFromDetailPage();
            cartDef.reject();
            $scope.$apply();
            expect($scope.error).toBeTruthy();
        });

        it('should re-enable buy button on error', function(){
            $scope.addToCartFromDetailPage();
            cartDef.reject();
            $scope.$apply();
            expect($scope.buyButtonEnabled).toBeTruthy();
        });

    });

    describe('quantity change', function () {


        beforeEach(function () {
            $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope, $location: $location,
                'CartSvc': mockedCartSvc, 'FeeSvc': mockedFeeSvc, 'product': angular.copy(mockProduct), 'lastCatId': mockLastCatId, 'variantId': null, 'GlobalData': mockedGlobalData, 'CategorySvc': mockCategorySvc, 'shippingZones': mockedShippingZones, 'Notification': mockedNotification, 'variants': [], 'variantPrices': []});
        });

        it('should disable buy button on invalid qty', function () {
            $scope.productDetailQty = '';
            $scope.changeQty();
            expect($scope.buyButtonEnabled).toBeFalsy();
        });

        it('should enable buy button on valid qty', function () {
            $scope.productDetailQty = 3;
            $scope.changeQty();
            expect($scope.buyButtonEnabled).toBeTruthy();
        });
    });

    describe('onCartUpdated', function () {

        beforeEach(function () {
            $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope,
                    'CartSvc': mockedCartSvc, 'FeeSvc': mockedFeeSvc, 'product': angular.copy(mockProduct),'lastCatId': mockLastCatId, 'variantId': null, 'GlobalData': mockedGlobalData, 'CategorySvc': mockCategorySvc, 'shippingZones': mockedShippingZones,  'Notification': mockedNotification, 'variants': [], 'variantPrices': []});
            $scope.addToCartFromDetailPage();
        });

        it('should call addProductToCart on CartSvc', function(){
            $scope.addToCartFromDetailPage();
            expect(mockedCartSvc.addProductToCart).toHaveBeenCalled();    
        });
        
        it('should show success notification', function(){
            cartDef.resolve();
            $rootScope.$apply(); //propogate resolve so .then is called
            expect(mockedNotification.success).toHaveBeenCalled();
        });
    });

    describe('productWithMainImage', function(){
        var mockProductWithMain = {
            product: {
                name: 'product1',
                published: true,
                media: [
                    { url: 'http://url1' },
                    { url: 'http://url2' },
                    { url: 'http://url3' }
                ],
                mixins: {
                    inventory: false
                },
                metadata: {
                    mixins: {}
                }
            }
        };

        beforeEach(function(){
            $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope,
                'CartSvc': mockedCartSvc, 'FeeSvc': mockedFeeSvc, 'product': mockProductWithMain, 'lastCatId': mockLastCatId, 'variantId': null, 'GlobalData': mockedGlobalData, 'CategorySvc': mockCategorySvc, 'shippingZones': mockedShippingZones, 'Notification': mockedNotification, 'variants': [], 'variantPrices': []});
        });

        it('should list committed images as they came', function(){
            expect($scope.product.media[0].url).toEqualData('http://url1');
            expect($scope.product.media[1].url).toEqualData('http://url2');
            expect($scope.product.media[2].url).toEqualData('http://url3');
        });
    });

    describe('productWithoutMainImage', function(){
        var mockProductWithImages = {
            product:{
                name: 'product1',
                id: 123,
                published: true,
                media: [
                    { url: 'http://url1' },
                    { url: 'http://url2' }
                ],
                mixins: {
                    inventory: false
                },
                metadata: {
                    mixins: {}
                }
            },
            categories: [
                {
                    id: 12345,
                    name: 'fakeCat',
                    slug: 'fake-cat'
                }
            ],
            prices: [{
                effectiveAmount: 24.99
            }]
        };

        beforeEach(function(){
            $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope,
                'CartSvc': mockedCartSvc, 'FeeSvc': mockedFeeSvc, 'product': mockProductWithImages, 'lastCatId': mockLastCatId, 'variantId': null, 'GlobalData': mockedGlobalData, 'CategorySvc': mockCategorySvc, 'shippingZones': mockedShippingZones, 'Notification': mockedNotification, 'variants': [], 'variantPrices': []});
        });

        it('should list first image first', function(){
            expect($scope.product.media[0].url).toEqualData('http://url1');
            expect($scope.product.media[1].url).toEqualData('http://url2');
        });
    });

    describe('taxConfiguration', function () {
        it ('should shorten the tax label and add a see more button if the label has more than 60 chars', function () {

            var longTaxLabel = 'Long Tax Label Long Tax Label Long Tax Label Long Tax Label Long Tax Label Long Tax Label Long Tax Label Long Tax Label Long Tax Label Long Tax Label ';

            mockedGlobalData={
                getCurrencySymbol: jasmine.createSpy('getCurrencySymbol').andReturn('USD'),
                getCurrentTaxConfiguration: jasmine.createSpy('getCurrentTaxConfiguration').andReturn({ rate: '7', label: longTaxLabel, included: false })
            };
            $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope,
                'CartSvc': mockedCartSvc, 'FeeSvc': mockedFeeSvc, 'product': angular.copy(mockProduct), 'lastCatId': mockLastCatId, 'variantId': null, 'GlobalData': mockedGlobalData, 'CategorySvc': mockCategorySvc, 'shippingZones': mockedShippingZones, 'Notification': mockedNotification, 'variants': [], 'variantPrices': []});

            var expectedShortenedLabel = longTaxLabel.substring(0, 59);
            expect($scope.taxConfiguration.shortenedLabel).toEqualData(expectedShortenedLabel);
            expect($scope.taxConfiguration.seeMoreClicked).toBeDefined();
        });
    });

    describe('itemYrn Fees', function() {
        it('GIVEN the current product is a base product with an associated fee WHEN I load the product details page THEN it should fetch the fee for this product YRN', function() {
            // Set the required mocks for a base product
            setBaseProduct();
            expect(mockedFeeSvc.getFeesForItemYrn).toHaveBeenCalledWith('urn:yaas:hybris:product:product:myStore;baseProductUniqueID');
        });

        it('GIVEN the current product is a product variant with an associated fee WHEN I load the product details page THEN it should fetch the fee for this variant YRN', function() {
            // Set the required mocks for a base product with variants
            setBaseProductWithVariants();
            expect(mockedFeeSvc.getFeesForItemYrn).toHaveBeenCalledWith('urn:yaas:hybris:product:product-variant:myStore:baseProductUniqueID;variantForProductUniqueID');
        });

        it('GIVEN the user selects a new product variant WHEN this variant has a fee associated to it THEN it should fetch the fee for this newly selected variant YRN', function() {
            // Set the required mocks for a base product with variants
            setBaseProductWithVariants();
            // Simulate variant update
            $scope.onActiveVariantChanged(variants[1]);
            expect(mockedFeeSvc.getFeesForItemYrn.mostRecentCall.args[0]).toEqual('urn:yaas:hybris:product:product-variant:myStore:baseProductUniqueID;variantForProductUniqueID2');
        });

        // Helper functions and variables used for mocks

        // Based product
        var mockedBaseProduct = {
            product: {
                code: "baseProduct",
                description: "Lorem ipsum",
                id: "baseProductUniqueID",
                media: [],
                metadata: {},
                mixins: {
                    inventory: false
                },
                name: "baseProduct Name",
                published: true,
                yrn: "urn:yaas:hybris:product:product:myStore;baseProductUniqueID"
            }
        };

        // Associated variants
        var variants = [
            {
                code: "variantForProduct",
                description: "Lorem ipsum",
                id: "variantForProductUniqueID",
                media: [],
                metadata: {},
                mixins: {
                    inventory: false
                },
                name: "variantForProduct Name",
                published: true,
                yrn: "urn:yaas:hybris:product:product-variant:myStore:baseProductUniqueID;variantForProductUniqueID"
            },
            {
                code: "variantForProduct2",
                description: "Lorem ipsum",
                id: "variantForProductUniqueID2",
                media: [],
                metadata: {
                    mixins: {}
                },
                mixins: {
                    inventory: false
                },
                name: "variantForProduct Name",
                published: true,
                yrn: "urn:yaas:hybris:product:product-variant:myStore:baseProductUniqueID;variantForProductUniqueID2"
            }
        ];

        // Variant prices
        var variantPrices = [
            {
                currency: "CAD",
                effectiveAmount: 200,
                group: "baseProductUniqueID",
                itemYrn: "urn:yaas:hybris:product:product-variant:myStore:baseProductUniqueID;variantForProductUniqueID",
                metadata: {},
                originalAmount: 200,
                priceId: "priceID",
                yrn: "urn:yaas:hybris:price:price:myStore;priceID"
            },
            {
                currency: "CAD",
                effectiveAmount: 200,
                group: "baseProductUniqueID",
                itemYrn: "urn:yaas:hybris:product:product-variant:myStore:baseProductUniqueID;variantForProductUniqueID2",
                metadata: {},
                originalAmount: 200,
                priceId: "priceID2",
                yrn: "urn:yaas:hybris:price:price:myStore;priceID2"
            }
        ];

        function setBaseProduct() {
            $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope, $location: $location,
                'CartSvc': mockedCartSvc, 'FeeSvc': mockedFeeSvc, 'product': angular.copy(mockedBaseProduct), 'lastCatId': mockLastCatId, 'variantId': null, 'GlobalData': mockedGlobalData, 'CategorySvc': mockCategorySvc, 'shippingZones': mockedShippingZones, 'Notification': mockedNotification, 'variants': [], 'variantPrices': []});
        }

        function setBaseProductWithVariants() {
            var mockedProductVariantsHelper = {
                getSelectedVariantWithFallback: jasmine.createSpy('getSelectedVariantWithFallback')
            };
            mockedProductVariantsHelper.getSelectedVariantWithFallback.andReturn(variants[0]);
            $controller('ProductDetailCtrl', { $scope: $scope, $rootScope: $rootScope, $location: $location,
                'CartSvc': mockedCartSvc, 'FeeSvc': mockedFeeSvc, 'product': angular.copy(mockedBaseProduct), 'lastCatId': mockLastCatId, 'variantId': 'variantForProductUniqueID', 'GlobalData': mockedGlobalData, 'CategorySvc': mockCategorySvc, 'shippingZones': mockedShippingZones, 'Notification': mockedNotification, 'ProductVariantsHelper': mockedProductVariantsHelper, 'variants': variants, 'variantPrices': variantPrices});
        }
    });

});
