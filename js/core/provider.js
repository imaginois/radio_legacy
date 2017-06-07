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
		return http.get('getContinueWatching', {
                showAdultContent: false
            }).then(function (response) {
                console.log(response)
                return {
                    raw: []
                };
            }, returnEmptyData);
	}

	function returnEmptyData () {
        return {
            posters: [],
            raw: []
        };
    };

	function Provider () {
		this.url = cfg.defaultProviderURL
		this.getContinueWatching = getContinueWatching
	}
    
    return Provider;
});