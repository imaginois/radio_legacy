define([
    'config'
], function (cfg) {

    'use strict';

    var logWindowTimings = function(window) {
        window.timing = window.timing || {
                getTimes: function(opts) {
                    var performance = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;
                    var timing = performance.timing;
                    var api = {};
                    opts = opts || {};

                    if (timing) {
                        if (opts && !opts.simple) {
                            for (var k in timing) {
                                if (timing.hasOwnProperty(k)) {
                                    api[k] = timing[k];
                                }
                            }
                        }


                        // Time to first paint
                        if (api.firstPaint === undefined) {
                            // All times are relative times to the start time within the
                            // same objects
                            var firstPaint = 0;

                            // Chrome
                            if (window.chrome && window.chrome.loadTimes) {
                                firstPaint = window.chrome.loadTimes().firstPaintTime * 1000;
                                api.firstPaintTime = firstPaint - (window.chrome.loadTimes().startLoadTime * 1000);
                            }
                            // IE
                            else if (typeof window.performance.timing.msFirstPaint === 'number') {
                                firstPaint = window.performance.timing.msFirstPaint;
                                api.firstPaintTime = firstPaint - window.performance.timing.navigationStart;
                            }
                            // Firefox
                            // This will use the first times after MozAfterPaint fires
                            //else if (window.performance.timing.navigationStart && typeof InstallTrigger !== 'undefined') {
                            //    api.firstPaint = window.performance.timing.navigationStart;
                            //    api.firstPaintTime = mozFirstPaintTime - window.performance.timing.navigationStart;
                            //}
                            if (opts && !opts.simple) {
                                api.firstPaint = firstPaint;
                            }
                        }

                        // Total time from start to load
                        api.loadTime = timing.loadEventEnd - timing.navigationStart;
                        // Time spent constructing the DOM tree
                        api.domReadyTime = timing.domComplete - timing.domInteractive;
                        // Time consumed prepaing the new page
                        api.readyStart = timing.fetchStart - timing.navigationStart;
                        // Time spent during redirection
                        api.redirectTime = timing.redirectEnd - timing.redirectStart;
                        // AppCache
                        api.appcacheTime = timing.domainLookupStart - timing.fetchStart;
                        // Time spent unloading documents
                        api.unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart;
                        // DNS query time
                        api.lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart;
                        // TCP connection time
                        api.connectTime = timing.connectEnd - timing.connectStart;
                        // Time spent during the request
                        api.requestTime = timing.responseEnd - timing.requestStart;
                        // Request to completion of the DOM loading
                        api.initDomTreeTime = timing.domInteractive - timing.responseEnd;
                        // Load event time
                        api.loadEventTime = timing.loadEventEnd - timing.loadEventStart;
                    }

                    return api;
                },
                printTable: function(opts) {
                    var table = {};
                    var data = this.getTimes(opts);
                    Object.keys(data).sort().forEach(function(k) {
                        table[k] = {
                            ms: data[k],
                            s: +((data[k] / 1000).toFixed(2))
                        };
                    });
                },
                printSimpleTable: function() {
                    this.printTable({
                        simple: true
                    });
                }
            };

        if(cfg.ENVIRONMENT_LOCAL && cfg.ENVIRONMENT_DEBUG){
            timing.printSimpleTable(); // print the timings table on app startup
        }
        return timing;

    };

    function Logger() {
        var self           = this;
        var remoteDebugUrl = cfg.REMOTE_DEBUG_URL || "http://172.31.8.29/api/log";
        var stringUndefined = "UNKNOWN";
        this.methods       = {
            info: function (message) {
                var data = self.api.dataTransformer(message, 'info');

                if (cfg.REMOTE_DEBUG) {
                    self.api.post(data);
                }
            },

            error: function (message) {
                var data = self.api.dataTransformer(message, 'error');

                if (cfg.REMOTE_DEBUG) {
                    self.api.post(data);
                }
            },

            keydown: function (message) {
                var data = self.api.dataTransformer(message, 'keydown');

                if (cfg.REMOTE_DEBUG) {
                    self.api.post(data);
                }
            },

            keypress: function (message) {
                var data = self.api.dataTransformer(message, 'keypress');

                if (cfg.REMOTE_DEBUG) {
                    self.api.post(data);
                }
            },

            xhr: function (message) {
                var data = self.api.dataTransformer(message, 'xhr');

                if (cfg.REMOTE_DEBUG) {
                    self.api.post(data);
                }
            },
        };

        this.api = {
            dataTransformer: function (message, type) {
                // var callerName = arguments.callee.caller.arguments.callee.caller
                //     ? arguments.callee.caller.arguments.callee.caller.name
                //     : stringUndefined;

                return {
                    title  : typeof message === 'string' ? message : self.api.stringify(message),
                    content: self.api.stringify({
                        model: cfg.userData ? cfg.userData.device.deviceModel : stringUndefined,
                        user  : cfg.userData ? cfg.userData.accountId : stringUndefined,
                        customer  : cfg.userData ? cfg.userData.customerId : stringUndefined,
                        username   : cfg.userData ? cfg.userData.userName : stringUndefined,
                        callerSTBinfo : self.api.stringify(self.api.getSTBinfo()),
                        activeAppSection : cfg.App.ActiveSection
                        // callerName : callerName
                    }),
                    type   : type ? type : 'info'
                };
            },
            stringify: function (o) {
                var seen = [];
                return JSON.stringify(o, function(key, val) {
                    if (typeof val === "object") {
                        if (seen.indexOf(val) >= 0) {
                            return;
                        }
                        seen.push(val);
                    }
                    return val;
                });
            },
            getSTBinfo : function () {
                var result;
                $.ajax({
                    url : 'http://127.0.0.1:8080/api/EasterEgg?key=00001234',
                    method : "GET",
                    async : false
                }).done(function(response){
                    result = response;
                });
                return result;
            },
            get : function () {
                $.get(remoteDebugUrl, function (response) {
                    if (cfg.REMOTE_DEBUG_LOG_LEVEL > 2) {
                        console.info(JSON.parse(response));
                    }
                });
            },
            post: function (data) {
                var send = function () {
                    $.post(remoteDebugUrl, data)
                        .done(function (response) {
                            if (cfg.REMOTE_DEBUG_LOG_LEVEL > 2) {
                                console.info(response);
                            }
                        })
                        .fail(function (response) {
                            if (cfg.REMOTE_DEBUG_LOG_LEVEL > 0) {
                                console.error("Sending remote log failed ", response);
                            }
                        });
                };
                setTimeout(send, 1000);
            },
        };

        return {
            info    : this.methods.info,
            error   : this.methods.error,
            xhr     : this.methods.xhr,
            keypress: this.methods.keypress,
            keydown : this.methods.keydown,
            timings : new logWindowTimings(window)
        };
    }

    var bindEvents = function(){
        // window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
        //     var string = 'Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' ';
        //
        //     log.error(string);
        // };

        window.onoffline = function () {
            console.log(arguments);
        };

        window.online = function () {
            console.log(arguments);
        };

        window.onpaint = function () {
            console.log(arguments);
        };

        window.onkeypress = function (event) {
            var data = {
                eventCode : event.code,
                eventKey : event.key,
                pressedKey : event.keyCode,
                // targetAttributes : event.target.attributes,
                targetTagName : event.target.tagName,
                // sourceAttributes : event.srcElement.attributes,
                sourceTagName : event.srcElement.tagName,
            };
            // log.keypress(data);
        };

        window.onkeydown = function (event) {
            var data = {
                eventCode : event.code,
                eventKey : event.key,
                pressedKey : event.keyCode,
                // targetAttributes : event.target.attributes,
                targetTagName : event.target.tagName,
                // sourceAttributes : event.srcElement.attributes,
                sourceTagName : event.srcElement.tagName,
            };
            // log.keydown(data);
        };
    };

    bindEvents();
    var log = new Logger();
    return log;
});