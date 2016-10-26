'use strict';

var utils = require('../utils/utils.js');

var ProductDetailsPageObject = function () {
    
    var buttons = {
        addToCart: element(by.id('buy-button'))
    };

    var inputFields = {
        quantity: element(by.id('qty'))
    };

    var textDisplays = {
        productDescription: element(by.id('product-description-text')),
        effectiveAmount: element(by.id('effective-amount')),
        originalPrice: element(by.id('original-price')),
        salesPrice: element(by.id('sales-price')),
        taxMessage: element(by.id('tax-message')),
        measurementUnitAndQuantity: element(by.id('measurement-unit-quantity'))
    };

    this.get = function (productId) {
        browser.get(utils.tenant + '/#!/products/' + productId);
    };

    this.getTaxMessage = function() {
        return textDisplays.taxMessage.getText();
    };

    this.getDescription = function () {
        return textDisplays.productDescription.getText();
    };

    this.getEffectiveAmount = function() {
        return textDisplays.effectiveAmount.getText();
    };

    this.getOriginalAmount = function() {
        return textDisplays.originalPrice.getText();
    };

    this.salesAmount = function() {
        return textDisplays.salesPrice.getText();
    };

    this.getMeasurementUnitAndQuantity = function () {
        return textDisplays.measurementUnitAndQuantity.getText();
    };

    this.addProductToCart = function (quantity) {
        inputFields.quantity.clear();
        inputFields.quantity.sendKeys(quantity);
        buttons.addToCart.click();
    };
};

module.exports = ProductDetailsPageObject;