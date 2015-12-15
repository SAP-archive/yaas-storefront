describe('directive: mobile-checkout-wizard', function() {
    var scope,
        elem,
        compiled,
        $rootScope;

    beforeEach(function (){
        module('ds.checkout');

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        elem = angular.element('<div mobile-checkout-wizard></div>');

        inject(function($compile, _$rootScope_) {
            scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;

            scope.order = {};

            compiled = $compile(elem);

            compiled(scope);
        });

        $rootScope.previewOrder = function () {};
    });


    describe('Mobile Wizard Step completion', function () {
        beforeEach(function () {
            scope.wiz.step1Done = false;
            scope.wiz.step2Done = false;
            scope.wiz.step3Done = false;
            scope.showPristineErrors = false;
        });

        it('should set Step 1 Done when Bill-To to entered', function(){
            scope.billToDone(true);
            expect(scope.wiz.step1Done).toEqualData(true);
            expect(scope.wiz.step2Done).toEqualData(false);
            expect(scope.wiz.step2Done).toEqualData(false);
            expect(scope.showPristineErrors).toEqualData(false);
        });

        it('should leave Step 1 In Progress when invalid Bill-To entered', function(){
            scope.billToDone(false);
            expect(scope.wiz.step1Done).toEqualData(false);
            expect(scope.wiz.step2Done).toEqualData(false);
            expect(scope.wiz.step2Done).toEqualData(false);
            expect(scope.showPristineErrors).toEqualData(true);
        });

        it('should remove PRISTINE_ERRORS upon valid re-edit of Bill-To', function(){
            scope.showPristineErrors = true;
            scope.billToDone(true);
            expect(scope.showPristineErrors).toEqualData(false);
        });

        it('should set Step 2 Done when ship to to entered', function(){
            scope.wiz.step2Done = false;
            scope.shipToDone(true);
            expect(scope.wiz.step2Done).toEqualData(true);
            expect(scope.wiz.step3Done).toEqualData(false);

        });

        it('should leave Step 2 In Progress when invalid Ship-To entered', function(){
            scope.wiz.step2Done = false;
            scope.wiz.shipToSameAsBillTo = false;
            scope.shipToDone(false);
            expect(scope.wiz.step2Done).toEqualData(false);
            expect(scope.wiz.step3Done).toEqualData(false);
            expect(scope.showPristineErrors).toEqualData(true);
        });

        it('should set Step 3 Done when shipping entered', function(){
            scope.wiz.step3Done = false;
            scope.paymentDone(true, 'form');
            expect(scope.wiz.step3Done).toEqualData(true);
        });

        it('should leave Step 3 In Progress when invalid Payment entered', function(){
            scope.wiz.step3Done = false;
            scope.paymentDone(false);
            expect(scope.wiz.step3Done).toEqualData(false);
            expect(scope.showPristineErrors).toEqualData(true);
        });

    });

    describe('Wizard in Mobile - Editing Complete Information', function () {
        beforeEach(function () {
            scope.wiz.step1Done = true;
            scope.wiz.step2Done = true;
            scope.wiz.step3Done = true;
        });

        it(' (Bill To) should set Steps 1,2, 3 undone', function () {

            scope.editBillTo();
            expect(scope.wiz.step1Done).toEqualData(false);
            expect(scope.wiz.step2Done).toEqualData(false);
            expect(scope.wiz.step3Done).toEqualData(false);
        });

        it(' (Ship To) should set Steps 2, 3 undone', function () {

            scope.editShipTo();
            expect(scope.wiz.step1Done).toEqualData(true);
            expect(scope.wiz.step2Done).toEqualData(false);
            expect(scope.wiz.step3Done).toEqualData(false);
        });

        it(' (Shipping) should set Steps 3 undone', function () {
            scope.editPayment();
            expect(scope.wiz.step1Done).toEqualData(true);
            expect(scope.wiz.step2Done).toEqualData(true);
            expect(scope.wiz.step3Done).toEqualData(false);
        });

    });


});