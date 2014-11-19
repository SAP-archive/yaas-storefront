'use strict';

angular.module('ds.products')
    /** Controls the product detail view, which allows the shopper to add an item to the cart.
     * Listens to the 'cart:updated' event.  Once the item has been added to the cart, and the updated
     * cart information has been retrieved from the service, the 'cart' view will be shown.
     */
    .controller('ProductDetailCtrl', ['$scope', '$rootScope', 'CartSvc', 'CategorySvc', 'product', 'settings', 'GlobalData',
        function($scope, $rootScope, CartSvc, CategorySvc, product, settings, GlobalData) {


            $scope.product = product;
            $scope.currencySymbol = GlobalData.getCurrencySymbol();
            $scope.error=null;

            if ($scope.product.categories[0]) {
                $scope.catSlug = CategorySvc.getSlug($scope.product.categories[0].name);
            }

            if(!$scope.product.images || !$scope.product.images.length) { // set default image if no images configured
                $scope.product.images = [{url: settings.placeholderImage}];
            }

            //input default values must be defined in controller, not html, if tied to ng-model
            $scope.productDetailQty = 1;
            $scope.buyButtonEnabled = true;


            // scroll to top on load
            window.scrollTo(0, 0);

            var unbind = $rootScope.$on('cart:updated', function (eve, eveObj) {
                if(eveObj.source === 'manual'){
                    debugger
                    $rootScope.showCart = true;
                    //check to see if the cart should close after timeout
                    if(eveObj.closeAfterTimeout)
                    {
                        $rootScope.$emit('cart:closeAfterTimeout');

                    }
                    $scope.buyButtonEnabled = true;
                }

            });

            $scope.$on('$destroy', unbind);

            /** Add the product to the cart.  'Buy' button is disabled while cart update is in progress. */
            $scope.addToCartFromDetailPage = function () {
                $scope.error = false;
                $scope.buyButtonEnabled = false;
                CartSvc.addProductToCart(product, $scope.productDetailQty, {closeCartAfterTimeout: true, opencartAfterEdit: true}).then(function(){},
                function(){
                    $scope.error = 'ERROR_ADDING_TO_CART';
                    $scope.buyButtonEnabled = true;
                });
            };


}]);