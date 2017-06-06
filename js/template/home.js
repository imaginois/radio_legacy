define(function (require) {
	'use strict';

	var tpl = new (require('js/core/dom'));
	

	var template = tpl.h('div#view.wrapper.clearfix', [
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