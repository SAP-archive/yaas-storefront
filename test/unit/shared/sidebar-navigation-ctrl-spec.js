/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

describe('SidebarNavigationCtrl', function () {

    var $scope, $rootScope, $controller, $injector, $state, AuthDialogManager, mockedCategorySvc = {
        getCategories: jasmine.createSpy().andReturn({then: function(){}})
    };
    var currency =  {id: 'USD', label: 'US Dollar'};
    var currencies = [currency];
    var langCode = 'en';
    var language = {id: langCode}
    var languages = [language];

    var mockedAuthSvc = {};

    var mockedState = {};
    var navCtrl, cart;
    cart = {};
    var username = 'Joe';
    var mockedToken = {
        getUsername: function(){
            return username;
        }
    };
    var mockedGlobalData;
    // configure the target controller's module for testing - see angular.mock
    beforeEach(module('ui.router'));
    beforeEach(angular.mock.module('ds.shared'));

    beforeEach(inject(function(_$rootScope_, _$controller_, _$injector_, _$state_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
        $injector = _$injector_;
        $state = _$state_;
        AuthDialogManager = {
            isOpened: jasmine.createSpy('isOpened'),
            open: jasmine.createSpy('open'),
            close: jasmine.createSpy('close')
        };


        mockedState.is = jasmine.createSpy('is').andReturn(true);
        mockedState.go = jasmine.createSpy('go');
        mockedState.transitionTo = jasmine.createSpy('transitionTo');
        mockedAuthSvc.signOut = jasmine.createSpy('signOut').andReturn({
            then: jasmine.createSpy('then')
        });
        mockedAuthSvc.getToken = jasmine.createSpy('getToken').andReturn(mockedToken);
    }));

    beforeEach(function () {

        mockedGlobalData =  {
            setLanguage: jasmine.createSpy('setLanguage'),
            setCurrency: jasmine.createSpy('setCurrency'),
            getLanguageCode: function(){
                return langCode;
            },
            getCurrency: function(){
                return currency;
            },
            getCurrencySymbol: function(){
                return '$';
            },
            getCurrencyById: function(currId){
                return {id: currId};
            },
            getAvailableCurrencies: function(){
                return currencies;
            },
            getAvailableLanguages: function(){
                return languages;
            }
        };
        mockedGlobalData.store = {};
        spyOn(mockedGlobalData, 'getAvailableLanguages').andCallThrough();
        navCtrl = $controller('SidebarNavigationCtrl', {$scope: $scope, $state: mockedState, cart: cart, GlobalData: mockedGlobalData,
             AuthSvc: mockedAuthSvc,
            AuthDialogManager:AuthDialogManager, CategorySvc: mockedCategorySvc});
    });

    describe('onInitialization', function(){
        it('should retrieve categories', function(){
           expect(mockedCategorySvc.getCategories).toHaveBeenCalled();
        });

        it("should get available languages from GlobalData", function() {
            expect(mockedGlobalData.getAvailableLanguages).wasCalled();
        });

        it('should have language related select box variables set correctly', function() {
            expect($scope.language).toBeDefined();
            expect($scope.language.selected).toBeDefined();
            expect($scope.language.selected.iso).toBeDefined();
            expect($scope.language.selected.iso).toEqual(langCode);
            expect($scope.language.selected.value).toBeDefined();
            expect($scope.language.selected.value).toEqual(langCode);

            expect($scope.languages).toBeDefined();
            expect($scope.store).toBeDefined();
            /*
            expect($scope.languages.length).toEqual($scope.languageCodes.length);
            for (var i = 0; i < $scope.languageCodes.length; i++) {
                expect($scope.languages[i].iso).toEqual($scope.languageCodes[i]);
                expect($scope.languages[i].value).toEqual($scope.languageCodes[i]);
            };*/
        });

        it('should have currency select box variables set correctly', function() {

            expect($scope.currencies).toBeDefined();
            expect($scope.currencies.length).toEqual(currencies.length);

            for (var i = 0; i < currencies.length; i++) {
                expect($scope.currencies[i]).toEqual(currencies[i]);
            };
        });
    });

    /*
    describe('switchLanguage()', function(){

        it('should setLanguage in GlobalData', function(){
            var newLang = 'de';
            $scope.switchLanguage(newLang);
            expect(mockedGlobalData.setLanguage).toHaveBeenCalledWith(newLang);
        });

        it('should reload product state', function(){
            var newLang =  'pl';
            $scope.switchLanguage(newLang);
            expect(mockedState.transitionTo).toHaveBeenCalled();
        });

        it('should reload categories for non-product states', function(){
            $controller('SidebarNavigationCtrl', {$scope: $scope, $state: {is: function(){return false}}, cart: cart, GlobalData: mockedGlobalData,
                AuthSvc: mockedAuthSvc,
                AuthDialogManager:AuthDialogManager, CategorySvc: mockedCategorySvc});
            $scope.switchLanguage('pl');
            expect(mockedCategorySvc.getCategories).toHaveBeenCalled();
        });
    });*/

    describe('watchLanguage', function(){
       it('should setLanguage in GlobalData if selected language changes', function(){
           var newLang =  'pl';
           $scope.language.selected = {iso: newLang, languageCode: newLang};
           $scope.$apply();
           //??? expect(mockedGlobalData.setLanguage).toHaveBeenCalledWith(newLang);
       });
    });

    describe('watchCurrency', function(){
       it('should setCurrency in GlobalData if selected currency changes', function(){
           var newCurr =  'EUR';
           $scope.currency.selected = {id: newCurr};
           $scope.$apply();

           //?? expect(mockedGlobalData.setCurrency).toHaveBeenCalledWith(newCurr);
       });
    });

    describe('onLanguageChanged', function(){
        it('should update the selected language if different', function(){
            $rootScope.$emit('language:updated', {iso: 'pl'});
            expect(mockedGlobalData.setLanguage).toHaveBeenCalled;
        });
    });

    describe('onCurrencyChanged', function(){
        it('should update the selected currency if different', function(){
            $rootScope.$emit('currency:updated', {id: 'EUR'});
            expect(mockedGlobalData.setCurrency).toHaveBeenCalled;
        });
    })


    describe('logout()', function(){
       it('should invoke signOut on AuthSvc', function(){
         $scope.logout();
           expect(mockedAuthSvc.signOut).toHaveBeenCalled();
       });
    });

    describe('hideMobileNav()', function(){
       it('should hide mobile nav', function(){
           $scope.hideMobileNav();
           expect($rootScope.showMobileNav).toBeFalsy();
       });
    });

    describe('myAccount()', function(){
       it('should hide mobile nav', function(){
          $scope.myAccount();
           expect($rootScope.showMobileNav).toBeFalsy();
       });
    });

    /*
    describe('switchCurrency()', function(){
        var cur = 'EU';
        beforeEach(function(){
            var cur = 'EU';
            $scope.switchCurrency(cur);
        });

        it('should set currency in GlobalData', function(){
            expect(mockedGlobalData.setCurrency).wasCalledWith(cur);
        });

        it('should reload current state', function(){
            expect(mockedState.transitionTo).toHaveBeenCalled();
        });
    });*/

    describe('login()', function(){
       it('should delegate to AuthDialogMgr', function(){
         $scope.login();
           expect(AuthDialogManager.open).wasCalled();
       });
    });

    describe('onLanguageChanged', function(){
        it('should update the selected language if different', function(){
            $rootScope.$emit('language:updated', {iso: 'pl'});
            expect(mockedGlobalData.setLanguage).toHaveBeenCalled;
        });
    });

    describe('onCurrencyChanged', function(){
        it('should update the selected currency if different', function(){
            $rootScope.$emit('currency:updated', {id: 'EUR'});
            expect(mockedGlobalData.setCurrency).toHaveBeenCalled;
        });
    })

});

