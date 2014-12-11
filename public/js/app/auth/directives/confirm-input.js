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

angular.module('ds.auth')
.directive('confirmInput', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var firstPassword = '#' + attrs.confirmInput;
            // we're adding a 'on key up' listener to both the original and repeat password
            element.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = element.val()===$(firstPassword).val();
                    ctrl.$setValidity('match', v);
                });
            });
        }
    };
});
