var fs = require('fs');

exports.whiteCoffeeMug = "//a[contains(@href, '/products/5436f99f5acee4d3c910c082/')]";
exports.blackCoffeeMug = "//a[contains(@href, '/products/5436f9a25acee4d3c910c085/')]";
exports.whiteThermos = "//a[contains(@href, '/products/5436f9a43cceb8a938129170/')]";
var beerMugPath = "//a[contains(@href, '/products/5436f9f23cceb8a9381291a2/')]";
exports.beerBug = beerMugPath;
exports.cartButtonId = 'full-cart-btn';
exports.buyButton = "buy-button";
exports.contineShopping = "continue-shopping";
exports.removeFromCart = "remove-product";
exports.productDescriptionBind = 'product.description';
exports.backToTopButton = 'to-top-btn';
exports.cartQuantity = "(//input[@type='number'])[2]";
exports.outOfStockButton = "//div[3]/button";
exports.tenant = 'ytvlw4f7ebox';
exports.accountWithOrderEmail = 'order@test.com';


exports.waitForCart = function(){
    browser.wait(function () {
        return element(by.binding('CHECKOUT')).isPresent();
    });
};

exports.verifyCartAmount = function (amount) {
    expect(element(by.xpath("(//input[@type='number'])[2]")).getAttribute("value")).toEqual(amount);
};

exports.verifyCartTotal = function (total) {
    expect(element(by.css("th.text-right.ng-binding")).getText()).toEqual(total);
};

exports.waitForAccountPage = function(){
    browser.wait(function () {
        return element(by.binding('WELCOME')).isPresent();
    });
};

exports.writeHtml = function (data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'utf8'));
    stream.end();
};

var clickElement = exports.clickElement = function (type, pageElement) {
    if (type === 'id') {
        element(by.id(pageElement)).click();
    } else if (type === 'xpath') {
        element(by.xpath(pageElement)).click();
    } else if (type === 'css') {
        element(by.css(pageElement)).click();
    } else if (type === 'linkText') {
        element(by.linkText(pageElement)).click();
    } else if (type === 'binding') {
        element(by.binding(pageElement)).click();
    }
};

exports.scrollToBottomOfProducts = function (end) {
    var deferred = protractor.promise.defer();
    var maxCount = 10;
    var count = 0;
    while (count < maxCount) {
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
        count++;
        if (element(by.xpath(beerMugPath)).isPresent()) {
            deferred.fulfill();
        } else if (count === maxCount) {
            deferred.reject();
        }
    }
    return deferred.promise;
};

exports.getTextByRepeaterRow = function findProductByRepeaterRow(number) {
    expect(element(by.repeater('product in products').row(number).column('product.name')).getText());
};

exports.clickByRepeaterRow = function (number) {
    element(by.repeater('product in products').row(number).column('product.name')).click();
};

var assertTextByRepeaterRow = exports.assertProductByRepeaterRow = function (number, productName) {
    expect(element(by.repeater('product in products').row(number).column('product.name')).getText()).toEqual(productName);
};

var selectOption = exports.selectOption = function (option) {
    element(by.css('select option[value="' + option + '"]')).click()
};

exports.sortAndVerifyPagination = function (sort, product1, price1) {
    selectOption(sort);
    browser.sleep(250);
    assertTextByRepeaterRow(0, product1);
    expect(element(by.repeater('product in products').row(0).column('prices[product.id].value')).getText()).toEqual(price1);
};

exports.sendKeysByXpath = function (pageElement, keys) {
    element(by.xpath(pageElement)).clear();
    element(by.xpath(pageElement)).sendKeys(keys);
};

exports.sendKeysById = function (pageElement, keys) {
    element(by.id(pageElement)).clear();
    element(by.id(pageElement)).sendKeys(keys);
};

exports.selectLanguage = function (language) {
    clickElement('id', 'language-select');
    clickElement('linkText', language);
};



var sendKeys = exports.sendKeys = function (type, pageElement, keys) {
    if (type === 'id') {
        element(by.id(pageElement)).clear();
        element(by.id(pageElement)).sendKeys(keys);
    } else if (type === 'xpath') {
        element(by.xpath(pageElement)).clear();
        element(by.xpath(pageElement)).sendKeys(keys);
    } else if (type === 'css') {
        element(by.css(pageElement)).clear();
        element(by.css(pageElement)).sendKeys(keys);
    } else if (type === 'linkText') {
        element(by.linkText(pageElement)).clear();
        element(by.linkText(pageElement)).sendKeys(keys);
    } else if (type === 'binding') {
        element(by.binding(pageElement)).clear();
        element(by.binding(pageElement)).sendKeys(keys);
    }

};

exports.selectCurrency = function (currency) {
    clickElement('id', 'currency-select');
    /* CURRENCY SELECTION DOES NOT WORK IN CHROME - elements not clickable.
    if(currency === 'US Dollar'){
        browser.driver.actions().mouseMove(element(by.linkText(currency))).perform();
        browser.sleep(4000);
    } else {
       sendKeys('linkText', 'US Dollar', 40);
        browser.sleep(4000);
    }*/

    clickElement('linkText', currency);
}

exports.loginHelper = function (userName, password) {
    // need to activate link first in real browser via hover
    browser.driver.actions().mouseMove(element(by.binding('SIGN_IN'))).perform();
    browser.sleep(200);
    clickElement('id', "login-btn");
    browser.wait(function () {
        return element(by.binding('SIGN_IN')).isPresent();
    });
    sendKeys('id', 'usernameInput', userName);
    sendKeys('id', 'passwordInput', password);
    clickElement('id', 'sign-in-button');
    browser.sleep(1000);
}

