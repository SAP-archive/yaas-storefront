'use strict';

var utils = require('../utils/utils.js');

var AccountPageObject = function () {

    var inputFields = {
        contactName: element(by.id('contactName')),
        street: element(by.id('street')),
        streetAppendix: element(by.id('streetAppendix')),
        city: element(by.id('city')),
        zipCode: element(by.id('zipCode')),
        contactPhone: element(by.id('contactPhone')),
        loginUser: {
            username: element(by.id('usernameInput')),
            password: element(by.id('passwordInput'))
        },
        createUser: {
            username: element(by.id('emailInput')),
            password: element(by.id('newPasswordInput'))
        },
        state: element(by.id('state'))

    };

    var buttons = {
        signInMobile: element(by.css('.mobileNav .signin')),
        signInDesktop: element(by.id('sign-in-button')),
        createAccount: element(by.id('create-acct-btn')),
        viewAccountDetails: element(by.id('my-account-link')),
        addAddress: element(by.id('add-address-btn')),
        saveAddress: element(by.id('save-address-btn')),
    };

    var links = {
        signIn: element(by.id('login-btn')),
        createAccount: element(by.id('create-account'))
    };

    var textDisplays = {
        contactEmail: element(by.id("account-contact-email"))
    };

    var dropdowns = {
        account: element(by.id('my-account-dropdown')),
        country: element(by.model('address.country'))
    };

    var timestamp = Number(new Date());

    var orderRowElement = function(elem,rowNumber) {
        return element(by.repeater('orderRow in orders').row(rowNumber).column('orderRow.' + elem));
    };

    this.getContactEmail = function () {
        return textDisplays.contactEmail.getText();
    };

    this.orderRow = {
        getCreationDate: function(rowNumber) {
            return orderRowElement('created',rowNumber).getText();
        },

        getTotalPrice: function(rowNumber) {
            return orderRowElement('totalPrice',rowNumber).getText();
        },

        getOrderStatus: function(rowNumber) {
            return orderRowElement('status',rowNumber).getText().getText();
        }
    };


    this.populateAddress = function(address) { 
        buttons.addAddress.click();

        browser.sleep(1000);

        var selectSort = dropdowns.country.element(by.css('.ui-select-search'));
        dropdowns.country.click();
        selectSort.clear();
        selectSort.sendKeys(address.country);
        element.all(by.css('.ui-select-choices-row-inner span')).first().click();

        inputFields.contactName.clear();
        inputFields.contactName.sendKeys(address.contactName);

        inputFields.street.clear();
        inputFields.street.sendKeys(address.street);

        inputFields.streetAppendix.clear();
        inputFields.streetAppendix.sendKeys(address.aptNumber);

        inputFields.city.clear();
        inputFields.city.sendKeys(address.city);

        if ((address.country == 'United States') || (address.country == 'Canada')) {
            utils.selectOption('address.state',address.state)
        } else {
            inputFields.state.sendKeys(address.state);
        }

        inputFields.zipCode.clear();
        inputFields.zipCode.sendKeys(address.zipCode);

        inputFields.contactPhone.clear();
        inputFields.contactPhone.sendKeys(address.contactPhone);

        buttons.saveAddress.click();
    };

    this.createAccount = function (emailAddress) {
        links.signIn.click();
        this.waitForSignInForm();
        links.createAccount.click();

        inputFields.createUser.username.clear();
        inputFields.createUser.username.sendKeys(emailAddress + timestamp + '@yaastest.com');
        inputFields.createUser.password.clear();
        inputFields.createUser.password.sendKeys('password');

        buttons.createAccount.click();

        browser.waitForAngular();
    };

    this.goToAccountDetailsPage = function() {
        dropdowns.account.click();
        buttons.viewAccountDetails.click();
    };

    this.waitForSignInComplete = function() {
        browser.wait(function () {
            return dropdowns.account.isPresent();
        });
    };

    this.loginUser = function (user) {
        links.signIn.click();

        this.waitForSignInForm();

        inputFields.loginUser.username.clear();
        inputFields.loginUser.username.sendKeys(user.username);
        inputFields.loginUser.password.clear();
        inputFields.loginUser.password.sendKeys(user.password);

        buttons.signInDesktop.click();
    };

    this.waitForSignInLink = function () {
        browser.wait(function () {
            return links.signIn.isPresent();
        });
    };

    this.waitForSignInForm = function () {
        browser.wait(function () {
            return buttons.signInDesktop.isPresent();
        });
    };
};

module.exports = AccountPageObject;