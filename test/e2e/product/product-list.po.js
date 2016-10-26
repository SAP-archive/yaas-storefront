'use strict';

var utils = require('../utils/utils.js');

var ProductListPage = function () {

  var textDisplays = {
    productRange: element(by.id('product-range-indicator')) 
  };

  var inputFields = {
    search: element.all(by.id('search')).last() //First ID corresponds to mobile view
  };

  var links = {
    kitchenCategory: element(by.xpath("//ul[@id='product-categories']/li[2]")),
    officeCategory: element(by.xpath("//ul[@id='product-categories']/li[3]")),
    apparelCategory: element(by.xpath("//ul[@id='product-categories']/li[1]"))
  };

  this.scrollToProduct = function (productId) {
    var deferred = protractor.promise.defer();
    var maxCount = 10;
    var count = 0;
    while (count < maxCount) {
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
        browser.sleep(500);
        count++;
        if (element(by.id(productId)).isPresent()) {
            deferred.fulfill();
        } else if (count === maxCount) {
            deferred.reject();
        }
    }
    return deferred.promise;
  };

  this.search = {
    waitForBox: function() { 
      browser.wait(function () {
        return inputFields.search.isPresent();
      });
    },

    for: function(searchQuery) {
      inputFields.search.clear();
      inputFields.search.sendKeys(searchQuery);
    },

    getFirstResultText: function() {
      return element(by.repeater('result in search.results').row(0)).getText();
    },

    goToFirstResult: function() {
      element(by.repeater('result in search.results').row(0)).click();
    },

    areSearchResultsPresent: function() {
      return element(by.repeater('result in search.results').row(0)).isPresent();
    }
  };

  this.get = function () {
    browser.get(utils.tenant + '/#!/ct/');
  };

  //The column number should be taken as 0 in the operation of the functions in this object
  this.thumbnail = {
    getName: function(rowNumber) {
      return element(by.repeater('product in products').row(rowNumber).column('product.name')).getText();
    },

    goToProduct: function(rowNumber) {
      element(by.repeater('product in products').row(rowNumber).column('product.name')).click();
    },

    getPrice: function(rowNumber) {
      return element(by.repeater('product in products').row(rowNumber).column('prices[product.product.id].effectiveAmount')).getText();
    },

    getMeasurementUnitAndQuantity: function(rowNumber) {
      return element(by.repeater('product in products').row(rowNumber).column('prices[product.product.id].measurementUnit.quantity')).getText();
    },

    getOriginalAmount: function(rowNumber) {
      return element(by.repeater('product in products').row(rowNumber).column('prices[product.product.id].originalAmount')).getText();
    }
  };

  this.goToCategory = function(category) {
    if(category === 'Kitchen') {
      links.kitchenCategory.click();
    }
    else if(category === 'Office') {
      links.officeCategory.click();
    }

    else if(category === 'Apparel') {
      links.apparelCategory.click();
    }
  };

  this.sortPage = function(sortOrder) {
    utils.selectOption("sort.selected", sortOrder);
  };

  this.scrollToProductBySelector = function (selector) {
    utils.scrollToProduct(selector);
  };

  this.getProductRange = function () {
    return textDisplays.productRange.getText();
  };
};

module.exports = ProductListPage;