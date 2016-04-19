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
    .controller('ProductDetailCtrl', ['$scope', '$rootScope', 'CartSvc', 'product', 'lastCatId', 'settings', 'GlobalData', 'CategorySvc','$filter', 'ProductAttributeSvc', '$modal', 'shippingZones', 'Notification', 'CommittedMediaFilter',
        function($scope, $rootScope, CartSvc, product, lastCatId, settings, GlobalData, CategorySvc, $filter, ProductAttributeSvc, $modal, shippingZones, Notification, CommittedMediaFilter) {
            var modalInstance;
            
            $scope.product = product;
            $scope.shippingZones = shippingZones;
            $scope.noShippingRates = true;
            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            // used by breadcrumb directive
            $scope.category = product.categories;
            $scope.breadcrumbData = angular.copy($scope.category);

            $scope.taxConfiguration = GlobalData.getCurrentTaxConfiguration();

            if(!!lastCatId) {
                if(lastCatId === 'allProducts'){
                    var allProductsName = $filter('translate')('ALL_PRODUCTS');
                    $scope.breadcrumbData = {
                        path: [{
                            id: '',
                            name: allProductsName,
                            slug: ''
                        }]
                    };
                }
                else
                {
                    CategorySvc.getCategoryById(lastCatId)
                        .then(function (cat) {
                            $scope.breadcrumbData = {};
                            $scope.breadcrumbData = cat;
                        });
                }
            }

            if ($scope.shippingZones.length) {
                for (var j = 0; j < $scope.shippingZones.length; j++) {
                    if ($scope.shippingZones[j].methods.length) {
                        $scope.noShippingRates = false;
                        break;
                    }
                }
            } else {
                $scope.noShippingRates = true;
            }

            //Event that product is loaded
            $scope.$emit('product:opened', product);

            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            $scope.error=null;

            if (angular.isArray($scope.product.product.media)) {
                $scope.product.product.media = CommittedMediaFilter.filter($scope.product.product.media);
            } else {
                $scope.product.product.media = [];
            }
            
            if ($scope.product.product.media.length === 0) {
                $scope.product.product.media.push({ id: settings.placeholderImageId, url: settings.placeholderImage });
            }

            //input default values must be defined in controller, not html, if tied to ng-model
            $scope.productDetailQty = 1;
            $scope.buyButtonEnabled = true;
            
            $scope.showShippingRates = function(){
                
                modalInstance = $modal.open({
                    templateUrl: 'js/app/shared/templates/shipping-dialog.html',
                    scope: $scope
                });
            };

            $scope.closeShippingZonesDialog = function () {
                modalInstance.close();
            };

            // scroll to top on load
            window.scrollTo(0, 0);

            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {

                $scope.taxConfiguration = GlobalData.getCurrentTaxConfiguration();

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
                CartSvc.addProductToCart(product.product, product.prices, $scope.productDetailQty, { closeCartAfterTimeout: true, opencartAfterEdit: false })
                .then(function(){
                    var productsAddedToCart = $filter('translate')('PRODUCTS_ADDED_TO_CART');
                    Notification.success({message: $scope.productDetailQty + ' ' + productsAddedToCart, delay: 3000});
                }, function(){
                    $scope.error = 'ERROR_ADDING_TO_CART';
                }).finally(function() {
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

            $scope.hasAnyOfAttributesSet = function(product){
                return ProductAttributeSvc.hasAnyOfAttributesSet(product);
            };

}]);
