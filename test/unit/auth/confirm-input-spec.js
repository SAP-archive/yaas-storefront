/**
 * Created by i839794 on 9/16/14.
 */
describe('confirm-input directive', function() {
    var scope,
        elem,
        directive,
        compiled,
        html;

    beforeEach(function (){
        //load the module
        module('ds.auth');

        //set our view html.
        html = '<input type="text" id="field1"></input><input type="text" id="field2" confirm-input="field1"></input>';

        inject(function($compile, $rootScope) {
            //create a scope (you could just use $rootScope, I suppose)
            scope = $rootScope.$new();

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

    it('should flag field as invalid if input does not match', function(){

    });

    it('should flag field as valid if input does match', function(){

    });

    
});