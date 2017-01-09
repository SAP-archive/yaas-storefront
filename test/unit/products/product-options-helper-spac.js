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

describe('ProductOptionsHelper', function () {
    beforeEach(angular.mock.module('ds.products'));

    describe('prepareOptions', function () {
        it('should prepare options from variants', angular.mock.inject(function (ProductOptionsHelper) {
            // arrange
            var variants = [
                {
                    id: 'v1',
                    options: {
                        'o1': { 'a': 'val1', 'b': 'val1' },
                        'o2': { 'a': 'val1' }
                    }
                },
                {
                    id: 'v2',
                    options: {
                        'o1': { 'a': 'val2', 'b': 'val1' },
                        'o2': { 'a': 'val2' }
                    }
                }
            ];

            // act
            var options = ProductOptionsHelper.prepareOptions(variants);

            // assert
            expect(options).toEqual([
                {
                    optionKey: 'o1',
                    attributeKey: 'a',
                    attributes: [
                        { value: 'val1', variantIds: ['v1'], disabled: false },
                        { value: 'val2', variantIds: ['v2'], disabled: false }
                    ]
                }, {
                    optionKey: 'o1',
                    attributeKey: 'b',
                    attributes: [
                        { value: 'val1', variantIds: ['v1', 'v2'], disabled: false }
                    ]
                }, {
                    optionKey: 'o2',
                    attributeKey: 'a',
                    attributes: [
                        { value: 'val1', variantIds: ['v1'], disabled: false },
                        { value: 'val2', variantIds: ['v2'], disabled: false }
                    ]
                }
            ]);
        }));

        it('should omit complex attributes', angular.mock.inject(function (ProductOptionsHelper) {
            // arrange
            var variants = [
                {
                    id: 'v1',
                    options: {
                        'o1': { 'a': 'val1', 'b': { 'complex': 'attribute' }, 'c': ['complex', 'attribute'] },
                    }
                }
            ];

            // act
            var options = ProductOptionsHelper.prepareOptions(variants);

            // assert
            expect(options).toEqual([
                {
                    optionKey: 'o1',
                    attributeKey: 'a',
                    attributes: [
                        { value: 'val1', variantIds: ['v1'], disabled: false }
                    ]
                }
            ]);
        }));
    });

    describe('getIdsOfMatchingVariants', function () {
        it('should get ids of matching variants', angular.mock.inject(function (ProductOptionsHelper) {
            // arrange
            var attributesSelected = [
                { value: 'val1', variantIds: ['v1'], disabled: false },
                { value: 'val2', variantIds: ['v1', 'v2'], disabled: false }
            ];

            // act
            var result = ProductOptionsHelper.getIdsOfMatchingVariants(attributesSelected);

            // assert
            expect(result).toEqual(['v1']);
        }));
    });

    describe('updateOptions', function () {
        it('should update options', angular.mock.inject(function (ProductOptionsHelper) {
            // arrange
            var options = [
                {
                    optionKey: 'o1',
                    attributeKey: 'a',
                    attributes: [
                        { value: 'val1', variantIds: ['v1'], disabled: false },
                        { value: 'val2', variantIds: ['v2'], disabled: false }
                    ]
                }, {
                    optionKey: 'o1',
                    attributeKey: 'b',
                    attributes: [
                        { value: 'val1', variantIds: ['v1', 'v2'], disabled: false }
                    ]
                }
            ];

            // act
            var result = ProductOptionsHelper.updateOptions(options, ['v1']);

            // assert
            expect(result).toEqual([
                {
                    optionKey: 'o1',
                    attributeKey: 'a',
                    attributes: [
                        { value: 'val1', variantIds: ['v1'], disabled: false },
                        { value: 'val2', variantIds: ['v2'], disabled: true }
                    ]
                }, {
                    optionKey: 'o1',
                    attributeKey: 'b',
                    attributes: [
                        { value: 'val1', variantIds: ['v1', 'v2'], disabled: false }
                    ]
                }
            ]);
        }));
    });


	describe('preSelectOptions', function () {
		it('should select options for specified variant', angular.mock.inject(function (ProductOptionsHelper) {
			// arrange
			var availableOptions = [
				{
					optionKey: 'o123',
					attributeKey: 'a',
					attributes: [
						{ value: 'val1', variantIds: ['v1'], disabled: false },
						{ value: 'val2', variantIds: ['v2'], disabled: false }
					]
				}, {
					optionKey: 'o456',
					attributeKey: 'b',
					attributes: [
						{ value: 'val1', variantIds: ['v1', 'v2'], disabled: false }
					]
				}
			];

			var variant = {id: 'v2'}

			// act
			var result = ProductOptionsHelper.selectOptionsForVariant(variant, availableOptions);

			// assert
			expect(result).toEqual( [
				{ value : 'val2', variantIds : [ 'v2' ], disabled : false },
				{ value : 'val1', variantIds : [ 'v1', 'v2' ], disabled : false }
			]);
		}));
	});
});