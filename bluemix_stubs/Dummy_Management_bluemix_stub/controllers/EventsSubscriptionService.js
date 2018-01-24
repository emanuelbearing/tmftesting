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



//This is copied from the tutorial
// Now lets get cfenv and ask it to parse the environment variable
var cfenv = require('cfenv');
var appenv = cfenv.getAppEnv();

// Within the application environment (appenv) there's a services object
var services = appenv.services;

// The services object is a map named by service so we extract the one for MongoDB
var mongodb_services = services["compose-for-mongodb"];

// This check ensures there is a services for MongoDB databases
assert(!util.isUndefined(mongodb_services), "Must be bound to compose-for-mongodb services");

// We now take the first bound MongoDB service and extract it's credentials object
var credentials = mongodb_services[0].credentials;

// Within the credentials, an entry ca_certificate_base64 contains the SSL pinning key
// We convert that from a string into a Buffer entry in an array which we use when
// connecting.
var ca = [new Buffer(credentials.ca_certificate_base64, 'base64')];

MongoClient.connect(credentials.uri, {
        mongos: {
            ssl: true,
            sslValidate: true,
            sslCA: ca,
            poolSize: 1,
            reconnectTries: 1
        }
    },
    function(err, db) {
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
  MongoClient.connect(credentials.uri, {
          mongos: {
              ssl: true,
              sslValidate: true,
              sslCA: ca,
              poolSize: 1,
              reconnectTries: 1
          }
      },
      function(err, db) {
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

    MongoClient.connect(credentials.uri, {
            mongos: {
                ssl: true,
                sslValidate: true,
                sslCA: ca,
                poolSize: 1,
                reconnectTries: 1
            }
        },
        function(err, db) {
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

