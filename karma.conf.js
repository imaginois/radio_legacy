// Karma configuration
// Generated on Fri Jan 16 2015 18:06:06 GMT-0800 (PST)

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'requirejs'],
    files: [
      'test-main.js',
      // 'js/init.js',
      {pattern: 'js/**/*.js', included: false},
      {pattern: 'spec/**/*.js', included: false},
      // {pattern: 'js/core/*.js', included: false},
      {pattern: 'bower_components/flyd/*.js', included: false},
      {pattern: 'bower_components/snabbdom/dist/*.js', included: false},
    ],
    exclude: [
        // 'js/config.js',
        // 'js/init.js',
        'js/lib',
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'js/core/**/*.js': ['coverage'],
      'js/helper/!(log|remoteDebug)*.js': ['coverage'], //exclude the debuggers
    },
    concurrency: Infinity,
    coverageReporter: {
        includeAllSources: false,
        dir: 'coverage/',
        reporters: [
            { type: "html", subdir: "html" },
            { type: 'text-summary' }
        ]
    },
    client: {
      requireJsShowNoTimestampsError: '^(?!.*(^/base/node_modules/))'
    },
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
