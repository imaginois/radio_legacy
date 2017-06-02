define([
	'js/config',
  'js/core/manager',
	'js/helper/log'
], function (cfg, manager, log) {
	'use strict';
  
	function Router () {
      var routes = {};
      var el = $(cfg.app.mainContainerSelector);

      /**
       * The events object defines applicable event handlers
       * that can be attached to routes. 
       * @type {Object}
       */
      var events = {
        on: function (selector, evt, handler) {
          events.push([selector, evt, handler]);
        },
        refresh: function (listeners) {
          listeners.forEach(function (fn) { fn(); });
        }
      };
      window.addEventListener('hashchange', router);
      window.addEventListener('load', router);

      this.route = route;
      this.routes = routes;

      /**
       * Defines a new route. Attaches all applied event listeners
       * @param  {string} path       Route path
       * @param  {string} templateId Template to be used for that route
       * @param  {object} controller JS object to act as a controller for the given view 
       * @return {void}            [description]
       */
      function route (path, templateId, controller) {
      	var controller = controller || new Function();

        if (typeof templateId === 'function') {
          controller = templateId;
          templateId = null;
        }
        var listeners = [];
        Object.defineProperty(controller.prototype, '$on', {value: events.on});
        Object.defineProperty(controller.prototype, '$refresh', {value: events.refresh.bind(undefined, listeners)});
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

        if(url.indexOf('/') < 0) {
          url = '/' + url;
        }

        var route = routes[url] || routes['*']

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

	}
    
    return new Router();
});