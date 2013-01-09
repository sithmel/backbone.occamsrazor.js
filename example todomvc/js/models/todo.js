var app = app || {};

if(!app.validators){
    app.validators = {};
}

(function() {
	'use strict';


    if (!app.Todo){
        app.Todo = occamsrazor();
    }

    app.validators.isTodo = function (obj){
        if (obj instanceof Backbone.Model){
            return obj.has('title');
        }
        return 'title' in obj;
    };

	// Todo Model
	// ----------
	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Todo.addConstructor(app.validators.isTodo, Backbone.Model.extend({

		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false
		},

		// Toggle the `completed` state of this todo item.
		toggle: function() {
			this.save({
				completed: !this.get('completed')
			});
		}

	}));

}());
