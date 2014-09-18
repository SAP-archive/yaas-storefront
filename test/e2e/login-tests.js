var fs = require('fs');
var tu = require('./protractor-utils.js');

var timestamp = Number(new Date());


  function populateAddress(contact, street, aptNumber, city, state, zip, phone) {
         tu.sendKeysById('contactName', contact);
         tu.sendKeysById('street', street);
         tu.sendKeysById('streetAppendix', aptNumber);
         element(by.css('select option[value="USA"]')).click()
         tu.sendKeysById('city', city);
         element(by.css('select option[value="'+ state +'"]')).click()
         tu.sendKeysById('zipCode', zip);
         tu.sendKeysById('contactPhone', phone); 
  }

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
         expect(element(by.binding("defaultAddress.street")).getText()).toEqual("123place ave street");
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
         tu.clickElement('id', "logout-btn");


       });

       it('should allow existing user to manage addresses', function () {
        browser.executeScript('window.confirm = function(){return true;}');
         tu.clickElement('id', "login-btn");
         browser.sleep(1000);
         tu.sendKeysById('usernameInput', 'address@test.com');
         tu.sendKeysById('passwordInput', 'password');
         tu.clickElement('id', 'sign-in-button');
         browser.sleep(1000);
         tu.clickElement('css', 'img.user-avatar');
         browser.sleep(500);         
         tu.clickElement('id', "add-address-btn");
         populateAddress('Address Test', '123 fake place', 'apt 419', 'Boulder', 'CO', '80301', '303-303-3333');
         tu.clickElement('id', 'save-address-btn');
         browser.sleep(500);
          expect(element(by.binding("defaultAddress.street")).getText()).toEqual("123 fake place");
          expect(element(by.binding("defaultAddress.city")).getText()).toEqual("Boulder");
          expect(element(by.binding("defaultAddress.state")).getText()).toContain("CO");
          expect(element(by.binding("defaultAddress.zipCode")).getText()).toContain("80301");
          expect(element(by.binding("defaultAddress.country")).getText()).toEqual("USA");
          expect(element(by.binding("defaultAddress.contactPhone")).getText()).toEqual("303-303-3333");
         tu.clickElement('id', "add-address-btn");
         populateAddress('2nd Test', '321 phony street', 'apt 420', 'Denver', 'CO', '90210', '720-555-1234');
          tu.clickElement('id', 'save-address-btn');

         expect(element(by.repeater('address in addresses').row(1).column('address.contactName')).getText()).toEqual('2nd Test');
          expect(element(by.repeater('address in addresses').row(1).column('address.street')).getText()).toEqual("321 phony street, apt 420");
          expect(element(by.repeater('address in addresses').row(1).column('address.city')).getText()).toEqual("Denver, CO 90210");
          expect(element(by.repeater('address in addresses').row(1).column('address.country')).getText()).toEqual("USA");
          expect(element(by.repeater('address in addresses').row(1).column('address.contactPhone')).getText()).toEqual("720-555-1234");
          tu.clickElement('xpath', "(//button[@id='set-default-btn'])[2]");
          browser.sleep(1500);
          expect(element(by.binding("defaultAddress.street")).getText()).toEqual("321 phony street");
          tu.clickElement('xpath', "(  //button[@id='set-default-btn'])[2]");
          browser.sleep(1000);
          expect(element(by.binding("defaultAddress.street")).getText()).toEqual("123 fake place");
          tu.clickElement('id', 'delete-address-btn');  
          // browser.switchTo().alert().accept(); 
          tu.clickElement('id', 'delete-address-btn');
          // browser.switchTo().alert().accept(); 
          expect(element(by.css("p.ng-binding")).getText()).toEqual("You have no addresses stored!");
         tu.clickElement('id', "logout-btn");

       });

   });
});

