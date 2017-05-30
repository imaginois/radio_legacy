define([
	'config',
  'core/manager',
	'core/template',
	'helper/log'
], function (cfg, manager, template, log) {
	'use strict'

	function Router () {
      var routes = {};
      var events = [];
      var el = $(cfg.app.mainContainerSelector);
      var ctx = {
        on: function (selector, evt, handler) {
          events.push([selector, evt, handler]);
        },
        refresh: function (listeners) {
          listeners.forEach(function (fn) { fn(); });
        }
      };

      function route (path, templateId, controller) {
      	var controller = controller || new Function();

        if (typeof templateId === 'function') {
          controller = templateId;
          templateId = null;
        }
        var listeners = [];
        Object.defineProperty(controller.prototype, '$on', {value: ctx.on});
        Object.defineProperty(controller.prototype, '$refresh', {value: ctx.refresh.bind(undefined, listeners)});
        routes[path] = {templateId: templateId, controller: controller, onRefresh: listeners.push.bind(listeners)};
      }

      function forEachEventElement(fnName) {
        for (var i = 0, len = events.length; i < len; i++) {
          var els = el.querySelectorAll(events[i][0]);
          for (var j = 0, elsLen = els.length; j < elsLen; j++) {
            els[j][fnName].apply(els[j], events[i].slice(1));
          }
        }
      }

      function addEventListeners() {
        forEachEventElement('addEventListener');
      }

      function removeEventListeners() {
        forEachEventElement('removeEventListener');
      }

      function router () {
        el = el || $('#view');

        removeEventListeners();

        events = [];

        var url = location.hash.slice(1) || '/';

        var route = routes[url] || routes['error'];

        if (route && route.controller) {
          var ctrl = new route.controller();
          if (!el || !route.templateId) {
            return;
          }

          route.onRefresh(function () {
            removeEventListeners();
            // var html = template.tmpl(route.templateId, ctrl);
            // console.log(html)
            log.info("Route ", route.templateId, ctrl);
            addEventListeners();
          });

          ctrl.$refresh();
        }
      }

      window.addEventListener('hashchange', router);
      window.addEventListener('load', router);

      this.route = route;
      this.routes = routes;

	}
    
    return new Router();
});