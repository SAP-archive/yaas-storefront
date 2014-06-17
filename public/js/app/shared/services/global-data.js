'use strict';

angular.module('ds.shared')
    .service('GlobalData', ['settings', 'STORE_CONFIG', function (settings, STORE_CONFIG) {
      
		this.languageCode = settings.languageCode;

		this.products = {
			meta: {
				total: 0
			}
		};

        this.store = {
            tenant: STORE_CONFIG.storeTenant,
            name: ''
        };

        this.stripePublicKey = null;

    }]);
