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

angular.module('ds.cart')
    /** This controller manages the interactions of the cart view. The controller is listening to the 'cart:udpated' event
     * and will refresh the scope's cart instance when the event is received. */
    .controller('CartCtrl', ['$scope', '$state', '$rootScope', 'CartSvc', 'GlobalData', 'settings', 'AuthSvc', 'AuthDialogManager', 'FeeSvc',
            function($scope, $state, $rootScope, CartSvc, GlobalData, settings, AuthSvc, AuthDialogManager, FeeSvc) {

                // Helper function to retrieve fees for the current cart
                // If no cart data is provided, the current cart will be retrieved
                function getFeesForProductsInCart(cart) {

                    // Helper function to build a map of fees information for productYrns
                    // This fees/products map will be exposed to the controller $scope
                    function buildFeesInformationForProductYrnsMap(cart) {
                        if (cart.items && Array.isArray(cart.items)) {
                            // This array will hold the list of productYrns of the current cart
                            var cartItemsYrn = [];
                            cart.items.forEach(function (item) {
                                cartItemsYrn.push(item.itemYrn);
                            });
                            // Get the fees for the list of productYrns
                            FeeSvc.getFeesForItemYrnList(cartItemsYrn).then(function (feesForProductsMap) {
                                $scope.feesInformationForProductsYrnMap = feesForProductsMap;
                            });
                        }
                    }

                    if(arguments.length === 0) {
                        // Initial call (no cart data provided)
                        CartSvc.getCart().then(function (cartData) {
                            buildFeesInformationForProductYrnsMap(cartData);
                        });
                    }
                    else if (arguments.length === 1) {
                        // On cart update (cart data provided)
                        buildFeesInformationForProductYrnsMap(cart);
                    }
                }

                // Get fees for products in cart (initial call without cart data)
                getFeesForProductsInCart();

                $scope.cart = CartSvc.getLocalCart();

                $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);

                $scope.showTaxEstimation = false;

                $scope.taxConfiguration = GlobalData.getCurrentTaxConfiguration();

                $scope.couponCollapsed = true;
                $scope.taxType = GlobalData.getTaxType();

                $scope.calculateTax = CartSvc.getCalculateTax();
                $scope.taxableCountries = GlobalData.getTaxableCountries();

                var unbind = $rootScope.$on('cart:updated', function(eve, eveObj){
                    $scope.cart = eveObj.cart;
                    $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);
                    $scope.taxType = GlobalData.getTaxType();
                    $scope.taxConfiguration = GlobalData.getCurrentTaxConfiguration();
                    $scope.calculateTax = CartSvc.getCalculateTax();

                    // Retrieve fees for the updated cart
                    getFeesForProductsInCart($scope.cart);
                });


                $scope.$on('$destroy', unbind);

                /** Remove a product from the cart.
                 * @param cart item id
                 * */
                $scope.removeProductFromCart = function (itemId) {
                    CartSvc.removeProductFromCart(itemId);
                };

                /** Toggles the "show cart view" property.
                 */
                $scope.toggleCart = function (){
                    $rootScope.showCart = false;
                };

                /**
                 *  Issues an "update cart" call to the service or removes the item if the quantity is undefined or zero.
                 */
                $scope.updateCartItemQty = function (item, itemQty, config) {
                    if (itemQty > 0) {
                        CartSvc.updateCartItemQty(item, itemQty, config);
                    }
                    else if (!itemQty || itemQty === 0) {
                        CartSvc.removeProductFromCart(item.id);
                    }
                };

                $scope.toCheckoutDetails = function () {
                    $scope.keepCartOpen();
                    if (!AuthSvc.isAuthenticated()) {
                        var dlg = AuthDialogManager.open({windowClass:'mobileLoginModal'}, {}, {}, true);

                        dlg.then(function(){
                                if (AuthSvc.isAuthenticated()) {
                                    $state.go('base.checkout.details');
                                }
                            },
                            function(){

                            }
                        );
                    }
                    else {
                        $state.go('base.checkout.details');
                    }
                };

                $scope.applyTax = function () {
                    $scope.taxEstimationError = false;
                    if ($scope.calculateTax.countryCode !== '' && $scope.calculateTax.zipCode !== '') {
                        //Save countryCode and zipCode in service
                        CartSvc.setCalculateTax($scope.calculateTax.zipCode, $scope.calculateTax.countryCode, $scope.cart.id);

                        $scope.calculateTax.taxCalculationApplied = true;

                    }
                    else {
                        //Show error message
                        $scope.calculateTax.taxCalculationApplied = false;
                        $scope.showTaxEstimation = false;
                        $scope.taxEstimationError = true;
                    }

                };

    }]);