/**
 * Created by i839794 on 9/16/14.
 */
describe('directive: confirm-input', function() {
    var scope,
        elem,
        directive,
        compiled,
        html;

    beforeEach(function (){
        module('ds.auth');

        elem = angular.element('<input type="text" id="field1" ng-model="fieldA"></input><input type="text" id="field2" ng-model="fieldB" confirm-input="field1"></input>');

        inject(function($compile, $rootScope) {
            scope = $rootScope.$new();

            compiled = $compile(elem);

            compiled(scope);
        });
    });

    it('should flag field as invalid if input does not match', function(){
        scope.$digest();
    });

    it('should flag field as valid if input does match', function(){
        scope.$digest();
    });


});