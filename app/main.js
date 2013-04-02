//main.js

require.config({
	appDir:'../',
	baseUrl:'',
	modules:[
		{name:'main'}
	]
})


require(['libs/underscore', 'libs/backbone'],function(){

	$('body').html(_.map([1,2,3,4,5],function(number){return number*number}).join('-----'));
})