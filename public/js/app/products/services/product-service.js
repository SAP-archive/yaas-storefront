'use strict';

angular.module('ds.products')
    .factory('ProductSvc', ['caas', function(caas){

        var getProducts = function (parms) {
            return caas.products.API.query(parms);
        };

        return {
            query: function(parms) {
                return getProducts(parms);
            }
        };
    }]);
