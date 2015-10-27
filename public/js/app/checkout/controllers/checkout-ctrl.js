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

angular.module('ds.checkout')
/**
 * This is the controller for the checkout view, which includes the order form as well as a view of the cart.
 *
 * The scope provides access to the data models "order" and "cart", as well as some properties to control display
 * of errors.
 *
 * In the checkout HTML, the "steps" are created by using nested forms which can be individually validated.
 *
 * The wizard directive defined in mobileCheckoutWizard does not come into play in full screen mode.  Required fields
 * are checked and enforced when the user indicates "submit".
 *
 * The controller also includes logic to copy the bill-to address to the ship-to address if that's what the user has indicated.
 *
 * This version assumes that payment processing and pre-validation is done through Stripe.
 *
 * While the order is processing (both Stripe validation and order API call), the submit button is disabled.
 * On success, the order confirmation page is shown.  On failure, an error message is displayed and the submit button
 * is re-enabled so that the user can make changes and resubmit if needed.
 *
 * */
    .controller('CheckoutCtrl', ['$rootScope', '$scope', '$location', '$anchorScroll', 'CheckoutSvc','cart', 'order', '$state', '$modal', 'AuthSvc', 'AccountSvc', 'AuthDialogManager', 'shippingCost', 'GlobalData',
        function ($rootScope, $scope, $location, $anchorScroll, CheckoutSvc, cart, order, $state, $modal, AuthSvc, AccountSvc, AuthDialogManager, shippingCost, GlobalData) {

            $scope.order = order;

            $scope.titles = GlobalData.getUserTitles();

            //Resolve in the ui.router state returns cart object, problem is when the user is loged in
            //Then in the configuration service the   CartSvc.refreshCartAfterLogin(account.id); is called, and
            //this method changes cart. That is the reason cart was empty on refresh
            //With this implementation we are getting the cart object from service after it is loaded
            cart = $scope.cart;

            $scope.shippingCosts = shippingCost || 0; // temporary handling of shipping cost not being set - default to zero
            $scope.currencySymbol = GlobalData.getCurrencySymbol(cart.currency);
            $scope.order.shippingCost = shippingCost.price[GlobalData.getCurrencyId()];
            $scope.user = GlobalData.user;
            $scope.addresses = [];

            var shouldAutoUpdateName = true;

            var Wiz = function () {
                this.step1Done = false;
                this.step2Done = false;
                this.step3Done = false;
                this.shipToSameAsBillTo = true;
                // credit card expiration year drop-down - go 10 years out
                this.years = [];
                for (var year = new Date().getFullYear(), i = year, stop = year + 10; i < stop; i++) {
                    this.years.push(i);
                }
                this.months = ['01','02','03','04','05','06','07','08','09','10','11','12'];

            };

            $scope.wiz = new Wiz();

            var selectedBillingAddress, selectedShippingAddress;
            var addressModalInstance;

            $scope.order.account = {};

            $scope.shipToSameAsBillTo = true;

            window.scrollTo(0, 0);

            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {
                $scope.cart = eveObj.cart;
                $scope.currencySymbol = GlobalData.getCurrencySymbol($scope.cart.currency);
            });

            $scope.$on('$destroy', unbind);

            var getDefaultAddress = function (addresses) {
                return _.find(addresses, function (addr) {
                    return addr.isDefault;
                });
            };

            var populateBillTo = function(address){
                $scope.order.billTo.id = address.id;
                $scope.order.billTo.contactName = address.contactName;
                $scope.order.billTo.companyName = address.companyName;
                $scope.order.billTo.address1 = address.street;
                $scope.order.billTo.address2 = address.streetAppendix;

                //checkout requires 2 character country codes
                if (address.country === 'USA') {
                    address.country = 'US';
                }
                $scope.order.billTo.country = address.country;
                $scope.order.billTo.city = address.city;
                $scope.order.billTo.state = address.state;
                $scope.order.billTo.zip = address.zipCode;
                $scope.order.billTo.contactPhone = address.contactPhone;

                $scope.$emit('localizedAddress:updated', address.country, 'billing');
            };

            var getAddresses = function() {
                if(AuthSvc.isAuthenticated()) {
                    AccountSvc.getAddresses().then(function (response) {
                        if (response.length) {
                            shouldAutoUpdateName = false;
                            var defaultAddress = getDefaultAddress(response);
                            $scope.addresses = response;
                            selectedBillingAddress = defaultAddress;
                            selectedShippingAddress = defaultAddress;
                            populateBillTo(defaultAddress);
                        }
                        /*
                         populate name if the user has no default address but does have a name saved to the account
                         */
                        else if ($scope.order.account) {
                            var fullName = '';
                            if ($scope.order.account.firstName) {
                                shouldAutoUpdateName = false;
                                fullName = fullName + $scope.order.account.firstName + ' ';
                            }
                            if ($scope.order.account.middleName) {
                                fullName = fullName + $scope.order.account.middleName + ' ';
                            }
                            if ($scope.order.account.lastName) {
                                fullName = fullName + $scope.order.account.lastName;
                            }
                            $scope.order.billTo.contactName = fullName;
                        }
                    });
                }
            };

            var getAccount = function() {
                AccountSvc.account().then(function(account) {
                    $scope.order.account.email = account.contactEmail;
                    $scope.order.account.title = account.title;
                    $scope.order.account.firstName = account.firstName;
                    $scope.order.account.middleName = account.middleName;
                    $scope.order.account.lastName = account.lastName;
                });
            };

            $scope.$on('user:signedin', function() {
                getAccount();
                getAddresses();
            });

            if (GlobalData.user.isAuthenticated) {
                getAccount();
            }
            getAddresses();


            $scope.badEmailAddress = false;

            // if this flag is enabled, missing required fields will be shown in error
            $scope.showPristineErrors = false;

            // Message shown around submit button to inform the user of validation and processing status
            $scope.message = null;

            $scope.submitIsDisabled = false;

            // Configure modal "spinner" to block input during checkout processing
            var ssClass = 'order-processing-dialog',
                modal = {
                    instance: null,
                    spinner: null,
                    open: function(configuration) {
                        var self = this;
                        this.spinner = this.spinner || new Spinner(configuration).spin();
                        this.instance = $modal.open(configuration);
                        this.instance.opened.then(function() {
                            setTimeout(function() {
                                $('.' + ssClass + ' .spinner').append(self.spinner.el);
                            }, 10);
                        });
                    },
                    close: function() {
                        this.spinner.stop();
                        this.instance.dismiss('cancel');
                    }
                };

            /** Mark mobile wizard step 1 "done" - bill-to address information has been entered.*/
            $scope.billToDone = function (billToFormValid, form) {
                $scope.$broadcast('submitting:form', form);
                if (billToFormValid) {
                    $scope.wiz.step1Done = true;
                    $scope.showPristineErrors = false;
                    // guarantee correct scrolling for mobile
                    $location.hash('step2');
                    $anchorScroll();
                } else {
                    $scope.showPristineErrors = true;
                }
            };

            /** Mark mobile wizard step 2 "done" - the ship-to address has been entered.*/
            $scope.shipToDone = function (shipToFormValid, form) {
                $scope.$broadcast('submitting:form', form);
                // if the ship to form fields are hidden, angular considers them empty - work around that:
                if (shipToFormValid || $scope.wiz.shipToSameAsBillTo) {
                    $scope.wiz.step2Done = true;
                    $scope.showPristineErrors = false;
                    // guarantee correct scrolling for mobile
                    $location.hash('step3');
                    $anchorScroll();
                } else {
                    $scope.showPristineErrors = true;
                }
            };

            /** Mark mobile wizard step 3 "done" - the payment information has been entered.*/
            $scope.paymentDone = function (paymentFormValid, form) {
                $scope.$broadcast('submitting:form', form);
                if (paymentFormValid) {
                    $scope.wiz.step3Done = true;
                    // guarantee correct scrolling for mobile
                    $location.hash('step4');
                    $anchorScroll();
                } else {
                    $scope.showPristineErrors = true;
                }

            };

            /** Mobile wizard - edit bill-do and mark subsequent steps as undone.*/
            $scope.editBillTo = function () {
                $scope.wiz.step1Done = false;
                $scope.wiz.step2Done = false;
                $scope.wiz.step3Done = false;
            };

            /** Mobile wizard - edit ship-to and mark subsequent steps as undone.*/
            $scope.editShipTo = function () {
                $scope.wiz.step2Done = false;
                $scope.wiz.step3Done = false;
            };

            /** Mobile wizard - edit payment information.*/
            $scope.editPayment = function () {
                $scope.wiz.step3Done = false;
            };

            /** Copy bill-to information to the ship-to properties.*/
            var setShipToSameAsBillTo = function () {
                angular.copy($scope.order.billTo, $scope.order.shipTo);
                selectedShippingAddress = $scope.order.shipTo;
                $scope.$emit('localizedAddress:updated', selectedShippingAddress.country, 'shipping');
            };

            var clearShipTo = function(){
                selectedShippingAddress = {};
                $scope.order.shipTo = {};
                if ($scope.order.billTo.country) {
                    $scope.order.shipTo.country = $scope.order.billTo.country;
                }
                $scope.shipToSameAsBillTo = false;
            };

            $scope.toggleShipToSameAsBillTo = function(){
                if($scope.shipToSameAsBillTo){
                    setShipToSameAsBillTo();
                } else {
                    clearShipTo();
                }
            };

            /** Reset any error messaging related to the credit card expiration date.*/
            $scope.resetExpDateErrors = function () {
                $scope.checkoutForm.paymentForm.expDateMsg = '';
                $scope.checkoutForm.paymentForm.expMonth.$setValidity('validation', true);
                $scope.checkoutForm.paymentForm.expYear.$setValidity('validation', true);
                $scope.message = '';
            };

            /** Reset any error flagging as it pertains to a particular form field.
             * @param field form field name
             */
            $scope.resetErrorMsg = function (field) {
                field.$setValidity('validation', true);
                field.msg = '';
                $scope.message = '';
            };


            /** Returns true if the error indicates a Stripe validation error pertaining to a credit card information input field.
             * @param error */
            function isFieldAttributableStripeError(error) {
                return error.code.indexOf('number') !== -1 ||
                    error.code.indexOf('month') !== -1 ||
                    error.code.indexOf('year') !== -1 ||
                    error.code.indexOf('cvc') !== -1;
            }

            /** Assigns an error message to a particular credit card information input field.
             * @param error message
             */
            function attributeStripeFieldError(error) {
                if (error.code.indexOf('number') !== -1) {
                    $scope.checkoutForm.paymentForm.ccNumber.$setValidity('validation', false);
                    $scope.checkoutForm.paymentForm.ccNumber.msg = error.message;
                } else if (error.code.indexOf('month') !== -1 || error.code.indexOf('year') !== -1) {
                    $scope.checkoutForm.paymentForm.expMonth.$setValidity('validation', false);
                    $scope.checkoutForm.paymentForm.expYear.$setValidity('validation', false);
                    $scope.checkoutForm.paymentForm.expDateMsg = 'INVALID_EXPIRATION_DATE';

                } else if (error.code.indexOf('cvc') !== -1) {
                    $scope.checkoutForm.paymentForm.cvc.$setValidity('validation', false);
                    $scope.checkoutForm.paymentForm.cvc.msg = error.message;
                }
            }

            /** Handles display and state following a Stripe validation error.
             * @param error message
             */
            function onStripeValidationFailure(error) {

                var msg = error.message;
                if (error.type === 'card_error') {
                    if (error.code && isFieldAttributableStripeError(error)) {
                        msg = 'PLEASE_CORRECT_ERRORS';
                        attributeStripeFieldError(error);
                    }
                }
                else if (error.type === 'payment_token_error') {
                    msg = 'Server error - missing payment configuration key.  Please try again later.';
                } else {
                    console.error('Stripe validation failed: ' + JSON.stringify(error));
                    msg = 'Not able to pre-validate payment at this time.';
                }
                $scope.message = msg;
                $scope.submitIsDisabled = false;
                if ($scope.$root.$$phase !== '$apply' && $scope.$root.$$phase !== '$digest') {
                    $scope.$apply();
                }
                modal.close();
            }


            /** Show error message after failed checkout, re-enable the submit button and reset any wait cursor/splash screen.
             * @param error message*/
            function onCheckoutFailure (error) {

                $scope.message = error;
                $scope.submitIsDisabled = false;
                modal.close();
            }

            /** Advances the application state to the confirmation page. */
            var checkoutSuccessHandler = function goToConfirmationPage(order) {

                var piwikOrderDetails = {
                    orderId: order.orderId,
                    checkoutId: order.checkoutId,
                    cart: $scope.cart
                };
                /**
                 * It is possible for a checkout to go through, but the order placement itself will fail.  If this
                 * is the case we still want to show the user the confirmation page, but instead of displaying
                 * order details, it will let the user know that the checkout passed but the order was not placed.
                 */
                var entity = order.orderId ? 'order' : 'checkout';
                var id = order.orderId ? order.orderId : order.checkoutId;
                //Send data to piwik
                $rootScope.$emit('order:placed', piwikOrderDetails);

                //Reset cart
                CheckoutSvc.resetCart();

                modal.close();
                $state.go('base.confirmation', {id: id, entity: entity});
            };

            /** Handles a failed "checkout"/order submission event. */
            var checkoutErrorHandler = function (error) {
                if (error.type === CheckoutSvc.ERROR_TYPES.order) {
                    onCheckoutFailure(error.error);
                } else if (error.type === CheckoutSvc.ERROR_TYPES.stripe) {
                    onStripeValidationFailure(error.error);
                }
            };

            /** Validates that the form is in a valid state, and if it is,
             * delegates to the CheckoutSvc to process the order.  If the checkout is successful,
             * the user will be routed to the confirmation page.  If unsuccessful, errors will be displayed to the user.
             * @param formValid  flag indicating whether or not the form is in valid state.
             * @param form name - used to raise event for inline-error-input directive
             */
            $scope.placeOrder = function (formValid, form) {
                $scope.message = null;
                $scope.$broadcast('submitting:form', form);
                if (formValid) {
                    modal.open({
                        templateUrl: 'js/app/checkout/templates/order-processing-splash-screen.html',
                        windowClass: ssClass,
                        top: '60%'
                    });

                    $scope.submitIsDisabled = true;
                    if ($scope.shipToSameAsBillTo) {
                        setShipToSameAsBillTo();
                    }
                    $scope.order.cart = $scope.cart;

                    CheckoutSvc.checkout($scope.order).then(checkoutSuccessHandler, checkoutErrorHandler);

                } else {
                    $scope.showPristineErrors = true;
                    $scope.message = 'PLEASE_CORRECT_ERRORS';
                    // Important debug for dynamic form validation.
                    // console.log('BILLTO:',$scope.billToForm.$error.required);
                    // console.log('SHIPTO:',$scope.shipToForm.$error.required);
                }
            };

            $scope.selectAddress = function(address, target) {
                if (target === $scope.order.billTo) {
                    selectedBillingAddress = address;
                    $scope.$emit('localizedAddress:updated', address.country, 'billing');
                }
                else if (target === $scope.order.shipTo) {
                    selectedShippingAddress = address;
                    $scope.$emit('localizedAddress:updated', address.country, 'shipping');
                }
                addressModalInstance.close();

                target.id = address.id;
                target.contactName = address.contactName;
                target.companyName = address.companyName;
                target.address1 = address.street;
                target.address2 = address.streetAppendix;
                target.country = address.country;
                target.city = address.city;
                target.state = address.state;
                target.zip = address.zipCode;
                target.contactPhone = address.contactPhone;

                if(target === $scope.order.billTo && ($scope.shipToSameAsBillTo === true || _.isEmpty($scope.order.shipTo))){
                    setShipToSameAsBillTo();
                }
                $scope.shipToSameAsBillTo = _.isEqual($scope.order.billTo, $scope.order.shipTo);
            };

            $scope.openAddressDialog = function(target) {
                addressModalInstance = $modal.open({
                    templateUrl: './js/app/account/templates/addresses-dialog.html',
                    windowClass: 'addressBookModal',
                    scope: $scope,
                    resolve: {
                        addresses: ['AccountSvc', function(AccountSvc) {
                            return AccountSvc.getAddresses().then(function() {
                                $scope.isDialog = true;
                                $scope.showAddressDefault = 6;
                                $scope.showAddressFilter = $scope.showAddressDefault;
                                $scope.target = target;
                            });
                        }]
                    }
                  });
            };

            $scope.closeAddressDialog = function () {
                addressModalInstance.close();
            };

            $scope.$on('goToStep2', function(){
                if( $scope.wiz.step1Done &&  $scope.wiz.step2Done){
                    $scope.wiz.step2Done = false;
                    $scope.wiz.step3Done = false;
                    $location.hash('step2');
                    $anchorScroll();
                }
            });

            $scope.updateAddressName = function () {
                $scope.$broadcast('myDetails:change', $scope.billToForm);
                if (shouldAutoUpdateName) {
                    var fullName = '';
                    if ($scope.order.account.firstName) {
                        fullName = fullName + $scope.order.account.firstName + ' ';
                    }
                    if ($scope.order.account.middleName) {
                        fullName = fullName + $scope.order.account.middleName + ' ';
                    }
                    if ($scope.order.account.lastName) {
                        fullName = fullName + $scope.order.account.lastName;
                    }

                    $scope.order.billTo.contactName = fullName;
                }
            };


        }]);
