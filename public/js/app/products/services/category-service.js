'use strict';

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('CategorySvc', ['PriceProductREST', 'GlobalData', '$q', function(PriceProductREST, GlobalData, $q){


        return {

            /** Returns a promise over the category list.*/
            getCategories: function () {
                var catDef = $q.defer();

                PriceProductREST.Categories.all('categories').getList().then(function (result) {

                    var catMap = [];
                    angular.forEach(result.plain(), function (category) {
                        catMap[category.id] = category;
                    }, catMap);

                    GlobalData.categoryMap = catMap;
                    catDef.resolve(result.plain());
                }, function (error) {
                    catDef.reject(error);
                });

                return catDef.promise;
            },

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
            },

            getProducts: function(categoryId){
                return PriceProductREST.Categories.all('categories').one(categoryId).all('elements').getList();
            },

            clearCategoryCache: function(){
                GlobalData.categoryMap = null;
            }
        };
}]);
