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
    var mockedState = {};
    var mockedStateParams = {
            errorId: '401'
    };
    function mockedTranslate(title) {
        return { then: function(callback){callback(title)}};
    }

    beforeEach(module('ds.errors', function ($provide) {
        $provide.value('$translate', mockedTranslate);
        $provide.value('$state', mockedState);
    }));

    beforeEach(inject(function(_$rootScope_, _$controller_) {
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    describe('Errors Ctrl ', function () {

        beforeEach(function () {
            errorsCtrl = $controller('ErrorsCtrl', {$scope: $scope, $stateParams: mockedStateParams, $translate: mockedTranslate});
        });

        it('should exist', function () {
            expect($scope.redirect).toBeDefined();
        });

    });

});
