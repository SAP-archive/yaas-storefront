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


angular.module('ds.confirmation')
    /** Controls the order confirmation page. */
    .controller('ConfirmationCtrl', ['$scope',  '$stateParams', 'OrderDetailSvc', 'ProductSvc', 'GlobalData', 'isAuthenticated', '$rootScope', function
        ($scope, $stateParams, OrderDetailSvc, ProductSvc,  GlobalData, isAuthenticated, $rootScope) {

        $scope.entity = $stateParams.entity;
        $scope.accountSuccess = false;
        if ($scope.entity === 'order') {
            $scope.orderInfo = {};
            $scope.orderInfo.orderId = $stateParams.id;
        } else if ($scope.entity === 'checkout') {
            /*
             else is triggered when the checkout was successful but the order placement failed
             */
            $scope.checkoutInfo = {};
            $scope.checkoutInfo.checkoutId = $stateParams.id;
        }
        $scope.isAuthenticated = isAuthenticated;
        window.scrollTo(0, 0);

        /*
         TODO: need an actual implementation
         */
        $scope.questionsContactInfo = '(888) 555-1222';
       
        if ($scope.entity === 'order') {
            /* OrderDetails are retrieved on controller instantiation, rather than being injected
            * through UI router.  This allows us to display the page immediately while filling in the details as they become
            * available. It's a visual/psychological clue that the order processing success is being made.
            *
            * @param orderId used to retrieve order details for the confirmation
            */
            OrderDetailSvc.getFormattedConfirmationDetails($scope.orderInfo.orderId).then(function(details){
                $scope.confirmationDetails = details;

                var amount = details.entries.map(function(entry){
                   return entry.amount;
                });
                $scope.confirmationDetails.itemCount = amount.reduce(function (total, count){
                    return total+count;
                });

                $scope.currencySymbol = GlobalData.getCurrencySymbol(details.currency);

            });
        }

            var unbindConfirmAccount = $rootScope.$on('confirmation:account', function(){
            // show success panel
            window.scrollTo(0, 0);
            $scope.accountSuccess = true;
            $scope.isAuthenticated = true;
        });

        $scope.$on('$destroy', unbindConfirmAccount);

    }]);