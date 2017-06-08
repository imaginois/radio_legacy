(function () {
  'use strict';
  define(['js/core/dom'], function (dom) {

    beforeEach(function () {
        var body = document.getElementsByTagName("body")[0];
        var view = document.createElement('div');
        view.setAttribute('id', 'view');
        body.appendChild(view);

        var continuewatching = document.createElement('div');
        continuewatching.setAttribute('id', 'continuewatching');
        view.appendChild(continuewatching);
      });

    describe("Testing dom object", function () {
    	it("should be able to be instanced", function () {
      		var tpl = new dom();
        	expect(tpl).toEqual(jasmine.any(Object));
     	});

      it("Should have sidebar component", function () {
          var tpl = new dom();
          var sidebar = tpl.c.sidebar();
          expect(sidebar).toEqual(jasmine.any(Object));
      });

      it("Should have stripe continuewatching component", function () {
          var tpl = new dom();
          var stripe = tpl.c.stripe('continuewatching');
          expect(stripe).toEqual(jasmine.any(Object));
      });

    });


  });
}());
