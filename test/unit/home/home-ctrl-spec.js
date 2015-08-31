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

describe('HomeCtrl Test', function () {

    var $scope, $rootScope, $controller;

    beforeEach(angular.mock.module('ds.home'), function () {});

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    describe('Home Ctrl ', function () {

        beforeEach(function () {
            homeCtrl = $controller('HomeCtrl', {$scope: $scope, $rootScope: $rootScope});
        });

        it('should display slides', function () {
            expect($scope.slides).toBeDefined();
            expect($scope.carouselInterval).toBeDefined();
        });

    });

});
