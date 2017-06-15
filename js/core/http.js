define([
    'js/config'
], function (config) {
    'use strict';

    var reasons = {
        url: {
            state: 'rejected',
            reason: {
                error: 'MISSING URL'
            }
        },
        params: {
            state: 'rejected',
            reason: {
                error: 'INSUFFICIENT PARAMS'
            }
        }
    };

    function Http() {
        this.url = config.defaultProviderURL;

        /**
         * Sets parameters for XHR requst
         * @param {Array} arr Array of requst's parameters
         */
        this.setParams = function (arr) {
            return {
                url: (isSet(arr[0]) && !isEmpty(arr[0]) ? this.url + arr[0] : null),
                data: (isSet(arr[1]) && isObject(arr[1]) && Object.keys(arr[1]).length > 0 ? arr[1] : {})
            };
        };

        /**
         * Makes new GET xhr request
         * @return {Promise} Generic Q.js promise object
         * @example http.get('continueWatching').then(successHandler, failHandler);
         */
        this.get = function () {
            var params = this.setParams([].slice.call(arguments, 0));
            if (null === params.url) {
                return Q.reject(reasons.url);
            }

            return Q.Promise(function (resolve, reject, notify) {
                var result = Q.xhr.get(params.url, {params: params.data});

                result.then(resolve, reject, notify);

                return result;
            });
        };

        /**
         * Makes new POST xhr request
         * @return {Promise} Generic Q.js promise object
         */
        this.post = function () {
            var params = this.setParams([].slice.call(arguments, 0));

            if (null === params.url) {
                return Q.reject(reasons.url);
            }

            if (Object.keys(params.data).length === 0) {
                reasons.params.reason.url = params.url;
                return Q.reject(reasons.params);
            }

            return Q.Promise(function (resolve, reject, notify) {
                return Q.xhr.post(params.url, params.data).then(resolve, reject, notify);
            });
        };
    }

    return new Http();
});