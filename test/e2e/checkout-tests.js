var fs = require('fs');
var tu = require('./protractor-utils.js');

var date = Date();
var month = date.substr(4, 3);
var d = new Date();
var curr_date = d.getDate();
var curr_year = d.getFullYear();
var currentDate = month + " " + curr_date + ", " + curr_year;
var timestamp = Number(new Date());

function continueAsGuest() {
    tu.clickElement('binding', 'CONTINUE_AS_GUEST');
}

function fillCheckoutFormExceptEmail(form) {
    browser.wait(function () {
        return element(by.id('address1' + form)).isPresent();
    });
    browser.sleep(500);
    element(by.id('country' + form)).sendKeys('USA');
    element(by.id('state' + form)).sendKeys('colorado');
    tu.sendKeys('id', 'zipCode' + form, '80301');
    tu.sendKeys('id', 'address1' + form, '123');
    tu.sendKeys('id', 'address2' + form, '321');
    tu.sendKeys('id', 'city' + form, 'Boulder');
}


function verifyCartContents(itemPrice, totalPrice, quantity) {

    tu.sendKeys('id', 'email', 'mike@yaastest.com');
    tu.sendKeys('id', 'firstNameAccount', 'Mike');
    tu.sendKeys('id', 'lastNameAccount', 'Night');
    element(by.id('titleAccount')).sendKeys('Mr.');
    fillCheckoutFormExceptEmail('Bill');
    browser.executeScript('window.scrollTo(0, document.body.scrollHeight)').then(function () {
        browser.sleep(2000);
        tu.clickElement('id', 'preview-order-btn');
    });
    browser.sleep(2000);
    browser.executeScript('window.scrollTo(0, ' + 1200 + ');').then(function () {
        browser.sleep(2000);
        expect(element(by.xpath('/html/body/div/div[2]/div[2]/div/div/div/div/ng-form/div[1]/div/div/section[2]/div/div/div[2]/div[2]/span')).getText()).toContain(itemPrice); //xpath for price per first item
        expect(element(by.xpath('/html/body/div/div[2]/div[2]/div/div/div/div/ng-form/div[1]/div/div/section[1]/div[2]')).getText()).toContain(totalPrice); //xpath for complete price
        expect(element(by.xpath("/html/body/div/div[2]/div[2]/div/div/div/div/ng-form/div[1]/div/div/section[2]/div/div/div[2]/div[3]/div/span")).getText()).toContain(quantity); //xpath for quantity of first product;
    });



}

function validateField(field, form, text, buttonType, button) {
    element(by.id(field + form)).clear();
    tu.clickElement(buttonType, button);
    browser.sleep(500);
    browser.executeScript("document.getElementById('" + field + form + "').style.display='block';"); //forces 2nd input to display after error
    browser.sleep(200);
    tu.sendKeys('id', field + form, text);
}

function verifyValidationForEachField(form, elementType, button) {
    validateField('zipCode', form, '80301', elementType, button);
    validateField('contactName', form, 'Mike Night', elementType, button);
    validateField('address1', form, '123', elementType, button);
    validateField('city', form, 'Boulder', elementType, button);

}


function loginAndContinueToCheckout(account) {
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


// not validated yet - selectors may not be accurate - TODO
function verifyOrderOnAccountPageMobile(account, total) {
    tu.clickElement('id', tu.removeFromCart);
    tu.clickElement('id', tu.contineShopping);
    tu.loginHelper(account, 'password');
    tu.clickElement('id', 'my-account-dropdown');
    tu.clickElement('id', 'my-account');
    tu.waitForAccountPage();
    expect(element(by.repeater('m_order in orders').row(0).column('m_order.created')).getText()).toContain(currentDate);
    expect(element(by.repeater('m_order in orders').row(0).column('m_order.totalPrice')).getText()).toEqual(total);
    expect(element(by.repeater('m_order in orders').row(0).column('m_order.status')).getText()).toEqual("Created");
    element(by.repeater('m_order in orders').row(0).column('m_order.created')).click();
    expect(element(by.repeater('m_order in orders').row(0).column('m_order.status')).getText()).toEqual("Created");
    tu.clickElement('id', "logout-btn");
}

function verifyOrderOnAccountPageBigScreen(account, total) {
    tu.clickElement('id', tu.contineShopping);
    tu.loginHelper(account, 'password');
    tu.clickElement('id', 'my-account-dropdown');
    tu.clickElement('id', 'my-account');
    tu.waitForAccountPage();
    expect(element(by.repeater('xrder in orders').row(0).column('xrder.created')).getText()).toContain(currentDate);
    expect(element(by.repeater('xrder in orders').row(0).column('xrder.totalPrice')).getText()).toEqual(total);
    expect(element(by.repeater('xrder in orders').row(0).column('xrder.status')).getText()).toEqual("CREATED");
    element(by.repeater('xrder in orders').row(0).column('xrder.created')).click();
    expect(element(by.repeater('xrder in orders').row(0).column('xrder.status')).getText()).toEqual("CREATED");
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
            browser.driver.manage().window().setSize(1100, 1200);
            browser.get(tu.tenant + '/#!/products/55d76ce63a0eafb30e5540c8/');
            browser.switchTo().alert().then(
                function (alert) {
                    alert.dismiss();
                },
                function (err) {
                }
            );
            browser.wait(function () {
                return element(by.id(tu.buyButton)).isPresent();
            });
            tu.clickElement('id', tu.buyButton);
            //wait for cart to close
            browser.sleep(6500);
            browser.wait(function () {
                return element(by.id(tu.cartButtonId)).isDisplayed();
            });
            browser.sleep(1000);
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            browser.sleep(2000);
        });

        //dumps logs, if there are failing services uncomment
        // afterEach(function() {
        //   browser.manage().logs().get('browser').then(function(browserLog) {
        //     console.log('log: ' + require('util').inspect(browserLog));
        //   });
        // });


        it('should load one product into cart and move to checkout', function () {
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            verifyCartContents('$10.67', '$20.62', '1');

        });

         //Comment out this test as back to checkout is not available anymore for now
         xit('should update cart quantity on checkout page', function () {
            var backToCheckoutButton = "//div[@id='cart']/div[2]/button";
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            verifyCartContents('$10.67', '$20.62', '1');
            tu.clickElement('id', 'checkout-cart-btn');
            browser.wait(function () {
                return element(by.binding('BACK_TO_CHECKOUT')).isPresent();
            });
            tu.sendKeys('xpath', "//input[@type='number']", '5');
            tu.clickElement('binding', 'BACK_TO_CHECKOUT');
            verifyCartContents('$10.67', '$57.08', '5');
        });

        it('should load 2 of one product into cart and move to checkout', function () {
            tu.sendKeys('xpath', tu.cartQuantity, '2');
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            browser.wait(function () {
                return element(by.binding("ORDER_TOTAL")).isPresent();
            });
            verifyCartContents('$10.67', '$32.04', '2');
        });

        it('should load 2 different products into cart and move to checkout', function () {
            tu.clickElement('id', tu.contineShopping);
            var category = element(by.repeater('top_category in categories').row(1).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
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
            verifyCartContents('$10.67', '$36.66', '1');
        });

        it('should display tax overide on cart checkout and order', function () {
            tu.clickElement('id', tu.removeFromCart);
            tu.clickElement('id', tu.contineShopping);
            var category = element(by.repeater('top_category in categories').row(2).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            browser.wait(function () {
                return element(by.xpath(tu.rollerPen)).isPresent();
            });
            tu.clickElement('xpath', tu.rollerPen);
            browser.wait(function () {
                return element(by.id(tu.buyButton)).isPresent();
            });
            tu.clickElement('id', tu.buyButton);
            //wait for cart to close
            browser.sleep(5000);
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            browser.sleep(1000);
            //expect(element(by.repeater('taxLine in cart.taxAggregate.lines').row(0)).getText()).toEqual('TAX $0.23');
            expect(element(by.repeater('taxLine in cart.taxAggregate.lines').row(1)).getText()).toEqual('10.01% FOR PROTRACTOR $0.20');
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            ////TODO Find out why protractor won't recognize binding and repeaters on checkout
            //expect(element(by.xpath('//div/div/div[1]/div/section[3]/table/tbody/tr[3]/td[1]')).getText()).toEqual('10.01% FOR PROTRACTOR');
            //expect(element(by.xpath('//div/div/div[1]/div/section[3]/table/tbody/tr[3]/td[2]')).getText()).toEqual('$0.20');
            tu.sendKeys('id', 'email', 'mike@yaastest.com');
            tu.sendKeys('id', 'firstNameAccount', 'Mike');
            tu.sendKeys('id', 'lastNameAccount', 'Night');
            fillCheckoutFormExceptEmail('Bill');
            browser.executeScript('window.scrollTo(0, document.body.scrollHeight)').then(function () {
                browser.sleep(2000);
                tu.clickElement('id', 'preview-order-btn');
            });
            ////TODO Find out why protractor won't recognize binding and repeaters on checkout
            expect(element(by.xpath('//div/div/ng-form/div[1]/div/div/section[3]/table/tbody/tr[4]/td[1]')).getText()).toEqual('10.01% FOR PROTRACTOR');
            expect(element(by.xpath('//div/div/ng-form/div[1]/div/div/section[3]/table/tbody/tr[4]/td[2]')).getText()).toEqual('$0.20');
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            tu.clickElement('id', 'place-order-btn');
            tu.verifyOrderConfirmation('mike@yaastest.com', 'MIKE NIGHT', '123', 'BOULDER, CO 80301', '$1.99');
            expect(element(by.binding('taxLine.name')).getText()).toEqual('10.01% FOR PROTRACTOR');
            expect(element(by.binding('taxLine.amount')).getText()).toEqual('$0.60');
        });


        it('should allow all fields to be editable', function () {
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            fillCheckoutFormExceptEmail('Bill');
            tu.sendKeys('id', 'email', 'mike@hybristest.com');
            tu.sendKeys('id', 'firstNameAccount', 'Mike');
            tu.sendKeys('id', 'lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            browser.sleep(500);
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeys('id', 'contactNameShip', 'Mike Night');
            fillCheckoutFormExceptEmail('Ship');
            tu.clickElement('id', 'preview-order-btn');
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            tu.clickElement('id', 'place-order-btn');
            tu.verifyOrderConfirmation('mike@hybristest.com', 'MIKE NIGHT', '123', 'BOULDER, CO 80301', '$10.67');
        });


        it('should allow user to create account after checkout', function () {
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            fillCheckoutFormExceptEmail('Bill');
            tu.sendKeys('id', 'email', 'checkoutacct' + timestamp + '@hybristest.com');
            tu.sendKeys('id', 'firstNameAccount', 'Mike');
            tu.sendKeys('id', 'lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            browser.sleep(500);
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeys('id', 'contactNameShip', 'Mike Night');
            fillCheckoutFormExceptEmail('Ship');
            tu.clickElement('id', 'preview-order-btn');
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            tu.clickElement('id', 'place-order-btn');
            tu.verifyOrderConfirmation('checkoutacct', 'MIKE NIGHT', '123', 'BOULDER, CO 80301', '$10.67');
            tu.sendKeys('id', 'newPasswordInput', 'password');
            tu.clickElement('id', 'create-acct-btn');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            expect(element(by.binding("account.contactEmail")).getText()).toContain('checkoutacct');
        });

        it('should have basic validation on all fields', function () {
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            fillCheckoutFormExceptEmail('Bill');
            tu.sendKeys('id', 'email', 'mike@place.com');
            tu.sendKeys('id', 'firstNameAccount', 'Mike');
            tu.sendKeys('id', 'lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            browser.executeScript('window.scrollTo(0, document.body.scrollHeight)').then(function () {
                browser.sleep(2000);
                tu.clickElement('id', 'preview-order-btn');
            });
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            //// TODO - verify how the address fields from Bill form could be validated after GA changes
            //verifyValidationForEachField('Bill', 'id', 'place-order-btn');
            validateField('email', '', 'mike@hybristest.com', 'id', 'place-order-btn');
            browser.sleep(500);
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeys('id', 'contactNameShip', 'Mike Night');
            fillCheckoutFormExceptEmail('Ship');
            verifyValidationForEachField('Ship', 'id', 'preview-order-btn');
            browser.sleep(200);
            tu.clickElement('id', 'preview-order-btn');
            validateField('cvc', '', '00', 'id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            expect(element(by.binding('PLEASE_ENTER_VALID_CODE')).getText()).toContain('Please enter a valid code');
            browser.executeScript("document.getElementById('cvc').style.display='block';");
            validateField('cvc', '', '123', 'id', 'place-order-btn');
            validateField('ccNumber', '', '0000000000000000', 'id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            browser.executeScript("document.getElementById('ccNumber').style.display='block';");
            validateField('ccNumber', '', '5555555555554444', 'id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            tu.verifyOrderConfirmation('MIKE@HYBRISTEST.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301', '$10.67');
        });

        it('should allow user to select address', function () {
            loginAndContinueToCheckout('address@hybristest.com');
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
            loginAndContinueToCheckout('order@hybristest.com');
            browser.executeScript('window.scrollTo(0, document.body.scrollHeight)').then(function () {
                browser.sleep(2000);
                tu.clickElement('id', 'preview-order-btn');
            });
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            browser.sleep(500);
            tu.clickElement('id', 'place-order-btn');
            tu.verifyOrderConfirmation('order@hybristest.com', 'MIKE', '123', 'BOULDER, CO 80301', '$10.67');
            tu.clickElement('binding', 'orderInfo.orderId');
            expect(element(by.binding('order.shippingAddress.contactName')).getText()).toContain("123 fake street");
        });

        it('should create order on account page', function () {
            tu.removeItemFromCart();
            verifyOrderOnAccountPageBigScreen(tu.accountWithOrderEmail, '$20.62');
        });

        // This test is skipped for now, defect KIWIS-2511 opened
        xit('should checkout in Euros', function () {
            tu.clickElement('id', tu.contineShopping);
            browser.sleep(1000);
            tu.switchSite('Sushi Demo Store Germany');
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            browser.sleep(2000);
            loginAndContinueToCheckout('euro-order@hybristest.com');
            browser.executeScript('window.scrollTo(0, document.body.scrollHeight)').then(function () {
                browser.sleep(2000);
                tu.clickElement('id', 'preview-order-btn');
            });
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            browser.sleep(500);
            tu.clickElement('id', 'place-order-btn');
            tu.verifyOrderConfirmation('euro-order@hybristest.com', 'MIKE', '123', 'MUNICH, 80301', '€12.94');
            tu.clickElement('binding', 'orderInfo.orderId');
            expect(element(by.binding('order.shippingAddress.contactName')).getText()).toContain("123 fake street");
        });

        // This test is skipped for now, defect KIWIS-2511 opened
        xit('should create order on account page in Euros', function () {
            tu.removeItemFromCart();
            verifyOrderOnAccountPageBigScreen('euro-order@hybristest.com', '€12.99');
        });

        it('should merge carts and checkout for logged in user', function () {
            tu.clickElement('id', tu.contineShopping);
            tu.loginHelper('checkout@hybristest.com', 'password');
            browser.driver.actions().mouseMove(element(by.repeater('top_category in categories').row(1).column('top_category.name'))).perform();
            browser.sleep(200);
            element(by.repeater('top_category in categories').row(1).column('top_category.name')).click();
            tu.clickElement('xpath', tu.whiteThermos);
            browser.wait(function () {
                return element(by.id(tu.buyButton)).isPresent();
            });
            tu.clickElement('id', tu.buyButton);
            //wait for cart to close
            browser.sleep(6500);
            browser.wait(function () {
                return element(by.id(tu.cartButtonId)).isDisplayed();
            });
            browser.sleep(1000);
            tu.clickElement('id', tu.cartButtonId);
            browser.wait(function () {
                return element(by.binding('CHECKOUT')).isPresent();
            });
            browser.sleep(1000);
            tu.clickElement('binding', 'CHECKOUT');
            //verifyCartContents('$10.67', '$27.46', '1'); -- commented out for now, need to evaluate if needed
            browser.executeScript('window.scrollTo(0, document.body.scrollHeight)').then(function () {
                browser.sleep(2000);
                tu.clickElement('id', 'preview-order-btn');
            });
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            browser.sleep(500);
            tu.clickElement('id', 'place-order-btn');
            //browser.sleep(20000);
            tu.verifyOrderConfirmation('CHECKOUT@HYBRISTEST.COM', 'CHECKOUT', '123', 'BOULDERADO, CO 80800', '$25.66');
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
            browser.get(tu.tenant + '/#!/products/55d76ce63a0eafb30e5540c8/');
            browser.switchTo().alert().then(
                function (alert) {
                    alert.accept();
                },
                function (err) {
                }
            );
            browser.sleep(500);
            tu.clickElement('id', tu.buyButton);
            //wait for cart to close
            browser.sleep(6000);
            browser.wait(function () {
                return element(by.id('mobile-cart-btn')).isDisplayed();
            });
            tu.clickElement('id', 'mobile-cart-btn');
            tu.waitForCart();
            browser.sleep(2000);
            tu.clickElement('binding', 'CHECKOUT');
            clickOnModal();
            tu.sendKeys('id', 'email', 'mike@hybristest.com');
            tu.sendKeys('id', 'firstNameAccount', 'Mike');
            tu.sendKeys('id', 'lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            fillCheckoutFormExceptEmail('Bill');

        });

        var continueButton1 = '//div[6]/button';
        var continueButton2 = '//div[5]/button';
        var paymentButton = "//button[@type='submit']";


        it('should allow all fields to be editable on mobile', function () {
            tu.clickElement('xpath', continueButton1);
            browser.sleep(500);
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeys('id', 'contactNameShip', 'Mike Night');
            fillCheckoutFormExceptEmail('Ship');
            tu.clickElement('xpath', continueButton2);
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            tu.clickElement('xpath', paymentButton);
            tu.clickElement('id', "place-order-btn");
            tu.verifyOrderConfirmation('MIKE@HYBRISTEST.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301', '$10.67');
        });

        it('should have basic validation on mobile', function () {
            verifyValidationForEachField('Bill', 'xpath', continueButton1);
            validateField('email', '', 'mike@hybristest.com', 'xpath', continueButton1);
            tu.clickElement('xpath', continueButton1);
            browser.sleep(500);
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeys('id', 'contactNameShip', 'Mike Night');
            fillCheckoutFormExceptEmail('Ship');
            verifyValidationForEachField('Ship', 'xpath', continueButton2);
            tu.clickElement('xpath', continueButton2);
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            tu.clickElement('xpath', paymentButton);
            tu.clickElement('id', "place-order-btn");
            tu.verifyOrderConfirmation('MIKE@HYBRISTEST.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301', '$10.67');
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
