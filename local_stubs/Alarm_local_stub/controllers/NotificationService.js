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



exports.alarmAckStateNotification = function(req, res, next) {
  /**
   * alarmAckStateNotification
   * 
   *
   * fields String  (optional)
   * returns alarmAckStateNotification
   **/

  var args = req.swagger.params;

  var notification = args.notification.value;

  if (notification.id == undefined) {
      notification.id = uuid.v4();
  }

  var self = req.url + "/" + notification.id;

  notification.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Notification"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('notification');
            // Insert some documents
            collection.insert(notification, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(notification));
}

exports.alarmChangeNotification = function(req, res, next) {
  /**
   * alarmChangeNotification
   * 
   *
   * fields String  (optional)
   * returns alarmChangeNotification
   **/

  var args = req.swagger.params;

  var notification = args.notification.value;

  if (notification.id == undefined) {
      notification.id = uuid.v4();
  }

  var self = req.url + "/" + notification.id;

  notification.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Notification"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('notification');
            // Insert some documents
            collection.insert(notification, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(notification));
}

exports.alarmClearedNotification = function(req, res, next) {
  /**
   * alarmClearedNotification
   * 
   *
   * fields String  (optional)
   * returns alarmClearedNotification
   **/

  var args = req.swagger.params;

  var notification = args.notification.value;

  if (notification.id == undefined) {
      notification.id = uuid.v4();
  }

  var self = req.url + "/" + notification.id;

  notification.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Notification"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('notification');
            // Insert some documents
            collection.insert(notification, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(notification));
}

exports.alarmCreateNotification = function(req, res, next) {
  /**
   * alarmCreateNotification
   * 
   *
   * fields String  (optional)
   * returns alarmCreateNotification
   **/

  var args = req.swagger.params;

  var notification = args.notification.value;

  if (notification.id == undefined) {
      notification.id = uuid.v4();
  }

  var self = req.url + "/" + notification.id;

  notification.href = req.headers.origin + self;

  // Use connect method to connect to the server
  MongoClient.connect(mongourl, function (err, db) {
          if (err) {
              console.log("Create Notification"+err);
          } else {
            assert.equal(null, err);

            // Get the documents collection
            var collection = mongodb.collection('notification');
            // Insert some documents
            collection.insert(notification, function (err, result) {
                assert.equal(err, null)
            });
            db.close();
          }
      }
  );

  res.setHeader('Content-Type', 'application/json');

  res.setHeader('Location', self);
  res.end(JSON.stringify(notification));
}

