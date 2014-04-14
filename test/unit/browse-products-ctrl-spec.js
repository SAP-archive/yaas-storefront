describe('BrowseProductsCtrl Test', function () {

    var $scope, $rootScope, browseProdCtrl, products;

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.products'));

    beforeEach(inject(function(_$rootScope_, $controller, $q) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();

        products = [{'name': 'prod1'}];

        // stubbing a service with callback
        var mockedProductSvc = {

            query: function(parms, callback) {
                if(callback) {
                    callback(products);
                }
                return products;
            }
        };

        // manual injection of the dummy service into the controller
        browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc});

    }));

    describe('BrowseProductsCtrl - addMore', function() {
        it(' queries products and adds them to the scope', function() {
            $scope.products = [];
            $scope.addMore();
            // validate that "add more" added products returned by query to the scope
            expect($scope.products).toEqualData(products);
        })
    })

});
