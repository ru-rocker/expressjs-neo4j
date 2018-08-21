var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nconf = require('./config');
var methodOverride = require('method-override');
var routes = require('./routes');
var neo4jSessionCleanup = require('./middlewares/neo4jSessionCleanup');
var writeError = require('./helpers/response').writeError;

var app = express();
var api = express();
app.use(nconf.get('api_path'), api);

// set api setup
api.use(logger('dev'));
api.use(express.json());
api.use(cookieParser());
api.use(express.urlencoded({ extended: false }));
api.use(methodOverride());

//enable CORS
api.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//api custom middlewares:
api.use(neo4jSessionCleanup);

//api routes
api.get('/companies', routes.companies.list);
api.post('/companies', routes.companies.create);
api.put('/companies', routes.companies.update);
api.get('/companies/:companyId', routes.companies.getCompanyById);
api.delete('/companies/:companyId', routes.companies.remove);

//api error handler
api.use(function(err, req, res, next) {
  if(err && err.status) {
    writeError(res, err);
  }
  else next(err);
});


module.exports = app;
