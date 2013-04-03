//router.js

define([ 'util', 'backbone'], function (Util) {

    "use strict";

    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'page/:pageId/*params': 'loadPage',
            'page/:pageId': 'loadPage'

        },
        index: function () {
            console.log('index page');
            Backbone.history.navigate('page/dashboard/param1=testparam1;param2=testparam2', {trigger: true});
        },
        loadPage: function (pageId, params) {

            params = params || '';

            require(["pages/" + pageId], function (Page) {

                var model = new Page.Model(Util.paramsToObject(params));
                var page = new Page.View({
                    el: '#main',
                    model: model
                });
                page.render();


            });
        }
    });

    return Router;
});