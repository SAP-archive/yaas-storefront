describe("product page", function () {

  beforeEach(function () {
    browser.get('#!/products/');
  });

  describe("verify page", function () {

        var testProduct = element(by.xpath("//img[contains(@src,'http://img.wonderhowto.com/img/26/99/63418592294146/0/fancy-bike-folds-into-handy-tote-bag.w654.jpg')]"));


    it("should display correct title", function () {
          browser.get('#!/products/');

      expect(browser.getTitle()).toBe('Blank Project');
    });
      

      it('should scroll to load more products', function () {
        //test default
        browser.get('#!/products/');
        browser.sleep(8000);

        expect(element(by.repeater('product in products').row(0).column('product.name')).getText());
        expect(element(by.repeater('product in products').row(10).column('product.name')).getText());
        expect(element(by.repeater('product in products').row(15).column('product.name')).getText());


		for(y=500; y < 3500; y+=500) {
			browser.executeScript('window.scrollTo(800,'+ y + ');');
			browser.sleep(1000);
		}        



        expect(element(by.repeater('product in products').row(30).column('product.name')).getText());
        testProduct.click();
        browser.sleep(10000);






      });

  }); 
}); 

