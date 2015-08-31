/*
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

var regExpValidators = {
    url: new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/),
    email: new RegExp(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/),
    id: new RegExp(/^[0-9a-zA-Z-_]+$/),
    name: new RegExp(/^[0-9a-zA-Z-\s]+$/),
    password: new RegExp(/[\x00-\x7F]+/),
    description: new RegExp(/[\x00-\x7F]+/),
    date: new RegExp(/[\w]+/),
    keys: new RegExp(/^[.\-_a-zA-Z0-9:§]+$/),
    apiVersion: new RegExp(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/),
};

angular.module('ds.security', [])
    .directive('builderInput', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                scope.$watch(attr.ngModel, function () {
                    if (ctrl.$viewValue) {
                        var isValid = regExpValidators[attr.builderInput].test(ctrl.$viewValue);
                        ctrl.$setValidity('regexpFilter', isValid);
                    }
                });
            }
        };
    });
