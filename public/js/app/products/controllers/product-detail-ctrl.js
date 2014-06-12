'use strict';

angular.module('ds.products')
    .controller('ProductDetailCtrl', [ '$state', '$scope', '$rootScope', 'CartSvc', 'product',
        function($state, $scope, $rootScope, CartSvc, product) {

    /*
     if the user somehow gets to this product page and the product is unpublished,
     send them back to the list page
     */
    //if (!product.published) {   // kh disabled: this is handled by the service and should not be required. also, the info might not be included in the response from product-details
    //    $state.go('^');
    //}

    $scope.product = product;

    //input default values must be defined in controller, not html, if tied to ng-model
    $scope.productDetailQty = 1;

    $scope.addToCartFromDetailPage = function () {
        CartSvc.addProductToCart(product, $scope.productDetailQty);
        $rootScope.showCart = true;
    };

}]);