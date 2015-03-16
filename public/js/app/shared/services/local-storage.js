/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';


angular.module('ds.localstorage', [])
    .factory('localStorage', ['$window', function ($window) {

        var addItem = function (key, value) {
            if(localStorageSupported()){
                $window.localStorage[key] = JSON.stringify(value);
            }
        };
        var addItemToArray = function (key, value) {
            if(localStorageSupported()){
                if($window.localStorage[key] === undefined || $window.localStorage[key] === ''){
                    $window.localStorage[key] = JSON.stringify([value]);
                }
                else {
                    var obj = JSON.parse($window.localStorage[key]);
                    obj.push(value);
                    $window.localStorage[key] = JSON.stringify(obj);
                }
            }
        };

        var getItem = function (key) {
            if(localStorageSupported()){
                if($window.localStorage[key] !== undefined) {
                    return $window.localStorage[key];
                }
                else{
                    return null;
                }
            }
        };

        var getAllItems = function (key) {

            if(localStorageSupported()){
                if($window.localStorage[key] !== undefined){
                    var data = JSON.parse($window.localStorage[key]);
                    delete $window.localStorage[key];
                    return data;
                }
            }
            return [];
        };

        var localStorageSupported = function () {
            try {
                return 'localStorage' in $window && $window.localStorage !== null;
            } catch(e) {
                return false;
            }
        };

        return {
            addItem: addItem,
            addItemToArray:addItemToArray,
            getItem: getItem,
            getAllItems: getAllItems
        };
    }]);