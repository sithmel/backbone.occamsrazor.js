backbone.occamsrazor.js
=======================

backbone.occamsrazor.js is an enhanced version of Backbone.js. It uses occamsrazor.js to enable collections formed by different models.
As a (positive) side effect the models and model views are now plugins.


Models and collections
----------------------
Let's start with a simple empty collection::

    var shapesCollection = new Backbone.Occamsrazor.Collection;

With classic backbone collection We should define the model of the objects contained.
With Backbone.Occamsrazor.Collection instead we tell to the collection what kind of model It could contain. But first of all we define some validator::

    var hasWidth = function (obj){
            if (obj instanceof Backbone.Model){
                return obj.has('width');
            }
            return 'width' in obj;
        },
        hasHeight = function (obj){
            if (obj instanceof Backbone.Model){
                return obj.has('height');
            }
            return 'height' in obj;
        },
        hasRadius = function (obj){
            if (obj instanceof Backbone.Model){
                return obj.has('radius');
            }
            return 'radius' in obj;
        },
        hasWidthHeight = occamsrazor.chain(hasWidth, hasHeight);

These validators take an object and returns a positive number if the object has a feature. 
In this case is convenient validate both a simple object and a Backbone model.
You can find other explanations about validators in the occamsrazor.js documentation (https://github.com/sithmel/occamsrazor.js).
Now we can add the models to our collection::

    shapesCollection.model.addConstructor(hasWidth, Backbone.Model.extend({
        getArea: function (){
            var w = this.get('width');
            return w*w;
        }
    }));

    shapesCollection.model.addConstructor(hasWidthHeight, Backbone.Model.extend({
        getArea: function (){
            var w = this.get('width'),
                h = this.get('height');
            return w*h;
        }
    }));

    shapesCollection.model.addConstructor(hasRadius, Backbone.Model.extend({
        getArea: function (){
            var r = this.get('radius');
            return Math.round(Math.PI * r * r);
        }
    }));

From now the collection can work with three kind of models transparently::

    shapesCollection.add([{width: 10, height: 5}, {width: 10}, {radius: 3}]);
    
    console.log(shapesCollection.at(0).getArea()); // 50
    console.log(shapesCollection.at(1).getArea()); // 100
    console.log(shapesCollection.at(2).getArea()); // 28
    
If we are not using a collection we can define a plugin entry point like this::

    var Model = occamsrazor();
    
and then we add the models plugins as usual::
    
    Model.addConstructor(hasWidth, Backbone.Model.extend({
        getArea: function (){
            var w = this.get('width');
            return w*w;
        }
    }));

    Model.addConstructor(hasWidthHeight, Backbone.Model.extend({
        getArea: function (){
            var w = this.get('width'),
                h = this.get('height');
            return w*h;
        }
    }));

    Model.addConstructor(hasRadius, Backbone.Model.extend({
        getArea: function (){
            var r = this.get('radius');
            return Math.round(Math.PI * r * r);
        }
    }));

Let's test::

    circle = new Model({radius: 3});
    circle.getArea(); // 28
    
Views
-----
If we use an heterogeneus collection we will surely need something analogous for the views.
We will probably need a different view for each model. This works almost the same as models. First we create a collection view::

    var shapesView = new Backbone.Occamsrazor.CollectionView({collection: shapesCollection, el: $('#myid')});

And then we add the views::

    shapesView.itemView.addConstructor([null, hasRadius], Backbone.Occamsrazor.ItemView.extend({
        tagName:  'div',
        render: function (){
            this.$el.html('The area of the circle is ' + this.model.getArea());
            return this;
            
        }
    }));

    shapesView.itemView.addConstructor([null, hasWidth], Backbone.Occamsrazor.ItemView.extend({
        tagName:  'div',
        render: function (){
            this.$el.html('The area of the square is ' + this.model.getArea());
            return this;
        }
    }));

    shapesView.itemView.addConstructor([null, hasWidthHeight], Backbone.Occamsrazor.ItemView.extend({
        tagName:  'div',
        render: function (){
            this.$el.html('The area of the rectangle is ' + this.model.getArea());
            return this;
        }
    }));

You should notice that we use Backbone.Occamsrazor.ItemView as view constructor function. This is nearly identical to Backbone.View: the only difference is in the way the model is passed to the costructor.
This emphasizes the fact that you must pass the model as argument and allows occamsrazor to pick the right view for a given model.

If you want to add a new contructor extending Backbone.Occamsrazor.ItemView don't forget to call Backbone.Occamsrazor.ItemView.prototype.initialize.call(this, [options]);

The same works even for a single model view::

    var Itemview = occamsrazor();
    
and the usual views plugins::

    ItemView.addConstructor([null, hasRadius], Backbone.Occamsrazor.ItemView.extend({
        tagName:  'div',
        render: function (){
            this.$el.html('The area of the circle is ' + this.model.getArea());
            return this;
            
        }
    }));

    ItemView.addConstructor([null, hasWidth], Backbone.Occamsrazor.ItemView.extend({
        tagName:  'div',
        render: function (){
            this.$el.html('The area of the square is ' + this.model.getArea());
            return this;
        }
    }));

    ItemView.addConstructor([null, hasWidthHeight], Backbone.Occamsrazor.ItemView.extend({
        tagName:  'div',
        render: function (){
            this.$el.html('The area of the rectangle is ' + this.model.getArea());
            return this;
        }
    }));
    
    
    
Dependencies
============
backbone 0.9.9
underscore 1.4.3
jquery > 1.4.2
occamsrazor 2.1


