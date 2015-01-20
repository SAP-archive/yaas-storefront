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

angular.module('ds.products')
    /** Controls the product detail view, which allows the shopper to add an item to the cart.
     * Listens to the 'cart:updated' event.  Once the item has been added to the cart, and the updated
     * cart information has been retrieved from the service, the 'cart' view will be shown.
     */
    .controller('ProductDetailCtrl', ['$scope', '$rootScope', 'CartSvc', 'product', 'settings', 'GlobalData',
        function($scope, $rootScope, CartSvc, product, settings, GlobalData) {

            $scope.product = product;

            // used by breadcrumb directive
            $scope.category = product.richCategory;

            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            $scope.error=null;

            if(!$scope.product.media || !$scope.product.media.length) { // set default image if no images configured
                $scope.product.media = [{url: settings.placeholderImage}];
            } else if (!$scope.product.media[0].customAttributes || !$scope.product.media[0].customAttributes.main){ // make sure main image is first in list
                for (var i = 0; i < $scope.product.media.length; i++) {
                    if($scope.product.media[i].customAttributes && $scope.product.media[i].customAttributes.main){
                        var first = $scope.product.media[0];
                        $scope.product.media[0] = $scope.product.media[i];
                        $scope.product.media[i] = first;
                        break;
                    }
                }
            }

            //input default values must be defined in controller, not html, if tied to ng-model
            $scope.productDetailQty = 1;
            $scope.buyButtonEnabled = true;


            // scroll to top on load
            window.scrollTo(0, 0);

            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {
                if(eveObj.source === 'manual'){
                    $rootScope.showCart = true;
                    //check to see if the cart should close after timeout
                    if(eveObj.closeAfterTimeout)
                    {
                        $rootScope.$emit('cart:closeAfterTimeout');

                    }
                    $scope.buyButtonEnabled = true;
                }

            });

            $scope.$on('$destroy', unbind);

            /** Add the product to the cart.  'Buy' button is disabled while cart update is in progress. */
            $scope.addToCartFromDetailPage = function () {
                $scope.error = false;
                $scope.buyButtonEnabled = false;
                CartSvc.addProductToCart(product, $scope.productDetailQty, {closeCartAfterTimeout: true, opencartAfterEdit: true}).then(function(){},
                function(){
                    $scope.error = 'ERROR_ADDING_TO_CART';
                    $scope.buyButtonEnabled = true;
                });
            };

            $scope.changeQty = function () {
                if (!$scope.productDetailQty){
                    $scope.buyButtonEnabled = false;
                } else {
                    $scope.buyButtonEnabled = true;
                }
            };


}]);