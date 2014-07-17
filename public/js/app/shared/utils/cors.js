'use strict';

angular.module('ds.utils',[])
     /** Enables CORS. */
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