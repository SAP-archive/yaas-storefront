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

describe('httpQueue', function(){

    var $q, $httpBackend, httpQueue, $scope;
    var config = {method: 'GET', url: '/someUrl', headers: {}};
    var config2 = {method: 'GET', url: '/someUrl2', headers: {}};
    var mockedState = {
        go: jasmine.createSpy()
    };

    beforeEach(module('pascalprecht.translate'));
    beforeEach(module('ds.queue', function ($provide) {
        $provide.value('$state', mockedState);
    }));


    beforeEach(inject(function(_httpQueue_, _$httpBackend_, _$q_, _$rootScope_) {
        httpQueue = _httpQueue_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $scope = _$rootScope_;
    }));


    describe('retryAll', function(){
        var deferredBlocked;
        var deferredRejected;

        beforeEach(function(){
            deferredBlocked = $q.defer();
            deferredRejected = $q.defer();
            httpQueue.appendBlocked(config, deferredBlocked);
            httpQueue.appendRejected(config2, deferredRejected);
            this.addMatchers({
                toEqualData: function (expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });

        it('should resolve/retry blocked requests with token header', function () {
            var success;
            var onSuccess = function (result) {
                success = result;
            }
            var promise = deferredBlocked.promise;

            promise.then(onSuccess, function (failure) {
                console.log(failure);
            });
            var token = 'abc123';
            httpQueue.retryAll(token);
            $scope.$digest();
            expect(success).toBeTruthy();
            expect(success).toEqualData({ method : 'GET', url : '/someUrl', headers : { Authorization : 'Bearer abc123' } } );
        });

        it('should redirect to error page on failure', function(){
            expect(mockedState.go).toHaveBeenCalled();
        })
    });
});