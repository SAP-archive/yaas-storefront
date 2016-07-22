'use strict';

var utils = require('../utils/utils.js');

var OrderDetailsPageObject = function () {

    var buttons = {
        cancelOrder: {
            modalOpen: element(by.id('cancelOrder')),
            confirmCancel: element(by.id('confirm-order-cancel-btn'))
        }        
    };

    var textDisplays = {
        cancelOrder: {
            modalContent: element(by.css('.modal-content'))
        },

        status: element(by.binding('order.status')),

        shippingAddressName: element(by.binding('order.shippingAddress.contactName'))
    };

    this.getShippingAddress = function () {
        return textDisplays.orderDetails.shippingAddressName.getText();
    };

    this.waitForOrderStatus = function () {
        browser.wait(function () {
            return textDisplays.status.isPresent();
        });
    };

    this.getOrderStatus = function () {
        return textDisplays.status.getText();
    };

    this.getShippingAddress = function () {
        return textDisplays.shippingAddressName.getText();
    };

    this.cancelOrder = function () {
        buttons.cancelOrder.modalOpen.click();
        browser.switchTo().defaultContent();
        browser.waitForAngular();
        browser.wait(function () {
            return textDisplays.cancelOrder.modalContent.isPresent();
        });
        buttons.cancelOrder.confirmCancel.click();
    };

};

module.exports = OrderDetailsPageObject;
