exports.config = {
  allScriptsTimeout: 30000,

  specs: [
    '../test/e2e/*tests.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  onPrepare: function() {      
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter(null, true, true, 'coverage/')
    );
  },

  baseUrl: 'http://localhost:9000',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }
};
