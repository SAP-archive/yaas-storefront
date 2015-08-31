/**
 * Created by i839794 on 10/8/14.
 */

describe('GlobalData', function () {

    var mockedCookieSvc = {
        setLanguageCookie: jasmine.createSpy()
    };

    var GlobalData = null;
    var defaultLang = 'en';
    var $rootScope, $translate, translateSettings;
    var appConfig = {
        storeTenant: function () { return '121212'; },
        dynamicDomain: function () { return 'dynDomain' },
        clientId: function () { return '1234ABC' },
        redirectURI: function () { return 'http://google.com' }
    };

    beforeEach(function () {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        module('ds.i18n');
        module('ds.shared');

        module(function ($provide) {
            $provide.value('CookieSvc', mockedCookieSvc);

            $provide.constant('appConfig', appConfig);

        });

        inject(function (_GlobalData_, _$rootScope_, _$translate_, _translateSettings_) {
            GlobalData = _GlobalData_;
            $rootScope = _$rootScope_;
            $translate = _$translate_;
            translateSettings = _translateSettings_;
        });
        spyOn($translate, 'use');

    });

    describe('setLanguage()', function () {

        beforeEach(function () {

            GlobalData.setLanguage('en', '');
            //GlobalData.setDefaultLanguage({ id: 'en', label: 'English' });
            GlobalData.setAvailableLanguages([{ id: 'en', label: 'English'}, { id: 'de', label: 'Deutsch' }, { id: 'fr', label: 'Français' }]);
        });

        it('should apply supported language in translate service', function () {
            var newLang = 'de';
            GlobalData.setLanguage(newLang);
            expect($translate.use).toHaveBeenCalledWith(newLang);
            expect(mockedCookieSvc.setLanguageCookie).toHaveBeenCalled();
        });


        it('should use default language for unsupported language', function () {
            var newLang = 'fr';
            GlobalData.setLanguage(newLang);
            expect($translate.use).toHaveBeenCalledWith('en');
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

    describe('setAvailableLanguage()', function () {
        it('should return the same language', function () {
            var langs = [{ id: 'kl', label: 'Klingon' }];

            GlobalData.setLanguage('kl', '');
            //GlobalData.setDefaultLanguage({ id: 'kl', label: 'Klingon' });
            GlobalData.setAvailableLanguages(langs);
            var out = GlobalData.getAvailableLanguages();
            expect(out).toEqualData(langs);
        });
    });

    describe('loadInitialLanguage()', function () {
        var defaultLangCode = 'fr';

        beforeEach(function () {
            GlobalData.setDefaultLanguage({ id: defaultLangCode, label: 'French'});
            GlobalData.setAvailableLanguages([{ id: defaultLangCode, label: 'French' }, { id: 'kl', label: 'Klingon' }]);
        });

        it('should use the cookie language if set', function () {
            var cookieLang = 'kl';
            mockedCookieSvc.getLanguageCookie = jasmine.createSpy().andReturn({ languageCode: cookieLang });
            GlobalData.loadInitialLanguage();
            expect(GlobalData.getLanguageCode()).toEqualData(cookieLang);
        });

        it('should use default language if cookie not set', function () {
            mockedCookieSvc.getLanguageCookie = jasmine.createSpy().andReturn(null);
            GlobalData.loadInitialLanguage();
            expect(GlobalData.getLanguageCode()).toEqualData(defaultLangCode);
        });
    });

});

