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

        var getProductDetailsList = function (parms) {
            return PriceProductREST.ProductDetails.all('productdetails').getList(parms);
        };

        return {
            queryProductDetailsList: function(parms) {
               return getProductDetailsList(parms);
            }
        };
}]);
