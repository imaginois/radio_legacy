(function () {
  'use strict';
  define(['js/core/manager'], function (manager) {
	// beforeEach(function () {
	// 	var body = document.getElementsByTagName("body")[0];
	// 	var view = document.createElement('div');
	// 	view.setAttribute('id', 'view');
	// 	body.appendChild(view);
 //    	console.log(document.querySelector('#view'));
	// });

    describe("Manager", function () {
    	it("should be able to be instanced", function () {
      		var man = new manager();
        	expect(man).toEqual(jasmine.any(Object));
     	});

    });
  });
}());
