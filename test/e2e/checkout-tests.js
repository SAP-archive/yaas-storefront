var fs = require('fs');
var tu = require('./protractor-utils.js');

          var date = Date();
          var month = date.substr(4, 3);
          var d = new Date();
          var curr_date = d.getDate();
          var curr_year = d.getFullYear();
          var currentDate = month + " " + curr_date + ", " + curr_year;

          function fillCheckoutFormExceptEmail(form) {
            tu.sendKeysById('contactName' + form, 'Mike Night');
            tu.sendKeysById('address1' + form, '123');
            tu.sendKeysById('address2' + form, '321');
            tu.sendKeysById('city' + form, 'Boulder');
            element(by.id('country' + form)).sendKeys('USA');
            element(by.id('state' + form)).sendKeys('colorado');
            tu.sendKeysById('zipCode' + form, '80301');
          }

          function verifyOrderConfirmation(email, name, number, cityStateZip) {
            expect(element(by.css('address > span.ng-binding')).getText()).toContain(email);
            expect(element(by.xpath('//address[2]/span')).getText()).toContain(name);
            expect(element(by.xpath('//span[2]')).getText()).toContain(number);
            expect(element(by.xpath('//span[3]')).getText()).toContain(cityStateZip);
          }


          function verifyCartContents(itemPrice, totalPrice, quantity) {
            expect(element(by.xpath("//div[2]/div/div/div/div/section[2]/div/div/div[2]/div[2]")).getText()).toEqual(itemPrice); //item price
            expect(element(by.binding("cart.totalPrice.value")).getText()).toContain(totalPrice);
            expect(element(by.css("tfoot > tr > td.text-right.ng-binding")).getText()).toEqual(totalPrice);
            expect(element(by.css("div.variant.col-md-6  > span.ng-binding")).getText()).toEqual(quantity);

          }

          function validateField(field, form, text, buttonType, button) {
            element(by.id(field + form)).clear();
            tu.clickElement(buttonType, button);
            browser.executeScript("document.getElementById('" + field + form + "').style.display='block';");
            browser.sleep(200);
            tu.sendKeysById(field + form, text);
          }

          function verifyValidationForEachField(form, buttonType, button) {
            validateField('zipCode', form, '80301', buttonType, button);
            validateField('contactName', form, 'Mike Night', buttonType, button);
            validateField('address1', form, '123', buttonType, button);
            validateField('city', form, 'Boulder', buttonType, button);
          }

          function fillCreditCardForm(ccNumber, ccMonth, ccYear, cvcNumber) {
            tu.sendKeysById('ccNumber', ccNumber);
            element(by.id('expMonth')).sendKeys(ccMonth);
            element(by.id('expYear')).sendKeys(ccYear);
            tu.sendKeysById('cvc', cvcNumber);
          }

describe("checkout:", function () {



   describe("verify checkout functionality", function () {

     beforeEach(function () {
        browser.get(tu.tenant + '/#!/products/542da5d60c4e7c0409a167fb/');
        browser.driver.manage().window().maximize();
        browser.sleep(8000);
        tu.clickElement('id', tu.buyButton);
        browser.sleep(4000);
     });




           it('should load one product into cart and move to checkout', function () {
            tu.clickElement('css', tu.checkoutButton);
            verifyCartContents('Item Price: $24.57', '$27.81', '1');
           });

           it('should load 2 of one product into cart and move to checkout', function () {
            tu.sendKeysByXpath(tu.cartQuantity, '2');
            tu.clickElement('css', tu.checkoutButton);
            verifyCartContents('Item Price: $24.57', '$52.38', '2');
           });

           it('should load 2 different products into cart and move to checkout', function () {
            tu.clickElement('xpath', tu.contineShopping);
            tu.clickElement('css', 'img');
            tu.clickElement('xpath', tu.whiteThermos);
            tu.clickElement('id', tu.buyButton);
            browser.sleep(100);
            tu.clickElement('css', tu.checkoutButton);
            verifyCartContents('Item Price: $24.57', '$41.79', '1');
           });

           it('should allow all fields to be editable', function () {
            tu.clickElement('css', tu.checkoutButton);
            fillCheckoutFormExceptEmail('Bill');
            tu.sendKeysById('email', 'mike@night.com');
            tu.sendKeysById('firstNameAccount', 'Mike');
            tu.sendKeysById('lastNameAccount', 'Night');
            browser.sleep(500)
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            // fillCheckoutFormExceptEmail('Ship');
            fillCreditCardForm('5555555555554444', '06', '2015', '000')
            tu.clickElement('id', 'place-order-btn');
            browser.sleep(500)
            expect(element(by.css('p.text-center.ng-binding')).getText()).toContain('ONE MOMENT... PLACING YOUR ORDER');
            browser.sleep(25000);
            // expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
            verifyOrderConfirmation('MIKE@NIGHT.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301');           
          });

           it('should have basic validation on all fields', function () {
            tu.clickElement('css', tu.checkoutButton);
            fillCheckoutFormExceptEmail('Bill');          
            tu.sendKeysById('email', 'mike@place.com'); 
            tu.sendKeysById('firstNameAccount', 'Mike');
            tu.sendKeysById('lastNameAccount', 'Night');
            fillCreditCardForm('5555555555554444', '06', '2015', '000')
            verifyValidationForEachField('Bill', 'id', 'place-order-btn'); 
            validateField('email', '', 'mike@night.com', 'id', 'place-order-btn');
            browser.sleep(500)
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
            tu.clickElement('id', 'shipTo');
            verifyValidationForEachField('Ship', 'id', 'place-order-btn');
            browser.sleep(200);
            validateField('cvc', '', '00', 'id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            expect(element(by.xpath('//div[5]/div/small')).getText()).toContain('Please enter a valid code');
            browser.executeScript("document.getElementById('cvc').style.display='block';");
            validateField('cvc', '', '123', 'id', 'place-order-btn');
            validateField('ccNumber', '', '0000000000000000', 'id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            // expect(element(by.xpath('//div[2]/div/small')).getText()).toContain('Your card number is incorrect.');
            browser.executeScript("document.getElementById('ccNumber').style.display='block';");
            validateField('ccNumber', '', '5555555555554444', 'id', 'place-order-btn');
            tu.clickElement('id', 'place-order-btn');
            browser.sleep(20000);
            // expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
            verifyOrderConfirmation('MIKE@NIGHT.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301');
           });

           it('should populate with existing address for logged in user', function () {
            tu.clickElement('xpath', tu.contineShopping);            
           	tu.clickElement('id', "login-btn");
            browser.sleep(1000);
            tu.sendKeysById('usernameInput', 'cool@cool.com');
            tu.sendKeysById('passwordInput', 'coolio');
            tu.clickElement('id', 'sign-in-button');
            browser.sleep(1000);
            tu.clickElement('id', tu.cartButtonId);
            browser.sleep(1000);
            tu.clickElement('css', tu.checkoutButton);
            browser.sleep(1000);
            tu.sendKeysById('firstNameAccount', 'Mike');
            tu.sendKeysById('lastNameAccount', 'Night');
            fillCreditCardForm('5555555555554444', '06', '2015', '000')
            browser.sleep(500)
            tu.clickElement('id', 'place-order-btn');
            browser.sleep(20000);
            // expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
            verifyOrderConfirmation('COOL@COOL.COM', 'FAMILY', '123', 'DENVER, CO 80808');
            tu.clickElement('id', "logout-btn");

           });


           it('should create order on account page', function () {
            tu.clickElement('xpath', tu.contineShopping);            
            tu.clickElement('id', "login-btn");
            browser.sleep(1000);
            tu.sendKeysById('usernameInput', 'cool@cool.com');
            tu.sendKeysById('passwordInput', 'coolio');
            tu.clickElement('id', 'sign-in-button');
            browser.sleep(1000);
            tu.clickElement('css', 'img.user-avatar');
            browser.sleep(1000);
            expect(element(by.repeater('order in orders').row(0).column('order.created')).getText()).toContain(currentDate);          
            expect(element(by.repeater('order in orders').row(0).column('order.itemCount')).getText()).toEqual("1");          
            expect(element(by.repeater('order in orders').row(0).column('order.totalPrice')).getText()).toEqual("$27.81");          
            expect(element(by.repeater('order in orders').row(0).column('order.status')).getText()).toEqual("CREATED");          
            element(by.repeater('order in orders').row(0).column('order.created')).click();
            expect(element(by.repeater('order in orders').row(0).column('order.status')).getText()).toEqual("CREATED"); 
            tu.clickElement('id', "logout-btn");

           });


            //needs to be updated after   TP-1566 is fixed 
           // it('should populate with existing address for logged in user', function () {
           //  tu.clickElement('xpath', tu.contineShopping);            
           //  tu.clickElement('id', "login-btn");
           //  browser.sleep(1000);
           //  tu.sendKeysById('usernameInput', 'cool@cool.com');
           //  tu.sendKeysById('passwordInput', 'coolio');
           //  tu.clickElement('id', 'sign-in-button');
           //  browser.sleep(1000);
           //  tu.clickElement('id', tu.cartButtonId);
           //  browser.sleep(1000);
           //  tu.clickElement('css', tu.checkoutButton);
           //  browser.sleep(1000);
           //  tu.sendKeysById('firstNameBill', 'Mike');
           //  tu.sendKeysById('lastNameBill', 'night');
           //  fillCreditCardForm('5555555555554444', '06', '2015', '000')
           //  browser.sleep(500)
           //  tu.clickElement('id', 'place-order-btn');
           //  browser.sleep(20000);
           //  // expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
           //  verifyOrderConfirmation('COOL@COOL.COM', 'MIKE NIGHT', '123', 'DENVER, CO 80808');
           //  tu.clickElement('id', "logout-btn");

           // });


   });
});

describe("mobile checkout:", function () {



   describe("verify mobile checkout functionality", function () {

     beforeEach(function () {
        browser.driver.manage().window().setSize(750, 1100);       
        browser.get(tu.tenant + '/#!/products/542da5d60c4e7c0409a167fb/');
       browser.sleep(8000);
     });

     var continueButton1 = '//div[12]/button'
     var continueButton2 = '//div[6]/button'
     var paymentButton = "//button[@type='submit']"
   

       it('should allow all fields to be editable on mobile', function () {
        tu.clickElement('id', tu.buyButton);
        browser.sleep(1000);
        tu.clickElement('css', tu.checkoutButton);
        tu.sendKeysById('email', 'mike@night.com');
        tu.sendKeysById('firstNameAccount', 'Mike');
        tu.sendKeysById('lastNameAccount', 'Night');
        fillCheckoutFormExceptEmail('Bill');
        tu.clickElement('xpath', continueButton1);
        browser.sleep(500)
            expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
        tu.clickElement('id', 'shipTo');
        // fillCheckoutFormExceptEmail('Ship');
        tu.clickElement('xpath', continueButton2);
        fillCreditCardForm('5555555555554444', '06', '2015', '000')
        tu.clickElement('xpath', paymentButton);
        tu.clickElement('id', "place-order-btn");
        browser.sleep(20000);
        verifyOrderConfirmation('MIKE@NIGHT.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301');
       });

       it('should have basic validation on mobile', function () {
        tu.clickElement('id', tu.buyButton);
        browser.sleep(1000);
        tu.clickElement('css', tu.checkoutButton);
        tu.sendKeysById('email', 'mike@night.com');
        tu.sendKeysById('firstNameAccount', 'Mike');
        tu.sendKeysById('lastNameAccount', 'Night');
        fillCheckoutFormExceptEmail('Bill');
        verifyValidationForEachField('Bill', 'xpath', continueButton1); 
        validateField('email', '', 'mike@night.com', 'xpath', continueButton1);
        tu.clickElement('xpath', continueButton1);
        browser.sleep(500)
        expect(element(by.binding(" order.billTo.address1 ")).getText()).toEqual('123');
        tu.clickElement('id', 'shipTo');
        // fillCheckoutFormExceptEmail('Ship');
        verifyValidationForEachField('Ship', 'xpath', continueButton2); 
        tu.clickElement('xpath', continueButton2);
        fillCreditCardForm('5555555555554444', '06', '2015', '000')
        tu.clickElement('xpath', paymentButton);
        tu.clickElement('id', "place-order-btn");
        browser.sleep(20000);
        // expect(element(by.css('span.highlight.ng-binding')).getText()).toContain('Order# ');
        verifyOrderConfirmation('MIKE@NIGHT.COM', 'MIKE NIGHT', '123', 'BOULDER, CO 80301');

       });

   });
});
