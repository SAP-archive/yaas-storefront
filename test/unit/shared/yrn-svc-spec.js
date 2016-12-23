/*
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

describe('YrnSvc', function () {
    var YrnSvc;
    beforeEach(function () {
        module('ds.shared');
        inject(function (_YrnSvc_) {
            YrnSvc = _YrnSvc_;
        });
    });
    it ('should parse variant yrn', function () {
        // arrange
            var yrn = 'urn:yaas:hybris:product:product-variant:tenant;productId;variantId';
        // act
            var oYrn = YrnSvc.parse(yrn);
        // assert
            expect(oYrn).toEqual({
                organization: 'hybris',
                service: 'product',
                resource: 'product-variant',
                id: 'tenant;productId;variantId',
                resourceIds: {
                    tenant: 'tenant',
                    productId: 'productId',
                    variantId: 'variantId'
                }
            });
    });

	it ('should confirm that variant yrn is valid', function () {
		// arrange
		var yrn = 'urn:yaas:hybris:product:product-variant:tenant;productId;variantId';
		// act
		var result = YrnSvc.isValidProductVariantYrn(yrn);
		// assert
		expect(result).toBeTruthy();
	});

	it ('should confirm that product yrn is valid', function () {
		// arrange
		var yrn = 'urn:yaas:hybris:product:product:tenant;productId';
		// act
		var result = YrnSvc.isValidProductYrn(yrn);
		// assert
		expect(result).toBeTruthy();
	});

	it ('should deny that invalid variant yrn is valid', function () {
		// arrange
		var yrn = 'urn:yaas:hybris:product1:product-variant:tenant;productId;variantId';
		// act
		var result = YrnSvc.isValidProductVariantYrn(yrn);
		// assert
		expect(result).toBeFalsy();
	});

	it ('should deny that invalid product yrn is valid', function () {
		// arrange
		var yrn = 'urn:yaas:hybris:product:product1:tenant;productId';
		// act
		var result = YrnSvc.isValidProductYrn(yrn);
		// assert
		expect(result).toBeFalsy();
	});
});