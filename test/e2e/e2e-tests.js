describe("product page", function () {

  beforeEach(function () {
    browser.get('#!/products/');
  });

  describe("verify product pages", function () {

    beforeEach(function () {
      browser.get('#!/products');
    });

        var testProduct = element(by.xpath("//img[contains(@src,'http://img.wonderhowto.com/img/26/99/63418592294146/0/fancy-bike-folds-into-handy-tote-bag.w654.jpg')]"));
        var testProductDescription = element(by.binding('product.description'));
        var getTextByRepeaterRow = function findProductByRepeaterRow(number) {
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

        function clickByLinkText(link) {
          element(by.linkText(link)).click()
        }
        function scrollToBottomOfProducts(end) {
          for(y=500; y < end; y+=500) {
            browser.executeScript('window.scrollTo(800,'+ y + ');');
            browser.sleep(1000);
           }     
        }


      

      it('should scroll to load more products', function () {
        browser.sleep(5000);
        getTextByRepeaterRow(0)
        scrollToBottomOfProducts(3500);
        getTextByRepeaterRow(15)
        testProduct.click();
        browser.sleep(5000);
        
      });

      it("should get product detail page", function () {
        browser.sleep(5000);
        scrollToBottomOfProducts(3500);
        testProduct.click();
        browser.sleep(8000);

        expect(testProductDescription.getText()).toEqual('Description:\nA bicycle, often called a bike, is a human-powered, pedal-driven, single-track vehicle, having two wheels attached to a frame, one behind the other. A bicycle rider is called a cyclist, or bicyclist.');

    });

      it("should get order products correctly", function () {
        browser.sleep(5000);
        //default load
        getTextByRepeaterRow(0);

        selectOption('price');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'RING HEART BOWL');
        clickByLinkText('>');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'BLACK CUPS WITH HOLES');
        clickByLinkText('<');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'RING HEART BOWL');

        selectOption('-price');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'SET OF 92 CUPS');
        clickByLinkText('>');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'BLACK CUPS WITH HOLES');
        clickByLinkText('<');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'SET OF 92 CUPS');

        selectOption('name');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'BIRDHOUSE');
        clickByLinkText('>');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'FLOWER POT');
        clickByLinkText('<');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'BIRDHOUSE');

        selectOption('-name');
        browser.sleep(500); 
        assertTextByRepeaterRow(0, 'WHITE RING HOLDER');
        clickByLinkText('>');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'LITTLE PLATE BOWL');
        clickByLinkText('<');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'WHITE RING HOLDER');

        selectOption('created');
        browser.sleep(500);

        assertTextByRepeaterRow(0, 'BROKEN LOOKING BOWLS');
        clickByLinkText('>');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'BLACK CUPS WITH HOLES');
        clickByLinkText('<');
        browser.sleep(500);
        assertTextByRepeaterRow(0, 'BROKEN LOOKING BOWLS');

    });

  }); 
}); 

