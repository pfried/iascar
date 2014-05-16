module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'src/js/lib/bower/jquery/dist/jquery.js',
            'src/js/lib/bower/angular/angular.js',
            'src/js/lib/bower/angular-mocks/angular-mocks.js',
            'src/js/lib/bower/angular-cookies/angular-cookies.js',
            'src/js/lib/bower/angular-resource/angular-resource.js',
            'src/js/lib/bower/angular-bootstrap/ui-bootstrap.js',
            'src/js/lib/bower/angular-ui-router/release/angular-ui-router.js',
            'src/js/lib/bower/angular-translate/angular-translate.js',
            'src/js/lib/bower/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'src/js/app.js',
            'src/js/controllers/*.js',
            'src/js/directives/*.js',
            'src/js/filters/*.js',
            'src/js/services/*.js',
            'src/js/config/*.js',
            'src/js/routes/*.js',
            'src/js/startApp.js',
            'src/js/tests/**/*.js'
        ],


        // list of files to exclude
        exclude: [

        ],


        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress', 'coverage'],

        // source files, that you wanna generate coverage for
        preprocessors: {
            'src/js/**/*.js': ['coverage']
        },

        coverageReporter : {
            type : 'cobertura',
            dir  : 'coverage/',
            file : 'coverage.xml'
        },

        junitReporter : {
            outputFile: 'test-results.xml'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false

    });
};
