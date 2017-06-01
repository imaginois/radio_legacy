(function () {
  'use strict';
  define(['js/core/manager'], function (manager) {
    describe("Manager", function () {

      it("should be able to init", function () {
        expect(new manager()).toEqual(jasmine.any(Object));
      });

    });
  });
}());
