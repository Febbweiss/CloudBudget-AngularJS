// Karma configuration
// Generated on Mon Aug 24 2015 10:10:09 GMT+0000 (UTC)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'public/libs/angular/angular.js',
      'public/libs/angular-route/angular-route.js',
      'public/libs/angular-cookies/angular-cookies.js',
      'public/libs/angular-xeditable/dist/js/xeditable.min.js',
      'public/libs/angular-growl-v2/build/angular-growl.min.js',
      'public/libs/angular-animate/angular-animate.min.js',
      'public/libs/angular-mocks/angular-mocks.js',
      'public/js/**/*.js',
      'public/**/*.controller.js',
      'test/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    plugins: ['karma-jasmine', 'karma-mocha', 'karma-chai', 'karma-phantomjs-launcher', 'karma-coverage'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'public/js/**/!(global.controller).js': ['coverage'],
      'public/**/*.controller.js': ['coverage'],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],
    
    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'coverage',
      subdir: '.' // Output the results into ./coverage/
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
