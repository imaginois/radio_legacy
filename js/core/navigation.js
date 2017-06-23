define([
	'js/config',
	'js/lib/flyd',
	'js/helper/log',
	'js/core/dispatcher'
], function (cfg, radio, log, Dispatcher) {
	'use strict';

	function Navigation () {
		
		var events = [
			{ "move_left" : moveLeft, },
			{ "move_right": moveRight, },
			{ "move_up"   : moveUp, },
			{ "move_down" : moveDown, },
			{ "select"    : select },
		];

    	function init() {
    		Dispatcher.subscribe(events);
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

    	function moveLeft() {
    		console.log("move left")
    		return true;
    	}

    	function moveRight() {
    		console.log("move Rigth")
    		return true;
    	}

    	function moveUp() {
    		console.log("move up")
    		return true;
    	}

    	function moveDown() {
    		console.log("move down")
    		return true;
    	}

    	init();

    	return {
    		select : select
    	}
	}
    
  return Navigation();
});