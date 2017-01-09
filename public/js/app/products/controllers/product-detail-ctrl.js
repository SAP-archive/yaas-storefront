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
    .controller('ProductDetailCtrl', ['$scope', '$rootScope', '$location', 'CartSvc', 'product', 'lastCatId', 'variantId', 'GlobalData', 'CategorySvc','$filter', '$uibModal', 'shippingZones', 'Notification', 'ProductExtensionHelper', 'ProductVariantsHelper', 'variants', 'variantPrices', 'productFactory', 'FeeSvc',
        function($scope, $rootScope, $location, CartSvc, product, lastCatId, variantId, GlobalData, CategorySvc, $filter, $uibModal, shippingZones, Notification, ProductExtensionHelper, ProductVariantsHelper, variants, variantPrices, productFactory, FeeSvc) {
            var modalInstance;

            $scope.activeTab = 'description';
            $scope.openTab = function (tabName) {
                $scope.activeTab = tabName;
            };

            $scope.productMixins = ProductExtensionHelper.resolveMixins(product.product);
            $scope.productMixinsDefinitions = product.product.metadata.mixins;

            $scope.product = productFactory.fromProduct(product.product, product.prices, variants.length === 0);
			// $scope.selectedVariant = ProductVariantsHelper.getSelectedVariantWithFallback(variantId, variants);

            $scope.variants = variants;
			$scope.selectedVariantId = variantId;

            $scope.shippingZones = shippingZones;
            $scope.noShippingRates = true;
            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            // used by breadcrumb directive
            $scope.category = product.categories;
            $scope.breadcrumbData = angular.copy($scope.category);

            $scope.taxConfiguration = GlobalData.getCurrentTaxConfiguration();

            /*
             we need to shorten the tax label if it contains more than 60 characters, and give users the option of
             clicking a 'see more' link to view the whole label.
             */
            if ($scope.taxConfiguration && $scope.taxConfiguration.label && $scope.taxConfiguration.label.length > 60) {
                $scope.taxConfiguration.shortenedLabel = $scope.taxConfiguration.label.substring(0, 59);
                $scope.taxConfiguration.seeMoreClicked = false;
            }

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

            //input default values must be defined in controller, not html, if tied to ng-model
            $scope.productDetailQty = 1;
            $scope.buyButtonEnabled = true;

            $scope.showShippingRates = function(){

                modalInstance = $uibModal.open({
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

                var cartItem = {id:$scope.product.id};

                if(!_.isEmpty($scope.selectedVariant)){
                    cartItem.itemYrn = $scope.selectedVariant.yrn;
                }

                CartSvc.addProductToCart(cartItem, $scope.product.prices, $scope.productDetailQty, { closeCartAfterTimeout: true, opencartAfterEdit: false })
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


            function filterPricesForVariant(variantId) {
                return variantPrices.filter(function (price) {
                    var foundVariantId = price.itemYrn.split(';').pop();
                    return variantId === foundVariantId;
                });
            }

			$scope.onActiveVariantChanged = function (activeVariant) {
				if (_.isObject(activeVariant)) {
					var prices = filterPricesForVariant(activeVariant.id);
					$scope.product = productFactory.fromProductVariant(product.product, activeVariant, prices);
                    // Update the selected variant
					$scope.selectedVariant = activeVariant;
                    // The selected variant was updated by the user, check if this new select variant has a fee bound to it
                    // As this action is asynchronous, hide the fees in the front-end first
                    $scope.productFees = [];
                    FeeSvc.getFeesForItemYrn($scope.selectedVariant.yrn)
                        .then(function(productFees) {
                            $scope.productFees = productFees;
                        })
                        .catch(function() {
                            $scope.productFees = [];
                        });
				} else {
					$scope.product = productFactory.fromProduct(product.product, product.prices, false);
				}
			};

            // Helper functions to check if the currently displayed product is a base product or a product variant
            /**
             * Check if the product we are displaying is a product variant
             * @param {Array} variants - The product variants associated to the current product (might be an empty array)
             * @param {Object} selectedVariant - The currently selected variant (might be undefined)
             * @returns {Boolean} - Indicating if it is a product variant
             */
            function isProductVariant(variants, selectedVariant) {
                return Array.isArray(variants) && variants.length > 0 && typeof selectedVariant === 'object' && selectedVariant.hasOwnProperty('yrn');
            }

            /**
             * Check if the product we are displaying is a base product
             * @param {Array} variants - The product variants of the current product (might be an empty array)
             * @param {Object} product - The current product
             * @returns {Boolean} - Indicating if it is a base product
             */
            function isBaseProduct(variants, product) {
                return Array.isArray(variants) && variants.length === 0 && product.product && product.product.hasOwnProperty('yrn');
            }
            // End

            if(isProductVariant(variants, $scope.selectedVariant)) {
                // If the product is a variant, retrieve the fees associated to the product variant YRN
                FeeSvc.getFeesForItemYrn($scope.selectedVariant.yrn)
                    .then(function(productFees) {
                        $scope.productFees = productFees;
                    })
                    .catch(function() {
                        $scope.productFees = [];
                    });
            }
            else if(isBaseProduct(variants, product)) {
                // If the product is a base product, retrieve the fees for the base product YRN
                FeeSvc.getFeesForItemYrn(product.product.yrn)
                    .then(function(productFees) {
                        $scope.productFees = productFees;
                    })
                    .catch(function() {
                        $scope.productFees = [];
                    });
            }
}]);
