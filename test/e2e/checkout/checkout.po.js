'use strict';

var utils = require('../utils/utils.js');

var CheckoutPageObject = function () {

    var buttons = {
        previewOrder: element(by.id('preview-order-btn')),
        placeOrder: element(by.id('place-order-btn')),
        loggedIn: {
            shippingAddressSelect: element(by.id('select-address-btn-1')),
        },
        mobile: {
            toBilling: element(by.id('continue-to-billing')),
            toPayment: element(by.id('continue-to-payment-method')),
            toPlaceOrder: element(by.id('mobile-place-order-btn'))
        }
    };

    var inputFields = {
        billingAddress: {
            contactName: element(by.id('contactNameBill')),
        },
        firstName: element(by.id("firstNameAccount")),
        lastName: element(by.id("lastNameAccount")),
        creditCardNumber: element(by.id("ccNumber")),
        cvcCode: element(by.id("cvc")),
        email: element(by.id("email")),
        loggedIn: {
            shippingAddress1: element(by.id('address1Ship'))
        }
    };

    var textDisplays = {

        shipmentDestination: element(by.id('shipment-destination')),

        orderPreview: {
            itemQuantity: element.all(by.className('item-quantity')).first(),
            totalPrice: element.all(by.className('cart-totalPrice')).first(),
            taxLines: element(by.repeater('taxLine in cart.taxAggregate.lines').row(1)),
            itemEffectiveAmount: element.all(by.className('item-effectiveAmount')).first(),
            totalDiscount: element.all(by.className('cart-totalDiscount')).first()
        }, 

        shippingAddress1: element(by.id('order-shipTo-address1'))
    };

    var checkboxes = {
        shipTo: element(by.id('shipTo'))
    };

    var links = {
        addressBookModal: element(by.id('myModalLabel')),
        confirmation: {
            orderDetails: element(by.binding('orderInfo.orderId'))
        }
    };

    var waitForAddressBookModal = function() {
        browser.wait(function () {
            return links.addressBookModal.isPresent();
        });
    };

    this.getLoggedInShippingAddress = function() {
        return inputFields.loggedIn.shippingAddress1.getAttribute('value');
    };

    this.getShippingAddressLine1Address = function() {
        return textDisplays.shippingAddress1.getText();
    };

    this.fillNameAndEmailFields = function(model, name, email) {
        this.fillNameFields(model,name);
        inputFields.email.sendKeys(email);
    };

    this.fillNameFields = function(model,name) {
        utils.selectOption(model, name.designation);

        inputFields.firstName.clear();
        inputFields.firstName.sendKeys(name.firstName);

        inputFields.lastName.clear();
        inputFields.lastName.sendKeys(name.lastName);
    };

    this.waitForForm = function() {
        browser.wait(function () {
            return inputFields.firstName.isPresent();
        });
        browser.sleep(500);
    };

    this.changeBillingAddressToShippingAddressState = function () {
        checkboxes.shipTo.click();
    };

    this.fillBillingAddressNameField = function(name) {
        inputFields.billingAddress.contactName.clear();
        inputFields.billingAddress.contactName.sendKeys(name);
    };

    this.placeOrder = function() {
        utils.scrollTo(buttons.placeOrder);
        buttons.placeOrder.click();
    };

    this.fillAddressFields = function(type) {
        var idFragment = null;
        if(type === 'Billing') {
            idFragment = 'Bill';
        }
        else if(type === 'Shipping') {
            idFragment = 'Ship';
        }

        if(idFragment != 'Bill') {
            utils.selectOption('order.' + idFragment.toLowerCase() + 'To.country', 'united states');
        }

        browser.executeScript('window.scrollTo(0, document.body.scrollHeight)').then(function () {
            utils.selectOption('order.' + idFragment.toLowerCase() + 'To.state', 'colorado');

            element(by.id('zipCode' + idFragment)).sendKeys('80301');
            element(by.id('address1' + idFragment)).sendKeys('123');
            element(by.id('address2' + idFragment)).sendKeys('321');
            element(by.id('city' + idFragment)).sendKeys('Boulder');
        });
    };

    this.fillCreditCardFields = function(creditCard) {

        inputFields.creditCardNumber.clear();
        inputFields.creditCardNumber.sendKeys(creditCard.cardNumber);

        utils.selectOption('order.creditCard.expMonth', creditCard.expiryMonth);
        utils.selectOption('order.creditCard.expYear', creditCard.expiryYear);

        inputFields.cvcCode.clear();
        inputFields.cvcCode.sendKeys(creditCard.cvcCode);
    };

    this.waitForConfirmationPage = function () {
         browser.wait(function () {
            return textDisplays.shipmentDestination.isPresent();
         });
    };

    this.goToPreviewOrder = function() {
        utils.scrollTo(buttons.previewOrder);
        buttons.previewOrder.click();
    };

    this.waitForCreditCardField = function () {
         browser.wait(function () {
            return inputFields.creditCardNumber.isPresent();
        });
    };

    this.orderPreview = {
        getTaxOverride: function () {
            return textDisplays.orderPreview.taxLines.getText();
        },

        getItemEffectiveAmount: function () {
            return textDisplays.orderPreview.itemEffectiveAmount.getText();
        },

        getTotalDiscount: function () {
            return textDisplays.orderPreview.totalDiscount.getText();
        },

        getTotalPrice: function () {
            return textDisplays.orderPreview.totalPrice.getText();
        },

        getItemQuantity: function () {
            return textDisplays.orderPreview.itemQuantity.getText();
        }
    };

    this.mobile = {
        continueToBilling: function () {
            buttons.mobile.toBilling.click();
        },
        continueToPayment: function () {
            utils.scrollTo(buttons.mobile.toPayment);
            buttons.mobile.toPayment.click();
        },
        placeOrder: function () {
            buttons.mobile.toPlaceOrder.click();
            buttons.placeOrder.click();
        },
        validate: function (elem, text, nextPageButton) {
            var e = element(by.id(elem));
            e.clear();
            if(nextPageButton === 'toBilling') {
                buttons.mobile.toBilling.click();
            }
            else if(nextPageButton === 'toPayment') {
                buttons.mobile.toPayment.click();
            }
            browser.executeScript("document.getElementById('" + elem + "').style.display='block';"); //forces 2nd input to display after error
            e.sendKeys(text);
        }
    };

    this.addressModal = {
        getShippingAddressLabel: function () {
            return element(by.repeater('address in addresses').row(0)).getText();
        },

        getBillingAddressLabel: function () {
            return element(by.repeater('address in addresses').row(1)).getText()
        },

        get: function () {
            buttons.loggedIn.shippingAddressSelect.click();
            waitForAddressBookModal();
        },

        setShippingAddress: function (addressNumber) {
            element(by.repeater('address in addresses').row(addressNumber - 1).column('address.streetNumber')).click();
        }
    };

};

module.exports = CheckoutPageObject;