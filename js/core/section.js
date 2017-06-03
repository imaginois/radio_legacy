define([
	'js/config',
	'js/lib/flyd',
  	'js/core/dom',
  	'js/core/navigation',
	'js/helper/log'
], function (cfg, radio, dom, navigation, log) {
	'use strict'

	function Section () {
    	function init() {
			var tpl = (new dom()).dom;
			var container = $(cfg.app.mainContainerSelector);

			var vnode = tpl.h('div.main.wrapper.clearfix', [
			  	tpl.h('aside', [
			  		tpl.h('h3', ['That awkward Moment full movie'])
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
    	}

    	init();
	}
    
  return Section();
});