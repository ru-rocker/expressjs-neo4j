var _ = require('lodash');
var Company = require('../models/neo4j/company');

var getAll = function (session) {
  return session.run('MATCH (c:Company) RETURN c')
    .then(_manyGenres);
};

var _manyGenres = function (result) {
  return result.records.map(r => new Company(r.get('c')));
};

var create = function (session, id, name) {
  return session.run('CREATE (c:Company{id: {id}, companyName: {name}}) RETURN c', {
      id: parseInt(id),
      name: name
    })
    .then(results => {
      return new Company(results.records[0].get('c'));
    });
};


module.exports = {
  getAll: getAll,
  create: create
};