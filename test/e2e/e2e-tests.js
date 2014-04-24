 var tu = require('./protractor-utils.js');

describe("product page", function () {

  describe("verify product pages", function () {

    beforeEach(function () {
      browser.get('#!/products');
      browser.sleep(5000);
    });


    function sortAndVerifyPagination(sort, product1, product2){
        tu.selectOption(sort);
        browser.sleep(500);
        tu.assertTextByRepeaterRow(0, product1);
        tu.clickByLinkText('>');
        browser.sleep(500);
        tu.assertTextByRepeaterRow(0, product2);
        tu.clickByLinkText('<');
        browser.sleep(500);
        tu.assertTextByRepeaterRow(0, product1);
    }

      
      it('should scroll to load more products', function () {
        tu.getTextByRepeaterRow(0)
        tu.scrollToBottomOfProducts(5000);
        tu.getTextByRepeaterRow(35) //verify last product has loaded
        tu.clickElementByXpath(tu.backToTopButton);        
        tu.clickElementByXpath(tu.bicycle);
        
      });

      it("should get product detail page", function () {
        tu.scrollToBottomOfProducts(3500);
        tu.clickElementByXpath(tu.bicycle);
        browser.sleep(8000);

        expect(tu.testProductDescription.getText()).toEqual('Description:\nA bicycle, often called a bike, is a human-powered, pedal-driven, single-track vehicle, having two wheels attached to a frame, one behind the other. A bicycle rider is called a cyclist, or bicyclist.');

    });

      it("should get order of products correctly", function () {
        //default load
        tu.getTextByRepeaterRow(0);
        sortAndVerifyPagination('price', 'RING HEART BOWL', 'TALK TO ME COFFEE MUGS');
        sortAndVerifyPagination('-price', 'ESPRESSO MACHINE', 'BIRDHOUSE');
        sortAndVerifyPagination('name', 'BIRDHOUSE', 'DIFFERENT CERAMIC BIRDS (5)');
        sortAndVerifyPagination('-name', 'WOOD-BOUND CHEMEX COFFEE MAKER', 'SET OF 92 CUPS');
        sortAndVerifyPagination('created', 'TATTERED BOWLS', 'BIRDHOUSE');
    });

  }); 
}); 

