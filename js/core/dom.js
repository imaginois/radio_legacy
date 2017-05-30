define(function (require) {
	'use strict'

	var cfg = require('config');
	var snabbdom = require('bower_components/snabbdom/dist/snabbdom');
	var patch = snabbdom.init([ // Init patch function with chosen modules 
	  require('bower_components/snabbdom/dist/snabbdom-class').default, // makes it easy to toggle classes 
	  require('bower_components/snabbdom/dist/snabbdom-props').default, // for setting properties on DOM elements 
	  require('bower_components/snabbdom/dist/snabbdom-style').default, // handles styling on elements with support for animations 
	  require('bower_components/snabbdom/dist/snabbdom-eventlisteners').default, // attaches event listeners 
	]);
	var h = require('bower_components/snabbdom/dist/h').default; // helper function for creating vnodes 
	 

	function Dom () {
		this.dom = snabbdom;
		this.dom.patch = patch;
		this.dom.h = h;
	}
    
    return Dom;
});