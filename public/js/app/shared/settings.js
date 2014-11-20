'use strict';

angular.module('ds.shared')


/**
 * Provides default settings (constants) for the application.
 *
 * @type {Object}
 */
    .constant('settings', {

        hybrisUser: 'Anonymous',
        hybrisApp: 'y_ondemand_storefront',
        roleSeller: 'seller',
        // cookie name
        accessCookie: 'auth.user',
        currencyCookie: 'currencyCookie',
        languageCookie: 'languageCookie',

        // header keys
        headers: {

            // "final" headers for CaaS auth.
            // will be replaced by full oauth flow.
            hybrisTenant: 'hybris-tenant',
            hybrisRoles: 'hybris-roles',
            hybrisUser: 'hybris-user',
            hybrisApp: 'hybris-app',
            language: 'accept-language',
            hybrisAuthorization: 'Authorization',
            paging: {
                total: 'hybris-Count'
            },
            hybrisCurrency: 'hybris-currency'
        },

        // relevant keys from configuration service:
        configKeys: {

            stripeKey: 'payment.stripe.key.public',
            storeCurrencies: 'project_curr',
            storeLanguages: 'project_lang',
            storeName: 'store.settings.name',
            storeLogo: 'store.settings.image.logo.url',
            fbAppIdKey: 'facebook.app.id',
            googleClientId: 'google.client.id',
            googleResponseToken: 'access_token'
        },

        placeholderImage: 'img/no-image.png',

        homeState: 'base.category'
    });