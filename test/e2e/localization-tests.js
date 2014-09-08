var fs = require('fs');
var tu = require('./protractor-utils.js');

describe("Localization", function () {

       assertTextByElement = function(type, pageElement, textValue) {
          if (type === 'id'){
              expect(element(by.id(pageElement)).getText()).toEqual(textValue);
          } else if(type === 'xpath'){
              expect(element(by.xpath(pageElement)).getText()).toEqual(textValue);
          } else if(type === 'css'){
            expect(element(by.css(pageElement)).getText()).toEqual(textValue);
          } else if(type === 'linkText') {
            expect(element(by.linkText(pageElement)).getText()).toEqual(textValue);
          }
          
        };

  describe("verify localized properties", function () {

    beforeEach(function () {
      browser.get(tu.tenant + '/#!/products');
      browser.driver.manage().window().maximize();
      browser.sleep(9000);
    });

      
      it('should load product-list in english', function () {
        assertTextByElement('linkText', 'PRODUCTS', 'PRODUCTS');
        assertTextByElement('xpath', '//section/div[2]/div/div', 'Category Name');
        assertTextByElement('css', 'div.name.ng-binding', 'Viewing:');
        assertTextByElement('css', 'div.sortContainer > div.name.ng-binding', 'Sort by:');
        //price is not currently supported
        // assertTextByElement('css', 'option.ng-binding', 'PRICE LOW - HIGH');
        // assertTextByElement('css', 'option[value="-price"]', 'PRICE HIGH - LOW');
        assertTextByElement('css', 'option[value="name"]', 'A-Z');
        assertTextByElement('css', 'option[value="-name"]', 'Z-A');
        assertTextByElement('css', 'option[value="-created"]', 'NEWEST');
      });


      it('should load product-list in german', function () {
        tu.clickElement('linkText', 'DE');
        assertTextByElement('linkText', 'PRODUKTE', 'PRODUKTE');
        assertTextByElement('xpath', '//section/div[2]/div/div', 'Category Name');
        assertTextByElement('css', 'div.name.ng-binding', 'Anzeige:');
        assertTextByElement('css', 'div.sortContainer > div.name.ng-binding', 'Sortieren:');
        //price is not currently supported
        // assertTextByElement('css', 'option.ng-binding', 'PREIS AUFSTEIGEND');
        // assertTextByElement('css', 'option[value="-price"]', 'PREIS ABSTEIGEND');
        assertTextByElement('css', 'option[value="name"]', 'A-Z');
        assertTextByElement('css', 'option[value="-name"]', 'Z-A');
        assertTextByElement('css', 'option[value="-created"]', 'NEUESTE');
      });

      it('should load product-detail in english', function () {
        tu.clickElement('css', 'div.thumb');
        assertTextByElement('css', 'label.ng-binding', 'QTY:');
        assertTextByElement('id', 'buy-button', 'BUY');
        assertTextByElement('css', 'div.headline.ng-binding', 'Description:');
      });

      it('should load product-detail in german', function () {
        tu.clickElement('css', 'div.thumb');
        tu.clickElement('linkText', 'DE');
        assertTextByElement('css', 'label.ng-binding', 'MENGE:');
        assertTextByElement('id', 'buy-button', 'IN DEN WARENKORB');
        assertTextByElement('css', 'div.headline.ng-binding', 'Beschreibung:');
      });

      it('should load cart in english', function () {
        tu.clickElement('css', 'div.thumb');
        tu.clickElement('id', 'buy-button');
        assertTextByElement('xpath', "//div[@id='cart']/div/div/button", 'CONTINUE SHOPPING');
        assertTextByElement('xpath', "//div[@id='cart']/div/div[2]/button", 'CHECKOUT');
        assertTextByElement('css', 'th.ng-binding', 'EST. ORDER TOTAL');
        assertTextByElement('css', 'td.ng-binding', '1 ITEM');
        // assertTextByElement('xpath', "//div[@id='cart']/section[2]/div/div/div[2]/div[2]", 'Item Price: $24.57');
        assertTextByElement('css', 'span.input-group-addon.ng-binding', 'Qty:');
        // assertTextByElement('xpath', "//div[@id='cart']/section[2]/div/div/div[2]/div[4]", 'Total Price: $24.57');
      });

      it('should load cart in german', function () {
        tu.clickElement('css', 'div.thumb');
        tu.clickElement('linkText', 'DE');
        tu.clickElement('id', 'buy-button');
        assertTextByElement('xpath', "//div[@id='cart']/div/div/button", 'WEITER EINKAUFEN');
        assertTextByElement('xpath', "//div[@id='cart']/div/div[2]/button", 'KASSE');
        assertTextByElement('css', 'th.ng-binding', 'ZWISCHENSUMME');
        assertTextByElement('css', 'td.ng-binding', '1 ARTIKEL');
        // assertTextByElement('xpath', "//div[@id='cart']/section[2]/div/div/div[2]/div[2]", 'Artikel Preis: $24.57');
        assertTextByElement('css', 'span.input-group-addon.ng-binding', 'Menge:');
        // assertTextByElement('xpath', "//div[@id='cart']/section[2]/div/div/div[2]/div[4]", 'Gesamtpreis: $24.57');
      });

      it('should load checkout in german', function () {
        tu.clickElement('css', 'div.thumb');
        tu.clickElement('linkText', 'DE');
        tu.clickElement('id', 'buy-button');
        browser.sleep(3000);
        tu.clickElement('css', tu.checkoutButton);
        assertTextByElement('xpath', '//small', 'Einfach bestellen in drei Schritten');
        assertTextByElement('css', 'h2.ng-binding', '1. Meine Daten');
        assertTextByElement('css', 'label.control-label.ng-binding', 'Vorname');
        assertTextByElement('xpath', '//div[2]/div/span/label', 'Nachname');
        assertTextByElement('css', 'div.col-lg-12 > div.form-group.input-group > span.input-group-addon > label.control-label.ng-binding', 'Email');
        assertTextByElement('css', 'span.form-block-headline.ng-binding', 'RECHNUNGSADRESSE');
        assertTextByElement('xpath', '//div[5]/div/span/label', 'Adresse');
        assertTextByElement('xpath', '//div[7]/div/span/label', 'Land');
        assertTextByElement('xpath', '//div[9]/div/span/label', 'Bundesland');
        assertTextByElement('xpath', '//div[6]/div/span/label', 'Adresse 2');
        assertTextByElement('xpath', '//div[8]/div/span/label', 'Stadt');
        assertTextByElement('xpath', '//div[10]/div/span/label', 'PLZ');
        assertTextByElement('css', 'div.pull-left.ng-binding', '1 ARTIKEL');
        assertTextByElement('css', 'div.pull-right.ng-binding', 'GESAMT: $13.91');
        assertTextByElement('xpath', '//div[2]/div[2]/div/div/div[2]/section[2]/div/div/div[2]/div[2]', 'Artikel Preis: $10.67');
        assertTextByElement('xpath', '//div[2]/div[2]/div/div/div[2]/section[2]/div/div/div[2]/div[3]/div', 'Menge: 1');
        assertTextByElement('xpath', '//div[2]/div[2]/div/div/div[2]/section[2]/div/div/div[2]/div[4]', 'Gesamtpreis: $10.67');
        assertTextByElement('css', 'section.summary.ng-scope > table.table > tbody > tr > td.ng-binding', 'ZWISCHENSUMME');
        assertTextByElement('xpath', '//tr[2]/td', 'VERSAND');
        assertTextByElement('css', 'tfoot > tr > td.ng-binding', 'GESAMTSUMME');
        assertTextByElement('css', '#step2 > h2.ng-binding', '2. Versandinformationen');
        assertTextByElement('xpath', '//ng-form[2]/div/div/div/span', 'VERSANDADRESSE');
        assertTextByElement('css', 'span.option.ng-binding', 'ENTSPRICHT RECHNUNGSADRESSE');
        assertTextByElement('xpath', '//ng-form[2]/div/div/div[4]/span', 'VERSANDART');
        assertTextByElement('xpath', '//ng-form[2]/div/div/div[5]/div/span/label', 'Verfahren');
        // assertTextByElement('id', 'shipMethod', 'KOSTENLOSER STANDARDVERSAND');
        assertTextByElement('css', '#step3 > h2.ng-binding', '3. Zahlung');
        assertTextByElement('css', 'div.cc-details > div.col-lg-12 > div.form-group.input-group > span.input-group-addon > label.control-label.ng-binding', 'Kreditkartennummer');
        assertTextByElement('css', 'div.cc-details > div.col-lg-6 > div.form-group.input-group > span.input-group-addon > label.control-label.ng-binding', 'Monat');
        assertTextByElement('xpath', '//div[2]/div[4]/div/span/label', 'Jahr');
        assertTextByElement('css', 'span.description.ng-binding', 'GESAMT');
        assertTextByElement('id', 'place-order-btn', 'BESTELLUNG AUFGEBEN');

      });

      // it('should load checkout in english', function () {
      //   tu.clickElement('css', 'div.thumb');
      //   tu.clickElement('id', 'buy-button');
      //   browser.sleep(3000);
      //   tu.clickElement('css', tu.checkoutButton);
      //   assertTextByElement('xpath', '//small', 'Einfach bestellen in drei Schritten');
      //   assertTextByElement('css', 'h2.ng-binding', '1. Meine Daten');
      //   assertTextByElement('css', 'label.control-label.ng-binding', 'Vorname');
      //   assertTextByElement('xpath', '//div[2]/div/span/label', 'Nachname');
      //   assertTextByElement('css', 'div.col-lg-12 > div.form-group.input-group > span.input-group-addon > label.control-label.ng-binding', 'Email');
      //   assertTextByElement('css', 'span.form-block-headline.ng-binding', 'RECHNUNGSADRESSE');
      //   assertTextByElement('xpath', '//div[5]/div/span/label', 'Adresse');
      //   assertTextByElement('xpath', '//div[7]/div/span/label', 'Land');
      //   assertTextByElement('xpath', '//div[9]/div/span/label', 'Bundesland');
      //   assertTextByElement('xpath', '//div[6]/div/span/label', 'Adresse 2');
      //   assertTextByElement('xpath', '//div[8]/div/span/label', 'Stadt');
      //   assertTextByElement('xpath', '//div[10]/div/span/label', 'PLZ');
      //   assertTextByElement('css', 'div.pull-left.ng-binding', '1 ARTIKEL');
      //   assertTextByElement('css', 'div.pull-right.ng-binding', 'GESAMT: $24.57');
      //   assertTextByElement('xpath', '//div[2]/div[2]/div/div/div[2]/section[2]/div/div/div[2]/div[2]', 'Artikel Preis: $24.57');
      //   assertTextByElement('xpath', '//div[2]/div[2]/div/div/div[2]/section[2]/div/div/div[2]/div[3]/div', 'Menge: 1');
      //   assertTextByElement('xpath', '//div[2]/div[2]/div/div/div[2]/section[2]/div/div/div[2]/div[4]', 'Gesamtpreis: $24.57');
      //   assertTextByElement('css', 'section.summary.ng-scope > table.table > tbody > tr > td.ng-binding', 'ZWISCHENSUMME');
      //   assertTextByElement('xpath', '//tr[2]/td', 'VERSAND');
      //   assertTextByElement('css', 'tfoot > tr > td.ng-binding', 'GESAMTSUMME');
      //   assertTextByElement('css', '#step2 > h2.ng-binding', '2. Versandinformationen');
      //   assertTextByElement('xpath', '//ng-form[2]/div/div/div/span', 'VERSANDADRESSE');
      //   assertTextByElement('css', 'span.option.ng-binding', 'ENTSPRICHT RECHNUNGSADRESSE');
      //   assertTextByElement('xpath', '//ng-form[2]/div/div/div[4]/span', 'VERSANDART');
      //   assertTextByElement('xpath', '//ng-form[2]/div/div/div[5]/div/span/label', 'Verfahren');
      //   assertTextByElement('id', 'shipMethod', 'KOSTENLOSER STANDARDVERSAND');
      //   assertTextByElement('css', '#step3 > h2.ng-binding', '3. Zahlung');
      //   assertTextByElement('css', 'div.cc-details > div.col-lg-12 > div.form-group.input-group > span.input-group-addon > label.control-label.ng-binding', 'Kreditkartennummer');
      //   assertTextByElement('css', 'div.cc-details > div.col-lg-6 > div.form-group.input-group > span.input-group-addon > label.control-label.ng-binding', 'Monat');
      //   assertTextByElement('xpath', '//div[2]/div[4]/div/span/label', 'Jahr');
      //   assertTextByElement('css', 'span.description.ng-binding', 'gesamt');
      //   assertTextByElement('id', 'place-order-btn', 'Bestellung aufgeben');

      // });


  }); 
}); 

