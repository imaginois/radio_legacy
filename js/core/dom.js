define(function (require) {
	'use strict'

	var snabbdom = require('snabbdom');
	var patch = snabbdom.init([ // Init patch function with chosen modules 
	  require('snabbdom/modules/class').default, // makes it easy to toggle classes 
	  require('snabbdom/modules/props').default, // for setting properties on DOM elements 
	  require('snabbdom/modules/style').default, // handles styling on elements with support for animations 
	  require('snabbdom/modules/eventlisteners').default, // attaches event listeners 
	]);
	var h = require('snabbdom/h').default; // helper function for creating vnodes 
	 

	function Dom () {
		this.dom = snabbdom;
		this.dom.patch = patch;
		this.dom.h = h;
	}
    
    return new Dom();
});