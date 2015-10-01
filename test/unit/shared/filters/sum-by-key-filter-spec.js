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

describe('sumByKey filter', function () {
    'use strict';

    var $filter;

    beforeEach(function () {
        module('ds.shared');

        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should return correct string made of number and Item or Items depending of number', function () {
        var items = [{ val: 3 }, { val: 8 }, { val: 2 }];

        var result = $filter('sumByKey')(items, 'val');
        expect(result).toEqual(13);

        items = [{ test: 8 }, { test: 1 }, { val: 2 }];

        result = $filter('sumByKey')(items, 'test');
        expect(result).toEqual(9);

        result = $filter('sumByKey')();
        expect(result).toEqual(0);
    });
});