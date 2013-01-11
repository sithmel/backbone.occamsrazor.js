var app = app || {};

if(!app.validators){
    app.validators = {};
}

(function() {
	'use strict';


    if (!app.Todo){
        app.Todo = occamsrazor();
    }

    app.validators.isTweet = function (obj){
        if (obj instanceof Backbone.Model){
            return obj.has('nickname');
        }
        return 'nickname' in obj;
    };

	// Tweet Model
	// ----------
	// Our basic **Tweet** model has `tweet`, `order`, `url` and `completed` attributes.
	app.Todo.addConstructor(app.validators.isTweet, Backbone.Model.extend({

		// Default attributes for the tweet
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false,
            image: '',
            name: 'anonymous',
            nickname: 'anonymous'
		},

		// Toggle the `completed` state of this todo item.
		toggle: function() {
			this.save({
				completed: !this.get('completed')
			});
		}

	}));



}());


