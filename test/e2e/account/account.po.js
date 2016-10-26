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
        state: element(by.id('state')),
        accountDetails: {
            firstNameElements: element.all(by.model('account.firstName')),
            middleName: element(by.id('middleNameAccount')),
            lastNameElements: element.all(by.model('account.lastName')),
            currentPassword: element(by.id('currentPassword')),
            newPassword: element(by.id('newPassword')),
            newPasswordConfirm: element(by.id('confirmNewPassword')),
            newEmail: element(by.id('newEmail')),
            newEmailPassword: element(by.id('password'))
        }
    };

    var buttons = {
        signInMobile: element(by.css('.mobileNav .signin')),
        signInDesktop: element(by.id('sign-in-button')),
        createAccount: element(by.id('create-acct-btn')),
        logout: element(by.id('logout-btn')),
        editUserInfo: element(by.id('edit-user-info')),
        saveUserInfo: element(by.id('save-btn')),
        accountDetails: {
            updatePassword: element(by.id('update-password')),
            view: element(by.id('my-account-link')),
            updateToNewPassword: element(by.id('update-password-btn')),
            passwordUpdateModalClose: element(by.id('passwordUpdate-close')),
            updateEmail: element(by.id('update-email')),
            saveEmail: element(by.id('save-btn'))
        },
        address: {
            add: element(by.id('add-address-btn')),
            save: element(by.id('save-address-btn')),
            setDefault: element(by.id("set-default-btn")),
            delete: element(by.id("delete-address-btn")),
            confirmDelete: element(by.id("confirm-delete-address-btn"))
        }
    };

    var links = {
        signIn: element(by.id('login-btn')),
        createAccount: element(by.id('create-account'))
    };

    var textDisplays = {
        contactEmail: element(by.id("account-contact-email")),
        errorMessage: element(by.binding("error.message")),
        accountDetails: {
            fullName: element(by.id('account-name')),
            firstName: element(by.binding("account.firstName")),
            middleName: element(by.binding("account.middleName")),
            lastName: element(by.binding("account.lastName"))
        },
        modalContent: element(by.css('.modal-content')),
        checkEmailModal: element(by.binding('CHECK_EMAIL'))
    };

    var dropdowns = {
        account: element(by.id('my-account-dropdown')),
        country: element(by.model('address.country'))
    };


    this.getAccountModalErrorMessage = function() {
        return textDisplays.errorMessage.getText();
    };

    var orderRowElement = function(elem,rowNumber) {
        return element(by.repeater('orderRow in orders').row(rowNumber).column('orderRow.' + elem));
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

    var addressElement = function(elem,rowNumber) {
        return element.all(by.repeater('address in addresses').row(rowNumber).column('address.' + elem)).first();
    };

    var address = {
        getStreet: function(rowNumber) {
            return addressElement('street',rowNumber).getText();
        },
        waitForModal: function() {
            browser.wait(function () {
                return textDisplays.modalContent.isPresent();
            });
        },
        getCity: function(rowNumber) {
            return addressElement('city',rowNumber).getText();
        },
        getCountry: function(rowNumber) {
            return addressElement('country',rowNumber).getText();
        },
        getContactName: function(rowNumber) {
            return addressElement('contactName',rowNumber).getText();
        },
        getContactPhone: function(rowNumber) {
            return addressElement('contactPhone',rowNumber).getText();
        },
        setDefault: function() {
            buttons.address.setDefault.click();
        },
        waitForDeleteButton: function() {
            browser.wait(function() {
                return buttons.address.delete.isPresent();
            });
        },
        isDeleteButtonPresent: function () {
            return buttons.address.delete.isPresent();
        }
    };

    address.delete = function() {
        buttons.address.delete.click();
        browser.switchTo().defaultContent();
        address.waitForModal();
        buttons.address.confirmDelete.click();
    };

    this.address = address;

    this.populateAddress = function(address) { 
        buttons.address.add.click();

        browser.sleep(300);

        var selectSort = dropdowns.country.element(by.css('.ui-select-search'));
        browser.sleep(300);
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

        buttons.address.save.click();

        browser.sleep(1000);
    };


    this.createAccount = function (user,openModal) {
        var timestamp = Number(new Date());

        if(openModal === true) {
            links.signIn.click();
            this.waitForSignInForm();
            links.createAccount.click();
        }

        inputFields.createUser.username.clear();
        inputFields.createUser.username.sendKeys(user.name + timestamp + '@yaastest.com');
        inputFields.createUser.password.clear();
        inputFields.createUser.password.sendKeys(user.password);

        buttons.createAccount.click();

        browser.waitForAngular();
    };

    var accountDetails = {
        waitForAccountDetailsDropDown: function() {
            browser.wait(function() {
                return dropdowns.account.isPresent();
            });
        },
        getFullName: function() {
            return textDisplays.accountDetails.fullName.getText();
        },
        getContactEmail: function () {
            return textDisplays.contactEmail.getText();
        },
        closePasswordUpdateModal: function () {
            buttons.accountDetails.passwordUpdateModalClose.click();
        },
        updatePassword: function (passwordUpdate) {
            buttons.accountDetails.updatePassword.click();

            inputFields.accountDetails.currentPassword.clear();
            inputFields.accountDetails.currentPassword.sendKeys(passwordUpdate.current);

            inputFields.accountDetails.newPassword.clear();
            inputFields.accountDetails.newPassword.sendKeys(passwordUpdate.new);

            inputFields.accountDetails.newPasswordConfirm.clear();
            inputFields.accountDetails.newPasswordConfirm.sendKeys(passwordUpdate.confirm);
        },

        clickUpdatePasswordButton: function () {
            buttons.accountDetails.updateToNewPassword.click();
            browser.waitForAngular();
        },

        updateEmail: function (newEmail,password) {
            buttons.accountDetails.updateEmail.click();

            inputFields.accountDetails.newEmail.clear();
            inputFields.accountDetails.newEmail.sendKeys(newEmail);

            inputFields.accountDetails.newEmailPassword.clear();
            inputFields.accountDetails.newEmailPassword.sendKeys(password);

            buttons.accountDetails.saveEmail.click();
        },

        isCheckEmailModalPresent: function() {
            return textDisplays.checkEmailModal.isPresent();
        },

        closeCheckEmailModal: function () {
            browser.refresh();
        },

        isUpdatePasswordButtonEnabled: function () {
            return buttons.accountDetails.updateToNewPassword.isEnabled();
        },
        editDetails: function(name) {
            buttons.editUserInfo.click();

            inputFields.accountDetails.firstNameElements.first().clear();
            inputFields.accountDetails.firstNameElements.last().click(); //To get around the validation
            inputFields.accountDetails.firstNameElements.first().sendKeys(name.first);

            inputFields.accountDetails.middleName.clear();
            inputFields.accountDetails.middleName.sendKeys(name.middle);

            inputFields.accountDetails.lastNameElements.first().clear();
            inputFields.accountDetails.lastNameElements.last().click(); //To get around the validation
            inputFields.accountDetails.lastNameElements.first().sendKeys(name.last);

            buttons.saveUserInfo.click();
        }
    };

    accountDetails.getPage = function() {
        accountDetails.waitForAccountDetailsDropDown();
        dropdowns.account.click();
        buttons.accountDetails.view.click();
    };

    this.accountDetails = accountDetails;

    this.waitForSignInComplete = function() {
        browser.wait(function () {
            return dropdowns.account.isPresent();
        });
    };

    this.logoutUser = function() {
        dropdowns.account.click();
        buttons.logout.click();
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