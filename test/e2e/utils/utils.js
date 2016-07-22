'use strict';

exports.tenant = 'bsdqa';

exports.deleteCookies = function () {
    browser.manage().deleteAllCookies();
};

exports.scrollTo = function(elem) {
    browser.executeScript(function(elem) {
        elem.scrollIntoView();
    }, elem.getWebElement());
};

exports.setWindowSize = function (width, height) {
    browser.driver.manage().window().setSize(width, height);
};

exports.dumpBrowserConsoleLogs = function() {
    browser.manage().logs().get('browser').then(function(browserLog) {
        console.log('log: ' + require('util').inspect(browserLog));
    });
};

exports.scrollToProduct = function (prodEl) {
    var deferred = protractor.promise.defer();
    var maxCount = 10;
    var count = 0;
    while (count < maxCount) {
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
        browser.sleep(500);
        count++;
        if (element(by.xpath(prodEl)).isPresent()) {
            deferred.fulfill();
        } else if (count === maxCount) {
            deferred.reject();
        }
    }
    return deferred.promise;
};

exports.selectOption = function (key, value) {
    var field = element(by.model(key));
    var selectField = field.element(by.css('.ui-select-search'));
    field.click();
    selectField.clear();
    selectField.sendKeys(value);
    element.all(by.css('.ui-select-choices-row-inner span')).first().click();
};

