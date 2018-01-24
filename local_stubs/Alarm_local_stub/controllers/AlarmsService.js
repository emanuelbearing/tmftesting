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



exports.ackAlarms = function(req, res, next) {
  /**
   * ackAlarms
   * 
   *
   * alarms Alarm 
   * returns alarm
   **/

  var args = req.swagger.params;

  var alarms = args.alarms.value;

  if (alarms.id == undefined) {
      alarms.id = uuid.v4();
  }

  var self = req.url + "/" + alarms.id;

  alarms.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Alarms"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('alarms');
            // Insert some documents
            collection.insert(alarms, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(alarms));
}

exports.alarmsFind = function(req, res, next) {
  /**
   * alarmsFind
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

      var collection = mongodb.collection('alarms');

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

exports.clearAlarmsCreate = function(req, res, next) {
  /**
   * clearAlarmsCreate
   * 
   *
   * alarms Alarm 
   * returns alarm
   **/

  var args = req.swagger.params;

  var alarms = args.alarms.value;

  if (alarms.id == undefined) {
      alarms.id = uuid.v4();
  }

  var self = req.url + "/" + alarms.id;

  alarms.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Alarms"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('alarms');
            // Insert some documents
            collection.insert(alarms, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(alarms));
}

exports.commentAlarmsCreate = function(req, res, next) {
  /**
   * commentAlarmsCreate
   * 
   *
   * alarms Alarm 
   * returns alarm
   **/

  var args = req.swagger.params;

  var alarms = args.alarms.value;

  if (alarms.id == undefined) {
      alarms.id = uuid.v4();
  }

  var self = req.url + "/" + alarms.id;

  alarms.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Alarms"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('alarms');
            // Insert some documents
            collection.insert(alarms, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(alarms));
}

exports.groupAlarmsCreate = function(req, res, next) {
  /**
   * groupAlarmsCreate
   * 
   *
   * alarms Alarm 
   * returns alarm
   **/

  var args = req.swagger.params;

  var alarms = args.alarms.value;

  if (alarms.id == undefined) {
      alarms.id = uuid.v4();
  }

  var self = req.url + "/" + alarms.id;

  alarms.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Alarms"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('alarms');
            // Insert some documents
            collection.insert(alarms, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(alarms));
}

exports.unAckAlarmsCreate = function(req, res, next) {
  /**
   * unAckAlarmsCreate
   * 
   *
   * alarms Alarm 
   * returns alarm
   **/

  var args = req.swagger.params;

  var alarms = args.alarms.value;

  if (alarms.id == undefined) {
      alarms.id = uuid.v4();
  }

  var self = req.url + "/" + alarms.id;

  alarms.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Alarms"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('alarms');
            // Insert some documents
            collection.insert(alarms, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(alarms));
}

exports.ungroupAlarmsCreate = function(req, res, next) {
  /**
   * ungroupAlarmsCreate
   * 
   *
   * alarms Alarm 
   * returns alarm
   **/

  var args = req.swagger.params;

  var alarms = args.alarms.value;

  if (alarms.id == undefined) {
      alarms.id = uuid.v4();
  }

  var self = req.url + "/" + alarms.id;

  alarms.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Alarms"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('alarms');
            // Insert some documents
            collection.insert(alarms, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(alarms));
}

