(function () {
  'use strict';
  define(['js/core/router', 'js/core/manager'], function (router, manager) {
    beforeEach(function () {
      var body = document.getElementsByTagName("body")[0];
      var view = document.createElement('div');
      view.setAttribute('id', 'view');
      body.appendChild(view);

      var continuewatching = document.createElement('div');
      continuewatching.setAttribute('id', 'continuewatching');
      body.appendChild(continuewatching);
    });


    describe("Router.js testing URL navigation", function () {
      it("should navigate to #/epg", function () {
        window.location.hash = '#epg';
        expect(router.router()).toBeTruthy();
      });

      it("should navigate to #/asset", function () {
        window.location.hash = '#asset'
        expect(router.router()).toBeTruthy();
      });


      it("should navigate to #/wrong", function () {
        window.location.hash = '#wrong'
        expect(router.router()).toBeTruthy();
      });

      it("should be able to implement a route without template", function () {
        router.route('/notemplate', function (){
          // console.log("Notemplate url");
        });
        window.location.hash = '#/notemplate';
        expect(router.router()).toBeTruthy();
      });
    });

    describe("Router.js testing clicks on elements", function () {
      it('should be able to click Continue Watching stripe', function () {
        window.location.hash = '#epg';
        router.router();
        // var spyEvent = spyOnEvent('#continuewatching', 'click');
        document.querySelector('#continuewatching').click();
        // expect('click').toHaveBeenTriggeredOn('#continuewatching');
        router.router();
      });
    });
  });
}());
