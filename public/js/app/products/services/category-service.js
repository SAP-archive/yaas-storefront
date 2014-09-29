'use strict';

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('CategorySvc', ['PriceProductREST', 'GlobalData', '$q', function(PriceProductREST, GlobalData, $q){


        return {

            /** Returns a promise over the category list.*/
            getCategories: function(){
                var catDef = $q.defer();
                if(GlobalData.categories){
                    catDef.resolve(GlobalData.categories);
                } else {
                    PriceProductREST.Categories.all('categories').getList().then(function(result){
                        catDef.resolve(result.plain());
                    }, function(error){
                        catDef.reject(error);
                    });
                }
                return catDef.promise;
            }




        };
}]);
