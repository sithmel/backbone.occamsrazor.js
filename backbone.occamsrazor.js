/*
This modules enhances Backbone.js with occamsrazor.js
*/

(function (){

var window.BackboneOR = BackboneOR = {};

/*
Plugins entry points
*/

// get a model from a simple JSON object : BackboneOR.getModel(attrs, options)
BackboneOR.getModel = occamsrazor();

// get a view from a model or a collection
BackboneOR.getView = occamsrazor();

// get a view from: a model/collection, view, position
BackboneOR.getViewlet = occamsrazor();

// sync an object with an appropriate function 
BackboneOR.sync = occamsrazor();

// get a collection from the options
BackboneOR.getCollection = occamsrazor();

// register the events here
BackboneOR.Events = occamsrazor();


/*
BackboneOR Model
*/

BackboneOR.Model = Backbone.Model.extend({
    sync: BackboneOR.sync
});

/*
BackboneOR Collection 
*/

//Patch backbone.js collection for generating models using a factory function


Backbone.Collection.getModel = function (attrs, options){
    return new this.model(attrs, options);
};
Backbone.Collection.getModel._prepareModel: function(model, options) {
    options || (options = {});
    if (!(model instanceof Model)) {
        var attrs = model;
        options.collection = this;

        model = this.getModel(attrs, options);
//        model = new this.model(attrs, options);

        if (!model._validate(model.attributes, options)) model = false;
    } else if (!model.collection) {
        model.collection = this;
    }
  return model;
};


// replacing the boring factory function with a more exciting adapter registry
BackboneOR.Collection = Backbone.Collection.extend({
    getModel: BackboneOR.getModel,
    sync: BackboneOR.sync
});


/*
BackboneOR View (just the same as Backbone.View)
*/

BackboneOR.View = Backbone.View;

/*
BackboneOR Router (just the same as Backbone.Router)
*/

BackboneOR.Router = Backbone.Router;

/*
Add events to call an adapter
Collection events:
"add" (model, collection) — when a model is added to a collection.
"remove" (model, collection) — when a model is removed from a collection.
"reset" (collection) — when the collection's entire contents have been replaced.

Model events:
"change" (model, options) — when a model's attributes have changed.
"change:[attribute]" (model, value, options) — when a specific attribute has been updated.
"destroy" (model, collection) — when a model is destroyed.

Model + Collection:
"sync" (model, collection) — triggers whenever a model has been successfully synced to the server.
"error" (model, collection) — when a model's validation fails, or a save call fails on the server.

Router:
"route:[name]" (router) — when one of a router's routes has matched.

All:
"all" — this special event fires for any triggered event, passing the event name as the first argument.

Example:
BackboneOR.Events.add(function (evt, model, collection){
    alert('A very big model is removed from a collection');
}, [isRemoveEvt, isVeryBig, isAnything]);


*/

// TODO Verify: does it work attached to the main classes ?

BackboneOR.Model.on('all', function (){
    BackboneOR.Events.all.apply(null, arguments);
});

BackboneOR.Collection.on('all', function (){
    BackboneOR.Events.all.apply(null, arguments);
});

BackboneOR.Router.on('all', function (){
    BackboneOR.Events.all.apply(null, arguments);
});

BackboneOR.View.on('all', function (){
    BackboneOR.Events.all.apply(null, arguments);
});

/*
Defines a basic validator
*/

BackboneOR.validators = {};

var isAnything = occamsrazor.validator(function (obj){
    return true;
});

BackboneOR.validators.isAnything = isAnything;

/*
Pick a reasonable default for each adapter
*/

// get a model from a simple JSON object : BackboneOR.getModel(attrs)
BackboneOR.getModel.add(function (attrs, options){
    // returns a generic object
    return new BackboneOR.Model(attrs, options);
}, isAnything);

// get a view from a model or a collection
BackboneOR.getView.add(function (options){
    return new BackboneOR.View(options);
}, isAnything);
    
// get a view from: a model/collection, view, position
BackboneOR.getViewlet.add(function (options, view, position){
    return new BackboneOR.View(options);
}[isAnything, isAnything, isAnything]);

// sync an object with an appropriate function 
BackboneOR.sync.add(function (method, model, options){
    // use the default backbone sync
    return BackboneOR.sync(method, model, options);
}, [isAnything, isAnything]);

// get a collection from group of models
BackboneOR.getCollection.add(function (models, options){
    return new BackboneOR.Collection(models, options);
}, isAnything);


}());
