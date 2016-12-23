'use strict';

var utils = require('../utils/utils.js');

var ConfirmationPageObject = function () {

    var buttons = {
        createAccount: element(by.id('create-acct-btn')),      
    };

    var inputFields = {
        newAccountPassword: element(by.id('newPasswordInput')),
    };

    var textDisplays = {
        totalPrice: element(by.id('confirmation-totalPrice')),
        totalDiscount: element(by.id('discount-amount')),
        orderDetails: element(by.binding('orderInfo.orderId')),
        taxLines: by.exactRepeater('taxLine in confirmationDetails.tax.lines'),
        successMessage: element(by.id('confirmation-success-message')),
        totalPriceMobile: element(by.css('td.text-left.product-details-mobile > div:nth-child(6) > strong')),
        shippingAddress: {
            address1: element(by.binding('confirmationDetails.shippingAddressStreetLine1')),
            name: element(by.binding('confirmationDetails.shippingAddressName')),
            cityStateZipCode: element(by.binding('confirmationDetails.shippingAddressCityStateZip'))
        }
    };

    var links = {
        orderDetails: element(by.binding('orderInfo.orderId'))
    };

    this.goToOrderDetails = function () {
            links.orderDetails.click();
    };

    this.getTaxLine = function () {
        return element(textDisplays.taxLines.row(1).column('taxLine.name')).getText();
    };

    this.getTaxLineAmount = function () {
        return element(textDisplays.taxLines.row(0).column('taxLine.amount')).getText();
    };
    
    this.getSuccessMessage = function() {
        return textDisplays.successMessage.getText();
    };

    this.verifyCustomerDetails = function (customer,orderTotal,isMobile) {
        expect(this.getSuccessMessage()).toContain(customer.email.split('@')[0]);
        expect(this.getCustomerNameOnShippingAddress()).toContain(customer.address.contactName.toUpperCase());
        expect(this.getShippingAddress()).toContain(customer.address.street.split(' ')[0]);
        expect(this.getShippingAddressCityStateZipCode()).toContain(customer.address.cityStateZipCode);
        expect(this.getTotalPrice(isMobile)).toEqual(orderTotal);
    
    };

    this.getShippingAddressCityStateZipCode = function() {
        return textDisplays.shippingAddress.cityStateZipCode.getText();
    };

    this.getShippingAddress = function () {
        return textDisplays.shippingAddress.address1.getText();
    };

    this.getTotalPrice = function (isMobile) {
        if(isMobile === true) {
            return textDisplays.totalPriceMobile.getText();
        }
        else if(isMobile === false) {
            return textDisplays.totalPrice.getText();
        }
    };

    this.getCustomerNameOnShippingAddress = function () {
        return textDisplays.shippingAddress.name.getText();
    };

    this.getTotalDiscount = function () {
        return textDisplays.totalDiscount.getText();
    };

    this.createAccount = function () {
        inputFields.newAccountPassword.clear();
        inputFields.newAccountPassword.sendKeys('password');
        buttons.createAccount.click();
    };

};

module.exports = ConfirmationPageObject;
