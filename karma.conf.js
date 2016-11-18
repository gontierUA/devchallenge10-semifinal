// Karma configuration
// Generated on Fri Jan 15 2016 21:26:01 GMT+0200 (EET)

/*globals module */
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon', 'sinon-chai'],
    files: [
        'fixtures/*.html',
        'fixtures/fixture.js',
        'components/global/js/libs/jquery-3.1.0.min.js',
        'components/global/js/libs/*.js',
        'components/global/js/global.js',
        'components/**/js/*.js',
        'components/**/js/*.test.js'
    ],
    exclude: [],
    preprocessors: {
        'fixtures/*.html': ['html2js'],
        'components/**/js/!(*test).js' : ['coverage']
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: 1
  });
};
