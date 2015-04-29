var fs = require('fs');
var tu = require('./protractor-utils.js');


describe('product page', function () {

	function addProductandApplyCoupon(couponCode) {
            tu.loadProductIntoCart('1', '$10.67');
            tu.clickElement('linkText', 'ADD COUPON CODE');
            tu.sendKeysById('coupon-code', couponCode);
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

    function couponCheckoutTest(couponCode) {
            tu.createAccount('coupontest@hybristest.com');
            tu.populateAddress('Coupon Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
            var category =  element(by.repeater('category in categories').row(3).column('category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            addProductandApplyCoupon(couponCode);
            tu.clickElement('binding', 'CHECKOUT');
            browser.wait(function () {
                return element(by.id("ccNumber")).isPresent();
            });
            tu.sendKeysById('firstNameAccount', 'Mike');
            tu.sendKeysById('lastNameAccount', 'Night');
            element(by.id('titleAccount')).sendKeys('Mr.');
            tu.fillCreditCardForm('5555555555554444', '06', '2015', '000');
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
        	tu.loadProductIntoCart('1', '$10.67');
        	tu.clickElement('linkText', 'ADD COUPON CODE');
            tu.sendKeysById('coupon-code', '10PERCENT');
            tu.clickElement('id', 'apply-coupon');
            expect(element(by.binding('coupon.message.error')).getText()).toEqual('SIGN IN TO USE COUPON CODE');
        });

        it('should add percentage off coupon on cart', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            addProductandApplyCoupon('10PERCENT');
            verifyCartDetails('1', '$9.60', '-$1.07');
            removeFromCart();
        });

        it('should add dollar coupon on cart', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            addProductandApplyCoupon('10DOLLAR');
            verifyCartDetails('1', '$0.67', '-$10.00');
            removeFromCart();
        });

        it('should not allow user to use expired coupon on cart', function () {
            tu.loginHelper('coupon@hybristest.com', 'password');
            addProductandApplyCoupon('EXPIRED');
            expect(element(by.binding('coupon.message.error')).getText()).toEqual('EXPIRED');
            removeFromCart();
        });


        it('should not allow purchase under minimum', function () {
            couponCheckoutTest('20MINIMUM');
            expect(element(by.css('div.error.ng-scope > small.help-inline.has-error > span.error.ng-binding')).getText()).toEqual('The order value is too low for this coupon.');
        });

        it('should allow purchase over minimum', function () {
            couponCheckoutTest('MINIMUM');
            tu.verifyOrderConfirmation('COUPONTEST@HYBRISTEST.COM', 'COUPON TEST', '123', 'BOULDER, CO 80301', '$10.67');
            expect(element(by.css('span.error.ng-binding')).getText()).toEqual('-$0.53');
        });

        it('should allow percentage off on checkout', function () {
            couponCheckoutTest('10PERCENT');
            tu.verifyOrderConfirmation('COUPONTEST@HYBRISTEST.COM', 'COUPON TEST', '123', 'BOULDER, CO 80301', '$10.67');
            expect(element(by.css('span.error.ng-binding')).getText()).toEqual('-$1.07');
        });

        it('should allow dollar off on checkout', function () {
            couponCheckoutTest('10DOLLAR');
            tu.verifyOrderConfirmation('COUPONTEST@HYBRISTEST.COM', 'COUPON TEST', '123', 'BOULDER, CO 80301', '$10.67');
            expect(element(by.css('span.error.ng-binding')).getText()).toEqual('-$10.00');
        });
    });
}); 

