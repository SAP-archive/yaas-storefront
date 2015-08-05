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

        $scope.accountSuccess = false;
        $scope.orderInfo = {};
        $scope.orderInfo.orderId = $stateParams.orderId;
        $scope.isAuthenticated = isAuthenticated;
        $scope.summaryRowClass = '';
        window.scrollTo(0, 0);
       

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
            
            var qSize = details.entries.length; 
            var alignClass = ''
            if( qSize === 1)
            {
                alignClass = 'col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4';
            }else{
                //handle 33% displays
                var calc33 = Math.floor(parseInt(((qSize*.33) %1).toFixed(1).split('.')[1], 10)/3);
                switch(calc33)
                {
                    case 0:
                        alignClass = 'col-lg-4 col-lg-offset-8 col-md-4 col-md-offset-8';
                    break;
                    case 1:
                        alignClass = 'col-lg-4 col-md-4';
                    break;
                    case 2:
                        alignClass = 'col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4';
                    break;
                }
            }
            
            $scope.summaryRowClass = alignClass;
            

            $scope.currencySymbol = GlobalData.getCurrencySymbol(details.currency);

            var unbindConfirmAccount = $rootScope.$on('confirmation:account', function(){
                // show success panel
                window.scrollTo(0, 0);
                $scope.accountSuccess = true;
                $scope.isAuthenticated = true;
            });
            $scope.$on('$destroy', unbindConfirmAccount);


        });

    }]);