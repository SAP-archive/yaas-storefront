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

'use strict';

/** REST configuration for services related to checkout. */
angular.module('ds.checkout')
    .factory('CheckoutREST', ['settings', 'Restangular', function(settings, Restangular){

        return {
            /** Configures main checkout API endpoint.*/
            Checkout: Restangular.withConfig(function(RestangularConfigurer) {
							RestangularConfigurer.setBaseUrl(settings.apis.checkout.baseUrl);
            }),
            /** Configures main shipping costs API endpoint.*/
            ShippingCosts: Restangular.withConfig(function(RestangularConfigurer) {
							RestangularConfigurer.setBaseUrl(settings.apis.shippingCosts.baseUrl);
            })
        };


    }]);