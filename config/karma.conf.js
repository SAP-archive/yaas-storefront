module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
        'public/js/vendor/angular.js',
        'public/js/vendor/angular-mocks.js',
        'public/js/vendor/angular-resource.js',
        'public/js/vendor/angular-ui-router.js',
        'public/js/vendor/angular-translate.js',

        'public/js/vendor/**/*.js',
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