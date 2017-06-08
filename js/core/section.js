define([
	'js/config',
	'js/lib/flyd',
  	'js/core/dom',
  	'js/core/navigation',
	'js/helper/log',
], function (cfg, radio, dom, navigation, log) {
	'use strict';

	var tpl = new dom();
	var container = $(cfg.app.mainWrapperSelector);

	var Section = {
		init : function () {
    		log.info('Section Init Finished', Date.now());
		},
		acquire : function () {
            var modules,
                first = arguments[0],
                arrayRequest = false,
                defer = Q.defer();

            if (Array.isArray(first)) {
                modules = first;
                arrayRequest = true;
            } else {
                modules = Array.prototype.slice.call(arguments, 0);
            }

            require(modules, function () {
                var args = arguments;

                setTimeout(function () {
                    if (args.length > 1 || arrayRequest) {
                        defer.resolve(Array.prototype.slice.call(args, 0));
                    } else {
                        defer.resolve(args[0]);
                    }
                }, 1);
            }, function (err) {
                defer.reject(err);
            });

            return defer.promise;
        },
        activateSection : function (template, ctrl) {
        	Section.acquire(template).then(function (section) {
        		container.innerHTML = '';
                section.dom.then(function (vnode) {
	        	  tpl.patch(container, vnode.data);
	        	  section.f.show();
                })
	        	log.info("Activating section", template, 'Section data: ', section);
        	});
        }
	};

	Section.init();

	return {
		activate : Section.activateSection
	};
});