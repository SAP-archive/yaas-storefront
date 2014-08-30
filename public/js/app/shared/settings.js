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
               baseUrl: 'http://configuration-v2.test.cf.hybris.com'
            } ,
            products: {

                baseUrl: 'http://yaas-test.apigee.net/test/product/v1',
                pageSize: 10
            },

            productDetails: {
                baseUrl: 'http://product-details-v1.test.cf.hybris.com'
            },

            checkout: {
                baseUrl: 'http://yaas-test.apigee.net/test/checkout-mashup/v1'
            },

            orders: {
                baseUrl: 'http://order-v2.test.cf.hybris.com'
            },

            cartItems: {
                baseUrl: 'http://cart-v1.test.cf.hybris.com'
            },

            cart: {
                baseUrl: 'http://cart-v1.test.cf.hybris.com'
            },

            cartDetails: {
                baseUrl: 'http://cart-mashup-v1.test.cf.hybris.com'
            },

            prices: {
                baseUrl: 'http://price-v2.test.cf.hybris.com'
            },

            shippingCosts: {
                baseUrl: 'http://shipping-cost-v1.test.cf.hybris.com'
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