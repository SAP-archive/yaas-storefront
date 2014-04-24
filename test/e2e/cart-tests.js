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




// within a test:


       it('should load one product into cart', function () {
         tu.clickElementById(tu.cartButtonId);
         browser.sleep(500);
         tu.verifyCartTotal("$0.00");
         tu.clickElementByXpath(tu.contineShopping);
         tu.clickElementByXpath(tu.bicycle);
         tu.clickElementByXpath(tu.buyButton);
         browser.sleep(500);
         tu.verifyCartAmount("1");
         tu.verifyCartTotal("$9.50");
         tu.clickElementByXpath(tu.removeFromCart);
         tu.verifyCartTotal("$0.00");

       });

         it('should load multiple products into cart', function () {
           tu.clickElementById(tu.cartButtonId);
           browser.sleep(250);
           tu.verifyCartTotal("$0.00");
           tu.clickElementByXpath(tu.contineShopping);
           tu.clickElementByXpath(tu.bicycle);
           tu.clickElementByXpath(tu.buyButton);
           browser.sleep(250);
           tu.verifyCartAmount("1");
           tu.verifyCartTotal("$9.50");
           tu.clickElementByXpath(tu.contineShopping);
           tu.clickByCss("img");
           tu.clickElementByXpath(tu.testProduct3);
           tu.clickElementByXpath(tu.buyButton);
           tu.verifyCartTotal("$11.50");

         });

         it('should update quantity', function () {
           tu.clickElementById(tu.cartButtonId);
          browser.sleep(250);
           tu.verifyCartTotal("$0.00");
           tu.clickElementByXpath(tu.contineShopping);
           tu.clickElementByXpath(tu.bicycle);
           tu.clickElementByXpath(tu.buyButton);
           browser.sleep(500);
           tu.verifyCartAmount("1");
           tu.verifyCartTotal("$9.50");
           tu.clickElementByXpath(tu.contineShopping);
           tu.clickElementByXpath(tu.buyButton);
           tu.verifyCartAmount("2");
           tu.verifyCartTotal("$19.00");
           element(by.xpath("//input[@type='number']")).clear();
           element(by.xpath("//input[@type='number']")).sendKeys("5");
           tu.verifyCartAmount("5");
           tu.verifyCartTotal("$47.50");
          element(by.xpath("//input[@type='number']")).clear();
           element(by.xpath("//input[@type='number']")).sendKeys("10");
           tu.verifyCartAmount("10");
           tu.verifyCartTotal("$95.00");
         });

         it('should not add out of stock item', function () {
           tu.clickElementById(tu.cartButtonId);
           browser.sleep(250);
           tu.verifyCartTotal("$0.00");
           tu.clickElementByXpath(tu.contineShopping);
           tu.clickElementByXpath(tu.testProduct2);
           tu.clickElementByXpath("//div[2]/button"); //out of stock button
           tu.clickElementById(tu.cartButtonId);
           tu.verifyCartTotal("$0.00");
           tu.clickElementByXpath(tu.contineShopping);
         });

         it('should not allow negative numbers', function () {
           tu.clickElementById(tu.cartButtonId);
           tu.verifyCartTotal("$0.00");
           tu.clickElementByXpath(tu.contineShopping);
           tu.clickElementByXpath(tu.bicycle);
           tu.clickElementByXpath(tu.buyButton); 
           tu.verifyCartTotal("$9.50");
            element(by.xpath("//input[@type='number']")).clear();
           element(by.xpath("//input[@type='number']")).sendKeys("-5");
           tu.verifyCartAmount("5");
           tu.verifyCartTotal("$47.50");
            element(by.xpath("//input[@type='number']")).clear();
           element(by.xpath("//input[@type='number']")).sendKeys("it should not accept alpha");
           tu.verifyCartAmount("");
           tu.verifyCartTotal("$0.00");
         });

   });
});

