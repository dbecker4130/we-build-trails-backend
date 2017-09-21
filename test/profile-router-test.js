'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
// const mongoose = require('mongoose');
const User = require('../model/user.js');

const server = require('../server.js');
const serverToggle = require('./lib/toggle-server.js');
const clearDB = require('./lib/clearDB.js');
const testData = require('./lib/test-data.js');

const url = `http://localhost:${process.env.PORT}`;

// mongoose.Promise = Promise;

const exampleUser = testData.exampleUser;
const exampleImage = testData.exampleImage;

describe('Profile Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });
  afterEach(done => clearDB(done));
  beforeEach(done => {
    new User (exampleUser)
    .generatePasswordHash(exampleUser.password)
    .then(user => user.save())
    .then(user => {
      this.tempUser = user;
      return user.generateToken();
    })
    .then(token => {
      this.tempToken = token;
      exampleUser.userID = this.tempUser._id.toString();
      done();
    })
    .catch(done);
  });



  describe('POST: /api/profile/:userID/image', () => {
    describe('with a valid token and data', () => {

      it('should return an image', done => {
        request.post(`${url}/api/profile/${this.tempUser._id}/image`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .attach('image', exampleImage.image)
        .end((err, res) => {
          if (err) return done(err);
          this.tempImage = res.body;
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

  describe('PUT: /api/profile/:userID', () => {
    describe('with a valid Body', () => {


      it('should update the user', done => {
        let updated = { username: 'new name' };

        request.put(`${url}/api/profile/${this.tempUser._id}`)
        .send(updated)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.username).to.equal('new name');
          done();
        });
      });
    });
  });

  describe('GET: /api/profile/:userID', () => {
    describe('with a VALID body', () => {

      it('should return user data', done => {
        request.get(`${url}/api/profile/${this.tempUser._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });

});
