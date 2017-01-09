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

(function() {
    'use strict';

    angular.module('ds.shared')
        .controller('VariantOptionsCtrl', ['$scope', 'VariantOptionsSvc', function ($scope, VariantOptionsSvc) {
            
            $scope.variants = [];
            $scope.levelPadding = 10;

            $scope.$watch('variant', function(){
                if (!!$scope.variant) {
                    $scope.variants = VariantOptionsSvc.getProductVariants($scope.variant.options);
                }
            }, true);

        }]);
})();
