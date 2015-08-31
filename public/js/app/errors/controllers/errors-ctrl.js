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

angular.module('ds.errors', [])
    /**
     *  Dynamic error display.
     */
    .controller('ErrorsCtrl', ['$scope', '$state', '$stateParams', '$translate',
		function( $scope, $state, $stateParams, $translate ) {

			var errorType = '';

			// if errorId is valid, then postfix dynamic message, else always generic message.
			if($stateParams.errorId === '401' || $stateParams.errorId === '404'){
				errorType = '_' + $stateParams.errorId;
			}

			$translate('ERROR_TITLE' + errorType).then(function(value){
				$scope.errorTitle = value;
			});
			$translate('ERROR_MESSAGE' + errorType).then(function(value){
				$scope.errorMessage = value;
			});
			$translate('ERROR_REDIRECT').then(function(value){
				$scope.errorRedirect = value;
			});
			$translate('ERROR_BUTTON_TEXT').then(function(value){
				$scope.errorButtonText = value;
			});

			$scope.redirect = function() {
				$state.go('base.home');
			};
    }]);


