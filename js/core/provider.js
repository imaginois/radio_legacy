define(function (require) {
	'use strict';

	var cfg = require('js/config');
	var http = require('js/core/http');

	function get(serviceName) {
		// body...
	}

	function getStripe(stripeId) {
		// body...
	}

	function getContinueWatching() {
		var successHandler = function (response) {
                return response.data;
            }

		return http.get('continueWatching').then(successHandler, failHandler);
	}

	function failHandler () {
        return {
            posters: [],
            raw: []
        };
    }

	function Provider () {
		this.url = cfg.defaultProviderURL;
		this.getContinueWatching = getContinueWatching;
	}
    
    return Provider;
});