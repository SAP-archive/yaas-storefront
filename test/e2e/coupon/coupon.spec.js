'use strict';

var desktopSiteConfig = require('../config/desktop-site.json');

var TI = require('./coupon.test-input.json');
var utils = require('../utils/utils.js');
var CouponPageObject = require('./coupon.po.js');
var CartPageObject = require('../cart/cart.po.js');
var ProductDetailsPageObject = require('../product/product-details.po.js');
var AccountPageObject = require('../account/account.po.js');
var SitePageObject = require('../site/site.po.js');
var CheckoutPageObject = require('../checkout/checkout.po.js');
var ConfirmationPageObject = require('../confirmation/confirmation.po.js');


describe('Coupon Tests :', function () {

    var cartPO,
        productDetailsPO,
        accountPO,
        sitePO,
        couponPO,
        checkoutPO,
        confirmationPO;

    var testCoupons = TI.coupons;
    var whiteCoffeeMug = TI.whiteCoffeeMug;
    var testUsers = TI.users;

    var isMobile = false;
    var isLoggedIn = true;
    var openModal = true;

    describe('coupon', function () {

        beforeEach(function () {
            utils.deleteCookies();

            utils.setWindowSize(desktopSiteConfig.windowDetails.width, desktopSiteConfig.windowDetails.height);

            cartPO = new CartPageObject();
            couponPO = new CouponPageObject();
            productDetailsPO = new ProductDetailsPageObject();
            accountPO = new AccountPageObject();
            sitePO = new SitePageObject();
            checkoutPO = new CheckoutPageObject();
            confirmationPO = new ConfirmationPageObject();
        });

        it('should not allow user to add certain coupons if not logged in', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceUS);

            couponPO.applyCoupon(testCoupons.signedIn.name);

            expect(couponPO.getErrorMessage()).toEqual(testCoupons.signedIn.errorMessageEN);
        });

        it('should not allow user to add coupon below minimum', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceUS);

            couponPO.applyCoupon(testCoupons.twentyMinimum.name);

            expect(couponPO.getErrorMessage()).toEqual(testCoupons.twentyMinimum.errorMessageEN);

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.emptyCartMessage.EN);
        });

        it('should not allow user to add coupon with incorrect currency', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            sitePO.waitForSiteSelector();

            sitePO.setSite(TI.sites.SushiGermany);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceDE);

            couponPO.applyCoupon(testCoupons.tenDollar.name);

            expect(couponPO.getErrorMessage()).toEqual(testCoupons.tenDollar.errorMessageDE);

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.emptyCartMessage.DE);
        });

        it('should not allow other customers to use specific coupon', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            accountPO.loginUser(testUsers.couponUser);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceUS);

            couponPO.applyCoupon(testCoupons.specific.name);

            expect(couponPO.getErrorMessage()).toEqual(testCoupons.specific.errorMessageEN);

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.emptyCartMessage.EN);
        });

        it('should add percentage off coupon', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceUS);

            couponPO.applyCoupon(testCoupons.tenPercent.name);

            expect(cartPO.getCartTotalAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.differenceUS);

            couponPO.removeCoupon();

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.emptyCartMessage.EN);
        });

        it('should add dollar off coupon on cart', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();
            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceUS);

            couponPO.applyCoupon(testCoupons.tenDollar.name);

            expect(cartPO.getCartTotalAmount()).toEqual(testCoupons.tenDollar.whiteCoffeeMug.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(testCoupons.tenDollar.whiteCoffeeMug.differenceUS);

            couponPO.removeCoupon();

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.emptyCartMessage.EN);
        });

        it('update coupon totals when an item is added and removed', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();
            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceUS);

            couponPO.applyCoupon(testCoupons.tenPercent.name);

            expect(cartPO.getCartTotalAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.differenceUS);

            cartPO.continueShopping();

            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(TI.whiteCoffeeMug.two.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(TI.whiteCoffeeMug.two.discountUS);

            couponPO.removeCoupon();

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.emptyCartMessage.EN);
        });

        it('should update coupon totals when quantity is changed', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();
            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceUS);

            couponPO.applyCoupon(testCoupons.tenPercent.name);

            expect(cartPO.getCartTotalAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.differenceUS);

            cartPO.updateItemQuantity(5);

            expect(cartPO.getCartTotalAmount()).toEqual(TI.whiteCoffeeMug.five.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(TI.whiteCoffeeMug.five.discountUS);

            couponPO.removeCoupon();

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.emptyCartMessage.EN);
        });

        it('should remove coupon', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();
            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceUS);

            couponPO.applyCoupon(testCoupons.tenPercent.name);

            expect(cartPO.getCartTotalAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.differenceUS);

            couponPO.removeCoupon();

            expect(cartPO.getCartItemQuantity()).toEqual('1');

            expect(cartPO.getCartTotalAmount()).toEqual(TI.whiteCoffeeMug.one.priceUS);

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.emptyCartMessage.EN);
        });

        it('should not allow user to use expired coupon', function () {
            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(whiteCoffeeMug.one.priceUS);

            couponPO.applyCoupon(testCoupons.expired.name);

            expect(couponPO.getErrorMessage()).toEqual(testCoupons.expired.errorMessageEN);

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.emptyCartMessage.EN);

        });

        it('should allow purchase over minimum', function () {
            sitePO.getHomePage();

            accountPO.createAccount(testUsers.couponTestUser,openModal);

            accountPO.accountDetails.getPage();

            accountPO.populateAddress(testUsers.couponTestUser.address);

            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);
            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();

            couponPO.applyCoupon(testCoupons.minimum.name);

            expect(cartPO.getCartTotalAmount()).toEqual(testCoupons.minimum.whiteCoffeeMug.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(testCoupons.minimum.whiteCoffeeMug.differenceUS);

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForCreditCardField();

            checkoutPO.fillNameFields(TI.selectModel,testUsers.main.name);

            checkoutPO.goToPreviewOrder();

            expect(checkoutPO.orderPreview.getTotalPrice()).toContain(testCoupons.minimum.whiteCoffeeMug.priceUS);
            expect(checkoutPO.orderPreview.getTotalDiscount()).toContain(testCoupons.minimum.whiteCoffeeMug.differenceUS);

            checkoutPO.fillCreditCardFields(TI.creditCard);
            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.couponTestUser,testCoupons.minimum.whiteCoffeeMug.priceUS,isMobile);

            expect(confirmationPO.getTotalDiscount()).toEqual(testCoupons.minimum.whiteCoffeeMug.differenceUS);
        });

        it('should allow coupon larger than purchase price', function () {
            sitePO.getHomePage();

            accountPO.createAccount(testUsers.couponTestUser,openModal);

            accountPO.accountDetails.getPage();

            accountPO.populateAddress(testUsers.couponTestUser.address);

            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);
            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();

            couponPO.applyCoupon(testCoupons.twentyDollar.name);

            expect(cartPO.getCartTotalAmount()).toEqual(testCoupons.twentyDollar.whiteCoffeeMug.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(testCoupons.twentyDollar.whiteCoffeeMug.differenceUS);

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForCreditCardField();

            checkoutPO.fillNameFields(TI.selectModel, testUsers.main.name);

            checkoutPO.goToPreviewOrder();

            expect(checkoutPO.orderPreview.getTotalPrice()).toContain(testCoupons.twentyDollar.whiteCoffeeMug.priceUS);
            expect(checkoutPO.orderPreview.getTotalDiscount()).toContain(testCoupons.twentyDollar.whiteCoffeeMug.differenceUS);

            checkoutPO.fillCreditCardFields(TI.creditCard);
            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.couponTestUser,testCoupons.twentyDollar.whiteCoffeeMug.priceUS,isMobile);

            expect(confirmationPO.getTotalDiscount()).toEqual(testCoupons.twentyDollar.whiteCoffeeMug.differenceUS);

        });

        it('should allow percentage off on checkout', function () {
            sitePO.getHomePage();

            accountPO.createAccount(testUsers.couponTestUser,openModal);

            accountPO.accountDetails.getPage();

            accountPO.populateAddress(testUsers.couponTestUser.address);

            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);
            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();

            couponPO.applyCoupon(testCoupons.tenPercent.name);

            expect(cartPO.getCartTotalAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.differenceUS);

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForCreditCardField();

            checkoutPO.fillNameFields(TI.selectModel, testUsers.main.name);

            checkoutPO.goToPreviewOrder();

            expect(checkoutPO.orderPreview.getTotalPrice()).toContain(testCoupons.tenPercent.whiteCoffeeMug.priceUS);
            expect(checkoutPO.orderPreview.getTotalDiscount()).toContain(testCoupons.tenPercent.whiteCoffeeMug.differenceUS);

            checkoutPO.fillCreditCardFields(TI.creditCard);
            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.couponTestUser,testCoupons.tenPercent.whiteCoffeeMug.priceUS,isMobile);

            expect(confirmationPO.getTotalDiscount()).toEqual(testCoupons.tenPercent.whiteCoffeeMug.differenceUS);
        });

        it('should allow dollar off on checkout', function () {
            sitePO.getHomePage();

            accountPO.createAccount(testUsers.couponTestUser,openModal);

            accountPO.accountDetails.getPage();
            
            accountPO.populateAddress(testUsers.couponTestUser.address);

            productDetailsPO.get(whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);
            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);

            cartPO.waitUntilCartTotalIsDisplayed();

            couponPO.applyCoupon(testCoupons.tenDollar.name);

            expect(cartPO.getCartTotalAmount()).toEqual(testCoupons.tenDollar.whiteCoffeeMug.priceUS);
            expect(cartPO.getCartDiscountAmount()).toEqual(testCoupons.tenDollar.whiteCoffeeMug.differenceUS);

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForCreditCardField();

            checkoutPO.fillNameFields(TI.selectModel, testUsers.main.name);

            browser.executeScript('window.scrollTo(0, document.body.scrollHeight)').then(function () {
                checkoutPO.goToPreviewOrder();
            });

            expect(checkoutPO.orderPreview.getTotalPrice()).toContain(testCoupons.tenDollar.whiteCoffeeMug.priceUS);
            expect(checkoutPO.orderPreview.getTotalDiscount()).toContain(testCoupons.tenDollar.whiteCoffeeMug.differenceUS);

            checkoutPO.fillCreditCardFields(TI.creditCard);
            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.couponTestUser,testCoupons.tenDollar.whiteCoffeeMug.priceUS,isMobile);
            
            expect(confirmationPO.getTotalDiscount()).toEqual(testCoupons.tenDollar.whiteCoffeeMug.differenceUS);
        });
    });
});
