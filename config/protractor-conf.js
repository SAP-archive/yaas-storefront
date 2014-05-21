exports.config = {
  allScriptsTimeout: 15000,

  specs: [
    '../test/e2e/*tests.js'
  ],

  capabilities: {
    'browserName': 'phantomjs'
  },

  baseUrl: 'http://demo-store.dev.cf.hybris.com/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
