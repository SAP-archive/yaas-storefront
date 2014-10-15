describe('Checkout InlineErrorInput directive Test', function () {

    var $scope, element, mockedStoreSettings={ defaultLanguage: 'en' };
    var billTo = {'firstName': 'Bob'};

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************


    beforeEach(module('ds.checkout', function($provide){
        $provide.value('GlobalData', {getLanguageCode:function(){return 'en'}})
    }));


    beforeEach(inject(function (_$rootScope_, _$compile_) {
        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        element = angular.element(
            '<ng-form name="billToForm">' +
            '   <div ng-class="{\'has-error\': billToForm.firstName.$invalid && billToForm.firstName.$dirty}">' +
            '    <input inline-error-input="" type="text" name="firstName" ng-model="billTo.firstName" required>' +
            '   </div>' +
            '</ng-form>'
        );
        $scope = _$rootScope_.$new();
        _$compile_(element)($scope);
        $scope.$digest();
    }));

    describe('Initialization', function () {
        
        it('should create a clone of an element', function () {
            var fnEls = element.find('input[name="firstName"]');
            expect(fnEls.length).toEqual(2);
            expect(fnEls).toBeDefined();
        });

        it("should add class to a cloned input", function() {
            var cloneEl = element.find('input.error-input[name="firstName"]');
            expect(cloneEl.length).toEqual(1);
        });

        it("should position it after original input", function() {
            var input = element.find('input[name="firstName"]');
            var cloneInput = angular.element(angular.element(input[0]).next());
            expect(cloneInput.is('input')).toBeTruthy();
            expect(cloneInput.hasClass('error-input')).toBeTruthy();
        });

        it("should have original input visible and cloned input as hidden initially", function() {
            var input = element.find('input[name="firstName"]:first-child'),
                cloneInput = element.find('input.error-input[name="firstName"]'),
                cloneInputLen = element.find('input.error-input[name="firstName"]:visible').length;
            expect(input.length).toBeTruthy();
            expect(cloneInput.length).toEqual(1);
            expect(cloneInputLen).toEqual(0);
        });

        it("should set cloned element value to a default error message on form submittion event", function() {
            var input = element.find('input[name="firstName"]:first-child'),
                clonedInput = element.find('input.error-input[name="firstName"]');

            expect(clonedInput.val()).toEqual('');
            $scope.$broadcast('submitting:form', 'billToForm');
            expect(clonedInput.val()).toEqual('Field is required!');
        });

        it("shouldn't set cloned element value if correct value was entered", function() {
            var input = element.find('input[name="firstName"]:first-child'),
                clonedInput = element.find('input.error-input[name="firstName"]'),
                controller = input.controller('ngModel');

            // Initially no error
            expect(clonedInput.val()).toEqual('');
            
            // Submitting show pristine error
            input.val('');
            controller.$setViewValue('');
            $scope.$broadcast('submitting:form', 'billToForm');
            expect(clonedInput.val()).toEqual('Field is required!');

            // Setting valid value - no errors
            var value = 'Test';
            input.val(value);
            controller.$setViewValue(value);
            $scope.$broadcast('submitting:form', 'billToForm');
            expect(clonedInput.val()).toEqual('Field is required!');
        });        

    });

});
