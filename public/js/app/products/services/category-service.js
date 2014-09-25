'use strict';

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('CategorySvc', ['PriceProductREST', function(PriceProductREST){



        return {
            /**
             * Returns all categories.
             */
            query: function() {
                return PriceProductREST.Categories.all('categories').getList();
            }


        };
}]);
