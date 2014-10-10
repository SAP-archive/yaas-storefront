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
            //$provide.value('$translate', mockedTranslate);
            $provide.constant('storeConfig', {defaultLanguage: defaultLang});
            $provide.constant('')
        });

        inject(function(_GlobalData_){
            GlobalData = _GlobalData_;

        });

    });

    describe('setLanguage()', function () {

        it('should notify translate service', function(){
            var newLang = 'de';
            GlobalData.setLanguage(newLang);
            //expect(mockedTranslate.use).toHaveBeenCalledWith(newLang);
            expect(mockedCookieSvc.setLanguageCookie).toHaveBeenCalled();
        });

        it('should update global data current language', function () {
            var newLang = 'de';
            GlobalData.setLanguage(newLang);
            expect(GlobalData.languageCode).toEqualData(newLang);
            var curLang = GlobalData.getLanguageCode();
            expect(curLang).toEqualData(newLang);
        });

        it('to non-default language should update accept-languages', function () {
            var newLang = 'de';
            GlobalData.setLanguage(newLang);
            expect(GlobalData.acceptLanguages).toEqualData('de;q=1,en;q=0.5');
        });

        it('to default language should set accept-language to default', function () {
            var newLang = defaultLang;
            GlobalData.setLanguage(newLang);
            expect(GlobalData.acceptLanguages).toEqualData(newLang);
        });

    });


    describe('setCurrency()', function(){
        var newCur = 'EUR';

        beforeEach(function(){
            GlobalData.setCurrency(newCur);
        });

        it('should set the currency as cookie', function(){

            expect(mockedCookieSvc.setCurrencyCookie).toHaveBeenCalled();
        });

        it('should set the store currency', function(){
            expect(GlobalData.storeCurrency).toEqualData(newCur);
        });

        it('should return the correct currency symbol', function(){
            var curSymbol = GlobalData.getCurrencySymbol();
            expect(curSymbol).toEqualData('\u20AC');
        })
    });


});

