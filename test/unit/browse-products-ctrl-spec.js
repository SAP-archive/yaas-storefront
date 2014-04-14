describe('BrowseProductsCtrl Test', function () {

    var $scope, $rootScope, $controller;

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.products'));

    beforeEach(inject(function(_$rootScope_, _$controller_, $q) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    describe('BrowseProductsCtrl - addMore', function () {

        var products, browseProdCtrl, stubbedProductSvc;

        beforeEach(function () {

            products = [
                {'name': 'prod1'}
            ];

            // stubbing a service with callback
            stubbedProductSvc = {

                query: function (parms, callback) {
                    if (callback) {
                        callback(products);
                    }
                    return products;
                }
            };

            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': stubbedProductSvc})
        })

        it(' queries products and adds them to the scope', function () {

            $scope.products = [];
            $scope.addMore();
            // validate that "add more" added products returned by query to the scope
            expect($scope.products).toEqualData(products);
        })

    })

});
