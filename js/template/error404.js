define(function (require) {
	'use strict';
	var dom = require('js/core/dom');
	var cfg = require('js/config');

	var tpl = new dom();
	
	var sectionConfig = {
		name : "Home",
		selector : 'div.home' + cfg.app.mainWrapperSelector + '.wrapper.clearfix',
	};

	var template = tpl.h(sectionConfig.selector, [
		  	tpl.h.apply(tpl.h, tpl.c.sidebar()),
			tpl.h('article.error', [
		  		'404 page not found'
			])
		]);

	var methods = {
		load : function () {
			console.log("404 page not found");
		}
	};
    
    return {
    	dom : template,
    	f   : methods
    };
});