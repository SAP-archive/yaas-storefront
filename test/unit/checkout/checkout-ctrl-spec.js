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
        var mockedCartSvc, checkoutCtrl;
        var cart = {
            'products': [{'name': 'Awesome Bike'}]
        }

        beforeEach(function () {
            var mockCartSvc = $injector.get( 'CartSvc' );
            mockCartSvc.getCart = jasmine.createSpy("getCart").andReturn(cart);
        });

        it('should initialize', function () {
            checkoutCtrl = $controller('CheckoutCtrl', {$scope: $scope, 'CartSvc': mockedCartSvc});
            expect(checkoutCtrl).toBeTruthy();
            expect($scope.cart).toEqualData(cart);
        })

    });



});
