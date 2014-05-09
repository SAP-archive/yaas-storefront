'use strict';

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('ProductSvc', ['caas',  'settings', 'GlobalData', function(caas, settings, GlobalData){

        var getProducts = function (parms) {
            return caas.products.API.query(parms, function(response, headers) {
                GlobalData.products.meta.total = parseInt(headers(settings.apis.headers.paging.total), 10) || 0;
            });
        };

        return {
            /**
             * Issues a query request on the product resource.
             * @param {parms} query parameters - optional
             * @return The result array as returned by Angular $resource.query().
             */
            query: function(parms) {
               return getProducts(parms);
            },

            /**
             * Registers a success callback handler on the API 'query' request - invoked once the
             * promise is resolved.
             * @param {parms} query parameters
             * @param {callback} success callback function
             */
            queryWithResultHandler: function(parms, callback) {
                 var products = getProducts(parms);
                 products.$promise.then(function (result) {
                    callback(result);
                });
                return products;
            }

        };
}]);
