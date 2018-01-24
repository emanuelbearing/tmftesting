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



exports.customerAccountCreate = function(req, res, next) {
  /**
   * customerAccountCreate
   * 
   *
   * customerAccount CustomerAccount 
   * returns CustomerAccount
   **/

  var args = req.swagger.params;

  var customerAccount = args.customerAccount.value;

  if (customerAccount.id == undefined) {
      customerAccount.id = uuid.v4();
  }

  var self = req.url + "/" + customerAccount.id;

  customerAccount.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create CustomerAccount"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('customerAccount');
            // Insert some documents
            collection.insert(customerAccount, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(customerAccount));
}

exports.customerAccountDelete = function(req, res, next) {
  /**
   * customerAccountDelete
   * 
   *
   * customerAccountId String 
   * no response value expected for this operation
   **/

    var customerAccountId = String(req.swagger.params.customerAccountId.value);

    MongoClient.connect(mongourl, function (err, db) {
      if (err) throw err;
      var query = {
        id: customerAccountId
      };

      mongodb.collection('customerAccount').deleteOne(query, function(err, obj) {
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

exports.customerAccountFind = function(req, res, next) {
  /**
   * customerAccountFind
   * 
   *
   * fields String  (optional)
   * returns List
   **/

  var args = req.swagger.params;

  MongoClient.connect(mongourl, function (err, db) {
        try {
          assert.equal(null, err);
      }
      catch (err) {
          console.log("Find "+err)
      }

      // Get the documents collection and filtering ?

      var collection = mongodb.collection('customerAccount');

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

exports.customerAccountGet = function(req, res, next) {
  /**
   * customerAccountGet
   * 
   *
   * customerAccountId String 
   * fields String  (optional)
   * returns CustomerAccount
   **/


  MongoClient.connect(mongourl, function (err, db) {
      assert.equal(null, err);
      var collection = mongodb.collection('customerAccount');
      var customerAccountId = String(req.swagger.params.customerAccountId.value);

      const query = {
          id: customerAccountId
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

exports.customerAccountPatch = function(req, res, next) {
  /**
   * customerAccountPatch
   * 
   *
   * customerAccountId String 
   * customerAccount CustomerAccount 
   * returns CustomerAccount
   **/

  MongoClient.connect(mongourl, function (err, doc) {
     assert.equal(null, err);
     var collection = mongodb.collection('customerAccount');

     var customerAccount = req.swagger.params.customerAccount.value;
     var customerAccountId = String(req.swagger.params.customerAccountId.value);

     const query = {
         id: customerAccountId
     }

     var patchDoc = {
         $set: customerAccount
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

exports.customerAccountUpdate = function(req, res, next) {
  /**
   * customerAccountUpdate
   * 
   *
   * customerAccountId String 
   * customerAccount CustomerAccount 
   * returns CustomerAccount
   **/

  MongoClient.connect(mongourl, function (err, doc) {
      assert.equal(null, err);
      var collection = mongodb.collection('customerAccount');

      var customerAccount = req.swagger.params.customerAccount.value;
      var customerAccountId = String(req.swagger.params.customerAccountId.value);

      const query = {
          id: customerAccountId
      }

      var patchDoc = {
          $set: customerAccount
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

