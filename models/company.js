var _ = require('lodash');
var Company = require('../models/neo4j/company');
var dbUtils = require('../neo4j/dbUtils');
const neo4j = require('neo4j-driver').v1;

// response functions
var _manyCompanies = function (result) {
  return result.records.map(r => new Company(r.get('c')));
};

var _returnBySingleId = function (result) {
  let rec = result.records;
  if (rec.length == 0) {
    throw {
      message: 'Company is not found.',
      status: 404
    }
  }
  return new Company(rec[0].get('c'));
}

var _handlePayloadValidation = function (err) {
  let code = err.code;
  if (code === 'Neo.ClientError.Statement.ParameterMissing') {
    throw {
      message: err.message,
      status: 405
    }
  }
  throw err;
}

// API functions
var getAll = function (session, name, offset, limit) {

  // populate regex for searching
  let str1 = "(?i)";
  let str2 = ".*";
  if (name === undefined) {
    name = str1.concat(str2);
  } else {
    name = str1.concat(name).concat(str2);
  }

  // set offset
  if (offset === undefined || !Number.isInteger(offset)) {
    offset = 0;
  }

  // set limt
  if (limit === undefined || !Number.isInteger(limit)) {
    limit = 10;
  }

  let query = `MATCH (c:Company) 
               WHERE c.companyName =~ {name} 
               RETURN c 
               ORDER BY c.companyName 
               SKIP {offset} 
               LIMIT {limit}`;

  var readTxResultPromise = session.readTransaction(function (transaction) {

    // used transaction will be committed automatically, no need for explicit commit/rollback
    var result = transaction.run(query, {
      name: name,
      offset: parseInt(offset),
      limit: parseInt(limit)
    });
    return result;
  });

  return readTxResultPromise.then(_manyCompanies);
};

var create = function (session, company) {

  let query = 'CREATE (c:Company{id: {id}, companyName: {companyName}, createdDate: {createdDate}, updatedDate: {updatedDate}}) RETURN c';
  var writexResultPromise = session.writeTransaction(function (transaction) {

    // used transaction will be committed automatically, no need for explicit commit/rollback
    var result = transaction.run(query, {
      id: company.id,
      companyName: company.companyName,
      createdDate: company.createdDate,
      updatedDate: company.updatedDate
    });
    return result;
  });

  return writexResultPromise.then(_returnBySingleId).catch(_handlePayloadValidation);
};

var update = function (session, company) {
  let query = 'MATCH (c:Company{id: {id}}) SET c += { companyName: {companyName}, updatedDate: {updatedDate}} RETURN c';
  var writexResultPromise = session.writeTransaction(function (transaction) {

    // used transaction will be committed automatically, no need for explicit commit/rollback
    var result = transaction.run(query, {
      id: company.id,
      companyName: company.companyName,
      updatedDate: company.updatedDate
    });
    return result;
  });

  return writexResultPromise.then(_returnBySingleId).catch(_handlePayloadValidation);
}

var remove = function (session, id) {
  let query = 'MATCH (c:Company{id: {id}}) DELETE c';
  var writexResultPromise = session.writeTransaction(function (transaction) {

    // used transaction will be committed automatically, no need for explicit commit/rollback
    var result = transaction.run(query, {
      id: id
    });
    return result;
  });
  return writexResultPromise.then(results => {
    return {
      message: 'Company has been removed.'
    };
  });
}

var getCompanyById = function (session, id) {
  let query = 'MATCH (c:Company{id: {id}}) RETURN c';
  var readTxResultPromise = session.readTransaction(function (transaction) {

    // used transaction will be committed automatically, no need for explicit commit/rollback
    var result = transaction.run(query, {
      id: id
    });
    return result;
  });

  return readTxResultPromise.then(_returnBySingleId);

}

// Exports functions.
module.exports = {
  getAll: getAll,
  create: create,
  update: update,
  remove: remove,
  getCompanyById: getCompanyById
};