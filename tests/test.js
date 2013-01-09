

/*

*/
module("Heterogeneous collection", {
    setup: function (){
        while (localStorage.length) localStorage.removeItem(localStorage.key(0));

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
                return Math.round(Math.PI * r * r);
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


    },
    teardown: function (){
        // empty localstorage
//        while (localStorage.length) localStorage.removeItem(localStorage.key(0));
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


module("Heterogeneous views", {
    setup: function (){

        // remove fixtures

        $('#fixture').empty();

        /*
        validators
        */

        var hasWidth = function (obj){
                if (obj instanceof Backbone.Model){
                    return obj.has('width');
                }
                return 'width' in obj;
            },
            hasRadius = function (obj){
                if (obj instanceof Backbone.Model){
                    return obj.has('radius');
                }
                return 'radius' in obj;
            };

        /*
        models
        */

        this.Square = Backbone.Model.extend({
            getArea: function (){
                var w = this.get('width');
                return w*w;
            }
        });

        this.Circle = Backbone.Model.extend({
            getArea: function (){
                var r = this.get('radius');
                return Math.round(Math.PI * r * r);
            }
        });

        this.square = {width: 10};
        this.circle = {radius: 3};

        this.model = occamsrazor()
            .addConstructor(hasWidth, this.Square)
            .addConstructor(hasRadius, this.Circle);


        this.view =  occamsrazor()
            .addConstructor([null, hasRadius], Backbone.Occamsrazor.ItemView.extend({
                tagName:  'div',
                render: function (){
                    this.$el.html('The area of the circle is ' + this.model.getArea());
                    return this;
                    
                }
            }))
            .addConstructor([null, hasWidth], Backbone.Occamsrazor.ItemView.extend({
                tagName:  'div',
                render: function (){
                    this.$el.html('The area of the square is ' + this.model.getArea());
                    return this;
                }
            }));
    },
    teardown: function (){
    }
});

test("test square view", function() {
    var square = new this.model(this.square);
 
    ok(square instanceof this.Square, 'it is the right model');

    var view = this.view({}, square);

    view.render();

    $('#fixture').append(view.el);

    equals($('#fixture').html(), '<div>The area of the square is 100</div>', 'it is the right view')
});

test("test circle view", function() {
    var circle = new this.model(this.circle);
 
    ok(circle instanceof this.Circle, 'it is the right model');

    var view = this.view({}, circle);

    view.render();

    $('#fixture').append(view.el);
    equals($('#fixture').html(), '<div>The area of the circle is 28</div>', 'it is the right view')
});

module("Heterogeneous collection view", {
    setup: function (){

        // remove fixtures

        $('#fixture').empty();

        /*
        validators
        */

        var hasWidth = function (obj){
                if (obj instanceof Backbone.Model){
                    return obj.has('width');
                }
                return 'width' in obj;
            },
            hasRadius = function (obj){
                if (obj instanceof Backbone.Model){
                    return obj.has('radius');
                }
                return 'radius' in obj;
            };

        /*
        collection
        */

        this.ShapesCollection = Backbone.Occamsrazor.Collection.extend({
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

        this.Circle = Backbone.Model.extend({
            getArea: function (){
                var r = this.get('radius');
                return Math.round(Math.PI * r * r);
            }
        });

        this.square = {width: 10};
        this.circle = {radius: 3};

        /*
        add 3 kind of models to the collection
        */

        this.shapesCollection.model.addConstructor(hasWidth, this.Square);
        this.shapesCollection.model.addConstructor(hasRadius, this.Circle);


        /*
        collection view
        */

        this.shapesView = new Backbone.Occamsrazor.CollectionView({collection: this.shapesCollection, el: $('#fixture')});

        /*
        add 2 kind of "item view" to the collection view
        */

        this.shapesView.itemView.addConstructor([null, hasRadius], Backbone.Occamsrazor.ItemView.extend({
            tagName:  'div',
            render: function (){
                this.$el.html('The area of the circle is ' + this.model.getArea());
                return this;
                
            }
        }));

        this.shapesView.itemView.addConstructor([null, hasWidth], Backbone.Occamsrazor.ItemView.extend({
            tagName:  'div',
            render: function (){
                this.$el.html('The area of the square is ' + this.model.getArea());
                return this;
            }
        }));
    },
    teardown: function (){
    }
});

test("test trigger reset", function() {
    this.shapesCollection.reset([this.square, this.circle]);
    equals($('#fixture').html(), '<div>The area of the square is 100</div><div>The area of the circle is 28</div>', 'it is the right view')
});

test("test trigger add", function() {
    this.shapesCollection.add([this.square]);
    equals($('#fixture').html(), '<div>The area of the square is 100</div>', 'it is the right view')
    this.shapesCollection.add([this.circle]);
    equals($('#fixture').html(), '<div>The area of the square is 100</div><div>The area of the circle is 28</div>', 'it is the right view')
});

test("test trigger remove", function() {
    this.shapesCollection.reset([this.square, this.circle]);
    var m = this.shapesCollection.at(1);
    this.shapesCollection.remove(m);
    equals($('#fixture').html(), '<div>The area of the square is 100</div>', 'it is the right view')
});


