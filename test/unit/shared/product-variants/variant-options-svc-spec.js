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

'use strict';

describe('VariantOptionsSvc Test', function () {

    var variantOptionsSvc, mockedOrder;

    beforeEach(angular.mock.module('ds.shared', function () {}));

    beforeEach(function () {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        inject(function (_VariantOptionsSvc_) {
            variantOptionsSvc = _VariantOptionsSvc_;
        });

        mockedOrder = {
            id: 'order1234',
            status: 'IN_PROGRESS',
            items: [
                {
                    id: 'product1',
                    sku: 'product1',
                    quantity: 1,
                    price: 50,
                    variant: {}
                }
            ]
        };
    });


    it('getProductVariants() should return empty array when empty data are passed to it', function () {
        expect(variantOptionsSvc.getProductVariants()).toEqualData([]);
        expect(variantOptionsSvc.getProductVariants([])).toEqualData([]);
    });

    it('getProductVariants() should correctly parse the simple product variants', function () {
        mockedOrder.items[0].variant.options = {
            mug: {
                color: 'black',
                size: 'small'
            }
        }
        expect(variantOptionsSvc.getProductVariants(mockedOrder.items[0].variant.options)).toEqualData([ 
            { name: 'color', value: 'black', path: '.mug', level: 0 },
            { name: 'size', value: 'small', path: '.mug', level: 0 }
        ]);
    });

    it('getProductVariants() should correctly parse more complex product variants', function () {
        mockedOrder.items[0].variant.options = {
            car: {
                brand: 'bmw',
                type: '1'
            },
            color: [
                {outer: 'black'},
                {inner: 'white'}
            ],
            origin: {
                country: 'Germany'
            }
        }
        expect(variantOptionsSvc.getProductVariants(mockedOrder.items[0].variant.options)).toEqualData([ 
            { name: 'brand', value: 'bmw', path: '.car', level: 0 }, 
            { name: 'type', value: '1', path: '.car', level: 0 }, 
            { name: 'color', path: '', level: 0 }, 
            { name: 'outer', value: 'black', path: '.color', level: 1 }, 
            { name: 'inner', value: 'white', path: '.color', level: 1 }, 
            { name: 'country', value: 'Germany', path: '.origin', level : 0 } 
        ]);
    });

});