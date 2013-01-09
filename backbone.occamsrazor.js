/******************************************************************************
 *
 * backbone.occamsrazor.js
 * by Maurizio Lupo
 *
 * http://sithmel.blogspot.com
 * @sithmel
 * maurizio.lupo gmail com
 *
 * GPL license/MIT license
 * 9 Jan 2013
 *
 * version 0.1
 ******************************************************************************/

/*
This modules enhances Backbone.js using occamsrazor.js
It allows to use heterogeneous and pluggable collections.
*/

(function (Backbone){
"use strict";

Backbone.Occamsrazor = {};

/*
Backbone.Occamsrazor.Collection 

A collection for heterogeneous elements
*/

Backbone.Occamsrazor.Collection = Backbone.Collection.extend({
    // replacing the boring constructor function with a more exciting adapter registry
    model: occamsrazor()
});

/*
Backbone.Occamsrazor.ItemView

A very simple view for rendering a model (passed in the constructor)

don't forget to call Backbone.Occamsrazor.ItemView.prototype.initialize.call(this, [options])
if you override the initialize
*/

Backbone.Occamsrazor.ItemView = Backbone.View.extend({
    initialize : function (options, model){
        this.model = model;
        if(! this.model){
            throw new Error('Passing the model in the view is mandatory');
        }
    }
});

/*
Backbone.Occamsrazor.CollectionView

A very simple view that renders each item with an appropriate view
*/

Backbone.Occamsrazor.CollectionView = Backbone.View.extend({
    itemView: occamsrazor(),
    viewOptions: {},
    initialize: function (){
        this.children = {};
        this.initialEvents();
    },
    initialEvents: function (){
        if (this.collection){
          this.listenTo(this.collection, "add", this.addChildView);
          this.listenTo(this.collection, "remove", this.removeChildView);
          this.listenTo(this.collection, "reset", this.render);
        }
    },
    
    render: function (){
        _.each(this.children, function (view){
            view.remove();
        });

        this.children = {};

        var that = this;
        this.collection.each(function(item, index){
            var options = _.extend({index: index}, that.viewOptions);
            that.addChildView(item, that.collection, options);
        });
        return this;
    },
    

    addChildView: function (item, collection, options){
        var index;
        if (options && options.index){
            index = options.index;
        }
        else {
            index = collection.indexOf(item);
            if (index === -1){
                index = 0;
            }
        }

        var view = new this.itemView(options, item);
        view.render();

        this.children[item.cid] = view;
        this.addToView(view, index);
        
    },
    removeChildView: function (item, collection, options){
        this.children[item.cid].remove();
        delete this.children[item.cid];
    },

    addToView: function (view, index){
        var $children = this.$el.children();
        if ($children.length === 0 || $children.length >= index ){
            this.$el.append(view.el);
        }
        $children.eq(index).before(view.el);
    }

});

/*

You could extend Marionette.CollectionView in the same way:


var MyView = Backbone.Marionette.ItemView.extend({
  template: "#some-template",
    initialize : function (options, model){
        this.model = model;
    }
});


var MyCollectionView = Backbone.Marionette.CollectionView.extend({
  itemView: occamsrazor(),
  buildItemView: function(item, ItemViewType, itemViewOptions){
    var options = _.extend({model: item}, itemViewOptions);
    var view = new ItemViewType(options, item);
    return view;
  },  
});

*/


}(Backbone));
