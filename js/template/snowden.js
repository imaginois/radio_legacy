define(function (require) {
	'use strict';
	var dom = require('js/core/dom');
	var cfg = require('js/config');
	
	var tpl = new dom();

	var sectionConfig = {
		name : "Error",
		selector : 'div.snowden' + cfg.app.mainWrapperSelector + '.wrapper.clearfix',
	};

	var template = Q.defer();

	var methods = {
		show : function () {
			console.log("Error page show function called");

		},
		init : function snowdenMovieAsset() {
			return Q.all([tpl.c.sidebar()]).then(function (result) {
				var result = tpl.h(sectionConfig.selector, [
					  	// tpl.h.apply(tpl.h, result[0]),
						tpl.h('article.snowdenMovie.full', [
					  				tpl.h('iframe.trailer', { props : {
												width : "100%",
												height : "100%",
												scrolling : "no",
												src : "https://snowdenfilm.com/",
												frameborder : 0,
												allowfullscreen : undefined
											}

										}, { attrs : {
											frameborder : 0
										}})
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