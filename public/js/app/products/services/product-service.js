'use strict';

angular.module('ds.products')
    .factory('ProductSvc', ['caas', function(caas){

        var getProducts = function (parms) {
            return caas.products.API.query(parms);
        };

        return {
            query: function(parms, callback) {
                // no callback utilize return of array that will be filled once data is loaded
                if(!callback) {
                    return getProducts(parms);
                } else {
                    // with callback - invoke callback method once promise is filled
                    getProducts(parms).$promise.then(function (result) {
                        callback(result);
                    });
                }
            }
        };
}]);
