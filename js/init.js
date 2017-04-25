

require.config({
	waitSeconds: 60,
	urlArgs: function(id, url) {
        var args = 'v=1';
        if (url.indexOf('view.html') !== -1) {
            args = 'v=2'
        }

        return (url.indexOf('?') === -1 ? '?' : '&') + args;
    },
});

require([
    'config',
    'core/manager'
], function (cfg, manager) {

    var backstage = { test : "hmmmm"};
    var init = function () {
        return App = new manager();
    }

    if(cfg.LOCAL){
        with (backstage) {
            with (window) {
                init();
                // eval(App); 
            }
        }
    } else {
        init();
    }



                console.log(backstage);

});