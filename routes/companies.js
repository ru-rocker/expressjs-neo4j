var Company = require("../models/company")
, writeResponse = require('../helpers/response').writeResponse
, dbUtils = require('../neo4j/dbUtils')
, uuidv1 = require('uuid/v1');


/**
* @swagger
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
*     responses:
*       200:
*         description: A list of companies
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/Company'
*/
exports.list = function (req, res, next) {
Company.getAll(dbUtils.getSession(req), req.query.companyName, req.query.offset, req.query.limit)
  .then(response => writeResponse(res, response))
  .catch(next);
};

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
*         description: Company object that needs to be added to the system
*         required: true
*         schema:
*           $ref: '#/definitions/Company'
*     responses:
*       '201':
*         description: Company created
*       '405':
*         description: Invalid input
*/
exports.create = function (req, res, next) {
  req.body.id = uuidv1();
  Company.create(dbUtils.getSession(req), req.body)
    .then(response => writeResponse(res, response))
    .catch(next);
  };
  
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
*     responses:
*       '400':
*         description: Invalid ID supplied
*       '404':
*         description: Company not found
*       '405':
*         description: Validation exception
*/
exports.update = function (req, res, next) {
  Company.update(dbUtils.getSession(req), req.body)
    .then(response => writeResponse(res, response))
    .catch(next);
  };

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
*       - name: api_key
*         in: header
*         required: false
*         type: string
*       - name: companyId
*         in: path
*         description: Company id to delete
*         required: true
*         type: string
*     responses:
*       '400':
*         description: Invalid ID supplied
*       '404':
*         description: Company not found
*/
exports.remove = function (req, res, next) {
  var id = req.params.companyId;
  Company.remove(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
  };

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
*     responses:
*       '200':
*         description: successful operation
*         schema:
*           $ref: '#/definitions/Company'
*       '404':
*         description: Company not found
*/
exports.getCompanyById = function (req, res, next) {
  var id = req.params.companyId;
  Company.getCompanyById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
  };