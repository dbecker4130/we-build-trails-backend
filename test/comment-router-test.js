'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');

const User = require('../model/user.js');
const Comment = require('../model/comment.js');
const Post = require('../model/post.js');

const serverToggle = require('./lib/toggle-server.js');
const testData = require('./lib/test-data.js');
const clearDB = require('./lib/clearDB.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = testData.exampleUser;
const examplePost = testData.examplePost;
const exampleComment = testData.exampleComment;

describe('Comment Routes', function() {
  before(done => {
    serverToggle.serverOn(server, done);
  });
  after(done => {
    serverToggle.serverOff(server, done);
  });
  afterEach( done => clearDB(done));
  beforeEach( done => {
    new User(exampleUser)
    .generatePasswordHash(exampleUser.password)
    .then( user => user.save())
    .then( user => {
      this.tempUser = user;
      return user.generateToken();
    })
    .then( token => {
      this.tempToken = token;
      examplePost.userID = this.tempUser._id.toString();
      return new Post(examplePost).save();
    })
    .then( post => {
      this.tempPost = post;
      exampleComment.userID = this.tempUser._id.toString();
      exampleComment.postID = this.tempPost._id.toString();
      return new Comment(exampleComment).save()
    })
    .then( comment => {
      this.tempComment = comment;
      done();
    })
    .catch(done);
  })
  afterEach(() => {
    delete examplePost.userID;
    delete exampleComment.postID;
  });

  describe('POST: /api/post/:postID/comment', () => {
    describe('with a VALID body', () => {
      it('should create a comment', done => {
        request.post(`${url}/api/post/${this.tempPost._id}/comment`)
        .send(exampleComment)
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
