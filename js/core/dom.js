define(function (require) {
	'use strict';

	var cfg = require('js/config');
	var snabbdom = require('vendor/snabbdom/dist/snabbdom');
	var patch = snabbdom.init([ // Init patch function with chosen modules 
	  require('vendor/snabbdom/dist/snabbdom-class').default, // makes it easy to toggle classes 
	  require('vendor/snabbdom/dist/snabbdom-props').default, // for setting properties on DOM elements 
	  require('vendor/snabbdom/dist/snabbdom-style').default, // handles styling on elements with support for animations 
	  require('vendor/snabbdom/dist/snabbdom-eventlisteners').default, // attaches event listeners 
	]);
	var h = require('vendor/snabbdom/dist/h').default; // helper function for creating vnodes 
	 

	function Dom () {
		this.tpl = snabbdom;
		this.patch = patch;
		this.h = h;
	}
    
    return Dom;
});