//app.js
define(['backbone'],function () {
	var app = {
		root:'/',
        pageNode:$('#main')
	}

	return  _.extend(app, {

	}, Backbone.Events);
})