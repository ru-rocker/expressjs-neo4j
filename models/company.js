var _ = require('lodash');
var Company = require('../models/neo4j/company');

var getAll = function (session) {
  return session.run('MATCH (c:Company) RETURN c')
    .then(_manyGenres);
};

var _manyGenres = function (result) {
  return result.records.map(r => new Company(r.get('c')));
};

var _returnBySingleId = function (result) {
  let rec = result.records;
  if(rec.length == 0){
    throw { message: 'Company is not found.', status: 404}
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

var update = function(session, company) {
  return session.run('MATCH (c:Company{id: {id}}) SET c.companyName = {name} RETURN c', {
    id: company.id,
    name: company.companyName
  })
  .then(_returnBySingleId);
}

var remove = function(session, id) {
  return session.run('MATCH (c:Company{id: {id}}) DELETE c', {
    id: id
  })
  .then(results => {
    return {message: 'Company has been removed.', status: 204};
  });
}

var getCompanyById = function(session, id) {
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