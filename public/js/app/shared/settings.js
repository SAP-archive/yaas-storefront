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
        languageCookie: 'languageCookie',
        siteCookie: 'siteCookie',
        consentReferenceCookie: 'consentReferenceCookie',

        // header keys
        headers: {

            // "final" headers for CaaS auth.
            // will be replaced by full oauth flow.
            hybrisTenant: 'hybris-tenant',
            hybrisUser: 'hybris-user',
            hybrisRoles: 'hybris-roles',   //TODO deprecated, can refactor out.
            hybrisApp: 'hybris-app',       //TODO deprecated, can refactor out.
            language: 'accept-language',
            hybrisAuthorization: 'Authorization',
            paging: {
                total: 'hybris-count'
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

        localeImages: {
            en: './img/flags/en.jpg',
            de: './img/flags/de.jpg'
        },

        // identifies the languages for which labels have been localized - see public/js/app/shared/i18n
        translateLanguages:['en','de'],
        // fallback language for label localization
        translateDefault: 'en',

        placeholderImage: 'img/no-image.jpg',
        placeholderImageId: 'no-image',

        homeState: 'base.home',
        checkoutState: 'base.checkout.details',
        allProductsState: 'base.category',

        eventSource: {
            login: 'login',
            initialization: 'init',
            unknown: 'unknown',
            languageUpdate: 'languageUpdate',
            siteUpdate: 'siteUpdate'
        }
    });