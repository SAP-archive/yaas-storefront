'use strict';

angular.module('ds.products')
    .factory('ProductSvc', ['caas', function(caas){
         /*
         var getProducts = function (queryConfig) {
             return caas.products.API.query(queryConfig.parmMap).$promise
                 .then(function(result){
                     return result;
                 });
         };

        return {
            query: function(queryConfig) {
                return getProducts(queryConfig);
            }
        };
         */

        var getProducts = function (qryConfig) {
            return caas.products.API.query(qryConfig.parmMap);
        };

        return {
            query: function(qryConfig) {
                return getProducts(qryConfig);
            }
        };
    }]);
