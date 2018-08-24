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

describe('Update Company', () => {
  let id = ''
  describe('Populate a company', () => {
    it('Create a company', (done) => {
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
          res.body.should.have.property('updatedDate').eql(res.body.createdDate)
          res.body.should.have.property('id')
          res.body.should.have.property('companyName').eql('ru-rocker corp')
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
        .set('Authorization', jwt)
        .send(company)
        .end((_, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('createdDate')
          res.body.should.have.property('updatedDate').to.not.equal(res.body.createdDate)
          res.body.should.have.property('id').eql(id)
          res.body.should.have.property('companyName').eql('ru-rocker corporation')
          done()
        })
    })
  })
  describe('/PUT company with wrong payload', () => {
    it('it should not update a company with wrong payload', (done) => {
      let company = {
        id: id,
        x: 'ru-rocker corporation'
      }
      chai.request(app)
        .put('/api/v0/companies')
        .set('Authorization', jwt)
        .send(company)
        .end((_, res) => {
          res.should.have.status(409)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql('Expected parameter(s): companyName')
          done()
        })
    })
  })
  describe('/PUT company with wrong ID', () => {
    it('it should not update a company with wrong ID', (done) => {
      let company = {
        id: 'nonexistent',
        companyName: 'ru-rocker corporation'
      }
      chai.request(app)
        .put('/api/v0/companies')
        .set('Authorization', jwt)
        .send(company)
        .end((_, res) => {
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('message').eql('Company is not found.')
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
