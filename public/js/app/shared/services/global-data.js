'use strict';

angular.module('ds.shared')
    /** Acts as global data store for application settings. In constrast to the "settings" constand provider,
     * these settings may change over the life of the application.
     * */
    .service('GlobalData', ['settings', 'storeConfig', function (settings, storeConfig) {
      
		this.languageCode = settings.languageCode;

		this.products = {
			meta: {
				total: 0
			}
		};

        this.store = {
            tenant: storeConfig.storeTenant,
            name: '',
            logo: null
        };

        this.stripePublicKey = null;

    }]);
