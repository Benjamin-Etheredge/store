var express = require('express');
var app = express();

app.engine('.ejs', require('ejs').__express);

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//app.use(express.json());

var mongoClient = require('mongodb').MongoClient; // initializes the mongodb library and gets a client object


// callback that passes either an error or the db... just like in the mongo command client when we typed use <db>
var mongoClient = require('mongodb').MongoClient; // initializes the mongodb library and gets a client object

var collection;

// callback that passes either an error or the db... just like in the mongo command client when we typed use <db>

mongoClient.connect("mongodb://localhost:27017/store", function(err, db) { 

  if(!err) {

    /* sets the collection that we want to use... 
       if you want to use multiple collections, 
       you can initialize and use other variables
       e.g. collection2 = db.collection('<collection2>'); */
    collection = db.collection('store');


    console.log("We are connect to mongodb...");
	
     /* Now that we are connected,
        we can run our find command just
        like we would with db.collection.find()
        in the mongo command line client
        The .toArray, just send the data to 
        an array argument in the callback
        in this case the variable <results> */


  } // end if !err
}); // end mongo connect callback

//List all of our API instructions on home page
app.get('/store', function (req, res) {
	res.render('index.html.ejs');
});

//LIST ALL PRODUCTS
app.get('/store/all', function (req, res) {
	if(collection){
		collection.find().toArray(function(err, results) {
			res.send(results);
		});
	}
});

//LIST PRODUCT NAMES
app.get('/store/names', function (req, res) {
	if(collection){
		collection.distinct("name",function(err, results) {
			res.send(results);
		});
	}
});

//LIST PRODUCT CATEGORIES
app.get('/store/categories', function (req, res) {
	if(collection){
		collection.distinct("category",function(err, results) {
			res.send(results);
		});
	}
});

//LIST PRODUCT AISLES
app.get('/store/aisles', function (req, res) {
	if(collection){
		collection.distinct("aisle",function(err, results) {
			results = results.sort(function(a, b){return a-b});
			res.send(results);
		});
	}
});

//LIST PRODUCTS IN CATEGORY
app.get('/store/category/:category', function (req, res) {
	if(collection){
		var category = req.param('category');
		collection.find({'category':{$eq:category}}).toArray(function(err, results) {
			res.send(results);
		});
	}
});

//LIST PRODUCTS WITH NAME
app.get('/store/name/:name', function (req, res) {
	if(collection){
		var name = req.param('name');
		collection.find({'name':{$eq:name}}).toArray(function(err, results) {
			res.send(results);
		});
	}
});

//LIST PRODUCTS IN AISLE
app.get('/store/aisle/:compare/:aisle', function (req, res) {
	if(collection){
		var compare = req.param('compare');
		var aisle = Number(req.param('aisle'));
		if(compare == '='){
			collection.find({'aisle':{$eq:aisle}}).toArray(function(err, results) {
				res.send(results);
			});
		}
		else if(compare == '>'){
			collection.find({'aisle':{$gt:aisle}}).toArray(function(err, results) {
				res.send(results);
			});
		}
		else if(compare == '<'){
			collection.find({'aisle':{$lt:aisle}}).toArray(function(err, results) {
				res.send(results);
			});
		}
	}
});

//LIST PRODUCTS WITH PRICE
app.get('/store/price/:compare/:price', function (req, res) {
	if(collection){
		var compare = req.param('compare');
		var price = Number(req.param('price'));
		if(compare == '='){
			collection.find({'price':{$eq:price}}).toArray(function(err, results) {
				res.send(results);
			});
		}
		else if(compare == '>'){
			collection.find({'price':{$gt:price}}).toArray(function(err, results) {
				res.send(results);
			});
		}
		else if(compare == '<'){
			collection.find({'price':{$lt:price}}).toArray(function(err, results) {
				res.send(results);
			});
		}
	}
});

//LIST PRODUCTS WITH QUANTITY
app.get('/store/quantity/:compare/:quantity', function (req, res) {
	if(collection){
		var compare = req.param('compare');
		var quantity = Number(req.param('quantity'));
		if(compare == '='){
			collection.find({'quantity':{$eq:quantity}}).toArray(function(err, results) {
				res.send(results);
			});
		}
		else if(compare == '>'){
			collection.find({'quantity':{$gt:quantity}}).toArray(function(err, results) {
				res.send(results);
			});
		}
		else if(compare == '<'){
			collection.find({'quantity':{$lt:quantity}}).toArray(function(err, results) {
				res.send(results);
			});
		}
	}
});

//UPDATE PRODUCT by name
app.post('/store/update/name/:name', function (req, res) {
	if(collection){
		var name = req.param('name');
		var query = req.body;
		collection.update({'name':name},{$set:query},function(err, results) {
			res.send("Updated");
		});
	}
});

//UPDATE PRODUCT by category
app.post('/store/update/category/:category', function (req, res) {
	if(collection){
		var category = req.param('category');
		var query = req.body;
		collection.update({'category':category},{$set:query},{$multi:true},function(err, results) {
			res.send("Updated");
		});
	}
});

//UPDATE PRODUCT by price
app.post('/store/update/price/:price', function (req, res) {
	if(collection){
		var price = Number(req.param('price'));
		var query = req.body;
		collection.update({'price':{$eq:price}},{$set:query},{multi:true},function(err, results) {
			res.send("Updated");
		});
	}
});

//UPDATE PRODUCT by quantity
app.post('/store/update/quantity/:quantity', function (req, res) {
	if(collection){
		var quantity = Number(req.param('quantity'));
		var query = req.body;
		collection.update({'quantity':{$eq:quantity}},{$set:query},{multi:true},function(err, results) {
			res.send("Updated");
		});
	}
});

//UPDATE PRODUCT by aisle
app.post('/store/update/aisle/:aisle', function (req, res) {
	if(collection){
		var aisle = Number(req.param('aisle'));
		var query = req.body;
		collection.update({'aisle':{$eq:aisle}},{$set:query},{multi:true},function(err, results) {
			res.send("Updated");
		});
	}
});

//INSERT PRODUCT
app.put('/store/product', function (req, res) {
	if(collection){
		var name = req.body.name;
		var category = req.body.category;
		var price = req.body.price;
		var aisle = req.body.aisle;
		var quantity = req.body.quantity;
		collection.insert({'name':name,'category':category,'price':price,'aisle':aisle,'quantity':quantity}, function(err, records){
			res.send('Product inserted successfully');
		});
	}
});

//DELETE PRODUCT BY NAME
app.delete('/store/name/:name', function (req, res) {
	if(collection){
		var name = req.param('name');
		collection.remove({'name':{$eq:name}},function(err, results) {
			res.send("Deleted "+name);
		});
	}
});

//DELETE PRODUCT BY category
app.delete('/store/category/:category', function (req, res) {
	if(collection){
		var category = req.param('category');
		collection.remove({'category':{$eq:category}},function(err, results) {
			res.send("Deleted "+category);
		});
	}
});

//DELETE PRODUCT BY aisle
app.delete('/store/aisle/:aisle', function (req, res) {
	if(collection){
		var aisle = Number(req.param('aisle'));
		collection.remove({'aisle':{$eq:aisle}},function(err, results) {
			res.send("Deleted "+aisle);
		});
	}
});

var server = app.listen(8027, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

