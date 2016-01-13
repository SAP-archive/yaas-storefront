/**
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

describe('ytracking', function () {

    var $q, $httpBackend, $scope, $compile, $rootScope, $timeout, mockedYtrackingSvc, mockedLocalStorage, mockedYtrackingDirective;
    var mockedSettings = {
        headers: {
            hybrisTenant: 'hybris-tenant'
        }
    };
    var mockedAppConfig = {
        storeTenant: function () {
            return 'default';
        },
        dynamicDomain: jasmine.createSpy().andReturn('api.yaas.io')
    };
    var consentReference = 'consent-reference';

    var mockedGlobalData = {
        store: {
            tenant: 'default'
        },
        getSiteCode: function () {
            return 'site';
        }
    };
    var mockedCookieSvc = {
        setConsentReferenceCookie: jasmine.createSpy(),
        getConsentReferenceCookie: jasmine.createSpy()
    };
    var mockedLocalStorage = {};

    var openedCategory = {
        path: [{ name: 'cat1' }, { name: 'cat2' }]
    };
    var openedProduct = {
        product: {
            id: 1,
            name: {
                en: 'prod1'
            }
        },
        categories: [{
            id: "62256128"
        }],
        prices: [{
            effectiveAmount: 24.99
        }]
    };

    var order = {
        cart: {
            items: [{
                product: {
                    id: '02318421',
                    name: 'product1'
                },
                itemPrice: {
                    amount: 5
                },
                quantity: 2
            }],
            totalPrice: 0,
            subTotalPrice: {
                amount: 0
            }
        }
    };

    function createYTracking() {
        var elem, compiledElem;
        elem = angular.element('<div ytracking></div>');
        compiledElem = $compile(elem)($scope);
        $scope.$digest();

        return compiledElem;
    }


    beforeEach(angular.mock.module('ds.ytracking', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('localStorage', mockedLocalStorage);
        $provide.value('settings', mockedSettings);
        $provide.value('appConfig', mockedAppConfig);
        $provide.value('CookieSvc', mockedCookieSvc);
    }));

    beforeEach(inject(function (_$httpBackend_, _$q_, _$rootScope_, _$window_, _$compile_, _$timeout_) {
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $window = _$window_;
        $compile = _$compile_;
        $timeout = _$timeout_;

        $httpBackend.whenPOST().respond(201, {id: consentReference});

        inject(function ($injector) {
            mockedYtrackingSvc = $injector.get('ytrackingSvc');
        });

        //Create element
        var element = createYTracking();
    }));

    describe('yTracking init', function () {

        it('should create $window._paq object when initialized', function () {
            expect($window._paq).toBeDefined();
        });

        it('should use custom request processing for piwik', function () {
            var containsCustomProcessing = false;
            for (var i = 0; i < $window._paq.length; i++) {
                if ($window._paq[i][0] == 'setCustomRequestProcessing') {
                    containsCustomProcessing = true;
                }
            }
            expect(containsCustomProcessing).toBe(true);
        });
    });

    describe('yTracking events', function () {


        /*Category viewed*/
        it('should call setCategoryViewed when user navigated to category page', function () {
            mockedYtrackingSvc.setCategoryViewed = jasmine.createSpy('setCategoryViewed');

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();

            $scope.$emit('category:opened', openedCategory);

            expect($scope.$emit).toHaveBeenCalledWith("category:opened", openedCategory);
            expect(mockedYtrackingSvc.setCategoryViewed).toHaveBeenCalled();
        });

        it('should add new items to _paq array when category loaded', function () {

            var lengthBefore = $window._paq.length;

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();
            spyOn(mockedYtrackingSvc, "setCategoryViewed").andCallThrough();

            $scope.$emit('category:opened', openedCategory);

            $timeout.flush();

            var lengthAfter = $window._paq.length;
            expect(lengthAfter > lengthBefore).toBeTruthy();
        });



        /*Product viewed*/
        it('should call setProductViewed when user navigated to product page', function () {

            mockedYtrackingSvc.setProductViewed = jasmine.createSpy('setProductViewed');

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();

            $scope.$emit('product:opened', openedProduct);

            expect($scope.$emit).toHaveBeenCalledWith("product:opened", openedProduct);
            expect(mockedYtrackingSvc.setProductViewed).toHaveBeenCalled();
        });

        it('should add new items to _paq array when product loaded', function () {

            var lengthBefore = $window._paq.length;

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();
            spyOn(mockedYtrackingSvc, "setProductViewed").andCallThrough();

            $scope.$emit('product:opened', openedProduct);

            $timeout.flush();

            var lengthAfter = $window._paq.length;
            expect(lengthAfter > lengthBefore).toBeTruthy();
        });


        /*Site search*/
        it('should call searchEvent when user searched site', function () {
            var searchObj = {
                searchTerm: 'term',
                numberOfResults: 3
            };
            mockedYtrackingSvc.searchEvent = jasmine.createSpy('searchEvent');

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();

            $scope.$emit('search:performed', searchObj);

            expect($scope.$emit).toHaveBeenCalledWith("search:performed", searchObj);
            expect(mockedYtrackingSvc.searchEvent).toHaveBeenCalled();
        });
        it('should add new items to _paq array when user searched page', function () {
            var searchObj = {
                searchTerm: 'term',
                numberOfResults: 3
            };
            var lengthBefore = $window._paq.length;

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();
            spyOn(mockedYtrackingSvc, "searchEvent").andCallThrough();

            $scope.$emit('search:performed', searchObj);

            var lengthAfter = $window._paq.length;
            expect(lengthAfter > lengthBefore).toBeTruthy();
        });


        /*Checkout open*/
        it('should call proceedToCheckout when user opened checkout page', function () {
            var cart = {};
            mockedYtrackingSvc.proceedToCheckout = jasmine.createSpy('proceedToCheckout');

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();

            $scope.$emit('checkout:opened', cart);

            expect($scope.$emit).toHaveBeenCalledWith("checkout:opened", cart);
            expect(mockedYtrackingSvc.proceedToCheckout).toHaveBeenCalled();
        });
        it('should add new items to _paq array when user opened checkout page', function () {
            var cart = {};
            var lengthBefore = $window._paq.length;

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();
            spyOn(mockedYtrackingSvc, "proceedToCheckout").andCallThrough();

            $scope.$emit('checkout:opened', cart);

            $timeout.flush();

            var lengthAfter = $window._paq.length;
            expect(lengthAfter > lengthBefore).toBeTruthy();
        });




        /*Order placed*/
        it('should call orderPlaced when user placed order', function () {
           
            mockedYtrackingSvc.orderPlaced = jasmine.createSpy('orderPlaced');

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();

            $scope.$emit('order:placed', order);

            expect($scope.$emit).toHaveBeenCalledWith("order:placed", order);
            expect(mockedYtrackingSvc.orderPlaced).toHaveBeenCalled();
        });
        it('should add new items to _paq array when user opened checkout page', function () {
           
            var lengthBefore = $window._paq.length;

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();
            spyOn(mockedYtrackingSvc, "orderPlaced").andCallThrough();

            $scope.$emit('order:placed', order);

            var lengthAfter = $window._paq.length;
            expect(lengthAfter > lengthBefore).toBeTruthy();
        });






        /*Cart updated*/
        it('should call cartUpdated when user added/removed something from cart', function () {
         
            mockedYtrackingSvc.cartUpdated = jasmine.createSpy('cartUpdated');

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();

            $scope.$emit('cart:updated', order);

            expect($scope.$emit).toHaveBeenCalledWith("cart:updated", order);
            expect(mockedYtrackingSvc.cartUpdated).toHaveBeenCalled();
        });
        it('should add new items to _paq array when user added/removed something from cart', function () {

            var lengthBefore = $window._paq.length;

            spyOn($scope, "$emit").andCallThrough();
            spyOn($rootScope, "$on").andCallThrough();
            spyOn(mockedYtrackingSvc, "cartUpdated").andCallThrough();

            $scope.$emit('cart:updated', order);


            var lengthAfter = $window._paq.length;
            expect(lengthAfter > lengthBefore).toBeTruthy();
        });


    });

});