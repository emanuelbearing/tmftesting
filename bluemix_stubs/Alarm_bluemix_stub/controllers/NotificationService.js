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

