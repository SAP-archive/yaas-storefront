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

angular.module('ds.checkout')
/**
 * mobile-checkout-wizard
 *
 * this directive controls which checkout step is showing in the mobile view
 */
    .directive('mobileCheckoutWizard',[function(){
        return {
            restrict: 'A',
            link: function(scope) {

            }
        };
    }]);