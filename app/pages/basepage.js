define(['backbone'],function  (argument) {
	
	
	var View = Backbone.View.extend({
		render:function(){
			this.$el.html('base view');
			return this;
		}
	});

	var Model = Backbone.Model.extend({
		defaults:{
			pageName:'base'
		}
	});


	var BasePage = {
		View:View,
		Model:Model
	};

	return _.extend(BasePage, {

	}, Backbone.Events);

});