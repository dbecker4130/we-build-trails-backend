'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Post = require('../model/post.js');
const server = require('../server.js');
const serverToggle = require('./lib/toggle-server.js');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const testData = require('./lib/test-data.js');
const exampleUser = testData.exampleUser;
const exampleImage = testData.exampleImage;
const examplePost = testData.examplePost;


describe('Image Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });
  after( done => {
    serverToggle.serverOff(server, done);
  });

  after(done => {
    Promise.all([
      User.remove({}),
      Post.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/post/:postID/image', () => {
    describe('with a VALID body', () => {

      before( done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          examplePost.userID = this.tempUser._id;
          return new Post(examplePost).save();
        })
        .then( post => {
          this.tempPost = post;
          exampleImage.userID = this.tempUser._id;
          exampleImage.postID = this.tempPost._id;
          done();
        })
        .catch(done);
      });
      after( done => {
        delete examplePost.userID;
        done();
      });

      it('should post an image to postID', done => {
        request.post(`${url}/api/post/${this.tempPost._id}/image`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', exampleImage.name)
        .attach('image', exampleImage.image)
        .end((err, res) => {
          if (err) return done(err);
          this.tempImage = res.body;
          expect(res.body.name).to.equal(exampleImage.name);
          done();
        });
      });
    });

    describe('with an INVALID path', () => {
      it('should return a 404 error', done => {
        request.post(`${url}/api/post/${this.tempPost._id}/pic`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .attach('image', exampleImage.image)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with a INVALID model', () => {
      it('should creare a 500 error', done => {
        request.post(`${url}/api/post/${this.tempPost._id}/image`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .attach('pic', exampleImage.image)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(500);
          done();
        });
      });
    });

    // describe('with a INVALID image', () => {
    //   it('should create a 400 error', done => {
    //     request.post(`${url}/api/posted/${this.tempPost._id}/image`)
    //     .set({
    //       Authorization: `Bearer ${this.tempToken}`
    //     })
    //     .attach()
    //     .end((err, res) => {
    //       expect(err).to.be.an('error');
    //       expect(res.status).to.equal(400);
    //       done();
    //     });
    //   });
    // });


  });

  describe('DELETE: /api/post/:postID/image/:imageID', () => {
    describe('with a VALID imageID', () => {
      it('should delete and return 204', done => {
        request.delete(`${url}/api/post/${this.tempPost._id}/image/${this.tempImage._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', exampleImage.name)
        .attach('image', exampleImage.image)
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
