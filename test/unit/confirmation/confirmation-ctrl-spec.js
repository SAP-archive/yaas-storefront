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

describe('ConfirmationCtrl Test', function () {

    var $scope, $controller, $q, mockedStateParams, mockedOrderDetailSvc, confCtrl, queryDeferred;
    var orderId = 123;
    var mockedOrderDetailSvc = {};

    mockedStateParams = {};
    mockedStateParams.orderId = orderId;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.confirmation'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $q = _$q_;
        queryDeferred = $q.defer();

    }));

    beforeEach(function(){
        queryDeferred.resolve({});
        mockedOrderDetailSvc.getFormattedConfirmationDetails = jasmine.createSpy('getFormattedConfirmationDetails').andReturn(queryDeferred.promise);

    });



    beforeEach(function () {
        confCtrl = $controller('ConfirmationCtrl', {$scope: $scope, '$stateParams': mockedStateParams, 'OrderDetailSvc': mockedOrderDetailSvc});
    });

    describe(' initialization', function () {

        it(' should inject order id ', function () {
           expect($scope.orderInfo).toBeTruthy();
           expect($scope.orderInfo.orderId).toEqualData(orderId);
        });
    });



});
