'use strict';

var utils = require('../utils/utils.js');

var SitePageObject = function () {

    var links = {
        desktopSiteOptions: element(by.css('#siteSelectorLarge .siteSelectorIcon')),
        currentLanguage: element(by.binding('language.selected.value'))
    };

    var buttons = {
        desktopSiteSelector: element(by.id('siteSelectorLarge'))
    };

    this.getHomePage = function () {
        browser.get(utils.tenant + '/#!/ct/');
    };

    this.setSite = function (site) {
        if(site.mode === 'Desktop') {
            links.desktopSiteOptions.click();
            var siteLink = element(by.cssContainingText('#siteSelectorLarge .regionControlList li', site.siteName));
            siteLink.click();
        }
    };

    this.waitForSiteSelector = function(mode) {
        browser.wait(function () {
            return buttons.desktopSiteSelector.isPresent();
        });
        browser.sleep(500); //Protactor fails to click the selector sometimes even with the wait
    };

    this.setLanguage = function (language) {
        links.currentLanguage.click();
        var newLanguage = element(by.repeater('lang in languages').row(1));
        browser.wait(function () {
            return newLanguage.isPresent();
        });
        browser.driver.actions().mouseMove(newLanguage).perform();
        expect(element(by.repeater('lang in languages').row(1)).getText()).toEqual(language);
        newLanguage.click();
    };
};

module.exports = SitePageObject;