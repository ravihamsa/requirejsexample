define(['app','backbone'],function  (app) {




    var View = Backbone.View.extend({
        pageName:'basePage',
        render:function(){
            this.$el.html(this.pageName);
        }
    });

    var Model = Backbone.Model.extend({

    })

    return {
        View:View,
        Model:Model
    }
});