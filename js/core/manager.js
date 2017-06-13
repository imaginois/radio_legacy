define([
	'js/config',
	'module',
	'js/core/router',
	'js/helper/log',
	'js/lib/flyd',
	'js/conf/defaultRoutes',
], function (cfg, module, router, log, radio, defaultRoutes) {
	'use strict';

	function Manager () {
		/**
		 * Initialization function. Starts the application
		 * @return {bool} Result of execution: True/False
		 */
		function init () {
			setRoutes();
 
			window.dispatchEvent(new Event('ready'));
			
			log.info('Manager Init Finished', Date.now());
			log.info("radio Object Key sizes", log.expensiveKeys(radio));
			// console.log("keysVsValues", log.keysVsValues(radio)); // need some work...
		}

		/**
		 * Initializes the routing object for the application
		 * Multiple instances of the app can run different
		 * instances of the routes object
		 */
		function setRoutes (routesObj) {
			var routes = routesObj || defaultRoutes;
			routes.map(addRoute);
		}

		/**
		 * [addRoute description]
		 * @param {[type]} routeConfig [description]
		 */
		function addRoute (routeConfig) {
			router.route.apply(router, routeConfig);
		}

		init();
	}
    
    return Manager;
});