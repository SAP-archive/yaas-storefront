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
    .controller('ProductDetailCtrl', ['$scope', '$rootScope', 'CartSvc', 'product', 'lastCatId', 'settings', 'GlobalData', 'CategorySvc','$filter', '$modal', 'shippingZones', 'Notification', 'CommittedMediaFilter', 'ProductExtensionHelper', 'variants', 'ProductDetailHelper',
        function($scope, $rootScope, CartSvc, product, lastCatId, settings, GlobalData, CategorySvc, $filter, $modal, shippingZones, Notification, CommittedMediaFilter, ProductExtensionHelper, variants, ProductDetailHelper) {
            var modalInstance;
                        
            $scope.activeTab = 'description';
            $scope.openTab = function (tabName) {
                $scope.activeTab = tabName;
            };
            
            $scope.productMixins = ProductExtensionHelper.resolveMixins(product.product);
            
            $scope.product = product;
            $scope.media = product.product.media;
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

            // product options (variants)
            $scope.hasVariants = variants.length > 0;

            $scope.options = ProductDetailHelper.prepareOptions(variants);
            $scope.optionsSelected = [];

            function getIdsOfMatchingVariants(attributesSelected) {
                return attributesSelected.length === 0 ?
                    ProductDetailHelper.getIdsOfAllVariants(variants) :
                    ProductDetailHelper.getIdsOfMatchingVariants(attributesSelected);
            }

            function getVariant(varaintId) {
                return _.find(variants, function (v) { return v.id === varaintId; });
            }

            $scope.resolveActiveVariantAndUpdateOptions = function () {
                var attributesSelected = ProductDetailHelper.getSelectedAttributes($scope.optionsSelected);
                var idsOfMatchingVariants = getIdsOfMatchingVariants(attributesSelected);
                
                $scope.options = ProductDetailHelper.updateOptions($scope.options, idsOfMatchingVariants);

                // set active variant
                if (attributesSelected.length === $scope.options.length) {
                    $scope.activeVariant = getVariant(idsOfMatchingVariants[0]);
                    // tmp: test purpose
                    console.log($scope.activeVariant);
                } else {
                    $scope.activeVariant = undefined;
                }
                
                // update media
                if (_.isObject($scope.activeVariant) && $scope.activeVariant.media.length > 0) {
                    $scope.media = $scope.activeVariant.media;
                } else {
                    $scope.media = $scope.product.product.media;
                }
            };

            $scope.omitSelectionAndUpdateOptions = function (omittedIndex) {
                var omitted = _.union([], $scope.optionsSelected);
                omitted[omittedIndex] = null;

                var attributesSelected = ProductDetailHelper.getSelectedAttributes(omitted);
                var idsOfMatchingVariants = getIdsOfMatchingVariants(attributesSelected);
                
                $scope.options = ProductDetailHelper.updateOptions($scope.options, idsOfMatchingVariants);
            };
}]);
