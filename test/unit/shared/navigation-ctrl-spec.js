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

describe('NavigationCtrl Test', function () {

    var $scope, $rootScope, $controller, $injector;
    var mockedGlobalData = {};

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.shared'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$injector_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $injector = _$injector_;
    }));

    describe('NavigationCtrl', function () {
        var navCtrl, cart;
        cart = {};
        beforeEach(function () {
            navCtrl = $controller('NavigationCtrl', {$scope: $scope, cart: cart, GlobalData: mockedGlobalData});
        });

        it('should change showCart value', function(){
            $scope.toggleCart();
            expect($rootScope.showCart).toEqualData(true);
            $scope.toggleCart();
            expect($rootScope.showCart).toEqualData(false);
        });

        it('should toggle offCanvas', function () {
            $scope.toggleOffCanvas();
            expect($rootScope.showMobileNav).toEqualData(true);
            $scope.toggleOffCanvas();
            expect($rootScope.showMobileNav).toEqualData(false);
        });

    });



});

