var fs = require('fs');
var tu = require('./protractor-utils.js');


describe('coupons:', function () {

	function addProductandApplyCoupon(couponCode, price) {
            tu.loadProductIntoCart('1', price);
            tu.clickElement('linkText', 'ADD COUPON CODE');
            tu.sendKeys('id', 'coupon-code', couponCode);
            tu.clickElement('id', 'apply-coupon');
	}

    function verifyCartDetails(cartAmount, totalAmount, discountAmount){
            tu.verifyCartAmount(cartAmount);
            tu.verifyCartTotal(totalAmount);
            tu.verifyCartDiscount(discountAmount);
    }

    function removeFromCart() {
            tu.clickElement('id', tu.removeFromCart);
            browser.wait(function () {
                return element(by.xpath("//div[@id='cart']/div/div[2]")).isDisplayed();
            });
            expect(element(by.xpath("//div[@id='cart']/div/div[2]")).getText()).toEqual('YOUR CART IS EMPTY');
    };

    function couponCheckoutTest(couponCode, price) {
            var category =  element(by.repeater('top_category in categories').row(1).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            addProductandApplyCoupon(couponCode, price);
            tu.clickElement('binding', 'CHECKOUT');
            browser.wait(function () {
                return element(by.id("ccNumber")).isPresent();
            });
            tu.sendKeys('id', 'firstNameAccount', 'Mike');
            tu.sendKeys('id', 'lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            tu.fillCreditCardForm('5555555555554444', '06', '2019', '000');
            browser.sleep(500);
            tu.clickElement('id', 'place-order-btn');
    }

    describe('verify coupons', function () {

        beforeEach(function () {
            browser.manage().deleteAllCookies();
            browser.driver.manage().window().setSize(1000, 1000);
            browser.get(tu.tenant + '/#!/ct/');
            browser.switchTo().alert().then(
                function (alert) { alert.accept(); },
                function (err) { }
            );
        });

        it('should not allow user to add coupon if not logged in', function () {
        	tu.loadProductIntoCart('1', '$14.92');
        	tu.clickElement('linkText', 'ADD COUPON CODE');
            tu.sendKeys('id', 'coupon-code', '10PERCENT');
            tu.clickElement('id', 'apply-coupon');
            expect(element(by.binding('couponErrorMessage')).getText()).toEqual('SIGN IN TO USE COUPON CODE');
        });

        it('should not allow user to add coupon below minimum on cart', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            tu.loadProductIntoCart('1', '$14.92');
            tu.clickElement('linkText', 'ADD COUPON CODE');
            tu.sendKeys('id', 'coupon-code', '20MINIMUM');
            tu.clickElement('id', 'apply-coupon');
            expect(element(by.binding('couponErrorMessage')).getText()).toEqual('THE ORDER VALUE IS TOO LOW FOR THIS COUPON.');
            browser.sleep(1000);
            removeFromCart();
            browser.sleep(500);
        });

        it('should not allow user to add coupon with incorrect currency', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            browser.wait(function () {
                return element(by.xpath(tu.whiteCoffeeMug)).isPresent();
            });
            browser.sleep(500);
            tu.clickElement('xpath', tu.whiteCoffeeMug);
            tu.switchSite('Sushi Demo Store Germany');
            var category =  element(by.repeater('top_category in categories').row(1).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            tu.loadProductIntoCart('1', '€18.89');
            tu.clickElement('linkText', 'COUPONCODE HINZUFÜGEN');
            tu.sendKeys('id', 'coupon-code', '10DOLLAR');
            tu.clickElement('id', 'apply-coupon');
            expect(element(by.binding('couponErrorMessage')).getText()).toEqual('WÄHRUNG FÜR COUPON UNGÜLTIG');
            browser.sleep(1000);
            tu.clickElement('id', tu.removeFromCart);
            browser.sleep(500);
        });

        it('should not allow other customers to use specific coupon', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            tu.loadProductIntoCart('1', '$14.92');
            tu.clickElement('linkText', 'ADD COUPON CODE');
            tu.sendKeys('id', 'coupon-code', 'SPECIFIC');
            tu.clickElement('id', 'apply-coupon');
            expect(element(by.binding('couponErrorMessage')).getText()).toEqual('COUPON NOT VALID');
            browser.sleep(1000);
            removeFromCart();
            browser.sleep(500);
        });

        it('should add percentage off coupon on cart', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            addProductandApplyCoupon('10PERCENT', '$14.92');
            verifyCartDetails('1', '$13.77', '-$1.07');
            tu.clickElement('id', 'remove-coupon');
            removeFromCart();
        });

        it('should add dollar off coupon on cart', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            addProductandApplyCoupon('10DOLLAR', '$14.92');
            verifyCartDetails('1', '$4.22', '-$10.00');
            tu.clickElement('id', 'remove-coupon');
            removeFromCart();
        });

        it('update coupon totals when item is added and removed from cart', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            addProductandApplyCoupon('10PERCENT', '$14.92');
            verifyCartDetails('1', '$13.77', '-$1.07');
            tu.clickElement('id', 'continue-shopping');
            var category =  element(by.repeater('top_category in categories').row(1).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            browser.sleep(250);
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
            verifyCartDetails('1', '$28.21', '-$2.57');
            tu.clickElement('id', tu.removeFromCart);
            verifyCartDetails('1', '$17.93', '-$1.50');
            browser.sleep(1000);
            tu.clickElement('id', 'remove-coupon');
            removeFromCart();
            browser.sleep(500);

        });

        it('should update coupon totals when quantity is changed', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            addProductandApplyCoupon('10PERCENT', '$14.92');
            verifyCartDetails('1', '$13.77', '-$1.07');
            tu.sendKeys('xpath', tu.cartQuantity, '5');
            tu.clickElement('binding', 'EST_ORDER_TOTAL');
            browser.sleep(1000);
            verifyCartDetails('5', '$54.87', '-$5.34');
            tu.clickElement('id', 'remove-coupon');
            removeFromCart();
        });
    
        it('should remove coupon on cart', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            addProductandApplyCoupon('10PERCENT', '$14.92');
            verifyCartDetails('1', '$13.77', '-$1.07');
            tu.clickElement('id', 'remove-coupon')
            tu.verifyCartAmount('1');
            tu.verifyCartTotal('$14.92');
            removeFromCart();
        });

        it('should not allow user to use expired coupon on cart', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            addProductandApplyCoupon('EXPIRED', '$14.92');
            expect(element(by.binding('couponErrorMessage')).getText()).toEqual('COUPON HAS EXPIRED.');
            removeFromCart();
        });


        it('should not allow purchase under minimum at checkout', function () {
            tu.createAccount('coupontestmin1');
            tu.populateAddress('0', 'Coupon Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
            browser.sleep(1000);
            var category =  element(by.repeater('top_category in categories').row(1).column('category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            tu.loadProductIntoCart('1', '$14.92');
            tu.clickElement('binding', 'CHECKOUT');
            browser.wait(function () {
                return element(by.id("ccNumber")).isPresent();
            });
            tu.sendKeys('id', 'firstNameAccount', 'Mike');
            tu.sendKeys('id', 'lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            tu.clickElement('linkText', 'Add Coupon Code');
            tu.sendKeys('id', 'coupon-code', '20MINIMUM');
            tu.clickElement('id', 'apply-coupon');
            browser.wait(function () {
                return element(by.binding('couponErrorMessage')).isPresent();
            });
            expect(element(by.binding('couponErrorMessage')).getText()).toContain('The order value is too low for this coupon.');

        });

        it('should allow purchase over minimum', function () {
            tu.createAccount('coupontestmin2');
            tu.populateAddress('0', 'Coupon Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
            couponCheckoutTest('MINIMUM', '$14.92');
            tu.verifyOrderConfirmation('COUPONTEST', 'COUPON TEST', '123', 'BOULDER, CO 80301', '$10.67');
            expect(element(by.css('span.error.ng-binding')).getText()).toEqual('-$0.53');
        });

        it('should allow coupon larger than purchase price', function () {
            tu.createAccount('coupontestmax2');
            tu.populateAddress('0', 'Coupon Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
            couponCheckoutTest('20DOLLAR', '$14.92');
            tu.verifyOrderConfirmation('COUPONTEST', 'COUPON TEST', '123', 'BOULDER, CO 80301', '$10.67');
            expect(element(by.css('span.error.ng-binding')).getText()).toEqual('-$10.67');
        });

        it('should allow percentage off on checkout', function () {
            tu.createAccount('coupontestpercent');
            tu.populateAddress('0', 'Coupon Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
            couponCheckoutTest('10PERCENT', '$14.92');
            tu.verifyOrderConfirmation('COUPONTEST', 'COUPON TEST', '123', 'BOULDER, CO 80301', '$10.67');
            expect(element(by.css('span.error.ng-binding')).getText()).toEqual('-$1.07');
        });

        it('should allow dollar off on checkout', function () {
            tu.createAccount('coupontestdollar');
            tu.populateAddress('0', 'Coupon Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
            couponCheckoutTest('10DOLLAR', '$14.92');
            tu.verifyOrderConfirmation('COUPONTEST', 'COUPON TEST', '123', 'BOULDER, CO 80301', '$10.67');
            expect(element(by.css('span.error.ng-binding')).getText()).toEqual('-$10.00');
        });

        xit('should allow customer to use specific coupon', function () {
            tu.loginHelper('specific@hybristest.com', 'password');
            couponCheckoutTest('SPECIFIC', '$14.92');
            tu.verifyOrderConfirmation('SPECIFIC', 'SPECIFIC PERSON', '123', 'BOULDER, CO 80301', '$10.67');
            expect(element(by.css('span.error.ng-binding')).getText()).toEqual('-$2.13');
        });

        xit('should allow euro off on checkout', function () {
            tu.createAccount('coupontesteuro');
            tu.populateAddress('0', 'Coupon Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
            tu.selectCurrency('EURO');
            couponCheckoutTest('5EURO', '€7.99');
            tu.verifyOrderConfirmation('COUPONTEST', 'COUPON TEST', '123', 'BOULDER, CO 80301', '€7.99');
            expect(element(by.css('span.error.ng-binding')).getText()).toEqual('-€5.00');
        });
    });
}); 

