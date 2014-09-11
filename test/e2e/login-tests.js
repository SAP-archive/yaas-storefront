var fs = require('fs');
var tu = require('./protractor-utils.js');

var timestamp = Number(new Date());

describe("login:", function () {



   describe("verify login functionality", function () {

     beforeEach(function () {
         // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
       browser.driver.manage().window().maximize();
       browser.get(tu.tenant + '/#!/products');
       browser.sleep(8000);
     });


       it('should not allow user to login', function () {
         tu.clickElement('id', "login-btn");
         browser.sleep(1000);
         tu.sendKeysById('usernameInput', 'bad@bad.com');
         tu.sendKeysById('passwordInput', 'bad');
         tu.clickElement('id', 'sign-in-button');
         browser.sleep(250);
         expect(element(by.css("li.ng-binding.ng-scope")).getText()).toEqual("Account with e-mail 'bad@bad.com' not found.");

       });

       it('should allow existing user to login', function () {
         tu.clickElement('id', "login-btn");
         browser.sleep(1000);
         tu.sendKeysById('usernameInput', 'cool@cool.com');
         tu.sendKeysById('passwordInput', 'coolio');
         tu.clickElement('id', 'sign-in-button');
         browser.sleep(1000);
         tu.clickElement('css', 'img.user-avatar');
         expect(element(by.binding("defaultAddress.street")).getText()).toEqual("place ave street");
         tu.clickElement('id', "logout-btn");

       });


       it('should create a new user', function () {
         tu.clickElement('id', "login-btn");
         browser.sleep(1000);
         tu.clickElement('linkText', 'Create Account');
         tu.sendKeysById('emailInput', 'cool@cool' + timestamp + '.com');
         tu.sendKeysById('newPasswordInput', 'pass');
         tu.clickElement('id', 'create-acct-btn');
         expect(element(by.binding("error.message")).getText()).toEqual("password must have at least six characters");
         tu.sendKeysById('newPasswordInput', 'password');
         tu.clickElement('id', 'create-acct-btn');
         browser.sleep(1000);
         tu.clickElement('css', 'img.user-avatar');
         expect(element(by.css("h2.pull-left.ng-binding")).getText()).toEqual("Addressbook");

       });

   });
});

