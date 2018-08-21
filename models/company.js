var _ = require('lodash');
var Company = require('../models/neo4j/company');

var getAll = function (session, name, offset, limit) {

  // populate regex for searching
  let str1 = "(?i)";
  let str2 = ".*";
  if(name === undefined){
    name = str1.concat(str2);
  } else {
    name = str1.concat(name).concat(str2);
  }

  // set offset
  if(offset === undefined || Number.isInteger(offset)){
    offset = 0;
  }
  
  // set limt
  if(limit === undefined || Number.isInteger(limit)){
    limit = 10;
  }
  
  let query = "MATCH (c:Company) WHERE c.companyName =~ {name} RETURN c ORDER BY c.companyName SKIP {offset} LIMIT {limit}";
  return session.run(query, {
    name: name,
    offset: parseInt(offset),
    limit: parseInt(limit)
  })
  .then(_manyCompnaies);
};

var _manyCompnaies = function (result) {
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

var create = function (session, company) {
  return session.run('CREATE (c:Company{id: {id}, companyName: {name}}) RETURN c', {
      id: company.id,
      name: company.companyName
    })
    .then(results => {
      return new Company(results.records[0].get('c'));
    });
};

var update = function (session, company) {
  return session.run('MATCH (c:Company{id: {id}}) SET c.companyName = {name} RETURN c', {
      id: company.id,
      name: company.companyName
    })
    .then(_returnBySingleId);
}

var remove = function (session, id) {
  return session.run('MATCH (c:Company{id: {id}}) DELETE c', {
      id: id
    })
    .then(results => {
      return {
        message: 'Company has been removed.',
        status: 204
      };
    });
}

var getCompanyById = function (session, id) {
  return session.run('MATCH (c:Company{id: {id}}) RETURN c', {
      id: id
    })
    .then(_returnBySingleId);
}


module.exports = {
  getAll: getAll,
  create: create,
  update: update,
  remove: remove,
  getCompanyById: getCompanyById
};