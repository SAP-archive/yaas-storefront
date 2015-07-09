var fs = require('fs');
var tu = require('./protractor-utils.js');


describe('product page', function () {

    describe('verify product pages', function () {

        beforeEach(function () {
            browser.manage().deleteAllCookies();
            browser.driver.manage().window().setSize(1000, 1000);
            browser.get(tu.tenant + '/#!/ct/');
            browser.switchTo().alert().then(
                function (alert) { alert.accept(); },
                function (err) { }
            );
        });

        //crashes browser. to be address in STOR-1567
        xit('should scroll to load more products', function () {
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
            expect(element(by.css('div.page-indicator.ng-binding')).getText()).toContain('1-');
            tu.scrollToBottomOfProducts()
            tu.getTextByRepeaterRow(36); //verify last product has loaded
            browser.sleep(500);
            expect(element(by.css('div.col-xs-12 > div.viewingContainer > div.page-indicator.ng-binding')).getText()).toContain('-38 of 38'); //should be # of 31, but won't work in phantomjs

        });

        it('should get product detail page', function () {
            var category =  element(by.repeater('top_category in categories').row(3).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            tu.clickElement('xpath', tu.whiteCoffeeMug);
            browser.wait(function () {
                return element(by.binding(tu.productDescriptionBind)).isPresent();
            });

            expect(element(by.binding(tu.productDescriptionBind)).getText()).toEqual('Drink your morning, afternoon, and evening coffee from the hybris mug. Get caffinated in style.');
            expect(element(by.binding('product.prices[0].effectiveAmount')).getText()).toEqual('$10.67');
            tu.switchSite('Sushi Demo Store Germany');
            browser.sleep(3000);
            expect(element(by.binding(tu.productDescriptionBind)).getText()).toEqual('Trinken Sie Ihren Vormittag, Nachmittag, Abend und Kaffee aus der hybris Becher. Holen caffinated im Stil.');
            expect(element(by.binding('product.prices[0].effectiveAmount')).getText()).toEqual('€7.99');
            // verify refreshing grabs correct config (STOR-1183)
            browser.get(tu.tenant + '/#!/products/5502177da4ae283d1df57d04/');
            expect(element(by.binding(tu.productDescriptionBind)).getText()).toEqual('Trinken Sie Ihren Vormittag, Nachmittag, Abend und Kaffee aus der hybris Becher. Holen caffinated im Stil.');
            expect(element(by.binding('product.prices[0].effectiveAmount')).getText()).toEqual('€7.99');
        });

        it('should get order of products correctly in english and USD', function () {
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
            tu.sortAndVerifyPagination('metadata.createdAt:desc', 'BEER MUG W/HELLES', '$7.99');
        });

        //disabled until multiple sites are implemented
        it('should get order of products correctly in german and Euros', function () {
            //default load
            tu.getTextByRepeaterRow(0);
            browser.wait(function () {
                return element(by.xpath(tu.whiteCoffeeMug)).isPresent();
            });
            browser.sleep(500);
            tu.clickElement('xpath', tu.whiteCoffeeMug);
            tu.switchSite('Sushi Demo Store Germany');
            browser.sleep(2000);
            browser.get(tu.tenant + '/#!/ct/');
            tu.sortAndVerifyPagination('name', 'BIERKRUG', '€5.59');
            browser.sleep(750);
            tu.sortAndVerifyPagination('name:desc', 'WASSER-FLASCHE', '€19.99');
            browser.sleep(750);
            tu.sortAndVerifyPagination('metadata.createdAt:desc', 'BIERKRUG W / HELLES', '€6.39');
        });


        it('should navigate by categories', function () {
            //default load
            tu.getTextByRepeaterRow(0);
            //price is not currently supported
            browser.sleep(3000);
            // tu.clickElement('linkText', 'COMPUTER ACCESSORIES');
            var category =  element(by.repeater('top_category in categories').row(1).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            tu.assertProductByRepeaterRow(0, 'EARBUDS');
            tu.sortAndVerifyPagination('name', 'EARBUDS', '$15.00');
            browser.sleep(750);
            tu.sortAndVerifyPagination('name:desc', 'USB', '$5.99');
            browser.sleep(750);
            tu.sortAndVerifyPagination('metadata.createdAt:desc', 'MOUSEPAD', '$1.99');
            browser.get(tu.tenant + '/#!/ct/mugs~269735936');
            browser.driver.manage().window().maximize();
            browser.sleep(2000);
            tu.assertProductByRepeaterRow(0, 'COFFEE MUG - BLACK');
            tu.sortAndVerifyPagination('name', 'BEER MUG', '$6.99');
            browser.sleep(750);
            tu.sortAndVerifyPagination('name:desc', 'COFFEE MUGS WITH COFFEE BEANS - PACKAGE', '$16.49');
            browser.sleep(750);
            tu.sortAndVerifyPagination('metadata.createdAt:desc', 'BEER MUG W/HELLES', '$7.99');
            browser.get(tu.tenant + '/#!/ct/cosmetics~273954304');
        });

        it('should display unit price on PLP and PDP', function () {
            //default load
            tu.getTextByRepeaterRow(0);
            //price is not currently supported
            browser.sleep(3000);
            // tu.clickElement('linkText', 'COMPUTER ACCESSORIES');
            var category =  element(by.repeater('top_category in categories').row(1).column('top_category.name'));
            browser.driver.actions().mouseMove(category).perform();
            browser.sleep(200);
            category.click();
            tu.assertProductByRepeaterRow(2, 'MOUSEPAD');
            expect(element(by.repeater('product in products').row(2).column('prices[product.product.id].effectiveAmount')).getText()).toEqual('$1.99');
            expect(element(by.repeater('product in products').row(2).column('prices[product.product.id].measurementUnit.quantity')).getText()).toEqual('1000 g');
            element(by.repeater('product in products').row(2).column('product.name')).click();
            expect(element(by.binding('product.prices[0].effectiveAmount')).getText()).toEqual('$1.99');
            expect(element(by.binding('product.prices[0].measurementUnit.quantity')).getText()).toEqual('1000g');


        });


        xit('should search', function () {
            tu.sendKeysByCss('div.col-xs-7.search > div.y-search.ng-isolate-scope > div.right-inner-addon > #search', 'beer');
            expect(element(by.repeater('result in search.results').row(0)).getText()).toEqual('Beer Mug w/Helles');
            expect(element(by.repeater('result in search.results').row(1)).getText()).toEqual('Beer Mug');
            expect(element(by.repeater('result in search.results').row(2)).getText()).toEqual('Water Bottle');
            element(by.repeater('result in search.results').row(1)).click();
            expect(element(by.binding(tu.productDescriptionBind)).getText()).toEqual("Traditional bavarian beer mug with hybris logo in blue. Drink your beer in the same style as hybris employees have done since the company's first days.");
        });

        xit('not return search results', function () {
            tu.sendKeysByCss('div.col-xs-8.search > div.y-search.ng-isolate-scope > div.right-inner-addon > #search', 'test1');
            expect(element(by.repeater('result in search.results').row(0)).isPresent()).toBe(false);
        });

        //need to revisit to see how we can do this with 2 search navs loaded
        xit('should take user to search results page', function () {
            tu.sendKeysByCss('div.col-xs-8.search > div.y-search.ng-isolate-scope > div.right-inner-addon > #search', 'beer');
            expect(element(by.binding('search.numberOfHits')).getText()).toEqual('See All 3 Results');
            tu.clickElement('binding', 'search.numberOfHits');
            tu.assertProductByRepeaterRow('0', 'BEER MUG');
            tu.assertProductByRepeaterRow('1', 'WATER BOTTLE');
            tu.assertProductByRepeaterRow('2', 'BEER MUG W/HELLES');
        });

    });
}); 

