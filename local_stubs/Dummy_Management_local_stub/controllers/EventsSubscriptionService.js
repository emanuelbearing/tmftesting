'use strict';

//Minimal Service with filtering (equality match only) and attribute selection
//Error Handing Need to define a global error hqndler
//Paging and Range based Iterator to be added
//Notification to be added add listener and implement hub

var util = require('util');

var uuid = require('node-uuid');

var mongoUtils = require('../utilities/mongoUtils')

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Mongo URL

// This is a global variable we'll use for handing the MongoDB client around
var mongodb;

var config = require('./config.json');

var argv = require('minimist')(process.argv);
var dbhost = argv.dbhost ? argv.dbhost: config.db_host;
const mongourl = config.db_prot + "://" + dbhost + ":" + config.db_port + "/" + config.db_name;
MongoClient.connect(mongourl, function (err, db) {

        if (err) {
            console.log(err);
        } else {
            mongodb = db.db("tmf");
        }
    }
);



exports.registerListener = function(req, res, next) {
  /**
   * Register a listener
   * Sets the communication endpoint address the service instance must use to deliver information about its health state, execution state, failures and metrics.
   *
   * data EventSubscriptionInput Data containing the callback endpoint to deliver the information
   * returns EventSubscription
   **/

  var args = req.swagger.params;

  var eventsSubscription = args.eventsSubscription.value;

  if (eventsSubscription.id == undefined) {
      eventsSubscription.id = uuid.v4();
  }

  var self = req.url + "/" + eventsSubscription.id;

  eventsSubscription.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create EventsSubscription"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('eventsSubscription');
            // Insert some documents
            collection.insert(eventsSubscription, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(eventsSubscription));
  var examples = {};
  examples['application/json'] = {
  "query" : "aeiou",
  "callback" : "aeiou",
  "id" : "aeiou"
  };
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
}

exports.unregisterListener = function(req, res, next) {
  /**
   * Unregister a listener
   * Resets the communication endpoint address the service instance must use to deliver information about its health state, execution state, failures and metrics.
   *
   * id String The id of the registered listener
   * no response value expected for this operation
   **/

    var id = String(req.swagger.params.id.value);

    MongoClient.connect(mongourl, function (err, db) {
      if (err) throw err;
      var query = {
        id: id
      };

      mongodb.collection('eventsSubscription').deleteOne(query, function(err, obj) {
        if (err) throw err;

        res.setHeader('Content-Type', 'application/json');

        if (obj.result.n == 1){
            res.statusCode = 204;
            res.end(JSON.stringify(obj));
        }

        if (obj.result.n == 0){
            error = {
                'code':   'ERR0001', 'message': 'Entry not found', 'description': 'provide a different id' , 'infoURL': '-'
            };
            res.statusCode = 404;
            res.end(JSON.stringify(error));
        }

        //db.close();

        });
    });
  var examples = {};
  examples['application/json'] = {
  "query" : "aeiou",
  "callback" : "aeiou",
  "id" : "aeiou"
  };
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }

}

