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
    .controller('CheckoutCtrl', [ '$scope', '$rootScope', 'CartSvc', 'OrderSvc', function ($scope, $rootScope, CartSvc, OrderSvc) {

        $rootScope.showCart = false;

        $scope.badEmailAddress = false;
        $scope.showPristineErrors = false;


        var Wiz = function(){
            this.step1Done = false;
            this.step2Done = false;
            this.step3Done = false;
            this.shipToSameAsBillTo = true;
        };

        var Order = function(){
            this.shipTo = {};
            this.billTo = {};
            this.billTo.country = 'USA';
            this.shippingCost = 3; // hard-coded for now
        };

        $scope.wiz = new Wiz();
        $scope.order = new Order();


        $scope.billToDone = function (billToFormValid) {
            if(billToFormValid) {
                $scope.wiz.step1Done = true;
                $scope.showPristineErrors = false;
                if($scope.wiz.shipToSameAsBillTo){
                    $scope.setShipToSameAsBillTo();
                }
            } else {
                $scope.showPristineErrors = true;
            }
        };

        $scope.shipToDone = function (shipToFormValid) {
            // if the ship to form fields are hidden, angular considers them empty - work around that:
            if(shipToFormValid || $scope.wiz.shipToSameAsBillTo) {
                $scope.wiz.step2Done = true;
                $scope.showPristineErrors = false;
            } else {
                $scope.showPristineErrors = true;
            }
        };

        $scope.paymentDone = function (){
             $scope.wiz.step3Done = true;
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

        $scope.emailBlurred = function (isValid) {
            if (isValid) {
                $scope.badEmailAddress = false;
            }
            else {
                $scope.badEmailAddress = true;
            }
        };


        $scope.setShipToSameAsBillTo = function (){
            angular.copy($scope.order.billTo, $scope.order.shipTo);
            //$scope.shipToForm.firstName.$setViewValue('Bob');
            //var errors = $scope.shipToForm.$error;
        };

        $scope.placeOrder = function (formValid) {
            if (formValid) {
                // do again to ensure copy in full-screen mode
                if ($scope.wiz.shipToSameAsBillTo) {
                    $scope.setShipToSameAsBillTo();
                }
                OrderSvc.createOrder(CartSvc.getCart());
            }  else {
                $scope.showPristineErrors = true;
            }
        };

    }]);
