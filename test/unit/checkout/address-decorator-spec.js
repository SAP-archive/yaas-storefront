/**
 * Created by i839794 on 9/16/14.
 */
describe('directive: address-decorator', function() {
    var scope,
        elem,
        directive,
        compiled,
        html;

    beforeEach(function (){
        //load the module
        module('ds.checkout');

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        //set our view html.
        html = '<div address-decorator></div>';

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

            //get the jqLite or jQuery element
            elem = angular.element(html);

            //compile the element into a function to
            // process the view.
            compiled = $compile(elem);

            //run the compiled view.
            compiled(scope);

            //call digest on the scope!
            scope.$digest();
        });
    });

    it('should properly decorate the addresses', function(){
        var selectedAddress = _.findWhere(scope.addresses, {id: '1234'});

        expect(selectedAddress.selected).toEqualData(true);
    });


});