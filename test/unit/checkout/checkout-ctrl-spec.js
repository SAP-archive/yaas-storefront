describe('CheckoutCtrl Test', function () {

    var $scope, $rootScope, $controller;

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.checkout'));

    beforeEach(inject(function(_$rootScope_, _$controller_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    describe('CheckoutCtrl - constructor', function () {
        var checkoutCtrl;

        beforeEach(function () {



        });

        it('should initialize', function () {

            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc});
            expect(checkoutCtrl).toBeTruthy();
        })

    });

});
