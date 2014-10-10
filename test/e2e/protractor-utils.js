         
        exports.whiteCoffeeMug = "//a[contains(@href, '#!/products/5436f99f5acee4d3c910c082/')]";
        exports.blackCoffeeMug = "//a[contains(@href, '#!/products/5436f9a25acee4d3c910c085/')]";
        exports.whiteThermos = "//a[contains(@href, '#!/products/5436f9a43cceb8a938129170/')]";
        exports.cartButtonId = 'full-cart-btn';
        exports.buyButton = "buy-button";
        exports.contineShopping = "//div[@id='cart']/div/div/button";
        exports.removeFromCart = "//div[@id='cart']/div[2]/section[2]/div/div/div[2]/button"
        exports.frenchPressDescription = element(by.binding('product.description'));
        exports.backToTopButton = "(//button[@type='button'])[5]"
        exports.cartQuantity = "(//input[@type='number'])[2]"
        exports.outOfStockButton = "//div[2]/div[2]/button"
        exports.checkoutButton = 'span.hyicon.hyicon-chevron-thin-right'
        exports.tenant = 'ytvlw4f7ebox'


         exports.verifyCartAmount = function(amount) {
           expect(element(by.xpath("(//input[@type='number'])[2]")).getAttribute("value")).toEqual(amount);
         }

         exports.verifyCartTotal = function(total) {
           expect(element(by.css("th.text-right.ng-binding")).getText()).toEqual(total);
         }

       // abstract writing screen shot to a file
       exports.writeScreenShot = function(data, filename) {
           var stream = fs.createWriteStream(filename);

           stream.write(new Buffer(data, 'base64'));
           stream.end();
       }

       exports.writeHtml = function(data, filename) {
           var stream = fs.createWriteStream(filename);

           stream.write(new Buffer(data, 'utf8'));
           stream.end();
       }

       var clickElement = exports.clickElement = function(type, pageElement) {
          if (type === 'id'){
              element(by.id(pageElement)).click();
          } else if(type === 'xpath'){
              element(by.xpath(pageElement)).click();
          } else if(type === 'css'){
            element(by.css(pageElement)).click();
          } else if(type === 'linkText') {
            element(by.linkText(pageElement)).click();
          }
          
        };

        exports.scrollToBottomOfProducts = function(end) {
          for(y=500; y < end; y+=500) {
            browser.executeScript('window.scrollTo(800,'+ y + ');');
            browser.sleep(1000);
           }     
        }        

        exports.getTextByRepeaterRow = function findProductByRepeaterRow(number) {
        var number
          expect(element(by.repeater('product in products').row(number).column('product.name')).getText());
        }

        exports.clickByRepeaterRow = function(number) {
          element(by.repeater('product in products').row(number).column('product.name')).click();
        }
        var assertTextByRepeaterRow = exports.assertProductByRepeaterRow = function(number, productName) {
          var number, productName
          expect(element(by.repeater('product in products').row(number).column('product.name')).getText()).toEqual(productName);
        }

        var selectOption =  exports.selectOption= function(option) {
          element(by.css('select option[value="'+ option +'"]')).click()
        }

        exports.sortAndVerifyPagination = function(sort, product1, price1){
            selectOption(sort);
            browser.sleep(250);
            assertTextByRepeaterRow(0, product1);
            expect(element(by.repeater('product in products').row(0).column('prices[product.id].value')).getText()).toEqual(price1);
        }

        exports.sendKeysByXpath = function(pageElement, keys) {
          element(by.xpath(pageElement)).clear();
          element(by.xpath(pageElement)).sendKeys(keys);
        }

        exports.sendKeysById = function(pageElement, keys) {
          element(by.id(pageElement)).clear();
          element(by.id(pageElement)).sendKeys(keys);
        }
           /* HOW TO DUMP THE HTML AND GET A SCREEN SHOT:
           var item = $('html');

           item.getInnerHtml().then(function(result){
               writeHtml(result, '/Users/vera.coberley/code/barebones-product-service/demo-store/dom-dump.html');
           });

           browser.takeScreenshot().then(function (png) {
               writeScreenShot(png, '/Users/vera.coberley/code/barebones-product-service/demo-store/main-page.png');
           });   */