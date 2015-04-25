var express = require('express');
var app = express();

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

// respond with "Hello World!" on the homepage
app.get('/', function (req, res) {
	if(collection){
		collection.find().toArray(function(err, results) { // callback arguments are err or an array of results
			res.send(results);
		});
	}
});

// accept POST request on the homepage
app.post('/', function (req, res) {
	res.send('Got a POST request');
});

// accept PUT request at /user
app.put('/user/:username', function (req, res) {
	var username = req.params.username;
	res.send('Hello, '+username);
});

// accept DELETE request at /user
app.delete('/user', function (req, res) {
	res.send('Got a DELETE request at /user');
});

var server = app.listen(8024, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

