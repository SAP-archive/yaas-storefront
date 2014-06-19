var fs = require('fs');
var tu = require('./protractor-utils.js');

describe("product page", function () {

  describe("verify product pages", function () {

    beforeEach(function () {
      browser.get('#!/products');
      browser.driver.manage().window().maximize();
      browser.sleep(9000);
    });

      
      it('should scroll to load more products', function () {
        expect(element(by.css('p.ng-binding')).getText()).toEqual('süshî démø støre');
        expect(browser.getTitle()).toEqual('süshî démø støre');
        tu.getTextByRepeaterRow(0)
        tu.scrollToBottomOfProducts(10000);
        tu.getTextByRepeaterRow(30) //verify last product has loaded
        tu.clickElement('xpath', tu.backToTopButton);        
        tu.clickElement('xpath', tu.frenchPress);
      });

      // should be # of 36, but overall product count doesn't work in phantomjs
      it('should show the user how many products loaded', function () {
        tu.getTextByRepeaterRow(0)
        expect(element(by.css('div.page-indicator.ng-binding')).getText()).toEqual('1-10 of 0'); 
        tu.scrollToBottomOfProducts(10000);
        tu.getTextByRepeaterRow(30) //verify last product has loaded
        expect(element(by.css('div.col-xs-12 > div.viewingContainer > div.page-indicator.ng-binding')).getText()).toEqual('1-31 of 0'); //should be # of 36, but won't work in phantomjs
      });

      it("should get product detail page", function () {
        tu.scrollToBottomOfProducts(3500);
        tu.clickElement('xpath', tu.frenchPress);
        browser.sleep(1000);
        expect(tu.frenchPressDescription.getText()).toEqual('Description:\nThis will make the best coffee you ever had.');

    });

      it("should get order of products correctly", function () {
        //default load
        tu.getTextByRepeaterRow(0);
        tu.sortAndVerifyPagination('price', 'RED RAINDROP SOAP DISH');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-price', 'ESPRESSO MACHINE');
        browser.sleep(750);
        tu.sortAndVerifyPagination('name', 'BEADED NECKLACE');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-name', 'COOKING UTENILS');
        browser.sleep(750);
        tu.sortAndVerifyPagination('created', 'FRENCH PRESS');
    });

      it("should redirect the user if they attempt to access unpublished product", function () {
        browser.get('#!/products/WhiteBowlswithbirds1399405261020/');
        browser.sleep(5000);
        tu.getTextByRepeaterRow(1);
    });


  }); 
}); 

