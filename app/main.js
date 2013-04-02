//main.js

require.config({
	appDir:'',
	baseUrl:'app/',
	paths:{
		'backbone':'../libs/backbone',
		'underscore':'../libs/underscore'
	},
	shim:{
		'backbone':['underscore']
	},
	modules:[
		{name:'main'}
	]
})


require(['app', 'router'],function(app, Router){
	//$('body').html(_.map([1,2,3,4,5],function(number){return number*number}).join('-----'));
	
	app.router = new Router();

	Backbone.history.start({
		root:app.root
	});
})

