(function () {
  'use strict';
  define(['js/core/manager'], function (manager) {
    describe("Manager", function () {

      it("should be able to be instanced", function () {
      	var man = new manager();
        expect(man).toEqual(jasmine.any(Object));
      });

    });
  });
}());
