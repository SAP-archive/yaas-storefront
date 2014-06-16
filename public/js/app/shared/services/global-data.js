'use strict';

angular.module('ds.shared')
    .service('GlobalData', ['settings', function (settings) {
      
		this.languageCode = settings.languageCode;

		this.products = {
			meta: {
				total: 0
			}
		};

        this.stripePublicKey = null;

    }]);
