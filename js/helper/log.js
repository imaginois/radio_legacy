define([
	'js/config',
	'js/helper/remoteDebug',
], function (cfg, remoteDebug) {
	'use strict';

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

		// functions needed for propertySizes
		// measures how much memory a key and its value takes up in a collection of objects
	    function stringSize(str) {
	        // JavaScript strings are unicode UTF-16 up to 2 bytes per character
	        return str.length * 2;
	    }

	    function objectSize(obj) {
	        return stringSize(JSON.stringify(obj));
	    }

	    var value = function value(key) {
	        return function(object) {
	            return object[key];
	        };
	    };

	    var pickValue = function(key, items) {
	        return items.map(value(key));
	    };

	    function keySize(items, key) {
	        return stringSize(key) * items.length + objectSize(pickValue(key, items));
	    }

	    function zip(keys, values) {
	        var result = {};
	        keys.forEach(function(key, index) {
	            result[key] = values[index];
	        });
	        return result;
	    }

	    function toMB(bytes) {
	        return bytes / 1024 / 1024;
	    }

	    function toSizeMB(size) {
	        return toMB(size).toFixed(2) + ' MB';
	    }

	    function valuesInMB(obj) {
	        var result = {};
	        Object.keys(obj).forEach(function(key) {
	            var val = obj[key];
	            if (typeof val === 'number') {
	                result[key] = toSizeMB(obj[key]);
	            }
	        });
	        return result;
	    }

	    function propertySizes(keys, items) {
	        if (arguments.length === 1) {
	            items = keys;
	            if (!Array.isArray(items) && typeof items === 'object') {
	                items = [items];
	            }
	            if (!items.length) {
	                return {};
	            }
	            keys = Object.keys(items[0]);
	        }

	        var keyInItemsSize = keySize.bind(null, items);
	        var sizes = keys.map(keyInItemsSize);
	        var result = zip(keys, sizes);
	        result.mb = valuesInMB.bind(null, result);
	        return result;
	    }

	    // functions needed for keysVsValues
		function stringSize(str) {
	        // JavaScript strings are unicode UTF-16 up to 2 bytes per character
	        return str.length * 2;
	    }

	    function objectSize(obj) {
	        if (typeof obj === 'string') {
	            return stringSize(obj);
	        }
	        return stringSize(JSON.stringify(obj));
	    }

	    function values(obj) {
	        return Object.keys(obj).map(function(key) {
	            return obj[key];
	        });
	    }

	    function listSize(values) {
	        return values.reduce(function(total, value) {
	            return objectSize(value) + total;
	        }, 0);
	    }

	    function keysValues(obj) {
	        if (typeof obj === 'object') {
	            return {
	                keys: stringSize(Object.keys(obj).join('')),
	                values: listSize(values(obj))
	            };
	        } else {
	            return {
	                keys: 0,
	                values: objectSize(obj)
	            };
	        }
	    }
		// measures how much memory object keys take vs values in collection of objects
	    function keysVsValues(items) {
	        if (!Array.isArray(items) && typeof items === 'object') {
	            return keysVsValues([items]);
	        }

	        console.assert(Array.isArray(items));
	        return items.reduce(function(sizes, item) {
	            var size = keysValues(item);
	            sizes.keys += size.keys;
	            sizes.values += size.values;
	            return sizes;
	        }, {
	            keys: 0,
	            values: 0
	        });
	    }

		return {
			info : logInfo,
			warn : logWarn,
			error: logError,
			expensiveKeys: propertySizes,
			keysVsValues: keysVsValues,
		};
	}
    
    return new Log();
});