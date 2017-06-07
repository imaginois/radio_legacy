define(function (require) {
	'use strict';

	var cfg = require('js/config');
	var Provider = require('js/core/provider');
	var snabbdom = require('vendor/snabbdom/dist/snabbdom');
	var patch = snabbdom.init([ // Init patch function with chosen modules 
	  require('vendor/snabbdom/dist/snabbdom-class').default, // makes it easy to toggle classes 
	  require('vendor/snabbdom/dist/snabbdom-props').default, // for setting properties on DOM elements 
	  require('vendor/snabbdom/dist/snabbdom-style').default, // handles styling on elements with support for animations 
	  require('vendor/snabbdom/dist/snabbdom-eventlisteners').default, // attaches event listeners 
	]);
	var h = require('vendor/snabbdom/dist/h').default; // helper function for creating vnodes 
	
	var provider = new Provider();

	var components = {
		stripe : function (id) {
			return ['section#'+id+'.clearfix', [
		  			h('header', components.stripeHeader()),
		  			h('article', components.stripeContent()),
  				]];
		},
		stripeHeader : function (id) {
			return [ h('i.fa.fa-camera-retro fa-4x'), 'Keep Watching']
		},
		stripeContent : function (id) {
			console.log("provider", provider);
			provider.getContinueWatching();
			var items = [ 
							h('div.image-wrapper.s', [
								h('img.image', { props : {
											src : 'http://netflixlife.com/files/2015/05/inglourious-basterds-.jpg'
										} 
								}),
								h('div.poster-title', ['Lorem ipsum'])
							]),
							h('div.image-wrapper.s', [
								h('img.image', { props : {
											src : 'http://netflixlife.com/files/2015/05/inglourious-basterds-.jpg'
										} 
								}),
								h('div.poster-title', ['Lorem ipsum'])
							]),
						];
			return [ h('div.items', items)];
		},
		sidebar : function (id) {
			return ['aside', [ h('h3', ['Snabbdom That awkward Moment full movie']) ]];
		},
	} 

	function Dom () {
		this.tpl = snabbdom;
		this.patch = patch;
		this.h = h;
		this.c = components;
	}
    
    return Dom;
});