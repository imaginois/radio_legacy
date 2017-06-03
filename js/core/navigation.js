define([
	'js/config',
	'js/lib/flyd',
  	'js/core/manager',
	'js/helper/log'
], function (cfg, radio, manager, log) {
	'use strict'

	function Navigation () {
    	function init() {
			var mousemove = radio.stream();

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
    		log.info('Navigation Init Finished', Date.now());
    	}

    	init();
	}
    
  return Navigation();
});