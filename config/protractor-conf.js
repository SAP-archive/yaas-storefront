var ScreenShotReporter = require('protractor-screenshot-reporter');

exports.config = {
  allScriptsTimeout: 30000,

  specs: [
    //'../test/e2e/*tests.js'
      '../test/e2e/product-tests.js'
  ],

  capabilities: {
    'browserName': 'phantomjs'
  },

  onPrepare: function() {      
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter(null, true, true, 'coverage/')
    );
      // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
      jasmine.getEnv().addReporter(new ScreenShotReporter({
          baseDirectory: './tmp/screenshots',
          takeScreenShotsOnlyForFailedSpecs: true
      }));
  },



  baseUrl: 'http://demo-store.dev.cf.hybris.com/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }
};
