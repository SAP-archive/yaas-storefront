exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    '../test/e2e/*.js'
  ],

  capabilities: {
    'browserName': 'phantomjs'
  },

  baseUrl: 'http://sand-bsd-1.yrdrt.fra.hybris.com:9000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
