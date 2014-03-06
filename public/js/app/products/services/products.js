'use strict';

angular.module('hybris.bs&d.newborn.products.services.products', [])
    .service('Products', ['$resource', 'ProductsConstants',
        function Products($resource, ProductsConstants) {
      
            var productURI = '/products/:productId';

            this.API = $resource(
                    ProductsConstants.apiBaseUrl(productURI), {productId: '@id'}, {
                        query: { method: 'GET', isArray:false }
                    }
                );

    }]);
