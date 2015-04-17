var fs = require('fs');
var tu = require('./protractor-utils.js');

describe("Localization", function () {

    assertTextByElement = function (type, pageElement, textValue) {
        if (type === 'id') {
            expect(element(by.id(pageElement)).getText()).toEqual(textValue);
        } else if (type === 'xpath') {
            expect(element(by.xpath(pageElement)).getText()).toEqual(textValue);
        } else if (type === 'css') {
            expect(element(by.css(pageElement)).getText()).toEqual(textValue);
        } else if (type === 'linkText') {
            expect(element(by.linkText(pageElement)).getText()).toEqual(textValue);
        } else if (type === 'binding') {
            expect(element(by.binding(pageElement)).getText()).toEqual(textValue);
        }

    };

    describe("verify localized properties", function () {

        beforeEach(function () {
            browser.manage().deleteAllCookies();
            browser.driver.manage().window().setSize(1000, 1000);
            browser.get(tu.tenant + '/#!/ct');
        });

        it('should load product-list in english', function () {
            // tu.selectLanguage('English');
            assertTextByElement('binding', 'category.name', 'MUGS');
            assertTextByElement('css', 'div.name.ng-binding', 'Viewing:');
            assertTextByElement('css', 'div.sortContainer > div.name.ng-binding', 'Sort by:');
            //price is not currently supported
            // assertTextByElement('css', 'option.ng-binding', 'PRICE LOW - HIGH');
            // assertTextByElement('css', 'option[value="-price"]', 'PRICE HIGH - LOW');
            assertTextByElement('css', 'option[value="name"]', 'A-Z');
            assertTextByElement('css', 'option[value="name:desc"]', 'Z-A');
            assertTextByElement('css', 'option[value="created:desc"]', 'NEWEST');
        });


        it('should load product-list in german', function () {
            tu.selectLanguage('GERMAN');
            assertTextByElement('binding', 'category.name', 'TASSEN');
            assertTextByElement('css', 'div.name.ng-binding', 'Anzeige:');
            assertTextByElement('css', 'div.sortContainer > div.name.ng-binding', 'Sortieren:');
            //price is not currently supported
            // assertTextByElement('css', 'option.ng-binding', 'PREIS AUFSTEIGEND');
            // assertTextByElement('css', 'option[value="-price"]', 'PREIS ABSTEIGEND');
            assertTextByElement('css', 'option[value="name"]', 'A-Z');
            assertTextByElement('css', 'option[value="name:desc"]', 'Z-A');
            assertTextByElement('css', 'option[value="created:desc"]', 'NEUESTE');
        });

        it('should load product-detail in english', function () {
            tu.clickElement('css', 'div.thumb');
            assertTextByElement('css', 'label.ng-binding', 'Qty:');
            assertTextByElement('id', 'buy-button', 'ADD TO CART');
            assertTextByElement('css', 'div.headline.ng-binding', 'DESCRIPTION:');
        });

        it('should load product-detail in german', function () {
            tu.clickElement('css', 'div.thumb');
            tu.selectLanguage('GERMAN');
            assertTextByElement('css', 'label.ng-binding', 'Menge:');
            assertTextByElement('id', 'buy-button', 'IN DEN WARENKORB');
            assertTextByElement('css', 'div.headline.ng-binding', 'BESCHREIBUNG:');
        });

        it('should load cart in english', function () {
            tu.clickElement('css', 'div.thumb');
            tu.clickElement('id', 'buy-button');
            //wait for cart to close
            browser.sleep(4000);
            browser.wait(function () {
                return element(by.id(tu.cartButtonId)).isDisplayed();
            });
            tu.clickElement('id', tu.cartButtonId); 
            tu.waitForCart();           
            assertTextByElement('binding', "CONTINUE_SHOPPING", 'CONTINUE SHOPPING');
            assertTextByElement('binding', "CHECKOUT", 'CHECKOUT');
            assertTextByElement('css', 'th.ng-binding', 'EST. ORDER TOTAL');
            assertTextByElement('css', 'td.ng-binding', '1 ITEM');
            assertTextByElement('css', 'span.input-group-addon.ng-binding', 'Qty:');
        });

        it('should load cart in german', function () {
            tu.clickElement('css', 'div.thumb');
            tu.selectLanguage('GERMAN');
            tu.clickElement('id', 'buy-button');
            //wait for cart to close
            browser.sleep(4000);
            browser.wait(function () {
                return element(by.id(tu.cartButtonId)).isDisplayed();
            });
            tu.clickElement('id', tu.cartButtonId);
            tu.waitForCart();
            assertTextByElement('binding', "CONTINUE_SHOPPING", 'WEITER EINKAUFEN');
            assertTextByElement('binding', "CHECKOUT", 'KASSE');
            assertTextByElement('css', 'th.ng-binding', 'ZWISCHENSUMME');
            assertTextByElement('css', 'td.ng-binding', '1 ARTIKEL');
            assertTextByElement('css', 'span.input-group-addon.ng-binding', 'Menge:');
        });

        it('should load checkout in german', function () {
            tu.clickElement('css', 'div.thumb');
            tu.selectLanguage('GERMAN');
            tu.clickElement('id', 'buy-button');
            browser.wait(function () {
                return element(by.binding('CHECKOUT')).isPresent();
            });
            // not visible immediately?
            browser.sleep(100);
            tu.clickElement('binding', 'CHECKOUT');
            browser.wait(function () {
                return element(by.binding('CONTINUE_AS_GUEST')).isPresent();
            });
            tu.clickElement('binding', 'CONTINUE_AS_GUEST');
            assertTextByElement('css', 'h2.ng-binding', '1. Meine Daten');
            assertTextByElement('binding', 'TITLE', 'Anrede');
            assertTextByElement('binding', 'FIRST_NAME', 'Vorname');
            assertTextByElement('binding', 'MIDDLE_NAME', 'Zweiter Vorname');
            assertTextByElement('binding', 'LAST_NAME', 'Nachname');
            assertTextByElement('binding', 'BILLING_ADDRESS', 'RECHNUNGSADRESSE');
            assertTextByElement('binding', 'NAME', 'Vorname');
            assertTextByElement('binding', 'ADDRESS', 'RECHNUNGSADRESSE');
            assertTextByElement('binding', 'COUNTRY', 'Land');
            assertTextByElement('binding', 'CITY', 'Stadt');
            assertTextByElement('binding', 'STATE', 'Bundesland');
            assertTextByElement('binding', 'ZIP', 'PLZ');
            assertTextByElement('binding', 'CONTACT_PHONE', 'Kontakt Telefon');
            assertTextByElement('binding', 'STEP_2_SHIPPING_INFORMATION', '2. Versandinformationen');
            assertTextByElement('binding', 'SHIPPING_ADDRESS', 'VERSANDADRESSE');
            assertTextByElement('binding', 'SAME_AS_BILLING_ADDRESS', 'ENTSPRICHT RECHNUNGSADRESSE');
            assertTextByElement('binding', 'DELIVERY_METHOD', 'VERSANDART');
            assertTextByElement('binding', 'PAYMENT', '3. Zahlung');
            assertTextByElement('binding', 'CREDIT_CARD_NUMBER', 'Kreditkartennummer');
            assertTextByElement('id', 'place-order-btn', 'BESTELLUNG AUFGEBEN');

        });

        it('should load checkout in english', function () {
            tu.clickElement('css', 'div.thumb');
            tu.clickElement('id', 'buy-button');

            browser.wait(function () {
                return element(by.binding('CHECKOUT')).isPresent();
            });
            // not visible immediately?
            browser.sleep(100);
            tu.clickElement('binding', 'CHECKOUT');
            browser.wait(function () {
                return element(by.binding('CONTINUE_AS_GUEST')).isPresent();
            });
            tu.clickElement('binding', 'CONTINUE_AS_GUEST');
            assertTextByElement('css', 'h2.ng-binding', 'Step 1. My Details');
            assertTextByElement('binding', 'TITLE', 'Title');
            assertTextByElement('binding', 'FIRST_NAME', 'First Name');
            assertTextByElement('binding', 'MIDDLE_NAME', 'Middle Name');
            assertTextByElement('binding', 'LAST_NAME', 'Last Name');
            assertTextByElement('binding', 'BILLING_ADDRESS', 'BILLING ADDRESS');
            assertTextByElement('binding', 'ADDRESS', 'BILLING ADDRESS');
            assertTextByElement('binding', 'COUNTRY', 'Country');
            assertTextByElement('binding', 'CITY', 'City');
            assertTextByElement('binding', 'STATE', 'State');
            assertTextByElement('binding', 'ZIP', 'Zip Code');
            assertTextByElement('binding', 'CONTACT_PHONE', 'Contact Phone');
            assertTextByElement('binding', 'STEP_2_SHIPPING_INFORMATION', 'Step 2. Shipping Information');
            assertTextByElement('binding', 'SHIPPING_ADDRESS', 'SHIPPING ADDRESS');
            assertTextByElement('binding', 'SAME_AS_BILLING_ADDRESS', 'SAME AS BILLING ADDRESS');
            assertTextByElement('binding', 'DELIVERY_METHOD', 'DELIVERY METHOD');
            assertTextByElement('binding', 'PAYMENT', 'Step 3. Payment');
            assertTextByElement('binding', 'CREDIT_CARD_NUMBER', 'Credit Card Number');
            assertTextByElement('id', 'place-order-btn', 'PLACE ORDER');

        });


    });
});

