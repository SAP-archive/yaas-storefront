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

describe('ErrorsCtrl Test', function () {

    var $scope, $rootScope, $controller;

    beforeEach(angular.mock.module('ds.errors'), function () {});

    beforeEach(inject(function(_$rootScope_, _$controller_) {

        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    describe('Errors Ctrl ', function () {

        beforeEach(function () {
            errorsCtrl = $controller('ErrorsCtrl', {$scope: $scope, $rootScope: $rootScope});
        });

        it('should exist', function () {
            expect($scope.errorDetails).toBeDefined();
        });

    });

});
