/**
 * Created by i839794 on 10/8/14.
 */

describe('GlobalData', function () {


    var globalData,
        mockedCookieSvc = {
            setLanguageCookie: jasmine.createSpy()
        },
        mockedTranslate = {
            use: jasmine.createSpy()
        };
    var defaultLang = 'en';

    var mockedStoreConfig = {
        defaultLanguage: defaultLang
    };


    beforeEach(function() {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });

        module('ds.shared', function ($provide) {
            $provide.value('CookieSvc', mockedCookieSvc);
            $provide.value('$translate', mockedTranslate);
            $provide.constant('storeConfig', mockedStoreConfig);
        });

        inject(function (_GlobalData_) {
          globalData = _GlobalData_;
        });

    });

    describe('switchLanguage()', function () {

        it('should notify translate service', function () {
            console.log(globalData);
            var newLang = 'de';
            globalData.setLanguage(newLang);
            expect(mockedTranslate.use).toHaveBeenCalledWith(newLang);
            expect(mockedCookieSvc.setLanguageCookie).toHaveBeenCalled();
        });

        it('should update global data current language', function () {
            var newLang = 'de';
            globalData.setLanguage(newLang);
            expect(globalData.languageCode).toEqualData(newLang);
        });

        it('to non-default language should update accept-languages', function () {
            var newLang = 'de';
            globalData.setLanguage(newLang);
            expect(globalData.acceptLanguages).toEqualData('de;q=1,en;q=0.5');
        });

        it('to default language should set accept-language to default', function () {
            var newLang = defaultLang;
            globalData.setLanguage(newLang);
            expect(globalData.acceptLanguages).toEqualData(newLang);
        });


    });


});

