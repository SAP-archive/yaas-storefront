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

describe('ProductVariantsHelper', function () {
    beforeEach(angular.mock.module('ds.products'));

    describe('selectVariant', function () {
        it('should return variant which was specified as default', angular.mock.inject(function (ProductVariantsHelper) {
            // arrange
            var variants = [
                {
                    id: 'v1Id',
                    options: {
                        'o1': { 'a': 'val1', 'b': 'val1' },
                        'o2': { 'a': 'val1' }
                    },
					default : false
                },
                {
                    id: 'v2Id',
                    options: {
                        'o1': { 'a': 'val2', 'b': 'val1' },
                        'o2': { 'a': 'val2' }
                    }
                },
				{
					id: 'v3Id',
					options: {
						'o1': { 'a': 'val2', 'b': 'val1' },
						'o2': { 'a': 'val2' }
					},
					default : true
				},
				{
					id: 'v4Id',
					options: {
						'o1': { 'a': 'val2', 'b': 'val1' },
						'o2': { 'a': 'val2' }
					}
				}
            ];

            // act
            var foundVariant = ProductVariantsHelper.getDefaultVariantWithFallback(variants);

            // assert
            expect(foundVariant.id).toEqual('v3Id');
        }));


		it('should return first variant if no variant was specified as default', angular.mock.inject(function (ProductVariantsHelper) {
			// arrange
			var variants = [
				{
					id: 'v1Id',
					options: {
						'o1': { 'a': 'val1', 'b': 'val1' },
						'o2': { 'a': 'val1' }
					},
					default : false
				},
				{
					id: 'v2Id',
					options: {
						'o1': { 'a': 'val2', 'b': 'val1' },
						'o2': { 'a': 'val2' }
					}
				},
				{
					id: 'v3Id',
					options: {
						'o1': { 'a': 'val2', 'b': 'val1' },
						'o2': { 'a': 'val2' }
					},
					default : false
				},
				{
					id: 'v4Id',
					options: {
						'o1': { 'a': 'val2', 'b': 'val1' },
						'o2': { 'a': 'val2' }
					}
				}
			];

			// act
			var foundVariant = ProductVariantsHelper.getDefaultVariantWithFallback(variants);

			// assert
			expect(foundVariant.id).toEqual('v1Id');
		}));
	});
});