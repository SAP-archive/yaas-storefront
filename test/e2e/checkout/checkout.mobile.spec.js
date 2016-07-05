'use strict';

var mobileSiteConfig = require('../config/mobile-site.json');

var TI = require('./checkout.test-input.json');

var utils = require('../utils/utils.js');
var CartPageObject = require('../cart/cart.po.js');
var ProductDetailsPageObject = require('../product/product-details.po.js');
var AccountPageObject = require('../account/account.po.js');
var SitePageObject = require('../site/site.po.js');
var CouponPageObject = require('../coupon/coupon.po.js')
var CheckoutPageObject = require('./checkout.po.js');
var ConfirmationPageObject = require('../confirmation/confirmation.po.js');

var testUsers = TI.users;
var testProducts = TI.products;


describe("mobile checkout:", function () {

    var cartPO,
        productDetailsPO,
        accountPO,
        sitePO,
        couponPO,
        checkoutPO,
        confirmationPO;

    var isMobile = true;
    var isLoggedIn = false;

    beforeEach(function () {
        utils.setWindowSize(mobileSiteConfig.windowDetails.width, mobileSiteConfig.windowDetails.height);
    });

    describe("verify mobile checkout functionality", function () {

        beforeEach(function () {
            utils.deleteCookies();

            cartPO = new CartPageObject();
            couponPO = new CouponPageObject();
            productDetailsPO = new ProductDetailsPageObject();
            accountPO = new AccountPageObject();
            sitePO = new SitePageObject();
            checkoutPO = new CheckoutPageObject();
            confirmationPO = new ConfirmationPageObject();

            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.fillNameAndEmailFields(TI.selectModel,testUsers.main.name, testUsers.main.email);

            checkoutPO.waitForForm();

            checkoutPO.fillAddressFields(TI.addressType.SHIPPING);

        });

        it('should allow all fields to be editable on mobile', function () {
            checkoutPO.mobile.continueToBilling();

            expect(checkoutPO.getShippingAddressLine1Address()).toEqual(testUsers.main.address.street.split(' ')[0]);

            checkoutPO.changeBillingAddressToShippingAddressState()

            checkoutPO.fillBillingAddressNameField(testUsers.main.fullName);

            checkoutPO.fillAddressFields(TI.addressType.BILLING);

            checkoutPO.mobile.continueToPayment();

            checkoutPO.fillCreditCardFields(TI.creditCard);

            checkoutPO.mobile.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.main,'Total Price: ' + testProducts.whiteCoffeeMug.one.itemPriceUS,isMobile);
        });

        it('should have basic validation on mobile', function () {

            var c1 = 'toBilling'; 
            var c2 = 'toPayment'; 

            checkoutPO.mobile.validate('zipCodeShip', '80301', c1); 
            checkoutPO.mobile.validate('contactNameShip', 'Mike Night', c1);
            checkoutPO.mobile.validate('address1Ship', '123',c1);
            checkoutPO.mobile.validate('cityShip', 'Boulder', c1);
            checkoutPO.mobile.validate('email','mike@yaastest.com', c1);

            checkoutPO.mobile.continueToBilling();

            expect(checkoutPO.getShippingAddressLine1Address()).toEqual(testUsers.main.address.street.split(' ')[0]);

            checkoutPO.changeBillingAddressToShippingAddressState();

            checkoutPO.fillBillingAddressNameField(testUsers.main.fullName);

            checkoutPO.fillAddressFields(TI.addressType.BILLING);

            checkoutPO.mobile.validate('zipCodeBill', '80301', c2); 
            checkoutPO.mobile.validate('contactNameBill', 'Mike Night', c2);
            checkoutPO.mobile.validate('address1Bill', '123', c2);
            checkoutPO.mobile.validate('cityBill', 'Boulder', c2);


            checkoutPO.mobile.continueToPayment();

            checkoutPO.fillCreditCardFields(TI.creditCard);

            checkoutPO.mobile.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.main,'Total Price: ' + testProducts.whiteCoffeeMug.one.itemPriceUS,isMobile);

        });

    });
});


