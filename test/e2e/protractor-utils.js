var fs = require('fs');
var tu = require('./protractor-utils.js');

exports.whiteCoffeeMug = "//a[contains(@href, '/products/55d76ce63a0eafb30e5540c8/')]";
exports.blackCoffeeMug = "//a[contains(@href, '/products/55d76cec264ebd7a318c236c/')]";
exports.whiteThermos = "//a[contains(@href, '/products/55d76cf53a0eafb30e5540cc/')]";
exports.rollerPen = "//a[contains(@href, '/products/55d76d19264ebd7a318c237e/')]";
exports.beerBug = "//a[contains(@href, '/products/5436f9e75acee4d3c910c0b5/')]";
exports.cartButtonId = 'full-cart-btn';
exports.buyButton = "buy-button";
exports.siteSelectorButton = 'siteSelectorButton';
exports.contineShopping = "continue-shopping";
exports.removeFromCart = "remove-product";
exports.productDescriptionBind = 'product.description';
exports.backToTopButton = 'to-top-btn';
exports.cartQuantity = "(//input[@type='number'])[2]";
exports.outOfStockButton = "//div[3]/button";
exports.tenant = 'bsdqa';
exports.accountWithOrderEmail = 'order@hybristest.com';

exports.waitForCart = function () {
    browser.wait(function () {
        return element(by.binding('CHECKOUT')).isPresent();
    });
    //even after element is present, may not be clickable
    browser.sleep(500);
};

exports.verifyCartAmount = function (amount) {
    browser.wait(function () {
        return element(by.binding('CHECKOUT')).isPresent();
    });
    expect(element(by.xpath("(//input[@type='number'])[2]")).getAttribute("value")).toEqual(amount);
};

exports.verifyCartTotal = function (total) {
    browser.wait(function () {
        return element(by.binding('cart.totalPrice.amount')).isPresent();
    });
    expect(element(by.binding('cart.totalPrice.amount')).getText()).toEqual(total);
};

exports.verifyCartDiscount = function (amount) {
    browser.wait(function () {
        return element(by.css('span.error.ng-binding')).isPresent();
    });
    expect(element(by.css('span.error.ng-binding')).getText()).toEqual(amount);
};

exports.waitForAccountPage = function () {
    browser.wait(function () {
        return element(by.binding('ACCOUNT_DETAILS')).isPresent();
    });
};

exports.writeHtml = function (data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'utf8'));
    stream.end();
};

exports.clickElement = function (type, pageElement) {
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
        browser.sleep(500);
        count++;
        if (element(by.xpath(tu.beerBug)).isPresent()) {
            deferred.fulfill();
        } else if (count === maxCount) {
            deferred.reject();
        }
    }
    return deferred.promise;
};

exports.getTextByRepeaterRow = function (number) {
    expect(element(by.repeater('product in products').row(number).column('product.name')).getText());
};

exports.clickByRepeaterRow = function (number) {
    element(by.repeater('product in products').row(number).column('product.name')).click();
};

exports.assertProductByRepeaterRow = function (number, productName) {
    expect(element(by.repeater('product in products').row(number).column('product.name')).getText()).toEqual(productName);
};

exports.selectOption = function (option) {
    element(by.css('select option[value="' + option + '"]')).click()
};

exports.sortAndVerifyPagination = function (sort, product1, price1) {
    tu.selectOption(sort);
    browser.sleep(250);
    tu.assertProductByRepeaterRow(0, product1);
    expect(element(by.repeater('product in products').row(0).column('prices[product.product.id].effectiveAmount')).getText()).toEqual(price1);
};

exports.selectLanguage = function (language) {
    var currentLanguage = element(by.binding('language.selected.value'));
    browser.driver.actions().mouseMove(currentLanguage).perform();
    currentLanguage.click();
    var newLanguage = element(by.repeater('lang in languages').row(1));
    browser.wait(function () {
        return newLanguage.isPresent();
    });
    browser.driver.actions().mouseMove(newLanguage).perform();
    expect(element(by.repeater('lang in languages').row(1)).getText()).toEqual(language);
    newLanguage.click();
};


exports.sendKeys = function (type, pageElement, keys) {
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

exports.switchSite = function (site) {

    var siteSelector = element(by.css('#siteSelectorLarge .siteSelectorIcon'));
    browser.driver.actions().mouseMove(siteSelector).perform();
    siteSelector.click();
    browser.sleep(200);

    element.all(by.xpath('//*[@id="siteSelectorLarge"]/div/div/div/div/div/div[1]/ul/li')).each(function (currSite) {
        currSite.getText().then(function (text) {
            if (text == site) {
                currSite.click();
            }
        });
    });
};



exports.loginHelper = function (userName, password) {
    // need to activate link first in real browser via hover
    browser.driver.actions().mouseMove(element(by.binding('SIGN_IN'))).perform();
    browser.sleep(200);
    tu.clickElement('id', 'login-btn');
    browser.wait(function () {
        return element(by.binding('SIGN_IN')).isPresent();
    });
    tu.sendKeys('id', 'usernameInput', userName);
    tu.sendKeys('id', 'passwordInput', password);
    tu.clickElement('id', 'sign-in-button');
    browser.sleep(1000);
};

exports.loadProductIntoCartAndVerifyCart = function (cartAmount, cartTotal) {
    return tu.loadProductIntoCart(cartAmount, cartTotal, true)
};

exports.loadProductIntoCart = function(cartAmount, cartTotal, verify) {
    browser.wait(function () {
        return element(by.xpath(tu.whiteCoffeeMug)).isPresent();
    });
    browser.sleep(500);
    tu.clickElement('xpath', tu.whiteCoffeeMug);
    browser.wait(function () {
        return element(by.id(tu.buyButton)).isPresent();
    });
    tu.clickElement('id', tu.buyButton);
    //wait for cart to close
    browser.sleep(5500);
    browser.wait(function () {
        return element(by.id(tu.cartButtonId)).isDisplayed();
    });
    browser.sleep(1000);
    tu.clickElement('id', tu.cartButtonId);
    tu.waitForCart();
    browser.sleep(2000);
    if (verify) {
        tu.verifyCartAmount(cartAmount);
        tu.verifyCartTotal(cartTotal);
    }
}

//country is populated from localized-addresses.js
exports.populateAddress = function (country, contact, street, aptNumber, city, state, zip, phone) {
    tu.clickElement('id', "add-address-btn");
    browser.sleep(1000);
    // Now all the countries are presented in the ddlb, US is not anymore the first one
    element(by.cssContainingText('option', country)).click();
    //element(by.css('select option[value="' + country + '"]')).click();
    tu.sendKeys('id', 'contactName', contact);
    tu.sendKeys('id', 'street', street);
    tu.sendKeys('id', 'streetAppendix', aptNumber);
    tu.sendKeys('id', 'city', city);
    if (country === 'United States') {
        element(by.css('select option[value="' + state + '"]')).click();
    } else {
        element(by.id('state')).sendKeys(state);
    }

    tu.sendKeys('id', 'zipCode', zip);
    tu.sendKeys('id', 'contactPhone', phone);
    tu.clickElement('id', 'save-address-btn');
};

var timestamp = Number(new Date());

exports.createAccount = function (emailAddress) {
    tu.clickElement('id', 'login-btn');
    browser.sleep(1000);
    tu.clickElement('binding', 'CREATE_ACCOUNT');
    tu.sendKeys('id', 'emailInput', emailAddress + timestamp + '@yaastest.com');
    tu.sendKeys('id', 'newPasswordInput', 'password');
    tu.clickElement('id', 'create-acct-btn');
    browser.sleep(1000);
    tu.clickElement('id', 'my-account-dropdown');
    tu.clickElement('id', 'my-account');
    browser.sleep(1000);
};

exports.fillCreditCardForm = function (ccNumber, ccMonth, ccYear, cvcNumber) {
    tu.sendKeys('id', 'ccNumber', ccNumber);
    element(by.id('expMonth')).sendKeys(ccMonth);
    element(by.id('expYear')).sendKeys(ccYear);
    tu.sendKeys('id', 'cvc', cvcNumber);
};


exports.verifyOrderConfirmation = function (account, name, number, cityStateZip, price) {
    var email = account.toLowerCase();
    browser.wait(function () {
        return element(by.css('address > span.ng-binding')).isPresent();
    });
    browser.sleep(1000);
    expect(element(by.css('strong')).getText()).toContain(email);
    expect(element(by.binding('confirmationDetails.shippingAddressName')).getText()).toContain(name);
    expect(element(by.binding('confirmationDetails.shippingAddressStreetLine1')).getText()).toContain(number);
    expect(element(by.binding('confirmationDetails.shippingAddressCityStateZip')).getText()).toContain(cityStateZip);
    expect(element(by.binding('confirmationDetails.totalPrice')).getText()).toEqual(price);
};

exports.removeItemFromCart = function () {
    tu.clickElement('id', tu.removeFromCart);
    browser.wait(function () {
        return element(by.xpath("//div[@id='cart']/div/div[2]")).isDisplayed();
    });
    expect(element(by.xpath("//div[@id='cart']/div/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
};