define(['app', 'backbone'], function (app) {

    "use strict";

    var View = Backbone.View.extend({
        pageName: 'basePage',
        render: function () {
            this.$el.html(this.pageName + '\n' + JSON.stringify(this.model.toJSON()));
        }
    });

    var Model = Backbone.Model.extend({

    });

    return {
        View: View,
        Model: Model
    };
});