define(function (require) {
	'use strict';
	var dom = require('js/core/dom');
	var cfg = require('js/config');
	
	var tpl = new dom();

	var sectionConfig = {
		name : "Asset",
		selector : 'div.asset' + cfg.app.mainWrapperSelector + '.wrapper.clearfix',
	};

	var template = Q.defer();

	var methods = {
		show : function () {
			$('body').classList.add('houseOfCards');
			console.log("Asset page show function called");
		},
		init : function assetInfoInit() {
			return Q.all([tpl.c.stripe('continuewatching')]).then(function (result) {
				var result = tpl.h(sectionConfig.selector, [
						tpl.h('article.asset.full', [
					  		tpl.h('h1.title', 'House of cards'),
					  		tpl.h('div.cast', 'Starring: Kevin Spacey, Robin Wright, Kate Mara'),
					  		tpl.h('div.description', 'A ruthless politician will stop at nothing to conquer Washington, D.C., in this Emmy and Golden Globe-winning political drama. Their thirst for power is unquenchable. Crafting fake narratives and throwing away longtime allies are all part of the game for the Underwoods.'),
					  		tpl.h('iframe.trailer', { props : {
												width : "320",
												height : "240",
												src : "https://www.youtube.com/embed/b_NcYIfcVTA?controls=0&amp;showinfo=0&amp;autoplay=0",
												frameborder : 0,
												allowfullscreen : undefined
											}

										})
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