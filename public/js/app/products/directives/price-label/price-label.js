(function () {
    'use strict';
    angular.module('ds.products').directive('priceLabel', [function () {
        return {
            restrict: 'E',
            templateUrl: 'js/app/products/directives/price-label/price-label.html',
            scope: {
                price: '=',
                range: '=',
                currencySymbol: '@'
            },
            link: function (scope) {
                scope.isMinEqualsMax = function () {
                    return scope.price.minPrice.effectiveAmount === scope.price.maxPrice.effectiveAmount;
                };
                scope.isMinPriceSale = function () {
                    return scope.price.minPrice.effectiveAmount < scope.price.minPrice.originalAmount;
                };
                scope.isMaxPriceSale = function () {
                    return scope.price.maxPrice.effectiveAmount < scope.price.maxPrice.originalAmount;
                };
                scope.isSinglePriceSale = function () {
                    return scope.price.singlePrice.effectiveAmount < scope.price.singlePrice.originalAmount;
                };
            }
        };
    }]);
} ());