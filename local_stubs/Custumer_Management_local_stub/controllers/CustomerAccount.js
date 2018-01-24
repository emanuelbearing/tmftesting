'use strict';

var url = require('url');

var CustomerAccount = require('./CustomerAccountService');

module.exports.customerAccountCreate = function customerAccountCreate (req, res, next) {
  CustomerAccount.customerAccountCreate(req, res, next);
};

module.exports.customerAccountDelete = function customerAccountDelete (req, res, next) {
  CustomerAccount.customerAccountDelete(req, res, next);
};

module.exports.customerAccountFind = function customerAccountFind (req, res, next) {
  CustomerAccount.customerAccountFind(req, res, next);
};

module.exports.customerAccountGet = function customerAccountGet (req, res, next) {
  CustomerAccount.customerAccountGet(req, res, next);
};

module.exports.customerAccountPatch = function customerAccountPatch (req, res, next) {
  CustomerAccount.customerAccountPatch(req, res, next);
};

module.exports.customerAccountUpdate = function customerAccountUpdate (req, res, next) {
  CustomerAccount.customerAccountUpdate(req, res, next);
};
