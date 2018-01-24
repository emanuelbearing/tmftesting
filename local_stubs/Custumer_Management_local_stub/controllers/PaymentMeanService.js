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



exports.paymentMeanCreate = function(req, res, next) {
  /**
   * paymentMeanCreate
   * 
   *
   * paymentMean PaymentMean 
   * returns PaymentMean
   **/

  var args = req.swagger.params;

  var paymentMean = args.paymentMean.value;

  if (paymentMean.id == undefined) {
      paymentMean.id = uuid.v4();
  }

  var self = req.url + "/" + paymentMean.id;

  paymentMean.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create PaymentMean"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('paymentMean');
            // Insert some documents
            collection.insert(paymentMean, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(paymentMean));
}

exports.paymentMeanDelete = function(req, res, next) {
  /**
   * paymentMeanDelete
   * 
   *
   * paymentMeanId String 
   * no response value expected for this operation
   **/

    var paymentMeanId = String(req.swagger.params.paymentMeanId.value);

    MongoClient.connect(mongourl, function (err, db) {
      if (err) throw err;
      var query = {
        id: paymentMeanId
      };

      mongodb.collection('paymentMean').deleteOne(query, function(err, obj) {
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

exports.paymentMeanFind = function(req, res, next) {
  /**
   * paymentMeanFind
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

      var collection = mongodb.collection('paymentMean');

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

exports.paymentMeanGet = function(req, res, next) {
  /**
   * paymentMeanGet
   * 
   *
   * paymentMeanId String 
   * fields String  (optional)
   * returns PaymentMean
   **/


  MongoClient.connect(mongourl, function (err, db) {
      assert.equal(null, err);
      var collection = mongodb.collection('paymentMean');
      var paymentMeanId = String(req.swagger.params.paymentMeanId.value);

      const query = {
          id: paymentMeanId
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

exports.paymentMeanPatch = function(req, res, next) {
  /**
   * paymentMeanPatch
   * 
   *
   * paymentMeanId String 
   * paymentMean PaymentMean 
   * returns PaymentMean
   **/

  MongoClient.connect(mongourl, function (err, doc) {
     assert.equal(null, err);
     var collection = mongodb.collection('paymentMean');

     var paymentMean = req.swagger.params.paymentMean.value;
     var paymentMeanId = String(req.swagger.params.paymentMeanId.value);

     const query = {
         id: paymentMeanId
     }

     var patchDoc = {
         $set: paymentMean
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

exports.paymentMeanUpdate = function(req, res, next) {
  /**
   * paymentMeanUpdate
   * 
   *
   * paymentMeanId String 
   * paymentMean PaymentMean 
   * returns PaymentMean
   **/

  MongoClient.connect(mongourl, function (err, doc) {
      assert.equal(null, err);
      var collection = mongodb.collection('paymentMean');

      var paymentMean = req.swagger.params.paymentMean.value;
      var paymentMeanId = String(req.swagger.params.paymentMeanId.value);

      const query = {
          id: paymentMeanId
      }

      var patchDoc = {
          $set: paymentMean
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

