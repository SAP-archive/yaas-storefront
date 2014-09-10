var fs = require('fs');
var tu = require('./protractor-utils.js');


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

       });



   });
});

