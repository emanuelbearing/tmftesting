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



exports.alarmClearbyID = function(req, res, next) {
  /**
   * alarmClearbyID
   * 
   *
   * alarmId String 
   * alarm Alarm  (optional)
   * returns alarm
   **/

}

exports.alarmCreate = function(req, res, next) {
  /**
   * alarmCreate
   * 
   *
   * alarm Alarm 
   * returns alarm
   **/

  var args = req.swagger.params;

  var alarm = args.alarm.value;

  if (alarm.id == undefined) {
      alarm.id = uuid.v4();
  }

  var self = req.url + "/" + alarm.id;

  alarm.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Alarm"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('alarm');
            // Insert some documents
            collection.insert(alarm, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(alarm));
}

exports.alarmDelete = function(req, res, next) {
  /**
   * alarmDelete
   * 
   *
   * alarmId String 
   * no response value expected for this operation
   **/

    var alarmId = String(req.swagger.params.alarmId.value);

    MongoClient.connect(mongourl, function (err, db) {
      if (err) throw err;
      var query = {
        id: alarmId
      };

      mongodb.collection('alarm').deleteOne(query, function(err, obj) {
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

exports.alarmGet = function(req, res, next) {
  /**
   * alarmGet
   * 
   *
   * alarmId String 
   * fields String  (optional)
   * returns alarm
   **/


  MongoClient.connect(mongourl, function (err, db) {
      assert.equal(null, err);
      var collection = mongodb.collection('alarm');
      var alarmId = String(req.swagger.params.alarmId.value);

      const query = {
          id: alarmId
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

exports.alarmPatch = function(req, res, next) {
  /**
   * alarmPatch
   * 
   *
   * alarmId String 
   * alarm Alarm 
   * returns alarm
   **/

  MongoClient.connect(mongourl, function (err, doc) {
     assert.equal(null, err);
     var collection = mongodb.collection('alarm');

     var alarm = req.swagger.params.alarm.value;
     var alarmId = String(req.swagger.params.alarmId.value);

     const query = {
         id: alarmId
     }

     var patchDoc = {
         $set: alarm
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

