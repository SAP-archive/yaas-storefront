// var fs = require('fs');
// var tu = require('./protractor-utils.js');


// describe("cart:", function () {



//    describe("verify cart functionality", function () {

//      beforeEach(function () {
//          // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
//        browser.driver.manage().window().maximize();
//        browser.get('#!/products/');
//        browser.sleep(8000);
//      });


//        it('should load one product into cart', function () {
//          tu.clickElement('id', tu.cartButtonId);
//          browser.sleep(250);
//          tu.verifyCartTotal("$0.00");
//          tu.clickElement('xpath', tu.contineShopping);
//          tu.clickElement('xpath', tu.bicycle);
//          tu.clickElement('xpath', tu.buyButton);
//          browser.sleep(250);
//          tu.verifyCartAmount("1");
//          tu.verifyCartTotal("$9.50");
//          tu.clickElement('xpath', tu.removeFromCart);
//          tu.verifyCartTotal("$0.00");

//        });

//          it('should load multiple products into cart', function () {
//            tu.clickElement('id', tu.cartButtonId);
//            browser.sleep(250);
//            tu.verifyCartTotal("$0.00");
//            tu.clickElement('xpath', tu.contineShopping);
//            tu.clickElement('xpath', tu.bicycle);
//            tu.clickElement('xpath', tu.buyButton);
//            browser.sleep(250);
//            tu.verifyCartAmount("1");
//            tu.verifyCartTotal("$9.50");
//            tu.clickElement('xpath', tu.contineShopping);
//            tu.clickElement('css', 'img');
//            tu.clickElement('xpath', tu.ringBowl);
//            tu.clickElement('xpath', tu.buyButton);
//            tu.verifyCartTotal("$11.50");

//          });

//          it('should update quantity', function () {
//            tu.clickElement('id', tu.cartButtonId);
//           browser.sleep(250);
//            tu.verifyCartTotal('$0.00');
//            tu.clickElement('xpath', tu.contineShopping);
//            tu.clickElement('xpath', tu.bicycle);
//            tu.clickElement('xpath', tu.buyButton);
//            browser.sleep(250);
//            tu.verifyCartAmount('1');
//            tu.verifyCartTotal('$9.50');
//            tu.clickElement('xpath', tu.contineShopping);
//            tu.clickElement('xpath', tu.buyButton);
//            tu.verifyCartAmount('2');
//            tu.verifyCartTotal('$19.00');
//            tu.sendKeysByXpath(tu.cartQuantity, '5');
//            tu.verifyCartAmount("5");
//            tu.verifyCartTotal("$47.50");
//            tu.sendKeysByXpath(tu.cartQuantity, '10');
//            tu.verifyCartAmount("10");
//            tu.verifyCartTotal("$95.00");
//          });

//          it('should not add out of stock item', function () {
//            tu.clickElement('id', tu.cartButtonId);
//            browser.sleep(250);
//            tu.verifyCartTotal('$0.00');
//            tu.clickElement('xpath', tu.contineShopping);
//            tu.clickElement('xpath', tu.testProduct2);
//            tu.clickElement('xpath', tu.outOfStockButton);
//            tu.clickElement('id',tu.cartButtonId);
//            tu.verifyCartTotal('$0.00');
//            tu.clickElement('xpath', tu.contineShopping);
//          });

//          it('should not allow negative numbers', function () {
//           tu.clickElement('id', tu.cartButtonId);
//           browser.sleep(250);
//           tu.verifyCartTotal('$0.00');
//           tu.clickElement('xpath', tu.contineShopping);
//           tu.clickElement('xpath', tu.bicycle);
//           tu.clickElement('xpath', tu.buyButton); 
//           tu.verifyCartTotal("$9.50");
//           tu.sendKeysByXpath(tu.cartQuantity, '-5');
//           tu.verifyCartAmount('5');
//           tu.verifyCartTotal('$47.50');
//           tu.sendKeysByXpath(tu.cartQuantity, 'it should not accept alpha');
//           tu.verifyCartAmount('');
//           tu.verifyCartTotal('$0.00');
//          });

//    });
// });

