var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
    allScriptsTimeout: 35000,
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    specs: [
        '../test/e2e/*-tests.js'
    ],


    capabilities: {
        'browserName': 'chrome',
        //comment out the following capabilities to run locally
        'platform': 'OS X 10.8',
        'screen-resolution': '1280x1024',
        'record-video': false,
        'max-duration': 2700,
        'time-zone': 'Berlin',
        // not currently using phantomjs
        // 'browserName': 'phantomjs',
        'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false', '--ssl-protocol=any']

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

    baseUrl: 'http://storefront-demo.yaas.io/',


    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 180000
    }
};
