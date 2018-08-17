var Company = require("../models/company")
, writeResponse = require('../helpers/response').writeResponse
, dbUtils = require('../neo4j/dbUtils');

/**
* @swagger
* definition:
*   Genre:
*     type: object
*     properties:
*       id:
*         type: integer
*       name:
*         type: string
*/

/**
* @swagger
* /api/v0/companies:
*   get:
*     tags:
*     - companies
*     description: Returns all companies
*     summary: Returns all companies
*     produces:
*       - application/json
*     responses:
*       200:
*         description: A list of companies
*         schema:
*           type: array
*           items:
*             $ref: '#/definitions/Company'
*/
exports.list = function (req, res, next) {
Company.getAll(dbUtils.getSession(req))
  .then(response => writeResponse(res, response))
  .catch(next);
};

/**
* @swagger
* /api/v0/companies:
*   post:
*     tags:
*     - companies
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
  Company.create(dbUtils.getSession(req), req.body.id, req.body.companyName)
    .then(response => writeResponse(res, response))
    .catch(next);
  };
  
  