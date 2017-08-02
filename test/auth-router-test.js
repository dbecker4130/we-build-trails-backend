'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const serverToggle = require('./lib/toggle-server.js');

mongoose.Promise = Promise;

const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const clearDB = require('./lib/clearDB.js');
const testData = require('./lib/test-data.js');
const exampleUser = testData.exampleUser;

describe('Auth Routes', function() {
  before(done => {
    serverToggle.serverOn(server, done);
  });

  after(done => {
    serverToggle.serverOff(server, done);
  });

  afterEach(done => clearDB(done));
  afterEach(() => {
    delete exampleUser._id;
  })

  describe('POST: /api/signup', function() {
    describe('with VALID body', function() {
      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

    describe('with BAD request', () => {
      it('should return a 400 error', done => {
        request.post(`${url}/api/signup`)
        .send({ username: 'invalid user' })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with NO body', () => {
      it('should return a 400 error', done => {
        request.post(`${url}/api/signup`)
        .send({})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('with an NOT FOUND route', () => {
      it('should return a 404 not found', done => {
        request.post(`${url}/api/bad-route`)
        .send(exampleUser)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('GET: /api/signin', () => {
    before(done => {
      let user = new User(exampleUser);
      user.generatePasswordHash(exampleUser.password)
      .then(user => user.save())
      .then(user => {
        this.tempUser = user;
        done();
      })
      .catch(done);
    });

    describe('with an AUTHENTICATED user', () => {
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('example name', '1234')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

    describe('with an INVALID username', () => {
      it('should return 401 unauthorized', done => {
        request.get(`${url}/api/signin`)
        .auth('examp name', '1234')
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('with an INVALID password', () => {
      it('should return a 401 unauthorized', done => {
        request.get(`${url}/api/signin`)
        .auth('example name', '987564')
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });



  });



});
