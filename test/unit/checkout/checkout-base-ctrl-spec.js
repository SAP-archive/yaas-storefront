describe('CheckoutBaseCtrl', function () {

    var $scope, $rootScope, $controller, $injector, $q, checkoutBaseCtrl, cart, MockedCartSvc, cartDef, updatedCartDef;

    cart = {
        totalPrice:{
            value: 0
        }
    };

    beforeEach(angular.mock.module('ds.checkout'));

    beforeEach(inject(function ($injector, _$rootScope_, _$controller_, _$q_) {
        $q = _$q_;
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope = _$rootScope_;
        $controller = _$controller_;
        $scope = $injector.get('$rootScope').$new();
    }));

    beforeEach(function () {
        // creating the mocked service
        cartDef = $q.defer();
        var cart = {
            items : [],
            totalUnitsCount: 0,
            subTotalPrice : {
                value: 0
            },
            totalPrice : {
                value:0
            },
            id: null
        };
        MockedCartSvc = {
            getCart: jasmine.createSpy().andCallFake(function(){
                return cartDef.promise;
            }),
            getLocalCart:jasmine.createSpy().andReturn(cart)
        };

        updatedCartDef = $q.defer();

        $scope.cart = cart;
        $controller('CheckoutBaseCtrl', { $scope: $scope, $rootScope: $rootScope,
            'CartSvc': MockedCartSvc });

    });

    it('should broadcast go to step 2 when is mobile and order price is changed', function () {
        spyOn($scope,'$broadcast');
        $scope.updatedCartItems.push()
        $scope.hideEditCart(updatedCartDef.promise);
        updatedCartDef.resolve();
        cartDef.resolve({totalPrice: {value: 1}});
        $scope.$digest();
        expect($scope.$broadcast).toHaveBeenCalledWith('goToStep2');
    });

    it('should change checkoutCartEditVisible variable to true when showEditCart is called', function () {
        $scope.showEditCart();
        expect($scope.checkoutCartEditVisible).toEqual(true);
    });

    it('should change checkoutCartEditVisible variable to false when hideEditCart is called', function () {
        $scope.hideEditCart();
        expect($scope.checkoutCartEditVisible).toEqual(false);
    });
});