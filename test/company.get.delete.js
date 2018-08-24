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

let jwt = 'Bearer ' +
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
          '.eyJpc3MiOiJzY290Y2guaW8iLCJleHAiOjE1MzAwODE5MzgwLCJuYW1lIjoiQ2hyaXMgU2V2aWxsZWphIiwiYWRtaW4iOnRydWV9' +
          '.lprxmjM4TpncZXAl6cMAgn5m33rdkccyUcneHSi2ZKQ'

describe('Company', () => {
  let id = ''
  before((done) => {
    Company.removeAll(dbUtils.getSession({})).then(() => {
      done()
    })
  })
  describe('/GET companies (1)', () => {
    it('it should GET all the companies (1)', (done) => {
      chai.request(app)
        .get('/api/v0/companies')
        .set('Authorization', jwt)
        .end((_, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
          done()
        })
    })
  })
  describe('Create a company', () => {
    it('it should POST a company', (done) => {
      let company = {
        companyName: 'ru-rocker corp'
      }
      chai.request(app)
        .post('/api/v0/companies')
        .set('Authorization', jwt)
        .send(company)
        .end((_, res) => {
          id = res.body.id
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('createdDate')
          res.body.should.have.property('updatedDate')
          res.body.should.have.property('updatedDate').eql(res.body.createdDate)
          res.body.should.have.property('id')
          res.body.should.have.property('companyName').eql('ru-rocker corp')
          done()
        })
    })
  })
  describe('/GET company by ID', () => {
    it('it should get a company by id', (done) => {
      chai.request(app)
        .get('/api/v0/companies/' + id)
        .set('Authorization', jwt)
        .end((_, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('createdDate')
          res.body.should.have.property('updatedDate').to.equal(res.body.createdDate)
          res.body.should.have.property('id').eql(id)
          res.body.should.have.property('companyName').eql('ru-rocker corp')
          done()
        })
    })
  })
  describe('/GET companies (2)', () => {
    it('it should GET all the companies (2)', (done) => {
      chai.request(app)
        .get('/api/v0/companies')
        .set('Authorization', jwt)
        .end((_, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(1)
          done()
        })
    })
  })
  describe('/DELETE company by ID', () => {
    it('it should delete a company by id', (done) => {
      chai.request(app)
        .delete('/api/v0/companies/' + id)
        .set('Authorization', jwt)
        .end((_, res) => {
          res.should.have.status(200)
          res.body.should.have.property('message').eql('Company has been removed.')
          done()
        })
    })
  })
  describe('/GET companies (3)', () => {
    it('it should GET all the companies (3)', (done) => {
      chai.request(app)
        .get('/api/v0/companies')
        .set('Authorization', jwt)
        .end((_, res) => {
          res.should.have.status(200)
          res.body.should.be.a('array')
          res.body.length.should.be.eql(0)
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
