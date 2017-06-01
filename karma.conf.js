// Karma configuration
// Generated on Fri Jan 16 2015 18:06:06 GMT-0800 (PST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'requirejs'],
    files: [
      'test-main.js',
      {pattern: 'js/**/*.js', included: false},
      {pattern: 'bower_components/flyd/*.js', included: false},
      {pattern: 'spec/**/*Spec.js', included: false}
    ],
    exclude: [
        // 'js/config.js',
        'js/init.js',
        // 'bower_components/**'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/**/*.js': ['coverage']
    },
    concurrency: Infinity,
    coverageReporter: {
        includeAllSources: true,
        dir: 'coverage/',
        reporters: [
            { type: "html", subdir: "html" },
            { type: 'text-summary' }
        ]
    },
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
