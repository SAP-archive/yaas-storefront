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
    .factory('SiteSelectorSvc', ['GlobalData', 'CartSvc', '$q', '$http',
        function (GlobalData, CartSvc, $q, $http) {

            return {

                /**
                 * Method that is used to change current site on storefront
                 */
                changeSite: function (site, languageCode) {
                    $http.get('sites.json').then(function (response) {
                       var site = response.data[0];
                        GlobalData.setSite(site, languageCode);
                        GlobalData.setSiteCookie(site);
                    });

                }

            };
        }]);
