var fs = require('fs');
var tu = require('./protractor-utils.js');


describe("cart:", function () {



   describe("verify cart functionality", function () {

     beforeEach(function () {
         // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
       browser.driver.manage().window().maximize();
       browser.get('#!/products/');
       browser.sleep(8000);
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

       it('should allow all fields to be editabel', function () {
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
        element(by.id('stateBill')).sendKeys('colorado');
        // tu.sendKeysById('stateBill', 'colorado');
        tu.sendKeysById('zipCodeBill', '80301');
        expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
       });

   });
});

