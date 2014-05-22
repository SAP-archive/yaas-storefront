         
        exports.frenchPress = "//img[contains(@src,'http://media-repository.dprod.cf.hybris.com/products/onlineshop/media/537bdfebb6ee33d51ebdb1e7?tenantId=products')]";
        exports.chemex = "//img[contains(@src,'http://media-repository.dprod.cf.hybris.com/products/onlineshop/media/537bdb56b6ee33d51ebdb196?tenantId=products')]";
        exports.ringBowl = "//img[contains(@src,'http://media-repository.dprod.cf.hybris.com/products/onlineshop/media/537bd603b6ee33d51ebdb18e?tenantId=products')]";
        exports.cartButtonId = 'full-cart-btn';
        exports.buyButton = "//div[2]/div/button";
        exports.contineShopping = "//div[@id='cart']/div/div/button";
        exports.removeFromCart = "//div[@id='cart']/section[2]/div/div/div[2]/button"
        exports.frenchPressDescription = element(by.binding('product.description'));
        exports.backToTopButton = "(//button[@type='button'])[5]"
        exports.cartQuantity = "//input[@type='number']"
        exports.outOfStockButton = "//div[2]/button"
        exports.checkoutButton = 'span.hyicon.hyicon-chevron-thin-right'

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

        exports.clickByRepeaterRow = function(number) {
          element(by.repeater('product in products').row(number).column('product.name')).click();
        }
        var assertTextByRepeaterRow = function findProductByRepeaterRow(number, productName) {
          var number, productName
          expect(element(by.repeater('product in products').row(number).column('product.name')).getText()).toEqual(productName);
        }

        var selectOption =  exports.selectOption= function(option) {
          element(by.css('select option[value="'+ option +'"]')).click()
        }

        exports.sortAndVerifyPagination = function(sort, product1){
            selectOption(sort);
            browser.sleep(250);
            assertTextByRepeaterRow(0, product1);
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