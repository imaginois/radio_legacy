(function () {
  'use strict';
  define(['js/core/http'], function (http) {
    
    function returnEmptyData () {
        return {
            posters: [],
            raw: []
        };
    };

    describe("Http requests", function () {

      it("Http.get() should return a promise object", function () {
          var raw, req = http.get('continueWatching', {
                showAdultContent: false
            }).then(function (response) {
                expect(response).toEqual(jasmine.any(Object));
                return {
                    raw: response
                };
            }, returnEmptyData);
          expect(req).toEqual(jasmine.any(Object));
      });


      it("Http.get() should work with no URL", function () {
          var raw, req = http.get().then(function (response) {
                return {
                    raw: response
                };
            }, returnEmptyData);
          expect(req).toEqual(jasmine.any(Object));
      });

      it("Http.post() should return a promise object", function () {
          var raw, req = http.post('continueWatching', {
                showAdultContent: false
            }).then(function (response) {
                expect(response).toEqual(jasmine.any(Object));
                return {
                    raw: response
                };
            }, returnEmptyData);
          expect(req).toEqual(jasmine.any(Object));
      });

      it("Http.post() should work with no params", function () {
          var raw, req = http.post('continueWatching').then(function (response) {
                return {
                    raw: response
                };
            }, returnEmptyData);
          expect(req).toEqual(jasmine.any(Object));
      });

    	it("Http.post() should work with no URL", function () {
      		var raw, req = http.post().then(function (response) {
                return {
                    raw: response
                };
            }, returnEmptyData);
        	expect(req).toEqual(jasmine.any(Object));
     	});

    });


  });
}());
