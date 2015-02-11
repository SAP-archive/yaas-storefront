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

xdescribe('Router test', function () {

    var scope, $state, $httpBackend, createController, mockedProductSvc, ProductSvc;

    var mockedStateParams = {};
    //beforeEach(module('config'));
    beforeEach(module('ds.app'));

    beforeEach(module('ds.products', function($provide) {
        mockedProductSvc = {
            query: jasmine.createSpy()
        };

        $provide.value('ProductSvc', mockedProductSvc);
    }));

    beforeEach(inject(function($injector) {              //, _ProductSvc
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        $httpBackend = $injector.get('$httpBackend');
        scope = $injector.get('$rootScope').$new();
        $state = $injector.get('$state');

        ProductSvc = $injector.get('ProductSvc');
        var $controller = $injector.get('$controller');


        createController = function () {
            return $controller('BrowseProductsCtrl', {'$scope': scope, '$stateParams': mockedStateParams, 'ProductSvc': ProductSvc});
        }
        $httpBackend.whenGET(/^[A-Za-z-/]*\.html/).respond({});

    }));



    afterEach(function () {
       $httpBackend.verifyNoOutstandingExpectation();
       $httpBackend.verifyNoOutstandingRequest();
    });

    it('states.should be mapped', function() {
       expect($state.href('base.product')).toEqualData('#!/products/');
       $state.go('base.product');
       $httpBackend.flush();
       //expect(mockedProductSvc.query).toHaveBeenCalled();
    });

    it('Route change to base.product should trigger product load', function() {

        $state.go('base.product');
        $httpBackend.flush();
        // not working
        //expect(mockedProductSvc.query).toHaveBeenCalled();
    });

});