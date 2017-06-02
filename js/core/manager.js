define([
	'js/config',
	'module',
	'js/core/router',
	'js/core/dom',
	'js/helper/log',
	'js/helper/base',
	'js/lib/flyd',
	'js/conf/defaultRoutes'
], function (cfg, module, router, dom, log, base, radio, defaultRoutes) {
	'use strict';

	function Manager () {
		/**
		 * Initialization function. Starts the application
		 * @return {bool} Result of execution: True/False
		 */
		function init () {
			var mousemove = radio.stream();
			var tpl = (new dom()).dom;
			
			setRoutes();			

			log.info('Manager Init Finished', Date.now());

			var container = $(cfg.app.mainContainerSelector);

			var vnode = tpl.h('div.main.wrapper.clearfix', [
			  	tpl.h('aside', [
			  		tpl.h('h3', ['That awkward Moment full movie'])
		  		]),	
		  		tpl.h('article.stripes', [
		  			tpl.h('section#continuewatching.clearfix', [
				  		tpl.h('header', [tpl.h('i.fa.fa-camera-retro fa-4x'), 'Keep Watching']),
				  		tpl.h('article', [tpl.h('div.items',[
													tpl.h('div.image-wrapper', ['<img class="image" src="http://netflixlife.com/files/2015/05/inglourious-basterds-.jpg" alt="" />'])
												])]),
		  			]),
		  		]),
			]);

			// tpl.patch(container, vnode); 

			document.addEventListener('mousemove', mousemove);

			/* istanbul ignore next */
			radio.on(function (mouseEvents) {
				if(mouseEvents.target.classList.contains('s')){
					if ($('.selected')) {
						$('.selected').classList.remove('selected');
					}
					mouseEvents.target.classList.add('selected');
				}

			}, mousemove);
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

		// console.log("keysVsValues", log.keysVsValues(radio)); // need some work...
		console.log("radio Object Key sizes", log.expensiveKeys(radio));

		init();
	}
    
    return Manager;
});