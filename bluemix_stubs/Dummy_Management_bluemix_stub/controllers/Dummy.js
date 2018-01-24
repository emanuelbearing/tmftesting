'use strict';

var url = require('url');

var Dummy = require('./DummyService');

module.exports.createDummy = function createDummy (req, res, next) {
  Dummy.createDummy(req, res, next);
};

module.exports.deleteDummy = function deleteDummy (req, res, next) {
  Dummy.deleteDummy(req, res, next);
};

module.exports.listDummy = function listDummy (req, res, next) {
  Dummy.listDummy(req, res, next);
};

module.exports.patchDummy = function patchDummy (req, res, next) {
  Dummy.patchDummy(req, res, next);
};

module.exports.retrieveDummy = function retrieveDummy (req, res, next) {
  Dummy.retrieveDummy(req, res, next);
};

module.exports.updateDummy = function updateDummy (req, res, next) {
  Dummy.updateDummy(req, res, next);
};
