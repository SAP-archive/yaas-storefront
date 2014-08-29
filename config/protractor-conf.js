exports.config = {
  allScriptsTimeout: 30000,

  specs: [
    '../test/e2e/*tests.js'
  ],

  capabilities: {
    'browserName': 'phantomjs'
  },

  onPrepare: function() {      
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter(null, true, true, 'coverage/')
    );
  },

  baseUrl: 'http://demo-store.dev.cf.hybris.com',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }
};
