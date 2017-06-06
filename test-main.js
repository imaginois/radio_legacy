var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});


var _LTracker = _LTracker || [];
_LTracker.push({'logglyKey': 'dbb4d6ad-8a00-4200-8943-77b9671fa191',
'sendConsoleErrors' : true,
'tag' : 'loggly-jslogger'  });



        var body = document.getElementsByTagName("body")[0];
        var view = document.createElement('div');
        view.setAttribute('id', 'view');
        body.appendChild(view);

        var continuewatching = document.createElement('div');
        continuewatching.setAttribute('id', 'continuewatching');
        view.appendChild(continuewatching);


require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',
  paths: {
      vendor: 'bower_components',
      // node_modules: '../node_modules'
  },
  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});

require([
    'js/core/manager',
    'js/helper/base',
    'js/lib/q',
    'js/lib/q-xhr'
], function (manager, base) {
    "use strict";
});