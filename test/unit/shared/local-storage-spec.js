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

describe('localstorage ', function () {

    var localStorage;
    var $window;
    var mockedLocalStorage = {};

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.localstorage'));

    beforeEach(function ($provide) {

        inject(function (_$window_, _localStorage_) {
            $window = _$window_;
            localStorage = _localStorage_;
        });
    });

    it('should be defined', function () {
        expect(localStorage).toBeDefined();
    });

    it('should add key to localeStorage', function () {
        localStorage.addItem('key', 'item');
        expect(localStorage.getItem('key')).toBeDefined();
    });

    it('should return null when item doesn\'t exist', function () {
        expect(localStorage.getItem('randomKey')).toEqual(null);
    });

    it('should return item by key', function () {
        localStorage.addItem('key2', 'item');
        expect(localStorage.getItem('key2')).toEqual('"item"');
    });

    it('should create new array when no item with this key is in localstorage', function () {
        expect(localStorage.getItem('key3')).toEqual(null);

        localStorage.addItemToArray('key3', {id:1});
        expect(localStorage.getItem('key3')).not.toEqual(null);
    });

    it('should add to existing array new value if the key exists', function () {

        localStorage.addItemToArray('key3', {id:2});
        expect(JSON.parse(localStorage.getItem('key3')).length).toEqual(2);
    });

    it('should return and remove all items from localstorage when getAllItems called', function () {
        var returnedData = localStorage.getAllItems('key3');
        expect(returnedData.length).toEqual(2);
        expect(returnedData[1].id).toEqual(2);
        expect(localStorage.getAllItems('key3')).toEqual([]);
    });

    it('should return empty array when there is no value with provided key in localstorage', function () {
        expect(localStorage.getAllItems('randomKey')).toEqual([]);
    });
});