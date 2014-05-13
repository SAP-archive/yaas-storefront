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
    .controller('CheckoutCtrl', [ '$scope', '$rootScope', '$location', '$anchorScroll', 'CartSvc', 'OrderSvc',  'StripeJS',
        function ($scope, $rootScope, $location, $anchorScroll, CartSvc, OrderSvc, StripeJS) {

        $rootScope.showCart = false;

        $scope.badEmailAddress = false;
        $scope.showPristineErrors = false;

        var Wiz = function(){
            this.step1Done = false;
            this.step2Done = false;
            this.step3Done = false;
            this.shipToSameAsBillTo = true;
        };

            var CreditCard = function () {
                this.number = null;
                this.cvc = null;
                this.expMonth = null;
                this.expYear = null;

            };

        var Order = function(){
            this.shipTo = {};
            this.billTo = {};
            this.billTo.country = 'USA';
            this.shippingCost = 3; // hard-coded for now
            this.paymentMethod = 'paypal';
            this.ccToken = null;
            this.creditCard = new CreditCard();
        };



        $scope.wiz = new Wiz();
        $scope.order = new Order();

        $scope.logPayment = function(){
            console.log('payment is '+$scope.order.paymentMethod);
        };

        $scope.generateCCToken = function(ccForm) {
            var stripeData = {};
            stripeData.number = ccForm.number;
            stripeData.exp_month = ccForm.exp_month;
            stripeData.exp_year = ccForm.exp_year;
            stripeData.cvc = ccForm.cvc;
            Stripe.setPublishableKey('pk_test_KQWQGIbDxdKyIJtpasGbSgCz');
            Stripe.card.createToken(stripeData, function(status, response){
                console.log('status is '+status);
                console.log('response is: ');
                console.log(response);
            });

        };

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

        $scope.paymentDone = function (){
             $scope.wiz.step3Done = true;
            // guarantee correct scrolling for mobile
            $location.hash('step4');
            $anchorScroll();
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

        $scope.emailBlurred = function (isValid, isDirty) {
            if (isValid) {
                $scope.badEmailAddress = false;
            }
            else if (isDirty) {
                $scope.badEmailAddress = true;
            }
        };

        $scope.setShipToSameAsBillTo = function (){
            angular.copy($scope.order.billTo, $scope.order.shipTo);
        };

        $scope.placeOrder = function (formValid, form) {
            $scope.$broadcast('submitting:form', form.$name);
            if (formValid) {

                $scope.generateCCToken(form.paymentForm);
                // do again to ensure copy in full-screen mode
                if ($scope.wiz.shipToSameAsBillTo) {
                    $scope.setShipToSameAsBillTo();
                }
                OrderSvc.createOrder(CartSvc.getCart());
                CartSvc.emptyCart();
            }  else {
                $scope.showPristineErrors = true;
            }
        };

    }]);
