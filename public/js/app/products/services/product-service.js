/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('ProductSvc', ['PriceProductREST', function(PriceProductREST){

        var getProductList = function (parms) {
            return PriceProductREST.Products.all('products').getList(parms);
        };

        return {
            queryProductList: function(parms) {
               return getProductList(parms);
            },
            getProductVariant: function(params) {
               return PriceProductREST.Products.withConfig(function(RestangularConfigurer){
                 RestangularConfigurer.restangularFields.options = 'restangularOptions';
               }).one('products', params.productId).one('variants', params.variantId).get();
            },
            getProductVariants: function(params) {
               return PriceProductREST.Products.one('products', params.productId).all('variants').getList();
            },
            getProduct:  function(params) {
              return PriceProductREST.Products.one('products', params.productId).get();
            }
        };
}]);
