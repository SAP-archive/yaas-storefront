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


        var Wiz = function(){
            this.step1Done = false;
            this.step2Done = false;
            this.step3Done = false;
            this.shipToSameAsBillTo = true;
        };

        var Order = function(){
            this.shipTo = {};
            this.billTo = {};
        };

        $scope.wiz = new Wiz();
        $scope.order = new Order();


        $scope.billToDone = function () {
            $scope.wiz.step1Done = true;
            if($scope.wiz.shipToSameAsBillTo){
                $scope.setShipToSameAsBillTo(true);
            }
        };

        $scope.shipToDone = function () {
            $scope.wiz.step2Done = true;
        };

        $scope.paymentDone = function (){
            $scope.wiz.step3Done = true;
        };

        $scope.editBillTo = function() {
            $scope.wiz.step1Done = false;
            $scope.wiz.step2Done = false;
        };

        $scope.editShipTo = function() {
            $scope.wiz.step2Done = false;
            $scope.wiz.step3Done = false;
        };

        $scope.editPayment = function() {
            $scope.wiz.step3Done = false;
        };

        $scope.setShipToSameAsBillTo = function (same){
            if(same) {
                angular.copy($scope.order.billTo, $scope.order.shipTo);
            }
        };

        $scope.placeOrder = function () {
              OrderSvc.createOrder(CartSvc.getCart());
        };

    }]);
