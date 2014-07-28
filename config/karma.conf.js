module.exports = function(config){
    config.set({
    basePath : '../',

    files : [

        'public/js/vendor-static/jquery.min.js',
        'public/js/vendor/lodash/dist/lodash.compat.min.js',
        'public/js/vendor-static/bootstrap.min.js',
        'public/js/vendor-static/owl.carousel.min.js',
        'public/js/vendor-static/img-touch-canvas.js',
        'public/js/vendor-static/jquery.fullscreen-min.js',
        'public/js/vendor-static/main.js',
        'public/js/vendor-static/stripe.js',
        'public/js/vendor/angular/angular.min.js',
        'public/js/vendor/angular-mocks/angular-mocks.js',
        'public/js/vendor/angular-resource/angular-resource.min.js',
        'public/js/vendor/restangular/dist/restangular.min.js',
        'public/js/vendor/angular-ui-router/release/angular-ui-router.min.js',
        'public/js/vendor/angular-translate/angular-translate.min.js',
        'public/js/vendor/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
        'public/js/vendor/angular-stripe-js/build/angular-stripe-js.min.js',


        // dummy config/bootstrap for testing
        'test/unit/bootstrap-test.js',


        'public/js/app/shared/shared-index.js',
        'public/js/app/shared/services/global-data.js',
        'public/js/app/shared/services/configuration-service.js',
        'public/js/app/shared/controllers/navigation-ctrl.js',
        'public/js/app/shared/i18n/i18-index.js',
        'public/js/app/shared/i18n/i18-constants.js',
        'public/js/app/shared/i18n/lang/en.js',
        'public/js/app/shared/i18n/lang/de.js',
        'public/js/app/shared/i18n/providers/translation-provider.js',
        'public/js/app/shared/utils/cors.js',

        'public/js/app/products/products-index.js',
        'public/js/app/products/services/product-service.js',
        'public/js/app/products/controllers/browse-products-ctrl.js',
        'public/js/app/products/controllers/product-detail-ctrl.js',
        'public/js/app/products/services/price-service.js',
        'public/js/app/products/services/prices-restangular.js',
        'public/js/app/products/services/products-restangular.js',
        'public/js/app/products/services/productDetails-restangular.js',

        'public/js/app/cart/cart-index.js',
        'public/js/app/cart/controllers/cart-ctrl.js',
        'public/js/app/cart/services/cart-service.js',
        'public/js/app/cart/services/cart-restangular.js',
        'public/js/app/cart/services/cartitems-restangular.js',
        'public/js/app/cart/services/cartdetails-restangular.js',
        
        'public/js/app/checkout/checkout-index.js',
        'public/js/app/checkout/controllers/checkout-ctrl.js',
        'public/js/app/checkout/services/checkout-service.js',
        'public/js/app/checkout/directives/inline-error-input.js',
        'public/js/app/checkout/services/checkout-restangular.js',

        'public/js/app/confirmation/confirmation-index.js',
        'public/js/app/confirmation/controllers/confirmation-ctrl.js',
        'public/js/app/confirmation/services/order-details-svc.js',

        'public/js/app/router.js',
        'public/js/app/settings.js',
        'public/js/app/core-resource.js',

        'public/js/app/shared/services/configuration-restangular.js',
        'public/js/app/products/services/prices-restangular.js',
        'public/js/app/products/services/products-restangular.js',
        'public/js/app/products/services/productDetails-restangular.js',
        'public/js/app/confirmation/services/order-details-restangular.js',

        'public/js/vendor-static/ui-bootstrap-tpls.js',

        'test/unit/*.js',
        'test/unit/cart/*.js',
        'test/unit/checkout/*.js',
        'test/unit/confirmation/*.js',
        'test/unit/products/*.js',
        'test/unit/shared/*.js'
    
    ],

    exclude : [

    ],

    preprocessors : {
        'public/js/app/**/*.js': 'coverage'
    },

    reporters : ['coverage','progress'],

    coverageReporter : {
        type : 'html',
        dir : 'coverage/'
    },

    autoWatch : true,
    singleRun : true,
    
    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-script-launcher',
            'karma-jasmine',  
            'karma-phantomjs-launcher',
            'karma-coverage'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}