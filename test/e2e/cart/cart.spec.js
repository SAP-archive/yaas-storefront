'use strict';

var desktopSiteConfig = require('../config/desktop-site.json');

var TI = require('./cart.test-input.json');
var utils = require('../utils/utils.js');
var CartPageObject = require('./cart.po.js');
var ProductDetailsPageObject = require('../product/product-details.po.js');
var AccountPageObject = require('../account/account.po.js');
var SitePageObject = require('../site/site.po.js');

describe("cart:", function () {

    var cartPO,
        productDetailsPO,
        accountPO,
        sitePO;

    var isMobile = false;

    var testProducts = TI.products;
    var testUsers = TI.users;

    beforeEach(function () {
        utils.deleteCookies();
        utils.setWindowSize(desktopSiteConfig.windowDetails.width, desktopSiteConfig.windowDetails.height);

        cartPO = new CartPageObject();
        productDetailsPO = new ProductDetailsPageObject();
        accountPO = new AccountPageObject();
        sitePO = new SitePageObject();
    });

    describe("verify cart functionality", function () {

        it('should load one product into cart', function () {
            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.one.totalPriceUS);

            expect(cartPO.getFirstCartItemName()).toEqual(testProducts.whiteCoffeeMug.name);

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.cartMessages.EMPTY.EN);
        });

        it('should load one product into cart in Euros', function () {
            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            sitePO.waitForSiteSelector();

            sitePO.setSite(TI.sites.SushiGermany);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.one.totalPriceDE);

            cartPO.emptyCart();

            cartPO.waitForCartMessage();

            expect(cartPO.getCartMessage()).toEqual(TI.cartMessages.EMPTY.DE);
        });

        it('should load one product into cart in USD and change to Euros', function () {
            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.one.totalPriceUS);

            cartPO.continueShopping();

            sitePO.waitForSiteSelector();

            sitePO.setSite(TI.sites.SushiGermany);

            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.one.totalPriceDE);
        });

        it('should load multiple products into cart', function () {
            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(5);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.five.totalPriceUS);
        });


        it('should update quantity', function () {
            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.one.totalPriceUS);
            
            cartPO.continueShopping();

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartItemQuantity()).toEqual('2');

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.two.totalPriceUS);

            cartPO.updateItemQuantity(5);

            cartPO.updateOrderTotal();

            expect(cartPO.getCartItemQuantity()).toEqual('5');

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.five.totalPriceUS);

            cartPO.updateItemQuantity(10);

            cartPO.updateOrderTotal();

            expect(cartPO.getCartItemQuantity()).toEqual('10');

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.ten.totalPriceUS);
        });

        it('should have out of stock button disabled', function () {
            productDetailsPO.get(testProducts.blackCoffeeMug.id);

            expect(cartPO.isOutOfStockButtonPresent()).toBe(true);
        });

        it('should retrieve previous cart', function () {
            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            accountPO.loginUser(testUsers.cartUser);

            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.one.itemPriceUSWithTax);
        });

        it('should calculate taxes', function () {
            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            sitePO.waitForSiteSelector();

            sitePO.setSite(TI.sites.Avalara);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getCartTotalAmount()).toEqual(testProducts.whiteCoffeeMug.one.itemPriceUS);

            cartPO.showEstimateTaxFields();

            cartPO.setTaxZipCode(TI.taxCodes.US.taxZipCode);

            cartPO.setTaxCountry(TI.taxCodes.US.countryCode);

            cartPO.applyTax();

            expect(cartPO.isTotalTaxPresent()).toBe(true);
        });

        it('should add and modify the note in cart item after adding an item to cart', function () {
            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            cartPO.addNote(TI.cartNote);

            cartPO.addNote(TI.cartNote + ",please.");

            expect(cartPO.getItemNote()).toEqual(TI.cartNote + ",please.");
        });
    });
});


