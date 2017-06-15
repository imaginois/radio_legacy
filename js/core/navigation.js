define([
	'js/config',
	'js/lib/flyd',
	'js/helper/log'
], function (cfg, radio, log) {
	'use strict';

	function Navigation () {
		
    	function init() {
    		log.info('Navigation Init Finished', Date.now());
    	}

    	function select(target) {
    		if(target.classList.contains('s')){
				if ($('.selected')) {
					$('.selected').classList.remove('selected');
				}
				target.classList.add('selected');
			}
    	}

    	init();

    	return {
    		select : select
    	}
	}
    
  return Navigation();
});