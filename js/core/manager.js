define([
	'config',
	'module',
	'core/router',
	'core/dom',
	'helper/log',
	'helper/base',
	'node_modules/flyd/flyd.js'
], function (cfg, module, router, dom, log, base, radio) {
	'use strict'

	var defaultRoutes = [
		['/', 'home'],
		['/asset', 'asset', function () {
  			this.heading = 'I\'m page two!';
  			console.log("load Asset")
		}],
		['/epg', 'epg', function () {
		    this.counter = 0;
  			this.heading = 'Hello EPG!';
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
			var mousemove = radio.stream();
			var tpl = (new dom()).dom;
			
			setRoutes();			

			log.info('Manager Init Finished', Date.now());

			var container = $(cfg.app.mainContainerSelector);

			var vnode = tpl.h('div#container.two.classes', {style: {background: "red"}}, [
			  tpl.h('span', {style: {fontWeight: 'bold'}}, 'This is bold'),
			  ' and this is just normal text',
			]);
			// tpl.patch(container, vnode); 

			document.addEventListener('mousemove', mousemove);

			radio.on(function (mouseEvents) {
				if ($('.selected')) {
					$('.selected').classList.remove('selected');
				}
				mouseEvents.target.classList.add('selected')

			}, mousemove)
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