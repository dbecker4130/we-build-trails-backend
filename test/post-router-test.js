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
          expect(res.body.title).to.equal('post title');
          done();
        });
      });
    });

    describe('with an INVALID body', () => {
      it('should return a 400 bad request', done => {
        request.post(`${url}/api/post`)
        .send({})
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          expect(err.name).to.equal('Error');
          done();
        });
      });
    });

    describe('with NO TOKEN found', () => {
      it('should return 401 unauthorized', done => {
        request.post(`${url}/api/post`)
        .send(examplePost)
        .set({
          Authorization: `Bearer${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          expect(err.name).to.equal('Error');
          done();
        });
      });
    });


  });

  describe('GET: /api/post', () => {
    describe('with a VALID body', () => {
      it('should return all posts', done => {
        request.get(`${url}/api/post`)
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

    describe('with an INVALID path', () => {
      it('should return 404 not found', done => {
        request.get(`${url}/api/notpost`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with an INVALID token', () => {
      it('should return 401 unauthorized', done => {
        request.get(`${url}/api/post`)
        .set({
          Authorization: `Bearer${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('GET: /api/:userID/post', () => {
    describe('with a VALID body', () => {
      it('should return this users posts', done => {
        request.get(`${url}/api/${this.tempUser._id}/post`)
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

    describe('with an INVALID userID', () => {
      it('should return a 404 not found', done => {
        request.get(`${url}/api/userID/post`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('PUT: /api/post/:postID', () => {
    describe('with a valid body', () => {
      it('should return an updated post', done => {
        let updated = { title: 'new name' };

        request.put(`${url}/api/post/${this.tempPost._id}`)
        .send(updated)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('new name');
          done();
        });
      });
    });

    describe('with an INVALID postID', () => {
      it('should return 404 not found', done => {
        let updated = { title: 'new name' };

        request.put(`${url}/api/post/postID`)
        .send(updated)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('DELETE: /api/post/:postID', () => {
    describe('with a VALID body', () => {
      it('should delete a post', done => {
        request.delete(`${url}/api/post/${this.tempPost._id}`)
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

    describe('with an INVALID postID', () => {
      it('should return 404 not found', done => {
        request.delete(`${url}/api/post/postID`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });



});
