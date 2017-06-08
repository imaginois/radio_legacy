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
			return Q.all([components.stripeHeader(), components.stripeContent()]).then(function (result) {
					return result = ['section#'+id+'.clearfix', [
			  			h('header', result[0]),
			  			h('article', result[1]),
	  				]];
			});
		},
		stripeHeader : function (id) {
			return [ h('i.fa.fa-camera-retro fa-4x'), 'Keep Watching'];
		},
		stripeContent : function (id) {
			// console.log(provider.getContinueWatching());
			return provider.getContinueWatching().then(function (response) {
				var items = [], i;
				if (response) {
					for (i = 0; i < response.length; i++) {
						var img = response[i].poster;
						var title = response[i].title;
						var item = [];

						item.push(
									h('img.image', { props : {
												src : img
											} 
									}),
									h('div.poster-title', [title])
								);

						items.push(
									h('div.image-wrapper.s', item)
								);
					}
				}

				return items;
			});
		},
		sidebar : function (id) {
			return ['aside', [ h('h3', ['Snabbdom That awkward Moment full movie']) ]];
		},
	};

	function Dom () {
		this.tpl = snabbdom;
		this.patch = patch;
		this.h = h;
		this.c = components;
	}
    
    return Dom;
});