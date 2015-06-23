/**
 * Created by i839794 on 12/2/14.
 */
describe('EventSvc', function(){

    var $rootScope, $scope, $q, settings, mockedState={}, mockedStateParams, mockedCartSvc={}, mockedCategorySvc={}, EventSvc;

    beforeEach(module('ds.shared', function ($provide) {
        $provide.value('$state', mockedState);
        $provide.value('$stateParams', mockedStateParams);
        $provide.value('CategorySvc', mockedCategorySvc);
        $provide.value('CartSvc', mockedCartSvc);
    }));

    beforeEach(inject(function(_$rootScope_, _$q_,_settings_, _EventSvc_){
        $rootScope = _$rootScope_;
        $scope = _$rootScope_.$new();
        $q = _$q_;
        settings = _settings_;
        EventSvc = _EventSvc_;
    }));

    describe('onSiteChange', function () {

        var state;
        var curChangeDef;
        var siteCode = 'USD';

        beforeEach(function(){
            curChangeDef = $q.defer();

            mockedState.is = jasmine.createSpy().andCallFake(
                function (compState) {
                    return (state === compState);
                });
            mockedState.transitionTo = jasmine.createSpy();
            mockedCartSvc.swichSite = jasmine.createSpy().andCallFake(function () {
                return curChangeDef.promise;
            });
        });


        describe('state = checkout', function () {

            beforeEach(function(){
                state = 'base.checkout.details';
            });

            it('should switch cart currency and refresh state on cart update', function () {
                EventSvc.onSiteChange({}, {siteCode: siteCode});
                curChangeDef.resolve({});
                $scope.$apply();
                expect(mockedCartSvc.swichSite).toHaveBeenCalledWith(siteCode);
                expect(mockedState.transitionTo).toHaveBeenCalled();
            });

        });

        describe('state <> checkout', function () {
            beforeEach(function () {
                state = 'base.category';
            });

            it('should switch currency if event source not login', function(){
                EventSvc.onSiteChange({}, { siteCode: siteCode, source: 'other' });
                expect(mockedCartSvc.swichSite).toHaveBeenCalledWith(siteCode);

            });

            it('should reload state for category and prod detail', function(){
                EventSvc.onSiteChange({}, { siteCode: siteCode, source: settings.eventSource.login });
                expect(mockedState.transitionTo).toHaveBeenCalled();
            });

        });
    });

    describe('onLanguageChange', function(){
        var state;
        var categoriesDef;

        beforeEach(function () {

            mockedState.is = jasmine.createSpy().andCallFake(
                function (compState) {
                    return (state === compState);
                });
            mockedState.transitionTo = jasmine.createSpy();
            categoriesDef = $q.defer();
            mockedCartSvc.getCart = jasmine.createSpy();
            mockedCategorySvc.getCategories = jasmine.createSpy().andCallFake(function(){
                return categoriesDef.promise;
            });
        });

        it('should refresh cart if event source not login or initialization', function(){
            EventSvc.onLanguageChange({}, {source: 'other'});
            expect(mockedCartSvc.getCart).toHaveBeenCalled();
        });

        describe('state is category or prod detail', function(){

            beforeEach(function(){
                state = 'base.category';
            });

            it('should reload categories and state for category and prod detail', function(){
                EventSvc.onLanguageChange({}, {source: settings.eventSource.initialization});
                categoriesDef.resolve({});
                $scope.$apply();
                expect(mockedCartSvc.getCart).not.toHaveBeenCalled();
                expect(mockedState.transitionTo).toHaveBeenCalled();
                expect(mockedCategorySvc.getCategories).toHaveBeenCalled();
            });
        });

        describe('state is not category or prod detail', function(){
            beforeEach(function(){
                state = 'other';
            });

            it('should reload categories for other states', function(){
                EventSvc.onLanguageChange({}, {source: settings.eventSource.login});
                expect(mockedCartSvc.getCart).not.toHaveBeenCalled();
                expect(mockedState.transitionTo).not.toHaveBeenCalled();
                expect(mockedCategorySvc.getCategories).toHaveBeenCalled();
            });
        });


    })
});
