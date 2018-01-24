'use strict';

var url = require('url');

var Alarms = require('./AlarmsService');

module.exports.ackAlarms = function ackAlarms (req, res, next) {
  Alarms.ackAlarms(req, res, next);
};

module.exports.alarmsFind = function alarmsFind (req, res, next) {
  Alarms.alarmsFind(req, res, next);
};

module.exports.clearAlarmsCreate = function clearAlarmsCreate (req, res, next) {
  Alarms.clearAlarmsCreate(req, res, next);
};

module.exports.commentAlarmsCreate = function commentAlarmsCreate (req, res, next) {
  Alarms.commentAlarmsCreate(req, res, next);
};

module.exports.groupAlarmsCreate = function groupAlarmsCreate (req, res, next) {
  Alarms.groupAlarmsCreate(req, res, next);
};

module.exports.unAckAlarmsCreate = function unAckAlarmsCreate (req, res, next) {
  Alarms.unAckAlarmsCreate(req, res, next);
};

module.exports.ungroupAlarmsCreate = function ungroupAlarmsCreate (req, res, next) {
  Alarms.ungroupAlarmsCreate(req, res, next);
};
