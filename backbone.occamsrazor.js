/*
This modules enhances Backbone.js + Marionettejs with occamsrazor.js
*/

(function (Backbone){
/*
Plugins entry points
*/

Backbone.Occamsrazor = {};

// get a model from a simple Javascript object:
// Backbone.Occamsrazor.getModel(obj)
Backbone.Occamsrazor.getModel = occamsrazor();

// sync an object with an appropriate function 
Backbone.Occamsrazor.sync = occamsrazor().add(null, Backbone.sync);

/*
Backbone.Occamsrazor.Model
*/

Backbone.Occamsrazor.Model = Backbone.Model.extend({
    sync: Backbone.Occamsrazor.sync
});

/*
Backbone.occamsrazor.Collection 
*/

Backbone.Occamsrazor.Collection = Backbone.Collection.extend({
    // replacing the boring factory function with a more exciting adapter registry
    model: Backbone.Occamsrazor.getModel,
    sync: Backbone.Occamsrazor.sync
});

/*
Backbone.Occamsrazor.ItemView (a view for a single item)
*/

Backbone.Occamsrazor.ItemView = Backbone.Marionette.ItemView.extend({
  template: occamsrazor()
});





}(Backbone));
