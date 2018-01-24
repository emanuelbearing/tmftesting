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



exports.createDummy = function(req, res, next) {
  /**
   * Creates a 'Dummy'
   *
   * dummy Dummy_Create The Dummy to be created
   * returns Dummy
   **/

  var args = req.swagger.params;

  var dummy = args.dummy.value;

  if (dummy.id == undefined) {
      dummy.id = uuid.v4();
  }

  var self = req.url + "/" + dummy.id;

  dummy.href = req.headers.origin + self;

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
              console.log("Create Dummy"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('dummy');
            // Insert some documents
            collection.insert(dummy, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(dummy));
}

exports.deleteDummy = function(req, res, next) {
  /**
   * Deletes a 'Dummy' by Id
   *
   * id String Identifier of the Dummy
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

      mongodb.collection('dummy').deleteOne(query, function(err, obj) {
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
}

exports.listDummy = function(req, res, next) {
  /**
   * List or find 'Dummies' objects a
   *
   * fields String Comma separated properties to display in response (optional)
   * contains.abc String For filtering: abc   - the alphabet (optional)
   * contains.numberOfLetters Integer For filtering:  (optional)
   * aggreement.name String For filtering: Name of the agreement (optional)
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

      var collection = mongodb.collection('dummy');

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

exports.patchDummy = function(req, res, next) {
  /**
   * Updates partially a 'Dummy' by Id
   *
   * id String Identifier of the Dummy
   * dummy Dummy_Update The Dummy to be updated
   * returns Dummy
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
      function(err, doc) {
     assert.equal(null, err);
     var collection = mongodb.collection('dummy');

     var dummy = req.swagger.params.dummy.value;
     var id = String(req.swagger.params.id.value);

     const query = {
         id: id
     }

     var patchDoc = {
         $set: dummy
     }

     collection.update(query, patchDoc, function (err, doc) {
         assert.equal(err, null);
         //res.json(doc);
         // Find one document
         collection.findOne(query, function (err, doc) {
             res.setHeader('Content-Type', 'application/json');
             delete doc[ "_id"]
             res.end(JSON.stringify(doc));
         })
     })
   })
}

exports.retrieveDummy = function(req, res, next) {
  /**
   * Retrieves a 'Dummy' by Id
   *
   * id String Identifier of the Dummy
   * returns List
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
      var collection = mongodb.collection('dummy');
      var id = String(req.swagger.params.id.value);

      const query = {
          id: id
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

exports.updateDummy = function(req, res, next) {
  /**
   * Updates a 'Dummy' by Id
   *
   * id String Identifier of the Dummy
   * dummy Dummy_Update The Dummy to be updated
   * returns Dummy
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
      function(err, doc) {
      assert.equal(null, err);
      var collection = mongodb.collection('dummy');

      var dummy = req.swagger.params.dummy.value;
      var id = String(req.swagger.params.id.value);

      const query = {
          id: id
      }

      var patchDoc = {
          $set: dummy
      }

      collection.update(query, patchDoc, function (err, doc) {
          assert.equal(err, null);
          //res.json(doc);
          // Find one document
          collection.findOne(query, function (err, doc) {
              res.setHeader('Content-Type', 'application/json');
              delete doc[ "_id"]
              res.end(JSON.stringify(doc));
          })
      })
  })
}

