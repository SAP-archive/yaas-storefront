/**
 * Created by i839794 on 10/8/14.
 */

describe('GlobalData', function () {

     var   mockedCookieSvc = {
            setLanguageCookie: jasmine.createSpy(),
            setCurrencyCookie: jasmine.createSpy()
        };
    var GlobalData = null;
    var defaultLang = 'en';
    var $rootScope;

    beforeEach( function() {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        module('ds.i18n');
        module('ds.shared');

        module(function ($provide) {
            $provide.value('CookieSvc', mockedCookieSvc);

            $provide.constant('storeConfig', {defaultLanguage: defaultLang});
        });

        inject(function(_GlobalData_, _$rootScope_){
            GlobalData = _GlobalData_;
            $rootScope = _$rootScope_;
        });

    });

    describe('setLanguage()', function () {

        it('should notify translate service', function(){
            var newLang = 'de';
            GlobalData.setLanguage(newLang);
            //expect(mockedTranslate.use).toHaveBeenCalledWith(newLang);
            expect(mockedCookieSvc.setLanguageCookie).toHaveBeenCalled();
        });

        it('should update global data to current language', function () {
            var newLang = 'de';
            GlobalData.setLanguage(newLang);
            expect(GlobalData.getLanguageCode()).toEqualData(newLang);
        });

        it('to non-default language should update accept-languages', function () {
            var newLang = 'de';
            GlobalData.setLanguage(newLang);
            expect(GlobalData.getAcceptLanguages()).toEqualData('de;q=1,en;q=0.5');
        });

        it('to default language should set accept-language to default', function () {
            var newLang = defaultLang;
            GlobalData.setLanguage(newLang);
            expect(GlobalData.getAcceptLanguages()).toEqualData(newLang);
        });

    });


    describe('setCurrency()', function(){
        var newCur = 'EUR';
        var currencyEventSpy;

        beforeEach(function(){
            currencyEventSpy =  jasmine.createSpy();
            $rootScope.$on('currency:updated', currencyEventSpy);
            GlobalData.setAvailableCurrencies([{id:'EUR'}, {id:'USD'}]);
            GlobalData.setCurrency(newCur);
        });

        it('should set the currency as cookie', function(){
            var update = 'USD';
            GlobalData.setCurrency(update);
            expect(mockedCookieSvc.setCurrencyCookie).toHaveBeenCalledWith(update);
        });

        it('should raise event <<currency:updated>> if currency changed', function(){
            expect(currencyEventSpy).toHaveBeenCalled();
        });

        it('should set the store currency', function(){
            expect(GlobalData.getCurrencyId()).toEqualData(newCur);
        });

        it('should return the correct currency symbol', function(){
            var curSymbol = GlobalData.getCurrencySymbol();
            expect(curSymbol).toEqualData('\u20AC');
        });

        it('should reject the currency update if currency not among available currencies', function(){
           GlobalData.setCurrency('pl');
            expect(GlobalData.getCurrencyId()).toEqualData(newCur);

        });


    });


});

