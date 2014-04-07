'use strict';

angular.module('ds.products')
    .service('ProductService', ['caas', function (caas) {

        this.getMoreProducts = function(pageSize, pageNumber){
            caas.products.API.query({pageSize: pageSize, pageNumber: pageNumber}).$promise.then(
                function (products) {
                    return products;
                }
            );
        };

    }]);