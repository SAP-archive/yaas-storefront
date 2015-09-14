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

    .factory('CategorySvc', ['$rootScope', '$state', 'PriceProductREST', 'GlobalData', '$q',
        function($rootScope, $state, PriceProductREST, GlobalData, $q){

        var categoryMap;
        var catList;

        function sluggify(name){
            // very simplistic algorithm to handle German Umlaute - should ultimately be provided by server
            if(name){ //ensure categories without name are not created
              return window.encodeURIComponent(name.toLowerCase().replace(' ', '-').replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss'));
            }
        }

        function loadCategory(cat, parent){
            cat.path = [];
            if(parent){
                angular.copy(parent.path, cat.path);
            }
            cat.path.push(cat);
            cat.slug = sluggify(cat.name)+'~'+cat.id;
            categoryMap[cat.id] = cat;

            if(cat.subcategories){
                angular.forEach(cat.subcategories, function(sub){
                    loadCategory(sub, cat);
                });
            }
        }

        function getCategory(slug){
            var tildeIndex = slug.indexOf('~');
            if(tildeIndex < 0) {
                return null;
            }
            var catId = slug.substring(tildeIndex+1, slug.length);
            return categoryMap[catId];
        }

        return {

            /** Returns a promise over the category list as loaded from the service. Fires event "categories:updated".
             * @param source - indicates source/reason for update, eg. 'languageUpdate' - see setting.eventSource.
             * */
            getCategories: function (source) {
                var catDef = $q.defer();

                PriceProductREST.Categories.all('categories').getList({ expand: 'subcategories', toplevel: true }).then(function (result) {
                    categoryMap = {};
                    catList = [];
                    angular.forEach(result.plain(), function (category) {
                        if(category.name){
                            catList.push(category);
                            loadCategory(category);
                        }
                    });
                    $rootScope.$emit('categories:updated', {categories: catList, source: source});
                    catDef.resolve(catList);
                }, function (error) {
                    catDef.reject(error);
                });
                return catDef.promise;
            },

            /** Returns categories from cache.*/
            getCategoriesFromCache: function(){
                return catList;
            },

            getCategoryById: function(categoryId){
                var catDef = $q.defer();

                if(categoryMap){
                    catDef.resolve(categoryMap[categoryId]);
                } else {
                    this.getCategories().then(function(){
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
            getCategoryWithProducts: function (categorySlug) {
                var compositeDef = $q.defer();

                if (!categorySlug) {
                    compositeDef.resolve(null);
                } else {
                    var cdef = $q.defer();
                    if (categoryMap) {
                        var category = getCategory(categorySlug);
                        if(category){
                            cdef.resolve(category);
                        } else {
                            cdef.reject();
                            $state.go('errors', { errorId : '404' });
                        }
                    } else {
                        this.getCategories().then(function () {
                            var category = getCategory(categorySlug);
                            if(category){
                                cdef.resolve(category);
                            } else {
                                cdef.reject();
                            }
                        });
                    }
                    cdef.promise.then(function (category) {
                        PriceProductREST.Categories.all('categories').one(category.id).all('assignments').getList({recursive: true}).then(
                            function(assignments){
                                category.assignments = assignments.plain();
                                compositeDef.resolve(category);
                            }, function(){
                                compositeDef.resolve(category);
                            }
                        );
                    });
                }
                return compositeDef.promise;
            },

            /** Remove local category storage to force retrieval from server on next request.*/
            resetCategoryCache: function(){
              categoryMap = null;
            }
        };
}]);
