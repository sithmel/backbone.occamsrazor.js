var app = app || {};

$(function( $ ) {
	'use strict';
	
	app.validators.is_an_hashtag = occamsrazor.chain(app.validators.is_simple_text, function (s){
	    return s[0] === '#' || s[0] === '@';
	});
	
    app.AppView.prototype.newAttributes.add(app.validators.is_an_hashtag, function (s, callback){
        var out;
        window.app.searchTwitter({q: s}, function (t){
            $.each(t, function (index, tweet){
                callback({
				    title: tweet.text,
				    order: app.Todos.nextOrder(),
				    completed: false,
                    image: tweet.image,
                    name: tweet.name,
                    nickname: tweet.nickname
				});
                
            });
        });
        
    });
});
