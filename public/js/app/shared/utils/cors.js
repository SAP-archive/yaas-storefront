'use strict';

angular.module('rice.utils.cors',[])

	.provider('CORSProvider', ['$httpProvider',
		function ($httpProvider) {

			var CORSProvider = {
				
				enableCORS: function() {
					$httpProvider.defaults.useXDomain = true;
					delete $httpProvider.defaults.headers.common['X-Requested-With'];
				}

			};

			this.$get = [function() {
				return CORSProvider;
			}];
		}
	]);