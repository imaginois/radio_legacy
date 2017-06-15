define([
	'js/config',
	'js/lib/flyd',
  	'js/core/navigation',
  	'js/core/keycontroller',
	'js/helper/log'
], function (cfg, radio, navigation, Keycontroller, log) {
	'use strict';

	function Dispatcher () {
		
		var mousemove = radio.stream();
		var keypress = radio.stream();

		document.addEventListener('mousemove', mousemove);
		document.addEventListener('keydown', keypress);

    	function init() {
    		Keycontroller.bindKeyPresses();

			/* istanbul ignore next */
			radio.on(function (mouseEvents) {
				navigation.select(mouseEvents.target)
			}, mousemove);

			/* istanbul ignore next */
			radio.on(function (keyEvent) {
				Keycontroller.keyToEvent(keyEvent).map(trigger);
			}, keypress);

    		log.info('Dispatcher Init Finished', Date.now());
    	}

    	function trigger(event) {
    		console.log(event)
    	}

    	init();

    	return {
    		mousemove : mousemove,
    		keypress  : keypress,
    		trigger   : trigger
    	}
	}
    
  return new Dispatcher();
});