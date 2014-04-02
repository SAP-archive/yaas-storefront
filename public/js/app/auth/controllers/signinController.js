'use strict';

angular.module('hybris.bs&d.newborn.auth.controllers', [])
	.controller('SigninCtrl', ['$scope', 'SigninModel', 'GlobalData', 'AuthenticationService',
		function ($scope, SigninModel, GlobalData, AuthenticationService) {
			
			// TODO: GlobalData.buyer.id will be removed from here eventually
			$scope.signinModel = new SigninModel(GlobalData.buyer.id);
			
			$scope.onSubmit = function(signinModel) {
				AuthenticationService.authenticate(signinModel.username, signinModel.password)
					.then(function(response) {
						console.log('onSubmit success ', response);
					});
			};
		}
	]);