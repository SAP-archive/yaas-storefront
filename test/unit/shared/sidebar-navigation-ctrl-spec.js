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

describe('SidebarNavigationCtrl', function () {

    var $scope, $rootScope, $controller, $injector, $state;
    var mockedGlobalData = {};


    // configure the target controller's module for testing - see angular.mock
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.module('ds.shared'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$injector_, _$state_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $injector = _$injector_;
        $state = _$state_;
    }));

    describe('SidebarNavigationCtrl', function () {
        var navCtrl;

        beforeEach(function () {
            navCtrl = $controller('SidebarNavigationCtrl', {$scope: $scope, $state: $state, GlobalData: mockedGlobalData});
        });

        // SEE CHANGES MADE IN LOCALIZATION STORY STOR-726 - will need to merge

    });



});

