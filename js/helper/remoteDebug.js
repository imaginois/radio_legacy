define([
    'js/config'
], function (cfg) {

    'use strict';
    function Logger() {
        var self           = this;
        var remoteDebugUrl = cfg.REMOTE_DEBUG_URL || "http://172.31.8.29/api/log";
        var stringUndefined= "UNKNOWN";
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
            info       : this.methods.info,
            error      : this.methods.error,
            xhr        : this.methods.xhr,
            keypress   : this.methods.keypress,
            keydown    : this.methods.keydown,
            timings    : new logWindowTimings(window),
            performance: new logPerformance(window),
        };
    }

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
                    console.table(table);
                },
                printSimpleTable: function() {
                    this.printTable({
                        simple: true
                    });
                }
            };

        if(cfg.LOCAL && cfg.DEBUG && cfg.DEBUG_LEVEL > 2){
            timing.printSimpleTable(); // print the timings table on app startup
        }
        return timing;
    };

    // performance.js
    // https://github.com/bgrins/devtools-snippets
    // Print out window.performance information.
    // https://developer.mozilla.org/en-US/docs/Navigation_timing

    var logPerformance = function () {

        var t = window.performance.timing;
        var lt = window.chrome && window.chrome.loadTimes && window.chrome.loadTimes();
        var timings = [];

        timings.push({
            label: "Time Until Page Loaded",
            time: t.loadEventEnd - t.navigationStart + "ms"
        });
        timings.push({
            label: "Time Until DOMContentLoaded",
            time: t.domContentLoadedEventEnd - t.navigationStart + "ms"
        });
        timings.push({
            label: "Total Response Time",
            time: t.responseEnd - t.requestStart + "ms"
        });
        timings.push({
            label: "Connection",
            time: t.connectEnd - t.connectStart + "ms"
        });
        timings.push({
            label: "Response",
            time: t.responseEnd - t.responseStart + "ms"
        });
        timings.push({
            label: "Domain Lookup",
            time: t.domainLookupEnd - t.domainLookupStart + "ms"
        });
        timings.push({
            label: "Load Event",
            time: t.loadEventEnd - t.loadEventStart + "ms"
        });
        timings.push({
            label: "Unload Event",
            time: t.unloadEventEnd - t.unloadEventStart + "ms"
        });
        timings.push({
            label: "DOMContentLoaded Event",
            time: t.domContentLoadedEventEnd - t.domContentLoadedEventStart + "ms"
        });
        if(lt) {
            if(lt.wasNpnNegotiated) {
                timings.push({
                    label: "NPN negotiation protocol",
                    time: lt.npnNegotiatedProtocol
                });
            }
            timings.push({
                label: "Connection Info",
                time: lt.connectionInfo
            });
            timings.push({
                label: "First paint after Document load",
                time: Math.ceil(lt.firstPaintTime - lt.finishDocumentLoadTime) + "ms"
            });
        }

        var navigation = window.performance.navigation;
        var navigationTypes = { };
        navigationTypes[navigation.TYPE_NAVIGATENEXT || 0] = "Navigation started by clicking on a link, or entering the URL in the user agent's address bar, or form submission.",
        navigationTypes[navigation.TYPE_RELOAD] = "Navigation through the reload operation or the location.reload() method.",
        navigationTypes[navigation.TYPE_BACK_FORWARD] = "Navigation through a history traversal operation.",
        navigationTypes[navigation.TYPE_UNDEFINED] = "Navigation type is undefined.",

        console.group("window.performance");

        console.log(window.performance);

        console.group("Navigation Information");
        console.log(navigationTypes[navigation.type]);
        console.log("Number of redirects that have taken place: ", navigation.redirectCount)
        console.groupEnd("Navigation Information");

        console.group("Timing");
        console.log(window.performance.timing);
        console.table(timings, ["label", "time"]);
        console.groupEnd("Timing");

        console.groupEnd("window.performance");

    };

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