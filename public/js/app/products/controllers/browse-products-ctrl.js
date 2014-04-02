'use strict';

angular.module('ds.products')
   .controller('BrowseProductsCtrl', [ '$scope', 'caas', function($scope, caas) {

    // Reference the desired API by name

    caas.products.API.get().$promise.then(function(result){
        $scope.products = result.products;
    });

}]);
