// extracts just the data from the query results

var _ = require('lodash');

var Company = module.exports = function (_node) {
  _.extend(this, _node.properties);
  if(this.createdDate) {
    this.createdDate = new Date(this.createdDate.toString());
  }
  if(this.updatedDate) {
    this.updatedDate = new Date(this.updatedDate.toString());
  }
};