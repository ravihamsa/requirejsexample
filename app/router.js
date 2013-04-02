//router.js

define(['backbone'],function(){
	
	var Router = Backbone.Router.extend({
		routes:{
			'':'index',
			'page/:pageId/*params':'loadPage',
			'page/:pageId':'loadPage'

		},
		index:function(){
			console.log('index page');
			Backbone.history.navigate('page/test/param1=testparam1;param2=testparam2',{trigger:true});
		},
		loadPage:function(pageId, params){
			console.log(arguments);
			$('body').html(pageId + '00000000'+params);
		}
	});

	return Router;
});