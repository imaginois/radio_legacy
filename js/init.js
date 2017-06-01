require.config({
    /**
     * By default load any module IDs from js/lib
     * @type {String}
     */
    baseUrl: '',
    /*
    except, if the module ID starts with "app",
    load it from the js/app directory. paths
    config is relative to the baseUrl, and
    never includes a ".js" extension since
    the paths config could be for a directory.
    */
    paths: {
        vendor: 'bower_components',
        // node_modules: '../node_modules'
    },
	waitSeconds: 60,
	urlArgs: function(id, url) {
        var args = 'v=1';
        if (url.indexOf('view.html') !== -1) {
            args = 'v=2';
        }

        return (url.indexOf('?') === -1 ? '?' : '&') + args;
    },
});

// Start the main app logic.
require([
    'js/core/manager'
], function (manager) {
    "use strict";

	new manager();
});