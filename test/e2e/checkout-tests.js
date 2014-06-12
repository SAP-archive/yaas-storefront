// var fs = require('fs');
// var tu = require('./protractor-utils.js');

//           function fillCheckoutFormExceptEmail(form) {
//             tu.sendKeysById('firstName' + form, 'Mike');
//             tu.sendKeysById('lastName' + form, 'night');
//             tu.sendKeysById('address1' + form, '123');
//             tu.sendKeysById('address2' + form, '321');
//             tu.sendKeysById('city' + form, 'Boulder');
//             element(by.id('country' + form)).sendKeys('USA');
//             element(by.id('state' + form)).sendKeys('colorado');
//             tu.sendKeysById('zipCode' + form, '80301');
//           }

//           function verifyOrderConfirmation() {
//             expect(element(by.binding('span.highlight.ng-binding')).getText()).toContain('Order# ');
//             expect(element(by.css('address > span.ng-binding')).getText()).toContain('MIKE@NIGHT.COM');
//             expect(element(by.xpath('//address[2]/span')).getText()).toContain('MIKE NIGHT');
//             expect(element(by.xpath('//span[2]')).getText()).toContain('123');
//             expect(element(by.xpath('//span[3]')).getText()).toContain('BOULDER, CO 80301');
//           }

//           function verifyCartContents(itemPrice, totalPrice, quantity) {
//             expect(element(by.xpath("//div[2]/div/div/div/div/section[2]/div/div/div[2]/div[2]")).getText()).toEqual(itemPrice); //item price
//             expect(element(by.css("div.pull-right.ng-binding")).getText()).toEqual('TOTAL: ' + totalPrice);
//             expect(element(by.css("span.value.ng-binding")).getText()).toEqual(totalPrice);
//             expect(element(by.css("div.variant.col-md-6  > span.ng-binding")).getText()).toEqual(quantity);

//           }

//           function validateField(field, form, text, buttonType, button) {
//             element(by.id(field + form)).clear();
//             tu.clickElement(buttonType, button);
//             browser.executeScript("document.getElementById('" + field + form + "').style.display='block';");
//             browser.sleep(200);
//             tu.sendKeysById(field + form, text);
//           }

//           function verifyValidationForEachField(form, buttonType, button) {
//             validateField('zipCode', form, '80301', buttonType, button);
//             validateField('firstName', form, 'Mike', buttonType, button);
//             validateField('lastName', form, 'Night', buttonType, button);
//             validateField('address1', form, '123', buttonType, button);
//             validateField('city', form, 'Boulder', buttonType, button);
//           }

//           function fillCreditCardForm(ccNumber, ccMonth, ccYear, cvcNumber) {
//             tu.sendKeysById('ccNumber', ccNumber);
//             element(by.id('expMonth')).sendKeys(ccMonth);
//             element(by.id('expYear')).sendKeys(ccYear);
//             tu.sendKeysById('cvc', cvcNumber);
//           }

// describe("checkout:", function () {



//    describe("verify checkout functionality", function () {

//      beforeEach(function () {

//         browser.driver.manage().window().maximize();
//         browser.get('#!/products/');
//         browser.sleep(8000);
//         tu.clickElement('xpath', tu.frenchPress);
//         browser.sleep(500);
//         tu.clickElement('xpath', tu.buyButton);
//         browser.sleep(200);
//      });




//            it('should load one product into cart and move to checkout', function () {
//             tu.clickElement('css', tu.checkoutButton);
//             verifyCartContents('Item Price: $24.57', '$27.57', '1');
//            });

//            it('should load 2 of one product into cart and move to checkout', function () {
//             tu.sendKeysByXpath(tu.cartQuantity, '2');
//             tu.clickElement('css', tu.checkoutButton);
//             verifyCartContents('Item Price: $24.57', '$52.14', '2');
//            });

//            it('should load 2 different products into cart and move to checkout', function () {
//             tu.clickElement('xpath', tu.contineShopping);
//             tu.clickElement('css', 'img');
//             tu.clickElement('xpath', tu.ringBowl);
//             tu.clickElement('xpath', tu.buyButton);
//             browser.sleep(100);
//             tu.clickElement('css', tu.checkoutButton);
//             verifyCartContents('Item Price: $24.57', '$29.57', '1');
//            });

//            it('should allow all fields to be editable', function () {
//             browser.ignoreSynchronization = true;
//             tu.clickElement('css', tu.checkoutButton);
//             fillCheckoutFormExceptEmail('Bill');
//             tu.sendKeysById('email', 'mike@night.com');
//             expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
//             tu.clickElement('id', 'shipTo');
//             // fillCheckoutFormExceptEmail('Ship');
//             fillCreditCardForm('5555555555554444', '06', '2014', '000')
//             tu.clickElement('id', 'place-order-btn');
//             browser.sleep(8000);
//             // expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
//             verifyOrderConfirmation();
//            });

//            it('should have basic validation on all fields', function () {
//             browser.ignoreSynchronization = true;
//             tu.clickElement('css', tu.checkoutButton);
//             fillCheckoutFormExceptEmail('Bill');
//             tu.sendKeysById('email', 'mike@place.com'); 
//             fillCreditCardForm('5555555555554444', '06', '2014', '000')
//             verifyValidationForEachField('Bill', 'id', 'place-order-btn'); 
//             validateField('email', '', 'mike@night.com', 'id', 'place-order-btn');
//             expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
//             tu.clickElement('id', 'shipTo');
//             verifyValidationForEachField('Ship', 'id', 'place-order-btn');
//             browser.sleep(200);
//             validateField('cvc', '', '00', 'id', 'place-order-btn');
//             tu.clickElement('id', 'place-order-btn');
//             expect(element(by.xpath('//div[5]/div/small')).getText()).toContain('Please enter a valid code.');
//             browser.executeScript("document.getElementById('cvc').style.display='block';");
//             validateField('cvc', '', '123', 'id', 'place-order-btn');
//             validateField('ccNumber', '', '0000000000000000', 'id', 'place-order-btn');
//             tu.clickElement('id', 'place-order-btn');
//             // expect(element(by.xpath('//div[2]/div/small')).getText()).toContain('Your card number is incorrect.');
//             browser.executeScript("document.getElementById('ccNumber').style.display='block';");
//             validateField('ccNumber', '', '5555555555554444', 'id', 'place-order-btn');
//             tu.clickElement('id', 'place-order-btn');
//             browser.sleep(8000);
//             // expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
//             verifyOrderConfirmation();
//            });



//    });
// });

// describe("mobile checkout:", function () {



//    describe("verify mobile checkout functionality", function () {

//      beforeEach(function () {
//         browser.driver.manage().window().setSize(750, 1100);       
//         browser.get('#!/products/Test1396454831925/');
//        browser.sleep(8000);
//      });

//      var continueButton1 = '//div[11]/button'
//      var continueButton2 = '//div[6]/button'
//      var paymentButton = "//button[@type='submit']"
   

//        it('should allow all fields to be editable on mobile', function () {
//         tu.clickElement('xpath', tu.buyButton);
//         browser.sleep(200);
//         tu.clickElement('css', tu.checkoutButton);
//         tu.sendKeysById('email', 'mike@night.com');
//         fillCheckoutFormExceptEmail('Bill');
//         tu.clickElement('xpath', continueButton1);
//         expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
//         tu.clickElement('id', 'shipTo');
//         // fillCheckoutFormExceptEmail('Ship');
//         tu.clickElement('xpath', continueButton2);
//         fillCreditCardForm('5555555555554444', '06', '2014', '000')
//         tu.clickElement('xpath', paymentButton);
//         tu.clickElement('id', "place-order-btn");
//         browser.sleep(8000);
//         verifyOrderConfirmation();
//        });

//        it('should have basic validation on mobile', function () {
//         tu.clickElement('xpath', tu.buyButton);
//         browser.sleep(200);
//         tu.clickElement('css', tu.checkoutButton);
//         tu.sendKeysById('email', 'mike@night.com');
//         fillCheckoutFormExceptEmail('Bill');
//         verifyValidationForEachField('Bill', 'xpath', continueButton1); 
//         validateField('email', '', 'mike@night.com', 'xpath', continueButton1);
//         tu.clickElement('xpath', continueButton1);
//         expect(element(by.css("span.adress.ng-binding")).getText()).toEqual('123');
//         tu.clickElement('id', 'shipTo');
//         // fillCheckoutFormExceptEmail('Ship');
//         verifyValidationForEachField('Ship', 'xpath', continueButton2); 
//         tu.clickElement('xpath', continueButton2);
//         fillCreditCardForm('5555555555554444', '06', '2014', '000')
//         tu.clickElement('xpath', paymentButton);
//         tu.clickElement('id', "place-order-btn");
//         browser.sleep(9000);
//         // expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
//         verifyOrderConfirmation();

//        });

//    });
// });
