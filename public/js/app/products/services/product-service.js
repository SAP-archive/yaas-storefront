'use strict';

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('ProductSvc', ['PriceProductREST', function(PriceProductREST){

        /** Executes a product query and extracts the "total" product count meta data and stores it in the
         * GlobalData service.
         * */
        var getProducts = function (parms) {
            return PriceProductREST.Products.all('products').getList(parms);
        };

        return {
            /**
             * Issues a query request on the product resource.
             * @param {parms} query parameters - optional
             * @return The result array as returned by Angular $resource.query().
             */
            query: function(parms) {
               return getProducts(parms);
            }

        };
}]);
