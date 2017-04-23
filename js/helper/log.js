define([
	'config',
], function (cfg) {
	'use strict'

	// TODO: Provide different interfaces for different 
	// loggers, i.e. remoteDebug, socketDebug
	function Log () {
		function logInfo(o) {
			var args = [].slice.call(arguments);
			if(cfg.DEBUG_LEVEL > 2) {
				console.info.apply(console, args);
			}
		}

		function logWarn(o) {
			var args = [].slice.call(arguments);
			if(cfg.DEBUG_LEVEL > 1) {
				console.warn.apply(console, args);
			}
		}

		function logError(o) {
			var args = [].slice.call(arguments);
			if(cfg.DEBUG_LEVEL > 0) {
				console.error.apply(console, args);
			}
		}

		return {
			info : logInfo,
			warn : logWarn,
			error: logError,
		}
	}
    
    return new Log();
});