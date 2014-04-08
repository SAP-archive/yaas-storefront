describe("product page", function () {

  beforeEach(function () {
    browser.get('#!/products/');
  });

  describe("verify page", function () {

        var testProduct = element(by.xpath("//img[contains(@src,'http://img.wonderhowto.com/img/26/99/63418592294146/0/fancy-bike-folds-into-handy-tote-bag.w654.jpg')]"));

        var getTextByRepeaterRow = function findProductByRepeaterRow(number) {
        	var number
        	expect(element(by.repeater('product in products').row(number).column('product.name')).getText());
        }


        function scrollToBottomOfProducts(end) {
        for(y=500; y < end; y+=500) {
			browser.executeScript('window.scrollTo(800,'+ y + ');');
			browser.sleep(1000);
		}     
        }

    it("should display correct title", function () {
          browser.get('#!/products/');

      expect(browser.getTitle()).toBe('Blank Project');
    });
      

      it('should scroll to load more products', function () {
        //test default
        browser.get('#!/products/');
        getTextByRepeaterRow(0)
        // TODO find out how to append arguments to a function
        // .toEqual('awesome');
        getTextByRepeaterRow(10)
        getTextByRepeaterRow(15)
        scrollToBottomOfProducts(3500);
        getTextByRepeaterRow(30)
        testProduct.click();
        browser.sleep(5000);
        
      });

  }); 
}); 

