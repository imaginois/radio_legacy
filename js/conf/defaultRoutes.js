define([
	'js/config',
	'js/helper/log'
], function (cfg, log) {
	'use strict';
	
	return [
		['/', 'home', function () {
			// console.log('going home')
		}],
		['/asset', 'asset', function () {
  			this.heading = 'I\'m page two!';
  			log.info("load Asset");
		}],

		['/epg', 'epg', function () {
		    this.counter = 0;
  			this.heading = 'Hello EPG!';
			this.$on('body', 'click', function () {
				this.counter += 1;
				this.$refresh();
				console.log("click on continuewatching, counter", this.counter);
			}.bind(this));
		}],
		['*', 'error404', function (routeData) {
			log.warn('Wrong url. Redirecting to: ', routeData.templateId);
		}]
	];
});