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

describe('Product list router test', function () {

    var scope, $state, $stateParams, $httpBackend, createController;

    beforeEach(module('ds.router'));

    beforeEach(inject(function($injector) {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();
        $state = $injector.get('$state');
        $stateParams = $injector.get('$stateParams');
        var $controller = $injector.get('$controller');

        createController = function () {
            return $controller('BrowseProductsCtrl', {'$scope': scope, '$stateParams': $stateParams});
        }

        $httpBackend.whenGET('http://product-service-dprod.deis-dev-01.ytech.fra.hybris.com/products?pageNumber=1&pageSize=5')
            .respond([{name: 'Shirt'}, {name: 'Hat'}]);

        $httpBackend.whenGET('public/js/app/products/templates/product-list.html').respond({});
        $httpBackend.whenGET('public/js/app/shared/templates/navigation.html').respond({});
        $httpBackend.whenGET('public/js/app/shared/templates/header.html').respond({});
        $httpBackend.whenGET('public/js/app/shared/templates/footer.html').respond({});
        $httpBackend.whenGET('public/js/app/home/templates/body.html').respond({});
        $httpBackend.whenGET('public/js/app/home/templates/home.html').respond({});

    }));

    afterEach(function () {
       $httpBackend.verifyNoOutstandingExpectation();
       $httpBackend.verifyNoOutstandingRequest();
    });

    it('state change should trigger URL change', function() {
       expect($state.href('base.product')).toEqualData('#!/products');
       //flush is necessary here because the beforeEach sets up some expected requests for every test
       var controller = createController();
       $httpBackend.flush();
    });

});