define(function (require) {
	'use strict';
	var tpl = new (require('js/core/dom'));
	var cfg = require('js/config');
	
	var sectionConfig = {
		name : "Home",
		selector : 'div.home' + cfg.app.mainWrapperSelector + '.wrapper.clearfix',
	};

	var template = tpl.h(sectionConfig.selector, [
		  	tpl.h.apply(tpl.h, tpl.c.sidebar()),
			tpl.h('article.stripes', [
		  		tpl.h.apply(tpl.h, tpl.c.stripe('continuewatching'))
			])
		]);

	var methods = {
		load : function () {
			console.log("Home page load function called");
		}
	}
    
    return {
    	dom : template,
    	f   : methods
    }
});