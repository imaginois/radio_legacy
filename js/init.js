require.config({
	waitSeconds: 60,
	urlArgs: function(id, url) {
        var args = 'v=1';
        if (url.indexOf('view.html') !== -1) {
            args = 'v=2'
        }

        return (url.indexOf('?') === -1 ? '?' : '&') + args;
    },
});

require([
    'core/manager'
], function (manager) {
    "use strict";

	var app = new manager();
});