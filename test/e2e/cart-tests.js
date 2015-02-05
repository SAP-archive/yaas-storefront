var fs = require('fs');
var tu = require('./protractor-utils.js');



function loadProductIntoCart(cartAmount, cartTotal) {
    tu.clickElement('id', tu.cartButtonId);
    tu.waitForCart();
    expect(element(by.xpath("//div[@id='cart']/div/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
    tu.clickElement('binding', 'CONTINUE_SHOPPING');
    browser.wait(function () {
        return element(by.xpath(tu.whiteCoffeeMug)).isPresent();
    });
    tu.clickElement('xpath', tu.whiteCoffeeMug);
    browser.wait(function () {
        return element(by.id(tu.buyButton)).isPresent();
    });
    tu.clickElement('id', tu.buyButton);
    //wait for cart to close
    browser.sleep(4000);
    browser.wait(function () {
        return element(by.id(tu.cartButtonId)).isDisplayed();
    });
    tu.clickElement('id', tu.cartButtonId);
    tu.verifyCartAmount(cartAmount);
    tu.verifyCartTotal(cartTotal);
}


describe("cart:", function () {

        beforeEach(function () {
            browser.manage().deleteAllCookies();
            // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
            browser.driver.manage().window().setSize(1200, 1100);
            browser.get(tu.tenant + '/#!/ct/');
        });

    describe("verify cart functionality", function () {



        it('should load one product into cart', function () {
            loadProductIntoCart('1', '$10.67');
            tu.clickElement('id', tu.removeFromCart);
            browser.sleep(1000);
            expect(element(by.xpath("//div[@id='cart']/div/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
        });

        it('should load one product into cart in Euros', function () {
            tu.selectCurrency('EURO');
            loadProductIntoCart('1', '€7.99');
            tu.clickElement('id', tu.removeFromCart);
            browser.sleep(1000);
            expect(element(by.xpath("//div[@id='cart']/div/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
        });

        it('should load one product into cart in USD and change to Euros', function () {
            loadProductIntoCart('1', '$10.67');
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            tu.selectCurrency('EURO');
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart(); 
            tu.verifyCartTotal('€7.99');
        });

        it('should load one product into cart in USD and change to Euros while logged in', function () {
            loadProductIntoCart('1', '$10.67');
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            tu.loginHelper('currtest@hybristest.com', 'password');
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            tu.verifyCartTotal('€7.99');
            tu.clickElement('id', tu.removeFromCart);
        });

        it('should load multiple products into cart', function () {
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            expect(element(by.binding('CART_EMPTY')).getText()).toEqual('YOUR CART IS EMPTY');
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            browser.wait(function () {
                return element(by.xpath(tu.whiteCoffeeMug)).isDisplayed();
            });
            tu.clickElement('xpath', tu.whiteCoffeeMug);
            browser.wait(function () {
                return element(by.id(tu.buyButton)).isDisplayed();
            });
            tu.clickElement('id', tu.buyButton);
            //wait for cart to close
            browser.sleep(4000);
            browser.wait(function () {
                return element(by.id(tu.cartButtonId)).isDisplayed();
            });
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            browser.sleep(300);
            tu.verifyCartAmount("1");
            tu.verifyCartTotal("$10.67");
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            // must hover before click
            var category =  element(by.repeater('category in categories').row(1).column('category.name'))
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            browser.sleep(250);
            tu.clickElement('xpath', tu.whiteThermos);
            browser.sleep(200);
            tu.clickElement('id', tu.buyButton);
            tu.waitForCart();
            tu.verifyCartTotal("$20.65");
        });


        it('should update quantity', function () {
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            expect(element(by.binding('CART_EMPTY')).getText()).toEqual('YOUR CART IS EMPTY');
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            browser.sleep(250);
            tu.clickElement('xpath', tu.whiteCoffeeMug);
            tu.clickElement('id', tu.buyButton);
            //wait for cart to close
            browser.sleep(4000);
            browser.wait(function () {
                return element(by.id(tu.cartButtonId)).isDisplayed();
            });
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            tu.verifyCartAmount("1");
            tu.verifyCartTotal("$10.67");
            tu.clickElement('binding', 'CONTINUE_SHOPPING');
            browser.sleep(250);
            tu.clickElement('id', tu.buyButton);
            browser.sleep(4000);
            browser.wait(function () {
                return element(by.id(tu.cartButtonId)).isDisplayed();
            });
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            tu.verifyCartAmount('2');
            browser.sleep(1000);
            tu.verifyCartTotal('$21.34');
            tu.sendKeysByXpath(tu.cartQuantity, '5');
            tu.clickElement('binding', 'EST_ORDER_TOTAL');
            browser.sleep(1000);
            tu.clickElement('binding', 'EST_ORDER_TOTAL');
            browser.sleep(1000);
            tu.verifyCartAmount("5");
            tu.verifyCartTotal("$53.35");
            tu.sendKeysByXpath(tu.cartQuantity, '10');
            tu.clickElement('binding', 'EST_ORDER_TOTAL');
            browser.sleep(1000);
            tu.clickElement('binding', 'EST_ORDER_TOTAL');
            browser.sleep(1000);
            tu.verifyCartAmount("10");
            tu.verifyCartTotal("$106.70");
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
            tu.loginHelper('cart@test.com', 'password');
            tu.clickElement('id', tu.cartButtonId);
            browser.sleep(250);
            tu.verifyCartTotal('$7.99');
        });

        xit('should automatically close when mousing off', function () {
            loadProductIntoCart('1', '$10.67');
            browser.driver.actions().mouseMove(element(by.binding('item.product.name'))).perform();
            // wait over 3 seconds 
            browser.sleep(4000);
            browser.driver.actions().mouseMove(element(by.css('div.content-mask'))).perform();
            expect(element(by.binding('CONTINUE_SHOPPING')).isDisplayed()).toBe(false);
        });

    });
});

