         
        exports.bicycle = "//img[contains(@src,'http://img.wonderhowto.com/img/26/99/63418592294146/0/fancy-bike-folds-into-handy-tote-bag.w654.jpg')]";
        exports.testProduct2 = "//img[contains(@src,'http://sand-bsd-2.yrdrt.fra.hybris.com/Products/Chemex.jpg')]";
        exports.ringBowl = "//img[contains(@src,'http://sand-bsd-2.yrdrt.fra.hybris.com/Products/image_16.jpg')]";
        exports.cartButtonId = 'full-cart-btn';
        exports.buyButton = "//div[2]/div/button";
        exports.contineShopping = "//div[@id='cart']/div/div/button";
        exports.removeFromCart = "//div[@id='cart']/section[2]/div/div/div[2]/button"
        exports.bicycleDescription = element(by.binding('product.description'));
        exports.backToTopButton = "(//button[@type='button'])[5]"
        exports.cartQuantity = "//input[@type='number']"
        exports.outOfStockButton = "//div[2]/button"

         exports.verifyCartAmount = function(amount) {
           expect(element(by.xpath("//input[@type='number']")).getAttribute("value")).toEqual(amount);
         }

         exports.verifyCartTotal = function(total) {
           expect(element(by.css("td.text-right.ng-binding")).getText()).toEqual(total);
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

        var assertTextByRepeaterRow = function findProductByRepeaterRow(number, productName) {
          var number, productName
          expect(element(by.repeater('product in products').row(number).column('product.name')).getText()).toEqual(productName);
        }

        function selectOption(option) {
          element(by.css('select option[value="'+ option +'"]')).click()
        }

        exports.sortAndVerifyPagination = function(sort, product1, product2){
            selectOption(sort);
            browser.sleep(250);
            assertTextByRepeaterRow(0, product1);
            clickElement('linkText','>');
            browser.sleep(250);
            assertTextByRepeaterRow(0, product2);
            clickElement('linkText', '<');
            browser.sleep(250);
            assertTextByRepeaterRow(0, product1);
        }

        exports.sendKeysByXpath = function(pageElement, keys) {
          element(by.xpath(pageElement)).clear();
          element(by.xpath(pageElement)).sendKeys(keys);
        }
           /* HOW TO DUMP THE HTML AND GET A SCREEN SHOT:
           var item = $('html');

           item.getInnerHtml().then(function(result){
               writeHtml(result, '/Users/vera.coberley/code/barebones-product-service/demo-store/dom-dump.html');
           });

           browser.takeScreenshot().then(function (png) {
               writeScreenShot(png, '/Users/vera.coberley/code/barebones-product-service/demo-store/main-page.png');
           });   */