'use strict';

angular.module('ds.shared')
    /** Acts as global data store for application settings. In constrast to the "settings" constand provider,
     * these settings may change over the life of the application.
     * */
    .service('GlobalData', ['storeConfig', function (storeConfig) {
      
		this.languageCode = storeConfig.defaultLanguage;
        this.acceptLanguages = storeConfig.defaultLanguage;
        this.orders = {
            meta: {
                total: 0
            }
        };
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

        this.user = {
            isAuthenticated: false,
            username: null
        };

        this.customerAccount = null;

    }]);
