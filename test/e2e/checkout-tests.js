var fs = require('fs');
var tu = require('./protractor-utils.js');

          function fillCheckoutFormExceptEmail(form) {
            tu.sendKeysById('firstName' + form, 'Mike');
            tu.sendKeysById('lastName' + form, 'night');
            tu.sendKeysById('address1' + form, '123');
            tu.sendKeysById('address2' + form, '321');
            tu.sendKeysById('city' + form, 'Boulder');
            element(by.id('country' + form)).sendKeys('USA');
            element(by.id('state' + form)).sendKeys('colorado');
            tu.sendKeysById('zipCode' + form, '80301');
          }

describe("checkout:", function () {



   describe("verify checkout functionality", function () {

     beforeEach(function () {
        browser.driver.manage().window().maximize();
        browser.get('#!/products/');
        browser.sleep(8000);
        tu.clickElement('xpath', tu.bicycle);
        browser.sleep(200);
        tu.clickElement('xpath', tu.buyButton);
        browser.sleep(200);
     });


          function verifyCartContents(itemPrice, totalPrice, quantity) {
            expect(element(by.xpath("//div[2]/div/div/div/div/section[2]/div/div/div[2]/div[2]")).getText()).toEqual(itemPrice); //item price
            expect(element(by.css("div.pull-right.ng-binding")).getText()).toEqual(totalPrice);
            expect(element(by.xpath("//div[2]/div[3]/div[3]")).getText()).toEqual(quantity);

          }

          function validateField(field, form, text) {
            element(by.id(field + form)).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById(field + form, text);
          }

          function verifyValidationForEachField(form) {
            validateField('zipCode', form, '80301');
            validateField('firstName', form, 'Mike');
            validateField('lastName', form, 'Night');
            validateField('email', '', 'mike@night');
            validateField('address1', form, '123');
            validateField('city', form, 'Boulder');
          }

           it('should load one product into cart and move to checkout', function () {
            tu.clickElement('css', tu.checkoutButton);
            verifyCartContents('Item Price: $9.50', 'TOTAL: $12.50', 'Qty: 1');
           });

           it('should load 2 of one product into cart and move to checkout', function () {
            tu.sendKeysByXpath(tu.cartQuantity, '2');
            tu.clickElement('css', tu.checkoutButton);
            verifyCartContents('Item Price: $9.50', 'TOTAL: $22.00', 'Qty: 2');
           });

           it('should load 2 different products into cart and move to checkout', function () {
            tu.clickElement('xpath', tu.contineShopping);
            tu.clickElement('css', 'img');
            tu.clickElement('xpath', tu.ringBowl);
            tu.clickElement('xpath', tu.buyButton);
            browser.sleep(100);
            tu.clickElement('css', tu.checkoutButton);
            verifyCartContents('Item Price: $9.50', 'TOTAL: $14.50', 'Qty: 1');
           });

           it('should allow all fields to be editable', function () {
            tu.clickElement('css', tu.checkoutButton);
            fillCheckoutFormExceptEmail('Bill');
            tu.sendKeysById('email', 'mike@night.com');
            expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            fillCheckoutFormExceptEmail('Ship');
            tu.clickElement('id', 'place-order-btn');
            expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
           });

           // it('should have basic validation on all fields', function () {
           //  tu.clickElement('css', tu.checkoutButton);
           //  fillCheckoutFormExceptEmail('Bill');
           //  verifyValidationForEachField('Bill');
           //  expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
           //  tu.clickElement('id', 'shipTo');
           //  verifyValidationForEachField('Ship');
           //  tu.clickElement('id', 'place-order-btn');
           //  expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
           // });



   });
});

describe("mobile checkout:", function () {



   describe("verify mobile checkout functionality", function () {

     beforeEach(function () {
        browser.driver.manage().window().setSize(750, 920);       
        browser.get('#!/products/Test1396454831925/');
       browser.sleep(8000);
     });



       it('should allow all fields to be editable on mobile', function () {
        tu.clickElement('xpath', tu.buyButton);
        browser.sleep(200);
        tu.clickElement('css', tu.checkoutButton);
        tu.sendKeysById('email', 'mike@night.com');
        fillCheckoutFormExceptEmail('Bill');
        browser.sleep(8000);
        tu.clickElement('xpath', "//div[11]/button"); //continueButton
        expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
        tu.clickElement('id', 'shipTo');
        fillCheckoutFormExceptEmail('Ship');
        tu.clickElement('xpath', "//div[6]/button");
        tu.clickElement('xpath', "//div[4]/button");
        tu.clickElement('id', "place-order-btn");
        expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');

       });

   });
});
