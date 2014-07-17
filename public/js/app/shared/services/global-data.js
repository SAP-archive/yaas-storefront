'use strict';

angular.module('ds.shared')
    /** Acts as global data store for application settings. In constrast to the "settings" constand provider,
     * these settings may change over the life of the application.
     * */
    .service('GlobalData', ['settings', 'STORE_CONFIG', function (settings, STORE_CONFIG) {
      
		this.languageCode = settings.languageCode;

		this.products = {
			meta: {
				total: 0
			}
		};

        this.store = {
            tenant: STORE_CONFIG.storeTenant,
            name: '',
            logo: null
        };

        this.stripePublicKey = null;

    }]);
