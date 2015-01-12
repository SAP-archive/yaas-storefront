var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
    allScriptsTimeout: 30000,
    // sauceUser: 'BSDQA',
    // sauceKey: 'd91f4799-f3bc-4736-b699-1931d87b6db0',    

    specs: [
        '../test/e2e/*-tests.js'
    ],


    capabilities: {
        'browserName': 'chrome',
        // 'browserName': 'phantomjs',
        'phantomjs.cli.args': ['--ignore-ssl-errors=true', '--web-security=false', '--ssl-protocol=any']

    },

    onPrepare: function () {
        require('jasmine-reporters');
        jasmine.getEnv().addReporter(
            new jasmine.JUnitXmlReporter(null, true, true, 'coverage/')
        );
        // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
        
        jasmine.getEnv().addReporter(new ScreenShotReporter({
            baseDirectory: './tmp/screenshots',
            takeScreenShotsOnlyForFailedSpecs: true
        }));
        var disableNgAnimate = function () {
            angular.module('disableNgAnimate', []).run(['$animate', function ($animate) {
                $animate.enabled(false);
            }]);
        };

        browser.addMockModule('disableNgAnimate', disableNgAnimate);
    },


    baseUrl: 'http://localhost:9000',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000
    }
};
