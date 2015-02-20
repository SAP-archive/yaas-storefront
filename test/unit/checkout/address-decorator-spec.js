describe('directive: address-decorator', function() {
    var scope,
        elem,
        compiled;

    beforeEach(function (){
        module('ds.checkout');

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        elem = angular.element('<div address-decorator></div>');

        inject(function($compile, $rootScope) {
            scope = $rootScope.$new();

            scope.order = {
                billTo: {
                    id: '1234'
                }
            };

            scope.target = scope.order.billTo;

            scope.addresses = [
                {id: '1234'},
                {id: '4567'}
            ];

            compiled = $compile(elem);

            compiled(scope);
        });
    });

    it('should properly decorate the addresses', function(){
        scope.$digest();

        var selectedAddress = _.findWhere(scope.addresses, {id: '1234'});

        expect(selectedAddress.selected).toEqualData(true);
    });


});