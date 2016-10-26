'use strict';

var utils = require('../utils/utils.js');

var CartPageObject = function () {

    var buttons = {
        removeCartItem: element(by.id('remove-product')),
        showCart: element(by.id('full-cart-btn')),
        continueShopping: element(by.id('continue-shopping')),
        checkout: element(by.binding('CHECKOUT')),
        guestContinue: element(by.id('guest-continue')),
        showCartMobile: element(by.id('mobile-cart-btn')),
        outOfStock: element(by.id('out-of-stock-btn')),
        applyTax: element(by.id('apply-btn')),
        saveCartItemNote: element(by.id('saveCartItemNote'))
    };

    var textDisplays = {
        cartTotal: element(by.binding('cart.totalPrice.amount')),
        cartDiscount: element(by.css('#cart .discount')),
        cartQuantity: element(by.xpath("(//input[@type='number'])[2]")),
        cartMessage:  element(by.xpath("//*[@id='cart']/div/div[2]")),
        taxOverride: element(by.repeater('taxLine in cart.taxAggregate.lines').row(1)),
        orderEstimatedTotal: element(by.binding('EST_ORDER_TOTAL')),
        totalTax: element(by.id('total-tax')),
        firstCartItemName: element.all(by.className('product-item-name')).first()
    };

    var inputFields = {
        cartQuantity: element(by.id('qtyCart')),
        taxZipCode: element(by.id('zipCode')),
        cartItemNote: element(by.id('cartItemNote'))
    };

    var links = {
        estimateTax: element(by.id('tax-estimation-link')),
        addEditNote: element(by.id('addEditNote'))
    };

    this.getFirstCartItemName = function() {
        return textDisplays.firstCartItemName.getText();
    };

    this.addNote = function (noteText) {
        links.addEditNote.click();
        inputFields.cartItemNote.clear();
        inputFields.cartItemNote.sendKeys(noteText);
        buttons.saveCartItemNote.click();
    };

    this.getItemNote = function () {
        return element(by.css('.note-display.ng-binding')).getText();
    };

    this.setTaxCountry = function(country) {
        utils.selectOption('calculateTax.countryCode', country);
    };

    this.isTotalTaxPresent = function() {
        return textDisplays.totalTax.isPresent();
    };

    this.showEstimateTaxFields = function () {
        links.estimateTax.click();
    };

    this.applyTax = function () {
        buttons.applyTax.click();
    };

    this.isOutOfStockButtonPresent = function () {
        return buttons.outOfStock.isPresent()
    };

    this.setTaxZipCode = function(zipCode) {
        inputFields.taxZipCode.clear();
        inputFields.taxZipCode.sendKeys(zipCode);
    };

    this.waitForGoToCheckoutModal = function() {
         browser.wait(function () {
            return buttons.guestContinue.isPresent();
        });
    };

    this.goToCheckout = function (isLoggedIn) {
        buttons.checkout.click();
        if(!isLoggedIn) {
            this.waitForGoToCheckoutModal();
            buttons.guestContinue.click();
        }
    };

    this.updateOrderTotal = function () {
        textDisplays.orderEstimatedTotal.click();
    };

    this.getTaxOverride = function() {
        return textDisplays.taxOverride.getText();
    };

    this.waitForShowCartButton = function() {
        browser.wait(function () {
            return buttons.showCart.isPresent();
        });
    };

    this.showCart = function (isMobile) {
        this.waitForShowCartButton();
        if(isMobile === true) {
            buttons.showCartMobile.click();
        }
        else {
            buttons.showCart.click();
        }
    };

    this.continueShopping = function () {
        buttons.continueShopping.click();
    };

    this.setCartQuantity = function (quantity) {
        inputFields.cartQuantity.clear();
        inputFields.cartQuantity.sendKeys(quantity);
    };

    this.updateItemQuantity = function (quantity) {
        this.setCartQuantity(quantity);
        textDisplays.cartTotal.click();
    };

    this.getCartItemQuantity = function () {
        return inputFields.cartQuantity.getAttribute('value');
    };

    this.waitUntilShowCartButtonIsDisplayed = function () {
        browser.wait(function () {
            return buttons.showCart.isDisplayed();
        });
    };

    this.waitUntilNotificationIsDissmised = function () {
        browser.sleep(6001);
    };

    this.waitForCartMessage = function () {
        browser.wait(function () {
            return textDisplays.cartMessage.isDisplayed();
        });
    };

    this.waitUntilCartTotalIsDisplayed = function () {
        browser.wait(function () {
            return textDisplays.cartTotal.isDisplayed();
        });
    };

    this.getCartMessage = function () {
        return textDisplays.cartMessage.getText();
    };

    this.getCartTotalAmount = function () {
        return textDisplays.cartTotal.getText();
    };

    this.getCartDiscountAmount = function () {
        return textDisplays.cartDiscount.getText();
    };

    this.emptyCart = function () {
        buttons.removeCartItem.click();
    };
};

module.exports = CartPageObject;