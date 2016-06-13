'use strict';

var utils = require('../utils/utils.js');

var ProductDetailsPageObject = function () {

    var buttons = {
        addToCart: element(by.id('buy-button'))
    };

    var inputFields = {
        quantity: element(by.id('qty'))
    }

    this.get = function (productId) {
        browser.get(utils.tenant + '/#!/products/' + productId);
    };

    this.addProductToCart = function (quantity) {
        inputFields.quantity.clear();

        inputFields.quantity.sendKeys(quantity);

        buttons.addToCart.click();
    };

};

module.exports = ProductDetailsPageObject;