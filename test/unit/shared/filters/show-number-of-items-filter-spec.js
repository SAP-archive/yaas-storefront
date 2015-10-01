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

describe('ShowNumberOfItemsFilter filter', function () {
    'use strict';

    var $filter;

    beforeEach(function () {
        module('ds.shared');

        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should return correct string made of number and Item or Items depending of number', function () {
        var result = $filter('showNoOfItems')(10);
        expect(result).toEqual('10 Items');

        result = $filter('showNoOfItems')(1);
        expect(result).toEqual('1 Item');

        result = $filter('showNoOfItems')('a');
        expect(result).toEqual('a Item');
    });

    it('should return 0 Items when parameter is undefined', function () {
        var result = $filter('showNoOfItems')();
        expect(result).toEqual('0 Item');
    });
});