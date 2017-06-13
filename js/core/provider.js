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

	function getContinueWatching(index, size) {
		var successHandler = function (response) {
                return response.data;
            }

		return http.get('continueWatching', { _page : (index || 0), _limit : (size || 6) } ).then(successHandler, failHandler);
	}

	function getNewTitles(index, size) {
		var successHandler = function (response) {
                return response.data;
            }

		return http.get('newTitles', { _page : (index || 0), _limit : (size || 6) } ).then(successHandler, failHandler);
	}

	function getAllTitles(index, size) {
		var successHandler = function (response) {
                return response.data;
            }

		return http.get('allTitles', { _page : (index || 0), _limit : (size || 6) } ).then(successHandler, failHandler);
	}

	function failHandler () {
        return {
            posters: [],
            raw: []
        };
    }

	function Provider () {
		this.url                 = cfg.defaultProviderURL;
		this.getContinueWatching = getContinueWatching;
		this.getNewTitles        = getNewTitles;
		this.getAllTitles        = getAllTitles;
	}
    
    return Provider;
});