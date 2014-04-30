var fs = require('fs');
var tu = require('./protractor-utils.js');


describe("checkout:", function () {



   describe("verify checkout functionality", function () {

     beforeEach(function () {
         // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
       browser.driver.manage().window().maximize();
       browser.get('#!/products/');
       browser.sleep(10000);
     });


           it('should load one product into cart and move to checkout', function () {
            tu.clickElement('xpath', tu.bicycle);
            tu.clickElement('xpath', tu.buyButton);
            browser.sleep(200);
            tu.clickElement('css', tu.checkoutButton);
            expect(element(by.xpath("//div[2]/div/div/div/div/section[2]/div/div/div[2]/div[2]")).getText()).toEqual('Item Price: $9.50'); //item price
            expect(element(by.css("div.pull-right.ng-binding")).getText()).toEqual('TOTAL: $12.50');
            expect(element(by.xpath("//div[2]/div[3]/div[3]")).getText()).toEqual('Qty: 1');
           });

           it('should load 2 of one product into cart and move to checkout', function () {
            tu.clickElement('xpath', tu.bicycle);
            browser.sleep(200);
            tu.clickElement('xpath', tu.buyButton);
            browser.sleep(200);
            tu.sendKeysByXpath(tu.cartQuantity, '2');
            tu.clickElement('css', tu.checkoutButton);
            expect(element(by.xpath("//div[2]/div/div/div/div/section[2]/div/div/div[2]/div[2]")).getText()).toEqual('Item Price: $9.50');
            expect(element(by.css("div.pull-right.ng-binding")).getText()).toEqual('TOTAL: $22.00');
            expect(element(by.xpath("//div[2]/div[3]/div[3]")).getText()).toEqual('Qty: 2');
           });

           it('should load 2 different products into cart and move to checkout', function () {
            tu.clickElement('xpath', tu.bicycle);
            browser.sleep(200);
            tu.clickElement('xpath', tu.buyButton);
            browser.sleep(200);
            tu.clickElement('xpath', tu.contineShopping);
            tu.clickElement('css', 'img');
            tu.clickElement('xpath', tu.ringBowl);
            tu.clickElement('xpath', tu.buyButton);
            browser.sleep(100);
            tu.clickElement('css', tu.checkoutButton);
            expect(element(by.xpath("//div[2]/div/div/div/div/section[2]/div/div/div[2]/div[2]")).getText()).toEqual('Item Price: $9.50');
            expect(element(by.css("div.pull-right.ng-binding")).getText()).toEqual('TOTAL: $14.50');
            expect(element(by.xpath("//div[2]/div[3]/div[3]")).getText()).toEqual('Qty: 1');
           });

           it('should allow all fields to be editable', function () {
            tu.clickElement('xpath', tu.bicycle);
            browser.sleep(200);
            tu.clickElement('xpath', tu.buyButton);
            browser.sleep(200);
            tu.clickElement('css', tu.checkoutButton);
            tu.sendKeysById('firstNameBill', 'Mike');
            tu.sendKeysById('lastNameBill', 'night');
            tu.sendKeysById('email', 'mike@night.com');
            tu.sendKeysById('address1Bill', '123');
            tu.sendKeysById('address2Bill', '321');
            tu.sendKeysById('cityBill', 'Boulder');
            element(by.id('countryBill')).sendKeys('USA');
            element(by.id('stateBill')).sendKeys('colorado');
            tu.sendKeysById('zipCodeBill', '80301');
            expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeysById('firstNameShip', 'John');
            tu.sendKeysById('lastNameShip', 'night');
            tu.sendKeysById('address1Ship', '456');
            tu.sendKeysById('address2Ship', '654');
            tu.sendKeysById('cityShip', 'Boulder');
            element(by.id('countryShip')).sendKeys('USA');
            element(by.id('stateShip')).sendKeys('colorado');
            tu.sendKeysById('zipCodeShip', '80301');
            tu.clickElement('id', 'place-order-btn');
            expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
           });

           it('should have basic validation on all fields', function () {
            tu.clickElement('xpath', tu.bicycle);
            browser.sleep(200);
            tu.clickElement('xpath', tu.buyButton);
            browser.sleep(200);
            tu.clickElement('css', tu.checkoutButton);
            tu.sendKeysById('firstNameBill', 'Mike');
            tu.sendKeysById('lastNameBill', 'night');
            tu.sendKeysById('email', 'mike@night.com');
            tu.sendKeysById('address1Bill', '123');
            tu.sendKeysById('address2Bill', '321');
            tu.sendKeysById('cityBill', 'Boulder');
            element(by.id('countryBill')).sendKeys('USA');
            element(by.id('stateBill')).sendKeys('colorado');
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('zipCodeBill', '80301');
            element(by.id('firstNameBill')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('firstNameBill', 'Mike');
            element(by.id('lastNameBill')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('lastNameBill', 'night');
            element(by.id('email')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('email', 'mike@night.com');
            element(by.id('address1Bill')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('address1Bill', '123');
            element(by.id('cityBill')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('cityBill', 'Boulder');
            expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            tu.sendKeysById('firstNameShip', 'John');
            tu.sendKeysById('lastNameShip', 'night');
            tu.sendKeysById('address1Ship', '456');
            tu.sendKeysById('address2Ship', '654');
            tu.sendKeysById('cityShip', 'Boulder');
            element(by.id('countryShip')).sendKeys('USA');
            element(by.id('stateShip')).sendKeys('colorado');
            element(by.id('zipCodeShip')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('zipCodeShip', '80301');
            element(by.id('firstNameShip')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('firstNameShip', 'Mike');
            element(by.id('lastNameShip')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('lastNameShip', 'night');
            element(by.id('email')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('email', 'mike@night.com');
            element(by.id('address1Ship')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('address1Ship', '123');
            element(by.id('cityShip')).clear();
            tu.clickElement('id', 'place-order-btn');
            tu.sendKeysById('cityShip', 'Boulder');
            tu.clickElement('id', 'place-order-btn');
            expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
           });



   });
});

describe("mobile checkout:", function () {



   describe("verify mobile checkout functionality", function () {

     beforeEach(function () {
         // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
        browser.driver.manage().window().setSize(750, 920);       
        browser.get('#!/products/Test1396454831925/');
       browser.sleep(8000);
     });



       it('should allow all fields to be editable on mobile', function () {
        tu.clickElement('xpath', tu.buyButton);
        browser.sleep(200);
        tu.clickElement('css', tu.checkoutButton);
        tu.sendKeysById('firstNameBill', 'Mike');
        tu.sendKeysById('lastNameBill', 'night');
        tu.sendKeysById('email', 'mike@night.com');
        tu.sendKeysById('address1Bill', '123');
        tu.sendKeysById('address2Bill', '321');
        tu.sendKeysById('cityBill', 'Boulder');
        element(by.id('countryBill')).sendKeys('USA');
        element(by.id('stateBill')).sendKeys('colorado');
        tu.sendKeysById('zipCodeBill', '80301');
        browser.sleep(8000);
        tu.clickElement('xpath', "//div[11]/button"); //continueButton
        expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
        tu.clickElement('id', 'shipTo');
        tu.sendKeysById('firstNameShip', 'John');
        tu.sendKeysById('lastNameShip', 'night');
        tu.sendKeysById('address1Ship', '456');
        tu.sendKeysById('address2Ship', '654');
        tu.sendKeysById('cityShip', 'Boulder');
        element(by.id('countryShip')).sendKeys('USA');
        element(by.id('stateShip')).sendKeys('colorado');
        tu.sendKeysById('zipCodeShip', '80301');
        tu.clickElement('xpath', "//div[6]/button");
        tu.clickElement('xpath', "//div[4]/button");
        tu.clickElement('id', "place-order-btn");
            expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');

       });

   });
});
