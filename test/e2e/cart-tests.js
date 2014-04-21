    describe("cart", function () {

  beforeEach(function () {
    browser.get('#!/products');
  });

  describe("verify cart functionality", function () {

    beforeEach(function () {
      browser.get('#!/products');
      browser.sleep(8000);
    });

        var testProduct = "//img[contains(@src,'http://img.wonderhowto.com/img/26/99/63418592294146/0/fancy-bike-folds-into-handy-tote-bag.w654.jpg')]";
        var cartButton = "//button[@type='button']";
        var buyButton = "//div[2]/div/button";

        function clickButtonByXpath(path) {
          element(by.xpath(path)).click();
        }

        function clickByLinkText(link) {  
          element(by.linkText(link)).click();
        }



      it('should one product into cart', function () {
        clickButtonByXpath(testProduct);
        clickButtonByXpath(buyButton);
        browser.sleep(15000);
        expect(element(by.xpath("//input[@type='number']")).getAttribute()).toEqual(1);
      });

  }); 
}); 

