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

exports.refreshPage = function () {
    browser.refresh();
}

exports.selectOption = function (key, value) {
    var field = element.all(by.model(key)).first();
    var selectField = field.element(by.css('.ui-select-search'));
    field.click();
    selectField.clear();
    selectField.sendKeys(value);
    element.all(by.css('.ui-select-choices-row-inner span')).first().click();
};

