module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
        'public/js/vendor/angular/angular.js',
        'public/js/vendor/angular-bootstrap/ui-bootstrap.js',
        'public/js/vendor/angular-cookies/angular-cookies.js',
        'public/js/vendor/angular-mocks/angular-mocks.js',
        'public/js/vendor/angular-resource/angular-resource.js',
        'public/js/vendor/angular-ui-router/release/angular-ui-router.js',
        'public/js/vendor/angular-ui-utils/ui-utils.js',
        'public/js/vendor/angular-translate/angular-translate.js',
        'public/js/vendor/angular-local-storage/angular-local-storage.js',

        'public/js/app/**/*index.js',
        'public/js/app/**/*.js',

        'test/unit/**/*.js'
    ],

    exclude : [

    ],

    preprocessors : {
        'public/js/app/**/*.js': 'coverage'
    },

    reporters : ['coverage','progress'],

    coverageReporter : {
        type : 'html',
        dir : 'coverage/'
    },

    autoWatch : true,
    singleRun : true,
    
    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-script-launcher',
            'karma-jasmine',  
            'karma-phantomjs-launcher',
            'karma-coverage'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}