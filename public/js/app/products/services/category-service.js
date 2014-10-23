'use strict';

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('CategorySvc', ['PriceProductREST', 'GlobalData', '$q', function(PriceProductREST, GlobalData, $q){

        function sluggify(name){
           return window.encodeURIComponent(name.toLowerCase().replace(' ', '-').replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue'));
        }

        return {

            /** Returns a promise over the category list.*/
            getCategories: function () {
                var catDef = $q.defer();

                PriceProductREST.Categories.all('categories').getList().then(function (result) {
                   // var catMap = [];
                    var catNameMap = [];
                    var cats = [];
                    angular.forEach(result.plain(), function (category) {
                        var slug = sluggify(category.name);
                        category.slug = slug;
                        catNameMap[slug] = category;
                        cats.push(category);
                    }, catNameMap);

                    GlobalData.categoryMap = catNameMap;
                    catDef.resolve(cats);
                }, function (error) {
                    catDef.reject(error);
                });

                return catDef.promise;
            },

            /*
            getCategory: function(categoryId) {
                var cdef = $q.defer();
                if(categoryId === '0'){
                    cdef.resolve(null);
                } else if(GlobalData.categoryMap){
                    var category = GlobalData.categoryMap[categoryId];
                    cdef.resolve(category);
                } else {
                    this.getCategories().then(function () {
                        var category = GlobalData.categoryMap[categoryId];
                        if(!category) {
                            category = {};
                        }
                        cdef.resolve(category);
                    });
                }
                return cdef.promise;
            },*/

            getProducts: function(categoryId){
                return PriceProductREST.Categories.all('categories').one(categoryId).all('elements').getList();
            },

            getCategoryWithProducts: function (categorySlug) {
                var compositeDef = $q.defer();

                if (!categorySlug) {
                    compositeDef.resolve(null);
                } else {
                    var cdef = $q.defer();
                    if (GlobalData.categoryMap) {
                        var category = GlobalData.categoryMap[categorySlug];
                        cdef.resolve(category);
                    } else {
                        this.getCategories().then(function () {
                            var category = GlobalData.categoryMap[categorySlug];
                            if (!category) {
                                category = {};
                            }
                            cdef.resolve(category);
                        });
                    }
                    cdef.promise.then(function (category) {
                        PriceProductREST.Categories.all('categories').one(category.id).all('elements').getList().then(
                            function(elements){
                                category.elements = elements.plain();
                                compositeDef.resolve(category);
                            }, function(){
                                compositeDef.resolve(category);
                            }
                        );
                    });
                }

                return compositeDef.promise;
            },

            clearCategoryCache: function(){
                GlobalData.categoryMap = null;
            },

            getSlug: function (name) {
                return sluggify(name)
            }
        };
}]);
