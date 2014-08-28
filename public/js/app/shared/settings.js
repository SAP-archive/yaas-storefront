'use strict';

angular.module('ds.shared')


	/**
	 * Provides default settings (constants) for the application.
	 * 
	 * @type {Object}
	 */
	.constant('settings', {

        cartTenant: 'single', // temp workaround Priceless issue with hard-coded tenant id

        hybrisUser: 'Anonymous',
        hybrisApp: 'y_ondemand_storefront',
        roleSeller: 'seller',
        authTokenKey: 'auth.user',
        accessTokenKey: 'auth.accessToken',
        userIdKey: 'user.email',

        // defines thea API endpoints and routes
        apis: {

            configuration: {
               baseUrl: 'http://yaas-test.apigee.net/test/configuration/v1'
            } ,
            products: {

                baseUrl: 'http://yaas-test.apigee.net/test/product/v1',
                pageSize: 10
            },

            productDetails: {
                baseUrl: 'http://yaas-test.apigee.net/test/product-details/v1'
            },

            checkout: {
                baseUrl: 'http://checkout-mashup-v1.test.cf.hybris.com'
            },

            orders: {
                baseUrl: 'http://yaas-test.apigee.net/test/order/v1/'
            },

            cartItems: {
                baseUrl: 'http://cart-v1.test.cf.hybris.com'
            },

            cart: {
                baseUrl: 'http://yaas-test.apigee.net/test/v1/cart'
            },

            cartDetails: {
                baseUrl: 'http://cart-mashup-v1.test.cf.hybris.com'
            },

            prices: {
                baseUrl: 'http://yaas-test.apigee.net/test/v1/price'
            },

            shippingCosts: {
                baseUrl: 'http://yaas-test.apigee.net/test/shipping-cost/v1'
            },

            customers: {
                baseUrl: 'http://yaas-test.apigee.net/test/customer/v1',
                apiKey: 'rvwIrsuqSM2iENjhvuPgQ75HNivPQ6TT'
            },

            // header keys
            headers: {

                // "final" headers for CaaS auth.
                // will be replaced by full oauth flow.
                hybrisTenant: 'hybris-tenant',
                hybrisRoles: 'hybris-roles',
                hybrisUser: 'hybris-user',
                hybrisApp: 'hybris-app',

                hybrisAuthentication: 'Authentication',
                hybrisAuthorization: 'Authorization',
                paging: {
                    total: 'X-Count'
                }
            }
        },
        // relevant keys from configuration service:
        configKeys: {
            stripeKey: 'payment.stripe.key.public',
            storeName: 'store.settings.name',
            storeLogo: 'store.settings.image.logo.url'
        },

        placeholderImage: 'img/no-image.png'
    });