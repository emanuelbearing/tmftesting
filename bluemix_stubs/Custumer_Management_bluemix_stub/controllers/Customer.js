'use strict';

var url = require('url');

var Customer = require('./CustomerService');

module.exports.customerCreate = function customerCreate (req, res, next) {
  Customer.customerCreate(req, res, next);
};

module.exports.customerDelete = function customerDelete (req, res, next) {
  Customer.customerDelete(req, res, next);
};

module.exports.customerFind = function customerFind (req, res, next) {
  Customer.customerFind(req, res, next);
};

module.exports.customerGet = function customerGet (req, res, next) {
  Customer.customerGet(req, res, next);
};

module.exports.customerPatch = function customerPatch (req, res, next) {
  Customer.customerPatch(req, res, next);
};

module.exports.customerUpdate = function customerUpdate (req, res, next) {
  Customer.customerUpdate(req, res, next);
};
