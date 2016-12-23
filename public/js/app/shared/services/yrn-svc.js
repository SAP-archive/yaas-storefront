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

(function () {
    'use strict';
    angular.module('ds.shared')
		.constant('YrnConstants', {
			commonYrnRegex: /^urn:yaas:[A-Za-z0-9-_.~]+:[A-Za-z0-9-_.~]+:[A-Za-z0-9-_.~]+:[A-Za-z0-9-_.~]+;[A-Za-z0-9-_.~]+$/,
			productYrnRegex: /^urn:yaas:hybris:product:product:[A-Za-z0-9-_.~]+;[A-Za-z0-9-_.~]+$/,
			productVariantYrnRegex: /^urn:yaas:hybris:product:product-variant:[A-Za-z0-9-_.~]+;[A-Za-z0-9-_.~]+;[A-Za-z0-9-_.~]+$/
		})
		.factory('YrnSvc', ['YrnConstants', function YrnSvcProvider(YrnConstants) {

			var isValidProductYrn = function (yrn) {
				return YrnConstants.productYrnRegex.test(yrn);
			};

			var isValidProductVariantYrn = function (yrn) {
				return YrnConstants.productVariantYrnRegex.test(yrn);
			};

			var isValidYrn = function(yrn) {
				return isValidProductYrn(yrn) || isValidProductVariantYrn(yrn);
			};

			var parse = function (yrn) {
				var oYrn = {};
				var yrnElements = yrn.split(':');
				var idElements;
				if (yrnElements.length >= 6) {
					oYrn.organization = yrnElements[2];
					oYrn.service = yrnElements[3];
					oYrn.resource = yrnElements[4];
					oYrn.id = yrnElements[5];
					if (oYrn.resource === 'product-variant') {
						idElements = oYrn.id.split(';');
						if (isValidProductVariantYrn(yrn)) {
							oYrn.resourceIds = {
								tenant: idElements[0],
								productId: idElements[1],
								variantId: idElements[2]
							};
						}
					}
					else if (oYrn.resource === 'product') {
						idElements = oYrn.id.split(';');
						if (isValidProductYrn(yrn)) {
							oYrn.resourceIds = {
								tenant: idElements[0],
								productId: idElements[1]
							};
						}
					}
				}
				return oYrn;
			};


        return {
            parse: parse,
			isValidProductYrn: isValidProductYrn,
			isValidProductVariantYrn: isValidProductVariantYrn,
			isValidYrn: isValidYrn
        };
    }]);
}());