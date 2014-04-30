exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '../test/e2e/*tests.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:9000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
