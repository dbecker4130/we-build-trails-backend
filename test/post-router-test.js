'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../model/user.js');
const Post = require('../model/post.js');

const testData = require('./lib/test-data.js');
const serverToggle = require('./lib/toggle-server.js');
const clearDB = require('./lib/clearDB.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = testData.exampleUser;
const examplePost = testData.examplePost;

describe('Post Routes', function() {
  before(done => {
    serverToggle.serverOn(server, done);
  });
  after(done => {
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
      examplePost.userID = this.tempUser._id.toString();
      return new Post(examplePost).save();
    })
    .then(post => {
      this.tempPost = post;
      done();
    })
    .catch(done);
  });
  afterEach(() => {
    delete examplePost.userID;
  });

  describe('POST: /api/post', () => {
    describe('with a VALID body', () => {
      it('should create a post', done => {
        request.post(`${url}/api/post`)
        .send(examplePost)
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
