exports.config = {
  allScriptsTimeout: 30000,

  specs: [
    '../test/e2e/*tests.js'
  ],

  capabilities: {
    'browserName': 'phantomjs',
    'phantomjs.cli.args':['--ignore-ssl-errors=true', '--web-security=false']
  },

  onPrepare: function() {      
    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter(null, true, true, 'coverage/')
    );
  },

  baseUrl: 'http://demo-store.test.cf.hybris.com',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000
  }
};
