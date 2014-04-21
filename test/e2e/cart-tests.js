    describe("cart", function () {

  beforeEach(function () {
    browser.get('#!/products');
  });

  describe("verify cart functionality", function () {

    beforeEach(function () {
      browser.get('#!/products');
      browser.sleep(8000);
    });

        var testProduct1 = "//img[contains(@src,'http://img.wonderhowto.com/img/26/99/63418592294146/0/fancy-bike-folds-into-handy-tote-bag.w654.jpg')]";
        var testProduct2 = "//img[contains(@src,'http://sand-bsd-2.yrdrt.fra.hybris.com/Products/Chemex.jpg')]";
        var testProduct3 = "//img[contains(@src,'http://sand-bsd-2.yrdrt.fra.hybris.com/Products/image_16.jpg')]";
        var cartButton = "//button[@type='button']";
        var buyButton = "//div[2]/div/button";
        var contineShopping = "//div[@id='cart']/div/div/button";
        var removeFromCart = "//div[@id='cart']/section[2]/div/div/div[2]/button"

        function verifyCartAmount(amount) {
          expect(element(by.xpath("//input[@type='number']")).getAttribute("value")).toEqual(amount);
        }

        function verifyCartTotal(total) {
          expect(element(by.css("td.text-right.ng-binding")).getText()).toEqual(total);
        }

        function clickButtonByXpath(path) {
          element(by.xpath(path)).click();
        }

        function clickByCss(link) {  
          element(by.css(link)).click();
        }



      it('should load one product into cart', function () {
        clickButtonByXpath(cartButton);
        verifyCartTotal("$0");
        clickButtonByXpath(contineShopping);
        clickButtonByXpath(testProduct1);
        clickButtonByXpath(buyButton);
        browser.sleep(500);
        // expect(element(by.css("span.input-group-addon > input.form-control.product.quantity")).getAttribute()).toEqual(1);
        verifyCartAmount("1");
        verifyCartTotal("$9.5");
        clickButtonByXpath(removeFromCart);
        verifyCartTotal("$0");
      });

      it('should load multiple products into cart', function () {
        clickButtonByXpath(cartButton);
        verifyCartTotal("$0");
        clickButtonByXpath(contineShopping);  
        clickButtonByXpath(testProduct1);
        clickButtonByXpath(buyButton);
        browser.sleep(500);
        // expect(element(by.css("span.input-group-addon > input.form-control.product.quantity")).getAttribute()).toEqual(1);
        verifyCartAmount("1");
        verifyCartTotal("$9.5");
        clickButtonByXpath(contineShopping);
        clickByCss("img");
        clickButtonByXpath(testProduct3);
        clickButtonByXpath(buyButton);
        verifyCartTotal("$11.5");

      });

      it('should load one product into cart', function () {
        clickButtonByXpath(cartButton);
        verifyCartTotal("$0");
        clickButtonByXpath(contineShopping);
        clickButtonByXpath(testProduct1);
        clickButtonByXpath(buyButton);
        browser.sleep(500);
        // expect(element(by.css("span.input-group-addon > input.form-control.product.quantity")).getAttribute()).toEqual(1);
        verifyCartAmount("1");
        verifyCartTotal("$9.5");
        clickButtonByXpath(removeFromCart);
        verifyCartTotal("$0");
      });


  }); 
}); 

