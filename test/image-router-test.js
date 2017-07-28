'use strict';

require('./lib/test-env.js');

const expect = require('chai').expect;
const request = require('superagent');

const Image = require('../model/image.js');
const User = require('../model/user.js');
const Post = require('../model/post.js');

const serverToggle = require('./lib/toggle-server.js');
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
      exampleImage.postID = this.tempPost._id.toString();
      return new Image(exampleImage).save();
    })
    .then( image => {
      this.tempImage = image;
      done();
    })
    .catch(done);
  });
  afterEach( () => {
    delete examplePost.userID;
    delete exampleImage.postID;
  });
  afterEach(done => clearDB(done));





  
});
