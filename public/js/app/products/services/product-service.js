'use strict';

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('ProductSvc', ['settings', 'GlobalData', 'ProductsRest', function(settings, GlobalData, ProductsRest){

        /** Executes a product query and extracts the "total" product count meta data and stores it in the
         * GlobalData service.
         * */
        var getProducts = function (parms) {
            return ProductsRest.all('products').getList(parms);
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
                callback(products);
                return products;
            }

        };
}]);
