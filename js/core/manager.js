define([
	'config',
	'module',
	'core/router',
	'helper/log',
	'node_modules/flyd/flyd.js'
], function (cfg, module, router, log, flyd) {
	'use strict'

	var defaultRoutes = [
		['/', 'home'],
		['/asset', 'asset', function () {
  			this.heading = 'I\'m page two!';
  			console.log("load Asset")
		}],
		['/epg', 'epg', function () {
		      this.counter = 0;
		      this.$on('#continuewatching', 'click', function () {
		        this.counter += 1;
		        console.log(this.counter)
		        this.$refresh();
		      }.bind(this));
		}],
		['*', 'error404']
	]

	function Manager () {
		function init () {
			setRoutes();
			log.info('Manager Init Finished', Date.now());
		};

		function setRoutes () {
			var routes = routes || defaultRoutes;
			routes.map(addRoute);
			log.info(router);
		}

		function addRoute (routeConfig) {
			router.route.apply(router, routeConfig);
		}

		init();
	}
    
    return Manager;
});