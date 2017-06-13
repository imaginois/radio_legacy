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
			return Q.all([
							components.stripeHeader(id), 
							components.stripeContent(id),
							components.stripeNav(id)
						]).then(function (result) {

					// append navigation elements
					result[1] = result[1].concat(result[2]);

					return ['section#'+id+'.clearfix', [
			  			h('header', result[0]),
			  			h('article.s', result[1])
	  				]];
			});
		},
		stripeHeader : function (id) {
			var headerIcon;
			switch (id) {
				case 'continuewatching' :
					headerIcon = 'i.fa.fa-camera-retro fa-4x';
					break;
				case 'newtitles' :
					headerIcon = 'i.fa fa-bell fa-4x';
					break;
				case 'alltitles' :
					headerIcon = 'i.fa fa-asterisk fa-4x';
					break;
			}
			return [ h(headerIcon), id];
		},
		stripeContent : function (id) {
			var getStripeData;

			switch (id) {
				case 'continuewatching' :
					getStripeData = provider.getContinueWatching();
					break;
				case 'newtitles' :
					getStripeData = provider.getNewTitles();
					break;
				case 'alltitles' :
					getStripeData = provider.getAllTitles();
					break;
			}

			return getStripeData.then(function (response) {
				var items = [], i;
				if (response) {
					for (i = 0; i < response.length; i++) {
						var img = response[i].poster;
						var title = response[i].title;
						var item = [];

						item.push(
									h('img.image', { props : { src : img } }),
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
		stripeNav : function (id) {
			return [ h('div.left.button-overlay', '<'),	h('div.right.button-overlay', '>') ];
		},
		sidebar : function (id) {
			return ['aside', [ 
						h('h3', ['Snabbdom That awkward Moment full movie']),
						h('p', [
							h('iframe', { props : {
												width : "100%",
												height : "300px",
												src : "https://www.youtube-nocookie.com/embed/ANZ2iX2w2H4?controls=0&amp;showinfo=0&amp;autoplay=0",
												frameborder : 0,
												allowfullscreen : undefined
											}

										})
							])

					]];
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