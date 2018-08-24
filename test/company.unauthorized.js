/* eslint-env mocha */

// During the test the env variable is set to test
// https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
process.env.NODE_ENV = 'test'

let Company = require('../models/company')
let dbUtils = require('../neo4j/dbUtils')
let app = require('../app')

// Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
chai.should()

chai.use(chaiHttp)

describe('Unauthorized Request', () => {
  let id = 'whatever'
  before((done) => {
    Company.removeAll(dbUtils.getSession({})).then(() => {
      done()
    })
  })
  describe('/GET companies', () => {
    it('it should not GET all the companies ', (done) => {
      chai.request(app)
        .get('/api/v0/companies')
        .end((_, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
  describe('/POST company', () => {
    it('it should not create a company', (done) => {
      let company = {
        companyName: 'ru-rocker corp'
      }
      chai.request(app)
        .post('/api/v0/companies')
        .send(company)
        .end((_, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
  describe('/PUT company', () => {
    it('it should update a company', (done) => {
      let company = {
        id: id,
        companyName: 'ru-rocker corporation'
      }
      chai.request(app)
        .put('/api/v0/companies')
        .send(company)
        .end((_, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
  describe('/GET company by ID', () => {
    it('it should not get a company by id', (done) => {
      chai.request(app)
        .get('/api/v0/companies/' + id)
        .end((_, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
  describe('/DELETE company by ID', () => {
    it('it should not delete a company by id', (done) => {
      chai.request(app)
        .delete('/api/v0/companies/' + id)
        .end((_, res) => {
          res.should.have.status(401)
          done()
        })
    })
  })
  after((done) => {
    Company.removeAll(dbUtils.getSession({})).then(() => {
      done()
    })
  })
})
