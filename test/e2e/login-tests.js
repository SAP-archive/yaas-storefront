var fs = require('fs');
var tu = require('./protractor-utils.js');

var timestamp = Number(new Date());

function updateAccountField(fieldName, text) {
    tu.clickElement('id', fieldName);
    tu.sendKeysByXpath("(//input[@type='text'])[3]", text);
    tu.clickElement('xpath', "//button[@type='submit']");
}
function updateTitleField(fieldName, text) {
    tu.clickElement('id', fieldName);
    element(by.xpath("//select[@ng-model='$data']")).sendKeys(text);
    tu.clickElement('xpath', "//button[@type='submit']");
}

function waitForAccountPage() {
    browser.wait(function () {
        return element(by.binding('MY_ACCOUNT')).isPresent();
    });
}


describe("login:", function () {


    describe("verify login functionality", function () {

        beforeEach(function () {
            // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
            browser.manage().deleteAllCookies();
            browser.driver.manage().window().setSize(1000, 1100);
            browser.get(tu.tenant + '/#!/ct');
            browser.switchTo().alert().then(
                function (alert) { alert.dismiss(); },
                function (err) { }
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
            expect(element(by.binding("account.firstName")).getText()).toEqual("Joe");
            // tu.clickElement('id', 'logout-btn');

        });

        it('should allow user to update account info', function () {
            tu.loginHelper('cool@cool.com', 'coolio');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            browser.sleep(2000);
            updateTitleField('title', 'Mr.');
            expect(element(by.binding("account.firstName")).getText()).toEqual("Joe");
            expect(element(by.binding("account.middleName")).getText()).toEqual("C");
            expect(element(by.binding("account.lastName")).getText()).toEqual("Cool");
            updateAccountField('first-name-edit', 'first');
            browser.sleep(1000);
            expect(element(by.binding("account.firstName")).getText()).toEqual("first");
            updateAccountField('middle-name-edit', 'middle');
            browser.sleep(1000);            
            expect(element(by.binding("account.middleName")).getText()).toEqual("middle");
            updateAccountField('last-name-edit', 'last');
            browser.sleep(1000);
            expect(element(by.binding("account.lastName")).getText()).toEqual("last");
            updateTitleField('title', 'Dr.');
            updateAccountField('email-edit', 'cool@cool.com');
            updateAccountField('first-name-edit', 'Joe');
            updateAccountField('middle-name-edit', 'C');
            browser.sleep(1000);
            updateAccountField('last-name-edit', 'Cool');
            expect(element(by.binding("account.firstName")).getText()).toEqual("Joe");
            expect(element(by.binding("account.middleName")).getText()).toEqual("C");
            expect(element(by.binding("account.lastName")).getText()).toEqual("Cool");

        });

        it('should create a new user', function () {
            tu.clickElement('id', 'login-btn');
            browser.wait(function () {
                return element(by.binding('CREATE_ACCOUNT')).isPresent();
            });
            tu.clickElement('binding', 'CREATE_ACCOUNT');
            tu.sendKeysById('emailInput', 'cool@cool' + timestamp + '.com');
            tu.sendKeysById('newPasswordInput', 'pass');
            tu.clickElement('id', 'create-acct-btn');
            expect(element(by.binding("error.message")).getText()).toEqual("Password invalid - minimum of 6 characters required.");
            tu.sendKeysById('newPasswordInput', 'password');
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
            tu.populateAddress('0', 'Address Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
            browser.sleep(500);
            expect(element(by.binding("defaultAddress.street")).getText()).toEqual("123 fake place");
            expect(element(by.binding("defaultAddress.city")).getText()).toEqual("Boulder");
            expect(element(by.binding("defaultAddress.state")).getText()).toContain("CO");
            expect(element(by.binding("defaultAddress.zipCode")).getText()).toContain("80301");
            expect(element(by.binding("defaultAddress.country")).getText()).toEqual("US");
            expect(element(by.binding("defaultAddress.contactPhone")).getText()).toEqual("303-303-3333");
            tu.populateAddress('1', '2nd Test', '321 phony street', 'apt 420', 'Toronto', 'ON', 'M4M 1H7', '720-555-1234');
            expect(element(by.repeater('address in addresses').row(1).column('address.contactName')).getText()).toEqual('2nd Test');
            expect(element(by.repeater('address in addresses').row(1).column('address.street')).getText()).toEqual("321 phony street, apt 420");
            expect(element(by.repeater('address in addresses').row(1).column('address.city')).getText()).toEqual("Toronto, ON M4M 1H7");
            expect(element(by.repeater('address in addresses').row(1).column('address.country')).getText()).toEqual("CA");
            expect(element(by.repeater('address in addresses').row(1).column('address.contactPhone')).getText()).toEqual("720-555-1234");
            tu.clickElement('xpath', "(//button[@id='set-default-btn'])[2]");
            browser.sleep(1500);
            expect(element(by.binding("defaultAddress.street")).getText()).toEqual("321 phony street");
            tu.clickElement('xpath', "(  //button[@id='set-default-btn'])[2]");
            browser.sleep(1000);
            expect(element(by.binding("defaultAddress.street")).getText()).toEqual("123 fake place");
            tu.clickElement('id', 'delete-address-btn');
            browser.wait(function () {
                return element(by.id('delete-address-btn')).isPresent();
            });
            tu.clickElement('id', 'delete-address-btn');
            expect(element(by.id('delete-address-btn')).isPresent()).toBe(false);

        });

        it('should not allow user to update their password with incorrect password', function () {
            tu.loginHelper('badpassword@test.com', 'password');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            waitForAccountPage();
            tu.clickElement('id', 'password-edit');
            tu.sendKeysById('currentPassword', 'incorrect');
            tu.sendKeysById('newPassword', 'notnew');
            tu.sendKeysById('confirmNewPassword', 'notnew');
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
            tu.clickElement('id', 'password-edit');
            tu.sendKeysById('currentPassword', 'password');
            tu.sendKeysById('newPassword', '123');
            tu.sendKeysById('confirmNewPassword', '123');
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
            tu.clickElement('id', 'password-edit');
            tu.sendKeysById('currentPassword', 'password');
            tu.sendKeysById('newPassword', 'incorrect1');
            tu.sendKeysById('confirmNewPassword', 'incorrect2');
            browser.sleep(500);
            expect(element(by.id('update-password-btn')).isEnabled()).toBe(false);
            tu.clickElement('css', "a.close > span");
        });

        it('should allow user to update their password', function () {
            tu.loginHelper('password@hybristest.com', 'password');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            waitForAccountPage();
            tu.clickElement('id', 'password-edit');
            tu.sendKeysById('currentPassword', 'password');
            tu.sendKeysById('newPassword', 'password2');
            tu.sendKeysById('confirmNewPassword', 'password2');
            browser.sleep(500);
            tu.clickElement('id', 'update-password-btn');
            browser.sleep(1500);
            tu.clickElement('id', 'my-account-dropdown')
            tu.clickElement('css', '#logout-btn > a.ng-binding');
            browser.sleep(500);
            browser.get(tu.tenant + '/#!/ct');
            browser.sleep(1000);
            tu.loginHelper('password@hybristest.com', 'password2');
            browser.sleep(1000);
            tu.clickElement('id', 'my-account-dropdown');
            tu.clickElement('id', 'my-account');
            browser.sleep(1000);
            tu.clickElement('id', 'password-edit');
            tu.sendKeysById('currentPassword', 'password2');
            tu.sendKeysById('newPassword', 'password');
            tu.sendKeysById('confirmNewPassword', 'password');
            browser.sleep(500);
            tu.clickElement('id', 'update-password-btn');
            browser.sleep(1500);
        });

        xit('should allow user to access order confirmation', function (){
            browser.sleep(5000);
            browser.get(tu.tenant + '/#!/confirmation/P0T7S1A7/');
            browser.wait(function () {
                return element(by.binding('SIGN_IN')).isPresent();
            });
            tu.sendKeys('id', 'usernameInput', 'order@hybristest.com');
            tu.sendKeys('id', 'passwordInput', 'password');
            tu.clickElement('id', 'sign-in-button');
            browser.sleep(1000);
            expect(element(by.binding('orderInfo.orderId')).getText()).toEqual('Order# P0T7S1A7');
        });

    });
});

