var app = app || {};

$(function( $ ) {
	'use strict';
	
	app.validators.is_simple_text = function (s){
	    return typeof s === 'string';
	};
	
    app.AppView.prototype.newAttributes.add(app.validators.is_simple_text, function (s, callback){
        callback({
			title: s,
			order: app.Todos.nextOrder(),
			completed: false
        });
        
    });
});
