
/*
 * GET home page.
 */

var http = require('http');
var request = require('request');
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
//Connection URL. This is where your mongodb server is running.
var url = 'mongodb://hedau_akshay:Sanjose123@ds131041.mlab.com:31041/tryurl';

function addwww(url) {
   if (!url.startsWith("www")) {
      url = "www." + url;
   }
   return url;
}

function addhttp(url) {
   if (!url.startsWith("https")) {
      url = "http://" + url;
   }
   return url;
}

exports.getURL = function(req, res){
	var key = req.params.url;
	MongoClient.connect(url, function (err, db) {
		if (err) {
		    console.log('Unable to connect to the mongoDB server. Error:', err);
			json_responses = {"statusCode" : 400};
			res.send(json_responses);
		}else{
			db.collection("urls").find({"key" : { $in : [key]  } } ).toArray(function(err, items) {
		        console.log(items);
		        if(typeof items == 'undefined' || items.length == 0){
		        	console.log("No URL found");
		        }else{
		        	console.log(items[0].url);
		        	res.redirect(items[0].url);
		        }
			});
		}
	});
}

exports.tryURL = function(req, res){
	var text = "";
	var urlClient = req.param("url");
	console.log("tryURL1+ : "+req.param("url"));
	if (!urlClient.startsWith("https")) {
		urlClient = addwww(urlClient);	
		urlClient = addhttp(urlClient);	
	}
	urlClient = urlClient.trim();
	console.log(urlClient);
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < 5; i++ ){
	    text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	MongoClient.connect(url, function (err, db) {
		if (err) {
		    console.log('Unable to connect to the mongoDB server. Error:', err);
			json_responses = {"statusCode" : 400};
			res.send(json_responses);
		}else{
			db.collection("urls").find({"url" : { $in : [urlClient]  } } ).toArray(function(err, items) {
                console.log(items);
                if(typeof items == 'undefined' || items.length == 0){
                	console.log('Connection established to', url);
        		    var myobj = { "url": urlClient, "key": text };
        		    db.collection("urls").insertOne(myobj, function(err, res) {
        		      if (err) throw err;
        		      console.log("1 Record inserted");
        		      db.close();
        		    });
        			json_responses = {"statusCode" : 200, "data":text};
        			res.send(json_responses);
                }else{
        			json_responses = {"statusCode" : 200, "data":items};
        			res.send(json_responses);                	
                }
            });
			
		    
	    }
	});
}

exports.index = function(req, res){
	var text = "";
	MongoClient.connect(url, function (err, db) {
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  } else {
	    console.log('Connection established to', url);
	  }
	});
	res.render('index', { title: 'TryURL' });
};