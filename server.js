var express = require('express');
var mongodb = require('mongodb');
var request = require('request');
var Result = require('./classes/Result.js');

const GAPI_URL = "https://www.googleapis.com/customsearch/v1";
const GAPI_KEY = process.env.GSEARCH_API_KEY;
const GSEARCH_ID = process.env.GSEARCH_ID;
const MONGODB_URI = process.env.MONGODB_URI;

var collection;

var app = express();

mongodb.connect(MONGODB_URI, function(err, db) {
    if(err){
        console.log(err);
        throw err;
    }
    collection = db.collection('imgsearch');
    
});

app.get('/api/imgsrc/:searchquery', function(req, res){
    var query = req.params.searchquery;
    var offset = req.query.offset;
    var url = GAPI_URL + "?key=" + GAPI_KEY + "&cx=" + GSEARCH_ID +"&q=" + query + ((offset != null) ? "&start=" + offset : '' );
    console.log(url);
    collection.insertOne({term: query, when: new Date()});
    request(url, function(error, response, body){
        //console.log(body);
        body = JSON.parse(body);
        if(body.error){
            console.log(body.error);
            res.json(body.error.message);
            res.status(body.error.code).end();
            return;
        }
        var items = body.items;
        var length = items.length;
        console.log(length);
        var result = [];
        for(var i = 0; i < length; i++){
            var item = items[i];
            result.push(new Result(item.pagemap.imageobject[0].url, (item.pagemap.cse_thumbnail !== undefined) ? item.pagemap.cse_thumbnail[0].src : null, item.snippet, item.link));
        }
        res.json(result);
        res.end();
    });
    
});

app.get('/api/latest', function(req, res){
    collection.find({}, { _id: 0}).limit(10).toArray(function(err, arr){
        if(err){
            res.json(err);
            console.log(err);
        }else{
            res.json(arr);
        }
        
    });
    
});

app.listen(process.env.PORT || 8081);

