var desktopSiteConfig = require('../config/desktop-site.json');

var TI = require('./checkout.test-input.json');
var utils = require('../utils/utils.js');
var CartPageObject = require('../cart/cart.po.js');
var ProductDetailsPageObject = require('../product/product-details.po.js');
var AccountPageObject = require('../account/account.po.js');
var SitePageObject = require('../site/site.po.js');
var CouponPageObject = require('../coupon/coupon.po.js')
var CheckoutPageObject = require('./checkout.po.js');
var ConfirmationPageObject = require('../confirmation/confirmation.po.js');
var OrderDetailsPageObject = require('./order-details.po.js');

var utils = require('../utils/utils.js');

var testProducts = TI.products;
var testUsers = TI.users;

describe("checkout:", function () {

    var cartPO,
        productDetailsPO,
        accountPO,
        sitePO,
        couponPO,
        checkoutPO,
        confirmationPO,
        orderDetailsPO;

    var isMobile = false;
    var isLoggedIn;

    describe("verify checkout functionality", function () {

        beforeEach(function () {
            utils.deleteCookies();

            utils.setWindowSize(desktopSiteConfig.windowDetails.width, desktopSiteConfig.windowDetails.height);

            cartPO = new CartPageObject();
            couponPO = new CouponPageObject();
            productDetailsPO = new ProductDetailsPageObject();
            accountPO = new AccountPageObject();
            sitePO = new SitePageObject();
            checkoutPO = new CheckoutPageObject();
            confirmationPO = new ConfirmationPageObject();
            orderDetailsPO = new OrderDetailsPageObject();

            productDetailsPO.get(testProducts.whiteCoffeeMug.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();
        });

        
        it('should load one product into cart and move to checkout', function () {
            isLoggedIn = false;

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForForm();

            checkoutPO.fillNameAndEmailFields(TI.selectModel,testUsers.main.name,testUsers.main.email);

            checkoutPO.fillAddressFields(TI.addressType.SHIPPING);
            checkoutPO.goToPreviewOrder();

            expect(checkoutPO.orderPreview.getItemEffectiveAmount()).toContain(testProducts.whiteCoffeeMug.one.itemPriceUS);
            expect(checkoutPO.orderPreview.getTotalPrice()).toContain(testProducts.whiteCoffeeMug.one.totalPriceUS);
            expect(checkoutPO.orderPreview.getItemQuantity()).toContain('1');
        });

        it('should load 2 of one product into cart and move to checkout', function () {
            isLoggedIn = false;

            cartPO.setCartQuantity(2);
            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForForm();

            checkoutPO.fillNameAndEmailFields(TI.selectModel,testUsers.main.name,testUsers.main.email);

            checkoutPO.fillAddressFields(TI.addressType.SHIPPING);
            checkoutPO.goToPreviewOrder();

            expect(checkoutPO.orderPreview.getItemEffectiveAmount()).toContain(testProducts.whiteCoffeeMug.one.itemPriceUS);
            expect(checkoutPO.orderPreview.getTotalPrice()).toContain(testProducts.whiteCoffeeMug.two.totalPriceUS);
            expect(checkoutPO.orderPreview.getItemQuantity()).toContain('2');
        });

        it('should load 2 different products into cart and move to checkout', function () {
            isLoggedIn = false;

            cartPO.continueShopping();

            productDetailsPO.get(testProducts.whiteThermos.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForForm();

            checkoutPO.fillNameAndEmailFields(TI.selectModel,testUsers.main.name,testUsers.main.email);
            checkoutPO.fillAddressFields(TI.addressType.SHIPPING);
            
            checkoutPO.goToPreviewOrder();

            expect(checkoutPO.orderPreview.getItemEffectiveAmount()).toContain(testProducts.whiteThermos.one.itemPriceUS);
            expect(checkoutPO.orderPreview.getTotalPrice()).toContain(testProducts.whiteThermos.one.totalPriceUS);
            expect(checkoutPO.orderPreview.getItemQuantity()).toContain('1');
        });

        it('should display tax overide on cart checkout and order', function () {
            isLoggedIn = false;

            cartPO.emptyCart();
            cartPO.continueShopping();

            productDetailsPO.get(testProducts.blueRollerPen.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            expect(cartPO.getTaxOverride()).toEqual(testProducts.blueRollerPen.taxOverride);

            cartPO.goToCheckout(isLoggedIn);
            checkoutPO.waitForForm();

            checkoutPO.fillNameAndEmailFields(TI.selectModel,testUsers.main.name,testUsers.main.email);
            checkoutPO.fillAddressFields(TI.addressType.SHIPPING);

            checkoutPO.goToPreviewOrder();

            expect(checkoutPO.orderPreview.getTaxOverride()).toEqual(testProducts.blueRollerPen.taxOverride);

            checkoutPO.fillCreditCardFields(TI.creditCard);
            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.main,testProducts.blueRollerPen.one.totalPriceUS,isMobile);

            expect(confirmationPO.getTaxLine()).toEqual(testProducts.blueRollerPen.taxLine);
            expect(confirmationPO.getTaxLineAmount()).toEqual(testProducts.blueRollerPen.taxAmount);
        });


        it('should allow all fields to be editable', function () {
            isLoggedIn = false;

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForForm();

            checkoutPO.fillNameAndEmailFields(TI.selectModel,testUsers.main.name,testUsers.main.email);

            checkoutPO.fillAddressFields(TI.addressType.SHIPPING);

            expect(checkoutPO.getShippingAddressLine1Address()).toEqual(testUsers.main.address.street.split(' ')[0]);

            checkoutPO.changeBillingAddressToShippingAddressState();

            checkoutPO.fillBillingAddressNameField(testUsers.main.fullName);

            checkoutPO.fillAddressFields(TI.addressType.BILLING);

            checkoutPO.goToPreviewOrder();
    
            checkoutPO.fillCreditCardFields(TI.creditCard);

            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.main,testProducts.whiteCoffeeMug.one.totalPriceUS,isMobile);
        });

        it('should allow user to create account after checkout', function () {
            isLoggedIn = false;

            var timestamp = Number(new Date());

            var mainUserEmailFields = testUsers.main.email.split('@');

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForForm();

            checkoutPO.fillNameAndEmailFields(TI.selectModel,testUsers.main.name,mainUserEmailFields[0] + timestamp + '@' + mainUserEmailFields[1]);

            checkoutPO.fillAddressFields(TI.addressType.SHIPPING);

            expect(checkoutPO.getShippingAddressLine1Address()).toEqual(testUsers.main.address.street.split(' ')[0]);

            checkoutPO.changeBillingAddressToShippingAddressState();

            checkoutPO.fillBillingAddressNameField(testUsers.main.fullName);

            checkoutPO.fillAddressFields(TI.addressType.BILLING);

            checkoutPO.goToPreviewOrder();

            checkoutPO.fillCreditCardFields(TI.creditCard);

            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.main,testProducts.whiteCoffeeMug.one.totalPriceUS,isMobile);

            confirmationPO.createAccount();

            accountPO.accountDetails.getPage();
            
            expect(accountPO.accountDetails.getContactEmail()).toContain(mainUserEmailFields[0]);
        });

        it('should allow user to select address', function () {
            isLoggedIn = true;

            cartPO.continueShopping();

            accountPO.waitForSignInLink();

            accountPO.loginUser(testUsers.hybrisTestUser);

            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.waitForCreditCardField();

            expect(checkoutPO.getLoggedInShippingAddress()).toEqual(testUsers.hybrisTestUser.address.first);

            checkoutPO.addressModal.get();

            expect(checkoutPO.addressModal.getShippingAddressLabel()).toContain(TI.addressType.SHIPPING);
            expect(checkoutPO.addressModal.getBillingAddressLabel()).toContain(TI.addressType.BILLING);

            checkoutPO.addressModal.setShippingAddress(2);

            expect(checkoutPO.getLoggedInShippingAddress()).toEqual(testUsers.hybrisTestUser.address.second);
        });

        it('should populate with existing address for logged in user', function () {
            isLoggedIn = true;

            cartPO.continueShopping();

            accountPO.waitForSignInLink();

            accountPO.loginUser(testUsers.orderHybrisTestUser);

            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.goToPreviewOrder();

            checkoutPO.fillCreditCardFields(TI.creditCard);

            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.orderHybrisTestUser,testProducts.whiteCoffeeMug.one.totalPriceUS,isMobile);

            confirmationPO.goToOrderDetails();

            expect(orderDetailsPO.getShippingAddress()).toContain(testUsers.orderHybrisTestUser.address.street);
        });

        it('should create order on account page', function () {
            //This test depends on state created by the previous test
            cartPO.emptyCart();

            cartPO.continueShopping();

            accountPO.waitForSignInLink();

            accountPO.loginUser(testUsers.orderHybrisTestUser);

            accountPO.accountDetails.getPage();

            var date = Date();
            var month = date.substr(4, 3);
            var d = new Date();
            var currentDate = month + " " + d.getDate() + ", " + d.getFullYear();

            expect(accountPO.orderRow.getCreationDate(0)).toContain(currentDate);
            expect(accountPO.orderRow.getTotalPrice(0)).toEqual(testProducts.whiteCoffeeMug.one.totalPriceUS);
            expect(accountPO.orderRow.getOrderStatus(0)).toEqual(TI.orderMessages.CREATED);
        });

        it('should allow customer to cancel order if not shipped yet', function () {
            isLoggedIn = true;

            cartPO.continueShopping();

            accountPO.waitForSignInLink();

            accountPO.loginUser(testUsers.orderHybrisTestUser);

            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.goToPreviewOrder();

            checkoutPO.fillCreditCardFields(TI.creditCard);

            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.orderHybrisTestUser,testProducts.whiteCoffeeMug.one.totalPriceUS,isMobile);

            confirmationPO.goToOrderDetails();
            
            expect(orderDetailsPO.getShippingAddress()).toContain(testUsers.orderHybrisTestUser.address.street);

            orderDetailsPO.cancelOrder();
            
            expect(orderDetailsPO.getOrderStatus()).toContain(TI.orderMessages.CANCELLED);
        });

        it('should checkout in Euros', function () {
            isLoggedIn = true;

            cartPO.continueShopping();

            sitePO.waitForSiteSelector();

            sitePO.setSite(TI.sites.SushiGermany);

            accountPO.waitForSignInLink();

            accountPO.loginUser(testUsers.euroOrderUser);

            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.goToPreviewOrder();

            checkoutPO.fillCreditCardFields(TI.creditCard);
            
            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.euroOrderUser,testProducts.whiteCoffeeMug.one.totalPriceDE,isMobile);

            confirmationPO.goToOrderDetails();

            expect(orderDetailsPO.getShippingAddress()).toContain(testUsers.euroOrderUser.address.street);
        });


        it('should create order on account page in Euros', function () {
            //This test depends on state created by the previous test
            cartPO.emptyCart();

            cartPO.continueShopping();

            accountPO.waitForSignInLink();

            accountPO.loginUser(testUsers.euroOrderUser);

            accountPO.accountDetails.getPage();

            var date = Date();
            var month = date.substr(4, 3);
            var d = new Date();
            var currentDate = month + " " + d.getDate() + ", " + d.getFullYear();

            expect(accountPO.orderRow.getCreationDate(0)).toContain(currentDate);
            expect(accountPO.orderRow.getTotalPrice(0)).toEqual(testProducts.whiteCoffeeMug.one.totalPriceDE);
            expect(accountPO.orderRow.getOrderStatus(0)).toEqual(TI.orderMessages.CREATED);

        });

        it('should merge carts and checkout for logged in user', function () {
            isLoggedIn = true;

            cartPO.continueShopping();

            accountPO.waitForSignInLink();

            accountPO.loginUser(testUsers.orderHybrisTestUser);

            accountPO.waitForSignInComplete();

            productDetailsPO.get(testProducts.whiteThermos.id);

            productDetailsPO.addProductToCart(1);

            cartPO.waitUntilNotificationIsDissmised();
            cartPO.showCart(isMobile);
            cartPO.waitUntilCartTotalIsDisplayed();

            cartPO.goToCheckout(isLoggedIn);

            checkoutPO.goToPreviewOrder();

            checkoutPO.fillCreditCardFields(TI.creditCard);

            checkoutPO.placeOrder();

            checkoutPO.waitForConfirmationPage();

            confirmationPO.verifyCustomerDetails(testUsers.orderHybrisTestUser,testProducts.whiteThermos.one.totalPriceUS,isMobile);

            confirmationPO.goToOrderDetails();

            expect(orderDetailsPO.getShippingAddress()).toContain(testUsers.orderHybrisTestUser.address.street);
        });

    });
});

