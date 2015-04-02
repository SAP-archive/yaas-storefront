var fs = require('fs');
var tu = require('./protractor-utils.js');

var date = Date();
var month = date.substr(4, 3);
var d = new Date();
var curr_date = d.getDate();
var curr_year = d.getFullYear();
var currentDate = month + " " + curr_date + ", " + curr_year;

function continueAsGuest(){
    tu.clickElement('binding', 'CONTINUE_AS_GUEST');
}

function fillCheckoutFormExceptEmail(form) {
    // tu.sendKeysById('contactName' + form, 'Mike Night');
    browser.wait(function () {
        return element(by.id('address1' + form)).isPresent();
    });
    tu.sendKeysById('address1' + form, '123');
    tu.sendKeysById('address2' + form, '321');
    tu.sendKeysById('city' + form, 'Boulder');
    element(by.id('country' + form)).sendKeys('USA');
    element(by.id('state' + form)).sendKeys('colorado');
    tu.sendKeysById('zipCode' + form, '80301');
}

function verifyOrderConfirmation(email, name, number, cityStateZip) {
    browser.wait(function () {
        return element(by.css('address > span.ng-binding')).isPresent();
    });
    browser.sleep(1000);
    expect(element(by.css('address > span.ng-binding')).getText()).toContain(email);
    expect(element(by.xpath('//address[2]/span')).getText()).toContain(name);
    expect(element(by.xpath('//address[2]/span[2]')).getText()).toContain(number);
    expect(element(by.xpath('//address[2]/span[3]')).getText()).toContain(cityStateZip);
}


function verifyCartContents(itemPrice, totalPrice, quantity) {
    expect(element(by.xpath('//div[2]/div/section[2]/div/div/div[2]/div[2]/span')).getText()).toContain(itemPrice); //item price
    expect(element(by.xpath('//div[2]/div/section[3]/table/tfoot/tr/td[2]')).getText()).toContain(totalPrice);
    expect(element(by.xpath("//div[2]/div/section[2]/div/div/div[2]/div[3]/div/span")).getText()).toContain(quantity);

}

function validateField(field, form, text, buttonType, button) {
    element(by.id(field + form)).clear();
    tu.clickElement(buttonType, button);
    browser.executeScript("document.getElementById('" + field + form + "').style.display='block';");
    browser.sleep(200);
    tu.sendKeysById(field + form, text);
}

function verifyValidationForEachField(form, buttonType, button) {
    validateField('zipCode', form, '80301', buttonType, button);
    validateField('contactName', form, 'Mike Night', buttonType, button);
    validateField('address1', form, '123', buttonType, button);
    validateField('city', form, 'Boulder', buttonType, button);

}

function fillCreditCardForm(ccNumber, ccMonth, ccYear, cvcNumber) {
    tu.sendKeysById('ccNumber', ccNumber);
    element(by.id('expMonth')).sendKeys(ccMonth);
    element(by.id('expYear')).sendKeys(ccYear);
    tu.sendKeysById('cvc', cvcNumber);
}

function loginAndContinueToCheckout(account, capsAccount) {
    tu.clickElement('id', tu.contineShopping);
    browser.sleep(500);
    tu.loginHelper(account, 'password');
    browser.sleep(500);
    tu.clickElement('id', tu.cartButtonId);
    tu.waitForCart();
    browser.sleep(500);
    tu.clickElement('binding', 'CHECKOUT');
    browser.wait(function () {
        return element(by.id("ccNumber")).isPresent();
    });
}

function checkoutAsLoggedInUserTest(account, capsAccount) {
    loginAndContinueToCheckout(account, capsAccount);
    fillCreditCardForm('5555555555554444', '06', '2015', '000');
    browser.sleep(500);
    tu.clickElement('id', 'place-order-btn');
    verifyOrderConfirmation(capsAccount, 'MIKE', '123', 'BOULDER, CO 80301');
    tu.clickElement('binding', 'orderInfo.orderId');
    expect(element(by.binding('order.shippingAddress.contactName')).getText()).toContain("123 fake street");
    // tu.clickElement('id', "logout-btn");
}

// not validated yet - selectors may not be accurate - TODO
function verifyOrderOnAccountPageMobile(account, total) {
    tu.clickElement('id', tu.contineShopping);
    tu.loginHelper(account, 'password');
    tu.clickElement('css', 'img.user-avatar');
    tu.waitForAccountPage();
    expect(element(by.repeater('m_order in orders').row(0).column('m_order.created')).getText()).toContain(currentDate);
    expect(element(by.repeater('m_order in orders').row(0).column('m_order.totalPrice')).getText()).toEqual(total);
    expect(element(by.repeater('m_order in orders').row(0).column('m_order.status')).getText()).toEqual("CREATED");
    element(by.repeater('m_order in orders').row(0).column('m_order.created')).click();
    expect(element(by.repeater('m_order in orders').row(0).column('m_order.status')).getText()).toEqual("CREATED");
    tu.clickElement('id', "logout-btn");
}

function verifyOrderOnAccountPageBigScreen(account, total) {
    tu.clickElement('id', tu.contineShopping);
    tu.loginHelper(account, 'password');
    tu.clickElement('css', 'img.user-avatar');
    tu.waitForAccountPage();
    expect(element(by.repeater('xrder in orders').row(0).column('xrder.created')).getText()).toContain(currentDate);
    expect(element(by.repeater('xrder in orders').row(0).column('xrder.totalPrice')).getText()).toEqual(total);
    expect(element(by.repeater('xrder in orders').row(0).column('xrder.status')).getText()).toEqual("CREATED");
    element(by.repeater('xrder in orders').row(0).column('xrder.created')).click();
    expect(element(by.repeater('xrder in orders').row(0).column('xrder.status')).getText()).toEqual("CREATED");
    tu.clickElement('id', "logout-btn");
}

    function clickOnModal() {
            browser.wait(function () {
                return element(by.binding('CONTINUE_AS_GUEST')).isPresent();
            });
            tu.clickElement('binding', 'CONTINUE_AS_GUEST');
    }

describe("checkout:", function () {


    describe("verify checkout functionality", function () {

        beforeEach(function () {
            browser.manage().deleteAllCookies();
            browser.driver.manage().window().setSize(1200, 1200);
            browser.get(tu.tenant + '/#!/products/5502177da4ae283d1df57d04/');
            browser.switchTo().alert().then(
                function (alert) { alert.dismiss(); },
                function (err) { }
            );
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
        });


        it('should load one product into cart and move to checkout', function () {
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            verifyCartContents('$10.67', '$13.94', '1');
        });

        it('should update cart quantity on checkout page', function () {
            var backToCheckoutButton = "//div[@id='cart']/div[2]/button"
            var editCartButton = "(//span[@id='checkout-cart-btn'])[2]"
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal()
            verifyCartContents('$10.67', '$13.94', '1');
            tu.clickElement('xpath', editCartButton);
            browser.wait(function () {
                return element(by.binding('BACK_TO_CHECKOUT')).isPresent();
            });          
            tu.sendKeysByXpath("//input[@type='number']", '5');
            tu.clickElement('binding', 'BACK_TO_CHECKOUT');
            verifyCartContents('$10.67', '$56.62', '5');
        });

        it('should load 2 of one product into cart and move to checkout', function () {
            tu.sendKeysByXpath(tu.cartQuantity, '2');
            tu.clickElement('binding', 'CHECKOUT');         
            clickOnModal();
            browser.wait(function () {
                return element(by.binding("ORDER_TOTAL")).isPresent();
            });
            verifyCartContents('$10.67', '$24.61', '2');
        });

        it('should load 2 different products into cart and move to checkout', function () {
            tu.clickElement('id', tu.contineShopping);
            browser.wait(function () {
                return element(by.repeater('category in categories').row(1).column('category.name')).isPresent();
            });
            element(by.repeater('category in categories').row(1).column('category.name')).click();
            browser.wait(function () {
                return element(by.xpath(tu.whiteThermos)).isPresent();
            });
            tu.clickElement('xpath', tu.whiteThermos);
            browser.wait(function () {
                return element(by.id(tu.buyButton)).isPresent();
            });
            tu.clickElement('id', tu.buyButton);
            //wait for cart to close
            browser.sleep(5000);
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            browser.sleep(1000);
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            verifyCartContents('$10.67', '$28.93', '1');
        });

        it('should allow all fields to be editable', function () {
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            fillCheckoutFormExceptEmail('Bill');
            tu.sendKeysById('email', 'mike@hybristest.com');
            tu.sendKeysById('firstNameAccount', 'Mike');
            tu.sendKeysById('lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            browser.sleep(500);
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeysById('contactNameShip', 'Mike Night');
            fillCheckoutFormExceptEmail('Ship');
            fillCreditCardForm('5555555555554444', '06', '2015', '000');
            tu.clickElement('id', 'place-order-btn');
            verifyOrderConfirmation('MIKE@HYBRISTEST.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301');
        });

        it('should have basic validation on all fields', function () {
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            fillCheckoutFormExceptEmail('Bill');
            tu.sendKeysById('email', 'mike@place.com');
            tu.sendKeysById('firstNameAccount', 'Mike');
            tu.sendKeysById('lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            fillCreditCardForm('5555555555554444', '06', '2015', '000')
            verifyValidationForEachField('Bill', 'id', 'place-order-btn');
            validateField('email', '', 'mike@hybristest.com', 'id', 'place-order-btn');
            browser.sleep(500);
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeysById('contactNameShip', 'Mike Night');
            fillCheckoutFormExceptEmail('Ship');
            verifyValidationForEachField('Ship', 'id', 'place-order-btn');
            browser.sleep(200);
            validateField('cvc', '', '00', 'id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            expect(element(by.xpath('//div[2]/div[5]/div/small')).getText()).toContain('Please enter a valid code');
            browser.executeScript("document.getElementById('cvc').style.display='block';");
            validateField('cvc', '', '123', 'id', 'place-order-btn');
            validateField('ccNumber', '', '0000000000000000', 'id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            browser.executeScript("document.getElementById('ccNumber').style.display='block';");
            validateField('ccNumber', '', '5555555555554444', 'id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            verifyOrderConfirmation('MIKE@HYBRISTEST.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301');
        });

        it('should allow user to select address', function () {
            loginAndContinueToCheckout('address@hybristest.com', 'ADDRESS@HYBRISTEST.COM');
            expect(element(by.id('address1Bill')).getAttribute('value')).toEqual('123 Take out');
            tu.clickElement('id', 'select-address-btn-1');
            browser.wait(function () {
                return element(by.id('myModalLabel')).isPresent();
            });
            expect(element(by.repeater('address in addresses').row(0)).getText()).toContain('Shipping');
            expect(element(by.repeater('address in addresses').row(1)).getText()).toContain('Billing');
            var address2 = element(by.repeater('address in addresses').row(1).column('address.streetNumber'));
            address2.click();
            expect(element(by.id('address1Bill')).getAttribute('value')).toEqual('123 Dine in');
        });

        it('should populate with existing address for logged in user', function () {
            checkoutAsLoggedInUserTest('order@hybristest.com', 'ORDER@HYBRISTEST.COM');
        });

        it('should create order on account page', function () {
            verifyOrderOnAccountPageBigScreen(tu.accountWithOrderEmail, '$24.61');
        });

        it('should checkout in Euros', function () {
            checkoutAsLoggedInUserTest('euro-order@hybristest.com', 'EURO-ORDER@HYBRISTEST.COM');
        });

        it('should create order on account page in Euros', function () {
            verifyOrderOnAccountPageBigScreen('euro-order@hybristest.com', '€22.52');
        });

        it('should merge carts and checkout for logged in user', function () {
            tu.clickElement('id', tu.contineShopping);
            tu.loginHelper('checkout@hybristest.com', 'password');
            browser.driver.actions().mouseMove(element(by.repeater('category in categories').row(1).column('category.name'))).perform();
            browser.sleep(200);
            element(by.repeater('category in categories').row(1).column('category.name')).click();
            tu.clickElement('xpath', tu.whiteThermos);
            tu.clickElement('id', tu.buyButton);
            tu.waitForCart();
            browser.sleep(100);
            tu.clickElement('binding', 'CHECKOUT');
            verifyCartContents('$10.67', '$28.93', '1');
            fillCreditCardForm('5555555555554444', '06', '2015', '000');
            browser.sleep(500);
            tu.clickElement('id', 'place-order-btn');
            //browser.sleep(20000);
            verifyOrderConfirmation('CHECKOUT@HYBRISTEST.COM', 'CHECKOUT', '123', 'BOULDERADO, CO 80800');
            tu.clickElement('binding', 'orderInfo.orderId');
            expect(element(by.binding('order.shippingAddress.street')).getText()).toContain("123 fake place");
            // tu.clickElement('id', "logout-btn");
        });

    });
});

describe("mobile checkout:", function () {

    beforeEach(function () {
        browser.driver.manage().window().setSize(750, 1200);
    });

    describe("verify mobile checkout functionality", function () {

        beforeEach(function () {
            browser.manage().deleteAllCookies();
            browser.get(tu.tenant + '/#!/products/5502177da4ae283d1df57d04/');
            browser.switchTo().alert().then(
            function (alert) { alert.accept(); },
            function (err) { }
            );
        });

        var continueButton1 = '//div[16]/button'
        var continueButton2 = '//div[6]/button'
        var paymentButton = "//button[@type='submit']"


        it('should allow all fields to be editable on mobile', function () {
            browser.sleep(1000);
            tu.clickElement('id', tu.buyButton);
            //wait for cart to close
            browser.sleep(5000);
            browser.wait(function () {
                return element(by.id('mobile-cart-btn')).isDisplayed();
            });
            tu.clickElement('id', 'mobile-cart-btn');
            tu.waitForCart();
            browser.sleep(1000);
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal()
            tu.sendKeysById('email', 'mike@hybristest.com');
            tu.sendKeysById('firstNameAccount', 'Mike');
            tu.sendKeysById('lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            fillCheckoutFormExceptEmail('Bill');
            tu.clickElement('xpath', continueButton1);
            browser.sleep(500)
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeysById('contactNameShip', 'Mike Night');
            fillCheckoutFormExceptEmail('Ship');
            tu.clickElement('xpath', continueButton2);
            fillCreditCardForm('5555555555554444', '06', '2015', '000')
            tu.clickElement('xpath', paymentButton);
            tu.clickElement('id', "place-order-btn");
            verifyOrderConfirmation('MIKE@HYBRISTEST.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301');
        });

        it('should have basic validation on mobile', function () {
            tu.clickElement('id', tu.buyButton);
            //wait for cart to close
            browser.sleep(5000);
            browser.wait(function () {
                return element(by.id('mobile-cart-btn')).isDisplayed();
            });
            browser.sleep(1000);
            tu.clickElement('id', 'mobile-cart-btn');
            tu.waitForCart();
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal()
            tu.sendKeysById('email', 'mike@hybristest.com');
            tu.sendKeysById('firstNameAccount', 'Mike');
            tu.sendKeysById('lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            fillCheckoutFormExceptEmail('Bill');
            verifyValidationForEachField('Bill', 'xpath', continueButton1);
            validateField('email', '', 'mike@hybristest.com', 'xpath', continueButton1);
            tu.clickElement('xpath', continueButton1);
            browser.sleep(500)
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeysById('contactNameShip', 'Mike Night');
            fillCheckoutFormExceptEmail('Ship');
            verifyValidationForEachField('Ship', 'xpath', continueButton2);
            tu.clickElement('xpath', continueButton2);
            fillCreditCardForm('5555555555554444', '06', '2015', '000')
            tu.clickElement('xpath', paymentButton);
            tu.clickElement('id', "place-order-btn");
            verifyOrderConfirmation('MIKE@HYBRISTEST.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301');
        });

        // TODO - mobile login slightly more complex due to account drop-down
        xit('should create order on account page mobile', function () {
            verifyOrderOnAccountPageMobile('order@hybristest.com', '$24.61')
        });

        xit('should create order on account page in Euros mobile', function () {
            verifyOrderOnAccountPageMobile('euro-order@hybristest.com', '€22.52')
        });

    });
});
