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

/**
 *  Encapsulates access to the Site Settings API.
 */
angular.module('ds.shared')
    .factory('SiteSettingsSvc', ['SiteSettingsREST', function(SiteSettingsREST){

        var SiteSettingsService = {
            getStripeKey: function () {
                return SiteSettingsREST.SiteSettings.one('sites/default/payment/stripe').get();
            }
        };

        return SiteSettingsService;
    }]);
