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

(function () {
    'use strict';

    angular.module('ds.fees')
        .directive('productFees', ['GlobalData', '$filter', function (GlobalData, $filter) {
            return {
                restrict: 'E',
                templateUrl: 'js/app/fees/templates/product-fees.html',
                scope: {
                    fees: '='
                },
                replace: true,
                link: function(scope) {
                    scope.$watch('fees', function(fees) {
                        if(fees && fees.length > 0) {
                            fees.forEach(function(fee) {
                                var isAbsoluteOrAbsoluteMultiplyItemQuantityFee = (fee.feeType === 'ABSOLUTE' || fee.feeType === 'ABSOLUTE_MULTIPLY_ITEMQUANTITY') && fee.feeAbsolute;
                                if(isAbsoluteOrAbsoluteMultiplyItemQuantityFee) {
                                    var currencyID = fee.feeAbsolute.currency;
                                    fee.currencySymbol = GlobalData.getCurrencySymbol(currencyID);
                                    fee.feeAbsolute.amount = $filter('number')(fee.feeAbsolute.amount, 2);
                                }
                            });
                        }
                    });
                }
            };
        }]);
})();