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

describe('quantityInput Test', function () {

    var $scope, element, inputEl;

    var triggerKeyDown = function (element, keyCode) {
        var e = angular.element.Event('keydown')
        e.which = keyCode;
        element.trigger(e);
    };

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.shared'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        element = angular.element(
            '<input quantity-input ng-model="model.testinput" name="testinput"/>'
        );

        inputEl = element.find('input');

        $scope =  _$rootScope_;
        $scope.model = {};
        _$compile_(element)($scope);
    }));

});
