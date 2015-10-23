var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
    allScriptsTimeout: 45000,
    //comment out keys to run locally
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    specs: [

        '../test/e2e/cart-tests.js',
        '../test/e2e/checkout-tests.js',
        '../test/e2e/coupon-tests.js',
        '../test/e2e/login-tests.js',
        '../test/e2e/product-tests.js'
    ],


    capabilities: {
        'browserName': 'chrome',
        'maxInstances': 6,
        'shardTestFiles': true,
        //comment out the following Saucelabs capabilities to run locally
        'platform': 'OS X 10.8',
        'screen-resolution': '1280x1024',
        'record-video': false,
        'max-duration': 10800,
        'time-zone': 'Berlin',
        'name': 'storefront tests',

        // not currently using phantomjs
        // 'browserName': 'phantomjs',
        // 'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false', '--ssl-protocol=any']

    },

    onPrepare: function () {
        require('jasmine-reporters');
        jasmine.getEnv().addReporter(
            new jasmine.JUnitXmlReporter(null, true, true, 'coverage/')
        );
        // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
        
        // jasmine.getEnv().addReporter(new ScreenShotReporter({
        //     baseDirectory: './tmp/screenshots',
        //     takeScreenShotsOnlyForFailedSpecs: true
        // }));
        var disableNgAnimate = function () {
            angular.module('disableNgAnimate', []).run(['$animate', function ($animate) {
                $animate.enabled(false);
            }]);
        };

        browser.addMockModule('disableNgAnimate', disableNgAnimate);
    },

    baseUrl: 'https://storefront-demo.yaas.io/',


    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 180000
    }
};
