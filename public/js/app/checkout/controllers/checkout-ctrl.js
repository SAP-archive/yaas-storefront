/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.checkout')

    .controller('CheckoutCtrl', [ '$scope', '$location', '$anchorScroll', 'CheckoutSvc', 'cart', 'order',
        function ($scope, $location, $anchorScroll, CheckoutSvc, cart, order) {


        $scope.order = order;
        $scope.cart = cart;

        $scope.badEmailAddress = false;
        $scope.showPristineErrors = false;
        $scope.message = null;


        var Wiz = function(){
            this.step1Done = false;
            this.step2Done = false;
            this.step3Done = false;
            this.shipToSameAsBillTo = true;
            this.years = [];
            for (var year = new Date().getFullYear(), i = year, stop = year+10; i< stop; i++){
                this.years.push(i);
            }
        };

        $scope.wiz = new Wiz();

        $scope.billToDone = function (billToFormValid, form) {
            $scope.$broadcast('submitting:form', form);
            if(billToFormValid) {
                $scope.wiz.step1Done = true;
                $scope.showPristineErrors = false;
                if($scope.wiz.shipToSameAsBillTo){
                    $scope.setShipToSameAsBillTo();
                }

                // guarantee correct scrolling for mobile
                $location.hash('step2');
                $anchorScroll();
            } else {
                $scope.showPristineErrors = true;
            }
        };

        $scope.shipToDone = function (shipToFormValid, form) {
            $scope.$broadcast('submitting:form', form);
            // if the ship to form fields are hidden, angular considers them empty - work around that:
            if(shipToFormValid || $scope.wiz.shipToSameAsBillTo) {
                $scope.wiz.step2Done = true;
                $scope.showPristineErrors = false;
                // guarantee correct scrolling for mobile
                $location.hash('step3');
                $anchorScroll();
            } else {
                $scope.showPristineErrors = true;
            }
        };

        $scope.paymentDone = function (paymentFormValid, form){
            $scope.$broadcast('submitting:form', form);
            if(paymentFormValid) {
                $scope.wiz.step3Done = true;
                // guarantee correct scrolling for mobile
                $location.hash('step4');
                $anchorScroll();
            } else {
                $scope.showPristineErrors = true;
            }

        };

        $scope.editBillTo = function() {
            $scope.wiz.step1Done = false;
            $scope.wiz.step2Done = false;
            $scope.wiz.step3Done = false;
        };

        $scope.editShipTo = function() {
            $scope.wiz.step2Done = false;
            $scope.wiz.step3Done = false;
        };

        $scope.editPayment = function() {
            $scope.wiz.step3Done = false;
        };

        $scope.setShipToSameAsBillTo = function (){
            angular.copy($scope.order.billTo, $scope.order.shipTo);
        };

        function onCheckoutFailure(error) {
            $scope.message = error;
            $scope.$apply();
        }

        function isFieldAttributableStripeError(error) {
           return error.code.indexOf('number') !== -1 ||
                error.code.indexOf('month') !== -1 ||
                error.code.indexOf('year') !== -1 ||
                error.code.indexOf('cvc') !== -1;
        }

        function attributeStripeFieldError(error) {
            if(error.code.indexOf('number') !== -1) {
                $scope.checkoutForm.paymentForm.ccNumber.$setValidity('validation', false);
                $scope.checkoutForm.paymentForm.ccNumber.msg = error.message;
            } else if(error.code.indexOf('month') !== -1 || error.code.indexOf('year') !== -1) {
                $scope.checkoutForm.paymentForm.expMonth.$setValidity('validation', false);
                $scope.checkoutForm.paymentForm.expYear.$setValidity('validation', false);
                $scope.checkoutForm.paymentForm.expMonth.msg = 'Expiration date invalid - please validate the month.';
                $scope.checkoutForm.paymentForm.expYear.msg = 'Expiration date invalid - please validate the year.';

            } else if (error.code.indexOf('cvc') !== -1 ){
                $scope.checkoutForm.paymentForm.cvc.$setValidity('validation', false);
                $scope.checkoutForm.paymentForm.cvc.msg = error.message;
            }
        }
        function onStripeValidationFailure(error) {
            $scope.message = error.message;

            if(error.type === 'card_error'){
                $scope.editPayment();
                if (error.code && isFieldAttributableStripeError(error)) {
                    $scope.message = 'Please correct the errors above before placing your order.';
                    attributeStripeFieldError(error);
                }
            }
            $scope.$apply();
        }

        $scope.placeOrder = function (formValid, form) {
            $scope.message = null;
            $scope.$broadcast('submitting:form', form);
            if (formValid) {
                if ($scope.wiz.shipToSameAsBillTo) {
                    $scope.setShipToSameAsBillTo();
                }
                $scope.order.cart = $scope.cart;
                CheckoutSvc.checkout($scope.order, onStripeValidationFailure, onCheckoutFailure);
            }  else {
                $scope.showPristineErrors = true;
            }
        };


    }]);
