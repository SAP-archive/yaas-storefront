var fs = require('fs');

describe("cart:", function () {
   /*
   beforeEach(function () {
     browser.get('#!/products');
   });*/

   describe("verify cart functionality", function () {

     beforeEach(function () {
         // ENSURE WE'RE TESTING AGAINST THE FULL SCREEN VERSION
       browser.driver.manage().window().maximize();
       browser.get('#!/products/');
       browser.sleep(8000);
     });

         var testProduct1 = "//img[contains(@src,'http://img.wonderhowto.com/img/26/99/63418592294146/0/fancy-bike-folds-into-handy-tote-bag.w654.jpg')]";
         var testProduct2 = "//img[contains(@src,'http://sand-bsd-2.yrdrt.fra.hybris.com/Products/Chemex.jpg')]";
         var testProduct3 = "//img[contains(@src,'http://sand-bsd-2.yrdrt.fra.hybris.com/Products/image_16.jpg')]";
         var cartButtonId = 'full-cart-btn';
         var buyButton = "//div[2]/div/button";
         var contineShopping = "//div[@id='cart']/div/div/button";
         var removeFromCart = "//div[@id='cart']/section[2]/div/div/div[2]/button"
         var cartButton2 = "div.off-canvas > div.ng-scope > nav.full-nav.ng-scope > button.btn.btn-link.navbar-btn.pull-right.cart"

         function verifyCartAmount(amount) {
           expect(element(by.xpath("//input[@type='number']")).getAttribute("value")).toEqual(amount);
         }

         function verifyCartTotal(total) {
           expect(element(by.css("td.text-right.ng-binding")).getText()).toEqual(total);
         }

         function clickButtonByXpath(path) {
           element(by.xpath(path)).click();
         }

         function clickCartButton() {
             clickButtonById(cartButtonId);
         }
        function clickButtonById(id) {
           element(by.id(id)).click();
        }

         function clickByCss(link) {
           element(by.css(link)).click();
         }

       // abstract writing screen shot to a file
       function writeScreenShot(data, filename) {
           var stream = fs.createWriteStream(filename);

           stream.write(new Buffer(data, 'base64'));
           stream.end();
       }

       function writeHtml(data, filename) {
           var stream = fs.createWriteStream(filename);

           stream.write(new Buffer(data, 'utf8'));
           stream.end();
       }



// within a test:


       it('should load one product into cart', function () {
           /* HOW TO DUMP THE HTML AND GET A SCREEN SHOT:
           var item = $('html');

           item.getInnerHtml().then(function(result){
               writeHtml(result, '/Users/vera.coberley/code/barebones-product-service/demo-store/dom-dump.html');
           });

           browser.takeScreenshot().then(function (png) {
               writeScreenShot(png, '/Users/vera.coberley/code/barebones-product-service/demo-store/main-page.png');
           });   */

         clickCartButton();

         browser.sleep(500);
         verifyCartTotal("$0.00");
         clickButtonByXpath(contineShopping);
         clickButtonByXpath(testProduct1);
         clickButtonByXpath(buyButton);
         browser.sleep(500);
         verifyCartAmount("1");
         verifyCartTotal("$9.50");
         clickButtonByXpath(removeFromCart);
         verifyCartTotal("$0.00");

       });

         it('should load multiple products into cart', function () {
           clickCartButton();
           verifyCartTotal("$0.00");
           clickButtonByXpath(contineShopping);
           clickButtonByXpath(testProduct1);
           clickButtonByXpath(buyButton);
           browser.sleep(500);
           verifyCartAmount("1");
           verifyCartTotal("$9.50");
           clickButtonByXpath(contineShopping);
           clickByCss("img");
           clickButtonByXpath(testProduct3);
           clickButtonByXpath(buyButton);
           verifyCartTotal("$11.50");

         });

         it('should update quantity', function () {
           clickCartButton();
           verifyCartTotal("$0.00");
           clickButtonByXpath(contineShopping);
           clickButtonByXpath(testProduct1);
           clickButtonByXpath(buyButton);
           browser.sleep(500);
           verifyCartAmount("1");
           verifyCartTotal("$9.50");
           clickButtonByXpath(contineShopping);
           clickButtonByXpath(buyButton);
           verifyCartAmount("2");
           verifyCartTotal("$19.00");
           element(by.xpath("//input[@type='number']")).clear();
           element(by.xpath("//input[@type='number']")).sendKeys("5");
           verifyCartAmount("5");
           verifyCartTotal("$47.50");
            element(by.xpath("//input[@type='number']")).clear();
           element(by.xpath("//input[@type='number']")).sendKeys("10");
           verifyCartAmount("10");
           verifyCartTotal("$95.00");
         });

         it('should not add out of stock item', function () {
           clickCartButton();
           verifyCartTotal("$0.00");
           clickButtonByXpath(contineShopping);
           clickButtonByXpath(testProduct2);
           clickButtonByXpath("//div[2]/button"); //out of stock button
           clickCartButton();
           verifyCartTotal("$0.00");
           clickButtonByXpath(contineShopping);
         });

         it('should not allow negative numbers', function () {
           clickCartButton();
           verifyCartTotal("$0.00");
           clickButtonByXpath(contineShopping);
           clickButtonByXpath(testProduct1);
           clickButtonByXpath(buyButton); 
           verifyCartTotal("$9.50");
            element(by.xpath("//input[@type='number']")).clear();
           element(by.xpath("//input[@type='number']")).sendKeys("-5");
           verifyCartAmount("5");
           verifyCartTotal("$47.50");
            element(by.xpath("//input[@type='number']")).clear();
           element(by.xpath("//input[@type='number']")).sendKeys("it should not accept alpha");
           verifyCartAmount("");
           verifyCartTotal("$0.00");
         });

   });
});

