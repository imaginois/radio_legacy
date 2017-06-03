define([
	'js/config',
	'module',
	'js/core/router',
	'js/core/dom',
	'js/helper/log',
	'js/lib/flyd',
	'js/conf/defaultRoutes',
	'js/core/section',
], function (cfg, module, router, dom, log, radio, defaultRoutes, section) {
	'use strict';

	function Manager () {
		/**
		 * Initialization function. Starts the application
		 * @return {bool} Result of execution: True/False
		 */
		function init () {
			setRoutes();			
			log.info('Manager Init Finished', Date.now());
			log.info("radio Object Key sizes", log.expensiveKeys(radio));
			// console.log("keysVsValues", log.keysVsValues(radio)); // need some work...
		}

		/**
		 * Initializes the routing object for the application
		 * Multiple instances of the app can run different
		 * instances of the routes object
		 */
		function setRoutes (routes) {
			var routes = routes || defaultRoutes;
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