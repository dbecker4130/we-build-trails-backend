'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');

const Image = require('../model/image.js');
const User = require('../model/user.js');
const Post = require('../model/post.js');

const serverToggle = require('./lib/toggle-server.js');
const testData = require('./lib/test-data.js');
const clearDB = require('./lib/clearDB.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = testData.exampleUser;
const exampleImage = testData.exampleImage;
const examplePost = testData.examplePost;

let imageData = {};

describe('Image Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });
  after( done => {
    serverToggle.serverOff(server, done);
  });
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
      done();
    })
    .catch(done);
  });
  afterEach( done => {
    delete examplePost.userID;
    done();
  });
  afterEach(done => clearDB(done));

  // describe('POST: /api/post/:postID/image', () => {
  //   describe('with a VALID body', () => {
  //     it('should post an image to postID', done => {
  //       request.post(`${url}/api/post/${this.tempPost._id}/image`)
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`
  //       })
  //       .attach('image', exampleImage.image)
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.status).to.equal(200);
  //         expect(res.body.postID).to.equal(this.tempPost._id.toString());
  //         imageData = res.body;
  //         done();
  //       });
  //     });
  //   });
  // });

});
