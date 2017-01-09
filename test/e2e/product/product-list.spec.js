'use strict';

var desktopSiteConfig = require('../config/desktop-site.json');
var SitePageObject = require('../site/site.po.js');

var TI = require('./product.test-input.json');

var utils = require('../utils/utils.js');

var ProductListPageObject = require('./product-list.po.js');
var ProductDetailsPageObject = require('./product-details.po.js');

xdescribe('product list page', function () {

    var productListPO,
        productDetailsPO,
        sitePO;

    var testProducts = TI.products;
    
    describe('verify product list pages', function () {

        beforeEach(function () {
            utils.deleteCookies();
            
            utils.setWindowSize(desktopSiteConfig.windowDetails.width, desktopSiteConfig.windowDetails.height);

            sitePO = new SitePageObject();
            productListPO = new ProductListPageObject();
            productDetailsPO = new ProductDetailsPageObject();
        });

        it('should load all the products', function () {
            sitePO.getHomePage();

            expect(productListPO.getProductRange()).toEqual(TI.productCounterInitial);

            productListPO.scrollToProduct(testProducts.waterBottle.id);

            expect(productListPO.getProductRange()).toContain(TI.productCounterFinal); //should be # of 31, but won't work in phantomjs
        });

        it('should get product detail page', function () {
            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            expect(productDetailsPO.getDescription()).toEqual(testProducts.whiteCoffeeMug.descriptionEN);
            expect(productDetailsPO.getEffectiveAmount()).toEqual(testProducts.whiteCoffeeMug.one.itemPriceUS);

            sitePO.setSite(TI.sites.SushiGermany);

            expect(productDetailsPO.getDescription()).toEqual(testProducts.whiteCoffeeMug.descriptionDE);
            expect(productDetailsPO.getTaxMessage()).toEqual(testProducts.whiteCoffeeMug.taxMessageDE);
            expect(productDetailsPO.getEffectiveAmount()).toEqual(testProducts.whiteCoffeeMug.one.itemPriceDE);

            //verify refreshing grabs correct config (STOR-1183)

            utils.refreshPage();

            expect(productDetailsPO.getDescription()).toEqual(testProducts.whiteCoffeeMug.descriptionDE);
            expect(productDetailsPO.getTaxMessage()).toEqual(testProducts.whiteCoffeeMug.taxMessageDE);
            expect(productDetailsPO.getEffectiveAmount()).toEqual(testProducts.whiteCoffeeMug.one.itemPriceDE);
        });

        it('should sort order products correctly in english and using USD', function () {
            sitePO.getHomePage();

            productListPO.sortPage(TI.sortOrder.ascending);

            //The row number is specified here and the column number is taken to be 0

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.beerMug.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.beerMug.one.itemPriceUS);

            productListPO.sortPage(TI.sortOrder.descending);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.womensTShirt.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.womensTShirt.one.itemPriceUS);

            productListPO.sortPage(TI.sortOrder.newestEN);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.hellesBeerMug.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.hellesBeerMug.one.itemPriceUS);

        });

        it('should get order of products correctly in german and using Euros', function () {
            sitePO.getHomePage();

            sitePO.setSite(TI.sites.SushiGermany);

            productListPO.sortPage(TI.sortOrder.ascending);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.beerMug.nameDE);          
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.beerMug.one.itemPriceDE);

            productListPO.sortPage(TI.sortOrder.descending);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.womensTShirt.nameDE);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.womensTShirt.one.itemPriceDE);

            productListPO.sortPage(TI.sortOrder.newestDE);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.hellesBeerMug.nameDE);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.hellesBeerMug.one.itemPriceDE);
     
        });

        it('should sort products in a given category', function () {
            sitePO.getHomePage();

            productListPO.goToCategory(TI.productCategories.KITCHEN);

            productListPO.sortPage(TI.sortOrder.ascending);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.beerMug.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.beerMug.one.itemPriceUS);

            productListPO.sortPage(TI.sortOrder.descending);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.waterBottle.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.waterBottle.one.itemPriceUS);

            productListPO.sortPage(TI.sortOrder.newestEN);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.hellesBeerMug.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.hellesBeerMug.one.itemPriceUS);

            productListPO.goToCategory(TI.productCategories.OFFICE);

            productListPO.sortPage(TI.sortOrder.ascending);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.coffeMugWithEspressoMaker.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.coffeMugWithEspressoMaker.one.itemPriceUS);

            productListPO.sortPage(TI.sortOrder.descending);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.tightGripPen.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.tightGripPen.one.itemPriceUS);

            productListPO.sortPage(TI.sortOrder.newestEN);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.coffeMugWithEspressoMaker.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.coffeMugWithEspressoMaker.one.itemPriceUS);
        });

        //PLP - Product List Page and PDP - Product Details Page
        it('should display unit price on PLP and PDP', function () {
            sitePO.getHomePage();

            productListPO.goToCategory(TI.productCategories.APPAREL);

            expect(productListPO.thumbnail.getName(4)).toEqual(testProducts.lipBalm.nameEN);
            expect(productListPO.thumbnail.getPrice(4)).toEqual(testProducts.lipBalm.one.itemPriceUS);


            expect(productListPO.thumbnail.getMeasurementUnitAndQuantity(4)).toEqual(testProducts.lipBalm.one.measurementUnitAndQuantity);

            productListPO.thumbnail.goToProduct(4);

            expect(productDetailsPO.getEffectiveAmount()).toEqual(testProducts.lipBalm.one.itemPriceUS);
            expect(productDetailsPO.getMeasurementUnitAndQuantity()).toEqual(testProducts.lipBalm.one.measurementUnitAndQuantity);
        });

        it('should display sales price on PLP and PDP', function () {
            sitePO.getHomePage();

            productListPO.goToCategory(TI.productCategories.KITCHEN);
            productListPO.sortPage(TI.sortOrder.ascending);

            expect(productListPO.thumbnail.getName(0)).toEqual(testProducts.beerMug.nameEN);
            expect(productListPO.thumbnail.getPrice(0)).toEqual(testProducts.beerMug.one.itemPriceUS);

            expect(productListPO.thumbnail.getOriginalAmount(0)).toEqual(testProducts.beerMug.one.originalPriceUS);
            
            productListPO.thumbnail.goToProduct(0);

            expect(productDetailsPO.salesAmount()).toEqual(testProducts.beerMug.one.itemPriceUS);

            expect(productDetailsPO.getOriginalAmount()).toEqual(testProducts.beerMug.one.originalPriceUS);
        });

        it('should search for products that exist and return empty for ones that dont', function () {
            sitePO.getHomePage();

            productListPO.search.waitForBox();

            productListPO.search.for(testProducts.hellesBeerMug.searchQuery);

            expect(productListPO.search.getFirstResultText()).toContain(testProducts.hellesBeerMug.searchResultName);

            productListPO.search.goToFirstResult();

            expect(productDetailsPO.getDescription()).toEqual(testProducts.hellesBeerMug.descriptionEN);

            productListPO.search.for('joe satriani');

            expect(productListPO.search.areSearchResultsPresent()).toBe(false);
        });
    });
});
