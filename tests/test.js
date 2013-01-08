/*
Build a very simple infrastructure
*/


/*

*/
module("Heterogeneous collection", {
    setup: function (){

        /*
        validators
        */

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

        /*
        collection
        */

        this.ShapesCollection = Backbone.Occamsrazor.Collection.extend({
            localStorage: new Backbone.LocalStorage("testcollection")
        });

        this.shapesCollection = new this.ShapesCollection;

        /*
        models
        */

        this.Square = Backbone.Model.extend({
            getArea: function (){
                var w = this.get('width');
                return w*w;
            }
        });

        this.Rectangle = Backbone.Model.extend({
            getArea: function (){
                var w = this.get('width'),
                    h = this.get('height');
                return w*h;
            }
        });

        this.Circle = Backbone.Model.extend({
            getArea: function (){
                var r = this.get('radius');
                return Math.PI * r * r;
            }
        });

        this.rect = {width: 10, height: 5};
        this.square = {width: 10};
        this.circle = {radius: 3};


        /*
        add 3 kind of models to the collection
        */

        this.shapesCollection.model.addConstructor(hasWidth, this.Square);
        this.shapesCollection.model.addConstructor(hasWidthHeight, this.Rectangle);
        this.shapesCollection.model.addConstructor(hasRadius, this.Circle);


        /*
        add 3 objects to the collection
        */

        this.shapesCollection.add([this.rect, this.square, this.circle]);


        /*
        collection view
        */

        this.shapesView = new Backbone.Occamsrazor.CollectionView({collection: this.shapesCollection, el: $('#fixture')});

        /*
        add 3 kind of "item view" to the collection view
        */


        this.shapesView.itemView.addConstructor([null, hasRadius], Backbone.Occamsrazor.ItemView.extend({
            tagName:  'div',
            render: function (){
                this.$el.html('The area of the circle is ' + this.model.getArea());
                return this;
                
            }
        }));

        this.shapesView.itemView.addConstructor([null, hasWidthHeight], Backbone.Occamsrazor.ItemView.extend({
            tagName:  'div',
            render: function (){
                this.$el.html('The area of the square is ' + this.model.getArea());
                return this;
            }
        }));

        this.shapesView.itemView.addConstructor([null, hasWidth], Backbone.Occamsrazor.ItemView.extend({
            tagName:  'div',
            render: function (){
                this.$el.html('The area of the rectangle is ' + this.model.getArea());
                return this;
            }
        }));

    },
    teardown: function (){
        // empty localstorage
        while (localStorage.length) localStorage.removeItem(localStorage.key(0));
    }
});

test("Test add collection", function() {
    ok(this.shapesCollection.at(0) instanceof this.Rectangle,'shape 1 is a rectangle');
    ok(this.shapesCollection.at(1) instanceof this.Square,'shape 2 is a square');
    ok(this.shapesCollection.at(2) instanceof this.Circle,'shape 3 is a circle');
});

test("Test save and retrieve model collection", function() {
    this.shapesCollection.each(function (item){
        item.save();
    });
    this.shapesCollection.reset();
    ok(this.shapesCollection.length === 0,'the collection is empty');
    this.shapesCollection.fetch();
    ok(this.shapesCollection.length === 3,'the collection is full');
    
    ok(this.shapesCollection.at(0) instanceof this.Rectangle,'shape 1 is a rectangle');
    ok(this.shapesCollection.at(1) instanceof this.Square,'shape 2 is a square');
    ok(this.shapesCollection.at(2) instanceof this.Circle,'shape 3 is a circle');
});

test("Test view", function() {
//    this.shapesView.render();
//    ok(this.shapesCollection.at(0) instanceof this.Rectangle,'shape 1 is a rectangle');
});




