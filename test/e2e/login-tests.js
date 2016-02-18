var fs = require('fs');
var tu = require('./protractor-utils.js');

var timestamp = Number(new Date());

function updateNameField(id, text) {
    element(by.id(id)).clear();
    browser.executeScript("document.getElementById('" + id + "').style.display='block';");
    element(by.id(id)).sendKeys(text);
}

function waitForAccountPage() {
    browser.wait(function () {
        return element(by.binding('MY_ACCOUNT')).isPresent();
    });
}

function clickOnModalDeleteAddress() {
    browser.switchTo().defaultContent();
    browser.sleep(1000);
    browser.waitForAngular();
    browser.wait(function () {
        return element(by.css('.modal-content')).isPresent();
    });
    tu.clickElement('id', 'confirm-delete-address-btn');
}


describe("login:", function () {


    describe("verify login functionality", function () {

        beforeEach(function () {
            // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
            browser.manage().deleteAllCookies();
            browser.driver.manage().window().setSize(1200, 1100);
            browser.get(tu.tenant + '/#!/ct');
            browser.switchTo().alert().then(
                function (alert) {
                    alert.dismiss();
                },
                function (err) {
                }
            );

        });

        it('should not allow user to login', function () {
            tu.loginHelper('bad@bad.com', 'bad');
            expect(element(by.binding("error.message")).getText()).toEqual("You entered an invalid email or password.");
        });

        it('should allow existing user to login', function () {
            tu.loginHelper('cool@cool.com', 'coolio');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            browser.sleep(1000);
            expect(element(by.binding("account.firstName")).getText()).toEqual('JOE');
            // tu.clickElement('id', 'logout-btn');

        });

        it('should allow user to update account info', function () {
            tu.loginHelper('cool@cool.com', 'coolio');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            browser.sleep(2000);
            expect(element(by.binding("account.lastName")).getText()).toContain('Joe C Cool');
            tu.clickElement('id', 'edit-user-info');
            updateNameField('firstNameAccount', 'first');
            tu.sendKeys('id', 'middleNameAccount', 'middle');
            updateNameField('lastNameAccount', 'last');
            tu.clickElement('id', 'save-btn');
            expect(element(by.binding("account.lastName")).getText()).toContain('first middle last');
            tu.clickElement('id', 'edit-user-info');
            updateNameField('firstNameAccount', 'Joe');
            tu.sendKeys('id', 'middleNameAccount', 'C');
            updateNameField('lastNameAccount', 'Cool');
            tu.clickElement('id', 'save-btn');
            expect(element(by.binding("account.lastName")).getText()).toContain('Joe C Cool');
        });

        it('should create a new user', function () {
            tu.clickElement('id', 'login-btn');
            browser.wait(function () {
                return element(by.binding('CREATE_ACCOUNT')).isPresent();
            });
            tu.clickElement('binding', 'CREATE_ACCOUNT');
            tu.sendKeys('id', 'emailInput', 'cool@cool' + timestamp + '.com');
            tu.sendKeys('id', 'newPasswordInput', 'pass');
            tu.clickElement('id', 'create-acct-btn');
            expect(element(by.binding("error.message")).getText()).toEqual("Password invalid - minimum of 6 characters required.");
            tu.sendKeys('id', 'newPasswordInput', 'password');
            tu.clickElement('id', 'create-acct-btn');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            expect(element(by.css("h2.pull-left.ng-binding")).getText()).toEqual("Addressbook");


        });

        it('should allow existing user to manage addresses', function () {
            //dismisses pop-ups in phantomjs
            browser.executeScript('window.confirm = function(){return true;}');
            tu.createAccount('addresstest');
            tu.populateAddress('United States', 'Address Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
            browser.sleep(500);
            // expect(element(by.binding("defaultAddress.street")).getText()).toEqual("123 fake place");
            expect(element(by.repeater('address in addresses').row(0).column('address.street')).getText()).toEqual('123 fake place, apt 419');
            expect(element(by.repeater('address in addresses').row(0).column('address.city')).getText()).toEqual('Boulder, CO 80301');
            expect(element(by.repeater('address in addresses').row(0).column('address.country')).getText()).toEqual('US');
            expect(element(by.repeater('address in addresses').row(0).column('address.contactPhone')).getText()).toEqual('303-303-3333');
            tu.populateAddress('Canada', '2nd Test', '321 phony street', 'apt 420', 'Toronto', 'ON', 'M4M 1H7', '720-555-1234');
            expect(element(by.repeater('address in addresses').row(1).column('address.contactName')).getText()).toEqual('2nd Test');
            expect(element(by.repeater('address in addresses').row(1).column('address.street')).getText()).toEqual('321 phony street, apt 420');
            expect(element(by.repeater('address in addresses').row(1).column('address.city')).getText()).toEqual('Toronto, ON M4M 1H7');
            expect(element(by.repeater('address in addresses').row(1).column('address.country')).getText()).toEqual('CA');
            expect(element(by.repeater('address in addresses').row(1).column('address.contactPhone')).getText()).toEqual('720-555-1234');
            //tu.clickElement('xpath', "(//button[@id='set-default-btn'])[2]");
            tu.clickElement('xpath', '//*[@id="set-default-btn"]/span');
            browser.sleep(1500);
            expect(element(by.repeater('address in addresses').row(0).column('address.street')).getText()).toEqual('321 phony street, apt 420');
            //tu.clickElement('xpath', "(  //button[@id='set-default-btn'])[2]");
            tu.clickElement('xpath', '//*[@id="set-default-btn"]/span');
            browser.sleep(1000);
            expect(element(by.repeater('address in addresses').row(0).column('address.street')).getText()).toEqual('123 fake place, apt 419');
            tu.clickElement('id', 'delete-address-btn');
            // Confirm delete address
            clickOnModalDeleteAddress();
            browser.wait(function () {
                return element(by.id('delete-address-btn')).isPresent();
            });
            tu.clickElement('id', 'delete-address-btn');
            // Confirm delete address
            clickOnModalDeleteAddress();
            expect(element(by.id('delete-address-btn')).isPresent()).toBe(false);

        });

        it('should not allow user to update their password with incorrect password', function () {
            tu.loginHelper('badpassword@test.com', 'password');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            waitForAccountPage();
            tu.clickElement('id', 'update-password');
            tu.sendKeys('id', 'currentPassword', 'incorrect');
            tu.sendKeys('id', 'newPassword', 'notnew');
            tu.sendKeys('id', 'confirmNewPassword', 'notnew');
            tu.clickElement('id', 'update-password-btn');
            browser.sleep(500);
            expect(element(by.binding("error.message")).getText()).toEqual("Please provide correct current password!");
            tu.clickElement('css', "a.close > span");

        });

        it('should not allow user to update their password if it less than 6 chars', function () {
            tu.loginHelper('badpassword@test.com', 'password');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            waitForAccountPage();
            tu.clickElement('id', 'update-password');
            tu.sendKeys('id', 'currentPassword', 'password');
            tu.sendKeys('id', 'newPassword', '123');
            tu.sendKeys('id', 'confirmNewPassword', '123');
            browser.sleep(500);
            expect(element(by.id('update-password-btn')).isEnabled()).toBe(false);
            tu.clickElement('css', "a.close > span");

        });

        it('should not allow user to update their password if it does not match confirmation', function () {
            tu.loginHelper('badpassword@test.com', 'password');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            waitForAccountPage();
            tu.clickElement('id', 'update-password');
            tu.sendKeys('id', 'currentPassword', 'password');
            tu.sendKeys('id', 'newPassword', 'incorrect1');
            tu.sendKeys('id', 'confirmNewPassword', 'incorrect2');
            browser.sleep(500);
            expect(element(by.id('update-password-btn')).isEnabled()).toBe(false);
            tu.clickElement('css', "a.close > span");
        });

        it('should allow user to update their password', function () {
            tu.loginHelper('password@yaastest.com', 'password');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            waitForAccountPage();
            tu.clickElement('id', 'update-password');
            tu.sendKeys('id', 'currentPassword', 'password');
            tu.sendKeys('id', 'newPassword', 'password2');
            tu.sendKeys('id', 'confirmNewPassword', 'password2');
            browser.sleep(500);
            tu.clickElement('id', 'update-password-btn');
            browser.sleep(1500);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('css', '#logout-btn > a.ng-binding');
            browser.sleep(500);
            browser.get(tu.tenant + '/#!/ct');
            browser.sleep(1000);
            tu.loginHelper('password@yaastest.com', 'password2');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            browser.sleep(1000);
            tu.clickElement('id', 'update-password');
            tu.sendKeys('id', 'currentPassword', 'password2');
            tu.sendKeys('id', 'newPassword', 'password');
            tu.sendKeys('id', 'confirmNewPassword', 'password');
            browser.sleep(500);
            tu.clickElement('id', 'update-password-btn');
            browser.sleep(1500);
        });

        xit('should allow user to access order confirmation', function () {
            browser.sleep(5000);
            browser.get(tu.tenant + '/#!/confirmation/P0T7S1A7/');
            browser.wait(function () {
                return element(by.binding('SIGN_IN')).isPresent();
            });
            tu.sendKeys('id', 'usernameInput', 'order@yaastest.com');
            tu.sendKeys('id', 'passwordInput', 'password');
            tu.clickElement('id', 'sign-in-button');
            browser.sleep(1000);
            expect(element(by.binding('orderInfo.orderId')).getText()).toEqual('Order# P0T7S1A7');
        });

    });
});

