var Company = require('../models/company')
var writeResponse = require('../helpers/response').writeResponse
var dbUtils = require('../neo4j/dbUtils')
var uuidv1 = require('uuid/v1')

/**
* @swagger
* securityDefinitions:
*   Bearer:
*     type: apiKey
*     name: Authorization
*     in: header
*   api_key:
*     type: apiKey
*     name: client_id
*     in: header
* definition:
*   Company:
*     type: object
*     properties:
*       id:
*         type: string
*         description: Generated UUID.
*       companyName:
*         type: string
*         description: Company name.
*       createdDate:
*         type: string
*         format: date-time
*         description: Created Date. Auto populate while creating object.
*       updatedDate:
*         type: string
*         format: date-time
*         description: Updated Date. Auto populate while updating object.
*/

/**
* @swagger
* /api/v0/companies:
*   get:
*     tags:
*     - company
*     description: Returns all companies. Sorted by company name ASC.
*     summary: Returns all companies
*     produces:
*       - application/json
*     parameters:
*       - in: query
*         name: companyName
*         description: Company Name
*         schema:
*           type: string
*       - in: query
*         name: offset
*         description: Result offset. Default is 0.
*         schema:
*           type: integer
*           default: 0
*       - in: query
*         name: limit
*         description: Result limit. Default is 10.
*         schema:
*           type: integer
*           default: 10
*     security:
*       - Bearer: []
*       - api_key: []
*     responses:
*       200:
*         description: A list of companies
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/Company'
*       401:
*         description: Unauthorized. Need JWT.
*/
exports.list = function (req, res, next) {
  Company.getAll(dbUtils.getSession(req), req.query.companyName, req.query.offset, req.query.limit)
    .then(response => writeResponse(res, response))
    .catch(next)
}

/**
* @swagger
* /api/v0/companies:
*   post:
*     tags:
*     - company
*     description: ''
*     summary: Add a new company
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         name: body
*         description: Company object that needs to be added to the system. ID will be replaced by system.
*         required: true
*         schema:
*           $ref: '#/definitions/Company'
*     security:
*       - Bearer: []
*       - api_key: []
*     responses:
*       200:
*         description: Company created
*       401:
*         description: Unauthorized. Need JWT.
*       409:
*         description: Invalid payload
*/
exports.create = function (req, res, next) {
  let currentDate = dbUtils.getCurrentDate()
  req.body.id = uuidv1()
  req.body.createdDate = currentDate
  req.body.updatedDate = currentDate
  Company.create(dbUtils.getSession(req), req.body)
    .then(response => writeResponse(res, response))
    .catch(next)
}

/**
* @swagger
* /api/v0/companies:
*   put:
*     tags:
*      - company
*     summary: Update an existing company
*     description: ''
*     operationId: updateCompany
*     consumes:
*       - application/json
*     produces:
*       - application/json
*     parameters:
*       - in: body
*         name: body
*         description: Company object that needs to be updated to the system
*         required: true
*         schema:
*           $ref: '#/definitions/Company'
*     security:
*       - Bearer: []
*       - api_key: []
*     responses:
*       200:
*         description: Company updated
*       401:
*         description: Unauthorized. Need JWT.
*       404:
*         description: Company not found
*       409:
*         description: Invalid payload
*/
exports.update = function (req, res, next) {
  let currentDate = dbUtils.getCurrentDate()
  req.body.updatedDate = currentDate
  Company.update(dbUtils.getSession(req), req.body)
    .then(response => writeResponse(res, response))
    .catch(next)
}

/**
* @swagger
* /api/v0/companies/{companyId}:
*   delete:
*     tags:
*       - company
*     summary: Deletes a company
*     description: ''
*     operationId: deleteCompany
*     produces:
*       - application/json
*     parameters:
*       - name: companyId
*         in: path
*         description: Company id to delete
*         required: true
*         type: string
*     security:
*       - Bearer: []
*       - api_key: []
*     responses:
*       200:
*         description: Company deleted
*       401:
*         description: Unauthorized. Need JWT.
*       404:
*         description: Company not found
*/
exports.remove = function (req, res, next) {
  var id = req.params.companyId
  Company.remove(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next)
}

/**
* @swagger
* /api/v0/companies/{companyId}:
*   get:
*     tags:
*       - company
*     summary: Find company by ID
*     description: Returns a single company
*     operationId: getCompanyById
*     produces:
*       - application/json
*     parameters:
*       - name: companyId
*         in: path
*         description: ID of company to return
*         required: true
*         type: string
*     security:
*       - Bearer: []
*       - api_key: []
*     responses:
*       200:
*         description: successful operation
*         schema:
*           $ref: '#/definitions/Company'
*       401:
*         description: Unauthorized. Need JWT.
*       404:
*         description: Company not found
*/
exports.getCompanyById = function (req, res, next) {
  var id = req.params.companyId
  Company.getCompanyById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next)
}
