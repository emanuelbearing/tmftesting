'use strict';

var url = require('url');

var Alarm = require('./AlarmService');

module.exports.alarmClearbyID = function alarmClearbyID (req, res, next) {
  Alarm.alarmClearbyID(req, res, next);
};

module.exports.alarmCreate = function alarmCreate (req, res, next) {
  Alarm.alarmCreate(req, res, next);
};

module.exports.alarmDelete = function alarmDelete (req, res, next) {
  Alarm.alarmDelete(req, res, next);
};

module.exports.alarmGet = function alarmGet (req, res, next) {
  Alarm.alarmGet(req, res, next);
};

module.exports.alarmPatch = function alarmPatch (req, res, next) {
  Alarm.alarmPatch(req, res, next);
};
