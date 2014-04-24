exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '../test/e2e/*tests.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://qa-bsd-1.yrdrt.fra.hybris.com:9000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
