var express = require('express')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var methodOverride = require('method-override')
var routes = require('./routes')
const passport = require('passport')

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var swaggerJSDoc = require('swagger-jsdoc')
var swaggerUi = require('swagger-ui-express')

var neo4jSessionCleanup = require('./middlewares/neo4jSessionCleanup')
var writeError = require('./helpers/response').writeError
require('./middlewares/jwt')

var app = express()
var api = express()
app.use(config.api_path, passport.authenticate('jwt', { session: false }), api)

var swaggerDefinition = {
  info: {
    title: 'Company API (Node/Express)',
    version: '1.0.0',
    description: 'API information about companies.'
  },
  host: 'localhost:3000',
  basePath: '/'
}

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js']
}

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// serve swagger
api.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// set api setup
api.use(logger('dev'))
api.use(express.json())
api.use(cookieParser())
api.use(express.urlencoded({ extended: false }))
api.use(methodOverride())

// enable CORS
api.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

// api custom middlewares:
api.use(neo4jSessionCleanup)

// api routes
api.get('/companies', routes.companies.list)
api.post('/companies', routes.companies.create)
api.put('/companies', routes.companies.update)
api.get('/companies/:companyId', routes.companies.getCompanyById)
api.delete('/companies/:companyId', routes.companies.remove)

// api error handler
api.use(function (err, req, res, next) {
  if (err && err.status) {
    writeError(res, err)
  } else next(err)
})

module.exports = app
