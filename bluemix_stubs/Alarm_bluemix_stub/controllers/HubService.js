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



exports.hubCreate = function(req, res, next) {
  /**
   * hubCreate
   * 
   *
   * hub Hub 
   * returns Hub
   **/

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

exports.hubDelete = function(req, res, next) {
  /**
   * hubDelete
   * 
   *
   * hubId String 
   * no response value expected for this operation
   **/

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

exports.hubFind = function(req, res, next) {
  /**
   * hubFind
   * 
   *
   * returns List
   **/

  var args = req.swagger.params;

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
        try {
          assert.equal(null, err);
      }
      catch (err) {
          console.log("Find "+err)
      }

      // Get the documents collection and filtering ?

      var collection = mongodb.collection('hub');

      // console.log(req)

      console.log(req.query);

      var queryToMongo = require('query-to-mongo')
      var query = queryToMongo(req.query)
      console.log(query)

      // Find some documents based on criteria plus attribute selection
      collection.find(query.criteria,
      mongoUtils.fieldFilter(args.fields.value)).toArray(function (err, docs) {
          assert.equal(err, null);
          console.log(docs);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(docs));
          //res.json( docs );
      });


  })
}

exports.hubGet = function(req, res, next) {
  /**
   * hubGet
   * 
   *
   * hubId String 
   * returns Hub
   **/


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
      assert.equal(null, err);
      var collection = mongodb.collection('hub');
      var hubId = String(req.swagger.params.hubId.value);

      const query = {
          id: hubId
      }

      collection.findOne(query, function (err, doc) {

          try {
          assert.equal(err, null);
          }
          catch (err) {

          console.log(err);

          res.statusCode = 500;
          var error = { };
          error = { 'code': 'ERR0001' , 'reason' : err , 'message:' : 'provide a different id' };
          res.end(JSON.stringify(error));
           }

          if (doc == null) {
              res.statusCode = 404;
              var error = {
              };
              error = {
                  'code':   'ERR0001', 'reason': 'not found', 'message:': 'provide a different id'
              };
              res.end(JSON.stringify(error));
          } else {
              res.setHeader('Content-Type', 'application/json');
              delete doc[ "_id"]

              res.end(JSON.stringify(doc));
          }
      })
  })
}

