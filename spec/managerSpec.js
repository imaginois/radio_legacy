(function () {
  'use strict';
  define(['js/core/manager'], function (manager) {
    describe("Manager", function () {

      it("should be able to be instanced", function () {
      	var man = new manager();
      	console.log(man);
        expect(man).toEqual(jasmine.any(Object));
      });

    });
  });
}());
