define(function (require) {
	'use strict';
	var dom = require('js/core/dom');
	var cfg = require('js/config');
	
	var tpl = new dom();

	var sectionConfig = {
		name : "Error",
		selector : 'div.error' + cfg.app.mainWrapperSelector + '.wrapper.clearfix',
	};

	var template = Q.defer();

	var methods = {
		show : function () {
			console.log("Error page show function called");
		},
		init : function function_name(argument) {
			return Q.all([tpl.c.sidebar(), tpl.c.stripe('continuewatching')]).then(function (result) {
				var result = tpl.h(sectionConfig.selector, [
					  	tpl.h.apply(tpl.h, result[0]),
						tpl.h('article.stripes', [
					  		tpl.h.apply(tpl.h, result[1])
						])
					]);
				template.resolve({ data : result });
			});
		}
	};
    
	methods.init();

    return {
    	dom : template.promise,
    	f   : methods
    };
});