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
/** Defines the dependencies for the 'products' module, which comprises the 'browse products' view as well
 * as the product detail view. */
angular.module('ds.products', [
		'restangular',
    'ds.shared',
    'ds.cart',
    'ds.fees',
    'ui.bootstrap',
    'angularMoment'
]);

