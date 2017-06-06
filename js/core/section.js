define([
	'js/config',
	'js/lib/flyd',
  	'js/core/dom',
  	'js/core/navigation',
	'js/helper/log',
], function (cfg, radio, dom, navigation, log) {
	'use strict'

	var tpl = new dom();
	var container = $(cfg.app.mainContainerSelector);

	var Section = {
		init : function () {
			var container = $(cfg.app.mainContainerSelector);

			var vnode = tpl.h('div#view.wrapper.clearfix', [
			  	tpl.h('aside', [
			  		tpl.h('h3', ['Snabbdom That awkward Moment full movie'])
		  		]),	
		  		tpl.h('article.stripes', [
		  			tpl.h('section#continuewatching.clearfix', [
				  		tpl.h('header', [tpl.h('i.fa.fa-camera-retro fa-4x'), 'Keep Watching']),
				  		tpl.h('article', [tpl.h('div.items',[
													tpl.h('div.image-wrapper', ['<img class="image" src="http://netflixlife.com/files/2015/05/inglourious-basterds-.jpg" alt="" />'])
												])]),
		  			]),
		  		]),
			]);
			// tpl.patch(container, vnode); 
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
	        	tpl.patch(container, section.dom);
	        	console.log(ctrl);
	        	console.log(section.f);
	        	section.f.load()
	        	log.info("Activating section", template, 'Section data: ', section);
        	});
        }
	};

	Section.init();

	return {
		activate : Section.activateSection
	};
});