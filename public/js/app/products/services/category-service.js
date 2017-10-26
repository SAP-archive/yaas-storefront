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
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')

    .factory('CategorySvc', ['$rootScope', '$state', 'PriceProductREST', 'GlobalData', '$q', 'ProductSvc',
        function ($rootScope, $state, PriceProductREST, GlobalData, $q, ProductSvc) {

            var categoryMap;
            var catList;

            return {

                /** Returns a promise over the category list as loaded from the service. Fires event "categories:updated".
                 * @param source - indicates source/reason for update, eg. 'languageUpdate' - see setting.eventSource.
                 * */
                getCategories: function () {
                    var categories = [
                        {
                            name: 'Dark',
                            slug: 'dark'
                        },
                        {
                            name: 'Light',
                            slug: 'light'
                        }
                    ];
                    catList = categories;
                    return $q.resolve(catList);
                },

                /** Returns categories from cache.*/
                getCategoriesFromCache: function () {
                    return catList;
                },

                getCategoryById: function (categoryId) {
                    var catDef = $q.defer();

                    if (categoryMap) {
                        catDef.resolve(categoryMap[categoryId]);
                    } else {
                        this.getCategories().then(function () {
                            catDef.resolve(categoryMap[categoryId]);
                        });
                    }
                    return catDef.promise;
                },

                /** Returns the category along with "element list".
                 * If category will be retrieved from cache if existing.
                 * @param categorySlug ("sluggified" name per logic in this service - name, ~,  categoryId, e.g. 'green-bottles~3456')
                 * @returns {*}
                 */
                getCategoryWithProducts: function () {
                    return ProductSvc.queryProductList();
                },

                /** Remove local category storage to force retrieval from server on next request.*/
                resetCategoryCache: function () {
                    categoryMap = null;
                }
            };
        }]);
