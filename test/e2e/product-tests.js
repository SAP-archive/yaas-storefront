var fs = require('fs');
var tu = require('./protractor-utils.js');

describe("product page", function () {

  describe("verify product pages", function () {

    beforeEach(function () {
      browser.manage().deleteAllCookies();    	
      browser.get(tu.tenant + '/#!/products');
      browser.driver.manage().window().maximize();
      browser.sleep(8000);
    });

      
      it('should scroll to load more products', function () {
        expect(element(by.css('p.ng-binding')).getText()).toEqual('Süshi Démo Støre');
        expect(browser.getTitle()).toEqual('Süshi Démo Støre');
        tu.getTextByRepeaterRow(0)
        tu.scrollToBottomOfProducts(10000);
        tu.getTextByRepeaterRow(30) //verify last product has loaded
        tu.clickElement('xpath', tu.backToTopButton);        
        tu.clickElement('xpath', tu.whiteCoffeeMug);
      });

      // should be # of 31, but overall product count doesn't work in phantomjs
      it('should show the user how many products loaded', function () {
        tu.getTextByRepeaterRow(0)
        expect(element(by.css('div.page-indicator.ng-binding')).getText()).toEqual('1-8 of 37'); 
        tu.scrollToBottomOfProducts(10000);
        tu.getTextByRepeaterRow(30) //verify last product has loaded
        expect(element(by.css('div.col-xs-12 > div.viewingContainer > div.page-indicator.ng-binding')).getText()).toEqual('1-37 of 37'); //should be # of 31, but won't work in phantomjs
      });

      it("should get product detail page", function () {
        // tu.scrollToBottomOfProducts(3500);
        tu.clickElement('xpath', tu.whiteCoffeeMug);
        browser.sleep(3000);
        expect(tu.frenchPressDescription.getText()).toEqual('Description:\nDrink your morning, afternoon, and evening coffee from the hybris mug. Get caffinated in style.');
        expect(element(by.binding('product.defaultPrice.value')).getText()).toEqual('$10.67');
        tu.clickElement('linkText', 'DE');
        tu.clickElement('linkText', 'EURO');
        browser.sleep(3000);
        expect(tu.frenchPressDescription.getText()).toEqual('Beschreibung:\nTrinken Sie Ihren Vormittag, Nachmittag, Abend und Kaffee aus der hybris Becher. Holen caffinated im Stil.');
        expect(element(by.binding('product.defaultPrice.value')).getText()).toEqual('€7.99');

    });

      it("should get order of products correctly in english and USD", function () {
        //default load
        tu.clickElement('linkText', 'EN');
        tu.getTextByRepeaterRow(0);
        //price is not currently supported
        // tu.sortAndVerifyPagination('price', 'FRENCH PRESS');
        // browser.sleep(750);
        // tu.sortAndVerifyPagination('-price', 'ESPRESSO MACHINE');
        // browser.sleep(750);
        tu.sortAndVerifyPagination('name', 'BEER MUG', '$6.99');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-name', "WOMEN'S T-SHIRT - GRAY", '$14.99');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-created', 'BEER MUG W/HELLES', '$7.99');
    });

      it("should get order of products correctly in german and Euros", function () {
        //default load
        tu.getTextByRepeaterRow(0);
        //price is not currently supported
        tu.clickElement('linkText', 'DE');
        tu.clickElement('linkText', 'EURO');
        browser.sleep(3000);       
        // tu.sortAndVerifyPagination('price', 'FRANZÖSISCH PRESSE');
        // browser.sleep(750);
        // tu.sortAndVerifyPagination('-price', 'ESPRESSOMASCHINE');
        // browser.sleep(750);
        tu.sortAndVerifyPagination('name', 'BIERKRUG', '€5.59');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-name', 'WASSER-FLASCHE', '€19.99');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-created', 'BIERKRUG W / HELLES', '€6.39');
    });


      it("should navigate by categories", function () {
        //default load
        tu.getTextByRepeaterRow(0);
        //price is not currently supported
        tu.clickElement('linkText', 'EN');
        browser.sleep(3000);       
        tu.clickElement('linkText', 'COMPUTER ACCESSORIES');
        tu.assertProductByRepeaterRow(0, 'EARBUDS');
        tu.sortAndVerifyPagination('name', 'EARBUDS', '$15.00');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-name', 'USB', '$5.99');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-created', 'PENHOLDER', '$1.99');
        browser.get(tu.tenant + '/#!/ct/mugs');
        browser.driver.manage().window().maximize();
        browser.sleep(5000);
        tu.assertProductByRepeaterRow(0, 'COFFEE MUG - WHITE');
        tu.sortAndVerifyPagination('name', 'BEER MUG', '$6.99');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-name', 'COFFEE MUGS WITH COFFEE BEANS - PACKAGE', '$16.49');
        browser.sleep(750);
        tu.sortAndVerifyPagination('-created', 'BEER MUG W/HELLES', '$7.99');
        browser.get(tu.tenant + '/#!/ct/cosmetics');
    });

  }); 
}); 

