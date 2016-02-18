var fs = require('fs');
var tu = require('./protractor-utils.js');

describe("cart:", function () {

    beforeEach(function () {
        browser.manage().deleteAllCookies();
        // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
        browser.driver.manage().window().setSize(1200, 1100);
        browser.get(tu.tenant + '/#!/ct/');
        // browser.switchTo().alert().then(
        //     function (alert) { alert.dismiss(); },
        //     function (err) { }
        // );
    });

    afterEach(function () {
        //dismisses any alerts left open
        browser.switchTo().alert().then(
            function (alert) {
                alert.dismiss();
            },
            function (err) {
            }
        );
    });

    describe("verify cart functionality", function () {


        it('should load one product into cart', function () {
            tu.loadProductIntoCartAndVerifyCart('1', '$20.62');
            tu.clickElement('id', tu.removeFromCart);
            browser.wait(function () {
                return element(by.xpath("//*[@id='cart']/div/div[2]")).isDisplayed(); //checks to see if cart text is displayed
            });
            expect(element(by.xpath("//*[@id='cart']/div/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
        });

        it('should load one product into cart in Euros', function () {
            browser.wait(function () {
                return element(by.xpath(tu.whiteCoffeeMug)).isPresent();
            });
            browser.sleep(500);
            tu.clickElement('xpath', tu.whiteCoffeeMug);
            tu.switchSite('Sushi Demo Store Germany');
            var category = element(by.repeater('top_category in categories').row(1).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            tu.loadProductIntoCartAndVerifyCart('1', '€12.99');
            tu.clickElement('id', tu.removeFromCart);
            browser.wait(function () {
                return element(by.xpath("//div[@id='cart']/div/div[2]")).isDisplayed();
            });
            expect(element(by.xpath("//div[@id='cart']/div/div[2]")).getText()).toEqual('IHR WARENKORB IST LEER');
        });

        it('should load one product into cart in USD and change to Euros', function () {
            tu.loadProductIntoCartAndVerifyCart('1', '$20.62');
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            browser.sleep(1000);
            tu.switchSite('Sushi Demo Store Germany');
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            browser.sleep(1000);
            tu.verifyCartTotal('€12.99');
        });

        it('should load multiple products into cart', function () {
            tu.loadProductIntoCartAndVerifyCart('1', '$20.62');
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            // must hover before click
            var category = element(by.repeater('top_category in categories').row(1).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            browser.wait(function () {
                return element(by.xpath(tu.whiteThermos)).isDisplayed();
            });
            tu.clickElement('xpath', tu.whiteThermos);
            browser.sleep(200);
            tu.clickElement('id', tu.buyButton);
            browser.sleep(5500);
            browser.wait(function () {
                return element(by.id(tu.cartButtonId)).isDisplayed();
            });
            browser.sleep(1000);
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            browser.sleep(500);
            tu.verifyCartTotal("$36.66");
        });


        it('should update quantity', function () {
            tu.loadProductIntoCartAndVerifyCart('1', '$20.62');
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            browser.sleep(250);
            tu.clickElement('id', tu.buyButton);
            browser.sleep(5000);
            browser.wait(function () {
                return element(by.id(tu.cartButtonId)).isDisplayed();
            });
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            browser.sleep(1000);
            tu.verifyCartAmount('2');
            browser.sleep(2000);
            tu.verifyCartTotal('$32.04');
            tu.sendKeys('xpath', tu.cartQuantity, '5');
            tu.clickElement('binding', 'EST_ORDER_TOTAL');
            browser.sleep(1000);
            tu.clickElement('binding', 'EST_ORDER_TOTAL');
            browser.sleep(1000);
            tu.verifyCartAmount("5");
            tu.verifyCartTotal("$60.28");
            tu.sendKeys('xpath', tu.cartQuantity, '10');
            tu.clickElement('binding', 'EST_ORDER_TOTAL');
            browser.sleep(1000);
            tu.clickElement('binding', 'EST_ORDER_TOTAL');
            browser.sleep(1000);
            tu.verifyCartAmount("10");
            tu.verifyCartTotal("$115.24");
        });

        it('should not add out of stock item', function () {
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            expect(element(by.binding('CART_EMPTY')).getText()).toEqual('YOUR CART IS EMPTY');
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            browser.wait(function () {
                return element(by.xpath(tu.blackCoffeeMug)).isDisplayed();
            });
            tu.clickElement('xpath', tu.blackCoffeeMug);
            browser.wait(function () {
                return element(by.id('out-of-stock-btn')).isDisplayed();
            });
            tu.clickElement('id', 'out-of-stock-btn');
            browser.sleep(500);
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            expect(element(by.binding('CART_EMPTY')).getText()).toEqual('YOUR CART IS EMPTY');
        });

        it('should retrieve previous cart', function () {
            tu.loginHelper('cart@hybristest.com', 'password'); //existing user with previous cart
            tu.clickElement('id', tu.cartButtonId);
            browser.sleep(250);
            tu.verifyCartTotal('$13.47');
        });

        it('should calculate taxes', function () {
            browser.wait(function () {
                return element(by.xpath(tu.whiteCoffeeMug)).isPresent();
            });
            browser.sleep(500);
            tu.clickElement('xpath', tu.whiteCoffeeMug);
            tu.switchSite('Avalara');
            var category = element(by.repeater('top_category in categories').row(1).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            tu.loadProductIntoCartAndVerifyCart('1', '$10.67');
            tu.clickElement('binding', 'ESTIMATE_TAX');
            tu.sendKeys('id', 'zipCode', '98101');
            tu.clickElement('id', 'country');
            tu.selectOption('US');
            tu.clickElement('id', 'apply-btn');
            //expect(element(by.binding('cart.totalTax.amount ')).getText()).toEqual('$1.85');
            expect(element(by.binding('cart.totalTax.amount ')).isPresent()).toBe(true);

        });

        xit('should automatically close when mousing off', function () {
            tu.loadProductIntoCartAndVerifyCart('1', '$10.67');
            browser.driver.actions().mouseMove(element(by.binding('item.product.name'))).perform();
            // wait over 3 seconds 
            browser.sleep(4500);
            browser.driver.actions().mouseMove(element(by.css('div.content-mask'))).perform();
            expect(element(by.binding('CONTINUE_SHOPPING')).isDisplayed()).toBe(false);
        });

    });
});

