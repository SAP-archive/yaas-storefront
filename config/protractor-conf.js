exports.config = {
  allScriptsTimeout: 30000,

  specs: [
    '../test/e2e/*tests.js'
  ],

  capabilities: {
    'browserName': 'phantomjs'
  },

  baseUrl: 'http://demo-store.test.cf.hybris.com',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }
};
