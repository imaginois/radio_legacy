define(['js/config'], function (cfg) {
    "use strict";

    function KeyController() {
        this.bindKeyPresses= function () {
            if (true === cfg.LOCAL) {
                cfg.keyCode = cfg.KeySets['local'];
            } else {
                cfg.keyCode = cfg.KeySets['virtual'];
            }
        };

        this.keyToEvent = function (event) {
            return cfg.keyCode.filter(function (key) {
                return key.code === event.which;
            })
        };
    };

    return new KeyController();
});