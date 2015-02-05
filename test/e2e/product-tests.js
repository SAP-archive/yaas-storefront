var fs = require('fs');
var tu = require('./protractor-utils.js');


describe("product page", function () {

    beforeEach(function () {
        browser.manage().deleteAllCookies();
        browser.driver.manage().window().setSize(1000, 1000);
    });

    describe("verify product pages", function () {

        beforeEach(function () {
            browser.manage().deleteAllCookies();
            browser.driver.manage().window().setSize(1000, 1000);
            browser.get(tu.tenant + '/#!/ct/');
            browser.switchTo().alert().then(
                function (alert) { alert.accept(); },
                function (err) { }
            );
        });

        it('should scroll to load more products', function () {
            expect(browser.getTitle()).toEqual('Süshi Démo Støre');
            tu.getTextByRepeaterRow(0);
            tu.scrollToBottomOfProducts().then(function () {
                tu.getTextByRepeaterRow(30); //verify last product has loaded
                tu.clickElement('id', tu.backToTopButton);
                tu.clickElement('xpath', tu.blackCoffeeMug);
            });
        });

        it('should show the user how many products loaded', function () {
            tu.getTextByRepeaterRow(0);
            expect(element(by.css('div.page-indicator.ng-binding')).getText()).toEqual('1-8 of 37');
            tu.scrollToBottomOfProducts().then(function(){
                tu.getTextByRepeaterRow(30); //verify last product has loaded
                expect(element(by.css('div.col-xs-12 > div.viewingContainer > div.page-indicator.ng-binding')).getText()).toEqual('1-37 of 37'); //should be # of 31, but won't work in phantomjs
            });
        });

        it("should get product detail page", function () {
            tu.clickElement('xpath', tu.whiteCoffeeMug);
            browser.wait(function () {
                return element(by.binding(tu.productDescriptionBind)).isPresent();
            });
            expect(element(by.binding(tu.productDescriptionBind)).getText()).toEqual('DESCRIPTION:\nDrink your morning, afternoon, and evening coffee from the hybris mug. Get caffinated in style.');
            expect(element(by.binding('product.defaultPrice.value')).getText()).toEqual('$10.67');
            expect(element(by.binding('cat.name')).getText()).toEqual('Mugs');
            tu.selectLanguage('GERMAN');
            tu.selectCurrency('EURO');

            browser.sleep(3000);
            expect(element(by.binding(tu.productDescriptionBind)).getText()).toEqual('BESCHREIBUNG:\nTrinken Sie Ihren Vormittag, Nachmittag, Abend und Kaffee aus der hybris Becher. Holen caffinated im Stil.');
            expect(element(by.binding('product.defaultPrice.value')).getText()).toEqual('€7.99');

            expect(element(by.binding('cat.name')).getText()).toEqual('Tassen');
            // verify refreshing grabs correct config (STOR-1183)
            browser.get(tu.tenant + '/#!/products/5436f99f5acee4d3c910c082/');
            expect(element(by.binding(tu.productDescriptionBind)).getText()).toEqual('BESCHREIBUNG:\nTrinken Sie Ihren Vormittag, Nachmittag, Abend und Kaffee aus der hybris Becher. Holen caffinated im Stil.');
            expect(element(by.binding('product.defaultPrice.value')).getText()).toEqual('€7.99');
        });

        it("should get order of products correctly in english and USD", function () {
            tu.getTextByRepeaterRow(0);
            //price is not currently supported
            // tu.sortAndVerifyPagination('price', 'FRENCH PRESS');
            // browser.sleep(750);
            // tu.sortAndVerifyPagination('-price', 'ESPRESSO MACHINE');
            // browser.sleep(750);
            tu.sortAndVerifyPagination('name', 'BEER MUG', '$6.99');
            browser.sleep(750);
            tu.sortAndVerifyPagination('name:desc', "WOMEN'S T-SHIRT - GRAY", '$14.99');
            browser.sleep(750);
            tu.sortAndVerifyPagination('created:desc', 'BEER MUG W/HELLES', '$7.99');
        });

        it("should get order of products correctly in german and Euros", function () {
            //default load
            tu.getTextByRepeaterRow(0);
            //price is not currently supported
            tu.selectLanguage('GERMAN');
            tu.selectCurrency('EURO');
            browser.sleep(3000);
            // tu.sortAndVerifyPagination('price', 'FRANZÖSISCH PRESSE');
            // browser.sleep(750);
            // tu.sortAndVerifyPagination('-price', 'ESPRESSOMASCHINE');
            // browser.sleep(750);
            tu.sortAndVerifyPagination('name', 'BIERKRUG', '€5.59');
            browser.sleep(750);
            tu.sortAndVerifyPagination('name:desc', 'WASSER-FLASCHE', '€19.99');
            browser.sleep(750);
            tu.sortAndVerifyPagination('created:desc', 'BIERKRUG W / HELLES', '€6.39');
        });


        it("should navigate by categories", function () {
            //default load
            tu.getTextByRepeaterRow(0);
            //price is not currently supported
            browser.sleep(3000);
            tu.clickElement('linkText', 'COMPUTER ACCESSORIES');
            tu.assertProductByRepeaterRow(0, 'EARBUDS');
            tu.sortAndVerifyPagination('name', 'EARBUDS', '$15.00');
            browser.sleep(750);
            tu.sortAndVerifyPagination('name:desc', 'USB', '$5.99');
            browser.sleep(750);
            tu.sortAndVerifyPagination('created:desc', 'PENHOLDER', '$1.99');
            browser.get(tu.tenant + '/#!/ct/mugs~85248');
            browser.driver.manage().window().maximize();
            browser.sleep(2000);
            tu.assertProductByRepeaterRow(0, 'COFFEE MUG - WHITE');
            tu.sortAndVerifyPagination('name', 'BEER MUG', '$6.99');
            browser.sleep(750);
            tu.sortAndVerifyPagination('name:desc', 'COFFEE MUGS WITH COFFEE BEANS - PACKAGE', '$16.49');
            browser.sleep(750);
            tu.sortAndVerifyPagination('created:desc', 'BEER MUG W/HELLES', '$7.99');
            browser.get(tu.tenant + '/#!/ct/cosmetics');
        });

    });
}); 

