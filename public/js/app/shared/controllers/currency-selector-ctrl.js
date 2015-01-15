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

angular.module('ds.shared')
    .controller('currencySelectorController',[ '$rootScope', '$scope', '$q', 'GlobalData',
        function($rootScope, $scope, $q, GlobalData){

            $scope.currencies = GlobalData.getAvailableCurrencies();
            $scope.currency = { selected: GlobalData.getCurrency() };

            $scope.$watch('currency.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.id) {
                    GlobalData.setCurrency(newValue.id);
                }
            });

            // handling currency updates initiated from outside this controller
            var unbindCurrency = $rootScope.$on('currency:updated', function (eve, eveObj) {
                if(eveObj.currencyId !== $scope.currency.id){
                    $scope.currency.selected = GlobalData.getCurrencyById(eveObj.currencyId);
                }
                
//                $scope.$apply();
            });
            
            $scope.updateCurrency = function(newCurrency){
                $scope.currency = { selected: newCurrency };
            };

            $scope.$on('$destroy', unbindCurrency);
            
        }
    ]);
