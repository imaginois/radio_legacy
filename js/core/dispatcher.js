define([
	'js/config',
	'js/lib/flyd',
  	'js/core/keycontroller',
	'js/helper/log'
], function (cfg, radio,  Keycontroller, log) {
	'use strict';

	function Dispatcher () {
		
		var mousemove = radio.stream();
		var keypress = radio.stream();
		var subscriptions = [];

		document.addEventListener('mousemove', mousemove);
		document.addEventListener('keydown', keypress);

    	function init() {
    		Keycontroller.bindKeyPresses();

			/* istanbul ignore next */
			radio.on(function (mouseEvents) {
				// trigger.select(mouseEvents.target)
			}, mousemove);

			/* istanbul ignore next */
			radio.on(function (keyEvent) {
				Keycontroller.keyToEvent(keyEvent).map(trigger);
			}, keypress);

    		log.info('Dispatcher Init Finished', Date.now());
    	}

    	function subscribe(events) {
    		if(events.constructor !== Array) {
    			throw new TypeError("The Event Subscriptions list must be an array");
    		}

    		events.map(function (event) {
    			subscriptions.push(event);
    		})
    	}

    	function trigger(event) {
    		return subscriptions.filter(function (subscription) {
    			return subscription[event.name];
    		}).map(function (subscribtion) {
    			return subscribtion[event.name]();
    		})
    	}

    	init();

    	return {
    		mousemove : mousemove,
    		keypress  : keypress,
    		trigger   : trigger,
    		subscribe   : subscribe
    	}
	}
    
 	return new Dispatcher();
});
