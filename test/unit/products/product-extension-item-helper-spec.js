/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

describe('ProductExtensionItemHelper', function () {
    beforeEach(angular.mock.module('ds.products'));

    describe('parseExtensionDefinitionDate', function () {
        
        it('should parse time in format HH:MM:SS', angular.mock.inject(function (ProductExtensionItemHelper) {
            // arrange
            var timeString = "23:21:32";

            // act
            var dateTime = ProductExtensionItemHelper.stringToDate('time', timeString);

            // assert
            expect(moment(dateTime).isValid()).toBeTruthy();
        }));

        it('should parse time from date in ISO 8601 format', angular.mock.inject(function (ProductExtensionItemHelper) {
            // arrange
            var timeString = "2016-12-28T23:21:52.000Z";

            // act
            var dateTime = ProductExtensionItemHelper.stringToDate('time', timeString);

            // assert
            expect(moment(dateTime).isValid()).toBeTruthy();
        }));

        it('should parse date in format DD-MM-YYYY', angular.mock.inject(function (ProductExtensionItemHelper) {
            // arrange
            var timeString = "02-12-2016";

            // act
            var dateTime = ProductExtensionItemHelper.stringToDate('date', timeString);

            // assert
            expect(moment(dateTime).isValid()).toBeTruthy();
        }));

        it('should parse date from date in ISO 8601 format', angular.mock.inject(function (ProductExtensionItemHelper) {
            // arrange
            var timeString = "2016-12-28T23:21:52.000Z";

            // act
            var dateTime = ProductExtensionItemHelper.stringToDate('date', timeString);

            // assert
            expect(moment(dateTime).isValid()).toBeTruthy();
        }));

        it('should parse datetime from date in ISO 8601 format', angular.mock.inject(function (ProductExtensionItemHelper) {
            // arrange
            var timeString = "2016-12-28T23:21:52.000Z";

            // act
            var dateTime = ProductExtensionItemHelper.stringToDate('date-time', timeString);

            // assert
            expect(moment(dateTime).isValid()).toBeTruthy();
        }));

    });

    

});