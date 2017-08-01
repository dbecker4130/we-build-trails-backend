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
          expect(res.body.desc).to.equal('example comment');
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });
    describe('with an INVALID path', () => {
      it('should return 404 error', done => {
        request.post(`${url}/api/post/${this.tempPost._id}/note}`)
        .send(exampleComment)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        })
      })
    })
    describe('with a INVALID comment', () => {
      it('should return 400 error', done => {
        request.post(`${url}/api/post/${this.tempPost._id}/comment`)
        .send({})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('PUT: /api/post/:postID/comment/:commentID', () => {
    describe('with a VALID body', () => {
      it('should update a comment', done => {
        let updated = { desc: 'updated comment' };

        request.put(`${url}/api/post/${this.tempPost._id}/comment/${this.tempComment._id}`)
        .send(updated)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        })
      })
    })
  })

  describe('DELETE: /api/post/:postID/comment/:commentID', () => {
    describe('with a VALID body', () => {
      it('should delete a comment from a post', done => {
        request.delete(`${url}/api/post/${this.tempPost._id}/comment/${this.tempComment._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          expect(res.body).to.be.empty;
          done();
        });
      });
    });
  });
});
