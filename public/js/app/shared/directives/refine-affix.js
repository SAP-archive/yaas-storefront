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
(function () {
    'use strict';

    angular.module('ds.products')

        .directive('refineAffix', [function () {
            return {
                restrict: 'A',
                scope: {
                    refineAffixGridElement: '@',
                    refineAffixOffset: '@'
                },
                link: function (scope, element) {
                    element.affix({
                        offset: {
                            top: angular.element(scope.refineAffixGridElement).offset().top + parseInt(scope.refineAffixOffset, 10)
                        }
                    });
                }
            };
        }]);

})();