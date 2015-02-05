var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
    allScriptsTimeout: 30000,
    sauceUser: process.env.SAUCE_USERNAME,
    sauceKey: process.env.SAUCE_ACCESS_KEY,

    specs: [
        '../test/e2e/*-tests.js'
    ],


    capabilities: {
        'platform': 'OS X 10.8',
        'browserName': 'chrome',
        'screen-resolution': '1280x1024',
        'record-video': false,
        'max-duration': 2700,
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

    baseUrl: 'http://shops.dev.cf.hybris.com',


    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 150000
    }
};
