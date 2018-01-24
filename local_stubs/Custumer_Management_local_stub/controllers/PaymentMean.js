'use strict';

var url = require('url');

var PaymentMean = require('./PaymentMeanService');

module.exports.paymentMeanCreate = function paymentMeanCreate (req, res, next) {
  PaymentMean.paymentMeanCreate(req, res, next);
};

module.exports.paymentMeanDelete = function paymentMeanDelete (req, res, next) {
  PaymentMean.paymentMeanDelete(req, res, next);
};

module.exports.paymentMeanFind = function paymentMeanFind (req, res, next) {
  PaymentMean.paymentMeanFind(req, res, next);
};

module.exports.paymentMeanGet = function paymentMeanGet (req, res, next) {
  PaymentMean.paymentMeanGet(req, res, next);
};

module.exports.paymentMeanPatch = function paymentMeanPatch (req, res, next) {
  PaymentMean.paymentMeanPatch(req, res, next);
};

module.exports.paymentMeanUpdate = function paymentMeanUpdate (req, res, next) {
  PaymentMean.paymentMeanUpdate(req, res, next);
};
